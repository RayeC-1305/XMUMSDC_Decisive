# Nexus seven-minute web presentation

Ten chapters, 66 narration beats, 420 seconds of planned playback. All seven font faces are local. The fixed 1920 × 1080 stage scales proportionally; recording scenes have no persistent deck chrome. The deck and video now include both worker and employer workflows.

Preview: <http://127.0.0.1:5186/?chapter=opening&step=0>

- P restarts the seven-minute silent preview; Escape stops it.
- Click empty stage space, Space or → advances; ← returns. Home/End select the first/last beat.
- Keys 1–9, then 0, select chapters. Hidden bottom controls also select chapters and show narration (N).
- ?chapter=working-prototype&step=2&clean=1 opens a focused beat without controls. ?preview=1&clean=1 starts silent playback after fonts load.
- The actual live product is embedded only in chapter 06. It opens https://NexusTalent-Decisive.replit.app/#pathway for nine worker beats, then /hr for four employer beats in the same frame. Add &demoBase=http%3A%2F%2F127.0.0.1%3A3202 for an isolated local rehearsal. Actual demo actions must be operated and recorded to the thirteen narration beats; silent playback changes cues, not app state.

Run npm run dev, npm run build, or npm run extract-narrations from this project directory.

Each chapter’s narrations.ts is the implementation source of truth. From the repository root, node scripts/prepare-nexus-video.mjs synchronizes script, outline and plan. The seven-minute schedule includes demonstration dwell. Final voice duration and recording synchronization still require verification at export.

Motion follows the narration: consistent chapter transitions, persistent diagram geometry, purposeful focus changes and finite scoring/evidence/practice demonstrations. Autonomous travelling lines and repeating loops were removed after user review. See ../opening-motion.md for the current contract. Reduced-motion preference is supported.

Current video evidence: revision 22a5e09950739768, retrieved 24 October 2026 at 15:18 MYT, stale at the later browser verification. Financial data analyst: 60.78 Steady adoption; 63.20 Faster AI adoption. Genuine refreshed export: public/siti-career-brief.md. See ../demo-preflight.md for the actual accept/reload/separate-keep-previous-view checks.

Voice synthesis and the final MP4 await the audio checkpoint. ../opening-motion-preview.mp4 is a superseded 20-second experiment and does not represent the current motion direction.
