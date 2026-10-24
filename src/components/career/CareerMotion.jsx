import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCheck,
  FileText,
  GitBranch,
  Pause,
  Play,
  Radio,
} from "lucide-react";
import { SKILL_MAP } from "../../data/careerCatalog";
import { Icon } from "./CareerPrimitives";

const clamp = (value) => Math.min(1, Math.max(0, value));

// Measure layout on resize; scrolling only reads scrollY and writes transform inputs.
export function useLandingMotion(rootRef, disabled, onChapter) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let disposed = false;
    let scenes = [];
    let heroEnd = 0;
    let lastChapter = "";
    const update = () => {
      frame = 0;
      if (disposed) return;
      const y = window.scrollY;
      const height = window.innerHeight;
      root.dataset.heroVisible = y < heroEnd ? "true" : "false";
      let active = scenes[0]?.id;
      scenes.forEach((scene) => {
        if (scene.top < y + height * 0.5) active = scene.id;
        if (!disabled)
          scene.element.style.setProperty(
            "--scene-progress",
            clamp((y + height - scene.top) / (scene.height + height)).toFixed(
              4,
            ),
          );
      });
      if (active && active !== lastChapter) {
        lastChapter = active;
        onChapter(active);
      }
      const start = scenes[0]?.top || 0;
      const end = scenes.at(-1);
      root.style.setProperty(
        "--story-progress",
        clamp(
          (y - start + 100) / Math.max(1, (end?.top || start + 1) - start),
        ).toFixed(4),
      );
      if (!disabled)
        root.style.setProperty(
          "--hero-travel",
          clamp(y / Math.max(1, heroEnd)).toFixed(4),
        );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      if (disposed) return;
      scenes = [...root.querySelectorAll("[data-chapter]")].map((element) => ({
        element,
        id: element.id,
        top: element.getBoundingClientRect().top + scrollY,
        height: element.offsetHeight,
      }));
      heroEnd = root.querySelector(".n-hero")?.offsetHeight || innerHeight;
      schedule();
    };
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) =>
              entries.forEach((entry) => {
                entry.target.dataset.visible = entry.isIntersecting
                  ? "true"
                  : "false";
                if (entry.isIntersecting)
                  entry.target.classList.add("n-in-view");
              }),
            { threshold: 0.08 },
          )
        : null;
    root
      .querySelectorAll("[data-chapter], [data-motion-loop]")
      .forEach((element) => {
        if (observer) observer.observe(element);
        else {
          element.dataset.visible = "true";
          element.classList.add("n-in-view");
        }
      });
    const resize =
      typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    resize?.observe(root);
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resize?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [rootRef, disabled, onChapter]);
}

export function MotionControl({ paused, reduced, onToggle }) {
  return (
    <button
      className="n-motion-control"
      onClick={onToggle}
      aria-pressed={paused}
      disabled={reduced}
      aria-label={
        reduced
          ? "Reduced motion enabled by your device"
          : paused
            ? "Play animations"
            : "Pause animations"
      }
    >
      <Icon as={paused || reduced ? Play : Pause} size={14} />
      <span>
        {reduced ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}
      </span>
    </button>
  );
}

export function CareerMap({ profile, roles, paused, reduced }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => document.visibilityState === "visible",
  );
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const mapRef = useRef(null);
  const role = roles[index % roles.length];
  useEffect(() => {
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.15 },
          )
        : null;
    if (observer) observer.observe(mapRef.current);
    else setVisible(true);
    const update = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (paused || reduced || !visible || !pageVisible || hover || focused)
      return;
    const timer = setInterval(
      () => setIndex((previous) => (previous + 1) % roles.length),
      4800,
    );
    return () => clearInterval(timer);
  }, [paused, reduced, visible, pageVisible, hover, focused, roles.length]);

  return (
    <div
      className="n-career-map"
      ref={mapRef}
      data-motion-loop
      data-visible={visible}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="n-map-canvas">
        <svg
          className="n-map-connections"
          viewBox="0 0 1000 290"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <g className="n-map-wire">
            <path d="M160 138H242Q262 138 262 118V76Q262 56 282 56H470Q500 56 500 86V118Q500 138 530 138H800" />
            <path d="M160 138H300Q320 138 320 158V202Q320 222 340 222H495Q525 222 525 202V158Q525 138 545 138H800" />
            <path d="M160 138H800" />
            <path d="M800 138V245H630" />
          </g>
          <g className="n-map-packets">
            <path d="M160 138H242Q262 138 262 118V76Q262 56 282 56H470Q500 56 500 86V118Q500 138 530 138H800" />
            <path d="M160 138H300Q320 138 320 158V202Q320 222 340 222H495Q525 222 525 202V158Q525 138 545 138H800" />
            <path d="M160 138H800" />
          </g>
          <circle cx="800" cy="138" r="5" fill="currentColor" />
          <circle cx="160" cy="138" r="5" fill="currentColor" />
        </svg>
        <div className="n-map-origin">
          <span className="n-map-icon">
            <Icon as={FileText} size={20} />
          </span>
          <div>
            <small>Your starting point</small>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
        </div>
        <div className="n-map-skills" aria-label="Transferable skills">
          {profile.skills.slice(0, 4).map((id, i) => (
            <span key={id} style={{ "--skill-order": i }}>
              <i />
              {SKILL_MAP[id].name}
            </span>
          ))}
        </div>
        <div className="n-map-destination">
          <div className="n-map-role" key={role.id}>
            <span>
              <Icon as={GitBranch} size={14} /> A direction to explore
            </span>
            <strong>{role.title}</strong>
            <small>
              {role.known.length} strengths to build on · {role.gaps.length}{" "}
              skills to learn
            </small>
          </div>
          <div
            className="n-map-role-picker"
            role="group"
            aria-label="Preview a sample career direction"
          >
            {roles.map((item, i) => (
              <button
                key={item.id}
                aria-label={"Preview " + item.title}
                aria-pressed={index === i}
                onClick={() => setIndex(i)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <div className="n-map-preserved">
          <Icon as={CheckCheck} size={15} />
          <strong>AI foundations</strong>
          <span>Completed learning stays*</span>
        </div>
      </div>
      <div className="n-map-caption">
        <span>
          <Icon as={Radio} size={12} /> Experience connects. Possibilities
          change.
        </span>
        <span>Fictional sample · illustrative progress</span>
      </div>
    </div>
  );
}

export function ProcessRibbon() {
  const stages = [
    "Your experience",
    "New evidence",
    "Future possibilities",
    "Your next step",
    "Progress that stays",
  ];
  return (
    <div
      className="n-process-ribbon"
      data-motion-loop
      aria-label={stages.join(". ")}
    >
      <div className="n-process-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy}>
            {stages.map((label, i) => (
              <span key={label}>
                {label}
                <Icon
                  as={i === stages.length - 1 ? GitBranch : ArrowRight}
                  size={20}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
