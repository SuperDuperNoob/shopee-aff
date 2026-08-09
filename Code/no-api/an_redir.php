<?php
declare(strict_types=1);

/**
 * Shopee an_redir affiliate link builder — no AppID / Secret needed.
 * Only affiliate_id (L1) required. Implements Shopee Short Link Implementation Guideline:
 *   https://{domain}/an_redir?origin_link={ENCODED}&affiliate_id={ID}&sub_id={a-b-c-d-e}
 * Docs: docs/without-appid-workarounds.md
 * Reference: github.com/crushedmonster/shopee-affiliate-link-generator (an_redir + affiliate_id)
 *
 * Usage:
 *   require 'an_redir.php';
 *   echo buildShopeeAffLink('https://shopee.vn/product/38003654/1589295236', '14382300002', ['tiktok','vid42']);
 *   echo buildShopeeAffLink('https://shopee.vn/product/38003654/1589295236', $_ENV['AFFILIATE_ID'], $_GET['subIds'] ?? []);
 */

/**
 * Strip stale Shopee tracking params and return clean URL.
 */
function cleanShopeeUrl(string $url): string
{
    $url = trim($url);
    if ($url === '') return $url;
    if (!preg_match('/^https?:\/\//i', $url)) $url = 'https://' . $url;
    $parts = parse_url($url);
    if ($parts === false) return explode('?', $url)[0];

    // Drop known tracker params; keep others if structurally needed (rare)
    $drop = ['sp_atk','xptdk','uls_trackid','smtt','utm_source','utm_medium','utm_campaign','utm_content','utm_term','af_siteid','af_sub_siteid'];
    if (!empty($parts['query'])) {
        parse_str($parts['query'], $q);
        foreach ($drop as $k) unset($q[$k]);
        $parts['query'] = http_build_query($q);
        if ($parts['query'] === '') unset($parts['query']);
    }
    unset($parts['fragment']);
    // Rebuild
    $scheme = $parts['scheme'] ?? 'https';
    $host = $parts['host'] ?? '';
    $port = isset($parts['port']) ? ':' . $parts['port'] : '';
    $path = $parts['path'] ?? '';
    $query = isset($parts['query']) && $parts['query'] !== '' ? '?' . $parts['query'] : '';
    return $scheme . '://' . $host . $port . $path . $query;
}

/**
 * Build an affiliate link via an_redir (no API).
 *
 * @param string $originUrl  Shopee product/shop/page URL (may be s.shopee.xx short; expand first if needed)
 * @param string $affiliateId Your numeric affiliate_id (e.g. 14382300002)
 * @param string[] $subIds   Up to 5 tracking values, will be sanitized & dash-joined
 * @param string $domain     Redirect domain, e.g. https://shope.ee or https://s.shopee.vn
 */
function buildShopeeAffLink(string $originUrl, string $affiliateId, array $subIds = [], string $domain = 'https://shope.ee'): string
{
    $clean = cleanShopeeUrl($originUrl);
    // For product pages, path alone suffices; keep query if any non-tracker params remain
    $toEncode = $clean;
    $encoded = rawurlencode($toEncode);
    $affiliateId = trim($affiliateId);
    // Sanitize sub_ids: alnum + _ - ; join with -
    $filtered = [];
    foreach ($subIds as $s) {
        $s = preg_replace('/[^a-zA-Z0-9_-]/', '', trim((string)$s));
        if ($s !== '') $filtered[] = $s;
        if (count($filtered) >= 5) break;
    }
    $sub = implode('-', $filtered);
    $prefix = rtrim($domain, '/') . '/an_redir?origin_link=';
    $url = $prefix . $encoded . '&affiliate_id=' . rawurlencode($affiliateId);
    if ($sub !== '') $url .= '&sub_id=' . rawurlencode($sub);
    return $url;
}

/**
 * Expand a Shopee short link (s.shopee.xx) to its canonical URL via HEAD follow.
 * Requires network; if offline, returns original.
 */
function expandShopeeShortLink(string $url, int $timeout = 10): string
{
    if (stripos($url, 's.shopee.') === false && stripos($url, 'shope.ee/') === false) return $url;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 15,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_NOBODY => true,
        CURLOPT_HEADER => false,
    ]);
    curl_exec($ch);
    $final = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    curl_close($ch);
    return filter_var($final, FILTER_VALIDATE_URL) ? $final : $url;
}

// CLI demo: php an_redir.php https://shopee.vn/product/38003654/1589295236 14382300002 tiktok vid42
if (PHP_SAPI === 'cli' && isset($argv) && basename(__FILE__) === basename($argv[0] ?? '')) {
    $u = $argv[1] ?? 'https://shopee.vn/product/38003654/1589295236';
    $id = $argv[2] ?? '14382300002';
    $subs = array_slice($argv, 3);
    if (stripos($u, 's.shopee.') !== false) $u = expandShopeeShortLink($u);
    echo buildShopeeAffLink($u, $id, $subs) . PHP_EOL;
}
