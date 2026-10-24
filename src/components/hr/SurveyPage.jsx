import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, ExternalLink, ListChecks, LoaderCircle, MessageSquare, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import {
  api, dateLabel, InlineError, numberLabel, SkillRadar, sourceDate, sourceName,
  SYNTHETIC_NOTICE,
} from "./hrShared";
import DemoSkillRadar from "./DemoSkillRadar";

function DemoSection({ enabled, className, children }) {
  return enabled ? <div className={className}>{children}</div> : <>{children}</>;
}

function Pathway({ pathway }) {
  const steps = pathway?.steps || pathway?.path || [];
  if (!steps.length) return <div className="hr-empty"><strong>No pathway steps returned</strong><p>There is no pathway detail to display for this role yet.</p></div>;
  return <div className="hr-pathway">{steps.map((step, index) => <article className="hr-step" key={step.id || `${step.title}-${index}`}>
    <div><strong>{step.title || step.name || "Learning step"}</strong>
      <p>{step.resource?.provider || step.resource?.name || "Public learning material"}{step.rationale ? ` · ${step.rationale}` : ""}</p>
      {step.resource?.url && <p><a href={step.resource.url} target="_blank" rel="noreferrer" style={{ color: "var(--hr-indigo-dark)" }}>{step.resource.title || "Open resource"} <ExternalLink size={11} /></a></p>}
    </div>
    <small>{numberLabel(step.hours)} h · Week {step.startWeek}–{step.endWeek}<br />{step.resource?.cataloguedOn ? `Catalogued ${dateLabel(step.resource.cataloguedOn)}` : "Adviser-reviewed work sample"}</small>
  </article>)}</div>;
}

function RoleResult({ role, pathway }) {
  return <article className="hr-role-card">
    <div className="hr-role-title"><strong>{role.title || role.name || "Role pathway"}</strong><b>{Math.round(Number(role.score) || 0)} pts</b></div>
    <p style={{ fontSize: 11, marginTop: 5 }}>{role.description || "Illustrative transition direction; not a job vacancy."}</p>
    {(role.components || []).map((component) => <div className="hr-component" key={component.id || component.label}>
      <span title={component.explanation}>{component.label}</span>
      <div className="hr-component-track"><i style={{ width: `${Math.max(0, Math.min(100, Number(component.value) || 0))}%` }} /></div>
      <span title={`${component.explanation} Weight ${component.weight * 100}%. Contribution ${component.points} points.`}>{component.points} pts</span>
    </div>)}
    {role.gaps?.length > 0 && <div className="hr-gap-chips" aria-label="Skills to explore">{role.gaps.slice(0, 8).map((gap) => <span key={gap.id}>{gap.name || gap.id}{gap.direction ? ` · ${gap.direction}` : ""}</span>)}</div>}
    <details style={{ marginTop: 11 }}>
      <summary style={{ cursor: "pointer", color: "var(--hr-indigo-dark)", fontSize: 11, fontWeight: 600 }}>View ordered learning pathway</summary>
      <p style={{ fontSize: 11, marginTop: 8 }}>{pathway?.totalHours} estimated hours · {pathway?.estimatedWeeks} weeks at {pathway?.hoursPerWeek} hours / week.</p>
      <Pathway pathway={pathway} />
      <p style={{ fontSize: 10, marginTop: 9 }}>Free public reading is curated; HRD Corp eligibility is not verified. Estimated time is for planning only.</p>
    </details>
  </article>;
}

