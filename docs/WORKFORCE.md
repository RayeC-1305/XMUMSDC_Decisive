# Employer / HR synthetic reskilling workflow

## Architecture integration

The app remains a single React 18 / Vite 6 frontend and Node 22 / Express 4 backend. Existing worker navigation is hash-based inside `CareerApplication`; pathname entry points in `App.jsx` add the employer introduction at `/hr`, guided demo at `/hr/demo` and public employee survey at `/survey/:token` without replacing it. There is no existing SQL database or central frontend state library. Worker decisions remain in browser local storage; HR UI state uses React hooks and refreshes analysis every five seconds.

## Guided employer experience

The employer landing page explains the complete workflow before inviting users into **Explore the guided demo**. Its synthetic scenario preview uses the same local catalog/ranking/pathway functions as the individual introduction, and is explicitly separate from the API-backed department results. Scroll reveals, chapter navigation and reduced-motion support make the introduction explorable. The demo shows one chapter at a time:

1. `#setup` — choose a seeded department and optionally load the idempotent demo set;
2. `#invite` — create, copy, extend or revoke an actual survey campaign;
3. `#respond` — submit the real employee survey inside the demo and receive immediate personal results, or open the shareable public survey;
4. `#skills` — switch between radar, heatmap and searchable employee review, filter by exposure proxy and inspect individual pathways;
5. `#scenarios` — switch scenarios, refresh sources or simulate weights, with visible score/exposure/timeline results;
6. `#plan` — select prerequisite-ordered learning cohorts, inspect participants/citations and download an actual department learning brief;
7. `#impact` — inspect SDG mappings and discuss fairness, evidence and human-review boundaries.

Each chapter explains its purpose and intended outcome. Numbered navigation, Previous/Next, deep links and browser back/forward work without resetting the selected campaign or scenario. Department setup, survey campaign and analysis scope are connected; preferences survive page reloads in session storage. Embedded submissions immediately request fresh dashboard data, in addition to the five-second polling interval. Reduced-motion preferences are respected.

Guidance is compact and action-led; methodology, sources and further notes use expandable disclosure. Workforce summary metrics are available under Review rather than blocking the first task. Brief cohort selection is ephemeral UI state, not a saved or completed training plan. Selecting a dependent cohort includes its foundations; excluding a foundation excludes dependent learning. Exports include actual profiles, scenario, chosen cohorts, dated citations, department SDG mappings (not measured impact) and human-review guardrails.

Origin regression checks cover the exact public preview hostname with `:5000` against a backend receiving a rewritten loopback Host header. Localhost-only browser tests are insufficient for mutation flows behind the development proxy. Unrelated origins remain blocked.

Survey profiles pass through `normalizeProfile`, the existing `matchProfile` rules engine and `buildPathway`. Optional **synthetic** CV text uses the same `recogniseSkills` keyword rules, with text split into bounded task entries. Custom skills outside the catalog are retained only for human review, never treated as scored catalog skills. Employee self-rated proficiency is saved for the heatmap, not added to individual role scoring.

### Persistence model

`WorkforceStore` atomically saves a versioned JSON object containing:

- campaigns: ID, random 192-bit token, department, focus/notes, maximum submissions, expiry or manual-close mode, revoked flag and creation timestamp;
- submissions: ID, campaign ID, normalized synthetic profile, catalog self-ratings, custom review skills and submission timestamp;
- seed marker, revision and separately labelled simulation state.

Counts derive from saved submissions, not a client counter. The server revalidates the link immediately before a synchronous append and save, after evidence retrieval. At a one-response quota, concurrent requests accept exactly one. This guarantee is limited to **one Node process**.

There is no real-data authorization or multi-tenant boundary. Profiles and notes are deliberately synthetic-only. This store is not suitable for horizontal scaling or durable cloud deployment without further work.

## API

