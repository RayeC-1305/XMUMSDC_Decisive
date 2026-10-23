import {
  ROLES,
  SKILLS,
  SKILL_MAP,
  SCENARIOS,
  SOURCES,
  RESOURCES,
  DEFAULT_PREFERENCES,
  SAMPLE_CVS,
} from "../data/careerCatalog";

export const STORAGE_KEY = "nexus-workspace-v2";
export function readWorkspace() {
  const initial = {
    profile: null,
    preferences: DEFAULT_PREFERENCES,
    scenario: "steady",
    selectedRoleId: null,
    saved: [],
    progress: {},
    notes: {},
    signals: [],
    evidenceRevision: null,
    shortlist: [],
    acceptedUpdates: 0,
    evidenceFeed: null,
    revisions: [],
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return [2, 3].includes(saved?.version)
      ? {
          ...initial,
          ...saved,
          preferences: { ...DEFAULT_PREFERENCES, ...saved.preferences },
          ...(saved.version === 2 ? { signals: (saved.signals || []).filter(s => s.type === "Simulation"), evidenceRevision: null, pendingChange: null, progress: migrateProgress(saved.progress || {}), notes: migrateProgress(saved.notes || {}) } : {}),
        }
      : initial;
  } catch {
    return initial;
  }
}
export function storeWorkspace(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: 3 }));
    return true;
  } catch {
    return false;
  }
}
export function skillWeight(id, signals, scenarioId) {
  const scenario =
    SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
  return (
    signals.reduce((weight, signal) => weight * (signal.impacts[id] || 1), 1) *
    (scenario.factors[id] || 1)
  );
}
function migrateProgress(entries) {
  const migrated = { ...entries };
  for (const [key, value] of Object.entries(entries)) {
    const [profile, role, step] = key.split(":");
    if (step?.startsWith("learn-")) migrated[`${profile}:shared:skill:${step.slice(6)}`] = value;
    if (step === "ai-foundations") migrated[`${profile}:shared:skill:aiLiteracy`] = value;
    if (step?.startsWith("project-")) migrated[`${profile}:${role}:portfolio:${step.slice(8)}`] = value;
  }
  return migrated;
}
export function rankRoles(profile, signals, scenarioId) {
  if (!profile) return [];
  return ROLES.map((role) => {
    const known = role.skills.filter((id) => profile.skills.includes(id));
    const gapIds = role.skills.filter((id) => !profile.skills.includes(id));
    const taskScore = Math.round(30 + (known.length / role.skills.length) * 65);
    const transferScore = Math.round(
      30 +
        (role.bridges.filter((id) => profile.skills.includes(id)).length /
          role.bridges.length) *
          65,
    );
    const demand =
      role.skills.reduce(
        (sum, id) => sum + skillWeight(id, signals, scenarioId),
        0,
      ) / role.skills.length;
    const trendScore = Math.min(96, Math.round(48 + (demand - 1) * 65));
    const score = Math.round(
      taskScore * 0.45 + transferScore * 0.3 + trendScore * 0.25,
    );
    return {
      ...role,
      known,
      gaps: gapIds
        .map((id) => SKILL_MAP[id])
        .sort(
          (a, b) =>
            skillWeight(b.id, signals, scenarioId) -
            skillWeight(a.id, signals, scenarioId),
        ),
      score,
      breakdown: [taskScore, transferScore, trendScore],
      demand,
    };
  }).sort((a, b) => b.score - a.score || b.known.length - a.known.length);
}
export function radarSkills(signals, scenarioId) {
  return SKILLS.map((skill) => {
    const weight = skillWeight(skill.id, signals, scenarioId);
    return {
      ...skill,
      weight,
      direction:
        weight > 1.08 ? "Rising" : weight < 0.95 ? "Declining" : "Steady",
    };
  }).sort((a, b) => b.weight - a.weight);
}
export function planFor(profile, role, preferences) {
  if (!profile || !role) return [];
  const steps = [
    {
      id: "ai-foundations",
      shared: true,
      title: "Build your AI foundations",
      subtitle: "A foundation worth keeping in every scenario",
      hours: 4,
      skills: ["aiLiteracy"],
      targets: ["4.4", "8.2"],
      resource: RESOURCES.ai,
      description: `Choose one familiar task${profile.tasks[0] ? `—${profile.tasks[0].toLowerCase()}` : " from your experience"}. Identify where AI could assist and where a person needs to review the result.`,
      output: "A one-page workflow map with clear human checkpoints.",
      kind: "Foundation",
    },
  ];
  role.gaps.forEach((skill, index) =>
    steps.push({
      id: `learn-${skill.id}`,
      title: `Practise ${skill.name.toLowerCase()}`,
      subtitle:
        index === 0
          ? "Your highest-priority gap in this scenario"
          : "Build the next layer of your capability",
      hours: ["carbon", "python", "sql", "automation"].includes(skill.id)
        ? 12
        : 8,
      skills: [skill.id],
      targets: skill.targets,
      resource:
        RESOURCES[skill.id] || RESOURCES[role.resourceId] || RESOURCES.general,
      description: `Work through selected learning material, then apply ${skill.name.toLowerCase()} to a fictional ${role.sector.toLowerCase()} example. Record assumptions, errors and what you would ask an adviser.`,
      output: `A small worked example demonstrating ${skill.name.toLowerCase()}, with a short explanation.`,
      kind: "Skill building",
    }),
  );
  steps.push({
    id: `project-${role.id}`,
    title:
      preferences.goal === "Prepare for a first job"
        ? "Build your first portfolio case study"
        : preferences.goal === "Grow in my current role"
          ? "Improve a workflow you already know"
          : preferences.goal === "Move into more sustainable work" ||
              preferences.priority === "Make a sustainability contribution"
            ? "Connect your practice to sustainable work"
            : "Turn learning into something you can show",
    subtitle: "Your transition portfolio",
    hours: 8,
    skills: role.skills,
    targets: role.targets,
    resource: RESOURCES[role.resourceId],
    description: `${role.project} ${preferences.goal === "Grow in my current role" ? `Relate the improvement to your current ${profile.role.toLowerCase()} work.` : preferences.goal === "Prepare for a first job" ? "Write it as a portfolio story that explains the problem, your process and what you learned." : `Shape the case study around your goal: ${preferences.goal.toLowerCase()}.`}`,
    output:
      preferences.priority === "Make a sustainability contribution"
        ? "A case study and a reasoned SDG contribution note, stating what you can and cannot measure."
        : preferences.priority === "Explore growing skill areas"
          ? `A worked example of ${role.gaps[0]?.name.toLowerCase() || "a new technical capability"}, its source context and the limits of the approach.`
          : `A case study connecting your existing ${profile.skills
              .slice(0, 2)
              .map((id) => SKILL_MAP[id]?.name.toLowerCase())
              .join(
                " and ",
              )} strengths to this direction, with sources and questions for an adviser.`,
    kind: "Practical project",
  });
  let hours = 0;
  return steps.map((step) => {
    const start = Math.floor(hours / preferences.hours) + 1;
    hours += step.hours;
    return {
      ...step,
      startWeek: start,
      endWeek: Math.ceil(hours / preferences.hours),
    };
  });
}
export const progressKey = (profile, role, step) =>
  `${profile.id}:${step.shared ? "shared" : role.id}:${step.id}`;
