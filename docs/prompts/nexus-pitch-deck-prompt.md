# Nexus pitch deck and video handoff prompt

Create a 10-slide, 16:9 pitch deck for NexusTalent, branded as “nexus”, by Team Decisive for SDC Hackathon 2026, Domain 1: Aiversecity Future-Ready Workforce.

Use web-design-skills for visual craft, ui-ux-pro-max:slides for presentation structure, and presentation-skills (whose skill name is web-video-presentation) for narration and the later video handoff. Read the installed skills before using them. This run creates the deck and video source materials. A later run will turn those materials into the recordable web presentation.

AUDIENCE AND PURPOSE

- Audience: hackathon judges, career advisers and prospective career-centre pilot partners.
- Produce a product-led pitch with an approximately six-minute English narration. This is a working duration, not a claim about event rules.
- Explain one worker’s decision, demonstrate the working product, and finish with a concrete pilot invitation.
- Core message: “Plans evolve. Progress stays.”
- Supporting line: “Advance with every shift.”
- Central question: “What should I learn next, and what would make me change that decision?”

PRODUCT CONTEXT — SOURCE OF TRUTH

Nexus helps workers and career advisers turn existing experience and changing AI research into a practical, reviewable reskilling decision. Its distinguishing workflow explains proposed revisions, lets the worker accept or revert them, and preserves completed learning.

The current product supports:
1. CV intake from text-based PDF, DOCX or TXT, pasted experience, and fictional sample profiles. Workers can review and edit their skills, tasks, goals and weekly learning time.
2. Six authored role profiles, ranked using 45% declared required-skill coverage, 30% transferable strengths and 25% research/scenario context. Scores include inspectable contributions and skill gaps.
3. Public Crossref research retrieval with source links, publication dates, retrieval timestamps and explicit metadata-to-skill mapping assumptions.
4. Three authored planning scenarios: Steady adoption, Faster AI adoption and Green transition.
5. Ordered learning plans covering role gaps and prerequisites, with public resources, practice outputs, estimated hours and weekly schedules.
6. Reviewable revisions, accept/revert, device-local completion records, reflections, saved decisions and a downloadable Markdown career brief.
7. SDG targets and contribution explanations attached to roles, skills and learning steps.

Implementation: React/Vite frontend, Express career API, explainable CPU rules, public research revision cache and browser local storage. The active app does not use an LLM or GPU inference. Research metadata provides planning context, not measured Malaysian hiring demand. Match scores are indices, not employment probabilities. Scenarios are assumptions. SDG mappings describe intended contribution, not measured impact.

Normal UI flow reads original CV files in the browser and sends extracted text and the reviewed profile to the API for processing in memory. Saved personal workspaces remain on the device. Do not imply cloud accounts, institutional approval records or cross-device sync exist.

If repository access is available, verify current behaviour against README.md, docs/BACKEND.md, docs/INTEGRATION.md, services/career_engine.js and the active career components. Preserve the identity in docs/brand-guidelines.md, brand-spec.md and src/career.css. Some older strategy documents and unused components describe superseded behaviour. Prefer the current implementation over those descriptions. If files are unavailable, use only the product facts in this prompt and mark missing assets explicitly.

VISUAL DIRECTION

Use the reference prompt’s precise editorial hierarchy and tight grid, adapted to Nexus’s established identity. The result should feel like a coherent technical product pitch, with real product screens carrying the story.

- Canvas: 1280 × 720 per slide, approximately 48px safe padding, 8px spacing rhythm.
- Fixed 16:9 composition, proportionally scaled to the viewport. Never reflow the slide into a mobile page.
- Use midnight for the opening and close, and white or pale canvas for explanatory slides.
- Prefer asymmetric compositions, generous space and one dominant visual per slide. Use the 62% / 38% split where it serves the content; vary compositions across the deck.
- Thin structural borders, restrained 8–12px corners, no blurred shadows or decorative gradients.
- Avoid generic AI robots, stock handshakes, invented dashboards, decorative card grids and emoji icons.

FONTS

