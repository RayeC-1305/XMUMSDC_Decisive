import type {ChapterStepProps} from '../../registry/types';
import './Decision.css';

export default function Decision({step}:ChapterStepProps){return <div className={'wd-decision wd-step-'+step}>
 <section className={'wd-layer '+(step===0?'wd-show':'')} aria-hidden={step!==0}>
  <h1>What deserves your<br/><em>next learning hour?</em></h1><div className="wd-time"><span className="hero-num">1<span>h</span></span><div className="wd-clock"><i/></div></div>
  <p className="wd-bottom">Limited time. Changing assumptions.<br/>A decision worth reviewing.</p>
 </section>
 <section className={'wd-layer '+(step===1?'wd-show':'')} aria-hidden={step!==1}>
  <p className="wd-label">FICTIONAL SAMPLE PROFILE</p><h1>Siti Rosli</h1><p className="wd-role">Operations coordinator</p>
  <div className="wd-tasks"><p>Spreadsheet reporting</p><p>Supplier coordination</p><p>Document processing</p></div>
  <div className="wd-profile"><strong className="hero-num">5</strong><span>reviewed skills</span><small>Declared experience<br/>Open to correction</small></div>
 </section>
 <section className={'wd-layer '+(step===2?'wd-show':'')} aria-hidden={step!==2}>
  <p className="wd-label">DEMO PREFERENCE</p><h1>A plan that fits<br/><em>four hours a week.</em></h1>
  <div className="wd-hours">{[1,2,3,4].map(i=><div key={i}><b className="hero-num">1h</b><span>Learning + practice</span></div>)}</div>
 </section>
 <section className={'wd-layer '+(step===3?'wd-show':'')} aria-hidden={step!==3}>
  <h1>Build from experience.<br/><em>Choose the next gap.</em></h1>
  <div className="wd-choice"><div><span>TRANSFER</span><strong>Existing strengths</strong><p>Spreadsheets · communication</p></div><b>→</b><div><span>REVIEW</span><strong>A useful next step</strong><p>Gap · effort · reason to reconsider</p></div></div>
  <p className="wd-bottom">What would make this decision change?</p>
 </section>
 </div>;}
