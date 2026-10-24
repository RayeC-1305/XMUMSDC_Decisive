import React, { useMemo, useState } from "react";
import { BookOpen, Clock3, Download, ExternalLink, Search, Users } from "lucide-react";
import { dateLabel } from "./hrShared";
import { changeCohortSelection, filterWorkforce, workforceBrief } from "../../utils/workforceBrief";
import "./workforceActions.css";

export function EmployeeReview({ employees, onInspect }) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("");
  const people = useMemo(() => filterWorkforce(employees, query, risk), [employees, query, risk]);
  return <div className="hr-workforce-tools">
    <div className="hr-panel hr-review-filter-card"><div className="hr-review-filters">
      <div className="hr-field"><label htmlFor="hr-person-search"><Search size={13} /> Find a profile</label><input id="hr-person-search" type="search" placeholder="Alias, job or department" value={query} onChange={event => setQuery(event.target.value)} /></div>
      <div className="hr-field"><label htmlFor="hr-risk-filter">Exposure proxy</label><select id="hr-risk-filter" value={risk} onChange={event => setRisk(event.target.value)}><option value="">All levels</option>{["Low", "Moderate", "High"].map(level => <option key={level}>{level}</option>)}</select></div>
    </div>
    <p className="hr-review-count" role="status">{people.length} of {employees.length} profiles · Select an alias to explore its pathway.</p>
    </div>
    {people.length ? <div className="hr-table-wrap"><table className="hr-table" aria-label="Employee review"><thead><tr><th scope="col">Alias</th><th scope="col">Department</th><th scope="col">Current role</th><th scope="col">Exposure proxy</th><th scope="col">Submitted</th></tr></thead><tbody>{people.map(person =>
      <tr key={person.id}><td><button className="hr-person" type="button" onClick={() => onInspect(person)}>{person.alias}</button></td><td>{person.department}</td><td>{person.profile?.role || "—"}</td><td><span className={`hr-risk ${(person.risk?.level || "").toLowerCase()}`}>{person.risk?.level || "Not rated"}</span></td><td>{dateLabel(person.submittedAt)}</td></tr>,
    )}</tbody></table></div> : <div className="hr-empty"><strong>{employees.length ? "No matching profiles" : "No employee profiles yet"}</strong><p>{employees.length ? "Try another alias or exposure level." : "Submit a fictional response in Respond."}</p>{(query || risk) && <button className="hr-btn secondary" onClick={() => { setQuery(""); setRisk(""); }}>Clear filters</button>}</div>}
  </div>;
}

export function CohortPlanner({ dashboard, onInspect }) {
  const cohorts = useMemo(() => [...(dashboard?.cohorts || [])].sort((a, b) => a.order - b.order), [dashboard?.cohorts]);
  const [selection, setSelection] = useState(null);
  const [message, setMessage] = useState("");
  const ids = selection || cohorts.map(cohort => cohort.skillId);
  const selected = cohorts.filter(cohort => ids.includes(cohort.skillId));
  function toggle(cohort, include) {
    setSelection(changeCohortSelection(cohorts, ids, cohort.skillId, include));
    setMessage(include ? "Cohort and any required foundations included." : "Cohort and any dependent learning removed from the brief.");
  }
  function download() {
    try {
      const blob = new Blob([workforceBrief(dashboard, selected)], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nexustalent-department-brief-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Brief downloaded with the selected learning sequence and source citations.");
    } catch { setMessage("The browser could not download the brief. Please try again."); }
  }
  if (!cohorts.length) return <div className="hr-empty"><strong>No cohorts mapped yet</strong><p>Submit a fictional response to create a learning plan.</p></div>;
  return <div className="hr-workforce-tools">
    <div className="hr-panel hr-brief-card"><div className="hr-brief-toolbar"><div><span className="hr-eyebrow"><BookOpen size={16} /> Your department learning brief</span><strong>{selected.length} of {cohorts.length} cohorts in your brief</strong><small>Choose a learning sequence. Required foundations stay included.</small></div><button className="hr-btn" disabled={!selected.length} onClick={download}><Download size={17} /> Download learning brief</button></div>
    <p className="hr-brief-message" role="status">{message || "Brief selection only—not training completion."}</p></div>
    <div className="hr-pathway">{cohorts.map(cohort => <article className="hr-step hr-cohort-step" key={cohort.skillId}>
      <label className="hr-cohort-check"><input type="checkbox" checked={ids.includes(cohort.skillId)} onChange={event => toggle(cohort, event.target.checked)} aria-label={`Include ${cohort.title} in brief`} /><span className="hr-sr-only">Include in brief</span></label>
      <div className="hr-cohort-body"><strong>{cohort.order}. {cohort.title}</strong><div className="hr-cohort-meta"><span><Users size={16} aria-hidden="true" />{cohort.employeeCount} participants</span><span><Clock3 size={16} aria-hidden="true" />{cohort.hours} h · {cohort.estimatedWeeks} weeks</span></div>
        <details><summary>People, prerequisites &amp; sources</summary>
          <div className="hr-cohort-people">{cohort.employeeIds.map(id => {
            const person = dashboard.employees.find(employee => employee.id === id);
            return person ? <button key={id} className="hr-person" onClick={() => onInspect(person)}>{person.alias}</button> : null;
          })}</div>
          <p>Prerequisites: {cohort.prerequisiteSkillIds.length ? cohort.prerequisiteSkillIds.map(id => dashboard.skills.find(skill => skill.id === id)?.name || id).join(", ") : "None listed"}</p>
          {cohort.resource?.url && <p><a href={cohort.resource.url} target="_blank" rel="noreferrer">{cohort.resource.title || cohort.resource.provider} <ExternalLink size={11} /></a></p>}
          <p>{cohort.resource?.provider} · Catalogued {dateLabel(cohort.resource?.cataloguedOn)} · Weeks {cohort.startWeek}–{cohort.endWeek}. Public reading MYR 0; optional costs excluded.</p>
        </details>
      </div>
    </article>)}</div>
  </div>;
}
