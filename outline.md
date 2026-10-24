# Nexus video development plan

> **Theme:** custom Nexus identity specified by the user; Sora / DM Sans / IBM Plex Mono, supplied colour tokens.
> **Stage:** fixed 1920 × 1080, proportionally scaled; at least 80px safe margins; one consistent midnight stage surface across all chapters. Paper/ice are evidence surfaces inside the stage.
> **Timing:** approximately six minutes, including demonstration pauses; 724 English words across 10 chapters / 52 initial beats. Planned chapter time totals 360 seconds. Rehearsal should use roughly 129 words/minute plus about 24 seconds of demo dwell; this is a working estimate, not an event rule.
> **Sources:** script.md sets spoken order; article.md supplies detail; output/pitch/pitch-data.json and the HTML’s nexus-pitch-data contain aligned narration, source IDs, asset records and captured values.
> **Scope:** source preparation complete; later chapter build, voice audio and finished video are outside this run.

## Recording-scene requirements

The deck and video tell the same pitch. The deck supplies the visual backbone; video chapters adapt each slide's main relationship into focused scenes without changing the story, claim status or evidence. Use this shared requirement map:

| Requirement | Deck / video chapters | Narrative role |
| --- | --- | --- |
| Problem | 02 | A worker must choose what to learn with limited time and changing planning assumptions. |
| Proposed solution | 03, 04, 05, 06, 07 | Review experience, explain role directions and evidence, build a practical plan, and revisit it while retaining completed learning. |
| Technical approach | 08 | React/Vite browser workspace, Express career API, explainable CPU rules, Crossref metadata and device-local progress; slides 4–5 explain the scoring and evidence method. |
| Expected impact | 09 | Intended clearer next steps, traceable advice, useful revisions and visible learning, tested through a proposed adviser pilot; no measured outcomes claimed. |

Rebuild the story as full-screen click-driven scenes using native typography and diagrams. Use one dedicated scene for the live HTML demo. Do not use product screenshots or animate deck captures. One spoken beat equals one focused step. Lists must be revealed one item per step; the scoring weights and pilot measures already have separate beats. Remove deck headers, footers, page numbers and persistent brand bars from recording scenes. Keep relevant evidence/status labels readable when needed. Every chapter needs a meaningful visual demonstration using the verified relationships: score contributions, metadata mapping, changed priority and retained completion. Do not invent figures or imitate unavailable product states. This plan defines content and pacing, leaving animation choices to chapter development.

The later chapter narrations.ts is the implementation source of truth for step counts and optional audio. If a beat is divided, synchronize script.md, outline.md, chapter registry and narration arrays before recording. Preserve all material limits and the verified scenario sequence.

## Pending checkpoints for the later run

1. **Plan checkpoint:** review the script and outline, confirm the specified custom Nexus theme, confirm source assets, and select development mode. This run deliberately leaves that build checkpoint pending. Theme alternatives are unnecessary unless the user requests a change to the established identity.
2. **First-chapter checkpoint:** the main thread builds a complete first chapter with real assets and a meaningful demonstration; wait for user review before building further chapters. Later mode options are chapter-by-chapter review, sequential build after chapter 1, or user-authorized parallel build.
3. **Audio checkpoint:** after web chapters are complete, ask whether voice synthesis is wanted. No audio has been generated or approved in this run.

## 1. opening — Plans evolve. Progress stays. (2 steps · ~15s)

**Deck mapping:** slide-01-opening. **Narrative role:** Opening. **Narration mapping:** script beats 1–2, in order. **Source IDs:** R01, R07, D01.

**Information pool:**

- Identity: NexusTalent is branded nexus; Team Decisive, SDC Hackathon 2026, Domain 1 — article §1.
- Purpose: review a reskilling decision with a worker and adviser — article §1.
- Proof: one completed learning step survives the accepted scenario revision — article §3.

**Focused screen plan:**

- Step 1 (~7s; beat 1) — The Nexus wordmark and core message share the stage with native typography about changing priorities and retained progress.
- Step 2 (~8s; beat 2) — The changed priority and retained completion establish the decision the story will explain.

