#!/usr/bin/env node
/**
 * trace-portal-link.js — Capture & replay the affiliate portal's internal
 * short-link API (the one the browser uses when you generate an affiliate
 * link with subIDs on affiliate.shopee.com.my — NOT the Open API).
 *
 * The portal endpoint is undocumented and per-market, so this tool turns your
 * one-time DevTools capture into a reusable request template that the Code/*
 * samples can replay with your session cookie (SPC_F). See
 * docs/reverse-engineering/06-portal-short-link.md for the full walkthrough.
 *
 * Usage:
 *   # 1. In the affiliate portal, generate a short link WITH a subID, then
 *   #    DevTools -> Network -> right-click the request -> Copy as cURL (bash).
 *   node tools/trace-portal-link.js --capture '<pasted cURL>' --out portal-link.template.json
 *
 *   # 2. Inspect the built-in example template:
 *   node tools/trace-portal-link.js --example
 *
 *   # 3. Replay it with your session cookie (cookie comes from SHOPEE_COOKIE
 *   #    env, or pass --cookie; CSRF from SHOPEE_CSRF_TOKEN or --csrf):
 *   SHOPEE_COOKIE='SPC_F=...; SPC_EC=...; csrftoken=...' \
 *   node tools/trace-portal-link.js --replay --template portal-link.template.json \
 *       --url 'https://shopee.com.my/product/334425154/8200081234' --subid campaign1 --subid facebook
 *
 *   # 4. Dry-run first if you just want to see the exact request (no network):
 *   node tools/trace-portal-link.js --dry-run --template portal-link.template.json \
 *       --url 'https://shopee.com.my/product/334425154/8200081234' --subid test1
 *
 * No dependencies — Node 18+ built-ins only. Secrets (Cookie / CSRF / tokens)
 * are redacted in output unless --show-secrets is passed, and are never
 * written into generated templates ({{cookie}} / {{csrfToken}} placeholders
 * are used instead).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHOPEE_URL_RE = /https?:\/\/[^\s"'\\]+/gi;
const SHOPEE_HOST_RE = /shopee\.[a-z.]+/i;
const SUBID_ARRAY_RE = /("(?:sub_?ids?)"\s*:\s*)(\[[^\]]*\])/gi;
const SUBID_STRING_RE = /("(?:sub_?ids?)"\s*:\s*)("[^"]*")/gi;
const SECRET_HEADER_RE = /^(cookie|x-csrftoken|authorization|.*token.*)$/i;

// ---------------------------------------------------------------------------
// cURL parsing (handles bash + cmd variants of DevTools "Copy as cURL")
// ---------------------------------------------------------------------------

function tokenizeCurl(str) {
    // Join backslash-newline continuations (bash multi-line copy).
    const s = str.replace(/\\\r?\n/g, " ");
    const tokens = [];
    let i = 0;

    while (i < s.length) {
        const c = s[i];
        if (/\s/.test(c)) { i++; continue; }

        // ANSI-C quoting: $'...' / $"..." (Chrome uses $'...' for --data-raw)
        if (c === "$" && (s[i + 1] === "'" || s[i + 1] === '"')) {
            const q = s[i + 1];
            i += 2;
            let buf = "";
            while (i < s.length && s[i] !== q) {
                if (s[i] === "\\" && i + 1 < s.length) {
                    const e = s[i + 1];
                    buf += e === "n" ? "\n" : e === "t" ? "\t" : e === "r" ? "\r" : e;
                    i += 2;
                } else {
                    buf += s[i];
                    i++;
                }
            }
            i++; // closing quote
            tokens.push(buf);
            continue;
        }

        if (c === "'" || c === '"') {
            const q = c;
            i++;
            let buf = "";
            while (i < s.length && s[i] !== q) {
                if (s[i] === "\\" && i + 1 < s.length) {
                    buf += s[i + 1];
                    i += 2;
                } else {
                    buf += s[i];
                    i++;
                }
            }
            i++; // closing quote
            tokens.push(buf);
            continue;
        }

        let buf = "";
        while (i < s.length && !/\s/.test(s[i])) { buf += s[i]; i++; }
        tokens.push(buf);
    }
    return tokens;
}

export function parseCurl(str) {
    const tokens = tokenizeCurl(str);
    const out = {
        method: "GET",
        url: "",
        headers: [], // [ [key, value], ... ]
        data: null,
        dataKind: "raw", // raw | urlencode
        warnings: [],
    };

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const next = () => (i + 1 < tokens.length ? tokens[++i] : "");

        // Leading `curl` / `curl.exe` command name from a pasted cURL.
        if (i === 0 && /^curl(\.exe)?$/i.test(t)) continue;

        switch (t) {
            case "-X": case "--request": {
                const v = next();
                if (v) out.method = v.toUpperCase();
                break;
            }
            case "-H": case "--header": {
                const v = next();
                const idx = v.indexOf(":");
                if (idx > 0) out.headers.push([v.slice(0, idx).trim(), v.slice(idx + 1).trim()]);
                else out.warnings.push(`Skipped malformed header token: ${v}`);
                break;
            }
            case "-d": case "--data": case "--data-raw": case "--data-binary": {
                out.data = next();
                out.dataKind = "raw";
                break;
            }
            case "--data-urlencode": {
                out.data = next();
                out.dataKind = "urlencode";
                break;
            }
            case "-G": case "--get": case "-k": case "--insecure":
            case "-s": case "--silent": case "-S": case "--show-error":
            case "-L": case "--location": case "--compressed":
            case "-g": case "--globoff": case "--http1.1": case "--http2":
            case "-i": case "--include": case "-v": case "--verbose":
                break; // flags we can safely ignore
            default: {
                if (t.startsWith("-") && t.length > 1) {
                    out.warnings.push(`Ignored unknown curl flag: ${t}`);
                } else if (!out.url) {
                    out.url = t;
                } else {
                    out.warnings.push(`Ignored extra positional token: ${t}`);
                }
            }
        }
    }

    if (out.data !== null && out.method === "GET") out.method = "POST";
    return out;
}

// ---------------------------------------------------------------------------
// Template generation from a captured request
// ---------------------------------------------------------------------------

export function redactHeader(key, value, showSecrets) {
    if (showSecrets) return value;
    if (SECRET_HEADER_RE.test(key)) {
        if (value.includes("=")) {
            return value.replace(/(=\s*)([^;\s]+)/gi, (m, eq, v) => `${eq}***${v.length > 0 ? "" : ""}(${v.length} chars)`);
        }
        return `*** (${value.length} chars)`;
    }
    return value;
}

function redactBody(body, showSecrets) {
    if (showSecrets) return body;
    return String(body).replace(/("(?:cookie|token|authorization|csrftoken|password)"\s*:\s*")[^"]*(")/gi, "$1***$2");
}

function findShopeeUrls(body) {
    const found = [];
    for (const m of String(body).matchAll(SHOPEE_URL_RE)) {
        if (SHOPEE_HOST_RE.test(m[0])) found.push(m[0]);
    }
    return found;
}

export function buildTemplateFromCapture(parsed, { name = "portal-short-link" } = {}) {
    const headers = {};
    for (const [k, v] of parsed.headers) {
        if (/^cookie$/i.test(k)) {
            headers[k] = "{{cookie}}";
        } else if (/^x-csrftoken$/i.test(k)) {
            headers[k] = "{{csrfToken}}";
        } else {
            headers[k] = v;
        }
    }

    let body = parsed.data ?? "";
    const replacements = [];

    const urls = findShopeeUrls(body);
    if (urls.length > 0) {
        body = body.replace(SHOPEE_URL_RE, (m) => {
            if (!SHOPEE_HOST_RE.test(m)) return m;
            if (replacements.includes("originUrl")) return m; // only first
            replacements.push("originUrl");
            return "{{originUrl}}";
        });
    }

    body = body.replace(SUBID_ARRAY_RE, (m, key, val) => {
        if (replacements.includes("subIds")) return m;
        replacements.push("subIds");
        return `${key}{{subIds}}`;
    });
    body = body.replace(SUBID_STRING_RE, (m, key, val) => {
        if (replacements.includes("subIdsCsv")) return m;
        replacements.push("subIdsCsv");
        return `${key}{{subIdsCsv}}`;
    });

    return {
        _comment:
            "Generated by tools/trace-portal-link.js. Template for the affiliate " +
            "portal's internal short-link API. {{originUrl}}/{{subIds}} are filled at " +
            "replay time; {{cookie}} and {{csrfToken}} come from SHOPEE_COOKIE / " +
            "SHOPEE_CSRF_TOKEN (never stored here). See " +
            "docs/reverse-engineering/06-portal-short-link.md",
        name,
        method: parsed.method,
        url: parsed.url,
        headers,
        body,
        _replaced: replacements,
        _warnings: parsed.warnings,
    };
}

// ---------------------------------------------------------------------------
// Placeholder substitution (shared shape with Code/nodejs/index.js)
// ---------------------------------------------------------------------------

export function applyTemplate(template, vars) {
    const sub = (s) =>
        String(s ?? "")
            .replaceAll("{{originUrl}}", vars.originUrl ?? "")
            .replaceAll("{{subIds}}", JSON.stringify(vars.subIds ?? []))
            .replaceAll("{{subIdsCsv}}", (vars.subIds ?? []).join(","))
            .replaceAll("{{csrfToken}}", vars.csrfToken ?? "")
            .replaceAll("{{cookie}}", vars.cookie ?? "");

    const headers = {};
    for (const [k, v] of Object.entries(template.headers ?? {})) headers[k] = sub(v);

    return {
        method: String(template.method ?? "POST").toUpperCase(),
        url: sub(template.url),
        headers,
        body: sub(template.body ?? ""),
    };
}

export function isPlaceholderUrl(url) {
    return /REPLACE_ME|example\.com|your-endpoint/i.test(String(url));
}

// ---------------------------------------------------------------------------
// Replay
// ---------------------------------------------------------------------------

async function sendRequest(req, { timeoutMs = 30000 } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(req.url, {
            method: req.method,
            headers: req.headers,
            body: req.method === "GET" ? undefined : req.body,
            signal: controller.signal,
            redirect: "manual",
        });
        const text = await response.text();
        let json = null;
        try { json = JSON.parse(text); } catch { /* not JSON */ }
        return { status: response.status, headers: Object.fromEntries(response.headers), text, json };
    } finally {
        clearTimeout(timer);
    }
}

