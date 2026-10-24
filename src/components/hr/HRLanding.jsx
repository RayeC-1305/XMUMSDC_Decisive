import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, GitBranch,
  Leaf, Radio, ShieldCheck, Users,
} from "lucide-react";
import { DEFAULT_PREFERENCES, SAMPLE_CVS, SCENARIOS, SOURCES, SKILL_MAP } from "../../data/careerCatalog";
import { planFor, rankRoles } from "../../utils/careerDemo";
import HRLandingExplorer from "./HRLandingExplorer";
import "./hrLanding.css";

const chapters = [
  ["setup", "Choose a shared starting point", "Load a fictional department baseline."],
  ["invite", "Invite with care", "Create, share and manage a real survey link."],
  ["respond", "Hear from people", "Submit a synthetic skills reflection."],
  ["skills", "Make signals legible", "Explore declared skills and role pathways."],
  ["scenarios", "Compare possible futures", "Change assumptions; inspect the sources."],
  ["plan", "Turn insight into learning", "Review cohorts and ordered pathways."],
  ["impact", "Prepare a human review", "Bring priorities, review checks and notes into a discussion briefing."],
];

function ScenarioPreview() {
  const [scenario, setScenario] = useState("steady");
  const profile = SAMPLE_CVS[0];
  const roles = useMemo(() => rankRoles(profile, SOURCES, scenario), [profile, scenario]);
  const selected = roles[0];
  const pathway = useMemo(() => planFor(profile, selected, DEFAULT_PREFERENCES), [profile, selected]);
  const currentScenario = SCENARIOS.find((item) => item.id === scenario) || SCENARIOS[0];
  return <div className="hrl-live-preview" aria-label="Interactive synthetic career pathway preview">
    <div className="hrl-preview-head"><span><i /> INTERACTIVE PREVIEW</span><span>CAREER ENGINE</span></div>
    <div className="hrl-preview-profile"><span className="hrl-avatar">SR</span><span><small>FICTIONAL PROFILE · SYNTHETIC</small><strong>{profile.name}</strong><em>{profile.role}</em></span><span className="hrl-preview-arrow"><ArrowUpRight size={16} /></span></div>
    <div className="hrl-preview-question"><span>ONE QUESTION</span><strong>Where could this experience travel?</strong></div>
    <div className="hrl-preview-controls">
      <span>Planning assumption</span>
      <div className="hrl-scenario-tabs" role="group" aria-label="Choose synthetic preview scenario">
        {SCENARIOS.map((item) => <button key={item.id} type="button" aria-pressed={scenario === item.id} onClick={() => setScenario(item.id)}>{item.short || item.title}</button>)}
      </div>
    </div>
    <div className="hrl-preview-result" key={scenario} aria-live="polite" aria-atomic="true">
      <div className="hrl-result-index"><small>TOP DIRECTION</small><b>{selected.score}<i>/100</i></b><span>comparison index</span></div>
      <div className="hrl-result-copy"><small>{currentScenario.title}</small><strong>{selected.title}</strong><span>{selected.known.length} declared strengths <i>·</i> {selected.gaps.length} skills to explore</span></div>
    </div>
    <div className="hrl-preview-next"><span><GitBranch size={14} /> NEXT LEARNING PRIORITY</span><strong>{pathway[1]?.title || "Review experience with a person"}</strong><small>{pathway[1]?.hours || 0} estimated hours · after AI foundations · sample plan only</small></div>
    <div className="hrl-preview-skills">{profile.skills.slice(0, 4).map((id) => <span key={id}><Check size={11} />{SKILL_MAP[id]?.name || id}</span>)}</div>
    <p className="hrl-preview-disclosure"><ShieldCheck size={14} /> Example uses the real career catalog and local matching rules. It is not workforce data, a vacancy, or an employee assessment.</p>
  </div>;
}

