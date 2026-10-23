import { ROLES, SKILLS, SKILL_MAP, SCENARIOS, LEARNING, MODEL_VERSION, DISCLOSURE, publicRole, publicSkill, sdgMappings } from "./career_catalog.js";
import { InputError, number, strings, recogniseSkills, object, text } from "./profile_intake.js";

const round = value => Math.round(value * 100) / 100;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const aliases = { moderate: "steady", rapid_agentic: "rapid", malaysia_green_boom: "green" };
export function scenarioFor(id = "steady") {
  const scenario = SCENARIOS.find(s => s.id === (aliases[id] || id));
  if (!scenario) throw new InputError(`Unknown scenario. Choose ${SCENARIOS.map(s => s.id).join(", ")}.`);
  return scenario;
}

export function normalizeSimulations(input = []) {
  if (!Array.isArray(input) || input.length > 10) throw new InputError("Use at most 10 personal scenario signals.");
  const result = input.map(value => {
    object(value, "Scenario signal");
    const id = text(value.id, "Signal ID", 100);
    if (!/^(custom-|demo-|simulation:)/.test(id)) throw new InputError("Personal signal IDs must start with custom-, demo- or simulation:.");
    object(value.impacts, "Signal impacts");
    const entries = Object.entries(value.impacts);
    if (!entries.length || entries.length > SKILLS.length || entries.some(([skillId]) => !Object.hasOwn(SKILL_MAP, skillId))) throw new InputError("Scenario impacts must use known skill IDs.");
    const impacts = Object.fromEntries(entries.map(([skillId, factor]) => [skillId, number(factor, "Scenario impact", 0.5, 2)]));
    const url = text(value.url, "Scenario reference URL", 1000);
    try { if (!["http:", "https:"].includes(new URL(url).protocol)) throw new Error(); } catch { throw new InputError("Use a complete http or https reference URL."); }
    const date = text(value.date, "Scenario input date", 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new InputError("Use a valid scenario input date.");
    return { id, title: text(value.title, "Scenario title", 200), publisher: text(value.publisher, "Scenario author", 200, "Personal scenario"), date, url, impacts, type: "Simulation", retrieval: "simulation", summary: "Personal planning assumption, not verified research or observed job demand.", mappingNote: "Applied separately from retrieved evidence; scenario weights are authored assumptions." };
  });
  if (new Set(result.map(s => s.id)).size !== result.length) throw new InputError("Scenario signal IDs must be unique.");
  return result;
}

export function skillForecast(skillId, sources, scenario, simulations = []) {
  const unique = [...new Map(sources.map(s => [s.id, s])).values()];
  const relevant = unique.filter(s => Number.isFinite(s.impacts?.[skillId]));
  // Average, rather than multiply, so repeated papers cannot compound into runaway scores.
  const researchFactor = clamp(relevant.length ? relevant.reduce((sum, s) => sum + s.impacts[skillId], 0) / relevant.length : 1, 0.9, 1.1);
  const scenarioFactor = scenario.factors[skillId] || 1;
  const relevantSimulations = simulations.filter(s => Object.hasOwn(s.impacts, skillId));
  const simulationFactor = relevantSimulations.length ? relevantSimulations.reduce((sum, s) => sum + s.impacts[skillId], 0) / relevantSimulations.length : 1;
  const weight = round(clamp(researchFactor * scenarioFactor * simulationFactor, 0.5, 2));
  return { ...publicSkill(SKILL_MAP[skillId]), weight, researchFactor: round(researchFactor), scenarioFactor,
    simulationFactor: round(simulationFactor), simulationSourceIds: relevantSimulations.map(s => s.id),
    direction: weight > 1.02 ? "rising" : weight < 0.98 ? "declining" : "stable",
    evidenceSourceIds: relevant.map(s => s.id), basis: relevant.length ? "research_metadata_and_scenario_assumptions" : "scenario_assumptions_only",
    interpretation: "Relative learning priority estimate; not observed skill demand or a growth percentage." };
}

function rank(profile, sources, scenario, simulations = []) {
  const taskSkills = recogniseSkills(profile.tasks.join(" ")).map(s => s.skillId);
  const forecasts = new Map(SKILLS.map(skill => [skill.id, skillForecast(skill.id, sources, scenario, simulations)]));
  return ROLES.map(role => {
    const known = role.skills.filter(id => profile.skills.includes(id));
    const bridges = role.bridges.map(id => ({ skillId: id, basis: profile.skills.includes(id) ? "declared_skill" : taskSkills.includes(id) ? "task_keyword_potential" : "not_evidenced", credit: profile.skills.includes(id) ? 1 : taskSkills.includes(id) ? 0.6 : 0 }));
    const requiredSkillScore = known.length / role.skills.length * 100;
    const transferableScore = bridges.reduce((sum, b) => sum + b.credit, 0) / role.bridges.length * 100;
    const averageWeight = role.skills.reduce((sum, id) => sum + forecasts.get(id).weight, 0) / role.skills.length;
    const trendScore = clamp(50 + (averageWeight - 1) * 50, 0, 100);
    const components = [
      { id: "required_skills", label: "Declared required skills", weight: 0.45, value: round(requiredSkillScore), points: round(requiredSkillScore * 0.45), explanation: `${known.length} of ${role.skills.length} required skills are declared. No proficiency is inferred.` },
      { id: "transferability", label: "Transferable strengths and potential", weight: 0.3, value: round(transferableScore), points: round(transferableScore * 0.3), explanation: "Bridge skills earn 1 credit when declared, 0.6 for an experience-task keyword, and 0 otherwise.", bridges },
      { id: "trend", label: "Research and scenario context", weight: 0.25, value: round(trendScore), points: round(trendScore * 0.25), explanation: "50 is neutral. Each 1.0 increase in the mean required-skill weight adds 50 before clamping to 0–100. Sources affect a bounded metadata proxy, not employer demand." },
    ];
    const gaps = role.skills.filter(id => !known.includes(id)).map(id => ({ ...forecasts.get(id), interested: profile.interests.includes(id), reason: "Required by the authored role profile; not declared in the reviewed skills list." })).sort((a, b) => b.weight - a.weight || Number(b.interested) - Number(a.interested) || a.id.localeCompare(b.id));
    return { ...publicRole(role), score: round(components.reduce((sum, c) => sum + c.points, 0)), components, known, matchedSkills: known.map(id => publicSkill(SKILL_MAP[id])), gaps,
      evidenceSourceIds: [...new Set(role.skills.flatMap(id => forecasts.get(id).evidenceSourceIds))],
      skillForecasts: role.skills.map(id => forecasts.get(id)), nextLearningPriority: gaps[0]?.id ?? null,
      explanation: `${known.length}/${role.skills.length} required skills declared; ${bridges.filter(b => b.credit > 0).length}/${bridges.length} transferable bridges supported. ${gaps.length} role skill gaps remain.`,
    };
  }).sort((a, b) => b.score - a.score || b.known.length - a.known.length || a.id.localeCompare(b.id));
}

export function matchProfile(profile, evidence, scenarioId = "steady", simulations = []) {
  const scenario = scenarioFor(scenarioId);
  const sources = evidence.sources;
  const neutral = rank(profile, [], scenario, simulations);
  const matches = rank(profile, sources, scenario, simulations).map((role, index) => {
    const before = neutral.find(r => r.id === role.id);
    return { ...role, rank: index + 1, evidenceImpact: { scoreWithoutEvidence: before.score, scoreDelta: round(role.score - before.score), priorityWithoutEvidence: before.nextLearningPriority, priorityChanged: before.nextLearningPriority !== role.nextLearningPriority } };
  });
  const comparisons = SCENARIOS.map(s => ({ id: s.id, title: s.title, horizon: s.horizon, description: s.description, factors: s.factors, status: "authored_planning_assumption", roles: rank(profile, sources, s, simulations).map((r, i) => ({ roleId: r.id, rank: i + 1, score: r.score, nextLearningPriority: r.nextLearningPriority })) }));
  const sensitivity = matches.map(role => {
    const scores = comparisons.map(s => s.roles.find(r => r.roleId === role.id));
    return { roleId: role.id, scoreRange: { min: Math.min(...scores.map(r => r.score)), max: Math.max(...scores.map(r => r.score)) }, rankRange: { min: Math.min(...scores.map(r => r.rank)), max: Math.max(...scores.map(r => r.rank)) }, priorities: [...new Set(scores.map(r => r.nextLearningPriority))], interpretation: "Range across authored scenarios, not a statistical confidence interval." };
  });
  return { modelVersion: MODEL_VERSION, disclosure: DISCLOSURE, scenario: { ...scenario, status: "authored_planning_assumption" }, matches, scenarios: comparisons, sensitivity,
    simulationInputs: simulations,
    skillOutlook: SKILLS.map(s => skillForecast(s.id, sources, scenario, simulations)).sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id)),
    evidence: { ...evidence },
    assumptions: ["Role profiles are illustrative pathways, not verified vacancies or guaranteed future occupations.", "Research metadata is a capability signal; local hiring demand is not measured.", "Only declared skills and task-derived potential affect the profile score. Names, age, gender, location and years of experience are not scoring inputs.", "A missing skill is unknown, not proof that a person lacks it. Review and correct the profile.", ...(!profile.reviewed ? ["This profile has not been marked as human-reviewed."] : []), ...(evidence.status === "unavailable" ? ["No retrieved evidence is available. Results use neutral research weights and authored scenarios only."] : evidence.status === "stale" ? ["The public feed is stale or a refresh failed. Source dates and the last retrieval remain visible."] : [])],
    humanDecision: "Compare the alternatives, verify gaps with a worker or adviser, then choose a direction. The service does not make hiring or enrolment decisions.",
  };
}