function SurveyResults({ result, skills, embedded }) {
  const Radar = embedded ? DemoSkillRadar : SkillRadar;
  const analysis = result.analysis || {};
  const profile = result.profile || {};
  const proficiencies = result.proficiencies || profile.proficiencies || {};
  const radarIds = [...new Set([...(analysis.matches?.[0]?.skills || []), ...(profile.skills || [])])].slice(0, 8);
  const profileSkills = radarIds.map(id => skills.find(skill => skill.id === id) || { id, name: id });
  const ranked = (analysis.matches || []).slice(0, 3);
  const pathwayList = Array.isArray(analysis.pathways) ? analysis.pathways : Object.values(analysis.pathways || {});
  const pathwayFor = (role, index) => pathwayList.find((item) => item.roleId === role.id || item.id === role.id) || role.pathway || (index === 0 ? result.pathway : null);
  const evidence = analysis.evidence?.sources || [];
  const sdgs = analysis.sdgs || result.pathway?.sdgs || ranked[0]?.sdgs || [];
  return <section className="survey-results" aria-labelledby="survey-results-heading" aria-live="polite">
    <div className="survey-card">
      <div className="survey-result-head">
        <div><span className="hr-eyebrow"><Check size={14} /> Survey complete</span><h2 id="survey-results-heading" style={{ marginTop: 6 }}>Your next-step map, {profile.name || "synthetic participant"}</h2>
          <p style={{ fontSize: 12, marginTop: 5 }}>These are planning suggestions to review with an adviser—not an assessment of your worth or eligibility.</p>
        </div>
        <span className="survey-fairness"><ShieldCheck size={14} /> Fairness Check Passed: Demographic-Blind Evaluation</span>
      </div>
      <div className="survey-result-grid">
        <div className="survey-card" style={{ padding: 13, background: "#f8f9fd" }}>
          <h3 style={{ fontSize: 14 }}>Future Skills Radar</h3><p style={{ fontSize: 10, marginTop: 4 }}>Blue: self-reported proficiency 1–5; 0 means unknown. Dashed: an authored review target of 4 for the top role's skills, not a validated employer requirement.</p>
          <Radar skills={profileSkills} values={proficiencies} targetValues={Object.fromEntries((ranked[0]?.skills || []).map(id => [id, 4]))} label="Radar of employee-reported skill proficiencies and future-role review targets" />
          {result.customSkills?.length > 0 && <div className="hr-detail-row"><strong>Custom skills · for human review</strong><p>{result.customSkills.join(", ")}</p><small style={{ color: "var(--hr-muted)", fontSize: 10 }}>Custom entries are not matched as catalog skills.</small></div>}
        </div>
        <div>
          <div className="hr-panel-head"><div><h2 style={{ fontSize: 17 }}>Top role pathways</h2><p>Scores use a transparent, fixed weighting.</p></div></div>
          {ranked.length ? ranked.map((role, index) => <RoleResult key={role.id || role.title} role={role} pathway={pathwayFor(role, index)} />) : <div className="hr-empty"><strong>No ranked pathways were returned</strong><p>Your reviewed profile was received, but matches are not available.</p></div>}
          <div className="survey-disclosure"><strong>How results are estimated:</strong> 45% required declared skills + 30% transferable strength + 25% research/scenario context. No proficiency is inferred from a missing skill. The system does not use LLM/model inference; research metadata is not a jobs forecast.</div>
          {analysis.disclosure && <div className="survey-disclosure">{analysis.disclosure}</div>}
          {analysis.scenario && <div className="survey-disclosure"><strong>Scenario:</strong> {analysis.scenario.title || analysis.scenario.id} · {analysis.scenario.horizon || "planning assumption"}.</div>}
        </div>
      </div>
      {sdgs.length > 0 && <section style={{ marginTop: 18 }}>
        <div className="hr-panel-head"><div><h2 style={{ fontSize: 16 }}>Mapped Sustainable Development Goals</h2><p>Mappings in the returned role pathway are not measured impact.</p></div></div>
        <div className="hr-sdgs">{sdgs.map((goal, index) => {
          const target = typeof goal === "string" ? goal : goal.target;
          const goalNumber = String(target || goal.goal || "").match(/\d+/)?.[0];
          const title = typeof goal === "string" ? `Goal ${goalNumber || index + 1}` : (goal.goal || goal.title || `Goal ${index + 1}`);
          return <article className="hr-sdg" key={target || index}><strong>Goal {title}</strong><small>{target ? `Mapped target ${target}` : "Pathway mapping"}</small>{goal.contribution && <small>{goal.contribution}</small>}{goal.url && <a href={goal.url} target="_blank" rel="noreferrer">UN target reference</a>}</article>;
        })}</div>
      </section>}
      {evidence.length > 0 && <section style={{ marginTop: 18 }}>
        <div className="hr-panel-head"><div><h2 style={{ fontSize: 16 }}>Evidence and course citations</h2><p>Publication date and publisher are shown only when supplied.</p></div></div>
        {evidence.slice(0, 5).map((source, index) => <article className="hr-source" key={source.id || source.url || index}>
          {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title || source.name || "Source"} <ExternalLink size={11} /></a> : <strong style={{ fontSize: 12 }}>{source.title || source.name || "Source"}</strong>}
          <small>{sourceName(source)} · {sourceDate(source) ? dateLabel(sourceDate(source)) : "Publication date unavailable"}</small>
          {source.summary && <p>{source.summary}</p>}
        </article>)}
      </section>}
      {analysis.modelVersion && <p style={{ fontSize: 10, marginTop: 14 }}>Engine version {analysis.modelVersion} · Result uses the reviewed synthetic profile only.</p>}
    </div>
  </section>;
}

