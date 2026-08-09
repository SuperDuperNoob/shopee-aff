# Auto-Generated Reverse Engineering Report

Generated: 2026-08-09T03:28:13.677Z

## Summary
- Files analyzed: 26
- External hosts: https://open-api.affiliate.shopee.com.my/graphql`., https://shopee.com.my/product/334425154/8200081234, https://open-api.affiliate.shopee.com.my/graphql, https://shopee.com.my, https://schema.getpostman.com/json/collection/v2.1.0/collection.json, https://data.addlivetag.com/product-data/product-data.php, https://affiliate.shopee.com.my/open_api/list>, https://addlivetag.com/shopee-affiliate-api/index.php>, https://addlivetag.com/>, https://affiliate.shopee.com.my/, https://open.shopee.com.my/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654, https://shopee.com.my/product/334425154/8200081234\, https://shope.ee/5XyZ7WqR, https://help.shopee.com.my/portal/webform/99dbea1dc4894accae65f606c2f91af5, https://shopee.com.my/product/334425154/8200081234&Sub_id1=MyTest, https://shopee.com.my/api/v4/item/get?itemid=xxx&shopid=yyy, https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154, https://shopee.com.my/, https://s.shopee.com.my/6VCtHgpohc, https://evil.com, https://shopee.com.my.evil.com, https://open-api.affiliate.shopee.com.my/graphql], https://affiliate.shopee.com.my/open_api>., https://i.imgur.com/Bc6X9ub.png, https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css, https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js, https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js, https://www.facebook.com/Bcat95/, https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js, https://affiliate.shopee.com.my/open_api, https://shp.ee/...`, https://data.addlivetag.com/product-data/product-data.php`, https://open-api.affiliate.shopee.com.my/graphql`, https://shp.ee/..., https://shopee.com.my.evil.com/product/1/1`, https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil`, https://data.addlivetag.com/product-data/product-data.php`,, https://affiliate.shopee.com.my/api/...`, https://shopee.com.my/api/v4/pdp/get_pc`, https://shopee.com.my/product/<shopId>/<itemId>`, https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234, https://shopee.com.my/product/<shop_id>/<item_id>`, https://data.addlivetag.com/product-data/product-data.php?item_id=8200081234, https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.com.my/product/334425154/8200081234, https://cf.shopee.com.my/file/example, https://help.shopee.com.my/portal/10/article/124012, https://open-api.affiliate.shopee.com.my/graphql\`\n3.
- GraphQL ops found: shopeeOfferV2, brandOfferV2, productOfferV2, generateShortLink, conversionReportV2, validationReportV2, brandOffer, conversionReport, validatedReport, shopOfferV2
- Total functions: 31

## Hosts

- `https://open-api.affiliate.shopee.com.my/graphql`.`
- `https://shopee.com.my/product/334425154/8200081234`
- `https://open-api.affiliate.shopee.com.my/graphql`
- `https://shopee.com.my`
- `https://schema.getpostman.com/json/collection/v2.1.0/collection.json`
- `https://data.addlivetag.com/product-data/product-data.php`
- `https://affiliate.shopee.com.my/open_api/list>`
- `https://addlivetag.com/shopee-affiliate-api/index.php>`
- `https://addlivetag.com/>`
- `https://affiliate.shopee.com.my/`
- `https://open.shopee.com.my/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654`
- `https://shopee.com.my/product/334425154/8200081234\`
- `https://shope.ee/5XyZ7WqR`
- `https://help.shopee.com.my/portal/webform/99dbea1dc4894accae65f606c2f91af5`
- `https://shopee.com.my/product/334425154/8200081234&Sub_id1=MyTest`
- `https://shopee.com.my/api/v4/item/get?itemid=xxx&shopid=yyy`
- `https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154`
- `https://shopee.com.my/`
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
- `https://open-api.affiliate.shopee.com.my/graphql``
- `https://shp.ee/...`
- `https://shopee.com.my.evil.com/product/1/1``
- `https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil``
- `https://data.addlivetag.com/product-data/product-data.php`,`
- `https://affiliate.shopee.com.my/api/...``
- `https://shopee.com.my/api/v4/pdp/get_pc``
- `https://shopee.com.my/product/<shopId>/<itemId>``
- `https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234`
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
| REVERSE_ENGINEERING.md | test | 398 |
| product-data-api.md | expandShortUrl | 273 |
| README.md | - | 252 |
| bc-custom-link/index.php | copyToClipboard_1029, referralCopy, isValidShopeeUrl, createLink | 233 |
| tools/re-analyzer.js | walk, readSafe, analyzeFile, main | 172 |
| Code/php/index.php | loadEnv, buildPayload, callShopeeApi | 166 |
| bc-custom-link/func.php | removeParam, log_shopee_affiliate_link, get_client_ip, short_link, shopee_aff_api, response, us_id, new_us_id | 160 |
| Code/nodejs/index.js | loadEnv, buildPayload, buildAuthorization, callShopeeApi | 153 |
| docs/reverse-engineering/03-bc-custom-link-deep-dive.md | removeParam | 139 |
| docs/reverse-engineering/04-unofficial-api.md | expandShortUrl | 127 |
| tools/trace-signature.js | parseArgs, buildPayload, main | 116 |
| docs/reverse-engineering/02-auth-flow.md | buildAuthorization | 114 |
| Postman/Shopee-Product-Data.postman_collection.json | - | 86 |
| docs/reverse-engineering/05-methodology-cheatsheet.md | - | 86 |
| bc-custom-link/link.php | - | 74 |
| docs/reverse-engineering/01-repo-map.md | - | 70 |
| Code/nodejs/README.md | - | 49 |
| Code/php/README.md | - | 42 |
| Code/nodejs/index.test.js | - | 40 |
| bc-custom-link/README.md | - | 31 |
| docs/README.md | - | 31 |
| Postman/Shopee-Product-Data.postman_environment.json | - | 25 |
| Code/README.md | - | 22 |
| bc-custom-link/conn.php | - | 17 |
| docs/reverse-engineering/README.md | - | 15 |
| Code/nodejs/package.json | - | 13 |

