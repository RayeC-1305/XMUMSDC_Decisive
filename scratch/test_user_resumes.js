import { cvAgent } from "../services/cv_agent.js";
import { matchWorkerToRoles } from "../services/scoring_engine.js";
import fs from "fs/promises";

const page1 = `
Sample Resume
First Name Last Name 
Boston, MA | email@gmail.com | phone number 
TRAINING ASSOCIATE
Dedicated and adaptable teacher with over eight years of experience, poised for a seamless transition into 
the role of Training Associate for the College Mental Health Education Program. Bringing strong 
organizational skills, attention to detail, and a commitment to delivering exceptional results to plan 
educational programming for individuals with mental health conditions. Adept at multitasking, problem-solving, and communication. Ready to work in a dynamic role that demands efficiency and precision.
• Facilitate Learning: Teach in person, via live Zoom calls, and pre-recorded trainings on
topics ranging from course content and professional development
• Trauma-Informed Care: Worked as a behavioral therapist and Special Education teacher
supporting students with emotional disabilities
• Interpersonal Skills: Communicate professionally with diverse constituencies including
administrators, colleagues, parents, and students
• M.Ed. in Secondary Education, History
• SEED (Seeking Educational Equity & Diversity) Graduate Seminar
EXPERIENCE
Name of High School, Public Schools of Town Town, MA
Special Education & Social Studies Teacher August 20xx- Present
● Positively impacted over 400 students, guiding them through challenging projects and supporting
them toward self-achievement.
● Teach two separate classes over five teaching blocks while skillfully balancing lesson planning,
curriculum development, and grading responsibilities as well as supervising paraprofessionals.
● Consistently meet both term and legal deadlines.
● Anticipate the diverse needs of stakeholders, including students, colleagues, administrators, and
parents, and navigate varying personalities to achieve optimal outcomes.
● Adept at implementing equity-focused practices addressing racial, gender, and ability
considerations, both within classroom frameworks and across the broader school community.
● Collaborate with colleagues to pioneer the METCO (Metropolitan Council for Educational
Opportunity) Fellows program, driving improved student outcomes.
● Coach General Education colleagues with implementing Individualized Education Plans (IEPs).
● Serve on interview committees selecting candidates for administrative and teaching positions.
● Develop templates and systems that colleagues have adopted to track students' achievement and
assess impact.
● Design and maintain Canvas course to streamline communication, course content, and data
tracking.
Elementary Summer Enrichment Town, MA
Read It, Build It Teacher Summers 20xx, 20xx- 20xx
● Taught STEM and literacy-based classes that blend academic and social skills.
● Monitored and coached teenage interns on how to engage with and support young students
successfully.
● Emphasized Social Emotional Learning (SEL) strategies within the classroom to foster
community and academic engagement.
Middle School, City Public Schools City, MA
Bilingual Special Education Teacher August 20xx- June 20xx
● Collaborated with classroom ESL and Math teachers to plan and implement co-taught universally
designed lessons within the inclusion learning environment, in both English and Spanish.
First Name Last Name Resume, p. 1
`;

const page2 = `
Sample Resume (page 2)
● Developed and taught a Yoga & Mindfulness after-school course to promote wellness strategies
among middle school students with diverse social-emotional and behavioral needs.
● Worked with a dynamic team to organize and execute school-wide events.
Town High School, Town Public Schools Town, MA
Long-Term Social Studies Substitute Teacher/Student Teacher January 20xx- June 20xx
● Taught Modern World History and AP Psychology.
● Independently prioritized tasks for multiple courses, and consistently prepared materials ahead of
deadlines for supervisor review.
● Coordinated and executed the logistics of a field trip to the John F. Kennedy Museum.
School Name Upper School, City Public Schools City, MA
Long-Term Substitute Teacher October 20xx- January 20xx
● Taught 7th Grade English Language Arts.
● Collaborated with the literacy coach to create lessons for an identity unit.
● Communicated with parents and guardians pertaining to each student’s academic success.
Town Public Schools Town, MA
Long-Term Substitute Teacher September 20xx- June 20xx
● Consecutive three-month maternity leaves in elementary, middle, and high school, including
Social Studies, English, Science, Math, and ELL topics.
● Established a creative, safe, classroom environment where students could take academic risks.
ARISE Consulting Services, Inc. Town, MA
ABA Therapist, part-time September 20xx- January 20xx
● Developed, implemented, and generalized academic and vocational life skill treatment plans
for individuals with a range of emotional and physical disabilities.
● Ensured completion of requireddocumentation for each client, including written reports and
data collection.
● Maintained familiarity with each client’s Functional Behavior Assessment (FBA).
EDUCATION
Fitchburg State University Fitchburg, MA
SEED (Seeking Educational Equity & Diversity) Graduate Seminar September 20xx- June 20xx
Southern New Hampshire University Manchester, NH 
Continuing education (35 graduate credits) January 20xx- June 20xx
Lesley University Cambridge, MA
Master of Education in Secondary Education, History June 20xx 
GPA 4.0
Harvard University Extension School Cambridge, MA 
Bachelor of Liberal Arts, Field of Government, Minor Spanish May 20xx 
Cum Laude
SKILLS
● Intermediate Spanish
● Canvas, Google Classroom, Google Workspace, Microsoft Office, Remind app, Slack, Edpuzzle,
OWL technology, Zoom, Google Voice, Survey Monkey
First Name Last Name Resume, p. 2
`;

