import type {ChapterStepProps} from '../../registry/types';
import './Opening.css';
function Wordmark(){return <span className="op-wordmark" role="img" aria-label="Nexus"><span aria-hidden="true">ne</span><span className="op-wordmark-x" aria-hidden="true">x</span><span aria-hidden="true">us</span></span>;}
function Check(){return <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m9 25 10 10L40 13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
// Persistent chapter layers preserve continuity as the active information changes.
export default function Opening({step}:ChapterStepProps){
 const layer=(index:number,name:string)=>`op-scene op-layer ${name}${step===index?' op-active':''}`;
 return <div className="op-opening" data-beat={step}>
  <section className={layer(0,'op-question')} aria-hidden={step!==0} aria-label="The next learning-hour question">
   <h1 data-layout-box>What should I<br/><span>learn next?</span></h1>
   <p className="op-question-follow" data-layout-box>And what would make me<br/>change that decision?</p>
   <figure className="op-budget" data-layout-box aria-label="Fictional Siti has four learning hours per week, a demo preference">
    <div className="op-budget-number"><b className="hero-num">4<span>h</span></b><p>learning<br/>per week</p></div>
    <svg className="op-budget-track" width="530" height="104" viewBox="0 0 530 104" aria-hidden="true">
     <defs><clipPath id="op-time-window"><path className="op-budget-window" d="M0 0H530V104H0Z"/></clipPath></defs>
     <g className="op-budget-outline">{[0,136,272,408].map(x=><rect key={x} x={x} y="2" width="120" height="100" rx="8"/>)}</g>
     <g className="op-budget-fill" clipPath="url(#op-time-window)">{[0,136,272,408].map(x=><rect key={x} x={x} y="2" width="120" height="100" rx="8"/>)}</g>
    </svg>
    <figcaption>Siti · fictional sample<br/>Four hours is a demo preference.</figcaption>
   </figure>
  </section>
  <section className={layer(1,'op-workspace')} aria-hidden={step!==1} aria-label="Experience becomes a reviewable decision">
   <div className="op-identity" data-layout-box><Wordmark/></div>
   <h1 data-layout-box>Experience becomes<br/><span>a decision you can review.</span></h1>
   <figure className="op-flow" data-layout-box aria-label="Experience connects through worker-reviewed profile to learning decision">
    <svg className="op-flow-lines" width="1680" height="260" viewBox="0 0 1680 260" fill="none" aria-hidden="true">
     <circle cx="12" cy="20" r="9"/><circle cx="636" cy="20" r="9"/><circle cx="1356" cy="20" r="9"/>
     <path d="M12 20H1356" stroke="var(--rule)" strokeWidth="2"/><circle className="op-review-ring" cx="636" cy="20" r="21"/>
    </svg>
    <div className="op-flow-node"><h3>Your experience</h3><p>Skills and tasks</p></div>
    <div className="op-flow-node"><h3>Reviewed profile</h3><p>You can edit it</p></div>
    <div className="op-flow-node"><h3>Learning decision</h3><p>A plan you can revisit</p></div>
   </figure>
  </section>
  <section className={layer(2,'op-continuity')} aria-hidden={step!==2} aria-label="A changed priority retains the completed learning step">
   <h1 data-layout-box>Plans evolve.<br/><span>Progress stays.</span></h1>
   <p className="op-context" data-layout-box>Verified fictional example.<br/>Authored scenario change.</p>
   <figure className="op-priority" data-layout-box aria-label="Steady adoption prioritizes data quality; Faster AI adoption prioritizes SQL; the same data-quality completion is retained">
    <div className="op-before"><p>Steady adoption</p><h3>Data quality<br/>& validation</h3></div>
    <svg className="op-priority-arrow" width="500" height="90" viewBox="0 0 500 90" fill="none" aria-hidden="true"><path className="op-priority-draw" d="M3 45H475m-20-20 20 20-20 20" pathLength="1"/></svg>
    <div className="op-after"><p>Faster AI adoption</p><h3>SQL &<br/>data querying</h3></div>
    <div className="op-kept"><Check/><div><h3>Data quality & validation</h3><p>Completed step retained</p></div><p className="op-demo-limit">Self-reported<br/>demo completion</p></div>
   </figure>
  </section>
 </div>;
}
