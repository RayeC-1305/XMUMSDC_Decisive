import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createApp } from "../server/app.js";
import { EvidenceService, mapResearch } from "../services/evidence_service.js";
import { normalizeProfile, parseProfileText } from "../services/profile_intake.js";
import { catalog, ROLES, SAMPLE_CVS } from "../services/career_catalog.js";
import { matchProfile, buildPathway, skillForecast, scenarioFor, normalizeSimulations } from "../services/career_engine.js";

// Deliberately synthetic records, used only in tests. Never an offline evidence fallback.
const instant = "2026-10-23T03:00:00.000Z";
const record = {
  DOI: "10.1234/synthetic-test-only", title: ["SYNTHETIC TEST: Artificial intelligence, workforce skills and routine automation"], publisher: "Synthetic test fixture",
  published: { "date-parts": [[2026, 10, 20]] },
  abstract: "SYNTHETIC TEST ONLY. Workforce skills: SQL database analytics, data quality validation, communication, automation of routine tasks and data entry.",
};
const reply = items => new Response(JSON.stringify({ message: { items } }), { headers: { "Content-Type": "application/json" } });
const makeEvidence = (options = {}) => new EvidenceService({ now: () => new Date(instant), minRefreshMs: 0, fetchImpl: async () => reply([record]), ...options });
const profile = () => normalizeProfile({ ...SAMPLE_CVS[0], reviewed: true });

async function api(t, evidence = makeEvidence()) {
  const { app } = createApp({ evidence, serveFrontend: false });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (route, body) => {
    const response = await fetch(`${base}/api${route}`, body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: response.status, data: await response.json(), response };
  };
  return { base, request };
}

test("form intake validates IDs, deduplicates skills and preserves potential/constraints", () => {
  const value = normalizeProfile({ skills: ["sql", "sql"], tasks: ["Coordinate supplier communications"], interests: ["carbon"], goal: "Move to sustainable work", hoursPerWeek: 6 });
  assert.deepEqual(value.skills, ["sql"]);
  assert.deepEqual(value.interests, ["carbon"]);
  assert.equal(value.hoursPerWeek, 6);
  for (const bad of [{ skills: "sql" }, { skills: ["unknown"] }, { skills: ["__proto__"] }, { skills: ["sql"], hoursPerWeek: 0 }, { skills: ["sql"], reviewed: "false" }, { skills: ["sql"], interests: ["unknown"] }, {}]) assert.throws(() => normalizeProfile(bad));
});

test("CV extraction reports keyword provenance and requires human review", () => {
  const result = parseProfileText("Synthetic Worker\nOperations coordinator\n5 years of experience\n- Coordinate suppliers and validate data quality in Excel.\nSQL queries and customer communication.");
  assert.ok(result.profile.skills.includes("excel"));
  assert.ok(result.profile.skills.includes("sql"));
  assert.equal(result.profile.years, 5);
  assert.equal(result.profile.reviewed, false);
  assert.equal(result.extraction.requiresReview, true);
  assert.ok(!JSON.stringify(result).includes("cv_text"));
  assert.throws(() => parseProfileText("too short"));
});

test("feed mapping rejects irrelevant, invalid and future-dated metadata", () => {
  assert.ok(mapResearch(record, instant));
  for (const bad of [null, { ...record, DOI: "invalid" }, { ...record, title: ["An unrelated medical experiment"], abstract: "" }, { ...record, published: { "date-parts": [[2026, 10, 24]] } }, { ...record, published: { "date-parts": [[2026, 2, 31]] } }, { ...record, published: { "date-parts": [[2026, 0]] } }, { ...record, published: {} }]) assert.equal(mapResearch(bad, instant), null);
  assert.equal(mapResearch({ ...record, published: { "date-parts": [[2025]] } }, instant).datePrecision, "year");
});

test("live refresh deduplicates papers, persists provenance, survives offline restart and marks stale", async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-evidence-"));
  assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir(), "nexus-evidence-")));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const cacheFile = path.join(directory, "research.json");
  const first = makeEvidence({ cacheFile, fetchImpl: async () => reply([record, record]) });
  const live = await first.refresh();
  assert.equal(live.status, "live");
  assert.equal(live.sources.length, 1);
  assert.equal(live.changed, true);
  assert.equal((await first.refresh()).changed, false);
  const later = new Date(Date.parse(instant) + 7 * 3600000);
  const restarted = makeEvidence({ cacheFile, now: () => later, fetchImpl: async () => { throw new TypeError("fetch failed"); } });
  assert.equal((await restarted.get()).status, "stale");
  const offline = await restarted.refresh();
  assert.equal(offline.status, "stale");
  assert.equal(offline.sources[0].retrievedAt, instant);
  assert.equal(offline.sources[0].retrieval, "cached");
  assert.equal(offline.revision, live.revision);
  assert.ok(offline.lastError);
});

