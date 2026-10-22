/**
 * NexusTalent 360 - Real-Time Tri-Party Synchronization & WebSocket Server
 * XMUM SDC Hackathon 2026 - Domain 1: The Aiversecity Future-Ready Workforce Domain
 */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { fileURLToPath } from "url";
import { runpodClient, MODEL_DISCLOSURE } from "../services/runpod_client.js";
import { cvAgent } from "../services/cv_agent.js";
import { trendSignalAgent } from "../services/trend_agent.js";
import {
  matchWorkerToRoles,
  runCounterfactualFairnessAudit,
  calculateDynamicSkillHalfLife,
  calculateDynamicPersonaTasks,
  calculateDynamicWorkforce,
  calculateDynamicCohort,
  deconstructCVTextToAtomicTasks,
  UNCERTAINTY_SCENARIOS
} from "../services/scoring_engine.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-Memory Synchronized Tri-Party State
let activeInjectedSignals = [];
let hrDemandBroadcasts = [
  {
    id: "HR-BCAST-01",
    timestamp: "2026-10-21T09:30:00+08:00",
    role_id: "ROLE-01",
    role_title: "AI-Augmented Supply Chain & Scope 3 Auditor",
    needed_count: 8,
    location: "Klang Valley & Johor",
    urgency: "Q1 2027 Mandate",
    sdg_targets: ["SDG 8.2", "SDG 12.6", "SDG 13.2"]
  }
];
let endorsedCourses = new Set(["CRS-MY-01", "CRS-MY-02", "CRS-MY-04", "CRS-MY-06", "CRS-MY-08", "CRS-MY-09", "CRS-MY-11", "CRS-MY-14"]);
let activeMacroScenario = "moderate";
let customUploadedPersonas = [];

// Multer memory storage for PDF/CV uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

