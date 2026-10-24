import { WorkforceStore, workforceDashboard, analyseEmployee } from "../services/workforce_service.js";
import path from "node:path";

export function registerWorkforceRoutes(app, evidence, { store = new WorkforceStore({ file: path.resolve("data/workforce/demo.json") }) } = {}) {
  const route = handler => (req, res, next) => Promise.resolve().then(() => handler(req, res)).catch(next);
  app.get("/api/hr/campaigns", route((_req, res) => res.json({ campaigns: store.list(), demoOnly: true })));
  app.post("/api/hr/campaigns", route((req, res) => res.status(201).json(store.create(req.body))));
  app.post("/api/hr/campaigns/:id/update", route((req, res) => res.json(store.update(req.params.id, req.body))));
  app.post("/api/hr/seed", route((_req, res) => res.json(store.seed())));
  app.get("/api/hr/dashboard", route(async (req, res) => res.json(workforceDashboard(store, await evidence.get(), { scenarioId: req.query.scenarioId || "steady", campaignId: req.query.campaignId }))));
  app.post("/api/hr/trends", route(async (req, res) => {
    if (!["refresh", "simulate"].includes(req.body?.action)) return res.status(400).json({ error: "Choose refresh or simulate." });
    if (req.body.action === "simulate") store.toggleSimulation();
    const state = req.body.action === "refresh" ? await evidence.refresh() : await evidence.get();
    store.load();
    res.json({ revision: store.state.revision, evidence: state, simulationActive: store.state.simulationActive });
  }));
  app.get("/api/survey/:token", route((req, res) => res.json(store.publicSurvey(req.params.token))));
  app.post("/api/survey/:token", route(async (req, res) => {
    store.valid(req.params.token);
    const prepared = store.prepareSubmission(req.body);
    const state = await evidence.get();
    const submission = store.submit(req.params.token, prepared);
    const campaign = store.list().find(c => c.id === submission.campaignId);
    const employee = analyseEmployee(submission, campaign, state, "steady", store.simulations());
    res.status(201).json({
      submissionId: submission.id, profile: submission.profile, proficiencies: submission.proficiencies, customSkills: submission.customSkills, analysis: employee.analysis, pathway: employee.pathway,
      campaign: { department: campaign.department, status: campaign.status, currentSubmissions: campaign.currentSubmissions, maxSubmissions: campaign.maxSubmissions },
    });
  }));
  return store;
}
