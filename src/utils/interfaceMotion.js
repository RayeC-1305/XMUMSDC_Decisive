import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

let currentTransition;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Short, interruptible visual continuity; application updates never wait for animation.
export function transitionInterface(update, kind = "workspace") {
  if (
    !document.startViewTransition ||
    document.visibilityState === "hidden" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  currentTransition?.skipTransition();
  document.documentElement.dataset.nexusTransition = kind;
  const transition = document.startViewTransition(() => flushSync(update));
  currentTransition = transition;
  transition.finished
    .catch(() => {})
    .finally(() => {
      if (currentTransition === transition) {
        currentTransition = null;
        delete document.documentElement.dataset.nexusTransition;
      }
    });
  return transition;
}

export function afterInterfaceUpdate(transition, action) {
  const run = () => requestAnimationFrame(action);
  if (transition) transition.updateCallbackDone.then(run, () => {});
  else run();
}

export function useWorkspaceEntrance(ref, view, ready) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || !element.animate || currentTransition) return;
    const animation = element.animate(
      [
        {
          opacity: 0.45,
          transform: "translateY(12px)",
          clipPath: "inset(0 0 3% 0)",
        },
        { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0 0)" },
      ],
      { duration: 340, easing: "cubic-bezier(.16,1,.3,1)" },
    );
    return () => animation.cancel();
  }, [ref, view, ready, reduced]);
}
