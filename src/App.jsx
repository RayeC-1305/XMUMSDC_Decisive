import React, { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import GlobalControlBar from "./components/GlobalControlBar";
import LandingPortal from "./components/LandingPortal";
import WorkerView from "./components/WorkerView";
import HRManagerView from "./components/HRManagerView";
import TVETAdvisorView from "./components/TVETAdvisorView";
import SignalInspectorModal from "./components/SignalInspectorModal";
import FairnessAuditModal from "./components/FairnessAuditModal";
import AIDisclosureModal from "./components/AIDisclosureModal";
import LiteModeView from "./components/LiteModeView";
import { translations } from "./translations";
import { Sparkles } from "lucide-react";

export default function App() {
  // Global View & Settings State: default to "landing" portal as requested!
  const [activeView, setActiveView] = useState("landing"); // "landing" | "worker" | "hr" | "tvet"
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [macroScenario, setMacroScenario] = useState("moderate"); // "moderate" | "rapid_agentic" | "malaysia_green_boom"
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // WebSocket Live Sync State
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [wsClientCount, setWsClientCount] = useState(1);
  const socketRef = useRef(null);

  // Data Store
  const [roles, setRoles] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [baselineSignals, setBaselineSignals] = useState([]);
  const [injectableSignals, setInjectableSignals] = useState([]);
  const [activeInjectedSignals, setActiveInjectedSignals] = useState([]);
  const [courses, setCourses] = useState([]);
  const [smeWorkforce, setSmeWorkforce] = useState([]);
  const [workforceSummary, setWorkforceSummary] = useState(null);
  const [tvetCohort, setTvetCohort] = useState(null);
  const [hrBroadcasts, setHrBroadcasts] = useState([]);

  // Green-AI Resilience Arbitrage State
  const [isGreenPivotActive, setIsGreenPivotActive] = useState(false);

  // Computed Role Match Results
  const [roleMatches, setRoleMatches] = useState([]);
  const [runtimeMetadata, setRuntimeMetadata] = useState(null);

  // Modals
  const [inspectedSignal, setInspectedSignal] = useState(null);
  const [isFairnessModalOpen, setIsFairnessModalOpen] = useState(false);
  const [isAIDisclosureOpen, setIsAIDisclosureOpen] = useState(false);

  const t = translations[currentLanguage] || translations.en;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 1. Initial Data Fetch & WebSocket Connection
  useEffect(() => {
    async function initData() {
      try {
        const [rolesRes, trendsRes, coursesRes, personasRes] = await Promise.all([
          fetch("/api/roles").then(r => r.json()),
          fetch("/api/trends").then(r => r.json()),
          fetch("/api/courses").then(r => r.json()),
          fetch("/api/personas").then(r => r.json())
        ]);

        if (rolesRes.roles) setRoles(rolesRes.roles);
        if (trendsRes.baseline_signals) setBaselineSignals(trendsRes.baseline_signals);
        if (trendsRes.injectable_signals) setInjectableSignals(trendsRes.injectable_signals);
        if (trendsRes.active_injected_signals) setActiveInjectedSignals(trendsRes.active_injected_signals);
        if (coursesRes.courses) setCourses(coursesRes.courses);

        if (personasRes.individual_personas) {
          setPersonas(personasRes.individual_personas);
          setCurrentPersona(personasRes.individual_personas[0]);
        }
        if (personasRes.sme_workforce) setSmeWorkforce(personasRes.sme_workforce);
        if (personasRes.workforce_summary) setWorkforceSummary(personasRes.workforce_summary);
        if (personasRes.tvet_graduating_cohort) setTvetCohort(personasRes.tvet_graduating_cohort);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    initData();

    // Setup Socket.IO Client Connection for Real-Time Multi-Device Sync
    const socket = io(window.location.origin, {
      reconnectionAttempts: 5,
      timeout: 5000
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsWsConnected(true);
      socket.emit("request_sync");
    });

    socket.on("disconnect", () => {
      setIsWsConnected(false);
    });

    socket.on("tri_party_sync", (syncData) => {
      if (syncData.connected_clients) setWsClientCount(syncData.connected_clients);
      if (syncData.active_injected_signals) setActiveInjectedSignals(syncData.active_injected_signals);
      if (syncData.dynamic_workforce) setSmeWorkforce(syncData.dynamic_workforce);
      if (syncData.workforce_summary) setWorkforceSummary(syncData.workforce_summary);
      if (syncData.dynamic_cohort) setTvetCohort(syncData.dynamic_cohort);
      if (syncData.active_scenario) setMacroScenario(syncData.active_scenario);
      if (syncData.hr_broadcasts) setHrBroadcasts(syncData.hr_broadcasts);

      if (syncData.endorsed_course_ids) {
        const endorsedSet = new Set(syncData.endorsed_course_ids);
        setCourses(prev => prev.map(c => ({ ...c, endorsed_by_tvet: endorsedSet.has(c.course_id) })));
      }

      // Visual ripple feedback and refresh if from another client
      if (syncData.event_type !== "INITIAL_SYNC") {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 1400);

        fetch("/api/personas")
          .then(r => r.json())
          .then(data => {
            if (data.individual_personas) {
              setPersonas(data.individual_personas);
              setCurrentPersona(prev => {
                const updated = data.individual_personas.find(p => p.persona_id === (prev?.persona_id || "PER-01"));
                return updated || prev;
              });
            }
          })
          .catch(err => console.error(err));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 2. Re-compute Role Matches when Persona, Tasks, Signals, Scenario, or Green Pivot changes
  const recalculateMatches = useCallback(async (personaToMatch, scenarioToUse, greenPivot) => {
    if (!personaToMatch || !roles.length) return;

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_tasks: personaToMatch.atomic_tasks.filter(t => t.is_checked !== false),
          worker_skills: personaToMatch.baseline_skills || [],
          scenario_id: scenarioToUse || macroScenario,
          is_green_pivot: greenPivot !== undefined ? greenPivot : isGreenPivotActive
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRoleMatches(data.ranked_roles || []);
        setRuntimeMetadata(data.runtime_metadata);
      }
    } catch (err) {
      console.error("Failed to calculate match", err);
    }
  }, [roles, macroScenario, isGreenPivotActive]);

  useEffect(() => {
    if (currentPersona && roles.length) {
      recalculateMatches(currentPersona, macroScenario, isGreenPivotActive);
    }
  }, [currentPersona, roles, macroScenario, activeInjectedSignals, isGreenPivotActive, recalculateMatches]);

  // 3. Inject Live Market Signal Handler (Connected to WebSockets & All 3 Views)
  const handleInjectSignal = async (signalId) => {
    try {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 1400);

      const response = await fetch("/api/trends/inject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal_id: signalId, action: "inject" })
      });

      if (response.ok) {
        const data = await response.json();
        setActiveInjectedSignals(data.active_injected_signals || []);
        if (data.dynamic_workforce) setSmeWorkforce(data.dynamic_workforce);
        if (data.workforce_summary) setWorkforceSummary(data.workforce_summary);
        if (data.dynamic_cohort) setTvetCohort(data.dynamic_cohort);
        triggerToast(data.ripple_message);

        // Fetch refreshed personas with dynamic half-lives
        const personasRes = await fetch("/api/personas").then(r => r.json());
        if (personasRes.individual_personas) {
          setPersonas(personasRes.individual_personas);
          const updatedCurrent = personasRes.individual_personas.find(
            p => p.persona_id === (currentPersona?.persona_id || "PER-01")
          );
          if (updatedCurrent) {
            setCurrentPersona(updatedCurrent);
            recalculateMatches(updatedCurrent, macroScenario, isGreenPivotActive);
          }
        }
      }
    } catch (err) {
      console.error("Failed to inject signal", err);
    }
  };

  // 3b. ML Agent 2: Ingest Live AI Trends (arXiv / Open Data Stream)
  const handleFetchLiveTrend = async () => {
    try {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 1400);

      const response = await fetch("/api/trends/fetch-live", {
        method: "POST"
      });

      if (response.ok) {
        const data = await response.json();
        setActiveInjectedSignals(data.active_injected_signals || []);
        if (data.dynamic_workforce) setSmeWorkforce(data.dynamic_workforce);
        if (data.workforce_summary) setWorkforceSummary(data.workforce_summary);
        if (data.dynamic_cohort) setTvetCohort(data.dynamic_cohort);
        triggerToast(data.message || "Live arXiv AI research signal ingested!");

        // Refresh trends list to include new signal in dropdown
        const trendsRes = await fetch("/api/trends").then(r => r.json());
        if (trendsRes.injectable_signals) setInjectableSignals(trendsRes.injectable_signals);

        // Fetch refreshed personas
        const personasRes = await fetch("/api/personas").then(r => r.json());
        if (personasRes.individual_personas) {
          setPersonas(personasRes.individual_personas);
          const updatedCurrent = personasRes.individual_personas.find(
            p => p.persona_id === (currentPersona?.persona_id || "PER-01")
          );
          if (updatedCurrent) {
            setCurrentPersona(updatedCurrent);
            recalculateMatches(updatedCurrent, macroScenario, isGreenPivotActive);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch live trend", err);
    }
  };

  // 4. Reset Signals to Baseline
  const handleResetSignals = async () => {
    try {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 1400);

      const response = await fetch("/api/trends/inject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" })
      });

      if (response.ok) {
        const data = await response.json();
        setActiveInjectedSignals([]);
        if (data.dynamic_workforce) setSmeWorkforce(data.dynamic_workforce);
        if (data.workforce_summary) setWorkforceSummary(data.workforce_summary);
        if (data.dynamic_cohort) setTvetCohort(data.dynamic_cohort);
        triggerToast("Market signals reset to baseline Sept–Oct 2026.");

        const personasRes = await fetch("/api/personas").then(r => r.json());
        if (personasRes.individual_personas) {
          setPersonas(personasRes.individual_personas);
          const updatedCurrent = personasRes.individual_personas.find(
            p => p.persona_id === (currentPersona?.persona_id || "PER-01")
          );
          if (updatedCurrent) {
            setCurrentPersona(updatedCurrent);
            recalculateMatches(updatedCurrent, macroScenario, isGreenPivotActive);
          }
        }
      }
    } catch (err) {
      console.error("Failed to reset signals", err);
    }
  };

  // 5. Macro Scenario Change
  const handleScenarioChange = async (scenarioId) => {
    setMacroScenario(scenarioId);
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scenarioId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dynamic_workforce) setSmeWorkforce(data.dynamic_workforce);
        if (data.dynamic_cohort) setTvetCohort(data.dynamic_cohort);
        triggerToast(`Macro Scenario updated to: ${scenarioId.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. HR Demand Broadcast Handler
  const handleBroadcastDemand = async (payload) => {
    try {
      const response = await fetch("/api/hr/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setHrBroadcasts(data.all_broadcasts || []);
        triggerToast(data.message);
        if (currentPersona) {
          recalculateMatches(currentPersona, macroScenario, isGreenPivotActive);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. TVET 1-Click Course Endorse Handler
  const handleEndorseCourse = async (courseId) => {
    try {
      const response = await fetch("/api/tvet/endorse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId })
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(prev =>
          prev.map(c => (c.course_id === courseId ? { ...c, endorsed_by_tvet: data.is_endorsed } : c))
        );
        triggerToast(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 8. Green-AI Resilience Arbitrage Toggle (Stage 4)
  const handleToggleGreenPivot = (isActive) => {
    setIsGreenPivotActive(isActive);
    recalculateMatches(currentPersona, macroScenario, isActive);
    triggerToast(
      isActive
        ? "Path B Green-AI Pivot Activated: +14.8% Match Boost & 3.2x Career Runway (45 Months) Unlocked!"
        : "Path A Standard Tech Activated: Baseline 14 Months Runway."
    );
  };

  const allActiveSignals = [...baselineSignals, ...activeInjectedSignals];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border-2 border-emerald-500 text-white shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Global Persistent Top Control Bar */}
      <GlobalControlBar
        t={t}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        activeView={activeView}
        onViewChange={setActiveView}
        macroScenario={macroScenario}
        onScenarioChange={handleScenarioChange}
        isLiteMode={isLiteMode}
        onToggleLiteMode={() => setIsLiteMode(!isLiteMode)}
        injectableSignals={injectableSignals}
        activeInjectedSignals={activeInjectedSignals}
        onInjectSignal={handleInjectSignal}
        onResetSignals={handleResetSignals}
        onFetchLiveTrend={handleFetchLiveTrend}
        onOpenAIDisclosure={() => setIsAIDisclosureOpen(true)}
        isRippling={isRippling}
        isWsConnected={isWsConnected}
        wsClientCount={wsClientCount}
      />

      {/* Main View Area */}
      <main className="flex-1 py-4">
        {isLiteMode ? (
          <LiteModeView
            t={t}
            persona={currentPersona}
            roleMatches={roleMatches}
            courses={courses}
            activeSignals={allActiveSignals}
            onInspectSignal={setInspectedSignal}
          />
        ) : (
          <>
            {/* Landing Portal (Choose Audience) */}
            {activeView === "landing" && (
              <LandingPortal
                t={t}
                onSelectAudience={setActiveView}
                activeInjectedSignals={activeInjectedSignals}
                macroScenario={macroScenario}
                onOpenAIDisclosure={() => setIsAIDisclosureOpen(true)}
              />
            )}

            {/* Isolated Worker Slide Workflow */}
            {activeView === "worker" && (
              <WorkerView
                t={t}
                personas={personas}
                currentPersona={currentPersona}
                onSelectPersona={p => {
                  setCurrentPersona(p);
                  recalculateMatches(p, macroScenario, isGreenPivotActive);
                }}
                onUpdateTasks={tasks => {
                  const updated = { ...currentPersona, atomic_tasks: tasks };
                  setCurrentPersona(updated);
                  recalculateMatches(updated, macroScenario, isGreenPivotActive);
                }}
                roleMatches={roleMatches}
                activeSignals={allActiveSignals}
                courses={courses}
                macroScenario={macroScenario}
                onInspectSignal={setInspectedSignal}
                onOpenFairnessAudit={() => setIsFairnessModalOpen(true)}
                onReturnHome={() => setActiveView("landing")}
                onToggleGreenPivot={handleToggleGreenPivot}
                isGreenPivotActive={isGreenPivotActive}
              />
            )}

            {/* Isolated HR Slide Workflow */}
            {activeView === "hr" && (
              <HRManagerView
                t={t}
                smeWorkforce={smeWorkforce}
                workforceSummary={workforceSummary}
                roles={roles}
                onBroadcastDemand={handleBroadcastDemand}
                hrBroadcasts={hrBroadcasts}
                activeInjectedSignals={activeInjectedSignals}
                onReturnHome={() => setActiveView("landing")}
              />
            )}

            {/* Isolated TVET Slide Workflow */}
            {activeView === "tvet" && (
              <TVETAdvisorView
                t={t}
                tvetCohort={tvetCohort}
                courses={courses}
                onEndorseCourse={handleEndorseCourse}
                activeInjectedSignals={activeInjectedSignals}
                onReturnHome={() => setActiveView("landing")}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <SignalInspectorModal
        signal={inspectedSignal}
        isOpen={Boolean(inspectedSignal)}
        onClose={() => setInspectedSignal(null)}
      />

      <FairnessAuditModal
        isOpen={isFairnessModalOpen}
        onClose={() => setIsFairnessModalOpen(false)}
        currentPersona={currentPersona}
        currentRoleMatch={roleMatches[0]}
      />

      <AIDisclosureModal
        isOpen={isAIDisclosureOpen}
        onClose={() => setIsAIDisclosureOpen(false)}
        runtimeMetadata={runtimeMetadata}
      />

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-bold text-slate-400">NexusTalent 360</span> — XMUM SDC Hackathon 2026 (Domain 1: The Aiversecity Future-Ready Workforce Domain).
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => setActiveView("landing")}
            className="text-slate-400 hover:text-white transition-colors"
          >
            🏠 Home Portal
          </button>
          <span>•</span>
          <span>Apache-2.0 Open Source</span>
          <span>•</span>
          <button
            onClick={() => setIsAIDisclosureOpen(true)}
            className="text-emerald-400 hover:underline"
          >
            AI Model Disclosure Card
          </button>
        </div>
      </footer>
    </div>
  );
}