export function buildPathway(profile, matchedRole, options = {}) {
  const hoursPerWeek = number(options.hoursPerWeek, "hoursPerWeek", 1, 40, profile.hoursPerWeek);
  const completed = strings(options.completedStepIds ?? [], "completedStepIds", 100, 120);
  const known = new Set(profile.skills);
  const roleGaps = new Set(matchedRole.gaps.map(s => s.id));
  const ordered = [];
  const visiting = new Set();
  const included = new Set();
  const visit = id => {
    if (known.has(id) || included.has(id)) return;
    if (visiting.has(id)) throw new Error("Learning catalog contains a prerequisite cycle.");
    visiting.add(id);
    for (const prerequisite of LEARNING[id].prerequisites) visit(prerequisite);
    visiting.delete(id);
    included.add(id);
    ordered.push(id);
  };
  matchedRole.gaps.forEach(skill => visit(skill.id));
  const steps = ordered.map(id => ({ id: `skill:${id}`, title: `Practise ${SKILL_MAP[id].name}`, kind: roleGaps.has(id) ? "role_skill_gap" : "prerequisite", skillIds: [id], hours: LEARNING[id].hours,
    prerequisiteStepIds: LEARNING[id].prerequisites.filter(p => !known.has(p)).map(p => `skill:${p}`), resource: LEARNING[id].resource, output: LEARNING[id].output,
    targets: SKILL_MAP[id].targets, sdgs: sdgMappings(SKILL_MAP[id].targets), rationale: roleGaps.has(id) ? "Covers a missing role skill, ordered by scenario priority after prerequisites." : "Foundation needed by another learning step.",
  }));
  steps.push({ id: `portfolio:${matchedRole.id}`, title: `Build a ${matchedRole.title.toLowerCase()} work sample`, kind: "portfolio_and_adviser_review", skillIds: matchedRole.skills, hours: 8, prerequisiteStepIds: ordered.map(id => `skill:${id}`), resource: null, output: `${matchedRole.project} Ask an adviser to review the result, your assumptions and your chosen next step.`, targets: matchedRole.targets, sdgs: matchedRole.sdgs, rationale: `Connect the work sample to your goal: ${profile.goal}.` });
  const validIds = new Set(steps.map(s => s.id));
  const relevantCompleted = completed.filter(id => validIds.has(id));
  let hours = 0;
  const scheduled = steps.map((step, index) => {
    const done = relevantCompleted.includes(step.id);
    const startWeek = done ? null : Math.floor(hours / hoursPerWeek) + 1;
    if (!done) hours += step.hours;
    return { ...step, order: index + 1, completed: done, startWeek, endWeek: done ? null : Math.ceil(hours / hoursPerWeek), estimatedHourRange: { min: Math.ceil(step.hours * 0.75), max: Math.ceil(step.hours * 1.5) } };
  });
  return { roleId: matchedRole.id, scenarioId: options.scenarioId, goal: profile.goal, hoursPerWeek, steps: scheduled, totalHours: steps.reduce((sum, s) => sum + s.hours, 0), remainingHours: hours, estimatedWeeks: Math.ceil(hours / hoursPerWeek),
    coveredGapIds: [...roleGaps], prerequisiteSkillIds: ordered.filter(id => !roleGaps.has(id)), preservedCompletedStepIds: relevantCompleted, otherCompletedStepIds: completed.filter(id => !validIds.has(id)),
    costs: { publicContentTotal: 0, currency: "MYR", excludes: "Optional certificates, software, hardware, professional assessment and qualifications.", hrdCorpEligibility: "Not verified or assumed." },
    sdgs: matchedRole.sdgs, limitations: "Introductory reading and authored practice, not a complete professional qualification. Hours and ranges are planning estimates. Completion is self-reported and does not establish proficiency; technical work needs qualified supervision.",
    decisionStatus: "proposal_for_worker_and_adviser_review",
  };
}