**Production pacing:** Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “Plans evolve. Progress stays. Nexus is a reviewable reskilling workspace for workers and career advisers.”

## 2. workers-decision — The problem is choosing what to learn next (3 steps · ~30s)

**Deck mapping:** slide-02-workers-decision. **Narrative role:** Problem. **Narration mapping:** script beats 3–5, in order. **Source IDs:** R04, D01.

**Information pool:**

- Problem framing: choosing a worthwhile next step under a limited learning budget and changing assumptions — article §0.
- Fictional input: Siti’s five catalog skills and three tasks are unchanged from the sample — article §2.
- Preference: four hours/week and Explore a new direction are demo choices — article §2.
- Decision: missing skill declarations require review rather than an inability judgement — article §2.

**Focused screen plan:**

- Step 1 (~11s; beat 3) — The problem headline connects a finite learning budget to changing career-planning assumptions.
- Step 2 (~11s; beat 4) — Siti’s fictional operations tasks connect to reviewed skills and the four-hours/week demo preference.
- Step 3 (~8s; beat 5) — The worker’s decision isolates transferable strengths, gaps and a reason to reconsider.

**Production pacing:** Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “The problem is choosing a worthwhile next learning step when time is limited and the assumptions behind a career direction can change.”

## 3. product-loop — A reviewable reskilling workspace (4 steps · ~30s)

**Deck mapping:** slide-03-product-loop. **Narrative role:** Proposed solution. **Narration mapping:** script beats 6–9, in order. **Source IDs:** R03, R05, D01.

**Information pool:**

- Outputs: reviewed profile, ranked roles, provenance, pathway, revision and completion record — article §1.
- Choice: accept and keep-previous-view actions exist in the active application — article §3.
- Continuity: skill:dataQuality is a stable completion ID — article §3.

**Focused screen plan:**

- Step 1 (~5s; beat 6) — Reviewed profile and six role directions form the first part of the connected journey.
- Step 2 (~8s; beat 7) — The source receipt connects to the ordered gap-and-prerequisite learning plan.
- Step 3 (~8s; beat 8) — Native diagram labels connect reviewable revisions to Accept & update my plan and Keep previous view.
- Step 4 (~9s; beat 9) — The stable data-quality step ID connects retained completion back to the next decision.

**Production pacing:** Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “Our solution begins with Siti’s reviewed experience and six authored role directions.”

## 4. explainable-directions — Every match has a reason (7 steps · ~45s)

**Deck mapping:** slide-04-explainable-directions. **Narrative role:** Proposed solution. **Narration mapping:** script beats 10–16, in order. **Source IDs:** R02, R04, D01.

**Information pool:**

- Captured result: Financial data analyst ranks 3, score 60.68 — article §2.
- Model structure: 45%/30%/25%; component values 40/100/50.7; points 18/30/12.68 — article §2.
- Gaps: data quality, analytics and SQL; bridge skills include declared document processing — article §2.

**Focused screen plan:**

- Step 1 (~12s; beat 10) — A native typographic result identifies Financial data analyst, historical captured rank 3 and index 60.68/100.
- Step 2 (~7s; beat 11) — The reviewed skills connect to two required matches and the three remaining gaps.
- Step 3 (~5s; beat 12) — The model composition isolates the 45% weight for declared required-skill coverage.
- Step 4 (~3s; beat 13) — The 30% weight connects to transferable strengths.
- Step 5 (~4s; beat 14) — The 25% weight connects to research and scenario context.
- Step 6 (~6s; beat 15) — Component values 40, 100 and 50.7 connect to weighted points 18 + 30 + 12.68 = 60.68.
- Step 7 (~8s; beat 16) — The score remains labelled an index and the unconfirmed gaps remain review prompts.

**Production pacing:** Each scoring weight has its own beat. Preserve their order and the same index-point explanation; do not convert weights into an outcomes chart.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “We select Financial data analyst, one direction for discussion. It ranks third in this captured steady-adoption result, with a match index of sixty point six eight.”

