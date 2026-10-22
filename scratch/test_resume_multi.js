import { cvAgent } from "../services/cv_agent.js";
import { matchWorkerToRoles } from "../services/scoring_engine.js";
import fs from "fs/promises";

async function testMultiple() {
  const rolesData = JSON.parse(await fs.readFile("./data/esco_atomic_skills_roles.json", "utf-8"));

  // 1. Accountant Resume
  console.log("==================================================");
  console.log("TEST A: Accounting & Finance Resume");
  console.log("==================================================");
  const accountantCV = `
Nurul Huda binti Abdullah
nurul.huda@gmail.com | +6017-8899123 | Johor Bahru, Johor

PROFESSIONAL SUMMARY
Dedicated Senior Accounts Executive with 6 years of experience in SME general ledger accounting, corporate taxation, and SAP ERP financial auditing.

WORK EXPERIENCE
Senior Accounts Executive | Perdana Logistics Sdn Bhd (2020 - Present)
- Managed monthly financial reconciliations for over 150 corporate supplier accounts in SAP ERP.
- Verified supplier tax invoices, purchase orders, and sales receipts under Malaysian e-invoicing standards.
- Performed double-entry general ledger consolidation and resolved inter-company accounting discrepancies.
- Coordinated year-end external financial audit defense with chartered accountants, achieving zero penalty findings.
- Negotiated payment term disputes with delinquent commercial vendors, recovering RM 450,000 in overdue receivables.

Accounts Clerk | Megah Jaya Trading (2018 - 2020)
- Manually entered daily sales receipts and invoice vouchers into Excel and QuickBooks accounting software.
- Processed monthly employee payroll, statutory EPF and SOCSO deduction filings.
- Reconciled weekly bank statements against physical deposit slips and petty cash vouchers.

EDUCATION
Bachelor of Accounting (Honours)
Universiti Teknologi Malaysia (UTM), Skudai, Johor
  `;

  const accPersona = await cvAgent.analyzeResume(accountantCV);
  console.log("NAME:", accPersona.name);
  console.log("TITLE:", accPersona.display_title);
  console.log("LOCATION:", accPersona.location);
  console.log("EXPERIENCE:", accPersona.experience_years, "years");
  console.log("ATOMIC TASKS:");
  accPersona.atomic_tasks.forEach((t, i) => console.log(`  [${i+1}] ${t.name}\n       Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure} | SDGs: ${t.sdg_targets.join(", ")}`));
  console.log("BASELINE SKILLS:", accPersona.baseline_skills);

  const accMatch = await matchWorkerToRoles({
    workerTasks: accPersona.atomic_tasks,
    workerSkills: accPersona.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("TOP ROLE MATCH:", accMatch.ranked_roles[0].title, `(${accMatch.ranked_roles[0].match_score_pct}%)`);
  console.log("ROLE #2 MATCH:", accMatch.ranked_roles[1].title, `(${accMatch.ranked_roles[1].match_score_pct}%)`);
  console.log("SKILLS GAPS FOR TOP ROLE:", accMatch.ranked_roles[0].missing_skill_gaps.map(g => g.name));

  // 2. Automotive Mechanic Resume
  console.log("\n==================================================");
  console.log("TEST B: Automotive / EV Mechanic Resume");
  console.log("==================================================");
  const mechanicCV = `
Lim Jun Wei
junwei.lim@yahoo.com | 012-4455667 | Bayan Lepas, Penang

SUMMARY
Certified Senior Diagnostic Mechanic with 7 years specializing in heavy vehicle diagnostics, CAN bus OBD fault decoding, and electrical battery system maintenance.

EXPERIENCE
Master Technician | Northern Auto Service Centre (2019 - Present)
- Performed electronic fault diagnosis using OBD-II scan tools, oscilloscopes, and digital multimeters.
- Traced CAN-bus wiring harness shorts and decoded ECU error telematics for commercial vehicle fleets.
- Conducted battery pack electrochemical impedance testing and high-voltage disconnect procedures.
- Enforced workshop high-voltage safety and lockout-tagout (LOTO) procedures across 8 technician bays.
- Advised customers on mechanical repair safety, component lifespan estimates, and replacement costs.

EDUCATION
Malaysian Skills Certificate (SKM Level 3) in Automotive Technology
Institut Kemahiran Mara (IKM), Penang
  `;

  const mechPersona = await cvAgent.analyzeResume(mechanicCV);
  console.log("NAME:", mechPersona.name);
  console.log("TITLE:", mechPersona.display_title);
  console.log("LOCATION:", mechPersona.location);
  console.log("EXPERIENCE:", mechPersona.experience_years, "years");
  console.log("ATOMIC TASKS:");
  mechPersona.atomic_tasks.forEach((t, i) => console.log(`  [${i+1}] ${t.name}\n       Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure} | SDGs: ${t.sdg_targets.join(", ")}`));
  console.log("BASELINE SKILLS:", mechPersona.baseline_skills);

  const mechMatch = await matchWorkerToRoles({
    workerTasks: mechPersona.atomic_tasks,
    workerSkills: mechPersona.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("TOP ROLE MATCH:", mechMatch.ranked_roles[0].title, `(${mechMatch.ranked_roles[0].match_score_pct}%)`);
  console.log("ROLE #2 MATCH:", mechMatch.ranked_roles[1].title, `(${mechMatch.ranked_roles[1].match_score_pct}%)`);
  console.log("SKILLS GAPS FOR TOP ROLE:", mechMatch.ranked_roles[0].missing_skill_gaps.map(g => g.name));
}

testMultiple().catch(console.error);
