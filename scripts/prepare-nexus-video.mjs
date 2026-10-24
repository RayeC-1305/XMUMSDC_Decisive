// Plan/content synchronization for the seven-minute adaptation of the deck.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const root='nexus-video';
const pitch=JSON.parse(await fs.readFile('output/pitch/pitch-data.json','utf8'));
const chapters=structuredClone(pitch.slides);
// Video-only preflight uses the current isolated local recording session.
for(const c of chapters){c.beats=c.beats.map(x=>x.replaceAll("sixty point seven eight","sixty point seven eight").replaceAll("sixty-three point two zero","sixty-three point two zero").replaceAll("twelve point six eight","twelve point seven eight").replaceAll("third of six","second of six"));}
const replace=(n,beats,steps,durations)=>Object.assign(chapters[n-1],{beats,steps,durations,seconds:durations.reduce((a,b)=>a+b,0)});

replace(1,[
 'What should you learn next, and what would make you change that choice?',
 'Nexus helps workers and career advisers turn existing experience into a learning decision they can inspect and revisit.',
 'Plans evolve. Progress stays.',
],[
 'One finite learning-time budget connects to the central question about a next step and a reason to reconsider.',
 'Existing experience connects through a reviewed profile to an actionable learning decision.',
 'Two authored priorities share the same completed learning step; the Nexus message anchors that relationship.',
],[6,7,7]);
replace(2,[
 'The problem is choosing a worthwhile next learning step when time is limited and career-planning assumptions can change.',
 'Siti Rosli is our fictional operations coordinator. She brings spreadsheet reporting, supplier coordination and document processing.',
 'For this demonstration, she has four learning hours a week.',
 'Which strengths transfer? Which gaps deserve that time? And what would justify a different direction?',
],[
 'A limited learning budget meets a changing planning assumption; the decision is the problem, with no labour-market statistics.',
 'Siti’s three sample operations tasks connect to the reviewed five-skill profile.',
 'The four-hours/week demo preference becomes the scale of the learning decision.',
 'Existing strengths, gaps and a reason to reconsider form the three parts of Siti’s question.',
],[9,9,6,11]);
replace(3,[
 'Our solution starts with reviewed experience. Siti can edit her profile before choosing a direction.',
 'She compares six authored role directions, with inspectable reasons behind each match.',
 'The evidence has source links and dates. Its mapping assumptions are visible too.',
 'A selected direction becomes an ordered plan with prerequisites, resources and practice outputs.',
 'When assumptions change, she can inspect a proposed revision and accept it, or keep the previous view.',
 'Completed learning stays recorded. The next decision can build on the work already done.',
],[
 'Review experience: a profile connects declared tasks and skills to the worker’s edit decision.',
 'Compare directions: the six-role set connects to a selected, explained direction.',
 'Inspect evidence: source metadata remains distinct from Nexus’s mapping assumption.',
 'Build a plan: a gap connects to its prerequisite and practice output.',
 'Review a change: a proposed priority connects to accept and keep-previous-view choices.',
 'Retain learning: the completed step connects the previous plan to the revised decision.',
],[6,5,5,6,7,6]);
// Chapters 4 and 10 retain the reviewed seven-weight/point explanation and team beats.
replace(5,[
 'This source receipt identifies the title, publisher, publication date and retrieval time for a record in the same evidence revision.',
 'This cached revision keeps its publication and retrieval dates visible.',
 'Nexus maps a metadata keyword to a small planning weight. Here, the data-quality factor is one point zero four.',
 'That mapping is our assumption. It is not a finding published by the paper.',
 'Metadata does not verify research quality or establish Malaysian hiring demand.',
 'A refresh can return the same inputs and leave the ranking unchanged.',
],[
 'The actual cached OUP source record displays its title, publisher and publication date as native text.',
 'The cached status stays beside the original retrieval timestamp and revision.',
 'The literal metadata term validat connects to the authored dataQuality factor 1.04× and its rationale.',
 'The retrieved record and the authored mapping remain two visibly distinct information types.',
 'Research-quality and local-demand limitations qualify the planning signal.',
 'The possibility of an unchanged refresh prevents a guaranteed-new-signal implication.',
],[9,4,8,7,6,6]);
replace(6,[
 'Here is the change we verified. Siti’s selected direction is Financial data analyst. Under Steady adoption, her first learning priority is data quality and validation.',
 'We mark that step complete for this demonstration. It is a self-reported state. No actual study is claimed.',
 'Now we compare Faster AI adoption. This is an authored planning scenario, rather than a published forecast.',
 'The proposed priority becomes SQL and data querying. In our verified capture, the index moves from sixty point seven eight to sixty-three point two zero.',
 'The review keeps the same four learning steps and preserves the completed data-quality step.',
 'We inspect the proposal and choose Accept and update my plan.',
 'After a reload, that completed step remains recorded. A changed priority has not erased it.',
 'We test the other review option on a separate Green transition proposal. Keep previous view returns us to the accepted Faster AI adoption plan.',
 'The completion is still there. Siti can revise her decision while retaining a record of useful progress.',
],[
 'In the real app, show the fictional Siti profile, four-hours/week preference, Financial data analyst and Steady adoption plan.',
 'Use the real Mark step complete action on Practise Data quality & validation; keep its self-reported demo label readable.',
 'Choose Faster AI adoption using the same profile, selected role and evidence revision.',
 'Open Review changes and inspect the actual changed priority and captured index comparison, subject to preflight verification.',
 'Focus the actual review’s retained step IDs and preserved completion.',
 'Use the real Accept & update my plan action.',
 'Reload the real app and show the same completed data-quality step.',
 'Propose Green transition separately, inspect it and use Keep previous view to return to the accepted faster-AI view.',
 'Show that completion remains, with scenario assumptions and demo completion status still clear.',
],[11,10,9,12,9,8,10,13,8]);
replace(7,[
 'The next step is concrete: practise SQL and data querying.',
 'Siti’s declared spreadsheet experience satisfies the authored prerequisite. That declaration is still something an adviser can review.',
 'The public resource is Microsoft Learn’s Query and modify data with Transact-SQL.',
 'The practice output is queries, joins and checks on synthetic tables. Nexus estimates sixteen hours including practice, across four weeks.',
 'After the demo completion, forty estimated hours remain over ten weeks. Analytics follows SQL, then a work sample and review.',
 'The real career brief brings the plan, sources and recorded progress together. SDG links explain intended contribution.',
 'Public resource content is free. Optional costs may apply. Introductory practice does not establish professional qualification.',
],[
 'The accepted plan connects the next SQL activity to a concrete learning gap.',
 'The reviewed spreadsheet declaration connects to SQL’s authored prerequisite.',
 'The Microsoft Learn resource appears as native bibliographic text and a direct resource link.',
 'An explicitly illustrative synthetic-table practice example connects to the authored 16-hour estimate and weeks 1–4.',
 'The remaining schedule connects SQL weeks 1–4, analytics weeks 5–8 and work sample weeks 9–10 to 40 remaining hours.',
 'The real Markdown brief exposes the selected scenario, sources, completion and intended SDG 4.4 contribution.',
 'Resource-cost and qualification limitations remain beside the learning action.',
],[5,7,6,9,9,7,7]);
replace(8,[
 'The working prototype connects a React workspace to an Express career API.',
 'CPU rules rank directions using cached public Crossref research metadata.',
 'Original CV files stay in the browser. The API processes extracted text and the reviewed profile in memory.',
 'Saved decisions, completion and reflections stay on this device. They do not sync through cloud accounts.',
 'The active application uses no LLM or GPU inference.',
 'Engineering checks verify the working flow. They do not establish forecast accuracy, general fairness or employment outcomes.',
],[
 'The browser workspace connects to the Express API across the actual request boundary.',
 'CPU rules connect the reviewed profile and public Crossref revision to roles and learning plans.',
 'Original file bytes remain in the browser while extracted text/profile cross into API memory.',
 'Device-local decisions, completion and reflections sit inside the browser boundary.',
 'The implemented CPU baseline is identified without implying LLM or GPU use.',
 'Working implementation is separated from the next validation of advice quality and outcomes.',
],[5,5,7,6,5,7]);
replace(9,[
 'We want a clearer learning decision that an adviser can review.',
 'We propose one adviser team and two review sessions.',
 'Measure time to an adviser-agreed next action.',
 'Check the validity of each source used.',
 'Ask whether accepting or reverting a revision helped.',
 'Review completed practice work with the adviser.',
 'Our buyer hypothesis is Malaysian career centres and reskilling providers.',
 'A subscription per active advised learner is possible. Pricing remains unvalidated.',
 'These are expected benefits. Baselines and employment outcomes remain unmeasured.',
],[
 'The expected-impact proposition connects a worker’s next action to adviser review.',
 'The proposed one-team, two-session pilot identifies who would validate that proposition.',
 'Clearer next steps connect to the proposed time-to-agreed-action measure.',
 'Traceable advice connects to source validity checks.',
 'Revision usefulness connects to reasons for acceptance or reversion.',
 'Visible learning connects to adviser review of a real practice work sample, labelled unavailable until produced.',
 'The initial Malaysian career-centre/provider buyer hypothesis appears as a hypothesis.',
 'The possible active-advised-learner subscription unit appears with pricing still unvalidated.',
 'Pending baselines and the absence of measured outcomes qualify the pilot invitation.',
],[5,4,4,4,4,4,5,5,5]);
chapters[0].seconds=20; // 0:00–0:20
chapters[3].seconds=45;
chapters[9].seconds=30;
const referenceLabel='Current video preflight: revision 22a5e09950739768, verified in the isolated fictional UI; stale at later verification. Recheck before final recording.';
// Employer extension uses the same single live frame after the worker proof.
chapters[5].steps.push('Before recording, prepare a synthetic campaign and select a learning cohort. On this beat open the actual Replit employer introduction and enter the prepared campaign in /hr/demo.','Use the real synthetic employee survey and show immediate personal roles and pathways.','Focus one capability-map gap and its pathway, then compare one authored scenario. The complete radar/profile tour remains available in the product, outside this timed sequence.','Download the actual cited brief for the prepared prerequisite-aware cohort selection.');
chapters[5].pool.push('Employer workflow and synthetic-only, no-auth, single-process persistence limitations — article §1a / R08.');
chapters[5].refs.push('R08');
chapters[7].steps[3]='Worker device-local progress is distinct from synthetic employer campaigns and profiles saved to server JSON.';
chapters[7].steps[4]='Replit hosting, CPU rules and the lack of employer authentication remain explicit.';
chapters[8].steps[6]='Employers, career centres and reskilling providers appear as unvalidated buyer hypotheses.';
chapters[8].steps[7]='A possible organisational subscription remains unpriced and unvalidated.';
chapters[9].steps[4]='The core message closes with a working Replit link for both audiences.';
let workflow;
try{workflow=JSON.parse(await fs.readFile(root+'/workflow.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
// Implemented chapter narration arrays become authoritative as chapters land.
for(const c of chapters){
 const file=path.resolve(root,'presentation/src/chapters',String(c.number).padStart(2,'0')+'-'+c.id,'narrations.ts');
 try{await fs.access(file);}catch(e){if(e.code==='ENOENT')continue;throw e;}
 const implemented=await import(pathToFileURL(file).href);
 if(!Array.isArray(implemented.narrations)||implemented.narrations.some(x=>typeof x!=='string'))throw Error('Invalid chapter narration: '+c.id);
 c.beats=implemented.narrations;
 if(implemented.durations)c.durations=implemented.durations;
 c.seconds=c.durations.reduce((a,b)=>a+b,0);
}
let offset=0,beat=0;
for(const c of chapters){
 c.startSeconds=offset;c.endSeconds=offset+c.seconds;offset=c.endSeconds;
 c.beatStart=beat+1;beat+=c.beats.length;c.beatEnd=beat;
 c.assets=c.assets.map(id=>({id,path:pitch.assets[id]?.path,note:id==='live-demo'?'Real hosted app; no screenshots.':undefined}));
 c.assets=c.assets.map(a=>a.id==='demo-proof'?{id:'video-preflight',path:'nexus-video/demo-preflight.md',note:'Current UI checks plus live-api-steady/rapid/green.json receipts.'}:a.id==='siti-career-brief'?{id:a.id,path:'nexus-video/siti-career-brief.md',note:'Fresh genuine product export.'}:a);
 if(c.id==='reviewable-change')c.productionNote='One continuous real-app segment. Use an isolated fictional recording workspace. Validate state, figures and completion continuity before capture. Keep narration aligned with observed values; never substitute a fake interface.';
}
if(offset!==420)throw Error('Timeline must equal 420 seconds');
for(const c of chapters){if(c.beats.length!==c.steps.length||c.beats.length!==c.durations.length||c.durations.reduce((a,b)=>a+b,0)!==c.seconds)throw Error('Chapter mapping mismatch: '+c.id);}
for(const c of chapters){for(const key of ["steps","pool"]){c[key]=c[key].map(x=>x.replaceAll("60.68","60.78").replaceAll("63.08","63.20").replaceAll("12.68","12.78").replaceAll("947afd1b22fcbef5","22a5e09950739768"));}c.refs=c.refs.map(x=>x==='D01'?'D02':x);}
for(const c of chapters){for(const key of ['steps','pool'])c[key]=c[key].map(x=>x.replaceAll('50.7','51.1').replaceAll('rank 3','rank 2').replaceAll('ranks 3','ranks 2').replaceAll('cached status','stale status').replaceAll('historical captured','current preflight').replaceAll('2026-10-23T16:03:29.729Z','2026-10-24T07:18:00.000Z'));}
const narration=chapters.flatMap(c=>c.beats),words=narration.join(' ').split(/\s+/).length;
const stamp=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
const plan={title:'Nexus — Plans evolve. Progress stays.',phase:'Plan checkpoint — awaiting user review',targetSeconds:420,targetOutput:{file:'nexus-pitch-7min.mp4',width:1920,height:1080,fps:30,language:'en',status:'Not rendered; voice choice and chapter build pending'},sourceDeck:'../submission/SDC26_Decisive_PitchDeck.html',sourceData:'../output/pitch/pitch-data.json',sourceDataSha256:crypto.createHash('sha256').update(await fs.readFile('output/pitch/pitch-data.json')).digest('hex'),spokenWords:words,beats:beat,theme:{id:'nexus',custom:true,surface:'#111A34',fonts:['Sora','DM Sans','IBM Plex Mono'],source:'../output/pitch/design-v4.md',stage:{width:1920,height:1080,safeMargin:80},productScreenshots:false},development:{recommendedMode:'Sequential chapters after the required first-chapter review',planApproval:'pending',firstChapterReview:'pending',audioCheckpoint:'pending',narrationsTsIsImplementationSourceOfTruth:true},demo:{url:"https://NexusTalent-Decisive.replit.app/#pathway",chapter:'reviewable-change',seconds:130,referenceLabel,recordingWorkspace:'Isolated fictional Siti session; never clear or replace a personal workspace.',preflight:'Reverify the observed profile, preferences, selected role, source revision, indices and accept/reload/separate-revert completion continuity before recording. If values differ, synchronize all affected narration and native scenes.'},chapters,sources:pitch.sources,requirements:pitch.requirementCoverage.map(r=>({...r,narrationRanges:r.slideNumbers.map(n=>({start:chapters[n-1].beatStart,end:chapters[n-1].beatEnd}))}))};
if(workflow){plan.phase=workflow.phase;plan.development.planApproval=workflow.planApproval.status;plan.development.firstChapterReview=workflow.firstChapterReview;plan.development.audioCheckpoint=workflow.audioCheckpoint;}
plan.targetOutput.status='Not rendered; voice choice and synchronized recording pending';
plan.webPresentation={path:'submission/SDC2026_Decisive_DemoVideo.html',selfContained:true,localServerRequired:false,demoOrigin:'https://NexusTalent-Decisive.replit.app',rebuild:'npm run build --prefix nexus-video/presentation'};
plan.sources=plan.sources.filter(s=>s.id!=='D01');
plan.sources.push({id:'D02',title:'Current video API receipts and actual UI continuity preflight',kind:'capture',path:'nexus-video/demo-preflight.md',url:'nexus-video/demo-preflight.md',also:['nexus-video/live-api-steady.json','nexus-video/live-api-rapid.json','nexus-video/live-api-green.json','nexus-video/siti-career-brief.md'],evidenceRevision:'22a5e09950739768',statusAtBrowserVerification:'stale'});
Object.assign(plan.sources.find(s=>s.id==='X02'),{retrievedAt:'2026-10-24T07:18:00.000Z',statusAtCapture:'stale'});
await fs.mkdir(root,{recursive:true});
let article=await fs.readFile('article.md','utf8');
article=article.replace(/\]\((?!https?:|#)([^)]+)\)/g,(_,p)=>'](../'+p+')');
article=article.replace('This run creates neither voice audio nor finished video.','The original deck handoff created neither voice audio nor finished video. The seven-minute adaptation is now planned in this folder; chapter build, voice selection and final export await their required checkpoints.');
article=article.replaceAll('60.68','60.78').replaceAll('63.08','63.20').replaceAll('12.68','12.78').replaceAll('50.7','51.1').replaceAll('947afd1b22fcbef5','22a5e09950739768').replaceAll('ranks third of six','ranks second of six').replaceAll('2026-10-23T16:03:29.729Z','2026-10-24T07:18:00.000Z').replaceAll('24 October 2026, 00:03:29.729 MYT','24 October 2026, 15:18 MYT').replaceAll('../output/pitch/siti-career-brief.md','siti-career-brief.md');
article=article.replaceAll('D01','D02').replace('[Verified Siti browser/API capture and export](../output/pitch/demo-proof.json)','[Current video UI preflight and API receipts](demo-preflight.md)').replace('This is a preserved copy of the reviewed pitch fact sheet.','This updates the reviewed pitch fact sheet with the current video preflight.').replace('This adaptation targets seven minutes without changing product claims.','This adaptation targets seven minutes and updates captured values without changing product claims.').replace('the earlier video','the video').replace('The seven-minute adaptation is now planned in this folder; chapter build, voice selection and final export await their required checkpoints.','Ten chapters are implemented in this folder; voice selection and synchronized recording remain pending.').replace('See outline.md for the pending plan, first-chapter and audio checkpoints; the later chapters’ narrations.ts files become the implementation source of truth.','The plan and first chapter are approved. The audio checkpoint remains. Chapter narrations.ts files are the implementation source of truth.');
article='# Seven-minute video detail source\n\nThis is a preserved copy of the reviewed pitch fact sheet. Repository paths refer to C:/XMUMSDC_Decisive; the deck and its six-minute source files now include the employer workflow. This adaptation targets seven minutes without changing product claims.\n\n'+article;
article += "\n## Video preflight update — 24 October 2026\n\nThe isolated video workspace uses evidence revision 22a5e09950739768, status stale at the later browser verification, retrieved 2026-10-24T07:18:00.000Z (15:18 MYT). The current Financial data analyst index is 60.78 (rank 2 of 6) under Steady adoption and 63.20 (rank 2 of 6) under Faster AI adoption. Contributions are 18 + 30 + 12.78; research/scenario component is 51.1. These video values supersede the historical deck capture above. Source mappings and plan ordering remain as described. See live-api-steady.json, live-api-rapid.json and live-api-green.json.\n";
await fs.writeFile(root+'/article.md',article);
await fs.writeFile(root+'/script.md',narration.join('\n\n---\n\n')+'\n');
await fs.writeFile(root+'/plan.json',JSON.stringify(plan,null,2));
const table=chapters.map(c=>`| ${stamp(c.startSeconds)}–${stamp(c.endSeconds)} | ${String(c.number).padStart(2,'0')} · ${c.title} | ${c.beats.length} | ${c.section} |`).join('\n');
const outline=`# Nexus — seven-minute video plan

> **Target:** 07:00 / 420 seconds, English. ${words} spoken words across ${chapters.length} chapters and ${beat} focused beats. Timings include demonstration dwell; exact final media duration must be verified after voice and recording.
> **Source:** the reviewed screenshot-free deck remains the visual backbone. This is a scene-based adaptation, not ten animated slide captures.
> **Theme:** established custom Nexus identity; Sora / DM Sans / IBM Plex Mono, supplied cobalt/cyan/violet/neutral tokens. One midnight stage surface throughout, with restrained pale evidence areas.
> **Stage:** 1920 × 1080, proportionally scaled; 80px minimum safe margin; no deck headers, footers, folios or persistent brand bars.
> **Web presentation:** open ../submission/SDC2026_Decisive_DemoVideo.html directly; no localhost is required. Live worker/employer demos always use Replit.
> **Deliverable target:** a recordable web presentation and a seven-minute 1080p MP4. No final MP4 or narration audio has been produced.
> **Current phase:** ${plan.phase}. Plan approval: ${plan.development.planApproval}. First-chapter review: ${plan.development.firstChapterReview}. Audio choice: ${plan.development.audioCheckpoint}.

## Chapter timing

| Time | Chapter | Beats | Narrative role |
| --- | --- | --- | --- |
${table}

## Story and pacing

The problem is Siti’s finite learning time under changing planning assumptions. The proposed solution connects reviewed experience, inspectable directions and evidence to practical learning and reviewable revisions. Technical scenes explain the real browser/API/rules/research/storage boundaries. Expected benefits connect to proposed pilot measures, with no measured outcomes claimed. The adviser invitation closes the same pitch.

The main expansion from the six-minute deck is a 130-second real demo covering workers and employers. Other chapters use tighter holds to preserve the seven-minute plan. Give actions, comparison and preserved completion enough time to be seen. The latest motion revision removes autonomous travelling lines. Preserve subject and spatial relationships through transitions; let each focused demonstration develop and remain readable. Narration remains natural English, with pauses rather than hurried reading. Each scoring weight and each pilot measure has its own beat. Native diagrams and focused evidence text supply the other scenes. A full chapter must demonstrate a real relationship; no chapter is just a sequence of text titles.

## Checkpoints and build boundary

1. **Plan:** review script, chapter pacing, the already-specified Nexus theme, the available data/demo assets and development mode together. Recommended mode: main-thread first chapter, user review, then sequential completion of the remaining chapters. No re-selection of the established brand or screenshot policy is needed.
2. **First chapter:** build the complete first chapter with meaningful visual demonstration, actual brand/font assets and aligned narrations.ts. Stop for the required user review before later chapters.
3. **Audio:** after chapters are complete, choose synthetic English narration or a supplied/self-recorded voice. Provider and voice remain pending; no paid generation or credential use has begun.
4. **Export:** produce the final media after the audio path is resolved. Verify 1920 × 1080, 420-second duration, legible evidence labels, narration synchronization and complete demo continuity. FFmpeg/FFprobe are available locally; no final MP4 is claimed yet.

The user's “Proceed” approves the concrete plan and sequential development after the first-chapter review. That approval is recorded in workflow.json. Existing identity/assets and English language are specified. The skill's separate first-chapter and audio checkpoints still apply; current status is shown above.

${chapters.map(c=>`## ${c.number}. ${c.id} — ${c.title} (${c.beats.length} steps · ~${c.seconds}s)

**Time:** ${stamp(c.startSeconds)}–${stamp(c.endSeconds)}. **Deck:** ${c.slideId}. **Narration:** beats ${c.beatStart}–${c.beatEnd}. **Sources:** ${c.refs.join(', ')}.

**Information pool:**

${c.pool.map(x=>'- '+x).join('\n')}

**Focused screen plan:**

${c.steps.map((s,i)=>`- Step ${i+1} (~${c.durations[i]}s; beat ${c.beatStart+i}) — ${s}`).join('\n')}

**Pacing:** ${c.productionNote||'Give the main relationship time to settle; emphasize one focused claim per beat. Keep details sourced from article.md and limitations adjacent to the relevant claim.'}

**Asset checklist:**

${c.assets.map(a=>'- '+(a.id==='live-demo'?'Preflight pending — actual hosted app':'Ready — source asset')+' · '+a.id+': '+a.path+(a.note?' · '+a.note:'')+'.').join('\n')}
- Ready — sourced content for later native scene development; no product screenshots.

**Spoken excerpt:** “${c.beats[0]}”
`).join('\n')}
## Consolidated assets and continuity

- Ready — source deck, full reviewed fact sheet, structured captured API evidence and genuine Markdown brief.
- Ready — existing Nexus SVG mark, approved Wordmark structure and seven local font faces in output/pitch/font-0.ttf through font-6.ttf; no runtime font network dependency is needed.
- Reference — same fictional Siti, four hours/week, Financial data analyst, current video-preflight revision 22a5e09950739768 and stale status at browser verification, retrieved 24 October 2026 at 15:18 MYT. Captured steady index 60.78 and faster-AI index 63.20 are indices, not probabilities.
- Preflight before recording — the real app at ${plan.demo.url}, isolated fictional session and current evidence/score continuity. Historical figures must not silently substitute for a different live result.
- Preflight before recording — accept, reload and the separate Green transition / Keep previous view test must preserve the same completed step. Self-reported demo completion is not actual study.
- Ready — public resource and source URLs, shown as readable native text and links; no external webpage screenshots.
- Unavailable and not claimed — real learner work sample, measured pilot baselines, customer/partnership traction or employment outcomes.
- Ready — ten implemented chapters and aligned narrations.ts. Pending — voice decision, audio assets, synchronized live-demo recording and final MP4.

The later chapters’ narrations.ts becomes the implementation source of truth for steps and audio. Synchronize this script/outline and plan.json whenever implementation changes a beat. Keep the final spoken order and four-part problem/solution/technical/expected-impact story aligned with the deck.
`;
await fs.writeFile(root+'/outline.md',outline);
await fs.writeFile(root+'/demo-runbook.md',`# Real-demo recording runbook\n\nUse the actual hosted Nexus app at ${plan.demo.url}. Do not use the old screenshot capture script: it is a selector/sequence reference only. Preserve the original pitch and evidence files.\n\n1. In an isolated fictional recording workspace, select Siti Rosli; review five skills, four hours/week and Financial data analyst. Do not clear or overwrite a personal workspace.\n2. Start under Steady adoption. Check source revision/status, role indices, prerequisites and plan against plan.json. If any changed, update the dependent native scenes and narration before recording. Never force a misleading old comparison.\n3. Show the initial data-quality priority. Mark Practise Data quality & validation complete, explicitly labelled self-reported demo state.\n4. Select Faster AI adoption and open Review changes. Inspect changed priority and actual score contributions; show four existing steps and the preserved completed step.\n5. Accept & update my plan. Reload and show completion persists.\n6. Propose Green transition separately. Open Review changes and select Keep previous view. Verify the accepted Faster AI adoption view returns and completion remains. This is not an undo after acceptance.\n7. Continue to the genuine SQL learning detail and real brief. Keep estimated hours, optional costs, introductory-practice and intended-SDG limitations.\n\nThe 130-second chapter is an allocation, not permission to fabricate interaction or speed-run unreadable UI. Then open /hr, enter the guided demo, prepare an isolated synthetic campaign, submit its employee survey, review the department skills/scenarios and export selected learning cohorts. Show the synthetic-only/no-employer-login notice. Close the test survey link after use. The real product recording is the single product segment. Other chapters are native diagrams/typography; no screenshot montage or invented dashboard.\n`);
console.log(JSON.stringify({directory:root,chapters:chapters.length,beats:beat,words,seconds:offset,phase:plan.phase},null,2));
