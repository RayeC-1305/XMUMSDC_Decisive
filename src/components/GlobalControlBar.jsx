import React, { useState } from "react";
import {
  Users,
  Building2,
  GraduationCap,
  Zap,
  Globe2,
  SlidersHorizontal,
  RotateCcw,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle,
  Activity,
  Cpu,
  Home
} from "lucide-react";

export default function GlobalControlBar({
  t,
  currentLanguage,
  onLanguageChange,
  activeView,
  onViewChange,
  macroScenario,
  onScenarioChange,
  isLiteMode,
  onToggleLiteMode,
  injectableSignals = [],
  activeInjectedSignals = [],
  onInjectSignal,
  onResetSignals,
  onFetchLiveTrend,
  onOpenAIDisclosure,
  isRippling,
  isWsConnected = false,
  wsClientCount = 1
}) {
  const [isInjectDropdownOpen, setIsInjectDropdownOpen] = useState(false);

  const scenarios = [
    { id: "moderate", label: t.moderate_ai, horizon: "3-Yr", ci: "±4.5%" },
    { id: "rapid_agentic", label: t.rapid_agentic, horizon: "12-Mo", ci: "±8.8%" },
    { id: "malaysia_green_boom", label: t.green_boom, horizon: "Policy Surge", ci: "±6.2%" }
  ];

  return (
    <header className={`sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-all ${
      isRippling ? "animate-signal-ripple ring-2 ring-emerald-500/50" : ""
    }`}>
      {/* Top Disclosure & Notification Strip */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAIDisclosure}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30 transition-colors cursor-pointer"
            title="Click to view Domain 1 AI Model Card & Architecture"
          >
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>{t.model_stack_badge || "Model: BAAI/bge-m3 + Llama-3-8B-Instruct on RunPod GPU"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            {t.xmum_sdc_badge || "XMUM SDC Hackathon 2026 • Domain 1: Aiversecity"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Real-time WebSocket Sync Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isWsConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className={isWsConnected ? "text-emerald-300 font-bold" : "text-slate-400"}>
              {isWsConnected ? `${t.websocket_live || "WebSocket Live"} (${wsClientCount})` : (t.polling_sync || "Polling Sync")}
            </span>
          </div>

          {/* Active Injected Signal Indicator Badge */}
          {activeInjectedSignals.length > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-[10px] animate-pulse">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{activeInjectedSignals.length} {t.live_signals_injected || "Live Signal(s) Injected"}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-[10px]">{t.baseline_signals_active || "Baseline Signals Active (Sept–Oct 2026)"}</span>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-[10px] font-bold">
            <Globe2 className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
            {["en", "ms", "zh"].map(lang => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLanguage === lang
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Lite Mode Toggle */}
          <button
            onClick={onToggleLiteMode}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors ${
              isLiteMode
                ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
          >
            {isLiteMode ? t.lite_mode_on : t.lite_mode_off}
          </button>
        </div>
      </div>

      {/* Main Global Navigation & Synchronizer Controls */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Home Navigation Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Home Button to return to landing page */}
          <button
            onClick={() => onViewChange("landing")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeView === "landing"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
            title="Return to Stakeholder Selection Portal"
          >
            <Home className="w-3.5 h-3.5" />
            <span>🏠 {t.home_btn || "Home"}</span>
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => onViewChange("landing")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>{t.app_title}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SDC 2026
                </span>
              </h1>
            </div>
          </div>

          {/* Tri-Party Quick Switcher (when inside any workflow) */}
          {activeView !== "landing" && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => onViewChange("worker")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeView === "worker"
                    ? "bg-emerald-600 text-white shadow font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>👤 {t.worker_tab || "Worker"}</span>
              </button>
              <button
                onClick={() => onViewChange("hr")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeView === "hr"
                    ? "bg-blue-600 text-white shadow font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🏢 {t.hr_tab || "HR"}</span>
              </button>
              <button
                onClick={() => onViewChange("tvet")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeView === "tvet"
                    ? "bg-purple-600 text-white shadow font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🎓 {t.tvet_tab || "TVET"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Demo Hero Injector & Macro Scenario Horizon */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Macro Uncertainty Scenario Horizon */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1">
              <SlidersHorizontal className="w-3 h-3 inline mr-1 text-emerald-400" />
              Scenario:
            </span>
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => onScenarioChange(sc.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  macroScenario === sc.id
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title={`Confidence Band: ${sc.ci}`}
              >
                <span>{sc.label}</span>
                <span className="ml-1 text-[9px] text-slate-500 font-mono">({sc.ci})</span>
              </button>
            ))}
          </div>

          {/* Core Demo Hero: Live Trend Signal Injector Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsInjectDropdownOpen(!isInjectDropdownOpen)}
                className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40 transition-all cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
                <span>{t.inject_signal_btn}</span>
                {activeInjectedSignals.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-yellow-300 ring-2 ring-emerald-900" />
                )}
              </button>

              {activeInjectedSignals.length > 0 && (
                <button
                  onClick={onResetSignals}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                  title={t.reset_signals}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Menu for Injectable Market Signals */}
            {isInjectDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-emerald-500/50 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    Select Signal to Inject into Engine:
                  </span>
                  <button
                    onClick={() => setIsInjectDropdownOpen(false)}
                    className="text-slate-400 hover:text-white text-xs font-mono"
                  >
                    ✕
                  </button>
                </div>

                {/* Live ML Agent Ingestion Button */}
                <button
                  onClick={async () => {
                    if (onFetchLiveTrend) await onFetchLiveTrend();
                    setIsInjectDropdownOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.fetch_live_btn || "🔄 Ingest Live AI Trends (arXiv / Open Data)"}</span>
                </button>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {injectableSignals.map(signal => {
                    const isActive = activeInjectedSignals.some(s => s.id === signal.id);
                    return (
                      <div
                        key={signal.id}
                        onClick={() => {
                          onInjectSignal(signal.id);
                          setIsInjectDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isActive
                            ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-sm"
                            : "bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                            {signal.date} • {signal.source_name}
                          </span>
                          {isActive && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-slate-950">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold mt-1 text-slate-100">{signal.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {signal.raw_snippet}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {activeInjectedSignals.length > 0 && (
                  <button
                    onClick={() => {
                      onResetSignals();
                      setIsInjectDropdownOpen(false);
                    }}
                    className="w-full py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset All to Baseline State
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Human-in-the-loop Governance Disclaimer Banner */}
      <div className="bg-slate-900/60 border-t border-slate-800/60 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{t.disclaimer}</span>
        </div>
        <div className="text-[10px] font-mono text-emerald-400 shrink-0">
          Confidence: {scenarios.find(s => s.id === macroScenario)?.ci || "±4.5%"}
        </div>
      </div>
    </header>
  );
}