- Headlines: Sora 600/700, usually 48–60px, letter-spacing approximately -0.03em.
- Hero message: Sora 64–76px. Use sentence case and deliberate line breaks.
- Body: DM Sans 400/500/700, normally 22–26px.
- Labels: DM Sans 700, 12–14px, selectively uppercase.
- Wordmark and technical annotations: IBM Plex Mono.
- Sources: 12–14px, with fuller references in the source material.
- Prefer local or embedded fonts when available. Otherwise use Google Fonts with dependable fallbacks and document the network dependency.

COLOUR TOKENS

--cobalt: #4355E7
--midnight: #111A34
--cyan: #83F0E7
--violet: #9073FF
--ice: #E3E8FF
--canvas: #F4F6FB
--paper: #FFFFFF
--ink: #202B46
--muted: #606C85
--divider: #DFE4F0

Cobalt marks actions and selected directions. Cyan provides signal accents on dark surfaces. Violet identifies scenario changes sparingly. Use dark text on pale cyan. Preserve the approved lowercase monospaced “nexus” wordmark with its cyan x. Reuse public/nexus-mark.svg and the existing Wordmark implementation. Preserve their proportions.

SLIDE PLAN

01 — OPENING / 15 seconds
Headline: “Plans evolve. Progress stays.”
One sentence identifying Nexus as a reviewable reskilling workspace for workers and career advisers. Pair the wordmark with a close crop of the actual plan/revision interface. Team Decisive and Domain 1 appear as quiet supporting text.

02 — THE WORKER’S DECISION / 30 seconds
Headline: “What deserves your next learning hour?”
Follow Siti Rosli, the existing fictional operations-coordinator sample. Show her spreadsheet reporting, supplier coordination and document-processing experience. Set a clearly labelled demo preference of four learning hours per week. Explain the decision: which strengths transfer, which gaps matter, and what would justify changing direction? Use a compact task-to-decision visual. No invented unemployment statistics or testimonials.

03 — THE PRODUCT LOOP / 30 seconds
Headline: “A learning decision you can revisit”
Show the connected journey: review experience, compare directions, inspect evidence, build a plan, review a change and retain completed learning. Give each stage a plain-language label and connect it to an actual product output. Make the loop understandable before explaining the architecture.

04 — EXPLAINABLE DIRECTIONS / 45 seconds
Headline: “Every match has a reason”
Show Siti’s reviewed profile and an actual Future roles result. Enlarge one role’s strengths, gaps and score explanation. Use a clearly labelled 45% / 30% / 25% composition graphic to explain model weights. These percentages are scoring weights, not outcomes. Use captured API values for any displayed score and the exact role title from the app.

05 — EVIDENCE AND ASSUMPTIONS / 40 seconds
Headline: “The source behind the signal”
Feature the actual Skills radar/source detail: title, publisher, publication date, retrieval time and mapping rationale. Visually separate retrieved metadata from Nexus’s authored planning assumptions. State briefly that research context does not establish local hiring demand. Preserve visible stale/unavailable status when applicable. Do not claim that refreshing necessarily produces a new finding or changes the ranking.

06 — THE CENTRAL DEMO / 55 seconds
Headline: “A new direction. Your learning stays.”
Use the same fictional profile and selected role throughout. Show an initial plan, mark a real step complete, compare a different scenario, inspect the proposed revision, accept it and demonstrate retained completion. Show the revert action as a review option.
Build a large before/after composition around the actual changed priority and the stable completed step. Capture and verify the change first. If a research refresh produces no change, demonstrate a clearly labelled authored scenario instead. Do not present that scenario as a published forecast. Never invent score changes or completion persistence.

07 — A PRACTICAL NEXT STEP / 45 seconds
Headline: “A plan you can act on”
Show an enlarged learning-step detail with its prerequisite, public resource, practice output and estimated time. Connect the four-hour weekly preference to the actual schedule. Include a small SDG contribution explanation and the real exported career brief. Explain that resource content is free while optional certificates, equipment and other costs may apply. Introductory practice does not establish professional qualification.

08 — WORKING PROTOTYPE / 30 seconds
Headline: “A working path from CV to saved decision”
Use one readable architecture diagram linking the browser workspace, career API, public research and device-local progress. Explain the current rules baseline in plain language. Separate implemented capabilities from next validation work. Do not use passing engineering tests as proof of career forecast accuracy, fairness or employment outcomes. Do not imply active LLM, RunPod or GPU usage.

