/**
 * NexusTalent 360 - Client-Side Personalized Reskilling & SDG Motivation Engine
 * XMUM SDC Hackathon 2026 - Domain 1: The Aiversecity Future-Ready Workforce Domain
 */

export function generatePersonalizedReskillingPathway(workerPersona, targetRole, activeSignals = [], isGreenPivotActive = false) {
  if (!targetRole) {
    return null;
  }

  const tasks = workerPersona?.atomic_tasks || [];
  const candidateName = workerPersona?.name || "Candidate";

  // Identify worker's dominant capability domains from atomic tasks
  const hasPedagogy = tasks.some(t => 
    t.category?.includes("pedagogy") || 
    t.category?.includes("equity") || 
    t.name?.toLowerCase().includes("instruction") || 
    t.name?.toLowerCase().includes("student") || 
    t.name?.toLowerCase().includes("teach") ||
    t.name?.toLowerCase().includes("learning") ||
    t.name?.toLowerCase().includes("trauma")
  );
  const hasMediation = tasks.some(t => 
    t.category?.includes("mediation") || 
    t.name?.toLowerCase().includes("stakeholder") || 
    t.name?.toLowerCase().includes("dispute") || 
    t.name?.toLowerCase().includes("dialogue") ||
    t.name?.toLowerCase().includes("vendor")
  );
  const hasDiagnostic = tasks.some(t => 
    t.category?.includes("diagnostic") || 
    t.name?.toLowerCase().includes("obd") || 
    t.name?.toLowerCase().includes("troubleshoot") || 
    t.name?.toLowerCase().includes("multimeter") ||
    t.name?.toLowerCase().includes("sensor")
  );
  const hasRoutineClerical = tasks.some(t => 
    t.category?.includes("routine") || 
    t.is_at_risk || 
    t.name?.toLowerCase().includes("data entry") || 
    t.name?.toLowerCase().includes("filing") || 
    t.name?.toLowerCase().includes("invoice") ||
    t.name?.toLowerCase().includes("spreadsheets")
  );
  const hasAccounting = tasks.some(t => 
    t.category?.includes("accounting") || 
    t.name?.toLowerCase().includes("ledger") || 
    t.name?.toLowerCase().includes("reconciliation") || 
    t.name?.toLowerCase().includes("erp")
  );

  // Find candidate's highest transferability atomic task to anchor the bridge
  const strongestTask = [...tasks].sort((a, b) => (b.transferable_strength || 0) - (a.transferable_strength || 0))[0] || {
    name: "Cross-Functional Professional Communication & Problem Solving",
    category: "human_collaboration"
  };

  const modules = [];

  // =========================================================================
  // MODULE 1: THE TRANSFERABLE KEYSTONE BRIDGE (Leverages exact atomic skill)
  // =========================================================================
  if (hasPedagogy) {
    modules.push({
      step: 1,
      module_id: "MOD-BRIDGE-PEDAGOGY",
      module_type: "TRANSFERABLE_KEYSTONE_BRIDGE",
      badge_tag: "⭐ Transfer Bridge",
      title: "Human-in-the-Loop AI Feedback & RLHF Alignment",
      provider: "DeepLearning.AI & Coursera (Free Audit Available)",
      provider_url: "https://www.coursera.org/learn/generative-ai-with-large-language-models",
      duration_weeks: 3,
      duration_hours: 18,
      duration_label: "3 weeks (18 hours)",
      cost: "RM 0 / Free",
      is_free: true,
      is_hrd_corp: false,
      leveraged_atomic_task: strongestTask.name,
      bridge_narrative: `Directly leverages your proven expertise in "${strongestTask.name}" to calibrate AI evaluation rubrics, detect subtle hallucinations, and train alignment models through structured human feedback.`,
      skills_bridged: ["skill_vendor_mediation", "skill_agentic_sql"],
      sdg_targets: ["SDG 4.4", "SDG 8.2", "SDG 10.2"],
      sdg_labels: ["SDG 4: Quality Education", "SDG 8: Decent Work", "SDG 10: Reduced Inequalities"],
      milestone_badge: {
        id: "badge_rlhf_evaluator",
        title: "Human-in-the-Loop AI Evaluator",
        icon: "🏅",
        color: "emerald",
        tier: "Keystone Transfer",
        criteria: "Demonstrate rubric-based calibration of generative AI outputs for accessibility and bias."
      },
      xp_awarded: 250
    });
  } else if (hasRoutineClerical || hasAccounting) {
    modules.push({
      step: 1,
      module_id: "MOD-BRIDGE-ACCOUNTING",
      module_type: "TRANSFERABLE_KEYSTONE_BRIDGE",
      badge_tag: "⭐ Transfer Bridge",
      title: "Automated Data Pipelines: From Excel to Python & Agentic SQL",
      provider: "MDEC Digital Skills Directory & Coursera (Free)",
      provider_url: "https://mdec.my/digital-skills-directory",
      duration_weeks: 4,
      duration_hours: 24,
      duration_label: "4 weeks (24 hours)",
      cost: "RM 0 / Free",
      is_free: true,
      is_hrd_corp: false,
      leveraged_atomic_task: strongestTask.name,
      bridge_narrative: `Translates your structured audit discipline from "${strongestTask.name}" into automated Python/SQL extraction pipelines, replacing manual entry with high-velocity data verification.`,
      skills_bridged: ["skill_manual_data_entry", "skill_agentic_sql"],
      sdg_targets: ["SDG 8.2", "SDG 9.5"],
      sdg_labels: ["SDG 8: Decent Work", "SDG 9: Industry & Innovation"],
      milestone_badge: {
        id: "badge_agentic_data",
        title: "Automated Pipeline Architect",
        icon: "📊",
        color: "blue",
        tier: "Keystone Transfer",
        criteria: "Deploy automated parsing scripts connecting transactional spreadsheets into relational ledgers."
      },
      xp_awarded: 250
    });
  } else if (hasDiagnostic) {
    modules.push({
      step: 1,
      module_id: "MOD-BRIDGE-DIAGNOSTIC",
      module_type: "TRANSFERABLE_KEYSTONE_BRIDGE",
      badge_tag: "⭐ Transfer Bridge",
      title: "CAN-Bus Network Telematics & High-Voltage (NFPA 70E) Safety Isolation",
      provider: "MARii / Malaysia Automotive, Robotics & IoT Institute",
      provider_url: "https://www.marii.my/human-capital-development",
      duration_weeks: 2,
      duration_hours: 20,
      duration_label: "2 weeks (20 hours)",
      cost: "HRD Corp Claimable (RM 0 Out-of-Pocket)",
      is_free: false,
      is_hrd_corp: true,
      leveraged_atomic_task: strongestTask.name,
      bridge_narrative: `Expands your oscilloscope and multimeter troubleshooting in "${strongestTask.name}" into CAN bus network packet decoding and high-voltage electrical safety standards.`,
      skills_bridged: ["skill_can_bus_diagnostics", "skill_grid_safety"],
      sdg_targets: ["SDG 7.1", "SDG 9.4"],
      sdg_labels: ["SDG 7: Affordable Clean Energy", "SDG 9: Industry & Infrastructure"],
      milestone_badge: {
        id: "badge_canbus_telematics",
        title: "High-Voltage Telematics Diagnostician",
        icon: "⚡",
        color: "amber",
        tier: "Keystone Transfer",
        criteria: "Verify LOTO isolation protocols and decode CAN bus telemetry streams."
      },
      xp_awarded: 250
    });
  } else {
    modules.push({
      step: 1,
      module_id: "MOD-BRIDGE-COLLAB",
      module_type: "TRANSFERABLE_KEYSTONE_BRIDGE",
      badge_tag: "⭐ Transfer Bridge",
      title: "Ethical Workplace Mediation & Multi-Stakeholder Dialogue",
      provider: "Malaysian Institute of Arbitrators & HRD Corp Claimable",
      provider_url: "https://www.miarb.com/training-courses/",
      duration_weeks: 3,
      duration_hours: 20,
      duration_label: "3 weeks (20 hours)",
      cost: "HRD Corp Claimable (RM 0 Out-of-Pocket)",
      is_free: false,
      is_hrd_corp: true,
      leveraged_atomic_task: strongestTask.name,
      bridge_narrative: `Channels your proven collaborative strength in "${strongestTask.name}" into structured consensus building, supplier transition mediation, and conflict de-escalation.`,
      skills_bridged: ["skill_vendor_mediation", "skill_ethical_investigation"],
      sdg_targets: ["SDG 8.5", "SDG 10.2"],
      sdg_labels: ["SDG 8: Decent Work", "SDG 10: Reduced Inequalities"],
      milestone_badge: {
        id: "badge_stakeholder_mediator",
        title: "Multi-Stakeholder Consensus Mediator",
        icon: "🤝",
        color: "purple",
        tier: "Keystone Transfer",
        criteria: "Mediate cross-departmental transition roadblocks with zero grievance escalation."
      },
      xp_awarded: 250
    });
  }

  // =========================================================================
  // MODULE 2: HIGH-VELOCITY TECHNICAL GAP (Closes primary deficit for role)
  // =========================================================================
  const primaryGap = (targetRole.missing_skill_gaps && targetRole.missing_skill_gaps[0]) || {
    skill_id: "skill_scope3_carbon",
    name: "Scope 3 Carbon Accounting & GHG Protocol",
    velocity: 1.45,
    category: "green_ai"
  };

  if (primaryGap.skill_id === "skill_scope3_carbon" || primaryGap.skill_id?.includes("carbon") || primaryGap.skill_id?.includes("esg")) {
    modules.push({
      step: 2,
      module_id: "MOD-GAP-SCOPE3",
      module_type: "CORE_SKILL_GAP",
      badge_tag: "🛡️ Core Technical Gap",
      title: "Corporate GHG Accounting & Scope 3 Value Chain Certification",
      provider: "Malaysian Green Technology and Climate Change Corporation (MGTC)",
      provider_url: "https://www.mgtc.gov.my/services/capacity-building/",
      duration_weeks: 4,
      duration_hours: 32,
      duration_label: "4 weeks (32 hours)",
      cost: "HRD Corp Claimable (RM 0 Out-of-Pocket)",
      is_free: false,
      is_hrd_corp: true,
      leveraged_atomic_task: `Closing identified gap: ${primaryGap.name}`,
      bridge_narrative: `Master standardized ISO 14064, GHG Protocol Scope 3 (Categories 1-15) carbon modeling, and supplier footprint calculations required for ${targetRole.title}.`,
      skills_bridged: ["skill_scope3_carbon", "skill_esg_governance"],
      sdg_targets: ["SDG 12.6", "SDG 13.2"],
      sdg_labels: ["SDG 12: Responsible Consumption", "SDG 13: Climate Action"],
      milestone_badge: {
        id: "badge_scope3_auditor",
        title: "Scope 3 Carbon Value Chain Auditor",
        icon: "🛡️",
        color: "emerald",
        tier: "Core Technical Master",
        criteria: "Audit multi-tier supplier invoice emission ledgers with 95% compliance accuracy."
      },
      xp_awarded: 350
    });
  } else if (primaryGap.skill_id === "skill_edge_ai" || primaryGap.skill_id?.includes("edge")) {
    modules.push({
      step: 2,
      module_id: "MOD-GAP-EDGEAI",
      module_type: "CORE_SKILL_GAP",
      badge_tag: "🧠 Core Technical Gap",
      title: "TinyML: Practical Deep Learning on Microcontrollers",
      provider: "HarvardX & edX (Free Audit Available)",
      provider_url: "https://www.edx.org/learn/tinyml/harvard-university-applications-of-tinyml",
      duration_weeks: 6,
      duration_hours: 36,
      duration_label: "6 weeks (36 hours)",
      cost: "RM 0 / Free",
      is_free: true,
      is_hrd_corp: false,
      leveraged_atomic_task: `Closing identified gap: ${primaryGap.name}`,
      bridge_narrative: `Deploy quantized TensorFlow Lite for Microcontrollers models on ARM Cortex hardware for real-time vibration, acoustic, and thermal anomaly triage.`,
      skills_bridged: ["skill_edge_ai", "skill_predictive_maintenance"],
      sdg_targets: ["SDG 7.2", "SDG 9.4"],
      sdg_labels: ["SDG 7: Clean Energy", "SDG 9: Industry & Innovation"],
      milestone_badge: {
        id: "badge_tinyml_edge",
        title: "TinyML Edge Systems Specialist",
        icon: "🧠",
        color: "cyan",
        tier: "Core Technical Master",
        criteria: "Compile and run a quantized neural anomaly detector under 64KB RAM constraints."
      },
      xp_awarded: 350
    });
  } else if (primaryGap.skill_id?.includes("battery") || primaryGap.skill_id?.includes("ev")) {
    modules.push({
      step: 2,
      module_id: "MOD-GAP-BATTERY",
      module_type: "CORE_SKILL_GAP",
      badge_tag: "🔋 Core Technical Gap",
      title: "High-Voltage Electric Vehicle Safety & Battery Diagnostics (Level 3)",
      provider: "MARii & HRD Corp Claimable",
      provider_url: "https://www.marii.my/human-capital-development",
      duration_weeks: 3,
      duration_hours: 40,
      duration_label: "3 weeks (40 hours)",
      cost: "HRD Corp Claimable (RM 0 Out-of-Pocket)",
      is_free: false,
      is_hrd_corp: true,
      leveraged_atomic_task: `Closing identified gap: ${primaryGap.name}`,
      bridge_narrative: `Learn electrochemical State-of-Health (SoH) diagnostics, internal impedance testing, battery pack cell balancing, and safe emergency discharge.`,
      skills_bridged: ["skill_ev_battery_triage", "skill_grid_safety"],
      sdg_targets: ["SDG 9.4", "SDG 11.2", "SDG 12.5"],
      sdg_labels: ["SDG 9: Innovation", "SDG 11: Sustainable Cities", "SDG 12: Circular Battery Recycling"],
      milestone_badge: {
        id: "badge_ev_battery",
        title: "EV Battery State-of-Health Diagnostician",
        icon: "🔋",
        color: "amber",
        tier: "Core Technical Master",
        criteria: "Perform battery pack impedance spectroscopy and second-life triage certification."
      },
      xp_awarded: 350
    });
  } else if (primaryGap.skill_id?.includes("ros2") || primaryGap.skill_id?.includes("robot")) {
    modules.push({
      step: 2,
      module_id: "MOD-GAP-ROS2",
      module_type: "CORE_SKILL_GAP",
      badge_tag: "🤖 Core Technical Gap",
      title: "Robot Operating System (ROS 2) for Industrial Cobots",
      provider: "MDEC Digital Skills Directory & Robopreneur Academy",
      provider_url: "https://mdec.my/digital-skills-directory",
      duration_weeks: 6,
      duration_hours: 45,
      duration_label: "6 weeks (45 hours)",
      cost: "HRD Corp Claimable (RM 0 Out-of-Pocket)",
      is_free: false,
      is_hrd_corp: true,
      leveraged_atomic_task: `Closing identified gap: ${primaryGap.name}`,
      bridge_narrative: `Program ROS 2 Humble nodes, multi-axis cobot arm trajectory planning, and energy-optimal cleanroom motion cycles.`,
      skills_bridged: ["skill_ros2_robotics", "skill_clean_automation"],
      sdg_targets: ["SDG 8.2", "SDG 9.2"],
      sdg_labels: ["SDG 8: Decent Work", "SDG 9: Industry & Infrastructure"],
      milestone_badge: {
        id: "badge_ros2_cobots",
        title: "ROS 2 Collaborative Robotics Architect",
        icon: "🤖",
        color: "rose",
        tier: "Core Technical Master",
        criteria: "Deploy a smooth multi-axis trajectory avoiding collision with human coworkers."
      },
      xp_awarded: 350
    });
  } else {
    modules.push({
      step: 2,
      module_id: "MOD-GAP-AGENTICSQL",
      module_type: "CORE_SKILL_GAP",
      badge_tag: "⚡ Core Technical Gap",
      title: "Agentic Workflows & Automated SQL Data Systems",
      provider: "DeepLearning.AI & Coursera (Free Audit Available)",
      provider_url: "https://www.coursera.org/learn/generative-ai-with-large-language-models",
      duration_weeks: 4,
      duration_hours: 28,
      duration_label: "4 weeks (28 hours)",
      cost: "RM 0 / Free",
      is_free: true,
      is_hrd_corp: false,
      leveraged_atomic_task: `Closing identified gap: ${primaryGap.name}`,
      bridge_narrative: `Build agentic tool-use pipelines connecting multi-modal document extraction to relational database querying and automated verification.`,
      skills_bridged: ["skill_agentic_sql", "skill_multimodal_ocr"],
      sdg_targets: ["SDG 8.2", "SDG 9.5"],
      sdg_labels: ["SDG 8: Decent Work", "SDG 9: Industry & Innovation"],
      milestone_badge: {
        id: "badge_agentic_sql",
        title: "Agentic SQL & Systems Engineer",
        icon: "⚡",
        color: "indigo",
        tier: "Core Technical Master",
        criteria: "Implement an agentic pipeline executing verified database queries with zero hallucination."
      },
      xp_awarded: 350
    });
  }

  // =========================================================================
  // MODULE 3: NATIONAL TVET & REGULATORY ACCREDITED CAPSTONE
  // =========================================================================
  modules.push({
    step: 3,
    module_id: "MOD-CAPSTONE-BURSA",
    module_type: "ACCREDITED_CAPSTONE",
    badge_tag: "🏛️ TVET & Regulatory Capstone",
    title: "Bursa Malaysia ESG Reporting & Bank Negara CCPT Compliance",
    provider: "Institute of Corporate Directors Malaysia (ICDM) & HRD Corp Claimable",
    provider_url: "https://icdm.com.my/programmes",
    duration_weeks: 2,
    duration_hours: 21,
    duration_label: "2 weeks (21 hours)",
    cost: "HRD Corp Claimable (RM 0 Out-of-Pocket)",
    is_free: false,
    is_hrd_corp: true,
    endorsed_by_tvet: true,
    leveraged_atomic_task: `Regulatory Assurance Capstone for ${targetRole.title}`,
    bridge_narrative: `Apply the Bursa Malaysia Sustainability Reporting Guide and Bank Negara Malaysia Climate Change and Principle-based Taxonomy (CCPT) to real corporate audits.`,
    skills_bridged: ["skill_esg_taxonomy", "skill_esg_governance"],
    sdg_targets: ["SDG 12.6", "SDG 16.6", "SDG 17.14"],
    sdg_labels: ["SDG 12: Responsible Production", "SDG 16: Strong Institutions", "SDG 17: Partnerships"],
    milestone_badge: {
      id: "badge_bursa_ccpt",
      title: "Bursa Malaysia CCPT Certified Practitioner",
      icon: "🏛️",
      color: "amber",
      tier: "Accredited TVET Capstone",
      criteria: "Score corporate climate exposure according to Bank Negara Malaysia classification standards."
    },
    xp_awarded: 400
  });

  // =========================================================================
  // MODULE 4 (CONDITIONAL): GREEN-AI RESILIENCE ARBITRAGE (3.2x Runway Boost)
  // =========================================================================
  if (isGreenPivotActive) {
    modules.push({
      step: 4,
      module_id: "MOD-GREEN-PIVOT",
      module_type: "GREEN_AI_PIVOT",
      badge_tag: "🌱 +3.2x Runway Multiplier",
      title: "Circular Economy Material Flow Analysis & Digital Product Passports",
      provider: "Lund University & Coursera (Free Audit Available)",
      provider_url: "https://www.coursera.org/learn/circular-economy",
      duration_weeks: 4,
      duration_hours: 24,
      duration_label: "4 weeks (24 hours)",
      cost: "RM 0 / Free",
      is_free: true,
      is_hrd_corp: false,
      endorsed_by_tvet: true,
      leveraged_atomic_task: "Green-AI Resilience Arbitrage",
      bridge_narrative: "Triple your career runway from 14 to 45 months by integrating circular life-cycle tracking and Digital Product Passports (DPP) under EU and ASEAN green trade mandates.",
      skills_bridged: ["skill_scope3_carbon", "skill_clean_automation"],
      sdg_targets: ["SDG 12.2", "SDG 12.5", "SDG 13.1"],
      sdg_labels: ["SDG 12: Circular Economy", "SDG 13: Climate Action"],
      milestone_badge: {
        id: "badge_green_pivot",
        title: "Green-AI Keystone Transition Pioneer",
        icon: "🌿",
        color: "emerald",
        tier: "Green Arbitrage Master",
        criteria: "Design a zero-landfill product passport lifecycle model for international supply chain compliance."
      },
      xp_awarded: 300
    });
  }

  // Calculate totals
  const totalWeeks = modules.reduce((sum, m) => sum + m.duration_weeks, 0);
  const totalHours = modules.reduce((sum, m) => sum + m.duration_hours, 0);
  const totalXp = modules.reduce((sum, m) => sum + m.xp_awarded, 0);

  // =========================================================================
  // UN SDG CAREER CONTRIBUTION MAPPING & IMPACT ANALYSIS
  // =========================================================================
  const allSdgCodes = new Set();
  modules.forEach(m => (m.sdg_targets || []).forEach(sdg => allSdgCodes.add(sdg)));
  (targetRole.sdg_targets || []).forEach(sdg => allSdgCodes.add(sdg));
  tasks.forEach(t => (t.sdg_targets || []).forEach(sdg => allSdgCodes.add(sdg)));

  const primarySdgs = [];
  if (Array.from(allSdgCodes).some(s => s.includes("SDG 4"))) {
    primarySdgs.push({
      number: 4,
      code: "SDG 4",
      name: "Quality Education & TVET Skills",
      target: "Target 4.4: Increase youth & adults with technical skills for decent employment",
      color: "#c5192d",
      contribution_score: 95
    });
  }
  if (Array.from(allSdgCodes).some(s => s.includes("SDG 8"))) {
    primarySdgs.push({
      number: 8,
      code: "SDG 8",
      name: "Decent Work & Economic Growth",
      target: "Target 8.2: Economic productivity through technological upgrading and reskilling",
      color: "#a21942",
      contribution_score: 92
    });
  }
  if (Array.from(allSdgCodes).some(s => s.includes("SDG 9"))) {
    primarySdgs.push({
      number: 9,
      code: "SDG 9",
      name: "Industry, Innovation & Clean Infrastructure",
      target: "Target 9.4: Upgrade infrastructure and retrofit industries for sustainability",
      color: "#fd6925",
      contribution_score: 89
    });
  }
  if (Array.from(allSdgCodes).some(s => s.includes("SDG 10"))) {
    primarySdgs.push({
      number: 10,
      code: "SDG 10",
      name: "Reduced Inequalities & Vulnerable Support",
      target: "Target 10.2: Empower and promote the inclusion of all regardless of background",
      color: "#dd1367",
      contribution_score: 94
    });
  }
  if (Array.from(allSdgCodes).some(s => s.includes("SDG 12") || s.includes("SDG 13"))) {
    primarySdgs.push({
      number: 13,
      code: "SDG 13",
      name: "Climate Action & ESG Decarbonization",
      target: "Target 13.2: Integrate climate change measures into national policies and corporate strategies",
      color: "#3f7e44",
      contribution_score: 96
    });
  }

  // Inspiring, human-centered SDG career impact narrative
  let careerImpactStatement = "";
  if (hasPedagogy) {
    careerImpactStatement = `By combining your foundational background in neurodivergent pedagogy and empathetic facilitation with verified ${targetRole.title} competencies, your career directly fosters inclusive, human-aligned workforce transitions (SDG 4.4 & SDG 10.2). You ensure advanced technologies empower rather than displace vulnerable learners.`;
  } else if (hasRoutineClerical || hasAccounting) {
    careerImpactStatement = `By upgrading your procedural reconciliation discipline into automated ESG emissions auditing for ${targetRole.title}, you directly champion corporate transparency and industrial decarbonization (SDG 8.2 & SDG 12.6). You turn routine bookkeeping into a critical safeguard against corporate greenwashing.`;
  } else if (hasDiagnostic) {
    careerImpactStatement = `By scaling your hands-on hardware diagnostic problem solving into high-voltage battery triage and smart grid telemetry for ${targetRole.title}, you actively power Malaysia's National Energy Transition Roadmap (SDG 7.1 & SDG 9.4), keeping clean vehicle fleets safe and operational.`;
  } else {
    careerImpactStatement = `Your transition into ${targetRole.title} demonstrates how cross-sector human communication and technical capability bridging build a resilient, forward-looking Malaysian workforce (SDG 8 & SDG 17).`;
  }

  return {
    target_role_title: targetRole.title,
    target_role_id: targetRole.role_id,
    target_department: targetRole.department,
    candidate_name: candidateName,
    total_duration_weeks: totalWeeks,
    total_duration_hours: totalHours,
    total_estimated_cost: "RM 0 (100% Free / HRD Corp Claimable)",
    modules,
    sdg_impact: {
      primary_sdgs: primarySdgs,
      career_impact_statement: careerImpactStatement,
      total_sdgs_impacted: primarySdgs.length
    },
    motivation: {
      total_xp_available: totalXp,
      active_streak_days: 4,
      career_readiness_level: "CRL-4: Foundation Verified",
      target_crl: "CRL-7: Certified Placement Ready",
      target_completion_date: "Nov 28, 2026 (At 6 hrs/week pace)"
    }
  };
}
