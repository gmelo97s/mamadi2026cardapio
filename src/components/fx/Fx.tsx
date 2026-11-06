/*
 * Efeitos de transição (o equivalente das folhas do Botanikafe):
 *  - FizzLayer: bolhas de cerveja que sobem e estouram a partir de um toque
 *  - FlyLayer: rodelas de limão e cubos de gelo que cruzam a tela ao entrar em "Beber"
 *  - Glitter: brilhos rosa nas Divas
 * Tudo em CSS (transform/opacity), poucas peças e rápidas.
 */
import { useState, type CSSProperties } from "react";
import { Brilho, Cubo, Limao } from "../art/Decor";
import type { Burst, Sprite } from "./useFx";
import "./fx.css";

export function FizzLayer({ bursts }: { bursts: Burst[] }) {
  return (
    <div className="fx-layer" aria-hidden="true">
      {bursts.map((b) =>
        b.bubbles.map((p, i) => (
          <span
            key={`${b.id}-${i}`}
            className={`fizz fizz--${b.tone}`}
            style={
              {
                left: b.x,
                top: b.y,
                width: p.s,
                height: p.s,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animationDelay: `${p.d}ms`,
                animationDuration: `${p.t}ms`,
              } as CSSProperties
            }
          />
        )),
      )}
    </div>
  );
}

export function FlyLayer({ sprites }: { sprites: Sprite[] }) {
  return (
    <div className="fx-layer" aria-hidden="true">
      {sprites.map((s) => (s.kind === "limao" ? <Limao key={s.id} className="fly" style={s.style} /> : <Cubo key={s.id} className="fly" style={s.style} />))}
    </div>
  );
}

/** Brilhos que piscam dentro de um bloco (posição relativa ao pai). */
export function Glitter({ count = 14, color = "#ff9fd9" }: { count?: number; color?: string }) {
  const [pts] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 6 + Math.random() * 12,
      delay: `${(i * 0.37) % 3}s`,
      dur: `${2.2 + Math.random() * 2}s`,
    })),
  );
  return (
    <div className="glitter" aria-hidden="true">
      {pts.map((p, i) => (
        <Brilho
          key={i}
          color={i % 3 ? color : "#fff"}
          className="glitter__pt"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.dur }}
        />
      ))}
    </div>
  );
}