09 — FIRST BUYER AND PILOT / 40 seconds
Headline: “A focused pilot with career advisers”
Present Malaysian career centres and reskilling providers as the initial buyer hypothesis. The proposed value is preparing and revisiting an explainable transition brief. A possible organisational subscription based on active advised learners is a hypothesis, with pricing still to validate.
Show the next pilot’s measurement plan: time to an adviser-agreed next action, source validity, usefulness of revisions and review of completed work samples. Label targets as proposed and baselines as pending measurement. Do not invent market size, revenue, customers, partnerships or traction.

10 — TEAM AND INVITATION / 30 seconds
Headline: “Make the next learning decision reviewable”
Include verified team roles: Raye Chan Jun Foong, team leader; Teo Zheng Xi, tech lead; Liew Jicson, video. Invite an adviser team to help validate the workflow. Close with “Plans evolve. Progress stays.” and one clear demo invitation. Add a demo URL or QR only when a verified public deployment exists. Otherwise state “Local prototype available for demonstration.”

PRODUCT ASSETS AND DATA

- Use current, genuine product captures with fictional inputs. Existing candidates include output/playwright/integration/roles-desktop.png, research-desktop.png and learning-desktop.png. Verify their content and branding before reuse.
- Crop and enlarge the relevant detail. Full dashboard screenshots with unreadable text do not count as a demonstration.
- Keep profile, selected role, scenario, evidence revision, score and completion state consistent across screenshots and narration.
- Charts must represent verified output or explicitly labelled model structure. Do not manufacture bar values to fill a layout.
- If an asset is missing, use a labelled placeholder and list the exact capture needed.
- Cite external factual claims with direct authoritative sources. Omit unsupported labour-market statistics. Keep implementation claims tied to the current repository.

DELIVERABLES FOR THIS RUN

1. nexus-pitch.html: one self-contained HTML deck with inline CSS/JS and embedded image assets. Keyboard navigation, fixed-ratio scaling and a print layout showing all ten slides. Give each slide a stable ID. Keep narration, source records and asset mappings accessible in structured data. Disclose any external font dependency.
2. article.md: a concise, sourced product fact sheet supporting this pitch. Distinguish implemented behaviour, fictional demo inputs, assumptions and future work. This is the later video’s detail source.
3. script.md: natural English narration, approximately six minutes including demonstration pauses. Separate spoken beats with “---”. Keep headings, timing notes and production directions outside the spoken text. Retain material limitations and the real demo sequence.
4. outline.md: a Markdown video development plan mapping slide IDs to chapters and narration beats. For each chapter include sourced information, estimated spoken duration, focused screen content for each step and an asset checklist. Describe content and pacing here. Leave animation implementation to the later chapter build.

HANDOFF TO WEB-VIDEO-PRESENTATION

The later video should adapt the deck’s story and verified product details into full-screen, click-driven scenes. It should not merely animate ten screenshots of the slides.

- Use a fixed 1920 × 1080 stage, proportionally scaling the same design language, with generous safe margins.
- Preserve Nexus’s colour/font tokens and use one consistent stage surface through the video.
- One spoken beat equals one focused step. Reveal list items separately and remove persistent deck headers, footers and page numbers from recording scenes. Keep necessary evidence labels readable at the relevant moment.
- Use motion to explain real relationships: score contributions, evidence mapping, changed priorities and preserved completion. A complete chapter must include a meaningful visual demonstration.
- Keep the finished video chapters’ narrations.ts as the implementation source of truth for step counts and optional audio. Keep script.md and outline.md aligned with it.
- Follow the presentation skill’s plan, first-chapter and audio checkpoints when that later build begins. This run supplies its source materials; it does not generate voice audio or a finished video.

QUALITY BAR

Each slide should communicate one main idea through a dominant visual and short supporting copy. Preserve meaningful disclosures beside the claim they qualify. Check the complete story, actual demo continuity, narration timing, contrast, asset legibility and fit inside the frame. Cut copy before reducing type. The audience should leave understanding the next learning decision, why Nexus proposes it, and how that decision can change while useful progress remains.
