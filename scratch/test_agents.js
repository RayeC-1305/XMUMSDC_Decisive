import { cvAgent } from "../services/cv_agent.js";
import { trendSignalAgent } from "../services/trend_agent.js";
import { matchWorkerToRoles, runCounterfactualFairnessAudit } from "../services/scoring_engine.js";
import fs from "fs/promises";

async function runTests() {
  console.log("==========================================");
  console.log("TEST 1: ML Agent 1 (CV Scanning & Skills)");
  console.log("==========================================");
  const sampleCV = `
    Name: Ahmad Faiz bin Kamaruddin
    Location: Bayan Lepas, Penang
    Experience: 4 years as Automation & Electrical Technician
    Education: Diploma in Mechatronics Engineering (Politeknik Seberang Perai)
    
    Professional Experience:
    - Calibrated ARM Cortex microcontrollers and deployed TinyML edge models for factory motor vibration detection.
    - Wired and tested Industrial LoRaWAN and Modbus sensor gateways across cleanroom production lines.
    - Diagnosed automotive CAN-bus telematics and conducted battery state of health testing.
    - Coordinated high-voltage lockout-tagout (LOTO) protocols and hazard mitigation with safety committee.
    - Resolved vendor non-compliance disputes and conducted supplier ethical audit walkthroughs.
  `;

  const rolesData = JSON.parse(await fs.readFile("./data/esco_atomic_skills_roles.json", "utf-8"));
  const persona = await cvAgent.analyzeResume(sampleCV, rolesData.roles);
  
  console.log("Name:", persona.name);
  console.log("Detected Title:", persona.display_title);
  console.log("Location:", persona.location);
  console.log("Extracted Atomic Tasks count:", persona.atomic_tasks.length);
  persona.atomic_tasks.forEach((t, i) => {
    console.log(`  [${i+1}] ${t.name.slice(0, 60)}...`);
    console.log(`      Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure} | SDGs: ${t.sdg_targets?.join(", ")}`);
  });
  console.log("Extracted Baseline Skills:", persona.baseline_skills);

  console.log("\n==========================================");
  console.log("TEST 2: ML Agent 2 (AI Trend Signal & Risk)");
  console.log("==========================================");
  const signal = await trendSignalAgent.fetchLiveOrDatasetSignal();
  console.log("Signal Title:", signal.title);
  console.log("Source:", signal.source_name, `(${signal.date})`);
  console.log("Impacted Skills count:", Object.keys(signal.skill_velocity_impacts || {}).length);
  console.log("Peak Demand Surge:", signal.learned_risk_telemetry?.max_velocity_surge);
  console.log("Curriculum & Dept Multipliers:", signal.learned_risk_telemetry?.departmental_risk_multipliers);

  console.log("\n==========================================");
  console.log("TEST 3: Future-Role Matching & Skills Gap");
  console.log("==========================================");
  const matchResult = await matchWorkerToRoles({
    workerTasks: persona.atomic_tasks,
    workerSkills: persona.baseline_skills,
    roles: rolesData.roles,
    activeSignals: [signal],
    scenarioId: "moderate"
  });

  const topRole = matchResult.ranked_roles[0];
  console.log("Top Role Fit:", topRole.title);
  console.log("Score:", topRole.match_score_pct + "%");
  console.log("Breakdown:", topRole.breakdown);
  console.log("Missing Skills Gaps count:", topRole.missing_skill_gaps.length);
  topRole.missing_skill_gaps.forEach((g, i) => {
    console.log(`  Gap [${i+1}]: ${g.name} (Vel: ${g.velocity}x, SDGs: ${g.sdg_targets?.join(", ")})`);
  });

  console.log("\n==========================================");
  console.log("TEST 4: Counterfactual Fairness Audit");
  console.log("==========================================");
  const audit = await runCounterfactualFairnessAudit(persona, rolesData.roles, [signal]);
  console.log("Verdict:", audit.audit_verdict);
  console.log("Demographic Variance:", audit.demographic_variance_pct + "%");
  console.log("Is Invariant:", audit.is_ranking_invariant);
  console.log("SDG Compliance:", audit.sdg_compliance);

  console.log("\n>>> ALL TESTS COMPLETED SUCCESSFULLY! <<<");
}

runTests().catch(console.error);
