export const SCENARIOS = [
  {
    id: "moderate",
    label: "Steady adoption",
    description: "Explore gradual changes in how teams use AI.",
  },
  {
    id: "rapid_agentic",
    label: "Faster AI adoption",
    description: "Stress-test your direction against faster automation.",
  },
  {
    id: "malaysia_green_boom",
    label: "Green transition",
    description: "Explore a stronger emphasis on sustainability skills.",
  },
];

export const RESOURCE_AI = {
  title: "Introduction to AI concepts",
  provider: "Microsoft Learn",
  url: "https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/",
  checked: "2026-10-23",
  note: "40-minute introductory module; practice time below is our estimate.",
};
export const RESOURCE_CARBON = {
  title: "Scope 3 Calculation Guidance",
  provider: "GHG Protocol",
  url: "https://ghgprotocol.org/scope-3-calculation-guidance-2",
  checked: "2026-10-23",
  note: "Public calculation guidance, published 2013. A reading resource, not a certification.",
};
export const RESOURCE_BUILDING = {
  title: "Building AI",
  provider: "Elements of AI",
  url: "https://buildingai.elementsofai.com/",
  checked: "2026-10-23",
  note: "Course content is free. An optional paid certificate is excluded.",
};

export const SDG_INFO = {
  4: [
    "Quality education",
    "Develop relevant technical skills for work.",
    "https://sdgs.un.org/goals/goal4",
  ],
  7: [
    "Affordable & clean energy",
    "Apply technical skills to cleaner energy systems.",
    "https://sdgs.un.org/goals/goal7",
  ],
  8: [
    "Decent work",
    "Support a worker-led transition and productive employment.",
    "https://sdgs.un.org/goals/goal8",
  ],
  9: [
    "Industry & innovation",
    "Use technical learning to improve industrial processes.",
    "https://sdgs.un.org/goals/goal9",
  ],
  10: [
    "Reduced inequalities",
    "Make learning and transitions more inclusive.",
    "https://sdgs.un.org/goals/goal10",
  ],
  11: [
    "Sustainable cities",
    "Connect skills to more sustainable local services.",
    "https://sdgs.un.org/goals/goal11",
  ],
  12: [
    "Responsible consumption",
    "Learn to account for resources and supply-chain impacts.",
    "https://sdgs.un.org/goals/goal12",
  ],
  13: [
    "Climate action",
    "Build skills to interpret and report climate impacts.",
    "https://sdgs.un.org/goals/goal13",
  ],
  16: [
    "Strong institutions",
    "Support accountable, human-reviewed processes.",
    "https://sdgs.un.org/goals/goal16",
  ],
  17: [
    "Partnerships",
    "Connect learning to collaborative action.",
    "https://sdgs.un.org/goals/goal17",
  ],
};

export function signalIsRetrieved(signal) {
  return signal?.ml_provenance?.ingestion_source_type === "ARXIV_LIVE_API";
}

export function safeSource(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol)
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function skillRadar(roles, signals, scenario) {
  const skills = new Map();
  roles.forEach((role) =>
    role.required_skills?.forEach((skill) => skills.set(skill.skill_id, skill)),
  );
  // Include declining input skills even if no proposed future role requires them.
  signals.forEach((signal) => {
    Object.keys(signal.skill_velocity_impacts || {}).forEach((id) => {
      if (!skills.has(id)) {
        skills.set(id, {
          skill_id: id,
          name: id.replace("skill_", "").replaceAll("_", " "),
          category: "technical",
          baseline_velocity: 1,
        });
      }
    });
  });
  // These weights are scenario assumptions, never observed vacancy-growth rates.
  return Array.from(skills.values())
    .map((skill) => {
      const weights = signals
        .map((s) => s.skill_velocity_impacts?.[skill.skill_id])
        .filter(Number.isFinite);
      let weight = weights.length
        ? weights.reduce((a, b) => a * b, 1)
        : skill.baseline_velocity || 1;
      if (scenario === "rapid_agentic") weight *= 1.45;
      if (scenario === "malaysia_green_boom" && skill.category === "green_ai")
        weight *= 1.65;
      return {
        ...skill,
        weight,
        direction:
          weight > 1.05 ? "Rising" : weight < 0.95 ? "Declining" : "Stable",
      };
    })
    .sort((a, b) => b.weight - a.weight);
}

