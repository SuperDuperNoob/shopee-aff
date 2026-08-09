# 01 — Repository Map

## Physical layout

```
.
├── README.md                              # Official Shopee Affiliate Open API spec (community-maintained)
├── product-data-api.md                    # Unofficial Product Data API (addlivetag.com)
├── bc-custom-link/                        # Full-stack short-link generator
│   ├── index.php          232 LOC  UI + bootstrap modal + jQuery logic
│   ├── link.php            73 LOC  AJAX controller, validates URL + subIds
│   ├── func.php           159 LOC  Business logic: GraphQL builder, curl, logging, sanitization
│   ├── conn.php            16 LOC  MySQL optional connection (fails open)
│   ├── assets/             Theme (minified, 3rd party)
│   └── README.md           Install notes + SQL schema
├── Code/
│   ├── README.md           Overview of wrappers
│   ├── nodejs/
│   │   ├── index.js       Clean reference impl + exports for testing
│   │   ├── index.test.js  Tests for signature + payload
│   │   ├── package.json   No deps
│   │   └── .env.example
│   └── php/
│       ├── index.php      Same as nodejs but PHP/cURL
│       └── .env.example
└── Postman/
    ├── Shopee-Product-Data.postman_collection.json
    └── Shopee-Product-Data.postman_environment.json
```

## Logical modules

### Module A: Official API wrappers (Code/*)
- **Input:** `apiName` string + optional `originUrl` for short link
- **Process:** load .env -> build GraphQL JSON -> timestamp -> SHA256(appId+ts+payload+secret) -> Authorization header -> fetch/curl POST -> JSON response
- **Output:** `{api, httpCode, response}`
- **Why it exists:** Demonstrates official way, testable, no UI.

### Module B: Custom Link App (bc-custom-link/*)
- **User story:** Affiliate pastes Shopee URL, adds up to 5 subIds for tracking, clicks Create, gets `https://shp.ee/...`
- **Trust:** Server validates via `filter_var` + `stripos(host, 'shopee.')` + regex sanitize subIds.
- **Side effect:** Optional INSERT into `shopee_affiliate_link` table with ip, time_create, us_id fingerprint.
- **Demo mode:** `apiAppID='demo'` hard-coded in index.php JS -> link.php converts to empty string -> expects you to edit line 50-51. Prevents leaking creds in public repo.

### Module C: Unofficial Product Data API docs
- **Not code, but spec** for `https://data.addlivetag.com/product-data/product-data.php`
- Documents caching: 24h, dataSource `db|api|fallback`, priceStats enrichment only on db hits.
- Rate limits: 300/min (upstream fetch), 2000/min (cache) per IP, via CF + XFF.
- Explains short-link expansion controversy: high traffic kills performance, suggests client expands before calling.

## Entry points

| Path | Entry | How invoked |
|------|-------|-------------|
| `Code/nodejs/index.js` | `callShopeeApi()` | `node index.js <apiName> <url>` |
| `Code/php/index.php` | top-level `try` | `php index.php <apiName> <url>` |
| `bc-custom-link/index.php` | `session_start() + us_id()` | Browser GET |
| `bc-custom-link/link.php` | `if $_POST['tp']` | AJAX POST from index.php |

No CLI router, no framework. All flat.

## Third-party surface

- CDN: `cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0`, `popper.js`, `bootstrap/4.1.3`, `font-awesome/5.15.3`, `js-cookie/2.2.1`
- API: `open-api.affiliate.shopee.vn/graphql` (official GraphQL) + `shopee.vn/api/v4/item/get` (unofficial, hypothesized) + `data.addlivetag.com`

## Size rationale

Total ~531 LOC for custom-link + 2 wrappers. Means you can read all in one sitting. No abstraction layers hiding logic — good for RE.
