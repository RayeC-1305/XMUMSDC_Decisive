import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Download,
  FileText,
  Home,
  Leaf,
  Menu,
  Radio,
  Route,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserRound,
  X,
  RefreshCw,
} from "lucide-react";
import {
  DEFAULT_PREFERENCES,
  DEMO_UPDATES,
  SAMPLE_CVS,
  SCENARIOS,
  SKILL_MAP,
} from "../../data/careerCatalog";
import {
  readWorkspace,
  storeWorkspace,
  progressKey,
  exportPlan,
  STORAGE_KEY,
} from "../../utils/careerDemo";
import CareerIntake from "./CareerIntake";
import {
  Overview,
  RoleExplorer,
  CompareRoles,
  RadarView,
  ScenarioControl,
} from "./CareerViews";
import LearningWorkspace from "./LearningWorkspace";
import {
  Icon,
  Dialog,
  SourceDialog,
  StatusToast,
  Wordmark,
} from "./CareerPrimitives";
import PitchLanding from "./PitchLanding";
import { fetchLiveEvidence } from "../../utils/liveEvidence";
import { submitProfile } from "../../utils/careerApi";
import useCareerBackend from "../../utils/useCareerBackend";
import {
  afterInterfaceUpdate,
  transitionInterface,
  useWorkspaceEntrance,
} from "../../utils/interfaceMotion";
import "../../career.css";
import "../../brand.css";
import "../../motion.css";

const NAV = [
  ["overview", "Overview", Home],
  ["profile", "My profile", UserRound],
  ["roles", "Future roles", Compass],
  ["radar", "Skills radar", Radio],
  ["pathway", "Learning plan", Route],
];
const VIEWS = new Set([...NAV.map(([id]) => id), "import", "compare", "home"]);
const currentView = () => {
  const hash = location.hash.slice(1).split("/")[0];
  return VIEWS.has(hash) ? hash : hash === "signals" ? "radar" : "home";
};

