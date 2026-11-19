import { useEffect, useRef, type CSSProperties } from "react";
import { CORES_MURO } from "../../data/crew";
import "./muro.css";

/*
 * O fundo do cardápio é o muro da fachada: reboco escuro, emendas das placas
 * e as garrafinhas pintadas a spray flutuando em duas profundidades (parallax).
 * As garrafas se repetem a cada tela, então o efeito não acaba nunca.
 */


type G = { x: number; y: number; s: number; r: number; c: string; t: number };

// posições fixas (geradas uma vez) para o desenho não "pular" a cada visita
function seeded(n: number, seed: number, near: boolean): G[] {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: n }, (_, i) => {
    // mais nas bordas que no meio, onde fica o texto
    const side = i % 2 === 0;
    const edge = rnd() * 0.24;
    const x = side ? edge * 100 : (1 - edge) * 100;
    return {
      x: rnd() < 0.18 ? 30 + rnd() * 40 : x,
      y: (i / n) * 100 + rnd() * (100 / n),
      s: near ? 38 + rnd() * 26 : 22 + rnd() * 16,
      r: -50 + rnd() * 100,
      c: CORES_MURO[Math.floor(rnd() * CORES_MURO.length)],
      t: 6 + rnd() * 6,
    };
  });
}

const FAR = seeded(9, 11, false);
const NEAR = seeded(5, 29, true);

function Garrafas({ list }: { list: G[] }) {
  // duas cópias empilhadas: quando a primeira sai da tela, a segunda está no mesmo lugar
  return (
    <>
      {[0, 1].map((copy) =>
        list.map((g, i) => (
          <i
            key={`${copy}-${i}`}
            className="garrafa"
            style={
              {
                left: `${g.x}%`,
                top: `${(g.y + copy * 100) / 2}%`,
                width: `${g.s}px`,
                "--r": `${g.r}deg`,
                "--c": g.c,
                "--t": `${g.t}s`,
                "--d": `${-i * 1.7}s`,
              } as CSSProperties
            }
          />
        )),
      )}
    </>
  );
}

export function Muro() {
  const box = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const h = box.current?.clientHeight || window.innerHeight;
      const y = window.scrollY;
      if (far.current) far.current.style.transform = `translate3d(0, ${-((y * 0.1) % h)}px, 0)`;
      if (near.current) near.current.style.transform = `translate3d(0, ${-((y * 0.28) % h)}px, 0)`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="muro" ref={box} aria-hidden="true">
      <div className="muro__layer muro__layer--far" ref={far}>
        <Garrafas list={FAR} />
      </div>
      <div className="muro__layer muro__layer--near" ref={near}>
        <Garrafas list={NEAR} />
      </div>
    </div>
  );
}

/** Uma garrafinha avulsa (para enfeitar cabeçalhos e transições). */
export function Garrafa({ c, className = "", style }: { c: string; className?: string; style?: CSSProperties }) {
  return <i className={`garrafa garrafa--solta ${className}`} style={{ "--c": c, ...style } as CSSProperties} aria-hidden="true" />;
}
