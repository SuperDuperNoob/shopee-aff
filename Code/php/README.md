# PHP example

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
php index.php
```

The script builds a GraphQL payload, creates a SHA-256 signature in Shopee's Authorization format, and calls `https://open-api.affiliate.shopee.com.my/graphql`.

## Available APIs (`apiName` argument)

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
```
