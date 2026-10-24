import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { makePitchLayout, pitchLayoutCss, layoutVersion } from './pitch-layout.mjs';
const dir='output/pitch';
const proof=JSON.parse(await fs.readFile(`${dir}/demo-proof.json`,'utf8'));
const fonts=await fs.readFile(`${dir}/fonts.css`,'utf8');
const fontSources=JSON.parse(await fs.readFile(`${dir}/font-sources.json`,'utf8'));
const brief=await fs.readFile(`${dir}/siti-career-brief.md`,'utf8');
const source=proof.initial.evidence.sources[3];
const demoUrl = process.env.DEMO_URL || 'https://NexusTalent-Decisive.replit.app/#import';
const chapters=[
 {id:'opening',title:'Plans evolve. Progress stays.',seconds:15,beats:[
  'Plans evolve. Progress stays. Nexus is a reviewable reskilling workspace for workers and career advisers.',
  'It helps you choose what to learn next, and see what would make that decision change.'
 ],steps:[
  'The Nexus wordmark and core message share the stage with the real revision comparison.',
  'The changed priority and retained completion establish the decision the story will explain.'
 ],durations:[7,8],refs:['R01','R07','D01'],assets:['revision-comparison','completed-step-header'],pool:['Identity: NexusTalent is branded nexus; Team Decisive, SDC Hackathon 2026, Domain 1 — article §1.','Purpose: review a reskilling decision with a worker and adviser — article §1.','Proof: one completed learning step survives the accepted scenario revision — article §3.']},
 {id:'workers-decision',title:'The problem is choosing what to learn next',seconds:30,beats:[
  'The problem is choosing a worthwhile next learning step when time is limited and the assumptions behind a career direction can change.',
  'Siti is our fictional operations coordinator. She brings spreadsheet reporting, supplier coordination and document processing, with four learning hours a week for this demo.',
  'Which strengths transfer, which gaps matter, and what would justify a different choice?'
 ],steps:[
  'The problem headline connects a finite learning budget to changing career-planning assumptions.',
  'Siti’s fictional operations tasks connect to reviewed skills and the four-hours/week demo preference.',
  'The worker’s decision isolates transferable strengths, gaps and a reason to reconsider.'
 ],durations:[11,11,8],refs:['R04','D01'],assets:['intake','preferences'],pool:['Problem framing: choosing a worthwhile next step under a limited learning budget and changing assumptions — article §0.','Fictional input: Siti’s five catalog skills and three tasks are unchanged from the sample — article §2.','Preference: four hours/week and Explore a new direction are demo choices — article §2.','Decision: missing skill declarations require review rather than an inability judgement — article §2.']},
 {id:'product-loop',title:'A reviewable reskilling workspace',seconds:30,beats:[
  'Our solution begins with Siti’s reviewed experience and six authored role directions.',
  'She can inspect the dated evidence and turn selected gaps into an ordered learning plan.',
  'When assumptions change, Nexus proposes a revision she can inspect and accept, or revert.',
  'Her completed learning remains recorded. The result is a decision she can discuss with an adviser and revisit.'
 ],steps:[
  'Reviewed profile and six role directions form the first part of the connected journey.',
  'The source receipt connects to the ordered gap-and-prerequisite learning plan.',
  'The real revision comparison offers Accept & update my plan and Keep previous view.',
  'The stable data-quality step ID connects retained completion back to the next decision.'
 ],durations:[5,8,8,9],refs:['R03','R05','D01'],assets:['role-summary','source-receipt','revision-actions','completed-step-header'],pool:['Outputs: reviewed profile, ranked roles, provenance, pathway, revision and completion record — article §1.','Choice: accept and keep-previous-view actions exist in the active application — article §3.','Continuity: skill:dataQuality is a stable completion ID — article §3.']},
 {id:'explainable-directions',title:'Every match has a reason',seconds:45,beats:[
  'We select Financial data analyst, one direction for discussion. It ranks third in this captured steady-adoption result, with a match index of sixty point six eight.',
  'The explanation shows two of five required skills declared: spreadsheets and stakeholder communication.',
  'The scoring weights begin with forty-five percent for declared required-skill coverage.',
  'Thirty percent comes from transferable strengths.',
  'Twenty-five percent comes from research and scenario context.',
  'They contribute eighteen, thirty and twelve point six eight index points here.',
  'The match result is an index, not an employment probability. Missing skills are prompts for review, not proof of inability.'
 ],steps:[
  'The actual selected-role result identifies Financial data analyst, rank 3 and index 60.68/100.',
  'The reviewed skills connect to two required matches and the three remaining gaps.',
  'The model composition isolates the 45% weight for declared required-skill coverage.',
  'The 30% weight connects to transferable strengths.',
  'The 25% weight connects to research and scenario context.',
  'Component values 40, 100 and 50.7 connect to weighted points 18 + 30 + 12.68 = 60.68.',
  'The score remains labelled an index and the unconfirmed gaps remain review prompts.'
 ],durations:[12,7,5,3,4,6,8],refs:['R02','R04','D01'],assets:['role-summary','role-detail','roles'],pool:['Captured result: Financial data analyst ranks 3, score 60.68 — article §2.','Model structure: 45%/30%/25%; component values 40/100/50.7; points 18/30/12.68 — article §2.','Gaps: data quality, analytics and SQL; bridge skills include declared document processing — article §2.']},
 {id:'evidence-and-assumptions',title:'The source behind the signal',seconds:40,beats:[
  'In Skills radar, this receipt identifies the title, publisher, publication date and retrieval time for an actual source in the same evidence revision.',
  'The cache is stale. Its original dates stay visible.',
  'Nexus maps a metadata keyword to a small planning weight, and shows that rationale separately.',
  'That mapping is our assumption. It is not a finding published by the paper, and research context does not establish Malaysian hiring demand.',
  'A refresh can return the same inputs and leave the ranking unchanged.'
 ],steps:[
  'The real source detail shows the OUP title, publisher and publication date from Crossref.',
  'The stale-cache label and retrieval time 24 October 2026, 00:03:29 MYT stay beside the receipt.',
  'The matched metadata term validat connects to the authored data-quality factor 1.04×.',
  'Retrieved metadata and the Nexus mapping assumption occupy distinct labelled areas.',
  'An unchanged revision remains unchanged rather than implying every refresh creates a new signal.'
 ],durations:[11,4,7,12,6],refs:['R06','D01','X01','X02'],assets:['source-title','source-receipt','source-relevant-mapping','evidence-status'],pool:['Record: Towards Responsible Artificial Intelligence (AI): An Analysis of AI Policies in Selected Low- and Middle-Income Countries; OUP; 2026-10-23 — article §4.','Receipt: revision 947afd1b22fcbef5; retrieved 2026-10-23T16:03:29.729Z; stale at capture — article §4.','Assumption: metadata term validat maps to dataQuality 1.04; no research-quality or local-demand verification — article §4.']},
 {id:'reviewable-change',title:'A new direction. Your learning stays.',seconds:55,beats:[
  'Here is the change we verified. Siti starts with a plan whose first priority is data quality and validation.',
  'We mark that step complete as a self-reported demo state. No actual study is claimed.',
  'Now we compare Faster AI adoption, an authored scenario rather than a published forecast.',
  'The proposed priority becomes SQL and data querying. The index changes from sixty point six eight to sixty-three point zero eight.',
  'The review shows four existing steps kept and one completion preserved.',
  'We accept the proposal. Data quality remains complete after reload.',
  'We also test Keep previous view on a separate green-transition proposal. It restores the accepted view and retains that completion.'
 ],steps:[
  'The steady-adoption plan starts with Practise Data quality & validation before analytics and SQL.',
  'The real Mark step complete action records skill:dataQuality as a demo completion.',
  'The Faster AI adoption control proposes an authored scenario using the same profile, role and evidence revision.',
  'The actual review comparison shows 60.68 → 63.08 and Data quality & validation → SQL & data querying.',
  'The review proof isolates four retained steps and the unchanged completed step ID.',
  'The accepted plan and a browser reload both display the same completed data-quality step.',
  'The separate Green transition proposal’s Keep previous view action returns to Faster AI adoption with completion retained.'
 ],durations:[9,6,8,10,7,5,10],refs:['R03','R05','D01'],assets:['initial-plan','completed-step-header','revision-comparison','revision-proof','revision-actions','accepted-plan','revert-dialog'],pool:['Initial order: dataQuality → analytics → sql → portfolio:financial; total 48 estimated hours — article §3.','Scenario: steady → rapid, fixed public revision and no personal simulation inputs — article §3.','Verified: accept, reload and separate proposal revert all preserve the self-reported completion — article §3.']},
 {id:'practical-next-step',title:'A plan you can act on',seconds:45,beats:[
  'The next step is concrete: practise SQL and data querying.',
  'Siti’s declared spreadsheet experience satisfies the authored prerequisite. Microsoft Learn is the public resource.',
  'The practice output is queries, joins and checks on synthetic tables. Nexus estimates sixteen hours including practice, scheduled across four weeks.',
  'After the demo completion, the whole plan has forty estimated hours remaining, across ten weeks.',
  'She can download the actual career brief for discussion. SDG links describe intended contribution.',
  'Public resource content is free. Optional costs may apply, and introductory practice does not establish professional qualification.'
 ],steps:[
  'The enlarged real SQL learning-step detail identifies the next activity.',
  'Declared spreadsheet experience satisfies the catalog prerequisite and connects to the Microsoft Learn resource.',
  'The exact practice output and the 16-hour planning estimate connect four hours/week to weeks 1–4.',
  'The accepted schedule continues with analytics in weeks 5–8 and work-sample review in weeks 9–10.',
  'The real exported Markdown brief carries the scenario, sources, completed step and intended SDG contribution.',
  'The resource-cost and qualification disclosures remain beside the public-resource action.'
 ],durations:[4,8,11,7,6,9],refs:['R02','R04','D01','X03','X04','X05'],assets:['sql-step-focus','sql-step','siti-career-brief'],pool:['SQL: 16 estimated hours, spreadsheets prerequisite already met, public Microsoft Learn path — article §5.','Remaining schedule: 40 hours, 10 weeks at 4h/week after one 8-hour demo completion — article §5.','SDG 4.4 and 8.2 are intended contributions; content excludes optional costs; completion is self-reported — article §5.']},
 {id:'working-prototype',title:'From CV to decision, with explainable rules',seconds:30,beats:[
  'This prototype links a React workspace to an Express career API.',
  'CPU rules rank directions; public Crossref metadata is held in a revision cache.',
  'Original CV files stay in the browser. Extracted text and reviewed profiles are processed by the API in memory.',
  'Saved decisions and progress stay on this device. No LLM or GPU is active.',
  'Engineering checks do not validate forecasts, fairness or employment outcomes.'
 ],steps:[
  'A single architecture view connects the React/Vite browser workspace to the Express career API.',
  'The CPU rules and public Crossref research cache explain where roles, evidence and pathways come from.',
  'Original CV bytes remain in the browser while extracted text and the reviewed profile cross the API boundary.',
  'Saved decisions and progress remain in device-local storage, with no active LLM or GPU.',
  'The working flow remains distinct from next validation of forecast accuracy, fairness and outcomes.'
 ],durations:[4,6,9,6,5],refs:['R01','R02','R03','R05','R06'],assets:['demo-proof'],pool:['Implemented: React/Vite, Express API, CPU rules, public cache and browser local storage — article §1.','Privacy boundary: UI files in browser; extracted text/profile in API memory; no cloud workspace — article §1.','Validation boundary: working engineering flow does not prove forecasting accuracy, fairness or employment outcomes — article §6.']},
 {id:'buyer-and-pilot',title:'Expected impact, measured in a pilot',seconds:40,beats:[
  'We expect Nexus to support clearer choices, reviewable advice and continuity of learning.',
  'Those benefits need testing with workers and advisers.',
  'A proposed pilot would measure time to an adviser-agreed next action.',
  'It would check the sources used.',
  'It would test whether revisions help.',
  'And it would review completed work samples.',
  'Malaysian career centres and reskilling providers are our buyer hypothesis; subscription pricing remains unvalidated.',
  'These are intended benefits, not measured outcomes. Baselines are pending.'
 ],steps:[
  'The expected-impact headline connects clearer choices, reviewable advice and retained progress as intended benefits.',
  'Workers and advisers are identified beside the proposed one-team, two-session pilot scope.',
  'Clearer next steps connect to time until an adviser-agreed action.',
  'Traceable advice connects to checking the validity of each source used.',
  'Useful revisions connect to reasons for accepting or reverting a change.',
  'Visible learning connects to an adviser reviewing a completed practice work sample.',
  'The initial Malaysian career-centre/provider buyer hypothesis and unvalidated subscription model remain subordinate.',
  'The expected-benefit limitation stays visible: baselines pending and no measured employment or impact results.'
 ],durations:[6,4,6,4,4,4,7,5],refs:['R01','R07','P01'],assets:[],pool:['Expected impact: intended clearer next actions, traceable advice, useful revisions and reviewable learning — article §6.','Buyer/model: hypothesis only, organisational subscription per active advised learner, price unvalidated — article §6.','Measurement: time to agreed action, source validity, revision usefulness and completed work samples — article §6.','Proposed scope: one adviser team, two review sessions; baselines pending, no customers or outcomes claimed — article §6.']},
 {id:'team-and-invitation',title:'Make the next learning decision reviewable',seconds:30,beats:[
  'We are Team Decisive. Raye Chan Jun Foong is our team leader.',
  'Teo Zheng Xi is our tech lead.',
  'Liew Jicson handles video.',
  'We invite one adviser team to help validate this workflow. Bring a sample transition decision, and review Siti’s changing plan with us.',
  'Local prototype available for demonstration. Plans evolve. Progress stays.'
 ],steps:[
  'Raye Chan Jun Foong appears with the verified role Team leader.',
  'Teo Zheng Xi appears with the verified role Tech lead.',
  'Liew Jicson appears with the verified role Video.',
  'The actual exported brief carries the completed data-quality step into the adviser-review invitation.',
  'The core message closes beside Local prototype available for demonstration.'
 ],durations:[6,3,3,12,6],refs:['R01','R07','D01','P01'],assets:['nexus-mark','siti-career-brief','completed-step-header'],pool:['Team: names and roles are verified in README.md — article §7.','Deployment: hosted prototype deployed on Replit (https://NexusTalent-Decisive.replit.app) — article §7.','Invitation: validate a sample transition decision with an adviser team, carrying the completed step into the real brief — article §3, §5–7.']},
];
// Product pixels are deliberately absent from this edition. These records are
// data sources, not screenshot assets; slide 6 alone hosts the real application.
chapters.forEach((chapter,index)=>{
 chapter.assets=index===5?['live-demo','demo-proof']:index===6?['siti-career-brief','demo-proof']:index===9?['nexus-mark','siti-career-brief']:['demo-proof'];
 chapter.section=['Opening','Problem','Proposed solution','Proposed solution','Proposed solution','Proposed solution','Proposed solution','Technical approach','Expected impact','Invitation'][index];
});
chapters[0].steps[0]='The Nexus wordmark and core message share the stage with native typography about changing priorities and retained progress.';
chapters[2].steps[2]='Native diagram labels connect reviewable revisions to Accept & update my plan and Keep previous view.';
chapters[3].steps[0]='A native typographic result identifies Financial data analyst, historical captured rank 3 and index 60.68/100.';
chapters[4].steps[0]='A native bibliographic record shows the OUP title, publisher and publication date retrieved through Crossref.';
chapters[6].steps[0]='Native typography identifies the SQL learning step, with a direct link to its public resource.';
let beatOffset=0;
chapters.forEach((c,i)=>{c.slideId=`slide-${String(i+1).padStart(2,'0')}-${c.id}`;c.number=i+1;c.beatStart=beatOffset+1;beatOffset+=c.beats.length;c.beatEnd=beatOffset;});
const requirementCoverage=[
 {id:'problem',title:'Problem',slideNumbers:[2],message:'A worker must choose what to learn with limited time and changing planning assumptions.'},
 {id:'solution',title:'Proposed solution',slideNumbers:[3,4,5,6,7],message:'Review experience, explain role directions and evidence, build a practical plan, and revisit it while retaining completed learning.'},
 {id:'technical',title:'Technical approach',slideNumbers:[8],message:'React/Vite browser workspace, Express career API, explainable CPU rules, Crossref metadata and device-local progress; slides 4–5 explain the scoring and evidence method.'},
 {id:'impact',title:'Expected impact',slideNumbers:[9],message:'Intended clearer next steps, traceable advice, useful revisions and visible learning, tested through a proposed adviser pilot; no measured outcomes claimed.'},
].map(r=>({...r,slideIds:r.slideNumbers.map(n=>chapters[n-1].slideId),chapterIds:r.slideNumbers.map(n=>chapters[n-1].id),narrationRanges:r.slideNumbers.map(n=>({start:chapters[n-1].beatStart,end:chapters[n-1].beatEnd}))}));
const coverageMarkdown='| Requirement | Deck / video chapters | Narrative role |\n| --- | --- | --- |\n'+requirementCoverage.map(r=>'| '+r.title+' | '+r.slideNumbers.map(n=>String(n).padStart(2,'0')).join(', ')+' | '+r.message+' |').join('\n');
const sources=[
 {id:'R01',title:'README — active product, limitations and verified team',url:'README.md',kind:'repository',path:'README.md'},
 {id:'R02',title:'Career engine — scoring and ordered pathways',url:'services/career_engine.js',kind:'repository',path:'services/career_engine.js'},
 {id:'R03',title:'Backend and integration contracts',url:'docs/INTEGRATION.md',kind:'repository',path:'docs/INTEGRATION.md',also:['docs/BACKEND.md']},
 {id:'R04',title:'Authored sample, role and learning catalogs',url:'src/data/careerCatalog.js',kind:'repository',path:'src/data/careerCatalog.js',also:['services/career_catalog.js']},
 {id:'R05',title:'Active workspace and learning components',url:'src/components/career/CareerApplication.jsx',kind:'repository',path:'src/components/career/CareerApplication.jsx',also:['src/components/career/LearningWorkspace.jsx','src/components/career/CareerViews.jsx','src/utils/careerApi.js','src/utils/careerDemo.js']},
 {id:'R06',title:'Public evidence retrieval, mappings and stale status',url:'services/evidence_service.js',kind:'repository',path:'services/evidence_service.js'},
 {id:'R07',title:'Nexus brand preservation contract',url:'docs/brand-guidelines.md',kind:'repository',path:'docs/brand-guidelines.md',also:['brand-spec.md','src/career.css','src/landing.css','src/components/career/CareerPrimitives.jsx','public/nexus-mark.svg']},
 {id:'D01',title:'Verified Siti browser/API capture and export',url:'output/pitch/demo-proof.json',kind:'capture',path:'output/pitch/demo-proof.json',capturedAt:proof.capturedAt,evidenceRevision:proof.initial.evidence.revision,status:proof.initial.evidence.status},
 {id:'X01',title:'Crossref REST API documentation',url:'https://www.crossref.org/documentation/retrieve-metadata/rest-api/',kind:'external',accessedOn:'2026-10-24'},
 {id:'X02',title:source.title,url:source.url,kind:'retrieved_metadata',publisher:source.publisher,publishedOn:source.date,retrievedAt:source.retrievedAt,datePrecision:source.datePrecision,doi:source.doi,mappings:source.mappings,reviewStatus:source.reviewStatus,statusAtCapture:'stale',independentPublisherPageVerification:'Not available; described only as the actual cached metadata record, not as a validated paper finding.'},
 {id:'X03',title:'Microsoft Learn — Query and modify data with Transact-SQL',url:'https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/',kind:'external',accessedOn:'2026-10-24'},
 {id:'X04',title:'United Nations — SDG 4 targets',url:'https://sdgs.un.org/goals/goal4',kind:'external',accessedOn:'2026-10-24'},
 {id:'X05',title:'UK Government — The Government Data Quality Framework',url:'https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework',kind:'external',accessedOn:'2026-10-24'},
 {id:'P01',title:'Expected benefits, proposed pilot and buyer model',kind:'proposal',note:'Intended benefits and pilot proposals based on the user brief and README; no buyer, partnership, price or measured outcome is asserted.'},
];
const assets={};
const logo=await fs.readFile('public/nexus-mark.svg','utf8');
assets['nexus-mark']={id:'nexus-mark',path:'public/nexus-mark.svg',mime:'image/svg+xml',sha256:crypto.createHash('sha256').update(logo).digest('hex'),dataUri:'data:image/svg+xml;base64,'+Buffer.from(logo).toString('base64')};
assets['siti-career-brief']={id:'siti-career-brief',path:`${dir}/siti-career-brief.md`,mime:'text/markdown',sha256:crypto.createHash('sha256').update(brief).digest('hex')};
assets['demo-proof']={id:'demo-proof',path:`${dir}/demo-proof.json`,mime:'application/json'};
assets['live-demo']={id:'live-demo',path:demoUrl,url:demoUrl,mime:'text/html',kind:'hosted_application',note:'The sole product embed is on slide 6. Hosted on Replit at https://NexusTalent-Decisive.replit.app.'};
const wordmark=`<span class="c-wordmark" role="img" aria-label="Nexus"><span aria-hidden="true">ne</span><span class="c-wordmark-x" aria-hidden="true">x</span><span aria-hidden="true">us</span></span>`;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const { slides, composition } = makePitchLayout({ chapters, wordmark, esc, source, demoUrl });
const pitchData={presentationVersion:layoutVersion,composition,title:'Nexus — Plans evolve. Progress stays.',createdOn:'2026-10-24',timezone:'Asia/Kuala_Lumpur',canvas:{width:1280,height:720,ratio:'16:9',safeMargin:48},durationSeconds:360,spokenWords:chapters.flatMap(c=>c.beats).join(' ').split(/\s+/).length,slides:chapters,sources,assets,fontSources,demo:{fictional:true,profile:proof.initial.profile,roleId:'financial',roleTitle:'Financial data analyst',evidence:{revision:proof.initial.evidence.revision,status:proof.initial.evidence.status,retrievedAt:proof.initial.evidence.retrievedAt,sourceCount:proof.initial.evidence.sources.length},initialRole:proof.initial.matches.find(r=>r.id==='financial'),rapidRole:proof.rapid.matches.find(r=>r.id==='financial'),initialPlan:proof.initial.pathways.financial,acceptedPlan:proof.rapid.pathways.financial,checks:proof.checks,careerBrief:brief,capturedAt:proof.capturedAt},handoff:{scope:'Deck and video source materials only. No chapter implementation, audio or finished video.',stage:{width:1920,height:1080,safeMargin:80},theme:'Nexus custom; preserve supplied tokens and fonts. Use one midnight stage surface throughout the video.',checkpoints:['Plan: confirm script, outline, Nexus theme, assets and development mode.','First chapter: main thread builds a complete chapter; user reviews before further chapter development.','Audio: ask whether to synthesize after the web chapters are complete.'],narrationsTsIsImplementationSourceOfTruth:true,chapterBeatCountsAreProvisional:true}};
pitchData.requirementCoverage=requirementCoverage;
pitchData.narrativePurpose='The deck is the visual backbone of the same pitch delivered in the video. Its slide order, chapter messages, narration and limitations are aligned.';
pitchData.demo.liveEmbed={url:demoUrl,slideId:chapters[5].slideId,localServerRequired:false,publicDeployment:true,profileSelection:'Choose the fictional Siti Rosli sample; review settings before the live demonstration.',continuity:'Native slide figures refer to the frozen capture. The interactive app uses its current workspace and cached evidence; live values may differ.'};
const css=pitchLayoutCss;
const fitRefinements='';
const runtime=`
const data=JSON.parse(document.getElementById('nexus-pitch-data').textContent);window.NEXUS_PITCH=data;
document.querySelectorAll('img[data-asset]').forEach(img=>img.src=data.assets[img.dataset.asset].dataUri);
const stage=document.getElementById('stage'),slides=[...document.querySelectorAll('.slide')];
function loadLiveDemo(){const frame=document.getElementById('nexus-live-demo');if(slides[current]?.contains(frame)&&!frame.hasAttribute('src'))frame.src=frame.dataset.demoSrc;}
slides.forEach((s,i)=>{s.dataset.screenLabel=String(i+1).padStart(2,'0')+' '+data.slides[i].title;s.setAttribute('role','region');s.setAttribute('aria-label',s.dataset.screenLabel);});
let current=0;try{current=Math.max(0,Math.min(9,Number(localStorage.getItem('nexus-pitch-deck-v1'))||0));}catch{}
const fromHash=()=>slides.findIndex(s=>s.id===location.hash.slice(1));if(fromHash()>=0)current=fromHash();
const notes=document.getElementById('notes');
function fit(){const scale=Math.min(innerWidth/1280,innerHeight/720);stage.style.setProperty('--scale',String(scale));}
function renderNotes(){const c=data.slides[current];const refs=c.refs.map(id=>data.sources.find(s=>s.id===id));document.getElementById('notes-body').innerHTML='<h3>'+c.title+'</h3><p>'+c.seconds+' seconds planned · beats '+c.beatStart+'–'+c.beatEnd+'</p><h4>NARRATION</h4>'+c.beats.map(b=>'<p>'+b+'</p>').join('')+'<h4>SOURCES</h4><ol>'+refs.map(r=>'<li>'+r.id+' · '+(r.url?'<a target="_blank" rel="noreferrer" href="'+r.url+'">'+r.title+'</a>':r.title)+(r.note?'<p>'+r.note+'</p>':'')+'</li>').join('')+'</ol><h4>ASSET MAP</h4>'+c.assets.map(id=>'<p>'+id+'<br><small>'+data.assets[id]?.path+'</small></p>').join('')+'<h4>FONTS / HANDOFF</h4><p>Sora, DM Sans and IBM Plex Mono are embedded. No external runtime font dependency. Slide 6 embeds the Replit hosted application (https://NexusTalent-Decisive.replit.app/#import); live values may differ from the frozen capture. Video source only; no audio generated.</p>';}
function show(i,changeHash=true){current=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,n)=>{const active=n===current;s.classList.toggle('active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active;});document.getElementById('counter').textContent=String(current+1).padStart(2,'0')+' / 10';document.getElementById('prev').disabled=current===0;document.getElementById('next').disabled=current===9;document.getElementById('live-status').textContent=slides[current].dataset.screenLabel;try{localStorage.setItem('nexus-pitch-deck-v1',String(current));}catch{}if(changeHash)history.replaceState(null,'','#'+slides[current].id);renderNotes();}
document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);
new MutationObserver(loadLiveDemo).observe(stage,{attributes:true,attributeFilter:['class'],subtree:true});
function toggleNotes(){notes.hidden=!notes.hidden;document.getElementById('notes-toggle').setAttribute('aria-expanded',String(!notes.hidden));if(!notes.hidden)document.getElementById('close-notes').focus();}
document.getElementById('notes-toggle').onclick=toggleNotes;document.getElementById('close-notes').onclick=()=>{toggleNotes();document.getElementById('notes-toggle').focus();};
document.getElementById('print').onclick=()=>window.print();document.getElementById('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.querySelectorAll('[data-download-brief]').forEach(b=>b.onclick=()=>download(data.demo.careerBrief,'Nexus-Siti-Rosli-career-brief.md','text/markdown;charset=utf-8'));
document.getElementById('download-data').onclick=()=>download(JSON.stringify({...data,assets:Object.fromEntries(Object.entries(data.assets).map(([k,{dataUri,...v}])=>[k,v]))},null,2),'nexus-pitch-data.json','application/json');
addEventListener('resize',fit);addEventListener('hashchange',()=>{const i=fromHash();if(i>=0)show(i,false);});addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.key==='Escape'&&!notes.hidden){toggleNotes();return;}if(!notes.hidden)return;if(['ArrowRight','ArrowDown','PageDown'].includes(event.key)||(event.code==='Space'&&event.target===document.body)){event.preventDefault();show(current+1);}if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();show(current-1);}if(event.key==='Home'){event.preventDefault();show(0);}if(event.key==='End'){event.preventDefault();show(9);}if(event.key.toLowerCase()==='n')toggleNotes();});
fit();show(current,false);loadLiveDemo();window.pitchReady=document.fonts.ready;
`;
const json=JSON.stringify(pitchData).replaceAll('<','\\u003c');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="description" content="Nexus by Team Decisive — a reviewable reskilling decision. Ten-slide pitch and verified video source handoff."><title>Nexus — Plans evolve. Progress stays.</title><link rel="icon" href="${assets['nexus-mark'].dataUri}"><style>${fonts}\n${css}\n${fitRefinements}</style></head><body><main id="viewport" aria-label="Nexus pitch deck"><div id="stage">${slides.join('\n')}</div></main><nav id="toolbar" aria-label="Presentation controls"><button id="prev" aria-label="Previous slide">←</button><span id="counter">01 / 10</span><button id="next" aria-label="Next slide">→</button><button id="notes-toggle" aria-controls="notes" aria-expanded="false">Notes & sources</button><button id="print">Print all slides</button><button id="fullscreen">Fullscreen</button></nav><aside id="notes" aria-label="Narration, sources and assets" hidden><button id="close-notes">Close notes</button> <button id="download-data">Download source data</button><div id="notes-body"></div></aside><div id="live-status" class="sr-only" aria-live="polite"></div><script id="nexus-pitch-data" type="application/json">${json}</script><script>${runtime}</script></body></html>`;
await fs.writeFile('nexus-pitch.html',html);
const withoutUris={...pitchData,assets:Object.fromEntries(Object.entries(assets).map(([k,{dataUri,...v}])=>[k,v]))};
await fs.writeFile(`${dir}/pitch-data.json`,JSON.stringify(withoutUris,null,2));
await fs.writeFile('script.md',chapters.flatMap(c=>c.beats).join('\n\n---\n\n')+'\n');
const article=`# Nexus: pitch fact sheet

