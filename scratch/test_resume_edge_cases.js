import { cvAgent } from "../services/cv_agent.js";
import { matchWorkerToRoles } from "../services/scoring_engine.js";
import fs from "fs/promises";

async function testEdgeCases() {
  const rolesData = JSON.parse(await fs.readFile("./data/esco_atomic_skills_roles.json", "utf-8"));

  // 1. Factory PLC & Robotics Technician
  console.log("==================================================");
  console.log("TEST C: Mechatronics / Factory Robotics Technician");
  console.log("==================================================");
  const mechatronicsCV = `
Ahmad Faris bin Kamaruddin
faris.kamaruddin@gmail.com | 019-3322110 | Batu Kawan, Penang

SUMMARY
Mechatronics technician with 5 years in semiconductor cleanroom automation, PLC programming, and collaborative robot arm maintenance.

EXPERIENCE
Automation Technician | Micron Semiconductor Malaysia (2021 - Present)
- Programmed Siemens S7 and Omron PLC ladder logic for high-speed wafer sorting lines.
- Calibrated 6-axis robotic arms using ROS 2 kinematic trajectory pathing in cleanroom environments.
- Monitored factory machine telemetry via OPC UA and Modbus industrial gateway networks.
- Enforced cleanroom electrostatic discharge (ESD) and machinery safety lockout protocols.

EDUCATION
Diploma in Mechatronics Engineering
Politeknik Seberang Perai, Penang
`;

  const mechRes = await cvAgent.analyzeResume(mechatronicsCV);
  console.log("NAME:", mechRes.name);
  console.log("TITLE:", mechRes.display_title);
  console.log("LOCATION:", mechRes.location);
  console.log("BASELINE SKILLS:", mechRes.baseline_skills);
  const matchC = await matchWorkerToRoles({
    workerTasks: mechRes.atomic_tasks,
    workerSkills: mechRes.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("TOP ROLE MATCH:", matchC.ranked_roles[0].title, `(${matchC.ranked_roles[0].match_score_pct}%)`);
  console.log("SKILLS GAPS:", matchC.ranked_roles[0].missing_skill_gaps.map(g => g.name));

  // 2. Clerical Data Entry Administrator
  console.log("\n==================================================");
  console.log("TEST D: Clerical / Data Entry Admin");
  console.log("==================================================");
  const clericalCV = `
Tan Wei Ling
weiling.tan@hotmail.com | +6016-7788990 | Petaling Jaya, Selangor

PROFILE
Administrative assistant with 4 years handling customer appointment schedules, invoice filing, and high-volume data entry.

WORK HISTORY
Data Entry Clerk | Global Logistic Services (2020 - Present)
- Transcribed paper delivery orders and freight bills into internal tracking database.
- Performed daily manual spreadsheet reconciliations and filing of invoice receipts.
- Coordinated delivery dispute inquiries with customer service representatives.

EDUCATION
Sijil Pelajaran Malaysia (SPM) - 5 Credits
SMK Damansara Utama
`;

  const clerkRes = await cvAgent.analyzeResume(clericalCV);
  console.log("NAME:", clerkRes.name);
  console.log("TITLE:", clerkRes.display_title);
  console.log("LOCATION:", clerkRes.location);
  console.log("BASELINE SKILLS:", clerkRes.baseline_skills);
  const matchD = await matchWorkerToRoles({
    workerTasks: clerkRes.atomic_tasks,
    workerSkills: clerkRes.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("TOP ROLE MATCH:", matchD.ranked_roles[0].title, `(${matchD.ranked_roles[0].match_score_pct}%)`);
  console.log("SKILLS GAPS:", matchD.ranked_roles[0].missing_skill_gaps.map(g => g.name));
}

testEdgeCases().catch(console.error);
