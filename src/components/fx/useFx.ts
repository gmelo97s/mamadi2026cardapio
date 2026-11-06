import { useCallback, useState, type CSSProperties } from "react";
import { prefersReducedMotion, type Origin } from "../../lib/ui";

export type Tone = "beer" | "pink" | "lime";
export interface Burst {
  id: number;
  x: number;
  y: number;
  tone: Tone;
  bubbles: { dx: number; dy: number; s: number; d: number; t: number }[];
}
export interface Sprite {
  id: string;
  kind: "limao" | "cubo";
  style: CSSProperties;
}

let seq = 0;

/** Bolhas que sobem e estouram a partir de um toque. */
export function useFizz() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const fizz = useCallback((o: Origin, opts?: { count?: number; tone?: Tone }) => {
    if (prefersReducedMotion()) return;
    const count = opts?.count ?? 10;
    const id = ++seq;
    const bubbles = Array.from({ length: count }, () => ({
      dx: (Math.random() - 0.5) * 90,
      dy: -(60 + Math.random() * 120),
      s: 5 + Math.random() * 11,
      d: Math.random() * 120,
      t: 520 + Math.random() * 420,
    }));
    setBursts((b) => [...b, { id, x: o.x, y: o.y, tone: opts?.tone ?? "beer", bubbles }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1300);
  }, []);
  return { bursts, fizz };
}

/** Rodelas de limão e cubos de gelo cruzando a tela (ao entrar em "Beber"). */
export function useFlyover() {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const fly = useCallback(() => {
    if (prefersReducedMotion()) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const id = ++seq;
    const kinds: Sprite["kind"][] = ["limao", "cubo", "limao"];
    setSprites(
      kinds.map((kind, i) => {
        const size = kind === "limao" ? 54 + Math.random() * 26 : 38 + Math.random() * 16;
        return {
          id: `${id}-${i}`,
          kind,
          style: {
            width: size,
            height: size,
            "--fx": `${-size - Math.random() * 40}px`,
            "--fy": `${h * (0.45 + Math.random() * 0.4)}px`,
            "--tx": `${w + size + Math.random() * 60}px`,
            "--ty": `${h * (0.05 + Math.random() * 0.35)}px`,
            "--rot": `${(Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 240)}deg`,
            animationDelay: `${i * 90 + Math.random() * 80}ms`,
            animationDuration: `${900 + Math.random() * 300}ms`,
          } as CSSProperties,
        };
      }),
    );
    window.setTimeout(() => setSprites((s) => (s[0]?.id.startsWith(`${id}-`) ? [] : s)), 1700);
  }, []);
  return { sprites, fly };
}