async function testUserResume() {
  const rolesData = JSON.parse(await fs.readFile("./data/esco_atomic_skills_roles.json", "utf-8"));

  console.log("==========================================");
  console.log("TESTING USER RESUME: PAGE 1");
  console.log("==========================================");
  const p1 = await cvAgent.analyzeResume(page1);
  console.log("NAME:", p1.name);
  console.log("TITLE:", p1.display_title);
  console.log("DOMAIN:", p1.ml_metadata.domain_classified);
  console.log("LOCATION:", p1.location);
  console.log("EXPERIENCE:", p1.experience_years);
  console.log("ATOMIC TASKS COUNT:", p1.atomic_tasks.length);
  p1.atomic_tasks.forEach((t, i) => console.log(` [${i+1}] ${t.name}\n      Cat: ${t.category} | Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure} | SDGs: ${t.sdg_targets.join(", ")}`));
  console.log("BASELINE SKILLS:", p1.baseline_skills);

  const match1 = await matchWorkerToRoles({
    workerTasks: p1.atomic_tasks,
    workerSkills: p1.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("TOP ROLE MATCH:", match1.ranked_roles[0].title, `(${match1.ranked_roles[0].match_score_pct}%)`);
  console.log("SKILLS GAPS:", match1.ranked_roles[0].missing_skill_gaps.map(g => g.name));

  console.log("\n==========================================");
  console.log("TESTING USER RESUME: PAGE 2");
  console.log("==========================================");
  const p2 = await cvAgent.analyzeResume(page2);
  console.log("NAME:", p2.name);
  console.log("TITLE:", p2.display_title);
  console.log("DOMAIN:", p2.ml_metadata.domain_classified);
  console.log("LOCATION:", p2.location);
  console.log("EXPERIENCE:", p2.experience_years);
  console.log("ATOMIC TASKS COUNT:", p2.atomic_tasks.length);
  p2.atomic_tasks.forEach((t, i) => console.log(` [${i+1}] ${t.name}\n      Cat: ${t.category} | Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure} | SDGs: ${t.sdg_targets.join(", ")}`));
  console.log("BASELINE SKILLS:", p2.baseline_skills);

  const match2 = await matchWorkerToRoles({
    workerTasks: p2.atomic_tasks,
    workerSkills: p2.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("\n==========================================");
  console.log("TESTING USER RESUME: COMBINED PAGE 1 + 2");
  console.log("==========================================");
  const pBoth = await cvAgent.analyzeResume(page1 + "\n" + page2);
  console.log("NAME:", pBoth.name);
  console.log("TITLE:", pBoth.display_title);
  console.log("DOMAIN:", pBoth.ml_metadata.domain_classified);
  console.log("LOCATION:", pBoth.location);
  console.log("EXPERIENCE:", pBoth.experience_years);
  console.log("ATOMIC TASKS COUNT:", pBoth.atomic_tasks.length);
  pBoth.atomic_tasks.forEach((t, i) => console.log(` [${i+1}] ${t.name}\n      Cat: ${t.category} | Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure} | SDGs: ${t.sdg_targets.join(", ")}`));
  console.log("BASELINE SKILLS:", pBoth.baseline_skills);

  const matchBoth = await matchWorkerToRoles({
    workerTasks: pBoth.atomic_tasks,
    workerSkills: pBoth.baseline_skills,
    roles: rolesData.roles,
    scenarioId: "moderate"
  });
  console.log("TOP ROLE MATCH:", matchBoth.ranked_roles[0].title, `(${matchBoth.ranked_roles[0].match_score_pct}%)`);
  console.log("SKILLS GAPS:", matchBoth.ranked_roles[0].missing_skill_gaps.map(g => g.name));
}

testUserResume().catch(console.error);
