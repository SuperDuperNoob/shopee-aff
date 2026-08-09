# Cookie / Session Authentication Guide (Shopee)

> **In short:** the official Shopee Affiliate Open API authenticates with **credentials** — an `app_id` + `secret_key` plus a computed SHA-256 `signature`. This guide explains the **alternative**: authenticating to Shopee's **web endpoints** using a **browser session cookie** (typically `SPC_F`) from a logged-in account, without needing an `app_id`/`secret_key`.

Use this guide when you have a logged-in Shopee account but **no API credentials**, or when you need data from Shopee's web/product endpoints that the official Open API does not expose.

---

## 1. Two ways to authenticate

| | Credential auth (official) | Cookie / session auth |
| --- | --- | --- |
| What you need | `app_id` + `secret_key` (from the Affiliate open API dashboard) | A logged-in browser session cookie (`SPC_F`, etc.) |
| Where it works | `https://open-api.affiliate.shopee.com.my/graphql` | Shopee **web** endpoints, e.g. `https://shopee.com.my/api/v4/...` |
| Header used | `Authorization: SHA256 Credential=..., Timestamp=..., Signature=...` | `Cookie: SPC_F=...; ...` (+ `X-CSRFToken` for writes) |
| Signature required | Yes | No |
| Account-scoped data | `access_token` required | Session already reflects the account |

The repository's `Code/nodejs` and `Code/php` samples support **both** modes and pick one automatically:

- If `SHOPEE_API_APP_ID` **and** `SHOPEE_API_SECRET` are set → **credential** mode (official GraphQL).
- Otherwise, if `SHOPEE_COOKIE` is set → **cookie** mode (Shopee web product API).

---

## 2. What cookies are involved

When you log in to `shopee.com.my` in a browser, Shopee sets several cookies. The ones that matter for API calls:

| Cookie | Role |
| --- | --- |
| `SPC_F` | The **main session / auth cookie**. This is the one that proves you are logged in. |
| `SPC_EC` | Session-related companion cookie (encryption/session context). |
| `SPC_SI` | Session info cookie. |
| `SPC_U` | User identifier cookie. |
| `csrftoken` | CSRF token. For **state-changing** (POST) requests, its value must be echoed in the `X-CSRFToken` header. |

> Note: the exact set of cookies can change and differs slightly by market (`.my`, `.sg`, `.vn`, `.id`...). **`SPC_F` is the one you almost always need.** For read-only (`GET`) requests, `SPC_F` plus a normal browser `User-Agent` and `Referer` is usually enough.

---

## 3. How to get the cookie from your browser

### Option A — DevTools → Copy as cURL (easiest)

1. Log in to Shopee in Chrome/Edge/Firefox.
2. Open **DevTools** (`F12`) → **Network** tab.
3. Trigger a request you care about (e.g. open a product page, or run a search).
4. Right-click the relevant `api/v4/...` request → **Copy** → **Copy as cURL**.
5. Paste it somewhere; inside it you'll find a line like:

   ```
   -H 'cookie: SPC_F=AbC...; SPC_EC=xyz...; csrftoken=...'
   ```

   Copy everything after `cookie: ` — that whole string is your `SHOPEE_COOKIE`.

### Option B — DevTools → Application → Cookies

1. Open **DevTools** → **Application** tab → **Cookies** → `https://shopee.com.my`.
2. Find the cookies above, copy their `Name=Value` pairs, and join them with `; `:

   ```
   SPC_F=AbC...; SPC_EC=xyz...; csrftoken=...
   ```

### For POST requests (optional but often required)

In the same copied cURL you'll usually see a header like `x-csrftoken: <value>`. Its value equals the `csrftoken` cookie. Set it as `SHOPEE_CSRF_TOKEN`.

---

## 4. Using the cookie

### curl (read-only GET)

```bash
curl -s 'https://shopee.com.my/api/v4/pdp/get_pc?shop_id=334425154&item_id=8200081234' \
  -H 'Cookie: SPC_F=AbC123; SPC_EC=xyz' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' \
  -H 'Referer: https://shopee.com.my/' \
  -H 'x-api-source: pc'
```

### curl (state-changing POST — include CSRF token)

```bash
curl -s -X POST 'https://shopee.com.my/api/v4/example/write' \
  -H 'Cookie: SPC_F=AbC123; SPC_EC=xyz; csrftoken=Tok123' \
  -H 'X-CSRFToken: Tok123' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' \
  -H 'Referer: https://shopee.com.my/' \
  -H 'Content-Type: application/json' \
  -d '{"some":"data"}'
```

