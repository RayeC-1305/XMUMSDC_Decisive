import test from "node:test";
import assert from "node:assert/strict";
import { capabilityPriorities, reviewFingerprint } from "../src/utils/workforceReview.js";

test("capability priorities separate unknown proficiency from declared critical gaps", () => {
  const rows = capabilityPriorities([
    { heatmap: [{ skillId: "ai", proficiency: 0, urgency: 150, status: "Critical Skill Deficit" }] },
    { heatmap: [{ skillId: "ai", proficiency: 1, urgency: 120, status: "Critical Skill Deficit" }] },
  ], [{ id: "ai", name: "AI literacy" }]);
  assert.equal(rows[0].critical, 1);
  assert.equal(rows[0].unknown, 1);
  assert.equal(rows[0].urgency, 135);
});
test("review checks stay valid during unchanged polling but invalidate when evidence or analysis changes", () => {
  const data = { generatedAt: "old", evidence: { revision: "a" }, employees: [{ id: "a", risk: { score: 10 }, analysis: { matches: [{ score: 50 }] }, timelineWeeks: 2 }] };
  assert.equal(reviewFingerprint(data), reviewFingerprint({ ...data, generatedAt: "new" }));
  assert.notEqual(reviewFingerprint(data), reviewFingerprint({ ...data, evidence: { revision: "b" } }));
  assert.notEqual(reviewFingerprint(data), reviewFingerprint({ ...data, employees: [] }));
});
