# Shopee Product Data API

Retrieves Shopee product information and commission details. Product data is cached in the database for 24 hours before being refreshed.

**Base URL:** `https://data.addlivetag.com/product-data/product-data.php`

> This is an unofficial API. The repository's official Shopee Open API documentation is in [`README.md`](README.md).

## Maintenance notice: short links

Short-link processing for domains such as `s.shopee.com.my` and `shp.ee` is currently restricted because high traffic affects Product Data API performance. Although a separate short-link server has been added, using an item ID or resolving the URL on your own server remains more reliable.

Recommended inputs:

- **`item_id` (preferred):** Fast, exact, and less error-prone.
- **Original URL:** Open the product in Shopee and copy the full browser URL.

Short links require several redirects before the product ID can be found. This consumes resources, adds latency, and becomes unreliable under heavy traffic. If short links are essential, expand them on your server before calling this API.

### Expanding short links

#### PHP (cURL)

```php
<?php
function expandShortUrl(string $url, int $timeout = 15, int $connectTimeout = 5): ?string
{
    $url = preg_match('/^https?:\/\//i', $url) ? $url : 'https://' . $url;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 15,
        CURLOPT_TIMEOUT        => $timeout,
        CURLOPT_CONNECTTIMEOUT => $connectTimeout,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => ['Accept: text/html,application/xhtml+xml'],
        CURLOPT_NOBODY         => false,
    ]);
    curl_exec($ch);
    $final = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error !== '') {
        return null;
    }
    return filter_var($final, FILTER_VALIDATE_URL) ? $final : null;
}

$longUrl = expandShortUrl('https://s.shopee.com.my/6VCtHgpohc');
var_dump($longUrl);
```

#### Bash

```bash
curl -Ls -o /dev/null -w '%{url_effective}\n' 'https://s.shopee.com.my/6VCtHgpohc'
```

#### Node.js (fetch, Node 18+)

```js
const response = await fetch("https://s.shopee.com.my/6VCtHgpohc", {
    redirect: "follow",
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
    },
});
console.log(response.url);
```

Shopee may return HTML or block automated requests depending on the IP, rate limit, and cookies. URL expansion is less reliable than opening the link in a browser. A dedicated expansion service is planned.

## Calling the API

### Methods

- `GET` or `POST`
- CORS: `Access-Control-Allow-Origin: *`

### Parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `item_id` | One of the two | Numeric Shopee product ID. |
| `url` | One of the two | Full Shopee product URL or short link. |

At least one parameter is required. When `url` is provided, the API extracts its item ID.

### Supported URL formats

- Full URL: `https://shopee.com.my/product/<shop_id>/<item_id>`
- Paths: `-i.<shop_id>.<item_id>`, `/product/<shop_id>/<item_id>`, `/opaanlp/<shop_id>/<item_id>`
- Query strings: `?item_id=...` or `?itemId=...`
- Short links: `s.shopee.com.my`, `shp.ee` (resolved with a three-second timeout when support is available)

### Examples

```http
GET https://data.addlivetag.com/product-data/product-data.php?item_id=8200081234
```

```http
GET https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.com.my/product/334425154/8200081234
```

```http
POST https://data.addlivetag.com/product-data/product-data.php
Content-Type: application/x-www-form-urlencoded

item_id=8200081234
```

## Response

**Content-Type:** `application/json; charset=utf-8`

**Money amounts** are expressed in MYR minor units (cents): `1290` = RM 12.90.

### Successful response

```json
{
  "status": "success",
  "productInfo": {
    "itemId": 8200081234,
    "productName": "Unisex basic long-sleeve turtleneck sweater",
    "shopName": "DYACI",
    "price": 1290,
    "sales": 990,
    "imageUrl": "https://cf.shopee.com.my/file/example",
    "productLink": "https://shopee.com.my/product/334425154/8200081234",
    "rating": "4.80",
    "commission": 1080,
    "sellerComFinal": 580,
    "shopeeComFinal": 500,
    "isXtra": true,
    "hasSellerCommission": true,
    "hasShopeeCommission": true,
    "isCapped": true,
    "isLimitCap": true,
    "cap": 500,
    "capRaw": 500,
    "capAfterRate": 500,
    "lastUpdate": "2026-08-08 07:39:03",
    "dataSource": "db",
    "priceStats": {
      "currentPrice": 1290,
      "minPrice": 990,
      "maxPrice": 1490,
      "avgPrice": 1174,
      "priceChange7d": 30,
      "priceChange30d": -110,
      "lastPriceUpdate": "2026-08-08",
      "lowestPriceDate": "2026-07-25",
      "highestPriceDate": "2026-08-01"
    },
    "latestPriceHistory": {
      "price": 1290,
      "originalPrice": 1490,
      "discountPercent": 13,
      "currency": "MYR",
      "flashSale": false,
      "promotionId": null,
      "stockAvailable": 120,
      "recordedDate": "2026-08-08",
      "recordedTime": "2026-08-08 07:39:03"
    }
  }
}
```

