import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import "../../hr.css";

export const HUMAN_NOTICE =
  "AI as a Partner: This dashboard supports human L&D and career transition planning. Recommendations are estimates and must not be used for automated hiring, firing, or performance penalties.";
export const SYNTHETIC_NOTICE =
  "Demo Mode: Use synthetic data only. Do not enter real personal data or real CVs.";

export async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
  });
  let payload = {};
  try { payload = await response.json(); } catch {}
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const dateLabel = (value, includeTime = false) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, includeTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" });
};
export const numberLabel = (value) => Number.isFinite(Number(value)) ? Number(value).toLocaleString() : "—";
export const statusClass = (status = "") => status.toLowerCase().replaceAll(" ", "-");
export const sourceDate = (source) => source?.date || source?.publishedAt || source?.publicationDate || source?.published || "";
export const sourceName = (source) => source?.publisher || source?.name || source?.author || "Source publisher not provided";

export function Notice({ children, warning = false }) {
  return <div className={`hr-notice ${warning ? "warning" : ""}`} role="note">
    <ShieldCheck size={18} aria-hidden="true" />
    <div>{children}</div>
  </div>;
}
export function InlineError({ children, onRetry }) {
  if (!children) return null;
  return <div className="hr-error" role="alert">
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
      <AlertCircle size={17} aria-hidden="true" /><span style={{ flex: 1 }}>{children}</span>
      {onRetry && <button className="hr-btn secondary" type="button" onClick={onRetry}>Retry</button>}
    </div>
  </div>;
}

export function SkillRadar({ skills = [], values = {}, targetValues, label = "Skill proficiency radar" }) {
  const points = skills.slice(0, 8);
  if (!points.length) return <div className="hr-empty"><strong>No catalogued skills to plot</strong><p>Declared proficiencies will appear here when available.</p></div>;
  const cx = 160, cy = 145, radius = 98;
  const position = (index, value) => {
    const angle = (Math.PI * 2 * index / points.length) - Math.PI / 2;
    const r = radius * Math.max(0, Math.min(5, Number(value) || 0)) / 5;
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  };
  const labelPosition = (index) => {
    const angle = (Math.PI * 2 * index / points.length) - Math.PI / 2;
    return { x: cx + Math.cos(angle) * 119, y: cy + Math.sin(angle) * 119 };
  };
  const val = (skill) => values[skill.id] ?? values[skill.name] ?? skill.proficiency ?? skill.level ?? 0;
  return <svg className="hr-radar" viewBox="0 0 320 290" role="img" aria-label={label}>
    {[1,2,3,4,5].map((ring) => {
      const coords = points.map((_, i) => position(i, ring)).join(" ");
      return <polygon key={ring} points={coords} fill="none" stroke={ring === 5 ? "#cbd3e5" : "#e6eaf2"} strokeWidth="1" />;
    })}
    {points.map((skill, i) => {
      const p = position(i, 5).split(",");
      const l = labelPosition(i);
      return <g key={skill.id || skill.name}>
        <line x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#e1e6f0" />
        <text x={l.x} y={l.y} textAnchor={l.x < cx - 10 ? "end" : l.x > cx + 10 ? "start" : "middle"} dominantBaseline="middle" fill="#66718a" fontSize="9">{(skill.name || skill.id).slice(0, 17)}</text>
      </g>;
    })}
    {targetValues && <polygon points={points.map((skill, i) => position(i, targetValues[skill.id] || 0)).join(" ")} fill="#d47b62" fillOpacity=".08" stroke="#ac654e" strokeWidth="1.5" strokeDasharray="4 3" />}
    <polygon points={points.map((skill, i) => position(i, val(skill))).join(" ")} fill="#6c7fe8" fillOpacity=".22" stroke="#4355e7" strokeWidth="2" />
    {points.map((skill, i) => {
      const [x, y] = position(i, val(skill)).split(",");
      return <circle key={`point-${skill.id || i}`} cx={x} cy={y} r="3.5" fill="#4355e7" />;
    })}
  </svg>;
}
