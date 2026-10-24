# NexusTalent interface system

## Direction

A frontier career product: Advance with every shift. The pitch introduces an adaptive decision workflow and ends inside the complete career workspace. Lead with the next decision; surface explanation, provenance and human review when needed.

UI/UX Pro Max Brand and UI Styling guide the identity, visual hierarchy, responsive composition and accessible motion. [brand-guidelines.md](../../docs/brand-guidelines.md) defines cobalt, midnight and electric cyan, with a typographic monospaced x. Impeccable informed an earlier interaction review.

## Tokens and composition

Implemented in `src/career.css` with existing `--c-*` tokens; `src/brand.css` handles the workspace, `src/landing.css` pitch composition, and `src/motion.css` shared motion. Canvas `#f5f6f8`, white surfaces, ink `#202738`, muted `#626d81`, lines `#dce1ea`, cobalt action `#4355e7`, midnight `#111a34` and cyan `#83f0e7`. The approved Patensify-inspired landing ground is `#0b0d13`; the working rail is `#10141e`. Cyan takes dark text. Existing token sources were updated without adding a generated theme.

Sora headings, DM Sans body/controls and IBM Plex Mono wordmark with system fallbacks. Body and controls use 14–16px; small diagram annotations are subordinate to the main readable narrative. Decorative geometry is hidden from assistive technology. The pitch leads with a centred kinetic statement and an animated career map, then scroll-linked experience/evidence/role chapters, a scenario revision, six capabilities, the rubric and the actual demo. No bitmap or new motion-library dependency.

Pitch motion is deliberately strong (8/10), with travelling signal packets, drifting skill nodes, a controlled 4.8-second sample-role cycle, a moving process ribbon, document extraction, ranked-role entrances and a masked proposal transition. Completed learning stays anchored. Working UI motion is restrained (4/10): navigation and scenario indicators slide, view/intake transitions preserve continuity, disclosures open quickly and progress fills smoothly. Pause, reduced-motion, offscreen and hidden-tab behavior are required contracts, not optional polish. Detailed motion rules and evidence live in `brand-spec.md` and `docs/VERIFICATION.md`.

Desktop: fixed 244px rail, 76px top bar, bounded content, 42px gutters. Overview combines a transition banner with actionable panels. Intake uses three steps. Roles combine filters, list, explanation and comparison tray. Learning uses an ordered accordion timeline with a pace/impact aside.

The intake's decorative journey artwork is removed so the actual upload, paste and sample entry lead. Evidence state is a concise disclosure; dates remain immediately visible and technical service details remain inspectable. Programmatic navigation focus uses `preventScroll` so mobile navigation stays visible.

Breakpoints: 1250, 1080, 900, 720 and 480px. At 900px the rail becomes an off-canvas dialog; below 720px panels stack; phones use 18px gutters. Comparisons become stacked columns. Print styling removes navigation and exposes learning content or the review brief.

## Interaction rules

- Hash navigation supports Back/Forward. Fresh users start at the pitch; `/#import` opens intake directly. The pitch ends in the demo, and the workspace links back to the product introduction.
- Import errors recover. PDF/DOCX extraction is local and lazy-loaded; scans offer pasted text. Busy state prevents duplicate file actions.
- Review requires a name, current role and at least one catalog skill. Skills and tasks remain editable.
- Role filtering updates list and detail. Empty results offer recovery; comparisons cap at three alternatives.
- Saved plans distinguish changed preferences/scenario/signals from saved state. Restore brings back the assumptions; naming survives resaving.
- Dialogs contain focus and close on Escape. Closed mobile navigation is inert; open navigation wraps focus and restores it on Escape.
- Resource/SDG links open new tabs. Export includes assumptions and provenance. Print uses browser Save as PDF.
- Reviewed profiles, preferences, shortlist, signals, plans, notes and progress persist locally. Storage failure is disclosed. Original CV bytes stay local. Extracted text and reviewed profiles are processed in memory by the backend without being saved.

## Product honesty

The career API is connected for intake, matching, skill forecasts, scenarios and learning plans. No generative model is claimed. Live Crossref research retrieval, curated context and simulated inputs have distinct labels. Publication and retrieval dates plus transparent keyword mappings accompany live records. Indices are not hiring probabilities; estimated learning time is not qualification. SDGs describe intended contribution. No salary, job-security, accreditation or funding promise. Pending revisions and accepted/reverted decision records persist; the learning plan and export show a revision brief.

One English-language worker journey is active. Legacy HR/TVET and backend code remain preserved outside its navigation.