test("refresh shares concurrent requests and applies a cooldown", async () => {
  let count = 0;
  const service = makeEvidence({ minRefreshMs: 60000, fetchImpl: async () => { count++; return reply([record]); } });
  const [one, two] = await Promise.all([service.refresh(), service.refresh()]);
  assert.equal(count, 1);
  assert.equal(one.revision, two.revision);
  assert.equal((await service.refresh()).throttled, true);
  assert.equal(count, 1);
});

test("malformed, empty, oversized and unavailable feeds never produce invented evidence", async () => {
  for (const fetchImpl of [async () => reply([]), async () => new Response("{}"), async () => new Response("x".repeat(2 * 1024 * 1024 + 1)), async () => new Response("unavailable", { status: 503 })]) {
    const result = await makeEvidence({ fetchImpl }).refresh();
    assert.equal(result.status, "unavailable");
    assert.deepEqual(result.sources, []);
    assert.ok(result.lastError);
  }
});

test("empty refresh preserves previously retrieved evidence and reports degradation", async () => {
  let available = true;
  const service = makeEvidence({ fetchImpl: async () => reply(available ? [record] : []) });
  const original = await service.refresh();
  available = false;
  const degraded = await service.refresh();
  assert.equal(degraded.status, "stale");
  assert.equal(degraded.revision, original.revision);
  assert.equal(degraded.sources[0].retrievedAt, original.retrievedAt);
  assert.equal(degraded.changed, false);
});

test("a timed-out feed fails explicitly without adding a sample", async () => {
  const service = makeEvidence({ timeoutMs: 10, fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  }) });
  const result = await service.refresh();
  assert.equal(result.status, "unavailable");
  assert.ok(result.lastError.includes("timed out"));
  assert.equal(result.sources.length, 0);
});

test("retrieved evidence changes explainable match scores, with bounded and duplicate-safe weights", async () => {
  const service = makeEvidence();
  const before = matchProfile(profile(), await service.get());
  const evidence = await service.refresh();
  const after = matchProfile(profile(), evidence);
  assert.ok(after.matches.some(role => role.evidenceImpact.scoreDelta !== 0));
  assert.ok(after.matches.some(role => role.evidenceImpact.priorityChanged));
  assert.notDeepEqual(before.matches.map(r => r.score), after.matches.map(r => r.score));
  for (const role of after.matches) {
    assert.ok(role.score >= 0 && role.score <= 100);
    assert.ok(Math.abs(role.score - role.components.reduce((sum, c) => sum + c.points, 0)) < 0.011);
    assert.ok(role.evidenceSourceIds.every(id => evidence.sources.some(s => s.id === id)));
    assert.ok(role.gaps.every(gap => gap.sdgs.length));
  }
  const source = evidence.sources[0];
  assert.deepEqual(skillForecast("sql", [source], scenarioFor()), skillForecast("sql", Array(200).fill(source), scenarioFor()));
  assert.ok(skillForecast("sql", [{ ...source, impacts: { sql: 1e9 } }], scenarioFor()).researchFactor <= 1.1);
  assert.equal(skillForecast("dataEntry", [source], scenarioFor("rapid")).direction, "declining");
});

test("profile strengths change ranking; personal attributes are not scoring inputs", async () => {
  const evidence = await makeEvidence().refresh();
  const first = matchProfile(profile(), evidence);
  const alternate = matchProfile({ ...profile(), name: "Different Name", years: 60, location: "Elsewhere", age: 70, gender: "other" }, evidence);
  assert.deepEqual(first.matches, alternate.matches);
  const technician = normalizeProfile({ skills: ["electrical", "diagnostics", "safety", "automation", "python"] });
  assert.equal(matchProfile(technician, evidence).matches[0].id, "automation");
  assert.notEqual(first.matches[0].id, "automation");
});

