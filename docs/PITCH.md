# Nexus pitch deck

The submission includes a ten-slide HTML deck at [nexus-pitch.html](../nexus-pitch.html), the [spoken script](../script.md), [detailed narrative](../article.md) and [slide outline](../outline.md). The deck plans approximately six minutes of narration and demonstration. A finished video has not been produced.

## Present the deck

Download the repository or the HTML file and open `nexus-pitch.html` in a browser. GitHub's file viewer shows source code, so download the file before presenting. Fonts, diagrams, speaker notes, source records and the fictional career-brief download are embedded in the HTML.

- Arrow keys or Space: advance/back through the slides.
- Home / End: first / last slide.
- N: toggle speaker notes and source references.
- Browser print: the ten slides use a fixed 16:9 print layout.

## Run the live demonstration

Slide 6 loads the actual application at `http://127.0.0.1:3201/#import`. From the repository root, install dependencies and build the app:

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

On macOS/Linux, use `PORT=3201 HOST=127.0.0.1 npm start`. Keep this terminal running while presenting. This address is local to the presenter's computer; no public deployment is claimed.

Choose the fictional Siti Rosli sample, review four hours/week and select Financial data analyst. Record a demo completion, propose Faster AI adoption, inspect the comparison, accept, then reload to show retained completion. Demonstrate Green transition and Keep previous view as a separate proposal/revert action. The app uses its current evidence; numbers can differ from the historical capture used in the slides.

## Sources and rebuild

Selected files in `output/pitch/` are intentionally versioned: fictional API capture (`demo-proof.json`), exported brief, presentation data, embedded font CSS, seven font files, font provenance and local-demo notes. Logs, process IDs, downloaded renderer dependencies, screenshots and temporary proof renders are excluded.

The app never loads this historical capture as production evidence. Public research and personal simulations remain separate. The capture contains a fictional demonstration profile and self-reported completion, with its original evidence dates and limitations.

Rebuild the deck and aligned narrative files using the committed capture and fonts:

```sh
node scripts/build-pitch.mjs
```

`scripts/capture-pitch.cjs` can capture another fictional demonstration against port 3201. It overwrites the frozen capture and brief; rebuilding afterwards can change the pitch's reference values. `scripts/prepare-pitch-assets.mjs` downloads fonts again and requires internet. Neither command is needed to open the submitted HTML.

Official preliminary, technology declaration and sponsor proof PDFs remain pending in the [submission manifest](../submission/README.md). The HTML deck does not replace them.