## Detailed Matches (Potential Security / Flow)


### REVERSE_ENGINEERING.md (398 LOC)
- **jsFunction**: `L172: function test(`
- **graphqlOp**: `L134: shopeeOfferV2`, `L173: shopeeOfferV2`, `L346: conversionReport`, `L346: validatedReport`, `L357: shopeeOfferV2`, `L357: productOfferV2`, `L357: generateShortLink`, `L357: conversionReport`, `L357: validatedReport`
- **authSig**: `L18: SHA256`, `L56: Credential`, `L106: Signature`, `L106: SHA256`, `L108: SHA256`, `L108: Credential`, `L108: Timestamp`, `L108: Signature`, `L157: Signature`, `L160: Timestamp`, `L163: Signature`, `L163: SHA256`, `L164: SHA256`, `L164: Credential`, `L164: Timestamp`, `L164: Signature`, `L174: createHash("sha256")`, `L175: SHA256`, `L175: Credential`, `L175: Timestamp`
- **externalHost**: `L17: https://open-api.affiliate.shopee.com.my/graphql`, `L25: https://data.addlivetag.com/product-data/product-data.php`, `L107: https://open-api.affiliate.shopee.com.my/graphql`, `L123: https://shopee.com.my/product/334425154/8200081234&Sub_id1=MyTest`, `L217: https://shopee.com.my/api/v4/item/get?itemid=xxx&shopid=yyy`, `L220: https://shopee.com.my/api/v4/item/get?itemid=8200081234&shopid=334425154`, `L223: https://shopee.com.my/`, `L226: https://s.shopee.com.my/6VCtHgpohc`, `L239: https://evil.com`, `L239: https://shopee.com.my.evil.com`, `L263: https://shopee.com.my/product/334425154/8200081234`, `L292: https://open-api.affiliate.shopee.com.my/graphql]`
- **supGlobals**: `L87: $_POST`, `L87: $_GET`, `L363: $_POST`, `L363: $_GET`
- **db**: `L109: mysqli`, `L333: mysqli`, `L333: mysqli`, `L363: mysqli`
- **subIds**: `L32: subIds`, `L97: Sub_id`, `L102: subIds`, `L104: subIds`, `L123: Sub_id`, `L149: Sub_id`, `L149: Sub_id`, `L151: Sub_id`, `L151: Sub_id`, `L359: subIds`, `L360: Sub_id`, `L360: subIds`
- **dotEnv**: `L35: .env`, `L56: SECRET`, `L56: .env`, `L132: .env`, `L132: .env`, `L133: .env`
- **removeParam**: `L100: removeParam`, `L345: removeParam`

