# Code Examples — Shopee Official API

This directory contains examples for calling the Shopee Affiliate Open API (GraphQL) with:

- `php/`
- `nodejs/`

## Quick setup

1. Open either the `php` or `nodejs` directory.
2. Copy `.env.example` to `.env`.
3. Authenticate using **either**:
   - **Credentials (official Open API):** `SHOPEE_API_APP_ID` + `SHOPEE_API_SECRET`.
   - **Cookie / session (Shopee web endpoints):** `SHOPEE_COOKIE` (leave the credentials empty). See [`COOKIE_AUTH.md`](../COOKIE_AUTH.md).
4. Follow the directory's README to run the script.

## Notes

- These examples use Shopee Affiliate's official API.
- Cookie / session authentication (browser `SPC_F` cookie) is documented in `COOKIE_AUTH.md`.
- The unofficial Product Data API is documented in `product-data-api.md`.
- The samples support `shopeeOfferV2`, `brandOfferV2`, `productOfferV2`, `generateShortLink`, `conversionReportV2`, and `validationReportV2` (credential mode), plus a web product lookup (cookie mode).