export default function CareerApplication() {
  const [state, setState] = useState(readWorkspace);
  const [view, setView] = useState(currentView);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => matchMedia("(max-width: 900px)").matches,
  );
  const [toast, setToast] = useState("");
  const [source, setSource] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [compare, setCompare] = useState([]);
  const [pendingChange, setPendingChange] = useState(
    () => state.pendingChange || null,
  );
  const [reviewChange, setReviewChange] = useState(false);
  const [activities, setActivities] = useState([]);
  const [evidenceBusy, setEvidenceBusy] = useState(false);
  const [evidenceError, setEvidenceError] = useState("");
  const evidenceController = useRef(null);
  const latestState = useRef(state);
  const mainRef = useRef(null);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const storageWarning = useRef(false);
  const profile = state.profile || SAMPLE_CVS[0];
  const backend = useCareerBackend(state, setState);
  const latestAnalysis = useRef(null);
  useEffect(() => {
    latestAnalysis.current = backend.data;
  }, [backend.data]);
  const ranked = backend.data?.matches || [];
  const selected = ranked.find((role) => role.id === state.selectedRoleId) ||
    ranked[0] || { id: "pending", gaps: [], plan: [] };
  const plan = selected.plan;
  const previousSteps =
    pendingChange?.previousPlans?.[selected.id] ||
    pendingChange?.previousPlan ||
    [];
  const keptStepCount = plan.filter((step) =>
    previousSteps.some((previous) => previous.id === step.id),
  ).length;
  const activeView =
    !state.profile && view !== "import" && view !== "home" ? "import" : view;
  useWorkspaceEntrance(mainRef, activeView, Boolean(backend.data));
  const notify = useCallback((message) => setToast(message), []);
  const dismissToast = useCallback(() => setToast(""), []);
  const addActivity = (message) => {
    setActivities((items) =>
      [
        {
          message,
          time: new Date().toLocaleTimeString("en-MY", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kuala_Lumpur",
          }),
        },
        ...items,
      ].slice(0, 8),
    );
  };
  useEffect(() => {
    latestState.current = state;
  }, [state]);
  useEffect(() => () => evidenceController.current?.abort(), []);
  useEffect(() => {
    document.title =
      view === "home"
        ? "Nexus | Advance with every shift."
        : "Nexus | Your career workspace";
  }, [view]);
  useEffect(() => {
    if (
      !storeWorkspace({ ...state, pendingChange }) &&
      !storageWarning.current
    ) {
      storageWarning.current = true;
      notify(
        "Browser storage is unavailable. Your work will stay in this session only.",
      );
    }
  }, [state, pendingChange, notify]);
  useEffect(() => {
    const update = () => {
      setView(currentView());
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    const media = matchMedia("(max-width: 900px)");
    const update = () => {
      setIsMobile(media.matches);
      setMenuOpen(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (menuOpen && isMobile) navRef.current?.querySelector("button")?.focus();
  }, [menuOpen, isMobile]);
  function closeMenu() {
    setMenuOpen(false);
    requestAnimationFrame(() => menuRef.current?.focus());
  }
  function menuKeys(event) {
    if (!isMobile || !menuOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }
    if (event.key === "Tab") {
      const elements = navRef.current.querySelectorAll(
        "a[href],button:not(:disabled)",
      );
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
  function go(next, useDefault = true) {
    setToast("");
    const transition = transitionInterface(() => {
      if (
        !state.profile &&
        next !== "import" &&
        next !== "home" &&
        useDefault
      ) {
        setState((previous) => ({
          ...previous,
          profile: {
            ...SAMPLE_CVS[0],
            reviewed: true,
            synthetic: true,
            importedAt: new Date().toISOString(),
          },
        }));
        notify(
          "You’re exploring a fictional sample. Import a CV whenever you’re ready.",
        );
      }
      setView(next);
      location.hash = next;
      setMenuOpen(false);
      window.scrollTo(0, 0);
    }, "workspace");
    afterInterfaceUpdate(transition, () =>
      mainRef.current?.focus({ preventScroll: true }),
    );
  }
  async function completeIntake(nextProfile, preferences) {
    const reviewedProfile = await submitProfile(nextProfile, preferences);
    setState((previous) => ({
      ...previous,
      profile: reviewedProfile,
      preferences,
      selectedRoleId: null,
    }));
    setCompare([]);
    setPendingChange(null);
    go("overview", false);
    notify(
      "Your profile is ready. Let’s explore where your experience can take you.",
    );
    addActivity("Profile reviewed and workspace created");
  }
  function selectRole(id) {
    transitionInterface(
      () => setState((previous) => ({ ...previous, selectedRoleId: id })),
      "detail",
    );
  }
  function toggleShortlist(id) {
    setState((previous) => ({
      ...previous,
      shortlist: previous.shortlist.includes(id)
        ? previous.shortlist.filter((item) => item !== id)
        : [...previous.shortlist, id],
    }));
  }
  function toggleCompare(id) {
    setCompare((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : previous.length < 3
          ? [...previous, id]
          : previous,
    );
  }
  function captureChange(
    title,
    scenario,
    signals,
    baseline = state,
    evidenceRevision = baseline.evidenceRevision,
  ) {
    const baselineRanked = latestAnalysis.current?.matches;
    if (!baselineRanked?.length) {
      setState((previous) => ({
        ...previous,
        scenario,
        signals,
        evidenceRevision,
      }));
      return;
    }
    const baselineRole =
      baselineRanked.find((role) => role.id === baseline.selectedRoleId) ||
      baselineRanked[0];
    setPendingChange({
      title,
      previousScenario: baseline.scenario,
      previousSignals: baseline.signals,
      previousEvidenceRevision: latestAnalysis.current.evidence.revision,
      previousPlan: baselineRole.plan.map((step) => ({
        id: step.id,
        title: step.title,
      })),
      previousPlans: Object.fromEntries(
        baselineRanked.map((role) => [
          role.id,
          role.plan.map((step) => ({
            id: step.id,
            title: step.title,
          })),
        ]),
      ),
      scores: Object.fromEntries(
        baselineRanked.map((role) => [role.id, role.score]),
      ),
      gaps: Object.fromEntries(
        baselineRanked.map((role) => [
          role.id,
          role.gaps[0]?.name || "No catalog gap",
        ]),
      ),
    });
    setState((previous) => ({
      ...previous,
      scenario,
      signals,
      evidenceRevision,
      selectedRoleId: baselineRole.id,
    }));
    addActivity(title);
  }
  async function refreshEvidence() {
    if (evidenceBusy) return;
    const controller = new AbortController();
    evidenceController.current = controller;
    setEvidenceBusy(true);
    setEvidenceError("");
    const timeout = setTimeout(() => controller.abort("timeout"), 25000);
    try {
      const result = await fetchLiveEvidence(controller.signal);
      const baseline = latestState.current;
      const signals = [
        ...baseline.signals.filter((source) => source.type === "Simulation"),
        ...result.sources,
      ];
      const signature = (items) =>
        JSON.stringify(
          items
            .map((item) => ({ id: item.id, impacts: item.impacts }))
            .sort((a, b) => a.id.localeCompare(b.id)),
        );
      const changed = signature(signals) !== signature(baseline.signals);
      if (changed)
        captureChange(
          `${result.sources.length} dated research sources retrieved from Crossref`,
          baseline.scenario,
          signals,
          baseline,
          result.revision,
        );
      setState((previous) => ({
        ...previous,
        signals,
        evidenceRevision: result.revision,
        evidenceFeed: {
          ...result,
          sources: undefined,
          retrievedAt: result.retrievedAt,
          query: result.query,
          url: result.sourceUrl,
          provider: result.provider,
          count: result.sources.length,
          checked: result.checked,
        },
      }));
      notify(
        changed
          ? "Live evidence retrieved. Review why the match and learning priorities changed."
          : "The live feed was checked. No new model inputs were found; your plan is unchanged.",
      );
      addActivity(
        `Crossref research refreshed: ${result.sources.length} relevant publications`,
      );
      if (result.lastError)
        setEvidenceError(
          `Previous dated evidence retained: ${result.lastError}`,
        );
    } catch (error) {
      if (controller.signal.aborted && controller.signal.reason !== "timeout")
        return;
      setEvidenceError(
        controller.signal.reason === "timeout"
          ? "The research feed took too long. Your previous evidence and plan are kept. Try again."
          : error instanceof TypeError
            ? "The research service could not be reached. Check your connection and try again. Your previous evidence and plan are kept."
            : error.message ||
              "The research feed could not be reached. Your previous evidence is kept.",
      );
    } finally {
      clearTimeout(timeout);
      if (evidenceController.current === controller) {
        evidenceController.current = null;
        setEvidenceBusy(false);
      }
    }
  }
  function changeScenario(id) {
    if (id === state.scenario) return;
    captureChange(
      `${SCENARIOS.find((item) => item.id === id).title} scenario selected`,
      id,
      state.signals,
    );
  }
  function signalUpdate() {
    const signal = DEMO_UPDATES[state.acceptedUpdates];
    if (!signal) return;
    captureChange(signal.title, state.scenario, [...state.signals, signal]);
    setState((previous) => ({
      ...previous,
      acceptedUpdates: previous.acceptedUpdates + 1,
    }));
    notify(
      "A demo signal changed the picture. Review its effect before keeping the change.",
    );
  }
  function customSignal(signal) {
    captureChange("Your scenario signal was added", state.scenario, [
      ...state.signals,
      signal,
    ]);
    notify(
      "Signal added as an unverified simulation. Your matches and learning priorities have been updated.",
    );
  }
  function savePlan() {
    const existing = state.saved.find(
      (item) => item.profileId === profile.id && item.roleId === selected.id,
    );
    const savedPlan = {
      id: `plan-${profile.id}-${selected.id}`,
      profileId: profile.id,
      roleId: selected.id,
      name: existing?.name || `${selected.title} pathway`,
      scenario: state.scenario,
      hoursPerWeek: state.preferences.hours,
      preferences: { ...state.preferences },
      signals: state.signals,
      evidenceRevision: backend.data.evidence.revision,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    setState((previous) => ({
      ...previous,
      saved: [
        ...previous.saved.filter((item) => item.id !== savedPlan.id),
        savedPlan,
      ],
    }));
    notify("Your career plan is saved on this device.");
    addActivity(`Saved ${selected.title} pathway`);
  }
  function markComplete(step) {
    const key = progressKey(profile, selected, step);
    setState((previous) => ({
      ...previous,
      progress: { ...previous.progress, [key]: !previous.progress[key] },
    }));
    notify(
      state.progress[key]
        ? "Step reopened. You can revisit it whenever you need."
        : "Learning step complete. Your progress is saved.",
    );
    addActivity(
      state.progress[key]
        ? "Learning step reopened"
        : `Completed: ${step.title}`,
    );
  }
  function download() {
    exportPlan(
      profile,
      selected,
      state.preferences,
      state.scenario,
      plan,
      state.signals,
      state.progress,
      state.revisions || [],
    );
    notify(
      "Your career brief has been downloaded with its sources and assumptions.",
    );
  }
  async function copySummary() {
    const text = `${profile.name}'s next chapter\n${profile.role} → ${selected.title}\n${state.preferences.hours} hours/week · ${plan.reduce((sum, step) => sum + step.hours, 0)} estimated learning hours\nNext: ${plan.find((step) => !state.progress[progressKey(profile, selected, step)])?.title || "Review completed work with an adviser"}\nIllustrative prototype plan. Decisions remain with the worker and adviser.`;
    try {
      await navigator.clipboard.writeText(text);
      notify("Career summary copied. It’s ready to share in a conversation.");
    } catch {
      notify(
        "The browser could not copy this text. Download the brief instead.",
      );
    }
  }
  function recordRevision(decision) {
    if (!pendingChange) return;
    const sourceIds = state.signals
      .filter(
        (source) =>
          !pendingChange.previousSignals.some(
            (previous) => previous.id === source.id,
          ),
      )
      .map((source) => ({
        id: source.id,
        title: source.title,
        url: source.url,
        date: source.date,
        provider: source.provider || source.publisher,
      }));
    const record = {
      id: `revision-${Date.now()}`,
      profileId: profile.id,
      roleId: selected.id,
      role: selected.title,
      at: new Date().toISOString(),
      decision,
      title: pendingChange.title,
      before: pendingChange.scores[selected.id],
      after: selected.score,
      previousPriority: pendingChange.gaps[selected.id],
      priority: selected.gaps[0]?.name || "No catalog gap",
      sources: sourceIds,
      keptSteps: keptStepCount,
      completed: plan.filter(
        (step) => state.progress[progressKey(profile, selected, step)],
      ).length,
    };
    setState((previous) => ({
      ...previous,
      revisions: [record, ...(previous.revisions || [])].slice(0, 40),
    }));
  }
  function acceptChange() {
    recordRevision("Accepted");
    setPendingChange(null);
    setReviewChange(false);
    const existing = state.saved.some(
      (item) => item.profileId === profile.id && item.roleId === selected.id,
    );
    if (existing) savePlan();
    else
      notify(
        "Scenario kept. Your learning priorities reflect this view of the future.",
      );
  }
  function revertChange() {
    recordRevision("Reverted");
    setState((previous) => ({
      ...previous,
      scenario: pendingChange.previousScenario,
      signals: pendingChange.previousSignals,
      evidenceRevision: pendingChange.previousEvidenceRevision,
      acceptedUpdates: Math.max(
        0,
        pendingChange.previousSignals.filter((item) =>
          item.id.startsWith("demo-"),
        ).length,
      ),
    }));
    setPendingChange(null);
    setReviewChange(false);
    notify("Previous assumptions restored. Your completed learning is kept.");
  }
  function reset() {
    evidenceController.current?.abort();
    evidenceController.current = null;
    setEvidenceBusy(false);
    setEvidenceError("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({ ...readWorkspace(), profile: null });
    setPendingChange(null);
    setCompare([]);
    setActivities([]);
    setResetOpen(false);
    setSettingsOpen(false);
    setView("import");
    location.hash = "import";
    notify("Demo reset. Start with a CV or choose a fictional sample.");
  }
  const savedCount = state.saved.filter(
    (item) => item.profileId === profile.id,
  ).length;
  const firstName = state.profile?.name.split(" ")[0] || "Your";

  function launchDemo() {
    go("import", false);
  }

  if (view === "home")
    return (
      <PitchLanding
        onStart={launchDemo}
        onResume={() => go("overview", false)}
        onLiveDemo={() => go("radar")}
        hasWorkspace={Boolean(state.profile)}
      />
    );

  return (
    <div className="career-app">
      <a
        className="c-skip-link"
        href="#career-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <aside
        className={`c-sidebar ${menuOpen ? "open" : ""}`}
        ref={navRef}
        id="career-navigation"
        role={isMobile && menuOpen ? "dialog" : undefined}
        aria-modal={isMobile && menuOpen ? "true" : undefined}
        aria-label="Career workspace navigation"
        aria-hidden={isMobile && !menuOpen ? "true" : undefined}
        inert={isMobile && !menuOpen ? "" : undefined}
        onKeyDown={menuKeys}
      >
        <button
          className="c-icon-button c-close-menu"
          aria-label="Close navigation"
          onClick={closeMenu}
        >
          <Icon as={X} size={20} />
        </button>
        <a
          href="#home"
          className="c-brand"
          onClick={(event) => {
            event.preventDefault();
            go("home", false);
          }}
        >
          <span>
            <Wordmark />
            <small>Advance with every shift.</small>
          </span>
        </a>
        <button
          className="c-workspace-switch"
          onClick={() => setSettingsOpen(true)}
        >
          <span>N</span>
          <span>
            My workspace<small>Personal career plan</small>
          </span>
          <Icon as={ChevronDown} size={14} />
        </button>
        <span className="c-nav-label">Your career</span>
        <nav
          style={{
            "--navigation-index": Math.max(
              0,
              NAV.findIndex(
                ([id]) =>
                  id === (activeView === "compare" ? "roles" : activeView),
              ),
            ),
          }}
          data-highlight={activeView !== "import"}
        >
          {NAV.map(([id, label, Glyph]) => (
            <a
              href={`#${id}`}
              key={id}
              className={
                activeView === id ||
                (activeView === "compare" && id === "roles")
                  ? "active"
                  : ""
              }
              aria-current={activeView === id ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                go(id);
              }}
            >
              <Icon as={Glyph} size={19} />
              <span>{label}</span>
              {id === "pathway" && savedCount > 0 && (
                <small>{savedCount}</small>
              )}
              {id === "radar" && state.acceptedUpdates > 0 && (
                <span
                  className="c-nav-update"
                  aria-label="New scenario input"
                />
              )}
            </a>
          ))}
        </nav>
        <button
          className={`c-import-nav ${activeView === "import" ? "active" : ""}`}
          onClick={() => go("import")}
        >
          <Icon as={Upload} size={17} />
          {state.profile ? "Import a new CV" : "Start with your CV"}
          <Icon as={PlusArrow} size={15} />
        </button>
        <div className="c-sidebar-bottom">
          <div className="c-sidebar-purpose">
            <Icon as={Leaf} size={23} />
            <h3>Build what comes next.</h3>
            <p>New capabilities. Better work. A more sustainable future.</p>
            <a
              href="https://sdgs.un.org/goals"
              target="_blank"
              rel="noreferrer"
            >
              Explore the global goals
              <Icon as={ArrowUpRight} size={14} />
            </a>
          </div>
          <button className="c-sidebar-help" onClick={() => setHelpOpen(true)}>
            <Icon as={CircleHelp} size={17} />
            Help & guidance
            <Icon as={ArrowUpRight} size={14} />
          </button>
          <button
            className="c-sidebar-account"
            onClick={() => setSettingsOpen(true)}
          >
            <span>
              {state.profile
                ? state.profile.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                : "N"}
            </span>
            <span>
              {state.profile ? state.profile.name : "Your next chapter"}
              <small>Saved on this device</small>
            </span>
            <Icon as={Settings2} size={17} />
          </button>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="c-menu-scrim"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}
      <div
        className="c-main-shell"
        inert={isMobile && menuOpen ? "" : undefined}
      >
        <header className="c-topbar">
          <div className="c-breadcrumb">
            <button
              ref={menuRef}
              className="c-icon-button c-mobile-menu"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="career-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Icon as={Menu} size={21} />
            </button>
            <span className="c-workspace-caption">Career workspace</span>
            <a
              className="c-mobile-wordmark"
              href="#home"
              aria-label="Nexus introduction"
              onClick={(event) => {
                event.preventDefault();
                go("home", false);
              }}
            >
              <Wordmark />
            </a>
            <Icon as={ChevronRight} size={13} />
            <strong>
              {activeView === "import"
                ? "Get started"
                : activeView === "compare"
                  ? "Compare directions"
                  : NAV.find(([id]) => id === activeView)?.[1]}
            </strong>
          </div>
          <div className="c-topbar-actions">
            <button className="c-demo-mode" onClick={() => setAboutOpen(true)}>
              <span />
              Interactive prototype
            </button>
            {state.profile && (
              <>
                <details className="c-activity-menu">
                  <summary aria-label="Recent activity">
                    <Icon as={Bell} size={19} />
                    {activities.length > 0 && <span />}
                  </summary>
                  <div>
                    <h3>Recent activity</h3>
                    {activities.length ? (
                      activities.map((item, index) => (
                        <p key={`${item.time}-${index}`}>
                          <span>{item.message}</span>
                          <time>{item.time}</time>
                        </p>
                      ))
                    ) : (
                      <p>
                        Your next chapter starts here. Imports, saved plans and
                        learning progress will appear here.
                      </p>
                    )}
                  </div>
                </details>
                <button
                  className="c-button secondary c-header-export"
                  onClick={download}
                  disabled={!backend.data}
                >
                  <Icon as={Download} size={15} />
                  Export plan
                </button>
              </>
            )}
            <button
              className="c-topbar-avatar"
              aria-label="Workspace settings"
              onClick={() => setSettingsOpen(true)}
            >
              {state.profile ? state.profile.name[0] : "N"}
            </button>
          </div>
        </header>
        <main
          id="career-content"
          className={`c-main ${activeView === "import" || activeView === "profile" ? "intake-mode" : ""}`}
          ref={mainRef}
          data-view={activeView}
          tabIndex={-1}
        >
          {activeView === "import" || activeView === "profile" ? (
            <CareerIntake
              key={`${activeView}-${state.profile?.id || "new"}`}
              profile={state.profile}
              preferences={state.preferences}
              editing={activeView === "profile"}
              onComplete={completeIntake}
              onExplore={() => go("overview")}
            />
          ) : !backend.data ? (
            <section
              className="c-surface c-api-state"
              role={backend.error ? "alert" : "status"}
              aria-live="polite"
              aria-busy={backend.loading}
            >
              <h1>
                {backend.error
                  ? "Your career plan needs a connection."
                  : "Updating your career plan…"}
              </h1>
              <p>
                {backend.error ||
                  "Checking your profile, source evidence, role matches and learning steps."}
              </p>
              {backend.error && (
                <div>
                  <button className="c-button primary" onClick={backend.retry}>
                    Try again
                  </button>
                  <button
                    className="c-button secondary"
                    onClick={() =>
                      setState((previous) => ({
                        ...previous,
                        evidenceRevision: null,
                      }))
                    }
                  >
                    Use current evidence
                  </button>
                  <button
                    className="c-button ghost"
                    onClick={() => go("profile")}
                  >
                    Review profile
                  </button>
                </div>
              )}
            </section>
          ) : (
            <>
              <details className="c-source-status c-api-receipt">
                <summary>
                  <Icon as={Radio} size={13} /> Evidence:{" "}
                  {backend.data.evidence.status}
                  {backend.data.evidence.retrievedAt
                    ? ` · Updated ${new Date(backend.data.evidence.retrievedAt).toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur", day: "numeric", month: "short", year: "numeric" })}`
                    : " · Research weights are neutral"}
                  <Icon as={ChevronDown} size={13} />
                </summary>
                <p>
                  Career service connected · {backend.data.modelVersion}
                  {backend.data.evidence.retrievedAt
                    ? ` · Retrieved ${new Date(backend.data.evidence.retrievedAt).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })}`
                    : " · No research-derived weighting is active."}
                </p>
              </details>
              {pendingChange && (
                <div className="c-change-banner">
                  <span className="c-soft-icon">
                    <Icon as={RefreshCw} size={21} />
                  </span>
                  <div>
                    <strong>A different future. A chance to review.</strong>
                    <p>
                      {selected.title}: match index{" "}
                      {pendingChange.scores[selected.id]} → {selected.score}.
                      Your completed learning is kept.
                    </p>
                  </div>
                  <button
                    className="c-button secondary"
                    onClick={() => setReviewChange(true)}
                  >
                    Review changes
                    <Icon as={ArrowRight} size={15} />
                  </button>
                </div>
              )}
              {activeView !== "radar" && (
                <ScenarioControl
                  scenario={state.scenario}
                  onChange={changeScenario}
                />
              )}
              {activeView === "overview" && (
                <Overview
                  skillOutlook={backend.data.skillOutlook}
                  profile={profile}
                  preferences={state.preferences}
                  ranked={ranked}
                  selected={selected}
                  plan={plan}
                  saved={state.saved}
                  progress={state.progress}
                  signals={state.signals}
                  scenario={state.scenario}
                  onNavigate={go}
                  onSelectRole={selectRole}
                  onSource={setSource}
                  onSave={savePlan}
                />
              )}
              {activeView === "roles" && (
                <RoleExplorer
                  ranked={ranked}
                  selected={selected}
                  preferences={state.preferences}
                  profile={profile}
                  onSelect={selectRole}
                  shortlist={state.shortlist}
                  onShortlist={toggleShortlist}
                  compare={compare}
                  onCompare={toggleCompare}
                  onNavigate={go}
                  onSave={savePlan}
                  onSource={setSource}
                  signals={state.signals}
                />
              )}
              {activeView === "compare" && (
                <CompareRoles
                  roles={compare
                    .map((id) => ranked.find((role) => role.id === id))
                    .filter(Boolean)}
                  profile={profile}
                  preferences={state.preferences}
                  onSelect={selectRole}
                  onNavigate={go}
                  onRemove={toggleCompare}
                  signals={state.signals}
                  onSource={setSource}
                />
              )}
              {activeView === "radar" && (
                <RadarView
                  profile={profile}
                  signals={state.signals}
                  scenario={state.scenario}
                  onScenario={changeScenario}
                  onSource={setSource}
                  onUpdate={signalUpdate}
                  updateCount={state.acceptedUpdates}
                  onAddSignal={customSignal}
                  onRefreshEvidence={refreshEvidence}
                  evidenceFeed={state.evidenceFeed}
                  evidenceBusy={evidenceBusy}
                  evidenceError={evidenceError}
                  skillOutlook={backend.data.skillOutlook}
                />
              )}
              {activeView === "pathway" && (
                <LearningWorkspace
                  profile={profile}
                  preferences={state.preferences}
                  role={selected}
                  plan={plan}
                  progress={state.progress}
                  notes={state.notes}
                  saved={state.saved}
                  signals={state.signals}
                  scenario={state.scenario}
                  revisions={state.revisions || []}
                  onPace={(hours) =>
                    setState((previous) => ({
                      ...previous,
                      preferences: { ...previous.preferences, hours },
                    }))
                  }
                  onComplete={markComplete}
                  onNote={(step, value) => {
                    setState((previous) => ({
                      ...previous,
                      notes: {
                        ...previous.notes,
                        [progressKey(profile, selected, step)]: value,
                      },
                    }));
                    notify(
                      "Reflection saved. It will be here for your next review.",
                    );
                  }}
                  onSave={savePlan}
                  onExport={download}
                  onNavigate={go}
                  onRestore={(item) => {
                    setPendingChange(null);
                    setState((previous) => ({
                      ...previous,
                      selectedRoleId: item.roleId,
                      scenario: item.scenario,
                      signals: item.signals || previous.signals,
                      evidenceRevision: item.evidenceRevision ?? null,
                      acceptedUpdates: (
                        item.signals || previous.signals
                      ).filter((signal) => signal.id.startsWith("demo-"))
                        .length,
                      preferences: {
                        ...previous.preferences,
                        ...item.preferences,
                        hours: item.hoursPerWeek,
                      },
                    }));
                    notify(
                      "Saved direction restored with its learning pace and scenario.",
                    );
                  }}
                  onDelete={(id) => {
                    setState((previous) => ({
                      ...previous,
                      saved: previous.saved.filter((item) => item.id !== id),
                    }));
                    notify(
                      "Saved plan removed. Your completed learning is kept.",
                    );
                  }}
                  onRename={(id, name) => {
                    setState((previous) => ({
                      ...previous,
                      saved: previous.saved.map((item) =>
                        item.id === id ? { ...item, name } : item,
                      ),
                    }));
                    notify("Plan renamed.");
                  }}
                  onShare={copySummary}
                />
              )}
            </>
          )}
          <footer className="c-footer">
            <span>
              <Icon as={ShieldCheck} size={14} />
              Your future is a human decision.
            </span>
            <span>
              <button onClick={() => go("home", false)}>About Nexus</button>
              <span>·</span>
              <button onClick={() => setAboutOpen(true)}>
                About this prototype
                <Icon as={ArrowUpRight} size={12} />
              </button>
            </span>
          </footer>
        </main>
      </div>
      <SourceDialog source={source} onClose={() => setSource(null)} />
      <StatusToast message={toast} onClose={dismissToast} />
      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title="A clearer picture. You stay in control."
      >
        <div className="c-about-intro">
          <Icon as={ShieldCheck} size={29} />
          <p>
            NexusTalent helps you turn experience into a next learning decision,
            and revisit it as the world changes.
          </p>
        </div>
        <div className="c-about-list">
          <div>
            <h3>A connected career workspace</h3>
            <p>
              Files are read in your browser. Extracted text and your reviewed
              skills are sent to the career service for intake, matching,
              scenarios and learning plans. The service retrieves dated Crossref
              research and uses explainable rules. No generative model or live
              vacancy feed is connected.
            </p>
          </div>
          <div>
            <h3>You control your profile</h3>
            <p>
              The original file is not uploaded or saved. Reviewed profile
              details are processed in memory by the career service. Plans,
              notes and progress are saved in this browser. Use fictional CVs
              for the hackathon demonstration.
            </p>
          </div>
          <div>
            <h3>Evidence, with its limits visible</h3>
            <p>
              Published resources provide context and learning material. Role
              profiles and scenario weights are illustrative. Scores are not
              hiring probabilities, time estimates are not qualifications, and
              SDG links are intended contributions.
            </p>
          </div>
        </div>
        <button
          className="c-button primary"
          onClick={() => setAboutOpen(false)}
        >
          Back to my next chapter
          <Icon as={ArrowRight} size={16} />
        </button>
      </Dialog>
      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="A little guidance for your next chapter."
      >
        <div className="c-help-list">
          {[
            [
              "1",
              "Bring your experience",
              "Import a fictional CV or choose a sample. Review the extracted skills and set a weekly learning pace.",
            ],
            [
              "2",
              "Explore the possibilities",
              "Inspect role matches, bookmark directions, and compare two or three before choosing.",
            ],
            [
              "3",
              "Keep the bigger picture in view",
              "Use the skills radar to inspect source context and explore steady, faster-AI or green-transition scenarios.",
            ],
            [
              "4",
              "Take the next small step",
              "Save your plan, open its free resources, record practice work and mark your progress.",
            ],
            [
              "5",
              "Come back with better questions",
              "Download the brief and discuss readiness, evidence and next steps with a human adviser.",
            ],
          ].map(([number, title, description]) => (
            <div key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="c-button primary" onClick={() => setHelpOpen(false)}>
          I’m ready to explore
          <Icon as={ArrowRight} size={16} />
        </button>
      </Dialog>
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Your career workspace"
      >
        <div className="c-settings-profile">
          <span>{profile.name[0]}</span>
          <div>
            <h3>{state.profile ? profile.name : "Start your next chapter"}</h3>
            <p>
              {state.profile
                ? profile.role
                : "Import a sample CV to make this workspace yours."}
            </p>
          </div>
        </div>
        <div className="c-settings-rows">
          <button
            onClick={() => {
              setSettingsOpen(false);
              go(state.profile ? "profile" : "import");
            }}
          >
            <Icon as={UserRound} />
            <span>Review profile and learning preferences</span>
            <Icon as={ChevronRight} size={16} />
          </button>
          <button
            onClick={() => {
              setSettingsOpen(false);
              setAboutOpen(true);
            }}
          >
            <Icon as={ShieldCheck} />
            <span>Privacy and prototype information</span>
            <Icon as={ChevronRight} size={16} />
          </button>
          <button onClick={() => setResetOpen(true)}>
            <Icon as={RefreshCw} />
            <span>Reset this demo workspace</span>
            <Icon as={ChevronRight} size={16} />
          </button>
        </div>
        <p className="c-small-note">
          Your workspace is stored in this browser. The career service processes
          your profile without storing it. There is no account or cloud sync.
        </p>
      </Dialog>
      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Start a fresh demo?"
      >
        <p>
          This removes the reviewed profile, saved plans, progress and
          reflections from this browser. Download your brief first if you want
          to keep a copy.
        </p>
        <div className="c-dialog-actions">
          <button
            className="c-button secondary"
            onClick={() => setResetOpen(false)}
          >
            Keep my workspace
          </button>
          <button className="c-button danger" onClick={reset}>
            Reset demo
          </button>
        </div>
      </Dialog>
      <Dialog
        open={reviewChange && Boolean(pendingChange)}
        onClose={() => setReviewChange(false)}
        title="Review before changing direction."
      >
        {pendingChange && (
          <>
            <p>
              {pendingChange.title}. Here is what changed for your selected
              direction.
            </p>
            <h3 className="c-change-role-title">{selected.title}</h3>
            <div className="c-change-comparison">
              <div>
                <span>PREVIOUS VIEW</span>
                <strong>
                  {pendingChange.scores[selected.id]}
                  <small>/100</small>
                </strong>
                <p>
                  {
                    SCENARIOS.find(
                      (item) => item.id === pendingChange.previousScenario,
                    )?.title
                  }
                </p>
                <small>Priority: {pendingChange.gaps[selected.id]}</small>
              </div>
              <Icon as={ArrowRight} size={23} />
              <div>
                <span>UPDATED VIEW</span>
                <strong>
                  {selected.score}
                  <small>/100</small>
                </strong>
                <p>
                  {SCENARIOS.find((item) => item.id === state.scenario)?.title}
                </p>
                <small>
                  Priority:{" "}
                  {selected.gaps[0]?.name || "Review your practice work"}
                </small>
              </div>
            </div>
            <div className="c-change-keep">
              <Icon as={CheckCheck} size={19} />
              <p>
                Your completed learning and reflections stay with you. Shared
                foundations remain useful across directions.
              </p>
            </div>
            {pendingChange.previousPlan && (
              <div className="c-revision-proof">
                <strong>{keptStepCount} existing learning steps kept</strong>
                <p>
                  {pendingChange.gaps[selected.id] === selected.gaps[0]?.name
                    ? "Your next priority is unchanged. The revision records the new evidence without restarting your learning. "
                    : "Your learning priorities have changed. Review the proposed order before keeping it. "}
                  {
                    plan.filter(
                      (step) =>
                        state.progress[progressKey(profile, selected, step)],
                    ).length
                  }{" "}
                  completed steps and their reflections remain recorded.
                </p>
              </div>
            )}
            <div className="c-dialog-actions">
              <button className="c-button secondary" onClick={revertChange}>
                Keep previous view
              </button>
              <button className="c-button primary" onClick={acceptChange}>
                Accept & update my plan
                <Icon as={Check} size={16} />
              </button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
function PlusArrow(props) {
  return <ArrowRight {...props} />;
}
