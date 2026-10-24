# Nexus: Patensify reference study and proposed refresh

Status: completed and verified on 24 October 2026. The user approved the direction, reviewed the rendered draft, requested much more animation and moving UX, then explicitly asked to continue. The final production build, connected workflow regression and motion/mobile checks pass.

## Product truth and scope

Nexus helps a worker turn a reviewed skills profile into explainable future-role matches and a practical learning plan. Its distinguishing mechanism is a reviewable plan revision that keeps completed learning and records why a decision changed. The pitch promise remains **Plans evolve. Progress stays.**

This pass covers the brand landing page and the existing worker demo. Preserve the six Domain 1 capabilities: skills intake; dated, updatable evidence; explained role ranking and gaps; an ordered, timed reskilling pathway; role and skill SDG mappings; and multiple explicitly estimated future scenarios. Preserve the current career API integration, live research retrieval, source disclosures, exports, saved plans, progress, reflections and local-storage keys. Backend development and deployment are outside this design pass.

## Reference read

Reference: https://patensify.com/en/ (inspected 24 October 2026, Malaysia time).

The useful principles are its centred first statement, restrained navigation, generous dark negative space, guided chapter sequence and concrete interactive examples. Adapt those principles to Nexus's evidence-to-decision story. Keep Nexus's own identity, product facts, wording and interface; do not reproduce Patensify's branding, creator imagery, Instagram metaphor or marketing claims.

## Proposed direction

Mode: **Redesign · Preserve**. Landing mode: **Persuade**. Demo mode: **Operate**.

Preserve: monospaced Nexus wordmark and text x, cobalt/cyan recognition, tagline, routes and anchors, navigation labels, data semantics, field order and validation, keyboard and reduced-motion behaviour.

Improve: first-viewport focus, section pacing, the visibility of the revision mechanism, intake hierarchy, legibility, action priority and consistency across demo screens.

Remove: redundant promotional labels, repeated decorative cards, oversized decorative journey artwork and competing emphasis that makes the next action harder to find. Keep explanatory content available through appropriate disclosure.

### Design read

- Audience: Domain 1 judges, workers exploring a career transition, and career advisers.
- Visual language: editorial product storytelling with a restrained technical identity.
- Landing dials: visual variance 6, motion 5, density 4, asset dependence 3, brand fidelity 9.
- Demo dials: visual variance 4, motion 3, density 7, asset dependence 3, brand fidelity 9.

### System

- Palette: near-black `#0B0D13` landing ground; existing midnight `#111A34`; cobalt `#4355E7`; cyan `#83F0E7`; white and cool neutral working surfaces. Cyan always takes dark text. Saturated accents identify action or a meaningful change.
- Typography: existing Sora display and headings; DM Sans text and controls; IBM Plex Mono for the established wordmark and measured data. Display tracking no tighter than `-0.04em`; readable 16px body text on the pitch, 14–16px in the workspace.
- Spacing: 8px base, compact groups and generous separation between decisions. Bounded 1200px pitch content with fluid phone gutters.
- Corners: 12–16px working panels; smaller control corners; pills reserved for compact controls and statuses.
- Elevation: flat working surfaces separated by borders; soft offset elevation only where a floating or overlay layer needs it.
- Motion: one authored evidence-to-revision moment, short interaction feedback, restrained entrances; native scrolling without scroll hijacking. Reduced motion exposes the complete static state.

## Landing composition

1. A centred **Plans evolve. Progress stays.** hero, clear product explanation and one main route into the guided story, with the demo always available.
2. A short sequence explaining how reviewed experience becomes a skill profile, then how dated evidence informs possible directions.
3. A hands-on scenario revision: compare the proposed next priority and show the completed foundation remaining in place. Label sample values and assumptions explicitly.
4. A concise, inspectable map of all six Domain 1 capabilities and the existing rubric criteria. Keep buyer hypotheses distinct from validated outcomes.
5. A final transition into the actual CV intake, with resume available when a workspace exists.

Numbers belong to actual stages in the journey, rather than decorative section labels. Product examples should use the existing matching and planning functions or actual UI captures with fictional profiles.

## Demo composition

Keep the existing sidebar and deep links. Make the active task clear through typography, spacing and action hierarchy rather than pervasive accent surfaces. Simplify the first-run visual composition so upload, paste and sample entry are immediately findable. Keep the three setup stages and all review/edit controls.

On overview and learning screens, foreground the next useful action. Put provenance, scenario assumptions and detailed explanations close to the decision through clear disclosures. Keep current API states, source dates, uncertainty labels and privacy disclosures accurate. Do not hide necessary controls or invent new model capabilities.

## Positioning checks

- Narrative role: hero makes the promise; the journey establishes causality; revision demonstrates the USP; the closing section hands over to the working demo.
- Viewing context: phone and laptop, with the pitch also legible during a judged presentation.
- Temperature: confident, forward-looking and precise.
- Capacity: short landing statements; bounded interactive examples; denser but scan-friendly demo. Avoid squeezing six full explanations into the first viewport.

## Risk and verification

The highest-risk design change is simplifying a complex workspace so far that explanation or control becomes hard to find. Preserve source access, scenario comparison, progress, save/restore, accept/revert and exports. Inspect desktop and mobile renders and the landing-to-intake-to-plan path after implementation; run the production build. Do not treat a retrieved paper as measured labour demand or a match index as a hiring probability.

Existing implementation remains the rollback baseline. Work should be limited to frontend composition, shared styling, UX presentation and the corresponding design documentation.

## Draft implementation and evidence

The draft replaces the split landing hero with the approved centred composition, adds six story chapters, shows actual local sample matches and dated curated sources, and demonstrates a scenario revision alongside preserved illustrative learning. The final action enters the existing intake. Capability and rubric explanations remain inspectable.

The intake no longer renders the decorative journey artwork. The shared workspace styling uses quieter surfaces, a near-black sidebar and a clearer first-run composition. No matching, API, storage or export contract was changed.

The moving implementation adds a kinetic title, animated skill-to-role map with a controlled sample-role cycle, travelling signal connections, a process ribbon, sticky chapter progress, scroll-linked product examples, shared-element proposal/brand/workspace transitions, sliding scenario/navigation selection, disclosure feedback and an animated learning meter. A visible pause control and live reduced-motion preference preserve a static alternative. Loops stop offscreen and in hidden tabs; keyboard focus and hover stop the role cycle.

The production build and existing connected integration journey passed. The motion check confirms cycling, paused loops, scroll response, revision accept/reset, navigation focus, mobile width and live reduced-motion changes. Current evidence is in `output/playwright/motion/`, including a short recording. Earlier draft captures remain in `output/design-refresh/`.
