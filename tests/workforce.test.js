import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { WorkforceStore, sampleEmployee, workforceDashboard } from "../services/workforce_service.js";
import { normalizeProfile } from "../services/profile_intake.js";
import { matchProfile, buildPathway } from "../services/career_engine.js";
import { createApp } from "../server/app.js";

const evidenceState = { status: "unavailable", sources: [], retrievedAt: null, revision: "test-offline" };
const evidence = { get: async () => evidenceState, refresh: async () => evidenceState };
const payload = () => ({
  syntheticConsent: true, profile: sampleEmployee(), proficiencies: { excel: 4, dataEntry: 2, communication: 3, coordination: 3 }, customSkills: ["Synthetic bookkeeping"],
});

test("first HR load seeds three departments with eight synthetic profiles, once", () => {
  const store = new WorkforceStore();
  assert.equal(store.list().length, 3);
  assert.equal(store.state.submissions.length, 24);
  assert.ok(store.state.submissions.every(s => s.profile.synthetic));
  store.seed();
  assert.equal(store.state.submissions.length, 24);
  assert.ok(store.list().every(c => c.currentSubmissions === 8 && c.status === "Active"));
});

test("campaign expiry, revoke, extend, quota, manual close and input validation", () => {
  let now = new Date("2026-10-24T00:00:00Z");
  const store = new WorkforceStore({ seed: false, now: () => now });
  const campaign = store.create({ department: "Testing", maxSubmissions: 1, expirationHours: 24 });
  assert.equal(store.valid(campaign.token).status, "Active");
  assert.throws(() => store.create({ department: "", maxSubmissions: 1 }), /department/i);
  assert.throws(() => store.create({ department: "Test", maxSubmissions: 1.5 }), /whole/);
  assert.throws(() => store.create({ department: "Test", expirationHours: 0 }), /Choose/);
  assert.throws(() => store.valid("unknown"), /not found/);
  now = new Date("2026-10-25T00:00:00Z");
  assert.throws(() => store.valid(campaign.token), /expired/);
  store.update(campaign.id, { action: "extend", expirationHours: null });
  assert.equal(store.valid(campaign.token).expiresAt, null);
  store.update(campaign.id, { action: "revoke" });
  assert.throws(() => store.valid(campaign.token), /revoked/);
  store.update(campaign.id, { action: "extend", expirationHours: 24 });
  store.submit(campaign.token, store.prepareSubmission(payload()));
  assert.equal(store.list()[0].status, "Quota Reached");
  assert.throws(() => store.submit(campaign.token, store.prepareSubmission(payload())), /Limit Reached/);
  store.update(campaign.id, { action: "extend", maxSubmissions: 2 });
  assert.equal(store.valid(campaign.token).currentSubmissions, 1);
});

test("store survives restart and rejects damaged files instead of overwriting", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-workforce-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, "store.json");
  const store = new WorkforceStore({ file, seed: false });
  const campaign = store.create({ department: "Persistence", expirationHours: null });
  store.submit(campaign.token, store.prepareSubmission(payload()));
  const second = new WorkforceStore({ file });
  assert.equal(second.list().length, 1);
  assert.equal(second.list()[0].currentSubmissions, 1);
  second.toggleSimulation();
  assert.equal(new WorkforceStore({ file }).simulations().length, 1);
  fs.writeFileSync(file, "{");
  assert.throws(() => new WorkforceStore({ file }).list(), SyntaxError);
});

test("submission validation enforces synthetic consent and bounds; demographic fields discarded", () => {
  const store = new WorkforceStore({ seed: false });
  assert.throws(() => store.prepareSubmission({ ...payload(), syntheticConsent: false }), /synthetic/);
  assert.throws(() => store.prepareSubmission({ ...payload(), proficiencies: { excel: 6 } }), /Proficiency/);
  assert.throws(() => store.prepareSubmission({ ...payload(), proficiencies: { excel: 1.2 } }), /whole number/);
  assert.throws(() => store.prepareSubmission({ ...payload(), customSkills: Array(16).fill("a") }), /Custom skills/);
  const input = payload();
  input.profile.age = 55;
  input.profile.gender = "irrelevant";
  input.profile.background = "irrelevant";
  input.cvText = "Synthetic employee uses SQL and Python to analyse sample records.";
  const prepared = store.prepareSubmission(input);
  assert.ok(prepared.profile.skills.includes("sql"));
  assert.ok(prepared.profile.skills.includes("python"));
  assert.equal(prepared.profile.age, undefined);
  assert.equal(prepared.profile.gender, undefined);
  assert.equal(prepared.profile.background, undefined);
});

