import type {ChapterStepProps} from '../../registry/types';
import './Architecture.css';

const focus=['Browser → career API','Explainable CPU rules','The file stays in the browser','Different workspaces. Different storage.','Hosted on Replit. CPU rules.','Implemented flow. Validation next.'];
export default function Architecture({step}:ChapterStepProps){return <div className={'ar-architecture ar-step-'+step}>
 <h1>{focus[step]}</h1>
 <div className="ar-browser"><span>BROWSER WORKSPACE</span><strong>React / Vite</strong><div className={'ar-file '+(step>=2?'ar-lit':'')}><b>CV file</b><p>PDF · DOCX · TXT</p></div><div className={'ar-local '+(step>=3?'ar-lit':'')}><b>Worker device storage</b><p>Decisions · completion · reflections</p></div></div>
 <svg className="ar-links" viewBox="0 0 1920 1080" aria-hidden="true"><path d="M780 510H1100m-18-18 18 18-18 18 M1480 735V600m-18 18 18-18 18 18"/></svg>
 {step===2&&<div className="ar-transfer" aria-hidden="true">Text + profile</div>}
 <div className="ar-api"><span>CAREER API</span><strong>Express</strong><p>{step>=1?'CPU rules':'In-memory processing'}</p><small>{step>=1?'Profile + context → roles + plan':'Reviewed profile → decision support'}</small></div>
 <div className={'ar-cache '+(step>=1?'ar-lit':'')}><span>{step===3?'EMPLOYER DEMO STORAGE':'PUBLIC RESEARCH'}</span><strong>{step===3?'Server JSON store':'Crossref metadata'}</strong><p>{step===3?'Single process · synthetic profiles only':'Revision cache · source links'}</p></div>
 <div className="ar-payload">{step>=2?'Extracted text + reviewed profile':'Request / response'}</div>
 <p className="ar-limit">{step===2?'Original file bytes remain in the browser. The API processes extracted text in memory.':step===3?'Worker progress: device-local. Employer demo: synthetic-only server JSON; no employer login.':step===4?'Replit hosts the app. No active LLM or GPU. Employer authentication remains future work.':step===5?'Engineering checks do not prove forecast accuracy, general fairness or employment outcomes.':'A working path from reviewed experience to a practical, revisitable learning decision.'}</p>
 </div>;}
