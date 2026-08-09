# Node.js example

## 1. Create a local environment file

```bash
cp .env.example .env
```

Add your real credentials to `.env`:

```env
SHOPEE_API_APP_ID=your_real_app_id
SHOPEE_API_SECRET=your_real_api_secret
```

## 2. Run the script

```bash
npm run start
```

The script builds a GraphQL payload, creates a SHA-256 signature in Shopee's Authorization format, and calls `https://open-api.affiliate.shopee.vn/graphql`.

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
node index.js generateShortLink "https://shopee.vn/product/38003654/1589295236"
node index.js conversionReportV2
node index.js validationReportV2
```

## Checks before pushing

```bash
npm run lint
npm run test
```
