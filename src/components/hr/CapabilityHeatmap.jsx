import React, { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { capabilityPriorities } from "../../utils/workforceReview";
import "./workforceReview.css";

export default function CapabilityHeatmap({ employees, skills, cohorts, onInspect, onPlan }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState("");
  const priorities = useMemo(() => capabilityPriorities(employees, skills), [employees, skills]);
  const rows = priorities.filter(row => filter === "all" || (filter === "critical" ? row.critical > 0 : filter === "unknown" ? row.unknown > 0 : row.direction === "declining"));
  const detail = priorities.find(row => row.id === selected);
  const cohort = cohorts.find(item => item.skillId === selected);
  if (!employees.length) return <div className="hr-empty"><strong>Waiting for survey responses</strong><p>Submit a fictional profile to see skills coverage and learning priorities.</p></div>;
  return <>
    <div className="hr-map-guide"><Info size={20} /><p><strong>Use this map to choose learning priorities.</strong> Rows are skills; columns are people. Select a skill to see its training need, or a cell to open that person’s pathway. Highest average urgency appears first.</p></div>
    <div className="hr-map-filters" role="group" aria-label="Filter capability skills">
      {[["all", "All skills"], ["critical", "Critical gaps"], ["unknown", "Not declared"], ["declining", "Declining skills"]].map(([id, label]) => <button className="hr-btn secondary" key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
    </div>
    <p className="hr-map-count" role="status">{rows.length} skills · {employees.length} profiles · scenario-based priorities, not performance ratings</p>
    {rows.length ? <div className="hr-heatmap-scroll" role="region" aria-label="Scrollable workforce capability heatmap" tabIndex="0">
      <table className="hr-heatmap"><thead><tr><th scope="col">Skill / learning need</th>{employees.map(person => <th scope="col" key={person.id}>{person.alias}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id}><th scope="row"><button className="hr-skill-choice" aria-pressed={selected === row.id} onClick={() => setSelected(row.id)}>{row.name}</button><small>{row.direction} · {row.critical} critical · {row.unknown} undeclared</small></th>{employees.map(person => {
          const cell = person.heatmap.find(item => item.skillId === row.id);
          const state = cell?.status || "Not declared";
          const kind = !cell?.proficiency ? "unknown" : state.includes("Critical") ? "critical" : state.includes("Declining") ? "declining" : state.includes("Strong") ? "strong" : "moderate";
          return <td key={person.id}><button className={`hr-cell ${kind}`} onClick={() => onInspect(person)} aria-label={`${person.alias}, ${row.name}: ${state}, proficiency ${cell?.proficiency || "not declared"}, urgency ${cell?.urgency ?? "unknown"}`}><strong>{cell?.proficiency ? `${cell.proficiency}/5` : "—"}</strong><small>{cell?.proficiency ? `Urgency ${cell.urgency}` : "Not declared"}</small></button></td>;
        })}</tr>)}</tbody></table>
    </div> : <div className="hr-empty"><strong>No skills match this view</strong><p>Choose All skills or change the planning scenario.</p></div>}
    <div className="hr-legend">{[["strong", "Strong coverage"], ["moderate", "Moderate gap"], ["critical", "Critical gap"], ["declining", "Declining priority"], ["unknown", "Not declared"]].map(([kind, label]) => <span key={kind}><i className={kind} />{label}</span>)}</div>
    {detail && <section className="hr-map-detail" aria-label="Selected skill learning priority"><h3>{detail.name}</h3><p>{detail.critical} profiles have a critical planning gap. {detail.unknown} have not declared proficiency; confirm these with the person before assigning training.</p>
      {cohort ? <><p><strong>{cohort.employeeCount} people in the recommended cohort · {cohort.hours} learning hours</strong></p><a href={cohort.resource.url} target="_blank" rel="noreferrer">{cohort.resource.title} · {cohort.resource.provider}</a><button className="hr-btn" onClick={onPlan}>Review learning cohorts <ArrowRight size={15} /></button></> : <p>No cohort is currently recommended for this skill. Discuss relevance before adding training.</p>}
    </section>}
    <details className="hr-demo-help"><summary>What do proficiency and urgency mean?</summary><p>Proficiency is a self-rating from 1–5. A dash means unknown, not inability. Urgency combines a gap from proficiency 4 with scenario weights; it can exceed 100 and is not a probability. Purple marks a declining skill priority, not declining employee performance. These values guide conversations, not hiring, firing or penalties.</p></details>
  </>;
}
