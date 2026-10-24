import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedOrigin } from "../server/origin_policy.js";
import { createApp } from "../server/app.js";
import { WorkforceStore } from "../services/workforce_service.js";

const policy = { developmentDomain: "workspace.example.replit.dev", extraOrigins: ["https://approved.example"] };
const allowed = (origin, host = "127.0.0.1:3001") => isAllowedOrigin(origin, host, policy);

test("preview Origin includes public ports even when the Vite proxy rewrites Host", () => {
  for (const suffix of ["", ":5000", ":5173"]) {
    assert.equal(allowed(`https://workspace.example.replit.dev${suffix}`), true);
  }
  for (const origin of [
    "https://unrelated.replit.dev:5000",
    "https://workspace.example.replit.dev.attacker.invalid:5000",
    "https://workspace.example.replit.dev:9000",
    "http://workspace.example.replit.dev:5000",
    "https://workspace.example.replit.dev:5000/not-an-origin",
    "https://user:password@workspace.example.replit.dev:5000",
    "null", "not a URL",
  ]) assert.equal(allowed(origin), false, origin);
});

test("allow explicit origins, local development, and the exact serving host, not forwarded hosts", () => {
  assert.equal(allowed(undefined), true);
  assert.equal(allowed("http://localhost:5000"), true);
  assert.equal(allowed("http://127.0.0.1:5000"), true);
  assert.equal(allowed("https://approved.example"), true);
  assert.equal(allowed("https://app.example", "app.example"), true);
  assert.equal(allowed("https://app.example:5000", "app.example"), false);
  assert.equal(allowed("https://not-approved.example"), false);
});

test("browser Origin campaign create and manage requests pass, unrelated origins stay blocked", async t => {
  const evidence = { get: async () => ({ sources: [], status: "unavailable" }) };
  const { app } = createApp({ evidence, workforceStore: new WorkforceStore({ seed: false }), serveFrontend: false });
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  // Exercise the exact public preview Origin against a backend whose Host is
  // loopback, just as Vite's changeOrigin proxy presents these headers.
  const browserOrigin = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}:5000`
    : `http://localhost:${server.address().port}`;
  const headers = { Origin: browserOrigin, "Content-Type": "application/json" };
  const preflight = await fetch(`${base}/api/hr/campaigns`, {
    method: "OPTIONS", headers: { Origin: browserOrigin, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), browserOrigin);
  const created = await fetch(`${base}/api/hr/campaigns`, {
    method: "POST", headers, body: JSON.stringify({ department: "Origin regression", maxSubmissions: 2, expirationHours: 24 }),
  });
  assert.equal(created.status, 201);
  const campaign = await created.json();
  assert.ok(campaign.token);
  const revoked = await fetch(`${base}/api/hr/campaigns/${campaign.id}/update`, {
    method: "POST", headers, body: JSON.stringify({ action: "revoke" }),
  });
  assert.equal(revoked.status, 200);
  const rejected = await fetch(`${base}/api/hr/campaigns`, {
    method: "POST", headers: { ...headers, Origin: "https://untrusted.invalid", "X-Forwarded-Host": "untrusted.invalid" },
    body: JSON.stringify({ department: "Must not create", maxSubmissions: 2 }),
  });
  assert.equal(rejected.status, 403);
});
