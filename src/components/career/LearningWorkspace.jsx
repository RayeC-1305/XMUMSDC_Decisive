import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Download,
  ExternalLink,
  FileCheck2,
  Leaf,
  MessageSquare,
  MoreHorizontal,
  PencilLine,
  Printer,
  Route,
  Trash2,
  X,
} from "lucide-react";
import { ROLES, SCENARIOS } from "../../data/careerCatalog";
import { progressKey } from "../../utils/careerDemo";
import {
  Icon,
  SdgTags,
  PageHeading,
  EmptyState,
  Dialog,
} from "./CareerPrimitives";

function LearningStep({
  step,
  index,
  done,
  open,
  onExpand,
  onComplete,
  note,
  onNote,
  roleTitle,
}) {
  const [reflection, setReflection] = useState(note || "");
  const [noteOpen, setNoteOpen] = useState(Boolean(note));
  useEffect(() => setReflection(note || ""), [note]);
  return (
    <li
      className={`c-learning-step ${done ? "complete" : ""} ${open ? "open" : ""}`}
    >
      <span className="c-learning-index">
        {done ? <Icon as={Check} size={17} /> : index + 1}
      </span>
      <article>
        <button
          className="c-step-heading"
          onClick={onExpand}
          aria-expanded={open}
          aria-controls={`step-content-${step.id}`}
        >
          <span>
            <span className="c-step-kind">
              {step.kind}
              {done && (
                <span>
                  <Icon as={CheckCheck} size={12} />
                  Completed
                </span>
              )}
            </span>
            <h3>{step.title}</h3>
            <small>{step.subtitle}</small>
          </span>
          <span className="c-step-time">
            <span>
              {done ? "Completed" : `Week ${step.startWeek}`}
              {step.endWeek !== step.startWeek ? `–${step.endWeek}` : ""}
            </span>
            <small>{step.hours} hours</small>
            <Icon as={ChevronDown} size={18} />
          </span>
        </button>
        <div
          id={`step-content-${step.id}`}
          hidden={!open}
          className="c-step-content"
        >
          <p>{step.description}</p>
          <div className="c-step-output">
            <Icon as={FileCheck2} size={21} />
            <div>
              <strong>What you’ll have to show</strong>
              <p>{step.output}</p>
            </div>
          </div>
          {step.resource && (
            <>
              <div className="c-resource-box">
                <span className="c-resource-logo">
                  <Icon as={BookOpen} size={23} />
                </span>
                <div>
                  <small>{step.resource.provider}</small>
                  <h4>{step.resource.title}</h4>
                  <p>Free public resource · work at your own pace</p>
                </div>
                <a
                  className="c-button secondary"
                  href={step.resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Start learning
                  <Icon as={ExternalLink} size={14} />
                </a>
              </div>
              <p className="c-resource-note">{step.resource.note}</p>
            </>
          )}
          <SdgTags targets={step.targets} />
          <div className="c-reflection">
            <button
              className="c-text-button"
              onClick={() => setNoteOpen(!noteOpen)}
              aria-expanded={noteOpen}
            >
              <Icon as={PencilLine} size={15} />
              {note
                ? "Edit your learning reflection"
                : "Add a reflection or work sample"}
              <Icon as={ChevronDown} size={14} />
            </button>
            {noteOpen && (
              <div>
                <label htmlFor={`reflection-${step.id}`}>
                  What did you learn? What would you like to discuss?
                </label>
                <textarea
                  id={`reflection-${step.id}`}
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Write a short reflection or paste a link to your practice work…"
                />
                <div>
                  <small>
                    {reflection.length} / 2,000 characters · saved on this
                    device
                  </small>
                  <button
                    className="c-button secondary"
                    onClick={() => onNote(reflection)}
                  >
                    Save reflection
                    <Icon as={Check} size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="c-step-footer">
            <span>Self-reported progress · no certification implied</span>
            <button
              className={`c-button ${done ? "secondary" : "primary"}`}
              aria-pressed={done}
              onClick={onComplete}
            >
              <Icon as={done ? CheckCheck : Check} size={16} />
              {done ? "Mark as incomplete" : "Mark step complete"}
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}

export default function LearningWorkspace({
  profile,
  preferences,
  role,
  plan,
  progress,
  notes,
  saved,
  signals,
  scenario,
  revisions = [],
  onPace,
  onComplete,
  onNote,
  onSave,
  onExport,
  onNavigate,
  onRestore,
  onDelete,
  onRename,
  onShare,
}) {
  const [tab, setTab] = useState("plan");
  const [expanded, setExpanded] = useState(
    plan.find((step) => !progress[progressKey(profile, role, step)])?.id ||
      plan[0]?.id,
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const completed = plan.filter(
    (step) => progress[progressKey(profile, role, step)],
  ).length;
  const totalHours = plan.reduce((sum, step) => sum + step.hours, 0);
  const weeks =
    role.pathway?.estimatedWeeks ?? Math.ceil(totalHours / preferences.hours);
  const matchingSaved = saved.find(
    (item) => item.profileId === profile.id && item.roleId === role.id,
  );
  const planChanged = Boolean(
    matchingSaved &&
    (matchingSaved.hoursPerWeek !== preferences.hours ||
      matchingSaved.scenario !== scenario ||
      JSON.stringify(matchingSaved.preferences) !==
        JSON.stringify(preferences) ||
      JSON.stringify(matchingSaved.signals) !== JSON.stringify(signals)),
  );
  function prepareReview() {
    if (!matchingSaved || planChanged) onSave();
    setReviewOpen(true);
  }
  const visibleSaved = saved.filter((item) => item.profileId === profile.id);
  useEffect(
    () =>
      setExpanded(
        plan.find((step) => !progress[progressKey(profile, role, step)])?.id ||
          plan[0]?.id,
      ),
    [role.id, scenario],
  );
  return (
    <>
      <PageHeading
        title="Your way forward, step by step."
        description="A practical learning plan, built around your experience and the time you have."
      >
        <button className="c-button secondary" onClick={onExport}>
          <Icon as={Download} size={16} />
          Download brief
        </button>
        <button className="c-button primary" onClick={prepareReview}>
          <Icon as={matchingSaved ? Check : Bookmark} size={16} />
          {planChanged
            ? "Save changes"
            : matchingSaved
              ? "Review my plan"
              : "Save my plan"}
        </button>
      </PageHeading>
      <div className="c-plan-tabs">
        <button
          className={tab === "plan" ? "active" : ""}
          aria-pressed={tab === "plan"}
          onClick={() => setTab("plan")}
        >
          My learning plan
        </button>
        <button
          className={tab === "saved" ? "active" : ""}
          aria-pressed={tab === "saved"}
          onClick={() => setTab("saved")}
        >
          Saved plans<span className="c-count">{visibleSaved.length}</span>
        </button>
      </div>
      {tab === "saved" ? (
        <section className="c-saved-plans">
          {visibleSaved.length ? (
            visibleSaved.map((item) => {
              const savedRole = ROLES.find(
                (option) => option.id === item.roleId,
              );
              return (
                <article className="c-saved-plan" key={item.id}>
                  <span className="c-soft-icon">
                    <Icon as={Route} size={23} />
                  </span>
                  <div>
                    {renaming === item.id ? (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (renameValue.trim())
                            onRename(item.id, renameValue.trim());
                          setRenaming(null);
                        }}
                      >
                        <label className="sr-only" htmlFor="rename-plan">
                          Plan name
                        </label>
                        <input
                          id="rename-plan"
                          value={renameValue}
                          onChange={(event) =>
                            setRenameValue(event.target.value)
                          }
                          maxLength={90}
                          autoFocus
                        />
                        <button className="c-button secondary" type="submit">
                          Save
                        </button>
                        <button
                          className="c-icon-button"
                          type="button"
                          aria-label="Cancel rename"
                          onClick={() => setRenaming(null)}
                        >
                          <Icon as={X} size={16} />
                        </button>
                      </form>
                    ) : (
                      <h2>{item.name}</h2>
                    )}
                    <p>
                      {savedRole?.title} ·{" "}
                      {
                        SCENARIOS.find((option) => option.id === item.scenario)
                          ?.title
                      }
                    </p>
                    <small>
                      Saved{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {item.hoursPerWeek} hours / week
                    </small>
                  </div>
                  <div className="c-saved-actions">
                    <button
                      className="c-button secondary"
                      onClick={() => {
                        onRestore(item);
                        setTab("plan");
                      }}
                    >
                      Open plan
                      <Icon as={ArrowRight} size={15} />
                    </button>
                    <button
                      className="c-icon-button"
                      aria-label={`Rename ${item.name}`}
                      onClick={() => {
                        setRenaming(item.id);
                        setRenameValue(item.name);
                      }}
                    >
                      <Icon as={PencilLine} size={16} />
                    </button>
                    <button
                      className="c-icon-button"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Icon as={Trash2} size={16} />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <EmptyState
              icon={Bookmark}
              title="A good direction is worth keeping."
              action={
                <button
                  className="c-button primary"
                  onClick={() => {
                    onSave();
                    setTab("plan");
                  }}
                >
                  Save this learning plan
                  <Icon as={Bookmark} size={16} />
                </button>
              }
            >
              Save your first plan here. You can return to it, rename it or
              compare it with another direction later.
            </EmptyState>
          )}
        </section>
      ) : (
        <>
          <section className="c-plan-banner">
            <div>
              <span className="c-status green">
                <Icon as={matchingSaved ? Check : Route} size={13} />
                {planChanged
                  ? "Unsaved plan changes"
                  : matchingSaved
                    ? "Your saved direction"
                    : "Your chosen direction"}
              </span>
              <h2>{role.title}</h2>
              <p>{role.description}</p>
              <div className="c-inline-meta">
                <span>
                  <Icon as={Clock3} size={16} />
                  {totalHours} estimated hours
                </span>
                <span>
                  <Icon as={Route} size={16} />
                  About {weeks} weeks remaining
                </span>
                <span>
                  <Icon as={BookOpen} size={16} />
                  Free learning material
                </span>
              </div>
            </div>
            <div className="c-plan-banner-right">
              <strong>
                {completed}
                <span> / {plan.length}</span>
              </strong>
              <p>steps completed</p>
              <div
                className="c-progress-meter"
                role="progressbar"
                aria-valuemin={0}
                aria-valuenow={completed}
                aria-valuemax={plan.length}
                aria-label="Learning steps completed"
              >
                <span
                  style={{
                    transform: `scaleX(${completed / Math.max(1, plan.length)})`,
                  }}
                />
              </div>
            </div>
          </section>
          <details className="c-decision-trail">
            <summary>
              Revision brief{" "}
              <span>
                {
                  revisions.filter(
                    (item) =>
                      item.profileId === profile.id && item.roleId === role.id,
                  ).length
                }{" "}
                decisions recorded
              </span>
            </summary>
            <p>
              What changed, why you kept or reverted it, and what learning
              stayed with you.
            </p>
            {revisions
              .filter(
                (item) =>
                  item.profileId === profile.id && item.roleId === role.id,
              )
              .slice(0, 5)
              .map((item) => (
                <article key={item.id}>
                  <div>
                    <strong>{item.decision}</strong>
                    <time>{new Date(item.at).toLocaleString("en-MY")}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>
                    Proposed index: {item.before} → {item.after}. Priority:{" "}
                    {item.previousPriority} → {item.priority}.
                  </p>
                  <small>
                    {item.keptSteps} existing learning steps kept ·{" "}
                    {item.completed} completed steps preserved
                  </small>
                  {item.sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title} ↗
                    </a>
                  ))}
                </article>
              ))}
            {!revisions.some(
              (item) =>
                item.profileId === profile.id && item.roleId === role.id,
            ) && (
              <p>
                No decisions recorded yet. Refresh the live evidence or change a
                scenario, then review and accept or revert the proposal.
              </p>
            )}
          </details>
          {completed === plan.length && (
            <div className="c-finish-banner">
              <Icon as={CheckCheck} size={28} />
              <div>
                <h2>Your first sprint is complete.</h2>
                <p>
                  You’ve built a record of learning. Bring your practice work
                  and questions to an adviser to agree on what comes next.
                </p>
              </div>
              <button className="c-button primary" onClick={prepareReview}>
                Review my progress
                <Icon as={ArrowRight} size={16} />
              </button>
            </div>
          )}
          <div className="c-learning-layout">
            <section>
              <div className="c-section-title">
                <div>
                  <h2>Your step-by-step pathway</h2>
                  <p>
                    Start with the foundations. Build the gaps. Put learning
                    into practice.
                  </p>
                </div>
              </div>
              <ol className="c-learning-timeline">
                {plan.map((step, index) => (
                  <LearningStep
                    key={step.id}
                    step={step}
                    index={index}
                    done={Boolean(progress[progressKey(profile, role, step)])}
                    open={expanded === step.id}
                    onExpand={() =>
                      setExpanded(expanded === step.id ? null : step.id)
                    }
                    onComplete={() => {
                      onComplete(step);
                      if (!progress[progressKey(profile, role, step)])
                        setExpanded(plan[index + 1]?.id || step.id);
                    }}
                    note={notes[progressKey(profile, role, step)]}
                    onNote={(value) => onNote(step, value)}
                    roleTitle={role.title}
                  />
                ))}
              </ol>
            </section>
            <aside className="c-learning-aside">
              <section className="c-pace-panel">
                <div className="c-section-title">
                  <h2>Make room for learning.</h2>
                  <Icon as={Clock3} size={20} />
                </div>
                <p>A small, consistent commitment is a good place to start.</p>
                <label htmlFor="learning-pace">
                  Your weekly pace
                  <select
                    id="learning-pace"
                    value={preferences.hours}
                    onChange={(event) => onPace(Number(event.target.value))}
                  >
                    {[2, 4, 6, 8].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} hours / week
                      </option>
                    ))}
                  </select>
                </label>
                <div className="c-pace-estimate">
                  <strong>{weeks} weeks</strong>
                  <span>for this introductory sprint</span>
                </div>
                <p className="c-small-note">
                  This estimates learning time, not full professional readiness.
                  All steps can be revisited.
                </p>
              </section>
              <section className="c-impact-panel">
                <span className="c-soft-icon">
                  <Icon as={Leaf} size={23} />
                </span>
                <h2>Learning with purpose.</h2>
                <p>
                  {role.sector === "Sustainability"
                    ? "Learning to work with supplier and emissions data can support more accountable business reporting."
                    : role.sector === "Clean energy"
                      ? "Developing technical skills can support safer, more reliable clean-energy systems."
                      : role.sector === "Engineering"
                        ? "Technical skills can help teams use equipment and resources more effectively."
                        : "Better data and human-reviewed workflows can support more productive, accountable work."}
                </p>
                <SdgTags targets={role.targets} />
                <small>
                  Intended contribution. Impact has not been measured.
                </small>
              </section>
              <section className="c-human-review">
                <Icon as={MessageSquare} size={23} />
                <h3>A plan is a conversation.</h3>
                <p>
                  Share your work and questions with an adviser. You stay in
                  charge of the direction.
                </p>
                <button className="c-text-button" onClick={prepareReview}>
                  Prepare my review brief
                  <Icon as={ArrowUpRight} size={15} />
                </button>
              </section>
            </aside>
          </div>
        </>
      )}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Your next chapter, ready to discuss."
        className="c-plan-review-dialog"
      >
        <div className="c-review-success">
          <Icon as={FileCheck2} size={32} />
        </div>
        <p>
          Your direction is saved on this device. Use this brief to review the
          plan with an adviser or keep it for your next learning session.
        </p>
        <div className="c-brief-summary">
          <span>YOUR DIRECTION</span>
          <h3>{role.title}</h3>
          <dl>
            <div>
              <dt>Starting point</dt>
              <dd>{profile.role}</dd>
            </div>
            <div>
              <dt>Weekly commitment</dt>
              <dd>{preferences.hours} hours</dd>
            </div>
            <div>
              <dt>Learning sprint</dt>
              <dd>
                {totalHours} hours · about {weeks} weeks
              </dd>
            </div>
            <div>
              <dt>Progress</dt>
              <dd>
                {completed} of {plan.length} steps
              </dd>
            </div>
            <div>
              <dt>Planning scenario</dt>
              <dd>{SCENARIOS.find((item) => item.id === scenario).title}</dd>
            </div>
          </dl>
          <SdgTags targets={role.targets} />
        </div>
        <div className="c-dialog-actions">
          <button className="c-button secondary" onClick={onShare}>
            Copy summary
          </button>
          <button
            className="c-button secondary"
            onClick={() => {
              setReviewOpen(false);
              setTimeout(() => window.print(), 100);
            }}
          >
            <Icon as={Printer} size={15} />
            Print / Save PDF
          </button>
          <button className="c-button primary" onClick={onExport}>
            <Icon as={Download} size={15} />
            Download brief
          </button>
        </div>
        <small className="c-small-note">
          The brief includes its sources, time estimates and prototype
          assumptions.
        </small>
      </Dialog>
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this saved plan?"
      >
        <p>
          {deleteTarget?.name} will be removed from saved plans. Your learning
          reflections and completed steps are kept.
        </p>
        <div className="c-dialog-actions">
          <button
            className="c-button secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Keep plan
          </button>
          <button
            className="c-button danger"
            onClick={() => {
              onDelete(deleteTarget.id);
              setDeleteTarget(null);
            }}
          >
            Delete saved plan
          </button>
        </div>
      </Dialog>
    </>
  );
}
