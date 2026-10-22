import React from "react";
import { Zap, ShieldCheck, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";

export default function LiteModeView({
  t,
  persona,
  roleMatches,
  courses,
  activeSignals,
  onInspectSignal
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* High-Contrast Low-Bandwidth Header */}
      <div className="p-4 bg-emerald-950 border-2 border-emerald-500 rounded-lg text-emerald-200">
        <div className="flex items-center gap-2 font-bold text-base">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span>{t?.lite_mode_on || "⚡ LITE / LOW-BANDWIDTH TEXT-FIRST MODE ACTIVE"}</span>
        </div>
        <p className="text-xs text-emerald-300 mt-1">
          SVG charts, animations, and heavy canvas assets have been stripped. Optimized for rural TVET workshops, 2G/3G connectivity, and screen readers.
        </p>
      </div>

      {/* Section 1: Worker Atomic Tasks & Half-Life Runway */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700 pb-2">
          1. Candidate Profile: {persona?.name} ({persona?.display_title})
        </h2>
        <div className="text-xs text-slate-300">
          <strong>Location:</strong> {persona?.location} | <strong>Education:</strong> {persona?.education}
        </div>

        <div className="space-y-2 mt-2">
          <div className="text-xs font-bold uppercase text-slate-400">Atomic Tasks & Skill Half-Life:</div>
          <ul className="divide-y divide-slate-800 text-xs">
            {persona?.atomic_tasks?.map(task => {
              const displayMonths = task.dynamic_halflife_months || task.runway_months || task.baseline_halflife_months;
              const deltaMonths = task.delta_months || 0;
              return (
                <li key={task.task_id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80">
                  <div>
                    <span className="text-slate-100 font-semibold">{task.name}</span>
                    {task.source_evidence && task.source_evidence !== task.name && (
                      <div className="text-[11px] text-slate-400 italic">Evidence: "{task.source_evidence}"</div>
                    )}
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0 self-start sm:self-auto border ${
                    task.is_at_risk ? "bg-rose-950/60 text-rose-300 border-rose-800" : "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                  }`}>
                    {displayMonths} mos runway {deltaMonths !== 0 && `(${deltaMonths > 0 ? "+" : ""}${deltaMonths} mos ⚡)`} • {Math.round(task.transferable_strength * 100)}% transfer
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Section 2: Explainable Future Roles */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700 pb-2">
          2. Explainable Green & AI Role Matches (Formula: 0.45 Overlap + 0.30 Transfer + 0.25 Trend)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800 text-slate-300 uppercase text-[10px] border-b border-slate-700">
              <tr>
                <th className="p-2">Rank</th>
                <th className="p-2">Future Role Title</th>
                <th className="p-2">Department</th>
                <th className="p-2">Match Score</th>
                <th className="p-2">Monthly Median Salary</th>
                <th className="p-2">SDGs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {roleMatches?.slice(0, 5).map((role, idx) => (
                <tr key={role.role_id} className="hover:bg-slate-800/50">
                  <td className="p-2 font-bold text-emerald-400">#{idx + 1}</td>
                  <td className="p-2 font-sans font-bold text-slate-100">{role.title}</td>
                  <td className="p-2 font-sans text-slate-400">{role.department}</td>
                  <td className="p-2 font-bold text-emerald-400 text-sm">{role.match_score_pct}%</td>
                  <td className="p-2 text-slate-300 font-sans">RM {role.median_salary_myr}</td>
                  <td className="p-2 text-slate-400">{role.sdg_targets?.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Role Skills Gap Analysis in Text Mode */}
        {roleMatches?.[0] && (
          <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded space-y-2 text-xs">
            <div className="font-bold text-emerald-400">
              Top Role Skills Gap Analysis: {roleMatches[0].title} ({roleMatches[0].match_score_pct}% Fit)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-bold block">✓ Verified Transferable Capabilities:</span>
                <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                  {roleMatches[0].matched_tasks?.slice(0, 3).map((m, i) => (
                    <li key={i}>{m.workerTask} ({Math.round(m.similarity * 100)}% match)</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-rose-400 font-bold block">⚠ Missing Skills Deficits to Bridge:</span>
                <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                  {roleMatches[0].missing_skill_gaps && roleMatches[0].missing_skill_gaps.length > 0 ? (
                    roleMatches[0].missing_skill_gaps.map((gap, i) => (
                      <li key={i}>{gap.name} (Velocity: {gap.velocity}x, {gap.sdg_targets?.join(", ")})</li>
                    ))
                  ) : (
                    <li className="text-emerald-400">All required competencies covered!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Verified Free / HRD Corp Reskilling Modules */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700 pb-2">
          3. Verified Free & HRD Corp Claimable Learning Modules
        </h2>
        <ul className="divide-y divide-slate-800 text-xs">
          {courses?.slice(0, 8).map(course => (
            <li key={course.course_id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span>{course.title}</span>
                  {course.is_no_regret_core && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-950 text-yellow-400 border border-yellow-700 font-mono">
                      ⭐ NO-REGRET CORE
                    </span>
                  )}
                  {course.endorsed_by_tvet && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-700 font-mono">
                      📌 TVET ENDORSED
                    </span>
                  )}
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Provider: {course.provider} | Duration: {course.duration} | Cost: <strong className="text-emerald-400">{course.cost}</strong>
                </div>
              </div>
              <a
                href={course.provider_url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded border border-slate-600 font-medium"
              >
                Access Course <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Active Dated Signals */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-2">
        <h2 className="text-base font-bold text-white border-b border-slate-700 pb-2">
          4. Active Market Signals (arXiv + data.gov.my + MyFutureJobs)
        </h2>
        <ul className="divide-y divide-slate-800 text-xs">
          {activeSignals?.map(signal => (
            <li key={signal.id} className="py-2 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-200">[{signal.date}] {signal.title}</span>
                <span className="text-slate-400 ml-2">({signal.source_name})</span>
              </div>
              <button
                onClick={() => onInspectSignal(signal)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 shrink-0"
              >
                Inspect Proof
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
