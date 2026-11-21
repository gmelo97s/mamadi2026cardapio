import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Crew, CrewFx } from "../../data/crew";
import { itemById } from "../../data/menu";
import { haptic, originOf, prefersReducedMotion, useUI } from "../../lib/ui";
import { Boneco } from "./Boneco";
import "./muro.css";

/** Efeitos que deixam o personagem "vivo": espuma, som, gole, brilho. */
function Fx({ fx }: { fx: CrewFx }) {
  if (fx.k === "espuma")
    return (
      <span className="fx-espuma" style={{ left: `${fx.x}%`, top: `${fx.y}%` } as CSSProperties}>
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ "--i": i, "--dx": `${((i * 37) % 13) - 6}px` } as CSSProperties} />
        ))}
      </span>
    );
  if (fx.k === "som")
    return (
      <span className="fx-som" style={{ left: `${fx.x}%`, top: `${fx.y}%` } as CSSProperties}>
        <i />
        <i />
        <i />
        <b className="fx-nota">♪</b>
        <b className="fx-nota fx-nota--2">♫</b>
      </span>
    );
  if (fx.k === "gole")
    return (
      <span className="fx-gole">
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} style={{ "--x1": fx.x1, "--y1": fx.y1, "--x2": fx.x2, "--y2": fx.y2, "--i": i } as CSSProperties} />
        ))}
      </span>
    );
  if (fx.k === "brilho")
    return (
      <span className="fx-brilho" style={{ left: `${fx.x}%`, top: `${fx.y}%`, width: `${fx.w}%` } as CSSProperties}>
        <i />
      </span>
    );
  return (
    <span className="fx-faisca" style={{ left: `${fx.x}%`, top: `${fx.y}%` } as CSSProperties}>
      ✦
    </span>
  );
}

/** Barrinhas de atributo, como na tela de escolher personagem. */
export function Stats({ stats }: { stats: [string, number][] }) {
  return (
    <span className="stats">
      {stats.map(([k, v]) => (
        <span key={k} className="stat">
          <span className="stat__k">{k}</span>
          <span className="stat__bar" style={{ "--v": v } as CSSProperties} aria-label={`${v} de 10`}>
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} className={i < v ? "is-on" : ""} />
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * O "dono" da categoria, como um boneco animado que chega andando quando a seção aparece.
 * O dono da seção anterior entra junto e sai andando para o outro lado: os dois batem a mão
 * no meio do caminho e quem chegou agradece. Depois ele respira, balança a cabeça e, ao toque,
 * dá a dica da casa.
 */
export function Dono({ crew, prev, lado = 1, className = "" }: { crew: Crew; prev?: Crew; lado?: 1 | -1; className?: string }) {
  const ui = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [live, setLive] = useState(false);
  const [talk, setTalk] = useState(false);
  const [jump, setJump] = useState(0);
  // quem passou a vez sai de cena de vez quando termina de andar
  const [saiu, setSaiu] = useState(false);
  const pick = itemById.get(crew.pick);

  // chega quando a seção aparece; anima só enquanto está na tela (poupa bateria)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting);
        if (e.isIntersecting && e.intersectionRatio > 0.25) setSeen(true);
      },
      { threshold: [0, 0.25, 0.5], rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // a fala some sozinha, ou ao tocar fora
  useEffect(() => {
    if (!talk) return;
    const t = window.setTimeout(() => setTalk(false), 9000);
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setTalk(false);
    };
    window.addEventListener("pointerdown", away);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", away);
    };
  }, [talk]);

  const quiet = prefersReducedMotion();
  const style = {
    "--cor": crew.cor,
    "--beat": `${crew.beat ?? 3}s`,
    "--ar": `${crew.w} / ${crew.h}`,
    "--hw": crew.h / crew.w,
    "--lado": lado,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`dono dono--${crew.id}${lado < 0 ? " dono--esq" : ""}${prev && !quiet ? " dono--vez" : ""}${seen ? " is-in" : ""}${live ? " is-live" : ""}${talk ? " is-talking" : ""}${quiet ? " is-quieto" : ""} ${className}`}
      style={style}
    >
      <span className="dono__spray" aria-hidden="true" />
      {prev && !quiet && !saiu && (
        <span
          className="dono__convidado"
          style={{ "--ar": `${prev.w} / ${prev.h}`, "--hw": prev.h / prev.w, "--beat": `${prev.beat ?? 3}s` } as CSSProperties}
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.animationName === "convidado-sai") setSaiu(true);
          }}
        >
          <span className="dono__passo">
            <Boneco crew={prev} />
          </span>
        </span>
      )}
      {prev && !quiet && !saiu && (
        <span className="dono__toque" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <b>PÁ!</b>
        </span>
      )}
      <button
        className="dono__fig"
        aria-label={`${crew.nome}, ${crew.manda}. Tocar para ver a dica.`}
        aria-expanded={talk}
        onClick={() => {
          haptic(10);
          setJump((n) => n + 1);
          setTalk((v) => !v);
        }}
      >
        <span className="dono__anda">
          <span className="dono__passo">
            <span key={jump} className={`dono__hop${jump ? " is-jump" : ""}`}>
              <span className="dono__body">
                <Boneco crew={crew} className="dono__img" />
                {live && crew.fx?.map((f, i) => <Fx key={i} fx={f} />)}
              </span>
            </span>
          </span>
        </span>
      </button>
      <span className="dono__plate" aria-hidden="true">
        <b>{crew.nome}</b>
        <small>{crew.manda}</small>
      </span>
      {seen && !quiet && (
        <span className="dono__oi" aria-hidden="true">
          {prev ? `Valeu, ${prev.nome}! Agora é comigo.` : "Bora começar? A primeira é comigo."}
        </span>
      )}
      {talk && (
        <div className="fala" role="status">
          <p className="fala__who">
            <b>{crew.nome}</b> <small>{crew.manda}</small>
          </p>
          <p className="fala__txt">“{crew.fala}”</p>
          <Stats stats={crew.stats} />
          {pick && (
            <button
              className="fala__pick"
              onClick={(e) => {
                haptic(6);
                setTalk(false);
                ui.openItem(pick.id, originOf(e.currentTarget));
              }}
            >
              <span>Pedido da casa</span>
              <strong>{pick.name} →</strong>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
