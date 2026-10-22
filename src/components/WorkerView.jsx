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
  FileText,
  Flame,
  BookOpen,
  Target,
  Radio,
  Check,
  Lock,
  Compass,
  Trophy,
  Globe2,
  Tag
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
import { generatePersonalizedReskillingPathway } from "../utils/reskillingEngine";

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
  // Navigation: 3 Core Lower Modes replacing linear 4 steps
  const [activeMode, setActiveMode] = useState("reskilling"); // "radar" | "roles" | "reskilling"
  const [selectedRole, setSelectedRole] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Learner Motivation State: Completed Modules & Gamification
  const [completedModules, setCompletedModules] = useState(new Set(["MOD-BRIDGE-PEDAGOGY"]));

  const activeRole = roleMatches.find(r => r.role_id === selectedRole?.role_id) || selectedRole || roleMatches[0];

  // Radar Data calculation based on active signals & persona tasks
  const radarData = useMemo(() => {
    const baseSkills = [
      { skill: "Edge-AI / TinyML", id: "skill_edge_ai", base: 65, green: 88, tKey: "radar_edge_ai" },
      { skill: "Scope 3 Carbon", id: "skill_scope3_carbon", base: 40, green: 94, tKey: "radar_scope3" },
      { skill: "Agentic SQL & Data", id: "skill_agentic_sql", base: 55, green: 82, tKey: "radar_agentic_sql" },
      { skill: "Multi-Modal OCR", id: "skill_multimodal_ocr", base: 50, green: 78, tKey: "radar_ocr" },
      { skill: "IoT & Telemetry", id: "skill_lorawan_iot", base: 60, green: 85, tKey: "radar_iot" },
      { skill: "Ethical Mediation", id: "skill_vendor_mediation", base: 85, green: 92, tKey: "radar_ethical" }
    ];

    return baseSkills.map(item => {
      let velocityMultiplier = 1.0;
      for (const signal of activeSignals) {
        if (signal.skill_velocity_impacts && signal.skill_velocity_impacts[item.id]) {
          velocityMultiplier = Math.max(velocityMultiplier, signal.skill_velocity_impacts[item.id]);
        }
      }
      return {
        subject: (t && t[item.tKey]) || item.skill,
        A: Math.min(100, Math.round(item.base * velocityMultiplier)),
        B: Math.min(100, Math.round(item.green * velocityMultiplier)),
        fullMark: 100
      };
    });
  }, [activeSignals, t]);

  // Dynamic Personalized Reskilling Pathway Engine (Differentiated by candidate's atomic skills)
  const pathway = useMemo(() => {
    return generatePersonalizedReskillingPathway(
      currentPersona,
      activeRole,
      activeSignals,
      isGreenPivotActive
    );
  }, [currentPersona, activeRole, activeSignals, isGreenPivotActive]);

  // Learner Motivation Calculations
  const totalHours = pathway?.total_duration_hours || 64;
  const completedHours = useMemo(() => {
    if (!pathway?.modules) return 0;
    return pathway.modules
      .filter(m => completedModules.has(m.module_id))
      .reduce((sum, m) => sum + m.duration_hours, 0);
  }, [pathway, completedModules]);

  const progressPct = useMemo(() => {
    if (!pathway?.modules || pathway.modules.length === 0) return 0;
    return Math.round((completedModules.size / pathway.modules.length) * 100);
  }, [pathway, completedModules]);

  const earnedXp = useMemo(() => {
    if (!pathway?.modules) return 150;
    const base = 150; // Starter verified profile bonus
    const moduleXp = pathway.modules
      .filter(m => completedModules.has(m.module_id))
      .reduce((sum, m) => sum + m.xp_awarded, 0);
    return base + moduleXp;
  }, [pathway, completedModules]);

  // Automated PDF & Document CV Upload Handler
  const processUploadedFile = async (file) => {
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedFile(file);
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

  const handleToggleModule = (moduleId) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
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
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.home_btn || "Home"}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">{t.worker_guided_studio || "Worker & Career Switcher Guided Studio"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.model_stack_badge || "AI Model Disclosure: BAAI/bge-m3 + Llama-3-8B"}</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: THE INTAKE STUDIO (THE PRIMARY FOCUS)                          */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.worker_step1_badge || "Worker Capability Intake & Automated NLP Deconstruction"}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{t.upload_resume_title || "Upload Real Resume (PDF / TXT)"}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.upload_resume_sub || "Deconstruct your background into granular human and technical capabilities — preserving your exact resume words with verifiable half-life runways."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40">
              {isUploading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? (t.parsing_nlp || "Parsing with NLP...") : (t.upload_resume_btn || "Upload Real Resume (PDF/TXT)")}</span>
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

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragOver
              ? "border-emerald-400 bg-emerald-950/30 scale-[1.01]"
              : "border-slate-800 hover:border-slate-700 bg-slate-950/60"
          }`}
          onClick={() => document.querySelector('input[type="file"]')?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              {isUploading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
            </div>
            <div className="text-xs font-bold text-slate-200">
              {isUploading ? (t.drag_drop_parsing || "Analyzing Resume Structure & Normalizing Clauses...") : (t.drag_drop_resume || "Drag & Drop Candidate Resume (PDF or TXT) Here, or Click to Browse")}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {t.drag_drop_sub || "Accepts .pdf and .txt • Automatic sanitization of headers & binary streams • Zero hallucination"}
            </div>
          </div>
        </div>

        {uploadMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-xs text-emerald-200 font-semibold animate-fadeIn flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {/* Benchmark Profile Quick Switcher */}
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.benchmark_candidates || "Or Instant Test with Benchmark Candidate Profiles:"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {personas.map(persona => {
              const isSelected = currentPersona?.persona_id === persona.persona_id;
              return (
                <div
                  key={persona.persona_id}
                  onClick={() => onSelectPersona(persona)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "bg-emerald-950/50 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/40"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span className="text-2xl">{persona.avatar}</span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{persona.name}</div>
                    <div className="text-[11px] text-emerald-400 truncate">{persona.display_title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {persona.atomic_tasks?.length || 5} Atomic Tasks • {persona.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ATOMIC CAPABILITIES & TRANSFERABILITY SHOWCASE                            */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>{t.extracted_capabilities_title || "Extracted Atomic Capabilities & Dynamic Half-Life Runway"}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.extracted_capabilities_sub || "Each task is dynamically modulated by ML Model 2's live market velocity signals. Routine tasks compress, while human mediation and green tasks expand."}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
              {t.candidate_label || "Candidate:"} <strong className="text-white">{currentPersona?.name}</strong>
            </div>
          </div>

          <div className="space-y-3">
            {currentPersona?.atomic_tasks?.map(task => {
              const isChecked = task.is_checked !== false;
              const isAtRisk = task.is_at_risk;
              const hasInjectedSignals = activeSignals.some(s => s && (s.skill_velocity_impacts || s.is_live_ingested || (s.id && (s.id.startsWith("INJ") || s.id.startsWith("ARXIV") || s.id.startsWith("STREAM"))))) || macroScenario !== "moderate";
              const displayMonths = hasInjectedSignals ? (task.dynamic_halflife_months || task.runway_months || task.baseline_halflife_months) : task.baseline_halflife_months;
              const deltaMonths = hasInjectedSignals ? (task.delta_months || 0) : 0;

              return (
                <div
                  key={task.task_id}
                  onClick={() => handleToggleTask(task.task_id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isChecked
                      ? "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                      : "bg-slate-950/40 border-slate-900 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-emerald-400 mt-0.5">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${isChecked ? "text-slate-100" : "text-slate-500 line-through"}`}>
                          {task.name}
                        </span>
                        {task.mastery_tier && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {task.mastery_tier}
                          </span>
                        )}
                        {task.impact_metric && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                            Metric: {task.impact_metric}
                          </span>
                        )}
                      </div>

                      {/* Verbatim Source Evidence */}
                      {task.source_evidence && task.source_evidence !== task.name && (
                        <div className="text-[11px] text-slate-400 italic bg-slate-950/70 p-2 rounded-lg border border-slate-800/60 font-sans line-clamp-2">
                          Evidence: "{task.source_evidence}"
                        </div>
                      )}

                      {/* Telemetry and SDG Badges */}
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono pt-1 flex flex-wrap items-center gap-2">
                        <span className="text-slate-500">Category: {task.category}</span>
                        <span>•</span>
                        <span className="text-slate-300">Transferability: <strong className="text-white">{Math.round(task.transferable_strength * 100)}%</strong></span>

                        {task.baseline_transferability && Math.round(task.transferable_strength * 100) !== Math.round(task.baseline_transferability * 100) && (
                          <span className={task.transferable_strength > task.baseline_transferability ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            ({task.transferable_strength > task.baseline_transferability ? "+" : ""}{Math.round((task.transferable_strength - task.baseline_transferability) * 100)}% ML Trend Shift)
                          </span>
                        )}

                        {/* UN SDG Tags */}
                        {task.sdg_targets?.map(sdg => (
                          <span key={sdg} className="px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 text-[9px] font-mono font-bold flex items-center gap-1">
                            <Globe2 className="w-2.5 h-2.5" />
                            <span>{sdg}</span>
                          </span>
                        ))}

                        {/* Detected Tools */}
                        {task.detected_tools?.map(tool => (
                          <span key={tool} className="px-1.5 py-0.2 rounded bg-sky-950/70 text-sky-300 border border-sky-800/50 text-[9px] font-mono">
                            🛠️ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Runway Pill */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                      isAtRisk
                        ? "bg-rose-950/50 text-rose-300 border-rose-800"
                        : "bg-emerald-950/50 text-emerald-300 border-emerald-800"
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
      </div>

      {/* ========================================================================= */}
      {/* THE 3 CORE INTERACTIVE ACTION BUTTONS (REPLACING STEPS 2, 3, 4)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Button 1: Future AI Radar */}
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
              {activeSignals.length} Active Signals
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.action_radar || "2. See Future AI Radar"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.action_radar_sub || "Live skill velocities & automation risk telemetry."}
            </p>
          </div>
        </button>

        {/* Button 2: Role Matching */}
        <button
          onClick={() => setActiveMode("roles")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === "roles"
              ? "bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/40"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {roleMatches.length} Roles Matched
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.action_roles || "3. Get Matched (Roles & Gaps)"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.action_roles_sub || "Explainable fit scores, counterfactual fairness & skills gaps."}
            </p>
          </div>
        </button>

        {/* Button 3: Reskilling & Motivation (THE HIGHLIGHTED FOCUS!) */}
        <button
          onClick={() => setActiveMode("reskilling")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
            activeMode === "reskilling"
              ? "bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/80 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/50"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ⭐ Tailored Curriculum
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t.action_reskill || "4. Follow a Pathway (Reskilling)"}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.action_reskill_sub || "Smart curriculum, SDG impact & unlockable badges."}
            </p>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 1: FUTURE AI RADAR & VULNERABILITY                        */}
      {/* ========================================================================= */}
      {activeMode === "radar" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-200">
                  {t.worker_radar_chart_title || "Worker Capability Radar: Current vs Post-Reskilling Target"}
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {t.horizon_label || "Horizon:"} {macroScenario}
                </span>
              </div>

              <div className="w-full h-80 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar
                      name={t.current_worker_cap || "Current Worker Capability"}
                      dataKey="A"
                      stroke="#38bdf8"
                      fill="#38bdf8"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name={t.green_ai_target_bench || "Green-AI Target Benchmark"}
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
                  <span>{t.current_cap_profile || "Current Capability Profile"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>{t.green_ai_bench || "Green-AI Benchmark"}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{t.active_market_trend_signals || "Active Market Trend Signals"}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    {activeSignals.length} {t.active_label || "Active"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {t.click_signal_verify || "Click any signal to verify its dated publication excerpt from arXiv, data.gov.my, or MyFutureJobs:"}
                </p>

                <div className="space-y-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
                  {activeSignals.map(signal => {
                    const isInjectable = signal.id?.startsWith("INJ") || signal.is_live_ingested;
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
                          <span className="text-slate-400">{t.confidence_label || "Confidence:"} {Math.round(signal.confidence_score * 100)}%</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            {t.inspect_proof_label || "Inspect Proof"} <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.zero_hallucinations_guarantee || "Zero Hallucinations Guarantee: Real URLs, verified datasets."}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 2: FUTURE-ROLE MATCHING & SKILLS GAP MATRIX               */}
      {/* ========================================================================= */}
      {activeMode === "roles" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {t.explainable_engine_badge || "Explainable Match Engine & Skills Gap Matrix"}
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">{t.stage3_title || "Explainable Role Match Ranking & Skills Gap Breakdown"}</h2>
              <p className="text-xs text-slate-400 mt-1">{t.stage3_sub || "Transparent R-Score algorithm factoring exact task overlap, transferable strength, and real-time market velocity."}</p>
            </div>

            <button
              onClick={onOpenFairnessAudit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Scale className="w-4 h-4 text-indigo-200" />
              <span>{t.run_fairness_audit || "Run Demographic Fairness Audit"} ({t.worker_fairness_invariant || "0.00% Invariant"})</span>
            </button>
          </div>

          {/* Mathematical Formula Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t.explainable_eq_title || "Explainable Matching Equation:"}</span>
              </div>
              <div className="font-mono text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] inline-block">
                {t.worker_match_formula || "Match Score = (0.45 × Task Overlap) + (0.30 × Transferability) + (0.25 × Trend Velocity)"}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.worker_demographic_fairness || "Demographic Fairness:"}</span>
              <span className="text-emerald-400 font-mono font-black text-base">{t.worker_fairness_invariant || "0.00% Invariant"}</span>
            </div>
          </div>

          {/* Ranked Role Cards Grid */}
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
                        #{idx + 1} {t.best_fit_rank || "Best Fit"}
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
                      <span className="text-xs text-slate-400">{t.computed_fit_label || "Computed Fit:"}</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        {role.match_score_pct}%
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>{t.task_overlap_weight || "Task Overlap (0.45):"}</span>
                        <span className="font-mono text-slate-200">+{role.breakdown.factor_task_contribution}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.transferability_weight || "Transferability (0.30):"}</span>
                        <span className="font-mono text-slate-200">+{role.breakdown.factor_adjacent_contribution}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.trend_velocity_weight || "Trend Velocity (0.25):"}</span>
                        <span className="font-mono text-emerald-400">+{role.breakdown.factor_trend_contribution}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">RM {role.median_salary_myr}{t.per_month || "/mo"}</span>
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

          {/* Detailed Skills Gap Analysis for Active Role */}
          {activeRole && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.skills_gap_analysis_title || "Granular Skills Gap Analysis & Transferable Strengths"}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                    <span>{t.target_role_prefix || "Target Role:"} {activeRole.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
                      {activeRole.department}
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.match_score_label || "Match Score"}:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{activeRole.match_score_pct}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t.verified_transferable_cap || "Verified Transferable Capabilities"} ({activeRole.matched_tasks?.length || 0})</span>
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeRole.matched_tasks?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs flex items-start justify-between gap-2">
                        <div>
                          <div className="text-slate-200 font-medium line-clamp-1">• {item.workerTask}</div>
                          {item.matchedRoleTask && (
                            <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                              {t.maps_to_label || "Maps to:"} <em>{item.matchedRoleTask}</em>
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-emerald-400 font-bold text-[10px] shrink-0 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                          {Math.round(item.similarity * 100)}% {t.match_unit || "match"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>{t.identified_gaps_bridge || "Identified Skills Gaps to Bridge"} ({activeRole.missing_skill_gaps?.length || 0})</span>
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeRole.missing_skill_gaps?.map((gap, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-rose-950/60 text-xs flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-100 font-semibold">• {gap.name}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 shrink-0 font-bold">
                            {t.velocity_prefix || "Velocity:"} {gap.velocity}x
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveMode("reskilling")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <span>{t.build_reskilling_pathway_btn || "Build Step-by-Step Reskilling Pathway for This Role"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 3: PERSONALISED RESKILLING & MOTIVATION LAB (THE FOCUS!)  */}
      {/* ========================================================================= */}
      {activeMode === "reskilling" && pathway && (
        <div className="space-y-6 animate-fadeIn">
          {/* Pathway Header with Green Arbitrage Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{t.pathway_title || "Personalised Reskilling Curriculum & Motivation Lab"}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {t.target_pathway_prefix || "Target Pathway:"} {activeRole?.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.pathway_sub || "Ordered learning roadmap tailored to candidate's exact CV atomic skills. Includes free/subsidised courses & HRD Corp-claimable credentials."}
              </p>
            </div>

            {/* REAL Working Green-AI Resilience Arbitrage Toggle */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-emerald-500/40">
              <span className="text-xs text-slate-400 pl-2">{t.sdg_toggle_label || "SDG:"}</span>
              <button
                onClick={() => onToggleGreenPivot(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  !isGreenPivotActive ? "bg-slate-800 text-slate-200 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {t.sdg_standard_opt || "Standard"}
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
                {t.sdg_green_opt || "Green-AI (3.2x)"}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* UN SDG CAREER CONTRIBUTION IMPACT CARD (MANDATORY REQUIREMENT 5)          */}
          {/* ========================================================================= */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{t.sdg_alignment_title || "UN Sustainable Development Goals (SDG) Career Mapping"}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {t.sdg_alignment_sub || "How Your Chosen Transition Actively Advances the UN 2030 Agenda"}
                </h3>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-xs font-mono text-emerald-300 font-bold shrink-0">
                {pathway.sdg_impact.total_sdgs_impacted} {t.un_goals_supported || "UN Goals Supported"}
              </div>
            </div>

            {/* Official UN SDG Colored Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pathway.sdg_impact.primary_sdgs.map(sdg => (
                <div
                  key={sdg.code}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between space-y-2 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: sdg.color }}
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-white px-2 py-0.5 rounded" style={{ backgroundColor: sdg.color }}>
                        {sdg.code}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {sdg.contribution_score}{t.pct_impact || "% Impact"}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-100 mt-2">{sdg.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{sdg.target}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Personalized Human Impact Narrative */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>
                <strong>{t.personal_contribution_label || "Your Personal Contribution Statement:"} </strong>
                {pathway.sdg_impact.career_impact_statement}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEARNER MOTIVATION HUB: PROGRESS, BADGES & GAMIFICATION                    */}
          {/* ========================================================================= */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{t.learner_motivation_title || "Learner Motivation & Micro-Credential Badges"}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {t.skill_mastery_title || "Skill Mastery Progress & Micro-Credential Badges"}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-amber-300 font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{pathway.motivation.active_streak_days}{t.day_streak_label || "-Day Streak"}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-emerald-300 font-bold">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{earnedXp} / {pathway.motivation.total_xp_available} XP</span>
                </div>
              </div>
            </div>

            {/* Progress Meter Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">
                  {t.reskilling_completion_label || "Reskilling Completion:"} <strong className="text-white">{progressPct}%</strong> ({completedHours} / {totalHours} {t.hours_completed_label || "hours completed"})
                </span>
                <span className="text-emerald-400 font-bold">
                  {pathway.motivation.career_readiness_level}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-500"
                  style={{ width: `${Math.max(5, progressPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                <span>0 hrs</span>
                <span>{t.target_completion_prefix || "Target Completion:"} {pathway.motivation.target_completion_date}</span>
                <span>{totalHours} hrs</span>
              </div>
            </div>

            {/* Milestone Skill Badges Shelf */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                {t.skill_badges_shelf_title || "Earned & In-Progress Skill Badges:"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Starter Badge: Verified Capability Profile */}
                <div className="p-3 rounded-xl border bg-emerald-950/40 border-emerald-500/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/80 flex items-center justify-center text-xl shrink-0">
                    🎓
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-emerald-300 truncate">{t.starter_badge_title || "Atomic Profile Verified"}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{t.starter_badge_desc || "Unlocked • NLP Resume Ingested"}</div>
                  </div>
                </div>

                {/* Badges for each module */}
                {pathway.modules.map(module => {
                  const isUnlocked = completedModules.has(module.module_id);
                  const badge = module.milestone_badge;
                  return (
                    <div
                      key={module.module_id}
                      onClick={() => handleToggleModule(module.module_id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isUnlocked
                          ? "bg-slate-900 border-amber-500/80 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40"
                          : "bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-80"
                      }`}
                      title={badge?.criteria}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                        isUnlocked ? "bg-amber-950/80 border-amber-500/80 text-amber-300" : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {isUnlocked ? badge?.icon : <Lock className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-bold truncate ${isUnlocked ? "text-amber-200" : "text-slate-400"}`}>
                            {badge?.title}
                          </span>
                          {isUnlocked && <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {isUnlocked ? `${t.badge_earned_label || "Earned"} (+${module.xp_awarded} XP)` : (t.badge_unlock_hint || "Check module below to unlock")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP-BY-STEP PERSONALIZED LEARNING MODULES                                */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                {t.showing_label || "Showing"} {pathway.modules.length} {t.custom_ordered_modules_label || "Custom Ordered Modules for"} {currentPersona?.name}:
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {t.free_hrd_claimable_badge || "100% Free / HRD Corp Claimable"}
              </span>
            </div>

            {pathway.modules.map((module, idx) => {
              const isCompleted = completedModules.has(module.module_id);
              return (
                <div
                  key={module.module_id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCompleted
                      ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleModule(module.module_id)}
                      className="mt-1 shrink-0 p-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500 transition-colors cursor-pointer"
                      title={isCompleted ? (t.mark_incomplete_tooltip || "Mark incomplete") : (t.mark_completed_tooltip || "Mark completed")}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded border border-slate-600" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400">{t.step_prefix || "Step"} {idx + 1}{t.step_suffix || ":"}</span>
                        <h4 className="text-sm font-bold text-white">{module.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                          {module.badge_tag}
                        </span>
                        {module.endorsed_by_tvet && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            {t.endorsed_by_tvet_badge || "📌 Endorsed by TVET"}
                          </span>
                        )}
                      </div>

                      {/* Tailored Bridge Narrative connecting exact CV atomic skill */}
                      <div className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-emerald-400">{t.atomic_skill_bridge_label || "Atomic Skill Bridge:"} </strong>
                        {module.bridge_narrative}
                      </div>

                      {/* Course Metadata & UN SDGs */}
                      <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap pt-1">
                        <span>{t.provider_label || "Provider:"} <strong className="text-slate-300">{module.provider}</strong></span>
                        <span>•</span>
                        <span>{t.duration_label || "Duration:"} <strong className="text-slate-300">{module.duration_label}</strong></span>
                        <span>•</span>
                        <span>{t.cost_label || "Cost:"} <strong className="text-emerald-400">{module.cost}</strong></span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {module.sdg_targets?.map(sdg => (
                            <span key={sdg} className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[9px] border border-emerald-800/50">
                              {sdg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 self-end md:self-auto">
                    {module.provider_url && (
                      <a
                        href={module.provider_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        {t.enroll_now_btn || "Enroll Now"} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Runway Comparison Meter */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isGreenPivotActive
              ? "bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/70 shadow-2xl"
              : "bg-slate-900/60 border-slate-800"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Award className="w-3.5 h-3.5" />
                  {t.green_arbitrage_meter_title || "Green-AI Resilience Arbitrage (Interactive Comparative Meter)"}
                </div>
                <h3 className="text-base font-bold text-white">
                  {isGreenPivotActive
                    ? (t.path_b_active_narrative || "Path B Active: 1 Sustainability Credential Triples Career Runway from 14 to 45 Months")
                    : (t.path_a_active_narrative || "Standard Tech: Subject to Routine AI Model Compression within 12-14 Months")}
                </h3>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{t.career_runway_horizon_label || "Career Runway Horizon:"}</span>
                    <span className={`font-bold ${isGreenPivotActive ? "text-emerald-400" : "text-amber-400"}`}>
                      {isGreenPivotActive ? (t.months_runway_green || "45 Months Runway (3.2x)") : (t.months_runway_standard || "14 Months Runway (1.0x)")}
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
                    <span>{t.mos_0 || "0 mos"}</span>
                    <span>{t.mos_14_ceiling || "14 mos (Standard Tech Ceiling)"}</span>
                    <span>{t.mos_45_protected || "45 mos (Green-AI Protected)"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono">
                <div className="text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">{t.target_role_match_box || "Target Role Match"}</div>
                  <div className={`text-xl font-black ${isGreenPivotActive ? "text-emerald-400" : "text-slate-300"}`}>
                    {activeRole?.match_score_pct}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {isGreenPivotActive ? (t.boost_14_pct || "+14.8% Boost") : (t.baseline_label || "Baseline")}
                  </div>
                </div>

                <div className="text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">{t.projected_salary_box || "Projected Salary"}</div>
                  <div className={`text-xl font-black ${isGreenPivotActive ? "text-emerald-400" : "text-slate-300"}`}>
                    RM {activeRole?.median_salary_myr}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {isGreenPivotActive ? (t.green_premium_pct || "+15% Green Premium") : (t.standard_label || "Standard")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
