import test from "node:test";
import assert from "node:assert/strict";
import { changeCohortSelection, filterWorkforce, workforceBrief } from "../src/utils/workforceBrief.js";
import { WorkforceStore, workforceDashboard } from "../services/workforce_service.js";

const cohorts = [
  { skillId: "base", prerequisiteSkillIds: [], order: 1 },
  { skillId: "mid", prerequisiteSkillIds: ["base"], order: 2 },
  { skillId: "advanced", prerequisiteSkillIds: ["mid"], order: 3 },
  { skillId: "other", prerequisiteSkillIds: [], order: 4 },
];

test("cohort brief selection includes foundations and removes dependent learning", () => {
  assert.deepEqual(new Set(changeCohortSelection(cohorts, [], "advanced", true)), new Set(["base", "mid", "advanced"]));
  assert.deepEqual(changeCohortSelection(cohorts, ["base", "mid", "advanced", "other"], "base", false), ["other"]);
  assert.deepEqual(changeCohortSelection(cohorts, ["base", "mid", "advanced"], "advanced", false), ["base", "mid"]);
});

test("employee search combines alias/job/department with exposure filtering", () => {
  const people = [
    { alias: "DEMO-01", department: "Operations", profile: { role: "Coordinator" }, risk: { level: "High" } },
    { alias: "DEMO-02", department: "Finance", profile: { role: "Analyst" }, risk: { level: "Low" } },
  ];
  assert.deepEqual(filterWorkforce(people, " coordinator ", "High"), [people[0]]);
  assert.deepEqual(filterWorkforce(people, "Finance"), [people[1]]);
  assert.deepEqual(filterWorkforce(people, "DEMO-02", "High"), []);
  assert.deepEqual(filterWorkforce(people), people);
});

test("downloaded department brief uses actual cohorts, citations, scenario and safeguards", () => {
  const dashboard = workforceDashboard(new WorkforceStore(), { sources: [], status: "unavailable" }, { scenarioId: "rapid" });
  const selection = dashboard.cohorts.slice(0, 2);
  const brief = workforceBrief(dashboard, selection);
  for (const cohort of selection) {
    assert.ok(brief.includes(cohort.title));
    assert.ok(brief.includes(cohort.resource.url));
    assert.ok(brief.includes(cohort.resource.cataloguedOn));
  }
  assert.ok(brief.includes("DEMO MODE"));
  assert.ok(brief.includes("HRD Corp eligibility is not verified"));
  assert.ok(brief.includes("not measured impact"));
  assert.ok(brief.includes(dashboard.employees[0].alias));
  assert.ok(brief.includes(dashboard.generatedAt));
});