export function makePlan(persona, role, hoursPerWeek = 4) {
  if (!role) return [];
  const strongest = [...(persona.atomic_tasks || [])]
    .filter((t) => t.is_checked !== false)
    .sort(
      (a, b) => (b.transferable_strength || 0) - (a.transferable_strength || 0),
    )[0];
  const gap = role.missing_skill_gaps?.[0];
  const carbon = /scope3|carbon|esg/.test(gap?.skill_id || "");
  const resource = carbon ? RESOURCE_CARBON : RESOURCE_BUILDING;
  const primaryTargets = role.sdg_targets?.length
    ? role.sdg_targets
    : ["SDG 8.2"];
  const steps = [
    {
      id: "foundation",
      type: "Transferable foundation",
      title: "Put your experience to work with AI",
      hours: 4,
      description: strongest
        ? `Use “${strongest.name}” as a starting point. Identify what AI could assist with and which decisions need your judgement.`
        : "Identify a familiar workflow, what AI could assist with, and where human judgement is needed.",
      deliverable: "A one-page map of one workflow and its human checkpoints.",
      resource: RESOURCE_AI,
      targets: ["SDG 4.4", "SDG 8.2"],
    },
    {
      id: `gap-${gap?.skill_id || role.role_id}`,
      type: "Your priority skill gap",
      title: gap
        ? `Explore ${gap.name}`
        : "Explore the role's technical foundations",
      hours: carbon ? 12 : 16,
      description: carbon
        ? "Read the calculation methods, then work through a supplier-emissions example using synthetic numbers."
        : `Use selected lessons to investigate how AI could support ${role.title.toLowerCase()}. This is introductory preparation; specialist training may still be needed.`,
      deliverable: carbon
        ? "A sample supplier-emissions worksheet with assumptions and source notes."
        : "An annotated example showing inputs, outputs, limitations, and a human review step.",
      resource,
      targets: gap?.sdg_targets?.length ? gap.sdg_targets : primaryTargets,
    },
    {
      id: `review-${role.role_id}`,
      type: "Evidence of learning",
      title: "Make a small piece of work you can explain",
      hours: 8,
      description: `Apply your learning to a synthetic ${role.department?.toLowerCase() || "workplace"} case. Ask an adviser to review your reasoning and agree on the next learning step.`,
      deliverable:
        "A short case study, source list, and an adviser-reviewed next step.",
      resource,
      targets: primaryTargets,
    },
  ];
  let cumulative = 0;
  return steps.map((step) => {
    const startWeek = Math.floor(cumulative / hoursPerWeek) + 1;
    cumulative += step.hours;
    return {
      ...step,
      startWeek,
      endWeek: Math.ceil(cumulative / hoursPerWeek),
    };
  });
}

export function readProgress() {
  try {
    return JSON.parse(localStorage.getItem("nexus-progress-v1")) || {};
  } catch {
    return {};
  }
}

export function exportBrief({
  persona,
  role,
  scenario,
  plan,
  signals,
  progress,
  hoursPerWeek,
}) {
  const content = [
    `# NexusTalent — transition brief`,
    `Synthetic profile: ${persona.name}\nCurrent role: ${persona.current_role}`,
    `Direction to discuss: ${role.title}\nScenario: ${SCENARIOS.find((s) => s.id === scenario)?.label}`,
    `Illustrative match index: ${role.match_score_pct}/100. A weighted model index, not a probability of employment.`,
    `Scoring: 45% task overlap + 30% adjacent skills + 25% scenario signal weight. The model and role catalog are not validated labour-market forecasts.`,
    `Learning pace: ${hoursPerWeek} hours/week. Timings are planning estimates. Public resource access is free; certificates and specialist qualifications are excluded.`,
    ...plan.map(
      (step, i) =>
        `${i + 1}. ${step.title} (${step.hours} estimated hours)\n   Output: ${step.deliverable}\n   Resource: ${step.resource.title} — ${step.resource.url}\n   Source checked: ${step.resource.checked}\n   SDGs: ${step.targets.join(", ")}\n   Self-reported completion: ${progress[`${persona.persona_id}:${role.role_id}:${step.id}`] ? "complete" : "pending"}`,
    ),
    `## Signal provenance`,
    ...signals.map(
      (s) =>
        `- ${s.title} | ${s.date} | ${signalIsRetrieved(s) ? "Retrieved research; model impact unvalidated" : "Synthetic / unverified scenario input"} | ${s.source_url}`,
    ),
    `## Before acting\nReview the role, learning gaps, and source relevance with a human adviser. This plan does not establish qualification, funding eligibility, or a hiring decision. SDG links describe intended contributions, not measured impact.`,
  ].join("\n\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/markdown;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `NexusTalent-${persona.persona_id}-transition-brief.md`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
