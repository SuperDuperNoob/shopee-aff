<?php

declare(strict_types=1);

const API_URL = 'https://open-api.affiliate.shopee.com.my/graphql';
// Shopee web API endpoint used when authenticating with a browser session cookie
// instead of app_id/secret_key credentials. See COOKIE_AUTH.md at the repo root.
const WEB_API_URL = 'https://shopee.com.my/api/v4/pdp/get_pc';

function loadEnv(string $path): array
{
    if (!file_exists($path)) {
        throw new RuntimeException('.env not found. Copy .env.example to .env first.');
    }

    $vars = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        throw new RuntimeException('Cannot read .env file.');
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);
        $vars[$key] = trim($value, "\"'");
    }

    return $vars;
}

function buildPayload(): string
{
    $apiName = $GLOBALS['argv'][1] ?? 'shopeeOfferV2';
    $inputUrl = $GLOBALS['argv'][2] ?? 'https://shopee.com.my';

    $queries = [
        'shopeeOfferV2' => <<<'GQL'
{
  shopeeOfferV2(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { offerName offerLink commissionRate }
    pageInfo { page limit hasNextPage }
  }
}
GQL,
        'brandOfferV2' => <<<'GQL'
{
  brandOffer(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { offerName offerLink commissionRate }
    pageInfo { page limit hasNextPage }
  }
}
GQL,
        'productOfferV2' => <<<'GQL'
{
  productOfferV2(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { productName offerLink commissionRate sales }
    pageInfo { page limit hasNextPage }
  }
}
GQL,
        'generateShortLink' => <<<GQL
mutation {
  generateShortLink(input: { originUrl: "{$inputUrl}", subIds: ["s1"] }) {
    shortLink
  }
}
GQL,
        'conversionReportV2' => <<<'GQL'
{
  conversionReport(limit: 5) {
    nodes { conversionId purchaseTime totalCommission }
    pageInfo { scrollId }
  }
}
GQL,
        'validationReportV2' => <<<'GQL'
{
  validatedReport(validationId: 1, limit: 5) {
    nodes { conversionId purchaseTime totalCommission }
    pageInfo { scrollId }
  }
}
GQL,
    ];

    if (!isset($queries[$apiName])) {
        $supported = implode(', ', array_keys($queries));
        throw new RuntimeException("Unsupported api name: {$apiName}. Supported: {$supported}");
    }

    return json_encode(
        ['query' => $queries[$apiName]],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}

function callShopeeApi(string $appId, string $secret, string $payload): array
{
    $timestamp = time();
    $signatureBase = $appId . $timestamp . $payload . $secret;
    $signature = hash('sha256', $signatureBase);

    $ch = curl_init(API_URL);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            "Authorization: SHA256 Credential={$appId}, Timestamp={$timestamp}, Signature={$signature}",
            'Content-Type: application/json',
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new RuntimeException('cURL error: ' . $error);
    }

    $decoded = json_decode($response, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Invalid JSON response from Shopee API.');
    }

    return [
        'http_code' => $httpCode,
        'response' => $decoded,
    ];
}

// Build headers for cookie/session authentication against Shopee's web endpoints.
// `SHOPEE_COOKIE` should be the raw Cookie header value copied from a logged-in
// browser session (e.g. `SPC_F=...; SPC_EC=...; csrftoken=...`). `SHOPEE_CSRF_TOKEN`
// is optional and only needed for state-changing (POST) requests.
function buildWebHeaders(array $env): array
{
    $cookie = $env['SHOPEE_COOKIE'] ?? '';
    if ($cookie === '') {
        throw new RuntimeException('SHOPEE_COOKIE is required for cookie/session authentication');
    }

    $headers = [
        "Cookie: {$cookie}",
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer: https://shopee.com.my/',
        'x-api-source: pc',
    ];

    if (!empty($env['SHOPEE_CSRF_TOKEN'])) {
        $headers[] = 'X-CSRFToken: ' . $env['SHOPEE_CSRF_TOKEN'];
    }

    return $headers;
}

