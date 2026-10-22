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

function extractIntelligentClauses(text) {
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
  const bulletRegex = /^[•●○\*\-–—▪▫]\s*|\b\d+[\.\)]\s*/;
  
  // Section boundary markers
  const sectionHeaderRegex = /^(experience|work experience|employment history|education|skills|certifications|awards|summary|professional summary)$/i;
  // Date patterns representing employer / job title lines
  const dateLineRegex = /\b(20\d\d|19\d\d|20xx)\b|\b(present|current)\b/i;
  // Degree / credential markers
  const degreeRegex = /\b(bachelor|master|m\.ed|b\.a|b\.s|phd|diploma|degree|gpa|cum laude|seed|graduate seminar|credits)\b/i;
  // Location suffix often found on employer lines e.g. "Town, MA" or "Boston, MA"
  const locationHeaderRegex = /,\s*(?:[A-Z]{2}|malaysia|singapore)\b/i;

  const rawBullets = [];
  let currentBullet = null;
  let inEducationOrSkills = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Track section context
    if (/^(education|academic background|qualifications)$/i.test(line)) {
      inEducationOrSkills = true;
      if (currentBullet) { rawBullets.push(currentBullet); currentBullet = null; }
      continue;
    }
    if (/^(skills|technical skills|tools & technologies)$/i.test(line)) {
      inEducationOrSkills = true;
      if (currentBullet) { rawBullets.push(currentBullet); currentBullet = null; }
      continue;
    }
    if (/^(experience|work experience|employment history|professional background)$/i.test(line)) {
      inEducationOrSkills = false;
      if (currentBullet) { rawBullets.push(currentBullet); currentBullet = null; }
      continue;
    }

    if (inEducationOrSkills) {
      continue;
    }

    // Skip footer / page number lines
    if (/resume,?\s*p(?:age|\.)?\s*\d+/i.test(line) || /^page\s+\d+/i.test(line)) {
      continue;
    }

    // Check if line is a bullet
    if (bulletRegex.test(line)) {
      if (currentBullet) {
        rawBullets.push(currentBullet);
      }
      currentBullet = line.replace(bulletRegex, "").trim();
    } else if (currentBullet) {
      // Is this line a continuation of the bullet, or a new header?
      const isHeader = 
        dateLineRegex.test(line) || 
        sectionHeaderRegex.test(line) || 
        (locationHeaderRegex.test(line) && line.length < 60) ||
        degreeRegex.test(line);

      if (isHeader) {
        rawBullets.push(currentBullet);
        currentBullet = null;
      } else {
        // Continuation line!
        currentBullet += " " + line;
      }
    }
  }

  if (currentBullet) {
    rawBullets.push(currentBullet);
  }

  // Filter out any bullets that are purely degrees or credentials
  const cleanBullets = rawBullets.filter(b => {
    if (b.length < 25) return false;
    if (degreeRegex.test(b) && b.length < 50 && !/\b(taught|coach\w*|assist\w*|manag\w*|develop\w*)\b/i.test(b)) return false;
    return true;
  });

  return cleanBullets;
}

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

const extracted2 = extractIntelligentClauses(page2);
console.log(`\nEXTRACTED ${extracted2.length} BULLETS FROM PAGE 2:`);
extracted2.forEach((b, i) => console.log(`[${i+1}] ${b}\n`));

