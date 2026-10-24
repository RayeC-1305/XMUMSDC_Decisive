import { randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { SKILLS, SKILL_MAP, LEARNING, MODEL_VERSION, DISCLOSURE, publicSkill } from "./career_catalog.js";
import { matchProfile, buildPathway, normalizeSimulations, scenarioFor } from "./career_engine.js";
import { InputError, normalizeProfile, recogniseSkills, object, text, number, strings } from "./profile_intake.js";

export const DEMO_NOTICE = "Demo Mode: Use synthetic data only. Do not enter real personal data or real CVs.";
export const HUMAN_NOTICE = "AI as a Partner: This dashboard supports human L&D and career transition planning. Recommendations are estimates and must not be used for automated hiring, firing, or performance penalties.";
const rounded = n => Math.round(n * 100) / 100;
const HOURS = new Set([24, 48, 168, null]);
const templates = [
  { department: "Software & Data", role: "Synthetic data support analyst", skills: ["excel", "sql", "python", "problemSolving"], tasks: ["Validate synthetic reports and reconcile data quality issues.", "Support database queries and communicate results."], interests: ["analytics", "automation"] },
  { department: "Operations & Admin", role: "Synthetic operations coordinator", skills: ["excel", "dataEntry", "communication", "coordination"], tasks: ["Coordinate supplier schedules and process synthetic invoices.", "Prepare reporting workbooks and verify records."], interests: ["aiLiteracy", "automation"] },
  { department: "Finance & Strategy", role: "Synthetic finance assistant", skills: ["excel", "dataEntry", "dataQuality", "problemSolving"], tasks: ["Reconcile synthetic accounts and analyse monthly reporting.", "Review supplier sustainability reports with stakeholders."], interests: ["carbon", "sustainability"] },
];

export function sampleEmployee(index = 0, departmentIndex = 1) {
  const template = templates[departmentIndex % templates.length];
  return {
    name: `DEMO-${departmentIndex + 1}-${String(index + 1).padStart(2, "0")}`,
    role: template.role, skills: template.skills.slice(0, 2 + index % 3),
    tasks: template.tasks, interests: template.interests, goal: "Explore a responsible, practical transition with my learning adviser",
    hoursPerWeek: 3 + index % 4, reviewed: true, synthetic: true,
  };
}

// A single-process, synthetic-only hackathon store. Atomic rename prevents partial
// writes; quota checks and writes occur synchronously with no intervening await.
export class WorkforceStore {
  constructor({ file, now = () => new Date(), seed = true } = {}) {
    this.file = file;
    this.now = now;
    this.seedOnLoad = seed;
    this.state = null;
  }
  load() {
    if (this.state) return;
    if (this.file && fs.existsSync(this.file)) {
      const saved = JSON.parse(fs.readFileSync(this.file, "utf8"));
      if (saved.version !== 1 || !Array.isArray(saved.campaigns) || !Array.isArray(saved.submissions)) throw new Error("Unsupported workforce store; refusing to overwrite existing data.");
      this.state = saved;
    } else {
      this.state = { version: 1, revision: 0, campaigns: [], submissions: [], simulationActive: false, simulationDate: null };
      if (this.seedOnLoad) this.seed();
    }
  }
  save() {
    this.state.revision += 1;
    if (!this.file) return;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.state), { mode: 0o600 });
    fs.renameSync(tmp, this.file);
  }
  count(campaignId) { return this.state.submissions.filter(s => s.campaignId === campaignId).length; }
  publicCampaign(campaign) {
    const currentSubmissions = this.count(campaign.id);
    const status = campaign.revoked ? "Revoked" : campaign.expiresAt && Date.parse(campaign.expiresAt) <= this.now().getTime() ? "Expired" : currentSubmissions >= campaign.maxSubmissions ? "Quota Reached" : "Active";
    return { ...campaign, currentSubmissions, status };
  }
  list() {
    this.load();
    return this.state.campaigns.map(c => this.publicCampaign(c));
  }
  create(input) {
    this.load();
    object(input);
    const department = text(input.department, "Department name", 100).trim();
    if (!department) throw new InputError("Enter a department name.");
    const maxSubmissions = number(input.maxSubmissions, "Max submissions", 1, 500, 25);
    if (!Number.isInteger(maxSubmissions)) throw new InputError("Submission limit must be a whole number.");
    const expirationHours = input.expirationHours === undefined ? 48 : input.expirationHours;
    if (!HOURS.has(expirationHours)) throw new InputError("Choose 24, 48, 168 hours or manual close.");
    if (this.state.campaigns.length >= 100) throw new InputError("Demo campaign capacity reached.", 409);
    const campaign = {
      id: randomUUID(), token: randomBytes(24).toString("base64url"), department,
      focus: text(input.focus, "Target role focus / notes", 1000),
      maxSubmissions, expiresAt: expirationHours === null ? null : new Date(this.now().getTime() + expirationHours * 3600000).toISOString(),
      revoked: false, createdAt: this.now().toISOString(),
    };
    this.state.campaigns.push(campaign);
    this.save();
    return this.publicCampaign(campaign);
  }
  update(id, input) {
    this.load();
    object(input);
    const campaign = this.state.campaigns.find(c => c.id === id);
    if (!campaign) throw new InputError("Campaign not found.", 404);
    if (input.action === "revoke") {
      campaign.revoked = true;
    } else if (input.action === "extend") {
      const hours = input.expirationHours === undefined ? 48 : input.expirationHours;
      if (!HOURS.has(hours)) throw new InputError("Choose 24, 48, 168 hours or manual close.");
      const limit = number(input.maxSubmissions, "Max submissions", 1, 500, campaign.maxSubmissions);
      if (!Number.isInteger(limit) || limit < this.count(id)) throw new InputError("The new quota must be a whole number at least equal to responses received.");
      campaign.maxSubmissions = limit;
      campaign.expiresAt = hours === null ? null : new Date(Math.max(this.now().getTime(), Date.parse(campaign.expiresAt) || 0) + hours * 3600000).toISOString();
      campaign.revoked = false;
    } else throw new InputError("Choose revoke or extend.");
    this.save();
    return this.publicCampaign(campaign);
  }
  valid(token) {
    this.load();
    const campaign = this.state.campaigns.find(c => c.token === token);
    if (!campaign) throw new InputError("Survey link not found.", 404);
    const view = this.publicCampaign(campaign);
    if (view.status !== "Active") throw new InputError(view.status === "Quota Reached" ? "Limit Reached: this survey has received its maximum responses." : `Survey Closed: this link is ${view.status.toLowerCase()}.`, 410);
    return view;
  }
  publicSurvey(token) {
    const campaign = this.valid(token);
    const { token: _token, ...safeCampaign } = campaign;
    return { campaign: safeCampaign, skills: SKILLS.map(publicSkill), sample: sampleEmployee(), notice: DEMO_NOTICE };
  }
  prepareSubmission(input) {
    object(input);
    if (input.syntheticConsent !== true || input.profile?.synthetic !== true) throw new InputError("Confirm that this submission contains synthetic data only.");
    object(input.profile, "Profile");
    // Allow-list before normalizing: demographic fields never enter HR storage.
    const { name, role, skills, tasks, interests, goal, hoursPerWeek } = input.profile;
    if (!text(name, "Synthetic alias", 100).trim() || !text(role, "Current role", 150).trim()) throw new InputError("Enter a synthetic alias and current role.");
    const cvText = text(input.cvText, "Synthetic CV summary", 8000);
    const extraSkills = cvText ? recogniseSkills(cvText).map(s => s.skillId) : [];
    const profile = normalizeProfile({
      name, role, skills: [...new Set([...strings(skills ?? [], "skills"), ...extraSkills])],
      tasks: [...strings(tasks ?? [], "tasks", 20, 500), ...(cvText ? cvText.match(/.{1,500}/gs).slice(0, 10) : [])],
      interests, goal, hoursPerWeek, reviewed: true, synthetic: true,
    });
    object(input.proficiencies ?? {}, "Proficiencies");
    if (Object.keys(input.proficiencies ?? {}).some(id => !Object.hasOwn(SKILL_MAP, id))) throw new InputError("Proficiencies must use catalog skill IDs.");
    const proficiencies = Object.fromEntries(profile.skills.map(id => {
      const value = number(input.proficiencies?.[id], "Proficiency", 1, 5, 3);
      if (!Number.isInteger(value)) throw new InputError("Proficiency must be a whole number from 1 to 5.");
      return [id, value];
    }));
    return { profile, proficiencies, customSkills: strings(input.customSkills ?? [], "Custom skills", 15, 100) };
  }
  submit(token, prepared) {
    const campaign = this.valid(token); // Recheck after asynchronous evidence retrieval.
    if (this.state.submissions.length >= 5000) throw new InputError("Synthetic demo storage capacity reached.", 409);
    const submission = { id: randomUUID(), campaignId: campaign.id, ...prepared, submittedAt: this.now().toISOString() };
    this.state.submissions.push(submission);
    this.save();
    return submission;
  }
  seed() {
    if (!this.state) this.load();
    if (this.state.seededAt) return { campaigns: this.list(), demoOnly: true, alreadySeeded: true };
    templates.forEach((template, departmentIndex) => {
      const campaign = this.create({ department: template.department, focus: "Synthetic department reskilling and responsible AI adoption", maxSubmissions: 50, expirationHours: null });
      for (let index = 0; index < 8; index++) {
        const profile = normalizeProfile(sampleEmployee(index, departmentIndex));
        this.state.submissions.push({
          id: randomUUID(), campaignId: campaign.id, profile,
          proficiencies: Object.fromEntries(profile.skills.map((id, i) => [id, 2 + (index + i) % 4])),
          customSkills: [], submittedAt: this.now().toISOString(),
        });
      }
    });
    this.state.seededAt = this.now().toISOString();
    this.save();
    return { campaigns: this.list(), demoOnly: true, alreadySeeded: false };
  }
  toggleSimulation() {
    this.load();
    this.state.simulationActive = !this.state.simulationActive;
    this.state.simulationDate = this.now().toISOString();
    this.save();
  }
  simulations() {
    this.load();
    return this.state.simulationActive ? normalizeSimulations([{
      id: "simulation:hr-ai-stress-test", title: "Simulated accelerated AI workflow adoption",
      publisher: "NexusTalent authored planning assumption", date: this.state.simulationDate.slice(0, 10),
      url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
      impacts: { aiLiteracy: 1.6, automation: 1.5, sql: 1.8, analytics: 1.35, dataQuality: 1.3, python: 1.25, dataEntry: 0.6 },
    }]) : [];
  }
}