### product-data-api.md (273 LOC)
- **jsFunction**: `L26: function expandShortUrl(`
- **externalHost**: `L5: https://data.addlivetag.com/product-data/product-data.php``, `L51: https://s.shopee.com.my/6VCtHgpohc`, `L58: https://s.shopee.com.my/6VCtHgpohc`, `L64: https://s.shopee.com.my/6VCtHgpohc`, `L93: https://shopee.com.my/product/<shop_id>/<item_id>``, `L101: https://data.addlivetag.com/product-data/product-data.php?item_id=8200081234`, `L105: https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.com`, `L109: https://data.addlivetag.com/product-data/product-data.php`, `L132: https://cf.shopee.com.my/file/example`, `L133: https://shopee.com.my/product/334425154/8200081234`, `L256: https://help.shopee.com.my/portal/10/article/124012`, `L267: https://data.addlivetag.com/product-data/product-data.php``
- **curl**: `L29: curl_init`, `L30: curl_setopt_array`, `L40: curl_exec`, `L41: curl_getinfo`, `L42: curl_error`, `L43: curl_close`, `L64: fetch(`

### README.md (252 LOC)
- **graphqlOp**: `L88: shopOfferV2`, `L121: productOfferV2`, `L143: generateShortLink`, `L158: generateShortLink`, `L162: generateShortLink`, `L167: conversionReport`, `L186: validatedReport`
- **authSig**: `L156: SHA256`, `L156: Credential`, `L156: Signature`, `L156: Timestamp`
- **externalHost**: `L5: https://affiliate.shopee.com.my/open_api/list>`, `L38: https://addlivetag.com/shopee-affiliate-api/index.php>`, `L39: https://addlivetag.com/>`, `L46: https://affiliate.shopee.com.my/`, `L68: https://open.shopee.com.my/openapi/product/v2/product_item_get?item_id=123456789`, `L155: https://open-api.affiliate.shopee.com.my/graphql`, `L158: https://shopee.com.my/product/334425154/8200081234\`, `L162: https://shope.ee/5XyZ7WqR`, `L219: https://help.shopee.com.my/portal/webform/99dbea1dc4894accae65f606c2f91af5`
- **subIds**: `L150: subIds`, `L158: subIds`

### bc-custom-link/index.php (233 LOC)
- **jsFunction**: `L130: function copyToClipboard_1029(`, `L144: function referralCopy(`, `L150: function isValidShopeeUrl(`, `L159: function createLink(`
- **externalHost**: `L22: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css`, `L27: https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js`, `L28: https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js`, `L29: https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js`, `L85: https://shopee.com.my/product/334425154/8200081234`, `L127: https://www.facebook.com/Bcat95/`, `L227: https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js`
- **subIds**: `L93: Sub_id`, `L97: Sub_id`, `L101: Sub_id`, `L105: Sub_id`, `L109: Sub_id`, `L176: Sub_id`, `L177: Sub_id`, `L178: Sub_id`, `L179: Sub_id`, `L180: Sub_id`, `L194: Sub_id`, `L194: Sub_id`, `L195: Sub_id`, `L195: Sub_id`, `L196: Sub_id`, `L196: Sub_id`, `L197: Sub_id`, `L197: Sub_id`, `L198: Sub_id`, `L198: Sub_id`

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

### Code/php/index.php (166 LOC)
- **jsFunction**: `L7: function loadEnv(`, `L38: function buildPayload(`, `L104: function callShopeeApi(`, `L123: httpCode = (`
- **graphqlOp**: `L40: shopeeOfferV2`, `L44: shopeeOfferV2`, `L46: shopeeOfferV2`, `L52: brandOfferV2`, `L54: brandOffer`, `L60: productOfferV2`, `L62: productOfferV2`, `L68: generateShortLink`, `L70: generateShortLink`, `L75: conversionReportV2`, `L77: conversionReport`, `L83: validationReportV2`, `L85: validatedReport`, `L153: shopeeOfferV2`, `L163: generateShortLink`
- **authSig**: `L117: SHA256`, `L117: Credential`, `L117: Timestamp`, `L117: Signature`
- **externalHost**: `L5: https://open-api.affiliate.shopee.com.my/graphql`, `L41: https://shopee.com.my`
- **curl**: `L110: curl_init`, `L111: curl_setopt_array`, `L122: curl_exec`, `L123: curl_getinfo`, `L124: curl_error`, `L125: curl_close`
- **subIds**: `L70: subIds`
- **dotEnv**: `L10: .env`, `L10: .env`, `L10: .env`, `L16: .env`, `L143: .env`, `L144: SHOPEE_API`, `L144: APP_ID`, `L145: SHOPEE_API`, `L145: SECRET`, `L148: SHOPEE_API`, `L148: APP_ID`, `L148: SHOPEE_API`, `L148: SECRET`, `L148: .env`

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