export default function SurveyPage({ token, embedded = false, onSubmitted }) {
  const [survey, setSurvey] = useState(null);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState({ name: "", role: "", goal: "", tasks: "", interests: [], hoursPerWeek: "4", cvText: "" });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [proficiencies, setProficiencies] = useState({});
  const [customSkillsText, setCustomSkillsText] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [closed, setClosed] = useState(false);
  const [result, setResult] = useState(null);
  const safeSkills = useMemo(() => Array.isArray(survey?.skills) ? survey.skills : skills, [survey, skills]);
  const sample = survey?.sample?.profile || survey?.sample || null;
  const toggleValue = (key, id) => setProfile((current) => {
    const values = current[key] || [];
    return { ...current, [key]: values.includes(id) ? values.filter((value) => value !== id) : [...values, id] };
  });

  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setClosed(false); setSurvey(null); setResult(null);
    if (!token) { setLoading(false); setClosed(true); setError("This survey link is missing its access token."); return () => { active = false; }; }
    api(`/api/survey/${encodeURIComponent(token)}`)
      .then((data) => {
        if (!active) return;
        setSurvey(data); setSkills(data.skills || []);
        const sampleProfile = data.sample?.profile || data.sample || {};
        const sampleSkills = sampleProfile.skills || [];
        setProfile({
          name: "", role: sampleProfile.role || "", goal: sampleProfile.goal || "",
          tasks: Array.isArray(sampleProfile.tasks) ? sampleProfile.tasks.join("\n") : "",
          interests: Array.isArray(sampleProfile.interests) ? sampleProfile.interests : [],
          hoursPerWeek: String(sampleProfile.hoursPerWeek || 4), cvText: "",
        });
        setSelectedSkills([]); setProficiencies(Object.fromEntries(sampleSkills.map((id) => [id, 3])));
      })
      .catch((failure) => {
        if (!active) return;
        setError(failure.message || "This survey could not be opened.");
        if (failure.status === 404 || failure.status === 410) setClosed(true);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  function autofill() {
    if (!sample) return;
    const sampleSkills = (sample.skills || []).filter((id) => safeSkills.some((skill) => skill.id === id));
    setProfile({
      name: sample.name || sample.alias || "Sample contributor",
      role: sample.role || "Operations associate",
      goal: sample.goal || "Explore a new direction",
      tasks: Array.isArray(sample.tasks) ? sample.tasks.join("\n") : (sample.tasks || ""),
      interests: Array.isArray(sample.interests) ? sample.interests : sampleSkills.slice(0, 2),
      hoursPerWeek: String(sample.hoursPerWeek || 4),
      cvText: "",
    });
    setSelectedSkills(sampleSkills);
    setProficiencies(Object.fromEntries(sampleSkills.map((id) => [id, sample.proficiencies?.[id] || 3])));
    setCustomSkillsText("");
  }

  async function submitSurvey(event) {
    event.preventDefault(); setSubmitting(true); setError("");
    const customSkills = customSkillsText.split(/[\n,;]/).map((value) => value.trim()).filter(Boolean).slice(0, 20);
    try {
      const payload = await api(`/api/survey/${encodeURIComponent(token)}`, {
        method: "POST",
        body: JSON.stringify({
          syntheticConsent: consent,
          profile: {
            name: profile.name.trim(), role: profile.role.trim(), skills: selectedSkills,
            tasks: profile.tasks.split(/\n/).map((task) => task.trim()).filter(Boolean),
            interests: profile.interests, goal: profile.goal.trim(),
            hoursPerWeek: Number(profile.hoursPerWeek), reviewed: true, synthetic: true,
          },
          proficiencies: Object.fromEntries(selectedSkills.map((id) => [id, Number(proficiencies[id] || 3)])),
          customSkills,
          ...(profile.cvText.trim() ? { cvText: profile.cvText.trim() } : {}),
        }),
      });
      setResult({ ...payload, customSkills, proficiencies: payload.proficiencies });
      onSubmitted?.(payload);
      window.setTimeout(() => document.querySelector(".survey-results")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start",
      }), 0);
    } catch (failure) {
      setError(failure.status === 410 || failure.status === 404
        ? "This survey link is closed or has reached its response limit. Contact the campaign owner for an active link."
        : failure.message || "Your response could not be submitted. Please check your answers and try again.");
      if (failure.status === 410 || failure.status === 404) setClosed(true);
    } finally { setSubmitting(false); }
  }

  return <div className={`survey-app${embedded ? " survey-embedded" : ""}`}>
    {!embedded && <header className="survey-top">
      <a href="/" className="hr-brand" aria-label="Return to Nexus worker workspace"><span className="hr-brand-mark">N</span><span>NexusTalent<small>People & capability planning</small></span></a>
      <nav className="survey-nav-links" aria-label="Employer navigation"><a href="/hr"><ArrowLeft size={14} /> Employer introduction</a><a href="/hr/demo">Guided demo <ArrowRight size={14} /></a></nav>
    </header>}
    <main className="survey-main">
      {!embedded && <section className="survey-banner">
        <span className="hr-eyebrow"><Sparkles size={14} /> Your next-step map</span>
        <h1>A survey about skills you want to grow.</h1>
        <p>Share a synthetic profile and get an immediate, transparent view of possible learning directions. Nothing here decides your job or your future.</p>
      </section>}
      <div className="hr-notice warning" role="alert"><ShieldCheck size={17} /><strong>{SYNTHETIC_NOTICE}</strong></div>
      {loading && <div className="survey-card" aria-label="Loading survey"><div className="hr-skeleton" /><p style={{ marginTop: 12 }}>Checking this survey link…</p></div>}
      {!loading && closed && <section className="survey-error" role="alert"><h2>Survey link unavailable</h2><p>{error || "This link is invalid, closed, revoked or has reached its response limit."}</p><p style={{ marginTop: 10 }}>Ask the campaign owner for a current synthetic-demo link.</p><a className="hr-btn secondary" href="/hr" style={{ marginTop: 14, display: "inline-flex" }}><ArrowLeft size={14} /> HR dashboard</a></section>}
      {!loading && !closed && survey && <>
        {survey.notice && <div className="hr-notice"><ShieldCheck size={16} /><div>{survey.notice}</div></div>}
        <div className="survey-content">
          <section className={`survey-card${embedded ? " survey-profile" : ""}`}>
            <DemoSection enabled={embedded} className="survey-profile-intro"><h2>Build your synthetic profile</h2><p>Use a fictional alias and fictional examples. A sample profile is available to fill the form in one click.</p>
              {embedded && <button className="hr-btn secondary" type="button" onClick={autofill} disabled={!sample}><Sparkles size={17} /> Fill sample profile</button>}
            </DemoSection>
            <form className="survey-form" onSubmit={submitSurvey}>
              <DemoSection enabled={embedded} className="survey-form-section">
              {embedded && <h3><UserRound size={20} aria-hidden="true" />Your starting point</h3>}
              <div className="survey-grid">
                <div className="survey-field"><label htmlFor="survey-alias">Synthetic alias</label><input id="survey-alias" required maxLength="60" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="e.g. Sample contributor 07" autoComplete="off" /></div>
                <div className="survey-field"><label htmlFor="survey-role">Current role</label><input id="survey-role" required maxLength="100" value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} placeholder="Fictional role title" /></div>
                <div className="survey-field"><label htmlFor="survey-goal">Career goal</label><input id="survey-goal" required maxLength="160" value={profile.goal} onChange={(event) => setProfile({ ...profile, goal: event.target.value })} placeholder="What would you like to explore?" /></div>
                <div className="survey-field"><label htmlFor="survey-hours">Learning time each week</label><select id="survey-hours" value={profile.hoursPerWeek} onChange={(event) => setProfile({ ...profile, hoursPerWeek: event.target.value })}>{[1,2,3,4,6,8,10,12].map((hours) => <option value={hours} key={hours}>{hours} {hours === 1 ? "hour" : "hours"}</option>)}</select></div>
              </div>
              </DemoSection>
              <div className={`survey-field${embedded ? " survey-form-section" : ""}`}>
                {embedded && <h3><ListChecks size={20} aria-hidden="true" />What you bring</h3>}
                <fieldset><legend>Skills you want to include <small>Choose any that fit your fictional profile; set a self-rating from 1–5.</small></legend>
                  <div className="survey-skills">{safeSkills.map((skill) => {
                    const selected = selectedSkills.includes(skill.id);
                    return <label className="survey-skill" key={skill.id}>
                      <input type="checkbox" checked={selected} onChange={() => setSelectedSkills((current) => selected ? current.filter((id) => id !== skill.id) : [...current, skill.id])} />
                      <span>{skill.name}</span>
                      {selected && <select aria-label={`Self-rated proficiency for ${skill.name}`} value={proficiencies[skill.id] || 3} onChange={(event) => setProficiencies((current) => ({ ...current, [skill.id]: Number(event.target.value) }))}>{[1,2,3,4,5].map((level) => <option key={level} value={level}>{level}</option>)}</select>}
                    </label>;
                  })}</div>
                </fieldset>
              </div>
              <div className={`survey-field${embedded ? " survey-form-section" : ""}`}>
                {embedded && <h3><Compass size={20} aria-hidden="true" />Where you want to grow</h3>}
                <fieldset><legend>Skills you are curious about</legend><div className="survey-skills">{safeSkills.map((skill) => <label className="survey-skill" key={`interest-${skill.id}`}><input type="checkbox" checked={profile.interests.includes(skill.id)} onChange={() => toggleValue("interests", skill.id)} /><span>{skill.name}</span></label>)}</div></fieldset>
              </div>
              <DemoSection enabled={embedded} className="survey-form-section survey-experience">
              {embedded && <h3><MessageSquare size={20} aria-hidden="true" />Your experience, in your words</h3>}
              <div className="survey-field"><label htmlFor="survey-tasks">Fictional tasks or experience</label><textarea id="survey-tasks" required value={profile.tasks} onChange={(event) => setProfile({ ...profile, tasks: event.target.value })} placeholder={"One task or experience per line\nExample: Reconcile fictional supplier invoices"} /><small>These examples may reveal transferable strengths. Do not include real employer or client details.</small></div>
              <div className="survey-field"><label htmlFor="survey-custom">Other skills to flag for human review</label><input id="survey-custom" value={customSkillsText} onChange={(event) => setCustomSkillsText(event.target.value)} placeholder="Separate fictional skill labels with commas" /><small>Custom skills are shown to HR for review and are not treated as matched catalog skills.</small></div>
              <details className="survey-field"><summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Optional synthetic CV summary</summary>
                <textarea aria-label="Optional synthetic CV summary" value={profile.cvText} onChange={(event) => setProfile({ ...profile, cvText: event.target.value })} placeholder="Only fictional text. The server may parse it to help identify catalog skills." />
              </details>
              </DemoSection>
              <DemoSection enabled={embedded} className="survey-form-section survey-submit">
              {embedded && <h3><ShieldCheck size={20} aria-hidden="true" />Review before sharing</h3>}
              <label className="survey-check"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I understand this is a synthetic-only demo and consent to submit this fictional profile for immediate analysis.</span></label>
              <InlineError>{error}</InlineError>
              <div className="hr-actions"><button className="hr-btn" type="submit" disabled={submitting || !consent}>{submitting ? <LoaderCircle size={15} /> : <ArrowRight size={15} />} {submitting ? "Preparing your map…" : "Submit and see results"}</button>
                {!embedded && <button className="hr-btn secondary" type="button" onClick={autofill} disabled={!sample}><Sparkles size={14} /> Fill sample profile</button>}</div>
              </DemoSection>
            </form>
          </section>
          <aside className="survey-card">
            <h2>{embedded && <BookOpen size={22} aria-hidden="true" />}What happens next</h2><p>Your response is matched against the same catalogued role pathways used in the worker workspace. The results appear here immediately after submission.</p>
            <div className="survey-sample"><h3>Built for reflection</h3><p>Role options are illustrative transition directions—not advertised vacancies. A missing skill means “not declared,” not “cannot do.”</p></div>
            <div className="survey-disclosure"><strong>Scoring in plain language</strong><br />45% required declared skills · 30% transferable strengths · 25% research/scenario context. Proficiency is displayed as self-reported and does not change the role score.</div>
            <div className="survey-disclosure"><strong>Data boundaries</strong><br />No demographic questions. No automated employment decisions. No LLM inference. Metadata and authored scenarios are not a jobs forecast.</div>
          </aside>
        </div>
        {result && <SurveyResults result={result} skills={safeSkills} embedded={embedded} />}
      </>}
      {!embedded && <footer className="survey-bottom">NexusTalent public hackathon demo · Not a production-secured HR platform · Synthetic data only</footer>}
    </main>
  </div>;
}
