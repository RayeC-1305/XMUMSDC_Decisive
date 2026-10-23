import { SKILL_MAP } from "../data/careerCatalog";
import { apiRequest, adaptSource } from "./careerApi";

export async function fetchLiveEvidence(signal) {
  const result = await apiRequest("/trends/refresh", { body: {}, signal });
  return { ...result, sources: result.sources.map(adaptSource) };
}

export function signalDate(source) {
  if (source.dateLabel) return source.dateLabel;
  const precision = source.datePrecision;
  return new Date(`${source.date}T00:00:00Z`).toLocaleDateString("en-MY", {
    year: "numeric",
    ...(precision !== "year" ? { month: "long" } : {}),
    ...(!["year", "month"].includes(precision) ? { day: "numeric" } : {}),
    timeZone: "UTC",
  });
}
export const mappingSkillName = id => SKILL_MAP[id]?.name || id;
