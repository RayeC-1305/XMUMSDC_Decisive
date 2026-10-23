import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  CheckCheck,
  ChevronRight,
  Compass,
  FileCheck2,
  FileText,
  Leaf,
  Search,
  SlidersHorizontal,
  Target,
  TrendingDown,
  TrendingUp,
  Radio,
  RefreshCw,
  Clock3,
  Route,
  X,
  Plus,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  SKILL_MAP,
  SKILLS,
  ROLES,
  SCENARIOS,
  DEMO_UPDATES,
} from "../../data/careerCatalog";
import { progressKey } from "../../utils/careerDemo";
import {
  Icon,
  PageHeading,
  SdgTags,
  EmptyState,
  Dialog,
} from "./CareerPrimitives";

export function ScenarioControl({ scenario, onChange, expanded = false }) {
  return (
    <div className={`c-scenario-control ${expanded ? "expanded" : ""}`}>
      <div>
        <Icon as={SlidersHorizontal} size={17} />
        <strong>Explore a different future</strong>
        <span>Planning scenarios, not predictions</span>
      </div>
      <div className="c-scenario-tabs" aria-label="Future scenario">
        {SCENARIOS.map((item) => (
          <button
            key={item.id}
            className={scenario === item.id ? "active" : ""}
            aria-pressed={scenario === item.id}
            title={item.description}
            onClick={() => onChange(item.id)}
          >
            {item.id === "green" && <Icon as={Leaf} size={14} />}
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
export function MatchBars({ role }) {
  return (
    <div className="c-match-bars">
      {[
        "Declared required skills",
        "Transferable strengths",
        "Research & scenario context",
      ].map((label, i) => (
        <div key={label}>
          <span>
            {label}
            <strong>
              {role.breakdown[i]}
              <small>/100</small>
            </strong>
          </span>
          <div>
            <i style={{ width: `${role.breakdown[i]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
export function Overview({
  skillOutlook,
  profile,
  preferences,
  ranked,
  selected,
  plan,
  saved,
  progress,
  signals,
  scenario,
  onNavigate,
  onSelectRole,
  onSource,
  onSave,
}) {
  const recommended = ranked[0];
  const completeCount = plan.filter(
    (step) => progress[progressKey(profile, selected, step)],
  ).length;
  const hasPlan = saved.some(
    (item) => item.profileId === profile.id && item.roleId === selected.id,
  );
  const rising = skillOutlook.slice(0, 3);
  const ready =
    plan.find((step) => !progress[progressKey(profile, selected, step)]) ||
    plan[0];
  return (
    <>
      <PageHeading
        title={
          <>
            Your next chapter, <em>{profile.name.split(" ")[0]}.</em>
          </>
        }
        description="Your skills, your possibilities, and a practical next step."
      >
        <button
          className="c-button secondary"
          onClick={() => onNavigate("profile")}
        >
          <Icon as={FileText} size={16} />
          Review profile
        </button>
      </PageHeading>
      <ol className="c-journey-strip" aria-label="Career journey">
        {[
          ["Profile", "Experience reviewed", true, "profile"],
          ["Explore", `${ranked.length} possible directions`, true, "roles"],
          [
            "Plan",
            hasPlan ? "Direction saved" : "Choose your next step",
            hasPlan,
            "pathway",
          ],
          [
            "Grow",
            `${completeCount} learning steps complete`,
            completeCount > 0,
            "pathway",
          ],
        ].map(([label, description, done, view], index) => (
          <li key={label}>
            <button onClick={() => onNavigate(view)}>
              <span className={done ? "done" : ""}>
                {done ? <Icon as={Check} size={16} /> : index + 1}
              </span>
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              <Icon as={ChevronRight} size={15} />
            </button>
          </li>
        ))}
      </ol>
      <section className="c-opportunity-banner">
        <div>
          <span className="c-status light">
            <Icon as={CheckCheck} size={14} />
            Built from your reviewed profile
          </span>
          <h2>
            Build on what
            <br />
            you already know.
          </h2>
          <p>
            Your {profile.skills.length} reviewed skills can connect to new
            opportunities. Explore where they transfer, and what to learn next.
          </p>
          <button
            className="c-button cream"
            onClick={() => onNavigate("roles")}
          >
            Explore my future roles
            <Icon as={ArrowRight} size={17} />
          </button>
        </div>
        <div className="c-career-bridge">
          <div className="c-bridge-role">
            <span>Your starting point</span>
            <strong>{profile.role}</strong>
            <small>
              {profile.years
                ? `${profile.years} years of experience`
                : "A fresh starting point"}
            </small>
          </div>
          <div className="c-bridge-line">
            <span />
            <Icon as={ArrowRight} size={17} />
            <span />
          </div>
          <div className="c-bridge-role future">
            <span>A direction to explore</span>
            <strong>{recommended.title}</strong>
            <div>
              {recommended.known.slice(0, 2).map((id) => (
                <span key={id}>
                  <Icon as={Check} size={12} />
                  {SKILL_MAP[id].name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="c-overview-grid">
        <section className="c-surface">
          <div className="c-section-title">
            <div>
              <h2>Directions worth exploring</h2>
              <p>Start with your strengths. Compare the trade-offs.</p>
            </div>
            <button
              className="c-text-button"
              onClick={() => onNavigate("roles")}
            >
              View all
              <Icon as={ArrowRight} size={15} />
            </button>
          </div>
          <div className="c-overview-roles">
            {ranked.slice(0, 3).map((role, index) => (
              <button
                className="c-overview-role"
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  onNavigate("roles");
                }}
              >
                <span
                  className={`c-role-symbol sector-${role.sector.replaceAll(" ", "-").toLowerCase()}`}
                >
                  <Icon
                    as={
                      role.sector === "Engineering"
                        ? Compass
                        : role.sector === "Sustainability" ||
                            role.sector === "Clean energy"
                          ? Leaf
                          : FileCheck2
                    }
                    size={21}
                  />
                </span>
                <span>
                  <strong>{role.title}</strong>
                  <small>
                    {role.known.length} skills to build on · {role.gaps.length}{" "}
                    gaps to explore
                  </small>
                </span>
                <span className="c-small-match">
                  <strong>{role.score}</strong>
                  <small>match index</small>
                </span>
                <Icon as={ChevronRight} size={17} />
              </button>
            ))}
          </div>
          <div className="c-surface-footnote">
            <Icon as={ShieldCheck} size={15} />
            <span>
              Illustrative matches explained by your profile and scenario.
            </span>
          </div>
        </section>
        <section className="c-surface c-next-action">
          <div className="c-section-title">
            <div>
              <h2>
                {hasPlan
                  ? "Pick up where you left off"
                  : "Your next learning step"}
              </h2>
              <p>
                {hasPlan
                  ? `${selected.title} · your learning plan`
                  : "A manageable first learning sprint."}
              </p>
            </div>
            <span className="c-soft-icon">
              <Icon as={Route} size={21} />
            </span>
          </div>
          <div className="c-next-lesson">
            <span className="c-status green">
              {hasPlan ? "Next in your plan" : "Recommended starting point"}
            </span>
            <h3>{ready.title}</h3>
            <p>{ready.output}</p>
            <div className="c-inline-meta">
              <span>
                <Icon as={Clock3} size={15} />
                {ready.hours} estimated hours
              </span>
              <span>
                <Icon as={FileText} size={15} />
                Free resource
              </span>
            </div>
          </div>
          <button
            className="c-button primary"
            onClick={() => onNavigate("pathway")}
          >
            {hasPlan ? "Continue my plan" : "Preview my learning plan"}
            <Icon as={ArrowRight} size={16} />
          </button>
        </section>
      </div>
      <section className="c-signal-summary">
        <div>
          <span className="c-soft-icon">
            <Icon as={Radio} size={22} />
          </span>
          <h2>
            The world changes.
            <br />
            Your plan can adapt.
          </h2>
          <p>
            See the evidence behind emerging skills, then explore what a
            different future could mean for your next step.
          </p>
          <button className="c-text-button" onClick={() => onNavigate("radar")}>
            Open the future skills radar
            <Icon as={ArrowUpRight} size={16} />
          </button>
        </div>
        <div className="c-mini-radar">
          {rising.map((skill) => (
            <div key={skill.id}>
              <div>
                <strong>{skill.name}</strong>
                <span>{skill.weight.toFixed(2)}×</span>
              </div>
              <div className="c-mini-track">
                <i
                  style={{
                    width: `${Math.min(100, (skill.weight / 2.5) * 100)}%`,
                  }}
                />
              </div>
              <small>Illustrative scenario weight</small>
            </div>
          ))}
        </div>
      </section>
      <section className="c-purpose-strip">
        <Icon as={Leaf} size={26} />
        <div>
          <h3>A career direction with a wider purpose.</h3>
          <p>
            Understand how your learning can connect to decent work, relevant
            skills and more sustainable practices.
          </p>
        </div>
        <SdgTags targets={["4.4", "8.5", ...selected.targets.slice(-1)]} />
      </section>
    </>
  );
}

export function RoleExplorer({
  ranked,
  selected,
  preferences,
  profile,
  onSelect,
  shortlist,
  onShortlist,
  compare,
  onCompare,
  onNavigate,
  onSave,
  onSource,
  signals,
}) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState(
    preferences.interest || "All opportunities",
  );
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const visible = ranked.filter(
    (role) =>
      (sector === "All opportunities" || role.sector === sector) &&
      (!bookmarkedOnly || shortlist.includes(role.id)) &&
      `${role.title} ${role.skills.map((id) => SKILL_MAP[id].name).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (visible.length && !visible.some((role) => role.id === selected.id))
      onSelect(visible[0].id);
  }, [visible, selected.id, onSelect]);
  return (
    <>
      <PageHeading
        title="Find your next direction."
        description="Compare possibilities, see what transfers, and choose what deserves your time."
      >
        <button
          className="c-button secondary"
          onClick={() => {
            setBookmarkedOnly(!bookmarkedOnly);
          }}
          aria-pressed={bookmarkedOnly}
        >
          <Icon as={Bookmark} size={16} />
          Shortlist <span className="c-count">{shortlist.length}</span>
        </button>
      </PageHeading>
      <div className="c-filter-bar">
        <label className="c-search">
          <Icon as={Search} size={17} />
          <input
            aria-label="Search role directions"
            placeholder="Search roles or skills"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="c-icon-button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <Icon as={X} size={15} />
            </button>
          )}
        </label>
        <label className="c-sector-filter">
          <Icon as={SlidersHorizontal} size={16} />
          <select
            aria-label="Filter by focus area"
            value={sector}
            onChange={(event) => setSector(event.target.value)}
          >
            {[
              "All opportunities",
              ...new Set(ROLES.map((role) => role.sector)),
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <span>
          {visible.length} direction{visible.length !== 1 && "s"}
        </span>
      </div>
      <div className="c-roles-layout">
        <section className="c-role-list" aria-label="Ranked future roles">
          {visible.length ? (
            visible.map((role, index) => (
              <article
                key={role.id}
                className={`c-role-list-item ${selected.id === role.id ? "selected" : ""}`}
              >
                <button
                  className="c-role-select"
                  onClick={() => onSelect(role.id)}
                  aria-pressed={selected.id === role.id}
                >
                  <span className="c-role-sector">
                    {role.sector}
                    {index === 0 &&
                      !query &&
                      !bookmarkedOnly &&
                      sector === "All opportunities" && <span>TOP MATCH</span>}
                  </span>
                  <div>
                    <h2>{role.title}</h2>
                    <span className="c-role-score">
                      {role.score}
                      <small>/100</small>
                    </span>
                  </div>
                  <p>{role.description}</p>
                  <span className="c-role-transfer">
                    <Icon as={CheckCircleIcon} size={14} />
                    {role.known.length} existing skills · {role.gaps.length}{" "}
                    gaps to build
                  </span>
                </button>
                <div className="c-role-item-actions">
                  <label>
                    <input
                      type="checkbox"
                      checked={compare.includes(role.id)}
                      disabled={
                        compare.length === 3 && !compare.includes(role.id)
                      }
                      onChange={() => onCompare(role.id)}
                    />
                    Compare
                  </label>
                  <button
                    className={`c-icon-button ${shortlist.includes(role.id) ? "bookmarked" : ""}`}
                    aria-label={`${shortlist.includes(role.id) ? "Remove" : "Save"} ${role.title} ${shortlist.includes(role.id) ? "from" : "to"} shortlist`}
                    aria-pressed={shortlist.includes(role.id)}
                    onClick={() => onShortlist(role.id)}
                  >
                    <Icon
                      as={Bookmark}
                      size={17}
                      fill={
                        shortlist.includes(role.id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              icon={Search}
              title={
                bookmarkedOnly
                  ? "Your shortlist is ready for a first direction."
                  : "No directions match these filters."
              }
              action={
                <button
                  className="c-button secondary"
                  onClick={() => {
                    setQuery("");
                    setSector("All opportunities");
                    setBookmarkedOnly(false);
                  }}
                >
                  Show all directions
                </button>
              }
            >
              {bookmarkedOnly
                ? "Save a role with the bookmark button to keep it here."
                : "Try a broader search or choose another focus area."}
            </EmptyState>
          )}
        </section>
        {visible.length > 0 && (
          <section className="c-role-detail" aria-label="Selected role details">
            <div className="c-detail-topline">
              <span className="c-status green">{selected.sector}</span>
              <span>Illustrative role profile</span>
            </div>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <div className="c-detail-match">
              <strong>
                {selected.score}
                <span>/100</span>
              </strong>
              <div>
                <h3>Profile match index</h3>
                <p>
                  A starting point for a conversation, not a hiring probability.
                </p>
              </div>
            </div>
            <MatchBars role={selected} />
            <p className="c-formula-note">
              45% declared required skills + 30% transferable strengths + 25%
              research and scenario context.
            </p>
            {selected.components && <div className="c-score-reasons">{selected.components.map(component => <p key={component.id}><strong>{component.label}: {component.points} points.</strong> {component.explanation}</p>)}<p>Evidence changed this index by {selected.evidenceImpact.scoreDelta >= 0 ? "+" : ""}{selected.evidenceImpact.scoreDelta} points against the same scenario without research.</p></div>}
            <div className="c-detail-section">
              <h3>Your head start</h3>
              <p>Experience you can bring into this direction.</p>
              <div className="c-skill-tags">
                {selected.known.length ? (
                  selected.known.map((id) => (
                    <span className="known" key={id}>
                      <Icon as={Check} size={13} />
                      {SKILL_MAP[id].name}
                    </span>
                  ))
                ) : (
                  <span>
                    Your reviewed experience provides context. Explore the
                    foundational skills below.
                  </span>
                )}
              </div>
            </div>
            <div className="c-detail-section">
              <h3>Skills to build next</h3>
              <div className="c-detail-gaps">
                {selected.gaps.length ? (
                  selected.gaps.map((skill, index) => (
                    <div key={skill.id}>
                      <span className="c-gap-order">{index + 1}</span>
                      <span>
                        <strong>{skill.name}</strong>
                        <small>
                          {index === 0
                            ? "Priority in the current scenario"
                            : "Build through learning and practice"}
                        </small>
                        <SdgTags targets={skill.targets} compact />
                      </span>
                      <Icon as={Plus} size={14} />
                    </div>
                  ))
                ) : (
                  <p>
                    No gaps in this small catalog. An adviser should still
                    review readiness.
                  </p>
                )}
              </div>
            </div>
            <div className="c-detail-section">
              <h3>Purpose beyond the role</h3>
              <SdgTags targets={selected.targets} />
              <p>
                These are intended links to global goals, not measured impact.
              </p>
            </div>
            <button
              className="c-source-inline"
              onClick={() =>
                onSource(
                  signals.find((source) => source.id === selected.sourceId) ||
                    signals[0],
                )
              }
            >
              <Icon as={FileCheck2} size={18} />
              <span>
                <strong>See the evidence and assumptions</strong>
                <small>Source context, publication date and limitations</small>
              </span>
              <Icon as={ArrowUpRight} size={17} />
            </button>
            <button
              className="c-button primary c-wide"
              onClick={() => onNavigate("pathway")}
            >
              Build a pathway for this role
              <Icon as={ArrowRight} size={16} />
            </button>
          </section>
        )}
      </div>
      {compare.length > 0 && (
        <div className="c-compare-tray">
          <span>
            <Icon as={Compass} size={19} />
            <strong>
              {compare.length} direction{compare.length > 1 ? "s" : ""} selected
            </strong>
            <small>Choose up to 3 to compare</small>
          </span>
          <button
            className="c-button primary"
            disabled={compare.length < 2}
            onClick={() => onNavigate("compare")}
          >
            Compare directions
            <Icon as={ArrowRight} size={16} />
          </button>
        </div>
      )}
    </>
  );
}
function CheckCircleIcon(props) {
  return <CheckCheck {...props} />;
}

export function CompareRoles({
  roles,
  profile,
  preferences,
  onSelect,
  onNavigate,
  onRemove,
  signals,
  onSource,
}) {
  return (
    <>
      <PageHeading
        title="Compare your possibilities."
        description="A side-by-side view of what you bring, what you would learn, and how much time to set aside."
      >
        <button
          className="c-button secondary"
          onClick={() => onNavigate("roles")}
        >
          Back to directions
        </button>
      </PageHeading>
      {roles.length < 2 ? (
        <EmptyState
          icon={Compass}
          title="Choose at least two directions to compare."
          action={
            <button
              className="c-button primary"
              onClick={() => onNavigate("roles")}
            >
              Explore roles
              <Icon as={ArrowRight} size={16} />
            </button>
          }
        >
          Your comparison helps you weigh the choices before committing to a
          plan.
        </EmptyState>
      ) : (
        <div className={`c-comparison-grid columns-${roles.length}`}>
          {roles.map((role) => {
            const plan = role.plan;
            const hours = plan.reduce((sum, step) => sum + step.hours, 0);
            return (
              <article className="c-comparison-column" key={role.id}>
                <button
                  className="c-icon-button c-remove-compare"
                  aria-label={`Remove ${role.title} from comparison`}
                  onClick={() => onRemove(role.id)}
                >
                  <Icon as={X} size={16} />
                </button>
                <span className="c-status green">{role.sector}</span>
                <h2>{role.title}</h2>
                <p>{role.description}</p>
                <div className="c-comparison-cell">
                  <h3>Profile match</h3>
                  <strong className="c-comparison-score">
                    {role.score}
                    <small>/100</small>
                  </strong>
                  <MatchBars role={role} />
                </div>
                <div className="c-comparison-cell">
                  <h3>Your existing strengths</h3>
                  <div className="c-skill-tags">
                    {role.known.length ? (
                      role.known.map((id) => (
                        <span className="known" key={id}>
                          {SKILL_MAP[id].name}
                        </span>
                      ))
                    ) : (
                      <span>Start with the foundations.</span>
                    )}
                  </div>
                </div>
                <div className="c-comparison-cell">
                  <h3>Priority skill gaps</h3>
                  <ul>
                    {role.gaps.slice(0, 3).map((skill) => (
                      <li key={skill.id}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="c-comparison-cell">
                  <h3>First learning sprint</h3>
                  <strong>
                    {hours} hours{" "}
                    <small>
                      · about {Math.ceil(hours / preferences.hours)} weeks
                    </small>
                  </strong>
                  <p>
                    At {preferences.hours} hours a week, using free public
                    resources.
                  </p>
                </div>
                <div className="c-comparison-cell">
                  <h3>Intended contribution</h3>
                  <SdgTags targets={role.targets} />
                </div>
                <button
                  className="c-text-button"
                  onClick={() =>
                    onSource(
                      signals.find((item) => item.id === role.sourceId) ||
                        signals[0],
                    )
                  }
                >
                  Review source context
                  <Icon as={ArrowUpRight} size={15} />
                </button>
                <button
                  className="c-button primary c-wide"
                  onClick={() => {
                    onSelect(role.id);
                    onNavigate("pathway");
                  }}
                >
                  Choose this direction
                  <Icon as={ArrowRight} size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}
      <p className="c-page-footnote">
        Comparisons use the same profile and scenario. Scores and time estimates
        are illustrative, and do not establish job readiness.
      </p>
    </>
  );
}

export function RadarView({
  signals,
  scenario,
  onScenario,
  onSource,
  onUpdate,
  updateCount,
  profile,
  onAddSignal,
  onRefreshEvidence,
  evidenceFeed,
  evidenceBusy,
  evidenceError,
  skillOutlook,
}) {
  const [tab, setTab] = useState("all");
  const [sourceTab, setSourceTab] = useState("All sources");
  const [newSignal, setNewSignal] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    publisher: "",
    url: "",
    date: "2026-10-23",
    skill: "aiLiteracy",
    weight: "1.2",
  });
  const [error, setError] = useState("");
  const skills = skillOutlook;
  const visibleSkills = skills.filter(
    (skill) => tab === "all" || skill.direction.toLowerCase() === tab,
  );
  const visibleSources = signals.filter(
    (source) => sourceTab === "All sources" || source.type === sourceTab,
  );
  function addSignal(event) {
    event.preventDefault();
    try {
      const url = new URL(draft.url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      setError("Use a complete http or https source URL.");
      return;
    }
    onAddSignal({
      id: `custom-${Date.now()}`,
      title: draft.title,
      publisher: draft.publisher,
      date: draft.date,
      type: "Simulation",
      url: draft.url,
      summary:
        "Added by the user for scenario testing. The source and impact have not been verified; the selected weight is a user assumption.",
      impacts: { [draft.skill]: Number(draft.weight) },
      reviewed: "2026-10-23",
    });
    setNewSignal(false);
    setError("");
  }
  return (
    <>
      <PageHeading
        title="Make sense of what’s changing."
        description="Explore skill signals, inspect the evidence, and see what a shift could mean for your next step."
      >
        <button
          className="c-button secondary"
          onClick={() => setNewSignal(true)}
        >
          <Icon as={Plus} size={16} />
          Add a signal
        </button>
        <button
          className="c-button secondary"
          disabled={updateCount >= DEMO_UPDATES.length}
          onClick={onUpdate}
        >
          <Icon as={RefreshCw} size={16} />
          {updateCount >= DEMO_UPDATES.length
            ? "Demo signals up to date"
            : "Preview a signal update"}
        </button>
      </PageHeading>
      <section className="c-live-evidence" aria-busy={evidenceBusy}>
        <div>
          <span className="c-status green">Refreshable research</span>
          <h2>Real sources. A reviewable plan.</h2>
          <p>
            Fetch recent AI-and-workforce publication metadata from Crossref. We
            show the publication date, retrieval time and the local rules that
            connect it to skills.
          </p>
          <small>
            {evidenceFeed
              ? `${evidenceFeed.count} publications · ${evidenceFeed.status} evidence${evidenceFeed.retrievedAt ? ` · Retrieved ${new Date(evidenceFeed.retrievedAt).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })}` : " · Neutral research weights"}`
              : "No retrieved evidence yet. Refresh to check the public research feed."}
          </small>
        </div>
        <button
          className="c-button primary"
          disabled={evidenceBusy}
          onClick={onRefreshEvidence}
        >
          <Icon
            as={RefreshCw}
            className={evidenceBusy ? "c-spin" : ""}
            size={17}
          />
          {evidenceBusy ? "Fetching live research…" : "Refresh live evidence"}
        </button>
        {evidenceError && (
          <div className="c-inline-error" role="alert">
            {evidenceError}
          </div>
        )}
        <p className="c-live-limit">
          Research provides context, not Malaysian vacancy counts. Mapping
          weights are transparent model assumptions. The research publisher
          receives no CV or profile details.
        </p>
      </section>
      <ScenarioControl scenario={scenario} onChange={onScenario} expanded />
      <div className="c-radar-layout">
        <section className="c-surface c-radar-table">
          <div className="c-section-title">
            <div>
              <h2>Your future skills radar</h2>
              <p>Relative skill emphasis in the selected planning scenario.</p>
            </div>
            <Icon as={Radio} size={23} />
          </div>
          <div className="c-filter-pills" aria-label="Skill direction">
            {[
              ["all", "All skills"],
              ["rising", "Rising"],
              ["steady", "Steady"],
              ["declining", "Declining"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={tab === id ? "active" : ""}
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
              >
                {label}
                <span>
                  {id === "all"
                    ? skills.length
                    : skills.filter(
                        (skill) => skill.direction.toLowerCase() === id,
                      ).length}
                </span>
              </button>
            ))}
          </div>
          <div className="c-radar-table-head">
            <span>Skill & contribution</span>
            <span>Scenario weight</span>
            <span>Direction</span>
          </div>
          {visibleSkills.length ? (
            visibleSkills.map((skill) => (
              <div className="c-radar-table-row" key={skill.id}>
                <div>
                  <strong>
                    {skill.name}
                    {profile.skills.includes(skill.id) && (
                      <span className="c-you-have">You have this</span>
                    )}
                  </strong>
                  <SdgTags targets={skill.targets} compact />
                </div>
                <div className="c-radar-weight">
                  <div>
                    <i
                      style={{
                        width: `${Math.min(100, (skill.weight / 3) * 100)}%`,
                      }}
                    />
                  </div>
                  <span>{skill.weight.toFixed(2)}×</span>
                </div>
                <span
                  className={`c-direction ${skill.direction.toLowerCase()}`}
                >
                  <Icon
                    as={
                      skill.direction === "Declining"
                        ? TrendingDown
                        : skill.direction === "Rising"
                          ? TrendingUp
                          : ArrowRight
                    }
                    size={14}
                  />
                  {skill.direction}
                </span>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Radio}
              title="No skills in this category."
              action={
                <button className="c-text-button" onClick={() => setTab("all")}>
                  See all skills
                  <Icon as={ArrowRight} size={15} />
                </button>
              }
            >
              A different scenario can change the emphasis.
            </EmptyState>
          )}
          <p className="c-formula-note">
            1.00× is the reference weight. These multipliers are prototype
            assumptions, not measured changes in vacancies.
          </p>
        </section>
        <aside className="c-radar-explainer">
          <span className="c-soft-icon">
            <Icon as={Compass} size={27} />
          </span>
          <h2>Signals help you ask better questions.</h2>
          <p>
            They don’t determine your future. Use them to explore where your
            experience could stay useful and which capabilities are worth
            adding.
          </p>
          <div>
            <strong>Research</strong>
            <p>What technology could do.</p>
            <strong>Labour-market context</strong>
            <p>What employers say is changing.</p>
            <strong>Your experience</strong>
            <p>What you bring to a new direction.</p>
          </div>
          <span className="c-status amber">Scenario weights are simulated</span>
        </aside>
      </div>
      <section className="c-evidence-library">
        <div className="c-section-title">
          <div>
            <h2>Evidence you can inspect.</h2>
            <p>Published context and clearly labelled scenario inputs.</p>
          </div>
          <span className="c-count">{signals.length} sources</span>
        </div>
        <div className="c-filter-pills">
          {[
            "All sources",
            "Research",
            "Labour market",
            "Framework",
            "Simulation",
          ].map((type) => (
            <button
              key={type}
              aria-pressed={sourceTab === type}
              className={sourceTab === type ? "active" : ""}
              onClick={() => setSourceTab(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="c-source-list">
          {visibleSources.map((source) => (
            <button
              key={source.id}
              className="c-evidence-row"
              onClick={() => onSource(source)}
            >
              <span
                className={`c-source-symbol ${source.type === "Simulation" ? "simulation" : ""}`}
              >
                <Icon
                  as={
                    source.type === "Research"
                      ? FileText
                      : source.type === "Simulation"
                        ? SlidersHorizontal
                        : source.type === "Framework"
                          ? Leaf
                          : Radio
                  }
                  size={22}
                />
              </span>
              <span>
                <span
                  className={`c-status ${source.type === "Simulation" ? "amber" : "green"}`}
                >
                  {source.retrieval === "live" ? "Live research" : source.type}
                </span>
                <strong>{source.title}</strong>
                <small>
                  {source.publisher} · {source.dateLabel || source.date}
                  {source.retrievedAt
                    ? ` · Retrieved ${new Date(source.retrievedAt).toLocaleDateString("en-MY")}`
                    : ""}
                </small>
              </span>
              <Icon as={ArrowUpRight} size={18} />
            </button>
          ))}
        </div>
        <p className="c-page-footnote">
          Live research is retrieved on demand from Crossref. Curated sources
          and simulated inputs remain separately labelled. Publication metadata
          is not a verified employment forecast.
        </p>
      </section>
      <Dialog
        open={newSignal}
        onClose={() => setNewSignal(false)}
        title="Add a scenario signal"
      >
        <p>
          Attach a source and choose an illustrative impact. It will be labelled
          as an unverified simulation.
        </p>
        <form className="c-signal-form" onSubmit={addSignal}>
          {error && (
            <div className="c-inline-error" role="alert">
              {error}
            </div>
          )}
          <label>
            Signal title
            <input
              required
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
              placeholder="What has changed?"
              maxLength={140}
            />
          </label>
          <label>
            Publisher
            <input
              required
              value={draft.publisher}
              onChange={(event) =>
                setDraft({ ...draft, publisher: event.target.value })
              }
              placeholder="Source organisation"
            />
          </label>
          <label>
            Source URL
            <input
              required
              type="url"
              value={draft.url}
              onChange={(event) =>
                setDraft({ ...draft, url: event.target.value })
              }
              placeholder="https://…"
            />
          </label>
          <div className="c-form-grid">
            <label>
              Source date
              <input
                required
                type="date"
                max="2026-10-23"
                value={draft.date}
                onChange={(event) =>
                  setDraft({ ...draft, date: event.target.value })
                }
              />
            </label>
            <label>
              Illustrative weight
              <select
                value={draft.weight}
                onChange={(event) =>
                  setDraft({ ...draft, weight: event.target.value })
                }
              >
                {[0.6, 0.8, 1.1, 1.2, 1.4, 1.6].map((weight) => (
                  <option key={weight} value={weight}>
                    {weight.toFixed(2)}×
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Affected skill
            <select
              value={draft.skill}
              onChange={(event) =>
                setDraft({ ...draft, skill: event.target.value })
              }
            >
              {SKILLS.map((skill) => (
                <option value={skill.id} key={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </label>
          <div className="c-dialog-actions">
            <button
              className="c-button secondary"
              type="button"
              onClick={() => setNewSignal(false)}
            >
              Cancel
            </button>
            <button className="c-button primary" type="submit">
              Add signal & review changes
              <Icon as={ArrowRight} size={16} />
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
