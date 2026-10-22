import React from "react";
import { X, ExternalLink, ShieldCheck, Calendar, Database, Sparkles } from "lucide-react";

export default function SignalInspectorModal({ signal, isOpen, onClose, t }) {
  if (!isOpen || !signal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t?.inspect_signal || "Zero-Hallucination Verified Source"}
            </div>
            <h3 className="text-lg font-bold text-slate-100">{signal.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4 space-y-4 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Publication Date:</strong> {signal.date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate"><strong>Source:</strong> {signal.source_name}</span>
            </div>
          </div>

          {/* Raw Excerpt Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Raw Verified Evidence Excerpt:
            </label>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs leading-relaxed text-slate-300">
              "{signal.raw_snippet}"
            </div>
          </div>

          {/* Impact Multipliers */}
          {signal.skill_velocity_impacts && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Skill Velocity Impacts:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(signal.skill_velocity_impacts).map(([skillId, multiplier]) => {
                  const isPositive = multiplier >= 1.0;
                  const deltaPct = Math.round((multiplier - 1.0) * 100);
                  return (
                    <div
                      key={skillId}
                      className={`p-2.5 rounded-lg border text-xs ${
                        isPositive
                          ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-950/30 border-rose-500/30 text-rose-300"
                      }`}
                    >
                      <div className="font-mono text-[10px] text-slate-400 truncate">{skillId}</div>
                      <div className="text-sm font-bold flex items-center justify-between mt-1">
                        <span>{multiplier}x</span>
                        <span className="text-[11px] font-mono">
                          {isPositive ? `+${deltaPct}%` : `${deltaPct}%`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ML Learned Risk Telemetry */}
          {signal.learned_risk_telemetry && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>ML Agent Learned Risk Forecast & Curriculum Impacts:</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Peak Demand Surge:</span>
                  <span className="text-emerald-400 font-bold">{signal.learned_risk_telemetry.max_velocity_surge}x Multiplier</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Obsolescence Velocity:</span>
                  <span className="text-rose-400 font-bold">{signal.learned_risk_telemetry.min_velocity_decay}x Multiplier</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>Confidence Band: {signal.learned_risk_telemetry.confidence_interval}</span>
                {signal.ml_provenance && (
                  <span className="text-slate-500">
                    Source: {signal.ml_provenance.ingestion_source_type} ({signal.ml_provenance.processing_latency_ms}ms)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Source Link */}
          {signal.source_url && (
            <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
              <span>Verified against Malaysia Open Data & arXiv preprints</span>
              <a
                href={signal.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
              >
                Open Primary Source Document <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
