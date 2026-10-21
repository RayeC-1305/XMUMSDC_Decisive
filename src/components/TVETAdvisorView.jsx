import React, { useState } from "react";
import {
  GraduationCap,
  AlertOctagon,
  Pin,
  CheckCircle,
  Download,
  BookOpen,
  Sparkles,
  TrendingUp,
  BarChart3,
  Award,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Home
} from "lucide-react";

export default function TVETAdvisorView({
  t,
  tvetCohort,
  courses = [],
  onEndorseCourse,
  activeInjectedSignals = [],
  onReturnHome
}) {
  const [activeSlide, setActiveSlide] = useState(1);
  const [downloadNotice, setDownloadNotice] = useState(null);

  const handleExportReport = () => {
    const reportData = {
      institution: tvetCohort?.institution || "National TVET & Applied Polytechnic Network",
      generated_at: new Date().toISOString(),
      cohort_size: tvetCohort?.total_students || 120,
      active_signals_injected: activeInjectedSignals.length,
      tracks: tvetCohort?.tracks || [],
      sdg_readiness: tvetCohort?.sdg_readiness || []
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NexusTalent360_TVET_Cohort_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotice("Cohort Alignment Audit Report successfully exported.");
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4 animate-fadeIn">
      {/* Slide Navigation Stepper Header */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnHome}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Return to Landing Portal"
          >
            <Home className="w-3.5 h-3.5 text-purple-400" />
            <span>Home</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">TVET & University Career Centre Observatory</span>
        </div>

        {/* Stepper Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { slide: 1, label: "1. Curriculum Blindspots" },
            { slide: 2, label: "2. 1-Click Endorsement Hub" },
            { slide: 3, label: "3. Regional SDG Funnel" }
          ].map(s => (
            <button
              key={s.slide}
              onClick={() => setActiveSlide(s.slide)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSlide === s.slide
                  ? "bg-purple-600 text-white shadow font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE 1 OF 3: Reverse-Triggered Curriculum Blindspot Radar                */}
      {/* ========================================================================= */}
      {activeSlide === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                Step 1 of 3 • Reverse Curriculum Audit
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Reverse-Triggered Curriculum Blindspot Radar
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compares 120 students' syllabus skills against active market velocity. Red alerts trigger automatically when velocity &gt;40% and cohort mastery &lt;18%.
              </p>
            </div>

            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Cohort Report</span>
            </button>
          </div>

          {downloadNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200 font-semibold animate-fadeIn">
              {downloadNotice}
            </div>
          )}

          {/* 4 Tracks Grid with Calculated Obsolescence Risk */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tvetCohort?.tracks?.map((track, idx) => {
                const hasInjectedSignals = (activeInjectedSignals && activeInjectedSignals.length > 0);
                const isCritical = hasInjectedSignals ? (track.status === "CRITICAL_BLINDSPOT") : false;
                const riskPct = hasInjectedSignals ? (track.curriculum_risk_pct || 46) : 46;
                const deltaVel = hasInjectedSignals ? (track.delta_velocity_pct !== undefined ? track.delta_velocity_pct : 0) : 0;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-3 ${
                      isCritical
                        ? "bg-rose-950/25 border-rose-800/80 text-rose-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          Track ({track.student_count} Students)
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{track.track_name}</h4>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isCritical
                            ? "bg-rose-500 text-white animate-pulse"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          {hasInjectedSignals ? track.status : "STABLE"}
                        </span>
                        <div className="text-[10px] font-mono font-bold text-rose-400 mt-1">
                          Curriculum Risk: {riskPct}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Market Demand Velocity:</span>
                        <span className="font-mono font-bold flex items-center gap-1.5">
                          <span className="text-slate-200">{track.market_demand_velocity}x</span>
                          {deltaVel > 0 ? (
                            <span className="text-emerald-400 font-bold">
                              (+{deltaVel}% Surge ⚡)
                            </span>
                          ) : (
                            <span className="text-slate-500 font-normal">
                              (Baseline)
                            </span>
                          )}
                        </span>
                      </div>
                      {hasInjectedSignals && track.surge_signal_title && (
                        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 mt-0.5 flex items-center justify-between">
                          <span>Active Market Driver:</span>
                          <span className="font-bold">{track.surge_signal_title}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] pt-0.5">
                        <span className="text-slate-400">Current Syllabus Mastery:</span>
                        <span className="font-mono font-bold text-rose-400">{track.cohort_mastery_pct}% (Deficit: {100 - track.cohort_mastery_pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isCritical ? "bg-rose-500" : "bg-amber-400"}`}
                          style={{ width: `${track.cohort_mastery_pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
                      <strong className="text-slate-300 block mb-1">Identified Curriculum Gaps:</strong>
                      <div className="flex flex-wrap gap-1">
                        {track.emerging_blindspots.map(gap => (
                          <span key={gap} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                            • {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveSlide(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 2 — 1-Click Endorsement Hub</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 2 OF 3: 1-Click Micro-Credential Endorsement Hub                     */}
      {/* ========================================================================= */}
      {activeSlide === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                Step 2 of 3 • Human-in-the-Loop Governance
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                1-Click Micro-Credential Endorsement Hub
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pin verified industry courses to immediately tag them with <strong>"Endorsed by TVET Career Centre"</strong> on all worker & student dashboards.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {courses.slice(0, 8).map(course => {
                const isEndorsed = course.endorsed_by_tvet;
                return (
                  <div
                    key={course.course_id}
                    className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isEndorsed
                        ? "bg-purple-950/20 border-purple-500/50 text-slate-200 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-slate-500">{course.course_id}</span>
                        <h4 className="font-bold text-white text-xs">{course.title}</h4>
                        {isEndorsed && (
                          <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            📌 Active Endorsement
                          </span>
                        )}
                        {course.is_no_regret_core && (
                          <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-yellow-500 text-slate-950 font-mono">
                            ⭐ NO-REGRET CORE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Provider: {course.provider} • Cost: <strong className="text-emerald-400">{course.cost}</strong> • Duration: {course.duration}
                      </div>
                    </div>

                    <button
                      onClick={() => onEndorseCourse(course.course_id)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isEndorsed
                          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${isEndorsed ? "rotate-45" : ""}`} />
                      <span>{isEndorsed ? "📌 Endorsed (Click to Unpin)" : "Pin & Endorse to Cohort"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveSlide(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: Step 1</span>
            </button>
            <button
              onClick={() => setActiveSlide(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 3 — Regional SDG Funnel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 3 OF 3: Regional SDG Readiness Funnel & Export                      */}
      {/* ========================================================================= */}
      {activeSlide === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                Step 3 of 3 • Macro Impact & SDG Readiness
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Regional SDG Readiness Funnel
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tracks cohort readiness across UN SDG targets. Dynamically shifts when Macro Scenarios or Green Signals are injected.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="space-y-4">
              {tvetCohort?.sdg_readiness?.map(sdg => (
                <div key={sdg.target} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-200">{sdg.target}</span>
                    <span className="font-mono font-bold text-emerald-400">{sdg.ready_pct}% Ready</span>
                  </div>

                  <div className="w-full bg-slate-950 h-3.5 rounded-full flex overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${sdg.ready_pct}%` }}
                      title={`${sdg.ready_pct}% Certified`}
                    />
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${sdg.in_training_pct}%` }}
                      title={`${sdg.in_training_pct}% In Training`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${sdg.unprepared_pct}%` }}
                      title={`${sdg.unprepared_pct}% Gap`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Certified: {sdg.ready_pct}%</span>
                    <span>In Training: {sdg.in_training_pct}%</span>
                    <span>Gap: {sdg.unprepared_pct}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-bold text-slate-200">SDG Regional Impact Summary:</div>
              <p className="text-[11px]">
                Under active national net-zero roadmaps, TVET students equipped with micro-credentials in TinyML and Scope 3 auditing demonstrate a 3.2x higher placement rate into high-value clean economy roles.
              </p>
            </div>
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveSlide(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: Step 2</span>
            </button>
            <button
              onClick={onReturnHome}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home Portal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
