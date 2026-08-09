# 05 — Reverse Engineering Methodology Cheatsheet (1-page)

> Reusable for any repo. Print this.

## Phase 0: Scope (2 min)

- [ ] What does repo claim to do? Read README top.
- [ ] What does it actually do? `find` + `wc -l` + `grep -i todo|fixme|hack|secret`.
- [ ] Who is actor? (affiliate, buyer, admin)

## Phase 1: Recon (5 min)

```bash
find . -type f | grep -Ev ".git/|node_modules/|assets/" | sort
grep -R "https://\|http://\|curl\|fetch\|Authorization\|SECRET\|API_KEY" -n --include="*.php" --include="*.js" .
cat .gitignore; ls -la .env*; ls postman/ -l
```

## Phase 2: Static — Bottom Up (15 min)

- Start leaf: conn.php / funcs / utils
- For each function: Inputs -> Flavors -> Side effects -> Fail modes
- Draw call graph on paper: UI -> Controller -> Service -> External
- Mark trust boundaries: where user input first validated, where secret used

## Phase 3: Dynamic — Trace One Happy Path (10 min)

1. Run locally (`php -S` or `npm start`)
2. DevTools Network + Debugger breakpoint
3. One curl of main endpoint
4. Observe logs, DB, cookies
5. Force one error (bad signature, bad URL) to see error branch

## Phase 4: Crypto / Auth (10 min)

- [ ] How timestamp generated? Tolerance?
- [ ] Payload canonicalization? (JSON whitespace, key order)
- [ ] Signature: HMAC or plain hash? Delimiter? Hex vs base64?
- [ ] Header format & replay window
- Write tracer script (see `tools/trace-signature.js`)

## Phase 5: Data & State (10 min)

- [ ] DB schema: PK, indexes, nullable, auto_inc
- [ ] Cache: duration, key, invalidation
- [ ] Rate limit: key (IP? user?), window, response (429? Retry-After?)
- [ ] Cookies / sessions: flags (HttpOnly, Secure, SameSite), expiry, domain

## Phase 6: Security quick scan (10 min)

```bash
grep -R "_POST\|_GET\|_REQUEST\|eval\|exec\|base64_decode\|mysqli_query" --include="*.php" -n .
grep -R "innerHTML\|eval\|document.write" --include="*.js" -n .
# Check:
# - Host validation (contains vs suffix)
# - XFF spoof
# - XSS (echo $_, innerHTML)
# - SQLi (interpolated vs prepared)
# - SSRF (URL fetch without allowlist)
# - CORS *
# - CDN CVEs (bootstrap 4.1.3 old)
```

## Phase 7: Doc & Tool (10 min)

- Write one mermaid flowchart + one sequence diagram
- Write `auto-report.md` via script
- List 3 extension ideas + 3 pitfalls

## Deliverables checklist

- [ ] REVERSE_ENGINEERING.md with findings + diagrams
- [ ] tools/* script that automates part of RE
- [ ] docs/reverse-engineering/*.md modular deep dives
- [ ] One runnable example that proves your model (curl, node tracer, etc.)

## Questions to always answer

1. Where does user input enter? Where is it first sanitized?
2. Where does secret enter? Where is it used? Is it ever logged?
3. What happens if DB is down? (fails open/closed?)
4. What happens if upstream API 429/timeout?
5. What is the smallest change that would break everything? (single point of failure)

Total ~60 min for small repo like shopee-aff.
