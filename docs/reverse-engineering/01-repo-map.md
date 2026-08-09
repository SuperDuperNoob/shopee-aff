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
│   │   ├── index.test.js  Tests for signature + payload + portal template
│   │   ├── package.json   No deps
│   │   ├── portal-link.template.json   Example portal short-link template (cookie mode)
│   │   └── .env.example
│   └── php/
│       ├── index.php      Same as nodejs but PHP/cURL
│       └── .env.example
├── tools/
│   ├── trace-portal-link.js   Capture & replay the portal's internal short-link API
│   ├── re-analyzer.js         Static RE analyzer
│   ├── trace-signature.js     Signature tracer
│   ├── re-graph.sh            Dependency graph
│   └── security-scan.sh       Grep-based security audit
└── Postman/
    ├── Shopee-Product-Data.postman_collection.json
    └── Shopee-Product-Data.postman_environment.json
```

## Logical modules

### Module A: Official API wrappers (Code/*)
- **Input:** `apiName` string + optional `originUrl` for short link (credential mode); or `item_id`/`shop_id` / `shortLink <originUrl> [subIds]` (cookie mode)
- **Process:** load .env -> if `SHOPEE_API_APP_ID`+`SHOPEE_API_SECRET` set: build GraphQL JSON -> timestamp -> SHA256(appId+ts+payload+secret) -> Authorization header -> fetch/curl POST -> JSON response. Else if `SHOPEE_COOKIE` set: Cookie header (+ optional `X-CSRFToken`) -> GET `shopee.com.my/api/v4/pdp/get_pc` (product) or replay the portal short-link template (`{{originUrl}}`/`{{subIds}}` substitution, see `06-portal-short-link.md`).
- **Output:** `{api, auth, httpCode, response}` (auth is `credentials` or `cookie`)
- **Why it exists:** Demonstrates official way, testable, no UI; also supports cookie/session auth (see `COOKIE_AUTH.md`), including cookie-mode affiliate short links with subIDs.

### Module D: Portal short-link RE tooling (tools/trace-portal-link.js)
- **User story:** Affiliate generates links in the portal UI (no Open API creds); we capture that one XHR and replay it with the session cookie.
- **Process:** DevTools "Copy as cURL" -> `--capture` parses it (quotes, ANSI-C `$'...'`, multiline) -> template with `{{originUrl}}`/`{{subIds}}`/`{{cookie}}`/`{{csrfToken}}` placeholders -> `--dry-run`/`--replay` with `SHOPEE_COOKIE`.
- **Secrets:** cookie/CSRF never written into templates; redacted in output unless `--show-secrets`.

### Module B: Custom Link App (bc-custom-link/*)
- **User story:** Affiliate pastes Shopee URL, adds up to 5 subIds for tracking, clicks Create, gets `https://shp.ee/...`
- **Trust:** Server validates via `filter_var` + `stripos(host, 'shopee.')` + regex sanitize subIds.
- **Side effect:** Optional INSERT into `shopee_affiliate_link` table with ip, time_create, us_id fingerprint.
- **Demo mode:** `apiAppID='demo'` hard-coded in index.php JS -> link.php converts to empty string -> expects you to edit line 65-66. Prevents leaking creds in public repo.

### Module C: Unofficial Product Data API docs
- **Not code, but spec** for `https://data.addlivetag.com/product-data/product-data.php`
- Documents caching: 24h, dataSource `db|api|fallback`, priceStats enrichment only on db hits.
- Rate limits: 300/min (upstream fetch), 2000/min (cache) per IP, via CF + XFF.
- Explains short-link expansion controversy: high traffic kills performance, suggests client expands before calling.

## Entry points

| Path | Entry | How invoked |
|------|-------|-------------|
| `Code/nodejs/index.js` | `callShopeeApi()` | `node index.js <apiName> <url>`; cookie: `node index.js <itemId> [shopId]` or `node index.js shortLink <url> [subId...]` |
| `Code/php/index.php` | top-level `try` | `php index.php <apiName> <url>`; cookie: `php index.php <itemId> [shopId]` or `php index.php shortLink <url> [subId...]` |
| `tools/trace-portal-link.js` | `main()` | `node tools/trace-portal-link.js --capture '<cURL>' [--out template.json]` or `--replay --template <file> --url <originUrl> [--subid ...]` |
| `bc-custom-link/index.php` | `session_start() + us_id()` | Browser GET |
| `bc-custom-link/link.php` | `if $_POST['tp']` | AJAX POST from index.php |

No CLI router, no framework. All flat.

## Third-party surface

- CDN: `cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0`, `popper.js`, `bootstrap/4.1.3`, `font-awesome/5.15.3`, `js-cookie/2.2.1`
- API: `open-api.affiliate.shopee.com.my/graphql` (official GraphQL) + `shopee.com.my/api/v4/item/get` (unofficial, hypothesized) + `data.addlivetag.com`

## Size rationale

Total ~531 LOC for custom-link + 2 wrappers. Means you can read all in one sitting. No abstraction layers hiding logic — good for RE.