Verified against the active repository and a fresh fictional browser/API capture on 24 October 2026. This is the detail source for the later video. Source IDs match the deck’s embedded data and Notes & sources panel.

## 0. Pitch problem and narrative structure

The problem framing is a practical decision, not an asserted labour-market statistic: a worker must choose a worthwhile next learning step within limited time, while career-planning assumptions can change. The fictional Siti example makes that choice concrete. Nexus proposes a reviewable decision that connects declared experience, inspectable evidence and learning gaps, and retains completed learning when the worker accepts a revision. [D01, R01–R05]

The deck is the visual backbone of the pitching video. Both follow the same problem → proposed solution → technical approach → expected impact narrative. Opening chapter 01 establishes the proposition; chapter 10 closes with the team and adviser invitation. The requirement-to-chapter mapping is:

${coverageMarkdown}

Expected impact is framed as intended benefit to test, with proposed measures and pending baselines. It is not evidence of employment, productivity or social-impact outcomes. [P01]

## 1. Product and implemented workflow

NexusTalent, branded **nexus**, is Team Decisive’s SDC Hackathon 2026 Domain 1: Aiversecity Future-Ready Workforce prototype. Its message is “Plans evolve. Progress stays.” Its supporting line is “Advance with every shift.” It helps workers and career advisers turn experience and changing AI research context into a practical, reviewable reskilling decision. The worker remains responsible for the choice. [R01, R07]

