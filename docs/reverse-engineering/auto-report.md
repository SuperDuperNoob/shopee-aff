# Auto-Generated Reverse Engineering Report

Generated: 2026-08-09T02:52:28.516Z

## Summary
- Files analyzed: 25
- External hosts: https://open-api.affiliate.shopee.vn/graphql`., https://shopee.vn/product/38003654/1589295236, https://open-api.affiliate.shopee.vn/graphql, https://shopee.vn, https://schema.getpostman.com/json/collection/v2.1.0/collection.json, https://data.addlivetag.com/product-data/product-data.php, https://affiliate.shopee.vn/open_api/list>, https://addlivetag.com/shopee-affiliate-api/index.php>, https://addlivetag.com/>, https://affiliate.shopee.vn/, https://open.shopee.vn/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654, https://shopee.vn/product/52377417/6309028319\, https://shope.ee/5XyZ7WqR, https://help.shopee.vn/portal/webform/c2d6ebc5a2d64dd1b26f8c871730cdbd, https://shopee.vn/product/38003654/1589295236&Sub_id1=MyTest, https://shopee.vn/api/v4/item/get?itemid=xxx&shopid=yyy, https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654, https://shopee.vn/, https://s.shopee.vn/4VU2IjQjPF, https://evil.com, https://shopee.vn.evil.com, https://open-api.affiliate.shopee.vn/graphql], https://affiliate.shopee.vn/open_api>., https://i.imgur.com/Bc6X9ub.png, https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css, https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js, https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js, https://shopee.vn/m/world-milk-day/, https://www.facebook.com/Bcat95/, https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js, https://affiliate.shopee.vn/open_api, https://shp.ee/...`, https://data.addlivetag.com/product-data/product-data.php`, https://open-api.affiliate.shopee.vn/graphql`, https://shp.ee/..., https://shopee.vn.evil.com/product/1/1`, https://shopee.vn/product/1/1?sp_atk=evil&xptdk=evil`, https://data.addlivetag.com/product-data/product-data.php`,, https://affiliate.shopee.vn/api/...`, https://shopee.vn/api/v4/pdp/get_pc`, https://shopee.vn/product/<shopId>/<itemId>`, https://shopee.vn/api/v4/pdp/get_pc?shop_id=38003654&item_id=1589295236, https://shopee.vn/product/<shop_id>/<item_id>`, https://data.addlivetag.com/product-data/product-data.php?item_id=1589295236, https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.vn/product/38003654/1589295236, https://cf.shopee.vn/file/example, https://open-api.affiliate.shopee.vn/graphql\`\n3.
- GraphQL ops found: shopeeOfferV2, brandOfferV2, productOfferV2, generateShortLink, conversionReportV2, validationReportV2, brandOffer, conversionReport, validatedReport, shopOfferV2
- Total functions: 31

## Hosts