test("HR and employee results use identical individual matching and pathway engines", () => {
  const store = new WorkforceStore();
  const d = workforceDashboard(store, evidenceState);
  const employee = d.employees[0];
  const direct = matchProfile(employee.profile, evidenceState, "steady");
  assert.deepEqual(employee.analysis.matches, direct.matches);
  assert.deepEqual(employee.pathway, buildPathway(employee.profile, direct.matches[0], { scenarioId: "steady", hoursPerWeek: employee.profile.hoursPerWeek }));
  assert.equal(normalizeProfile(employee.profile).synthetic, true);
  assert.ok(employee.analysis.matches.every(role => role.sdgs.length > 0));
  assert.ok(employee.pathway.steps.every(step => step.sdgs.length > 0));
});

test("scenarios recalculate scores, exposure, heatmap urgency and schedules; simulation replans separately", () => {
  const store = new WorkforceStore();
  const moderate = workforceDashboard(store, evidenceState);
  const rapid = workforceDashboard(store, evidenceState, { scenarioId: "rapid" });
  assert.notDeepEqual(moderate.employees.map(e => e.risk.score), rapid.employees.map(e => e.risk.score));
  assert.notDeepEqual(moderate.employees.map(e => e.analysis.matches[0].score), rapid.employees.map(e => e.analysis.matches[0].score));
  assert.notDeepEqual(moderate.employees.map(e => e.heatmap), rapid.employees.map(e => e.heatmap));
  assert.notDeepEqual(moderate.employees.map(e => e.timelineWeeks), rapid.employees.map(e => e.timelineWeeks));
  store.toggleSimulation();
  const revised = workforceDashboard(store, evidenceState);
  assert.equal(revised.simulations.length, 1);
  assert.equal(revised.evidence.sources.length, 0);
  assert.notDeepEqual(moderate.employees.map(e => e.heatmap), revised.employees.map(e => e.heatmap));
  assert.notDeepEqual(moderate.employees.map(e => e.pathway.steps.map(s => s.id)), revised.employees.map(e => e.pathway.steps.map(s => s.id)));
  store.toggleSimulation();
  assert.deepEqual(workforceDashboard(store, evidenceState).employees.map(e => e.analysis.matches), moderate.employees.map(e => e.analysis.matches));
});

test("cohorts cover actual steps, honour dependencies, filter departments and deduplicate SDG people counts", () => {
  const store = new WorkforceStore();
  const campaigns = store.list();
  const d = workforceDashboard(store, evidenceState, { campaignId: campaigns[1].id });
  assert.equal(d.summary.employees, 8);
  assert.equal(d.summary.departments, 1);
  assert.ok(d.sdgs.every(s => s.count <= 8 && s.url.startsWith("https://sdgs.un.org/")));
  for (const cohort of d.cohorts) {
    assert.equal(cohort.employeeCount, cohort.employeeIds.length);
    assert.equal(new Set(cohort.employeeIds).size, cohort.employeeCount);
    assert.ok(cohort.resource.url.startsWith("https://"));
    assert.equal(cohort.resource.hrdCorpClaimable, "not_verified");
    for (const prerequisite of cohort.prerequisiteSkillIds) {
      const prior = d.cohorts.find(c => c.skillId === prerequisite);
      if (prior) assert.ok(prior.order < cohort.order);
    }
  }
  assert.throws(() => workforceDashboard(store, evidenceState, { campaignId: "missing" }), /not found/);
});

test("HTTP journey, quota race, dashboard update and survey privacy", async t => {
  const store = new WorkforceStore({ seed: false });
  const { app } = createApp({ evidence, workforceStore: store, serveFrontend: false });
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(`${base}${route}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const created = await post("/api/hr/campaigns", { department: "HTTP test", maxSubmissions: 1, expirationHours: 24 });
  assert.equal(created.status, 201);
  const campaign = await created.json();
  const survey = await (await fetch(`${base}/api/survey/${campaign.token}`)).json();
  assert.ok(survey.notice.includes("synthetic data only"));
  assert.equal(survey.campaign.token, undefined);
  assert.equal(survey.employees, undefined);
  const results = await Promise.all([post(`/api/survey/${campaign.token}`, payload()), post(`/api/survey/${campaign.token}`, payload())]);
  assert.deepEqual(results.map(r => r.status).sort(), [201, 410]);
  const submitted = await results.find(r => r.status === 201).json();
  assert.ok(submitted.analysis.matches[0].components.length === 3);
  assert.ok(submitted.pathway.steps.length > 0);
  const dashboard = await (await fetch(`${base}/api/hr/dashboard`)).json();
  assert.equal(dashboard.summary.employees, 1);
  assert.equal(dashboard.campaigns[0].currentSubmissions, 1);
  assert.equal((await fetch(`${base}/api/survey/${campaign.token}`)).status, 410);
  assert.equal((await fetch(`${base}/api/survey/unknown`)).status, 404);
  const simulation = await post("/api/hr/trends", { action: "simulate" });
  assert.equal((await simulation.json()).simulationActive, true);
});