// ---------------------------------------------------------------------------
// Cookie-mode short-link generation (affiliate portal web API)
//
// The affiliate portal's browser UI generates affiliate short links (with
// subIDs) through an internal, undocumented web API — no app_id/secret_key
// needed. Replay that exact request using your session cookie. Capture the
// real request once with tools/trace-portal-link.js and point
// SHOPEE_WEB_LINK_TEMPLATE at the resulting JSON (see
// docs/reverse-engineering/06-portal-short-link.md).
// ---------------------------------------------------------------------------

// Fallback template used when no template file exists yet. The portal endpoint
// is per-market and undocumented — replace the placeholder URL with a capture.
const PORTAL_LINK_TEMPLATE_DEFAULT = [
    'name' => 'portal-short-link',
    'method' => 'POST',
    'url' => 'https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT',
    'headers' => [
        'Accept' => 'application/json, text/plain, */*',
        'Content-Type' => 'application/json;charset=UTF-8',
        'Origin' => 'https://affiliate.shopee.com.my',
        'Referer' => 'https://affiliate.shopee.com.my/',
        'X-CSRFToken' => '{{csrfToken}}',
        'Cookie' => '{{cookie}}',
    ],
    'body' => '{"originUrl":"{{originUrl}}","subIds":{{subIds}}}',
];

// Fill the {{placeholders}} of a portal request template.
function applyTemplate(array $template, array $vars): array
{
    $sub = static function (string $s) use ($vars): string {
        return str_replace(
            ['{{originUrl}}', '{{subIds}}', '{{subIdsCsv}}', '{{csrfToken}}', '{{cookie}}'],
            [
                $vars['originUrl'] ?? '',
                json_encode($vars['subIds'] ?? [], JSON_UNESCAPED_SLASHES),
                implode(',', $vars['subIds'] ?? []),
                $vars['csrfToken'] ?? '',
                $vars['cookie'] ?? '',
            ],
            $s
        );
    };

    $headers = [];
    foreach (($template['headers'] ?? []) as $k => $v) {
        $headers[] = $k . ': ' . $sub((string) $v);
    }

    return [
        'method' => strtoupper((string) ($template['method'] ?? 'POST')),
        'url' => $sub((string) $template['url']),
        'headers' => $headers,
        'body' => $sub((string) ($template['body'] ?? '')),
    ];
}

function isPlaceholderUrl(string $url): bool
{
    return str_contains($url, 'REPLACE_ME');
}

function loadPortalTemplate(array $env): array
{
    $rel = $env['SHOPEE_WEB_LINK_TEMPLATE'] ?? 'portal-link.template.json';
    $path = $rel !== '' && $rel[0] === '/' ? $rel : __DIR__ . '/' . $rel;
    if (file_exists($path)) {
        $decoded = json_decode((string) file_get_contents($path), true);
        if (!is_array($decoded)) {
            throw new RuntimeException("Invalid portal link template file: {$path}");
        }
        return $decoded;
    }
    return PORTAL_LINK_TEMPLATE_DEFAULT;
}

