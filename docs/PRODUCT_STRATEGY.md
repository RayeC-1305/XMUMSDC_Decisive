# NexusTalent: a transition decision worth paying for

Research and implementation review: 23 October 2026, Malaysia time.

Implementation note: the tables below record the initial research/implementation pass. The frontend was subsequently rebuilt as a browser-only prototype with local CV import, full-gap learning plans and persistent workspaces. See [the current Domain 1 mapping](FRONTEND_DEMO.md), [README](../README.md) and [verification](VERIFICATION.md) for actual behaviour. References below to active backend calls or missing CV import describe the earlier version.

## Recommendation

Keep the six Domain 1 capabilities. Change the unit of value from a dashboard full of predictions to an adviser-reviewed transition decision: **what should this person learn next, and what would make us change that decision?**

Pitch: **NexusTalent helps career advisers turn a worker's existing experience into a practical learning plan, then review that plan when AI evidence changes.**

The starting user is an operations or administrative worker considering reskilling before committing time and money. The first buyer to validate is a Malaysian career centre or reskilling provider serving these workers. The adviser is the daily operator; the worker owns the decision. This is a commercial hypothesis, not established customer demand.

The first sellable deliverable is an explainable transition brief, with source dates, a comparison of alternatives, learning constraints, and a record of what changed. A job board sells access to openings; a course directory offers learning choices. Our proposed value is deciding which next step deserves attention and keeping that decision reviewable. Competitor superiority and novelty have not been established.

## What Domain 1 is actually asking

The brief describes a closed loop: intake → dated AI and job-market evidence → emerging/declining skills → explainable role ranking → ordered reskilling → meaningful SDG contribution → revision as evidence changes. It is not a demand for a large national employment platform.

The preliminary rubric gives 30% to innovation, 25% to problem–solution fit, 25% to feasibility, and 20% to clarity. Its innovation criterion explicitly values a sharply framed user and moment of need. Its feasibility criterion usually expects a working signal-to-matching chain. A focused, demonstrable change of recommendation matters more than the number of portals.

All six must-haves remain in the final scope. Employer dashboards, automatic re-planning, multilingual access, motivation features, fairness checks, and aggregate SDG views are optional. Payments, full course creation, and recruitment integrations are explicitly outside the challenge's scope.

## Reframe, add, remove

| Decision                                                                                | Product reason                                                                                               | Implementation in this pass / next step                                                                                                                           |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reframe “predict your job's expiry date” as “compare decisions under uncertain futures” | An exact month of displacement is not supported by the current model. Fear-based certainty undermines trust. | Removed career-runway and half-life promises from the active UI. Three scenarios remain, clearly marked as assumptions.                                           |
| Reframe a national three-sided platform as one worker–adviser workflow                  | Three customer segments create three acquisition problems before the core job is proven.                     | The frontend now opens directly into the worker workspace. Existing HR/TVET source components are preserved for possible later use.                               |
| Add a decision-change review                                                            | A recurring review is a reason to return and an organisational reason to renew.                              | Scenario/signal changes show before/after model indices for the selected role. Completed steps remain recorded; adviser approval is still a production extension. |
| Add an evidence-of-learning output                                                      | Watching lessons is not the same as demonstrating a transferable capability.                                 | Each learning step now specifies a small work sample and source. These are our practice activities, not invented accredited courses.                              |
| Add a realistic time constraint                                                         | Workers have limited weekly learning time.                                                                   | A weekly pace changes the plan's week estimates. The first sprint is introductory, not a promise of qualification.                                                |
| Add an exportable transition brief                                                      | Advisers need a usable artefact for a conversation and follow-up.                                            | Downloads the profile, direction, formula, steps, sources, assumptions, SDGs, and self-reported progress as Markdown.                                             |
| Remove unsupported outcome claims                                                       | A score boost, funding logo, or arbitrary percentage is not evidence of employment or impact.                | No salary uplift, guaranteed zero cost through HRD Corp, precise job-security runway, or measured SDG percentages in the active journey.                          |
| Defer hiring, certificates, badges, payments, and a course marketplace                  | These do not prove the core decision or fit the allowed scope.                                               | No new integrations in this frontend pass.                                                                                                                        |

## Why the existing project was difficult to sell

The former “National Tri-Party Green & AI Skills Synchronizer” described the architecture and ambition before a buyer's problem. The opening screen asked visitors to choose among three institutional perspectives, and controls exposed scenario injection, networking, model names, and implementation vocabulary before explaining the user's next action.

More seriously, the claimed evidence was stronger than its provenance:

- `data/trend_signals_oct2026.json` labels one signal as an ESG extraction paper, but its URL, arXiv 2403.04781, resolves to **Selective Encryption using Segmentation Mask with Chaotic Henon Map for Multidimensional Medical Images**. The citation does not support the claim.
- `services/trend_agent.js` has fallback samples dated 24–26 October, later than this review date. Fallback output must never be described as newly retrieved evidence.
- Trend impact multipliers are assigned through keyword rules. They are not learned vacancy forecasts. A newly retrieved preprint is not enough to establish Malaysian employer demand.
- The RunPod client can execute deterministic local text hashing. A configured BAAI/Llama disclosure does not prove either model ran. Local mode is not a validated semantic embedding model.
- Hybrid role titles, salary estimates, growth rates, course names, funding claims, and accreditation assertions in the existing catalog require item-level checking. A relevant institution's homepage does not substantiate a specific course, fee, or qualification.
- Holding protected attributes constant can demonstrate one limited counterfactual property. It does not prove zero bias across workers, languages, disability, socioeconomic conditions, or access to training.

The new frontend exposes sample/provenance status and uses a small checked resource set. **This does not repair or validate the legacy datasets or backend. Do not describe the project as fully compliant or production-ready yet.**

## Required features: traceability and remaining gaps

| Domain 1 requirement            | Frontend now                                                                                                                                     | Evidence needed before final submission                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Skills profile intake           | Synthetic profile selection, task inclusion, catalog skill additions, experience context, weekly pace.                                           | Test diverse synthetic profiles and explain unsupported or missing inputs. Personal CVs remain excluded from the demo.                                                               |
| Updatable AI/job-market layer   | Calls the existing research refresh endpoint; displays source/date and distinguishes retrieved preprints from sample inputs.                     | Replace incorrect/future-dated samples; archive actual source text and retrieval dates; validate a repeatable job-market feed. Hard-coded samples alone do not meet the requirement. |
| Explainable future-role ranking | Existing matching API supplies the ranked list and 45/30/25 contribution breakdown. Skills gaps can be inspected for a selected direction.       | Replace proposed hybrid jobs with verifiable public occupations/IDs, validate task and skill mappings, and evaluate ranking quality against a baseline.                              |
| Personalised ordered pathway    | A transferable-task foundation, selected priority-gap activity, work-sample review, free public references, estimated hours and weekly schedule. | Expand from one priority gap to the full prerequisite graph; validate specialist coverage. Current plans are introductory sprints.                                                   |
| Role/skill SDG mapping          | Shows role targets, every missing skill's targets, each learning step's targets, and contribution explanations with UN links.                    | Audit every catalog role and skill, including retained skills that currently lack explicit mappings. Establish a measured outcome; tags are not measured impact.                     |
| Uncertainty                     | Steady, faster AI, and green-transition scenarios visibly recompute matching. Assumptions are stated beside the controls and indices.            | Calibrate scenario assumptions; test changes that alter both ranking and the next learning priority. Current indices are model illustrations.                                        |

Resource links checked for the new journey: Microsoft Learn's **Introduction to AI concepts**; GHG Protocol's **Scope 3 Calculation Guidance**; and Elements of AI's **Building AI**. The GHG material is guidance, not certification. Building AI course content is free, while its optional certificate is paid. Practice activities and time estimates are authored by this project, not attributed to those providers. The catalog does not establish HRD Corp eligibility.

## The demo that carries the pitch

1. Open the overview as Siti, a fictional operations worker. Explain the decision: she has limited learning time and wants a defensible next direction.
2. Review tasks and existing skills. Show that changing the profile changes the ranking rather than merely changing a name.
3. Inspect two directions and their score contributions, skill gaps, source status, and SDG links. A match index is not a probability of getting hired.
4. Pick a direction and show the first learning output. Change the weekly pace and show how the estimated schedule responds.
5. Complete a step. Preview a synthetic signal and compare before/after indices. Explain why completed learning is preserved and what an adviser would review next.
6. Refresh the actual research feed. If unavailable, show the labelled sample fallback honestly. Do not present the fallback as proof of live data ingestion.
7. Export the transition brief. The user leaves with a concrete next action and the assumptions needed to challenge it.

The strongest final demo will use an actually retrieved, relevant source and show an evidence-based change in the next learning step. That remains a backend/data validation task.

## Commercial wedge and validation

Start with one adviser team, one cohort, and a narrow family of operations roles. Sell the repeatable review workflow and decision record. Test an organisational subscription based on active advised learners; avoid charging vulnerable workers for opaque career predictions. Do not build billing for the hackathon.

Before setting a price, interview five advisers and five workers about the last reskilling decision they made, how it was justified, what changed afterward, and who paid. Ask for a pilot commitment with a real budget owner. Time saved, a letter of intent, and repeated use are evidence; hypothetical willingness-to-pay answers are weaker.

The defensible asset could become a permissioned, reviewed history of task mappings, evidence changes, adviser corrections, and actual learning outcomes. Today that asset does not exist. A general-purpose LLM wrapper is easy to substitute; the intended differentiation is a trusted workflow and improving evidence quality.

