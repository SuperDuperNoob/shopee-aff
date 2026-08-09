# Auto-Generated Reverse Engineering Report

Generated: 2026-08-09T04:12:39.939Z

## Summary
- Files analyzed: 30
- External hosts: https://open-api.affiliate.shopee.com.my/graphql`, https://shopee.com.my/api/v4/...`, https://shopee.com.my, https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234, https://shopee.com.my/, https://shopee.com.my/api/v4/example/write, https://shopee.com.my/api/v4/pdp/get_pc?item_id=8200081234&shop_id=334425154, https://shopee.com.my/api/v4/pdp/get_pc?item_id=...&shop_id=...`, https://shopee.com.my/product/334425154/8200081234, https://open-api.affiliate.shopee.com.my/graphql`., https://shopee.com.my/api/v4/pdp/get_pc`, https://open-api.affiliate.shopee.com.my/graphql, https://shopee.com.my/api/v4/pdp/get_pc, https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT, https://affiliate.shopee.com.my, https://affiliate.shopee.com.my/, https://affiliate.shopee.com.my/api/v1/short_link, https://shopee.com.my/product/1/2, https://shopee.com.my/p, https://affiliate.shopee.com.my/api/v1/real, https://schema.getpostman.com/json/collection/v2.1.0/collection.json, https://data.addlivetag.com/product-data/product-data.php, https://affiliate.shopee.com.my/open_api/list>, https://addlivetag.com/shopee-affiliate-api/index.php>, https://addlivetag.com/>, https://open.shopee.com.my/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654, https://shopee.com.my/product/334425154/8200081234\, https://shope.ee/5XyZ7WqR, https://help.shopee.com.my/portal/webform/99dbea1dc4894accae65f606c2f91af5, https://shopee.com.my/product/334425154/8200081234&Sub_id1=MyTest, https://shopee.com.my/api/v4/item/get?itemid=xxx&shopid=yyy, https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154, https://s.shopee.com.my/6VCtHgpohc, https://evil.com, https://shopee.com.my.evil.com, https://open-api.affiliate.shopee.com.my/graphql], https://affiliate.shopee.com.my/open_api>., https://i.imgur.com/Bc6X9ub.png, https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css, https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js, https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js, https://www.facebook.com/Bcat95/, https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js, https://affiliate.shopee.com.my/open_api, https://shp.ee/...`, https://data.addlivetag.com/product-data/product-data.php`, https://shp.ee/..., https://shopee.com.my.evil.com/product/1/1`, https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil`, https://data.addlivetag.com/product-data/product-data.php`,, https://affiliate.shopee.com.my/api/...`, https://shopee.com.my/product/<shopId>/<itemId>`, https://shp.ee/abc123, https://shopee.com.my/product/<shop_id>/<item_id>`, https://data.addlivetag.com/product-data/product-data.php?item_id=8200081234, https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.com.my/product/334425154/8200081234, https://cf.shopee.com.my/file/example, https://help.shopee.com.my/portal/10/article/124012, https://open-api.affiliate.shopee.com.my/graphql\`\n3.
- GraphQL ops found: shopeeOfferV2, brandOfferV2, productOfferV2, generateShortLink, conversionReportV2, validationReportV2, brandOffer, conversionReport, validatedReport, shopOfferV2
- Total functions: 64

## Hosts

- `https://open-api.affiliate.shopee.com.my/graphql``
- `https://shopee.com.my/api/v4/...``
- `https://shopee.com.my`
- `https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234`
- `https://shopee.com.my/`
- `https://shopee.com.my/api/v4/example/write`
- `https://shopee.com.my/api/v4/pdp/get_pc?item_id=8200081234&shop_id=334425154`
- `https://shopee.com.my/api/v4/pdp/get_pc?item_id=...&shop_id=...``
- `https://shopee.com.my/product/334425154/8200081234`
- `https://open-api.affiliate.shopee.com.my/graphql`.`
- `https://shopee.com.my/api/v4/pdp/get_pc``
- `https://open-api.affiliate.shopee.com.my/graphql`
- `https://shopee.com.my/api/v4/pdp/get_pc`
- `https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT`
- `https://affiliate.shopee.com.my`
- `https://affiliate.shopee.com.my/`
- `https://affiliate.shopee.com.my/api/v1/short_link`
- `https://shopee.com.my/product/1/2`
- `https://shopee.com.my/p`
- `https://affiliate.shopee.com.my/api/v1/real`
- `https://schema.getpostman.com/json/collection/v2.1.0/collection.json`
- `https://data.addlivetag.com/product-data/product-data.php`
- `https://affiliate.shopee.com.my/open_api/list>`
- `https://addlivetag.com/shopee-affiliate-api/index.php>`
- `https://addlivetag.com/>`
- `https://open.shopee.com.my/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654`
- `https://shopee.com.my/product/334425154/8200081234\`
- `https://shope.ee/5XyZ7WqR`
- `https://help.shopee.com.my/portal/webform/99dbea1dc4894accae65f606c2f91af5`
- `https://shopee.com.my/product/334425154/8200081234&Sub_id1=MyTest`
- `https://shopee.com.my/api/v4/item/get?itemid=xxx&shopid=yyy`
- `https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154`
- `https://s.shopee.com.my/6VCtHgpohc`
- `https://evil.com`
- `https://shopee.com.my.evil.com`
- `https://open-api.affiliate.shopee.com.my/graphql]`
- `https://affiliate.shopee.com.my/open_api>.`
- `https://i.imgur.com/Bc6X9ub.png`
- `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css`
- `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js`
- `https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js`
- `https://www.facebook.com/Bcat95/`
- `https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js`
- `https://affiliate.shopee.com.my/open_api`
- `https://shp.ee/...``
- `https://data.addlivetag.com/product-data/product-data.php``
- `https://shp.ee/...`
- `https://shopee.com.my.evil.com/product/1/1``
- `https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil``
- `https://data.addlivetag.com/product-data/product-data.php`,`
- `https://affiliate.shopee.com.my/api/...``
- `https://shopee.com.my/product/<shopId>/<itemId>``
- `https://shp.ee/abc123`
- `https://shopee.com.my/product/<shop_id>/<item_id>``
- `https://data.addlivetag.com/product-data/product-data.php?item_id=8200081234`
- `https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.com.my/product/334425154/8200081234`
- `https://cf.shopee.com.my/file/example`
- `https://help.shopee.com.my/portal/10/article/124012`
- `https://open-api.affiliate.shopee.com.my/graphql\`\n3.`

