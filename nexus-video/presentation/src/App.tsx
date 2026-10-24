import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/motion.css';
import {useCallback,useEffect,useState} from 'react';
import {Stage} from './components/Stage';
import {useStepper} from './hooks/useStepper';
import {CHAPTERS} from './registry/chapters';

// Playback timing belongs to the presentation shell, never chapter animations.
// This review mode is silent. Voice synthesis remains at the audio checkpoint.
export default function App(){
 const [playing,setPlaying]=useState(false);
 const [run,setRun]=useState(0);
 const [notes,setNotes]=useState(false);
 const stepper=useStepper(CHAPTERS,!playing);
 const {cursor,next,jumpToChapter}=stepper;
 const chapter=CHAPTERS[cursor.chapter]!;
 const Scene=chapter.Component;
 const clean=new URLSearchParams(location.search).get('clean')==='1';
 const loopOpening=new URLSearchParams(location.search).get('loop')==='1';
 const totalSeconds=CHAPTERS.reduce((sum,c)=>sum+c.durations.reduce((a,b)=>a+b,0),0);
 const start=useCallback(()=>{
  const params=new URLSearchParams(location.search);
  const excerpt=CHAPTERS.findIndex(c=>c.id===params.get('from'));
  jumpToChapter(excerpt>=0?excerpt:0,excerpt>=0?Number(params.get('step'))||0:0);
  setRun(n=>n+1);setPlaying(true);
 },[jumpToChapter]);
 useEffect(()=>{
  if(new URLSearchParams(location.search).get('preview')!=='1')return;
  let active=true;
  document.fonts.ready.then(()=>{if(active)start();});
  return()=>{active=false;};
 },[start]);
 useEffect(()=>{
  if(!playing)return;
  const timer=window.setTimeout(()=>{
   if(cursor.chapter===CHAPTERS.length-1&&cursor.step===chapter.narrations.length-1){
    if(loopOpening)jumpToChapter(0,0);
    else setPlaying(false);
   }
   else next();
  },chapter.durations[cursor.step]!*1000);
  return()=>window.clearTimeout(timer);
 },[playing,run,cursor.chapter,cursor.step,chapter,next,loopOpening,jumpToChapter]);
 useEffect(()=>{
  const onKey=(event:KeyboardEvent)=>{
   if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,button,a'))return;
   if(event.key.toLowerCase()==='n')setNotes(n=>!n);
   if(event.key==='Escape'){setNotes(false);setPlaying(false);}
   if(event.key.toLowerCase()==='p'){event.preventDefault();if(playing)setPlaying(false);else start();}
  };
  addEventListener('keydown',onKey);return()=>removeEventListener('keydown',onKey);
 },[playing,start]);
 return <>
  <Stage onAdvance={()=>{if(!playing)next();}}>
   <div key={`${chapter.id}:${run}`} className="scene" data-chapter={chapter.id} data-step={cursor.step}>
    <Scene step={cursor.step}/>
   </div>
  </Stage>
  {!clean&&<nav className="review-controls" aria-label="Video review controls" data-no-advance>
   <div className="review-tray">
    <button onClick={()=>jumpToChapter(0,0)} disabled={playing} aria-label="Restart video">Restart</button>
    <select aria-label="Chapter" value={cursor.chapter} disabled={playing} onChange={e=>jumpToChapter(Number(e.target.value),0)}>{CHAPTERS.map((c,i)=><option key={c.id} value={i}>{String(i+1).padStart(2,'0')} · {c.title}</option>)}</select>
    <button onClick={stepper.prev} disabled={playing||stepper.globalIndex===0} aria-label="Previous beat">←</button>
    <span className="review-progress">{stepper.globalIndex+1} / {stepper.totalGlobal}</span>
    <button onClick={next} disabled={playing||stepper.globalIndex===stepper.totalGlobal-1} aria-label="Next beat">→</button>
    <button onClick={()=>playing?setPlaying(false):start()}>{playing?'Stop playback':loopOpening?'Loop preview':`Play ${Math.floor(totalSeconds/60)}-minute preview`}</button>
    <button onClick={()=>setNotes(n=>!n)} aria-expanded={notes}>Narration</button>
   </div>
  </nav>}
  {notes&&!clean&&<aside className="review-narration" aria-label="Current narration"><p>{chapter.narrations[cursor.step]}</p><p>{chapter.title} · beat {cursor.step+1}/{chapter.narrations.length} · {chapter.durations[cursor.step]}s. Silent preview; the live demo requires actual operation. Voice is selected at the audio checkpoint.</p></aside>}
  <p className="sr-only" aria-live="polite">{chapter.narrations[cursor.step]}</p>
 </>;
}