export function analyseEmployee(submission, campaign, evidence, scenarioId, simulations) {
  const analysis = matchProfile(submission.profile, evidence, scenarioId, simulations);
  const weeklyHours = Math.min(40, submission.profile.hoursPerWeek * (scenarioId === "rapid" ? 1.5 : 1));
  const pathways = Object.fromEntries(analysis.matches.map(role => [role.id, buildPathway(submission.profile, role, { scenarioId, hoursPerWeek: weeklyHours })]));
  const pathway = pathways[analysis.matches[0].id];
  const heatmap = analysis.skillOutlook.map(skill => {
    const proficiency = submission.proficiencies[skill.id] || 0;
    const gap = Math.max(0, 4 - proficiency);
    const urgency = rounded(gap / 4 * skill.weight * (scenarioId === "rapid" ? 1.3 : 1) * 100);
    return { skillId: skill.id, name: skill.name, proficiency, gap, urgency, direction: skill.direction,
      status: skill.direction === "declining" && proficiency ? "Declining / At-Risk Skill" : proficiency >= 4 ? "Strong Coverage" : urgency >= 90 ? "Critical Skill Deficit" : "Moderate Gap" };
  });
  const required = analysis.matches[0].skills;
  const targetGaps = heatmap.filter(s => required.includes(s.skillId));
  const averageGap = targetGaps.reduce((sum, s) => sum + s.urgency, 0) / Math.max(1, targetGaps.length);
  const declining = heatmap.filter(s => s.direction === "declining" && s.proficiency).length;
  const score = rounded(Math.min(100, averageGap * 0.65 + declining * 12));
  return {
    ...submission, department: campaign.department, alias: submission.profile.name,
    analysis: { ...analysis, pathways }, pathway, timelineWeeks: pathway.estimatedWeeks, heatmap,
    risk: { score, level: score >= 60 ? "High" : score >= 35 ? "Moderate" : "Low",
      explanation: "Scenario exposure / learning-priority index, not a probability of displacement. 65% of mean top-role proficiency-gap urgency, plus 12 points per declared declining skill; capped at 100. Unknown proficiency needs human review." },
  };
}