## GraphQL Operations

- `shopeeOfferV2`
- `brandOfferV2`
- `productOfferV2`
- `generateShortLink`
- `conversionReportV2`
- `validationReportV2`
- `brandOffer`
- `conversionReport`
- `validatedReport`
- `shopOfferV2`

## Functions by File

| File | Functions | Lines |
|------|-----------|-------|
| tools/trace-portal-link.js | tokenizeCurl, parseCurl, redactHeader, redactBody, findShopeeUrls, buildTemplateFromCapture, applyTemplate, isPlaceholderUrl, sendRequest, printRequest, readTemplate, printUsage, parseArgs, main, next, sub, redact, subIds | 480 |
| REVERSE_ENGINEERING.md | test | 405 |
| Code/php/index.php | loadEnv, buildPayload, callShopeeApi, buildWebHeaders, applyTemplate, isPlaceholderUrl, loadPortalTemplate, callShopeeWebShortLink, callShopeeWebApi | 401 |
| Code/nodejs/index.js | loadEnv, buildPayload, buildAuthorization, buildWebHeaders, applyTemplate, isPlaceholderUrl, loadPortalTemplate, callShopeeWebShortLink, cookieModeArgs, callShopeeWebApi, callShopeeGraphql, callShopeeApi, sub | 382 |
| product-data-api.md | expandShortUrl | 273 |
| README.md | - | 258 |
| COOKIE_AUTH.md | - | 248 |
| bc-custom-link/index.php | copyToClipboard_1029, referralCopy, isValidShopeeUrl, createLink | 233 |
| docs/reverse-engineering/06-portal-short-link.md | - | 227 |
| tools/re-analyzer.js | walk, readSafe, analyzeFile, main | 172 |
| bc-custom-link/func.php | removeParam, log_shopee_affiliate_link, get_client_ip, short_link, shopee_aff_api, response, us_id, new_us_id | 160 |
| docs/reverse-engineering/03-bc-custom-link-deep-dive.md | removeParam | 139 |
| Code/nodejs/index.test.js | - | 138 |
| docs/reverse-engineering/04-unofficial-api.md | expandShortUrl | 127 |
| tools/trace-signature.js | parseArgs, buildPayload, main | 116 |
| docs/reverse-engineering/02-auth-flow.md | buildAuthorization | 114 |
| Code/nodejs/README.md | - | 94 |
| Code/php/README.md | - | 86 |
| Postman/Shopee-Product-Data.postman_collection.json | - | 86 |
| docs/reverse-engineering/05-methodology-cheatsheet.md | - | 86 |
| docs/reverse-engineering/01-repo-map.md | - | 83 |
| bc-custom-link/link.php | - | 74 |
| docs/README.md | - | 32 |
| bc-custom-link/README.md | - | 31 |
| Postman/Shopee-Product-Data.postman_environment.json | - | 25 |
| Code/README.md | - | 23 |
| bc-custom-link/conn.php | - | 17 |
| docs/reverse-engineering/README.md | - | 17 |
| Code/nodejs/portal-link.template.json | - | 16 |
| Code/nodejs/package.json | - | 13 |

## Detailed Matches (Potential Security / Flow)


