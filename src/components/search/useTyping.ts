import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../../lib/ui";

/** Texto que se digita e se apaga sozinho (placeholder vivo da busca). */
export function useTyping(phrases: string[], active = true) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active || prefersReducedMotion() || !phrases.length) return;
    let i = 0;
    let n = 0;
    let deleting = false;
    let t = 0;
    const tick = () => {
      const p = phrases[i % phrases.length];
      if (!deleting) {
        n++;
        setText(p.slice(0, n));
        if (n >= p.length) {
          deleting = true;
          t = window.setTimeout(tick, 1600);
          return;
        }
        t = window.setTimeout(tick, 55 + Math.random() * 60);
      } else {
        n--;
        setText(p.slice(0, Math.max(0, n)));
        if (n <= 0) {
          deleting = false;
          i++;
          t = window.setTimeout(tick, 380);
          return;
        }
        t = window.setTimeout(tick, 26);
      }
    };
    t = window.setTimeout(tick, 500);
    return () => window.clearTimeout(t);
  }, [active, phrases]);
  return text;
}
