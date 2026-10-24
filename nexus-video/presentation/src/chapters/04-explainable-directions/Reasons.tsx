import type {ChapterStepProps} from '../../registry/types';
import './Reasons.css';

const weights=[45,30,25]; const labels=['Declared required skills','Transferable strengths','Research + scenario context'];
export default function Reasons({step}:ChapterStepProps){return <div className={'rs-reasons rs-step-'+step}>
 <section className={'rs-intro '+(step<2?'rs-active':'')} aria-hidden={step>=2}><div className="rs-role"><p>STEADY ADOPTION · AUTHORED ROLE</p><h1>Financial<br/>data analyst</h1><span>Rank 2 of 6 authored directions</span></div><div className="rs-index"><b className="hero-num">60.78</b><span>/ 100 match index</span></div>
 <div className={'rs-skillmatch '+(step===1?'rs-visible':'')}><b className="hero-num">2 / 5</b><div><strong>Spreadsheets & reporting<br/>Stakeholder communication</strong><p>To review: data quality · analytics · SQL</p></div></div></section>
 <section className={'rs-model '+(step>=2?'rs-active':'')} aria-hidden={step<2}>
  <h1>{step===6?'A prompt for discussion.':'Every match has a reason.'}</h1><p className="rs-sub">{step===6?'An index is not an employment probability.':'Scoring weights · model structure, not outcomes'}</p>
  <div className="rs-weight-track">{weights.map((w,i)=><div key={w} className={(step>=i+2?'rs-known ':'')+(step===i+2?'rs-focused':'')} style={{width:w+'%'}}><b className="hero-num">{step>=i+2?w+'%':''}</b><span>{step>=i+2?labels[i]:''}</span></div>)}</div>
  {step>=5&&<div className="rs-points" aria-label="Weighted contributions 18 plus 30 plus 12.78 points"><div style={{width:'18%'}}/><div style={{width:'30%'}}/><div style={{width:'12.78%'}}/></div>}
  <div className="rs-weight-caption">{step===2?<><b className="hero-num">40</b><span>Component value × 45%<br/>2 of 5 required skills declared</span></>:step===3?<><b className="hero-num">100</b><span>Component value × 30%<br/>Declared bridge skills receive credit</span></>:step===4?<><b className="hero-num">51.1</b><span>Component value × 25%<br/>Bounded metadata + scenario proxy</span></>:<><b className="hero-num">18 <i>+</i> 30 <i>+</i> 12.78 <i>=</i> <em>60.78</em></b></>}</div>
  {step===6&&<p className="rs-limit">A missing declaration is a question to review.<br/>It does not establish inability or proficiency.</p>}
 </section>
 </div>;}