The active application supports text-based PDF, DOCX and TXT CVs, pasted experience and fictional samples. Users review skills, tasks, goals and weekly time before comparing six authored roles. The connected loop produces score explanations, source receipts, ordered gap-and-prerequisite learning plans, proposed revisions, accept/revert controls, device-local completion and reflections, saved decisions and an exported Markdown brief. [R01–R05]

Implementation is React/Vite → Express career API → explainable CPU rules and public Crossref research, with a public research revision cache. The normal UI reads the original CV file in the browser and sends extracted text and the reviewed profile to the API for in-memory processing. Personal workspaces remain in browser local storage. There are no active LLM/GPU calls, cloud accounts, institutional approval records or cross-device sync. [R01–R03, R05–R06]

## 2. Fictional inputs and explainable direction

The demonstration uses the unchanged **Siti Rosli** sample, an operations coordinator. Her tasks cover supplier invoices and Excel reports, deliveries/customer enquiries and monthly operations summaries. Her five declared skills are spreadsheets/reporting, document/data processing, stakeholder communication, operations coordination and problem solving. Four hours/week, “Explore a new direction” and the selection of Financial data analyst are demo preferences, not a real learner’s circumstances or a recommendation. [R04, D01]

In the captured **Steady adoption** result, **Financial data analyst** ranks third of six with an index of **60.68/100**. Two of its five required skills are declared: spreadsheets/reporting and stakeholder communication. Gaps to review are data quality/validation, data analysis/visualisation and SQL/data querying. Its transferable bridges include declared spreadsheets, document processing and communication. [D01]

