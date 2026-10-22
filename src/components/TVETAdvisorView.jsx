import React, { useState, useMemo } from "react";
import syntheticPersonasData from "../../data/synthetic_personas.json";
import verifiedCoursesData from "../../data/verified_courses_my.json";
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
  Home,
  Upload,
  FileText,
  Radio,
  Target,
  Globe2,
  Compass,
  Trophy,
  Flame,
  RefreshCw,
  ExternalLink,
  Zap,
  Clock
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

export default function TVETAdvisorView({
  t,
  tvetCohort,
  courses = [],
  onEndorseCourse,
  activeInjectedSignals = [],
  onReturnHome
}) {
  // Navigation: 3 Core Interactive Lower Modes replacing linear steps
  const [activeMode, setActiveMode] = useState("pathway"); // "radar" | "matching" | "pathway"
  const [selectedTrack, setSelectedTrack] = useState("ALL");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [endorsedLocalIds, setEndorsedLocalIds] = useState(new Set());

  // Ingested Syllabus Profiles Catalog (4 Academic Tracks)
  const syllabusProfiles = useMemo(() => {
    return [
      {
        id: "TRK-MECH",
        name: "Diploma in Mechatronics & Automation",
        faculty: "School of Engineering & Advanced Manufacturing",
        students_count: 40,
        currency_score: 58,
        syllabus_status: "CRITICAL_BLINDSPOT",
        competencies_extracted: [
          "Basic Siemens PLC Ladder Logic & Relay Wiring",
          "Single-Axis Pneumatic Actuator Calibration",
          "Manual Lathe & CNC Machine Tool Operation"
        ],
        missing_frontier_skill: "ROS 2 Collaborative Robotics Programming (Cobots)",
        target_role: "Industrial Robotics & Clean Automation Specialist",
        frontier_viability_pct: 85,
        sdg: "SDG 9.4"
      },
      {
        id: "TRK-CS",
        name: "Diploma in Computer Science (Software & Data)",
        faculty: "Faculty of Computing & Informatics",
        students_count: 35,
        currency_score: 62,
        syllabus_status: "CRITICAL_BLINDSPOT",
        competencies_extracted: [
          "Relational MySQL Schema Design & Basic Queries",
          "Desktop Java / C++ OOP Application Architecture",
          "Basic HTML / CSS Static Web Development"
        ],
        missing_frontier_skill: "Agentic SQL & Autonomous Document Extraction",
        target_role: "Agentic Systems & ESG Data Pipeline Engineer",
        frontier_viability_pct: 88,
        sdg: "SDG 8.2"
      },
      {
        id: "TRK-AUTO",
        name: "Certificate in Automotive Maintenance & Diagnostics",
        faculty: "Vocational Skills Training Centre",
        students_count: 25,
        currency_score: 68,
        syllabus_status: "WATCHLIST",
        competencies_extracted: [
          "Internal Combustion Engine (ICE) Tune-up & Spark Timing",
          "Standard 12V Lead-Acid Battery Testing",
          "Basic OBD-II Fault Code Lookup & Brake Bleeding"
        ],
        missing_frontier_skill: "High-Voltage EV Battery Impedance Triage & LOTO",
        target_role: "High-Voltage EV Battery Diagnostics Specialist",
        frontier_viability_pct: 82,
        sdg: "SDG 7.1"
      },
      {
        id: "TRK-SCM",
        name: "Diploma in Supply Chain & Green Logistics",
        faculty: "Business & Logistics Academy",
        students_count: 20,
        currency_score: 64,
        syllabus_status: "WATCHLIST",
        competencies_extracted: [
          "Manual Warehouse Bin Location & Paper Manifests",
          "Basic ERP Purchase Order Generation in Excel",
          "Commercial Freight Incoterms Documentation"
        ],
        missing_frontier_skill: "Scope 3 GHG Protocol Carbon Accounting",
        target_role: "Scope 3 Carbon Value Chain Auditor",
        frontier_viability_pct: 79,
        sdg: "SDG 12.6"
      }
    ];
  }, []);

  // Filtered tracks with resilient fallback
  const effectiveCohort = useMemo(() => {
    if (tvetCohort && tvetCohort.tracks && tvetCohort.tracks.length > 0) return tvetCohort;
    return syntheticPersonasData.tvet_graduating_cohort || null;
  }, [tvetCohort]);

  const effectiveCourses = useMemo(() => {
    if (courses && courses.length > 0) return courses;
    return verifiedCoursesData.courses || [];
  }, [courses]);

  const activeTracks = useMemo(() => {
    const tracks = effectiveCohort?.tracks || [];
    if (selectedTrack === "ALL") return tracks;
    return tracks.filter(t => t.track_id === selectedTrack);
  }, [effectiveCohort, selectedTrack]);

  // Curriculum Blindspot Radar Data
  const curriculumRadarData = useMemo(() => {
    return [
      { subject: "Mechatronics (ROS2/Cobot)", syllabus: 25, marketDemand: 88, fullMark: 100, tKey: "tvet_subj_mechatronics" },
      { subject: "Computer Science (Agentic AI)", syllabus: 32, marketDemand: 92, fullMark: 100, tKey: "tvet_subj_cs" },
      { subject: "Automotive (EV High-Voltage)", syllabus: 28, marketDemand: 85, fullMark: 100, tKey: "tvet_subj_auto" },
      { subject: "Supply Chain (Scope 3 GHG)", syllabus: 18, marketDemand: 94, fullMark: 100, tKey: "tvet_subj_scm" },
      { subject: "Renewable Grid (SCADA)", syllabus: 35, marketDemand: 82, fullMark: 100, tKey: "tvet_subj_grid" },
      { subject: "Agri-Tech (Drone RTK)", syllabus: 40, marketDemand: 80, fullMark: 100, tKey: "tvet_subj_agri" }
    ].map(item => ({
      ...item,
      subject: (t && t[item.tKey]) || item.subject
    }));
  }, [t]);

  const handleEndorseAndSync = (course) => {
    onEndorseCourse(course.course_id);
    setEndorsedLocalIds(prev => new Set([...prev, course.course_id]));
    setDownloadNotice(`Official Endorsement Issued for "${course.title}". Injected into 120 student roadmaps with institutional TVET verification seal!`);
    setTimeout(() => setDownloadNotice(null), 5000);
  };

  const handleSyllabusUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(`Tokenizing curriculum outcomes from ${file.name} against Tabiya ESCO open dataset...`);
    setTimeout(() => {
      setIsUploading(false);
      setUploadMessage(`Successfully parsed ${file.name}: Ingested 18 discrete competency nodes across 120 graduating students.`);
      setTimeout(() => setUploadMessage(null), 5000);
    }, 1200);
  };

  const handleExportReport = () => {
    const reportData = {
      institution: tvetCohort?.institution || "National TVET & Applied Polytechnic Network",
      generated_at: new Date().toISOString(),
      cohort_size: tvetCohort?.total_students || 120,
      active_signals_injected: activeInjectedSignals.length,
      tracks: tvetCohort?.tracks || [],
      sdg_readiness: tvetCohort?.sdg_readiness || [],
      accreditation_compliance: "Tabiya ESCO + National Occupational Skills Standards (NOSS)"
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NexusTalent360_TVET_Curriculum_Sync_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotice("Institutional SDG Alignment Audit Report successfully exported.");
    setTimeout(() => setDownloadNotice(null), 4000);
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
            <Home className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.home_btn || "Home"}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">{t.tvet_command_center || "TVET & University Career Centre Observatory"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportReport}
            className="p-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/60 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.export_audit_btn || "Export Audit Report"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CURRICULUM INTAKE STUDIO (THE PRIMARY FOCUS)                   */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 4 • Syllabus & Course Competency Ingestion</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{t.tell_us_cohort_title || "Tell Us About Your Cohort"}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.tell_us_cohort_sub || "Ingest academic degree/diploma syllabi or course outlines. Tokenizes learning outcomes into discrete Tabiya-ESCO competency nodes cross-referenced with live industrial market demand."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40">
              {isUploading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? (t.ingesting_syllabus || "Ingesting Syllabus...") : (t.upload_syllabus_btn || "Upload Syllabus (PDF / TXT / JSON)")}</span>
              <input
                type="file"
                accept=".pdf,.txt,.json,.docx"
                className="hidden"
                onChange={handleSyllabusUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {uploadMessage && (
          <div className="p-3.5 rounded-xl bg-purple-950/90 border border-purple-500 text-xs text-purple-200 font-semibold animate-fadeIn flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {downloadNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-xs text-emerald-200 font-semibold animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* 1-Click Benchmark Academic Syllabus Profiles */}
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Or Select Graduating Academic Cohort Track:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {syllabusProfiles.map(track => {
              const isSelected = selectedTrack === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrack(isSelected ? "ALL" : track.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/40"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-purple-400 font-bold">{track.students_count} Students</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        track.syllabus_status === "CRITICAL_BLINDSPOT" ? "bg-rose-950 text-rose-300 border border-rose-800/60" : "bg-amber-950 text-amber-300 border border-amber-800/60"
                      }`}>
                        {track.syllabus_status === "CRITICAL_BLINDSPOT" ? "Blindspot" : "Watchlist"}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5 leading-snug">{track.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{track.faculty}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Currency: {track.currency_score}%</span>
                    <span className="text-emerald-400 font-bold">{track.sdg}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extracted Discrete Tabiya-ESCO Competencies Showcase */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Extracted discrete Tabiya-ESCO Competency Nodes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current academic learning outcomes mapped into discrete skills, highlighting missing high-velocity market gaps before graduation.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
              Total Cohort: <strong className="text-white">120 Students</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {syllabusProfiles.map(prof => (
              <div
                key={prof.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{prof.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {prof.students_count} Cohort Headcount
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Current Syllabus Outcomes:</div>
                  {prof.competencies_extracted.map((c, i) => (
                    <div key={i} className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/50 text-[11px] flex items-center justify-between">
                  <span className="text-rose-300">
                    <strong>Missing Frontier Gap: </strong>{prof.missing_frontier_skill}
                  </span>
                  <span className="text-rose-400 font-mono font-bold text-[10px] shrink-0 ml-2">
                    Action Needed
                  </span>
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
              Curriculum Radar
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.tvet_action_radar || "2. See Future Skills Radar"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.tvet_action_radar_sub || "Reverse-triggered syllabus lag & regional industrial gap alerts."}
            </p>
          </div>
        </button>

        {/* Button 2: Cohort Route Projections */}
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
              Frontier Matching
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.tvet_action_matching || "3. Get Matched (Cohort Routes)"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.tvet_action_matching_sub || "Vocational-to-Green-AI frontier matching & placement forecasts."}
            </p>
          </div>
        </button>

        {/* Button 3: Follow a Pathway (1-Click Bridging & SDG Scorecard) */}
        <button
          onClick={() => setActiveMode("pathway")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
            activeMode === "pathway"
              ? "bg-gradient-to-br from-purple-950/90 via-slate-900 to-teal-950/80 border-purple-500 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/50"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {t.one_click_active || "📌 1-Click Endorsement"}
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-bold text-white">{t.tvet_action_pathway || "4. Follow a Pathway (Bridging)"}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.tvet_action_pathway_sub || "1-Click advisor course pinning & Institutional SDG 4.3 scorecard."}
            </p>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 1: SYLLABUS LAG & REGIONAL GAP RADAR                      */}
      {/* ========================================================================= */}
      {activeMode === "radar" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-200">
                <span>{t.curriculum_lag_title || "Curriculum Lag: Academic vs Industrial Surge"}</span>
                <span className="text-[10px] font-mono text-purple-400">{t.market_sync_badge || "Market Sync"}</span>
              </div>
              <div className="w-full h-72 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={curriculumRadarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar name={t.academic_syllabus_series || "Current Academic Syllabus"} dataKey="syllabus" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                    <Radar name={t.industrial_demand_series || "Surging Industrial Demand"} dataKey="marketDemand" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", fontSize: "11px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-purple-400" />
                  <span>{t.blindspot_radar_title || "Reverse-Triggered Curriculum Blindspot Radar"}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {effectiveCohort?.tracks?.length || 4} {t.cohorts_monitored_badge || "Cohorts Monitored"}
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {(effectiveCohort?.tracks || []).map(track => {
                  const isCritical = track.status === "CRITICAL_BLINDSPOT";
                  return (
                    <div
                      key={track.track_id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                        isCritical
                          ? "bg-rose-950/20 border-rose-800/60"
                          : "bg-slate-900/80 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs">{track.track_name}</strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isCritical ? "bg-rose-950 text-rose-300 border border-rose-700" : "bg-amber-950 text-amber-300 border border-amber-700"
                        }`}>
                          {isCritical ? (t.critical_blindspot_alert || "🚨 CRITICAL BLINDSPOT") : (t.watchlist_alert || "⚠️ WATCHLIST")}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                        <div>
                          <span>{t.market_velocity_label || "Market Velocity:"} </span>
                          <strong className="text-emerald-400">{track.market_demand_velocity}x</strong>
                        </div>
                        <div>
                          <span>{t.cohort_mastery_label || "Cohort Mastery:"} </span>
                          <strong className="text-slate-200">{track.cohort_mastery_pct}%</strong>
                        </div>
                        <div>
                          <span>{t.obsolescence_risk_label || "Obsolescence Risk:"} </span>
                          <strong className={isCritical ? "text-rose-400" : "text-amber-400"}>
                            {track.curriculum_risk_pct}%
                          </strong>
                        </div>
                      </div>

                      {track.surge_signal_title && (
                        <div className="text-[10px] font-mono text-amber-300 bg-slate-950 p-1.5 rounded border border-slate-800 flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
                          <span>{t.trigger_label || "Trigger:"} {track.surge_signal_title}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 2: VOCATIONAL-TO-GREEN-AI FRONTIER MATCHING               */}
      {/* ========================================================================= */}
      {activeMode === "matching" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t.frontier_matching_title || "Vocational-to-Green-AI Frontier Cohort Matching:"}</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {t.frontier_matching_sub || "Projects what percentage of students can pivot directly into accredited green-tech corridors with last-mile bridging."}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.avg_placement_readiness || "Average Cohort Placement Viability:"}</span>
              <span className="text-emerald-400 font-mono font-black text-base">{t.placement_readiness_stat || "83.5% Placement Readiness"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabusProfiles.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                      {t.cohort_prefix || "Cohort:"} {item.name} ({item.students_count} {t.students_count_label || "Students"})
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {t.pivot_target_label || "Pivot Target:"} {item.target_role}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {item.frontier_viability_pct}%
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">{t.viability_label || "Viability"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                    <div>{t.syllabus_covered_label || "Syllabus Covered"}</div>
                    <div className="text-slate-200 font-bold">52%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                    <div>{t.adjacent_skills_label || "Adjacent Skills"}</div>
                    <div className="text-slate-200 font-bold">33%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                    <div>{t.missing_gap_label || "Missing Gap"}</div>
                    <div className="text-rose-400 font-bold">15%</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-purple-300">{t.missing_frontier_gap || "Target Frontier Gap:"} </strong>
                  {item.missing_frontier_skill}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{item.faculty}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">
                    {item.sdg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOWER MODE VIEW 3: 1-CLICK BRIDGING & INSTITUTIONAL SDG SCORECARD        */}
      {/* ========================================================================= */}
      {activeMode === "pathway" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Institutional SDG Scorecard */}
          <div className="glass-panel rounded-2xl p-5 border border-purple-500/50 bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{t.institutional_sdg_title || "Institutional SDG Impact Scorecard & Academic Accreditation"}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {t.institutional_sdg_sub || "Quantifying National TVET Contribution to UN SDG Targets 4.3, 4.4 & 9.4"}
                </h3>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-700/60 text-xs font-mono text-purple-300 font-bold shrink-0">
                {t.students_market_ready || "120 Students Certified Market-Ready"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">{t.sdg_43_title || "SDG 4.3 • Affordable Technical Education"}</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{t.sdg_43_val || "RM 0 Student Surcharge"}</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.sdg_43_desc || "100% of micro-credential bridging modules delivered via subsidized MDEC and HRD Corp claimable allocations."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{t.sdg_44_title || "SDG 4.4 • Relevant Employability Skills"}</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{t.sdg_44_val || "83.5% Placement Readiness"}</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.sdg_44_desc || "Direct alignment with northern corridor semiconductor cleanrooms and southern green data center corridors."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">{t.sdg_94_title || "SDG 9.4 • Industrial Retrofitting"}</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{t.sdg_94_val || "Clean Automation Standards"}</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.sdg_94_desc || "Graduates certified in energy-optimal ROS 2 trajectories and high-voltage battery safety isolation protocols."}
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Human-in-the-Loop Endorsement Tree */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase">
              <span>{t.endorsement_hub_title || "Human-in-the-Loop Micro-Credential Endorsement Hub (Inject into Cohorts):"}</span>
              <span className="text-purple-400 font-mono">{t.one_click_active || "1-Click Endorsement Active"}</span>
            </div>

            <div className="space-y-3">
              {effectiveCourses.slice(0, 6).map((course, idx) => {
                const isEndorsed = course.endorsed_by_tvet || endorsedLocalIds.has(course.course_id);
                return (
                  <div
                    key={course.course_id}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isEndorsed
                        ? "bg-purple-950/30 border-purple-500/70 shadow-lg shadow-purple-500/10"
                        : "bg-slate-900/80 border-slate-800"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-bold text-white">{course.title}</strong>
                        {isEndorsed && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500 text-white shadow-sm flex items-center gap-1">
                            <Pin className="w-3 h-3" />
                            <span>{t.endorsed_to_cohort_badge || "ENDORSED TO COHORT"}</span>
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                          {course.level || (t.intermediate_badge || "Intermediate")}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">{course.description}</p>

                      <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap pt-0.5">
                        <span>{t.provider_label || "Provider:"} <strong className="text-slate-300">{course.provider}</strong></span>
                        <span>•</span>
                        <span>{t.duration_label || "Duration:"} <strong className="text-slate-300">{course.duration}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{course.cost}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleEndorseAndSync(course)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isEndorsed
                            ? "bg-purple-800 text-white border border-purple-400"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20"
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                        <span>{isEndorsed ? (t.pinned_to_cohort || "Pinned to 120 Students ✓") : (t.pin_and_endorse || "📌 Pin & Endorse to Cohort")}</span>
                      </button>

                      {course.provider_url && (
                        <a
                          href={course.provider_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          title={t.view_syllabus_tooltip || "View Course Syllabus"}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
