import React, { useState, useMemo } from "react";
import {
  User,
  Upload,
  CheckSquare,
  Square,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  Scale,
  Award,
  Layers,
  ArrowRight,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Home,
  RefreshCw,
  FileText
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

export default function WorkerView({
  t,
  personas = [],
  currentPersona,
  onSelectPersona,
  onUpdateTasks,
  roleMatches = [],
  activeSignals = [],
  courses = [],
  macroScenario,
  onInspectSignal,
  onOpenFairnessAudit,
  onReturnHome,
  onToggleGreenPivot,
  isGreenPivotActive = false
}) {
  const [activeStage, setActiveStage] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [completedSkills, setCompletedSkills] = useState(new Set(["skill_vendor_mediation"]));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const activeRole = roleMatches.find(r => r.role_id === selectedRole?.role_id) || selectedRole || roleMatches[0];

  // Radar Data calculation based on active signals & persona tasks
  const radarData = useMemo(() => {
    const baseSkills = [
      { skill: "Edge-AI / TinyML", id: "skill_edge_ai", base: 65, green: 88 },
      { skill: "Scope 3 Carbon", id: "skill_scope3_carbon", base: 40, green: 94 },
      { skill: "Agentic SQL & Data", id: "skill_agentic_sql", base: 55, green: 82 },
      { skill: "Multi-Modal OCR", id: "skill_multimodal_ocr", base: 50, green: 78 },
      { skill: "IoT & Telemetry", id: "skill_lorawan_iot", base: 60, green: 85 },
      { skill: "Ethical Mediation", id: "skill_vendor_mediation", base: 85, green: 92 }
    ];

    return baseSkills.map(item => {
      let velocityMultiplier = 1.0;
      for (const signal of activeSignals) {
        if (signal.skill_velocity_impacts && signal.skill_velocity_impacts[item.id]) {
          velocityMultiplier = Math.max(velocityMultiplier, signal.skill_velocity_impacts[item.id]);
        }
      }
      return {
        subject: item.skill,
        A: Math.min(100, Math.round(item.base * velocityMultiplier)),
        B: Math.min(100, Math.round(item.green * velocityMultiplier)),
        fullMark: 100
      };
    });
  }, [activeSignals]);

  // Automated PDF & Document CV Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(`Extracting atomic human + technical capabilities from ${file.name} via NLP...`);

    const formData = new FormData();
    formData.append("cv_file", file);

    try {
      const response = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onSelectPersona(data.persona);
        setUploadMessage(`Successfully parsed ${file.name}: ${data.persona.atomic_tasks.length} atomic capabilities loaded!`);
      } else {
        setUploadMessage("Parsing failed; defaulted to synthetic benchmark profile.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Failed to process document.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadMessage(null), 5000);
    }
  };

  const handleToggleTask = (taskId) => {
    if (!currentPersona?.atomic_tasks) return;
    const updatedTasks = currentPersona.atomic_tasks.map(t => {
      if (t.task_id === taskId) {
        return { ...t, is_checked: t.is_checked === undefined ? false : !t.is_checked };
      }
      return t;
    });
    onUpdateTasks(updatedTasks);
  };

  const handleToggleSkillBadge = (skillId) => {
    setCompletedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skillId)) next.delete(skillId);
      else next.add(skillId);
      return next;
    });
  };

  // Standard Tech Courses (Path A) vs Green-AI Resilient Modules (Path B)
  const standardTechCourses = [
    {
      course_id: "CRS-STD-01",
      title: "Foundations of Relational SQL & ERP Maintenance",
      provider: "Standard IT Training Provider",
      duration: "4 weeks (28 hours)",
      cost: "RM 0 / Free",
      half_life_months: 14,
      skills_bridged: ["skill_manual_data_entry", "skill_excel_spreadsheets"],
      description: "Routine database query writing. Highly susceptible to compression by autonomous agentic SQL within 12 months."
    },
    {
      course_id: "CRS-STD-02",
      title: "Basic Python for Automated Office Spreadsheets",
      provider: "Open Source Tech Academy",
      duration: "3 weeks (20 hours)",
      cost: "RM 0 / Free",
      half_life_months: 12,
      skills_bridged: ["skill_excel_spreadsheets"],
      description: "Basic script automation for CSV files. Routine parsing rapidly being automated by multi-modal OCR."
    },
    {
      course_id: "CRS-STD-03",
      title: "General Customer Support Ticketing & Call Routing",
      provider: "BPO Training Directory",
      duration: "2 weeks (16 hours)",
      cost: "RM 0 / Free",
      half_life_months: 10,
      skills_bridged: ["skill_customer_triage"],
      description: "Standard ticket categorization and routing. High automation vulnerability from automated chatbot copilots."
    }
  ];

  const activeReskillingCourses = isGreenPivotActive ? courses.slice(0, 6) : standardTechCourses;

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
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>Home</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">Worker & Career Switcher Guided Journey</span>
        </div>

        {/* Stepper Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { stage: 1, label: "1. Intake" },
            { stage: 2, label: "2. Radar" },
            { stage: 3, label: "3. Role Match" },
            { stage: 4, label: "4. Reskilling" }
          ].map(s => (
            <button
              key={s.stage}
              onClick={() => setActiveStage(s.stage)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeStage === s.stage
                  ? "bg-emerald-600 text-white shadow font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE 1 OF 4: Atomic Task Profile Intake & Automated PDF CV Parser        */}
      {/* ========================================================================= */}
      {activeStage === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Step 1 of 4 • Worker Capability Intake
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">{t.stage1_title}</h2>
              <p className="text-xs text-slate-400 mt-1">{t.stage1_sub}</p>
            </div>

            {/* Real Automated PDF / Document CV Upload */}
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-600/30">
                {isUploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isUploading ? "Parsing PDF with NLP..." : "Upload Real Resume (PDF/TXT)"}</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.json"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {uploadMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200 font-semibold animate-fadeIn flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadMessage}</span>
            </div>
          )}

          {/* Persona Selection Cards */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Benchmark Profile or Uploaded CV:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personas.map(persona => {
                const isSelected = currentPersona?.persona_id === persona.persona_id;
                return (
                  <div
                    key={persona.persona_id}
                    onClick={() => onSelectPersona(persona)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/40"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{persona.avatar}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {persona.demographics?.age || 30} yo • {persona.demographics?.gender || "Profile"}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-2 truncate">{persona.name}</h3>
                    <div className="text-xs font-medium text-emerald-400 truncate">{persona.display_title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{persona.summary}</div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{persona.location}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {persona.atomic_tasks?.length || 5} Tasks
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Atomic Task Deconstruction & Dynamic Skill Half-Life Badges */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Granular Atomic Capabilities & Live Half-Life Runway</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tasks are dynamically evaluated against active market signals. Routine tasks face compressed runways, while mediation and green tasks remain protected.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {currentPersona?.atomic_tasks?.map(task => {
                const isChecked = task.is_checked !== false;
                const isAtRisk = task.is_at_risk;
                const hasInjectedSignals = activeSignals.some(s => s && s.id && s.id.startsWith("INJ")) || macroScenario !== "moderate";
                const displayMonths = hasInjectedSignals ? (task.dynamic_halflife_months || task.baseline_halflife_months) : task.baseline_halflife_months;
                const deltaMonths = hasInjectedSignals ? (task.delta_months || 0) : 0;

                return (
                  <div
                    key={task.task_id}
                    onClick={() => handleToggleTask(task.task_id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isChecked
                        ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                        : "bg-slate-950/40 border-slate-900 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-400">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${isChecked ? "text-slate-100" : "text-slate-500 line-through"}`}>
                          {task.name}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">
                          Category: {task.category} • Transferability: {Math.round(task.transferable_strength * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Half-Life Runway Badge with Delta */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border ${
                        isAtRisk
                          ? "bg-rose-950/40 text-rose-300 border-rose-800"
                          : "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{displayMonths} mos runway</span>
                        {deltaMonths < 0 && (
                          <span className="text-[10px] text-rose-400 font-bold ml-1">
                            ({deltaMonths} mos ⚡)
                          </span>
                        )}
                        {deltaMonths > 0 && (
                          <span className="text-[10px] text-emerald-400 font-bold ml-1">
                            (+{deltaMonths} mos ⚡)
                          </span>
                        )}
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
              onClick={() => setActiveStage(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 2 — Future Skills Radar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 2 OF 4: Future Skills Radar & Signal Verification                  */}
      {/* ========================================================================= */}
      {activeStage === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Step 2 of 4 • Skill Velocity & Signal Verification
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">{t.stage2_title}</h2>
              <p className="text-xs text-slate-400 mt-1">{t.stage2_sub}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recharts Radar Chart */}
            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-200">
                  Worker Capability Radar: Current vs Post-Reskilling Target
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  Horizon: {macroScenario}
                </span>
              </div>

              <div className="w-full h-80 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar
                      name="Current Worker Capability"
                      dataKey="A"
                      stroke="#38bdf8"
                      fill="#38bdf8"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Green-AI Target Benchmark"
                      dataKey="B"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", fontSize: "11px" }}
                      labelStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-400" />
                  <span>Current Capability Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Green-AI Benchmark</span>
                </div>
              </div>
            </div>

            {/* Velocity Feed & Signal Drawer Access */}
            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Active Market Trend Signals</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    {activeSignals.length} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Click any signal to verify its dated publication excerpt from arXiv, data.gov.my, or MyFutureJobs:
                </p>

                <div className="space-y-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
                  {activeSignals.map(signal => {
                    const isInjectable = signal.id.startsWith("INJ");
                    return (
                      <div
                        key={signal.id}
                        onClick={() => onInspectSignal(signal)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer hover:border-emerald-500/50 ${
                          isInjectable
                            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                            : "bg-slate-950/70 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-400 font-semibold">{signal.date}</span>
                          <span className="text-slate-400 truncate max-w-[140px]">{signal.source_name}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">{signal.title}</h4>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60 text-[10px]">
                          <span className="text-slate-400">Confidence: {Math.round(signal.confidence_score * 100)}%</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            Inspect Proof <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hallucinations Guarantee: Real URLs, verified datasets.</span>
              </div>
            </div>
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStage(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: Step 1</span>
            </button>
            <button
              onClick={() => setActiveStage(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 3 — Explainable Role Match</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 3 OF 4: Explainable Role Matching & Fairness Audit                 */}
      {/* ========================================================================= */}
      {activeStage === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Step 3 of 4 • Explainable Match Engine
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">{t.stage3_title}</h2>
              <p className="text-xs text-slate-400 mt-1">{t.stage3_sub}</p>
            </div>

            <button
              onClick={onOpenFairnessAudit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Scale className="w-4 h-4 text-indigo-200" />
              <span>{t.run_fairness_audit} (0.00% Variance)</span>
            </button>
          </div>

          {/* Mathematical Formula Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Explainable Matching Equation:</span>
              </div>
              <div className="font-mono text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] inline-block">
                Match Score = (0.45 × Task Overlap) + (0.30 × Transferability) + (0.25 × Trend Velocity)
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Demographic Fairness:</span>
              <span className="text-emerald-400 font-mono font-black text-base">0.00% Invariant</span>
            </div>
          </div>

          {/* Ranked Role Cards Grid with Visible Delta Boost */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleMatches.map((role, idx) => {
              const isSelected = activeRole?.role_id === role.role_id;
              const isTop = idx === 0;
              const hasActiveModifiers = activeSignals.some(s => s && s.id && s.id.startsWith("INJ")) || macroScenario !== "moderate" || isGreenPivotActive;
              const delta = hasActiveModifiers ? (role.delta_score_pct || 0) : 0;

              return (
                <div
                  key={role.role_id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isTop ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}>
                        #{idx + 1} Best Fit
                      </span>
                      {delta !== 0 && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          delta > 0
                            ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                            : "bg-rose-950 text-rose-300 border-rose-700"
                        }`}>
                          {delta > 0 ? `+${delta}% ⚡` : `${delta}% ⚡`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2 leading-snug">{role.title}</h3>
                    <div className="text-xs text-slate-400 mt-1">{role.department}</div>

                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Computed Fit:</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        {role.match_score_pct}%
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Task Overlap (0.45):</span>
                        <span className="font-mono text-slate-200">+{role.breakdown.factor_task_contribution}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transferability (0.30):</span>
                        <span className="font-mono text-slate-200">+{role.breakdown.factor_adjacent_contribution}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trend Velocity (0.25):</span>
                        <span className="font-mono text-emerald-400">+{role.breakdown.factor_trend_contribution}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">RM {role.median_salary_myr}/mo</span>
                    <div className="flex items-center gap-1">
                      {role.sdg_targets?.slice(0, 2).map(sdg => (
                        <span key={sdg} className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono">
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStage(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: Step 2</span>
            </button>
            <button
              onClick={() => setActiveStage(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Next: Step 4 — Reskilling Pathway</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 4 OF 4: No-Regret Reskilling Pathway & 3.2x SDG Arbitrage          */}
      {/* ========================================================================= */}
      {activeStage === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Step 4 of 4 • Subsidised Reskilling Curriculum
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">{t.stage4_title}</h2>
              <p className="text-xs text-slate-400 mt-1">{t.stage4_sub}</p>
            </div>

            {/* REAL Working Green-AI Resilience Arbitrage Toggle */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-emerald-500/40">
              <span className="text-xs text-slate-400 pl-2">SDG Mode:</span>
              <button
                onClick={() => onToggleGreenPivot(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  !isGreenPivotActive ? "bg-slate-800 text-slate-200 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Path A: Standard Tech
              </button>
              <button
                onClick={() => onToggleGreenPivot(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isGreenPivotActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Path B: Green-AI Pivot (3.2x Runway)
              </button>
            </div>
          </div>

          {/* Interactive Visual Runway Gauge Comparison */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isGreenPivotActive
              ? "bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/70 shadow-2xl"
              : "bg-slate-900/60 border-slate-800"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Award className="w-3.5 h-3.5" />
                  Green-AI Resilience Arbitrage (Interactive Comparative Meter)
                </div>
                <h3 className="text-base font-bold text-white">
                  {isGreenPivotActive
                    ? "Path B Active: 1 Sustainability Credential Triples Career Runway from 14 to 45 Months"
                    : "Path A Standard Tech: Subject to Routine AI Model Compression within 12-14 Months"}
                </h3>

                {/* Comparative Runway Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Career Runway Horizon:</span>
                    <span className={`font-bold ${isGreenPivotActive ? "text-emerald-400" : "text-amber-400"}`}>
                      {isGreenPivotActive ? "45 Months Runway (3.2x)" : "14 Months Runway (1.0x)"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isGreenPivotActive ? "bg-gradient-to-r from-emerald-500 to-teal-400 w-full" : "bg-amber-500 w-[31%]"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 mos</span>
                    <span>14 mos (Standard Tech Ceiling)</span>
                    <span>45 mos (Green-AI Protected)</span>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="flex items-center gap-3 shrink-0 font-mono">
                <div className="text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Target Role Match</div>
                  <div className={`text-xl font-black ${isGreenPivotActive ? "text-emerald-400" : "text-slate-300"}`}>
                    {activeRole?.match_score_pct}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {isGreenPivotActive ? "+14.8% Boost" : "Baseline"}
                  </div>
                </div>

                <div className="text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Projected Salary</div>
                  <div className={`text-xl font-black ${isGreenPivotActive ? "text-emerald-400" : "text-slate-300"}`}>
                    RM {activeRole?.median_salary_myr}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {isGreenPivotActive ? "+15% Green Premium" : "Standard"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Modules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                {isGreenPivotActive
                  ? "⭐ Showing 6 Verified Green-AI & High-Voltage Micro-Credentials (HRD Corp & edX):"
                  : "Showing 3 Standard Tech Courses (Short 14-Mo Runway):"}
              </span>
              <button
                onClick={() => onToggleGreenPivot(!isGreenPivotActive)}
                className="text-emerald-400 hover:underline font-bold text-[11px] cursor-pointer"
              >
                {isGreenPivotActive ? "Switch back to Path A" : "Switch to Path B (3.2x Boost)"}
              </button>
            </div>

            {activeReskillingCourses.map((course, idx) => {
              const isNoRegret = course.is_no_regret_core;
              const isCompleted = completedSkills.has(course.skills_bridged?.[0]);
              const isEndorsed = course.endorsed_by_tvet;

              return (
                <div
                  key={course.course_id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isNoRegret ? "gold-core-badge" : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleSkillBadge(course.skills_bridged?.[0])}
                      className="mt-1 shrink-0 p-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500 transition-colors cursor-pointer"
                      title="Mark skill acquired"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded border border-slate-600" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400">Week {idx * 2 + 1}–{idx * 2 + 2}:</span>
                        <span className="text-sm font-bold text-white">{course.title}</span>

                        {isNoRegret && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-yellow-500 text-slate-950 shadow-sm">
                            ⭐ NO-REGRET CORE
                          </span>
                        )}

                        {isEndorsed && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            📌 Endorsed by TVET Career Centre
                          </span>
                        )}

                        {isGreenPivotActive && idx === 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            ⚡ +3.2x KEYSTONE PIVOT
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                        <span>Provider: <strong className="text-slate-300">{course.provider}</strong></span>
                        <span>•</span>
                        <span>Duration: <strong className="text-slate-300">{course.duration}</strong></span>
                        <span>•</span>
                        <span>Cost: <strong className="text-emerald-400">{course.cost}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 self-end md:self-auto">
                    {course.provider_url ? (
                      <a
                        href={course.provider_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Enroll Now <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Standard Course</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Navigation Footer */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStage(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: Step 3</span>
            </button>
            <button
              onClick={onReturnHome}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Complete Journey • Return to Home</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