- `https://open-api.affiliate.shopee.vn/graphql`.`
- `https://shopee.vn/product/38003654/1589295236`
- `https://open-api.affiliate.shopee.vn/graphql`
- `https://shopee.vn`
- `https://schema.getpostman.com/json/collection/v2.1.0/collection.json`
- `https://data.addlivetag.com/product-data/product-data.php`
- `https://affiliate.shopee.vn/open_api/list>`
- `https://addlivetag.com/shopee-affiliate-api/index.php>`
- `https://addlivetag.com/>`
- `https://affiliate.shopee.vn/`
- `https://open.shopee.vn/openapi/product/v2/product_item_get?item_id=123456789&shop_id=987654`
- `https://shopee.vn/product/52377417/6309028319\`
- `https://shope.ee/5XyZ7WqR`
- `https://help.shopee.vn/portal/webform/c2d6ebc5a2d64dd1b26f8c871730cdbd`
- `https://shopee.vn/product/38003654/1589295236&Sub_id1=MyTest`
- `https://shopee.vn/api/v4/item/get?itemid=xxx&shopid=yyy`
- `https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654`
- `https://shopee.vn/`
- `https://s.shopee.vn/4VU2IjQjPF`
- `https://evil.com`
- `https://shopee.vn.evil.com`
- `https://open-api.affiliate.shopee.vn/graphql]`
- `https://affiliate.shopee.vn/open_api>.`
- `https://i.imgur.com/Bc6X9ub.png`
- `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css`
- `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js`
- `https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js`
- `https://shopee.vn/m/world-milk-day/`
- `https://www.facebook.com/Bcat95/`
- `https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js`
- `https://affiliate.shopee.vn/open_api`
- `https://shp.ee/...``
- `https://data.addlivetag.com/product-data/product-data.php``
- `https://open-api.affiliate.shopee.vn/graphql``
- `https://shp.ee/...`
- `https://shopee.vn.evil.com/product/1/1``
- `https://shopee.vn/product/1/1?sp_atk=evil&xptdk=evil``
- `https://data.addlivetag.com/product-data/product-data.php`,`
- `https://affiliate.shopee.vn/api/...``
- `https://shopee.vn/api/v4/pdp/get_pc``
- `https://shopee.vn/product/<shopId>/<itemId>``
- `https://shopee.vn/api/v4/pdp/get_pc?shop_id=38003654&item_id=1589295236`
- `https://shopee.vn/product/<shop_id>/<item_id>``
- `https://data.addlivetag.com/product-data/product-data.php?item_id=1589295236`
- `https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.vn/product/38003654/1589295236`
- `https://cf.shopee.vn/file/example`
- `https://open-api.affiliate.shopee.vn/graphql\`\n3.`

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
| product-data-api.md | expandShortUrl | 271 |
| README.md | - | 248 |
| bc-custom-link/index.php | copyToClipboard_1029, referralCopy, isValidShopeeUrl, createLink | 233 |
| tools/re-analyzer.js | walk, readSafe, analyzeFile, main | 171 |
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
- **externalHost**: `L17: https://open-api.affiliate.shopee.vn/graphql`, `L25: https://data.addlivetag.com/product-data/product-data.php`, `L107: https://open-api.affiliate.shopee.vn/graphql`, `L123: https://shopee.vn/product/38003654/1589295236&Sub_id1=MyTest`, `L217: https://shopee.vn/api/v4/item/get?itemid=xxx&shopid=yyy`, `L220: https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654`, `L223: https://shopee.vn/`, `L226: https://s.shopee.vn/4VU2IjQjPF`, `L239: https://evil.com`, `L239: https://shopee.vn.evil.com`, `L263: https://shopee.vn/product/38003654/1589295236`, `L292: https://open-api.affiliate.shopee.vn/graphql]`
- **supGlobals**: `L87: $_POST`, `L87: $_GET`, `L363: $_POST`, `L363: $_GET`
- **db**: `L109: mysqli`, `L333: mysqli`, `L333: mysqli`, `L363: mysqli`
- **subIds**: `L32: subIds`, `L97: Sub_id`, `L102: subIds`, `L104: subIds`, `L123: Sub_id`, `L149: Sub_id`, `L149: Sub_id`, `L151: Sub_id`, `L151: Sub_id`, `L359: subIds`, `L360: Sub_id`, `L360: subIds`
- **dotEnv**: `L35: .env`, `L56: SECRET`, `L56: .env`, `L132: .env`, `L132: .env`, `L133: .env`
- **removeParam**: `L100: removeParam`, `L345: removeParam`

