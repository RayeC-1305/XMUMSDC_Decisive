import { cvAgent } from "../services/cv_agent.js";
import { generatePersonalizedReskillingPathway } from "../src/utils/reskillingEngine.js";
import { trendSignalAgent } from "../services/trend_agent.js";
import { calculateDynamicPersonaTasks } from "../services/scoring_engine.js";

const sampleTeacherCV = `
Sample Resume
Sarah Tan
Boston, MA | sarah.tan@example.com
Special Education & Training Specialist
• Facilitate Learning: Teach in person, via live Zoom calls, and pre-recorded trainings on course content.
• Trauma-Informed Care: Worked as a behavioral therapist supporting students with emotional disabilities.
• Positively impacted over 400 students, guiding them through challenging projects.
• Design and maintain Canvas course to streamline communication and data tracking.
`;

async function main() {
  console.log("==================================================");
  console.log("STEP 1: SMART CV INTAKE & ATOMIC TASK DECONSTRUCTION");
  console.log("==================================================");
  const persona = await cvAgent.analyzeResume(sampleTeacherCV);
  console.log("Candidate Name:", persona.name);
  console.log("Title Detected:", persona.display_title);
  console.log("Experience Inferred:", persona.experience_years, "years");
  console.log("Domain Classified:", persona.ml_metadata.domain_classified);
  console.log("\nAtomic Capabilities Extracted:");
  persona.atomic_tasks.forEach((t, i) => {
    console.log(`[${i+1}] ${t.name}`);
    console.log(`    Category: ${t.category}`);
    console.log(`    Tools Detected: ${JSON.stringify(t.detected_tools)}`);
    console.log(`    Impact Metric: ${t.impact_metric || 'None'}`);
    console.log(`    Mastery Tier: ${t.mastery_tier}`);
    console.log(`    Cognitive Demand: ${t.cognitive_demand}`);
    console.log(`    UN SDGs: ${JSON.stringify(t.sdg_targets)}`);
    console.log(`    Evidence: "${t.source_evidence}"`);
  });

  console.log("\n==================================================");
  console.log("STEP 2: LIVE ML MODEL 2 SIGNAL INGESTION");
  console.log("==================================================");
  const signal = await trendSignalAgent.fetchLiveOrDatasetSignal();
  console.log("Ingested Signal:", signal.title);
  console.log("Source:", signal.source_name, "| Date:", signal.date);

  const dynamicPersona = calculateDynamicPersonaTasks(persona, [signal], "moderate");
  console.log("Task 1 Dynamic Half-Life:", dynamicPersona.atomic_tasks[0].runway_months, "months (Delta: +" + dynamicPersona.atomic_tasks[0].delta_months + " mos ⚡)");

  console.log("\n==================================================");
  console.log("STEP 3: PERSONALIZED RESKILLING & MOTIVATION");
  console.log("==================================================");
  const targetRole = {
    role_id: "ROLE-01",
    title: "AI-Augmented Supply Chain & Scope 3 Auditor",
    department: "ESG & Sustainability",
    missing_skill_gaps: [{ skill_id: "skill_scope3_carbon", name: "Scope 3 Carbon Accounting & GHG Protocol", velocity: 1.45 }],
    sdg_targets: ["SDG 8.2", "SDG 12.6", "SDG 13.2"]
  };

  const pathway = generatePersonalizedReskillingPathway(dynamicPersona, targetRole, [signal], true);
  console.log("Target Role:", pathway.target_role_title);
  console.log("Total Duration:", pathway.total_duration_hours, "hours across", pathway.total_duration_weeks, "weeks");
  console.log("Cost:", pathway.total_estimated_cost);
  console.log("SDG Impact Score:", pathway.sdg_impact.total_sdgs_impacted, "UN SDGs addressed");
  console.log("Impact Statement:\n ", pathway.sdg_impact.career_impact_statement);

  console.log("\nStep-by-Step Curriculum:");
  pathway.modules.forEach(m => {
    console.log(`  Step ${m.step}: [${m.badge_tag}] ${m.title}`);
    console.log(`    Provider: ${m.provider} | Duration: ${m.duration_label} | Cost: ${m.cost}`);
    console.log(`    Bridge Narrative: ${m.bridge_narrative}`);
    console.log(`    Milestone Badge: ${m.milestone_badge.icon} ${m.milestone_badge.title} (+${m.xp_awarded} XP)`);
    console.log(`    SDG Alignment: ${m.sdg_targets.join(", ")}`);
  });
}

main().catch(console.error);