function printRequest(req, showSecrets) {
    const redact = (k, v) => redactHeader(k, v, showSecrets);
    console.log(`> ${req.method} ${req.url}`);
    for (const [k, v] of Object.entries(req.headers)) console.log(`> ${k}: ${redact(k, v)}`);
    if (req.body) console.log(`>\n> body: ${redactBody(req.body, showSecrets)}`);
}

function readTemplate(pathOrEnv) {
    const candidates = [];
    if (process.env.SHOPEE_WEB_LINK_TEMPLATE) candidates.push(process.env.SHOPEE_WEB_LINK_TEMPLATE);
    if (pathOrEnv) candidates.push(pathOrEnv);

    for (const c of candidates) {
        const p = path.isAbsolute(c) ? c : path.resolve(__dirname, "..", c);
        if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
    }
    throw new Error(
        `Template not found (tried: ${candidates.join(", ")}). Run --capture first or pass --template <file>.`,
    );
}

function printUsage() {
    console.log(`
trace-portal-link.js — capture & replay the affiliate portal's internal short-link API

Commands:
  --capture '<cURL>'            Parse a DevTools "Copy as cURL" capture and print the
                                normalized request (+ generate a template with --out)
  --out <file.json>             (with --capture) write the reusable request template
  --example                     Print the built-in example template
  --dry-run                     Build the request from a template and print it (no network)
  --replay                      Build the request from a template and send it

Replay options (also used by --dry-run):
  --template <file.json>        Template path (or SHOPEE_WEB_LINK_TEMPLATE env)
  --url <originUrl>             The Shopee product/shop URL to turn into a short link
  --subid <id>                  Tracking subID (repeat up to 5 times, or comma list)
  --cookie '<...>'              Session cookie (default: SHOPEE_COOKIE env)
  --csrf <token>                CSRF token (default: SHOPEE_CSRF_TOKEN env)
  --show-secrets                Print full cookie/token values (default: redacted)

Examples:
  node tools/trace-portal-link.js --capture "curl 'https://...' -H 'Cookie: SPC_F=x' --data-raw '...'" --out portal-link.template.json
  node tools/trace-portal-link.js --dry-run --template portal-link.template.json --url "https://shopee.com.my/product/1/2" --subid a --subid b
  SHOPEE_COOKIE='SPC_F=...; csrftoken=...' node tools/trace-portal-link.js --replay --template portal-link.template.json --url "https://shopee.com.my/product/1/2" --subid campaign1
`);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--subid") {
            (args.subids ??= []).push(...argv[++i].split(",").filter(Boolean));
        } else if (a.startsWith("--")) {
            const key = a.slice(2);
            const v = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
            args[key] = v;
        } else if (!args.positional) {
            args.positional = a;
        }
    }
    return args;
}