async function loadDataFile(filename) {
  const filePath = path.join(rootDir, "data", filename);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// Broadcasts updated tri-party state to all connected Socket.io clients
async function broadcastTriPartySync(eventType, eventData = {}) {
  try {
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const personasData = await loadDataFile("synthetic_personas.json");
    const allActive = [...trendsData.baseline_signals, ...activeInjectedSignals];

    const dynamicWorkforce = calculateDynamicWorkforce(
      personasData.sme_workforce,
      allActive,
      activeMacroScenario,
      hrDemandBroadcasts
    );

    const dynamicCohort = calculateDynamicCohort(
      personasData.tvet_graduating_cohort,
      allActive,
      activeMacroScenario,
      hrDemandBroadcasts
    );

    const syncPayload = {
      event_type: eventType,
      event_data: eventData,
      timestamp: new Date().toISOString(),
      active_scenario: activeMacroScenario,
      active_injected_signals: activeInjectedSignals,
      dynamic_workforce: dynamicWorkforce.employees,
      workforce_summary: dynamicWorkforce.summary,
      dynamic_cohort: dynamicCohort,
      endorsed_course_ids: Array.from(endorsedCourses),
      hr_broadcasts: hrDemandBroadcasts,
      connected_clients: io.engine.clientsCount
    };

    io.emit("tri_party_sync", syncPayload);
    return syncPayload;
  } catch (err) {
    console.error("Failed to broadcast tri-party sync:", err);
  }
}

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id} (Total: ${io.engine.clientsCount})`);

  socket.on("request_sync", async () => {
    const syncData = await broadcastTriPartySync("INITIAL_SYNC");
    socket.emit("tri_party_sync", syncData);
  });

  socket.on("disconnect", () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

// 1. Health & AI Model Disclosure
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    app: "NexusTalent 360",
    hackathon: "XMUM SDC Hackathon 2026",
    domain: "Domain 1: Aiversecity Future-Ready Workforce",
    model_disclosure: MODEL_DISCLOSURE,
    websockets: {
      active: true,
      connected_clients: io.engine.clientsCount
    },
    runpod: {
      endpoint: process.env.RUNPOD_ENDPOINT_URL,
      execution_mode: runpodClient.lastExecutionMode,
      latency_ms: runpodClient.lastLatencyMs
    },
    system_timestamp: new Date().toISOString()
  });
});

// 2. Roles & ESCO Atomic Skills
app.get("/api/roles", async (req, res) => {
  try {
    const rolesData = await loadDataFile("esco_atomic_skills_roles.json");
    res.json(rolesData);
  } catch (err) {
    res.status(500).json({ error: "Failed to load roles", details: err.message });
  }
});

// 3. Trend Signals & Active State
app.get("/api/trends", async (req, res) => {
  try {
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const combinedInjectable = [...trendSignalAgent.ingestedSignals, ...trendsData.injectable_signals];
    res.json({
      ...trendsData,
      injectable_signals: combinedInjectable,
      active_injected_signal_ids: activeInjectedSignals.map(s => s.id),
      active_injected_signals: activeInjectedSignals,
      all_active_signals: [...trendsData.baseline_signals, ...activeInjectedSignals]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load trend signals", details: err.message });
  }
});

// 4. Inject Live Market Signal (The Core Demo Hero — The Ripple Effect)
app.post("/api/trends/inject", async (req, res) => {
  try {
    const { signal_id, action = "inject" } = req.body;
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const personasData = await loadDataFile("synthetic_personas.json");

    if (action === "reset") {
      activeInjectedSignals = [];
      const dynamicWorkforce = calculateDynamicWorkforce(personasData.sme_workforce, [], activeMacroScenario, hrDemandBroadcasts);
      const dynamicCohort = calculateDynamicCohort(personasData.tvet_graduating_cohort, [], activeMacroScenario, hrDemandBroadcasts);

      await broadcastTriPartySync("SIGNAL_RESET", { message: "All live signals cleared" });

      return res.json({
        success: true,
        message: "All injected live market signals cleared. Baseline restored.",
        active_injected_signals: [],
        dynamic_workforce: dynamicWorkforce.employees,
        workforce_summary: dynamicWorkforce.summary,
        dynamic_cohort: dynamicCohort
      });
    }

    const candidate = trendsData.injectable_signals.find(s => s.id === signal_id) ||
      trendSignalAgent.ingestedSignals.find(s => s.id === signal_id);
    if (!candidate) {
      return res.status(404).json({ error: `Signal ID ${signal_id} not found among injectable signals.` });
    }

    // Toggle injection
    const existingIndex = activeInjectedSignals.findIndex(s => s.id === signal_id);
    const isAdded = existingIndex < 0;

    if (existingIndex >= 0) {
      activeInjectedSignals.splice(existingIndex, 1);
    } else {
      activeInjectedSignals.push(candidate);
    }

    const allActive = [...trendsData.baseline_signals, ...activeInjectedSignals];
    const dynamicWorkforce = calculateDynamicWorkforce(personasData.sme_workforce, allActive, activeMacroScenario, hrDemandBroadcasts);
    const dynamicCohort = calculateDynamicCohort(personasData.tvet_graduating_cohort, allActive, activeMacroScenario, hrDemandBroadcasts);

    const rippleMsg = isAdded
      ? `Ripple Effect Triggered: "${candidate.title}". Recalculated 8 Green-AI roles, shifted 50 employee risk scores, and synchronized TVET curriculum alerts!`
      : `Signal "${candidate.title}" removed. Dashboards recalibrated to baseline.`;

    await broadcastTriPartySync("SIGNAL_INJECTED", {
      signal_id: candidate.id,
      signal_title: candidate.title,
      is_added: isAdded
    });

    res.json({
      success: true,
      toggled_signal: candidate,
      is_active: isAdded,
      active_injected_signals: activeInjectedSignals,
      dynamic_workforce: dynamicWorkforce.employees,
      workforce_summary: dynamicWorkforce.summary,
      dynamic_cohort: dynamicCohort,
      ripple_message: rippleMsg
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle trend signal", details: err.message });
  }
});

// 4b. Live ML Ingestion from arXiv API / Open Dataset Stream
app.post("/api/trends/fetch-live", async (req, res) => {
  try {
    const newSignal = await trendSignalAgent.fetchLiveOrDatasetSignal();
    const personasData = await loadDataFile("synthetic_personas.json");
    const trendsData = await loadDataFile("trend_signals_oct2026.json");

    // Add to active signals
    const existingIdx = activeInjectedSignals.findIndex(s => s.id === newSignal.id);
    if (existingIdx >= 0) {
      activeInjectedSignals.splice(existingIdx, 1);
    }
    activeInjectedSignals.unshift(newSignal);

    const allActive = [...trendsData.baseline_signals, ...activeInjectedSignals];
    const dynamicWorkforce = calculateDynamicWorkforce(personasData.sme_workforce, allActive, activeMacroScenario, hrDemandBroadcasts);
    const dynamicCohort = calculateDynamicCohort(personasData.tvet_graduating_cohort, allActive, activeMacroScenario, hrDemandBroadcasts);

    const rippleMsg = `ML Agent Ingested: "${newSignal.title}" (${newSignal.source_name}). Recalculated live skill velocities, employee exposure & curriculum risk!`;

    await broadcastTriPartySync("SIGNAL_INJECTED", {
      signal_id: newSignal.id,
      signal_title: newSignal.title,
      is_added: true,
      is_live_ingested: true
    });

    res.json({
      success: true,
      message: rippleMsg,
      signal: newSignal,
      active_injected_signals: activeInjectedSignals,
      dynamic_workforce: dynamicWorkforce.employees,
      workforce_summary: dynamicWorkforce.summary,
      dynamic_cohort: dynamicCohort
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch live trend signal", details: err.message });
  }
});

// 4c. Custom Ingestion Endpoint
app.post("/api/trends/ingest-custom", async (req, res) => {
  try {
    const newSignal = await trendSignalAgent.ingestCustomSignal(req.body);
    const personasData = await loadDataFile("synthetic_personas.json");
    const trendsData = await loadDataFile("trend_signals_oct2026.json");

    activeInjectedSignals.unshift(newSignal);

    const allActive = [...trendsData.baseline_signals, ...activeInjectedSignals];
    const dynamicWorkforce = calculateDynamicWorkforce(personasData.sme_workforce, allActive, activeMacroScenario, hrDemandBroadcasts);
    const dynamicCohort = calculateDynamicCohort(personasData.tvet_graduating_cohort, allActive, activeMacroScenario, hrDemandBroadcasts);

    await broadcastTriPartySync("SIGNAL_INJECTED", {
      signal_id: newSignal.id,
      signal_title: newSignal.title,
      is_added: true,
      is_custom: true
    });

    res.json({
      success: true,
      message: `Custom market trend signal "${newSignal.title}" ingested & broadcasted across all devices.`,
      signal: newSignal,
      active_injected_signals: activeInjectedSignals,
      dynamic_workforce: dynamicWorkforce.employees,
      workforce_summary: dynamicWorkforce.summary,
      dynamic_cohort: dynamicCohort
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to ingest custom signal", details: err.message });
  }
});

// 5. Automated PDF & Document CV Parsing Engine
app.post("/api/parse-cv", upload.single("cv_file"), async (req, res) => {
  try {
    let extractedText = "";

    if (req.file) {
      const mime = req.file.mimetype;
      const fileName = req.file.originalname.toLowerCase();

      if (mime === "application/pdf" || fileName.endsWith(".pdf")) {
        try {
          const parser = new PDFParse({ data: req.file.buffer });
          const pdfRes = await parser.getText();
          extractedText = typeof pdfRes === "string" ? pdfRes : (pdfRes?.text || "");
          await parser.destroy();
        } catch (pdfErr) {
          console.error("PDF Parsing primary error:", pdfErr.message);
          // If the buffer is actually plain text
          const rawStr = req.file.buffer.toString("utf-8");
          if (!rawStr.startsWith("%PDF-")) {
            extractedText = rawStr;
          } else {
            // Attempt secondary extraction from text operators
            const matches = [...rawStr.matchAll(/\(([^)]{3,})\)\s*Tj/g)].map(m => m[1]);
            extractedText = matches.join(" ");
          }
        }
      } else {
        extractedText = req.file.buffer.toString("utf-8");
      }

      // Guard against binary garbage / image-only PDFs
      if (
        !extractedText ||
        extractedText.trim().length < 25 ||
        extractedText.startsWith("%PDF-") ||
        /[\u0000-\u0008\u000E-\u001F]/.test(extractedText.slice(0, 100))
      ) {
        return res.status(400).json({
          error: "Unable to extract readable text from this PDF file. The document may be an image-only scan or encrypted. Please upload a text-searchable PDF or TXT file."
        });
      }
    } else if (req.body.cv_text) {
      extractedText = req.body.cv_text;
    } else {
      return res.status(400).json({ error: "No CV file or text provided." });
    }

    const rolesData = await loadDataFile("esco_atomic_skills_roles.json");
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const allActive = [...trendsData.baseline_signals, ...activeInjectedSignals];

    // Use ML Agent 1 (CVAgent) to deconstruct resume into atomic human & technical capabilities
    const parsedPersona = await cvAgent.analyzeResume(extractedText, rolesData.roles);
    const dynamicPersona = calculateDynamicPersonaTasks(parsedPersona, allActive, activeMacroScenario);

    customUploadedPersonas.unshift(dynamicPersona);

    res.json({
      success: true,
      message: `CV successfully parsed into ${dynamicPersona.atomic_tasks.length} atomic capabilities with live half-life runway scores.`,
      persona: dynamicPersona
    });
  } catch (err) {
    console.error("PDF Parsing error:", err);
    res.status(500).json({ error: "Failed to parse CV document", details: err.message });
  }
});

// 6. Verified Courses
app.get("/api/courses", async (req, res) => {
  try {
    const coursesData = await loadDataFile("verified_courses_my.json");
    const annotatedCourses = coursesData.courses.map(course => ({
      ...course,
      endorsed_by_tvet: endorsedCourses.has(course.course_id)
    }));
    res.json({
      ...coursesData,
      courses: annotatedCourses
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load verified courses", details: err.message });
  }
});

// 7. Personas with Dynamic Live Half-Lives, Workforce & Cohort Recalculation
app.get("/api/personas", async (req, res) => {
  try {
    const personasData = await loadDataFile("synthetic_personas.json");
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const allActive = [...trendsData.baseline_signals, ...activeInjectedSignals];

    const allPersonas = [...customUploadedPersonas, ...personasData.individual_personas];
    const dynamicPersonas = allPersonas.map(p =>
      calculateDynamicPersonaTasks(p, allActive, activeMacroScenario)
    );

    const dynamicWorkforce = calculateDynamicWorkforce(
      personasData.sme_workforce,
      allActive,
      activeMacroScenario,
      hrDemandBroadcasts
    );

    const dynamicCohort = calculateDynamicCohort(
      personasData.tvet_graduating_cohort,
      allActive,
      activeMacroScenario,
      hrDemandBroadcasts
    );

    res.json({
      ...personasData,
      individual_personas: dynamicPersonas,
      sme_workforce: dynamicWorkforce.employees,
      workforce_summary: dynamicWorkforce.summary,
      tvet_graduating_cohort: dynamicCohort
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load synthetic personas", details: err.message });
  }
});

// 8. Explainable Future-Role Matching Engine with Baseline Delta & Green Pivot
app.post("/api/match", async (req, res) => {
  try {
    const {
      worker_tasks,
      worker_skills = [],
      scenario_id = activeMacroScenario || "moderate",
      is_green_pivot = false
    } = req.body;

    const rolesData = await loadDataFile("esco_atomic_skills_roles.json");
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const allActiveSignals = [...trendsData.baseline_signals, ...activeInjectedSignals];

    const regionalDemandBoost = hrDemandBroadcasts.filter(b => b.is_dynamic_broadcast).length;

    const matchResult = await matchWorkerToRoles({
      workerTasks: worker_tasks || [],
      workerSkills: worker_skills,
      roles: rolesData.roles,
      activeSignals: allActiveSignals,
      baselineSignals: trendsData.baseline_signals,
      scenarioId: scenario_id,
      regionalDemandBoost,
      isGreenPivotActive: Boolean(is_green_pivot)
    });

    res.json(matchResult);
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate role match", details: err.message });
  }
});

// 9. Counterfactual Fairness Audit Endpoint
app.post("/api/fairness-audit", async (req, res) => {
  try {
    const { persona_id = "PER-01" } = req.body;
    const personasData = await loadDataFile("synthetic_personas.json");
    const rolesData = await loadDataFile("esco_atomic_skills_roles.json");
    const trendsData = await loadDataFile("trend_signals_oct2026.json");
    const allActiveSignals = [...trendsData.baseline_signals, ...activeInjectedSignals];

    const persona = personasData.individual_personas.find(p => p.persona_id === persona_id) || personasData.individual_personas[0];

    const auditOutput = await runCounterfactualFairnessAudit(
      persona,
      rolesData.roles,
      allActiveSignals
    );

    res.json(auditOutput);
  } catch (err) {
    res.status(500).json({ error: "Failed to run fairness audit", details: err.message });
  }
});

// 10. HR Demand Broadcaster
app.post("/api/hr/broadcast", async (req, res) => {
  try {
    const { role_id, role_title, needed_count = 10, location = "Penang / Kulim", urgency = "Q1 2027 Project" } = req.body;
    const newBroadcast = {
      id: `HR-BCAST-DYN-${Date.now().toString().slice(-4)}`,
      is_dynamic_broadcast: true,
      timestamp: new Date().toISOString(),
      role_id: role_id || "ROLE-02",
      role_title: role_title || "Smart Grid IoT & Edge-AI Technician",
      needed_count: Number(needed_count),
      location,
      urgency,
      sdg_targets: ["SDG 8.2", "SDG 9.4", "SDG 13.1"]
    };

    hrDemandBroadcasts.unshift(newBroadcast);

    await broadcastTriPartySync("HR_DEMAND_BROADCAST", newBroadcast);

    res.json({
      success: true,
      message: `HR demand signal broadcasted for ${newBroadcast.needed_count}x ${newBroadcast.role_title}. Regional demand score incremented across all views!`,
      broadcast: newBroadcast,
      all_broadcasts: hrDemandBroadcasts
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to broadcast HR demand", details: err.message });
  }
});

// 11. TVET Career Advisor 1-Click Course Endorsement
app.post("/api/tvet/endorse", async (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) {
      return res.status(400).json({ error: "course_id is required" });
    }

    if (endorsedCourses.has(course_id)) {
      endorsedCourses.delete(course_id);
    } else {
      endorsedCourses.add(course_id);
    }

    const isEndorsed = endorsedCourses.has(course_id);

    await broadcastTriPartySync("TVET_ENDORSEMENT_TOGGLED", { course_id, is_endorsed: isEndorsed });

    res.json({
      success: true,
      course_id,
      is_endorsed: isEndorsed,
      message: isEndorsed
        ? `Course ${course_id} endorsed by TVET Career Centre! Verified badge now displayed in Worker view.`
        : `Course ${course_id} endorsement unpinned.`
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to endorse course", details: err.message });
  }
});

// 12. Macro Scenario Updater
app.post("/api/scenario", async (req, res) => {
  const { scenario_id } = req.body;
  if (UNCERTAINTY_SCENARIOS[scenario_id]) {
    activeMacroScenario = scenario_id;

    await broadcastTriPartySync("SCENARIO_UPDATED", { scenario_id });

    res.json({
      success: true,
      scenario: UNCERTAINTY_SCENARIOS[scenario_id],
      message: `Scenario updated to: ${UNCERTAINTY_SCENARIOS[scenario_id].label}`
    });
  } else {
    res.status(400).json({ error: "Invalid scenario_id" });
  }
});

const distPath = path.join(rootDir, "dist");
app.use(express.static(distPath));

server.listen(PORT, () => {
  console.log(`[NexusTalent 360] Server running on http://localhost:${PORT}`);
  console.log(`[WebSocket] Socket.IO real-time synchronization online`);
  console.log(`[Domain 1 Disclosure] ${MODEL_DISCLOSURE}`);
});
