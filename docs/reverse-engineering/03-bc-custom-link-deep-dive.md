# 03 — bc-custom-link Deep Dive

## Purpose

Mini app to turn any Shopee URL into affiliate short link with tracking subIds.

## Flow step-by-step

### Frontend `index.php`

- PHP `session_start()` + `us_id()` generates fingerprint:
  ```php
  $us_id = md5(time().'_'.rand(1,1000));
  setcookie('us_id', $us_id, time()+365*86400, '/', $host, $isSecure, true);
  ```
  - Stored 1 year, HttpOnly, Secure if HTTPS, SameSite Lax.
  - Used for `Sub_id4` read-only field.

- JS on `$(window).load`:
  - `referralCopy()` binds click on copy button -> `navigator.clipboard.writeText` fallback to execCommand.
  - `isValidShopeeUrl(url)` tries `new URL(url)` and checks `hostname.indexOf('shopee.') !== -1`. Client-side only, server re-validates.
  - `createLink()`:
    - Sets `Sub_id4 = <?= $us_id ?>` (PHP injected into JS)
    - Sets `Sub_id5 = Date.now()`
    - On click `#customLink_submit`:
      - Validate non-empty + shopee host
      - `$.ajax POST to link.php` with hardcoded demo creds + us_id + url + 5 subIds.

### Backend `link.php`

```
POST tp=link
  link_action=short_link
    apiAppID, apiSecret
    us_id
    url
    Sub_id1..5
```

Validations:

1. `trim()` appID/secret, must exist else "Please provide both the App ID and secret"
2. Demo mode: if both == 'demo', set `$appDemo=1` then later overwrite to empty string — expects deployer to edit file (line 65-66 comment: change this, see at https://affiliate.shopee.com.my/open_api)
3. `removeParam(url, 'sp_atk')` + `removeParam(url, 'xptdk')` strips tracking params that break affiliate attribution.
   ```php
   function removeParam($url, $param) {
     $url = preg_replace('/(&|\?)'.preg_quote($param).'=[^&]*$/', '', $url);
     $url = preg_replace('/(&|\?)'.preg_quote($param).'=[^&]*&/', '$1', $url);
   }
   ```
   Potential issue: if URL has `?sp_atk=foo&sp_atk=bar`, first regex removes trailing, second removes with &, but would leave `?` if only param. Edge case.
4. `filter_var($url, FILTER_VALIDATE_URL)` else "Invalid URL"
5. `parse_url($url, PHP_URL_HOST)` must contain `shopee.` (stripos) else "Only Shopee URLs are supported"
   - Note: `shopee.com.my.evil.com` contains `shopee.` but is attacker-controlled. Should also check TLD suffix or use allowlist of `*.shopee.*`. Current check is weak.
6. Sanitize subIds: `preg_replace('/[^a-zA-Z0-9_-]/', '', $val)` then `array_filter` + `array_slice(0,5)` — good, removes injection.

Then calls `short_link($us_id, $apiAppID, $apiSecret, $url, $subIds)`

### Core `func.php:short_link()`

```php
$payload = [
  'query' => 'mutation GenerateShortLink($originUrl: String!, $subIds: [String]) { generateShortLink(input: {originUrl: $originUrl, subIds: $subIds}) { shortLink } }',
  'variables' => [ 'originUrl' => $url, 'subIds' => $subIds ]
];
$query = json_encode($payload, JSON_UNESCAPED_SLASHES);
$data = shopee_aff_api($apiAppID,$apiSecret,$query);
```

Error handling:

- If `$data['errors']` exists -> returns `response('errors',$message)` where message is first error message.
- Else if `data.generateShortLink.shortLink` exists -> logs then returns success.
- Else "Could not create the link"

`response()` builds `{"errors":{"message":...}}` or `{"success":{"message":...}}` — note nested message, not flat. Frontend expects `result.success.message` or `result.errors.message`.

### `shopee_aff_api()`

- Timeout 30, follow redirects 10, HTTP 1.1 (explicit).
- No retry, no exponential backoff.
- On curl error, returns `['errors'=>[['message'=>'CURL error: ...']]]`
- On non-JSON, returns "Invalid API response"
- On HTTP >=400, returns apiMessage from response or "Shopee API error (HTTP X)"

### `log_shopee_affiliate_link()`

- If `$connect` null (DB creds empty), returns false — logging optional, fails open.
- Uses prepared statement (good against SQLi):
  ```php
  INSERT INTO ... VALUES (?, ?, ?, ?, ?, ?, ?)
  ```
- Params: us_id, appid, link, tracking_link, sub_id (json_encoded if array), time_create, ip.
- `get_client_ip()` prefers `HTTP_X_FORWARDED_FOR` first entry, validates IP, else `REMOTE_ADDR`. Note: XFF can be spoofed if not behind trusted proxy. Should have trusted proxy list.

### DB Schema

```sql
CREATE TABLE `shopee_affiliate_link` (
  `id` int(11) NOT NULL,
  `us_id` varchar(128) DEFAULT NULL,
  `appid` varchar(64) DEFAULT NULL,
  `link` varchar(512) DEFAULT NULL,
  `tracking_link` varchar(256) DEFAULT NULL,
  `sub_id` varchar(512) DEFAULT NULL,
  `time_create` int(11) DEFAULT NULL,
  `ip` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `shopee_affiliate_link` ADD PRIMARY KEY (`id`);
```

- No auto-increment in schema? `id int(11) NOT NULL` without AUTO_INCREMENT will fail on second INSERT unless manually set. Should be `AUTO_INCREMENT`. Actual deployed DB likely has it.
- `tracking_link varchar(256)` may be short for future longer links; consider 512.
- No indexes on us_id/time_create — queries will be slow at scale.

## Security audit summary

| Area | Finding | Severity | Fix |
|------|---------|----------|-----|
| Host validation | `stripos(host, 'shopee.')` allows `shopee.evil.com` | Medium | Use suffix check: host ends with `.shopee.com.my` or equals `shopee.com.my` (+ other Shopee market domains if needed) or regex `\bshopee\.[a-z.]+\b` + allowlist |
| XFF spoof | `get_client_ip` trusts XFF unverified | Low/Med | Check if behind Cloudflare, validate trusted proxy, or use `$_SERVER['REMOTE_ADDR']` only |
| removeParam | Regex with `preg_quote` okay, but leaves `?` or `&` artifacts | Low | Use `parse_url` + `parse_str` + rebuild |
| Demo creds | `demo` -> empty string, then API fails, but JS still sends demo | Low | Better return 501 "Configure credentials" in demo mode |
| cURL | No SSRF protection beyond host check in caller; if caller bypassed, could fetch internal | Low | In `shopee_aff_api` add allowlist of hosts to POST (only `open-api.affiliate.shopee.com.my`) |
| Cookie | SameSite Lax + HttpOnly good, but domain derived from HTTP_HOST can be manipulated | Low | Use empty domain (browser defaults) or config |
| SQL id | No AUTO_INCREMENT | Medium | Add AUTO_INCREMENT |
| Bootstrap 4.1.3 | Known XSS CVEs in tooltip/collapse | Low | Upgrade to 4.6+ or 5.x |

## How to RE this yourself lab

1. `php -S 0.0.0.0:8000` in bc-custom-link
2. Intercept with Burp/DevTools
3. Try payloads:
   - `url=https://shopee.com.my.evil.com/product/1/1` -> should be blocked but currently passes (demonstrates weak check)
   - `url=https://shopee.com.my/product/1/1?sp_atk=evil&xptdk=evil` -> observe stripping
   - `Sub_id1=<script>alert(1)</script>` -> observe sanitization to `scriptalert1script`
   - `apiAppID=demo&apiSecret=demo` -> observe empty creds path
4. Check DB logging by setting conn.php creds to local MySQL, run request, SELECT * FROM shopee_affiliate_link
