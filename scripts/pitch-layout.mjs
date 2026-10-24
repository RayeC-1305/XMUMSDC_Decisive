// Nexus pitch v4: problem → solution → technical approach → expected impact.
// Captured API values remain source material; product screenshots are not used.
export const layoutVersion = 4;

export function makePitchLayout({ chapters, wordmark, esc, source, demoUrl }) {
  const arrow = (direction = 'right', size = 28) => `<svg class="direction-icon ${direction}" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 16h21M18 8l8 8-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const foot = (n, text, dark = false) => `<footer class="deck-footer ${dark ? 'on-dark' : ''}"><span class="footer-brand">${wordmark}</span><span class="footer-section">${esc(chapters[n - 1].section)}</span><span class="footer-source">${text}</span><span class="folio">${String(n).padStart(2, '0')} / 10</span></footer>`;
  const title = (text, cls = '') => `<h2 class="slide-title ${cls}" data-layout-box>${text}</h2>`;
  const steps = [
    ['Review<br>experience', '5 reviewed skills'],
    ['Compare<br>directions', '6 authored roles'],
    ['Inspect<br>evidence', 'Dated source receipt'],
    ['Build<br>a plan', 'Gaps + prerequisites'],
    ['Review<br>a change', 'Accept or revert'],
    ['Retain<br>learning', 'Same completed step'],
  ];

  const slides = [
    `<section class="slide dark s01" id="${chapters[0].slideId}">
      <div class="hero-wordmark" data-layout-box>${wordmark}</div>
      <p class="event-credit" data-layout-box>Team Decisive<br>SDC Hackathon 2026</p>
      <h1 data-layout-box>Plans evolve.<br><span>Progress stays.</span></h1>
      <p class="hero-description" data-layout-box>A reviewable reskilling workspace<br>for workers and career advisers.</p>
      <div class="hero-principle" data-layout-box>
        <div><p>What changes</p><h3>Your next<br>learning priority.</h3></div>
        <div><p>What stays</p><h3>The progress<br>you’ve already made.</h3></div>
      </div>
      <p class="hero-signature" data-layout-box>Advance with every shift.</p>
      ${foot(1, 'Domain 1 · Aiversecity Future-Ready Workforce', true)}
    </section>`,

    `<section class="slide s02" id="${chapters[1].slideId}">
      ${title('The problem is choosing<br><span>what to learn next</span>')}
      <div class="worker-profile" data-layout-box>
        <p class="meta">Fictional sample profile</p>
        <h3>Siti Rosli</h3><p class="worker-role">Operations coordinator</p>
        <div class="worker-tasks"><p>Spreadsheet reporting</p><p>Supplier coordination</p><p>Document processing</p></div>
        <p class="worker-goal">5 reviewed skills · Explore a new direction</p>
      </div>
      <div class="worker-divider" aria-hidden="true"></div>
      <div class="worker-decision" data-layout-box>
        <div class="learning-budget"><b>4<span>h</span></b><p>learning per week<span>Demo preference</span></p></div>
        <p class="worker-question">What should I learn next,<br>and what would make me<br>change that decision?</p>
        <p class="worker-review">Time is limited. Assumptions can change.<br>A worker and adviser need a reason<br>to choose—and to reconsider.</p>
      </div>
      ${foot(2, 'Source: Siti sample profile and reviewed API capture · D01')}
    </section>`,

    `<section class="slide canvas s03" id="${chapters[2].slideId}">
      ${title('A reviewable reskilling<br>workspace')}
      <p class="loop-dek" data-layout-box>Every stage leaves something<br>a worker and adviser can inspect.</p>
      <div class="journey" data-layout-box>
        ${steps.map((s, i) => `<div class="journey-stage"><span class="journey-index">${String(i + 1).padStart(2, '0')}</span><h3>${s[0]}</h3><p>${s[1]}</p>${i < 5 ? arrow('right', 22) : ''}</div>`).join('')}
      </div>
      <svg class="return-path" viewBox="0 0 1184 60" fill="none" aria-hidden="true"><path d="M1085 0v22c0 14-10 24-24 24H100c-14 0-24-10-24-24V0m-7 9 7-9 7 9" stroke="currentColor" stroke-width="1.5"/></svg>
      <div class="loop-progress" data-layout-box><h3>A new priority can build<br>on the work already done.</h3><p>Completed learning stays recorded across accepted revisions.</p></div>
      <p class="loop-return" data-layout-box>Keep the learning.<br><span>Revisit the decision.</span></p>
      ${foot(3, 'Connected product outputs · Stable learning-step ID: skill:dataQuality · D01')}
    </section>`,

    `<section class="slide s04" id="${chapters[3].slideId}">
      ${title('Every match<br>has a reason')}
      <div class="role-result" data-layout-box><p class="meta">Selected direction · captured result</p><h3>Financial data analyst</h3><p class="role-index"><b>60.68</b><span>/ 100<br>Match index</span></p><p class="role-context">Rank 3 of 6 · Steady adoption</p></div>
      <p class="profile-matches" data-layout-box><b>2 of 5 required skills declared</b><br>Spreadsheets & reporting · Stakeholder communication</p>
      <div class="model-composition" data-layout-box>
        <div class="model-caption"><span class="meta">Scoring weights</span><span>18 + 30 + 12.68 = <b>60.68 index points</b></span></div>
        <div class="weight-rule" aria-label="45 percent required skills, 30 percent transferable strengths, 25 percent research and scenario context"><span></span><span></span><span></span></div>
        <div class="weight-explanations">
          <div><b class="weight-value">45<span>%</span></b><h3>Declared<br>required skills</h3><p>40 × 45% = <b>18.00 points</b></p></div>
          <div><b class="weight-value">30<span>%</span></b><h3>Transferable<br>strengths</h3><p>100 × 30% = <b>30.00 points</b></p></div>
          <div><b class="weight-value">25<span>%</span></b><h3>Research +<br>scenario context</h3><p>50.7 × 25% = <b>12.68 points</b></p></div>
        </div>
      </div>
      <p class="score-limits" data-layout-box>Gaps to review: data quality, analytics and SQL. <b>The match is an index, not an employment probability.</b></p>
      ${foot(4, 'Captured role output and scoring method · Weights describe model structure · D01 / R02')}
    </section>`,

    `<section class="slide s05" id="${chapters[4].slideId}">
      ${title('The source behind<br>the signal')}
      <p class="evidence-dek" data-layout-box>Retrieved metadata is the receipt.<br>Nexus owns the planning assumption.</p>
      <div class="source-record" data-layout-box>
        <div class="source-record-head"><span class="meta">Retrieved Crossref metadata</span><span class="status-label">Stale cache</span></div>
        <h3 class="source-record-title">${esc(source.title)}</h3>
        <div class="source-dates"><div><span class="meta">Published</span><p>23 Oct 2026</p></div><div><span class="meta">Retrieved · MYT</span><p>24 Oct 2026, 00:03:29</p></div></div>
        <a class="source-doi" href="${esc(source.url)}" target="_blank" rel="noreferrer">Oxford University Press · DOI 10.1093/haschl/qxag295 ${arrow('right', 16)}</a>
      </div>
      <div class="mapping-record" data-layout-box>
        <span class="meta">Authored Nexus mapping</span><code>validat</code><p class="mapping-link">Metadata keyword</p>
        <div class="mapping-arrow">${arrow('right', 32)}<span>Review data reliability<br>and human validation</span></div>
        <p class="mapping-factor"><b>1.04<span>×</span></b><span>Data quality<br>& validation factor</span></p>
        <p class="mapping-limit">A planning assumption,<br>not a published paper finding.</p>
      </div>
      <div class="evidence-disclosure" data-layout-box><p>Research context does not establish Malaysian hiring demand.</p><span>Metadata retrieval does not verify quality. A refresh can leave inputs and ranking unchanged.</span></div>
      ${foot(5, 'Revision 947afd1b22fcbef5 · Source receipt and metadata-to-skill rule · D01 / X01–X02')}
    </section>`,

    `<section class="slide canvas s06" id="${chapters[5].slideId}">
      ${title('See the decision change')}
      <a class="demo-open" href="${esc(demoUrl)}" target="_blank" rel="noreferrer">Open demo in a new tab ${arrow('right', 20)}</a>
      <div class="demo-stage" data-layout-box><iframe id="nexus-live-demo" title="Live Nexus hosted prototype" data-demo-src="${esc(demoUrl)}" referrerpolicy="no-referrer" allow="fullscreen"></iframe><p class="demo-print-note">Live Nexus prototype<br><span>${esc(demoUrl)}</span></p></div>
      <p class="demo-sequence" data-layout-box>Review a plan <span>→</span> Complete a step <span>→</span> Compare a scenario <span>→</span> Accept or keep the previous view</p>
      ${foot(6, 'Live hosted prototype (Replit) · Fictional profile · Self-reported completion · Scenarios are authored assumptions')}
    </section>`,

    `<section class="slide s07" id="${chapters[6].slideId}">
      ${title('A plan you can act on')}
      <div class="learning-step-name" data-layout-box><p class="meta">Next step · accepted Faster AI adoption plan</p><h3>Practise SQL & data querying</h3><p>Prerequisite: spreadsheets, already declared.</p></div>
      <div class="learning-resource" data-layout-box><span class="meta">Public resource · Microsoft Learn</span><a class="resource-title" href="https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/" target="_blank" rel="noreferrer">Query and modify data<br>with Transact-SQL ${arrow('right', 24)}</a><p>Free public content · Work at your own pace</p></div>
      <div class="practice-output" data-layout-box><span class="meta">What Siti will have to show</span><p>Write and explain queries, joins<br>and checks on synthetic tables.</p></div>
      <aside class="learning-schedule" data-layout-box><div class="hours-estimate"><b>16<span>h</span></b><p>4 hours/week<br><strong>Weeks 1–4</strong></p></div><div class="schedule-following"><p><span>Weeks 5–8</span>Analytics practice</p><p><span>Weeks 9–10</span>Work sample + review</p></div><p class="remaining-time"><b>40 estimated hours remain</b><br>10 weeks after the demo completion.</p><div class="brief-download"><p>The real career brief carries<br>the plan, sources and progress.</p><button data-download-brief>Download Siti’s brief ↓</button></div></aside>
      <div class="learning-disclosures" data-layout-box><p><b>SDG 4.4:</b> relevant technical skills through reviewed practice. Intended contribution, not measured impact.</p><p>Public content is free; optional certificates, equipment and other costs may apply. Introductory practice is not a qualification.</p></div>
      ${foot(7, 'Public resource: Microsoft Learn · Practice and hours: authored career catalog · D01 / X03–X05')}
    </section>`,

    `<section class="slide s08" id="${chapters[7].slideId}">
      ${title('From CV to decision,<br>with explainable rules')}
      <p class="architecture-dek" data-layout-box>Original files stay in the browser.<br>Saved work stays on this device.</p>
      <svg class="system-connectors" viewBox="0 0 1280 720" fill="none" aria-hidden="true"><path d="M408 350h176m-12-8 12 8-12 8M584 420H408m12-8-12 8 12 8M944 350h96m-12-8 12 8-12 8M1040 392h-96m12-8-12 8 12 8" stroke="currentColor" stroke-width="1.5"/></svg>
      <div class="system-browser" data-layout-box><span class="meta">React / Vite</span><h3>Worker workspace</h3><p>Read the original CV file<br>Review experience and plan</p><div class="local-storage"><h4>Saved on this device</h4><p>Decisions · completion · reflections</p></div></div>
      <div class="system-request" data-layout-box><p>Extracted text +<br>reviewed profile</p><p>Roles, sources<br>and learning plans</p></div>
      <div class="system-api" data-layout-box><span class="meta">Express / CPU rules</span><h3>Career API</h3><p>Explain scores and gaps<br>Order learning steps</p><div><p>Text/profile processed in memory.<br>Public research revision cache.</p></div></div>
      <div class="system-research" data-layout-box><span class="meta">Public research</span><h3>Crossref</h3><p>Metadata<br>Source links<br>Publication dates</p></div>
      <div class="validation-strip" data-layout-box><div><span class="meta">Implemented baseline</span><p>Explainable rules. No active LLM or GPU.</p></div><div><span class="meta">Next validation</span><p>Adviser matching quality + Malaysian demand relevance.</p></div></div>
      <p class="engineering-limit" data-layout-box>Engineering checks do not establish forecast accuracy, general fairness or employment outcomes.</p>
      ${foot(8, 'Active implementation and data boundaries · README / Backend / Integration docs')}
    </section>`,

    `<section class="slide s09" id="${chapters[8].slideId}">
      ${title('Expected impact,<br>measured in a pilot')}
      <div class="pilot-scope" data-layout-box><span class="meta">Proposed scope</span><p>One adviser team.<br>Two review sessions.</p></div>
      <div class="pilot-evaluation" data-layout-box><div class="pilot-table-title"><h3>Expected benefits to test</h3><span>Intended benefits · baselines pending</span></div><table><thead><tr><th>Intended benefit</th><th>Proposed pilot measure</th></tr></thead><tbody><tr><td>Clearer next steps</td><td>Time to an adviser-agreed action</td></tr><tr><td>Traceable advice</td><td>Validity of each source used</td></tr><tr><td>Useful revisions</td><td>Why a change was accepted or reverted</td></tr><tr><td>Visible learning</td><td>Adviser review of a work sample</td></tr></tbody></table></div>
      <aside class="buyer-model" data-layout-box><span class="meta">For workers and advisers</span><h3>A clearer next step.<br>A decision worth revisiting.</h3><p>Keep useful learning while reviewing a new direction.</p><div><span class="meta">Buyer hypothesis</span><p>Malaysian career centres<br>& reskilling providers.</p><small>Subscription per active advised learner.<br>Pricing remains to validate.</small></div></aside>
      <p class="pilot-boundary" data-layout-box>Expected benefits, not measured outcomes. No employment or impact results are claimed.</p>
      ${foot(9, 'Intended benefits, buyer model and pilot scope are proposals · P01')}
    </section>`,

    `<section class="slide dark s10" id="${chapters[9].slideId}">
      <div class="closing-wordmark" data-layout-box>${wordmark}</div><p class="event-credit" data-layout-box>Team Decisive<br>SDC Hackathon 2026</p>
      ${title('Make the next learning<br>decision reviewable')}
      <p class="closing-ask" data-layout-box>Bring one adviser team.<br>Review a transition brief with us.</p>
      <a class="demo-invitation" href="#${chapters[5].slideId}" data-layout-box>See Siti’s decision change ${arrow('right', 28)}</a>
      <p class="local-prototype" data-layout-box>Hosted prototype available for demonstration.</p>
      <p class="closing-promise" data-layout-box>Plans evolve.<br><span>Progress stays.</span></p>
      <div class="team-line" data-layout-box><div><strong>Raye Chan Jun Foong</strong><span>Team leader</span></div><div><strong>Teo Zheng Xi</strong><span>Tech lead</span></div><div><strong>Liew Jicson</strong><span>Video</span></div></div>
      ${foot(10, 'Domain 1 · Aiversecity Future-Ready Workforce · Advance with every shift.', true)}
    </section>`,
  ];

  return {
    slides,
    composition: {
      version: layoutVersion,
      mode: 'Redesign · Preserve Nexus identity',
      concept: 'The worker’s decision, the evidence behind it, and the learning that survives it.',
      typeRoles: { hero: 72, headline: 54, subheading: 28, body: 24, supporting: 20, metadata: 13, source: 12 },
      grid: { width: 1280, height: 720, margin: 48, rhythm: 8, footerY: 664 },
      visualTreatment: 'Native typography and diagrams. No product screenshots. Exactly one live iframe on slide 6; captured API values remain labelled historical evidence.',
    },
  };
}

export const pitchLayoutCss = `
:root {
  --cobalt:#4355E7; --midnight:#111A34; --cyan:#83F0E7;
  --violet:#9073FF; --ice:#E3E8FF; --canvas:#F4F6FB;
  --paper:#FFFFFF; --ink:#202B46; --muted:#606C85; --divider:#DFE4F0;
  --on-dark:#D4DCF3; --on-dark-muted:#B7C3E2;
  --c-font-mono:'IBM Plex Mono','Cascadia Code',monospace;
  --c-harvest:var(--cyan);
  --font-heading:'Sora',system-ui,sans-serif;
  --font-body:'DM Sans',system-ui,sans-serif;
}
* { box-sizing:border-box; }
html,body { margin:0; width:100%; height:100%; overflow:hidden; }
body { background:var(--midnight); color:var(--ink); font:24px/1.4 var(--font-body); -webkit-font-smoothing:antialiased; font-synthesis:none; }
::selection { color:var(--midnight); background:var(--cyan); }
button,a { touch-action:manipulation; }
button { font:inherit; cursor:pointer; }
a { color:inherit; text-underline-offset:4px; }
button:focus-visible,a:focus-visible { outline:3px solid var(--cobalt); outline-offset:5px; }
.dark a:focus-visible { outline-color:var(--cyan); }
button:active,a:active { filter:brightness(.92); }
button:disabled { opacity:.35; cursor:default; }
p,h1,h2,h3,h4,figure { margin:0; }
p { text-wrap:pretty; }
h1,h2,h3,h4 { font-family:var(--font-heading); font-weight:600; letter-spacing:-.03em; }
img { display:block; max-width:100%; }
strong,b { font-weight:700; }
.c-wordmark { display:inline-flex; align-items:center; font-family:var(--c-font-mono); font-weight:500; letter-spacing:-.065em; line-height:1; }
.c-wordmark-x { display:inline-block; color:var(--cyan); transform-origin:50% 62%; }
#viewport { width:100%; height:100%; position:relative; }
#stage { position:absolute; left:50%; top:50%; width:1280px; height:720px; transform-origin:center; transform:translate(-50%,-50%) scale(var(--scale,1)); }
.slide { position:relative; width:1280px; height:720px; overflow:hidden; background:var(--paper); display:none; }
.slide.active { display:block; }
.slide.canvas { background:var(--canvas); }
.slide.dark { color:var(--paper); background:var(--midnight); }
.slide-title { position:absolute; left:48px; top:46px; font-size:54px; line-height:1.08; letter-spacing:-.03em; font-weight:600; }
.slide-title span { color:var(--cobalt); }
.meta { display:block; font-family:var(--font-body); font-size:13px; font-weight:700; letter-spacing:.055em; line-height:1.4; color:var(--muted); }
.deck-footer { position:absolute; left:48px; right:48px; bottom:24px; height:32px; display:flex; gap:28px; align-items:flex-end; border-top:1px solid var(--divider); padding-top:12px; }
.footer-brand { display:block; font-size:22px; line-height:1; color:var(--midnight); margin-bottom:-1px; }
.footer-source { font-size:12px; line-height:1.25; color:var(--muted); flex:1; }
.footer-section { font-size:12px; line-height:1.25; font-weight:700; color:var(--cobalt); white-space:nowrap; }
.folio { font:12px/1.3 var(--c-font-mono); color:var(--muted); font-variant-numeric:tabular-nums; }
.deck-footer.on-dark { border-color:#405070; }
.on-dark .footer-brand { display:none; }
.on-dark .footer-source,.on-dark .folio { color:var(--on-dark-muted); }
.on-dark .footer-section { color:var(--cyan); }
.direction-icon { flex:none; vertical-align:middle; }
.direction-icon.left { transform:rotate(180deg); }

/* 01: a proposition and its two complementary promises. */
.hero-wordmark,.closing-wordmark { position:absolute; left:48px; top:48px; font-size:60px; }
.event-credit { position:absolute; top:50px; right:48px; font-size:13px; line-height:1.65; color:var(--on-dark-muted); text-align:right; }
.s01 h1 { position:absolute; left:48px; top:212px; font-size:72px; line-height:1.13; letter-spacing:-.03em; font-weight:600; }
.s01 h1 span { color:var(--cyan); }
.hero-description { position:absolute; left:48px; top:416px; font-size:25px; line-height:1.5; color:var(--on-dark); }
.hero-signature { position:absolute; left:48px; top:586px; font-size:18px; color:var(--cyan); }
.hero-principle { position:absolute; left:752px; top:210px; width:480px; }
.hero-principle>div+div { border-top:1px solid #405070; padding-top:32px; margin-top:32px; }
.hero-principle p { font-size:15px; color:var(--on-dark-muted); margin-bottom:14px; }
.hero-principle h3 { font-size:34px; line-height:1.25; }
.hero-principle>div:last-child h3 { color:var(--cyan); }

/* 02: experience on the left; a finite weekly decision on the right. */
.worker-profile { position:absolute; left:48px; top:216px; width:536px; }
.worker-profile h3 { font-size:38px; line-height:1.15; margin-top:12px; }
.worker-role { font-size:23px; color:var(--muted); margin-top:8px; }
.worker-tasks { margin-top:24px; width:480px; }
.worker-tasks p { font-size:23px; padding:7px 0; border-top:1px solid var(--divider); }
.worker-tasks p:last-child { border-bottom:1px solid var(--divider); }
.worker-goal { font-size:16px; color:var(--muted); margin-top:16px; }
.worker-divider { position:absolute; left:632px; top:216px; height:400px; border-left:1px solid var(--divider); }
.worker-decision { position:absolute; left:688px; top:226px; width:544px; }
.learning-budget { display:flex; align-items:center; gap:28px; }
.learning-budget>b { font:600 100px/1 var(--font-heading); letter-spacing:-.04em; color:var(--cobalt); font-variant-numeric:tabular-nums; }
.learning-budget>b span { font-size:46px; letter-spacing:-.03em; }
.learning-budget p { font-size:24px; line-height:1.3; }
.learning-budget p span { display:block; font-size:14px; color:var(--muted); margin-top:8px; }
.worker-question { font:600 30px/1.35 var(--font-heading); letter-spacing:-.025em; margin-top:36px; }
.worker-review { font-size:19px; line-height:1.5; color:var(--muted); margin-top:24px; }

/* 03: one connected sequence, with progress returning to the next decision. */
.loop-dek { position:absolute; left:832px; top:78px; font-size:21px; line-height:1.45; color:var(--muted); }
.journey { position:absolute; left:48px; top:252px; width:1184px; display:grid; grid-template-columns:repeat(6,1fr); gap:24px; }
.journey-stage { position:relative; }
.journey-index { display:block; font:18px/1.3 var(--c-font-mono); color:var(--cobalt); margin-bottom:20px; }
.journey-stage h3 { font-size:24px; line-height:1.25; letter-spacing:-.025em; }
.journey-stage p { font-size:17px; line-height:1.4; color:var(--muted); margin-top:12px; }
.journey-stage .direction-icon { position:absolute; top:2px; right:4px; color:var(--cobalt); }
.return-path { position:absolute; left:48px; top:432px; width:1184px; height:60px; color:var(--cobalt); }
.loop-progress { position:absolute; left:48px; top:522px; width:784px; }
.loop-progress h3 { font-size:30px; line-height:1.25; }
.loop-progress p { font-size:17px; line-height:1.4; color:var(--muted); margin-top:12px; }
.loop-return { position:absolute; left:880px; top:540px; font:600 28px/1.35 var(--font-heading); letter-spacing:-.025em; }
.loop-return span { color:var(--cobalt); }

/* 04: model structure, not an outcomes chart. */
.role-result { position:absolute; left:664px; top:48px; width:568px; }
.role-result h3 { font-size:30px; line-height:1.2; margin-top:14px; }
.role-index { display:flex; align-items:center; gap:20px; margin-top:18px; }
.role-index b { font:600 72px/1 var(--font-heading); letter-spacing:-.03em; color:var(--cobalt); font-variant-numeric:tabular-nums; }
.role-index span { font-size:16px; line-height:1.5; color:var(--muted); }
.role-context { font-size:16px; color:var(--muted); margin-top:12px; }
.profile-matches { position:absolute; left:48px; top:222px; font-size:19px; line-height:1.6; }
.profile-matches b { font-size:24px; font-weight:500; }
.model-composition { position:absolute; left:48px; top:350px; width:1184px; }
.model-caption { display:flex; justify-content:space-between; align-items:baseline; font-size:18px; }
.weight-rule { display:flex; height:16px; margin-top:18px; gap:4px; }
.weight-rule span:nth-child(1) { width:45%; background:var(--cobalt); }
.weight-rule span:nth-child(2) { width:30%; background:var(--midnight); }
.weight-rule span:nth-child(3) { width:25%; background:var(--violet); }
.weight-explanations { display:grid; grid-template-columns:45fr 30fr 25fr; padding-top:24px; gap:28px; }
.weight-explanations>div { position:relative; }
.weight-value { font:600 44px/1 var(--font-heading); letter-spacing:-.035em; color:var(--cobalt); font-variant-numeric:tabular-nums; }
.weight-value span { font-size:28px; }
.weight-explanations>div:nth-child(2) .weight-value { color:var(--midnight); }
.weight-explanations>div:nth-child(3) .weight-value { color:#654BC0; }
.weight-explanations h3 { position:absolute; left:126px; top:0; font:500 23px/1.25 var(--font-body); letter-spacing:0; }
.weight-explanations>div:nth-child(3) h3 { left:98px; }
.weight-explanations p { font-size:17px; line-height:1.4; margin-top:28px; font-variant-numeric:tabular-nums; }
.weight-explanations p b { font-weight:500; }
.score-limits { position:absolute; left:48px; top:606px; font-size:16px; line-height:1.4; color:var(--muted); }
.score-limits b { font-weight:500; color:var(--ink); }

/* 05: the source and the authored mapping remain visibly different things. */
.evidence-dek { position:absolute; left:784px; top:77px; font-size:21px; line-height:1.5; color:var(--muted); }
.source-record { position:absolute; left:48px; top:212px; width:688px; }
.source-record-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.status-label { border:1px solid var(--divider); background:var(--ice); padding:5px 10px; font-size:12px; font-weight:700; color:var(--ink); }
.source-record-title { font-size:27px; line-height:1.32; letter-spacing:-.02em; }
.source-dates { display:grid; grid-template-columns:168px 1fr; gap:24px; margin-top:16px; }
.source-dates p { font-size:20px; margin-top:7px; font-variant-numeric:tabular-nums; }
.source-doi { display:inline-flex; align-items:center; gap:8px; margin-top:16px; font-size:14px; color:var(--cobalt); }
.mapping-record { position:absolute; left:800px; top:230px; width:432px; padding-left:32px; border-left:1px solid var(--divider); }
.mapping-record>code { display:block; font:500 30px/1.2 var(--c-font-mono); color:var(--cobalt); margin-top:24px; }
.mapping-link { font-size:18px; color:var(--muted); margin-top:8px; }
.mapping-arrow { display:flex; align-items:center; gap:20px; font-size:21px; line-height:1.4; margin-top:20px; }
.mapping-arrow .direction-icon { color:var(--cobalt); }
.mapping-factor { display:flex; align-items:center; gap:24px; margin-top:24px; }
.mapping-factor>b { font:600 46px/1 var(--font-heading); letter-spacing:-.03em; color:var(--cobalt); font-variant-numeric:tabular-nums; }
.mapping-factor>b span { font-size:32px; }
.mapping-factor>span { font-size:19px; line-height:1.35; }
.mapping-limit { font-size:17px; line-height:1.4; color:var(--muted); margin-top:22px; }
.evidence-disclosure { position:absolute; left:48px; top:594px; width:1184px; border-top:1px solid var(--divider); padding-top:14px; }
.evidence-disclosure p { font-size:21px; font-weight:500; }
.evidence-disclosure span { display:block; font-size:14px; color:var(--muted); margin-top:6px; }

/* 06: the only product surface is the working app itself. */
.s06 .slide-title { font-size:48px; }
.demo-open { position:absolute; right:48px; top:64px; display:flex; align-items:center; gap:12px; font-size:16px; color:var(--cobalt); text-decoration:none; }
.demo-open:hover { text-decoration:underline; }
.demo-stage { position:absolute; left:48px; top:128px; width:1184px; height:472px; border:1px solid var(--divider); border-radius:8px; overflow:hidden; background:var(--paper); }
.demo-stage iframe { display:block; width:100%; height:100%; border:0; background:var(--paper); }
.demo-print-note { display:none; }
.demo-sequence { position:absolute; left:48px; top:620px; width:1184px; font-size:17px; line-height:1.4; color:var(--muted); }
.demo-sequence span { display:inline-block; margin:0 15px; color:var(--cobalt); }

/* 07: a readable resource excerpt, the practice output, and a real schedule. */
.learning-step-name { position:absolute; left:48px; top:170px; width:736px; }
.learning-step-name h3 { font-size:30px; line-height:1.2; margin-top:14px; }
.learning-step-name>p:last-child { font-size:20px; color:var(--muted); margin-top:12px; }
.learning-resource { position:absolute; left:48px; top:316px; width:736px; }
.resource-title { display:block; font:600 28px/1.3 var(--font-heading); letter-spacing:-.025em; color:var(--cobalt); margin-top:16px; text-decoration:none; }
.resource-title:hover { text-decoration:underline; }
.learning-resource>p { font-size:16px; line-height:1.4; color:var(--muted); margin-top:12px; }
.practice-output { position:absolute; left:48px; top:500px; width:736px; }
.practice-output>p { font-size:27px; line-height:1.35; margin-top:12px; }
.learning-schedule { position:absolute; left:864px; top:172px; width:368px; }
.hours-estimate { display:flex; align-items:center; gap:26px; }
.hours-estimate>b { font:600 80px/1 var(--font-heading); letter-spacing:-.035em; color:var(--cobalt); font-variant-numeric:tabular-nums; }
.hours-estimate>b span { font-size:38px; }
.hours-estimate>p { font-size:21px; line-height:1.4; }
.hours-estimate strong { font-weight:500; }
.schedule-following { border-top:1px solid var(--divider); padding-top:14px; margin-top:20px; }
.schedule-following p { font-size:17px; line-height:1.4; margin-bottom:6px; }
.schedule-following span { display:block; color:var(--muted); font-size:14px; }
.remaining-time { font-size:17px; line-height:1.45; margin-top:16px; color:var(--muted); }
.remaining-time b { color:var(--ink); font-weight:500; }
.brief-download { margin-top:18px; }
.brief-download p { font-size:17px; line-height:1.4; color:var(--muted); }
.brief-download button { border:0; border-radius:8px; background:var(--cobalt); color:var(--paper); font-size:19px; font-weight:700; padding:11px 18px; margin-top:14px; }
.brief-download button:hover { background:var(--midnight); }
.learning-disclosures { position:absolute; left:48px; top:610px; width:1184px; }
.learning-disclosures p { font-size:13px; line-height:1.45; color:var(--muted); margin-bottom:6px; }

/* 08: one diagram with a clear browser/API/public-research boundary. */
.architecture-dek { position:absolute; left:848px; top:78px; font-size:20px; line-height:1.5; color:var(--muted); }
.system-connectors { position:absolute; inset:0; width:1280px; height:720px; color:var(--cobalt); }
.system-browser,.system-api { position:absolute; top:248px; width:360px; height:294px; border-radius:8px; padding:24px; }
.system-browser { left:48px; border:1px solid var(--divider); background:var(--canvas); }
.system-api { left:584px; background:var(--midnight); color:var(--paper); }
.system-browser h3,.system-api h3 { font-size:28px; line-height:1.2; margin-top:14px; }
.system-browser>p,.system-api>p { font-size:21px; line-height:1.45; margin-top:22px; }
.local-storage { border-top:1px solid var(--divider); padding-top:18px; margin-top:24px; }
.local-storage h4 { font-size:18px; font-weight:500; letter-spacing:0; }
.local-storage p { font-size:15px; line-height:1.45; color:var(--muted); margin-top:8px; }
.system-api>.meta { color:var(--cyan); }
.system-api>div { margin-top:22px; padding-top:18px; border-top:1px solid #405070; }
.system-api>div p { color:var(--on-dark); font-size:15px; line-height:1.5; }
.system-request { position:absolute; left:424px; top:302px; width:144px; text-align:center; color:var(--muted); }
.system-request p { font-size:15px; line-height:1.4; }
.system-request p+p { margin-top:96px; }
.system-research { position:absolute; left:1040px; top:278px; width:192px; }
.system-research h3 { font-size:30px; line-height:1.2; margin-top:14px; }
.system-research>p { font-size:20px; line-height:1.5; margin-top:22px; }
.validation-strip { position:absolute; left:48px; top:570px; display:grid; grid-template-columns:488px 1fr; gap:48px; width:1184px; }
.validation-strip p { font-size:18px; line-height:1.4; margin-top:8px; }
.engineering-limit { position:absolute; left:48px; top:634px; font-size:13px; color:var(--muted); }

/* 09: the measurement plan leads, with commercial hypotheses in support. */
.pilot-scope { position:absolute; left:864px; top:62px; width:368px; }
.pilot-scope p { font-size:26px; line-height:1.35; margin-top:14px; }
.pilot-evaluation { position:absolute; left:48px; top:252px; width:736px; }
.pilot-table-title { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
.pilot-table-title h3 { font-size:26px; line-height:1.2; }
.pilot-table-title>span { font-size:14px; color:var(--muted); }
.pilot-evaluation table { display:block; width:100%; border-collapse:collapse; }
.pilot-evaluation thead,.pilot-evaluation tbody { display:block; }
.pilot-evaluation tr { display:grid; grid-template-columns:44fr 56fr; }
.pilot-evaluation th { font-size:13px; font-weight:700; text-align:left; color:var(--muted); padding:0 0 14px; }
.pilot-evaluation th:first-child { width:auto; }
.pilot-evaluation td { font-size:21px; line-height:1.35; border-top:1px solid var(--divider); padding:17px 12px 17px 0; }
.pilot-evaluation td:last-child { font-size:19px; }
.pilot-evaluation tr:last-child td { border-bottom:1px solid var(--divider); }
.buyer-model { position:absolute; left:864px; top:252px; width:368px; }
.buyer-model h3 { font-size:25px; line-height:1.3; margin-top:14px; }
.buyer-model>p { font-size:21px; line-height:1.45; margin-top:20px; }
.buyer-model>div { border-top:1px solid var(--divider); padding-top:20px; margin-top:24px; }
.buyer-model>div p { font-size:19px; line-height:1.4; margin-top:12px; }
.buyer-model small { display:block; font-size:14px; color:var(--muted); margin-top:10px; }
.pilot-boundary { position:absolute; left:48px; top:630px; font-size:14px; color:var(--muted); }

/* 10: a single invitation, with people and availability grounded below it. */
.s10 .slide-title { top:170px; font-size:58px; line-height:1.14; }
.closing-ask { position:absolute; left:48px; top:348px; font-size:26px; line-height:1.45; color:var(--on-dark); }
.demo-invitation { position:absolute; left:48px; top:450px; display:inline-flex; align-items:center; gap:24px; background:var(--cyan); color:var(--midnight); border-radius:8px; padding:15px 22px; font-size:23px; line-height:1.2; font-weight:700; text-decoration:none; }
.demo-invitation:hover { background:var(--paper); }
.local-prototype { position:absolute; left:48px; top:528px; color:var(--on-dark-muted); font-size:17px; }
.closing-promise { position:absolute; left:864px; top:378px; font:600 32px/1.35 var(--font-heading); letter-spacing:-.025em; }
.closing-promise span { color:var(--cyan); }
.team-line { position:absolute; left:48px; right:48px; top:586px; display:grid; grid-template-columns:repeat(3,1fr); gap:48px; border-top:1px solid #405070; padding-top:20px; }
.team-line strong { display:block; font-size:21px; font-weight:500; }
.team-line span { display:block; font-size:14px; color:var(--on-dark-muted); margin-top:6px; }

/* The presentation engine stays outside the scaled canvas. */
#toolbar { position:fixed; bottom:10px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:4px; padding:6px 8px; border:1px solid #405070; border-radius:8px; z-index:20; background:var(--midnight); color:var(--paper); font-size:13px; opacity:0; transition:opacity .18s; }
#toolbar:hover,#toolbar:focus-within { opacity:1; }
#toolbar button { background:transparent; color:inherit; border:0; padding:7px 10px; border-radius:4px; font-size:13px; }
#toolbar button:hover { background:#253154; }
#counter { min-width:64px; text-align:center; font:12px var(--c-font-mono); }
#notes { position:fixed; right:20px; top:20px; bottom:70px; width:min(480px,calc(100vw - 40px)); overflow:auto; padding:24px; border:1px solid var(--divider); border-radius:8px; background:var(--paper); color:var(--ink); z-index:30; font-size:16px; scrollbar-color:var(--muted) var(--canvas); }
#notes[hidden] { display:none; }
#notes h3 { font-size:24px; line-height:1.3; margin-bottom:16px; }
#notes h4 { font:700 13px var(--font-body); letter-spacing:.055em; margin:24px 0 8px; }
#notes p { margin-bottom:14px; }
#notes a { color:var(--cobalt); font-size:14px; }
#notes ol { padding-left:20px; }
#notes li { margin-bottom:12px; }
#notes button { font-size:14px; padding:8px 12px; border:1px solid var(--divider); border-radius:6px; background:var(--canvas); }
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
@media(prefers-reduced-motion:reduce) { * { animation:none!important; transition:none!important; } }
@page { size:13.333333in 7.5in; margin:0; }
@media print {
  html,body { width:1280px; height:auto; overflow:visible; background:white; }
  * { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  #viewport { display:contents; }
  #stage { position:static; width:1280px; height:auto; transform:none!important; }
  section.slide { display:block!important; position:relative; height:720px; break-after:page; page-break-after:always; }
  section.slide:last-child { break-after:auto; page-break-after:auto; }
  #toolbar,#notes,.sr-only { display:none!important; }
  .demo-stage iframe { display:none; }
  .demo-print-note { display:block; padding:48px; font-size:28px; }
  .demo-print-note span { display:block; font-size:20px; margin-top:16px; color:var(--muted); }
}
`;
