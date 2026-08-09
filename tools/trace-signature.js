#!/usr/bin/env node
/**
 * trace-signature.js — Trace Shopee Affiliate API signature construction without network
 * Helps you RE the auth flow.
 *
 * Usage:
 *  node tools/trace-signature.js --appId 123456 --secret mysecret --url https://shopee.com.my/product/334425154/8200081234
 *  node tools/trace-signature.js --appId demo --secret demo --api productOfferV2
 */

import crypto from "crypto";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const k = args[i].replace(/^--/, "");
      const v = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
      out[k] = v;
      if (v !== true) i++;
    }
  }
  return out;
}

function buildPayload(apiName, inputUrl) {
  const queries = {
    shopeeOfferV2: `{
  shopeeOfferV2(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { offerName offerLink commissionRate }
    pageInfo { page limit hasNextPage }
  }
}`,
    productOfferV2: `{
  productOfferV2(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { productName offerLink commissionRate sales }
    pageInfo { page limit hasNextPage }
  }
}`,
    generateShortLink: `
mutation {
  generateShortLink(input: { originUrl: "${inputUrl}", subIds: ["s1"] }) {
    shortLink
  }
}
`,
    conversionReportV2: `
{
  conversionReport(limit: 5) {
    nodes { conversionId purchaseTime totalCommission }
    pageInfo { scrollId }
  }
}
`,
  };
  if (!queries[apiName]) throw new Error(`Unsupported apiName ${apiName}`);
  return JSON.stringify({ query: queries[apiName] });
}

function main() {
  const { appId = "123456", secret = "secret_key", url = "https://shopee.com.my/product/334425154/8200081234", api = "generateShortLink" } = parseArgs();

  console.log("== Shopee Affiliate Signature Tracer ==\n");
  console.log(`Inputs:\n  appId: ${appId}\n  secret: ${secret}\n  api: ${api}\n  url: ${url}\n`);

  const payload = buildPayload(api, url);
  console.log("Step 1: Payload (JSON.stringify GraphQL)\n----------------------------------------");
  console.log(payload);
  console.log(`\nPayload length: ${payload.length} bytes`);
  console.log(`Payload preview hex (first 64 bytes): ${Buffer.from(payload).toString("hex").slice(0, 128)}`);

  const timestamp = Math.floor(Date.now() / 1000);
  console.log("\nStep 2: Timestamp\n----------------------------------------");
  console.log(`timestamp = ${timestamp}  (Date: ${new Date(timestamp * 1000).toISOString()})`);

  const factor = `${appId}${timestamp}${payload}${secret}`;
  console.log("\nStep 3: Factor = appId + timestamp + payload + secret (concatenated, no delimiter!)\n----------------------------------------");
  console.log(`factor length: ${factor.length}`);
  console.log(`factor preview (first 200 chars): ${factor.slice(0, 200)}...`);
  console.log(`factor preview (last 200 chars): ...${factor.slice(-200)}`);

  const signature = crypto.createHash("sha256").update(factor).digest("hex");
  console.log("\nStep 4: Signature = hex(SHA256(factor))\n----------------------------------------");
  console.log(`signature: ${signature}`);
  console.log(`signature length: ${signature.length} (should be 64 hex chars for SHA256)`);

  const authHeader = `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;
  console.log("\nStep 5: Authorization Header\n----------------------------------------");
  console.log(authHeader);

  console.log("\nStep 6: Curl (dry run, won't execute without valid creds)\n----------------------------------------");
  console.log(`curl -X POST 'https://open-api.affiliate.shopee.com.my/graphql' \\
  -H 'Authorization: ${authHeader}' \\
  -H 'Content-Type: application/json' \\
  --data-raw '${payload.replace(/'/g, "'\\''")}'`);

  console.log("\n== Pitfalls to check ==");
  console.log("- payload must be byte-identical to what server recomputes: no pretty print, keep JSON_UNESCAPED_SLASHES in PHP");
  console.log("- timestamp tolerance likely ~10 mins; if your clock skews, you get 10020");
  console.log("- factor concat without delimiter: ensure appId|timestamp boundaries don't collide");
  console.log("- For generateShortLink, variables version (from func.php) uses {query, variables} JSON, signature includes full JSON");

  console.log("\n== Extra: Variables version (as used in bc-custom-link/func.php) ==");
  const payloadWithVars = JSON.stringify({
    query: "mutation GenerateShortLink($originUrl: String!, $subIds: [String]) { generateShortLink(input: {originUrl: $originUrl, subIds: $subIds}) { shortLink } }",
    variables: { originUrl: url, subIds: ["s1", "s2"] },
  });
  console.log(payloadWithVars);
  const factor2 = `${appId}${timestamp}${payloadWithVars}${secret}`;
  const sig2 = crypto.createHash("sha256").update(factor2).digest("hex");
  console.log(`Signature (variables version): ${sig2}`);
}

main();
