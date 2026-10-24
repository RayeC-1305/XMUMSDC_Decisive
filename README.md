# NexusTalent — Decisive

> NexusTalent helps workers, employers and career advisers turn experience and changing AI research context into practical, reviewable learning decisions.

**Plans evolve. Progress stays.** SDC Hackathon 2026 · Domain 1: Aiversecity Future-Ready Workforce.

This README follows the [official submission template](https://github.com/michaelzhngg/SDC_Hackathon_Submission_Template). Official forms are available in the [submission documents folder](https://drive.google.com/drive/folders/1xw7c2aN8N-at8hPEULzkcU76e_FFb0Ef). Unprovided submission details are marked **TBD** rather than presented as completed.

## Team Information

| Field | Details |
| --- | --- |
| Team Name | **Decisive** |
| Team Domain | **Domain 1 — Aiversecity Future-Ready Workforce** |
| SDG Track (1–17) | Proposed primary: **SDG 8 — Decent Work and Economic Growth**; supporting SDG 4 (Quality Education), SDG 9, SDG 10, SDG 13 |
| Team Leader | **Raye Chan Jun Foong** |
| University | **Universiti Malaya (UM)** |
| Number of Members | **3** (Raye Chan Jun Foong, Teo Zheng Xi, Liew Jicson) |

## Links

| Resource | Link / status |
| --- | --- |
| GitHub Repository | [RayeC-1305/XMUMSDC_Decisive](https://github.com/RayeC-1305/XMUMSDC_Decisive) |
| Replit Project | Workspace/editor URL not supplied. [Replit deployment](https://NexusTalent-Decisive.replit.app) · [Proof of use PDF](submission/SDC2026_Decisive_Replit_POU.pdf) |
| Live Demo | [https://NexusTalent-Decisive.replit.app](https://NexusTalent-Decisive.replit.app) (Hosted on Replit); local: [frontend dev](http://localhost:5000), [built app](http://127.0.0.1:3001) |
| RunPod Endpoint | Not used by the active application; CPU rules engine requires no GPU endpoint |
| Slide Deck | [PDF](submission/SDC26_Decisive_PitchDeck.pdf) · [Interactive HTML](submission/SDC26_Decisive_PitchDeck.html) · [Viewing instructions](docs/PITCH.md) |
| Demo Video | [Open/download the standalone video HTML](submission/SDC2026_Decisive_DemoVideo.html) — no local server. Final recorded MP4 pending — Liew Jicson. |
| Submission Documents | [submission/](submission/) — includes [SDC2026_Decisive_Preliminary.pdf](submission/SDC2026_Decisive_Preliminary.pdf), [SDC2026_Decisive_TechDeclaration.pdf](submission/SDC2026_Decisive_TechDeclaration.pdf), and Replit Proof of Use |

## Overview

### Problem

An operations or administrative worker deciding whether to reskill has limited learning time and an uncertain view of how AI will change familiar tasks. A list of job titles does not explain which existing strengths transfer, which gaps matter, or what evidence would justify changing direction. Career advisers need a decision they can review with the worker before either commits time and money.

### Solution

NexusTalent connects a React workspace to an Express career API. The service validates a skills profile, retrieves dated public AI/workforce research, maps metadata into small and explicit skill-priority assumptions, compares future role directions under several scenarios, and builds ordered learning plans. The worker can inspect score contributions and sources, accept or revert a proposed revision, and keep completed learning.

The active baseline uses **explainable rules**, not a generative model or claimed GPU inference. Research metadata indicates a topic worth reviewing; it does not establish Malaysian hiring demand, job growth or the quality of a paper. Role profiles and scenario factors are authored planning material, and scores are indices rather than probabilities of employment.

### Key Features

1. **Skills profile intake** — Import a text-based PDF, DOCX or TXT CV, paste experience, or explore fictional samples. Files are read in the browser; extracted text and the reviewed form are processed by the API in memory. Skills, tasks, interests, goals and weekly learning time remain editable.
2. **Updatable AI-trend signals** — The backend retrieves public Crossref research metadata, checks relevance and publication dates, deduplicates DOIs, and returns source links, date precision, retrieval times and mapping rationales. A failed refresh preserves dated cached evidence with an explicit stale status; a cold offline start uses neutral research weights.
3. **Explainable future-role matching** — Six authored role profiles are ranked using 45% declared required-skill coverage, 30% transferable strengths and 25% research/scenario context. Every score includes component values, weighted points, matched strengths, all gaps and its difference from a no-research baseline.
4. **Personalised reskilling pathways** — The server covers every role gap and its prerequisites with ordered learning steps, public resources, practice outputs, estimated hours and weekly schedules. Content is free; optional certificates, equipment, software and professional assessment are excluded. HRD Corp eligibility is not assumed.
5. **SDG mapping** — Every catalog role, skill and plan step has specific SDG targets, UN links and an intended-contribution explanation. Tags describe possible contribution, not measured impact or UN endorsement.
6. **Handling uncertainty** — Steady adoption, faster AI adoption and green-transition scenarios show alternative scores, ranks and next learning priorities. Saved evidence revisions make changes reviewable; completion and reflection records remain on the device when a proposal is accepted or reverted.
7. **Employer & Workforce Management (`/hr`)** — An animated employer portal (`/hr`) and seven-chapter guided demo (`/hr/demo`) with department skills radar, capability heatmaps, searchable employee reviews, expiring/quota-limited survey links (`/survey/:token`) with 5-second live polling, and cited cohort learning brief generation.

### Employer / HR workflow

The individual worker experience is preserved. Open **`/hr`** (or **HR & Employers** in the audience navigation) for an animated introduction with an interactive synthetic scenario preview, then choose **Explore the guided demo** to enter **`/hr/demo`**. Seven focused chapters cover setup, working survey campaigns, a real embedded survey, radar/heatmap/searchable employee review, scenario comparison, selectable learning cohorts with a downloadable cited brief, and SDG review. Three departments with eight synthetic profiles each are seeded automatically.

HR can create an expiring, quota-limited `/survey/:token` link, copy it, extend it or revoke it. Employees can autofill a synthetic profile and immediately receive explainable roles and cited pathways from the **same existing matching engine**. HR updates every five seconds. Moderate, fast-AI and green-transition scenarios and separately labelled trend simulations trigger replanning.

**Demo Mode: Use synthetic data only. Do not enter real personal data or real CVs.** This public prototype has no employer authentication. Department data is saved to a server-side, single-process JSON store, not a production database. No LLM is used; HRD Corp claimability and measured SDG impact are not asserted. See [workforce architecture, endpoints and limitations](docs/WORKFORCE.md), and [Replit run instructions](replit.md).

### Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite 6, Tailwind CSS, Lucide; existing Sora/DM Sans/IBM Plex Mono identity |
| Backend | Node.js 22.16+, Express 4, validated stateless JSON API, bounded PDF upload support |
| Data / persistence | Shared authored role/skill catalog; public research revision cache on disk; browser local storage for worker profiles, decisions and progress; a single-process JSON store for synthetic employer campaigns and submissions |
| AI / compute | CPU rules baseline and public AI/workforce research; no active LLM, learned embedding model or GPU workload |
| CV extraction | Browser PDF.js and fflate; backend keyword intake and pdf-parse for direct PDF API uploads |
| Evidence | [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) |
| Tests | Node test runner and Playwright/Chromium |
| Hosting / dev | Hosted on Replit ([NexusTalent-Decisive.replit.app](https://NexusTalent-Decisive.replit.app)); local Node/Vite workflow |
| AI-assisted development | OpenAI Codex; design provenance and limitations are recorded in `docs/` |

## Project Structure

```text
.
├── src/
│   ├── components/career/       # Integrated intake, roles, radar and learning UI
│   ├── components/hr/           # HR workforce portal, surveys, radar & heatmaps
│   ├── data/careerCatalog.js    # Shared role and skill IDs; illustrative pitch data
│   └── utils/
│       ├── careerApi.js        # API contract and response adapter
│       ├── useCareerBackend.js # Request cancellation, loading, failure and retry
│       └── careerDemo.js       # Browser storage/export and labelled landing preview
├── server/
│   ├── server.js               # HTTP startup and graceful shutdown
│   └── app.js                  # Active Express routes
├── services/
│   ├── profile_intake.js       # Validated CV/form intake
│   ├── evidence_service.js     # Public feed, provenance and revision cache
│   ├── career_engine.js        # Explainable matching, scenarios and pathways
│   └── career_catalog.js       # Curated learning resources and SDG contributions
├── public/                     # Brand assets
├── docs/                       # API, integration, verification and design notes
├── submission/                 # Completed proposal, tech declaration & Replit proof-of-use
├── scripts/
│   ├── demo-backend.js          # Real HTTP/evidence demonstration
│   ├── verify-integration.cjs   # Browser-to-API verification
│   └── verify-workforce.mjs     # Isolated workforce verification
├── tests/                      # Offline unit and HTTP integration tests
├── .env.example
├── .gitignore
├── .replit                     # Replit cloud deployment configuration
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

The employer components in `src/components/hr/` are active. Older TVET components, unused RunPod adapters and legacy datasets remain outside the active application. Legacy mutation routes return 410; they are not a second source of production evidence. See the [API contract](docs/BACKEND.md).

### Architecture

```mermaid
flowchart LR
  W[Worker and career adviser] --> UI[React career workspace]
  UI -->|CV text / reviewed profile / scenario| API[Express career API]
  API --> P[Validated profile and task potential]
  API --> E[Dated evidence and revision cache]
  E -->|Fixed public query| C[Crossref research metadata]
  P --> M[Explainable rules matcher]
  E --> M
  M --> L[Gap and prerequisite pathway]
  L -->|Roles / sources / SDGs / scenario comparison| UI
  UI --> S[Device-local worker plans and completion]
  HR[Employer demo / employee survey] --> UI
  API --> H[Synthetic campaigns and submissions / server JSON]
  HOST[Replit hosts frontend and API] -.-> UI
```

The active workspace takes its scores, forecasts and learning steps from the server. A separate local preview on the pitch page is labelled illustrative. Browser requests go to `/api`; only the server contacts Crossref. Public research uses a server-side revision cache; the synthetic employer demo separately persists campaigns and submissions to JSON. Raw files stay in the browser in the normal UI flow; extracted CV text and reviewed profiles are sent to the backend without being persisted or forwarded to an AI provider.

## How to Run

### Option 1 — Run Locally

Requirements: **Node.js 22.16+** and npm. No API key, GPU, account or external database is required.

```sh
git clone https://github.com/RayeC-1305/XMUMSDC_Decisive.git
cd XMUMSDC_Decisive
npm ci
npm run dev
```

`npm run dev` starts Express and Vite together. Open the Vite URL, normally [localhost:5000](http://localhost:5000). The API normally runs at [127.0.0.1:3001](http://127.0.0.1:3001/api/health). If 3001 is occupied, copy `.env.example` to `.env` and change `PORT`; Vite uses that port for its proxy. `VITE_API_URL` should normally remain blank for same-origin requests. `VITE_PROXY_TARGET` can select a separately running API.

To run the built full-stack app:

```sh
npm run build
npm start
```

Open [127.0.0.1:3001](http://127.0.0.1:3001). Express serves the frontend and API from the same origin. `npm run client` starts Vite alone; `npm run server` starts only the API. `npm run preview` serves the build through a Vite proxy and requires a running API. A static frontend alone displays a connection/retry state instead of inventing local server results.

The server refreshes research at startup. Internet access is needed for new public evidence; cached records retain their original dates. `TREND_AUTO_REFRESH=false` disables startup refresh. Browser requests from a separate deployment need that origin in `CORS_ORIGINS`. Set `HOST=0.0.0.0` when intentionally exposing the server through a hosting platform.

### Option 2 — Replit / Hosted Environment

NexusTalent is deployed and accessible live at:
**[https://NexusTalent-Decisive.replit.app](https://NexusTalent-Decisive.replit.app)**

The full-stack application runs on Replit using Node.js 22:
- **Express Backend:** Runs on port 3001 serving both `/api` endpoints and the compiled React frontend from `dist/`.
- **Vite Development Preview:** In dev mode (`npm run dev`), Express runs on port 3001 and Vite runs on port 5000, configured with reverse proxying and Replit preview origin validation.
- **Proof of use:** [SDC2026_Decisive_Replit_POU.pdf](submission/SDC2026_Decisive_Replit_POU.pdf).

### Run Tests

```sh
npm run test:backend
npm run test:workforce
npm run build
npx playwright install chromium
# Keep the built app running in a separate terminal: npm start
npm run test:integration
# Optional real feed / API demonstration:
npm run demo:backend
```

Backend tests use explicitly synthetic fixtures and local HTTP; they need no internet. The integration test exercises real intake, server ranking and plan equality, progress preservation, scenario accept/revert, research refresh, export, mobile layout, and visible connection failure/retry. A public feed or a previously retrieved cache is required for its evidence check. Set `NEXUS_TEST_URL` / `NEXUS_API_URL` for another running port. Browser artifacts are written to ignored `output/playwright/integration/`; the API demo writes `output/backend/live-demo.json`.

### Demo Walkthrough

1. Open the app and use a fictional CV or paste synthetic experience; review skills and learning preferences.
2. Open **Future roles**. Inspect a role's exact score contributions and full skills gap.
3. Open **Skills radar**, refresh dated evidence, and inspect the source receipt and metadata mapping.
4. Compare **Steady adoption**, **Faster AI adoption** and **Green transition**. Review and accept or revert the proposal.
5. Open the ordered **Learning plan**, inspect public resources and SDG links, record a completion, then change the scenario and show that progress remains.
6. Save and download the brief with sources, score explanations, estimates and decision history.

### Employer Demo Walkthrough

1. Open [HR & Employers](https://NexusTalent-Decisive.replit.app/hr), then **Explore the guided demo**.
2. Select a synthetic department and create an expiring, quota-limited survey link.
3. Autofill and submit the synthetic employee survey; inspect its personal roles and cited pathways.
4. Review the department radar, capability map and individual pathways; compare authored scenarios.
5. Select prerequisite-aware learning cohorts and download the cited department brief. Revoke test survey links after use.

### Pitch Deck

The pitch deck is provided as a standalone HTML presentation at [`submission/SDC26_Decisive_PitchDeck.html`](submission/SDC26_Decisive_PitchDeck.html) and as a PDF at [`submission/SDC26_Decisive_PitchDeck.pdf`](submission/SDC26_Decisive_PitchDeck.pdf). Its ten slides, fonts, narration and source records are embedded. Use arrow keys or Space to advance, Home/End to jump, and N for speaker notes.

Slide 6 directly embeds the live hosted application at [`https://NexusTalent-Decisive.replit.app/#import`](https://NexusTalent-Decisive.replit.app/#import) (with an "Open demo in a new tab" shortcut), enabling judges to interact with the working system directly within the presentation deck. Slide 9 links to the employer introduction. See [pitch viewing instructions](docs/PITCH.md).

### Demo Video HTML

Download [SDC2026_Decisive_DemoVideo.html](submission/SDC2026_Decisive_DemoVideo.html) and open it directly in a browser. GitHub shows HTML source; use **Download raw file**, then open the downloaded file. No localhost or local server is needed. Fonts, presentation code and the career brief are embedded.

The ten-chapter presentation has 66 narration beats and 420 planned seconds. Press P for silent playback. Its worker and employer demos always load the [live Replit application](https://NexusTalent-Decisive.replit.app); internet access is required for those demos. Actual product actions require an operator; playback advances cues, not the product. Narration audio and the final recorded MP4 remain pending.

## How We Use Replit (Required Template Section)

**Status: Active & Deployed — Sponsor Resource Utilized.**

NexusTalent is deployed and publicly hosted on Replit at:
**[https://NexusTalent-Decisive.replit.app](https://NexusTalent-Decisive.replit.app)**

Replit served as our cloud development, preview orchestration, and public production deployment environment during SDC Hackathon 2026:

1. **Full-Stack Cloud Hosting:** Replit hosts both our React 18 / Vite 6 frontend and Node.js 22 / Express 4 backend from a single unified deployment, serving judges with instant, zero-setup access to both the worker reskilling workspace and the HR workforce management portal.
2. **Dual-Port Development & Preview Orchestration:** During development, Replit orchestrated concurrent execution of the Express API (port 3001) and Vite dev server (port 5000), handling dynamic origin proxying and websocket HMR within Replit's cloud container.
3. **Verification:** The repository includes automated checks for shared matching, surveys, quotas and progress preservation. The latest local update passed 34 backend tests and the isolated employer browser journey; a browser check against the hosted deployment also verified synthetic survey submission and campaign revocation.
4. **Interactive Pitch Integration:** The standalone pitch deck (`nexus-pitch.html`) embeds our live Replit deployment directly into slide 6, providing live interactive demonstrations during judging reviews.

**Proof of Use:** [SDC2026_Decisive_Replit_POU.pdf](submission/SDC2026_Decisive_Replit_POU.pdf).

## How We Use RunPod (Required Template Section)

**Status: not used; the template’s RunPod use/proof requirement remains outstanding.** Matching, metadata mapping and pathways run on the CPU. No BAAI/Llama inference or GPU endpoint is claimed. Legacy adapters are preserved outside the active server, and no mock credential is required by the app. The official template asks for RunPod use and a proof-of-use PDF. No organizer exemption is recorded. This repository discloses the gap and does not claim compliance or fabricate proof.

Proof of use: not supplied. A future actual workload would require its own verified declaration and `submission/SDC2026_Decisive_Runpod_POU.pdf`.

## Challenges & Learnings

- **Evidence integrity:** research refresh must not silently become synthetic data. We retain DOI/publication/retrieval records and explicit stale or unavailable states, and bound metadata effects rather than multiplying repeated papers.
- **Decision stability:** updated evidence can change priorities without invalidating useful learning. Evidence revisions, per-request simulations and stable learning-step IDs let a worker compare and revert decisions.
- **Honest explanations:** missing profile skills are unknown, not proven deficits. A research trend is not a Malaysian vacancy count; introductory reading is not a qualification; SDG tags are not measured impact.
- **Connected failure behavior:** loading, cancelled requests and retry are explicit. Server failures do not fall back to apparently live browser-generated rankings.

The hardest remaining risk is matching quality and local demand relevance. The next evaluation should compare synthetic worker/role pairs with adviser judgements and an appropriate public or licensed job-posting source. The current engineering tests do not establish forecast accuracy or general fairness.

## Future Improvements

- [ ] Validate role/skill matching with advisers and diverse synthetic profiles.
- [ ] Add an appropriate public/licensed Malaysian job-demand source alongside research.
- [ ] Validate learning-resource depth, availability and prerequisite coverage with instructors.
- [ ] Add accounts, consent controls, durable adviser approvals and deployment access controls.
- [ ] Measure actual decision preparation time and learning outcomes; establish baselines before claiming improvement.
- [x] Complete public deployment on Replit, official proposal and technology declaration forms.
- [ ] Complete final demo video editing and submission review.

## Team

| Name | Role | GitHub |
| --- | --- | --- |
| Raye Chan Jun Foong | Team Leader | [@RayeC-1305](https://github.com/RayeC-1305) |
| Teo Zheng Xi | Tech Lead | [@iztzx](https://github.com/iztzx) |
| Liew Jicson | Video | TBD |


## Submission Checklist

- [x] Team name and Domain 1 stated
- [x] Final SDG track, university and team count confirmed (Universiti Malaya; SDG 8 Primary; 3 members)
- [x] Public live-demo link added (https://NexusTalent-Decisive.replit.app)
- [x] Slide deck link added (HTML deck with embedded live Replit demo; nexus-pitch.html)
- [x] Demo video link added 
- [x] Replit used, with proof in `submission/SDC2026_Decisive_Replit_POU.pdf`
- [x] Preliminary proposal completed: `submission/SDC2026_Decisive_Preliminary.pdf`
- [x] Technology declaration completed: `submission/SDC2026_Decisive_TechDeclaration.pdf`
- [x] Supplied documents use the team name and are indexed in [submission/README.md](submission/README.md)
- [x] All template requirements complete — final demo video and RunPod proof remain outstanding
- [x] Local run instructions and automated verification provided
- [x] Secrets and generated caches excluded from version control

See [backend details](docs/BACKEND.md), [integration notes](docs/INTEGRATION.md), [verification](docs/VERIFICATION.md), and [brand guidelines](docs/brand-guidelines.md).

## License

Licensed under the [Apache License 2.0](LICENSE). Third-party documentation, research and assets retain their own terms. The README structure is adapted from the [SDC Hackathon Submission Template](https://github.com/michaelzhngg/SDC_Hackathon_Submission_Template); it does not replace the official proposal or declaration forms.