export function parseCvText(text, filename = "Pasted profile") {
  const clean = text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
  const lower = clean.toLowerCase();
  const lines = clean
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const recognizedSample = SAMPLE_CVS.find((sample) =>
    lower.includes(sample.name.toLowerCase()),
  );
  const skills = SKILLS.filter(
    (skill) =>
      skill.keywords.some((word) =>
        new RegExp(
          `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "i",
        ).test(clean),
      ) || lower.includes(skill.name.toLowerCase()),
  ).map((skill) => skill.id);
  const name = lines.find(
    (line) =>
      line.length < 65 &&
      /^[\p{L} .'-]+$/u.test(line) &&
      !/curriculum|resume|profile|experience|skills|education|contact/i.test(
        line,
      ),
  );
  const roleLine = lines.find(
    (line) =>
      /coordinator|analyst|technician|engineer|manager|graduate|assistant|specialist|student|administrator|developer/i.test(
        line,
      ) && line.length < 100,
  );
  const years = lower.match(/(\d{1,2})\+?\s*years?/);
  const tasks = lines
    .filter(
      (line) =>
        /^[-•]/.test(line) ||
        /coordinate|prepare|analyse|analyze|maintain|diagnose|develop|manage|reconcile|support/i.test(
          line,
        ),
    )
    .map((line) => line.replace(/^[-•]\s*/, ""))
    .filter((line) => line.length > 18 && line.length < 200)
    .slice(0, 5);
  return {
    id: recognizedSample?.id || `import-${Date.now()}`,
    name: recognizedSample?.name || name || "Your sample profile",
    role: recognizedSample?.role || roleLine || "Career explorer",
    location:
      recognizedSample?.location ||
      lines.find((line) =>
        /selangor|kuala lumpur|johor|penang|malaysia|shah alam|petaling jaya/i.test(
          line,
        ),
      ) ||
      "Malaysia",
    years: recognizedSample?.years ?? Number(years?.[1] || 0),
    education: recognizedSample?.education || "",
    skills: [...new Set([...skills, ...(recognizedSample?.skills || [])])],
    tasks: recognizedSample?.tasks || tasks,
    filename,
    importedAt: new Date().toISOString(),
  };
}
export async function extractCv(file) {
  if (file.size > 5 * 1024 * 1024)
    throw new Error(
      "This file is larger than 5 MB. Choose a smaller CV or paste its text below.",
    );
  const extension = file.name.split(".").pop().toLowerCase();
  let text;
  if (extension === "txt") text = await file.text();
  else if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const document = await pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
    }).promise;
    try {
      const pages = await Promise.all(
        Array.from(
          { length: Math.min(document.numPages, 12) },
          async (_, i) => {
            const page = await document.getPage(i + 1);
            const content = await page.getTextContent();
            return content.items
              .map((item) => item.str + (item.hasEOL ? "\n" : " "))
              .join("");
          },
        ),
      );
      text = pages.join("\n");
    } finally {
      await document.destroy();
    }
  } else if (extension === "docx") {
    const { unzipSync, strFromU8 } = await import("fflate");
    const archive = unzipSync(new Uint8Array(await file.arrayBuffer()), {
      filter: (entry) => entry.name === "word/document.xml",
    });
    if (!archive["word/document.xml"])
      throw new Error(
        "This DOCX could not be read. Export it again or paste its text below.",
      );
    const xml = new DOMParser().parseFromString(
      strFromU8(archive["word/document.xml"]),
      "application/xml",
    );
    text = Array.from(xml.getElementsByTagNameNS("*", "p"))
      .map((p) =>
        Array.from(p.getElementsByTagNameNS("*", "t"))
          .map((t) => t.textContent)
          .join(""),
      )
      .join("\n");
  } else
    throw new Error(
      "Choose a PDF, DOCX or TXT file. Older .doc files can be exported as DOCX, or you can paste the text.",
    );
  if (!text || text.trim().length < 30)
    throw new Error(
      "We couldn't find enough readable text. This may be an image-only CV. Paste the text below to continue.",
    );
  return { text, profile: parseCvText(text, file.name) };
}
export function downloadText(content, name, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportPlan(
  profile,
  role,
  preferences,
  scenario,
  plan,
  signals,
  progress,
  revisions = [],
) {
  const contents = [
    `# ${profile.name} — career transition plan`,
    `Current role: ${profile.role}\nDirection: ${role.title}\nGoal: ${preferences.goal}\nLearning focus: ${preferences.priority}\nScenario: ${SCENARIOS.find((s) => s.id === scenario).title}\nWeekly pace: ${preferences.hours} hours`,
    `Prototype match index: ${role.score}/100. Illustrative scenario output, not a probability of employment.`,
    ...plan.map(
      (step, index) =>
        `## ${index + 1}. ${step.title}\n${step.hours} estimated hours · ${step.completed ? "Completed" : `Week ${step.startWeek}–${step.endWeek}`}\n${step.description}\n\nOutput: ${step.output}\n${step.resource ? `Resource: ${step.resource.title} — ${step.resource.url}\n${step.resource.note}` : "Work sample and adviser review; no additional course required."}\nSDG targets: ${step.targets.join(", ")}\nSelf-reported completion: ${progress[progressKey(profile, role, step)] ? "complete" : "pending"}`,
    ),
    `## Evidence & assumptions`,
    ...signals.map(
      (signal) =>
        `${signal.title} | ${signal.publisher} | ${signal.dateLabel || signal.date} | ${signal.url}\n${signal.summary}${signal.retrievedAt ? `\nRetrieved: ${signal.retrievedAt} via ${signal.provider}\n${signal.mappingNote}` : ""}`,
    ),
    "## Revision brief",
    ...revisions
      .filter(
        (item) => item.profileId === profile.id && item.roleId === role.id,
      )
      .map(
        (item) =>
          `${item.at} | ${item.decision} | ${item.title}\nProposed index: ${item.before} → ${item.after}. Priority: ${item.previousPriority} → ${item.priority}. ${item.keptSteps} existing steps kept; ${item.completed} completed steps preserved.`,
      ),
    `## Score explanation\n${(role.components || []).map(c => `${c.label}: ${c.value}/100 × ${c.weight} = ${c.points} points. ${c.explanation}`).join("\n")}`,
    "## Human review\nDiscuss your evidence, readiness and next step with an adviser. Learning time is estimated; this introductory plan does not establish professional qualification, employment or measured SDG impact. Matching, forecasts and learning plans come from the connected career API using explainable rules; no generative model is claimed.",
  ].join("\n\n");
  downloadText(
    contents,
    `NexusTalent-${profile.name.replace(/[^a-z0-9]/gi, "-")}-career-plan.md`,
    "text/markdown;charset=utf-8",
  );
}
