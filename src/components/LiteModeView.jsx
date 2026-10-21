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
          <span>⚡ LITE / LOW-BANDWIDTH TEXT-FIRST MODE ACTIVE</span>
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
            {persona?.atomic_tasks?.map(task => (
              <li key={task.task_id} className="py-2 flex items-center justify-between gap-4">
                <span className="text-slate-200">{task.name}</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                  task.is_at_risk ? "bg-rose-950 text-rose-300 border border-rose-700" : "bg-emerald-950 text-emerald-300 border border-emerald-700"
                }`}>
                  {task.baseline_halflife_months} mos runway ({task.is_at_risk ? "Automating Fast" : "Resilient"})
                </span>
              </li>
            ))}
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
