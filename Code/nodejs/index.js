import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const API_URL = "https://open-api.affiliate.shopee.com.my/graphql";
// Shopee web API endpoint used when authenticating with a browser session cookie
// instead of app_id/secret_key credentials. See COOKIE_AUTH.md at the repo root.
const WEB_API_URL = "https://shopee.com.my/api/v4/pdp/get_pc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(".env not found. Copy .env.example to .env first.");
    }

    const content = fs.readFileSync(filePath, "utf8");
    const env = {};

    for (const rawLine of content.split("\n")) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;

        const [key, ...rest] = line.split("=");
        if (!key || rest.length === 0) continue;

        env[key.trim()] = rest
            .join("=")
            .trim()
            .replace(/^['"]|['"]$/g, "");
    }

    return env;
}

export function buildPayload(apiName, inputUrl) {
    const queries = {
        shopeeOfferV2: `
{
  shopeeOfferV2(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { offerName offerLink commissionRate }
    pageInfo { page limit hasNextPage }
  }
}
`,
        brandOfferV2: `
{
  brandOffer(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { offerName offerLink commissionRate }
    pageInfo { page limit hasNextPage }
  }
}
`,
        productOfferV2: `
{
  productOfferV2(keyword: "phone", sortType: 1, page: 1, limit: 5) {
    nodes { productName offerLink commissionRate sales }
    pageInfo { page limit hasNextPage }
  }
}
`,
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
        validationReportV2: `
{
  validatedReport(validationId: 1, limit: 5) {
    nodes { conversionId purchaseTime totalCommission }
    pageInfo { scrollId }
  }
}
`,
    };

    if (!queries[apiName]) {
        const supported = Object.keys(queries).join(", ");
        throw new Error(`Unsupported api name: ${apiName}. Supported: ${supported}`);
    }

    return JSON.stringify({ query: queries[apiName] });
}

export function buildAuthorization(appId, secret, payload, timestamp) {
    const signatureBase = `${appId}${timestamp}${payload}${secret}`;
    const signature = crypto.createHash("sha256").update(signatureBase).digest("hex");
    return `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;
}

// Build headers for cookie/session authentication against Shopee's web endpoints.
// `SHOPEE_COOKIE` should be the raw Cookie header value copied from a logged-in
// browser session (e.g. `SPC_F=...; SPC_EC=...; csrftoken=...`). `SHOPEE_CSRF_TOKEN`
// is optional and only needed for state-changing (POST) requests.
export function buildWebHeaders(env) {
    const cookie = env.SHOPEE_COOKIE || "";
    if (!cookie) {
        throw new Error("SHOPEE_COOKIE is required for cookie/session authentication");
    }

    const headers = {
        Cookie: cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://shopee.com.my/",
        "x-api-source": "pc",
    };

    if (env.SHOPEE_CSRF_TOKEN) {
        headers["X-CSRFToken"] = env.SHOPEE_CSRF_TOKEN;
    }

    return headers;
}

// Cookie/session mode: read a product from Shopee's web API using a logged-in
// browser cookie instead of app_id/secret_key credentials.
async function callShopeeWebApi(env) {
    const itemId = process.argv[2] || env.SHOPEE_ITEM_ID || "";
    const shopId = process.argv[3] || env.SHOPEE_SHOP_ID || "";

    if (!itemId) {
        throw new Error(
            "Cookie mode needs an item_id. Pass it as the first argument or set SHOPEE_ITEM_ID in .env",
        );
    }

    const url = new URL(WEB_API_URL);
    url.searchParams.set("item_id", itemId);
    if (shopId) {
        url.searchParams.set("shop_id", shopId);
    }

    const headers = buildWebHeaders(env);
    const response = await fetch(url, { method: "GET", headers });
    const json = await response.json();

    return {
        api: "web/pdp/get_pc",
        auth: "cookie",
        url: url.toString(),
        httpCode: response.status,
        response: json,
    };
}

// Credential mode: official Shopee Affiliate GraphQL API with SHA-256 signature.
async function callShopeeGraphql(env) {
    const appId = env.SHOPEE_API_APP_ID || "";
    const secret = env.SHOPEE_API_SECRET || "";

    if (!appId || !secret) {
        throw new Error("Missing SHOPEE_API_APP_ID or SHOPEE_API_SECRET in .env");
    }

    const apiName = process.argv[2] || "shopeeOfferV2";
    const inputUrl = process.argv[3] || "https://shopee.com.my";
    const payload = buildPayload(apiName, inputUrl);
    const timestamp = Math.floor(Date.now() / 1000);
    const authorization = buildAuthorization(appId, secret, payload, timestamp);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: authorization,
            "Content-Type": "application/json",
        },
        body: payload,
    });

    const json = await response.json();
    return {
        api: apiName,
        auth: "credentials",
        httpCode: response.status,
        response: json,
    };
}

// Pick the auth mode automatically: credentials if an app_id + secret are set,
// otherwise the browser-session cookie when SHOPEE_COOKIE is set.
export async function callShopeeApi() {
    const env = loadEnv(path.join(__dirname, ".env"));

    if (env.SHOPEE_API_APP_ID && env.SHOPEE_API_SECRET) {
        return callShopeeGraphql(env);
    }

    if (env.SHOPEE_COOKIE) {
        return callShopeeWebApi(env);
    }

    throw new Error(
        "Missing auth config in .env. Use SHOPEE_API_APP_ID + SHOPEE_API_SECRET (credentials) or SHOPEE_COOKIE (session cookie). See Code/nodejs/README.md and COOKIE_AUTH.md.",
    );
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
    callShopeeApi()
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
        })
        .catch((error) => {
            console.error(
                JSON.stringify(
                    {
                        success: false,
                        error: error.message,
                        usage: "node index.js [apiName] [originUrl-for-generateShortLink]  (credentials) | node index.js [itemId] [shopId]  (cookie mode)",
                    },
                    null,
                    2,
                ),
            );
            process.exitCode = 1;
        });
}