The rules use **45% required-skill coverage + 30% transferable strengths + 25% research/scenario context**. For this role the component values are **40, 100 and 50.7**, contributing **18, 30 and 12.68 points**. These sum to 60.68. The index is not an employment probability. Missing declarations are unknown, not proof of inability; declarations do not establish proficiency. [R02, D01]

## 3. Verified revision and completion sequence

The fixed evidence revision is **947afd1b22fcbef5**, with 12 sources, marked **stale** at capture. No research refresh or personal signal simulation causes this demonstration. Under Steady adoption, the plan order is data quality → analytics → SQL → portfolio. Its total is **48 estimated hours**, initially **12 weeks at four hours/week**. [D01]

The browser marks the actual **Practise Data quality & validation** step complete for demonstration. This is a self-reported UI state, not eight hours of real learning or a completed work sample. Selecting **Faster AI adoption** proposes an authored scenario. The selected role’s priority becomes SQL; its index becomes **63.08**, ranked second. The same four learning-step IDs remain, and **skill:dataQuality** remains complete. The review offers **Accept & update my plan** and **Keep previous view**. [D01]

The capture accepts the faster-AI proposal and reloads the browser, verifying retained completion. It then proposes Green transition separately and uses Keep previous view, verifying return to the accepted faster-AI view with the same completion. This is the exact accept/revert sequence; it does not claim an undo action after a proposal has already been accepted. No forecast, score change or persistence result is invented. [R05, D01]