### product-data-api.md (271 LOC)
- **jsFunction**: `L26: function expandShortUrl(`
- **externalHost**: `L5: https://data.addlivetag.com/product-data/product-data.php``, `L51: https://s.shopee.vn/4VU2IjQjPF`, `L58: https://s.shopee.vn/4VU2IjQjPF`, `L64: https://s.shopee.vn/4VU2IjQjPF`, `L93: https://shopee.vn/product/<shop_id>/<item_id>``, `L101: https://data.addlivetag.com/product-data/product-data.php?item_id=1589295236`, `L105: https://data.addlivetag.com/product-data/product-data.php?url=https://shopee.vn/`, `L109: https://data.addlivetag.com/product-data/product-data.php`, `L130: https://cf.shopee.vn/file/example`, `L131: https://shopee.vn/product/38003654/1589295236`, `L265: https://data.addlivetag.com/product-data/product-data.php``
- **curl**: `L29: curl_init`, `L30: curl_setopt_array`, `L40: curl_exec`, `L41: curl_getinfo`, `L42: curl_error`, `L43: curl_close`, `L64: fetch(`

### README.md (248 LOC)
- **graphqlOp**: `L84: shopOfferV2`, `L117: productOfferV2`, `L139: generateShortLink`, `L154: generateShortLink`, `L158: generateShortLink`, `L163: conversionReport`, `L182: validatedReport`
- **authSig**: `L152: SHA256`, `L152: Credential`, `L152: Signature`, `L152: Timestamp`
- **externalHost**: `L5: https://affiliate.shopee.vn/open_api/list>`, `L34: https://addlivetag.com/shopee-affiliate-api/index.php>`, `L35: https://addlivetag.com/>`, `L42: https://affiliate.shopee.vn/`, `L64: https://open.shopee.vn/openapi/product/v2/product_item_get?item_id=123456789&sho`, `L151: https://open-api.affiliate.shopee.vn/graphql`, `L154: https://shopee.vn/product/52377417/6309028319\`, `L158: https://shope.ee/5XyZ7WqR`, `L215: https://help.shopee.vn/portal/webform/c2d6ebc5a2d64dd1b26f8c871730cdbd`
- **subIds**: `L146: subIds`, `L154: subIds`

### bc-custom-link/index.php (233 LOC)
- **jsFunction**: `L130: function copyToClipboard_1029(`, `L144: function referralCopy(`, `L150: function isValidShopeeUrl(`, `L159: function createLink(`
- **externalHost**: `L22: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css`, `L27: https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js`, `L28: https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js`, `L29: https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js`, `L85: https://shopee.vn/m/world-milk-day/`, `L127: https://www.facebook.com/Bcat95/`, `L227: https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js`
- **subIds**: `L93: Sub_id`, `L97: Sub_id`, `L101: Sub_id`, `L105: Sub_id`, `L109: Sub_id`, `L176: Sub_id`, `L177: Sub_id`, `L178: Sub_id`, `L179: Sub_id`, `L180: Sub_id`, `L194: Sub_id`, `L194: Sub_id`, `L195: Sub_id`, `L195: Sub_id`, `L196: Sub_id`, `L196: Sub_id`, `L197: Sub_id`, `L197: Sub_id`, `L198: Sub_id`, `L198: Sub_id`

### tools/re-analyzer.js (171 LOC)
- **jsFunction**: `L27: function walk(`, `L40: function readSafe(`, `L63: function analyzeFile(`, `L102: function main(`
- **graphqlOp**: `L52: shopeeOfferV2`, `L52: productOfferV2`, `L52: shopOfferV2`, `L52: brandOfferV2`, `L52: brandOffer`, `L52: generateShortLink`, `L52: conversionReport`, `L52: validatedReport`, `L52: conversionReportV2`, `L52: validationReportV2`
- **authSig**: `L53: SHA256`, `L53: Credential`, `L53: Signature`, `L53: Timestamp`
- **externalHost**: `L162: https://open-api.affiliate.shopee.vn/graphql\`\n3.`
- **supGlobals**: `L9: $_POST`, `L9: $_GET`, `L162: $_POST`
- **db**: `L57: mysqli`, `L57: pdo`, `L57: INSERT INTO`, `L57: CREATE TABLE`
- **subIds**: `L58: subIds`, `L58: subIds`, `L58: Sub_id`, `L162: subIds`
- **dotEnv**: `L33: .env`, `L59: SHOPEE_API`, `L59: APP_ID`, `L59: SECRET`, `L59: .env`
- **removeParam**: `L60: removeParam`, `L60: removeParam`