### tools/trace-portal-link.js (480 LOC)
- **jsFunction**: `L53: function tokenizeCurl(`, `L108: export function parseCurl`, `L121: next = (`, `L175: export function redactHeader`, `L186: function redactBody(`, `L191: function findShopeeUrls(`, `L199: export function buildTemplateFromCapture`, `L256: export function applyTemplate`, `L257: sub = (`, `L276: export function isPlaceholderUrl`, `L284: function sendRequest(`, `L304: function printRequest(`, `L305: redact = (`, `L311: function readTemplate(`, `L325: function printUsage(`, `L356: function parseArgs(`, `L391: function main(`, `L432: subIds = (`
- **jsExport**: `L108: export function parseCurl`, `L175: export function redactHeader`, `L199: export function buildTemplateFromCapture`, `L256: export function applyTemplate`, `L276: export function isPlaceholderUrl`
- **externalHost**: `L24: https://shopee.com.my/product/334425154/8200081234`, `L28: https://shopee.com.my/product/334425154/8200081234`, `L347: https://shopee.com.my/product/1/2`, `L348: https://shopee.com.my/product/1/2`, `L379: https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT`, `L383: https://affiliate.shopee.com.my`, `L384: https://affiliate.shopee.com.my/`
- **curl**: `L288: fetch(`
- **subIds**: `L225: subIds`, `L226: subIds`, `L227: subIds`, `L230: subIds`, `L231: subIds`, `L232: subIds`, `L238: subIds`, `L260: subIds`, `L260: subIds`, `L261: subIds`, `L261: subIds`, `L388: subIds`, `L388: subIds`, `L410: subIds`, `L432: subIds`, `L437: subIds`, `L450: subIds`, `L450: subIds`, `L450: subIds`
- **dotEnv**: `L47: SECRET`, `L177: SECRET`, `L313: .env`, `L313: .env`, `L429: .env`, `L430: .env`

### REVERSE_ENGINEERING.md (405 LOC)
- **jsFunction**: `L177: function test(`
- **graphqlOp**: `L139: shopeeOfferV2`, `L178: shopeeOfferV2`, `L351: conversionReport`, `L351: validatedReport`, `L363: shopeeOfferV2`, `L363: productOfferV2`, `L363: generateShortLink`, `L363: conversionReport`, `L363: validatedReport`
- **authSig**: `L18: SHA256`, `L61: Credential`, `L111: Signature`, `L111: SHA256`, `L113: SHA256`, `L113: Credential`, `L113: Timestamp`, `L113: Signature`, `L162: Signature`, `L165: Timestamp`, `L168: Signature`, `L168: SHA256`, `L169: SHA256`, `L169: Credential`, `L169: Timestamp`, `L169: Signature`, `L179: createHash("sha256")`, `L180: SHA256`, `L180: Credential`, `L180: Timestamp`
- **externalHost**: `L17: https://open-api.affiliate.shopee.com.my/graphql`, `L25: https://data.addlivetag.com/product-data/product-data.php`, `L112: https://open-api.affiliate.shopee.com.my/graphql`, `L128: https://shopee.com.my/product/334425154/8200081234&Sub_id1=MyTest`, `L222: https://shopee.com.my/api/v4/item/get?itemid=xxx&shopid=yyy`, `L225: https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154`, `L228: https://shopee.com.my/`, `L231: https://s.shopee.com.my/6VCtHgpohc`, `L244: https://evil.com`, `L244: https://shopee.com.my.evil.com`, `L268: https://shopee.com.my/product/334425154/8200081234`, `L297: https://open-api.affiliate.shopee.com.my/graphql]`
- **supGlobals**: `L92: $_POST`, `L92: $_GET`, `L369: $_POST`, `L369: $_GET`
- **db**: `L114: mysqli`, `L338: mysqli`, `L338: mysqli`, `L369: mysqli`
- **subIds**: `L30: subIds`, `L37: subIds`, `L102: Sub_id`, `L107: subIds`, `L109: subIds`, `L128: Sub_id`, `L154: Sub_id`, `L154: Sub_id`, `L156: Sub_id`, `L156: Sub_id`, `L365: subIds`, `L366: Sub_id`, `L366: subIds`, `L386: subIds`
- **dotEnv**: `L40: .env`, `L61: SECRET`, `L61: .env`, `L137: .env`, `L137: .env`, `L138: .env`
- **removeParam**: `L105: removeParam`, `L350: removeParam`

### Code/php/index.php (401 LOC)
- **jsFunction**: `L10: function loadEnv(`, `L41: function buildPayload(`, `L107: function callShopeeApi(`, `L126: httpCode = (`, `L149: function buildWebHeaders(`, `L199: function applyTemplate(`, `L228: function isPlaceholderUrl(`, `L233: function loadPortalTemplate(`, `L249: function callShopeeWebShortLink(`, `L297: httpCode = (`, `L318: function callShopeeWebApi(`, `L343: httpCode = (`
- **graphqlOp**: `L43: shopeeOfferV2`, `L47: shopeeOfferV2`, `L49: shopeeOfferV2`, `L55: brandOfferV2`, `L57: brandOffer`, `L63: productOfferV2`, `L65: productOfferV2`, `L71: generateShortLink`, `L73: generateShortLink`, `L78: conversionReportV2`, `L80: conversionReport`, `L86: validationReportV2`, `L88: validatedReport`, `L374: shopeeOfferV2`, `L396: generateShortLink`
- **authSig**: `L120: SHA256`, `L120: Credential`, `L120: Timestamp`, `L120: Signature`
- **externalHost**: `L5: https://open-api.affiliate.shopee.com.my/graphql`, `L8: https://shopee.com.my/api/v4/pdp/get_pc`, `L44: https://shopee.com.my`, `L159: https://shopee.com.my/`, `L186: https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT`, `L190: https://affiliate.shopee.com.my`, `L191: https://affiliate.shopee.com.my/`
- **curl**: `L113: curl_init`, `L114: curl_setopt_array`, `L125: curl_exec`, `L126: curl_getinfo`, `L127: curl_error`, `L128: curl_close`, `L284: curl_init`, `L294: curl_setopt_array`, `L296: curl_exec`, `L297: curl_getinfo`, `L298: curl_error`, `L299: curl_close`, `L335: curl_init`, `L336: curl_setopt_array`, `L342: curl_exec`, `L343: curl_getinfo`, `L344: curl_error`, `L345: curl_close`
- **subIds**: `L73: subIds`, `L195: subIds`, `L195: subIds`, `L203: subIds`, `L203: subIds`, `L206: subIds`, `L207: subIds`, `L248: subId`, `L248: subId`, `L253: subIds`, `L255: subIds`, `L255: subIds`, `L257: subIds`, `L257: subIds`, `L271: subIds`, `L271: subIds`, `L398: subId`, `L398: subId`
- **dotEnv**: `L13: .env`, `L13: .env`, `L13: .env`, `L19: .env`, `L261: .env`, `L325: .env`, `L366: .env`, `L367: SHOPEE_API`, `L367: APP_ID`, `L368: SHOPEE_API`, `L368: SECRET`, `L384: .env`, `L384: SHOPEE_API`, `L384: APP_ID`, `L384: SHOPEE_API`, `L384: SECRET`

