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
        $result = callShopeeWebApi($env);
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
        'usage' => 'php index.php [apiName] [originUrl-for-generateShortLink]  (credentials) | php index.php [itemId] [shopId]  (cookie mode)',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
