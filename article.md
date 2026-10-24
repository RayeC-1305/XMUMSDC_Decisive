# Nexus: pitch fact sheet

Verified against the active repository and a fresh fictional browser/API capture on 24 October 2026. This is the detail source for the later video. Source IDs match the deck’s embedded data and Notes & sources panel.

## 0. Pitch problem and narrative structure

The problem framing is a practical decision, not an asserted labour-market statistic: a worker must choose a worthwhile next learning step within limited time, while career-planning assumptions can change. The fictional Siti example makes that choice concrete. Nexus proposes a reviewable decision that connects declared experience, inspectable evidence and learning gaps, and retains completed learning when the worker accepts a revision. [D01, R01–R05]

The deck is the visual backbone of the pitching video. Both follow the same problem → proposed solution → technical approach → expected impact narrative. Opening chapter 01 establishes the proposition; chapter 10 closes with the team and adviser invitation. The requirement-to-chapter mapping is:

| Requirement | Deck / video chapters | Narrative role |
| --- | --- | --- |
| Problem | 02 | A worker must choose what to learn with limited time and changing planning assumptions. |
| Proposed solution | 03, 04, 05, 06, 07 | Review experience, explain role directions and evidence, build a practical plan, and revisit it while retaining completed learning. |
| Technical approach | 08 | React/Vite browser workspace, Express career API, explainable CPU rules, Crossref metadata and device-local progress; slides 4–5 explain the scoring and evidence method. |
| Expected impact | 09 | Intended clearer next steps, traceable advice, useful revisions and visible learning, tested through a proposed adviser pilot; no measured outcomes claimed. |

Expected impact is framed as intended benefit to test, with proposed measures and pending baselines. It is not evidence of employment, productivity or social-impact outcomes. [P01]

## 1. Product and implemented workflow

NexusTalent, branded **nexus**, is Team Decisive’s SDC Hackathon 2026 Domain 1: Aiversecity Future-Ready Workforce prototype. Its message is “Plans evolve. Progress stays.” Its supporting line is “Advance with every shift.” It helps workers and career advisers turn experience and changing AI research context into a practical, reviewable reskilling decision. The worker remains responsible for the choice. [R01, R07]

The active application supports text-based PDF, DOCX and TXT CVs, pasted experience and fictional samples. Users review skills, tasks, goals and weekly time before comparing six authored roles. The connected loop produces score explanations, source receipts, ordered gap-and-prerequisite learning plans, proposed revisions, accept/revert controls, device-local completion and reflections, saved decisions and an exported Markdown brief. [R01–R05]

Implementation is React/Vite → Express career API → explainable CPU rules and public Crossref research, with a public research revision cache. The normal UI reads the original CV file in the browser and sends extracted text and the reviewed profile to the API for in-memory processing. Personal workspaces remain in browser local storage. There are no active LLM/GPU calls, cloud accounts, institutional approval records or cross-device sync. [R01–R03, R05–R06]

## 2. Fictional inputs and explainable direction

The demonstration uses the unchanged **Siti Rosli** sample, an operations coordinator. Her tasks cover supplier invoices and Excel reports, deliveries/customer enquiries and monthly operations summaries. Her five declared skills are spreadsheets/reporting, document/data processing, stakeholder communication, operations coordination and problem solving. Four hours/week, “Explore a new direction” and the selection of Financial data analyst are demo preferences, not a real learner’s circumstances or a recommendation. [R04, D01]

In the captured **Steady adoption** result, **Financial data analyst** ranks third of six with an index of **60.68/100**. Two of its five required skills are declared: spreadsheets/reporting and stakeholder communication. Gaps to review are data quality/validation, data analysis/visualisation and SQL/data querying. Its transferable bridges include declared spreadsheets, document processing and communication. [D01]

The rules use **45% required-skill coverage + 30% transferable strengths + 25% research/scenario context**. For this role the component values are **40, 100 and 50.7**, contributing **18, 30 and 12.68 points**. These sum to 60.68. The index is not an employment probability. Missing declarations are unknown, not proof of inability; declarations do not establish proficiency. [R02, D01]

