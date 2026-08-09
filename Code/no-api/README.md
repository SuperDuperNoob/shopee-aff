# Code/no-api — Generate Shopee affiliate links without AppID/Secret

> Only `affiliate_id` (L1) needed. Based on Shopee's official `an_redir` tracker
> — same commission as GraphQL `generateShortLink`, no Open API approval.

Full research: [`docs/without-appid-workarounds.md`](../../docs/without-appid-workarounds.md)

## Quick start

### Node.js (see `tools/generate-anredir-link.js`)
```bash
node ../../tools/generate-anredir-link.js --affiliate-id 14382300002 --url https://shopee.vn/product/38003654/1589295236 --sub-id tiktok
```

### PHP (see `an_redir.php` in this folder)
```php
require 'an_redir.php';
echo buildShopeeAffLink('https://shopee.vn/product/38003654/1589295236', '14382300002', ['tiktok','vid42']);
// → https://shope.ee/an_redir?origin_link=https%3A%2F%2Fshopee.vn%2Fproduct%2F38003654%2F1589295236&affiliate_id=14382300002&sub_id=tiktok-vid42
```

### Browser (no server)
Open `../../tools/an_redir-generator.html` → paste URL + affiliate_id → Generate → Copy.

## Why this works

Shopee documents `https://{domain}/an_redir?origin_link={ENCODED}&affiliate_id={ID}&sub_id={a-b-c}`
at `help.shopee.sg/portal/10/article/171184` (SG) / MY / PH equivalents. The redirector 302s to the product and sets `utm_source=an_<id>` + `uls_trackid` for the 7-day cookie — identical to `shp.ee` links minted via GraphQL.

You still need L1 (Shopee Affiliate Program approval) to get an `affiliate_id`. If you lack even that, use Involve Asia / ACCESSTRADE — they give you a deeplink as a network publisher with no Shopee direct account.

## When to still get AppID/Secret

- You need `productOfferV2` / `shopOfferV2` search, `conversionReport` / `validatedReport` pulls, or server-minted `shp.ee` short links at quota.
- Otherwise `an_redir` + `data.addlivetag.com` product data covers deal sites.
