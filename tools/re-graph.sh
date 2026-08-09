#!/usr/bin/env bash
# re-graph.sh — Generate dependency graph & file stats for RE

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== File Tree (excluding .git, assets) ==="
find . -type f \( -name "*.php" -o -name "*.js" -o -name "*.md" -o -name "*.json" \) ! -path "*/.git/*" ! -path "*/assets/*" ! -path "*/node_modules/*" | sort

echo ""
echo "=== LOC per file ==="
wc -l $(find . -type f \( -name "*.php" -o -name "*.js" \) ! -path "*/.git/*" ! -path "*/assets/*") 2>/dev/null | sort -n

echo ""
echo "=== Dependency graph (requires / imports) ==="
grep -R -h --include="*.php" --include="*.js" -E "require_once|require|include|import " . | grep -Ev "node_modules|.git|assets" | sort | uniq | head -n 100

echo ""
echo "=== Mermaid file dependency diagram ==="
cat <<'MERMAID'
```mermaid
graph LR
  IndexPHP[bc-custom-link/index.php] --> Conn[conn.php]
  IndexPHP --> Func[func.php]
  IndexPHP --> jQuery[jQuery CDN]
  IndexPHP --> Bootstrap[Bootstrap CDN]
  IndexJS[Theme JS] --> IndexPHP

  LinkPHP[link.php] --> Conn
  LinkPHP --> Func

  Func --> ShopeeAPI[shopee_aff_api -> open-api.affiliate.shopee.com.my]
  Func --> DB[(MySQL optional)]

  NodeJS[Code/nodejs/index.js] --> NodeCrypto[crypto SHA256]
  NodeJS --> ShopeeAPI
  NodePHP[Code/php/index.php] --> PHPCurl[cURL]
  NodePHP --> ShopeeAPI

  Postman[Postman Collection] --> UnofficialAPI[data.addlivetag.com]
  UnofficialAPI --> ShopeeV4[shopee.com.my/api/v4/item/get]

  TracePortal[tools/trace-portal-link.js] -->|--capture| CurlCapture[DevTools Copy as cURL]
  TracePortal -->|--out| Template[portal-link.template.json]
  Template --> Samples[Code samples shortLink (cookie mode)]
  Samples --> PortalAPI[affiliate portal internal API]
```
MERMAID

echo ""
echo "=== Suggested reading order for RE ==="
echo "1. conn.php (16 LOC) — DB optional"
echo "2. func.php (159 LOC) — core: removeParam, log, short_link, shopee_aff_api"
echo "3. link.php (73 LOC) — controller: validates, sanitizes subIds"
echo "4. index.php (232 LOC) — UI glue + JS"
echo "5. Code/nodejs/index.js — clean reference impl"
echo "6. Code/php/index.php — same in PHP"
echo "7. product-data-api.md — external unofficial API spec"
echo "8. README.md — official docs"
echo "9. tools/trace-portal-link.js — portal short-link capture/replay (cookie mode)"
echo "10. docs/reverse-engineering/06-portal-short-link.md — walkthrough"

echo ""
echo "=== Generate auto-report via Node ==="
if command -v node >/dev/null 2>&1; then
  node tools/re-analyzer.js 2>&1 | tail -n 20
else
  echo "node not found, skip"
fi
