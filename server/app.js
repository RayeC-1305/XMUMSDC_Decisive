import express from "express";
import cors from "cors";
import multer from "multer";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { catalog, ROLES, SKILLS, LEARNING, MODEL_VERSION, DISCLOSURE, publicRole, publicSkill } from "../services/career_catalog.js";
import { EvidenceService } from "../services/evidence_service.js";
import { InputError, object, normalizeProfile, parseProfileText, extractUpload } from "../services/profile_intake.js";
import { matchProfile, buildPathway, scenarioFor, normalizeSimulations } from "../services/career_engine.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);

export function createApp({ evidence = new EvidenceService({ cacheFile: path.join(root, "data", "cache", "research.json") }), serveFrontend = true } = {}) {
  const app = express();
  app.disable("x-powered-by");
  const extraOrigins = new Set((process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean));
  app.use(cors({ origin(origin, callback) {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) || extraOrigins.has(origin)) callback(null, true);
    else callback(new InputError("This browser origin is not allowed.", 403));
  }, methods: ["GET", "POST", "OPTIONS"] }));
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "256kb", strict: true }));
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5, fieldSize: 100000 } });

  app.get("/api/health", asyncRoute(async (_req, res) => {
    const state = await evidence.get();
    res.json({ status: "healthy", app: "NexusTalent", apiVersion: 1, modelVersion: MODEL_VERSION, disclosure: DISCLOSURE, evidence: { status: state.status, retrievedAt: state.retrievedAt, sourceCount: state.sources.length, lastError: state.lastError }, privacy: "Stateless profile processing. No CV text or worker profiles are stored.", timestamp: new Date().toISOString() });
  }));
  app.get("/api/catalog", (_req, res) => res.json(catalog()));
  app.get("/api/roles", (_req, res) => res.json({ roles: ROLES.map(publicRole), disclosure: DISCLOSURE }));
  app.get("/api/skills", (_req, res) => res.json({ skills: SKILLS.map(publicSkill) }));
  app.get("/api/courses", (_req, res) => res.json({ resources: Object.entries(LEARNING).map(([skillId, value]) => ({ skillId, ...value })), disclosure: "Curated public reading and practice. No accreditation, current funding or HRD Corp eligibility is asserted." }));
  app.get("/api/scenarios", (_req, res) => res.json({ scenarios: catalog().scenarios, disclosure: DISCLOSURE }));
  app.get("/api/trends", asyncRoute(async (_req, res) => res.json(await evidence.get())));
  app.post(["/api/trends/refresh", "/api/trends/fetch-live"], asyncRoute(async (_req, res) => {
    const state = await evidence.refresh();
    res.status(state.status === "unavailable" ? 503 : 200).json(state);
  }));

  app.post(["/api/intake", "/api/parse-cv"], upload.single("cv_file"), asyncRoute(async (req, res) => {
    const body = object(req.body ?? {});
    if (req.file || body.cv_text !== undefined || body.text !== undefined) {
      const value = req.file ? await extractUpload(req.file) : body.cv_text ?? body.text;
      return res.json({ success: true, ...parseProfileText(value) });
    }
    res.json({ success: true, profile: normalizeProfile(body.profile ?? body), extraction: { method: "structured_form", requiresReview: true }, privacy: "No profile is persisted. Pass the reviewed profile to matching or transition endpoints." });
  }));

  const inputs = body => {
    object(body);
    return { profile: normalizeProfile(body.profile), scenario: scenarioFor(body.scenarioId ?? body.scenario_id) };
  };
  app.post("/api/match", asyncRoute(async (req, res) => {
    const { profile, scenario } = inputs(req.body);
    res.json(matchProfile(profile, await evidence.get(req.body.evidenceRevision), scenario.id, normalizeSimulations(req.body.simulations)));
  }));

  const transition = async (body, full) => {
    const { profile, scenario } = inputs(body);
    const result = matchProfile(profile, await evidence.get(body.evidenceRevision), scenario.id, normalizeSimulations(body.simulations));
    const roleId = body.roleId ?? body.role_id ?? result.matches[0].id;
    const role = result.matches.find(r => r.id === roleId);
    if (!role) throw new InputError("Unknown roleId. Select a role from /api/roles.");
    const pathway = buildPathway(profile, role, { scenarioId: scenario.id, hoursPerWeek: body.hoursPerWeek, completedStepIds: body.completedStepIds });
    const pathways = full ? Object.fromEntries(result.matches.map(match => [match.id, buildPathway(profile, match, { scenarioId: scenario.id, hoursPerWeek: body.hoursPerWeek, completedStepIds: body.completedStepIds })])) : undefined;
    return { success: true, generatedAt: new Date().toISOString(), profile, ...(full ? { ...result, pathways } : { role, disclosure: DISCLOSURE, evidence: result.evidence }), pathway };
  };
  app.post("/api/transition", asyncRoute(async (req, res) => res.json(await transition(req.body, true))));
  app.post("/api/reskilling-pathway", asyncRoute(async (req, res) => res.json(await transition(req.body, false))));

  // Retire shared mutable demo state and unverifiable evidence injection explicitly.
  app.all(["/api/trends/inject", "/api/trends/ingest-custom", "/api/scenario", "/api/hr/broadcast", "/api/tvet/endorse", "/api/fairness-audit", "/api/personas"], (_req, res) => res.status(410).json({ error: "This legacy demo endpoint has been retired. Use /api/catalog, /api/trends/refresh and a per-request scenarioId with /api/transition.", code: "LEGACY_ENDPOINT_RETIRED" }));
  app.use("/api", (_req, res) => res.status(404).json({ error: "API endpoint not found.", code: "NOT_FOUND" }));
  if (serveFrontend && existsSync(path.join(root, "dist", "index.html"))) {
    app.use(express.static(path.join(root, "dist")));
    app.get("*", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
  }
  app.use((_req, res) => res.status(404).json({ error: "Not found.", code: "NOT_FOUND" }));
  app.use((error, _req, res, _next) => {
    const status = error instanceof multer.MulterError ? (error.code === "LIMIT_FILE_SIZE" ? 413 : 400) : error.status || 500;
    const message = error instanceof multer.MulterError ? (error.code === "LIMIT_FILE_SIZE" ? "CV upload exceeds 5 MB." : "Invalid upload. Send one file using the cv_file field.") : status >= 500 ? "The request could not be completed." : error.type === "entity.parse.failed" ? "Request body must be valid JSON." : error.message;
    if (status >= 500) console.error("API error:", error.name, error.message);
    res.status(status).json({ error: message, code: status >= 500 ? "INTERNAL_ERROR" : "INVALID_REQUEST" });
  });
  return { app, evidence };
}
