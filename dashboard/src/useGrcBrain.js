import { useState, useCallback, useRef, useEffect } from "react";

const SESSION_ID = `dd-${Math.random().toString(36).slice(2, 10)}`;
export const INSIGHT_CACHE = {};

export function useGrcChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef([]);

  const ask = useCallback(async (question) => {
    setLoading(true);
    const userMsg = { role: "user", content: question };
    historyRef.current = [...historyRef.current, userMsg];
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await fetch("/grc/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          session_id: SESSION_ID,
          conversation_history: historyRef.current.slice(-6),
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Brain returned ${res.status}: ${text.slice(0, 120)}`);
      }
      const data = await res.json();
      const answer = {
        role: "assistant",
        content: data.answer ?? "(no response)",
        sources: data.sources ?? [],
        confidence: data.confidence ?? 0,
      };
      historyRef.current = [...historyRef.current, { role: "assistant", content: data.answer }];
      setMessages((m) => [...m, answer]);
      return answer;
    } catch (err) {
      const errMsg = {
        role: "assistant",
        content: `GRC Brain unavailable: ${err.message}`,
        sources: [],
        confidence: 0,
      };
      setMessages((m) => [...m, errMsg]);
      return errMsg;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    historyRef.current = [];
  }, []);

  return { messages, loading, ask, reset };
}

export function useGrcInsight(cacheKey, prompt) {
  const [state, setState] = useState({ text: null, sources: [], confidence: 0, loading: false });
  const abortRef = useRef(null);

  useEffect(() => {
    if (!cacheKey || !prompt) return;

    if (INSIGHT_CACHE[cacheKey]) {
      setState({ ...INSIGHT_CACHE[cacheKey], loading: false });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    const timer = setTimeout(() => {
      fetch("/grc/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, session_id: `insight-${cacheKey}` }),
        signal,
      })
        .then((r) => {
          if (!r.ok) throw new Error(`Brain returned ${r.status}`);
          return r.json();
        })
        .then((d) => {
          const result = { text: d.answer, sources: d.sources ?? [], confidence: d.confidence ?? 0 };
          INSIGHT_CACHE[cacheKey] = result;
          setState({ ...result, loading: false });
        })
        .catch((e) => {
          if (e.name !== "AbortError") setState((s) => ({ ...s, loading: false }));
        });
    }, 700);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [cacheKey, prompt]);

  return state;
}

export function useBrainStatus() {
  const [connected, setConnected] = useState(null);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/grc/ready", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setConnected(d.status === "ready"))
      .catch(() => setConnected(false));
    return () => ctrl.abort();
  }, []);
  return connected;
}
