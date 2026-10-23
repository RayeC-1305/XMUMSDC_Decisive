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

### Secondary Colors

| Name          | Value   | Use                                                         |
| ------------- | ------- | ----------------------------------------------------------- |
| Electric cyan | #83F0E7 | Wordmark x, primary pitch action, signal accents; dark text |
| Shift violet  | #9073FF | Scenario emphasis                                           |
| Ice           | #E3E8FF | Working panels and source context                           |

### Neutral Colors

| Name        | Value   | Use                  |
| ----------- | ------- | -------------------- |
| Canvas      | #F4F6FB | Workspace background |
| White       | #FFFFFF | Working surfaces     |
| Ink         | #202B46 | Main text            |
| Signal grey | #606C85 | Supporting text      |
| Divider     | #DFE4F0 | Structure            |

The existing `--c-*` variables in `src/career.css` remain the implementation source. The Brand sync tool detected that source, the legacy stylesheet and Tailwind config; no competing generated token system was added. Legacy variable names such as `--c-green` now represent the refreshed interface colours; SDG colours retain semantic meaning.

## Typography

### Font Stack

- heading 'Sora', system-ui, sans-serif
- body 'DM Sans', system-ui, sans-serif
- mono 'IBM Plex Mono', 'Cascadia Code', monospace

Sora carries display and interface headings. DM Sans carries reading and controls. IBM Plex Mono is reserved for the wordmark, x glyph and technical signature. Use real text glyphs; do not replace the x with a stretched curved icon. The wordmark has a stable layout; the x can scale horizontally to 1.12 on hover without moving the other letters. Reduced motion disables that response.

## Identity

The wordmark reads `nexus` in lowercase monospaced type with a cyan x. Use clear space of at least half a character. Preserve letter proportions and baseline. The favicon uses the same typographic x on cobalt. The large hero x is a quiet outline, paired with thin signal connections; it supports the product preview rather than competing with it.

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

- One coordinated hero entrance: masked title lines, supporting copy and preview, 500–850ms.
- Signal paths draw once over 1.2 seconds; no endless decorative loops.
- Sections reveal once on entry, 620ms; animate composition rather than every card.
- Scenario revisions settle over 360ms; the next priority briefly highlights. Completed learning stays visibly stable.
- Monospaced x hover uses transform only, 320ms, with no width/layout change.
- Demo entry uses a short native view transition where supported. Other browsers navigate normally.
- Reduced-motion preferences apply immediately: no hidden content, forced scroll animation or animated handoff. Keyboard focus remains visible.

## Layout and assets

The pitch progresses through problem, adaptive preview, Domain 1 capabilities, judging criteria, buyer hypothesis and demo. The workspace uses the same cobalt/midnight/cyan identity. All flows are browser-local and responsive.

- `public/nexus-mark.svg`: typographic x favicon.
- `src/components/career/CareerPrimitives.jsx`: Wordmark, BrandMark and intake artwork.
- `src/components/career/PitchLanding.jsx`: pitch and adaptive preview.
- `src/career.css`: semantic tokens and shared rules.
- `src/brand.css`: workspace brand composition.
- `src/landing.css`: pitch composition and motion.

Guidance: web-design-skills (web-design-engineer), UI/UX Pro Max Brand and UI Styling, plus frontend-design. See `brand-spec.md` for the preservation contract and current design read. No raster generation or new UI framework is required.
