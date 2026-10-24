import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  FileText,
  GitBranch,
  Leaf,
  Radio,
  RefreshCw,
  Route,
  ShieldCheck,
} from "lucide-react";
import { Wordmark, Icon, SdgTags } from "./CareerPrimitives";
import {
  SOURCES,
  SAMPLE_CVS,
  DEFAULT_PREFERENCES,
  SCENARIOS,
  SKILL_MAP,
} from "../../data/careerCatalog";
import { rankRoles, planFor } from "../../utils/careerDemo";
import {
  transitionInterface,
  useReducedMotion,
} from "../../utils/interfaceMotion";
import {
  CareerMap,
  MotionControl,
  ProcessRibbon,
  useLandingMotion,
} from "./CareerMotion";
import "../../landing.css";

const CAPABILITIES = [
  [
    FileText,
    "Skills intake",
    "Start with real experience",
    "Import a CV, review the extracted skills, and set a goal and weekly pace.",
  ],
  [
    Radio,
    "Updatable signals",
    "Understand the shift",
    "Refresh live AI/workforce research from Crossref. Inspect publication dates, retrieval time and the mapping to skills.",
  ],
  [
    GitBranch,
    "Explainable matching",
    "See where skills transfer",
    "Compare directions with an explainable match index, strengths and clear skills gaps.",
  ],
  [
    Route,
    "Personalised pathways",
    "Make the next step practical",
    "Turn skill gaps into ordered learning with estimated time, free public resources and work samples.",
  ],
  [
    Leaf,
    "SDG mapping",
    "Connect progress to purpose",
    "See the SDG targets behind every role and skill, and how your chosen direction contributes.",
  ],
  [
    RefreshCw,
    "Uncertainty & revision",
    "Adapt without losing progress",
    "Explore three future scenarios, review what changes, and keep completed learning. Predictions remain estimates.",
  ],
];
const CRITERIA = [
  [
    "30%",
    "Innovation",
    "The decision evolves",
    "A dated revision brief shows what changed, why, and what completed learning is kept. Users can accept or revert every proposal.",
  ],
  [
    "25%",
    "Problem–solution fit",
    "A next step worth the time",
    "Workers need a practical learning decision. Advisers need to explain why that step fits a person’s experience and constraints.",
  ],
  [
    "25%",
    "Feasibility",
    "A journey you can try",
    "The connected workspace includes CV intake, server matching, dated evidence, learning progress and an exportable brief.",
  ],
  [
    "20%",
    "Clarity",
    "Every decision has a reason",
    "The demo makes strengths, gaps, source context and assumptions visible, then produces a brief for a human conversation.",
  ],
];
const CHAPTERS = [
  ["how", "Your experience"],
  ["evidence", "The evidence"],
  ["possibilities", "Your possibilities"],
  ["adapt", "The revision"],
  ["domain", "The whole journey"],
  ["demo", "Your next move"],
];

function ScenarioPicker({ value, onChange, label }) {
  return (
    <div
      className="n-scenario-picker"
      role="group"
      aria-label={label}
      style={{
        "--scenario-index": SCENARIOS.findIndex((item) => item.id === value),
      }}
    >
      {SCENARIOS.map((item) => (
        <button
          key={item.id}
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.short}
        </button>
      ))}
    </div>
  );
}