## 4. Retrieved evidence and authored assumptions

The featured actual source receipt is **${source.title}**, publisher **${source.publisher}**, DOI **${source.doi}**, publication date **${source.date}**. Crossref retrieved it at **2026-10-23T16:03:29.729Z**, or **24 October 2026, 00:03:29.729 MYT**. The pitch uses the cached record as retrieved; the publisher page was not independently verified. No findings from the paper are asserted. [D01, X01–X02]

The source’s metadata term **validat** maps to dataQuality with factor **1.04** and a recorded rationale to review data reliability and human validation. This is a Nexus keyword assumption, not the paper’s conclusion. Research factors are averaged and bounded to 0.9–1.1 before scenario adjustment. Research metadata does not establish research quality or Malaysian hiring demand. The three authored scenarios are Steady adoption, Faster AI adoption and Green transition. [R02, R06, D01]

Stale evidence retains original dates; a cold unavailable feed uses neutral research weights. Refresh may retrieve the same inputs and leave ranking unchanged. Scenario changes demonstrate sensitivity to assumptions, not published forecasts. [R02–R03, R06]

## 5. Practical learning and real brief

After the accepted demo completion, the pathway has **40 estimated hours remaining over ten weeks**. SQL is **16 hours, weeks 1–4**; analytics is **16 hours, weeks 5–8**; the work sample is **8 hours, weeks 9–10**. SQL’s authored spreadsheet prerequisite is already satisfied by Siti’s reviewed declaration. The public resource is Microsoft Learn’s **Query and modify data with Transact-SQL**. Nexus’s authored practice output is to write and explain queries, joins and checks on synthetic tables. Sixteen hours includes Nexus’s practice estimate, not a Microsoft course-duration claim. [R02, R04, D01, X03]