## 5. evidence-and-assumptions — The source behind the signal (5 steps · ~40s)

**Deck mapping:** slide-05-evidence-and-assumptions. **Narrative role:** Proposed solution. **Narration mapping:** script beats 17–21, in order. **Source IDs:** R06, D01, X01, X02.

**Information pool:**

- Record: Towards Responsible Artificial Intelligence (AI): An Analysis of AI Policies in Selected Low- and Middle-Income Countries; OUP; 2026-10-23 — article §4.
- Receipt: revision 947afd1b22fcbef5; retrieved 2026-10-23T16:03:29.729Z; stale at capture — article §4.
- Assumption: metadata term validat maps to dataQuality 1.04; no research-quality or local-demand verification — article §4.

**Focused screen plan:**

- Step 1 (~11s; beat 17) — A native bibliographic record shows the OUP title, publisher and publication date retrieved through Crossref.
- Step 2 (~4s; beat 18) — The stale-cache label and retrieval time 24 October 2026, 00:03:29 MYT stay beside the receipt.
- Step 3 (~7s; beat 19) — The matched metadata term validat connects to the authored data-quality factor 1.04×.
- Step 4 (~12s; beat 20) — Retrieved metadata and the Nexus mapping assumption occupy distinct labelled areas.
- Step 5 (~6s; beat 21) — An unchanged revision remains unchanged rather than implying every refresh creates a new signal.

**Production pacing:** Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “In Skills radar, this receipt identifies the title, publisher, publication date and retrieval time for an actual source in the same evidence revision.”

## 6. reviewable-change — A new direction. Your learning stays. (7 steps · ~55s)

**Deck mapping:** slide-06-reviewable-change. **Narrative role:** Proposed solution. **Narration mapping:** script beats 22–28, in order. **Source IDs:** R03, R05, D01.

**Information pool:**

- Initial order: dataQuality → analytics → sql → portfolio:financial; total 48 estimated hours — article §3.
- Scenario: steady → rapid, fixed public revision and no personal simulation inputs — article §3.
- Verified: accept, reload and separate proposal revert all preserve the self-reported completion — article §3.

**Focused screen plan:**

- Step 1 (~9s; beat 22) — The steady-adoption plan starts with Practise Data quality & validation before analytics and SQL.
- Step 2 (~6s; beat 23) — The real Mark step complete action records skill:dataQuality as a demo completion.
- Step 3 (~8s; beat 24) — The Faster AI adoption control proposes an authored scenario using the same profile, role and evidence revision.
- Step 4 (~10s; beat 25) — The actual review comparison shows 60.68 → 63.08 and Data quality & validation → SQL & data querying.
- Step 5 (~7s; beat 26) — The review proof isolates four retained steps and the unchanged completed step ID.
- Step 6 (~5s; beat 27) — The accepted plan and a browser reload both display the same completed data-quality step.
- Step 7 (~10s; beat 28) — The separate Green transition proposal’s Keep previous view action returns to Faster AI adoption with completion retained.

**Production pacing:** Allow deliberate dwell on marking complete, the changed priority, acceptance, reload and the separate revert test; retain the authored-scenario label.

**Asset checklist:**

- Ready — live-demo: http://127.0.0.1:3201/#import.
- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “Here is the change we verified. Siti starts with a plan whose first priority is data quality and validation.”

## 7. practical-next-step — A plan you can act on (6 steps · ~45s)

**Deck mapping:** slide-07-practical-next-step. **Narrative role:** Proposed solution. **Narration mapping:** script beats 29–34, in order. **Source IDs:** R02, R04, D01, X03, X04, X05.

**Information pool:**

- SQL: 16 estimated hours, spreadsheets prerequisite already met, public Microsoft Learn path — article §5.
- Remaining schedule: 40 hours, 10 weeks at 4h/week after one 8-hour demo completion — article §5.
- SDG 4.4 and 8.2 are intended contributions; content excludes optional costs; completion is self-reported — article §5.

