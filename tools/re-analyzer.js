#!/usr/bin/env node
/**
 * re-analyzer.js — Static Reverse Engineering Analyzer for shopee-aff
 * 
 * Parses repo without executing it, extracts:
 *  - file inventory
 *  - functions / exports per file
 *  - external hosts, curl/fetch, GraphQL ops, auth patterns
 *  - secrets patterns, $_POST/$_GET flows, DB interactions
 *  - generates markdown + JSON report
 * 
 * Usage: node tools/re-analyzer.js [--json] [--md]
 *  No deps, uses Node built-ins only.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const IGNORE_DIRS = new Set([".git", "node_modules", ".next", "dist", "assets"]);
const CODE_EXT = new Set([".php", ".js", ".json", ".md"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (CODE_EXT.has(path.extname(entry.name)) || entry.name.includes(".")) {
      // also include .env.example etc
      if (!full.includes(".git/")) out.push(full);
    }
  }
  return out;
}

function readSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

const PATTERNS = {
  phpFunction: /\bfunction\s+([a-zA-Z0-9_]+)\s*\(/g,
  jsFunction: /(?:function\s+([a-zA-Z0-9_]+)\s*\(|(?:export\s+)?(?:async\s+)?(?:function\s*)?([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(|export\s+function\s+([a-zA-Z0-9_]+))/g,
  jsExport: /export\s+(?:function|const|let|var|class)\s+([a-zA-Z0-9_]+)/g,
  graphqlOp: /\b(shopeeOfferV2|productOfferV2|shopOfferV2|brandOfferV2?|brandOffer|generateShortLink|conversionReport|validatedReport|conversionReportV2|validationReportV2)\b/g,
  authSig: /(SHA256|Credential|Signature|Timestamp|hash\(['"]sha256['"]\)|createHash\(['"]sha256['"]\))/g,
  externalHost: /https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"'\)]*)?/gi,
  curl: /\bcurl_\w+|fetch\(/g,
  supGlobals: /\$_(POST|GET|COOKIE|SESSION|SERVER)\b/g,
  db: /mysqli|pdo|INSERT INTO|CREATE TABLE/g,
  subIds: /subIds?|Sub_id/g,
  dotEnv: /SHOPEE_API|APP_ID|SECRET|\.env/g,
  removeParam: /removeParam/g,
};

function analyzeFile(absPath) {
  const rel = path.relative(ROOT, absPath);
  const content = readSafe(absPath);
  const lines = content.split("\n").length;

  const result = {
    path: rel,
    lines,
    functions: [],
    matches: {},
  };

  // PHP functions
  let m;
  const phpFuncRegex = /\bfunction\s+([a-zA-Z0-9_]+)\s*\(/g;
  while ((m = phpFuncRegex.exec(content))) result.functions.push(m[1]);

  // JS functions (simplified)
  if (rel.endsWith(".js")) {
    const jsFuncRegex = /(?:export\s+)?function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(/g;
    while ((m = jsFuncRegex.exec(content))) {
      const name = m[1] || m[2];
      if (name && !result.functions.includes(name)) result.functions.push(name);
    }
  }

  for (const [key, regex] of Object.entries(PATTERNS)) {
    if (key === "phpFunction") continue;
    const re = new RegExp(regex.source, regex.flags);
    const hits = [...content.matchAll(re)].map((x) => ({
      match: x[0],
      line: content.slice(0, x.index).split("\n").length,
    }));
    if (hits.length) result.matches[key] = hits.slice(0, 20); // cap
  }

  return result;
}

function main() {
  const files = walk(ROOT)
    .filter((f) => {
      const ext = path.extname(f);
      return [".php", ".js", ".md", ".json"].includes(ext) && !f.includes("assets/") && !f.includes(".git");
    })
    .filter((f) => !f.includes("package-lock"));

  const analyzed = files.map(analyzeFile);

  const hosts = new Set();
  const graphqlOps = new Set();
  const allFunctions = [];

  for (const a of analyzed) {
    if (a.matches.externalHost) {
      for (const h of a.matches.externalHost) hosts.add(h.match);
    }
    if (a.matches.graphqlOp) {
      for (const g of a.matches.graphqlOp) graphqlOps.add(g.match);
    }
    for (const fn of a.functions) allFunctions.push({ file: a.path, fn });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    totalFiles: analyzed.length,
    hosts: [...hosts],
    graphqlOps: [...graphqlOps],
    functions: allFunctions,
    files: analyzed,
  };

  const outDir = path.join(ROOT, "docs/reverse-engineering");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, "auto-report.json"), JSON.stringify(report, null, 2), "utf8");

  // Markdown
  let md = `# Auto-Generated Reverse Engineering Report\n\nGenerated: ${report.generatedAt}\n\n## Summary\n- Files analyzed: ${report.totalFiles}\n- External hosts: ${report.hosts.join(", ") || "none"}\n- GraphQL ops found: ${report.graphqlOps.join(", ") || "none"}\n- Total functions: ${report.functions.length}\n\n## Hosts\n\n`;
  md += report.hosts.map((h) => `- \`${h}\``).join("\n") + "\n\n";

  md += `## GraphQL Operations\n\n`;
  md += report.graphqlOps.map((o) => `- \`${o}\``).join("\n") + "\n\n";

  md += `## Functions by File\n\n| File | Functions | Lines |\n|------|-----------|-------|\n`;
  for (const f of analyzed.sort((a, b) => b.lines - a.lines)) {
    md += `| ${f.path} | ${f.functions.join(", ") || "-"} | ${f.lines} |\n`;
  }

  md += `\n## Detailed Matches (Potential Security / Flow)\n\n`;
  for (const f of analyzed) {
    if (Object.keys(f.matches).length === 0) continue;
    md += `\n### ${f.path} (${f.lines} LOC)\n`;
    for (const [k, hits] of Object.entries(f.matches)) {
      md += `- **${k}**: ${hits.map((h) => `\`L${h.line}: ${h.match.slice(0, 80)}\``).join(", ")}\n`;
    }
  }

  md += `\n## How to Use This Report\n\n1. Start with files with most functions: \`bc-custom-link/func.php\`, \`Code/nodejs/index.js\`\n2. Follow host call chain: \`bc-custom-link/index.php -> link.php -> func.php -> https://open-api.affiliate.shopee.vn/graphql\`\n3. Check auth: search for \`authSig\`\n4. Trace input: search for \`supGlobals\` (\$_POST) + \`subIds\`\n`;

  fs.writeFileSync(path.join(outDir, "auto-report.md"), md, "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.log(`\n---\nReport written to docs/reverse-engineering/auto-report.md and .json`);
}

main();