## 3. Verified revision and completion sequence

The fixed evidence revision is **947afd1b22fcbef5**, with 12 sources, marked **stale** at capture. No research refresh or personal signal simulation causes this demonstration. Under Steady adoption, the plan order is data quality → analytics → SQL → portfolio. Its total is **48 estimated hours**, initially **12 weeks at four hours/week**. [D01]

The browser marks the actual **Practise Data quality & validation** step complete for demonstration. This is a self-reported UI state, not eight hours of real learning or a completed work sample. Selecting **Faster AI adoption** proposes an authored scenario. The selected role’s priority becomes SQL; its index becomes **63.08**, ranked second. The same four learning-step IDs remain, and **skill:dataQuality** remains complete. The review offers **Accept & update my plan** and **Keep previous view**. [D01]

The capture accepts the faster-AI proposal and reloads the browser, verifying retained completion. It then proposes Green transition separately and uses Keep previous view, verifying return to the accepted faster-AI view with the same completion. This is the exact accept/revert sequence; it does not claim an undo action after a proposal has already been accepted. No forecast, score change or persistence result is invented. [R05, D01]

## 4. Retrieved evidence and authored assumptions

The featured actual source receipt is **Towards Responsible Artificial Intelligence (AI): An Analysis of AI Policies in Selected Low- and Middle-Income Countries**, publisher **Oxford University Press (OUP)**, DOI **10.1093/haschl/qxag295**, publication date **2026-10-23**. Crossref retrieved it at **2026-10-23T16:03:29.729Z**, or **24 October 2026, 00:03:29.729 MYT**. The pitch uses the cached record as retrieved; the publisher page was not independently verified. No findings from the paper are asserted. [D01, X01–X02]

The source’s metadata term **validat** maps to dataQuality with factor **1.04** and a recorded rationale to review data reliability and human validation. This is a Nexus keyword assumption, not the paper’s conclusion. Research factors are averaged and bounded to 0.9–1.1 before scenario adjustment. Research metadata does not establish research quality or Malaysian hiring demand. The three authored scenarios are Steady adoption, Faster AI adoption and Green transition. [R02, R06, D01]

Stale evidence retains original dates; a cold unavailable feed uses neutral research weights. Refresh may retrieve the same inputs and leave ranking unchanged. Scenario changes demonstrate sensitivity to assumptions, not published forecasts. [R02–R03, R06]

## 5. Practical learning and real brief

After the accepted demo completion, the pathway has **40 estimated hours remaining over ten weeks**. SQL is **16 hours, weeks 1–4**; analytics is **16 hours, weeks 5–8**; the work sample is **8 hours, weeks 9–10**. SQL’s authored spreadsheet prerequisite is already satisfied by Siti’s reviewed declaration. The public resource is Microsoft Learn’s **Query and modify data with Transact-SQL**. Nexus’s authored practice output is to write and explain queries, joins and checks on synthetic tables. Sixteen hours includes Nexus’s practice estimate, not a Microsoft course-duration claim. [R02, R04, D01, X03]

The real exported brief is [siti-career-brief.md](output/pitch/siti-career-brief.md) and is also downloadable from slide 7 offline. It contains the selected direction, scenario, schedule, completion, source receipts, scoring explanation and revision history. Public resource content is free; optional certificates, equipment, software and assessments may cost money. Introductory practice and self-reported completion do not establish proficiency or professional qualification. [D01]

The SQL step’s SDG 4.4 and 8.2 mappings describe intended contribution through technical practice and responsible productive work. They are Nexus interpretations, not measured impact or UN endorsement. SDG 4.4’s official target concerns relevant technical/vocational skills. [R04, X04]

## 6. Buyer hypothesis, proposed pilot and future work

The expected impact is clearer next learning choices for workers and more reviewable advice for advisers, while useful learning remains recorded as plans change. Intended benefits are clearer next steps, traceable advice, useful revisions and visible learning. The proposed pilot connects each benefit to a measure: time to an adviser-agreed action, source validity, acceptance/reversion usefulness and adviser review of a practice work sample. These are hypotheses to validate; no improvement, employment effect or measured social impact is asserted. [P01]