### Code/php/index.php (166 LOC)
- **jsFunction**: `L7: function loadEnv(`, `L38: function buildPayload(`, `L104: function callShopeeApi(`, `L123: httpCode = (`
- **graphqlOp**: `L40: shopeeOfferV2`, `L44: shopeeOfferV2`, `L46: shopeeOfferV2`, `L52: brandOfferV2`, `L54: brandOffer`, `L60: productOfferV2`, `L62: productOfferV2`, `L68: generateShortLink`, `L70: generateShortLink`, `L75: conversionReportV2`, `L77: conversionReport`, `L83: validationReportV2`, `L85: validatedReport`, `L153: shopeeOfferV2`, `L163: generateShortLink`
- **authSig**: `L117: SHA256`, `L117: Credential`, `L117: Timestamp`, `L117: Signature`
- **externalHost**: `L5: https://open-api.affiliate.shopee.vn/graphql`, `L41: https://shopee.vn`
- **curl**: `L110: curl_init`, `L111: curl_setopt_array`, `L122: curl_exec`, `L123: curl_getinfo`, `L124: curl_error`, `L125: curl_close`
- **subIds**: `L70: subIds`
- **dotEnv**: `L10: .env`, `L10: .env`, `L10: .env`, `L16: .env`, `L143: .env`, `L144: SHOPEE_API`, `L144: APP_ID`, `L145: SHOPEE_API`, `L145: SECRET`, `L148: SHOPEE_API`, `L148: APP_ID`, `L148: SHOPEE_API`, `L148: SECRET`, `L148: .env`

### bc-custom-link/func.php (160 LOC)
- **jsFunction**: `L3: function removeParam(`, `L10: function log_shopee_affiliate_link(`, `L27: function get_client_ip(`, `L39: function short_link(`, `L70: function shopee_aff_api(`, `L113: function response(`, `L119: function us_id(`, `L142: function new_us_id(`
- **graphqlOp**: `L41: generateShortLink`, `L59: generateShortLink`, `L59: generateShortLink`, `L60: generateShortLink`
- **authSig**: `L71: Timestamp`, `L73: Timestamp`, `L74: Signature`, `L88: SHA256`, `L88: Credential`, `L88: Timestamp`, `L88: Timestamp`, `L88: Signature`, `L88: Signature`
- **externalHost**: `L78: https://open-api.affiliate.shopee.vn/graphql`
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
- **externalHost**: `L6: https://open-api.affiliate.shopee.vn/graphql`, `L109: https://shopee.vn`
- **curl**: `L114: fetch(`
- **subIds**: `L62: subIds`
- **dotEnv**: `L12: .env`, `L12: .env`, `L12: .env`, `L100: .env`, `L101: SHOPEE_API`, `L101: APP_ID`, `L102: SHOPEE_API`, `L102: SECRET`, `L105: SHOPEE_API`, `L105: APP_ID`, `L105: SHOPEE_API`, `L105: SECRET`, `L105: .env`

### docs/reverse-engineering/03-bc-custom-link-deep-dive.md (139 LOC)
- **jsFunction**: `L46: function removeParam(`
- **graphqlOp**: `L63: generateShortLink`, `L73: generateShortLink`
- **externalHost**: `L43: https://affiliate.shopee.vn/open_api`, `L134: https://shopee.vn.evil.com/product/1/1``, `L135: https://shopee.vn/product/1/1?sp_atk=evil&xptdk=evil``
- **supGlobals**: `L121: $_SERVER`
- **db**: `L91: INSERT INTO`, `L99: CREATE TABLE`
- **subIds**: `L5: subIds`, `L17: Sub_id`, `L23: Sub_id`, `L24: Sub_id`, `L27: subIds`, `L37: Sub_id`, `L55: subIds`, `L57: subIds`, `L63: subIds`, `L63: subIds`, `L63: subIds`, `L64: subIds`, `L64: subIds`, `L136: Sub_id`
- **removeParam**: `L44: removeParam`, `L44: removeParam`, `L46: removeParam`, `L122: removeParam`