export function workforceDashboard(store, evidence, { scenarioId = "steady", campaignId } = {}) {
  scenarioFor(scenarioId);
  const campaigns = store.list();
  if (campaignId && !campaigns.some(c => c.id === campaignId)) throw new InputError("Campaign not found.", 404);
  const simulations = store.simulations();
  const employees = store.state.submissions.filter(s => !campaignId || s.campaignId === campaignId)
    .map(s => analyseEmployee(s, campaigns.find(c => c.id === s.campaignId), evidence, scenarioId, simulations));
  const cohortMap = new Map();
  const targetMap = new Map();
  const addTargets = (mappings, employeeId) => {
    for (const mapping of mappings) {
      if (!targetMap.has(mapping.target)) targetMap.set(mapping.target, { ...mapping, employees: new Set() });
      targetMap.get(mapping.target).employees.add(employeeId);
    }
  };
  for (const employee of employees) {
    addTargets(employee.analysis.matches[0].sdgs, employee.id);
    for (const step of employee.pathway.steps) {
      addTargets(step.sdgs, employee.id);
      if (!step.resource) continue;
      const id = step.skillIds[0];
      if (!cohortMap.has(id)) cohortMap.set(id, {
        skillId: id, title: SKILL_MAP[id].name, employeeIds: [], hours: LEARNING[id].hours,
        resource: LEARNING[id].resource, prerequisiteSkillIds: LEARNING[id].prerequisites,
        targets: step.targets, sdgs: step.sdgs,
      });
      cohortMap.get(id).employeeIds.push(employee.id);
    }
  }
  const depth = id => LEARNING[id].prerequisites.length ? 1 + Math.max(...LEARNING[id].prerequisites.map(depth)) : 0;
  const outlook = employees[0]?.analysis.skillOutlook ?? matchProfile(normalizeProfile(sampleEmployee()), evidence, scenarioId, simulations).skillOutlook;
  const cohorts = [...cohortMap.values()].sort((a, b) => depth(a.skillId) - depth(b.skillId) || (outlook.find(s => s.id === b.skillId)?.weight ?? 1) - (outlook.find(s => s.id === a.skillId)?.weight ?? 1));
  let cumulativeWeeks = 0;
  cohorts.forEach((cohort, index) => {
    cohort.order = index + 1;
    cohort.employeeCount = cohort.employeeIds.length;
    const capacity = Math.min(...employees.filter(e => cohort.employeeIds.includes(e.id)).map(e => e.pathway.hoursPerWeek));
    cohort.estimatedWeeks = Math.ceil(cohort.hours / capacity);
    cohort.startWeek = cumulativeWeeks + 1;
    cumulativeWeeks += cohort.estimatedWeeks;
    cohort.endWeek = cumulativeWeeks;
  });
  return {
    scenarioId, generatedAt: store.now().toISOString(), revision: `${store.state.revision}:${evidence.revision ?? evidence.retrievedAt ?? "offline"}:${scenarioId}`,
    simulationActive: store.state.simulationActive, simulations, campaigns, employees, skills: outlook, cohorts,
    sdgs: [...targetMap.values()].map(({ employees: ids, ...mapping }) => ({ ...mapping, count: ids.size })).sort((a, b) => a.goal - b.goal || a.target.localeCompare(b.target)),
    evidence, modelVersion: MODEL_VERSION, disclosure: DISCLOSURE, humanDecision: HUMAN_NOTICE,
    riskMethodology: "Planning proxy only: 65% of mean top-role proficiency-gap urgency plus 12 per declared declining skill, capped at 100; not job-loss probability. Urgency = (4 − self-rating, minimum 0) / 4 × shared forecast weight × scenario multiplier (rapid 1.3, otherwise 1) × 100. Proficiency is used only in this reviewable heatmap/risk proxy, never in shared role matching. Rapid plans assume 1.5× protected weekly learning time, capped at 40; HR must approve this capacity.",
    summary: { employees: employees.length, departments: new Set(employees.map(e => e.department)).size, highRisk: employees.filter(e => e.risk.level === "High").length, totalLearningHours: employees.reduce((sum, e) => sum + e.pathway.totalHours, 0) },
    demoOnly: true,
  };
}
