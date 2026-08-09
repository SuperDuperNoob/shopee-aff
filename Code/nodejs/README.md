# Node.js example

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
npm run start
```

With credentials, the script builds a GraphQL payload, creates a SHA-256
signature in Shopee's Authorization format, and calls
`https://open-api.affiliate.shopee.com.my/graphql`.

With a cookie, it calls `https://shopee.com.my/api/v4/pdp/get_pc` using the
session cookie (pass `item_id` and optional `shop_id` as arguments, or set
`SHOPEE_ITEM_ID` / `SHOPEE_SHOP_ID`).

## Available APIs (`apiName` argument)

- `shopeeOfferV2`
- `brandOfferV2`
- `productOfferV2`
- `generateShortLink`
- `conversionReportV2`
- `validationReportV2`

## Examples

```bash
node index.js shopeeOfferV2
node index.js productOfferV2
node index.js generateShortLink "https://shopee.com.my/product/334425154/8200081234"
node index.js conversionReportV2
node index.js validationReportV2
```

## Checks before pushing

```bash
npm run lint
npm run test
```
