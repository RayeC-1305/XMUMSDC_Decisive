import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  FileText,
  GitBranch,
  Layers3,
  Leaf,
  Radio,
  RefreshCw,
  Route,
  ScanLine,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { Wordmark, BrandMark, Icon } from "./CareerPrimitives";
import {
  SOURCES,
  SAMPLE_CVS,
  DEFAULT_PREFERENCES,
  SCENARIOS,
} from "../../data/careerCatalog";
import { rankRoles, planFor } from "../../utils/careerDemo";
import "../../landing.css";

const CAPABILITIES = [
  [
    FileText,
    "Start with real experience",
    "Import a CV, review the extracted skills, and set a goal and weekly pace.",
    "Skills intake",
  ],
  [
    Radio,
    "Understand the shift",
    "Refresh live AI/workforce research from Crossref. Inspect publication dates, retrieval time and the mapping to skills.",
    "Updatable signals",
  ],
  [
    GitBranch,
    "See where skills transfer",
    "Compare directions with an explainable match index, strengths and gaps.",
    "Explainable matching",
  ],
  [
    Route,
    "Make the next step practical",
    "Turn skill gaps into ordered learning, public resources and work samples.",
    "Personalised pathways",
  ],
  [
    Leaf,
    "Connect progress to purpose",
    "See the SDG targets behind each skill, direction and learning activity.",
    "SDG mapping",
  ],
  [
    RefreshCw,
    "Adapt without losing progress",
    "Test a different future, review what changes, and keep completed learning.",
    "Uncertainty & revision",
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

export default function PitchLanding({
  onStart,
  onResume,
  onLiveDemo,
  hasWorkspace,
}) {
  const [scenario, setScenario] = useState("steady");
  const [openCriterion, setOpenCriterion] = useState(0);
  const landingRef = useRef(null);
  useEffect(() => {
    const root = landingRef.current;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    function configureMotion() {
      observer?.disconnect();
      root.dataset.motion = media.matches ? "reduced" : "ready";
      if (media.matches || !("IntersectionObserver" in window)) {
        root
          .querySelectorAll("[data-reveal]")
          .forEach((element) => element.classList.add("n-in-view"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("n-in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
      );
      root
        .querySelectorAll("[data-reveal]")
        .forEach((element) => observer.observe(element));
    }
    configureMotion();
    media.addEventListener("change", configureMotion);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", configureMotion);
    };
  }, []);
  const profile = SAMPLE_CVS[0];
  const ranked = useMemo(
    () => rankRoles(profile, SOURCES, scenario),
    [scenario, profile],
  );
  const direction = ranked[0];
  const plan = useMemo(
    () => planFor(profile, direction, DEFAULT_PREFERENCES),
    [profile, direction],
  );
  const next = plan[1];
  const active = SCENARIOS.find((item) => item.id === scenario);
  function jump(event, id) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  const start = () => {
    onStart();
  };
  return (
    <div className="n-landing" id="home" ref={landingRef}>
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
        <button className="n-button n-nav-cta" onClick={start}>
          Open the demo <Icon as={ArrowUpRight} size={16} />
        </button>
      </header>

      <main id="pitch-content" tabIndex={-1}>
        <section className="n-hero" aria-labelledby="pitch-title">
          <div className="n-hero-grid">
            <div className="n-hero-copy">
              <span className="n-eyebrow">
                <i /> Career intelligence that moves
              </span>
              <h1 id="pitch-title">
                <span className="n-title-line">
                  <span>Plans evolve.</span>
                </span>{" "}
                <span className="n-title-line">
                  <span>Progress stays.</span>
                </span>
              </h1>
              <p className="n-hero-lead">
                A career plan that explains every revision.
              </p>
              <p className="n-hero-description">
                New AI evidence can change your next learning step. Nexus shows
                what changed, why it changed, and which completed learning stays
                with you.
              </p>
              <div className="n-hero-actions">
                <button
                  className="n-button n-button-bright"
                  onClick={(event) => jump(event, "adapt")}
                >
                  See the plan adapt <Icon as={ArrowRight} size={18} />
                </button>
                <button className="n-text-link" onClick={start}>
                  Try the full demo <Icon as={ArrowUpRight} size={16} />
                </button>
              </div>
              <div className="n-hero-note">
                <Icon as={ShieldCheck} size={15} /> Interactive prototype. Human
                decisions stay central.
              </div>
            </div>
            <div className={`n-hero-visual scenario-${scenario}`}>
              <span className="n-mono-x" aria-hidden="true">
                x
              </span>
              <svg
                className="n-signal-lines"
                viewBox="0 0 540 540"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 125h65q28 0 28 28v35q0 28 28 28h325M60 425h61q28 0 28-28v-25q0-28 28-28h335"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="15" cy="125" r="4" fill="currentColor" />
                <circle cx="512" cy="344" r="4" fill="currentColor" />
              </svg>
              <div className="n-direction-preview">
                <div className="n-preview-header">
                  <span>
                    <BrandMark size={22} /> Your adaptive pathway
                  </span>
                  <span className="n-live-label">Interactive preview</span>
                </div>
                <div className="n-preview-profile">
                  <span className="n-profile-monogram">SR</span>
                  <div>
                    <strong>Siti Rosli</strong>
                    <span>Operations coordinator</span>
                  </div>
                  <span className="n-profile-label">Fictional profile</span>
                </div>
                <div className="n-preview-path">
                  <i />
                  <span>Transfer your experience</span>
                  <Icon as={ArrowRight} size={16} />
                </div>
                <div className="n-preview-direction">
                  <span>Direction to explore</span>
                  <h2 key={scenario} className="n-revision">
                    {direction.title}
                  </h2>
                  <div>
                    <span>
                      <Check size={14} /> {direction.known.length} existing
                      strengths
                    </span>
                    <span>{direction.gaps.length} skills to build</span>
                  </div>
                </div>
                <div className="n-preview-learning">
                  <span className="n-preview-step">
                    <CheckCheck size={18} />
                  </span>
                  <div>
                    <small>Keep your progress</small>
                    <strong>AI foundations</strong>
                  </div>
                  <span>Completed*</span>
                </div>
                <div className="n-preview-next">
                  <span>
                    <Zap size={17} />
                  </span>
                  <div key={scenario} className="n-revision">
                    <small>
                      {scenario === "steady"
                        ? "Next learning priority"
                        : "Priority in this scenario"}
                    </small>
                    <strong>{next.title}</strong>
                  </div>
                  <span className="n-hours">{next.hours}h</span>
                </div>
                <div className="n-preview-foot">
                  <span>
                    <RefreshCw size={13} /> Change the scenario below
                  </span>
                  <small>*Illustrative progress</small>
                </div>
              </div>
              <span className="n-visual-caption">
                A shift in the world. A clearer next step.
              </span>
            </div>
          </div>
          <div className="n-hero-scenarios">
            <span>Move the future. Watch the plan respond.</span>
            <div role="group" aria-label="Hero preview scenario">
              {SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={scenario === item.id}
                  className={scenario === item.id ? "active" : ""}
                  onClick={() => setScenario(item.id)}
                >
                  {item.id === "rapid" ? (
                    <Zap size={15} />
                  ) : item.id === "green" ? (
                    <Leaf size={15} />
                  ) : (
                    <Layers3 size={15} />
                  )}
                  {item.short}
                </button>
              ))}
            </div>
          </div>
          <span className="sr-only" role="status">
            {active.title}: {direction.title}. Next priority: {next.title}.
            Illustrative completed learning is preserved.
          </span>
        </section>

        <div className="n-proof-strip">
          <span>Built for SDC Hackathon 2026</span>
          <span>Domain 1 · Aiversecity</span>
          <span>SDG 4.4 / 8.5</span>
          <a href="#home/demo" onClick={(event) => jump(event, "demo")}>
            Explore the working prototype <ArrowUpRight size={15} />
          </a>
        </div>

        <section className="n-problem n-section" id="how" data-reveal="story">
          <div className="n-section-heading">
            <span className="n-eyebrow">The gap we’re closing</span>
            <h2>
              The world updates.
              <br />
              Career plans stand still.
            </h2>
          </div>
          <div className="n-problem-story">
            <p>
              A worker sees another AI breakthrough. They have years of
              experience, a limited amount of learning time, and one practical
              question:
            </p>
            <blockquote>“What should I learn next—and why?”</blockquote>
            <p>
              Nexus turns that uncertainty into a decision you can inspect: what
              transfers, what needs work, and what would make you change course.
            </p>
            <div className="n-problem-shift">
              <span>A static course list</span>
              <ArrowRight size={22} />
              <strong>A living career decision</strong>
            </div>
          </div>
        </section>

        <section className="n-adapt-section" id="adapt">
          <div className="n-section n-adapt-layout" data-reveal="adapt">
            <div className="n-adapt-copy">
              <span className="n-eyebrow">Flexible by design</span>
              <h2>
                New signal.
                <br />
                New priorities.
                <br />
                Still your progress.
              </h2>
              <p>
                A useful plan can bend. Test how a faster AI shift or a green
                transition changes a direction and the skills worth learning
                next.
              </p>
              <div
                className="n-scenario-picker"
                role="group"
                aria-label="Interactive planning scenario"
              >
                {SCENARIOS.map((item) => (
                  <button
                    key={item.id}
                    aria-pressed={scenario === item.id}
                    onClick={() => setScenario(item.id)}
                    className={scenario === item.id ? "active" : ""}
                  >
                    <span>{item.title}</span>
                    <ArrowUpRight size={17} />
                  </button>
                ))}
              </div>
              <small className="n-simulation-note">
                Illustrative local preview. The full workspace uses the career
                API and retrieved evidence. Scenario weights are assumptions.
              </small>
              <button className="n-live-demo-link" onClick={onLiveDemo}>
                Try a live evidence refresh <ArrowUpRight size={17} />
              </button>
              <small className="n-live-demo-caption">
                Opens the research feed with a fictional sample workspace.
              </small>
            </div>
            <div className="n-adapt-board">
              <div className="n-board-top">
                <span className="n-board-status">
                  <i /> {active.title}
                </span>
                <span>4 hours / week</span>
              </div>
              <h3 key={scenario} className="n-revision">
                {direction.title}
              </h3>
              <p>{direction.description}</p>
              <div className="n-board-stats">
                <div>
                  <strong>
                    {direction.score}
                    <small>/100</small>
                  </strong>
                  <span>Illustrative match index</span>
                </div>
                <div>
                  <strong>
                    {Math.ceil(
                      plan.reduce((sum, step) => sum + step.hours, 0) / 4,
                    )}
                    <small>weeks</small>
                  </strong>
                  <span>Estimated learning sprint</span>
                </div>
              </div>
              <div className="n-adapt-steps">
                <div className="n-adapt-step done">
                  <span>
                    <Check size={17} />
                  </span>
                  <div>
                    <small>Foundation · preserved</small>
                    <strong>Build your AI foundations</strong>
                  </div>
                  <span className="n-step-state">Sample completion</span>
                </div>
                {plan.slice(1, 3).map((step, index) => (
                  <div
                    key={step.id}
                    className={`n-adapt-step ${index === 0 ? "next" : ""}`}
                  >
                    <span>{index + 2}</span>
                    <div>
                      <small>
                        {index === 0
                          ? "Highest-priority gap"
                          : "Build the next layer"}
                      </small>
                      <strong>{step.title}</strong>
                    </div>
                    <span className="n-step-state">{step.hours} hours</span>
                  </div>
                ))}
              </div>
              <div className="n-board-review">
                <Icon as={ScanLine} size={20} />
                <span>
                  Inspect the change. Keep it or go back.
                  <small>Your completed learning stays with you.</small>
                </span>
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        </section>

        <section
          className="n-section n-capability-section"
          id="domain"
          data-reveal="capabilities"
        >
          <div className="n-section-heading n-heading-wide">
            <div>
              <span className="n-eyebrow">One connected Domain 1 journey</span>
              <h2>
                From your CV
                <br />
                to your next chapter.
              </h2>
            </div>
            <p>
              Six required capabilities, connected around one useful outcome: a
              learning decision the worker and adviser can explain.
            </p>
          </div>
          <div className="n-capabilities">
            {CAPABILITIES.map(([Glyph, title, copy, label]) => (
              <article key={label}>
                <span className="n-capability-icon">
                  <Glyph size={23} />
                </span>
                <div>
                  <small>{label}</small>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="n-judging-section">
          <div className="n-section n-judging-layout" data-reveal="criteria">
            <div>
              <span className="n-eyebrow">The judging lens</span>
              <h2>
                A clear problem.
                <br />A testable response.
              </h2>
              <p>
                The Domain 1 rubric rewards a focused idea, a relevant solution,
                feasible execution and a story people can follow.
              </p>
              <span className="n-domain-label">
                <Target size={17} /> Preliminary judging criteria
              </span>
            </div>
            <div className="n-criteria">
              {CRITERIA.map(([weight, label, title, copy], index) => (
                <div
                  key={label}
                  className={openCriterion === index ? "open" : ""}
                >
                  <button
                    aria-expanded={openCriterion === index}
                    aria-controls={`criterion-${index}`}
                    onClick={() =>
                      setOpenCriterion(openCriterion === index ? null : index)
                    }
                  >
                    <span className="n-criterion-weight">{weight}</span>
                    <span>
                      <small>{label}</small>
                      <strong>{title}</strong>
                    </span>
                    <ChevronDown size={19} />
                  </button>
                  <p id={`criterion-${index}`} hidden={openCriterion !== index}>
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="n-section n-buyer-section" data-reveal="story">
          <div className="n-section-heading">
            <span className="n-eyebrow">A product with a place to start</span>
            <h2>
              Better career conversations.
              <br />A repeatable service.
            </h2>
          </div>
          <div>
            <p>
              For career centres and reskilling providers, Nexus is a proposed
              workspace for preparing, agreeing and revisiting the next learning
              decision.
            </p>
            <div className="n-buyer-outcomes">
              <span>
                <FileText size={18} /> A sourced transition brief
              </span>
              <span>
                <GitBranch size={18} /> Alternatives with reasons
              </span>
              <span>
                <RefreshCw size={18} /> A review when assumptions shift
              </span>
            </div>
            <small>
              Initial buyer hypothesis. Adviser pilots, pricing and measured
              outcomes are the next validation step.
            </small>
          </div>
        </section>

        <section className="n-demo-section" id="demo">
          <div className="n-demo-grid" aria-hidden="true" />
          <div className="n-demo-inner">
            <span className="n-eyebrow">The pitch becomes the product</span>
            <h2>
              Make your
              <br />
              next move.
            </h2>
            <p>
              Start with a CV. Review your skills. Choose a direction.
              <br />
              Leave with a plan you can come back to.
            </p>
            <div className="n-demo-actions">
              <button className="n-button n-button-bright" onClick={start}>
                Enter the interactive demo <ArrowRight size={19} />
              </button>
              {hasWorkspace && (
                <button className="n-text-link" onClick={onResume}>
                  Resume your workspace <ArrowUpRight size={17} />
                </button>
              )}
            </div>
            <span className="n-demo-note">
              <ShieldCheck size={15} /> No sign-up. Original files stay in your
              browser; extracted text is processed without being saved.
            </span>
            <div className="n-demo-disclosure">
              Connected career API · Explainable rule-based matching · Live
              research retrieval
              <br />
              Sources provide context; mapping weights remain assumptions. No AI
              inference or live vacancy feed is connected.
            </div>
          </div>
          <div className="n-demo-signature" aria-hidden="true">
            <Wordmark />
          </div>
        </section>
      </main>
      <footer className="n-footer">
        <Wordmark />
        <span>Advance with every shift.</span>
        <span>SDC Hackathon 2026 · Domain 1</span>
        <button onClick={start}>
          Open demo <ArrowUpRight size={14} />
        </button>
      </footer>
    </div>
  );
}
