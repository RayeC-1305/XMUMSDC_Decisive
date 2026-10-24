# Nexus brand guidelines

## Brand concept

**Advance with every shift.** Nexus (the NexusTalent prototype) turns changes in AI and work into a career decision a worker and adviser can inspect. The identity should convey technical progress and adaptability: capable, sharp and flexible. The landing page is the pitch; its last action opens the product.

The USP is an explainable revision that preserves learning. Lead the page with **Plans evolve. Progress stays.** Prove the claim with live dated research retrieval, visible mapping assumptions, before/after review, retained completion and a persistent revision brief. This is a product focus, not a claim of industry-first novelty.

The intended initial buyer is a career centre or reskilling provider. This is a hypothesis, not established customer demand. No fictional partners, placement results or customer testimonials.

## Quick reference

### Primary Colors

| Name     | Value   | Use                                             |
| -------- | ------- | ----------------------------------------------- |
| Cobalt   | #4355E7 | Actions, selected states, final demo invitation |
| Midnight | #111A34 | Navigation and judging section                  |
| Night    | #0B0D13 | Editorial pitch and moving product story        |

### Secondary Colors

| Name          | Value   | Use                                                         |
| ------------- | ------- | ----------------------------------------------------------- |
| Electric cyan | #83F0E7 | Wordmark x, primary pitch action, signal accents; dark text |
| Signal blue   | #8899FF | Secondary moving signal connections                         |
| Ice           | #E3E8FF | Working panels and source context                           |

### Neutral Colors

| Name        | Value   | Use                  |
| ----------- | ------- | -------------------- |
| Canvas      | #F5F6F8 | Workspace background |
| White       | #FFFFFF | Working surfaces     |
| Ink         | #202738 | Main text            |
| Signal grey | #626D81 | Supporting text      |
| Divider     | #DCE1EA | Structure            |

The existing `--c-*` variables in `src/career.css` remain the implementation source. The Brand sync tool detected that source, the legacy stylesheet and Tailwind config; no competing generated token system was added. Legacy variable names such as `--c-green` now represent the refreshed interface colours; SDG colours retain semantic meaning.

## Typography

### Font Stack

- heading 'Sora', system-ui, sans-serif
- body 'DM Sans', system-ui, sans-serif
- mono 'IBM Plex Mono', 'Cascadia Code', monospace

Sora carries display and interface headings. DM Sans carries reading and controls. IBM Plex Mono is reserved for the wordmark, x glyph and technical signature. Use real text glyphs; do not replace the x with a stretched curved icon. The wordmark has a stable layout; the x can scale horizontally to 1.12 on hover without moving the other letters. Reduced motion disables that response.

## Identity

The wordmark reads `nexus` in lowercase monospaced type with a cyan x. Use clear space of at least half a character. Preserve letter proportions and baseline. The favicon uses the same typographic x on cobalt. The hero's main visual is now a native product diagram: a fictional person's experience connects to transferable skills and possible directions, with completed learning anchored below. Do not reinstate the stretched curved x or use a decorative symbol in place of the product mechanism.

## Voice

### Brand Personality

| Trait               | Apply it                                 | Example                                     |
| ------------------- | ---------------------------------------- | ------------------------------------------- |
| **Forward-looking** | Connect a change to a possible next move | Advance with every shift.                   |
| **Clear**           | Name the action and decision             | Compare directions; Save changes            |
| **Capable**         | Show a useful next step                  | Turn skill gaps into ordered learning.      |
| **Grounded**        | Put assumptions beside outputs           | Illustrative index; simulated signal update |

Use plain, confident language. Show how the product helps people act, without guarantees about employment, professional readiness or measured SDG impact. The source context, local-rule matching and simulated updates remain disclosed.

## Motion

- The user explicitly requested a much more animated Patensify-inspired experience. The pitch motion intensity is 8/10; routine working UI remains 4/10.
- Masked headline lines and the experience-to-role diagram form one coordinated first-view sequence. Signal packets and small skill movements express the connections; sample roles rotate every 4.8 seconds while visible.
- The role cycle stops on hover, keyboard focus, pause, reduced motion, offscreen or hidden-tab state. Manual role controls remain available. The process ribbon also stops offscreen and when paused or hidden.
- Native scrolling drives document positioning, evidence context and chapter progress. Ranked alternatives enter as a related list. No scroll hijacking or mandatory snap points.
- Scenario selection slides. The proposed direction enters through a masked shared-element transition; completed learning remains anchored. Acceptance gives a short confirmation.
- Navigation, intake and demo entry use interruptible native view transitions where supported, with normal functional fallbacks. Mobile uses the visible header wordmark in the handoff. Focus never scrolls the navigation out of view.
- Disclosures, dialogs, toasts, active navigation and the learning meter give short, meaningful state feedback. Inputs and reading text do not loop.
- The persistent pause control stops the pitch loops. On narrow screens it becomes an accessible icon in the header, away from content controls. Live reduced-motion changes expose the complete static state immediately. No hidden content or forced scroll animation.
- `src/motion.css` owns motion tokens and keyframes; `CareerMotion.jsx` owns the diagram and frame-batched scroll inputs; `interfaceMotion.js` owns short view transitions and preference handling.

## Layout and assets

The pitch progresses through experience, evidence, alternatives, adaptive revision, Domain 1 capabilities, judging criteria, buyer hypothesis and the actual demo. The workspace uses the same cobalt/cyan identity on quieter light surfaces. Original-file reading and saved work are device-local; extracted profiles and career analysis use the connected service.

- `public/nexus-mark.svg`: typographic x favicon.
- `src/components/career/CareerPrimitives.jsx`: Wordmark, BrandMark and intake artwork.
- `src/components/career/PitchLanding.jsx`: pitch and adaptive preview.
- `src/career.css`: semantic tokens and shared rules.
- `src/brand.css`: workspace brand composition.
- `src/landing.css`: pitch composition and motion.

Guidance: web-design-skills (web-design-engineer), UI/UX Pro Max Brand and UI Styling, plus frontend-design. See `brand-spec.md` for the preservation contract and current design read. No raster generation or new UI framework is required.
