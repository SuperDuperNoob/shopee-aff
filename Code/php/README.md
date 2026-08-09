# PHP example

## 1. Create a local environment file

```bash
cp .env.example .env
```

### Option A — credentials (official Open API)

Add your real credentials to `.env`:

```env
SHOPEE_API_APP_ID=your_real_app_id
SHOPEE_API_SECRET=your_real_api_secret
```

### Option B — cookie / session (Shopee web endpoints)

Leave the credentials empty and add a browser session cookie instead (see
[`COOKIE_AUTH.md`](../../COOKIE_AUTH.md) for how to obtain it):

```env
SHOPEE_API_APP_ID=
SHOPEE_API_SECRET=
SHOPEE_COOKIE=SPC_F=your_session_cookie_here; SPC_EC=...
# SHOPEE_CSRF_TOKEN=...
# SHOPEE_ITEM_ID=
# SHOPEE_SHOP_ID=
```

The script picks the mode automatically: credentials win if both are set,
otherwise it uses the cookie.

## 2. Run the script

```bash
php index.php
```

With credentials, the script builds a GraphQL payload, creates a SHA-256
signature in Shopee's Authorization format, and calls
`https://open-api.affiliate.shopee.com.my/graphql`.

With a cookie, it calls `https://shopee.com.my/api/v4/pdp/get_pc` using the
session cookie (pass `item_id` and optional `shop_id` as arguments, or set
`SHOPEE_ITEM_ID` / `SHOPEE_SHOP_ID`).

### Cookie-mode short links (no Open API credentials)

The affiliate portal's browser UI generates affiliate links **with subIDs**
through an internal web API. Capture that request once and replay it:

```bash
node tools/trace-portal-link.js --capture '<pasted cURL>' --out portal-link.template.json
php index.php shortLink "https://shopee.com.my/product/334425154/8200081234" campaign1 facebook
```

The template is loaded from `SHOPEE_WEB_LINK_TEMPLATE` (default
`portal-link.template.json` next to this file, or a built-in example).
SubIDs can also come from `SHOPEE_SUB_IDS=campaign1,facebook` (max 5). See
[`docs/reverse-engineering/06-portal-short-link.md`](../../docs/reverse-engineering/06-portal-short-link.md).

## Available APIs (`apiName` argument — credential mode)

- `shopeeOfferV2`
- `brandOfferV2`
- `productOfferV2`
- `generateShortLink`
- `conversionReportV2`
- `validationReportV2`

## Examples

```bash
php index.php shopeeOfferV2
php index.php productOfferV2
php index.php generateShortLink "https://shopee.com.my/product/334425154/8200081234"
php index.php conversionReportV2
php index.php validationReportV2

# cookie mode
php index.php 8200081234 334425154                          # product lookup
php index.php shortLink "https://shopee.com.my/product/334425154/8200081234" campaign1 facebook
```