const EXAMPLE_TEMPLATE = {
    _comment:
        "Example template for the affiliate portal's internal short-link API. " +
        "Capture the REAL request with --capture to replace this placeholder.",
    name: "portal-short-link",
    method: "POST",
    url: "https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT",
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=UTF-8",
        Origin: "https://affiliate.shopee.com.my",
        Referer: "https://affiliate.shopee.com.my/",
        "X-CSRFToken": "{{csrfToken}}",
        Cookie: "{{cookie}}",
    },
    body: '{"originUrl":"{{originUrl}}","subIds":{{subIds}}}',
};

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const showSecrets = Boolean(args["show-secrets"]);

    if (args.capture) {
        const parsed = parseCurl(args.capture);
        const template = buildTemplateFromCapture(parsed);

        console.log("== Captured request (normalized) ==");
        console.log(`Method : ${parsed.method}`);
        console.log(`URL    : ${parsed.url}`);
        console.log("Headers:");
        for (const [k, v] of parsed.headers) console.log(`  ${k}: ${redactHeader(k, v, showSecrets)}`);
        console.log(`Body   : ${parsed.data ? redactBody(parsed.data, showSecrets) : "(none)"}`);
        for (const w of parsed.warnings) console.log(`Warning: ${w}`);

        console.log("\n== Template placeholders detected ==");
        console.log(template._replaced.length
            ? `  ${template._replaced.join(", ")}`
            : "  none — you may need to add {{originUrl}} / {{subIds}} manually (see doc 06).");

        if (args.out) {
            const outPath = path.resolve(args.out);
            const { _replaced, _warnings, ...clean } = template;
            fs.writeFileSync(outPath, JSON.stringify(clean, null, 2) + "\n");
            console.log(`\nTemplate written to ${outPath}`);
            console.log("Next: run with --dry-run, then --replay using SHOPEE_COOKIE (see --help/usage).");
        }
        return;
    }

    if (args.example) {
        console.log(JSON.stringify(EXAMPLE_TEMPLATE, null, 2));
        return;
    }

    if (args["dry-run"] || args.replay) {
        const template = readTemplate(args.template);
        const cookie = args.cookie ?? process.env.SHOPEE_COOKIE ?? "";
        const csrf = args.csrf ?? process.env.SHOPEE_CSRF_TOKEN ?? "";
        const originUrl = args.url ?? "";
        const subIds = (args.subids ?? []).slice(0, 5);

        if (!originUrl) throw new Error("--url <originUrl> is required (the Shopee URL to shorten).");
        if (!cookie) throw new Error("No session cookie. Set SHOPEE_COOKIE or pass --cookie.");

        const req = applyTemplate(template, { originUrl, subIds, cookie, csrfToken: csrf });

        if (isPlaceholderUrl(req.url)) {
            console.error(
                "Template URL is still a placeholder. Capture the real portal request first:\n" +
                "  node tools/trace-portal-link.js --capture '<pasted cURL>' --out portal-link.template.json",
            );
            process.exitCode = 1;
            return;
        }

        console.log(`== ${args["dry-run"] ? "DRY RUN" : "REPLAY"} (template: ${template.name ?? "?"}) ==`);
        console.log(`originUrl: ${originUrl}`);
        console.log(`subIds   : ${subIds.length ? subIds.join(", ") : "(none)"}`);
        printRequest(req, showSecrets);

        if (args["dry-run"]) return;

        const res = await sendRequest(req);
        console.log(`\n< HTTP ${res.status}`);
        if (res.json) console.log(JSON.stringify(res.json, null, 2));
        else console.log(res.text.slice(0, 2000));

        if (res.status >= 400) {
            console.error(
                "\nHint: 4xx usually means expired session (re-copy SPC_F), wrong market " +
                "domain, or missing/rotated CSRF token. 5xx can mean the endpoint path " +
                "changed — re-capture. See docs/reverse-engineering/06-portal-short-link.md.",
            );
            process.exitCode = 1;
        } else {
            console.log("\nOK. If the response contains a short link (shp.ee / s.shopee.*), you are done. Verify subID attribution per doc 06.");
        }
        return;
    }

    printUsage();
}

main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
});