### Code/nodejs/index.js (382 LOC)
- **jsFunction**: `L13: export function loadEnv`, `L37: export function buildPayload`, `L96: export function buildAuthorization`, `L106: export function buildWebHeaders`, `L160: export function applyTemplate`, `L161: sub = (`, `L182: export function isPlaceholderUrl`, `L189: export function loadPortalTemplate`, `L200: function callShopeeWebShortLink(`, `L257: export function cookieModeArgs`, `L273: function callShopeeWebApi(`, `L302: function callShopeeGraphql(`, `L336: function callShopeeApi(`
- **jsExport**: `L13: export function loadEnv`, `L37: export function buildPayload`, `L96: export function buildAuthorization`, `L106: export function buildWebHeaders`, `L139: export const DEFAULT_PORTAL_LINK_TEMPLATE`, `L160: export function applyTemplate`, `L182: export function isPlaceholderUrl`, `L189: export function loadPortalTemplate`, `L257: export function cookieModeArgs`
- **graphqlOp**: `L39: shopeeOfferV2`, `L41: shopeeOfferV2`, `L47: brandOfferV2`, `L49: brandOffer`, `L55: productOfferV2`, `L57: productOfferV2`, `L63: generateShortLink`, `L65: generateShortLink`, `L70: conversionReportV2`, `L72: conversionReport`, `L78: validationReportV2`, `L80: validatedReport`, `L310: shopeeOfferV2`, `L370: generateShortLink`
- **authSig**: `L98: createHash("sha256")`, `L99: SHA256`, `L99: Credential`, `L99: Timestamp`, `L99: Signature`, `L301: Credential`
- **externalHost**: `L6: https://open-api.affiliate.shopee.com.my/graphql`, `L9: https://shopee.com.my/api/v4/pdp/get_pc`, `L115: https://shopee.com.my/`, `L142: https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT`, `L146: https://affiliate.shopee.com.my`, `L147: https://affiliate.shopee.com.my/`, `L311: https://shopee.com.my`
- **curl**: `L232: fetch(`, `L289: fetch(`, `L316: fetch(`
- **subIds**: `L65: subIds`, `L151: subIds`, `L151: subIds`, `L156: subIds`, `L157: subIds`, `L164: subIds`, `L164: subIds`, `L165: subIds`, `L165: subIds`, `L199: subId`, `L199: subId`, `L202: subIds`, `L219: subIds`, `L373: subId`, `L373: subId`
- **dotEnv**: `L15: .env`, `L15: .env`, `L15: .env`, `L209: .env`, `L278: .env`, `L303: SHOPEE_API`, `L303: APP_ID`, `L304: SHOPEE_API`, `L304: SECRET`, `L307: SHOPEE_API`, `L307: APP_ID`, `L307: SHOPEE_API`, `L307: SECRET`, `L307: .env`, `L337: .env`, `L339: SHOPEE_API`, `L339: APP_ID`, `L339: SHOPEE_API`, `L339: SECRET`, `L353: .env`

### product-data-api.md (273 LOC)
- **jsFunction**: `L26: function expandShortUrl(`
- **externalHost**: `L5: https://data.addlivetag.com/product-data/product-data.php``, `L51: https://s.shopee.com.my/6VCtHgpohc`, `L58: https://s.shopee.com.my/6VCtHgpohc`, `L64: https://s.shopee.com.my/6VCtHgpohc`, `L93: https://shopee.com.my/product/<shop_id>/<item_id>``, `L101: https://data.addlivetag.com/product-data/product-data.php?item_id=8200081234`, `L105: https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.com`, `L109: https://data.addlivetag.com/product-data/product-data.php`, `L132: https://cf.shopee.com.my/file/example`, `L133: https://shopee.com.my/product/334425154/8200081234`, `L256: https://help.shopee.com.my/portal/10/article/124012`, `L267: https://data.addlivetag.com/product-data/product-data.php``
- **curl**: `L29: curl_init`, `L30: curl_setopt_array`, `L40: curl_exec`, `L41: curl_getinfo`, `L42: curl_error`, `L43: curl_close`, `L64: fetch(`

