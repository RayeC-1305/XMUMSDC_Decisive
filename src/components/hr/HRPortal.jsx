import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Building2, Check, Clipboard,
  Compass, ExternalLink, Leaf, LoaderCircle, Mail, MessageSquare,
  Radio, RefreshCw, Route, ShieldAlert, ShieldCheck, Sparkles, Users, X,
} from "lucide-react";
import {
  api, dateLabel, HUMAN_NOTICE, InlineError, numberLabel,
  sourceDate, sourceName, statusClass,
  SYNTHETIC_NOTICE,
} from "./hrShared";
import SurveyPage from "./SurveyPage";
import SkillRadar from "./DemoSkillRadar";
import { CohortPlanner, EmployeeReview } from "./WorkforceActions";
import "./hrDemo.css";

const SCENARIOS = [
  { id: "steady", label: "Moderate AI · 3–5 years" },
  { id: "rapid", label: "Fast AI disruption · 1–2 years" },
  { id: "green", label: "Green transition" },
];
const GOALS = [
  "No poverty", "Zero hunger", "Good health and well-being", "Quality education",
  "Gender equality", "Clean water and sanitation", "Affordable and clean energy",
  "Decent work and economic growth", "Industry, innovation and infrastructure",
  "Reduced inequalities", "Sustainable cities and communities",
  "Responsible consumption and production", "Climate action", "Life below water",
  "Life on land", "Peace, justice and strong institutions", "Partnerships for the goals",
];
const expiryChoices = [{ value: "24", label: "24 hours" }, { value: "48", label: "48 hours" }, { value: "168", label: "7 days" }, { value: "", label: "No expiry" }];
const DEMO_STEPS = [
  { id: "setup", label: "Set up", title: "Start with a department", purpose: "Choose a department. Load the fictional sample.", outcome: "A shared starting point." },
  { id: "invite", label: "Invite", title: "Create a safe invitation", purpose: "Set a focus, response limit and expiry. Create or manage a link.", outcome: "A working synthetic survey link." },
  { id: "respond", label: "Respond", title: "Complete the employee reflection", purpose: "Fill the real survey with a fictional profile. Submit to analyse.", outcome: "A live dashboard response." },
  { id: "skills", label: "Understand skills", title: "Read the signals with care", purpose: "Explore the radar, heatmap and employee pathways.", outcome: "Declared skills—not performance." },
  { id: "scenarios", label: "Compare futures", title: "Compare planning assumptions", purpose: "Change a scenario or refresh sources. Inspect what changed.", outcome: "A planning revision—not a forecast." },
  { id: "plan", label: "Learning plan", title: "Turn priorities into learning", purpose: "Review ordered cohorts, resources and estimated time.", outcome: "A plan to review together." },
  { id: "impact", label: "Review together", title: "Review outcomes together", purpose: "Explore SDG mappings, fairness and scenario records.", outcome: "A human-reviewed picture." },
];
const STEP_ICONS = { setup: Building2, invite: Mail, respond: MessageSquare, skills: Radio, scenarios: Compass, plan: Route, impact: Leaf };
const toInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const readDemoPreference = (key) => {
  try { return window.sessionStorage.getItem(`nexus-hr-demo-${key}`) || ""; }
  catch { return ""; }
};

function Metric({ label, value, note }) {
  return <div className="hr-metric"><small>{label}</small><strong>{value}</strong><span>{note}</span></div>;
}

function PlanningGuide({ icon: Icon, title, children }) {
  return <aside className="hr-demo-guide"><Icon size={28} aria-hidden="true" /><h3>{title}</h3>{children}</aside>;
}

function useDialogAccessibility(open, close) {
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return;
    const focusable = () => [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], summary, [tabindex="0"]')].filter(el => el.getClientRects().length);
    focusable()[0]?.focus();
    const keydown = event => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open]);
}

function CampaignCard({ campaign, onCopy, onManage, busy }) {
  const cap = Math.max(1, toInt(campaign.maxSubmissions, 1));
  const used = toInt(campaign.currentSubmissions);
  return <article className="hr-campaign">
    <div className="hr-campaign-top">
      <div><h3>{campaign.department}</h3><p>{campaign.focus}</p></div>
      <span className={`hr-status ${statusClass(campaign.status)}`}>{campaign.status}</span>
    </div>
    <div className="hr-progress" role="progressbar" aria-label={`${used} of ${cap} submissions`} aria-valuemin="0" aria-valuemax={cap} aria-valuenow={used}>
      <i style={{ width: `${Math.min(100, (used / cap) * 100)}%` }} />
    </div>
    <div className="hr-campaign-meta">
      <span>{used} / {cap} responses</span>
      <span>{campaign.expiresAt ? `Closes ${dateLabel(campaign.expiresAt)}` : "No expiry"}</span>
    </div>
    <div className="hr-campaign-actions">
      <button type="button" onClick={() => onCopy(campaign)} disabled={busy}><Clipboard size={13} /> Copy survey link</button>
      <button type="button" onClick={() => onManage(campaign)} disabled={busy}><Activity size={13} /> Manage</button>
    </div>
  </article>;
}

function RoleBreakdown({ role }) {
  const components = role.components || [];
  const gaps = role.gaps || [];
  return <article className="hr-role-card">
    <div className="hr-role-title"><strong>{role.title || role.name || "Role pathway"}</strong><b>{Math.round(Number(role.score) || 0)} pts</b></div>
    {components.map((item) => <div className="hr-component" key={item.id || item.label}>
      <span title={item.explanation}>{item.label}</span><div className="hr-component-track"><i style={{ width: `${Math.max(0, Math.min(100, Number(item.value) || 0))}%` }} /></div>
      <span title={`${item.explanation} Weight ${item.weight * 100}%. Contribution ${item.points} points.`}>{item.points} pts</span>
    </div>)}
    {gaps.length > 0 && <div className="hr-gap-chips" aria-label="Role skill gaps">{gaps.slice(0, 8).map((gap) => <span key={gap.id}>{gap.name || gap.id}</span>)}</div>}
  </article>;
}

