import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Crew, CrewFx } from "../../data/crew";
import { itemById } from "../../data/menu";
import { haptic, originOf, useUI } from "../../lib/ui";
import { Burgao } from "./Burgao";
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
          <i
            key={i}
            style={
              {
                "--x1": fx.x1,
                "--y1": fx.y1,
                "--x2": fx.x2,
                "--y2": fx.y2,
                "--i": i,
              } as CSSProperties
            }
          />
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
 * O "dono" da categoria: o adesivo do personagem atrás do título, que entra como
 * num jogo de rua dos anos 2000, respira, balança e, ao toque, dá a dica da casa.
 */
export function Dono({ crew, className = "" }: { crew: Crew; className?: string }) {
  const ui = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [live, setLive] = useState(false);
  const [talk, setTalk] = useState(false);
  const [jump, setJump] = useState(0);
  const pick = itemById.get(crew.pick);

  // entra quando aparece; anima só enquanto está na tela (poupa bateria)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting);
        if (e.isIntersecting && e.intersectionRatio > 0.3) setSeen(true);
      },
      { threshold: [0, 0.3, 0.6], rootMargin: "0px 0px -8% 0px" },
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

  const style = {
    "--cor": crew.cor,
    "--beat": `${crew.beat ?? 3}s`,
    "--ar": `${crew.w} / ${crew.h}`,
    "--hw": crew.h / crew.w,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`dono dono--${crew.id}${seen ? " is-in" : ""}${live ? " is-live" : ""}${talk ? " is-talking" : ""} ${className}`}
      style={style}
    >
      <span className="dono__spray" aria-hidden="true" />
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
        <span key={jump} className={`dono__hop${jump ? " is-jump" : ""}`}>
          <span className="dono__body">
            {crew.id === "burgao" ? (
              <Burgao className="dono__img" />
            ) : (
              <img className="dono__img" src={crew.img} width={crew.w} height={crew.h} alt="" loading="lazy" decoding="async" draggable={false} />
            )}
            {live && crew.fx?.map((f, i) => <Fx key={i} fx={f} />)}
          </span>
        </span>
      </button>
      <span className="dono__plate" aria-hidden="true">
        <b>{crew.nome}</b>
        <small>{crew.manda}</small>
      </span>
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
