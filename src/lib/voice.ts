import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/* Reconhecimento de voz do navegador (Chrome/Android, Safari/iPhone, Edge), em português. */

interface SRResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface SREvent {
  resultIndex: number;
  results: ArrayLike<SRResult>;
}
interface SR {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SRCtor = new () => SR;

function getCtor(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const voiceSupported = () => !!getCtor();

export type VoiceState = "idle" | "listening" | "denied" | "error" | "nomatch";

export function useVoice(onText: (text: string, final: boolean) => void) {
  const [state, setState] = useState<VoiceState>("idle");
  const rec = useRef<SR | null>(null);
  const cb = useRef(onText);
  useLayoutEffect(() => {
    cb.current = onText;
  });
  const gotText = useRef(false);

  const stop = useCallback(() => {
    try {
      rec.current?.stop();
    } catch {
      /* ok */
    }
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) {
      setState("error");
      return;
    }
    try {
      rec.current?.abort();
    } catch {
      /* ok */
    }
    const r = new Ctor();
    r.lang = "pt-BR";
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;
    gotText.current = false;
    r.onstart = () => setState("listening");
    r.onresult = (e) => {
      let text = "";
      let final = false;
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) final = true;
      }
      gotText.current = true;
      cb.current(text.trim(), final);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setState("denied");
      else if (e.error === "no-speech") setState("nomatch");
      else if (e.error !== "aborted") setState("error");
    };
    r.onend = () => {
      rec.current = null;
      setState((s) => (s === "listening" ? (gotText.current ? "idle" : "nomatch") : s));
    };
    rec.current = r;
    try {
      r.start();
      setState("listening");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(
    () => () => {
      try {
        rec.current?.abort();
      } catch {
        /* ok */
      }
    },
    [],
  );

  return { state, start, stop, setState };
}
