# Career transition backend

The active Express API serves a Malaysian operations or administrative worker deciding what to learn before committing time and money. It returns an explainable career comparison and learning proposal for a worker/adviser conversation. The baseline uses explicit rules; no chatbot, GPU inference, model credentials or generated courses are required.

## Run and demonstrate

Use Node.js 22.16+ or 24+:

```sh
npm ci
npm run server
```

The API binds to `127.0.0.1:3001`. Public research refreshes at startup unless `TREND_AUTO_REFRESH=false`. `npm run dev:full` starts API and Vite together; Vite proxies `/api`. After `npm run build`, `npm start` serves both the API and frontend build. Configure `HOST` and `CORS_ORIGINS` for your environment.

In another terminal:

```sh
npm run demo:backend
npm run test:backend
```

The demo uses a synthetic worker, calls the actual HTTP intake/matching/refresh/transition endpoints, prints scores with and without evidence, compares three scenarios, and writes dated provenance to `output/backend/live-demo.json`. Set `NEXUS_API_URL` for another API server. An unavailable feed fails visibly; no fabricated research is substituted. Tests use explicitly synthetic fixtures, real local HTTP and actual PDF extraction; they require no internet.

The React workspace is connected to these APIs for intake, ranking, skill outlooks, scenarios and complete pathways. Saved decisions, notes and completion remain device-local. Only the labelled landing preview uses illustrative local rules. See INTEGRATION.md for the browser/API contract.

## Six requirements

| Requirement | Active backend behavior |
| --- | --- |
| Skills intake | Structured skills/tasks/interests/goal/time form, pasted CV, UTF-8 TXT and searchable PDF upload. Keyword extraction returns provenance and requires review. Tasks supply transferable potential; interests break learning-priority ties. |
| Updatable trend layer | Live Crossref AI/workforce research metadata, relevance/date checks, DOI links, publication-date precision, retrieval time, mapping reasons and bounded effects. Last-successful evidence persists; stale/unavailable states are explicit. |
| Future-role matching | Six authored role profiles, ranked indices, three weighted score components, matched skills, every gap and per-skill source IDs. Includes score without evidence and evidence-induced delta. |
| Reskilling | Every missing role skill plus recursive prerequisites, ordered steps, public resources, practice outputs, estimated hours/ranges and weekly schedule. Completed step IDs survive recomputation. |
| SDG mapping | Every role, skill and learning step has specific targets, UN links and an intended-contribution explanation. Tags do not claim measured impact. |
| Uncertainty | Steady adoption, rapid AI adoption and green-transition assumptions are returned together. Each role has score/rank ranges and next-skill differences across scenarios, explicitly not statistical confidence intervals. |

## HTTP contract

JSON bodies must be objects. Errors return `{ "error": "...", "code": "..." }`. Unknown API routes return JSON 404 even when serving the frontend. Invalid inputs use 400; uploads also use 413/415/422. Refresh returns 503 without any evidence, or 200 with `status: "stale"` and `lastError` when retaining previously retrieved evidence.

| Method | Path | Request/result |
| --- | --- | --- |
| GET | `/api/health` | API/model disclosure and evidence availability |
| GET | `/api/catalog` | Roles, skills, resources, scenarios and synthetic sample profiles |
| GET | `/api/roles`, `/api/skills`, `/api/courses`, `/api/scenarios` | Individual catalogs |
| POST | `/api/intake` | `{profile: {...}}`, `{cv_text: "..."}`, `{text: "..."}` or multipart `cv_file` |
| POST | `/api/parse-cv` | Alias of intake |
| GET | `/api/trends` | Evidence records, dates, mapping assumptions and freshness state |
| POST | `/api/trends/refresh` | Refresh fixed public feed; concurrent requests share one fetch; 60-second cooldown |
| POST | `/api/trends/fetch-live` | Alias of refresh |
| POST | `/api/match` | `{profile, scenarioId}` → ranking, gaps, explanations, scenarios, sensitivity and sources |
| POST | `/api/reskilling-pathway` | `{profile, scenarioId, roleId, hoursPerWeek?, completedStepIds?}` → selected role, evidence and pathway |
| POST | `/api/transition` | Same request → full brief with profile, all matches, scenarios, SDGs and selected pathway |

Scenario IDs: `steady`, `rapid`, `green`. Old IDs `moderate`, `rapid_agentic`, `malaysia_green_boom` are aliases. The role defaults to the highest-ranked result. Role requirements and resources always resolve from the curated catalog; clients cannot submit invented courses or role requirements.

Example `/api/transition` request:

```json
{
  "profile": {
    "id": "synthetic-worker-1",
    "name": "Synthetic worker",
    "role": "Operations coordinator",
    "skills": ["excel", "coordination", "communication", "dataEntry"],
    "tasks": ["Coordinate suppliers and reconcile invoice records."],
    "interests": ["sql"],
    "goal": "Explore an affordable transition",
    "hoursPerWeek": 4,
    "reviewed": true,
    "synthetic": true
  },
  "scenarioId": "rapid",
  "roleId": "financial",
  "completedStepIds": ["skill:dataQuality"]
}
```

