import type {ChapterStepProps} from '../../registry/types';
import './Loop.css';

const nodes=['Review experience','Compare directions','Inspect evidence','Build a plan','Review a change','Retain learning'];
const titles=['Your experience, reviewed.','Directions with reasons.','A source you can inspect.','A gap becomes a next step.','The revision is your choice.','Useful progress carries forward.'];
const details=['Skills · tasks · goals · weekly time','Six authored role profiles · inspectable contributions','Publication date · retrieval time · mapping assumption','Prerequisite → public resource → practice output','Inspect → accept or keep the previous view','Completed step → next decision'];
export default function Loop({step}:ChapterStepProps){return <div className="lp-loop" data-beat={step}>
 <div className="lp-selection" style={{transform:`translateX(${step*280}px)`}} aria-hidden="true"/>
 {titles.map((title,i)=><section key={title} className={'lp-focus '+(step===i?'lp-active':'')} aria-hidden={step!==i}>
  <h1>{title}</h1><p>{details[i]}</p>
  <div className="lp-output"><span>{['REVIEWED PROFILE','EXPLAINED ROLE','SOURCE RECEIPT','ORDERED LEARNING PLAN','REVIEWABLE PROPOSAL','SAVED COMPLETION'][i]}</span><strong>{['Siti · 5 declared skills','Financial data analyst','Crossref metadata + Nexus assumption','SQL · resource · synthetic practice','A changed priority, explained','Data quality & validation'][i]}</strong>{i===5&&<b>✓</b>}</div>
 </section>)}
 <div className="lp-nodes">{nodes.map((node,i)=><div key={node} className={(i<=step?'lp-seen ':'')+(i===step?'lp-current':'')}><i>{i<step?'✓':String(i+1).padStart(2,'0')}</i><span>{i<=step?node:' '}</span></div>)}</div>
 <p className="lp-context">{step===5?'Completion is recorded on this device. Self-reported progress remains reviewable.':'A connected workspace for the worker and adviser.'}</p>
 </div>;}