### README.md (258 LOC)
- **graphqlOp**: `L94: shopOfferV2`, `L127: productOfferV2`, `L149: generateShortLink`, `L164: generateShortLink`, `L168: generateShortLink`, `L173: conversionReport`, `L192: validatedReport`
- **authSig**: `L162: SHA256`, `L162: Credential`, `L162: Signature`, `L162: Timestamp`
- **externalHost**: `L5: https://affiliate.shopee.com.my/open_api/list>`, `L42: https://addlivetag.com/shopee-affiliate-api/index.php>`, `L43: https://addlivetag.com/>`, `L50: https://affiliate.shopee.com.my/`, `L74: https://open.shopee.com.my/openapi/product/v2/product_item_get?item_id=123456789`, `L161: https://open-api.affiliate.shopee.com.my/graphql`, `L164: https://shopee.com.my/product/334425154/8200081234\`, `L168: https://shope.ee/5XyZ7WqR`, `L225: https://help.shopee.com.my/portal/webform/99dbea1dc4894accae65f606c2f91af5`
- **subIds**: `L156: subIds`, `L164: subIds`

### COOKIE_AUTH.md (248 LOC)
- **authSig**: `L11: Credential`, `L15: SHA256`, `L15: Credential`, `L15: Timestamp`, `L15: Signature`, `L16: Signature`, `L140: Credential`
- **externalHost**: `L14: https://open-api.affiliate.shopee.com.my/graphql``, `L14: https://shopee.com.my/api/v4/...``, `L60: https://shopee.com.my`, `L78: https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234`, `L81: https://shopee.com.my/`, `L88: https://shopee.com.my/api/v4/example/write`, `L92: https://shopee.com.my/`, `L103: https://shopee.com.my/`, `L108: https://shopee.com.my/api/v4/pdp/get_pc?item_id=8200081234&shop_id=334425154`, `L118: https://shopee.com.my/api/v4/pdp/get_pc?item_id=8200081234&shop_id=334425154`, `L124: https://shopee.com.my/`, `L165: https://shopee.com.my/api/v4/pdp/get_pc?item_id=...&shop_id=...``, `L203: https://shopee.com.my/product/334425154/8200081234`, `L206: https://shopee.com.my/product/334425154/8200081234`
- **curl**: `L107: fetch(`, `L118: curl_init`, `L119: curl_setopt_array`, `L128: curl_exec`
- **dotEnv**: `L21: SHOPEE_API`, `L21: APP_ID`, `L21: SHOPEE_API`, `L21: SECRET`, `L135: SHOPEE_API`, `L135: APP_ID`, `L135: SHOPEE_API`, `L135: SECRET`, `L135: .env`, `L136: .env`, `L141: SHOPEE_API`, `L141: APP_ID`, `L142: SHOPEE_API`, `L142: SECRET`, `L238: .env`, `L238: .env`

### bc-custom-link/index.php (233 LOC)
- **jsFunction**: `L130: function copyToClipboard_1029(`, `L144: function referralCopy(`, `L150: function isValidShopeeUrl(`, `L159: function createLink(`
- **externalHost**: `L22: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css`, `L27: https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js`, `L28: https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js`, `L29: https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js`, `L85: https://shopee.com.my/product/334425154/8200081234`, `L127: https://www.facebook.com/Bcat95/`, `L227: https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js`
- **subIds**: `L93: Sub_id`, `L97: Sub_id`, `L101: Sub_id`, `L105: Sub_id`, `L109: Sub_id`, `L176: Sub_id`, `L177: Sub_id`, `L178: Sub_id`, `L179: Sub_id`, `L180: Sub_id`, `L194: Sub_id`, `L194: Sub_id`, `L195: Sub_id`, `L195: Sub_id`, `L196: Sub_id`, `L196: Sub_id`, `L197: Sub_id`, `L197: Sub_id`, `L198: Sub_id`, `L198: Sub_id`

### docs/reverse-engineering/06-portal-short-link.md (227 LOC)
- **graphqlOp**: `L3: generateShortLink`, `L174: conversionReport`
- **externalHost**: `L115: https://shopee.com.my/product/334425154/8200081234`, `L126: https://shopee.com.my/product/334425154/8200081234`, `L145: https://shopee.com.my/product/334425154/8200081234`, `L151: https://shopee.com.my/product/334425154/8200081234`, `L153: https://shopee.com.my/product/334425154/8200081234`, `L167: https://shp.ee/abc123`
- **subIds**: `L19: subId`, `L20: subId`, `L35: subIds`, `L51: subIds`, `L53: subIds`, `L54: subId`, `L79: subIds`, `L105: subIds`
- **dotEnv**: `L21: .env`, `L139: .env`, `L140: SHOPEE_API`, `L140: APP_ID`, `L141: SHOPEE_API`, `L141: SECRET`

