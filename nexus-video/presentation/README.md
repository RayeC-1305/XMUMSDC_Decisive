# Nexus seven-minute web presentation

Ten chapters, 66 narration beats, 420 seconds of planned playback. The standalone export embeds all seven font faces. The fixed 1920 × 1080 stage scales proportionally; recording scenes have no persistent deck chrome. The deck and video now include both worker and employer workflows.

Open [SDC2026_Decisive_DemoVideo.html](../../submission/SDC2026_Decisive_DemoVideo.html) directly in your browser. No local server is required. From GitHub, download the raw HTML file first; the GitHub file viewer displays source. Fonts, JavaScript, styles and the career-brief download are embedded.

- P starts or stops the timer at the current slide; Escape stops it.
- Choose any specific slide from the Slide dropdown (or type the slide number) and click "Start timer at slide X" to run the timer at that exact slide.
- Toggle "Auto-run" to start running the timer immediately upon selecting a slide.
- Click "Pin" to keep review controls visible during rehearsal without fading.
- Click empty stage space, Space or → advances; ← returns. Home/End select the first/last beat.
- Keys 1–9, then 0, select chapters. Hidden bottom controls also select chapters and show narration (N).
- ?chapter=working-prototype&step=2&clean=1 opens a focused beat without controls. ?preview=1&clean=1 starts silent playback after fonts load.
- The actual live product is embedded only in chapter 06. It opens https://NexusTalent-Decisive.replit.app/#pathway for nine worker beats, then /hr for four employer beats in the same frame. The demo origin is fixed to Replit; query parameters cannot replace it with localhost. Actual demo actions must be operated and recorded to the thirteen narration beats; silent playback changes cues, not app state.

Run npm ci, then npm run build from this project directory to regenerate ../../submission/SDC2026_Decisive_DemoVideo.html. The build also writes a self-contained dist/index.html suitable for static hosting. npm run dev is an optional authoring workflow, not required for viewing.

Each chapter’s narrations.ts is the implementation source of truth. From the repository root, node scripts/prepare-nexus-video.mjs synchronizes script, outline and plan. The seven-minute schedule includes demonstration dwell. Final voice duration and recording synchronization still require verification at export.

Motion follows the narration: consistent chapter transitions, persistent diagram geometry, purposeful focus changes and finite scoring/evidence/practice demonstrations. Autonomous travelling lines and repeating loops were removed after user review. See ../opening-motion.md for the current contract. Reduced-motion preference is supported.

Current video evidence: revision 22a5e09950739768, retrieved 24 October 2026 at 15:18 MYT, stale at the later browser verification. Financial data analyst: 60.78 Steady adoption; 63.20 Faster AI adoption. Genuine refreshed export: public/siti-career-brief.md. See ../demo-preflight.md for the actual accept/reload/separate-keep-previous-view checks.

Voice synthesis and the final MP4 await the audio checkpoint. ../opening-motion-preview.mp4 is a superseded 20-second experiment and does not represent the current motion direction.
