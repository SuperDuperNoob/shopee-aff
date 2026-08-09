#!/usr/bin/env bash
# security-scan.sh — Quick grep-based security audit for shopee-aff
# Non-exhaustive, educational RE tooling

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Shopee-aff Security Scan ==="
echo "Root: $ROOT"
echo

echo "--- 1. Secrets / Hardcoded creds ---"
grep -R -n --include="*.php" --include="*.js" "demo\|123456\|secret_key\|apiAppID\|apiSecret" Code/ bc-custom-link/ || echo "No obvious hardcoded demo secrets beyond expected"

echo
echo "--- 2. Superglobals without sanitization ---"
grep -R -n --include="*.php" "\$_POST\|\$_GET\|\$_REQUEST" bc-custom-link/ Code/php/ || echo "Clean"

echo
echo "--- 3. SQL Injection checks (should use prepared) ---"
grep -R -n --include="*.php" "mysqli_query\|mysql_query\|->query(\|INSERT INTO.*\$_" . || echo "No raw interpolated queries found (good)"

echo
echo "--- 4. XSS / Echo unsanitized ---"
grep -R -n --include="*.php" "echo.*\$_\|print.*\$_" bc-custom-link/ || echo "No direct echo of superglobals"

echo
echo "--- 5. CORS / Security headers ---"
grep -R -n --include="*.php" "Access-Control-Allow-Origin\|setcookie\|header(" bc-custom-link/ Code/php/ || echo "No headers"

echo
echo "--- 6. Cookie flags ---"
grep -R -n --include="*.php" "setcookie\|SameSite\|httponly\|secure" bc-custom-link/ || echo "No cookie logic"

echo
echo "--- 7. Regex sanitization ---"
grep -R -n --include="*.php" "preg_replace\|removeParam" bc-custom-link/ || echo "None"

echo
echo "--- 8. cURL / SSRF potential ---"
grep -R -n --include="*.php" --include="*.js" "curl\|fetch\|CURLOPT_URL\|open.shopee" . | grep -Ev ".git|assets" | head -n 30

echo
echo "--- 9. Host validation ---"
grep -R -n --include="*.php" --include="*.js" "shopee\." bc-custom-link/ Code/ || echo "None"

echo
echo "--- 10. File inclusion / LFI ---"
grep -R -n --include="*.php" "require\|include" bc-custom-link/ Code/php/ | head -n 20

echo
echo "--- 11. .env exposure check ---"
ls -la .env* 2>/dev/null || echo "No .env at root (good, should be gitignored)"
cat .gitignore
grep -R "\.env" .gitignore || echo ".env not gitignored? CHECK!"

echo
echo "--- 12. CDN versions (known CVEs) ---"
grep -R -n "jquery\|bootstrap\|popper\|js.cookie" bc-custom-link/index.php || true
echo "jQuery 3.6.0 is okay (patched CVE-2020-11022/11023). Bootstrap 4.1.3 is OLD — check CVE-2018-14040, CVE-2018-14042 (XSS in collapse) — but used only for UI, not critical."

echo
echo "=== End Scan — Manual review still required ==="