test("scenario comparison changes scores and priorities with ranges labelled as assumptions", async () => {
  const result = matchProfile(normalizeProfile({ skills: ["communication"] }), await makeEvidence().get());
  assert.equal(result.scenarios.length, 3);
  const operations = result.scenarios.map(s => s.roles.find(r => r.roleId === "operations"));
  assert.ok(new Set(operations.map(r => r.score)).size > 1);
  assert.ok(new Set(operations.map(r => r.nextLearningPriority)).size > 1);
  assert.ok(result.sensitivity.every(s => s.scoreRange.min <= s.scoreRange.max));
  assert.ok(result.assumptions.some(s => s.includes("No retrieved evidence")));
});

test("every role pathway covers every gap and prerequisite, with free resources, SDGs and sane schedules", async () => {
  const person = normalizeProfile({ skills: ["communication"], hoursPerWeek: 4 });
  const matches = matchProfile(person, await makeEvidence().get()).matches;
  for (const role of matches) {
    const plan = buildPathway(person, role);
    assert.deepEqual(new Set(plan.coveredGapIds), new Set(role.gaps.map(g => g.id)));
    const seen = new Set();
    for (const step of plan.steps) {
      assert.ok(step.prerequisiteStepIds.every(id => seen.has(id)));
      assert.ok(step.startWeek >= 1 && step.endWeek >= step.startWeek);
      assert.ok(step.sdgs.length);
      if (step.kind !== "portfolio_and_adviser_review") assert.equal(step.resource.cost.amount, 0);
      seen.add(step.id);
    }
    assert.equal(plan.totalHours, plan.remainingHours);
    assert.ok(buildPathway(person, role, { hoursPerWeek: 8 }).estimatedWeeks <= plan.estimatedWeeks);
    const preserved = buildPathway(person, role, { completedStepIds: [plan.steps[0].id, "portfolio:other-role"] });
    assert.equal(preserved.steps[0].completed, true);
    assert.equal(preserved.steps[0].startWeek, null);
    assert.deepEqual(preserved.otherCompletedStepIds, ["portfolio:other-role"]);
    assert.equal(preserved.remainingHours, plan.totalHours - plan.steps[0].hours);
  }
  const all = catalog();
  assert.ok(all.roles.every(r => r.sdgs.length));
  assert.ok(all.skills.every(s => s.sdgs.length && s.sdgs.every(g => g.contribution)));
});

test("HTTP flow: intake -> live evidence -> matching -> complete transition", async t => {
  const { request } = await api(t);
  const intake = await request("/intake", { profile: { ...SAMPLE_CVS[0], interests: ["sql"], reviewed: true } });
  assert.equal(intake.status, 200);
  const body = { profile: intake.data.profile, scenarioId: "rapid", roleId: "financial" };
  const before = await request("/match", body);
  assert.equal(before.data.evidence.status, "unavailable");
  const refresh = await request("/trends/refresh", {});
  assert.equal(refresh.status, 200);
  assert.equal(refresh.data.status, "live");
  const result = await request("/transition", body);
  assert.equal(result.status, 200);
  assert.equal(result.data.pathway.roleId, "financial");
  assert.equal(result.data.evidence.sources[0].date, "2026-10-20");
  assert.ok(result.data.matches.some(r => r.evidenceImpact.scoreDelta !== 0));
  assert.ok(result.data.pathway.steps.length >= result.data.pathway.coveredGapIds.length);
  assert.equal((await request("/trends/ingest-custom", { title: "Invented job demand" })).status, 410);
});

test("HTTP failures use clear JSON responses and never turn into SPA HTML", async t => {
  const { base, request } = await api(t, makeEvidence({ fetchImpl: async () => { throw new TypeError("fetch failed"); } }));
  for (const body of [{}, { profile: { skills: ["unknown"] } }, { profile: profile(), scenarioId: "invented" }, { profile: profile(), hoursPerWeek: 0 }, { profile: profile(), roleId: "invented" }]) assert.equal((await request("/transition", body)).status, 400);
  assert.equal((await request("/trends/refresh", {})).status, 503);
  assert.equal((await request("/missing")).status, 404);
  const malformed = await fetch(`${base}/api/match`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).error, "Request body must be valid JSON.");
  const origin = await fetch(`${base}/api/health`, { headers: { Origin: "https://untrusted.invalid" } });
  assert.equal(origin.status, 403);
  assert.equal((await request("/health")).response.headers.get("cache-control"), "no-store");
});

