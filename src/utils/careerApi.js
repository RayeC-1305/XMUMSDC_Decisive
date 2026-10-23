// One server contract for matching, scenario forecasts and every role's pathway.
// Local rules are used only by the explicitly illustrative landing-page preview.
const base = (import.meta.env?.VITE_API_URL || "").replace(/\/$/, "");

export async function apiRequest(route, { body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${base}/api${route}`, { method: body === undefined ? "GET" : "POST", headers: body === undefined ? {} : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("The career service could not be reached. Check your connection and try again.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    const error = new Error(data?.error || data?.lastError || "The career service returned an unexpected response. Please try again.");
    error.status = response.status;
    throw error;
  }
  return data;
}

const interestSkills = {
  Sustainability: ["carbon", "sustainability"],
  "Data & operations": ["analytics", "sql", "aiLiteracy"],
  Engineering: ["iot", "automation", "python"],
  "Clean energy": ["energy", "electrical"],
};

export function profileForApi(profile, preferences) {
  return {
    id: profile.id, name: profile.name, role: profile.role, location: profile.location, years: Number(profile.years) || 0,
    skills: profile.skills, tasks: profile.tasks, interests: interestSkills[preferences.interest] || [],
    goal: preferences.goal, hoursPerWeek: preferences.hours, reviewed: true,
    synthetic: profile.synthetic === true || ["siti", "wei", "asha"].includes(profile.id),
  };
}

export function transitionRequest(state) {
  const prefix = `${state.profile.id}:`;
  return {
    profile: profileForApi(state.profile, state.preferences), scenarioId: state.scenario,
    evidenceRevision: state.evidenceRevision ?? undefined,
    simulations: state.signals.filter(s => s.type === "Simulation").map(({ id, title, publisher, date, url, impacts }) => ({ id, title, publisher, date, url, impacts })),
    completedStepIds: [...new Set(Object.entries(state.progress).filter(([key, done]) => done && key.startsWith(prefix)).map(([key]) => { const suffix = key.slice(prefix.length); return suffix.slice(suffix.indexOf(":") + 1); }))],
  };
}

export function adaptSource(source) {
  return { ...source, mappings: source.mappings?.map(m => ({ ...m, skill: m.skillId, weight: m.factor, reason: `${m.rationale} Matched: ${m.matchedTerms}.` })) };
}

export function adaptTransition(result) {
  if (!Array.isArray(result.matches) || !result.pathways || !result.evidence || !Array.isArray(result.skillOutlook)) throw new Error("The career service returned an incomplete plan. Please try again.");
  const kinds = { role_skill_gap: "Skill building", prerequisite: "Prerequisite", portfolio_and_adviser_review: "Work sample & adviser review" };
  const matches = result.matches.map(role => ({ ...role,
    breakdown: role.components.map(c => c.value), demand: role.skillForecasts.reduce((sum, s) => sum + s.weight, 0) / role.skills.length,
    sourceId: role.evidenceSourceIds[0] || role.sourceId,
    plan: result.pathways[role.id].steps.map(step => ({ ...step, shared: step.id.startsWith("skill:"), skills: step.skillIds,
      kind: kinds[step.kind], subtitle: step.completed ? "Completed learning is preserved" : `${step.hours} estimated hours of reading and practice`,
      description: step.rationale,
    })),
    pathway: result.pathways[role.id],
  }));
  return { ...result, matches, signals: [...result.evidence.sources.map(adaptSource), ...result.simulationInputs],
    skillOutlook: result.skillOutlook.map(skill => ({ ...skill, direction: { rising: "Rising", declining: "Declining", stable: "Steady" }[skill.direction] })),
  };
}

export async function submitProfile(profile, preferences) {
  const result = await apiRequest("/intake", { body: { profile: profileForApi(profile, preferences) } });
  return { ...profile, ...result.profile, importedAt: profile.importedAt || new Date().toISOString() };
}

export async function parseCvWithApi(text, filename = "Pasted CV") {
  const result = await apiRequest("/intake", { body: { cv_text: text } });
  return { ...result.profile, filename, importedAt: new Date().toISOString(), extraction: result.extraction };
}
