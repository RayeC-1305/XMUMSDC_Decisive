import { ROLES, SKILLS, SKILL_MAP, RESOURCES, SCENARIOS, SAMPLE_CVS } from "../src/data/careerCatalog.js";

export { ROLES, SKILLS, SKILL_MAP, SCENARIOS, SAMPLE_CVS };
export const MODEL_VERSION = "nexus-rules-1.0";
export const DISCLOSURE = "Explainable rules baseline; no generative model or GPU inference. Scores, scenario multipliers, learning times and SDG contributions are estimates, not hiring probabilities or validated forecasts.";

const extra = (title, provider, url) => ({ title, provider, url, note: "Free public reading and project practice; no qualification or certificate is implied." });
const spreadsheet = extra("Excel help & learning", "Microsoft", "https://support.microsoft.com/en-us/excel");
const safety = extra("Safety and health in the use of machinery", "International Labour Organization", "https://www.ilo.org/resource/safety-and-health-use-machinery");
const quality = extra("The Government Data Quality Framework", "UK Government", "https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework");

// Resource selection is curated. The matching engine cannot invent courses or funding.
const learning = {
  excel: [spreadsheet, 8, [], "Create a synthetic reporting workbook with formulas and a source log."],
  dataEntry: [quality, 6, [], "Process sample records and document validation and human review checks."],
  communication: [extra("The Process of Managerial Communication", "OpenStax", "https://openstax.org/books/principles-management/pages/16-1-the-process-of-managerial-communication"), 6, [], "Explain a decision to two stakeholders and record their feedback."],
  coordination: [extra("The Planning Process", "OpenStax", "https://openstax.org/books/principles-management/pages/17-2-the-planning-process"), 6, [], "Create a workflow, dependencies and handover checklist."],
  problemSolving: [extra("Overview of Managerial Decision-Making", "OpenStax", "https://openstax.org/books/principles-management/pages/2-1-overview-of-managerial-decision-making"), 6, [], "Compare three solutions to a synthetic workplace problem and explain the tradeoffs."],
  dataQuality: [quality, 8, ["excel"], "Audit a synthetic dataset for completeness, validity and consistency."],
  sql: [RESOURCES.sql, 16, ["excel"], "Write and explain queries, joins and checks on synthetic tables."],
  analytics: [RESOURCES.analytics, 16, ["excel", "dataQuality"], "Build a chart from synthetic data with limitations and a decision note."],
  python: [RESOURCES.python, 20, [], "Write a small script with sample inputs, error handling and documented outputs."],
  aiLiteracy: [RESOURCES.ai, 6, [], "Map an AI-assisted workflow and test its errors and human checkpoints."],
  carbon: [RESOURCES.carbon, 16, ["excel", "dataQuality"], "Build a synthetic supplier-emissions workbook and state its boundaries and assumptions."],
  sustainability: [RESOURCES.sustainability, 8, [], "Connect a reporting example to specific SDG targets without claiming measured impact."],
  iot: [RESOURCES.iot, 16, ["python", "electrical"], "Analyse simulated sensor readings and document an anomaly and its checks."],
  automation: [RESOURCES.automation, 20, ["python", "safety"], "Simulate an automation workflow and document its failure and safety boundaries."],
  electrical: [extra("University Physics Volume 2: Current and Resistance", "OpenStax", "https://openstax.org/books/university-physics-volume-2/pages/9-introduction"), 20, ["safety"], "Explain a circuit using a simulation; do not work on live equipment."],
  diagnostics: [extra("Operations and Maintenance Best Practices", "US Department of Energy", "https://www.energy.gov/cmei/femp/articles/operations-and-maintenance-best-practices-guide-achieving-operational-efficiency"), 12, ["safety"], "Write a fault-isolation checklist for a simulated equipment fault."],
  safety: [safety, 8, [], "Identify hazards and propose controls in a fictional machinery case; seek qualified review."],
  energy: [extra("Solar Photovoltaic Technology Basics", "US Department of Energy", "https://www.energy.gov/cmei/systems/solar-photovoltaic-technology-basics"), 16, ["electrical", "safety"], "Interpret a simulated energy-monitoring log and list checks requiring a qualified technician."],
};

export const LEARNING = Object.fromEntries(Object.entries(learning).map(([id, [resource, hours, prerequisites, output]]) => [id, {
  resource: { ...resource, cost: { amount: 0, currency: "MYR", scope: "Public content only; optional certificates, hardware and software subscriptions excluded." }, hrdCorpClaimable: "not_verified", cataloguedOn: "2026-10-23", availability: "not_checked_at_request_time", ...(id === "automation" ? { accessNote: "The ROS documentation blocked automated inspection; check the publisher page manually before committing to the plan." } : {}) },
  hours, prerequisites, output,
}]));

const contributions = {
  "4.4": "Develop relevant technical and vocational skills through reviewed practice.",
  "7.2": "Support renewable energy monitoring and maintenance when applied in an appropriate role.",
  "8.2": "Improve productive work through responsible use of technology and better processes.",
  "8.5": "Support an informed transition toward productive employment and decent work.",
  "8.8": "Apply safer procedures and protect workers when improving systems.",
  "9.4": "Support more resource-efficient industrial systems through maintenance and monitoring.",
  "9.5": "Build practical capability to investigate and improve technical processes.",
  "10.2": "Use inclusive stakeholder communication and participation.",
  "12.2": "Improve resource monitoring and efficiency with reliable operational data.",
  "12.5": "Reduce avoidable equipment waste through diagnosis and maintenance.",
  "12.6": "Support accountable organisational sustainability reporting and practices.",
  "13.2": "Supply evidence for climate-related planning; actual policy impact depends on how the work is used.",
};
export const sdgMappings = targets => targets.map(target => ({ target, goal: Number(target.split(".")[0]), url: `https://sdgs.un.org/goals/goal${target.split(".")[0]}#targets_and_indicators`, contribution: contributions[target], status: "intended_contribution_not_measured_impact" }));
export const publicSkill = skill => ({ ...skill, sdgs: sdgMappings(skill.targets) });
export const publicRole = role => ({ ...role, catalogStatus: "authored_role_profile_not_a_vacancy", sdgs: sdgMappings(role.targets) });

export function catalog() {
  return { version: MODEL_VERSION, disclosure: DISCLOSURE, roles: ROLES.map(publicRole), skills: SKILLS.map(publicSkill), scenarios: SCENARIOS.map(s => ({ ...s, status: "authored_planning_assumption" })), resources: LEARNING, sampleProfiles: SAMPLE_CVS.map(p => ({ ...p, synthetic: true })) };
}

// Fail at startup rather than silently ship an unmapped skill or incomplete pathway.
for (const skill of SKILLS) {
  if (!LEARNING[skill.id] || !skill.targets.length || sdgMappings(skill.targets).some(s => !s.contribution)) throw new Error(`Incomplete skill catalog: ${skill.id}`);
  for (const id of LEARNING[skill.id].prerequisites) if (!SKILL_MAP[id]) throw new Error(`Unknown prerequisite: ${id}`);
}
for (const role of ROLES) if (!role.targets.length || role.skills.some(id => !SKILL_MAP[id])) throw new Error(`Incomplete role catalog: ${role.id}`);