Profiles require at least one skill or experience task. Skills/interests use catalog skill IDs; weekly learning time is 1–40 hours. Uploads are limited to 5 MB, PDFs to 30 pages, pasted CV text to 80,000 characters and JSON bodies to 256 KB. CV mentions do not establish proficiency: users should edit and review the extracted profile. CV bytes, text and worker profiles are never persisted or shared through a persona list. Only public research metadata is cached on disk.

## Evidence-to-decision method

1. Query the fixed HTTPS [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) for papers published from 2023 through the current UTC day. Caller-supplied fetch URLs are not accepted.
2. Require both AI/automation and workforce/skills terms in publisher metadata. Reject malformed DOIs, invalid/future dates and duplicate DOIs. Select at most 12 relevant records from 100 candidates. Partial dates retain their precision.
3. Map metadata terms to skill IDs with recorded reasons. Average the small effects rather than multiply papers, clamp the research factor to 0.9–1.1, then clamp scenario-adjusted priority to 0.5–2.0. Duplicate evidence cannot compound scores.
4. Score `45% declared required-skill coverage + 30% transferable bridges + 25% research/scenario context`. Declared bridges earn 1 credit; a task keyword earns 0.6 potential credit; unsupported bridges earn zero. Trend score is `clamp(50 + 50 × (mean required-skill weight − 1), 0, 100)`. Each component and weighted point contribution is returned.
5. Rank gaps by estimated priority, breaking ties with declared interests. Place prerequisites before dependent learning steps. Compare all three scenarios and preserve caller-supplied completion records.

The metadata-to-skill effects are **Nexus assumptions, not paper findings or observed job growth**. Research is a capability proxy; local demand is not measured. Empty/failed refreshes retain the last successful sources with their original retrieval dates. Evidence becomes stale after six hours or a failed refresh. Explicit refresh or a server restart checks again; no background scheduler runs. If no evidence has ever been retrieved, matching uses neutral research weights and clearly labelled scenario assumptions.

## Feasibility and limits

The hardest risk is **mistaking relevant research for reliable Malaysian hiring demand**. Retrieval and dates can be tested; research quality, mapping relevance and local demand require validation. The fallback is dated, labelled cached evidence, or a neutral baseline if no evidence exists. Next validation should compare worker/role pairs with adviser judgements and add an appropriate public/licensed vacancy source. Engineering tests do not establish ranking accuracy.

Roles are authored pathways, not ESCO-certified mappings, verified vacancies or guaranteed future occupations. Public learning references and authored exercises are introductory preparation, not professional qualifications. Optional certificates, hardware, software and assessments are outside the free-content budget; HRD Corp eligibility is not assumed. SDG contribution text is the project's interpretation of the [UN targets](https://sdgs.un.org/goals), not an endorsement or measured outcome. Personal attributes are excluded from scoring; this limited property does not prove general fairness.

This is a local, stateless demonstration API. Learner accounts, durable adviser approval records and public-deployment access controls remain deployment work. Legacy shared Socket.IO state, global scenario mutations and unverifiable evidence injection endpoints return 410. Old services/datasets remain in the repository for history but are **not imported by the active server**; clients using those contracts must migrate.

Implementation: `server/app.js`, `services/profile_intake.js`, `services/evidence_service.js`, `services/career_engine.js`, `services/career_catalog.js`, `tests/backend.test.js`.

## Verified on 23 October 2026

All 18 backend tests passed, including actual text-PDF parsing, local HTTP endpoints, cache persistence/restart, timeouts, stale fallback, evidence-induced score/priority changes, scenario sensitivity and full prerequisite coverage. The production Vite build passed. In this Codex environment the checks needed unrestricted local HTTP and filesystem operations because the sandbox blocks loopback connections and atomic renames.

The real API ran on port 3101 because 3001 was already occupied. Crossref returned 12 relevant dated records, saved with their original retrieval times. A later refresh timed out and correctly kept those records as stale. In the synthetic demo, the financial pathway's next priority changed from data quality under steady adoption to SQL under faster AI adoption; estimated introductory learning was 48 hours at four hours per week. These are observed demo outputs, not validation of career forecasting quality. Re-run the demo to produce current evidence rather than treating these values as a future guarantee.

## Integrated requests

`POST /api/transition` additionally returns `pathways`, keyed by role ID, so comparisons and the selected learning plan use one consistent response. Requests accept `evidenceRevision` and `simulations`. Up to 20 public evidence revisions persist; `none` selects neutral weights and an unavailable historical revision returns 409. Personal simulations are capped at 10, use known skill IDs and factors from 0.5 to 2, and are returned separately from research. They do not mutate another user's results or the public evidence cache.
