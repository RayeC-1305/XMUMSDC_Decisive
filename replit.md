# NexusTalent — imported React / Express project

## Run and verify

- Node.js **22.16+** and npm; preserve the existing single-package repository and stack.
- Run button / `npm run dev` starts Express on **3001** and Vite on **5000**, bound for Replit preview. Vite proxies relative `/api` requests to Express; it accepts proxied preview hosts.
- `npm run build` builds `dist/`. `npm start` serves the built frontend and API from Express; its default port is 3001 and `HOST` / `PORT` may be set by the runtime.
- No model key, GPU, external database or login is needed for this synthetic hackathon demo. `SESSION_SECRET` is not used; do not invent credentials.
- `npm test`: unit + HTTP suites, including quota concurrency, restart persistence, matching equivalence, scenarios and SDG/cohort aggregation.
- `npm run build && npm run test:workforce`: isolated browser journey, using a temporary disk store and real HTTP endpoints; does not modify the running demo's data. Uses `REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE` when available.
- `NEXUS_TEST_URL=https://<development-domain> PLAYWRIGHT_CHROMIUM_EXECUTABLE=<browser-path> npm run test:integration`: original worker browser regression. The script also accepts the Replit-provided browser path via its explicit environment override.
- Browser screenshots/test outputs are in ignored `output/playwright/`; downloaded browsers are ignored. Do not commit generated assets or dependencies.

## Routes and persistence

- `/` and existing hash routes: unchanged worker application, with an HR audience link.
- `/hr`: employer landing page introducing the workflow, with a **Start guided demo** link.
- `/hr/demo`: seven guided chapters for setup, invitations, real employee responses, skills analysis, scenario comparison, learning plans and SDG review. Chapters use URL hashes and Previous/Next controls; selected campaign, scope and scenario persist in session storage. The embedded survey reuses the public survey component and updates the real dashboard after submission.
- `/survey/:token`: synthetic employee survey and immediate individual analysis.
- `services/workforce_service.js` and `server/workforce_routes.js` extend the existing `/api` service. Matching and pathway generation reuse `services/career_engine.js`; they do not replace the worker engine.
- Individual intake/match endpoints remain stateless. Existing worker profiles/progress remain in browser local storage.
- Department campaigns, **synthetic** employee profiles, self-ratings, custom review skills and simulation state persist in `data/workforce/demo.json`, with atomic replacement. The store is seeded once with three departments and eight profiles each.
- Research uses the existing dated Crossref metadata cache in `data/cache/`. A failed refresh never invents sources. Simulated weights remain separately labelled assumptions.

## Scope and safety

- **Public, synthetic-only hackathon demo, not a production-secured employer system.** HR endpoints have no identity/tenant authorization; never enter real employee information or CVs.
- JSON storage survives a restart on the same filesystem. It is **single-process** storage, not a shared database, and does not guarantee durability across publishing, replacement instances, or autoscaling. Add protected HR access and durable storage before real employer use.
- Survey tokens are cryptographically random; expiry, quotas and revocation are enforced server-side, including a final synchronous quota check after asynchronous evidence retrieval.
- No LLM is used. Matching remains 45% declared role skills, 30% transferable potential, and 25% research/scenario context. Self-ratings affect only the transparent heatmap/exposure planning proxy, not role scores.
- Rapid scenarios assume 1.5× protected learning hours per week, capped at 40; HR must approve that capacity. Scenario exposure scores are not job-loss probabilities.
- Courses are curated, cited public reading/practice; dates are catalog dates, not live availability checks. HRD Corp eligibility and optional certificates are **not verified**.
- SDG views count distinct synthetic participants per target, across top-role and pathway mappings. A person may count toward several targets. All 17 goals are visible; unmapped goals remain explicitly unmapped rather than claiming fabricated impact.
- Preserve synthetic-data notices, demographic-blind scoring, human-review guidance, and bans on automated hiring/firing/performance penalties.
