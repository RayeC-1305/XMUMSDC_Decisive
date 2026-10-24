# Connected application verification

## Submission push verification — 24 October 2026

The latest source passes the production build and all **18 backend tests**. The existing browser integration suite also passes against the built full-stack app at port 3201, with **13 API requests** and **12 live evidence sources**. It covers reviewed intake, server/UI score agreement, ordered plans, retained completion, scenario accept/revert, save/restore, export, mobile overflow and connection failure/retry. These checks verify application behavior; they do not validate career forecasts or employment outcomes.

This run used an already installed Chromium through `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, since the browser revision expected by the local Playwright installation was absent. The standard browser installation command below remains the portable setup. The build and HTTP/cache tests required sandbox escalation in this environment.

The submission README now links the self-contained HTML pitch and its viewing instructions. Selected fictional pitch records and fonts are versioned; process logs, caches, screenshots, temporary renderers and historical proof outputs are excluded. Official submission PDFs, public deployment, demo video and sponsor proof remain pending.

## Motion and UX refresh — 24 October 2026

The approved Patensify-inspired refresh preserves the product contracts and adds a stronger moving narrative. `npm run build` passes. The existing `scripts/verify-integration.cjs` journey passed against the Vite preview at port 5173 with 15 API requests and a live 12-record evidence batch. This run verifies intake, displayed/API score agreement, scenarios, ordered pathways, retained progress, save/restore, export and failure recovery.

`scratch/capture_motion.cjs` checks the actual rendered motion: role cycling while visible; zero running loops after pause; changing scroll-linked inputs; a green-transition proposal with a retained foundation; accept/reset; focus in the actual intake; 375px landing/intake widths without horizontal overflow; reduced motion with zero running animations; and live preference changes. Desktop 1440×1000 and mobile 375×812 captures plus a moving preview are in ignored `output/playwright/motion/`. Interaction feedback may briefly finish after pausing; looping art stops.

The visual pass also corrects mobile navigation focus and moves the pause control into the narrow-screen header so it cannot cover role controls. The recording uses fictional profile data. These checks establish behavior and rendering, not career prediction accuracy.

The current acceptance flow is browser → Express intake → dated evidence → explainable ranking → scenario comparison → ordered pathway → saved decision and completion → export.

## Checks

- `npm run test:backend`: **18 tests pass**. Coverage includes real local HTTP, actual PDF parsing, validated input, live-feed schema/date/relevance checks, bounded and duplicate-safe scores, timeouts and stale fallback, all role gaps/prerequisites and SDG mappings, historical evidence restoration after restart, and isolation of personal simulations.
- `npm run build`: production build passes using Vite 6 and the patched dependency set.
- `npm run test:integration`: the connected production app passes the Playwright journey. Displayed role scores exactly match the API response. The same response supplies every role's learning steps. CV text and reviewed form reach `/api/intake`; only the server calls Crossref.
- The browser test refreshes real research and checks DOI, publication date and retrieval provenance. The observed run retrieved **12 sources**. It inspects source mapping reasons and keeps simulations separate from research.
- Scenario accept/revert, saved plans, completion preservation, Markdown export and reload persistence pass. A forced API connection failure displays a retry screen, disables export, and recovers without a local-score fallback.
- Desktop at 1440×1000 and mobile at 390×844 were visually inspected. The mobile document has no horizontal overflow.
- `npm audit`: **0 vulnerabilities** after compatible Vite/fflate patches and a patched PostCSS parser override.

The integration check used the built application at port 3102 because another process occupied 3001. Set `NEXUS_TEST_URL` to select your running port. Local HTTP, process launch and atomic cache writes needed sandbox escalation in this Codex environment; ordinary local development does not have those restrictions.

## Reproduce

```sh
npm ci
npm run test:backend
npm run build
npx playwright install chromium
# Separate terminal:
npm start
# Original terminal:
npm run test:integration
```

The integration test needs a reachable public feed or a dated cache from an earlier successful retrieval. The backend suite uses explicitly synthetic fixtures and does not require internet. No fixture is installed as a production evidence fallback.

Artifacts: ignored `output/playwright/integration/report.json`, desktop/mobile PNGs and a downloaded brief. The API-only demonstration writes `output/backend/live-demo.json`. These machine-specific outputs and public-feed caches are excluded from commits.

Earlier `scratch/verify_*.cjs` scripts document the former browser-only prototype and contain machine-specific paths; they are not the current integration acceptance suite. The pitch preview remains illustrative. Tests establish engineering behavior, not career forecast accuracy, broad fairness, accreditation or measured SDG impact. Public deployment, official forms and sponsor proof remain team submission work.
