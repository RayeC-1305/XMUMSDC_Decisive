import { cvAgent } from "../services/cv_agent.js";
import { trendSignalAgent } from "../services/trend_agent.js";
import { calculateDynamicPersonaTasks } from "../services/scoring_engine.js";

const resumeText = `
Sample Resume
First Name Last Name 
Boston, MA | email@gmail.com | phone number 
TRAINING ASSOCIATE
Dedicated and adaptable teacher with over eight years of experience, poised for a seamless transition into 
the role of Training Associate for the College Mental Health Education Program.
• Facilitate Learning: Teach in person, via live Zoom calls, and pre-recorded trainings on topics ranging from course content and professional development
• Trauma-Informed Care: Worked as a behavioral therapist and Special Education teacher supporting students with emotional disabilities
• Interpersonal Skills: Communicate professionally with diverse constituencies including administrators, colleagues, parents, and students
EXPERIENCE
Special Education & Social Studies Teacher August 20xx- Present
● Positively impacted over 400 students, guiding them through challenging projects and supporting them toward self-achievement.
● Teach two separate classes over five teaching blocks while skillfully balancing lesson planning, curriculum development, and grading responsibilities as well as supervising paraprofessionals.
● Consistently meet both term and legal deadlines.
● Design and maintain Canvas course to streamline communication, course content, and data tracking.
● Ensured completion of requireddocumentation for each client, including written reports and data collection.
`;

async function testAtomicAndTrends() {
  console.log("==================================================");
  console.log("STEP 1: INTAKE & ATOMIC TASK TRANSFORMATION");
  console.log("==================================================");
  const parsed = await cvAgent.analyzeResume(resumeText);
  console.log("NAME:", parsed.name);
  console.log("TITLE:", parsed.display_title);
  console.log("\nATOMIC TASKS (BASELINE):");
  parsed.atomic_tasks.forEach((t, i) => {
    console.log(`[${i+1}] ${t.name}`);
    console.log(`    Category: ${t.category} | Baseline Runway: ${t.baseline_halflife_months} mos | Baseline Transferability: ${Math.round(t.transferable_strength * 100)}%`);
    console.log(`    Evidence: "${t.source_evidence || t.name}"\n`);
  });

  console.log("==================================================");
  console.log("STEP 2: INGEST LIVE AI TREND SIGNAL (ML MODEL 2)");
  console.log("==================================================");
  const signal = await trendSignalAgent.fetchLiveOrDatasetSignal();
  console.log("Ingested Signal:", signal.title);
  console.log("Source:", signal.source_name, `(${signal.date})`);
  console.log("Skill Velocity Impacts:", signal.skill_velocity_impacts);

  console.log("\n==================================================");
  console.log("STEP 3: RECALCULATE RUNWAY & TRANSFERABILITY (DYNAMIC)");
  console.log("==================================================");
  const dynamic = calculateDynamicPersonaTasks(parsed, [signal], "rapid_agentic");
  dynamic.atomic_tasks.forEach((t, i) => {
    console.log(`[${i+1}] ${t.name}`);
    console.log(`    Runway: ${t.baseline_halflife_months} mos -> ${t.dynamic_halflife_months} mos (${t.delta_months >= 0 ? '+' : ''}${t.delta_months} mos ⚡)`);
    console.log(`    Transferability: ${Math.round((t.baseline_transferability || t.transferable_strength) * 100)}% -> ${Math.round(t.transferable_strength * 100)}% (Mult: ${t.multiplier || 1.0}x)`);
    console.log(`    Status: ${t.ai_trend_impact || 'STABLE'}\n`);
  });
}

testAtomicAndTrends().catch(console.error);
