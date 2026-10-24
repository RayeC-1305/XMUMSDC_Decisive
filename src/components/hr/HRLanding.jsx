import React from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CircleHelp,
  Compass,
  GitBranch,
  Leaf,
  ShieldCheck,
  Users,
} from "lucide-react";
import "./hrLanding.css";

const chapters = [
  ["01", "Set a shared starting point", "Choose a department and load a fictional workforce sample. The same workspace is safe to revisit."],
  ["02", "Invite with care", "Create a campaign link with a clear focus, response limit and expiry. Copy, extend or revoke it whenever needed."],
  ["03", "Hear from people", "Complete a synthetic skills reflection. The submitted response appears in the same planning dashboard."],
  ["04", "Make signals legible", "Read the Future Skills Radar and inspect individual self-ratings, skill gaps and explainable role pathways."],
  ["05", "Compare possible futures", "Change authored scenarios, refresh dated research metadata and inspect the inputs before discussing a plan."],
  ["06", "Turn insight into learning", "Review ordered learning cohorts and employee pathways, including prerequisites, hours and source citations."],
  ["07", "Review outcomes together", "Explore all 17 SDG mappings and fairness disclosures. Human judgement stays in the loop."],
];

export default function HRLanding() {
  return (
    <div className="hr-landing">
      <a className="hrl-skip" href="#hrl-content">Skip to the introduction</a>
      <header className="hrl-nav">
        <a className="hrl-brand" href="/hr" aria-label="NexusTalent employer introduction">
          <span className="hrl-mark">N</span>
          <span>NexusTalent<small>People &amp; capability planning</small></span>
        </a>
        <nav aria-label="Employer introduction">
          <a href="#workflow">The workflow</a>
          <a href="#principles">How it works</a>
          <a href="/">Individual workspace <ArrowUpRight size={14} /></a>
        </nav>
        <a className="hrl-nav-cta" href="/hr/demo">Start guided demo <ArrowRight size={15} /></a>
      </header>

      <main id="hrl-content">
        <section className="hrl-hero">
          <div className="hrl-hero-copy">
            <span className="hrl-kicker"><span /> FOR PEOPLE &amp; CAPABILITY TEAMS</span>
            <h1>Build capability.<br /><em>Make room</em> for people.</h1>
            <p className="hrl-lede">A practical workspace for turning workforce skills into better learning conversations—not automated people decisions.</p>
            <div className="hrl-actions">
              <a className="hrl-primary" href="/hr/demo">Start guided demo <ArrowRight size={17} /></a>
              <a className="hrl-secondary" href="#workflow"><ArrowDown size={15} /> See the workflow</a>
            </div>
            <div className="hrl-trustline"><ShieldCheck size={16} /> Public prototype · synthetic profiles only · human review throughout</div>
          </div>
          <div className="hrl-orbit" aria-label="Illustration of a connected workforce planning journey">
            <div className="hrl-orbit-grid" />
            <div className="hrl-orbit-ring ring-one" />
            <div className="hrl-orbit-ring ring-two" />
            <svg className="hrl-route" viewBox="0 0 520 420" fill="none" aria-hidden="true">
              <path d="M91 294C120 294 126 200 190 200H233C269 200 259 112 321 112H367C404 112 395 261 452 261" stroke="#647389" strokeWidth="2" strokeDasharray="4 8" />
              <path d="M91 294C120 294 126 200 190 200H233C269 200 259 112 321 112H367C404 112 395 261 452 261" stroke="#b6e7d8" strokeWidth="3" strokeDasharray="208 640" strokeLinecap="round" />
            </svg>
            <div className="hrl-node node-intake"><span className="hrl-node-icon"><Users size={17} /></span><small>01 / INVITE</small><strong>People, first</strong></div>
            <div className="hrl-node node-signal"><span className="hrl-node-icon"><BarChart3 size={17} /></span><small>02 / UNDERSTAND</small><strong>Skills in context</strong></div>
            <div className="hrl-node node-plan"><span className="hrl-node-icon"><GitBranch size={17} /></span><small>03 / PLAN</small><strong>Next steps</strong></div>
            <div className="hrl-node node-outcome"><span className="hrl-node-icon"><Leaf size={17} /></span><small>04 / REVIEW</small><strong>Shared progress</strong></div>
            <div className="hrl-orbit-caption"><span>WORKFORCE PLANNING</span><b>A living conversation, not a scorecard.</b></div>
          </div>
          <div className="hrl-hero-foot"><span>01—07</span><span>A guided path from setup to review</span><span>Use fictional data throughout</span></div>
        </section>

        <section className="hrl-intro-strip" aria-label="The planning approach">
          <div><span className="hrl-strip-number">01</span><strong>Start with declared skills</strong><p>Self-reported experience—not assumptions about people.</p></div>
          <div><span className="hrl-strip-number">02</span><strong>Make the reasoning visible</strong><p>Scores, evidence and authored weights stay inspectable.</p></div>
          <div><span className="hrl-strip-number">03</span><strong>Keep decisions human</strong><p>Planning signals invite a conversation; they never decide one.</p></div>
        </section>

        <section className="hrl-workflow" id="workflow">
          <div className="hrl-section-heading">
            <div><span className="hrl-kicker">A connected seven-part journey</span><h2>From a department question<br />to a plan people can shape.</h2></div>
            <p>Follow the guided demo at your own pace. Each chapter uses the same real workspace and carries your choices forward.</p>
          </div>
          <div className="hrl-workflow-layout">
            <div className="hrl-chapter-list">
              {chapters.map(([number, title, copy]) => (
                <article className="hrl-chapter" key={number}>
                  <span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight size={17} />
                </article>
              ))}
            </div>
            <aside className="hrl-preview">
              <div className="hrl-preview-top"><span>WORKSPACE PREVIEW</span><span className="hrl-live-dot">LIVE DEMO</span></div>
              <div className="hrl-preview-title"><div><small>PEOPLE PLANNING / OVERVIEW</small><h3>What can we grow next?</h3></div><span className="hrl-preview-stamp">SYNTHETIC<br />SAMPLE</span></div>
              <div className="hrl-preview-metrics">
                <div><small>INPUT</small><b>Declared skills</b><span>Self-ratings 0–5</span></div>
                <div><small>METHOD</small><b>Explainable rules</b><span>45 / 30 / 25 weights</span></div>
              </div>
              <div className="hrl-preview-chart">
                <div className="hrl-chart-label"><span>Capability signals</span><span>Illustrative layout</span></div>
                {[["Digital fluency", 68], ["Process design", 45], ["Data confidence", 76], ["Sustainability", 37]].map(([label, value]) => <div className="hrl-bar-row" key={label}><span>{label}</span><i><b style={{ width: `${value}%` }} /></i></div>)}
              </div>
              <div className="hrl-preview-foot"><ShieldCheck size={14} /> Planning view · not a performance measure</div>
            </aside>
          </div>
        </section>

        <section className="hrl-principles" id="principles">
          <div className="hrl-principles-art">
            <div className="hrl-signal-card">
              <div className="hrl-signal-head"><span><Compass size={15} /> A decision, with context</span><span>REVIEWABLE</span></div>
              <div className="hrl-signal-result"><small>TOP ROLE PATHWAY</small><strong>Illustrative direction</strong><span>Strengths + skills to explore</span></div>
              <div className="hrl-signal-weight"><div><span>Declared skills</span><b>45%</b></div><i><b style={{ width: "45%" }} /></i></div>
              <div className="hrl-signal-weight"><div><span>Transferable strengths</span><b>30%</b></div><i><b style={{ width: "30%" }} /></i></div>
              <div className="hrl-signal-weight"><div><span>Research / scenario context</span><b>25%</b></div><i><b style={{ width: "25%" }} /></i></div>
              <div className="hrl-signal-note"><Check size={14} /> Fixed rules; no LLM inference</div>
            </div>
            <span className="hrl-orbit-label">NO DEMOGRAPHIC SCORING INPUTS</span>
          </div>
          <div className="hrl-principles-copy">
            <span className="hrl-kicker">Built for a better conversation</span>
            <h2>Useful insight.<br /><em>Human ownership.</em></h2>
            <p>Explore learning priorities with people, not in place of them. The prototype makes its limits visible alongside the signals.</p>
            <ul>
              <li><ShieldCheck size={17} /><span><b>Planning, not performance</b><small>Self-ratings guide learning review. They do not change role scores or evaluate an employee.</small></span></li>
              <li><BookOpen size={17} /><span><b>Evidence, not a vacancy forecast</b><small>Sources and authored scenario weights are separate; neither claims observed hiring demand.</small></span></li>
              <li><CircleHelp size={17} /><span><b>Review, don't automate</b><small>Human judgement stays central. No hiring, firing or performance decisions are made here.</small></span></li>
            </ul>
          </div>
        </section>

        <section className="hrl-cta">
          <div><span className="hrl-kicker">TAKE THE TOUR</span><h2>See the whole workflow<br /><em>in a guided demo.</em></h2><p>Seven manageable steps. Your pace. Real campaign, survey and planning features—using synthetic data only.</p></div>
          <a className="hrl-primary" href="/hr/demo">Start guided demo <ArrowRight size={17} /></a>
          <div className="hrl-cta-index"><span>01</span><i /><span>07</span></div>
        </section>
      </main>
      <footer className="hrl-footer"><a className="hrl-brand" href="/hr"><span className="hrl-mark">N</span><span>NexusTalent<small>People &amp; capability planning</small></span></a><span>Prototype only · Synthetic data · Human review</span><a href="/hr/demo">Enter guided demo <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}