export default function HRLanding() {
  const [activeChapter, setActiveChapter] = useState(0);
  const rootRef = useRef(null);
  const journeyRef = useRef(null);
  useEffect(() => {
    const nav = journeyRef.current;
    if (!nav) return;
    const keepChapterVisible = () => {
      const chapter = nav.querySelector('[aria-current="step"]');
      if (!chapter) return;
      const frame = nav.getBoundingClientRect();
      const item = chapter.getBoundingClientRect();
      nav.scrollTo({
        left: nav.scrollLeft + item.left - frame.left - (frame.width - item.width) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    };
    keepChapterVisible();
    const observer = new ResizeObserver(keepChapterVisible);
    observer.observe(nav);
    nav.querySelectorAll("button").forEach(button => observer.observe(button));
    return () => observer.disconnect();
  }, [activeChapter]);
  useEffect(() => {
    const nodes = [...rootRef.current.querySelectorAll("[data-hr-reveal]")];
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const items = chapters.map(([id]) => document.getElementById(`hrl-${id}`)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveChapter(items.indexOf(visible.target));
    }, { rootMargin: "-25% 0px -58% 0px", threshold: [0, .2, .5] });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  function jumpTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const focusTarget = target.querySelector("h2") || target;
    focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return <div className="hr-landing" ref={rootRef}>
    <a className="hrl-skip" href="#hrl-content">Skip to the introduction</a>
    <header className="hrl-nav">
      <a className="hrl-brand" href="/hr" aria-label="NexusTalent employer introduction"><span className="hrl-mark">N</span><span>NexusTalent<small>People &amp; capability planning</small></span></a>
      <nav aria-label="Employer introduction"><a href="#hrl-workflow">The journey</a><a href="#hrl-principles">Our boundaries</a><a href="/">Individual workspace <ArrowUpRight size={14} /></a></nav>
      <a className="hrl-nav-cta" href="/hr/demo#setup">Explore the demo <ArrowRight size={15} /></a>
    </header>
    <main id="hrl-content">
      <section className="hrl-hero" aria-labelledby="hrl-title">
        <div className="hrl-hero-copy">
          <span className="hrl-kicker"><i /> FOR PEOPLE &amp; CAPABILITY TEAMS</span>
          <h1 id="hrl-title">A better plan<br />starts with <em>people.</em></h1>
           <p className="hrl-lede">Understand the skills across a department. Find learning priorities worth discussing. Prepare the next step with people, not for them.</p>
          <div className="hrl-actions"><a className="hrl-primary" href="/hr/demo#setup">Explore the guided demo <ArrowRight size={17} /></a><button className="hrl-secondary" type="button" onClick={() => jumpTo("hrl-workflow")}><ArrowDown size={15} /> Explore how it works</button></div>
          <div className="hrl-trustline"><ShieldCheck size={16} /> Public prototype · synthetic profiles only · human review throughout</div>
           <div className="hrl-hero-index"><span>LISTEN</span><i /><span>EXPLORE</span><i /><span>LEARN</span><i /><span>REVIEW</span></div>
        </div>
        <ScenarioPreview />
        <div className="hrl-hero-foot"><span>AN EMPLOYER WORKSPACE</span><span>Alongside an equally important individual career workspace</span><span>01—07 / Guided tour</span></div>
      </section>

      <nav ref={journeyRef} className="hrl-story-nav" aria-label="Employer journey chapters">
        {chapters.map(([id, label], index) => <button key={id} type="button" aria-current={activeChapter === index ? "step" : undefined} onClick={() => jumpTo(`hrl-${id}`)}><span>{String(index + 1).padStart(2, "0")}</span><span>{label}</span></button>)}
      </nav>
      <section className="hrl-intro-strip" data-hr-reveal>
        <div><span className="hrl-strip-number">01</span><strong>Start with what people say</strong><p>Declared experience. Not assumptions.</p></div>
        <div><span className="hrl-strip-number">02</span><strong>Show how a signal was made</strong><p>Inputs and authored weights stay visible.</p></div>
        <div><span className="hrl-strip-number">03</span><strong>Leave the decision with people</strong><p>Planning prompts a conversation; it does not make one.</p></div>
      </section>

      <HRLandingExplorer />
      <section className="hrl-outcome" aria-labelledby="hrl-outcome-title" data-hr-reveal>
        <div><span className="hrl-kicker">THE PRACTICAL OUTCOME</span><h2 id="hrl-outcome-title">Less guesswork.<br />A better-prepared discussion.</h2><p>Move beyond “we need more skills” to a concrete learning question you can review with the people affected.</p></div>
        <ul>
          <li><Users size={20} /><div><strong>A department skills picture</strong><span>See what people have declared, where signals are incomplete and what needs a conversation—not a performance label.</span></div></li>
          <li><GitBranch size={20} /><div><strong>Learning priorities with reasons</strong><span>Connect existing strengths to possible pathways. Compare assumptions before choosing where to spend learning time.</span></div></li>
          <li><ShieldCheck size={20} /><div><strong>A briefing for human review</strong><span>The final review brings priorities, human-review checks and discussion notes together in a downloadable briefing. It supports discussion, not automated personnel decisions.</span></div></li>
        </ul>
      </section>
      <section className="hrl-workflow" id="hrl-workflow" data-hr-reveal>
        <div className="hrl-section-heading"><div><span className="hrl-kicker">A guided seven-part journey</span><h2>From a department question<br />to a plan people can shape.</h2></div><p>Take one step or the whole tour. Your choices carry through the same working demo.</p></div>
        <div className="hrl-workflow-layout">
          <div className="hrl-chapter-list">{chapters.map(([id, title, copy], index) => <a className="hrl-chapter" href={`/hr/demo#${id}`} id={`hrl-${id}`} key={id} style={{ "--chapter-order": index }}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div><ChevronRight size={18} /></a>)}</div>
           <aside className="hrl-workflow-aside"><span className="hrl-aside-marker"><Users size={17} /></span><span className="hrl-kicker">THE WORKFLOW, CONNECTED</span><h3>Not a dashboard to decode alone.</h3><p>Move from a department baseline to a survey campaign, then follow a fictional response through skills, scenarios and learning.</p><div className="hrl-route-steps"><span><b>01</b> Invite with a clear purpose</span><span><b>02</b> Review declared skill signals</span><span><b>03</b> Agree what to explore next</span></div><a href="/hr/demo#setup">Take the first step <ArrowRight size={15} /></a></aside>
        </div>
      </section>

      <section className="hrl-principles" id="hrl-principles" data-hr-reveal>
        <div className="hrl-principles-art">
          <div className="hrl-signal-card"><div className="hrl-signal-head"><span><Radio size={15} /> A signal, with context</span><span>REVIEWABLE</span></div><div className="hrl-signal-result"><small>ROLE PATHWAY EXAMPLE</small><strong>Illustrative direction</strong><span>Strengths plus skills to explore</span></div>
            {[["Declared skills", "45%"], ["Transferable strengths", "30%"], ["Research / scenario context", "25%"]].map(([label, value]) => <div className="hrl-signal-weight" key={label}><div><span>{label}</span><b>{value}</b></div><i><b style={{ width: value }} /></i></div>)}
             <div className="hrl-signal-note"><Check size={14} /> Authored rule weights · not observed workforce statistics</div>
          </div><span className="hrl-orbit-label">NO DEMOGRAPHIC SCORING INPUTS</span>
        </div>
        <div className="hrl-principles-copy"><span className="hrl-kicker">Useful insight. Human ownership.</span><h2>Planning, not<br /><em>performance.</em></h2><p>Explore learning priorities with people, not in place of them. The prototype keeps its limits beside its signals.</p>
          <details><summary><ShieldCheck size={16} /><span><b>Not a people decision</b><small>No hiring, firing or performance decisions are made here.</small></span></summary><p>Self-ratings are for learning review. Missing skills mean “not declared,” not inability.</p></details>
          <details><summary><GitBranch size={16} /><span><b>Not a vacancy forecast</b><small>Role pathways and scenario weights are planning assumptions.</small></span></summary><p>Research metadata is shown as context; it does not represent observed hiring demand.</p></details>
          <details><summary><Leaf size={16} /><span><b>Not measured impact</b><small>SDG mappings describe intended contribution only.</small></span></summary><p>Review every mapping with the people affected before drawing conclusions.</p></details>
        </div>
      </section>
      <section className="hrl-cta" data-hr-reveal><div><span className="hrl-kicker">SEVEN STEPS · REAL OPERATIONS</span><h2>See what a better<br /><em>conversation can start.</em></h2><p>Create a campaign, submit a synthetic reflection, and follow its planning signals.</p></div><a className="hrl-primary" href="/hr/demo#setup">Begin with a department <ArrowRight size={17} /></a><div className="hrl-cta-index"><span>01</span><i /><span>07</span></div></section>
    </main>
    <footer className="hrl-footer"><a className="hrl-brand" href="/hr"><span className="hrl-mark">N</span><span>NexusTalent<small>People &amp; capability planning</small></span></a><span>Prototype only · Synthetic data · Human review</span><a href="/">Explore the individual workspace <ArrowUpRight size={14} /></a></footer>
  </div>;
}