// Cookie-mode short link: replay the portal's own request with your session
// cookie. Usage: php index.php shortLink <originUrl> [subId1 subId2 ...]
function callShopeeWebShortLink(array $env): array
{
    $argv = $GLOBALS['argv'] ?? [];
    $originUrl = $argv[2] ?? ($env['SHOPEE_ORIGIN_URL'] ?? '');
    $subIds = array_values(array_filter(array_slice($argv, 3)));
    if (!empty($env['SHOPEE_SUB_IDS'])) {
        $subIds = array_merge($subIds, explode(',', $env['SHOPEE_SUB_IDS']));
    }
    $subIds = array_slice(array_values(array_filter(array_map('trim', $subIds))), 0, 5);

    if ($originUrl === '') {
        throw new RuntimeException(
            'Cookie shortLink mode needs an originUrl. Pass it as the second argument or set SHOPEE_ORIGIN_URL in .env'
        );
    }
    $cookie = $env['SHOPEE_COOKIE'] ?? '';
    if ($cookie === '') {
        throw new RuntimeException('SHOPEE_COOKIE is required for cookie/session authentication');
    }

    $req = applyTemplate(loadPortalTemplate($env), [
        'originUrl' => $originUrl,
        'subIds' => $subIds,
        'cookie' => $cookie,
        'csrfToken' => $env['SHOPEE_CSRF_TOKEN'] ?? '',
    ]);

    if (isPlaceholderUrl($req['url'])) {
        throw new RuntimeException(
            "The portal short-link template still uses the placeholder URL. Capture the real request first:\n" .
            "  node tools/trace-portal-link.js --capture '<pasted cURL>' --out portal-link.template.json\n" .
            'See docs/reverse-engineering/06-portal-short-link.md.'
        );
    }

    $ch = curl_init($req['url']);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => $req['headers'],
    ];
    if ($req['method'] === 'POST') {
        $opts[CURLOPT_POST] = true;
        $opts[CURLOPT_POSTFIELDS] = $req['body'];
    }
    curl_setopt_array($ch, $opts);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new RuntimeException('cURL error: ' . $error);
    }

    $decoded = json_decode($response, true);

    return [
        'api' => 'web/portal-short-link',
        'auth' => 'cookie',
        'url' => $req['url'],
        'http_code' => $httpCode,
        'response' => is_array($decoded) ? $decoded : $response,
    ];
}

// Cookie/session mode: read a product from Shopee's web API using a logged-in
// browser cookie instead of app_id/secret_key credentials.
function callShopeeWebApi(array $env): array
{
    $itemId = $GLOBALS['argv'][1] ?? ($env['SHOPEE_ITEM_ID'] ?? '');
    $shopId = $GLOBALS['argv'][2] ?? ($env['SHOPEE_SHOP_ID'] ?? '');

    if ($itemId === '') {
        throw new RuntimeException(
            'Cookie mode needs an item_id. Pass it as the first argument or set SHOPEE_ITEM_ID in .env'
        );
    }

    $url = WEB_API_URL . '?item_id=' . rawurlencode($itemId);
    if ($shopId !== '') {
        $url .= '&shop_id=' . rawurlencode($shopId);
    }

    $headers = buildWebHeaders($env);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => $headers,
    ]);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new RuntimeException('cURL error: ' . $error);
    }

    $decoded = json_decode($response, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Invalid JSON response from Shopee web API.');
    }

    return [
        'api' => 'web/pdp/get_pc',
        'auth' => 'cookie',
        'url' => $url,
        'http_code' => $httpCode,
        'response' => $decoded,
    ];
}

try {
    $env = loadEnv(__DIR__ . '/.env');
    $appId = $env['SHOPEE_API_APP_ID'] ?? '';
    $secret = $env['SHOPEE_API_SECRET'] ?? '';
    $cookie = $env['SHOPEE_COOKIE'] ?? '';

    if ($appId !== '' && $secret !== '') {
        $payload = buildPayload();
        $result = callShopeeApi($appId, $secret, $payload);
        $result['api'] = $GLOBALS['argv'][1] ?? 'shopeeOfferV2';
        $result['auth'] = 'credentials';
    } elseif ($cookie !== '') {
        if (($GLOBALS['argv'][1] ?? '') === 'shortLink') {
            $result = callShopeeWebShortLink($env);
        } else {
            $result = callShopeeWebApi($env);
        }
    } else {
        throw new RuntimeException(
            'Missing auth config in .env. Use SHOPEE_API_APP_ID + SHOPEE_API_SECRET (credentials) or SHOPEE_COOKIE (session cookie). See Code/php/README.md and COOKIE_AUTH.md.'
        );
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'usage' => "php index.php [apiName] [originUrl-for-generateShortLink]  (credentials)\n" .
            "php index.php [itemId] [shopId]                          (cookie mode, product)\n" .
            "php index.php shortLink <originUrl> [subId1 subId2 ...]  (cookie mode, short link)",
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
