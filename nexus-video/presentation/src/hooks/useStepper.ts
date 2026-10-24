import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {flushSync} from 'react-dom';
import type { ChapterDef } from "../registry/types";

/**
 * Bump this when chapter step counts / structure change so old persisted
 * cursors don't land mid-removed-step.
 */
const STORAGE_KEY = "nexus-video-employer-v5";

export type Cursor = { chapter: number; step: number };

export interface StepperState {
  cursor: Cursor;
  totalChapters: number;
  chapterTotalSteps: number;
  globalIndex: number;
  totalGlobal: number;
  next(): void;
  prev(): void;
  jumpToChapter(idx: number, step?: number): void;
  jumpToGlobal(globalIdx: number): void;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

/**
 * Clamp a (possibly stale) cursor to the current chapter list. Persisted
 * cursors can outlive structural changes — fewer chapters, fewer steps,
 * a different scaffolded project sharing the same dev-server origin — so
 * we always re-validate before handing one to React.
 */
function sanitize(cursor: Cursor, chapters: ChapterDef[]): Cursor {
  if (chapters.length === 0) return { chapter: 0, step: 0 };
  const chapter = clamp(cursor.chapter | 0, 0, chapters.length - 1);
  const stepCount = chapters[chapter]!.narrations.length;
  const step = clamp(cursor.step | 0, 0, Math.max(0, stepCount - 1));
  return { chapter, step };
}

export function useStepper(chapters: ChapterDef[], keyboardEnabled = true): StepperState {
  const [cursor, setCursor] = useState<Cursor>(() => {
    const fallback = { chapter: 0, step: 0 };
    if (typeof window === "undefined") return fallback;
    try {
      const query = new URLSearchParams(location.search);
      if(query.has("step")||query.has("chapter")){
        const requested=query.get("chapter")||"opening";
        const byId=chapters.findIndex(c=>c.id===requested);
        const chapter=byId>=0?byId:Number(requested)||0;
        return sanitize({chapter,step:Number(query.get("step"))||0},chapters);
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return sanitize(JSON.parse(raw), chapters);
    } catch {
      /* ignore */
    }
    return fallback;
  });

  const cursorRef=useRef(cursor);
  const transitionRef=useRef<{skipTransition():void;finished:Promise<void>}|null>(null);
  const generationRef=useRef(0);
  // One interruptible navigation transition. Animation never decides semantic state.
  const move=useCallback((update:Cursor|((value:Cursor)=>Cursor))=>{
    const previous=cursorRef.current;
    const target=sanitize(typeof update==='function'?update(previous):update,chapters);
    if(previous.chapter===target.chapter&&previous.step===target.step)return;
    cursorRef.current=target;
    const generation=++generationRef.current;
    transitionRef.current?.skipTransition();
    const doc=document as Document&{startViewTransition?:(update:()=>void)=>{skipTransition():void;finished:Promise<void>;ready:Promise<void>}};
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!doc.startViewTransition||reduce){setCursor(target);return;}
    document.documentElement.dataset.motionKind=previous.chapter===target.chapter?'beat':'chapter';
    document.documentElement.dataset.motionDirection=target.chapter<previous.chapter||(target.chapter===previous.chapter&&target.step<previous.step)?'back':'forward';
    const transition=doc.startViewTransition(()=>{
      if(generation!==generationRef.current)return;
      flushSync(()=>setCursor(target));
    });
    transitionRef.current=transition;
    void transition.ready.catch(()=>{/* Cancellation rejects ready; it must not become an unhandled error. */});
    void transition.finished.catch(()=>{/* Superseded or unsupported capture: state is already correct. */});
  },[chapters]);

  // Re-sanitize if the chapter list shape changes after mount (e.g. HMR
  // updates `chapters.ts`) — keeps a stale persisted cursor from leaking
  // into a render where it's now out of range.
  useEffect(() => {
    move((cur) => {
      const next = sanitize(cur, chapters);
      return next.chapter === cur.chapter && next.step === cur.step
        ? cur
        : next;
    });
  }, [chapters,move]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cursor));
    } catch {
      /* ignore */
    }
  }, [cursor]);

  const offsets = useMemo(() => {
    const arr: number[] = [];
    let acc = 0;
    for (const c of chapters) {
      arr.push(acc);
      acc += c.narrations.length;
    }
    return arr;
  }, [chapters]);
  const totalGlobal = useMemo(
    () => chapters.reduce((s, c) => s + c.narrations.length, 0),
    [chapters],
  );
  const globalIndex = (offsets[cursor.chapter] ?? 0) + cursor.step;

  const next = useCallback(() => {
    move((cur) => {
      const c = chapters[cur.chapter]!;
      if (cur.step < c.narrations.length - 1)
        return { ...cur, step: cur.step + 1 };
      if (cur.chapter < chapters.length - 1)
        return { chapter: cur.chapter + 1, step: 0 };
      return cur;
    });
  }, [chapters,move]);

  const prev = useCallback(() => {
    move((cur) => {
      if (cur.step > 0) return { ...cur, step: cur.step - 1 };
      if (cur.chapter > 0) {
        const p = chapters[cur.chapter - 1]!;
        return { chapter: cur.chapter - 1, step: p.narrations.length - 1 };
      }
      return cur;
    });
  }, [chapters,move]);

  const jumpToChapter = useCallback(
    (idx: number, step = 0) => {
      const ch = clamp(idx, 0, chapters.length - 1);
      const c = chapters[ch]!;
      move({
        chapter: ch,
        step: clamp(step, 0, c.narrations.length - 1),
      });
    },
    [chapters,move],
  );

  const jumpToGlobal = useCallback(
    (g: number) => {
      const target = clamp(g, 0, totalGlobal - 1);
      let acc = 0;
      for (let i = 0; i < chapters.length; i++) {
        const t = chapters[i]!.narrations.length;
        if (target < acc + t) {
          move({ chapter: i, step: target - acc });
          return;
        }
        acc += t;
      }
    },
    [chapters, totalGlobal,move],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!keyboardEnabled || e.altKey || e.ctrlKey || e.metaKey) return;
      if(e.target instanceof HTMLElement){
        if(e.target.closest("input,textarea,select,[contenteditable=true]"))return;
        if(e.key===" "&&e.target.closest("button,a"))return;
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        jumpToChapter(0, 0);
      } else if (e.key === "End") {
        const last = chapters.length - 1;
        jumpToChapter(last, chapters[last]!.narrations.length - 1);
      } else if (e.key >= "1" && e.key <= "9") {
        const n = Number(e.key) - 1;
        if (n < chapters.length) jumpToChapter(n, 0);
      } else if(e.key === "0" && chapters.length>=10){
        jumpToChapter(9,0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, jumpToChapter, chapters, keyboardEnabled]);

  const ch = chapters[cursor.chapter]!;
  return {
    cursor,
    totalChapters: chapters.length,
    chapterTotalSteps: ch.narrations.length,
    globalIndex,
    totalGlobal,
    next,
    prev,
    jumpToChapter,
    jumpToGlobal,
  };
}
