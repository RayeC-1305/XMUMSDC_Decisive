# Independent motion review — 24 October 2026

Scope: the revised stepper, native view-transition stylesheet and all ten chapter sources. Checklist: installed web-video-presentation CHAPTER-CRAFT.md. This is a source review; the main thread verifies the live transition sequence in the approved browser.

Final source re-review: **PASS**. Initial findings below are retained as review history; all required corrections are resolved.

## Final re-review

- The optimistic navigation ref is no longer overwritten during unrelated renders. Superseded callbacks remain generation-guarded, and both native ready/finished rejections are consumed safely.
- Unnecessary beat-dependent keys were removed from persistent text. Stable list keys remain. This avoids remount churn and duplicate sibling-key collisions during rapid navigation.
- Unmatched outgoing diagrams exit before the incoming chapter's text arrives. Backward whole-scene travel is limited to chapter boundaries; beat changes use the same quiet text rhythm in both directions.
- Loop focus height is now 218px. Pilot focus is 390 × 230px with 20px text inset. The main thread's current browser report covers all 62 beats with zero frame overflows and zero repeating animations.
- opening-motion.md and presentation/README.md now describe the finite narrative motion policy and explicitly identify the old travelling-thread clip as superseded.
- The source still contains ten chapters, 62 beats and 420 seconds. No new factual values, invented product states, screenshots or audio claims were introduced.

The main thread retains responsibility for the final live-browser regression and visual judgement of the recorded excerpt. A passing source review does not claim a finished seven-minute MP4.

## Required corrections

1. **Optimistic navigation cursor.** In useStepper.ts, cursorRef.current is assigned from rendered cursor on every render. move() deliberately updates that ref before the asynchronous native transition callback commits the new cursor. An unrelated render (stop playback, narration visibility) during that interval can reset the pending target, so a rapid subsequent navigation can derive from the old position. Keep the optimistic ref authoritative between moves; all semantic writes currently go through move(), so the unconditional render assignment can be removed. The generation guard and skipTransition logic otherwise correctly protect superseded callbacks.

2. **Superseded motion documentation.** opening-motion.md and presentation/README.md still describe the persistent SVG thread and continuous signals that this revision removes. Update or explicitly mark that design and its old motion study as superseded. The current policy should explain finite actions with a common navigation rhythm, rather than claiming a travelling thread remains.

## Browser layout checks to resolve

- The Loop focus frame originally ends at y912 while a wrapped node label can extend to approximately y933. Give the frame enough height (approximately 212px) and verify the longest label in the live render.
- The pilot focus frame originally ends near y692 while a two-line measure label can extend to approximately y700. Give it approximately 220px height and an inset around its label; the first frame can start at x100 while preserving the stage's safe margin.

## Passing source checks

- No infinite animation declarations remain in chapter CSS. Autonomous packets, wandering thread geometry, clock rotation, scanning dividers, oscillating arrows and floating closing chips are removed or static.
- Content-bearing actions are finite and have clear causes: allocate the hour budget, resolve experience into a reviewed profile, shift the journey focus, reveal one model weight, assemble weighted points, interpret a metadata keyword, disclose the schedule, send extracted text/profile across the API boundary, focus a pilot measure and open the review brief.
- The original CV remains in the browser diagram while only the extracted-text/profile packet crosses the boundary. No product behavior is fabricated.
- Native page navigation has consistent forward/back direction, faster exits than arrivals, separate heading changes and fixed live-demo geometry. Semantic state is set independently of animation completion.
- Reduced-motion users bypass native transitions and chapter animation through the global preference rule. The active scene remains visible.
- Chapter-local CSS prefixes, local fonts, Nexus tokens, one actual iframe and the absence of product screenshots remain intact.
- Narration arrays are unchanged: 62 beats, ten chapters, 420 seconds of planned duration. Finite chapter actions fit their allocated beats.
- The genuine live demo still requires actual operation and final recording. This revision does not claim a finished MP4 or synthetic narration.

Potential craft refinement: keep backward beat transitions as quiet as forward beat transitions by limiting directional whole-story movement to chapter boundaries. This is a consistency improvement, not a semantic-state blocker.

## Main-thread final browser regression

After the source fixes, all 62 beats were checked again: zero frame overflows, zero repeating animations and zero runtime errors. Rapid next/previous inputs with a narration-panel render interruption reached the expected worker beat. Final timed handoff frames confirm unmatched outgoing content clears before the role-result arrival. Records are in output/playwright/nexus-video-motion-v3/. Final source build and narration extraction passed; 62 beats and 420 planned seconds remain aligned. The audio decision and actual final recording remain pending.
