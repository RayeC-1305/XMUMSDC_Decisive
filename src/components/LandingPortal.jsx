import React from "react";
import {
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Award,
  Globe2,
  Scale
} from "lucide-react";

export default function LandingPortal({
  t,
  onSelectAudience,
  activeInjectedSignals = [],
  macroScenario,
  onOpenAIDisclosure
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          XMUM SDC Hackathon 2026 • Domain 1: Aiversecity
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          NexusTalent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">360</span>
        </h1>
        <p className="text-base sm:text-lg font-medium text-slate-300 max-w-2xl mx-auto">
          The National Tri-Party Green & AI Skills Synchronizer
        </p>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mx-auto">
          Bridging Malaysia's green-tech and AI skills divide. Select your ecosystem stakeholder role below to enter your dedicated, page-to-page guided workflow:
        </p>
      </div>

      {/* 3 Target Audience Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Worker / Career Switcher */}
        <div
          onClick={() => onSelectAudience("worker")}
          className="group glass-panel rounded-3xl p-6 border border-slate-800 hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👤
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                Supply Side
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t.persona_worker}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Deconstruct your atomic tasks, discover emerging Green-AI roles, and access subsidized reskilling pathways.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Atomic Human + Technical Task Deconstruction</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Real-Time Skill Half-Life Badges</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Gold No-Regret Core & 3.2x Green Arbitrage</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2">
              <span>Enter Worker Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Enterprise HR & L&D Manager */}
        <div
          onClick={() => onSelectAudience("hr")}
          className="group glass-panel rounded-3xl p-6 border border-slate-800 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏢
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700">
                Demand Side
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                {t.persona_hr}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Monitor automation exposure across 50 employees, calculate HRD Corp ROI, and broadcast hiring needs.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>50-Employee Automation Risk Heatmap</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>HRD Corp Levy Layoff-Prevention ROI</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Live Q1 2027 Project Demand Broadcaster</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full py-2.5 px-4 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2">
              <span>Enter HR Command Centre</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 3: TVET & University Career Advisor */}
        <div
          onClick={() => onSelectAudience("tvet")}
          className="group glass-panel rounded-3xl p-6 border border-slate-800 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-400 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎓
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
                Advisor & TVET
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                {t.persona_tvet}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Reverse-audit 120 graduating students against surging AI market signals and 1-click endorse micro-credentials.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Reverse-Triggered Curriculum Blindspot Radar</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>1-Click Micro-Credential Cohort Endorsement</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Regional SDG Readiness Funnel & Report Export</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full py-2.5 px-4 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2">
              <span>Enter TVET Observatory</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Ecosystem Synchronization Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">
            Live Synchronization Engine:
          </span>
          <span className="text-slate-400">
            {activeInjectedSignals.length > 0
              ? `${activeInjectedSignals.length} Live Market Signal(s) Injected into Engine`
              : "6 Baseline Labor Signals Active (Sept–Oct 2026)"}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
            Scenario: {macroScenario}
          </span>
          <button
            onClick={onOpenAIDisclosure}
            className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Model Disclosure</span>
          </button>
        </div>
      </div>
    </div>
  );
}
