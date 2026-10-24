import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/motion.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from './components/Stage';
import { useStepper } from './hooks/useStepper';
import { CHAPTERS } from './registry/chapters';

// Playback timing belongs to the presentation shell, never chapter animations.
// This review mode is silent. Voice synthesis remains at the audio checkpoint.
function formatMmSs(sec: number): string {
    const total = Math.max(0, Math.floor(sec));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
    const [playing, setPlaying] = useState(false);
    const [run, setRun] = useState(0);
    const [notes, setNotes] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [autoStartOnSelect, setAutoStartOnSelect] = useState(false);
    const [slideElapsed, setSlideElapsed] = useState(0);

    const stepper = useStepper(CHAPTERS, !playing);
    const { cursor, next, jumpToChapter } = stepper;
    const chapter = CHAPTERS[cursor.chapter]!;
    const Scene = chapter.Component;
    const clean = new URLSearchParams(location.search).get('clean') === '1';
    const loopOpening = new URLSearchParams(location.search).get('loop') === '1';
    const totalSeconds = CHAPTERS.reduce((sum, c) => sum + c.durations.reduce((a, b) => a + b, 0), 0);

    const [slideInputVal, setSlideInputVal] = useState<string>(String(stepper.globalIndex + 1));
    useEffect(() => {
        setSlideInputVal(String(stepper.globalIndex + 1));
    }, [stepper.globalIndex]);

    const allSlides = useMemo(() => {
        let global = 0;
        return CHAPTERS.map((ch, chIdx) => {
            const slides = ch.narrations.map((narration, sIdx) => {
                const idx = global++;
                const duration = ch.durations[sIdx] ?? 6;
                const snippet = narration.replace(/[\r\n]+/g, ' ').trim();
                const preview = snippet.length > 34 ? snippet.slice(0, 34) + '…' : snippet;
                return {
                    globalIndex: idx,
                    chapterIndex: chIdx,
                    stepIndex: sIdx,
                    duration,
                    preview
                };
            });
            return {
                chapter: ch,
                chapterIndex: chIdx,
                slides
            };
        });
    }, []);

    const cumulativeTimeBeforeCurrent = useMemo(() => {
        let acc = 0;
        for (let c = 0; c < cursor.chapter; c++) {
            acc += CHAPTERS[c]!.durations.reduce((sum, d) => sum + d, 0);
        }
        const currentChapter = CHAPTERS[cursor.chapter]!;
        for (let s = 0; s < cursor.step; s++) {
            acc += currentChapter.durations[s] ?? 0;
        }
        return acc;
    }, [cursor.chapter, cursor.step]);

    const currentSlideDuration = chapter.durations[cursor.step] ?? 6;
    const clampedSlideElapsed = Math.min(currentSlideDuration, slideElapsed);
    const totalElapsedSeconds = cumulativeTimeBeforeCurrent + clampedSlideElapsed;

    const startAtCurrentSlide = useCallback(() => {
        setRun(n => n + 1);
        setPlaying(true);
    }, []);

    const stopTimer = useCallback(() => {
        setPlaying(false);
        setSlideElapsed(0);
    }, []);

    const restartToStart = useCallback(() => {
        setPlaying(false);
        setSlideElapsed(0);
        jumpToChapter(0, 0);
    }, [jumpToChapter]);

    const startFromQueryOrBeginning = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const excerpt = CHAPTERS.findIndex(c => c.id === params.get('from'));
        jumpToChapter(excerpt >= 0 ? excerpt : 0, excerpt >= 0 ? Number(params.get('step')) || 0 : 0);
        setRun(n => n + 1);
        setPlaying(true);
    }, [jumpToChapter]);

    const commitSlideInput = useCallback(() => {
        const num = parseInt(slideInputVal, 10);
        if (!isNaN(num) && num >= 1 && num <= stepper.totalGlobal) {
            stepper.jumpToGlobal(num - 1);
            if (autoStartOnSelect && !playing) {
                setPlaying(true);
            }
        } else {
            setSlideInputVal(String(stepper.globalIndex + 1));
        }
    }, [slideInputVal, stepper, autoStartOnSelect, playing]);

    useEffect(() => {
        if (new URLSearchParams(location.search).get('preview') !== '1') return;
        let active = true;
        document.fonts.ready.then(() => { if (active) startFromQueryOrBeginning(); });
        return () => { active = false; };
    }, [startFromQueryOrBeginning]);

    // Track elapsed time for active slide timer display
    const stepStartTimeRef = useRef<number>(Date.now());
    useEffect(() => {
        if (!playing) {
            setSlideElapsed(0);
            return;
        }
        stepStartTimeRef.current = Date.now();
        setSlideElapsed(0);

        const interval = window.setInterval(() => {
            const elapsed = (Date.now() - stepStartTimeRef.current) / 1000;
            setSlideElapsed(elapsed);
        }, 80);

        return () => window.clearInterval(interval);
    }, [playing, cursor.chapter, cursor.step, run]);

    // Timer advancement to next slide
    useEffect(() => {
        if (!playing) return;
        const dur = chapter.durations[cursor.step] ?? 6;
        const timer = window.setTimeout(() => {
            if (cursor.chapter === CHAPTERS.length - 1 && cursor.step === chapter.narrations.length - 1) {
                if (loopOpening) jumpToChapter(0, 0);
                else setPlaying(false);
            } else {
                next();
            }
        }, dur * 1000);
        return () => window.clearTimeout(timer);
    }, [playing, run, cursor.chapter, cursor.step, chapter, next, loopOpening, jumpToChapter]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,button,a')) return;
            if (event.key.toLowerCase() === 'n') setNotes(n => !n);
            if (event.key === 'Escape') { setNotes(false); stopTimer(); }
            if (event.key.toLowerCase() === 'p') {
                event.preventDefault();
                if (playing) stopTimer();
                else startAtCurrentSlide();
            }
        };
        addEventListener('keydown', onKey);
        return () => removeEventListener('keydown', onKey);
    }, [playing, stopTimer, startAtCurrentSlide]);

    return <>
        <Stage onAdvance={() => { if (!playing) next(); }}>
            <div key={`${chapter.id}:${run}`} className="scene" data-chapter={chapter.id} data-step={cursor.step}>
                <Scene step={cursor.step} />
            </div>
        </Stage>
        {!clean && <nav className="review-controls" aria-label="Video review controls" data-no-advance>
            <div className={`review-tray ${pinned ? 'is-pinned' : ''}`}>
                <button
                    onClick={restartToStart}
                    title="Reset to Slide 1 (Start)"
                    aria-label="Restart video"
                >
                    ⏮ Restart
                </button>

                <div className="review-select-group" title="Select a chapter">
                    <label className="review-label" htmlFor="review-ch-select">Ch:</label>
                    <select
                        id="review-ch-select"
                        aria-label="Chapter"
                        value={cursor.chapter}
                        onChange={e => {
                            const newCh = Number(e.target.value);
                            jumpToChapter(newCh, 0);
                            if (autoStartOnSelect && !playing) {
                                setPlaying(true);
                            }
                        }}
                    >
                        {CHAPTERS.map((c, i) => (
                            <option key={c.id} value={i}>
                                {String(i + 1).padStart(2, '0')} · {c.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="review-select-group" title="Choose a specific slide to view or run timer at">
                    <label className="review-label" htmlFor="review-slide-select">Slide:</label>
                    <select
                        id="review-slide-select"
                        aria-label="Choose specific slide"
                        value={stepper.globalIndex}
                        onChange={e => {
                            const targetGlobal = Number(e.target.value);
                            stepper.jumpToGlobal(targetGlobal);
                            if (autoStartOnSelect && !playing) {
                                setPlaying(true);
                            }
                        }}
                    >
                        {allSlides.map(({ chapter: c, chapterIndex: ci, slides }) => (
                            <optgroup key={c.id} label={`Ch ${String(ci + 1).padStart(2, '0')} · ${c.title}`}>
                                {slides.map(s => (
                                    <option key={s.globalIndex} value={s.globalIndex}>
                                        Slide {String(s.globalIndex + 1).padStart(2, '0')} ({s.duration}s) — {s.preview}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className="review-nav-group">
                    <button
                        onClick={stepper.prev}
                        disabled={stepper.globalIndex === 0}
                        aria-label="Previous slide"
                        title="Previous slide (←)"
                    >
                        ←
                    </button>

                    <label className="review-slide-num-label" title="Current slide / Total slides (type number and press Enter to jump)">
                        <input
                            type="number"
                            className="review-slide-input"
                            min={1}
                            max={stepper.totalGlobal}
                            value={slideInputVal}
                            onChange={e => setSlideInputVal(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    commitSlideInput();
                                    (e.target as HTMLElement).blur();
                                }
                            }}
                            onBlur={commitSlideInput}
                            aria-label="Jump to slide number"
                        />
                        <span className="review-slide-total">/ {stepper.totalGlobal}</span>
                    </label>

                    <button
                        onClick={next}
                        disabled={stepper.globalIndex === stepper.totalGlobal - 1}
                        aria-label="Next slide"
                        title="Next slide (→)"
                    >
                        →
                    </button>
                </div>

                <div
                    className={`review-timer-badge ${playing ? 'is-running' : ''}`}
                    title={`Slide: ${clampedSlideElapsed.toFixed(1)}s / ${currentSlideDuration}s | Total: ${formatMmSs(totalElapsedSeconds)} / ${formatMmSs(totalSeconds)}`}
                >
                    <div className="review-timer-top">
                        <span className="review-timer-indicator">
                            {playing ? '⏱️' : '⏳'} {playing ? `${clampedSlideElapsed.toFixed(1)}s` : `${currentSlideDuration}s`}
                            <span className="review-timer-denom"> / {currentSlideDuration}s</span>
                        </span>
                        <span className="review-timer-total">
                            {formatMmSs(totalElapsedSeconds)}
                        </span>
                    </div>
                    <div className="review-timer-bar-wrap">
                        <div
                            className="review-timer-bar"
                            style={{
                                width: `${Math.min(100, (clampedSlideElapsed / currentSlideDuration) * 100)}%`
                            }}
                        />
                    </div>
                </div>

                <button
                    className={`review-play-btn ${playing ? 'is-playing' : ''}`}
                    onClick={() => {
                        if (playing) {
                            stopTimer();
                        } else {
                            startAtCurrentSlide();
                        }
                    }}
                    title={playing ? 'Stop timer (or press Escape)' : `Start running timer at slide ${stepper.globalIndex + 1} (or press P)`}
                >
                    {playing ? '⏹ Stop timer' : `▶ Start timer at slide ${stepper.globalIndex + 1}`}
                </button>

                <label
                    className="review-autorun-label"
                    title="Automatically start running the timer immediately upon choosing a slide"
                >
                    <input
                        type="checkbox"
                        checked={autoStartOnSelect}
                        onChange={e => setAutoStartOnSelect(e.target.checked)}
                    />
                    Auto-run
                </label>

                <button
                    onClick={() => setPinned(p => !p)}
                    className={pinned ? 'is-active' : ''}
                    title={pinned ? 'Controls pinned (click to auto-hide when idle)' : 'Pin controls visible so they do not hide'}
                >
                    {pinned ? '📌 Pinned' : '📍 Pin'}
                </button>

                <button
                    onClick={() => setNotes(n => !n)}
                    className={notes ? 'is-active' : ''}
                    aria-expanded={notes}
                    title="Toggle narration notes (N)"
                >
                    Narration
                </button>
            </div>
        </nav>}
        {notes && !clean && <aside className="review-narration" aria-label="Current narration">
            <p>{chapter.narrations[cursor.step]}</p>
            <p>Slide {stepper.globalIndex + 1}/{stepper.totalGlobal} · {chapter.title} · beat {cursor.step + 1}/{chapter.narrations.length} · {chapter.durations[cursor.step]}s. Silent preview; the live demo requires actual operation. Voice is selected at the audio checkpoint.</p>
        </aside>}
        <p className="sr-only" aria-live="polite">{chapter.narrations[cursor.step]}</p>
    </>;
}
