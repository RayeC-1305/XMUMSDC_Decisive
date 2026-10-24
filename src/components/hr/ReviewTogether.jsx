import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardCheck, Download, MessageSquare } from "lucide-react";
import { capabilityPriorities, reviewFingerprint } from "../../utils/workforceReview";
import { workforceBrief } from "../../utils/workforceBrief";
import "./workforceReview.css";

const checks = ["Confirm undeclared skills with employees", "Discuss protected learning time with the team", "Review assumptions—not hiring or performance decisions"];
export default function ReviewTogether({ dashboard, scope, onNavigate }) {
  const key = `nexus-hr-discussion:${scope || "all"}`;
  const [notes, setNotes] = useState(() => { try { return sessionStorage.getItem(key) || ""; } catch { return ""; } });
  const [checked, setChecked] = useState([]);
  const [message, setMessage] = useState("");
  const fingerprint = reviewFingerprint(dashboard);
  useEffect(() => { setChecked([]); setMessage(""); }, [fingerprint]);
  const priorities = useMemo(() => capabilityPriorities(dashboard?.employees, dashboard?.skills).slice(0, 3), [dashboard]);
  const employees = dashboard?.employees || [];
  function saveNotes(value) {
    setNotes(value);
    try { sessionStorage.setItem(key, value); setMessage("Discussion notes saved for this browser session."); }
    catch { setMessage("Notes could not be saved in this browser. Download the brief to keep them."); }
  }
  function download() {
    const text = workforceBrief(dashboard, dashboard.cohorts) + "\n## Team discussion\n" +
      priorities.map(item => `- ${item.name}: ${item.critical} critical gaps; ${item.unknown} undeclared profiles.`).join("\n") +
      "\n\nPreparation checks (not team approval):\n" + checks.map(label => `- Reviewed: ${label}`).join("\n") +
      `\n\nDiscussion notes:\n${notes.trim() || "No notes added."}\n\nAgree owners and dates with employees after this discussion. No plan has been automatically approved or assigned.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "nexustalent-team-discussion.md";
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Discussion brief downloaded. It is a draft for human review, not an approved training assignment.");
  }
  return <div className="hr-review-workspace">
    <section className="hr-panel"><div className="hr-panel-head"><div><h2><MessageSquare aria-hidden="true" />Prepare the team conversation</h2><p>Turn the analysis into a discussion: validate priorities, agree learning time, then take a cited brief to your team.</p></div></div>
      {!employees.length ? <div className="hr-empty"><strong>No responses to review yet</strong><button className="hr-btn" onClick={() => onNavigate("respond")}>Collect a sample response <ArrowRight size={16} /></button></div> : <>
        <div className="hr-review-priorities">{priorities.map(item => <article key={item.id}><h3>{item.name}</h3><p>{item.critical} critical gaps · {item.unknown} not declared</p></article>)}</div>
        <div className="hr-actions"><button className="hr-btn secondary" onClick={() => onNavigate("skills")}>Check skills evidence</button><button className="hr-btn secondary" onClick={() => onNavigate("plan")}>Review learning cohorts</button></div>
        <p className="hr-map-count">Top skills by average scenario urgency. Unknown skills need confirmation, not automatic training.</p>
      </>}
    </section>
    <section className="hr-panel"><div className="hr-panel-head"><div><h2><ClipboardCheck aria-hidden="true" />Ready for a human review?</h2><p>These preparation checks are yours—not employee consent or a management approval. Changes to the analysis reset them.</p></div></div>
      <div className="hr-review-checks">{checks.map((label, index) => <label key={label}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(current => event.target.checked ? [...current, index] : current.filter(item => item !== index))} />{label}</label>)}</div>
      <div className="hr-field"><label htmlFor="hr-discussion-notes">Discussion notes · synthetic details only</label><textarea id="hr-discussion-notes" maxLength={2000} rows={4} value={notes} onChange={event => saveNotes(event.target.value)} placeholder="What should the team confirm? What learning time could be protected?" /><small>Saved in this browser session only. The brief includes the full recommended cohort sequence and citations.</small></div>
      <div className="hr-actions"><button className="hr-btn" disabled={!employees.length || checked.length !== checks.length} onClick={download}><Download size={16} />Download discussion brief</button><span>{checked.length} / {checks.length} preparation checks</span></div>
      <p role="status">{message}</p>
    </section>
  </div>;
}
