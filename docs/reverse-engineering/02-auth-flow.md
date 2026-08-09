# 02 — Auth Flow Reverse Engineering

## Goal

Understand how requests to `https://open-api.affiliate.shopee.vn/graphql` are authenticated, so you can reimplement in any language.

## Observed implementations

### NodeJS (Code/nodejs/index.js:93-96)

```js
export function buildAuthorization(appId, secret, payload, timestamp) {
    const signatureBase = `${appId}${timestamp}${payload}${secret}`;
    const signature = crypto.createHash("sha256").update(signatureBase).digest("hex");
    return `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;
}
```

### PHP (Code/php/index.php:108-117, bc-custom-link/func.php:71-88)

```php
$Timestamp = time();
$factor = $AppID.$Timestamp.$query.$APIkey;
$Signature = hash('sha256', $factor);
// Header: "Authorization: SHA256 Credential=".$AppID.", Timestamp=".$Timestamp.", Signature=".$Signature
```

Both identical.

## Recovered spec

```
Let:
  appId   = string from affiliate.shopee.vn/open_api
  secret  = string paired with appId
  ts      = floor(now() in seconds)  e.g. 1712000000
  payload = JSON.stringify({ query: "<GraphQL string>", variables?: {...} })

Then:
  factor    = appId + ts + payload + secret   // straight concat, no sep, no hmac
  signature = hex( SHA256( factor ) )
  header    = "SHA256 Credential=${appId}, Timestamp=${ts}, Signature=${signature}"
```

Headers:
- `Authorization: <header>`
- `Content-Type: application/json`

Body: raw `payload` string (must be byte-identical to what was signed).

## What GraphQL payloads look like

Two styles exist:

**1. Inline query (Code/nodejs/index.js:40-70):**

```json
{"query":"\nmutation {\n  generateShortLink(input: { originUrl: \"https://shopee.vn\", subIds: [\"s1\"] }) {\n    shortLink\n  }\n}\n"}
```

**2. Query + variables (bc-custom-link/func.php:43-49):**

```json
{
  "query": "mutation GenerateShortLink($originUrl: String!, $subIds: [String]) { generateShortLink(input: {originUrl: $originUrl, subIds: $subIds}) { shortLink } }",
  "variables": { "originUrl": "https://...", "subIds": ["a","b"] }
}
```

Both valid GraphQL. Second is safer for escaping.

## Why fragile

- No delimiter: `appId=12, ts=3, payload="abc"` and `appId=1, ts=23, payload="abc"` produce same factor `123abc...`. But payload starts with `{"query"` so collision improbable in practice.
- JSON whitespace matters: `{"query":"..."}` vs `{"query": "..."}` produce different signatures. That's why PHP uses `JSON_UNESCAPED_SLASHES` and JS uses no pretty.
- Not HMAC: uses plain hash of secret concatenated. If Shopee internally did `SHA256(secret + data)` length extension could apply, but they hash hex output? Unknown. Still works.
- Timestamp tolerance: Likely 10 minutes. If your server clock drifts, you'll get error 10020. Official docs list 10020 as "Invalid signature, expired request, invalid timestamp".

## How to test recovery

Without valid creds you can't get 200, but you can test signature dev path:

```bash
node tools/trace-signature.js --appId 123 --secret abc --url https://shopee.vn/product/38003654/1589295236

# Should print:
# - payload
# - timestamp
# - factor (first/last 200 chars)
# - signature (64 hex)
# - Authorization header
# - curl dry-run
```

Then with real creds:

```bash
cd Code/nodejs
echo "SHOPEE_API_APP_ID=real\nSHOPEE_API_SECRET=real" > .env
node index.js generateShortLink "https://shopee.vn/product/38003654/1589295236"
# Expect {"data":{"generateShortLink":{"shortLink":"https://shp.ee/..."}}}
```

If you get `{"errors":[{"message":"..."}]}` with code 10020, timestamp or payload mismatch.

## Mitigations if you were rebuilding API

- Use HMAC-SHA256 with secret as key, not plain concat.
- Add delimiter or length-prefix fields.
- Include nonce.
- But must stay compatible with Shopee spec, so can't change.
```

