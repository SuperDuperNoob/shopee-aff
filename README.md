# Shopee Affiliate API Documentation

> A practical reference for Shopee Affiliate's official APIs for retrieving offers, generating affiliate links, and tracking conversions.

**Official source:** <https://affiliate.shopee.vn/open_api/list>

> **New:** Want to understand how this repo works internally? See [Reverse Engineering Guide](REVERSE_ENGINEERING.md) — includes auto-analysis tools (`tools/re-analyzer.js`), auth-flow tracer (`tools/trace-signature.js`), security scanner, and deep dives in `docs/reverse-engineering/`.

## Contents

- [Scope](#scope)
- [Related demos and tools](#related-demos-and-tools)
- [Prerequisites](#prerequisites)
- [API endpoints](#api-endpoints)
  - [Products](#1-products)
  - [Offer lists](#2-offer-lists)
  - [Affiliate links](#3-affiliate-links)
  - [Conversion reports](#4-conversion-reports)
- [Error codes](#error-codes)
- [Version history](#version-history)
- [Important notes](#important-notes)

## Scope

This document covers Shopee Affiliate's **official** Open API (GraphQL and REST). The unofficial Product Data API is documented separately in [`product-data-api.md`](product-data-api.md).

Covered API groups:

- Product APIs (REST)
- Offer APIs (GraphQL)
- Affiliate Link API (GraphQL mutation)
- Conversion and Validated Report APIs (GraphQL)

## Related demos and tools

- Shopee Affiliate API demo: <https://addlivetag.com/shopee-affiliate-api/index.php>
- Addlivetag tools: <https://addlivetag.com/>
- Available tools include a Shopee affiliate-link generator, a Shopee Affiliate API developer tool, Shopee Video cart tools, commission and order calculators, original-link extraction, URL shortening, and MCN Manager.

## Prerequisites

Before using these APIs, you need:

1. A **Shopee Affiliate account**, available from [Shopee Affiliate Vietnam](https://affiliate.shopee.vn/).
2. An **`app_id` and `secret_key`**, issued by Shopee and used to authenticate API requests.
3. An **`access_token`** for APIs that require access to an individual account.
4. A **`signature`**, generated from the `secret_key` and request parameters.

## API endpoints

### 1. Products

These REST endpoints retrieve product details, search for products, and return recommendations.

#### `product_item_get`

Returns details for a product ID, including its price, stock, description, and images.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `item_id` | `string` | Yes | Product ID. |
| `shop_id` | `integer` | No | Shop ID. |
| `affiliate_link` | `boolean` | No | Whether to include an affiliate link. |

```bash
curl -X GET "https://open.shopee.vn/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### `product_search`

Searches for products by keyword.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `keyword` | `string` | Yes | Search keyword. |
| `limit` | `integer` | No | Maximum results (default: 10). |
| `offset` | `integer` | No | Pagination offset. |

#### `product_item_recommend_get`

Returns products related to a specified product.

### 2. Offer lists

#### `shopOfferV2` — shop offers

A GraphQL query returning `ShopOfferConnectionV2`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `shopId` | `Int64` | No | Filter by shop ID. |
| `keyword` | `String` | No | Search by shop name. |
| `shopType` | `[Int]` | No | `1` Official/Mall, `2` Preferred, `4` Preferred Plus. |
| `isKeySeller` | `Bool` | No | Return only key sellers when `true`. |
| `sortType` | `Int` | No | `1` recently updated, `2` highest commission, `3` popular shop. |
| `sellerCommCoveRatio` | `String` | No | Minimum seller-commission product coverage ratio. |
| `page` | `Int` | No | Page number. |
| `limit` | `Int` | No | Results per page (default: 10). |

The response contains `nodes` (`ShopOfferV2` records) and `pageInfo`.

| Field | Type | Description |
| --- | --- | --- |
| `commissionRate` | `String` | Commission rate; for example, `"0.25"` means 25%. |
| `imageUrl` | `String` | Shop image URL. |
| `offerLink` | `String` | Affiliate offer link. |
| `originalLink` | `String` | Original shop link. |
| `shopId` | `Int64` | Shop ID. |
| `shopName` | `String` | Shop name. |
| `ratingStar` | `String` | Shop rating. |
| `shopType` | `[Int]` | Shop types (`1`, `2`, or `4`). |
| `remainingBudget` | `Int` | `0` unlimited, `3` normal (>50%), `2` low (<50%), `1` very low (<30%). |
| `periodStartTime` | `Int` | Offer start time (Unix timestamp). |
| `periodEndTime` | `Int` | Offer end time (Unix timestamp). |
| `sellerCommCoveRatio` | `String` | Seller-commission product coverage ratio. |
| `bannerInfo` | `BannerInfo` | Banner information. |

#### `productOfferV2` — product offers

A GraphQL query returning `ProductOfferConnectionV2`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `shopId` | `Int64` | No | Filter by shop ID. |
| `itemId` | `Int64` | No | Filter by item ID. |
| `productCatId` | `Int32` | No | Level 1, 2, or 3 category ID. |
| `listType` | `Int` | No | `0` all, `2` top-performing, `3` landing category, `4` detail category, `5` shop detail. |
| `matchId` | `Int64` | No | Category ID for list types 3/4 or shop ID for type 5. |
| `keyword` | `String` | No | Search by product name. |
| `sortType` | `Int` | No | `1` relevance, `2` sales, `3` high-to-low price, `4` low-to-high price, `5` high-to-low commission. |
| `page` | `Int` | No | Page number. |
| `isAMSOffer` | `Bool` | No | Return only seller-commission offers when `true`. |
| `isKeySeller` | `Bool` | No | Filter by key seller. |
| `limit` | `Int` | No | Results per page (default: 10). |

The response contains `nodes` (`ProductOfferV2` records) and `pageInfo`. Important fields include `itemId`, `productName`, `shopId`, `shopName`, `productLink`, `offerLink`, `commissionRate`, `sellerCommissionRate`, `shopeeCommissionRate`, `commission`, `sales`, `priceMin`, `priceMax`, `productCatIds`, `ratingStar`, `priceDiscountRate`, `imageUrl`, `shopType`, `periodStartTime`, and `periodEndTime`.

### 3. Affiliate links

#### `generateShortLink`

A GraphQL mutation that converts an ordinary Shopee URL into a short affiliate URL.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `originUrl` | `String!` | Yes | Original Shopee product, shop, or page URL. |
| `subIds` | `[String]` | No | Up to five tracking sub-IDs included in UTM content. |

The result is a `ShortLinkResult!` containing `shortLink`.

```bash
curl -X POST 'https://open-api.affiliate.shopee.vn/graphql' \
  -H 'Authorization: SHA256 Credential=123456, Signature=YOUR_SIGNATURE, Timestamp=1577836800' \
  -H 'Content-Type: application/json' \
  --data-raw '{"query":"mutation { generateShortLink(input: { originUrl: \"https://shopee.vn/product/52377417/6309028319\", subIds: [\"s1\", \"s2\"] }) { shortLink } }"}'
```

```json
{"data":{"generateShortLink":{"shortLink":"https://shope.ee/5XyZ7WqR"}}}
```

### 4. Conversion reports

#### `conversionReport`

A GraphQL query returning `ConversionReportConnection!`. It reports orders and commissions attributed to affiliate links.

Common filters include `purchaseTimeStart`, `purchaseTimeEnd`, `completeTimeStart`, `completeTimeEnd`, `shopName`, `shopId`, `shopType`, `conversionId`, `orderId`, `productName`, `productId`, category IDs, `categoryType`, `orderStatus`, `buyerType`, `attributionType`, `device`, `productType`, `fraudStatus`, `campaignPartnerName`, and `campaignType`.

- `limit`: up to 500 records per page.
- `scrollId`: pagination cursor. It expires after 30 seconds, so request the next page within that period.

Each conversion can contain:

- Times and IDs: `purchaseTime`, `clickTime`, `conversionId`
- Commission values: `shopeeCommissionCapped`, `sellerCommission`, `totalCommission`, `netCommission`
- Attribution metadata: `buyerType`, `utmContent`, `device`, `referrer`, `campaignType`
- MCN metadata: `linkedMcnName`, `mcnContractId`, `mcnManagementFeeRate`, `mcnManagementFee`
- `orders`, each with an `orderId`, `orderStatus`, `shopType`, and item list

Order items include product/shop identifiers, price and quantity, commission breakdowns, status and fraud data, attribution, categories, refund data, model and promotion IDs, and campaign metadata.

#### `validatedReport`

A GraphQL query returning `ValidatedReportConnection!` for billing data that has been validated and will be paid.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `validationId` | `Int64` | Yes | Validation ID from Billing Information. |
| `limit` | `Int` | No | Up to 500 records per page. |
| `scrollId` | `String` | No | Cursor for the next page. |

Its structures are similar to `ConversionReport`, `ConversionReportOrder`, and `ConversionReportOrderItem`.

**`scrollId` rules:**

- A cursor expires after 30 seconds.
- The next request must be made within 30 seconds.
- The first request, without a cursor, returns the first page and a cursor.
- A cursor is single-use.
- Shopee requires more than 30 seconds between independent first-page requests without a cursor.

## Error codes

| Code | Meaning |
| --- | --- |
| `11000` | Business error. |
| `11001` | Parameter error: `{reason}`. |
| `11002` | Account binding error: `{reason}`. |
| `10020` | Invalid signature, disabled app, expired request, invalid timestamp/credential/header, or unsupported authentication type. |
| `10030` | Rate limit exceeded. |
| `10031` | Access denied. |
| `10032` | Invalid affiliate ID. |
| `10033` | Account frozen. |
| `10034` | Affiliate ID is blocklisted. |
| `10035` | The account cannot access the platform. [Contact Shopee](https://help.shopee.vn/portal/webform/c2d6ebc5a2d64dd1b26f8c871730cdbd). |

## Version history

### Version 2.0

Shopee optimized several Open API features while keeping older versions available. Affiliates may choose whether to migrate.

### 2024-11-15

- Added fields such as `netCommission` and `campaignType` to Conversion Report.
- Updated Validated Report with new and revised fields.
- New fields are marked “New”; deprecated fields are marked “To Be Removed” in Shopee's official documentation.

### 2024-11-04

- Added seller-commission fields and popular-shop sorting to Shop Offer V2.

### 2023-08-04

- Added item/shop information to Product Offer V2 and Shop Offer V2.
- Added item status to Conversion Report and billing details by validation ID to Validated Report.

### 2023-05-22 and earlier

Shopee expanded checkout responses to support multiple orders per checkout, added digital-product and fraud filters, global categories, creative banners, product offers, shop types, category commission rates, model/promotion IDs, and partial-refund states. Consult the official changelog for field-level migration details and removal dates.

## Important notes

- **Rate limits:** Shopee may limit request volume. Check the official documentation for current limits.
- **Data freshness:** Prices and stock change frequently; API data can have a small delay.
- **Terms of service:** API use must comply with Shopee Affiliate's terms.
- **Check the original documentation:** This community-maintained summary may lag behind Shopee's official documentation.
