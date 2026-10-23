import { randomUUID } from "node:crypto";
import { SKILLS, SKILL_MAP } from "./career_catalog.js";

export class InputError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export function object(value, label = "Request") {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError(`${label} must be an object.`);
  return value;
}
export function text(value, label, max = 500, fallback = "") {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || value.length > max || /[\u0000-\u0008\u000e-\u001f]/.test(value)) throw new InputError(`${label} must be text of at most ${max} characters.`);
  return value.trim();
}
export function strings(value, label, maxItems = 50, maxLength = 200) {
  if (!Array.isArray(value) || value.length > maxItems) throw new InputError(`${label} must be an array of at most ${maxItems} strings.`);
  return [...new Set(value.map(v => text(v, label, maxLength)).filter(Boolean))];
}
export function number(value, label, min, max, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) throw new InputError(`${label} must be a number between ${min} and ${max}.`);
  return value;
}
export function boolean(value, label, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") throw new InputError(`${label} must be true or false.`);
  return value;
}
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function recogniseSkills(value) {
  return SKILLS.flatMap(skill => {
    const term = [...skill.keywords, skill.name].find(word => new RegExp(`(?:^|[^\\p{L}\\p{N}])${escape(word)}(?:$|[^\\p{L}\\p{N}])`, "iu").test(value));
    return term ? [{ skillId: skill.id, matchedTerm: term, method: "keyword_match_requires_review" }] : [];
  });
}

export function normalizeProfile(input) {
  object(input, "Profile");
  const skills = strings(input.skills ?? [], "skills", SKILLS.length, 60);
  const unknown = skills.filter(id => !Object.hasOwn(SKILL_MAP, id));
  if (unknown.length) throw new InputError(`Unknown skill IDs: ${unknown.join(", ")}. See /api/skills.`);
  const tasks = strings(input.tasks ?? [], "tasks", 30, 500);
  const interests = strings(input.interests ?? [], "interests", SKILLS.length, 60);
  if (interests.some(id => !Object.hasOwn(SKILL_MAP, id))) throw new InputError("Interests must use skill IDs from /api/skills.");
  if (!skills.length && !tasks.length) throw new InputError("Include at least one skill or experience task.");
  return {
    id: text(input.id, "Profile ID", 100, randomUUID()), name: text(input.name, "Name", 100, "Career explorer"),
    role: text(input.role, "Current role", 150, "Career explorer"), location: text(input.location, "Location", 150, "Malaysia"),
    years: number(input.years, "Years of experience", 0, 80, 0),
    skills, tasks, interests, goal: text(input.goal, "Goal", 300, "Explore a practical career transition"),
    hoursPerWeek: number(input.hoursPerWeek, "hoursPerWeek", 1, 40, 4),
    reviewed: boolean(input.reviewed, "reviewed"), synthetic: boolean(input.synthetic, "synthetic"),
  };
}

export function parseProfileText(value) {
  const cv = text(value, "CV text", 80000);
  if (cv.length < 30 || cv.startsWith("%PDF-") || /\ufffd/.test(cv)) throw new InputError("Provide at least 30 characters of readable CV text. For scanned documents, paste text or use the form.");
  const lines = cv.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const evidence = recogniseSkills(cv);
  const tasks = lines.filter(line => /^[-•]/.test(line) || /coordinat|prepar|analy[sz]|maintain|diagnos|develop|manag|reconcil|support/i.test(line)).map(line => line.replace(/^[-•]\s*/, "")).filter(line => line.length > 18 && line.length <= 500).slice(0, 12);
  if (!evidence.length && !tasks.length) throw new InputError("No catalog skills or experience tasks recognised. Use the skills form to describe this profile.", 422);
  const name = lines.find(line => line.length < 65 && /^[\p{L} .'-]+$/u.test(line) && !/resume|curriculum|experience|skills|education|profile/i.test(line));
  return {
    profile: normalizeProfile({ name: name || "Career explorer", role: lines.find(line => line.length < 120 && /coordinator|analyst|technician|engineer|manager|graduate|assistant|developer|student/i.test(line)),
      years: Number(cv.match(/\b(\d{1,2})\+?\s*years?\b/i)?.[1] || 0), skills: evidence.map(e => e.skillId), tasks }),
    extraction: { method: "local_keyword_rules", requiresReview: true, skillEvidence: evidence, limitations: "A text mention is not evidence of proficiency. Negations, multilingual CVs and skills outside the catalog need human review." },
    privacy: "CV bytes and text are processed in memory and are not saved or sent to an AI provider.",
  };
}

export async function extractUpload(file) {
  const extension = file.originalname.split(".").pop().toLowerCase();
  if (extension === "txt") return file.buffer.toString("utf8");
  if (extension === "pdf" && file.buffer.subarray(0, 5).toString() === "%PDF-") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: file.buffer });
    try {
      const info = await parser.getInfo();
      if (info.total > 30) throw new InputError("Use a CV of at most 30 pages or paste its text.");
      return (await parser.getText()).text;
    } catch (error) {
      if (error instanceof InputError) throw error;
      throw new InputError("Could not read this PDF. Use a text-searchable PDF, TXT or the skills form.", 422);
    } finally { await parser.destroy(); }
  }
  throw new InputError("Supported uploads: text-searchable PDF and UTF-8 TXT, up to 5 MB. Use the skills form for other formats.", 415);
}
