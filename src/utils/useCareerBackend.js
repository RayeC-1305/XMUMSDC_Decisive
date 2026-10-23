import { useEffect, useMemo, useState } from "react";
import { apiRequest, transitionRequest, adaptTransition } from "./careerApi";

export default function useCareerBackend(state, setState) {
  const requestKey = state.profile ? JSON.stringify(transitionRequest(state)) : null;
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!requestKey) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort("timeout"), 30000);
    setError("");
    apiRequest("/transition", { body: JSON.parse(requestKey), signal: controller.signal })
      .then(adaptTransition)
      .then(data => {
        if (controller.signal.aborted) return;
        setResponse({ key: requestKey, data });
        setState(previous => {
          if (!previous.profile || JSON.stringify(transitionRequest(previous)) !== requestKey) return previous;
          return { ...previous, signals: data.signals,
            evidenceFeed: { ...data.evidence, sources: undefined, count: data.evidence.sources.length, url: data.evidence.sourceUrl },
          };
        });
      })
      .catch(failure => {
        if (controller.signal.aborted && controller.signal.reason !== "timeout") return;
        setError(controller.signal.reason === "timeout" ? "Updating your plan took too long. Please try again." : failure.message);
      })
      .finally(() => clearTimeout(timer));
    return () => { controller.abort(); clearTimeout(timer); };
  }, [requestKey, retry, setState]);
  const current = response?.key === requestKey ? response.data : null;
  return useMemo(() => ({ data: current, error, loading: Boolean(requestKey && !current && !error), retry: () => { setResponse(null); setRetry(value => value + 1); } }), [current, error, requestKey]);
}
