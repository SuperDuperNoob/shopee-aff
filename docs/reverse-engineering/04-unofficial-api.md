# 04 — Unofficial Product Data API — Reverse Engineering Notes

## What is documented

`product-data-api.md` describes `https://data.addlivetag.com/product-data/product-data.php`, which is **not** official Shopee, but a caching proxy built by community.

Base facts from doc:

- GET/POST + CORS *
- Params: `item_id` (numeric) OR `url` (full Shopee URL or short link)
- Returns `productInfo` with price, sales, commission, isXtra, cap handling, priceStats, latestPriceHistory
- Cache 24h (`CACHE_DURATION`)
- Rate limits 300/min (API upstream), 2000/min (DB) per IP via Cloudflare/XFF/REMOTE_ADDR
- Commission calc: sellerCom no cap + ShopeeCom min(50000*userRate, price*0.045), sum = commission

## How this proxy was likely RE'd originally

 hypothesize steps original author took:

1. **Discover product endpoint**: Open Shopee affiliate dashboard, DevTools Network, search for `commission`, `productOffer`, observe XHR to Shopee's internal API (maybe `https://affiliate.shopee.vn/api/...` or `https://shopee.vn/api/v4/pdp/get_pc`)
2. **Find itemId extraction**: See Shopee product URLs patterns:
   - `https://shopee.vn/product/<shopId>/<itemId>`
   - `-i.<shopId>.<itemId>` in slug
   - `?item_id=` or `?itemId=`
   - Short links `s.shopee.vn/*` -> 302 -> final URL

3. **Commission reverse**: 
   - Look at JS that computes commission in page: `commission = price * rate` etc.
   - Observe Xtra flag, cap 50000 VND, 4.5% limit, tax.
   - Build formula: `sellerComFinal = price * sellerRate * userRate * (1 - tax)`
   - `shopeeComFinal = min(capRaw * userRate, price*0.045)`

4. **Caching layer**:
   - To avoid hitting Shopee 300/min limit, add MySQL with `itemId` PK, `lastUpdate` timestamp.
   - If `NOW() - lastUpdate < 24h`, return DB and save Shopee call.

5. **Price history**:
   - Extra tables: product_price_history, record daily min/max/avg, compute 7d/30d change.

## How you can RE further (lab)

### Lab 1: Replay Shopee's own product API

```bash
# In Chrome, open https://shopee.vn/product/38003654/1589295236
# DevTools -> Network filter "item" or "pdp" or "product"
# Find request like:
# https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654

# Copy as curl and try:
curl -s 'https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
  -H 'Referer: https://shopee.vn/' \
  -H 'x-api-source: pc' \
  | jq .data

# If blocked (403), add cookies from browser or use x-csrftoken, or use mobile API: 
# https://shopee.vn/api/v4/pdp/get_pc?shop_id=38003654&item_id=1589295236
```

### Lab 2: Short link expansion

The doc says short-link processing is restricted due to traffic. Recommended to expand client-side.

```php
<?php
function expandShortUrl(string $url): ?string {
  $ch=curl_init($url);
  curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER=>true, CURLOPT_FOLLOWLOCATION=>true, CURLOPT_MAXREDIRS=>15,
    CURLOPT_TIMEOUT=>15, CURLOPT_CONNECTTIMEOUT=>5,
    CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    CURLOPT_HTTPHEADER=>['Accept: text/html'],
  ]);
  curl_exec($ch); $final=curl_getinfo($ch,CURLINFO_EFFECTIVE_URL); curl_close($ch);
  return filter_var($final,FILTER_VALIDATE_URL)?$final:null;
}
var_dump(expandShortUrl('https://s.shopee.vn/4VU2IjQjPF'));
```

Note: Shopee may return interstitial HTML with JS redirect, not HTTP 302. Then you need to parse HTML for `product/\\d+/\\d+` regex as fallback.

### Lab 3: Commission calc verification

From `product-data-api.md` sample:

```json
"price":122200, "commission":21996, "sellerComFinal":16497, "shopeeComFinal":5499, "cap":50000
```

Check: seller+shopee = 16497+5499=21996 matches commission. Good.

Try to infer userRate if you know sellerRate:

Assume sellerRate 10%, userRate 50%, tax 10%?
Seller: 122200 * 0.10 * 0.50 * 0.90 = 5499 — but sample sellerCom 16497 higher, so sellerRate maybe 30%.

You can brute force formula by scraping many products with known rates from affiliate portal.

## Building your own clone

If you want to rebuild product-data.php from scratch:

1. **DB schema needed**:
   - `products(itemId PK, shopId, productName, shopName, price, sales, imageUrl, productLink, rating, commission, sellerComFinal, shopeeComFinal, isXtra, hasSellerCommission, hasShopeeCommission, cap, lastUpdate)`
   - `price_history(itemId, recordedDate, price, originalPrice, discountPercent, stockAvailable, ...)`
2. **Upstream fetch**: implement with Guzzle/curl, retry, rotate UA, handle Cloudflare challenge (may need `cf_clearance` or use headless browser as last resort).
3. **ItemId extraction**: port regex from doc's supported formats.
4. **Rate limiting**: use Redis `INCR` per IP with window, return 429 with `Retry-After`.
5. **Cache headers**: `Cache-Control: public, max-age=3600` for DB hits.

## Ethical note

Shopee's `/api/v4/` is not public. Use sparingly, cache aggressively, respect robots.txt and TOS. This doc's author already warns short-link server is under load — same will happen to your clone if you don't rate-limit.

## Postman collection usage

Import `Postman/*.json` into Postman:

- Environment has variables base_url, item_id, product_url.
- Run GET by item_id, then GET by URL, compare responses.
- Add tests: `pm.test("commission = seller+shopee", ...)`
- Fuzz: send `item_id=abc`, `item_id=999999999999`, `url=https://evil.com`, `url=https://shopee.vn.evil.com/product/1/1` to see validation.

```

