export function capabilityPriorities(employees = [], skills = []) {
  return skills.map(skill => {
    const cells = employees.map(person => person.heatmap.find(cell => cell.skillId === skill.id)).filter(Boolean);
    return { ...skill, critical: cells.filter(cell => cell.status.includes("Critical") && cell.proficiency > 0).length,
      unknown: employees.length - cells.filter(cell => cell.proficiency > 0).length,
      urgency: cells.reduce((sum, cell) => sum + cell.urgency, 0) / Math.max(1, cells.length) };
  }).sort((a, b) => b.urgency - a.urgency || a.name.localeCompare(b.name));
}

export function reviewFingerprint(dashboard) {
  return JSON.stringify([dashboard?.scenario, dashboard?.simulationActive, dashboard?.evidence?.revision,
    dashboard?.employees?.map(person => [person.id, person.risk.score, person.analysis.matches[0]?.score, person.timelineWeeks])]);
}
