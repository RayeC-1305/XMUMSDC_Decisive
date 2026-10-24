import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { chromium } from "playwright";
import { createApp } from "../server/app.js";
import { WorkforceStore } from "../services/workforce_service.js";

// An isolated real HTTP server and disk store keep browser tests out of demo data.
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-hr-browser-"));
const store = new WorkforceStore({ file: path.join(dir, "workforce.json") });
const state = { status: "unavailable", sources: [], retrievedAt: null, revision: "offline-browser-test" };
const { app } = createApp({ workforceStore: store, evidence: { get: async () => state, refresh: async () => state } });
const server = app.listen(0, "127.0.0.1");
await new Promise(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const output = path.resolve("output/playwright/workforce");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...((process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE)
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
context.on("page", p => p.on("pageerror", e => errors.push(e.message)));
page.on("pageerror", e => errors.push(e.message));
const request = context.request;
try {
  await page.goto(`${base}/hr`);
  await page.getByRole("heading", { name: "Capability heatmap" }).waitFor();
  await page.locator(".hr-person").first().waitFor();
  assert.equal(await page.locator(".hr-person").count(), 24);
  assert.equal(await page.locator(".hr-heatmap thead th").count(), 25);
  await page.getByRole("button", { name: "New campaign", exact: true }).click();
  await page.getByLabel("Department name", { exact: true }).fill("Engineering Journey Test");
  await page.getByLabel("Target role focus / notes").fill("Synthetic engineering capability transition");
  await page.getByLabel("Submission limit (1–500)").fill("1");
  await page.getByLabel("Link expiration").selectOption("24");
  const createResponse = page.waitForResponse(r => r.url().endsWith("/api/hr/campaigns") && r.request().method() === "POST");
  await page.getByRole("button", { name: "Create survey link", exact: true }).click();
  const created = await (await createResponse).json();
  assert.equal(created.department, "Engineering Journey Test");
  await page.getByLabel("Department scope").selectOption(created.id);
  await page.getByText("Waiting for survey responses", { exact: true }).waitFor();
  const card = page.locator(".hr-campaign").filter({ has: page.getByRole("heading", { name: "Engineering Journey Test", exact: true }) });
  await card.getByRole("button", { name: "Copy survey link" }).click();
  await page.getByText(/Survey link copied|Copy this survey link/).waitFor();
  assert.match(await page.locator(".hr-success").innerText(), /copied|Copy this survey/);

  const employee = await context.newPage();
  employee.on("pageerror", e => errors.push(e.message));
  await employee.goto(`${base}/survey/${created.token}`);
  await employee.getByRole("button", { name: "Fill sample profile", exact: true }).click();
  await employee.getByLabel(/I understand this is a synthetic-only demo/).check();
  await employee.getByLabel("Synthetic alias").fill("DEMO-JOURNEY-01");
  await employee.getByRole("button", { name: "Submit and see results", exact: true }).click();
  await employee.getByRole("heading", { name: /Your next-step map, DEMO-JOURNEY-01/ }).waitFor();
  assert.equal(await employee.locator(".hr-role-card").count(), 3);
  await employee.getByText("View ordered learning pathway", { exact: true }).first().click();
  assert.ok(await employee.locator(".hr-step").count() > 0);
  assert.ok(await employee.locator(".hr-step a[href^='https://']").count() > 0);
  assert.ok(await employee.getByRole("img", { name: /Radar of employee-reported/ }).isVisible());
  await employee.screenshot({ path: path.join(output, "employee-results.png"), fullPage: true });
  await page.getByRole("button", { name: "DEMO-JOURNEY-01", exact: true }).waitFor({ timeout: 12000 });
  await card.getByText("1 / 1 responses", { exact: true }).waitFor();
  await card.getByText("Quota Reached", { exact: true }).waitFor();
  await page.getByRole("button", { name: "DEMO-JOURNEY-01", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("heading", { name: "DEMO-JOURNEY-01", exact: true }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);

  const beforeHeatmap = await page.locator(".hr-heatmap").innerText();
  const scenarioResponse = page.waitForResponse(r => r.url().includes("/api/hr/dashboard?") && r.url().includes("scenarioId=rapid"));
  await page.getByRole("button", { name: "Fast AI disruption · 1–2 years", exact: true }).click();
  await scenarioResponse;
  await page.waitForFunction(() => document.querySelector(".hr-heatmap").textContent.includes("declining"));
  assert.notEqual(await page.locator(".hr-heatmap").innerText(), beforeHeatmap);
  const beforeSimulate = await page.locator(".hr-heatmap").innerText();
  await page.getByRole("button", { name: "Simulate scenario", exact: true }).click();
  await page.getByText(/Scenario simulation applied/).waitFor();
  await page.waitForFunction(text => document.querySelector(".hr-heatmap").innerText !== text, beforeSimulate);
  assert.ok(await page.getByText("Simulated accelerated AI workflow adoption", { exact: true }).isVisible());
  await page.getByRole("button", { name: "Refresh sources", exact: true }).click();
  await page.getByText(/Research feed checked/).waitFor();
  assert.equal(await page.locator(".hr-sdg").count(), 17);
  await employee.reload();
  await employee.getByRole("heading", { name: "Survey link unavailable" }).waitFor();
  await card.getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("dialog").getByLabel("Submission limit (1–500)").fill("2");
  await page.getByRole("dialog").getByRole("button", { name: /Extend/ }).click();
  await employee.reload();
  await employee.getByRole("button", { name: "Fill sample profile", exact: true }).waitFor();
  await card.getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: /Revoke/ }).click();
  await employee.reload();
  await employee.getByRole("heading", { name: "Survey link unavailable" }).waitFor();
  assert.equal((await request.get(`${base}/api/survey/${created.token}`)).status(), 410);
  await employee.goto(`${base}/survey/nonexistent`);
  await employee.getByRole("heading", { name: "Survey link unavailable" }).waitFor();
  await page.getByLabel("Department scope").selectOption("");
  await page.getByRole("button", { name: "Green transition", exact: true }).click();
  await page.waitForResponse(r => r.url().includes("scenarioId=green"));
  await page.screenshot({ path: path.join(output, "hr-dashboard.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(output, "hr-mobile.png"), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "HR should not overflow the phone viewport");
  // Check active survey layout on a separate seeded campaign.
  await employee.setViewportSize({ width: 390, height: 844 });
  await employee.goto(`${base}/survey/${store.list()[0].token}`);
  await employee.getByRole("button", { name: "Fill sample profile", exact: true }).waitFor();
  await employee.screenshot({ path: path.join(output, "survey-mobile.png"), fullPage: true });
  assert.ok(await employee.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Survey should not overflow the phone viewport");
  await page.goto(`${base}/#import`);
  await page.getByRole("link", { name: /HR & Employers/ }).waitFor();
  await page.getByRole("button", { name: "Paste experience", exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, syntheticParticipants: 24, tested: ["create", "copy", "survey autofill + consent", "immediate results", "polling", "quota", "scenario recalculation", "simulation replanning", "refresh", "17 SDGs", "drilldown", "extend", "revoke", "closed + invalid links", "mobile layouts", "worker route"], output }, null, 2));
} catch (error) {
  await page.screenshot({ path: path.join(output, "failure.png"), fullPage: true }).catch(() => {});
  throw error;
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  await fs.rm(dir, { recursive: true, force: true });
}