### tools/re-analyzer.js (172 LOC)
- **jsFunction**: `L28: function walk(`, `L41: function readSafe(`, `L64: function analyzeFile(`, `L103: function main(`
- **graphqlOp**: `L53: shopeeOfferV2`, `L53: productOfferV2`, `L53: shopOfferV2`, `L53: brandOfferV2`, `L53: brandOffer`, `L53: generateShortLink`, `L53: conversionReport`, `L53: validatedReport`, `L53: conversionReportV2`, `L53: validationReportV2`
- **authSig**: `L54: SHA256`, `L54: Credential`, `L54: Signature`, `L54: Timestamp`
- **externalHost**: `L163: https://open-api.affiliate.shopee.com.my/graphql\`\n3.`
- **supGlobals**: `L9: $_POST`, `L9: $_GET`, `L163: $_POST`
- **db**: `L58: mysqli`, `L58: pdo`, `L58: INSERT INTO`, `L58: CREATE TABLE`
- **subIds**: `L59: subIds`, `L59: subIds`, `L59: Sub_id`, `L163: subIds`
- **dotEnv**: `L34: .env`, `L60: SHOPEE_API`, `L60: APP_ID`, `L60: SECRET`, `L60: .env`
- **removeParam**: `L61: removeParam`, `L61: removeParam`

### bc-custom-link/func.php (160 LOC)
- **jsFunction**: `L3: function removeParam(`, `L10: function log_shopee_affiliate_link(`, `L27: function get_client_ip(`, `L39: function short_link(`, `L70: function shopee_aff_api(`, `L113: function response(`, `L119: function us_id(`, `L142: function new_us_id(`
- **graphqlOp**: `L41: generateShortLink`, `L59: generateShortLink`, `L59: generateShortLink`, `L60: generateShortLink`
- **authSig**: `L71: Timestamp`, `L73: Timestamp`, `L74: Signature`, `L88: SHA256`, `L88: Credential`, `L88: Timestamp`, `L88: Timestamp`, `L88: Signature`, `L88: Signature`
- **externalHost**: `L78: https://open-api.affiliate.shopee.com.my/graphql`
- **curl**: `L76: curl_init`, `L77: curl_setopt_array`, `L93: curl_exec`, `L95: curl_error`, `L96: curl_close`, `L99: curl_getinfo`, `L100: curl_close`
- **supGlobals**: `L28: $_SERVER`, `L29: $_SERVER`, `L33: $_SERVER`, `L33: $_SERVER`, `L34: $_SERVER`, `L120: $_SESSION`, `L120: $_SESSION`, `L121: $_COOKIE`, `L121: $_COOKIE`, `L124: $_SERVER`, `L124: $_SERVER`, `L125: $_SERVER`, `L125: $_SERVER`, `L144: $_SERVER`, `L144: $_SERVER`, `L145: $_SERVER`, `L145: $_SERVER`
- **db**: `L16: mysqli`, `L18: INSERT INTO`, `L21: mysqli`, `L22: mysqli`, `L23: mysqli`
- **subIds**: `L39: subIds`, `L41: subIds`, `L41: subIds`, `L41: subIds`, `L44: subIds`, `L44: subIds`, `L62: subIds`
- **removeParam**: `L3: removeParam`

### docs/reverse-engineering/03-bc-custom-link-deep-dive.md (139 LOC)
- **jsFunction**: `L46: function removeParam(`
- **graphqlOp**: `L63: generateShortLink`, `L73: generateShortLink`
- **externalHost**: `L43: https://affiliate.shopee.com.my/open_api`, `L134: https://shopee.com.my.evil.com/product/1/1``, `L135: https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil``
- **supGlobals**: `L121: $_SERVER`
- **db**: `L91: INSERT INTO`, `L99: CREATE TABLE`
- **subIds**: `L5: subIds`, `L17: Sub_id`, `L23: Sub_id`, `L24: Sub_id`, `L27: subIds`, `L37: Sub_id`, `L55: subIds`, `L57: subIds`, `L63: subIds`, `L63: subIds`, `L63: subIds`, `L64: subIds`, `L64: subIds`, `L136: Sub_id`
- **removeParam**: `L44: removeParam`, `L44: removeParam`, `L46: removeParam`, `L122: removeParam`

### Code/nodejs/index.test.js (138 LOC)
- **graphqlOp**: `L23: shopeeOfferV2`, `L38: generateShortLink`, `L40: generateShortLink`, `L43: generateShortLink`
- **authSig**: `L20: SHA256`, `L25: Signature`, `L26: createHash("sha256")`, `L34: SHA256`, `L34: Credential`, `L34: Timestamp`, `L34: Signature`, `L34: Signature`
- **externalHost**: `L39: https://shopee.com.my/product/334425154/8200081234`, `L49: https://shopee.com.my`, `L77: https://affiliate.shopee.com.my/api/v1/short_link`, `L82: https://shopee.com.my/product/1/2`, `L90: https://affiliate.shopee.com.my/api/v1/short_link`, `L94: https://shopee.com.my/product/1/2`, `L103: https://shopee.com.my/p`, `L110: https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT`, `L111: https://affiliate.shopee.com.my/api/v1/real`
- **subIds**: `L73: subIds`, `L79: subIds`, `L79: subIds`, `L79: subIds`, `L83: subIds`, `L95: subIds`, `L100: subIds`, `L102: subIds`, `L103: subIds`

