import type {ChapterStepProps} from '../../registry/types';
import './LiveDemo.css';

const cues=['Steady adoption · initial plan','Mark data quality complete','Compare Faster AI adoption','Inspect Review changes','Same steps. Completion retained.','Accept & update my plan','Reload · check saved completion','Separate Green proposal · Keep previous view','Faster AI plan · completion remains','Employers · prepare a synthetic campaign','Survey · personal results from the same engine','Team skills · review and compare','Learning cohorts · export a cited brief'];
const demoBase='https://NexusTalent-Decisive.replit.app';
export default function LiveDemo({step}:ChapterStepProps){const employer=step>=9;const url=new URL(employer?'/hr':'/#pathway',demoBase).href;return <div className="dm-demo">
 <div className="dm-guide"><span>{employer?'REAL EMPLOYER DEMO · SYNTHETIC ONLY':'REAL WORKER DEMO · FICTIONAL SITI'}</span><h1>{cues[step]}</h1><p>{employer?'No employer login · demo data only':'Financial data analyst · 4 hours/week'}</p></div>
 <div className="dm-browser" data-no-advance><iframe title="Live Nexus fictional recording workspace" src={url}/></div>
 <div className="dm-disclosure"><span>{employer?'Synthetic-only server JSON store. Human review; no personnel decisions.':'Authored scenarios, not forecasts. Completion is self-reported demo state.'}</span><a href={url} target="_blank" rel="noreferrer" data-no-advance>Open demo ↗</a></div>
 </div>;}
