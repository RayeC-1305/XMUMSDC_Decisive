# Nexus live demo in the pitch

Slide 6 is the only product embed. It loads the real local application at `http://127.0.0.1:3201/#import` when the presenter enters that slide. Its new-tab link opens the same application at full size. All other slides use native HTML typography and diagrams; the deck contains no product screenshots.

The local server was built and started for this handoff. To restart it after closing the app or restarting the computer, run the following in PowerShell from `C:\XMUMSDC_Decisive`:

```powershell
$env:PORT = '3201'
$env:HOST = '127.0.0.1'
$env:TREND_AUTO_REFRESH = 'false'
npm start
```

If the frontend source changes, run `npm run build` before starting the server. A port-already-in-use message may mean the existing server is still running; open the local address before starting another instance.

Use the fictional Siti Rosli sample, review four hours/week, and select Financial data analyst. Demonstrate the initial plan, self-reported completion, Faster AI adoption proposal, review and acceptance. Keep the separate Green transition / Keep previous view test distinct from acceptance. The app uses its own current workspace and cached evidence; the native slide figures are historical verified capture values, so live results may differ. The embed does not seed or overwrite a personal workspace.

The deck's fonts and other presentation content work offline. The live demo requires this local server. Fresh public evidence and external learning-resource pages require internet. This local address is not a public deployment. Print output labels the live-demo location rather than substituting a screenshot.

HTTP checks verified the actual app, API health and built JavaScript/CSS return 200. Browser rendering and in-frame interaction were not rechecked because the app blocked access to local deck URLs.
