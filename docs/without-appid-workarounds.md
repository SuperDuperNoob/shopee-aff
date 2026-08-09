# Shopee Affiliate Without AppID / Secret — Workaround Research

> **You don't have `appId` / `secret`? You can still earn commissions.** This guide maps every practical workaround discovered through reverse engineering and community research — from Shopee's own `an_redir` tracker to affiliate-network deeplinks — with trade-offs, code, and where to find your IDs.

**Last updated:** 2026-08-09 · **Status:** researched, partially verified via official docs + live community tools  
**Audience:** affiliates approved for Shopee Affiliate Program but *not* for Open API, developers waiting for approval, or those prototyping without credentials.

---

## Contents

- [The two gates](#the-two-gates-why-appid-is-hard-to-get)
- [TL;DR decision tree](#tldr-decision-tree)
- [Capability comparison](#capability-comparison)
- [1) `an_redir` tracker (recommended, no API)](#1-an_redir-tracker-recommended--no-api--official)
- [2) Dashboard Custom Link / Convert Link](#2-dashboard-custom-link--convert-link-manual--no-code)
- [3) Shopee App Share](#3-shopee-app-share--zero-setup)
- [4) Affiliate-network deeplinks (Involve Asia / ACCESSTRADE / Ecomobi)](#4-affiliate-network-deeplinks--no-shopee-open-api-needed)
- [5) Unofficial Product Data API (for data, not links)](#5-unofficial-product-data-api-for-data-not-links)
- [6) Borrowed / team credentials (careful)](#6-borrowed--team-credentials-escrow)
- [7) Getting approved for real (make workarounds temporary)](#7-getting-approved-for-real-make-workarounds-temporary)
- [SubIDs, encoding & regional domains](#subids-encoding--regional-domains)
- [Code recipes](#code-recipes)
- [Limitations & risks by method](#limitations--risks-by-method)
- [Recommended stacks by persona](#recommended-stacks-by-persona)
- [FAQ](#faq)
- [References](#references)

---

## The two gates: why AppID is hard to get

Shopee has **two separate approvals**:

| Gate | What you get | Where | Typical requirements | Wait |
|------|--------------|-------|----------------------|------|
| **L1 — Shopee Affiliate Program** | `affiliate_id` (e.g. `14382300002`) + dashboard access | `affiliate.shopee.vn` / `affiliate.shopee.sg` / `shopee.com.my/affiliate` etc. | Shopee buyer account + 1 public social (500+ followers, 3 posts/week, 2% engagement is commonly cited) + bank/tax info. Some regions allow smaller but public accounts. | 3–30 business days, often 15–30 |
| **L2 — Shopee Affiliate Open API** | `appId` + `secret` (for `https://open-api.affiliate.shopee.*/*/graphql`) | Affiliate dashboard → **Open API** (bottom of left nav) | Must already be L1-approved. Separate manual review; not all affiliates auto-granted. Quota, TOS, sometimes minimum performance. | 5–15 days *after* L1 |

This repo's wrappers (`Code/nodejs`, `Code/php`, `bc-custom-link`) need **L2**. If you only have L1, the GraphQL `generateShortLink` / `productOfferV2` / `conversionReport` calls return `10020`/`10031` and you are stuck. The workarounds below let you **generate valid tracking links with only L1** (or even via a network with no direct Shopee account).

> **Mental model:** `affiliate_id` = who gets paid. `appId/secret` = who is allowed to *programmatically ask Shopee to mint a short link or pull reports*. Shopee also supports minting links without asking — you mint them yourself via `an_redir`.

---

## TL;DR decision tree

```
Do you have affiliate_id (L1 approved)?
├─ NO
│  ├─ Want fastest path to first commission? → 4) Join via Involve Asia / ACCESSTRADE
│  │   (they approve properties even if Shopee direct rejected; you get their deeplink generator)
│  └─ Still want direct? → 7) Fix application & reapply (follow checklist) + use 5) to research products in meantime
└─ YES
   ├─ Need to generate links in code / at scale / without dashboard?
   │  └─ YES → 1) an_redir (encode origin_link + affiliate_id + sub_id) ← start here
   ├─ Need to generate a few links manually today? → 2) Dashboard Custom Link or 3) App Share
   └─ Need reports / commissions / product search API? → 7) Apply for L2, but use 1) + 5) while waiting
```

**Bottom line:** For *link generation*, `an_redir` replaces `generateShortLink` with zero API calls. For *reporting & product discovery*, there is no full L2 replacement — you either use network dashboards or wait for approval.

---

## Capability comparison

| Capability | Official GraphQL (L2, `appId/secret`) | `an_redir` (L1, `affiliate_id`) | Dashboard Custom Link (L1) | Involve/ACCESSTRADE deeplink | Unofficial `data.addlivetag.com` |
|------------|:---:|:---:|:---:|:---:|:---:|
| **Generate affiliate link** | ✅ `generateShortLink` / `generateBatchShortLink` | ✅ deterministic URL build | ✅ paste → Get Link (max 5 at once) | ✅ their generator (paste Shopee URL) | ❌ not for link gen |
| **Product / shop search** | ✅ `productOfferV2` / `shopOfferV2` with filters, commission sort | ❌ (no search) | ❌ browse only | ✅ network's offer list, limited | ✅ lookup by `item_id`/`url` (cache 24h) |
| **Link tracking params** | `subIds[0..4]` via mutation | `sub_id=v1-v2-v3-v4-v5` (dash-joined) + `affiliate_id` | `Sub_id1..5` fields | network's click ID + optional passthrough | n/a |
| **Conversion / commission report** | ✅ `conversionReport` / `validatedReport` | ❌ use dashboard Analytics | ✅ dashboard Analytics tab | ✅ network's report | ❌ |
| **Short domain** | `https://shp.ee/...` or `s.shopee.*/...` (minted server-side) | `https://s.shopee.*/an_redir?...` (you build) then Shopee 302 → final | same as left but via dashboard button | network's redirect (then Shopee) | n/a |
| **Needs Shopee L1?** | yes + L2 | yes (for affiliate_id) | yes | no — network account only | no |
| **Rate limit** | `10030` throttling, ~5 min sig window | none (static URL) | per-dashboard throttle | per-network | 300/min API, 2000/min DB |
| **Best for** | automation at scale, reporting pipelines | coders without L2, static sites, bulk scripts | manual one-offs | beginners rejected by Shopee direct | price/commission lookup without creds |

---

## 1) `an_redir` tracker (recommended — no API — official)

This is **officially documented by Shopee** in its Short Link Implementation Guidelines (SG/MY/PH/BR). It is *not* a hack — Shopee expects partners without GraphQL access to build links this way. The community tool at `github.com/crushedmonster/shopee-affiliate-link-generator` is a clean open-source reference that does exactly this.

### How it works

Shopee runs a redirector at `https://<shopee-domain>/an_redir` (and the short domains `s.shopee.*` / `shope.ee`). You give it three things:

```
https://{redirectDomain}/an_redir?origin_link={URL_ENCODED_PRODUCT_URL}&affiliate_id={YOUR_ID}&sub_id={UP_TO_5_DASH_JOINED}
```

Shopee 302s to the product with `utm_source=an_<affiliate_id>` + `uls_trackid` + `sub_id` appended, then tracks the 7-day (or regional equivalent) cookie like any `shp.ee` link.

### Shopee's own spec (summarized)

From SG/MY/PH help articles "Affiliate Short Link Implementation Guideline / Short Link Implementation Guideline":

1. URL-encode the landing page (RFC 3986, `encodeURIComponent` style). Example: `https://shopee.sg/product/68475578/27971600849` → `https%3A%2F%2Fshopee.sg%2Fproduct%2F68475578%2F27971600849`
2. Prepend `https://{domain}/an_redir?origin_link=`
3. Append `&affiliate_id={affiliate id}&sub_id={value1}-{value2}-{value3}-{value4}-{value5}` — up to 5 dash-separated values; each alphanumeric + `_-` recommended. Empty OK.
4. Shopee appends `uls_trackid`, `utm_*` on redirect automatically.

> Source: `help.shopee.sg/portal/10/article/171184`, `help.shopee.com.my/portal/10/article/174050`, `help.shopee.ph/portal/10/article/172142`

### Where to find your `affiliate_id`

You do **not** need Open API. After L1 approval:

- **Affiliate portal → Account → Settings / Profile** — many regions show `Affiliate ID` at top.
- **Generate any link via dashboard Custom Link** then inspect the result: it contains `affiliate_id=...` or `utm_source=an_...` — the numeric part after `an_` is your ID.
- **Shopee app → Me → Shopee Affiliate Program → Account / Share** — copying any product while logged in as affiliate produces a link containing your ID.
- **Network method** (if you use Involve etc.) has *separate* IDs — don't mix them.

Format: typically 11–12 digits (e.g. `14382300002`, `18384911047`). Same across `ac-med` links.

### Regional redirect domains

| Shopper region | Product host | Recommended `an_redir` host |
|----------------|--------------|-----------------------------|
| Vietnam | `shopee.vn` | `https://s.shopee.vn/an_redir` or `https://shope.ee/an_redir` |
| Singapore | `shopee.sg` | `https://s.shopee.sg/an_redir` |
| Malaysia | `shopee.com.my` / `shopee.my` | `https://s.shopee.com.my/an_redir` |
| Philippines | `shopee.ph` / `shopee.com.ph` | `https://s.shopee.ph/an_redir` |
| Indonesia | `shopee.co.id` | `https://s.shopee.co.id/an_redir` |
| Thailand | `shopee.co.th` | `https://s.shopee.co.th/an_redir` |
| Brazil | `shopee.com.br` | `https://s.shopee.com.br/an_redir` |
| Global short | any | `https://shope.ee/an_redir` (works cross-region) |

Using `shope.ee` is safest for cross-border sharing. Using the country-specific `s.shopee.*` matches local tracking.

### Minimal examples

**JavaScript (browser / Node):**

```js
function buildShopeeAffLink({ originUrl, affiliateId, subIds = [] }) {
  const clean = originUrl.split('?')[0]; // drop any existing tracking; we re-add ours
  const encoded = encodeURIComponent(clean);
  const sub = subIds.filter(Boolean).slice(0, 5).join('-');
  const base = `https://shope.ee/an_redir?origin_link=${encoded}&affiliate_id=${affiliateId}`;
  return sub ? `${base}&sub_id=${sub}` : base;
}
// usage
buildShopeeAffLink({
  originUrl: 'https://shopee.vn/product/38003654/1589295236',
  affiliateId: '17382940011',
  subIds: ['tiktok', 'video42', Date.now().toString()]
});
// → https://shope.ee/an_redir?origin_link=https%3A%2F%2Fshopee.vn%2Fproduct%2F38003654%2F1589295236&affiliate_id=17382940011&sub_id=tiktok-video42-1713...
```

**PHP:**

```php
function buildShopeeAffLink(string $originUrl, string $affiliateId, array $subIds = []): string {
    $clean = explode('?', $originUrl)[0];
    $encoded = rawurlencode($clean);
    $sub = implode('-', array_slice(array_filter($subIds), 0, 5));
    $url = "https://shope.ee/an_redir?origin_link={$encoded}&affiliate_id={$affiliateId}";
    return $sub !== '' ? $url . "&sub_id={$sub}" : $url;
}
```

**Python:**

```py
from urllib.parse import quote
def build_shopee_aff_link(origin_url, affiliate_id, sub_ids=None):
    clean = origin_url.split('?')[0]
    encoded = quote(clean, safe='')
    sub = '-'.join([s for s in (sub_ids or []) if s][:5])
    base = f"https://shope.ee/an_redir?origin_link={encoded}&affiliate_id={affiliate_id}"
    return f"{base}&sub_id={sub}" if sub else base
```

See `tools/generate-anredir-link.js` and `tools/an_redir-generator.html` in this repo for runnable versions.

### Handling short links (`s.shopee.vn/xyz`)

If your input is a short link, expand it first (follow 302s) then build `an_redir` from the expanded URL. Don't double-wrap. See `product-data-api.md` "Expanding short links" or `api/expand.js` in crushedmonster's repo:

```js
// expand then rebuild
let url = shortUrl;
if (shortUrl.includes('s.shopee.')) {
  const r = await fetch(shortUrl, { redirect: 'follow' });
  url = r.url; // effective URL after redirects
}
const aff = buildShopeeAffLink({ originUrl: url, affiliateId, subIds });
```

In this repo: `tools/generate-anredir-link.js --expand --url https://s.shopee.vn/4VU2IjQjPF --affiliate-id 17382940011`

### Cleaning URLs

Best to strip existing affiliate junk before encoding, otherwise you encode stale tracking:

- remove `sp_atk`, `xptdk` (see `bc-custom-link/func.php:removeParam`)
- drop `utm_*`, `uls_trackid`, `smtt`, `af_*` if present — or just `split('?')[0]` for product pages (params aren't needed; Shopee re-adds on redirect).
- keep `?` params only if they are required for page routing (rare; most Shopee product pages are routable by path alone).

### Pros / cons

**Pros:** zero credentials beyond `affiliate_id`, deterministic, no rate limit, works offline, same commission as `shp.ee` via GraphQL, officially documented, easy to bulk.

**Cons:** no server-side commission preview (`offerLink.commissionRate`), no `conversionReport`, you must know the product URL already (no search), link is longer than `shp.ee` unless you wrap again with your own shortener (e.g. `flyn.to`, `tinyurl`, or self-hosted). Also: if you paste it into some chat apps, ensure `origin_link` double-encoding is correct.

---

## 2) Dashboard Custom Link / Convert Link (manual — no code)

If you have L1, the **Custom Link** (web) / **Convert Link** (app) page is the official manual alternative to `generateShortLink`.

**Web:** Affiliate Portal → left nav **Custom Link** → paste up to 5 Shopee URLs (one per line) → fill `Sub_id1..5` → **Get Link** → copy `https://shp.ee/...` or `s.shopee.*` result.  
**App:** Shopee app → Me → Shopee Affiliate Program → **Account** → **Convert Link** / **Custom Link** → same, **Convert** → popup.

**Batch path:** Product Offer / Shop Offer / Commissions XTRA tabs → check boxes → **Batch Get Link** → file download with `Offer Link` column.

**Pros:** one click, no code, trusted, supports subIDs, gives true `shp.ee` short link, verifies product eligibility inline.

**Cons:** 5 URLs at a time on Custom Link; manual; not automatable; no API for reports.

**To scale it without L2:** combine #2 for validation + #1 for generation: validate a sample in dashboard, then use same `originUrl` with `an_redir` at scale.

---

## 3) Shopee App Share — zero setup

While logged in as an approved affiliate, open any product → **share arrow (top right)** → **Copy Link**. On affiliate-enabled accounts, the copied link is already an affiliate link (contains your tracking). This is documented as the primary "just share" flow.

**Pros:** no dashboard, no params, instant.

**Cons:** one-by-one, app only, no subID control unless you afterwards custom-wrap.

---

## 4) Affiliate-network deeplinks — no Shopee Open API needed

If Shopee direct rejected you (or you want multi-brand), join **Shopee via an affiliate network**. The network already holds Shopee credentials on its side. You get *their* deeplink generator, dashboard, and payout aggregation.

| Network | Shopee campaign | How you generate | Pros |
|---------|----------------|------------------|------|
| **Involve Asia** (MY/SG/PH/ID/TH/VN) | Search "Shopee" in Offers → Apply → **Deeplink Generator** (Promotion → Deeplink) | Paste any Shopee URL → Generate → `https://invol.co/...` that 302s to Shopee with tracking | 500+ advertisers in one account, lower follower bar, good for blogs/Telegram, advanced reporting, fast approval (3–7 days). Can be easier than direct. |
| **ACCESSTRADE** (MY/VN) | Shopee campaign → Deeplink tool | Similar paste → generate | Japan-backed, strong MY presence, Content Egg auto-deeplink support. |
| **Ecomobi / other MCNs** | Shopee offer via their platform | Their link tool | Local support, sometimes accepts nano-creators. |

**Flow (Involve example):**

1. Sign up Publisher at `involve.asia` → Add Property (blog, TikTok, YouTube, Telegram group all accepted with public URL) → verify.
2. Browse Offers → find `Shopee MY` / `Shopee VN` etc. → **Apply** with short pitch ("Lifestyle TikTok + IG reels, 2k followers, daily product videos").
3. Once approved (button → **Promote**), go **Promotion → Deeplink Generator** → select Advertiser = Shopee, Property = yours, paste `https://shopee.vn/product/...` → **Generate** → copy.
4. Share; conversions appear in Involve's **Reports**, payout via Involve.

**Trade-off vs direct:** Involve/AT take a small network cut vs direct Shopee commissions, but you get aggregated payments, cross-brand tools, and often better approval odds for small creators. Attribution still goes through Shopee; cookie window same.

**Good hybrid:** Use network for first income → grow audience → reapply direct with proven sales screenshots.

---

## 5) Unofficial Product Data API (for data, not links)

`https://data.addlivetag.com/product-data/product-data.php` (documented at `product-data-api.md`) gives product + commission info **without any Shopee credentials** — just `item_id` or `url`. Useful to enrich listings when you lack `productOfferV2`.

- Cached 24h (`dataSource: db`), falls back to stale on upstream failure.
- Returns `price`, `sales`, `commission`, `sellerComFinal`, `shopeeComFinal`, `isXtra`, `cap`, `priceStats`, `latestPriceHistory`.

Combine with `an_redir`: fetch data from unofficial API for display, generate link via `an_redir`. That's a full no-credentials stack for a deal site.

Rate limits: 300/min (API), 2000/min (DB) per IP. Prefer `item_id` over full URL for accuracy.

---

## 6) Borrowed / team credentials (escrow)

Some teams/MCNs share a single Open API `appId/secret` among members, or use a proxy service that holds it server-side (this repo's `bc-custom-link` is designed for that: deploy once with secrets on server, let clients POST `url` + `subIds` without seeing secret). This is common in internal tools.

**Do this only with explicit permission from the credential owner.** Steps:

- Deploy `bc-custom-link` or `Code/php` on a host you control, set `apiAppID`/`apiSecret` server-side.
- Clients send only `url` + `subIds`; server mints `shp.ee` via `shopee_aff_api`.
- Optionally log to `shopee_affiliate_link` table.

See `bc-custom-link/README.md` for deployment (edit lines 50–51 of `link.php`, update `func.php` domain if needed). The `demo` → empty-string path is intentional to avoid leaking keys in public repos.

**Risks:** secret leakage → revocation → `10020` / `10031` for everyone. Rate limits are per `appId`. Rotate keys promptly if exposed.

---

## 7) Getting approved for real (make workarounds temporary)

Workarounds are great, but direct L2 is best for scale. Approval is not random — reviewers check public signals.

### Checklist prior to applying

- [ ] **Shopee buyer account in good standing** — same login you apply with.
- [ ] **At least one public property** — Instagram/TikTok/YouTube/FB Page/blog with **public** visibility during review. Private = auto-reject.
- [ ] **≥ 500 followers** (most regions) and **≥ 3 posts in last 14–30 days** with genuine engagement (>2%). Shopee SG/MY help says "at least one post in last 14 days" + PH onboarding. TikTok/video creators get +40% higher approval per 2026 partner summit data.
- [ ] **Content aligns with Shopee categories** — fashion/electronics/home/beauty/parenting; no adult/scam/misleading.
- [ ] **Complete tax + bank + ID** — name matches bank owner; SeaBank often recommended in MY/VN threads for fewer payout issues; keep ID scans ready.
- [ ] **No duplicate applications** with same platform link — finish one before opening another.
- [ ] **Post affiliate disclosure** on profiles if required by local FTC/Shopee TOS.

### After L1, unlock L2

- Affiliate dashboard → bottom **Open API** → request AppID/Secret → wait 5–15 days.
- If denied: email `help.shopee.vn` / in-app live agent; many PH creators report manual follow-up unblocks after 32+ days.

### Reapply strategy

Prepare a one-pager: audience demographics, monthly views, content calendar, sample posts with affiliate links, and if on a network, include Involve sales screenshots. Reapplying with proof often succeeds where bare follower count failed.

Once you have L2, revert to official GraphQL: use `tools/trace-signature.js --appId --secret --url` to smoke-test, then `Code/nodejs/index.js generateShortLink ...` / `Code/php/index.php`.

---

## SubIDs, encoding & regional domains

### SubID spec

- Official: `&sub_id={v1}-{v2}-{v3}-{v4}-{v5}` — **dash-joined** string, up to 5 segments.
- Dashboard: shows `Sub_id1..5` fields (same ordering).
- GraphQL: `subIds: [String]` array (this repo's wrappers).
- `an_redir` + dashboard both accept `sub_id` with dashes. For GraphQL, pass array; for `an_redir`, join with `-`.
- Charset: `a-zA-Z0-9_-` recommended (this repo's `link.php` sanitizes with `preg_replace('/[^a-zA-Z0-9_-]/', '', $val)`). Shopee also allows alphanumeric in PH help, but dash/underscore safe everywhere.
- Typical pattern used here: `subId4 = us_id (fingerprint), subId5 = Date.now()` for de-duplication + analytics.

### Encoding gotchas

- Use `encodeURIComponent` / `rawurlencode` on the **entire** origin URL after cleaning. Single encoding is sufficient for `origin_link`; Shopee's docs show single `https%3A%2F%2F...`.
- Don't pre-encode then re-encode (double-encoding `253A` breaks).
- Don't include your `affiliate_id` inside `origin_link` — put it as separate `&affiliate_id=` param.
- Strip existing Shopee tracking before encoding or you'll preserve stale `utm_source`.

### Domain gotchas

- `shopee.vn.evil.com` passes a naive `strpos(host, 'shopee.')` but is **not** Shopee. This repo's `link.php` has that weak check and is documented in `docs/reverse-engineering/03-*.md`. For your own validator, use suffix check:

  ```js
  const ALLOWED = [/\.shopee\.vn$/, /shopee\.vn$/, /shopee\.sg$/, /\.shopee\.sg$/, /shopee\.com\.my$/, /shopee\.ph$/, /shopee\.co\.id$/, /shopee\.co\.th$/, /shopee\.com\.br$/, /shope\.ee$/];
  ```

---

## Code recipes

### A) Full CLI (in this repo)

```bash
# no network needed except optional expand
node tools/generate-anredir-link.js \
  --affiliate-id 14382300002 \
  --url "https://shopee.vn/product/38003654/1589295236" \
  --sub-id sport --sub-id tiktok --sub-id "$(date +%F)"

# expand a short input first
node tools/generate-anredir-link.js \
  --affiliate-id 14382300002 \
  --url "https://s.shopee.vn/4VU2IjQjPF" --expand

# specify redirect domain
node tools/generate-anredir-link.js \
  --affiliate-id 14382300002 \
  --url "https://shopee.sg/product/68475578/27971600849" \
  --domain https://shope.ee
```

### B) Offline HTML generator (open in browser, no server)

Open `tools/an_redir-generator.html` — single file, no CDN required beyond optional expand proxy. Paste product URL + affiliate ID + subIDs → generates `an_redir` link with copy button and QR preview. Host it on GitHub Pages / Vercel / Cloudflare Pages if needed.

### C) Bash (curl-free)

```bash
origin="https://shopee.vn/product/38003654/1589295236"
aff="14382300002"
sub="tiktok-video42-$(date +%s)"
enc=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$origin")
echo "https://shope.ee/an_redir?origin_link=$enc&affiliate_id=$aff&sub_id=$sub"
```

### D) Integration with unofficial data API

```js
// enrich display with unofficial data, generate link with an_redir
const itemId = '1589295236';
const data = await fetch(`https://data.addlivetag.com/product-data/product-data.php?item_id=${itemId}`).then(r=>r.json());
console.log(data.productInfo.commission, data.productInfo.priceStats);
const link = buildShopeeAffLink({ originUrl: data.productInfo.productLink, affiliateId, subIds: ['pricebot', itemId] });
```

---

## Limitations & risks by method

| Method | What you lose vs L2 | Biggest risk | Mitigation |
|--------|---------------------|-------------|------------|
| `an_redir` | no programmatic search, no validatedReport, no server-side `shp.ee` mint (longer URL) | wrong domain / double-encode → Shopee drops tracking | test with one dashboard Custom Link, then compare `an_redir` result in incognito; check Analytics shows click within ~30 min |
| Dashboard manual | not automatable, 5/batch limit | human error, no versioning | export Batch Get Link CSV as audit trail |
| App share | no subID granularity | affiliate status silently off → plain link | verify link contains `an_` / `affiliate_id` |
| Involve/AT | network cut, separate payout threshold, separate ID | campaign pauses if property low quality | keep direct Shopee L1 as backup, don't violate network TOS |
| Unofficial data API | not a Shopee contract; product may be stale 24h | reliance on single proxy; 429 if not caching | cache locally, prefer `item_id`, handle `warning` field |
| Borrowed creds | trust & rate-limit sharing | key leak → account blocklist `10034` | proxy via server, never ship secret to client, rotate |

All methods must still follow Shopee Affiliate TOS: no cookie stuffing, disclose affiliate nature where required, no misleading claims.

---

## Recommended stacks by persona

**Persona A — Creator with L1 but no L2, wants to ship a Telegram bot tomorrow:**

`an_redir` generator + dashboard spot checks + `sub_id` per channel. Zero backend. When L2 arrives, swap single function to GraphQL.

**Persona B — Developer building a deal site (1000 SKUs):**

`data.addlivetag.com` (or your own cache) for price/commission → `an_redir` for links → optional self-hosted shortener (`your.domain/r/abc` → 302 to `an_redir`) for clean URLs and click analytics. Later, add L2 `productOfferV2` for fresh search.

**Persona C — Small creator rejected by Shopee direct:**

Involve Asia (fastest) — get Shopee offer via network → deeplink generator. Grow → reapply direct with sales evidence (Persona A).

**Persona D — Team / agency:**

Deploy `bc-custom-link` once with L2 on server, let team use `an_redir` fallback when quota `10030` hits. Log to `shopee_affiliate_link` table for attribution.

---

## FAQ

**Q: Is `an_redir` commission same as `shp.ee` via GraphQL?**  
A: Yes. Shopee's help center describes `an_redir` as the implementation path for deeplinks/short links; conversion and 7-day (region-dependent) window are identical. The only difference is who does the URL shortening.

**Q: Do I need to URL-encode `affiliate_id` / `sub_id`?**  
A: No, they are alphanumeric + dash/underscore; encoding them is harmless but not needed. Only `origin_link`'s value must be encoded.

**Q: Can I use `an_redir` without any Shopee account?**  
A: No — you still need an `affiliate_id` (L1). To earn without any Shopee direct account, use #4 networks (they have their own ID).

**Q: Does `an_redir` work for shops / campaigns / live / video?**  
A: Yes for any `https://shopee.xxx/...` URL (product, shop `https://shopee.vn/shop/...`, collection, campaign). Dashboard Custom Link also supports pages. Test one representative URL.

**Q: Why does my `an_redir` link still show original price not commission?**  
A: Commission is not in the link — it's computed on purchase. Use #5 data API or L2 `productOfferV2` to preview commission before sharing.

**Q: My affiliate ID is 9 digits, not 11 — is it wrong?**  
A: Shopee IDs vary by region/age. If your dashboard's Custom Link output contains that value after `affiliate_id=` / `an_`, it's correct.

**Q: Can I wrap `an_redir` again with Bitly / TinyURL / my own shortener?**  
A: Yes. Use 301/302 and preserve the full query string verbatim. Don't use JS redirect pages (they may drop params for crawlers). Flyn/shortener docs confirm params survive standard redirects.

**Q: Will Shopee ban me for using `an_redir` instead of GraphQL?**  
A: No — Shopee documents it as the expected manual/partner path. Bans come from TOS violations (fake clicks, misleading content), not from URL format.

**Q: How do I track which subId drove a sale?**  
A: In Affiliate dashboard → Reports → Conversion Report, filter by `utm_content` / `sub_id`. For networks, use their Reports. For self-hosted shortener, also log your own `sub_id` mapping.

---

## References

- **Official spec:** Shopee Help — Affiliate Short Link Implementation Guide (SG) `help.shopee.sg/portal/10/article/171184`, MY `help.shopee.com.my/portal/10/article/174050`, PH `help.shopee.ph/portal/10/article/172142`, PH custom link page `/portal/10/article/123992`, SG generation `help.shopee.sg/portal/10/article/191696`, SG batch `124025`.
- **Community reference impl:** `github.com/crushedmonster/shopee-affiliate-link-generator` — `index.html` (`an_redir?origin_link=…&affiliate_id=…&sub_id=…`) + `api/expand.js` (HEAD follow expansion).
- **This repo:** `REVERSE_ENGINEERING.md` (auth fragility), `docs/reverse-engineering/03-bc-custom-link-deep-dive.md` (validation weakness), `product-data-api.md` (unofficial data proxy + short-link expansion snippets).
- **Network docs:** Involve Asia — "How to Generate Your Involve Affiliate Links" + "Involve Asia vs Shopee Affiliate" + PH affiliate guide; ACCESSTRADE MY setup (via Content Egg docs).
- **Shopee Open API community docs:** This repo's `README.md` + `Code/nodejs/README.md` + open-api endpoint `https://open-api.affiliate.shopee.vn/graphql` / `...shopee.com.my/graphql` / `...shopee.com.br/graphql`.
- **Context on approval difficulty:** Reddit r/ShopeePH threads on 15–32 day reviews, help-center L1 criteria, 2026 Partner Summit note on video creator approval lift.

---

### What to do now

1. Find your `affiliate_id` (dashboard → Custom Link → Generate one → copy value).
2. Try `tools/an_redir-generator.html` locally with one product URL + that ID.
3. Paste the result in an incognito window, verify it lands on the product, then check affiliate dashboard Analytics (Clicks) after ~15–30 min.
4. If you lack L1, start with Involve Asia and generate your first network deeplink today — no Shopee Open API waiting.

> **Tip:** Keep your `affiliate_id` out of public Git commits. Store it in `.env` or browser `localStorage` only. The HTML generator here never sends it anywhere except the link itself.

---

*Maintained with RE notes in `docs/reverse-engineering/`. PRs welcome: if you discover a regional variant (e.g. `s.shopee.com.br`), add it to the domain table with a citation.*

