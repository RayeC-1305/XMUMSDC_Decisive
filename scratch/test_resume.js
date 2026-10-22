import { cvAgent } from "../services/cv_agent.js";

async function test() {
  const resume = `
John Doe
Email: john.doe@email.com | Phone: +6012-3456789 | Petaling Jaya, Selangor
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Software Engineer with 4 years of experience building web applications, designing RESTful APIs, and managing PostgreSQL databases. Proficient in JavaScript, React, Node.js, and Python.

WORK EXPERIENCE
Software Engineer | Tech Solutions Sdn Bhd (2022 - Present)
- Developed and maintained responsive user interfaces using React, Redux, and Tailwind CSS.
- Designed scalable RESTful microservices with Node.js, Express, and PostgreSQL handling 50,000 daily requests.
- Integrated automated CI/CD deployment pipelines using Docker and GitHub Actions on AWS EC2.
- Optimized slow SQL database queries, reducing average API response times by 35%.
- Collaborated with product managers and UX designers in two-week agile sprint planning sessions.

Junior Web Developer | Digital Innovations (2020 - 2022)
- Built interactive frontend client dashboards using HTML5, CSS3, and JavaScript.
- Wrote unit and integration tests using Jest and Cypress, maintaining 85% test coverage.
- Assisted senior engineers in debugging database deadlocks and API error handling.

EDUCATION
Bachelor of Computer Science (Software Engineering)
Universiti Malaya (2016 - 2020)
CGPA: 3.72

SKILLS
Programming: JavaScript, TypeScript, Python, SQL, HTML, CSS
Frameworks: React, Node.js, Express, Next.js, Django
Databases: PostgreSQL, MongoDB, Redis
Tools: Git, Docker, AWS, Postman, Linux, Jira
  `;

  const p = await cvAgent.analyzeResume(resume);
  console.log("NAME:", p.name);
  console.log("TITLE:", p.display_title);
  console.log("LOCATION:", p.location);
  console.log("EDUCATION:", p.education);
  console.log("EXPERIENCE YEARS:", p.experience_years);
  console.log("TASKS:");
  p.atomic_tasks.forEach((t, i) => console.log(`[${i+1}] ${t.name}\n    --> ESCO: ${t.matched_esco_skill} (id: ${t.skill_id}) | Half-life: ${t.baseline_halflife_months} mos | Exposure: ${t.automation_exposure}`));
  console.log("BASELINE SKILLS:", p.baseline_skills);
}

test().catch(console.error);