The real exported brief is [siti-career-brief.md](output/pitch/siti-career-brief.md) and is also downloadable from slide 7 offline. It contains the selected direction, scenario, schedule, completion, source receipts, scoring explanation and revision history. Public resource content is free; optional certificates, equipment, software and assessments may cost money. Introductory practice and self-reported completion do not establish proficiency or professional qualification. [D01]

The SQL step’s SDG 4.4 and 8.2 mappings describe intended contribution through technical practice and responsible productive work. They are Nexus interpretations, not measured impact or UN endorsement. SDG 4.4’s official target concerns relevant technical/vocational skills. [R04, X04]

## 6. Buyer hypothesis, proposed pilot and future work

The expected impact is clearer next learning choices for workers and more reviewable advice for advisers, while useful learning remains recorded as plans change. Intended benefits are clearer next steps, traceable advice, useful revisions and visible learning. The proposed pilot connects each benefit to a measure: time to an adviser-agreed action, source validity, acceptance/reversion usefulness and adviser review of a practice work sample. These are hypotheses to validate; no improvement, employment effect or measured social impact is asserted. [P01]

Malaysian career centres and reskilling providers are the initial buyer hypothesis. The proposed value is preparing and revisiting an explainable transition brief. An organisational subscription per active advised learner is a possible model; pricing remains unvalidated. A proposed first pilot invites **one adviser team and two review sessions**. This scope is a pitch proposal, not an agreed partnership. [R01, P01]