**Focused screen plan:**

- Step 1 (~4s; beat 29) — Native typography identifies the SQL learning step, with a direct link to its public resource.
- Step 2 (~8s; beat 30) — Declared spreadsheet experience satisfies the catalog prerequisite and connects to the Microsoft Learn resource.
- Step 3 (~11s; beat 31) — The exact practice output and the 16-hour planning estimate connect four hours/week to weeks 1–4.
- Step 4 (~7s; beat 32) — The accepted schedule continues with analytics in weeks 5–8 and work-sample review in weeks 9–10.
- Step 5 (~6s; beat 33) — The real exported Markdown brief carries the scenario, sources, completed step and intended SDG contribution.
- Step 6 (~9s; beat 34) — The resource-cost and qualification disclosures remain beside the public-resource action.

**Production pacing:** Give the resource and practice output time to read, then dwell on the actual brief download; hours are authored estimates.

**Asset checklist:**

- Ready — siti-career-brief: output/pitch/siti-career-brief.md.
- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “The next step is concrete: practise SQL and data querying.”

## 8. working-prototype — From CV to decision, with explainable rules (5 steps · ~30s)

**Deck mapping:** slide-08-working-prototype. **Narrative role:** Technical approach. **Narration mapping:** script beats 35–39, in order. **Source IDs:** R01, R02, R03, R05, R06.

**Information pool:**

- Implemented: React/Vite, Express API, CPU rules, public cache and browser local storage — article §1.
- Privacy boundary: UI files in browser; extracted text/profile in API memory; no cloud workspace — article §1.
- Validation boundary: working engineering flow does not prove forecasting accuracy, fairness or employment outcomes — article §6.

**Focused screen plan:**

- Step 1 (~4s; beat 35) — A single architecture view connects the React/Vite browser workspace to the Express career API.
- Step 2 (~6s; beat 36) — The CPU rules and public Crossref research cache explain where roles, evidence and pathways come from.
- Step 3 (~9s; beat 37) — Original CV bytes remain in the browser while extracted text and the reviewed profile cross the API boundary.
- Step 4 (~6s; beat 38) — Saved decisions and progress remain in device-local storage, with no active LLM or GPU.
- Step 5 (~5s; beat 39) — The working flow remains distinct from next validation of forecast accuracy, fairness and outcomes.

**Production pacing:** Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “This prototype links a React workspace to an Express career API.”

## 9. buyer-and-pilot — Expected impact, measured in a pilot (8 steps · ~40s)

**Deck mapping:** slide-09-buyer-and-pilot. **Narrative role:** Expected impact. **Narration mapping:** script beats 40–47, in order. **Source IDs:** R01, R07, P01.

**Information pool:**

- Expected impact: intended clearer next actions, traceable advice, useful revisions and reviewable learning — article §6.
- Buyer/model: hypothesis only, organisational subscription per active advised learner, price unvalidated — article §6.
- Measurement: time to agreed action, source validity, revision usefulness and completed work samples — article §6.
- Proposed scope: one adviser team, two review sessions; baselines pending, no customers or outcomes claimed — article §6.

**Focused screen plan:**

- Step 1 (~6s; beat 40) — The expected-impact headline connects clearer choices, reviewable advice and retained progress as intended benefits.
- Step 2 (~4s; beat 41) — Workers and advisers are identified beside the proposed one-team, two-session pilot scope.
- Step 3 (~6s; beat 42) — Clearer next steps connect to time until an adviser-agreed action.
- Step 4 (~4s; beat 43) — Traceable advice connects to checking the validity of each source used.
- Step 5 (~4s; beat 44) — Useful revisions connect to reasons for accepting or reverting a change.
- Step 6 (~4s; beat 45) — Visible learning connects to an adviser reviewing a completed practice work sample.
- Step 7 (~7s; beat 46) — The initial Malaysian career-centre/provider buyer hypothesis and unvalidated subscription model remain subordinate.
- Step 8 (~5s; beat 47) — The expected-benefit limitation stays visible: baselines pending and no measured employment or impact results.