### docs/reverse-engineering/04-unofficial-api.md (127 LOC)
- **jsFunction**: `L67: function expandShortUrl(`
- **externalHost**: `L5: https://data.addlivetag.com/product-data/product-data.php`,`, `L20: https://affiliate.shopee.vn/api/...``, `L20: https://shopee.vn/api/v4/pdp/get_pc``, `L22: https://shopee.vn/product/<shopId>/<itemId>``, `L45: https://shopee.vn/product/38003654/1589295236`, `L48: https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654`, `L51: https://shopee.vn/api/v4/item/get?itemid=1589295236&shopid=38003654`, `L53: https://shopee.vn/`, `L58: https://shopee.vn/api/v4/pdp/get_pc?shop_id=38003654&item_id=1589295236`, `L78: https://s.shopee.vn/4VU2IjQjPF`, `L123: https://evil.com`, `L123: https://shopee.vn.evil.com/product/1/1``
- **curl**: `L68: curl_init`, `L69: curl_setopt_array`, `L75: curl_exec`, `L75: curl_getinfo`, `L75: curl_close`

### tools/trace-signature.js (116 LOC)
- **jsFunction**: `L13: function parseArgs(`, `L27: function buildPayload(`, `L61: function main(`
- **graphqlOp**: `L8: productOfferV2`, `L29: shopeeOfferV2`, `L30: shopeeOfferV2`, `L35: productOfferV2`, `L36: productOfferV2`, `L41: generateShortLink`, `L43: generateShortLink`, `L48: conversionReportV2`, `L50: conversionReport`, `L62: generateShortLink`, `L102: generateShortLink`, `L106: generateShortLink`
- **authSig**: `L64: Signature`, `L74: Timestamp`, `L83: createHash("sha256")`, `L84: Signature`, `L84: SHA256`, `L86: SHA256`, `L88: SHA256`, `L88: Credential`, `L88: Timestamp`, `L88: Signature`, `L111: createHash("sha256")`, `L112: Signature`
- **externalHost**: `L7: https://shopee.vn/product/38003654/1589295236`, `L62: https://shopee.vn/product/38003654/1589295236`, `L93: https://open-api.affiliate.shopee.vn/graphql`
- **subIds**: `L43: subIds`, `L106: subIds`, `L106: subIds`, `L106: subIds`, `L107: subIds`

### docs/reverse-engineering/02-auth-flow.md (114 LOC)
- **jsFunction**: `L12: export function buildAuthorization`
- **jsExport**: `L12: export function buildAuthorization`
- **graphqlOp**: `L58: generateShortLink`, `L65: generateShortLink`, `L100: generateShortLink`, `L101: generateShortLink`
- **authSig**: `L14: createHash("sha256")`, `L15: SHA256`, `L15: Credential`, `L15: Timestamp`, `L15: Signature`, `L22: Timestamp`, `L23: Timestamp`, `L24: Signature`, `L25: SHA256`, `L25: Credential`, `L25: Timestamp`, `L25: Timestamp`, `L25: Signature`, `L25: Signature`, `L41: SHA256`, `L42: SHA256`, `L42: Credential`, `L42: Timestamp`, `L42: Signature`, `L76: SHA256`
- **externalHost**: `L5: https://open-api.affiliate.shopee.vn/graphql``, `L58: https://shopee.vn`, `L84: https://shopee.vn/product/38003654/1589295236`, `L100: https://shopee.vn/product/38003654/1589295236`, `L101: https://shp.ee/...`
- **subIds**: `L58: subIds`, `L65: subIds`, `L65: subIds`, `L65: subIds`, `L66: subIds`
- **dotEnv**: `L99: SHOPEE_API`, `L99: APP_ID`, `L99: SHOPEE_API`, `L99: SECRET`, `L99: .env`

