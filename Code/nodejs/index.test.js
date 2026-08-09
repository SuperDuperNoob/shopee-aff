import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {
    buildAuthorization,
    buildPayload,
    buildWebHeaders,
    applyTemplate,
    isPlaceholderUrl,
    loadPortalTemplate,
    DEFAULT_PORTAL_LINK_TEMPLATE,
    cookieModeArgs,
} from "./index.js";

test("buildAuthorization creates expected SHA256 header", () => {
    const appId = "123456";
    const secret = "secret_key";
    const payload = JSON.stringify({ query: "{ shopeeOfferV2 { pageInfo { page } } }" });
    const timestamp = 1712000000;
    const expectedSignature = crypto
        .createHash("sha256")
        .update(`${appId}${timestamp}${payload}${secret}`)
        .digest("hex");

    const actual = buildAuthorization(appId, secret, payload, timestamp);

    assert.equal(
        actual,
        `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${expectedSignature}`,
    );
});

test("buildPayload supports generateShortLink and injects input URL", () => {
    const inputUrl = "https://shopee.com.my/product/334425154/8200081234";
    const payload = buildPayload("generateShortLink", inputUrl);
    const parsed = JSON.parse(payload);

    assert.match(parsed.query, /generateShortLink/);
    assert.match(parsed.query, new RegExp(inputUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("buildPayload throws for unsupported apiName", () => {
    assert.throws(
        () => buildPayload("unknownApi", "https://shopee.com.my"),
        /Unsupported api name/,
    );
});

test("buildWebHeaders sends Cookie header and browser-like headers", () => {
    const env = { SHOPEE_COOKIE: "SPC_F=abc; csrftoken=xyz", SHOPEE_CSRF_TOKEN: "xyz" };
    const headers = buildWebHeaders(env);

    assert.equal(headers["Cookie"], "SPC_F=abc; csrftoken=xyz");
    assert.equal(headers["X-CSRFToken"], "xyz");
    assert.equal(headers["x-api-source"], "pc");
    assert.match(headers["User-Agent"], /Chrome\/120\.0\.0\.0/);
});

test("buildWebHeaders omits X-CSRFToken when not provided", () => {
    const headers = buildWebHeaders({ SHOPEE_COOKIE: "SPC_F=abc" });
    assert.equal(headers["X-CSRFToken"], undefined);
});

test("buildWebHeaders throws without SHOPEE_COOKIE", () => {
    assert.throws(() => buildWebHeaders({}), /SHOPEE_COOKIE is required/);
});

test("applyTemplate substitutes originUrl, subIds, cookie and csrfToken", () => {
    const req = applyTemplate(
        {
            method: "POST",
            url: "https://affiliate.shopee.com.my/api/v1/short_link",
            headers: { "X-CSRFToken": "{{csrfToken}}", Cookie: "{{cookie}}" },
            body: '{"originUrl":"{{originUrl}}","subIds":{{subIds}},"csv":"{{subIdsCsv}}"}',
        },
        {
            originUrl: "https://shopee.com.my/product/1/2",
            subIds: ["campaign1", "facebook"],
            cookie: "SPC_F=abc; csrftoken=tok",
            csrfToken: "tok",
        },
    );

    assert.equal(req.method, "POST");
    assert.equal(req.url, "https://affiliate.shopee.com.my/api/v1/short_link");
    assert.equal(req.headers["X-CSRFToken"], "tok");
    assert.equal(req.headers["Cookie"], "SPC_F=abc; csrftoken=tok");
    assert.deepEqual(JSON.parse(req.body), {
        originUrl: "https://shopee.com.my/product/1/2",
        subIds: ["campaign1", "facebook"],
        csv: "campaign1,facebook",
    });
});

test("applyTemplate passes the subIds array through and leaves unknown tokens untouched", () => {
    const req = applyTemplate(
        { method: "GET", url: "https://x/?q={{originUrl}}&s={{subIds}}&u={{unknown}}", headers: {}, body: "" },
        { originUrl: "https://shopee.com.my/p", subIds: ["a", "b"] },
    );
    assert.match(req.url, /s=\["a","b"\]/); // JSON array
    assert.match(req.url, /\{\{unknown\}\}/); // untouched
});

test("isPlaceholderUrl detects the un-captured template URL", () => {
    assert.equal(isPlaceholderUrl("https://affiliate.shopee.com.my/api/REPLACE_ME_SHORT_LINK_ENDPOINT"), true);
    assert.equal(isPlaceholderUrl("https://affiliate.shopee.com.my/api/v1/real"), false);
});

test("loadPortalTemplate falls back to the built-in default when no file exists", () => {
    const tpl = loadPortalTemplate({}, "/nonexistent/dir");
    assert.equal(tpl, DEFAULT_PORTAL_LINK_TEMPLATE);
});

test("loadPortalTemplate reads the checked-in portal-link.template.json", () => {
    const tpl = loadPortalTemplate({}, __dirname);
    assert.equal(tpl.name, "portal-short-link");
    assert.match(tpl.body, /\{\{originUrl\}\}/);
    assert.match(tpl.url, /REPLACE_ME/); // placeholder until captured
});

test("loadPortalTemplate throws on an invalid template file", () => {
    assert.throws(
        () => loadPortalTemplate({ SHOPEE_WEB_LINK_TEMPLATE: path.join(__dirname, "index.test.js") }, __dirname),
        /JSON/,
    );
});

test("cookieModeArgs supports legacy and product subcommand forms", () => {
    assert.deepEqual(cookieModeArgs({}, ["node", "index.js", "123", "456"]), { itemId: "123", shopId: "456" });
    assert.deepEqual(cookieModeArgs({}, ["node", "index.js", "product", "123", "456"]), { itemId: "123", shopId: "456" });
    assert.deepEqual(cookieModeArgs({ SHOPEE_ITEM_ID: "9" }, ["node", "index.js"]), { itemId: "9", shopId: "" });
});
