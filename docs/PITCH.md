# Nexus pitch deck

The submission includes a ten-slide HTML deck at [SDC26_Decisive_PitchDeck.html](../submission/SDC26_Decisive_PitchDeck.html), with a root convenience copy at [nexus-pitch.html](../nexus-pitch.html), the [spoken script](../script.md), [detailed narrative](../article.md) and [slide outline](../outline.md). The deck plans approximately six minutes of narration and demonstration. A finished video has not been produced.

## Present the deck

Download the repository or the HTML file and open `nexus-pitch.html` in a browser. GitHub's file viewer shows source code, so download the file before presenting. Fonts, diagrams, speaker notes, source records and the fictional career-brief download are embedded in the HTML.

- Arrow keys or Space: advance/back through the slides.
- Home / End: first / last slide.
- N: toggle speaker notes and source references.
- Browser print: the ten slides use a fixed 16:9 print layout.

## Run the live demonstration

Slide 6 loads the live hosted application at [`https://NexusTalent-Decisive.replit.app/#import`](https://NexusTalent-Decisive.replit.app/#import). When presenting with internet access, the slide loads directly without requiring a local development server.

To run the application locally (e.g., for offline presentations or local verification):

```sh
npm ci
npm run build
```

Start it on the deck's expected port in PowerShell:

```powershell
$env:PORT = '3201'
$env:HOST = '127.0.0.1'
npm start
```

On macOS/Linux, use `PORT=3201 HOST=127.0.0.1 npm start` for local offline testing.

The default deck still points to Replit. To embed that local server, rebuild with `DEMO_URL=http://127.0.0.1:3201/#import` set in the environment, then reopen the deck. Rebuild without that override to restore the hosted version.

Choose the fictional Siti Rosli sample, review four hours/week and select Financial data analyst. Record a demo completion, propose Faster AI adoption, inspect the comparison, accept, then reload to show retained completion. Demonstrate Green transition and Keep previous view as a separate proposal/revert action. The app uses its current evidence; numbers can differ from the historical capture used in the slides.

## Sources and rebuild

Selected files in `output/pitch/` are intentionally versioned: fictional API capture (`demo-proof.json`), exported brief, presentation data, embedded font CSS, seven font files, font provenance and local-demo notes. Logs, process IDs, downloaded renderer dependencies, screenshots and temporary proof renders are excluded.

The app never loads this historical capture as production evidence. Public research and personal simulations remain separate. The capture contains a fictional demonstration profile and self-reported completion, with its original evidence dates and limitations.

Rebuild the deck and aligned narrative files using the committed capture and fonts:

```sh
node scripts/build-pitch.mjs
```

`scripts/capture-pitch.cjs` can capture another fictional demonstration against port 3201. It overwrites the frozen capture and brief; rebuilding afterwards can change the pitch's reference values. `scripts/prepare-pitch-assets.mjs` downloads fonts again and requires internet. Neither command is needed to open the submitted HTML.

The submission folder contains the preliminary proposal, technology declaration and Replit proof PDFs. The HTML deck and its matching PDF include the employer workflow and hosted demo links.

## Standalone video presentation

[SDC2026_Decisive_DemoVideo.html](../submission/SDC2026_Decisive_DemoVideo.html) opens directly after downloading; no localhost server is required. It embeds presentation code, fonts and the real career brief. Both live demo audiences use the Replit deployment. Press P for silent playback. Final voice and MP4 recording remain pending.
