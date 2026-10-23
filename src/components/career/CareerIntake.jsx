import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  Check,
  ShieldCheck,
  Download,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
  PencilLine,
  Leaf,
} from "lucide-react";
import {
  SAMPLE_CVS,
  SKILLS,
  SKILL_MAP,
  DEFAULT_PREFERENCES,
  sampleText,
} from "../../data/careerCatalog";
import { extractCv, downloadText } from "../../utils/careerDemo";
import { parseCvWithApi } from "../../utils/careerApi";
import { Icon, SdgTags, CareerJourneyArt } from "./CareerPrimitives";

export default function CareerIntake({
  profile,
  preferences,
  onComplete,
  onExplore,
  editing = false,
}) {
  const [step, setStep] = useState(editing ? 1 : 0);
  const [draft, setDraft] = useState(profile || null);
  const [prefs, setPrefs] = useState(preferences || DEFAULT_PREFERENCES);
  const [paste, setPaste] = useState("");
  const [mode, setMode] = useState("file");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [addedSkill, setAddedSkill] = useState("");
  const fileInput = useRef(null);
  const heading = useRef(null);
  const advance = (next) => {
    setError("");
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus();
      window.scrollTo(0, 0);
    });
  };
  async function readFile(file) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const result = await extractCv(file);
      setDraft(await parseCvWithApi(result.text, file.name));
      advance(1);
    } catch (failure) {
      setError(
        failure.message ||
          "This file could not be read. Try another file or paste the text.",
      );
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }
  function useSample(sample) {
    setDraft({
      ...sample,
      skills: [...sample.skills],
      tasks: [...sample.tasks],
      importedAt: new Date().toISOString(),
    });
    advance(1);
  }
  function reviewNext(event) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.role.trim()) {
      setError("Add a name and current role to continue.");
      return;
    }
    if (!draft.skills.length) {
      setError("Select at least one skill so we can build useful matches.");
      return;
    }
    advance(2);
  }

  return (
    <div className={`c-intake ${step === 0 ? "c-intake-welcome" : ""}`}>
      <div className="c-intake-top">
        <span className="c-back-label">
          <Icon as={ShieldCheck} size={15} /> Your original file stays on this device
        </span>
        <button className="c-text-button" onClick={onExplore}>
          {editing ? "Back to workspace" : "Explore a sample workspace"}
          <Icon as={ArrowUpRightFallback} size={15} />
        </button>
      </div>
      <div className="c-intake-intro">
        <div className="c-intake-heading">
          <h1 ref={heading} tabIndex={-1}>
            {
              [
                <>
                  Your experience.
                  <br />A new direction.
                </>,
                <>
                  Your experience,
                  <br />
                  in your words.
                </>,
                <>
                  A plan that fits
                  <br />
                  your life.
                </>,
              ][step]
            }
          </h1>
          <p>
            {
              [
                "See where your skills can take you. Start with your CV, explore the possibilities, and build a practical way forward.",
                "Review what we found. You know your experience best.",
                "Your goals and available time shape a pathway you can actually follow.",
              ][step]
            }
          </p>
        </div>
        {step === 0 && <CareerJourneyArt />}
      </div>
      <ol className="c-intake-steps" aria-label="Profile setup progress">
        {["Import your CV", "Review your profile", "Set your direction"].map(
          (label, index) => (
            <li
              key={label}
              className={
                index === step ? "current" : index < step ? "complete" : ""
              }
              aria-current={index === step ? "step" : undefined}
            >
              <span>
                {index < step ? <Icon as={Check} size={14} /> : index + 1}
              </span>
              {label}
              {index < 2 && <Icon as={ChevronRight} size={15} />}
            </li>
          ),
        )}
      </ol>
      {error && (
        <div className="c-inline-error" role="alert">
          {error}
        </div>
      )}
      {step === 0 && (
        <div className="c-import-layout">
          <section className="c-import-main">
            <div className="c-import-card-heading">
              <h2>Start with what you know</h2>
              <p>Bring your experience. We’ll help connect the dots.</p>
            </div>
            <div className="c-segment-control">
              <button
                className={mode === "file" ? "active" : ""}
                aria-pressed={mode === "file"}
                onClick={() => setMode("file")}
              >
                <Icon as={UploadCloud} size={16} />
                Upload a CV
              </button>
              <button
                className={mode === "paste" ? "active" : ""}
                aria-pressed={mode === "paste"}
                onClick={() => setMode("paste")}
              >
                <Icon as={PencilLine} size={16} />
                Paste experience
              </button>
            </div>
            {mode === "file" ? (
              <>
                <input
                  ref={fileInput}
                  className="c-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  aria-label="Upload a sample CV"
                  onChange={(event) => readFile(event.target.files[0])}
                />
                <div
                  className={`c-dropzone ${dragging ? "dragging" : ""} ${busy ? "processing" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    if (!busy) readFile(event.dataTransfer.files[0]);
                  }}
                >
                  <div className="c-upload-symbol">
                    <Icon
                      as={busy ? Loader2 : UploadCloud}
                      size={32}
                      className={busy ? "c-spin" : ""}
                    />
                  </div>
                  <h2>
                    {busy ? "Reading your experience…" : "Drop your CV here"}
                  </h2>
                  <p>
                    {busy
                      ? "Extracting text and identifying familiar skills. Your file stays on this device."
                      : "PDF, DOCX or TXT · up to 5 MB"}
                  </p>
                  <button
                    className="c-button primary"
                    disabled={busy}
                    onClick={() => fileInput.current.click()}
                  >
                    {busy ? "Processing file…" : "Choose a file"}
                    <Icon as={Plus} size={16} />
                  </button>
                  <span>
                    Text-based files work best. You can review every detail.
                  </span>
                </div>
              </>
            ) : (
              <form
                className="c-paste-form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (paste.trim().length < 30) {
                    setError(
                      "Add a little more detail—at least 30 characters about skills and experience.",
                    );
                    return;
                  }
                  setBusy(true);
                  setError("");
                  try { setDraft(await parseCvWithApi(paste)); advance(1); }
                  catch (failure) { setError(failure.message); }
                  finally { setBusy(false); }
                }}
              >
                <label htmlFor="cv-text">
                  Paste a sample CV or describe your experience
                </label>
                <textarea
                  id="cv-text"
                  value={paste}
                  onChange={(event) => setPaste(event.target.value)}
                  placeholder={
                    "Name\nCurrent role\nSkills and tools\nA few things you do at work…"
                  }
                  rows={10}
                  maxLength={30000}
                />
                <div>
                  <span>
                    {paste.length.toLocaleString()} / 30,000 characters
                  </span>
                  <button className="c-button primary" type="submit" disabled={busy}>
                    {busy ? "Reviewing experience…" : "Review my experience"}
                    <Icon as={ArrowRight} size={16} />
                  </button>
                </div>
              </form>
            )}
            <div className="c-import-note">
              <Icon as={ShieldCheck} size={18} />
              <p>
                Files are read locally. Extracted text is sent to the career
                service for processing in memory, without being saved. You
                review the profile before matching.
              </p>
            </div>
          </section>
          <aside className="c-sample-panel">
            <h2>Take a look around first.</h2>
            <p>
              Meet three fictional career explorers. Choose a profile to see how
              it works.
            </p>
            <div className="c-sample-list">
              {SAMPLE_CVS.map((sample, index) => (
                <div className="c-sample-item" key={sample.id}>
                  <button onClick={() => useSample(sample)}>
                    <span className={`c-sample-avatar tone-${index}`}>
                      {sample.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span>
                      <span className="c-sample-context">
                        {
                          [
                            "A career change",
                            "A technical next step",
                            "A first career",
                          ][index]
                        }
                      </span>
                      <strong>{sample.name}</strong>
                      <small>{sample.role}</small>
                      <small>
                        {sample.years
                          ? `${sample.years} years of experience`
                          : "Starting a first career"}
                      </small>
                    </span>
                    <Icon as={ArrowRight} size={16} />
                  </button>
                  <button
                    className="c-sample-download"
                    aria-label={`Download ${sample.name}'s sample CV`}
                    onClick={() =>
                      downloadText(sampleText(sample), sample.filename)
                    }
                  >
                    <Icon as={Download} size={14} /> Download sample CV
                  </button>
                </div>
              ))}
            </div>
            <div className="c-sample-footnote">
              <Icon as={Clock3} size={16} />
              <span>About 3 minutes to your first pathway.</span>
            </div>
          </aside>
        </div>
      )}
      {step === 1 && draft && (
        <form className="c-review-layout" onSubmit={reviewNext}>
          <section className="c-profile-editor">
            <div className="c-file-receipt">
              <span>
                <Icon as={FileText} size={22} />
                <span>
                  <strong>{draft.filename || "Sample profile"}</strong>
                  <small>Text extracted · ready for your review</small>
                </span>
              </span>
              <span className="c-status green">
                <Icon as={Check} size={13} /> Read successfully
              </span>
            </div>
            <h2>Your story, in a few details.</h2>
            <div className="c-form-grid">
              <label>
                Full name
                <input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <label>
                Current or most recent role
                <input
                  required
                  value={draft.role}
                  onChange={(event) =>
                    setDraft({ ...draft, role: event.target.value })
                  }
                />
              </label>
              <label>
                Location
                <input
                  value={draft.location}
                  onChange={(event) =>
                    setDraft({ ...draft, location: event.target.value })
                  }
                />
              </label>
              <label>
                Years of experience
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={draft.years}
                  onChange={(event) =>
                    setDraft({ ...draft, years: Number(event.target.value) })
                  }
                />
              </label>
              <label className="full">
                Education or qualification
                <input
                  value={draft.education}
                  onChange={(event) =>
                    setDraft({ ...draft, education: event.target.value })
                  }
                  placeholder="Optional"
                />
              </label>
              <label className="full">
                Things you do well
                <textarea
                  value={draft.tasks.join("\n")}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      tasks: event.target.value.split("\n"),
                    })
                  }
                  rows={4}
                  placeholder="One task or responsibility per line"
                />
                <small>Keep, edit or add tasks. One per line.</small>
              </label>
            </div>
          </section>
          <aside className="c-review-skills">
            <div className="c-section-title">
              <h2>Skills we found</h2>
              <span className="c-count">{draft.skills.length}</span>
            </div>
            <p>
              Keep the skills that reflect this profile. These will shape your
              role matches.
            </p>
            <div className="c-reviewed-skills">
              {draft.skills.map((id) => (
                <div className="c-reviewed-skill" key={id}>
                  <Icon as={CheckCircle2} size={17} />
                  <span>
                    <strong>{SKILL_MAP[id]?.name || id}</strong>
                    <small>{SKILL_MAP[id]?.category}</small>
                  </span>
                  <button
                    type="button"
                    className="c-icon-button"
                    aria-label={`Remove ${SKILL_MAP[id]?.name || id}`}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        skills: draft.skills.filter((skill) => skill !== id),
                      })
                    }
                  >
                    <Icon as={X} size={15} />
                  </button>
                </div>
              ))}
            </div>
            <label className="c-add-skill">
              Add a skill
              <div>
                <select
                  value={addedSkill}
                  onChange={(event) => setAddedSkill(event.target.value)}
                >
                  <option value="">Choose a skill</option>
                  {SKILLS.filter(
                    (skill) => !draft.skills.includes(skill.id),
                  ).map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <button
                  className="c-button secondary"
                  type="button"
                  disabled={!addedSkill}
                  onClick={() => {
                    setDraft({
                      ...draft,
                      skills: [...draft.skills, addedSkill],
                    });
                    setAddedSkill("");
                  }}
                >
                  <Icon as={Plus} size={17} />
                  <span className="sr-only">Add selected skill</span>
                </button>
              </div>
            </label>
            <div className="c-review-callout">
              <Icon as={Sparkles} size={17} />
              <p>
                This is a keyword-based extraction. Reviewing it keeps you
                in control.
              </p>
            </div>
          </aside>
          <div className="c-flow-footer full">
            <button
              type="button"
              className="c-button ghost"
              onClick={() => advance(0)}
            >
              <Icon as={ArrowLeft} size={16} />
              Back to import
            </button>
            <span>You can change these details later.</span>
            <button className="c-button primary" type="submit">
              Looks right, continue
              <Icon as={ArrowRight} size={16} />
            </button>
          </div>
        </form>
      )}
      {step === 2 && draft && (
        <form
          className="c-preference-layout"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            try { await onComplete(
              {
                ...draft,
                name: draft.name.trim(),
                role: draft.role.trim(),
                tasks: draft.tasks.filter((task) => task.trim()),
              },
              prefs,
            ); } catch (failure) { setError(failure.message); }
            finally { setBusy(false); }
          }}
        >
          <section className="c-preference-form">
            {error && <p className="c-inline-error" role="alert">{error}</p>}
            <h2>What would a good next chapter look like?</h2>
            <label>
              Your main goal
              <select
                value={prefs.goal}
                onChange={(event) =>
                  setPrefs({ ...prefs, goal: event.target.value })
                }
              >
                {[
                  "Explore a new direction",
                  "Grow in my current role",
                  "Prepare for a first job",
                  "Move into more sustainable work",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              What interests you?
              <select
                value={prefs.interest}
                onChange={(event) =>
                  setPrefs({ ...prefs, interest: event.target.value })
                }
              >
                {[
                  "All opportunities",
                  "Data & operations",
                  "Sustainability",
                  "Engineering",
                  "Clean energy",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>How much time can you make each week?</legend>
              <div className="c-time-options">
                {[2, 4, 6, 8].map((hours) => (
                  <button
                    type="button"
                    key={hours}
                    aria-pressed={prefs.hours === hours}
                    className={prefs.hours === hours ? "selected" : ""}
                    onClick={() => setPrefs({ ...prefs, hours })}
                  >
                    <strong>{hours}</strong>
                    <span>hours / week</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <label>
              What matters most?
              <select
                value={prefs.priority}
                onChange={(event) =>
                  setPrefs({ ...prefs, priority: event.target.value })
                }
              >
                {[
                  "Build on my experience",
                  "Explore growing skill areas",
                  "Make a sustainability contribution",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <div className="c-resource-promise">
              <Icon as={BookIcon} size={20} />
              <div>
                <strong>Start with free learning material.</strong>
                <p>
                  Your pathway uses public resources. Optional certificates,
                  hardware and professional qualifications are excluded.
                </p>
              </div>
            </div>
          </section>
          <aside className="c-ready-preview">
            <div className="c-ready-art">
              <span>
                {draft.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="c-ready-check">
                <Icon as={Check} size={20} />
              </span>
            </div>
            <h2>
              A starting point.
              <br />A world of possibility.
            </h2>
            <p>
              {draft.name.split(" ")[0]}, we’ll connect your{" "}
              {draft.skills.length} selected skills to future role directions,
              then build an achievable first learning plan.
            </p>
            <div className="c-ready-summary">
              <span>
                <Icon as={CheckCircle2} />
                Experience reviewed
              </span>
              <span>
                <Icon as={Clock3} />
                {prefs.hours} hours of learning a week
              </span>
              <span>
                <Icon as={Leaf} />
                Connected to global goals
              </span>
            </div>
            <SdgTags targets={["4.4", "8.5"]} />
            <small>
              Role matches and future signals are illustrative. Your next step
              stays your decision.
            </small>
          </aside>
          <div className="c-flow-footer full">
            <button
              type="button"
              className="c-button ghost"
              onClick={() => advance(1)}
            >
              <Icon as={ArrowLeft} size={16} />
              Back to profile
            </button>
            <span>A plan that starts with you.</span>
            <button type="submit" className="c-button primary" disabled={busy}>
              {busy ? "Creating workspace…" : "Create my career workspace"}
              <Icon as={ArrowRight} size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
function ArrowUpRightFallback(props) {
  return <ArrowRight {...props} style={{ transform: "rotate(-35deg)" }} />;
}
function BookIcon(props) {
  return <FileText {...props} />;
}
