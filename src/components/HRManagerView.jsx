import React, { useState, useMemo } from "react";
import {
  Building2,
  Users,
  Calculator,
  Radio,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Home
} from "lucide-react";

export default function HRManagerView({
  t,
  smeWorkforce = [],
  workforceSummary,
  roles = [],
  onBroadcastDemand,
  hrBroadcasts = [],
  activeInjectedSignals = [],
  onReturnHome
}) {
  const [activeSlide, setActiveSlide] = useState(1);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");

  // ROI Calculator Interactive State
  const [atRiskCount, setAtRiskCount] = useState(workforceSummary?.high_risk_count || 18);
  const [severancePerHead, setSeverancePerHead] = useState(18000);
  const [recruitmentPerHead, setRecruitmentPerHead] = useState(15000);
  const [reskillCostPerHead, setReskillCostPerHead] = useState(4500);

  // Broadcast Form State
  const [broadcastRole, setBroadcastRole] = useState("ROLE-01");
  const [broadcastCount, setBroadcastCount] = useState(12);
  const [broadcastLocation, setBroadcastLocation] = useState("Johor & Klang Valley");
  const [broadcastFeedback, setBroadcastFeedback] = useState(null);

  // Filtered Workforce
  const filteredEmployees = useMemo(() => {
    return smeWorkforce.filter(emp => {
      const matchDept = selectedDept === "ALL" || emp.dept === selectedDept;
      const matchRisk =
        riskFilter === "ALL" ||
        (riskFilter === "HIGH" && emp.automation_risk >= 0.70) ||
        (riskFilter === "MODERATE" && emp.automation_risk >= 0.40 && emp.automation_risk < 0.70) ||
        (riskFilter === "LOW" && emp.automation_risk < 0.40);
      return matchDept && matchRisk;
    });
  }, [smeWorkforce, selectedDept, riskFilter]);

  // Overall Statistics from Filtered or Full Workforce
  const avgExposure = useMemo(() => {
    if (!smeWorkforce.length) return 66;
    const sum = smeWorkforce.reduce((acc, e) => acc + e.automation_risk, 0);
    return Math.round((sum / smeWorkforce.length) * 100);
  }, [smeWorkforce]);

  const highRiskEmployeesCount = useMemo(() => {
    return smeWorkforce.filter(e => e.automation_risk >= 0.70).length;
  }, [smeWorkforce]);

  // ROI Math
  const totalSeveranceCost = atRiskCount * severancePerHead;
  const totalRecruitmentCost = atRiskCount * recruitmentPerHead;
  const totalTraditionalCost = totalSeveranceCost + totalRecruitmentCost;
  const totalReskillingCost = atRiskCount * reskillCostPerHead;
  const outOfPocketReskilling = 0; // 100% HRD Corp Levy claimable
  const netSavings = totalTraditionalCost - outOfPocketReskilling;

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    const roleObj = roles.find(r => r.role_id === broadcastRole);
    onBroadcastDemand({
      role_id: broadcastRole,
      role_title: roleObj?.title || "AI-Augmented Green Role",
      needed_count: Number(broadcastCount),
      location: broadcastLocation
    });
    setBroadcastFeedback(`Successfully broadcasted Q1 2027 demand for ${broadcastCount}x ${roleObj?.title}! Regional demand updated in Worker & TVET views.`);
    setTimeout(() => setBroadcastFeedback(null), 5000);
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
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span>Home</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">HR & L&D Manager Command Centre</span>
        </div>

        {/* Stepper Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { slide: 1, label: "1. 50-Employee Heatmap" },
            { slide: 2, label: "2. HRD Corp ROI Calculator" },
            { slide: 3, label: "3. Demand Broadcaster" }
          ].map(s => (
            <button
              key={s.slide}
              onClick={() => setActiveSlide(s.slide)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSlide === s.slide
                  ? "bg-blue-600 text-white shadow font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE 1 OF 3: 50-Employee Skills Gap Heatmap Matrix                       */}
      {/* ========================================================================= */}
      {activeSlide === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                Step 1 of 3 • Workforce Automation Exposure
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                50-Employee Skills-Gap & Redeployment Heatmap
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time risk tracking. Live signals dynamically shift department risk percentages (e.g. Agentic SQL triggers +14% risk for Finance clerks).
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300"
              >
                <option value="ALL">All Depts (50)</option>
                <option value="Finance">Finance (14)</option>
                <option value="QA">QA (10)</option>
                <option value="Operations">Operations (16)</option>
                <option value="Logistics">Logistics (10)</option>
              </select>

              <select
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="HIGH">High Exposure (&gt;70%)</option>
                <option value="MODERATE">Moderate (40-70%)</option>
                <option value="LOW">Low (&lt;40%)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Workforce Metric Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Avg Workforce Risk</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">{avgExposure}%</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {activeInjectedSignals.length > 0 ? "Shifted by live signals" : "Baseline"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">High-Exposure Staff</div>
              <div className="text-xl font-black text-rose-400 font-mono mt-0.5">{highRiskEmployeesCount} Staff</div>
              <div className="text-[10px] text-rose-400/80 font-mono">&gt;70% AI Automation Exposure</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Layoff Cost Exposure</div>
              <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                RM {(highRiskEmployeesCount * 18000).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Severance liability</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="text-[10px] uppercase font-mono text-emerald-400">Retained HRD Savings</div>
              <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">
                RM {(highRiskEmployeesCount * 18000).toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono">100% Levy Redeployment</div>
            </div>
          </div>

          {/* Matrix of 50 Employees */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[440px] overflow-y-auto pr-1">
              {filteredEmployees.map(emp => {
                const isHigh = emp.automation_risk >= 0.70;
                const isMod = emp.automation_risk >= 0.40 && emp.automation_risk < 0.70;
                const hasInjectedSignals = (activeInjectedSignals && activeInjectedSignals.length > 0);
                const delta = hasInjectedSignals ? (emp.delta_risk_pct || 0) : 0;

                return (
                  <div
                    key={emp.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      isHigh
                        ? "bg-rose-950/25 border-rose-800/60 text-rose-200"
                        : isMod
                        ? "bg-amber-950/25 border-amber-800/60 text-amber-200"
                        : "bg-emerald-950/25 border-emerald-800/60 text-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-slate-300">{emp.id}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-900/80 text-slate-400">{emp.dept}</span>
                    </div>
                    <div className="font-bold text-slate-100 truncate text-[11px]">{emp.role}</div>

                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Exposure:</span>
                      <span className="font-mono font-bold flex items-center gap-1">
                        {Math.round(emp.automation_risk * 100)}%
                        {delta !== 0 && (
                          <span className={`text-[9px] ${delta > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}`}>
                            ({delta > 0 ? `+${delta}%` : `${delta}%`}⚡)
                          </span>
                        )}
                      </span>
                    </div>

                    {hasInjectedSignals && emp.signal_trigger_tag && (
                      <div className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-600/60 truncate mt-1 animate-pulse">
                        {emp.signal_trigger_tag}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 truncate pt-1 border-t border-slate-800/60 flex justify-between items-center">
                      <span className="truncate">Target: <strong className="text-emerald-400">{emp.redeployment_role.split("(")[0]}</strong></span>
                      <span className="font-mono text-emerald-400 text-[9px] shrink-0 font-bold">{emp.reskill_ready}% ready</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span>Showing {filteredEmployees.length} of 50 Employees • Zero Involuntary Retrenchments Target</span>
              <span className="text-emerald-400 font-mono font-bold">100% Redeployment Pipeline Active</span>
            </div>
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveSlide(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 2 — HRD Corp ROI Calculator</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 2 OF 3: HRD Corp Levy & Layoff-Prevention ROI Calculator            */}
      {/* ========================================================================= */}
      {activeSlide === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                Step 2 of 3 • Financial Feasibility & Layoff Prevention
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                HRD Corp Levy & Layoff-Prevention ROI Calculator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compare the punitive costs of retrenchment + external rehiring against <strong>RM 0 out-of-pocket internal reskilling</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sliders Column */}
            <div className="md:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Adjust Enterprise Transition Parameters:</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>At-Risk Employees to Transition:</span>
                    <span className="font-mono font-bold text-emerald-400">{atRiskCount} Staff</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={atRiskCount}
                    onChange={e => setAtRiskCount(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Average Severance Package per Head:</span>
                    <span className="font-mono font-bold text-slate-200">RM {severancePerHead.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="8000"
                    max="35000"
                    step="1000"
                    value={severancePerHead}
                    onChange={e => setSeverancePerHead(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>External Talent Recruitment Cost:</span>
                    <span className="font-mono font-bold text-slate-200">RM {recruitmentPerHead.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="30000"
                    step="1000"
                    value={recruitmentPerHead}
                    onChange={e => setRecruitmentPerHead(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Financial Result Column */}
            <div className="md:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-3">Financial Comparison:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800 space-y-1">
                    <div className="text-[10px] font-mono text-rose-400 uppercase">Cost of Layoff + Rehiring:</div>
                    <div className="text-xl font-black text-rose-300 font-mono">
                      RM {totalTraditionalCost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Severance + Agency Fees
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 space-y-1">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase">Internal Reskilling Cost:</div>
                    <div className="text-xl font-black text-emerald-300 font-mono">
                      RM 0 Out-of-Pocket
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      100% Claimable via HRD Levy
                    </div>
                  </div>
                </div>

                {/* Net Savings Callout */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Net Enterprise Savings:</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      RM {netSavings.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Institutional Knowledge:</span>
                    <div className="text-sm font-bold text-white font-mono">94% Retained</div>
                  </div>
                </div>
              </div>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 3 — Demand Broadcaster</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 3 OF 3: Demand Broadcaster & Company SDG Impact Ledger               */}
      {/* ========================================================================= */}
      {activeSlide === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                Step 3 of 3 • Live Ecosystem Synchronization
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                HR Demand Broadcaster & SDG Impact Ledger
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Log Q1 2027 project hiring needs to immediately increment regional demand scores in the Worker & TVET views.
              </p>
            </div>
          </div>

          {broadcastFeedback && (
            <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200 font-semibold animate-fadeIn">
              {broadcastFeedback}
            </div>
          )}

          {/* Broadcaster Form */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Log Q1 2027 Green-AI Project Need:</span>
            </h3>

            <form onSubmit={handleBroadcastSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Target Role:</label>
                <select
                  value={broadcastRole}
                  onChange={e => setBroadcastRole(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {roles.map(r => (
                    <option key={r.role_id} value={r.role_id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Headcount Needed:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={broadcastCount}
                  onChange={e => setBroadcastCount(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Region:</label>
                <input
                  type="text"
                  value={broadcastLocation}
                  onChange={e => setBroadcastLocation(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Johor Green-AI DC Corridor"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Radio className="w-4 h-4" />
                  <span>Broadcast Signal</span>
                </button>
              </div>
            </form>

            {/* Broadcasts List */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Broadcast Signals:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hrBroadcasts.map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{b.needed_count}x {b.role_title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-blue-300">
                          {b.location}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ID: {b.id} • Mandate: {b.urgency || "Q1 2027 NETR"}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live in Worker View
                    </span>
                  </div>
                ))}
              </div>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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
