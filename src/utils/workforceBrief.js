export function filterWorkforce(employees, query = "", risk = "") {
  const text = query.trim().toLowerCase();
  return employees.filter(person =>
    (!risk || person.risk?.level === risk) &&
    (!text || [person.alias, person.department, person.profile?.role].some(value => String(value || "").toLowerCase().includes(text))),
  );
}

// Selecting a cohort includes its prerequisites. Removing one also removes
// dependent cohorts so the exported sequence never silently skips a foundation.
export function changeCohortSelection(cohorts, selection, skillId, include) {
  const selected = new Set(selection);
  const byId = new Map(cohorts.map(cohort => [cohort.skillId, cohort]));
  if (include) {
    const add = id => {
      if (selected.has(id) || !byId.has(id)) return;
      selected.add(id);
      (byId.get(id).prerequisiteSkillIds || []).forEach(add);
    };
    add(skillId);
  } else {
    selected.delete(skillId);
    let changed = true;
    while (changed) {
      changed = false;
      for (const cohort of cohorts) {
        if (selected.has(cohort.skillId) && (cohort.prerequisiteSkillIds || []).some(id => byId.has(id) && !selected.has(id))) {
          selected.delete(cohort.skillId);
          changed = true;
        }
      }
    }
  }
  return [...selected];
}

export function workforceBrief(dashboard, cohorts) {
  const people = dashboard.employees || [];
  const names = new Map(people.map(person => [person.id, person.alias]));
  const scope = [...new Set(people.map(person => person.department))].join(", ") || "Current department scope";
  return [
    "# NexusTalent · Department learning brief",
    "", `Scope: ${scope}`, `Generated: ${dashboard.generatedAt}`,
    `Scenario: ${dashboard.scenario?.title || dashboard.scenario?.id || "Not supplied"}`,
    `Simulation: ${dashboard.simulationActive ? "Authored signal simulation active" : "No added signal simulation"}`,
    `Model: ${dashboard.modelVersion || "Explainable rules"}`,
    "", "DEMO MODE: Synthetic profiles only. No real personal data or CVs.",
    dashboard.humanDecision || "AI supports human L&D planning, not automated hiring, firing or performance penalties.",
    "Scores and exposure are scenario-based planning indices, not job-loss probabilities. Training estimates are not commitments.",
    "", "## Selected learning cohorts",
    "Prerequisite order is preserved. Selection is for this brief only, not recorded training completion.",
    ...[...cohorts].sort((a, b) => a.order - b.order).flatMap((cohort, index) => [
      "", `### ${index + 1}. ${cohort.title}`,
      `Participants: ${cohort.employeeIds.map(id => names.get(id) || "Synthetic participant").join(", ")}`,
      `Duration: ${cohort.hours} estimated hours · ${cohort.estimatedWeeks} weeks · planning weeks ${cohort.startWeek}–${cohort.endWeek}`,
      `Prerequisites: ${cohort.prerequisiteSkillIds?.join(", ") || "None listed"}`,
      `Resource: ${cohort.resource?.title || "Not supplied"} · ${cohort.resource?.provider || ""}`,
      `Source: ${cohort.resource?.url || "Not supplied"} · Catalogued: ${cohort.resource?.cataloguedOn || "Date unavailable"}`,
      "Public reading is free; optional costs are excluded. HRD Corp eligibility is not verified.",
    ]),
    "", "## Employee discussion prompts",
    ...people.map(person => `- ${person.alias}: ${person.analysis.matches[0]?.title || "Review role direction"} · match ${person.analysis.matches[0]?.score ?? "unknown"}/100 · ${person.risk.level} exposure proxy · ${person.timelineWeeks} estimated weeks.`),
    "", "## Department SDG mapping",
    "These are mappings across the department's recommended pathways, not measured impact or a claim about this brief's selection.",
    ...(dashboard.sdgs || []).map(item => `- SDG ${item.goal}, target ${item.target}: ${item.count} mapped participants. ${item.contribution || ""} ${item.url || ""}`),
    "", "## Evidence and limitations",
    `Research retrieved: ${dashboard.evidence?.retrievedAt || "Unavailable"} · status: ${dashboard.evidence?.status || "unavailable"}`,
    ...(dashboard.evidence?.sources || []).map(source => `- ${source.title || source.name}: ${source.url} · published ${source.date || source.publishedAt || "date unavailable"} · retrieved ${source.retrievedAt || dashboard.evidence?.retrievedAt || "date unavailable"}`),
    ...(dashboard.simulations || []).map(item => `- Authored simulation: ${item.title} · ${item.date || "date unavailable"} · ${item.url || ""}`),
    dashboard.riskMethodology || "",
    dashboard.disclosure || "",
    "",
  ].join("\n");
}
