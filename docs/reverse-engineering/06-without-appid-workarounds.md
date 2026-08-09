# 06 — Without AppID/Secret — Workarounds (No L2)

> Condensed RE deep dive. Full guide with code recipes, approval checklist, and references is at [`docs/without-appid-workarounds.md`](../without-appid-workarounds.md). Runnable proof is in `tools/generate-anredir-link.js`, `tools/an_redir-generator.html`, and `Code/no-api/an_redir.php`.

## Why this exists

- `Code/nodejs`, `Code/php`, `bc-custom-link/func.php:shopee_aff_api()` all assume **L2** Open API (`appId`+`secret` → `SHA256(appId+ts+payload+secret)` → `Authorization: SHA256 Credential=..., Signature=...`).
- Without L2 you get `10020` (invalid signature) / `10031` (access denied). Many affiliates have **L1** (`affiliate_id`, e.g. `14382300002`) but not L2 — separate 5–15 day review via dashboard → Open API.
- RE question: can you still earn without L2? **Yes.**

## Finding: Shopee's own `an_redir` is the official no-API path

From help articles `help.shopee.sg/portal/10/article/171184` (SG), `help.shopee.com.my/portal/10/article/174050` (MY), `help.shopee.ph/portal/10/article/172142` (PH):

```
https://{redirectDomain}/an_redir?origin_link={ENCODED_PAGE}&affiliate_id={YOUR_ID}&sub_id={v1-v2-v3-v4-v5}
```

- `redirectDomain`: `https://shope.ee` (global) or `https://s.shopee.vn|sg|com.my|ph|co.id|co.th|com.br`
- `origin_link`: single `encodeURIComponent` of the cleaned product/shop/page URL (strip `sp_atk`/`xptdk`/`utm_*` first — see `func.php:removeParam`)
- `sub_id`: up to 5 dash-joined values, `[^a-zA-Z0-9_-]` (same regex as `link.php` sanitization)
- Shopee 302s to the product with `utm_source=an_<affiliate_id>` + `uls_trackid`; same 7-day cookie and commission as GraphQL `generateShortLink`.
- Community proof: `crushedmonster/shopee-affiliate-link-generator` builds exactly this (`index.html: https://s.shopee.sg/an_redir?origin_link=${encoded}&affiliate_id=${affiliateId}&sub_id=${subId}`) + `api/expand.js` for short-link expansion.

**Where `affiliate_id` lives (no Open API):** portal → Account/Settings/Profile, or generate one Custom Link and read `affiliate_id=` in the result, or Shopee app → Me → Affiliate Program → share any product while logged in.

## Mapping to this repo

| Official L2 path | L1-only mirror |
|------------------|----------------|
| `func.php:short_link()` + `shopee_aff_api()` (GraphQL mutation) | `Code/no-api/an_redir.php:buildShopeeAffLink()` (deterministic URL, no network) |
| `Code/nodejs/index.js:buildAuthorization` + `fetch(API_URL)` | `tools/generate-anredir-link.js` (clean → encode → join) |
| `bc-custom-link/index.php` jQuery → `link.php` → Shopee | `tools/an_redir-generator.html` (browser-only, localStorage) |
| `productOfferV2` for commission preview | `product-data-api.md` (`data.addlivetag.com`) + `an_redir` for the link |

## Lab: prove it without credentials

```bash
node tools/generate-anredir-link.js --affiliate-id 14382300002 --url https://shopee.vn/product/38003654/1589295236 --sub-id tiktok
# → https://shope.ee/an_redir?origin_link=https%3A%2F%2Fshopee.vn%2Fproduct%2F38003654%2F1589295236&affiliate_id=14382300002&sub_id=tiktok
# Open in incognito → should land on product → Analytics shows click in ~15–30 min
```

```bash
# Short-link input: expand first
node tools/generate-anredir-link.js --affiliate-id 14382300002 --url https://s.shopee.vn/4VU2IjQjPF --expand
```

Browser: open `tools/an_redir-generator.html` → paste URL + ID → Generate → Copy.

## Other viable paths (when `an_redir` isn't enough)

- **Dashboard Custom Link / Convert Link** (L1, manual): portal → Custom Link (5 URLs → Sub_id1..5 → Get Link → `shp.ee`), app → Me → Affiliate → Account → Convert Link. Validates eligibility inline.
- **Shopee App Share** (L1, zero setup): open product → share arrow → Copy Link (already tracked when logged as affiliate).
- **Involve Asia / ACCESSTRADE** (no Shopee direct): `involve.asia` → Add Property (blog/TikTok/Telegram) → Shopee offer → Apply → Promotion → Deeplink Generator → `invol.co/...`. Good when Shopee direct rejects you; 3–7 days, 500+ brands, own payout.
- **Unofficial Product Data API** (no creds): `https://data.addlivetag.com/product-data/product-data.php?item_id=…` → price/commission/priceStats (24h cache) — see `04-unofficial-api.md`. Pair with `an_redir` for a full deal-site stack.
- **Team escrow** (owner's L2): deploy `bc-custom-link` with `appId`/`secret` on server (`link.php:50–51`), clients POST only `url`+`subIds`.

## Limitations vs L2

No programmatic product search, no `conversionReport`/`validatedReport` via API, `an_redir` URL longer than minted `shp.ee` (wrap with your own 301/302 if you need shortness). For reports, use portal Analytics or Involve dashboards until L2 approved.

## Compliance

Disclose affiliate, no cookie stuffing. `an_redir` is documented — not a TOS bypass.

---

See `docs/without-appid-workarounds.md` for full capability matrix, regional domain table, approval checklist, persona stacks, FAQ, and references.
