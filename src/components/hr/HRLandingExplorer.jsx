import React, { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, FileText, RotateCcw, ShieldCheck } from "lucide-react";
import { DEFAULT_PREFERENCES, SAMPLE_CVS, SCENARIOS, SKILL_MAP, SOURCES } from "../../data/careerCatalog";
import { planFor, rankRoles } from "../../utils/careerDemo";

const STAGES = ["Listen", "Explore priorities", "Shape learning", "Prepare a review"];
const CHECKS = [
  "Confirm declared skills with the person.",
  "Discuss learning time and access to support.",
  "Review the assumptions before agreeing a next step.",
];

// Deliberately isolated from the demo and any saved workforce records.
export default function HRLandingExplorer() {
  const [stage, setStage] = useState(0);
  const [sampleId, setSampleId] = useState(SAMPLE_CVS[0].id);
  const [excluded, setExcluded] = useState([]);
  const [scenario, setScenario] = useState("steady");
  const [roleId, setRoleId] = useState(null);
  const [hours, setHours] = useState(4);
  const [checks, setChecks] = useState([]);
  const [notes, setNotes] = useState("");
  const sample = SAMPLE_CVS.find((item) => item.id === sampleId) || SAMPLE_CVS[0];
  const profile = useMemo(() => ({ ...sample, skills: sample.skills.filter((id) => !excluded.includes(id)) }), [sample, excluded]);
  const roles = useMemo(() => rankRoles(profile, SOURCES, scenario), [profile, scenario]);
  const role = roles.find((item) => item.id === roleId) || roles[0];
  const plan = useMemo(() => planFor(profile, role, { ...DEFAULT_PREFERENCES, hours, goal: "Grow in my current role" }), [profile, role, hours]);
  const priority = role.gaps[0];
  const activeScenario = SCENARIOS.find((item) => item.id === scenario);
  const totalHours = plan.reduce((sum, item) => sum + item.hours, 0);

  function changeProfile(id) {
    setSampleId(id);
    setExcluded([]);
    setRoleId(null);
    setChecks([]);
    setNotes("");
  }
  function reset() {
    changeProfile(SAMPLE_CVS[0].id);
    setScenario("steady");
    setHours(4);
    setStage(0);
  }
  function toggleSkill(id) {
    setExcluded((value) => value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
    setChecks([]);
  }

  return <section className="hrl-lab-section" id="hrl-explore" aria-labelledby="hrl-explore-title" data-hr-reveal>
    <div className="hrl-section-heading">
      <div><span className="hrl-kicker">TRY THE THINKING, BEFORE THE TOUR</span><h2 id="hrl-explore-title">A skill signal is a start.<br />What happens next?</h2></div>
      <p>Try a fictional reflection. Change an input, compare a direction and shape a learning discussion. This small sandbox stays on this page.</p>
    </div>
    <div className="hrl-lab">
      <div className="hrl-lab-bar"><span><ShieldCheck size={16} /> LOCAL SIMULATION · FICTIONAL PROFILES</span><button type="button" onClick={reset}><RotateCcw size={14} /> Reset exploration</button></div>
      <div className="hrl-lab-steps" role="group" aria-label="Explore the skills-to-review journey">
        {STAGES.map((label, index) => <button type="button" key={label} aria-pressed={stage === index} aria-controls="hrl-explorer-panel" onClick={() => setStage(index)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>)}
      </div>
      <div className="hrl-lab-body">
        <div className="hrl-lab-panel" key={stage} id="hrl-explorer-panel" role="region" aria-label={STAGES[stage]}>
          {stage === 0 && <>
            <span className="hrl-kicker">01 / A PERSON, NOT A SCORE</span>
            <h3>Let experience speak first.</h3>
            <p>A survey starts with what someone says they do. Here, the starting skills come from a fictional profile in the career catalog.</p>
            <label className="hrl-profile-select">Explore a fictional reflection
              <select value={sampleId} onChange={(event) => changeProfile(event.target.value)}>{SAMPLE_CVS.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.role}</option>)}</select>
            </label>
            <blockquote>“{sample.tasks[0]}”</blockquote>
            <div className="hrl-skill-choices" role="group" aria-label="Edit the sample declared skills">
              {sample.skills.map((id) => <button key={id} type="button" aria-pressed={!excluded.includes(id)} onClick={() => toggleSkill(id)}>{!excluded.includes(id) && <Check size={14} />}{SKILL_MAP[id]?.name || id}</button>)}
            </div>
            <small>Select a skill to include or remove it from this simulation. Not declared does not mean unable. Watch the discussion outline update.</small>
          </>}
          {stage === 1 && <>
            <span className="hrl-kicker">02 / COMPARE, DON’T PRESCRIBE</span>
            <h3>Explore a learning direction.</h3>
            <p>These are possible pathways for {sample.name.split(" ")[0]}, not vacancies or recommended personnel moves.</p>
            <div className="hrl-skill-choices" role="group" aria-label="Choose explorer planning scenario">{SCENARIOS.map((item) => <button type="button" key={item.id} aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); setRoleId(null); setChecks([]); }}>{item.short}</button>)}</div>
            <small>{activeScenario.description} Authored planning assumption, not a forecast.</small>
            <div className="hrl-lab-roles" role="group" aria-label="Choose a sample learning direction">{roles.slice(0, 3).map((item) => <button type="button" key={item.id} aria-pressed={role.id === item.id} onClick={() => { setRoleId(item.id); setChecks([]); }}><span><strong>{item.title}</strong><small>{item.known.length} declared strengths · {item.gaps.length} skills to explore</small></span><b>{item.score}<small>/100</small></b></button>)}</div>
            <small>Comparison index: declared-skill overlap (45%), transferable strengths (30%) and authored research / scenario context (25%). Not a probability, proficiency rating or employee ranking.</small>
          </>}
          {stage === 2 && <>
            <span className="hrl-kicker">03 / SOMETHING PRACTICAL TO TRY</span>
            <h3>Give learning room to happen.</h3>
            <p>A direction becomes an ordered pathway, with practice and an output to discuss—not just a course list.</p>
            <label className="hrl-profile-select">Illustrative weekly learning time
              <select value={hours} onChange={(event) => { setHours(Number(event.target.value)); setChecks([]); }}>{[2, 4, 6].map((value) => <option key={value} value={value}>{value} hours per week</option>)}</select>
            </label>
            <ol className="hrl-lab-learning">{plan.slice(0, 3).map((step, index) => <li key={step.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><small>{step.hours} estimated hours · weeks {step.startWeek}–{step.endWeek}</small><small>{step.output}</small>{step.resource && <a href={step.resource.url} target="_blank" rel="noreferrer">{step.resource.provider} · public resource <ArrowUpRight size={13} /></a>}</div></li>)}</ol>
            <small>Showing the first {Math.min(3, plan.length)} of {plan.length} steps. Full sample pathway: {totalHours} estimated hours across {Math.ceil(totalHours / hours)} weeks. These are local scheduling estimates, not course durations or a promise of readiness.</small>
          </>}
          {stage === 3 && <>
            <span className="hrl-kicker">04 / A SHARED NEXT STEP</span>
            <h3>Prepare the conversation.</h3>
            <p>A signal needs context. Try the review prompts and add a fictional discussion note to the outline.</p>
            <div className="hrl-review-checks">{CHECKS.map((label, index) => <label key={label}><input type="checkbox" checked={checks.includes(index)} onChange={() => setChecks((value) => value.includes(index) ? value.filter((item) => item !== index) : [...value, index])} />{label}</label>)}</div>
            <label>Sample discussion note<textarea value={notes} maxLength={400} placeholder="For example: ask which familiar workflow would make a useful practice project." onChange={(event) => setNotes(event.target.value)} /></label>
            <small>Use fictional notes only. Nothing here is sent, saved or added to the guided demo. Checks rehearse a review; they do not certify that one has happened.</small>
          </>}
        </div>
        <aside className="hrl-lab-brief" aria-label="Live sample discussion outline">
          <span><FileText size={15} /> YOUR SAMPLE DISCUSSION OUTLINE</span>
          <h4>{sample.name}</h4>
          <p>{sample.role} · fictional reflection</p>
          <dl>
            <div><dt>Starting point</dt><dd>{profile.skills.length} declared skills in this simulation</dd></div>
            <div><dt>Direction to discuss · {activeScenario.short}</dt><dd>{role.title}</dd></div>
            <div><dt>Build on</dt><dd>{role.known.length ? role.known.map((id) => SKILL_MAP[id]?.name || id).join(" · ") : "No overlap declared. Ask about relevant experience."}</dd></div>
            <div><dt>Learning question</dt><dd>{priority ? `Would ${priority.name.toLowerCase()} be useful in a familiar task?` : "Which practical project would build on these strengths?"}</dd></div>
            <div><dt>Time to discuss</dt><dd>{hours} hours / week · {Math.ceil(totalHours / hours)} illustrative weeks</dd></div>
            <div><dt>Human-review prompts rehearsed</dt><dd>{checks.length} of {CHECKS.length} checked · {checks.length === CHECKS.length ? "still a simulation" : "discussion still needed"}</dd></div>
            {notes.trim() && <div><dt>Fictional discussion note</dt><dd>{notes}</dd></div>}
          </dl>
          <p className="hrl-brief-note">An outline for a conversation, never an automated personnel decision. No real department data is represented.</p>
        </aside>
      </div>
      <div className="hrl-lab-footer"><p>In the guided demo, follow the department journey. This landing exploration does not carry over.</p>{stage < 3 ? <button type="button" onClick={() => setStage(stage + 1)}>Next: {STAGES[stage + 1].toLowerCase()} <ArrowRight size={15} /></button> : <a className="hrl-primary" href="/hr/demo#setup">Try the department journey <ArrowRight size={15} /></a>}</div>
      <span className="sr-only" role="status">{STAGES[stage]}. Sample: {sample.name}. {profile.skills.length} declared skills. Direction: {role.title}. {hours} learning hours per week.</span>
    </div>
  </section>;
}