Malaysian career centres and reskilling providers are the initial buyer hypothesis. The proposed value is preparing and revisiting an explainable transition brief. An organisational subscription per active advised learner is a possible model; pricing remains unvalidated. A proposed first pilot invites **one adviser team and two review sessions**. This scope is a pitch proposal, not an agreed partnership. [R01, P01]

Measure time to an adviser-agreed next action, source validity, usefulness of revisions and review of completed work samples. Proposed targets are recording an agreed action, checking each source used, explaining acceptance/reversion and reviewing practice outputs. **Baselines are pending measurement.** No market size, revenue, customers, traction or outcomes are claimed. Adviser matching validation, resource/prerequisite review, an appropriate Malaysian job-demand source, accounts and deployment controls remain future work. Engineering checks do not establish career accuracy, general fairness or employment outcomes. [R01–R03, P01]

## 7. Team and availability

Verified roles: **Raye Chan Jun Foong — team leader; Teo Zheng Xi — tech lead; Liew Jicson — video**. Public deployment is TBD in the repository. The deck therefore states **Local prototype available for demonstration**, with no public demo URL or QR. The invitation is to review a sample transition decision with an adviser team. [R01]

## Source register

Repository sources refer to the active files read on 24 October 2026; legacy strategy and unused components are excluded.

- **R01** — [README — active product, limitations and verified team](README.md).
- **R02** — [Career engine — scoring and ordered pathways](services/career_engine.js).
- **R03** — [Backend and integration contracts](docs/INTEGRATION.md); also `docs/BACKEND.md`.
- **R04** — [Authored sample, role and learning catalogs](src/data/careerCatalog.js); also `services/career_catalog.js`.
- **R05** — [Active workspace and learning components](src/components/career/CareerApplication.jsx); also `src/components/career/LearningWorkspace.jsx`, `src/components/career/CareerViews.jsx`, `src/utils/careerApi.js`, `src/utils/careerDemo.js`.
- **R06** — [Public evidence retrieval, mappings and stale status](services/evidence_service.js).
- **R07** — [Nexus brand preservation contract](docs/brand-guidelines.md); also `brand-spec.md`, `src/career.css`, `src/landing.css`, `src/components/career/CareerPrimitives.jsx`, `public/nexus-mark.svg`.
- **D01** — [Verified Siti browser/API capture and export](output/pitch/demo-proof.json).
- **X01** — [Crossref REST API documentation](https://www.crossref.org/documentation/retrieve-metadata/rest-api/).
- **X02** — [Towards Responsible Artificial Intelligence (AI): An Analysis of AI Policies in Selected Low- and Middle-Income Countries](https://doi.org/10.1093%2Fhaschl%2Fqxag295).
- **X03** — [Microsoft Learn — Query and modify data with Transact-SQL](https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/).
- **X04** — [United Nations — SDG 4 targets](https://sdgs.un.org/goals/goal4).
- **X05** — [UK Government — The Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework).
- **P01** — Expected benefits, proposed pilot and buyer model. Intended benefits and pilot proposals based on the user brief and README; no buyer, partnership, price or measured outcome is asserted..

## Asset and production record

The frozen product/API capture and exact brief live in output/pitch/. Historical screenshots remain source records only and are not embedded or displayed. The deck embeds CSS, JavaScript, fonts, narration, source records and asset mappings. Fonts were obtained from official Google Fonts endpoints and embedded; there is **no external runtime font dependency**. The deck uses native typography and diagrams, with no product screenshots. Slide 6 is the sole live HTML embed and requires the local app server at http://127.0.0.1:3201/. It is not a public deployment or an offline copy of the app. No required product asset is missing. Public deployment, pilot baselines and any real learner work sample remain unavailable and are not fabricated.

The later video must rebuild focused 1920 × 1080 click-driven scenes on a consistent Nexus stage. This run creates neither voice audio nor finished video. See outline.md for the pending plan, first-chapter and audio checkpoints; the later chapters’ narrations.ts files become the implementation source of truth.