**Production pacing:** Each pilot measure has its own beat. All targets remain proposed; no baseline is invented.

**Asset checklist:**

- Ready — demo-proof: output/pitch/demo-proof.json.

**Spoken excerpt:** “We expect Nexus to support clearer choices, reviewable advice and continuity of learning.”

## 10. team-and-invitation — Make the next learning decision reviewable (5 steps · ~30s)

**Deck mapping:** slide-10-team-and-invitation. **Narrative role:** Invitation. **Narration mapping:** script beats 48–52, in order. **Source IDs:** R01, R07, D01, P01.

**Information pool:**

- Team: names and roles are verified in README.md — article §7.
- Deployment: repository lists public demo TBD; no verified public URL or QR is supplied — article §7.
- Invitation: validate a sample transition decision with an adviser team, carrying the completed step into the real brief — article §3, §5–7.

**Focused screen plan:**

- Step 1 (~6s; beat 48) — Raye Chan Jun Foong appears with the verified role Team leader.
- Step 2 (~3s; beat 49) — Teo Zheng Xi appears with the verified role Tech lead.
- Step 3 (~3s; beat 50) — Liew Jicson appears with the verified role Video.
- Step 4 (~12s; beat 51) — The actual exported brief carries the completed data-quality step into the adviser-review invitation.
- Step 5 (~6s; beat 52) — The core message closes beside Local prototype available for demonstration.

**Production pacing:** Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.

**Asset checklist:**

- Ready — nexus-mark: public/nexus-mark.svg.
- Ready — siti-career-brief: output/pitch/siti-career-brief.md.

**Spoken excerpt:** “We are Team Decisive. Raye Chan Jun Foong is our team leader.”

## Consolidated asset checklist

- Ready — native deck text and diagrams use the frozen fictional Siti API capture: Financial data analyst, four hours/week, evidence revision 947afd1b22fcbef5 and stale status. Product screenshots are not used in the deck or as recording scenes.
- Ready — output/pitch/demo-proof.json holds initial, completed, rapid, green and reverted API responses plus the final local state and preservation checks.
- Ready — output/pitch/siti-career-brief.md is the real exported brief; the HTML embeds it for an offline download.
- Ready — public/nexus-mark.svg and the original Wordmark span structure/proportions are reused; embedded Sora, DM Sans and IBM Plex Mono remove runtime font downloads.
- Ready — output/pitch/pitch-data.json and font-sources.json document sources, timestamps, data assets, the local live-demo address and font provenance.
- Unavailable, not required for this fictional demo — public deployment URL or QR; omit until verified.
- Pending measurement — pilot baselines, adviser agreement and outcome data; show proposed measures only.
- Unavailable, not claimed — a real learner’s completed work sample, professional qualification and institutional approval.
- Local runtime required — slide 6 embeds http://127.0.0.1:3201/#import. Start the full-stack app on port 3201; select the fictional Siti sample and review the demo preferences. The live workspace/evidence may differ from the frozen reference figures.
- Later build only — chapter code, narrations.ts, optional voice files and finished video; no audio generated.

## Capture continuity and rehearsal

Use the same evidence revision through the six-minute story. Do not refresh during recording unless the resulting data are re-captured and all displayed values are updated. The chosen source is a record inside that revision; its data-quality metadata mapping is an authored proxy. If its original page is unavailable, retain that uncertainty. The central change is explicitly authored Faster AI adoption, not a research refresh or a published forecast.

Rehearse exact sequence: initial steady plan → self-report data-quality completion for demo → propose faster-AI scenario → inspect comparison and four retained step IDs → accept → reload and show completion → propose Green transition separately → Keep previous view → verify return to the accepted faster-AI plan. The historical brief export precedes the separate revert test; its accepted faster-AI state is the same state restored by that test.

The deck has an offline brief-download action, ←/→/Space navigation, Home/End, N for notes and a ten-slide print layout. For clean later recording, build native scenes from the chapter plan rather than recording those deck controls.