### Postman/Shopee-Product-Data.postman_collection.json (86 LOC)
- **externalHost**: `L6: https://schema.getpostman.com/json/collection/v2.1.0/collection.json`, `L74: https://data.addlivetag.com/product-data/product-data.php`, `L82: https://shopee.vn/product/38003654/1589295236`

### docs/reverse-engineering/05-methodology-cheatsheet.md (86 LOC)
- **authSig**: `L38: Signature`
- **db**: `L52: mysqli`
- **dotEnv**: `L15: SECRET`, `L16: .env`

### bc-custom-link/link.php (74 LOC)
- **externalHost**: `L65: https://affiliate.shopee.vn/open_api`, `L66: https://affiliate.shopee.vn/open_api`
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
- **externalHost**: `L22: https://open-api.affiliate.shopee.vn/graphql`.`, `L38: https://shopee.vn/product/38003654/1589295236`
- **dotEnv**: `L6: .env`, `L6: .env`, `L9: .env`, `L12: SHOPEE_API`, `L12: APP_ID`, `L13: SHOPEE_API`, `L13: SECRET`

### Code/php/README.md (42 LOC)
- **graphqlOp**: `L26: shopeeOfferV2`, `L27: brandOfferV2`, `L28: productOfferV2`, `L29: generateShortLink`, `L30: conversionReportV2`, `L31: validationReportV2`, `L36: shopeeOfferV2`, `L37: productOfferV2`, `L38: generateShortLink`, `L39: conversionReportV2`, `L40: validationReportV2`
- **externalHost**: `L22: https://open-api.affiliate.shopee.vn/graphql`.`, `L38: https://shopee.vn/product/38003654/1589295236`
- **dotEnv**: `L6: .env`, `L6: .env`, `L9: .env`, `L12: SHOPEE_API`, `L12: APP_ID`, `L13: SHOPEE_API`, `L13: SECRET`

### Code/nodejs/index.test.js (40 LOC)
- **graphqlOp**: `L10: shopeeOfferV2`, `L25: generateShortLink`, `L27: generateShortLink`, `L30: generateShortLink`
- **authSig**: `L7: SHA256`, `L12: Signature`, `L13: createHash("sha256")`, `L21: SHA256`, `L21: Credential`, `L21: Timestamp`, `L21: Signature`, `L21: Signature`
- **externalHost**: `L26: https://shopee.vn/product/38003654/1589295236`, `L36: https://shopee.vn`

### bc-custom-link/README.md (31 LOC)
- **authSig**: `L7: Credential`
- **externalHost**: `L7: https://affiliate.shopee.vn/open_api>.`, `L10: https://i.imgur.com/Bc6X9ub.png`
- **db**: `L15: CREATE TABLE`

### Postman/Shopee-Product-Data.postman_environment.json (25 LOC)
- **externalHost**: `L7: https://data.addlivetag.com/product-data/product-data.php`, `L17: https://shopee.vn/product/38003654/1589295236`

### Code/README.md (22 LOC)
- **graphqlOp**: `L21: shopeeOfferV2`, `L21: brandOfferV2`, `L21: productOfferV2`, `L21: generateShortLink`, `L21: conversionReportV2`, `L21: validationReportV2`
- **dotEnv**: `L11: .env`, `L11: .env`, `L13: SHOPEE_API`, `L13: APP_ID`, `L14: SHOPEE_API`, `L14: SECRET`

### bc-custom-link/conn.php (17 LOC)
- **db**: `L12: mysqli`, `L14: mysqli`

## How to Use This Report

1. Start with files with most functions: `bc-custom-link/func.php`, `Code/nodejs/index.js`
2. Follow host call chain: `bc-custom-link/index.php -> link.php -> func.php -> https://open-api.affiliate.shopee.vn/graphql`
3. Check auth: search for `authSig`
4. Trace input: search for `supGlobals` ($_POST) + `subIds`