### Node.js

```js
const headers = {
    Cookie: "SPC_F=AbC123; SPC_EC=xyz",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    Referer: "https://shopee.com.my/",
    "x-api-source": "pc",
};

const response = await fetch(
    "https://shopee.com.my/api/v4/pdp/get_pc?item_id=8200081234&shop_id=334425154",
    { headers },
);
console.log(await response.json());
```

### PHP (cURL)

```php
<?php
$ch = curl_init('https://shopee.com.my/api/v4/pdp/get_pc?item_id=8200081234&shop_id=334425154');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Cookie: SPC_F=AbC123; SPC_EC=xyz',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer: https://shopee.com.my/',
        'x-api-source: pc',
    ],
]);
echo curl_exec($ch);
```

---

## 5. Using the cookie with the sample code

1. Leave `SHOPEE_API_APP_ID` / `SHOPEE_API_SECRET` **empty** in your `.env`.
2. Set `SHOPEE_COOKIE` to your copied cookie string (see `Code/*/.env.example`).
3. Optional: set `SHOPEE_CSRF_TOKEN` (for POSTs), `SHOPEE_ITEM_ID`, `SHOPEE_SHOP_ID`.

```env
# Credentials left empty so cookie mode is used
SHOPEE_API_APP_ID=
SHOPEE_API_SECRET=

# Cookie / session mode
SHOPEE_COOKIE=SPC_F=AbC123; SPC_EC=xyz; csrftoken=Tok123
SHOPEE_CSRF_TOKEN=Tok123
SHOPEE_ITEM_ID=8200081234
SHOPEE_SHOP_ID=334425154
```

Then run:

```bash
# Node.js
cd Code/nodejs && node index.js
# or pass the item id / shop id directly:
node index.js 8200081234 334425154

# PHP
cd Code/php && php index.php
# or: php index.php 8200081234 334425154
```

The sample detects cookie mode automatically and calls
`https://shopee.com.my/api/v4/pdp/get_pc?item_id=...&shop_id=...` with the cookie headers.

---

## 6. When cookies vs. credentials

Prefer **credentials** (official Open API) when:

- You have an `app_id`/`secret_key` from the affiliate open API dashboard.
- You need official, supported endpoints (offers, conversions, short links, validated reports).
- You want stable, documented behavior.

Use **cookies** when:

- You have no API credentials but do have a logged-in account.
- You need web/product data not exposed by the official API.
- You're prototyping or reverse-engineering Shopee's web data (`api/v4/...`).

> Cookies do **not** replace the signature for the official `open-api.affiliate.shopee.com.my/graphql` endpoint — that endpoint still requires credential auth. Cookies are for Shopee's **web** endpoints.

---

## 7. Keeping it fresh (expiry & refresh)

- `SPC_F` and session cookies **expire** (often after a few days to weeks of inactivity, or on password change / logout).
- When your requests start returning `403` or an "error" page / empty JSON, the session likely expired — **re-login** in the browser and copy the cookie again.
- Do not store cookies that contain your real credentials in committed files, and rotate them if leaked.

---

## 8. Troubleshooting

| Symptom | Likely fix |
| --- | --- |
| `403` / "forbidden" | Session expired → re-copy `SPC_F`. Add `Referer`, a real `User-Agent`, and `x-api-source: pc`. |
| Empty or `{"error":...}` JSON | Add missing cookies (`SPC_EC`), or the request needs the `X-CSRFToken` header. |
| POST fails with CSRF error | Set `X-CSRFToken` to the value of the `csrftoken` cookie. |
| Results for the wrong market | Use cookies from the correct regional domain (`.com.my`, `.sg`, `.vn`, ...). |
| Blocked / CAPTCHA | You may be rate-limited or hit Shopee's anti-bot; slow down, cache aggressively, and use the official API where possible. |

---

## 9. Security notes

- A `SPC_F` cookie is a **login credential**. Guard it like a password.
- Never commit `.env` files (they are already git-ignored via `**/.env`).
- Keep cookie auth read-only where possible; refresh cookies frequently; revoke sessions you no longer need by logging out.

---

See also:

- [`README.md`](README.md) — official Shopee Affiliate Open API spec (credential auth)
- [`Code/nodejs/README.md`](Code/nodejs/README.md) and [`Code/php/README.md`](Code/php/README.md) — sample usage
- [`docs/reverse-engineering/02-auth-flow.md`](docs/reverse-engineering/02-auth-flow.md) — how the SHA-256 signature is built