### docs/reverse-engineering/04-unofficial-api.md (127 LOC)
- **jsFunction**: `L67: function expandShortUrl(`
- **externalHost**: `L5: https://data.addlivetag.com/product-data/product-data.php`,`, `L20: https://affiliate.shopee.com.my/api/...``, `L20: https://shopee.com.my/api/v4/pdp/get_pc``, `L22: https://shopee.com.my/product/<shopId>/<itemId>``, `L45: https://shopee.com.my/product/334425154/8200081234`, `L48: https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154`, `L51: https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154`, `L53: https://shopee.com.my/`, `L58: https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234`, `L78: https://s.shopee.com.my/6VCtHgpohc`, `L123: https://evil.com`, `L123: https://shopee.com.my.evil.com/product/1/1``
- **curl**: `L68: curl_init`, `L69: curl_setopt_array`, `L75: curl_exec`, `L75: curl_getinfo`, `L75: curl_close`

### tools/trace-signature.js (116 LOC)
- **jsFunction**: `L13: function parseArgs(`, `L27: function buildPayload(`, `L61: function main(`
- **graphqlOp**: `L8: productOfferV2`, `L29: shopeeOfferV2`, `L30: shopeeOfferV2`, `L35: productOfferV2`, `L36: productOfferV2`, `L41: generateShortLink`, `L43: generateShortLink`, `L48: conversionReportV2`, `L50: conversionReport`, `L62: generateShortLink`, `L102: generateShortLink`, `L106: generateShortLink`
- **authSig**: `L64: Signature`, `L74: Timestamp`, `L83: createHash("sha256")`, `L84: Signature`, `L84: SHA256`, `L86: SHA256`, `L88: SHA256`, `L88: Credential`, `L88: Timestamp`, `L88: Signature`, `L111: createHash("sha256")`, `L112: Signature`
- **externalHost**: `L7: https://shopee.com.my/product/334425154/8200081234`, `L62: https://shopee.com.my/product/334425154/8200081234`, `L93: https://open-api.affiliate.shopee.com.my/graphql`
- **subIds**: `L43: subIds`, `L106: subIds`, `L106: subIds`, `L106: subIds`, `L107: subIds`

### docs/reverse-engineering/02-auth-flow.md (114 LOC)
- **jsFunction**: `L12: export function buildAuthorization`
- **jsExport**: `L12: export function buildAuthorization`
- **graphqlOp**: `L58: generateShortLink`, `L65: generateShortLink`, `L100: generateShortLink`, `L101: generateShortLink`
- **authSig**: `L14: createHash("sha256")`, `L15: SHA256`, `L15: Credential`, `L15: Timestamp`, `L15: Signature`, `L22: Timestamp`, `L23: Timestamp`, `L24: Signature`, `L25: SHA256`, `L25: Credential`, `L25: Timestamp`, `L25: Timestamp`, `L25: Signature`, `L25: Signature`, `L41: SHA256`, `L42: SHA256`, `L42: Credential`, `L42: Timestamp`, `L42: Signature`, `L76: SHA256`
- **externalHost**: `L5: https://open-api.affiliate.shopee.com.my/graphql``, `L58: https://shopee.com.my`, `L84: https://shopee.com.my/product/334425154/8200081234`, `L100: https://shopee.com.my/product/334425154/8200081234`, `L101: https://shp.ee/...`
- **subIds**: `L58: subIds`, `L65: subIds`, `L65: subIds`, `L65: subIds`, `L66: subIds`
- **dotEnv**: `L99: SHOPEE_API`, `L99: APP_ID`, `L99: SHOPEE_API`, `L99: SECRET`, `L99: .env`

### Code/nodejs/README.md (94 LOC)
- **graphqlOp**: `L66: shopeeOfferV2`, `L67: brandOfferV2`, `L68: productOfferV2`, `L69: generateShortLink`, `L70: conversionReportV2`, `L71: validationReportV2`, `L76: shopeeOfferV2`, `L77: productOfferV2`, `L78: generateShortLink`, `L79: conversionReportV2`, `L80: validationReportV2`
- **externalHost**: `L43: https://open-api.affiliate.shopee.com.my/graphql`.`, `L45: https://shopee.com.my/api/v4/pdp/get_pc``, `L56: https://shopee.com.my/product/334425154/8200081234`, `L78: https://shopee.com.my/product/334425154/8200081234`, `L85: https://shopee.com.my/product/334425154/8200081234`
- **dotEnv**: `L6: .env`, `L6: .env`, `L11: .env`, `L14: SHOPEE_API`, `L14: APP_ID`, `L15: SHOPEE_API`, `L15: SECRET`, `L24: SHOPEE_API`, `L24: APP_ID`, `L25: SHOPEE_API`, `L25: SECRET`

