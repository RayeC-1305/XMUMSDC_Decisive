import fs from "node:fs/promises";
import path from "node:path";

const base = (process.env.NEXUS_API_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
async function request(route, body) {
  const response = await fetch(`${base}/api${route}`, body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  const data = await response.json();
  if (!response.ok) throw new Error(`${route}: ${data.error || data.lastError || response.status}`);
  return data;
}
try {
  const intake = await request("/intake", { profile: { id: "demo-synthetic-operations", name: "Synthetic career explorer", role: "Operations coordinator", skills: ["excel", "coordination", "communication", "dataEntry"], tasks: ["Coordinate suppliers and reconcile invoice records."], interests: ["sql"], hoursPerWeek: 4, goal: "Compare an affordable next career step", synthetic: true, reviewed: true } });
  const input = { profile: intake.profile, scenarioId: "steady", roleId: "financial" };
  const before = await request("/transition", input);
  const refresh = await request("/trends/refresh", {});
  const after = await request("/transition", input);
  const report = {
    runAt: new Date().toISOString(), syntheticProfile: true, provider: refresh.provider, evidenceStatus: refresh.status, retrievedAt: refresh.retrievedAt, revision: refresh.revision,
    lastError: refresh.lastError, cacheWarning: refresh.cacheWarning, mappingNote: refresh.mappingNote,
    sources: refresh.sources,
    ranking: after.matches.map(role => ({ role: role.title, score: role.score, previousScore: before.matches.find(r => r.id === role.id).score, scoreWithoutEvidence: role.evidenceImpact.scoreWithoutEvidence, evidenceDelta: role.evidenceImpact.scoreDelta, skillGaps: role.gaps.map(g => g.name), components: role.components, evidenceSourceIds: role.evidenceSourceIds })),
    scenarios: after.scenarios.map(s => ({ title: s.title, topRoleId: s.roles[0].roleId, selectedRole: s.roles.find(r => r.roleId === input.roleId) })),
    pathway: after.pathway, limitations: after.assumptions, disclosure: after.disclosure,
  };
  await fs.mkdir("output/backend", { recursive: true });
  const file = path.resolve("output/backend/live-demo.json");
  await fs.writeFile(file, JSON.stringify(report, null, 2));
  console.log(`Evidence: ${report.evidenceStatus}; ${report.sources.length} dated sources, retrieved ${report.retrievedAt}.`);
  if (report.lastError) console.log(`Refresh warning: ${report.lastError}`);
  console.table(report.ranking.map(({ role, score, scoreWithoutEvidence, evidenceDelta }) => ({ role, score, scoreWithoutEvidence, evidenceDelta })));
  console.table(report.scenarios.map(s => ({ scenario: s.title, score: s.selectedRole.score, nextSkill: s.selectedRole.nextLearningPriority })));
  console.log(`Learning plan: ${report.pathway.steps.length} steps, ${report.pathway.totalHours} estimated hours, ${report.pathway.estimatedWeeks} weeks at ${report.pathway.hoursPerWeek} h/week.`);
  console.log(`Evidence report: ${file}`);
  console.log(report.disclosure);
} catch (error) {
  console.error(`Backend demo failed: ${error.message}`);
  console.error("Start npm run server first. An unavailable live feed is reported honestly; no synthetic evidence is substituted.");
  process.exitCode = 1;
}
