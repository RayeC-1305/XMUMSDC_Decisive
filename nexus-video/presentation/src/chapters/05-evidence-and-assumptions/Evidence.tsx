import type {ChapterStepProps} from '../../registry/types';
import './Evidence.css';

export default function Evidence({step}:ChapterStepProps){return <div className={'ev-evidence ev-step-'+step}>
 <section className="ev-source"><span className="ev-type">RETRIEVED METADATA · CROSSREF</span><h1>Towards Responsible<br/>Artificial Intelligence (AI)</h1><p className="ev-full">An Analysis of AI Policies in Selected<br/>Low- and Middle-Income Countries</p><div className="ev-publisher">Oxford University Press (OUP)<br/><span>Published 23 October 2026</span></div><a href="https://doi.org/10.1093/haschl/qxag295" target="_blank" rel="noreferrer" data-no-advance>doi: 10.1093/haschl/qxag295</a>
  <div className={'ev-receipt '+(step>=1?'ev-revealed':'')}><b>STALE CACHE · ORIGINAL DATES</b><p>Retrieved 24 Oct 2026 · 15:18 MYT</p><code>22a5e09950739768</code></div>
 </section>
 {step>=2&&<svg className="ev-link" viewBox="0 0 1920 1080" aria-hidden="true"><path d="M1010 470H1140m-18-18 18 18-18 18"/></svg>}
 <section className="ev-explanation">
  {step<2?<div className="ev-wait"><span className="hero-num">Source<br/>before signal.</span><p>Dates and provenance stay visible.</p></div>:<><span className="ev-type">NEXUS PLANNING ASSUMPTION</span><div className="ev-map"><code>validat</code><span>↓</span><strong>Data quality<br/>& validation</strong><b className="hero-num">1.04×</b></div><p className="ev-rationale">Review data reliability<br/>and human validation.</p></>}
 </section>
 <div className="ev-meaning">{step===3?'A metadata mapping is an authored assumption, not a paper finding.':step===4?'Metadata does not verify research quality or establish Malaysian hiring demand.':step===5?'Refreshing may return the same inputs. A new ranking is not guaranteed.':step>=2?'Small, bounded planning weight. Not observed skill demand.':'A research receipt, not a labour-market forecast.'}</div>
 </div>;}