### Code/php/README.md (86 LOC)
- **graphqlOp**: `L66: shopeeOfferV2`, `L67: brandOfferV2`, `L68: productOfferV2`, `L69: generateShortLink`, `L70: conversionReportV2`, `L71: validationReportV2`, `L76: shopeeOfferV2`, `L77: productOfferV2`, `L78: generateShortLink`, `L79: conversionReportV2`, `L80: validationReportV2`
- **externalHost**: `L43: https://open-api.affiliate.shopee.com.my/graphql`.`, `L45: https://shopee.com.my/api/v4/pdp/get_pc``, `L56: https://shopee.com.my/product/334425154/8200081234`, `L78: https://shopee.com.my/product/334425154/8200081234`, `L84: https://shopee.com.my/product/334425154/8200081234`
- **dotEnv**: `L6: .env`, `L6: .env`, `L11: .env`, `L14: SHOPEE_API`, `L14: APP_ID`, `L15: SHOPEE_API`, `L15: SECRET`, `L24: SHOPEE_API`, `L24: APP_ID`, `L25: SHOPEE_API`, `L25: SECRET`

### Postman/Shopee-Product-Data.postman_collection.json (86 LOC)
- **externalHost**: `L6: https://schema.getpostman.com/json/collection/v2.1.0/collection.json`, `L74: https://data.addlivetag.com/product-data/product-data.php`, `L82: https://shopee.com.my/product/334425154/8200081234`

### docs/reverse-engineering/05-methodology-cheatsheet.md (86 LOC)
- **authSig**: `L38: Signature`
- **db**: `L52: mysqli`
- **dotEnv**: `L15: SECRET`, `L16: .env`

### docs/reverse-engineering/01-repo-map.md (83 LOC)
- **authSig**: `L30: Signature`, `L42: SHA256`
- **externalHost**: `L52: https://shp.ee/...``, `L58: https://data.addlivetag.com/product-data/product-data.php``
- **supGlobals**: `L71: $_POST`
- **subIds**: `L11: subIds`, `L41: subIds`, `L42: subIds`, `L48: subIds`, `L52: subIds`, `L53: subIds`, `L67: subId`, `L68: subId`
- **dotEnv**: `L23: .env`, `L26: .env`, `L42: .env`, `L42: SHOPEE_API`, `L42: APP_ID`, `L42: SHOPEE_API`, `L42: SECRET`

### bc-custom-link/link.php (74 LOC)
- **externalHost**: `L65: https://affiliate.shopee.com.my/open_api`, `L66: https://affiliate.shopee.com.my/open_api`
- **supGlobals**: `L8: $_POST`, `L10: $_POST`, `L18: $_POST`, `L22: $_POST`, `L22: $_POST`, `L25: $_POST`, `L25: $_POST`, `L27: $_POST`, `L27: $_POST`, `L40: $_POST`, `L40: $_POST`, `L57: $_POST`, `L57: $_POST`, `L57: $_POST`, `L58: $_POST`, `L58: $_POST`, `L58: $_POST`, `L59: $_POST`, `L59: $_POST`, `L59: $_POST`
- **subIds**: `L56: subIds`, `L57: Sub_id`, `L57: Sub_id`, `L57: subIds`, `L57: Sub_id`, `L58: Sub_id`, `L58: Sub_id`, `L58: subIds`, `L58: Sub_id`, `L59: Sub_id`, `L59: Sub_id`, `L59: subIds`, `L59: Sub_id`, `L60: Sub_id`, `L60: Sub_id`, `L60: subIds`, `L60: Sub_id`, `L61: Sub_id`, `L61: Sub_id`, `L61: subIds`
- **removeParam**: `L43: removeParam`, `L44: removeParam`

### docs/README.md (32 LOC)
- **authSig**: `L20: SHA256`

### bc-custom-link/README.md (31 LOC)
- **authSig**: `L7: Credential`
- **externalHost**: `L7: https://affiliate.shopee.com.my/open_api>.`, `L10: https://i.imgur.com/Bc6X9ub.png`
- **db**: `L15: CREATE TABLE`

### Postman/Shopee-Product-Data.postman_environment.json (25 LOC)
- **externalHost**: `L7: https://data.addlivetag.com/product-data/product-data.php`, `L17: https://shopee.com.my/product/334425154/8200081234`

### Code/README.md (23 LOC)
- **graphqlOp**: `L22: shopeeOfferV2`, `L22: brandOfferV2`, `L22: productOfferV2`, `L22: generateShortLink`, `L22: conversionReportV2`, `L22: validationReportV2`
- **authSig**: `L13: Credential`
- **dotEnv**: `L11: .env`, `L11: .env`, `L13: SHOPEE_API`, `L13: APP_ID`, `L13: SHOPEE_API`, `L13: SECRET`

### bc-custom-link/conn.php (17 LOC)
- **db**: `L12: mysqli`, `L14: mysqli`

### Code/nodejs/portal-link.template.json (16 LOC)
- **externalHost**: `L5: https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT`, `L9: https://affiliate.shopee.com.my`, `L10: https://affiliate.shopee.com.my/`
- **subIds**: `L2: subIds`, `L2: subIds`, `L14: subIds`, `L14: subIds`

## How to Use This Report

1. Start with files with most functions: `bc-custom-link/func.php`, `Code/nodejs/index.js`
2. Follow host call chain: `bc-custom-link/index.php -> link.php -> func.php -> https://open-api.affiliate.shopee.com.my/graphql`
3. Check auth: search for `authSig`
4. Trace input: search for `supGlobals` ($_POST) + `subIds`