export default function PitchLanding({
  onStart,
  onResume,
  onLiveDemo,
  hasWorkspace,
}) {
  const [scenario, setScenario] = useState("steady");
  const [accepted, setAccepted] = useState(false);
  const [openCriterion, setOpenCriterion] = useState(0);
  const [chapter, setChapter] = useState("how");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const landingRef = useRef(null);
  const profile = SAMPLE_CVS[0];
  const ranked = useMemo(
    () => rankRoles(profile, SOURCES, scenario),
    [scenario, profile],
  );
  const baselineRoles = useMemo(
    () => rankRoles(profile, SOURCES, "steady"),
    [profile],
  );
  const baseline = baselineRoles[0];
  const direction = ranked[0];
  const plan = useMemo(
    () => planFor(profile, direction, DEFAULT_PREFERENCES),
    [profile, direction],
  );
  const originalPlan = useMemo(
    () => planFor(profile, baseline, DEFAULT_PREFERENCES),
    [profile, baseline],
  );
  const active = SCENARIOS.find((item) => item.id === scenario);
  const next = plan[1];
  const changed = scenario !== "steady";

  useLandingMotion(landingRef, paused || reduced, setChapter);
  useEffect(() => {
    const update = () => {
      if (landingRef.current)
        landingRef.current.dataset.pageVisible = String(
          document.visibilityState === "visible",
        );
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  function jump(event, id) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const heading = target.querySelector("h2") || target;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    const offset =
      (landingRef.current.querySelector(".n-nav")?.offsetHeight || 80) +
      (landingRef.current.querySelector(".n-story-nav")?.offsetHeight || 64) +
      24;
    window.scrollTo({
      top: heading.getBoundingClientRect().top + window.scrollY - offset,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function chooseScenario(id) {
    const update = () => {
      setScenario(id);
      setAccepted(false);
    };
    if (paused) update();
    else transitionInterface(update, "revision");
  }

  return (
    <div
      className="n-landing"
      id="home"
      ref={landingRef}
      data-motion={reduced ? "reduced" : paused ? "paused" : "ready"}
    >
      <MotionControl
        paused={paused}
        reduced={reduced}
        onToggle={() => setPaused((value) => !value)}
      />
      <a className="n-skip" href="#pitch-content">
        Skip to content
      </a>
      <header className="n-nav">
        <a className="n-logo" href="#home" aria-label="Nexus home">
          <Wordmark />
        </a>
        <nav aria-label="Product introduction">
          <a href="#home/how" onClick={(event) => jump(event, "how")}>
            The idea
          </a>
          <a href="#home/adapt" onClick={(event) => jump(event, "adapt")}>
            See it adapt
          </a>
          <a href="#home/domain" onClick={(event) => jump(event, "domain")}>
            Built for Domain 1
          </a>
        </nav>
        <button className="n-button n-nav-cta" onClick={onStart}>
          Open the demo <Icon as={ArrowUpRight} size={16} />
        </button>
      </header>
      <main id="pitch-content" tabIndex={-1}>
        <section className="n-hero" aria-labelledby="pitch-title">
          <div className="n-hero-copy">
            <h1 id="pitch-title">
              <span className="n-hero-line">
                <span>Plans evolve.</span>
              </span>{" "}
              <span className="n-hero-line">
                <span>Progress stays.</span>
              </span>
            </h1>
            <p className="n-hero-lead">
              A career plan that explains every revision.
            </p>
            <p className="n-hero-description">
              Know what to learn next as AI changes work.
              <br className="n-desktop-break" /> Keep the experience—and the
              progress—you already have.
            </p>
            <div className="n-hero-actions">
              <button
                className="n-button n-button-bright"
                onClick={(event) => jump(event, "adapt")}
              >
                See the plan adapt <Icon as={ArrowRight} size={17} />
              </button>
              <button className="n-text-link" onClick={onStart}>
                Try the full demo <Icon as={ArrowUpRight} size={16} />
              </button>
            </div>
            <p className="n-hero-note">
              Built for your next move. Designed for a changing world.
            </p>
          </div>
          <CareerMap
            profile={profile}
            roles={baselineRoles.slice(0, 3)}
            paused={paused}
            reduced={reduced}
          />
          <div className="n-hero-bottom">
            <span>*Illustrative progress · fictional sample profile</span>
            <a href="#home/how" onClick={(event) => jump(event, "how")}>
              <Icon as={ArrowDown} size={15} /> Follow the journey
            </a>
            <span>SDC Hackathon 2026 · Domain 1</span>
          </div>
        </section>
        <nav
          className="n-story-nav"
          aria-label="Product story chapters"
          style={{
            "--chapter-index": CHAPTERS.findIndex(([id]) => id === chapter),
          }}
        >
          {CHAPTERS.map(([id, label], i) => (
            <a
              key={id}
              href={"#home/" + id}
              aria-current={chapter === id ? "step" : undefined}
              onClick={(event) => jump(event, id)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <ProcessRibbon />

        <section className="n-chapter n-experience" id="how" data-chapter>
          <div className="n-chapter-copy">
            <h2>
              Your experience
              <br />
              is a starting point.
            </h2>
            <p>
              A worker sees another AI breakthrough. They have years of
              experience, limited learning time, and one practical question.
            </p>
            <blockquote>“What should I learn next—and why?”</blockquote>
            <p>
              Nexus starts with what you already know. Import your CV, review
              your skills, and set a direction that fits your life.
            </p>
          </div>
          <div className="n-profile-document">
            <div className="n-document-bar">
              <span>
                <Icon as={FileText} size={16} /> siti-rosli-cv.pdf
              </span>
              <span>Fictional sample</span>
            </div>
            <div className="n-profile-document-body">
              <span className="n-profile-monogram">SR</span>
              <h3>{profile.name}</h3>
              <p>{profile.role}</p>
              <div className="n-document-rule" />
              <strong>Experience you can build on</strong>
              <ul>
                {profile.tasks.slice(0, 2).map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
              <div className="n-profile-skills">
                {profile.skills.slice(0, 4).map((id) => (
                  <span
                    key={id}
                    style={{ "--skill-order": profile.skills.indexOf(id) }}
                  >
                    {SKILL_MAP[id].name}
                  </span>
                ))}
              </div>
              <div className="n-document-review">
                <Icon as={Check} size={17} />
                <span>You review every skill before matching.</span>
              </div>
            </div>
          </div>
        </section>
        <section className="n-chapter n-evidence" id="evidence" data-chapter>
          <div className="n-chapter-copy">
            <h2>
              The world updates.
              <br />
              Your plan should, too.
            </h2>
            <p>
              A course list can stand still while the work around it changes.
              Nexus connects evidence to skills, so you can inspect the reason
              behind a recommendation.
            </p>
            <button className="n-text-link n-cyan-link" onClick={onLiveDemo}>
              Try a live evidence refresh <Icon as={ArrowUpRight} size={16} />
            </button>
            <small>
              Opens the research feed with a fictional sample. Publication
              dates, retrieval times and local mapping rules remain visible.
            </small>
          </div>
          <div className="n-evidence-preview">
            <div className="n-panel-label">
              <Icon as={Radio} size={16} />
              <span>Evidence before advice</span>
              <span>Curated context</span>
            </div>
            {SOURCES.slice(0, 2).map((item) => (
              <a
                className="n-evidence-item"
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <time dateTime={item.date}>
                    {new Date(item.date + "T00:00:00Z").toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      },
                    )}
                  </time>
                  <span>{item.publisher}</span>
                </div>
                <h3>{item.title}</h3>
                <span>
                  Read the source <Icon as={ArrowUpRight} size={14} />
                </span>
              </a>
            ))}
            <p>
              These are curated examples. The full workspace refreshes Crossref
              research. Source context and authored weights are separate;
              neither is a vacancy forecast.
            </p>
          </div>
        </section>
        <section
          className="n-chapter n-possibilities"
          id="possibilities"
          data-chapter
        >
          <div className="n-chapter-copy">
            <h2>
              More than one future.
              <br />A reason for each.
            </h2>
            <p>
              See where your skills transfer, what you need to build, and why a
              direction fits. Compare alternatives before investing your time.
            </p>
            <p className="n-muted-note">
              Sample matches for Siti under steady adoption. A match index is a
              comparison aid, not a hiring probability.
            </p>
          </div>
          <div className="n-role-preview">
            {baselineRoles.slice(0, 3).map((role, i) => (
              <article
                className={i === 0 ? "n-role-top" : ""}
                key={role.id}
                style={{ "--role-order": i }}
              >
                <div className="n-role-rank">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3>{role.title}</h3>
                  <p>
                    {role.known.length} existing strengths <span>·</span>{" "}
                    {role.gaps.length} skills to build
                  </p>
                  {i === 0 && <SdgTags targets={role.targets} compact />}
                </div>
                <div className="n-role-index">
                  <strong>{role.score}</strong>
                  <span>/100</span>
                </div>
              </article>
            ))}
            <div className="n-role-explanation">
              <Icon as={ShieldCheck} size={16} /> Profile, transferable
              strengths and scenario context. Every score can be inspected.
            </div>
          </div>
        </section>
        <section className="n-adapt-section" id="adapt" data-chapter>
          <div className="n-adapt-heading">
            <h2>
              Change the future.
              <br />
              <span>Keep your progress.</span>
            </h2>
            <p>
              A useful plan can bend. Choose a scenario and watch the direction
              and learning priorities respond.
            </p>
            <ScenarioPicker
              value={scenario}
              onChange={chooseScenario}
              label="Interactive planning scenario"
            />
          </div>
          <div
            className={
              "n-revision-stage" +
              (changed ? " has-revision" : "") +
              (accepted ? " is-accepted" : "")
            }
          >
            <div className="n-revision-toolbar">
              <span>
                <Icon as={GitBranch} size={16} /> Siti’s career pathway
              </span>
              <span>
                {accepted
                  ? "Preview revision accepted"
                  : changed
                    ? "Proposed scenario revision"
                    : "Current plan · steady adoption"}
              </span>
            </div>
            <div className="n-revision-columns">
              <div className="n-revision-before">
                <span className="n-stage-label">Starting direction</span>
                <h3>{baseline.title}</h3>
                <div className="n-preview-priority">
                  <span>Original next priority</span>
                  <strong>{originalPlan[1].title}</strong>
                  <small>{originalPlan[1].hours} estimated hours</small>
                </div>
                <p>
                  Based on declared skills, transferable strengths and the
                  steady-adoption scenario.
                </p>
              </div>
              <div className="n-revision-after" key={scenario}>
                <span className="n-stage-label">
                  {changed
                    ? "Direction in this scenario"
                    : "Your direction to explore"}
                </span>
                <h3>{direction.title}</h3>
                <div className="n-preview-priority">
                  <span>
                    {changed
                      ? "Priority in this scenario"
                      : "Next learning priority"}
                  </span>
                  <strong>{next.title}</strong>
                  <small>{next.hours} estimated hours</small>
                </div>
                <p>{active.description}</p>
              </div>
            </div>
            <div className="n-preserved-step">
              <span className="n-preserved-check">
                <Icon as={CheckCheck} size={22} />
              </span>
              <div>
                <strong>AI foundations</strong>
                <span>Completed learning is kept in every scenario.</span>
              </div>
              <span className="n-preserved-label">
                <Icon as={Check} size={14} /> Preserved*
              </span>
            </div>
            <div className="n-revision-action">
              <span>
                {accepted
                  ? "You accepted this illustrative revision. The full workspace keeps a dated decision record."
                  : "Inspect the change. Keep it or go back. The decision stays yours."}
              </span>
              <button
                className={
                  "n-button " +
                  (changed ? "n-button-bright" : "n-button-outline")
                }
                disabled={!changed}
                onClick={() =>
                  accepted
                    ? chooseScenario("steady")
                    : paused
                      ? setAccepted(true)
                      : transitionInterface(() => setAccepted(true), "revision")
                }
              >
                {accepted ? "Reset preview" : "Accept preview revision"}
                <Icon as={accepted ? RefreshCw : Check} size={16} />
              </button>
            </div>
          </div>
          <p className="n-simulation-note">
            *Illustrative completion. This preview uses local rules and curated
            context; scenario weights and learning times are estimates. The full
            workspace uses the career API and retrieved evidence.
          </p>
          <span className="sr-only" role="status">
            {active.title}: {direction.title}. Next priority: {next.title}.
            Illustrative completed learning is preserved.
            {accepted ? " Preview revision accepted." : ""}
          </span>
        </section>
        <section className="n-domain-section" id="domain" data-chapter>
          <div className="n-domain-heading">
            <h2>
              From your CV
              <br />
              to your next chapter.
            </h2>
            <p>Six Domain 1 capabilities. One connected learning decision.</p>
          </div>
          <div className="n-capabilities">
            {CAPABILITIES.map(([Glyph, label, title, copy], i) => (
              <details key={label} open={i === 0 ? true : undefined}>
                <summary>
                  <span className="n-capability-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon as={Glyph} size={20} />
                  <span>{label}</span>
                  <Icon as={ChevronDown} size={19} />
                </summary>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section className="n-judging-section">
          <div className="n-judging-layout">
            <div>
              <h2>
                A clear problem.
                <br />A testable response.
              </h2>
              <p>
                The Domain 1 rubric rewards a focused idea, a relevant solution,
                feasible execution and a story people can follow.
              </p>
              <span className="n-muted-note">Preliminary judging criteria</span>
            </div>
            <div className="n-criteria">
              {CRITERIA.map(([weight, label, title, copy], i) => (
                <div key={label}>
                  <button
                    aria-expanded={openCriterion === i}
                    aria-controls={"criterion-" + i}
                    onClick={() =>
                      setOpenCriterion(openCriterion === i ? null : i)
                    }
                  >
                    <span className="n-criterion-weight">{weight}</span>
                    <span>
                      <small>{label}</small>
                      <strong>{title}</strong>
                    </span>
                    <Icon as={ChevronDown} size={18} />
                  </button>
                  <p id={"criterion-" + i} hidden={openCriterion !== i}>
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="n-buyer-section">
          <h2>
            Better career conversations.
            <br />A repeatable service.
          </h2>
          <div>
            <p>
              For career centres and reskilling providers, Nexus is a proposed
              workspace for preparing, agreeing and revisiting the next learning
              decision.
            </p>
            <ul>
              <li>A sourced transition brief</li>
              <li>Alternatives with reasons</li>
              <li>A review when assumptions shift</li>
            </ul>
            <small>
              Initial buyer hypothesis. Adviser pilots, pricing and measured
              outcomes are the next validation step.
            </small>
          </div>
        </section>
        <section className="n-demo-section" id="demo" data-chapter>
          <div className="n-demo-inner">
            <h2>
              Now make it
              <br />
              <span>your next move.</span>
            </h2>
            <p>
              Start with your CV. Review your skills. Choose a direction.
              <br className="n-desktop-break" /> Leave with a plan you can come
              back to.
            </p>
            <div className="n-demo-actions">
              <button className="n-button n-button-bright" onClick={onStart}>
                Enter the interactive demo <Icon as={ArrowRight} size={18} />
              </button>
              {hasWorkspace && (
                <button className="n-text-link" onClick={onResume}>
                  Resume your workspace <Icon as={ArrowUpRight} size={16} />
                </button>
              )}
            </div>
            <span className="n-demo-note">
              <Icon as={ShieldCheck} size={15} /> No sign-up. Original files
              stay in your browser; extracted text is processed without being
              saved.
            </span>
            <details className="n-prototype-details">
              <summary>
                What’s working in this prototype{" "}
                <Icon as={ChevronDown} size={15} />
              </summary>
              <p>
                Connected career API, explainable rule-based matching and live
                research retrieval. Sources provide context; mapping weights
                remain assumptions. No AI inference or live vacancy feed is
                connected. Human decisions stay central.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer className="n-footer">
        <Wordmark />
        <span>Advance with every shift.</span>
        <span>SDC Hackathon 2026 · Domain 1</span>
        <button onClick={onStart}>
          Open demo <Icon as={ArrowUpRight} size={14} />
        </button>
      </footer>
    </div>
  );
}
