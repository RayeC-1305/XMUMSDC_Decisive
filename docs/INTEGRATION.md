# Connected workspace

The active React application uses the Express backend for intake, ranking, skill outlooks, scenario comparisons and complete learning pathways. Its local model is retained only for the labelled illustrative pitch preview.

`careerApi.js` defines the request/response adapter. `useCareerBackend.js` cancels obsolete requests and exposes loading, connection errors and retry. The active workspace renders scores only from a matching server response; it does not substitute local ranking on failure. Browser CV files are extracted locally; the extracted text and reviewed form go to `/api/intake` for in-memory processing. Raw files are not uploaded through the UI, and profile data is not written to the server cache.

`POST /api/transition` returns every role's pathway, keeping the role list, comparisons and selected plan consistent in one response. Goal, interest, pace, scenario, completed step IDs and personal simulations are request inputs. All custom signals are validated, bounded simulations; they remain separate from public research records and do not change another user's results.

Up to 20 public evidence revisions persist in the server cache. Requests can select an `evidenceRevision` when restoring a saved plan or reverting an update. `none` selects neutral research weights. An unavailable historical revision returns 409 with a visible recovery action to use current evidence, rather than silently replacing the original sources. Cache schema 1 is read and migrated on the next successful refresh.

Plans, revisions, reflections and completion stay in browser storage. Storage schema 3 migrates earlier completion IDs into stable shared skill IDs. Browser-only scores and pending proposals from the earlier prototype are not treated as server results. Changing learning pace recomputes the remaining schedule on the backend; completion is self-reported, not a proficiency claim.

Development: `npm run dev` starts both services. Vite development and preview proxy `/api` to `PORT` (default 3001), overridable by `VITE_PROXY_TARGET`. `npm run build` followed by `npm start` serves the frontend and API from one origin. `VITE_API_URL` is only needed for a deliberately separate API origin and is blank by default.

Verification: `npm run test:backend`, `npm run build`, then `npm run test:integration` against the running app. Install Chromium with `npx playwright install chromium`. Set `NEXUS_TEST_URL` for a non-default port; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` optionally selects an existing Chromium installation. The integration script records exact API/displayed-score agreement, pathways, scenario accept/revert, completion, source mappings, export, mobile layout and connection failure/retry.
