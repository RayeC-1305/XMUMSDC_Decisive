import React, { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  X,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { signalDate, mappingSkillName } from "../../utils/liveEvidence";

export function Icon({ as: Glyph, size = 18, ...props }) {
  return <Glyph size={size} aria-hidden="true" strokeWidth={1.7} {...props} />;
}
export function BrandMark({ size = 32 }) {
  return (
    <span
      className="c-brand-glyph"
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      x
    </span>
  );
}
export function Wordmark() {
  return (
    <span className="c-wordmark" role="img" aria-label="Nexus">
      <span aria-hidden="true">ne</span>
      <span className="c-wordmark-x" aria-hidden="true">
        x
      </span>
      <span aria-hidden="true">us</span>
    </span>
  );
}
export function CareerJourneyArt() {
  return (
    <div className="c-journey-art" aria-hidden="true">
      <svg className="c-journey-drawing" viewBox="0 0 480 260" fill="none">
        <path
          d="M27 226C-7 140 49 28 168 20c110-8 115 40 188 40 64 0 116 44 104 111-14 76-144 92-238 67C129 214 65 270 27 226Z"
          fill="var(--c-mineral)"
        />
        <path
          d="M72 98H140c36 0 36 91 76 91h53c43 0 32-116 76-116h70"
          stroke="#a6bcb0"
          strokeWidth="2"
          strokeDasharray="4 7"
        />
        <path
          d="M72 98H140c36 0 36 91 76 91h53c43 0 32-116 76-116h70"
          stroke="var(--c-green)"
          strokeWidth="3"
          strokeDasharray="174 500"
          strokeLinecap="round"
        />
        <circle
          cx="72"
          cy="98"
          r="8"
          fill="var(--c-green)"
          stroke="#f7f8f5"
          strokeWidth="5"
        />
        <circle
          cx="415"
          cy="73"
          r="10"
          fill="var(--c-harvest)"
          stroke="var(--c-green)"
          strokeWidth="3"
        />
        <path
          d="m410 73 3 3 6-7"
          stroke="var(--c-green-dark)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M399 209h21m-10-10v20M40 39h13m-6-6v12"
          stroke="#7d9a8b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="279" cy="33" r="3" fill="#7d9a8b" />
      </svg>
      <div className="c-art-experience">
        <div className="c-art-document">
          <span />
          <span />
          <span />
        </div>
        <div>
          <small>Your starting point</small>
          <strong>Experience</strong>
        </div>
      </div>
      <div className="c-art-skills">
        <span>
          <CheckCircle2 size={16} />
        </span>
        <div>
          <small>Connect the dots</small>
          <strong>Skills that transfer</strong>
        </div>
      </div>
      <div className="c-art-direction">
        <span>
          <ArrowUpRight size={19} />
        </span>
        <div>
          <small>A way forward</small>
          <strong>Your next direction</strong>
        </div>
      </div>
      <span className="c-art-caption">
        Different paths. Your possibilities.
      </span>
    </div>
  );
}
export function SdgTags({ targets = [], compact = false }) {
  return (
    <div className={`c-sdg-tags ${compact ? "compact" : ""}`}>
      {targets.map((target) => (
        <a
          key={target}
          className={`c-sdg c-sdg-${target.split(".")[0]}`}
          href={`https://sdgs.un.org/goals/goal${target.split(".")[0]}`}
          target="_blank"
          rel="noreferrer"
          title={`Read about UN SDG target ${target} (new tab)`}
        >
          SDG {target}
          <Icon as={ArrowUpRight} size={12} />
        </a>
      ))}
    </div>
  );
}
export function PageHeading({ title, description, children }) {
  return (
    <div className="c-page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="c-heading-actions">{children}</div>}
    </div>
  );
}
export function EmptyState({ icon: Glyph, title, children, action }) {
  return (
    <div className="c-empty">
      <Icon as={Glyph} size={30} />
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function Dialog({ open, onClose, title, children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal();
    else if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      className={`c-dialog ${className}`}
      ref={ref}
      onCancel={onClose}
      onClose={onClose}
      aria-label={title}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="c-dialog-heading">
        <h2>{title}</h2>
        <button
          className="c-icon-button"
          aria-label={`Close ${title}`}
          onClick={onClose}
        >
          <Icon as={X} size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function SourceDialog({ source, onClose }) {
  return (
    <Dialog
      open={Boolean(source)}
      onClose={onClose}
      title="Behind the recommendation"
      className="c-source-dialog"
    >
      {source && (
        <>
          <span
            className={`c-status ${source.type === "Simulation" ? "amber" : "green"}`}
          >
            {source.type === "Simulation" ? "Simulated scenario" : source.type}
          </span>
          <h3>{source.title}</h3>
          <p className="c-source-byline">
            {source.publisher} <span>·</span> Published {signalDate(source)}
          </p>
          <p>{source.summary}</p>
          {source.retrievedAt && (
            <div className="c-evidence-receipt">
              <strong>Retrieved from {source.provider}</strong>
              <p>
                {new Date(source.retrievedAt).toLocaleString("en-MY")} · DOI{" "}
                {source.doi}
              </p>
              <small>{source.venue}</small>
            </div>
          )}
          {source.mappings && (
            <div className="c-evidence-mappings">
              <h3>Why this affects the model</h3>
              {source.mappings.map((mapping) => (
                <div key={mapping.skill}>
                  <strong>
                    {mappingSkillName(mapping.skill)}{" "}
                    <span>{mapping.weight.toFixed(3)}×</span>
                  </strong>
                  <p>{mapping.reason}</p>
                </div>
              ))}
              <small>{source.mappingNote}</small>
            </div>
          )}
          <div className="c-source-explanation">
            <Icon as={ShieldCheck} />
            <div>
              <strong>How to read this evidence</strong>
              <p>
                {source.type === "Simulation"
                  ? "This input was authored for the demonstration. It shows how a plan could adapt; its weights are not findings from the linked source."
                  : "The linked source supports the topic. Matching weights and future scenarios are separate prototype assumptions, not findings reported by this publisher."}
              </p>
            </div>
          </div>
          <a
            className="c-button primary"
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            Open original source <Icon as={ExternalLink} size={15} />
          </a>
          <small>
            {source.retrievedAt
              ? "Retrieved metadata; not a human-reviewed demand forecast. "
              : "Source context reviewed 23 October 2026. "}
            Opens in a new tab.
          </small>
        </>
      )}
    </Dialog>
  );
}
export function StatusToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 5500);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  return (
    <div className="c-toast-region" role="status" aria-live="polite">
      {message && (
        <div className="c-toast">
          <Icon as={CheckCircle2} size={20} />
          <span>{message}</span>
          <button
            className="c-icon-button"
            aria-label="Dismiss notification"
            onClick={onClose}
          >
            <Icon as={X} size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
