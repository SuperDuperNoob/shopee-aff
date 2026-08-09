#!/usr/bin/env node
/**
 * Shopee Affiliate — an_redir link generator (no AppID/Secret needed)
 * Requires only affiliate_id (L1). Implements Shopee's official Short Link Implementation Guideline.
 *
 * Usage:
 *   node tools/generate-anredir-link.js --affiliate-id 14382300002 --url https://shopee.vn/product/38003654/1589295236 --sub-id tiktok --sub-id vid42
 *   node tools/generate-anredir-link.js --affiliate-id 14382300002 --url https://s.shopee.vn/4VU2IjQjPF --expand
 *   node tools/generate-anredir-link.js --affiliate-id 14382300002 --url https://shopee.sg/product/68475578/27971600849 --domain https://shope.ee --json
 *
 * See docs/without-appid-workarounds.md for full research.
 */

function printHelp() {
  console.log(`
Shopee an_redir generator — no AppID/secret required.

Options:
  --affiliate-id <id>   Your Shopee affiliate_id (numeric, e.g. 14382300002)  [required]
  --url <url>           Origin Shopee URL (product/shop/page), or short link    [required]
  --sub-id <value>      One sub_id segment (repeatable, up to 5 joined with '-')
  --domain <domain>     Redirect domain prefix (default: https://shope.ee)
                        Other valid: https://s.shopee.vn, https://s.shopee.sg, https://s.shopee.com.my, https://s.shopee.ph, etc.
  --expand              If url is s.shopee.* short link, expand it first via HEAD follow
  --json                Output JSON instead of plain link
  --help                Show this help

Examples:
  node tools/generate-anredir-link.js --affiliate-id 17382940011 --url "https://shopee.vn/product/38003654/1589295236"
  node tools/generate-anredir-link.js --affiliate-id 17382940011 --url "https://shopee.vn/product/38003654/1589295236" --sub-id tiktok --sub-id "\\$(date +%F)"
  node tools/generate-anredir-link.js --affiliate-id 14382300002 --url "https://s.shopee.sg/xyz" --expand --json
`);
}

// ---- arg parse ----
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(args.length === 0 ? 1 : 0);
}

function getArg(name) {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}
function getAllArg(name) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === name) out.push(args[i + 1]);
  }
  return out.filter(Boolean);
}
const affiliateId = getArg('--affiliate-id') || getArg('--affiliate_id');
const rawUrl = getArg('--url');
const domain = getArg('--domain') || 'https://shope.ee';
const shouldExpand = args.includes('--expand');
const wantJson = args.includes('--json') || args.includes('--JSON');
const subIdsRaw = getAllArg('--sub-id').concat(getAllArg('--sub_id'));

if (!affiliateId || !rawUrl) {
  console.error('Error: --affiliate-id and --url are required. See --help');
  process.exit(1);
}
if (!/^[0-9]{6,20}$/.test(affiliateId.trim())) {
  console.warn(`Warning: affiliate_id "${affiliateId}" doesn't look numeric (expected 6-20 digits). Continuing anyway.`);
}

function cleanUrl(url) {
  // Strip whitespace, remove existing affiliate tracking params that would be stale.
  // Keep it simple: for product pages, dropping query is safe. For generic, drop known trackers.
  let u = url.trim();
  // If url has no scheme, prepend https://
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try {
    const parsed = new URL(u);
    // Host sanity hint (not strict)
    if (!parsed.hostname.includes('shopee.') && !parsed.hostname.includes('shope.ee') && !parsed.hostname.includes('shopee')) {
      console.warn(`Warning: host "${parsed.hostname}" doesn't contain "shopee." — still building link, but verify it's a Shopee URL.`);
    }
    // Remove known tracker params if present — we re-add our own
    const drop = ['sp_atk', 'xptdk', 'uls_trackid', 'smtt', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'af_siteid', 'af_sub_siteid'];
    for (const k of drop) parsed.searchParams.delete(k);
    // If after stripping we have no query, just use origin+pathname
    // For safety we return full href without hash
    parsed.hash = '';
    // If no query left, simpler to use origin+pathname; else keep remaining query (rare case where page needs query)
    return parsed.toString();
  } catch {
    // fallback: split at ? and #
    return u.split('#')[0].split('?')[0];
  }
}

function buildLink({ originUrl, affiliateId, subIds, domain }) {
  const clean = cleanUrl(originUrl);
  // Shopee spec wants origin_link value URL-encoded once (encodeURIComponent)
  const baseUrl = clean.split('?')[0].split('#')[0]; // product pages don't need query; keep path only
  // But if clean still has query after dropping trackers, keep it — encode fully.
  // Decide: if clean has "?" use clean; else use baseUrl. We use clean to not lose legit params.
  const toEncode = clean.includes('?') ? clean : baseUrl;
  // Some URLs have hash routing — not needed for Shopee product path.
  const encoded = encodeURIComponent(toEncode);
  const filtered = subIds.map(s => s.toString().trim()).filter(Boolean).map(s => s.replace(/[^a-zA-Z0-9_-]/g, '')).slice(0, 5).filter(Boolean);
  const sub = filtered.length ? filtered.join('-') : '';
  const prefix = domain.replace(/\/$/, '') + '/an_redir?origin_link=';
  const withId = `${prefix}${encoded}&affiliate_id=${encodeURIComponent(affiliateId.trim())}`;
  return sub ? `${withId}&sub_id=${encodeURIComponent(sub)}` : withId;
}

async function expandUrl(url) {
  // Follow redirects and return effective URL. Use fetch with redirect follow.
  // Node 18+ has global fetch.
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    // Some Shopee interstitials return 200 HTML with JS redirect instead of 302;
    // fetch HEAD won't execute JS, but Location expansion still works for true 302s.
    // Fallback: if response.url === url and we expected expansion, try GET.
    if (res.url && res.url !== url) return res.url;
    if (res.url === url) {
      const res2 = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
      return res2.url || url;
    }
    return res.url || url;
  } catch (e) {
    console.error(`Expand failed for ${url}: ${e.message}. Using original URL.`);
    return url;
  }
}

async function main() {
  let origin = rawUrl;
  if (shouldExpand || origin.includes('s.shopee.')) {
    // auto-expand if looks like short link, unless --no-expand explicitly? we auto when --expand or host is s.shopee.
    const isShort = origin.includes('s.shopee.') || origin.includes('shope.ee/');
    if (isShort) {
      origin = await expandUrl(origin);
      if (wantJson) {
        // will include in JSON
      } else {
        console.error(`(expanded ${rawUrl} → ${origin})`);
      }
    }
  }

  const link = buildLink({ originUrl: origin, affiliateId, subIds: subIdsRaw, domain });

  if (wantJson) {
    const clean = cleanUrl(rawUrl);
    console.log(JSON.stringify({
      input_url: rawUrl,
      expanded_url: origin !== rawUrl ? origin : undefined,
      cleaned_url: clean,
      affiliate_id: affiliateId,
      sub_ids: subIdsRaw.slice(0, 5),
      sub_id_joined: subIdsRaw.map(s => s.replace(/[^a-zA-Z0-9_-]/g, '')).slice(0, 5).join('-') || null,
      redirect_domain: domain,
      affiliate_link: link,
      method: 'an_redir (no AppID/secret)',
      verify_hint: 'Open in incognito, verify it 302s to product, then check Shopee affiliate Analytics for click within ~30 min.',
      docs: 'docs/without-appid-workarounds.md'
    }, null, 2));
  } else {
    console.log(link);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