Measure time from intake to an adviser-approved next action, source validity, change-detection quality, and completion of a reviewed work sample. Track placement and sustained employment later with consent; do not infer them from clicks or course completions. Primary SDG targets are 4.4 and 8.5; optional sustainability role paths can support 12.6 and 13.2 without pretending the application has measured emissions reductions.

For the submission's numerical baseline, first run the same decision task with and without NexusTalent. Report sample size and times. A provisional target such as 20% faster preparation is a **test target**, not a measured result. Do not invent a baseline to fill the template.

## Build sequence after the frontend

1. **Evidence integrity:** remove false attributions and future-dated samples; use public, verifiable occupation IDs and resource records. Retain synthetic assumptions only as explicitly labelled scenarios.
2. **Signal quality:** archive each source's title, date, excerpt, URL, retrieval time, affected skills, mapping rationale, and reviewer status. Use research for capability change and job data for demand; do not conflate them.
3. **Matching quality:** establish a CPU-capable baseline (for example BM25/task overlap), then evaluate a properly declared CPU embedding model if needed. Compare rankings on diverse synthetic profiles and adviser-labelled pairs. The present hashing fallback is not enough to claim AI model quality.
4. **Change-aware pathways:** identify which skill gaps and plan steps actually changed. Preserve approved or completed useful work, propose a revision, and require human acceptance. Add prerequisite and resource-coverage checks.
5. **Pilot:** adviser review, durable storage, access control, privacy controls, evaluation, and adoption measurement. Backend state is currently in memory and progress is only on one browser/device.

Use Replit only for slide generation, as requested, and document that actual use with its project/history evidence. Do not migrate app hosting to satisfy a generic README example. RunPod is conditional on GPU workloads; a CPU solution does not need it. Keep the existing adapter only if useful, and do not claim GPU usage without actual evidence. The current GPU path remains in the source; it was not provisioned or removed in this pass.

## Submission preparation

The public GitHub template is a structure/reference, not the authority to manufacture sponsor use. Adapt it to the actual React/Vite/Express stack. Keep Apache-2.0 and declare all third-party libraries, datasets, models, AI-assisted development, design tooling, and checked references.

The participant handbook gives the preliminary deadline as **25 October 2026, 7:59:59 AM MYT**. Its six deliverables are the official proposal, pitch deck, accessible functional prototype, technical/tools declaration, GitHub source, and a 5–7 minute YouTube pitch/demo. This pass does not submit, deploy, change repository visibility, generate slides, or sign declarations.

Use the official proposal fields: problem context ≤250 words; solution ≤300; design/deployment strategy ≤200; exact SDG target, numerical baseline, KPI, and Phase 2 target; eligibility and IP declarations. The technical declaration has separate word limits and asks for every API, cloud service, dataset, model, sponsor resource, and AI-assisted development tool. Leave team identity, signatures, workshop attendance, deployment URLs, and proof-of-use to verified team information.

The handbooks have inconsistent repository-visibility wording (private during development versus public at submission). Check the latest committee announcement when submitting; do not change visibility or invite collaborators automatically.

## Sources reviewed

- [Attached Domain 1 brief](../Domain%201.pdf), especially PDF pages 4–8: journey, six required features, boundaries, rubric.
- [Shared participant resources](https://drive.google.com/drive/folders/1xw7c2aN8N-at8hPEULzkcU76e_FFb0Ef).
- [Participant handbook](https://drive.google.com/file/d/1fGBS-jevDj_FrF8wsbYNPzyU5TTrfk1V/view), sections 6, 9, 10: deliverables, timing, tools, evidence.
- [Official handbook](https://drive.google.com/file/d/1vDGxSLufFrE9h6T8-KY1ltxmAgQln23k/view) and [terms and conditions](https://drive.google.com/file/d/1tZOLKK-fA7Uh3zu1otdL6Z-oC_FKMtyl/view): development, attribution, originality and access.
- [Official proposal template](https://drive.google.com/file/d/1jNjuMJfhMYjo3qQw_PmmeGM-INEwuleo/view) and [tools declaration](https://drive.google.com/file/d/1LBXfXrFblX-dHanSP8jhUOMGfGGxY2ew/view).
- [GitHub submission template](https://github.com/michaelzhngg/SDC_Hackathon_Submission_Template).
- [Actual arXiv citation target](https://arxiv.org/abs/2403.04781), checked against the repo's ESG attribution.
- [Microsoft Learn AI concepts](https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/), [GHG calculation guidance](https://ghgprotocol.org/scope-3-calculation-guidance-2), [Building AI overview](https://buildingai.elementsofai.com/), [Elements of AI certificate policy](https://community.elementsofai.com/c/elements-faq/i-have-passed-an-elements-of-ai-course-where-is-my-certificate).