Measure time to an adviser-agreed next action, source validity, usefulness of revisions and review of completed work samples. Proposed targets are recording an agreed action, checking each source used, explaining acceptance/reversion and reviewing practice outputs. **Baselines are pending measurement.** No market size, revenue, customers, traction or outcomes are claimed. Adviser matching validation, resource/prerequisite review, an appropriate Malaysian job-demand source, accounts and deployment controls remain future work. Engineering checks do not establish career accuracy, general fairness or employment outcomes. [R01–R03, P01]

## 7. Team and availability

Verified roles: **Raye Chan Jun Foong — team leader; Teo Zheng Xi — tech lead; Liew Jicson — video**. The live prototype is deployed on Replit at https://NexusTalent-Decisive.replit.app. The deck therefore states **Hosted prototype available for demonstration**. The invitation is to review a sample transition decision with an adviser team. [R01]

## Source register

Repository sources refer to the active files read on 24 October 2026; legacy strategy and unused components are excluded.

${sources.map(s=>`- **${s.id}** — ${s.url?`[${s.title}](${s.url})`:s.title}${s.also?`; also ${s.also.map(x=>'\x60'+x+'\x60').join(', ')}`:''}${s.note?`. ${s.note}`:''}.`).join('\n')}

## Asset and production record

The frozen product/API capture and exact brief live in output/pitch/. Historical screenshots remain source records only and are not embedded or displayed. The deck embeds CSS, JavaScript, fonts, narration, source records and asset mappings. Fonts were obtained from official Google Fonts endpoints and embedded; there is **no external runtime font dependency**. The deck uses native typography and diagrams, with no product screenshots. Slide 6 is the sole live HTML embed and connects to the hosted app at https://NexusTalent-Decisive.replit.app/#import. It is a live Replit deployment. No required product asset is missing. Public deployment, pilot baselines and any real learner work sample remain unavailable and are not fabricated.

The later video must rebuild focused 1920 × 1080 click-driven scenes on a consistent Nexus stage. This run creates neither voice audio nor finished video. See outline.md for the pending plan, first-chapter and audio checkpoints; the later chapters’ narrations.ts files become the implementation source of truth.
`;
await fs.writeFile('article.md',article);
const scriptWords=pitchData.spokenWords;
const outline=`# Nexus video development plan

> **Theme:** custom Nexus identity specified by the user; Sora / DM Sans / IBM Plex Mono, supplied colour tokens.\n> **Stage:** fixed 1920 × 1080, proportionally scaled; at least 80px safe margins; one consistent midnight stage surface across all chapters. Paper/ice are evidence surfaces inside the stage.\n> **Timing:** approximately six minutes, including demonstration pauses; ${scriptWords} English words across 10 chapters / ${beatOffset} initial beats. Planned chapter time totals 360 seconds. Rehearsal should use roughly ${Math.round(scriptWords/5.6)} words/minute plus about 24 seconds of demo dwell; this is a working estimate, not an event rule.\n> **Sources:** script.md sets spoken order; article.md supplies detail; output/pitch/pitch-data.json and the HTML’s nexus-pitch-data contain aligned narration, source IDs, asset records and captured values.\n> **Scope:** source preparation complete; later chapter build, voice audio and finished video are outside this run.

## Recording-scene requirements