### Code/nodejs/index.js (153 LOC)
- **jsFunction**: `L10: export function loadEnv`, `L34: export function buildPayload`, `L93: export function buildAuthorization`, `L99: function callShopeeApi(`
- **jsExport**: `L10: export function loadEnv`, `L34: export function buildPayload`, `L93: export function buildAuthorization`
- **graphqlOp**: `L36: shopeeOfferV2`, `L38: shopeeOfferV2`, `L44: brandOfferV2`, `L46: brandOffer`, `L52: productOfferV2`, `L54: productOfferV2`, `L60: generateShortLink`, `L62: generateShortLink`, `L67: conversionReportV2`, `L69: conversionReport`, `L75: validationReportV2`, `L77: validatedReport`, `L108: shopeeOfferV2`, `L144: generateShortLink`
- **authSig**: `L95: createHash("sha256")`, `L96: SHA256`, `L96: Credential`, `L96: Timestamp`, `L96: Signature`
- **externalHost**: `L6: https://open-api.affiliate.shopee.com.my/graphql`, `L109: https://shopee.com.my`
- **curl**: `L114: fetch(`
- **subIds**: `L62: subIds`
- **dotEnv**: `L12: .env`, `L12: .env`, `L12: .env`, `L100: .env`, `L101: SHOPEE_API`, `L101: APP_ID`, `L102: SHOPEE_API`, `L102: SECRET`, `L105: SHOPEE_API`, `L105: APP_ID`, `L105: SHOPEE_API`, `L105: SECRET`, `L105: .env`

### docs/reverse-engineering/03-bc-custom-link-deep-dive.md (139 LOC)
- **jsFunction**: `L46: function removeParam(`
- **graphqlOp**: `L63: generateShortLink`, `L73: generateShortLink`
- **externalHost**: `L43: https://affiliate.shopee.com.my/open_api`, `L134: https://shopee.com.my.evil.com/product/1/1``, `L135: https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil``
- **supGlobals**: `L121: $_SERVER`
- **db**: `L91: INSERT INTO`, `L99: CREATE TABLE`
- **subIds**: `L5: subIds`, `L17: Sub_id`, `L23: Sub_id`, `L24: Sub_id`, `L27: subIds`, `L37: Sub_id`, `L55: subIds`, `L57: subIds`, `L63: subIds`, `L63: subIds`, `L63: subIds`, `L64: subIds`, `L64: subIds`, `L136: Sub_id`
- **removeParam**: `L44: removeParam`, `L44: removeParam`, `L46: removeParam`, `L122: removeParam`

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

### Postman/Shopee-Product-Data.postman_collection.json (86 LOC)
- **externalHost**: `L6: https://schema.getpostman.com/json/collection/v2.1.0/collection.json`, `L74: https://data.addlivetag.com/product-data/product-data.php`, `L82: https://shopee.com.my/product/334425154/8200081234`

### docs/reverse-engineering/05-methodology-cheatsheet.md (86 LOC)
- **authSig**: `L38: Signature`
- **db**: `L52: mysqli`
- **dotEnv**: `L15: SECRET`, `L16: .env`

### bc-custom-link/link.php (74 LOC)
- **externalHost**: `L65: https://affiliate.shopee.com.my/open_api`, `L66: https://affiliate.shopee.com.my/open_api`
- **supGlobals**: `L8: $_POST`, `L10: $_POST`, `L18: $_POST`, `L22: $_POST`, `L22: $_POST`, `L25: $_POST`, `L25: $_POST`, `L27: $_POST`, `L27: $_POST`, `L40: $_POST`, `L40: $_POST`, `L57: $_POST`, `L57: $_POST`, `L57: $_POST`, `L58: $_POST`, `L58: $_POST`, `L58: $_POST`, `L59: $_POST`, `L59: $_POST`, `L59: $_POST`
- **subIds**: `L56: subIds`, `L57: Sub_id`, `L57: Sub_id`, `L57: subIds`, `L57: Sub_id`, `L58: Sub_id`, `L58: Sub_id`, `L58: subIds`, `L58: Sub_id`, `L59: Sub_id`, `L59: Sub_id`, `L59: subIds`, `L59: Sub_id`, `L60: Sub_id`, `L60: Sub_id`, `L60: subIds`, `L60: Sub_id`, `L61: Sub_id`, `L61: Sub_id`, `L61: subIds`
- **removeParam**: `L43: removeParam`, `L44: removeParam`