### `productInfo` fields

| Field | Type | Description |
| --- | --- | --- |
| `itemId` | number | Shopee product ID. |
| `productName` | string | Product name. |
| `shopName` | string | Shop name. |
| `price` | number | Current price in cents (MYR). |
| `sales` | number | Historical sold count. |
| `imageUrl` | string | Main image URL. |
| `productLink` | string | Shopee product URL. |
| `rating` | string/number | Star rating. |
| `commission` | number | Total commission after tax and the user's rate, in cents (MYR). |
| `sellerComFinal` | number | Seller commission after the user's rate and tax. |
| `shopeeComFinal` | number | Shopee commission after the RM5-per-order cap and the applicable percentage limit. |
| `isXtra` | boolean | Whether the product participates in Xtra seller commission. |
| `hasSellerCommission` | boolean | Whether seller commission is available. |
| `hasShopeeCommission` | boolean | Whether Shopee commission is available. |
| `isCapped` | boolean | Whether Shopee commission reached its cap. |
| `isLimitCap` | boolean | Alias of `isCapped`. |
| `cap` | number | Applied commission cap after the user's rate. |
| `capRaw` | number | Original RM5 cap (500 cents). |
| `capAfterRate` | number | Cap after applying the user's rate. |
| `lastUpdate` | string | Data update date and time. |
| `dataSource` | string | `api` for fresh Shopee data, `db` for cached data, or `fallback` for limited data. |
| `priceStats` | object/null | Price statistics; normally available for database results. |
| `latestPriceHistory` | object/null | Most recent price-history record; normally available for database results. |

### `priceStats` fields

`currentPrice`, `minPrice`, `maxPrice`, and `avgPrice` are values in cents (MYR). `priceChange7d` and `priceChange30d` are price changes in cents (MYR). `lastPriceUpdate`, `lowestPriceDate`, and `highestPriceDate` are dates and may be `null`.

### `latestPriceHistory` fields

This object provides `price`, `originalPrice`, `discountPercent`, `currency`, `flashSale`, `promotionId`, `stockAvailable`, `recordedDate`, and `recordedTime`. Values unavailable in the database may be `null`; `currency` defaults to `MYR`.

### Cache and fallback behavior

- If cached data exists, an upstream failure still returns `status: "success"` and may include `"warning": "Using cached data - API fetch failed"`.
- If neither a product nor upstream data can be found, the API returns a minimal `productInfo` object with null/zero fields and `"warning": "Product not found in database and API fetch failed"`.

### Errors

Missing input (`400`):

```json
{"status":"error","message":"item_id or valid Shopee URL is required"}
```

Rate limit (`429`):

```json
{"status":"error","message":"Rate limit exceeded. Please try again later."}
```

Server error (`500`):

```json
{"status":"error","message":"Internal server error","error":"..."}
```

## Rate limits

Limits are applied per IP, using Cloudflare, `X-Forwarded-For`, or `REMOTE_ADDR`:

- Shopee API fetches: 300 requests per minute.
- Database/cache reads: 2,000 requests per minute.
- Exceeding a limit returns HTTP `429`.

## Cache and data sources

Product and commission data is stored for approximately 24 hours (`CACHE_DURATION`):

1. A fresh database record is returned with `dataSource: "db"` without contacting Shopee.
2. A missing or expired record is fetched from Shopee, saved, and returned with `dataSource: "api"`.
3. If Shopee fails and stale data exists, cached data is returned with a warning.
4. If no database record exists and Shopee fails, minimal fallback data is returned.
5. `priceStats` and `latestPriceHistory` are normally populated for `db` results and may be null for `api` or `fallback` results.

## Commission calculation

- **Seller commission (Commission XTRA):** No cap; the seller rate, user rate, and tax are applied.
- **Shopee commission:** Capped at RM5 per order (500 cents) before the user rate, per Shopee Malaysia's affiliate commission terms; any applicable percentage limit of the product price also applies. The lower applicable value is used. Check the [Shopee Malaysia Help Center](https://help.shopee.com.my/portal/10/article/124012) for the current cap.
- `commission = sellerComFinal + shopeeComFinal`, in cents (MYR).

## CORS preflight

`OPTIONS` is supported and returns HTTP 200 with an empty body.

## Endpoint summary

| Item | Value |
| --- | --- |
| URL | `https://data.addlivetag.com/product-data/product-data.php` |
| Methods | GET, POST, OPTIONS |
| Query/body | Numeric `item_id` **or** Shopee `url` |
| Response | JSON with `status` plus `productInfo`, or `message` on error |
| Rate limit | 300/minute (API), 2,000/minute (database), per IP |
| Time zone | Asia/Kuala_Lumpur for `lastUpdate` |