The deck and video tell the same pitch. The deck supplies the visual backbone; video chapters adapt each slide's main relationship into focused scenes without changing the story, claim status or evidence. Use this shared requirement map:

${coverageMarkdown}

Rebuild the story as full-screen click-driven scenes using native typography and diagrams. Use one dedicated scene for the live HTML demo. Do not use product screenshots or animate deck captures. One spoken beat equals one focused step. Lists must be revealed one item per step; the scoring weights and pilot measures already have separate beats. Remove deck headers, footers, page numbers and persistent brand bars from recording scenes. Keep relevant evidence/status labels readable when needed. Every chapter needs a meaningful visual demonstration using the verified relationships: score contributions, metadata mapping, changed priority and retained completion. Do not invent figures or imitate unavailable product states. This plan defines content and pacing, leaving animation choices to chapter development.

The later chapter narrations.ts is the implementation source of truth for step counts and optional audio. If a beat is divided, synchronize script.md, outline.md, chapter registry and narration arrays before recording. Preserve all material limits and the verified scenario sequence.

## Pending checkpoints for the later run

1. **Plan checkpoint:** review the script and outline, confirm the specified custom Nexus theme, confirm source assets, and select development mode. This run deliberately leaves that build checkpoint pending. Theme alternatives are unnecessary unless the user requests a change to the established identity.
2. **First-chapter checkpoint:** the main thread builds a complete first chapter with real assets and a meaningful demonstration; wait for user review before building further chapters. Later mode options are chapter-by-chapter review, sequential build after chapter 1, or user-authorized parallel build.
3. **Audio checkpoint:** after web chapters are complete, ask whether voice synthesis is wanted. No audio has been generated or approved in this run.

${chapters.map(c=>`## ${c.number}. ${c.id} — ${c.title} (${c.beats.length} steps · ~${c.seconds}s)

**Deck mapping:** ${c.slideId}. **Narrative role:** ${c.section}. **Narration mapping:** script beats ${c.beatStart}–${c.beatEnd}, in order. **Source IDs:** ${c.refs.join(', ')}.

**Information pool:**

${c.pool.map(x=>'- '+x).join('\n')}

**Focused screen plan:**

${c.steps.map((s,i)=>`- Step ${i+1} (~${c.durations[i]}s; beat ${c.beatStart+i}) — ${s}`).join('\n')}

**Production pacing:** ${c.id==='reviewable-change'?'Allow deliberate dwell on marking complete, the changed priority, acceptance, reload and the separate revert test; retain the authored-scenario label.':c.id==='explainable-directions'?'Each scoring weight has its own beat. Preserve their order and the same index-point explanation; do not convert weights into an outcomes chart.':c.id==='buyer-and-pilot'?'Each pilot measure has its own beat. All targets remain proposed; no baseline is invented.':c.id==='practical-next-step'?'Give the resource and practice output time to read, then dwell on the actual brief download; hours are authored estimates.':'Let the main relationship settle before the next beat; keep annotations subordinate to the spoken point.'}

**Asset checklist:**

${c.assets.length?c.assets.map(id=>`- Ready — ${id}: ${assets[id]?.path||'See embedded source data'}.`).join('\n'):'- Ready — repository-backed facts and explicitly labelled proposed pilot measures; build as editable scene content.'}

**Spoken excerpt:** “${c.beats[0]}”
`).join('\n')}
## Consolidated asset checklist

- Ready — native deck text and diagrams use the frozen fictional Siti API capture: Financial data analyst, four hours/week, evidence revision 947afd1b22fcbef5 and stale status. Product screenshots are not used in the deck or as recording scenes.
- Ready — output/pitch/demo-proof.json holds initial, completed, rapid, green and reverted API responses plus the final local state and preservation checks.
- Ready — output/pitch/siti-career-brief.md is the real exported brief; the HTML embeds it for an offline download.
- Ready — public/nexus-mark.svg and the original Wordmark span structure/proportions are reused; embedded Sora, DM Sans and IBM Plex Mono remove runtime font downloads.
- Ready — output/pitch/pitch-data.json and font-sources.json document sources, timestamps, data assets, the local live-demo address and font provenance.
- Ready — public deployment URL: https://NexusTalent-Decisive.replit.app.
- Pending measurement — pilot baselines, adviser agreement and outcome data; show proposed measures only.
- Unavailable, not claimed — a real learner’s completed work sample, professional qualification and institutional approval.
- Live Replit deployment — slide 6 embeds https://NexusTalent-Decisive.replit.app/#import. Select the fictional Siti sample and review the demo preferences. The live workspace/evidence may differ from the frozen reference figures.\n- Later build only — chapter code, narrations.ts, optional voice files and finished video; no audio generated.

## Capture continuity and rehearsal

Use the same evidence revision through the six-minute story. Do not refresh during recording unless the resulting data are re-captured and all displayed values are updated. The chosen source is a record inside that revision; its data-quality metadata mapping is an authored proxy. If its original page is unavailable, retain that uncertainty. The central change is explicitly authored Faster AI adoption, not a research refresh or a published forecast.

Rehearse exact sequence: initial steady plan → self-report data-quality completion for demo → propose faster-AI scenario → inspect comparison and four retained step IDs → accept → reload and show completion → propose Green transition separately → Keep previous view → verify return to the accepted faster-AI plan. The historical brief export precedes the separate revert test; its accepted faster-AI state is the same state restored by that test.

The deck has an offline brief-download action, ←/→/Space navigation, Home/End, N for notes and a ten-slide print layout. For clean later recording, build native scenes from the chapter plan rather than recording those deck controls.
`;
await fs.writeFile('outline.md',outline);
console.log(JSON.stringify({slides:slides.length,beats:beatOffset,spokenWords:scriptWords,plannedSeconds:chapters.reduce((s,c)=>s+c.seconds,0),htmlBytes:Buffer.byteLength(html),assets:Object.keys(assets).length,productScreenshots:0,liveEmbeds:1,liveApplicationUrl:demoUrl},null,2));
