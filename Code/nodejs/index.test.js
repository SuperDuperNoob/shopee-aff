import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { buildAuthorization, buildPayload, buildWebHeaders } from "./index.js";

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