### docs/reverse-engineering/01-repo-map.md (70 LOC)
- **authSig**: `L35: SHA256`
- **externalHost**: `L40: https://shp.ee/...``, `L46: https://data.addlivetag.com/product-data/product-data.php``
- **supGlobals**: `L58: $_POST`
- **subIds**: `L11: subIds`, `L40: subIds`, `L41: subIds`
- **dotEnv**: `L22: .env`, `L25: .env`, `L35: .env`

### Code/nodejs/README.md (49 LOC)
- **graphqlOp**: `L26: shopeeOfferV2`, `L27: brandOfferV2`, `L28: productOfferV2`, `L29: generateShortLink`, `L30: conversionReportV2`, `L31: validationReportV2`, `L36: shopeeOfferV2`, `L37: productOfferV2`, `L38: generateShortLink`, `L39: conversionReportV2`, `L40: validationReportV2`
- **externalHost**: `L22: https://open-api.affiliate.shopee.com.my/graphql`.`, `L38: https://shopee.com.my/product/334425154/8200081234`
- **dotEnv**: `L6: .env`, `L6: .env`, `L9: .env`, `L12: SHOPEE_API`, `L12: APP_ID`, `L13: SHOPEE_API`, `L13: SECRET`

### Code/php/README.md (42 LOC)
- **graphqlOp**: `L26: shopeeOfferV2`, `L27: brandOfferV2`, `L28: productOfferV2`, `L29: generateShortLink`, `L30: conversionReportV2`, `L31: validationReportV2`, `L36: shopeeOfferV2`, `L37: productOfferV2`, `L38: generateShortLink`, `L39: conversionReportV2`, `L40: validationReportV2`
- **externalHost**: `L22: https://open-api.affiliate.shopee.com.my/graphql`.`, `L38: https://shopee.com.my/product/334425154/8200081234`
- **dotEnv**: `L6: .env`, `L6: .env`, `L9: .env`, `L12: SHOPEE_API`, `L12: APP_ID`, `L13: SHOPEE_API`, `L13: SECRET`

### Code/nodejs/index.test.js (40 LOC)
- **graphqlOp**: `L10: shopeeOfferV2`, `L25: generateShortLink`, `L27: generateShortLink`, `L30: generateShortLink`
- **authSig**: `L7: SHA256`, `L12: Signature`, `L13: createHash("sha256")`, `L21: SHA256`, `L21: Credential`, `L21: Timestamp`, `L21: Signature`, `L21: Signature`
- **externalHost**: `L26: https://shopee.com.my/product/334425154/8200081234`, `L36: https://shopee.com.my`

### bc-custom-link/README.md (31 LOC)
- **authSig**: `L7: Credential`
- **externalHost**: `L7: https://affiliate.shopee.com.my/open_api>.`, `L10: https://i.imgur.com/Bc6X9ub.png`
- **db**: `L15: CREATE TABLE`

### docs/README.md (31 LOC)
- **authSig**: `L19: SHA256`

### Postman/Shopee-Product-Data.postman_environment.json (25 LOC)
- **externalHost**: `L7: https://data.addlivetag.com/product-data/product-data.php`, `L17: https://shopee.com.my/product/334425154/8200081234`

### Code/README.md (22 LOC)
- **graphqlOp**: `L21: shopeeOfferV2`, `L21: brandOfferV2`, `L21: productOfferV2`, `L21: generateShortLink`, `L21: conversionReportV2`, `L21: validationReportV2`
- **dotEnv**: `L11: .env`, `L11: .env`, `L13: SHOPEE_API`, `L13: APP_ID`, `L14: SHOPEE_API`, `L14: SECRET`

### bc-custom-link/conn.php (17 LOC)
- **db**: `L12: mysqli`, `L14: mysqli`

## How to Use This Report

1. Start with files with most functions: `bc-custom-link/func.php`, `Code/nodejs/index.js`
2. Follow host call chain: `bc-custom-link/index.php -> link.php -> func.php -> https://open-api.affiliate.shopee.com.my/graphql`
3. Check auth: search for `authSig`
4. Trace input: search for `supGlobals` ($_POST) + `subIds`