function EmployeeDetails({ employee, skills, onClose }) {
  if (!employee) return null;
  const analysis = employee.analysis || {};
  const proficiencies = employee.proficiencies || {};
  const radarSkills = [...new Set([...(analysis.matches?.[0]?.skills || []), ...Object.keys(proficiencies)])].slice(0, 8).map(id => skills.find(skill => skill.id === id)).filter(Boolean);
  const ranked = (analysis.matches || []).slice(0, 3);
  const path = employee.pathway || {};
  const steps = path.steps || employee.pathway?.path || [];
  const evidence = analysis.evidence?.sources || [];
  return <div className="hr-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="hr-modal" role="dialog" aria-modal="true" aria-labelledby="employee-detail-title">
      <div className="hr-modal-head"><div><span className="hr-eyebrow">Employee planning profile</span><h2 id="employee-detail-title">{employee.alias || "Synthetic employee"}</h2></div><button className="hr-close" aria-label="Close employee detail" onClick={onClose}><X size={18} /></button></div>
      <div className="hr-employee-layout">
        <div className="hr-employee-summary">
          <h3>{employee.profile?.role || "Role not provided"}</h3>
          <p>{employee.department} · Submitted {dateLabel(employee.submittedAt)}</p>
          <SkillRadar skills={radarSkills} values={proficiencies} targetValues={Object.fromEntries((analysis.matches?.[0]?.skills || []).map(id => [id, 4]))} label="Synthetic employee declared skill proficiencies and future-role review targets" />
          <p>Blue: declared proficiency. Dashed: authored proficiency-4 review target for the top role, not a validated employer requirement. 0 = unknown.</p>
          <div className="hr-detail-list">
            <div className="hr-detail-row"><strong>Planning proxy · {employee.risk?.level || "Not scored"}{employee.risk?.score != null ? ` · ${employee.risk.score}` : ""}</strong><p>{employee.risk?.explanation || "No risk explanation was returned."} This is not a job-loss probability.</p></div>
            <div className="hr-detail-row"><strong>Declared skills</strong><p>{(employee.profile?.skills || []).map((skillId) => skills.find((item) => item.id === skillId)?.name || skillId).join(", ") || "None declared"}</p></div>
            {employee.customSkills?.length > 0 && <div className="hr-detail-row"><strong>Custom skills · for human review</strong><p>{employee.customSkills.join(", ")}</p></div>}
            <div className="hr-detail-row"><strong>Planning effort</strong><p>{numberLabel(path.totalHours)} estimated hours · {numberLabel(employee.timelineWeeks || path.estimatedWeeks)} weeks at {numberLabel(path.hoursPerWeek || employee.profile?.hoursPerWeek)} hours per week</p></div>
          </div>
        </div>
        <div>
          <div className="hr-panel-head"><div><h2>Ranked role pathways</h2><p>Illustrative roles, not vacancies. Scores are component estimates.</p></div></div>
          {ranked.length ? ranked.map((role) => <RoleBreakdown key={role.id || role.title} role={role} />) : <div className="hr-empty"><strong>No role matches returned</strong><p>The analysis did not include ranked pathways for this profile.</p></div>}
          <div className="hr-panel-head" style={{ margin: "18px 0 8px" }}><div><h2>Ordered learning pathway</h2><p>Prerequisites are kept ahead of dependent skills.</p></div></div>
          {steps.length ? <div className="hr-pathway">{steps.map((step, index) => <article className="hr-step" key={step.id || `${step.title}-${index}`}>
            <div><strong>{step.title || step.name || "Learning step"}</strong><p>{step.resource?.provider || step.resource?.name || "Public learning material"}{step.rationale ? ` · ${step.rationale}` : ""}</p>
              {step.resource?.url && <p><a href={step.resource.url} target="_blank" rel="noreferrer" style={{ color: "var(--hr-indigo-dark)" }}>{step.resource.title || "Open course or reading"} <ExternalLink size={11} /></a></p>}
            </div><small>{numberLabel(step.hours)} h · {(step.cataloguedOn || step.resource?.cataloguedOn) ? `Catalogued ${dateLabel(step.cataloguedOn || step.resource.cataloguedOn)}` : "Catalog date not supplied"}</small>
          </article>)}</div> : <div className="hr-empty"><strong>No learning steps returned</strong><p>Pathway details are not available for this profile yet.</p></div>}
          <p style={{ marginTop: 20 }}>Public reading is curated, not verified as HRD-claimable. Check eligibility independently.</p>
          {evidence.length > 0 && <div className="hr-panel" style={{ marginTop: 24 }}><h3>Analysis citations</h3>{evidence.slice(0, 4).map((item, index) => <p key={item.id || index} style={{ marginTop: 12 }}>{item.title || item.name} · {sourceName(item)} · {sourceDate(item) || "Date unavailable"}</p>)}</div>}
          {analysis.disclosure && <p style={{ marginTop: 20 }}>{analysis.disclosure}</p>}
        </div>
      </div>
    </section>
  </div>;
}

function ManageCampaign({ campaign, onClose, onSave, busy }) {
  const [hours, setHours] = useState("48");
  const [quota, setQuota] = useState(String(Math.max(1, toInt(campaign.maxSubmissions, 1))));
  const [error, setError] = useState("");
  const submit = async (action) => {
    setError("");
    const maxSubmissions = Number(quota);
    if (action === "extend" && (!Number.isInteger(maxSubmissions) || maxSubmissions < 1 || maxSubmissions > 500)) {
      setError("Quota must be a whole number between 1 and 500.");
      return;
    }
    try { await onSave(campaign, { action, expirationHours: hours ? Number(hours) : null, ...(action === "extend" ? { maxSubmissions } : {}) }); }
    catch (failure) { setError(failure.message || "This campaign could not be updated."); }
  };
  return <div className="hr-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="hr-modal" role="dialog" aria-modal="true" aria-labelledby="manage-title">
      <div className="hr-modal-head"><div><span className="hr-eyebrow">Survey link controls</span><h2 id="manage-title">{campaign.department}</h2></div><button className="hr-close" aria-label="Close management" onClick={onClose}><X size={18} /></button></div>
      <p style={{ marginBottom: 24 }}>{campaign.focus} · Current status: <strong>{campaign.status}</strong></p>
      <div className="hr-controls">
        <div className="hr-field"><label htmlFor="hr-extend-hours">New link duration</label><select id="hr-extend-hours" value={hours} onChange={(event) => setHours(event.target.value)}>{expiryChoices.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}</select></div>
        <div className="hr-field"><label htmlFor="hr-new-quota">Submission limit (1–500)</label><input id="hr-new-quota" type="number" min="1" max="500" value={quota} onChange={(event) => setQuota(event.target.value)} /></div>
      </div>
      <p style={{ margin: "4px 0 24px" }}>Extending reopens a revoked or expired link. Increase the limit to reopen a quota-reached campaign.</p>
      {error && <InlineError>{error}</InlineError>}
      <div className="hr-actions">
        <button className="hr-btn" type="button" disabled={busy} onClick={() => submit("extend")}>{busy ? <LoaderCircle size={15} /> : <RefreshCw size={15} />} Extend / update quota</button>
        <button className="hr-btn danger" type="button" disabled={busy || campaign.revoked || campaign.status === "Revoked"} onClick={() => submit("revoke")}><ShieldAlert size={15} /> Revoke link</button>
      </div>
    </section>
  </div>;
}