All API responses disable caching. Errors are JSON with a human-readable `error` and appropriate HTTP status.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/hr/campaigns` | Seed on first use, then list campaigns with status and usage |
| POST | `/api/hr/campaigns` | Create `{department, focus, maxSubmissions, expirationHours}` |
| POST | `/api/hr/campaigns/:id/update` | `{action:"revoke"}` or `{action:"extend", expirationHours, maxSubmissions?}` |
| POST | `/api/hr/seed` | Idempotent three-department / 24-profile sample set |
| GET | `/api/hr/dashboard?scenarioId=steady&campaignId=...` | Shared-engine analyses, heatmap, cohorts, SDG mappings and evidence |
| POST | `/api/hr/trends` | `{action:"refresh"}` retrieves Crossref, `{action:"simulate"}` toggles separate scenario assumptions |
| GET | `/api/survey/:token` | Validate link and return campaign metadata, skill choices and synthetic sample |
| POST | `/api/survey/:token` | Validate consent/profile, enforce quota and return personal roles/pathways |

`expirationHours` accepts 24, 48, 168 or `null` (manual close). Quotas are integers from 1 to 500. Campaigns support Active, Expired, Quota Reached and Revoked states. Extending reopens revoked/expired links; a full link also needs a larger quota.

A submission requires `{syntheticConsent:true, profile:{name, role, skills, tasks, interests, goal, hoursPerWeek, synthetic:true}, proficiencies:{skillId:1..5}, customSkills:[], cvText?:string}`. Only allowed profile fields are retained. Age, gender and demographic background are not collected or scored.

## Interpretation and grounding

- Model: `nexus-rules-1.0`; **no LLM, embedding or generative model**. Scores are not employment probabilities.
- Scoring: 45% declared required skills, 30% transferable bridges (declared or task-derived potential), 25% bounded research/scenario context.
- Evidence: Crossref source/publisher, publication date precision, retrieval timestamp and stale/error state remain visible. Research metadata is not verified Malaysian hiring demand.
- Scenarios: moderate adoption (HR planning window 3–5 years), fast AI disruption (1–2 years), and green transition. Existing engine factors remain unchanged. HR windows are labels for planning, not calibrated forecasts.
- Heatmap urgency: `max(0, 4 − proficiency) / 4 × shared skill forecast weight × scenario multiplier × 100`. Missing declarations use 0 / unknown, requiring human review. Rapid multiplier is 1.3; otherwise 1.
- Exposure proxy: `min(100, 0.65 × mean top-role gap urgency + 12 × count of declared declining skills)`. Low <35, Moderate <60, otherwise High. This is a reviewable planning index, **not a displacement probability** or basis for employment penalties.
- Pathways: existing prerequisite-aware ordering, curated public resources and practice outputs. Rapid mode uses 1.5× weekly learning capacity (maximum 40 hours), so timelines visibly change; this assumption needs HR approval.
- Cohorts: derived from actual top-role pathway steps. Prerequisites precede dependent cohorts. Estimated cohort weeks use the lowest participant weekly capacity, with sequential start/end weeks.
- Learning citations: publisher URLs and catalog dates; optional certificates/hardware excluded. No verified HRD Corp claimability is asserted.
- SDG view: distinct participants per target from top recommended role and pathway steps. Every role and catalog skill already has target mappings. All 17 goals are visible; unsupported goals remain unmapped. SDG 5 is an inclusion objective, not a fabricated measured result. Green mode can reprioritize sustainability roles and change mapped targets.

## Verified journeys

`npm test` covers the original backend and new workforce models/API. `npm run build && npm run test:workforce` tests a real temporary server and disk store through Chromium: create arbitrary department, copy survey link, autofill, consent, submit, inspect immediate roles/radar/cited roadmap, see HR update within polling interval, close at quota, extend quota, revoke, validate closed/invalid links, switch scenarios, simulate and refresh trends, inspect SDGs, and check mobile overflow. Original worker browser tests remain available as `npm run test:integration`.
