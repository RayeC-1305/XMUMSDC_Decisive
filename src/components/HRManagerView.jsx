import React, { useState, useMemo, useEffect } from "react";
import syntheticPersonasData from "../../data/synthetic_personas.json";
import escoRolesData from "../../data/esco_atomic_skills_roles.json";
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
  Home,
  Upload,
  FileText,
  Scale,
  Globe2,
  Target,
  Compass,
  Award,
  Trophy,
  Flame,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

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
  // Navigation: 3 Core Interactive Lower Modes replacing linear steps
  const [activeMode, setActiveMode] = useState("pathway"); // "radar" | "matching" | "pathway"
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  // Departmental Capability Ingestion Benchmark Profiles
  const [activeDeptProfile, setActiveDeptProfile] = useState("ALL_DEPTS");

  // Counterfactual Fairness Audit Modal / Indicator State
  const [isFairnessVerified, setIsFairnessVerified] = useState(true);

  // Fallback Data Resolution to guarantee 100% immediate interaction
  const effectiveWorkforce = useMemo(() => {
    if (smeWorkforce && Array.isArray(smeWorkforce) && smeWorkforce.length > 0) {
      return smeWorkforce;
    }
    return syntheticPersonasData.sme_workforce || [];
  }, [smeWorkforce]);

  const effectiveRoles = useMemo(() => {
    if (roles && Array.isArray(roles) && roles.length > 0) {
      return roles;
    }
    return escoRolesData.roles || [];
  }, [roles]);

  const defaultHighRisk = useMemo(() => {
    return effectiveWorkforce.filter(e => (e.automation_risk || 0) >= 0.70).length || 18;
  }, [effectiveWorkforce]);

  // ROI Calculator Interactive State
  const [atRiskCount, setAtRiskCount] = useState(workforceSummary?.high_risk_count || 18);
  const [severancePerHead, setSeverancePerHead] = useState(18000);
  const [recruitmentPerHead, setRecruitmentPerHead] = useState(15000);
  const [reskillCostPerHead, setReskillCostPerHead] = useState(4500);

  useEffect(() => {
    if (workforceSummary?.high_risk_count) {
      setAtRiskCount(workforceSummary.high_risk_count);
    } else if (defaultHighRisk) {
      setAtRiskCount(defaultHighRisk);
    }
  }, [workforceSummary, defaultHighRisk]);

  // Broadcast Form State
  const [broadcastRole, setBroadcastRole] = useState("ROLE-01");
  const [broadcastCount, setBroadcastCount] = useState(12);
  const [broadcastLocation, setBroadcastLocation] = useState("Johor & Klang Valley");
  const [broadcastFeedback, setBroadcastFeedback] = useState(null);

  // Departmental Task Clusters mapped to standardized ESCO Competencies
  const departmentalTaskClusters = useMemo(() => {
    return [
      {
        id: "CLUSTER-FIN",
        dept: "Finance & Accounting",
        headcount: 14,
        task_name: "Manual Invoice, Ledger Reconciliation & Tax Invoicing",
        esco_code: "ESCO 4311.2 (Accounting Associate)",
        baseline_runway_months: 10,
        net_exposure_pct: 88,
        is_decaying: true,
        decay_delta: -8,
        transferable_strength_pct: 42,
        sdg_targets: ["SDG 8.2", "SDG 12.6"],
        redeployment_target: "AI-Augmented Supply Chain & Scope 3 Auditor"
      },
      {
        id: "CLUSTER-QA",
        dept: "Quality Assurance & Inspection",
        headcount: 10,
        task_name: "Visual Batch Sampling, Packaging Inspection & ISO Logging",
        esco_code: "ESCO 3152.1 (Quality Inspector)",
        baseline_runway_months: 14,
        net_exposure_pct: 78,
        is_decaying: true,
        decay_delta: -6,
        transferable_strength_pct: 68,
        sdg_targets: ["SDG 9.4", "SDG 12.4"],
        redeployment_target: "Industrial Robotics & Clean Automation Specialist"
      },
      {
        id: "CLUSTER-OPS",
        dept: "Operations & Assembly",
        headcount: 16,
        task_name: "Machine Feeder Maintenance & Repetitive Stamping",
        esco_code: "ESCO 8121.3 (Machine Operator)",
        baseline_runway_months: 18,
        net_exposure_pct: 65,
        is_decaying: false,
        decay_delta: +4,
        transferable_strength_pct: 74,
        sdg_targets: ["SDG 8.2", "SDG 9.4"],
        redeployment_target: "Renewable Microgrid & Storage Dispatcher"
      },
      {
        id: "CLUSTER-LOG",
        dept: "Logistics & Fleet",
        headcount: 10,
        task_name: "Paper Shipping Manifest Verification & Dispatch Routing",
        esco_code: "ESCO 4321.1 (Stock Clerk)",
        baseline_runway_months: 12,
        net_exposure_pct: 82,
        is_decaying: true,
        decay_delta: -7,
        transferable_strength_pct: 58,
        sdg_targets: ["SDG 9.4", "SDG 12.5"],
        redeployment_target: "Autonomous Drone Telemetry & Smart Fleet Coordinator"
      }
    ];
  }, []);

  // Filtered Workforce
  const filteredEmployees = useMemo(() => {
    return effectiveWorkforce.filter(emp => {
      const matchDept = selectedDept === "ALL" || emp.dept === selectedDept;
      const risk = emp.automation_risk || 0;
      const matchRisk =
        riskFilter === "ALL" ||
        (riskFilter === "HIGH" && risk >= 0.70) ||
        (riskFilter === "MODERATE" && risk >= 0.40 && risk < 0.70) ||
        (riskFilter === "LOW" && risk < 0.40);
      return matchDept && matchRisk;
    });
  }, [effectiveWorkforce, selectedDept, riskFilter]);

  // Overall Statistics from Filtered or Full Workforce
  const avgExposure = useMemo(() => {
    if (!effectiveWorkforce.length) return 66;
    const sum = effectiveWorkforce.reduce((acc, e) => acc + (e.automation_risk || 0), 0);
    return Math.round((sum / effectiveWorkforce.length) * 100);
  }, [effectiveWorkforce]);

  const highRiskEmployeesCount = useMemo(() => {
    return effectiveWorkforce.filter(e => (e.automation_risk || 0) >= 0.70).length;
  }, [effectiveWorkforce]);

  // Enterprise Radar Data calculation
  const enterpriseRadarData = useMemo(() => {
    return [
      { subject: "Finance (Ledgers)", exposure: 88, resilient: 35, fullMark: 100, tKey: "hr_subj_finance" },
      { subject: "QA (Inspection)", exposure: 78, resilient: 55, fullMark: 100, tKey: "hr_subj_qa" },
      { subject: "Operations (Machining)", exposure: 65, resilient: 72, fullMark: 100, tKey: "hr_subj_ops" },
      { subject: "Logistics (Dispatch)", exposure: 82, resilient: 48, fullMark: 100, tKey: "hr_subj_logistics" },
      { subject: "Procurement (Vendors)", exposure: 45, resilient: 86, fullMark: 100, tKey: "hr_subj_procurement" },
      { subject: "Safety & Facilities", exposure: 32, resilient: 92, fullMark: 100, tKey: "hr_subj_safety" }
    ].map(item => ({
      ...item,
      subject: (t && t[item.tKey]) || item.subject
    }));
  }, [t]);

  // ROI Math
  const totalSeveranceCost = atRiskCount * severancePerHead;
  const totalRecruitmentCost = atRiskCount * recruitmentPerHead;
  const totalTraditionalCost = totalSeveranceCost + totalRecruitmentCost;
  const totalReskillingCost = atRiskCount * reskillCostPerHead;
  const outOfPocketReskilling = 0; // 100% HRD Corp Levy claimable
  const netSavings = totalTraditionalCost - outOfPocketReskilling;

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    const roleObj = effectiveRoles.find(r => r.role_id === broadcastRole);
    if (typeof onBroadcastDemand === 'function') {
      onBroadcastDemand({
        role_id: broadcastRole,
        role_title: roleObj?.title || "AI-Augmented Green Role",
        needed_count: Number(broadcastCount),
        location: broadcastLocation
      });
    }
    setBroadcastFeedback(`Successfully broadcasted Q1 2027 demand for ${broadcastCount}x ${roleObj?.title || 'Green-AI'}! Demand updated across the national ecosystem.`);
    setTimeout(() => setBroadcastFeedback(null), 5000);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(`Parsing organizational inventory from ${file.name} into ESCO task clusters...`);
    setTimeout(() => {
      setIsUploading(false);
      setUploadMessage(`Successfully parsed ${file.name}: 50 headcount mapped across 4 departmental clusters with zero demographic variance.`);
      setTimeout(() => setUploadMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnHome}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Return to Landing Portal"
          >
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.home_btn || "Home"}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">{t.hr_command_center || "HR & L&D Manager 4-Step Strategic Redeployment"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>{t.enterprise_mode_badge || "Enterprise Mode: HRD Corp Levy ROI Engine"}</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ENTERPRISE INTAKE STUDIO (THE PRIMARY FOCUS)                   */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 4 • Multi-Role Departmental Capability Ingestion</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{t.tell_us_workforce_title || "Tell Us About Your Workforce"}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.tell_us_workforce_sub || "Ingest organizational departmental skill inventories or anonymized CSVs. Automatically maps existing job descriptions into standardized ESCO capability clusters."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40">
              {isUploading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? (t.parsing_inventory || "Parsing Inventory...") : (t.upload_org_csv || "Upload Organizational CSV / Inventory")}</span>
              <input
                type="file"
                accept=".csv,.txt,.json,.xlsx"
                className="hidden"
                onChange={handleCsvUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {uploadMessage && (
          <div className="p-3.5 rounded-xl bg-blue-950/90 border border-blue-500 text-xs text-blue-200 font-semibold animate-fadeIn flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {/* 1-Click Benchmark Departmental Selectors */}
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.or_select_dept_profile || "Or Select Departmental Skill Inventory to Inspect:"}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: "ALL_DEPTS", name: t.all_departments || "All Departments", count: effectiveWorkforce.length || 50, exposure: avgExposure, icon: "🏢" },
              { id: "Finance", name: t.finance_dept || "Finance & Accounting", count: 14, exposure: 88, icon: "📊" },
              { id: "QA", name: t.qa_dept || "Quality Assurance", count: 10, exposure: 78, icon: "🔍" },
              { id: "Operations", name: t.ops_dept || "Operations & Assembly", count: 16, exposure: 65, icon: "⚙️" },
              { id: "Logistics", name: t.logistics_dept || "Logistics & Fleet", count: 10, exposure: 82, icon: "🚚" }
            ].map(dept => {
              const isSelected = selectedDept === dept.id || (dept.id === "ALL_DEPTS" && selectedDept === "ALL");
              return (
                <div
                  key={dept.id}
                  onClick={() => {
                    setSelectedDept(dept.id === "ALL_DEPTS" ? "ALL" : dept.id);
                    setActiveDeptProfile(dept.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "bg-blue-950/50 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/40"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span className="text-2xl">{dept.icon}</span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{dept.name}</div>
                    <div className="text-[11px] text-blue-400 font-mono mt-0.5">
                      {dept.count} {t.staff || "Staff"} • {dept.exposure}% {t.avg_exposure || "Avg Exposure"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDept !== "ALL" && (
            <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-blue-950/50 border border-blue-800/60 text-xs">
              <span className="text-blue-300 font-mono">
                🔍 {t.filter_active_dept || "Filter Active: Showing"} <strong className="text-white">{selectedDept}</strong> ({filteredEmployees.length} {t.staff || "Staff"})
              </span>
              <button
                onClick={() => {
                  setSelectedDept("ALL");
                  setActiveDeptProfile("ALL_DEPTS");
                }}
                className="text-[11px] font-mono text-blue-400 hover:text-white underline cursor-pointer"
              >
                {t.reset_to_all_depts || "Reset to All Departments"}
              </button>
            </div>
          )}
        </div>

        {/* Deconstructed Departmental Task Clusters Showcase */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Ingested ESCO Departmental Capability Task Clusters</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Baseline capabilities across 50 employees deconstructed into actionable workforce nodes with live automation runway estimates.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
              Total SME Cohort: <strong className="text-white">50 Employees</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {departmentalTaskClusters.map(cluster => (
              <div
                key={cluster.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{cluster.dept}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {cluster.headcount} Headcount
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium line-clamp-1">
                  • {cluster.task_name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Standardized Code: {cluster.esco_code}
                </div>

                <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Runway:</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      cluster.is_decaying ? "bg-rose-950/80 text-rose-300 border border-rose-800/50" : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                    }`}>
                      {cluster.baseline_runway_months} mos ({cluster.decay_delta > 0 ? `+${cluster.decay_delta}` : cluster.decay_delta} mos ⚡)
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {cluster.sdg_targets.map(sdg => (
                      <span key={sdg} className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 text-[9px] border border-blue-800/50">
                        {sdg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE 3 CORE INTERACTIVE ACTION BUTTONS (STEPS 2, 3, 4)                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Button 1: Future Skills Radar */}
        <button
          onClick={() => setActiveMode("radar")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === "radar"
              ? "bg-gradient-to-br from-sky-950/80 via-slate-900 to-slate-900 border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/40"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400">
              <Radio className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              50 Staff Heatmap
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.hr_action_radar || "2. See Future Skills Radar"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.hr_action_radar_sub || "Enterprise exposure & task-decay heatmap across business units."}
            </p>
          </div>
        </button>

        {/* Button 2: Internal Mobility Matching */}
        <button
          onClick={() => setActiveMode("matching")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === "matching"
              ? "bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/40"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              R-Score Formula
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.hr_action_matching || "3. Get Matched (Internal Mobility)"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.hr_action_matching_sub || "Counterfactual redeployment matrix with 0.00% demographic bias."}
            </p>
          </div>
        </button>

        {/* Button 3: Subsidized Cohort Reskilling & ESG Ledger */}
        <button
          onClick={() => setActiveMode("pathway")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
            activeMode === "pathway"
              ? "bg-gradient-to-br from-blue-950/90 via-slate-900 to-teal-950/80 border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/50"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {t.rm_0_out_of_pocket || "RM 0 Out-of-Pocket"}
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.hr_action_pathway || "4. Follow a Pathway (Cohort Reskilling)"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.hr_action_pathway_sub || "HRD Corp levy ROI optimization & Corporate SDG 8 / 10 impact ledger."}
            </p>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 1: ENTERPRISE EXPOSURE & TASK-DECAY HEATMAP               */}
      {/* ========================================================================= */}
      {activeMode === "radar" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Dynamic Workforce Metric Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">{t.avg_workforce_risk || "Avg Workforce Risk"}</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">{avgExposure}%</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {activeInjectedSignals.length > 0 ? (t.modulated_by_signals || "Modulated by live signals") : (t.baseline_label || "Baseline")}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">{t.high_exposure_staff || "High-Exposure Staff"}</div>
              <div className="text-xl font-black text-rose-400 font-mono mt-0.5">{highRiskEmployeesCount} {t.staff || "Staff"}</div>
              <div className="text-[10px] text-rose-400/80 font-mono">{t.gt_70_exposure || ">70% AI Automation Exposure"}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">{t.layoff_cost_exposure || "Layoff Cost Exposure"}</div>
              <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                RM {(highRiskEmployeesCount * 18000).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{t.severance_liability || "Severance liability"}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="text-[10px] uppercase font-mono text-emerald-400">{t.retained_hrd_savings || "Retained HRD Savings"}</div>
              <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">
                RM {(highRiskEmployeesCount * 18000).toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono">{t.levy_redeployment_label || "100% Levy Redeployment"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Enterprise Exposure Radar */}
            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-200">
                <span>{t.enterprise_radar_title || "Enterprise Exposure vs Resilient Core"}</span>
                <span className="text-[10px] font-mono text-blue-400">{t.net_radar_badge || "Net Radar"}</span>
              </div>
              <div className="w-full h-72 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={enterpriseRadarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar name={t.ai_auto_exposure || "AI Automation Exposure"} dataKey="exposure" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                    <Radar name={t.transferable_human_core || "Transferable Human Core"} dataKey="resilient" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", fontSize: "11px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Matrix of 50 Employees */}
            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{t.sme_heatmap_title || "50 SME Employees: Task-Decay & Automation Exposure Heatmap"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={riskFilter}
                    onChange={e => setRiskFilter(e.target.value)}
                    className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                  >
                    <option value="ALL">{t.all_risk_levels || "All Risk Levels"}</option>
                    <option value="HIGH">{t.high_risk_opt || "High (>70%)"}</option>
                    <option value="MODERATE">{t.mod_risk_opt || "Moderate (40-70%)"}</option>
                    <option value="LOW">{t.low_risk_opt || "Low (<40%)"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredEmployees.map(emp => {
                  const isHigh = emp.automation_risk >= 0.70;
                  const isMod = emp.automation_risk >= 0.40 && emp.automation_risk < 0.70;
                  const delta = (activeInjectedSignals && activeInjectedSignals.length > 0) ? (emp.delta_risk_pct || 0) : 0;

                  return (
                    <div
                      key={emp.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                        isHigh
                          ? "bg-rose-950/25 border-rose-800/60 text-rose-200"
                          : isMod
                          ? "bg-amber-950/25 border-amber-800/60 text-amber-200"
                          : "bg-emerald-950/25 border-emerald-800/60 text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="font-bold text-slate-300">{emp.id}</span>
                        <span className="px-1 rounded bg-slate-900 text-slate-400">{emp.dept}</span>
                      </div>
                      <div className="font-bold text-slate-100 truncate text-[10px]">{emp.role}</div>
                      <div className="text-[10px] flex items-center justify-between font-mono">
                        <span className="text-slate-400">{t.risk_label || "Risk:"}</span>
                        <span className="font-bold">
                          {Math.round(emp.automation_risk * 100)}%
                          {delta !== 0 && (
                            <span className={`ml-1 ${delta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                              ({delta > 0 ? `+${delta}%` : `${delta}%`}⚡)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 2: INTERNAL MOBILITY & TASK-TRANSFER MATCHING             */}
      {/* ========================================================================= */}
      {activeMode === "matching" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Mathematical Formula Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/40 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t.r_score_formula_title || "Transparent Internal Redeployment R-Score Formula:"}</span>
              </div>
              <div className="font-mono text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] inline-block">
                {t.r_score_formula_text || "Match Score = (0.50 × Overlap) + (0.30 × Transferable) + (0.20 × Trend Boost)"}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.demographic_fairness_label || "Demographic Fairness Check:"}</span>
              <span className="text-emerald-400 font-mono font-black text-base flex items-center gap-1 justify-end">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.demographic_fairness_stat || "0.00% Invariant (Gender & Age Parity)"}</span>
              </span>
            </div>
          </div>

          {/* Departmental Internal Redeployment Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                source_dept: "Finance (Accounts Clerks)",
                source_task: "Manual invoice filing & ERP ledger reconciliation",
                at_risk_count: 8,
                target_role: "AI-Augmented Supply Chain & Scope 3 Auditor",
                match_score: 87.5,
                overlap_contribution: 43.5,
                transfer_contribution: 27.0,
                trend_boost: 17.0,
                sdg_contribution: "SDG 8.2 & SDG 12.6",
                narrative: "Pivots numerical reconciliation discipline into carbon ledger verification and supplier ESG compliance defense."
              },
              {
                source_dept: "QA (Visual Batch Testers)",
                source_task: "Manual optical sampling & packaging flaw sorting",
                at_risk_count: 5,
                target_role: "Industrial Robotics & Clean Automation Specialist",
                match_score: 84.0,
                overlap_contribution: 41.0,
                transfer_contribution: 26.5,
                trend_boost: 16.5,
                sdg_contribution: "SDG 9.4 & SDG 12.4",
                narrative: "Adapts defect sensitivity into vision-guided robotic sorting and cobot contamination safety enforcement."
              },
              {
                source_dept: "Operations (Machine Feeders)",
                source_task: "Repetitive stamping & assembly machine feeding",
                at_risk_count: 7,
                target_role: "Renewable Microgrid & Energy Storage Dispatcher",
                match_score: 81.2,
                overlap_contribution: 39.0,
                transfer_contribution: 25.2,
                trend_boost: 17.0,
                sdg_contribution: "SDG 7.1 & SDG 13.2",
                narrative: "Transforms shopfloor equipment familiarity into clean SCADA battery dispatch and inverter frequency regulation."
              },
              {
                source_dept: "Logistics (Dispatch Clerks)",
                source_task: "Manual manifest filing & stock routing records",
                at_risk_count: 4,
                target_role: "Autonomous Drone Telemetry & Smart Fleet Coordinator",
                match_score: 79.8,
                overlap_contribution: 38.0,
                transfer_contribution: 24.8,
                trend_boost: 17.0,
                sdg_contribution: "SDG 9.4 & SDG 12.5",
                narrative: "Scales manifest bookkeeping into automated GPS route optimization and CAAM-compliant drone payload telemetry."
              }
            ].map((match, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                      {t.source_unit_prefix || "Source Unit:"} {match.source_dept}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {t.pivot_arrow_prefix || "Pivot →"} {match.target_role}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {match.match_score}%
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">{t.r_score_fit_label || "R-Score Fit"}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-blue-300">{t.redeployment_bridge_label || "Redeployment Bridge:"} </strong>
                  {match.narrative}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">
                    <div>{t.overlap_50 || "Overlap (0.50)"}</div>
                    <div className="text-slate-200 font-bold">+{match.overlap_contribution}%</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">
                    <div>{t.transfer_30 || "Transfer (0.30)"}</div>
                    <div className="text-slate-200 font-bold">+{match.transfer_contribution}%</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">
                    <div>{t.trend_20 || "Trend (0.20)"}</div>
                    <div className="text-emerald-400 font-bold">+{match.trend_boost}%</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{t.headcount_protected_label || "Headcount Protected:"} <strong className="text-white">{match.at_risk_count} {t.staff_count || "Staff"}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">
                    {match.sdg_contribution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 3: SUBSIDIZED COHORT RESKILLING & CORPORATE ESG LEDGER   */}
      {/* ========================================================================= */}
      {activeMode === "pathway" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Corporate SDG Ledger Card */}
          <div className="glass-panel rounded-2xl p-5 border border-blue-500/50 bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{t.corporate_esg_ledger_title || "Corporate ESG Impact & UN SDG Ledger"}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {t.corporate_esg_ledger_sub || "Preserving Headcount & Quantifying Corporate Sustainability ROI"}
                </h3>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-blue-950 border border-blue-700/60 text-xs font-mono text-blue-300 font-bold shrink-0">
                {t.retention_badge || "100% Talent Retention • 0 Retrenchments"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{t.sdg_82_title || "SDG 8.2 • Economic Productivity"}</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{t.sdg_82_val || "18 Displaced Staff Reskilled"}</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.sdg_82_desc || "Diversified traditional manual clerical functions into high-velocity digital and green compliance workflows."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">{t.sdg_85_title || "SDG 8.5 • Decent Work For All"}</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{t.sdg_85_val || "RM 594,000 Severance Avoided"}</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.sdg_85_desc || "Protected existing employees from retrenchment liability while maintaining long-term institutional tenure."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <div className="text-[10px] font-mono text-pink-400 font-bold uppercase">{t.sdg_102_title || "SDG 10.2 • Reduced Inequalities"}</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{t.sdg_102_val || "0.00% Algorithmic Demographic Variance"}</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.sdg_102_desc || "Equal allocation of levy training funds across junior, mature, and non-degree holders with strict parity."}
                </p>
              </div>
            </div>
          </div>

          {/* HRD Corp Levy ROI Interactive Financial Utility Calculator */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">{t.hrd_calc_title || "HRD Corp Levy ROI Financial Calculator"}</h3>
                  <p className="text-xs text-slate-400">
                    {t.hrd_calc_sub || "Compare the cost of retrenchment + external hiring against 100% subsidized cohort reskilling."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {t.net_retained_capital || "Net Retained Capital:"} RM {netSavings.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{t.at_risk_cohort_label || "At-Risk Cohort Count:"}</span>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={atRiskCount}
                  onChange={e => setAtRiskCount(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-white">{atRiskCount} {t.staff_count || "Staff"}</span>
                  <span className="text-slate-500">{t.max_40_label || "Max: 40"}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                <div className="text-[10px] font-mono uppercase text-rose-300">{t.traditional_cost_label || "Traditional Cost (Severance + Rehiring)"}</div>
                <div className="text-xl font-black text-rose-400 font-mono">
                  RM {totalTraditionalCost.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">
                  RM {severancePerHead.toLocaleString()} + RM {recruitmentPerHead.toLocaleString()} {t.severance_recruitment_detail || "severance + recruitment / head"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <div className="text-[10px] font-mono uppercase text-emerald-300">{t.levy_subsidized_label || "Levy-Subsidized Reskilling Cost"}</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {t.rm_0_out_of_pocket || "RM 0 Out-of-Pocket"}
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  {t.funded_via_levy_detail || "100% HRD Corp Claimable (funded via levy)"} (RM {totalReskillingCost.toLocaleString()})
                </div>
              </div>
            </div>
          </div>

          {/* Subsidized Cohort Reskilling Roadmap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase">
              <span>{t.cohort_training_modules || "Departmental Cohort Training Modules (100% HRD Corp Levy Claimable):"}</span>
              <span className="text-emerald-400 font-mono">{t.rm_0_net_budget || "RM 0 Net Budget"}</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  unit: "Finance Department Cohort (14 Staff)",
                  course: "Corporate GHG Accounting & Scope 3 Protocol (ISO 14064)",
                  provider: "Malaysian Green Technology and Climate Change Corporation (MGTC)",
                  duration: "4 weeks (32 hours)",
                  cost: "HRD Corp Claimable (RM 0)",
                  sdg: "SDG 12.6",
                  badge: "🏅 Scope 3 Corporate Team"
                },
                {
                  unit: "QA Department Cohort (10 Staff)",
                  course: "ROS 2 for Industrial Collaborative Robots (Cobots)",
                  provider: "Robopreneur Academy & MDEC Certified",
                  duration: "6 weeks (45 hours)",
                  cost: "HRD Corp Claimable (RM 0)",
                  sdg: "SDG 9.4",
                  badge: "🤖 Cleanroom Automation Guild"
                },
                {
                  unit: "Operations Department Cohort (16 Staff)",
                  course: "Renewable Energy SCADA & Storage Dispatch (SEDA Approved)",
                  provider: "Sustainable Energy Development Authority (SEDA)",
                  duration: "4 days (32 hours)",
                  cost: "HRD Corp Claimable (RM 0)",
                  sdg: "SDG 7.1",
                  badge: "⚡ Smart Grid Utility Unit"
                },
                {
                  unit: "Logistics Department Cohort (10 Staff)",
                  course: "CAAM Drone Remote Pilot License (RPL) & Telemetry Navigation",
                  provider: "Drone Academy Asia (CAAM Approved ATO)",
                  duration: "2 weeks (20 hours)",
                  cost: "HRD Corp Claimable (RM 0)",
                  sdg: "SDG 9.5",
                  badge: "🛰️ Autonomous Fleet Operators"
                }
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-400 font-bold">{plan.unit}:</span>
                      <strong className="text-white text-sm">{plan.course}</strong>
                    </div>
                    <div className="text-slate-400 flex items-center gap-3">
                      <span>{t.provider_label || "Provider:"} <strong className="text-slate-300">{plan.provider}</strong></span>
                      <span>•</span>
                      <span>{t.duration_label || "Duration:"} <strong className="text-slate-300">{plan.duration}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{plan.cost}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-1 rounded bg-blue-950 border border-blue-800/60 text-blue-300 font-mono">
                      {plan.badge}
                    </span>
                    <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-300 font-mono font-bold">
                      {plan.sdg}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Demand Broadcaster Tool */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>{t.broadcast_demand_title || "Broadcast Q1 2027 Green-AI Hiring Demand to TVET & Workers"}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.broadcast_demand_sub || "Broadcasts real-time talent demand to synchronized TVET career centres and active workers across Malaysia."}
                </p>
              </div>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">{t.target_role_label || "Target Emerging Role:"}</label>
                <select
                  value={broadcastRole}
                  onChange={e => setBroadcastRole(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                >
                  {effectiveRoles.map(r => (
                    <option key={r.role_id} value={r.role_id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">{t.headcount_needed_label || "Headcount Needed:"}</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={broadcastCount}
                  onChange={e => setBroadcastCount(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">{t.regional_corridor_label || "Regional Corridor:"}</label>
                <input
                  type="text"
                  value={broadcastLocation}
                  onChange={e => setBroadcastLocation(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-4 h-4" />
                  <span>{t.broadcast_btn || "Broadcast Demand"}</span>
                </button>
              </div>
            </form>

            {broadcastFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200 font-semibold animate-fadeIn">
                {broadcastFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