test("multipart TXT upload works and invalid or oversized files are rejected", async t => {
  const { base } = await api(t);
  const upload = async (name, content) => {
    const form = new FormData(); form.append("cv_file", new Blob([content]), name);
    const response = await fetch(`${base}/api/parse-cv`, { method: "POST", body: form });
    return { status: response.status, data: await response.json() };
  };
  const result = await upload("synthetic.txt", "Synthetic Worker\nFinancial analyst\nSQL queries with data quality validation, Excel and communication.");
  assert.equal(result.status, 200);
  assert.ok(result.data.profile.skills.includes("sql"));
  assert.equal((await upload("fake.pdf", "this is not a PDF document")).status, 415);
  assert.equal((await upload("fake.docx", "binary data")).status, 415);
  assert.equal((await upload("large.txt", "a".repeat(5 * 1024 * 1024 + 1))).status, 413);
});

test("actual text PDF extraction works and corrupted PDFs fail recoverably", async t => {
  const { base } = await api(t);
  const content = "BT /F1 12 Tf 50 700 Td (Synthetic analyst: SQL queries, Excel and data quality validation.) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((value, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${value}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(o => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const form = new FormData(); form.append("cv_file", new Blob([pdf], { type: "application/pdf" }), "synthetic.pdf");
  const response = await fetch(`${base}/api/intake`, { method: "POST", body: form });
  const result = await response.json();
  assert.equal(response.status, 200, JSON.stringify(result));
  assert.ok(result.profile.skills.includes("sql"));
  const broken = new FormData(); broken.append("cv_file", new Blob(["%PDF-broken"]), "broken.pdf");
  assert.equal((await fetch(`${base}/api/intake`, { method: "POST", body: broken })).status, 422);
});

test("evidence revisions restore the original decision after refresh and across restarts", async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-revisions-"));
  assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir(), "nexus-revisions-")));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  let items = [record];
  const cacheFile = path.join(directory, "research.json");
  const evidence = makeEvidence({ cacheFile, fetchImpl: async () => reply(items) });
  const first = await evidence.refresh();
  const original = matchProfile(profile(), await evidence.get(first.revision));
  items = [{ ...record, DOI: "10.1234/synthetic-test-second", title: ["SYNTHETIC TEST: AI workforce sustainability skills"], abstract: "Artificial intelligence workforce sustainability and green skills. Synthetic test only." }];
  const second = await evidence.refresh();
  assert.notEqual(first.revision, second.revision);
  assert.equal((await evidence.get(first.revision)).status, "archived");
  assert.deepEqual(matchProfile(profile(), await evidence.get(first.revision)).matches, original.matches);
  assert.equal((await evidence.get("none")).sources.length, 0);
  await assert.rejects(evidence.get("missing"), error => error.status === 409);
  const restarted = makeEvidence({ cacheFile });
  assert.equal((await restarted.get(first.revision)).sources[0].id, first.sources[0].id);
  assert.equal((await restarted.get()).revision, second.revision);
});

test("personal simulations are bounded and isolated from public research and other users", async t => {
  const evidence = makeEvidence();
  await evidence.refresh();
  const { request } = await api(t, evidence);
  const baseline = (await request("/transition", { profile: profile() })).data;
  const simulation = { id: "custom-test", title: "Synthetic personal scenario", publisher: "Test", date: "2026-10-23", url: "https://example.com/scenario", impacts: { sql: 1.6 } };
  const changed = (await request("/transition", { profile: profile(), simulations: [simulation] })).data;
  assert.notDeepEqual(changed.matches.map(r => r.score), baseline.matches.map(r => r.score));
  assert.equal(changed.simulationInputs[0].type, "Simulation");
  assert.deepEqual(changed.evidence.sources, baseline.evidence.sources);
  assert.deepEqual((await request("/transition", { profile: profile() })).data.matches, baseline.matches);
  assert.deepEqual(Object.keys(changed.pathways).sort(), ROLES.map(r => r.id).sort());
  assert.throws(() => normalizeSimulations([{ ...simulation, impacts: { sql: 500 } }]));
  assert.throws(() => normalizeSimulations([{ ...simulation, id: record.DOI }]));
  assert.throws(() => normalizeSimulations([{ ...simulation, impacts: { unknown: 1.2 } }]));
});