export default function HRPortal() {
  const stepFromHash = () => DEMO_STEPS.some((step) => step.id === window.location.hash.slice(1))
    ? window.location.hash.slice(1)
    : "setup";
  const [activeStep, setActiveStep] = useState(stepFromHash);
  const [selectedSurveyCampaignId, setSelectedSurveyCampaignId] = useState(() => readDemoPreference("campaign"));
  const [catalog, setCatalog] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [scenario, setScenario] = useState(() => ["steady", "rapid", "green"].includes(readDemoPreference("scenario")) ? readDemoPreference("scenario") : "steady");
  const [campaignFilter, setCampaignFilter] = useState(() => readDemoPreference("scope"));
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [skillView, setSkillView] = useState("radar");
  const [manageCampaign, setManageCampaign] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [department, setDepartment] = useState(() => readDemoPreference("department"));
  const [focus, setFocus] = useState("");
  const [quota, setQuota] = useState("30");
  const [expiry, setExpiry] = useState("168");
  const [loading, setLoading] = useState(true);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [trendBusy, setTrendBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const requestVersion = useRef(0);
  const dashboardRef = useRef(dashboard);
  const stepHeadingRef = useRef(null);
  const stepHasMounted = useRef(false);
  dashboardRef.current = dashboard;

  useEffect(() => {
    const syncStep = () => setActiveStep(stepFromHash());
    window.addEventListener("hashchange", syncStep);
    window.addEventListener("popstate", syncStep);
    return () => {
      window.removeEventListener("hashchange", syncStep);
      window.removeEventListener("popstate", syncStep);
    };
  }, []);
  useEffect(() => {
    if (stepHasMounted.current) {
      stepHeadingRef.current?.focus({ preventScroll: true });
    }
    stepHasMounted.current = true;
  }, [activeStep]);

  function goToStep(id) {
    if (!DEMO_STEPS.some((step) => step.id === id)) return;
    window.location.hash = id;
  }

  const loadCampaigns = useCallback(async () => {
    setCampaignLoading(true);
    try {
      const data = await api("/api/hr/campaigns");
      setCampaigns(data.campaigns || []);
      setError("");
    } catch (failure) { setError(failure.message || "Campaign links could not be loaded."); }
    finally { setCampaignLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [cat] = await Promise.all([api("/api/catalog")]);
        if (!active) return;
        setCatalog(cat);
        const departments = [...new Set((cat.sampleProfiles || []).map((profile) => profile.department).filter(Boolean))];
        setDepartment((current) => current || departments[0] || "");
        await loadCampaigns();
      } catch (failure) { if (active) setError(failure.message || "The HR workspace could not be loaded."); }
    })();
    return () => { active = false; };
  }, [loadCampaigns]);

  useDialogAccessibility(Boolean(formOpen || selectedEmployee || manageCampaign), () => {
    setFormOpen(false); setSelectedEmployee(null); setManageCampaign(null);
  });

  const refreshDashboard = useCallback(async (showSkeleton = false) => {
    const version = ++requestVersion.current;
    if (showSkeleton && !dashboardRef.current) setLoading(true);
    const query = new URLSearchParams({ scenarioId: scenario });
    if (campaignFilter) query.set("campaignId", campaignFilter);
    try {
      const data = await api(`/api/hr/dashboard?${query.toString()}`);
      if (version !== requestVersion.current) return;
      setDashboard(data);
      setCampaigns(data.campaigns);
      setError("");
    } catch (failure) {
      if (version === requestVersion.current) setError(failure.message || "Workforce analysis could not be refreshed.");
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [scenario, campaignFilter]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const version = ++requestVersion.current;
      if (!dashboardRef.current) setLoading(true);
      const query = new URLSearchParams({ scenarioId: scenario });
      if (campaignFilter) query.set("campaignId", campaignFilter);
      try {
        const data = await api(`/api/hr/dashboard?${query.toString()}`);
        if (active && version === requestVersion.current) { setDashboard(data); setCampaigns(data.campaigns); setError(""); }
      } catch (failure) {
        if (active && version === requestVersion.current) setError(failure.message || "Workforce analysis could not be refreshed.");
      } finally { if (active && version === requestVersion.current) setLoading(false); }
    };
    load();
    const interval = window.setInterval(load, 5000);
    return () => { active = false; window.clearInterval(interval); };
  }, [scenario, campaignFilter]);

  const skillList = dashboard?.skills || catalog?.skills || [];
  const employees = dashboard?.employees || [];
  const summary = dashboard?.summary || {};
  const departments = useMemo(() => [...new Set([
    ...(catalog?.sampleProfiles || []).map((profile) => profile.department),
    ...campaigns.map((campaign) => campaign.department),
  ].filter(Boolean))], [catalog, campaigns]);
  const heatmapRows = useMemo(() => {
    const map = new Map();
    for (const person of employees) {
      for (const cell of person.heatmap || []) {
        const id = cell.skillId || cell.id;
        if (!map.has(id)) map.set(id, { name: cell.name || skillList.find((skill) => skill.id === id)?.name || id, values: [] });
        map.get(id).values.push({ person, cell });
      }
    }
    return [...map.entries()].map(([id, row]) => ({ id, ...row })).slice(0, 18);
  }, [employees, skillList]);
  const sdgRecords = dashboard?.sdgs || [];
  const sdgByNumber = useMemo(() => {
    const records = new Map();
    sdgRecords.forEach((record) => {
      const match = String(record.goal || "").match(/\d+/);
      if (match) {
        const goal = Number(match[0]);
        records.set(goal, [...(records.get(goal) || []), record]);
      }
    });
    return records;
  }, [sdgRecords]);
  const sources = dashboard?.evidence?.sources || [];
  const campaignLimit = Math.min(500, Math.max(1, Number(quota) || 1));
  const activeCampaign = campaigns.find((item) => item.id === selectedSurveyCampaignId)
    || campaigns.find((item) => item.status === "Active")
    || campaigns[0];
  const currentStepIndex = DEMO_STEPS.findIndex((step) => step.id === activeStep);
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  useEffect(() => {
    if (campaigns.length && (!selectedSurveyCampaignId || !campaigns.some((item) => item.id === selectedSurveyCampaignId))) {
      const best = campaigns.find((item) => item.status === "Active") || campaigns[0];
      setSelectedSurveyCampaignId(best.id);
      setCampaignFilter(best.id);
      setDepartment(best.department);
    }
  }, [campaigns, selectedSurveyCampaignId]);
  useEffect(() => {
    try {
      if (selectedSurveyCampaignId) window.sessionStorage.setItem("nexus-hr-demo-campaign", selectedSurveyCampaignId);
      window.sessionStorage.setItem("nexus-hr-demo-scope", campaignFilter);
      window.sessionStorage.setItem("nexus-hr-demo-scenario", scenario);
      if (department) window.sessionStorage.setItem("nexus-hr-demo-department", department);
    } catch {}
  }, [selectedSurveyCampaignId, scenario, department, campaignFilter]);

  function selectScope(id) {
    setCampaignFilter(id);
    const selected = campaigns.find(campaign => campaign.id === id);
    if (selected) {
      setSelectedSurveyCampaignId(id);
      setDepartment(selected.department);
    }
  }

  async function createCampaign(event) {
    event.preventDefault();
    setActionBusy(true); setError(""); setNotice("");
    try {
      const created = await api("/api/hr/campaigns", { method: "POST", body: JSON.stringify({
        department, focus: focus.trim(), maxSubmissions: campaignLimit,
        expirationHours: expiry ? Number(expiry) : null,
      }) });
      setCampaigns((items) => [created, ...items.filter((item) => item.id !== created.id)]);
      setSelectedSurveyCampaignId(created.id);
      setCampaignFilter(created.id);
      setFocus(""); setFormOpen(false); setNotice("Survey link created. Share it with employees using synthetic profiles only.");
      await refreshDashboard();
    } catch (failure) { setError(failure.message || "The survey link could not be created."); }
    finally { setActionBusy(false); }
  }
  async function updateCampaign(campaign, body) {
    setActionBusy(true);
    try {
      const updated = await api(`/api/hr/campaigns/${encodeURIComponent(campaign.id)}/update`, { method: "POST", body: JSON.stringify(body) });
      setCampaigns((items) => items.map((item) => item.id === updated.id ? updated : item));
      setManageCampaign(null); setNotice(body.action === "revoke" ? "The survey link has been revoked." : "Campaign link extended and quota updated.");
      await refreshDashboard();
    } finally { setActionBusy(false); }
  }
  async function copyCampaign(campaign) {
    const url = `${window.location.origin}/survey/${encodeURIComponent(campaign.token)}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setNotice("Survey link copied. It is ready to share with synthetic participants.");
      } else throw new Error("Clipboard unavailable");
    } catch {
      const field = document.createElement("textarea");
      field.value = url; field.setAttribute("readonly", ""); field.style.position = "fixed"; field.style.opacity = "0";
      document.body.appendChild(field); field.select();
      const copied = document.execCommand("copy"); field.remove();
      setNotice(copied ? "Survey link copied." : `Copy this survey link: ${url}`);
    }
  }
  async function trends(action) {
    setTrendBusy(action); setError(""); setNotice("");
    try {
      const result = await api("/api/hr/trends", { method: "POST", body: JSON.stringify({ action }) });
      setNotice(action === "simulate"
        ? `Scenario simulation ${result.simulationActive ? "applied" : "cleared"}. Authored weights changed; no real labour-market signal was created. Dashboard replanned at revision ${result.revision}.`
        : `Research feed checked. Dashboard replanned at revision ${result.revision}. Retrieved source metadata is not a job forecast.`);
      await refreshDashboard();
    } catch (failure) { setError(failure.message || "The planning inputs could not be updated."); }
    finally { setTrendBusy(""); }
  }
  async function seedDemo() {
    setActionBusy(true); setError("");
    try {
      await api("/api/hr/seed", { method: "POST", body: JSON.stringify({}) });
      setNotice("Synthetic demo workspace refreshed. Existing seed data is safe to load again.");
      await loadCampaigns(); await refreshDashboard();
    } catch (failure) { setError(failure.message || "Synthetic demo data could not be loaded."); }
    finally { setActionBusy(false); }
  }

  return <div className="hr-app hr-demo" data-step={activeStep} data-skill-view={skillView}>
    <header className="hr-topbar">
      <a href="/hr" className="hr-brand" aria-label="NexusTalent employer introduction">
        <span className="hr-brand-mark">N</span><span>NexusTalent<small>People & capability planning</small></span>
      </a>
      <nav className="hr-top-actions" aria-label="Workspace navigation">
        <a href="/"><ArrowLeft size={15} /> Worker</a>
        <a href="/hr" aria-current="page">Introduction</a>
      </nav>
    </header>
    <main className="hr-main">
      <div className="hr-heading">
        <div><span className="hr-eyebrow"><Activity size={14} /> Guided employer demo / {String(currentStepIndex + 1).padStart(2, "0")} of 07</span>
          <h1 ref={stepHeadingRef} tabIndex={-1} aria-live="polite">{currentStep.title}</h1>
          <p>{currentStep.purpose} Your choices stay with you as you move through the workspace.</p>
        </div>
        <div className="hr-scenario" role="group" aria-label="Planning scenario">
          {SCENARIOS.map((item) => <button key={item.id} type="button" aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); setNotice(`${item.label} planning view selected. Scenario weights are assumptions, not a forecast.`); }}>{item.label}</button>)}
        </div>
      </div>
      <div className="hr-demo-safety">
        <div className="hr-notice warning hr-demo-synthetic" role="note"><ShieldAlert size={16} /><div><strong>{SYNTHETIC_NOTICE}</strong><span>Public prototype · not production-secured</span></div></div>
        <details className="hr-demo-disclosures">
          <summary><ShieldAlert size={14} /> Model &amp; review boundaries</summary>
          <div>
            <p><strong>{HUMAN_NOTICE}</strong></p>
            <p><strong>Model and grounding:</strong> {dashboard?.modelVersion || "nexus-rules-1.0"} — explainable rules, no LLM or generative model. 45% declared required skills + 30% transferable strengths + 25% research/scenario context. Courses come only from the cited curated catalog. Scenario horizons and learning times are estimates, not validated forecasts.</p>
            <p><strong>Planning proxy, not a job-loss probability.</strong> No demographic inputs are collected. Risk labels summarize skill-transition planning signals only. Research metadata is not observed hiring demand.</p>
          </div>
        </details>
      </div>
      <InlineError onRetry={() => { loadCampaigns(); refreshDashboard(true); }}>{error}</InlineError>
      {notice && <div className="hr-success" role="status">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice("")} style={{ float: "right", background: "transparent", border: 0, color: "inherit" }}><X size={14} /></button></div>}

      <section className="hr-demo-stepper" aria-label="Guided demo progress">
        <div className="hr-demo-stepper-head">
          <div><span className="hr-eyebrow">STEP {String(currentStepIndex + 1).padStart(2, "0")} / 07</span><h2>Your planning journey</h2></div>
          <div className="hr-demo-step-controls">
            <button className="hr-btn secondary" type="button" disabled={currentStepIndex === 0} onClick={() => goToStep(DEMO_STEPS[currentStepIndex - 1]?.id)}>Previous</button>
            <span className="hr-demo-count">{String(currentStepIndex + 1).padStart(2, "0")} <i>/</i> 07</span>
            <button className="hr-btn" type="button" disabled={currentStepIndex === DEMO_STEPS.length - 1} onClick={() => goToStep(DEMO_STEPS[currentStepIndex + 1]?.id)}>Next <ArrowRight size={14} /></button>
          </div>
        </div>
        <nav className="hr-demo-step-nav" aria-label="Demo steps">
          {DEMO_STEPS.map((step, index) => {
            const StepIcon = STEP_ICONS[step.id];
            return <button key={step.id} type="button" aria-label={`Step ${index + 1}: ${step.label}`} aria-current={step.id === activeStep ? "step" : undefined} onClick={() => goToStep(step.id)}><span>{String(index + 1).padStart(2, "0")}</span><StepIcon size={17} aria-hidden="true" /><span>{step.label}</span></button>;
          })}
        </nav>
        <div className="hr-demo-progress" role="progressbar" aria-label="Demo progress" aria-valuemin="1" aria-valuemax="7" aria-valuenow={currentStepIndex + 1}><i style={{ width: `${((currentStepIndex + 1) / DEMO_STEPS.length) * 100}%` }} /></div>
        <div className="hr-demo-taskline"><span>TRY THIS</span><p>{currentStep.purpose}</p><small><b>OUTCOME</b> {currentStep.outcome}</small></div>
      </section>

      <section className="hr-demo-page hr-demo-setup" data-demo-slide="setup" aria-labelledby="hr-setup-title">
        <div className="hr-demo-two-column">
        <div className="hr-panel">
        <div className="hr-panel-head"><div><span className="hr-eyebrow">01 / Set up</span><h2 id="hr-setup-title"><Building2 aria-hidden="true" />Choose a department to explore</h2><p>Select a seeded department. Reloading the sample is safe to repeat.</p></div></div>
        <div className="hr-demo-setup-grid">
          <div className="hr-field"><label htmlFor="hr-demo-department">Department</label><select id="hr-demo-department" value={department} onChange={(event) => selectScope(campaigns.find(campaign => campaign.department === event.target.value)?.id || "")}>{departments.length ? departments.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Loading seeded departments…</option>}</select><small>This department stays selected for invitations, responses and planning.</small></div>
          <div className="hr-demo-seed-note"><span className="hr-status active">SYNTHETIC SAMPLE</span><p>Three departments · eight fictional profiles each.</p></div>
        </div>
        <div className="hr-actions"><button className="hr-btn" type="button" disabled={actionBusy} onClick={seedDemo}>{actionBusy ? <LoaderCircle size={15} /> : <RefreshCw size={15} />} Load synthetic demo set</button><button className="hr-btn secondary" type="button" onClick={() => goToStep("invite")}>Continue to invitation <ArrowRight size={14} /></button></div>
        </div>
        <PlanningGuide icon={Users} title="A shared starting point">
          <p>The same career-planning approach, now viewed across a department. Start with fictional people, not a performance score.</p>
          <ol><li>Choose the department you want to explore.</li><li>Load the sample if you need a fresh starting point.</li><li>Continue to manage its invitation links.</li></ol>
        </PlanningGuide>
        </div>
      </section>

      <div className="hr-grid">
        <div>
          <section className="hr-demo-page" data-demo-slide="invite">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">02 / Link management</span><h2><Mail aria-hidden="true" />Survey campaigns</h2><p>Create a synthetic survey link. Copy, extend or revoke it anytime.</p></div>
              <button className="hr-btn" type="button" onClick={() => setFormOpen(true)}><Users size={15} /> New campaign</button>
            </div>
            <div className="hr-panel hr-demo-scope-card"><div className="hr-controls">
              <div className="hr-field"><label htmlFor="hr-department-filter">Department scope</label>
                <select id="hr-department-filter" value={campaignFilter} onChange={(event) => selectScope(event.target.value)}>
                  <option value="">All departments</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.department} · {campaign.focus}</option>)}
                </select>
              </div>
              <div className="hr-field"><label htmlFor="hr-refresh">Data status</label><div id="hr-refresh" style={{ minHeight: 44, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, color: "var(--hr-muted)" }}><span className="hr-status active">Live · 5 sec</span>Updated {dateLabel(dashboard?.generatedAt, true)}</div></div>
            </div></div>
            {campaignLoading && !campaigns.length ? <div className="hr-skeleton" aria-label="Loading campaigns" /> :
              campaigns.length ? <div className="hr-campaign-list">{campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} onCopy={copyCampaign} onManage={setManageCampaign} busy={actionBusy} />)}</div> :
                <div className="hr-empty"><strong>No campaigns yet</strong><p>Create a link when you are ready to invite synthetic participants.</p></div>}
            <div className="hr-demo-library">
              <div><strong>Need a sample to explore?</strong><p className="hr-panel-kicker">Repeatable seed · 3 departments × 8 synthetic profiles</p></div>
              <button className="hr-btn secondary" type="button" disabled={actionBusy} onClick={seedDemo}><RefreshCw size={14} /> Load synthetic demo set</button>
            </div>
          </section>

          <section className="hr-demo-page hr-demo-response" data-demo-slide="respond">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">03 / Employee response</span><h2><MessageSquare aria-hidden="true" />Try the real synthetic survey</h2><p>Submit a fictional profile. Its planning map appears here.</p></div></div>
            {campaigns.length > 0 && <div className="hr-controls hr-demo-campaign-select">
              <div className="hr-field"><label htmlFor="hr-response-campaign">Campaign for this response</label>
                <select id="hr-response-campaign" value={activeCampaign?.id || ""} onChange={(event) => selectScope(event.target.value)}>
                  {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.department} · {campaign.focus || "Skills reflection"} · {campaign.status}</option>)}
                </select>
              </div>
              {activeCampaign?.token && <a className="hr-btn secondary" href={`/survey/${encodeURIComponent(activeCampaign.token)}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open public survey</a>}
            </div>}
            {!activeCampaign?.token ? <div className="hr-empty"><strong>Create a campaign first</strong><p>The actual employee survey uses a campaign token. Return to Invite to create a real synthetic-only link.</p><button className="hr-btn" type="button" onClick={() => goToStep("invite")}>Go to invitations <ArrowRight size={14} /></button></div> :
              <SurveyPage key={activeCampaign.token} token={activeCampaign.token} embedded onSubmitted={() => refreshDashboard()} />}
          </section>

          <section className="hr-panel hr-demo-skill-nav" data-demo-slide="skills" aria-label="Skill planning views">
            <span className="hr-eyebrow">04 / Skills &amp; people</span>
            <div role="group" aria-label="Choose a skill planning view">
              {[["radar", "Skills radar"], ["heatmap", "Capability map"], ["people", "Employee review"]].map(([id, label]) => <button key={id} type="button" aria-pressed={skillView === id} onClick={() => setSkillView(id)}>{label}</button>)}
            </div>
          </section>

          <section className="hr-panel" data-demo-slide="skills" data-demo-view="radar" role="region" aria-label="Skills radar view">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">Department outlook</span><h2><Radio aria-hidden="true" />Future Skills Radar</h2><p>Average declared proficiency, 0–5. Missing means unknown, not inability.</p></div></div>
            {employees.length > 0 ? <>
              <div className="hr-demo-radar-layout"><div>
              <SkillRadar skills={skillList.slice(0, 8)} values={Object.fromEntries(skillList.map(skill => [skill.id, employees.reduce((sum, person) => sum + (person.proficiencies[skill.id] || 0), 0) / employees.length]))} label="Department Future Skills Radar: average declared proficiency across scenario-priority skills" />
              </div><div><h3>What deserves a conversation?</h3><p>Read the declared coverage alongside each skill’s scenario priority. A higher priority is a planning assumption, not a judgment about a person.</p><div className="hr-gap-chips">{skillList.slice(0, 8).map(skill => <span key={skill.id}>{skill.name}: {skill.direction} · {skill.weight}× priority</span>)}</div></div></div>
            </> : <p>Survey responses will populate the department radar.</p>}
          </section>

          <section className="hr-panel" data-demo-slide="skills" data-demo-view="heatmap" role="region" aria-label="Capability heatmap view">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">Skill signals</span><h2><Activity aria-hidden="true" />Capability heatmap</h2><p>Declared proficiency and planning urgency by person. A declining weight is not employee performance.</p></div><span className="hr-panel-kicker">{employees.length} profiles</span></div>
            {loading && !dashboard ? <div className="hr-skeleton" /> : heatmapRows.length ? <>
              <div className="hr-heatmap-scroll" role="region" aria-label="Scrollable workforce capability heatmap" tabIndex="0">
                <table className="hr-heatmap"><thead><tr><th scope="col">Skill / trend</th>{employees.map((person) => <th scope="col" key={person.id}>{person.alias || "Synthetic"}</th>)}</tr></thead>
                  <tbody>{heatmapRows.map((row) => <tr key={row.id}><td>{row.name}<small style={{ display: "block" }}>{skillList.find(skill => skill.id === row.id)?.direction} · {skillList.find(skill => skill.id === row.id)?.weight}× priority</small></td>{employees.map((person) => {
                    const entry = (person.heatmap || []).find((cell) => (cell.skillId || cell.id) === row.id);
                    const state = String(entry?.status || "").toLowerCase();
                    const kind = state.includes("critical") ? "critical" : state.includes("moderate") ? "moderate" : state.includes("declin") ? "declining" : state.includes("strong") ? "strong" : "";
                    return <td key={`${row.id}-${person.id}`}><span className={`hr-cell ${kind}`} title={`${row.name}: ${entry?.status || "No status"} · urgency ${entry?.urgency} · ${entry?.direction}`} aria-label={`${person.alias}, ${row.name}: ${entry?.status}, proficiency ${entry?.proficiency}, urgency ${entry?.urgency}`}>{entry?.proficiency ?? "—"}<small>U {entry?.urgency ?? "—"}</small></span></td>;
                  })}</tr>)}</tbody>
                </table>
              </div>
              <div className="hr-legend"><span><i style={{ background: "#dcece2" }} /> Strong coverage</span><span><i style={{ background: "#f6e8c9" }} /> Moderate gap</span><span><i style={{ background: "#f0d9d5" }} /> Critical skill deficit</span><span><i style={{ background: "#e9ddf1" }} /> Declining / at-risk skill</span></div>
              <p style={{ marginTop: 16 }}>Cell: self-rating 0–5 (0 = unknown) and U = scenario urgency index. {dashboard?.riskMethodology}</p>
            </> : <div className="hr-empty"><strong>Waiting for survey responses</strong><p>Heatmap cells appear after employees submit their synthetic profile.</p></div>}
          </section>

          <section className="hr-panel" data-demo-slide="skills" data-demo-view="people" role="region" aria-label="Employee review view">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">People, not scores</span><h2><Users aria-hidden="true" />Employee review</h2><p>Select a synthetic profile to inspect declared skills, score components and pathway.</p></div></div>
            {loading && !dashboard ? <div className="hr-skeleton" /> : <EmployeeReview employees={employees} onInspect={setSelectedEmployee} />}
          </section>
        </div>

        <aside>
          <section className="hr-demo-page" data-demo-slide="scenarios">
            <div className="hr-demo-action-grid"><div className="hr-panel">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">05 / Replanning</span><h2><Compass aria-hidden="true" />Refresh the picture</h2><p>Refresh dated sources or apply an authored simulation.</p></div><Sparkles size={18} color="var(--hr-indigo)" /></div>
            <div className="hr-actions">
              <button className="hr-btn secondary" type="button" disabled={Boolean(trendBusy)} onClick={() => trends("refresh")}>{trendBusy === "refresh" ? <LoaderCircle size={15} /> : <RefreshCw size={15} />} Refresh sources</button>
              <button className="hr-btn" type="button" disabled={Boolean(trendBusy)} onClick={() => trends("simulate")}>{trendBusy === "simulate" ? <LoaderCircle size={15} /> : <Activity size={15} />} Simulate scenario</button>
            </div>
            <p className="hr-demo-scenario-note">Authored weights only · not vacancies or a labour-market forecast.</p>
            <details className="hr-demo-help"><summary>How to read this change</summary><p>Compare match indices, planning proxies and learning timelines across scenarios. Fast AI assumes more protected weekly learning time, not faster learning ability.</p></details>
            </div><PlanningGuide icon={Compass} title="Change an assumption. Read the difference."><p>Use the scenario selector above to explore another future. Then compare role pathways and learning priorities below.</p><p>Refreshing sources retrieves dated research. Simulating a scenario changes authored weights. They are different inputs—not predictions.</p></PlanningGuide></div>
            {employees.length > 0 && <details className="hr-panel hr-demo-comparison" open>
              <summary>Compare {employees.length} synthetic pathways</summary>
              <table className="hr-table" aria-label="Scenario planning results"><thead><tr><th>Profile</th><th>Top role</th><th>Match index</th><th>Exposure proxy</th><th>Learning time</th><th>Next priority</th></tr></thead><tbody>
                {employees.map(employee => <tr key={employee.id}><td><button className="hr-person" onClick={() => setSelectedEmployee(employee)}>{employee.alias}</button></td><td>{employee.analysis.matches[0]?.title}</td><td>{employee.analysis.matches[0]?.score} / 100</td><td>{employee.risk.score} · {employee.risk.level}</td><td>{employee.timelineWeeks} weeks · {employee.pathway.hoursPerWeek} h/week</td><td>{employee.analysis.matches[0]?.gaps[0]?.name || "Review portfolio"}</td></tr>)}
              </tbody></table>
            </details>}
            <section className="hr-panel hr-demo-evidence" aria-label="Research evidence">
            <div className="hr-panel-head"><div><h2><BookOpen aria-hidden="true" />Research behind the picture</h2><p>Inspect the publication, retrieval date and source before reviewing a planning change.</p></div></div>
            <div className="hr-detail-row"><strong>Evidence feed · {dashboard?.evidence?.status || "loading"}</strong><p>Retrieved {dateLabel(dashboard?.evidence?.retrievedAt, true)}{dashboard?.evidence?.lastError ? ` · Last error: ${dashboard.evidence.lastError}` : ""}</p></div>
            {sources.length ? <details style={{ marginTop: 11 }}><summary>Inspect {sources.length} dated research sources</summary>{sources.map((source, index) => <article className="hr-source" key={source.id || source.url || index}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.title || source.name || "Research record"} <ExternalLink size={11} /></a>
              <small>{sourceName(source)} · Published {sourceDate(source) ? dateLabel(sourceDate(source)) : "date unavailable"}</small>
              {source.retrievedAt && <small>Retrieved {dateLabel(source.retrievedAt, true)}</small>}
              {source.summary && <p>{source.summary}</p>}
            </article>)}</details> : <div className="hr-empty" style={{ marginTop: 14 }}><strong>No dated sources returned</strong><p>Keep the current plan under human review; no evidence is inferred.</p></div>}
            </section>
          </section>

          <section className="hr-demo-page" data-demo-slide="plan">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">06 / Learning capacity</span><h2><Route aria-hidden="true" />Ordered cohorts</h2><p>Review the next capability to build, then open its sequence and source.</p></div></div>
            <CohortPlanner key={`${campaignFilter}:${scenario}:${dashboard?.simulationActive}`} dashboard={dashboard} onInspect={setSelectedEmployee} />
            <details className="hr-panel hr-demo-help"><summary>About the learning estimates</summary><p>Public reading is curated; HRD Corp eligibility is not verified. Hours are planning estimates, not approved training claims.</p></details>
          </section>

          <section className="hr-demo-page" data-demo-slide="impact">
            <div className="hr-panel-head"><div><span className="hr-eyebrow">07 / Shared outcomes</span><h2><Leaf aria-hidden="true" />All 17 SDGs</h2><p>Open a mapped target to inspect its contribution note. Mappings are not measured impact.</p></div></div>
            <div className="hr-sdgs">{GOALS.map((name, index) => {
              const number = index + 1;
              const records = sdgByNumber.get(number) || [];
              const count = records.length ? Math.max(...records.map(record => record.count)) : 0;
              const inclusion = number === 5 || number === 10;
              return <article className="hr-sdg" key={number}>
                <span className="hr-sdg-number" aria-hidden="true">{String(number).padStart(2, "0")}</span>
                <strong>Goal {number} · {name}</strong>
                {records.length ? records.map(record => <div className="hr-demo-sdg-target" key={record.target}><small><a href={record.url} target="_blank" rel="noreferrer">Target {record.target} · {record.count} people</a></small><details><summary>Contribution note</summary><small>{record.contribution}</small></details></div>) : <small>No mapped target returned</small>}
                {inclusion && <small style={{ color: "var(--hr-indigo-dark)" }}>Inclusion goal — no impact claim</small>}
                <div className="hr-sdg-bar" aria-label={`${count} participants at the most covered target of this goal`}><i style={{ width: `${employees.length ? count / employees.length * 100 : 0}%` }} /></div>
              </article>;
            })}</div>
            <p style={{ marginTop: 24 }}>Green-transition planning can reprioritise sustainability capabilities; an SDG mapping does not demonstrate contribution or impact.</p>
          </section>
        </aside>
      </div>

      <section className="hr-panel" data-demo-slide="impact" style={{ marginTop: 24 }}>
        <div className="hr-panel-head"><div><h2><ShieldCheck aria-hidden="true" />Fairness Check Passed: Demographic-Blind Evaluation</h2><p>Role matching uses only declared skills, task-derived potential, and shared research/scenario signals. Alias, age, gender, background, and years of experience do not affect the match score. Self-ratings inform the reviewable heatmap, not role ranking. Missing skills are unknown, and workers should review results with HR.</p></div></div>
      </section>

      <section className="hr-panel" data-demo-slide="impact" style={{ marginTop: 24 }}>
        <div className="hr-panel-head"><div><span className="hr-eyebrow">Scenario record</span><h2><Clipboard aria-hidden="true" />Authored simulations</h2><p>Relative learning-priority assumptions; these are not published growth statistics or forecasts.</p></div></div>
        {(dashboard?.simulations || []).length ? <div className="hr-table-wrap"><table className="hr-table"><thead><tr><th>Scenario</th><th>Publisher / author</th><th>Date</th><th>Interpretation</th><th>Reference</th></tr></thead><tbody>{dashboard.simulations.map((item, index) => <tr key={item.id || index}><td>{item.title || "Simulation"}</td><td>{item.publisher || item.author || "Not supplied"}</td><td>{dateLabel(item.date)}</td><td>{item.summary || item.interpretation || "Authored planning assumption."}</td><td>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "var(--hr-indigo-dark)" }}>Open <ExternalLink size={11} /></a> : "—"}</td></tr>)}</tbody></table></div> : <div className="hr-empty"><strong>No simulation records</strong><p>The current scenario contains no separate authored simulation.</p></div>}
      </section>

      <details className="hr-demo-summary" data-demo-slide="impact">
        <summary>Department snapshot <span>{numberLabel(summary.employees ?? employees.length)} synthetic profiles</span></summary>
        <div className="hr-metrics" aria-label="Workforce summary">
          <Metric label="Synthetic participants" value={numberLabel(summary.employees ?? employees.length)} note="Completed survey responses" />
          <Metric label="Departments represented" value={numberLabel(summary.departments ?? new Set(employees.map((person) => person.department)).size)} note="Current planning scope" />
          <Metric label="Planning attention" value={numberLabel(summary.highRisk ?? employees.filter((person) => person.risk?.level === "High").length)} note="High proxy; review with people" />
          <Metric label="Learning hours mapped" value={numberLabel(summary.totalLearningHours)} note="Estimated learning time" />
        </div>
      </details>
      <footer className="hr-footer"><span>Prototype only · Synthetic participants · No demographic scoring inputs</span><span>Declared skills 45% · Transferable strengths 30% · Research / scenario context 25%</span></footer>
    </main>

    {formOpen && <div className="hr-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
      <section className="hr-modal" role="dialog" aria-modal="true" aria-labelledby="create-campaign-title">
        <div className="hr-modal-head"><div><span className="hr-eyebrow">Create / invite</span><h2 id="create-campaign-title">New survey campaign</h2></div><button className="hr-close" aria-label="Close form" onClick={() => setFormOpen(false)}><X size={18} /></button></div>
        <form onSubmit={createCampaign}>
          <div className="hr-controls">
            <div className="hr-field"><label htmlFor="hr-department">Department name</label><input required id="hr-department" list="hr-departments" maxLength="100" value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="e.g. Customer operations" /><datalist id="hr-departments">{departments.map(item => <option key={item} value={item} />)}</datalist></div>
            <div className="hr-field"><label htmlFor="hr-focus">Target role focus / notes</label><input id="hr-focus" value={focus} maxLength="140" onChange={(event) => setFocus(event.target.value)} placeholder="e.g. Digital and green capability planning" /></div>
            <div className="hr-field"><label htmlFor="hr-quota">Submission limit (1–500)</label><input required id="hr-quota" type="number" min="1" max="500" value={quota} onChange={(event) => setQuota(event.target.value)} /></div>
            <div className="hr-field"><label htmlFor="hr-expiration">Link expiration</label><select id="hr-expiration" value={expiry} onChange={(event) => setExpiry(event.target.value)}>{expiryChoices.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}</select></div>
          </div>
          <div className="hr-notice warning"><ShieldAlert size={16} /><div>Only invite users to submit synthetic data. Do not request real CVs or personal employee information.</div></div>
          <div className="hr-actions"><button className="hr-btn" type="submit" disabled={actionBusy || !department.trim()}>{actionBusy ? <LoaderCircle size={15} /> : <Check size={15} />} Create survey link</button><button className="hr-btn secondary" type="button" onClick={() => setFormOpen(false)}>Cancel</button></div>
        </form>
      </section>
    </div>}
    {manageCampaign && <ManageCampaign campaign={manageCampaign} onClose={() => setManageCampaign(null)} onSave={updateCampaign} busy={actionBusy} />}
    <EmployeeDetails employee={employees.find(person => person.id === selectedEmployee?.id) || selectedEmployee} skills={skillList} onClose={() => setSelectedEmployee(null)} />
  </div>;
}
