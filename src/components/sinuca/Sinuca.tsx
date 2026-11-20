import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CREW, crewById } from "../../data/crew";
import type { Item } from "../../data/types";
import { brl } from "../../lib/format";
import { haptic, prefersReducedMotion, useUI } from "../../lib/ui";
import { shotSpeed, Slingshot } from "../../pool3d/aim";
import { FrameGovernor, PoolScene } from "../../pool3d/scene";
import { Sim, type SimBall } from "../../pool3d/sim";
import { IcSeta, IcX } from "../chrome/icons";
import { ArtTile, Price } from "../menu/bits";
import { Burgao } from "../muro/Burgao";
import { addRound, CAPS, DEFAULT_AVATARS, DEFAULT_NAMES, drawDrink, newMatch, pendingDraw, reel, rerack, resolveShot, seatOf, tab, type MatchState, type Setup, type Team } from "./match";
import "./sinuca.css";

const lockScroll = () => document.body.classList.add("is-locked");
const unlockScroll = () => document.body.classList.remove("is-locked");

/** detalhe curto do drink sorteado (tamanho ou o começo da descrição) */
function detailLine(it: Item) {
  if (it.unit) return it.unit;
  return it.desc ? it.desc.split(/[.·]/)[0] : "";
}

/** o personagem do muro que representa cada lado */
function Avatar({ id, className = "" }: { id: string; className?: string }) {
  const c = crewById.get(id) ?? CREW[0];
  return (
    <span className={`sn-av ${className}`} style={{ "--cor": c.cor, "--ar": `${c.w} / ${c.h}` } as CSSProperties}>
      {c.id === "burgao" ? <Burgao /> : <img src={c.mini} alt="" draggable={false} />}
    </span>
  );
}

/** escolha de personagem, como nos jogos de rua: setinhas para os lados */
function Pick({ id, onChange, side }: { id: string; onChange: (id: string) => void; side: Team }) {
  const i = Math.max(0, CREW.findIndex((c) => c.id === id));
  const c = CREW[i];
  const go = (d: number) => {
    haptic(5);
    onChange(CREW[(i + d + CREW.length) % CREW.length].id);
  };
  return (
    <div className={`sn-pick sn-pick--${side}`} style={{ "--cor": c.cor } as CSSProperties}>
      <button className="sn-pick__arrow" onClick={() => go(-1)} aria-label="Personagem anterior">
        ◀
      </button>
      <span className="sn-pick__who" key={c.id}>
        <Avatar id={c.id} className="sn-pick__av" />
        <span className="sn-pick__name">{c.nome}</span>
      </span>
      <button className="sn-pick__arrow" onClick={() => go(1)} aria-label="Próximo personagem">
        ▶
      </button>
    </div>
  );
}

/** a tela de "VS" quando a partida começa */
function Versus({ setup, names }: { setup: Setup; names: [string, string] }) {
  return (
    <div className="sn-vs" aria-hidden="true">
      {([0, 1] as const).map((t) => (
        <div key={t} className={`sn-vs__side sn-vs__side--${t}`}>
          <Avatar id={setup.avatars[t]} className="sn-vs__av" />
          <span className="sn-vs__name">{names[t]}</span>
        </div>
      ))}
      <span className="sn-vs__vs">VS</span>
    </div>
  );
}

/*
 * Sinuca valendo drink: 1 × 1 ou 2 × 2 no mesmo celular. Puxa o taco para trás e solta.
 * A cada 2 bolas de um lado, a roleta sorteia uma bebida do cardápio e o outro lado paga.
 * A partida fica guardada enquanto o cardápio estiver aberto (dá para fechar, pedir e voltar).
 */
let saved: { match: MatchState; sim: Sim } | null = null;

type Stage = "setup" | "play" | "draw" | "over";
interface Drawn {
  winner: Team;
  item: Item;
  strip: Item[];
  n: number;
  done: boolean;
}
interface Live {
  stage: Stage;
  busy: boolean;
  moving: boolean;
  aim: { dx: number; dz: number; power: number; held: boolean };
  strike: { t: number; dx: number; dz: number; power: number } | null;
  cueIn: number;
  fade: number;
  /** as bolas antes da tacada (se fechar no meio, a tacada não vale) */
  before: SimBall[] | null;
}

const ROW = 62; // altura de cada nome na roleta (igual ao CSS)

/** A roleta: os nomes passam e param no sorteado. */
function Roulette({ strip, onDone }: { strip: Item[]; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });
  useEffect(() => {
    const el = ref.current!;
    const end = `translateY(${-(strip.length - 1) * ROW}px)`;
    if (prefersReducedMotion() || !el.animate) {
      el.style.transform = end;
      const t = window.setTimeout(() => done.current(), 300);
      return () => window.clearTimeout(t);
    }
    const anim = el.animate([{ transform: "translateY(0)" }, { transform: end }], { duration: 2700, easing: "cubic-bezier(.1,.7,.1,1)", fill: "forwards" });
    // tique-tique enquanto gira
    const ticks = [0, 90, 190, 300, 430, 590, 790, 1040, 1380, 1850].map((ms) => window.setTimeout(() => haptic(4), ms));
    const t = window.setTimeout(() => {
      haptic([18, 40, 26]);
      done.current();
    }, 2750);
    return () => {
      anim.cancel();
      ticks.forEach(clearTimeout);
      window.clearTimeout(t);
    };
  }, [strip]);
  return (
    <div className="reel" aria-hidden="true">
      <div className="reel__strip" ref={ref}>
        {strip.map((it, i) => (
          <span key={i} className="reel__row display">
            {it.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Sinuca({ onClose }: { onClose: () => void }) {
  const ui = useUI();
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStageState] = useState<Stage>(saved ? "play" : "setup");
  const [match, setMatchState] = useState<MatchState | null>(saved?.match ?? null);
  const [form, setForm] = useState<Setup>(saved?.match.setup ?? { players: 2, names: ["", ""], avatars: DEFAULT_AVATARS, cap: 3000 });
  const [vs, setVs] = useState(0);
  const [power, setPower] = useState(0);
  const [busy, setBusyState] = useState(false);
  const [flash, setFlash] = useState<{ text: string; tone: "good" | "bad" | "plain"; n: number } | null>(null);
  const [drawn, setDrawn] = useState<Drawn | null>(null);
  const [tabOpen, setTabOpen] = useState(false);
  const [noGL, setNoGL] = useState(false);
  /** bolas numeradas ainda na mesa */
  const [left, setLeft] = useState(saved?.sim.remaining ?? 15);

  const matchRef = useRef(match);
  const live = useRef<Live>({ stage, busy: false, moving: false, aim: { dx: 0, dz: -1, power: 0, held: false }, strike: null, cueIn: 0, fade: 0, before: null });
  const eng = useRef<{ scene: PoolScene; sim: Sim; sling: Slingshot; wake: () => void } | null>(null);
  const onStop = useRef(() => {});
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const setStage = useCallback((s: Stage) => {
    live.current.stage = s;
    setStageState(s);
    eng.current?.wake();
  }, []);
  const setBusy = useCallback((b: boolean) => {
    live.current.busy = b;
    setBusyState(b);
  }, []);
  const commit = useCallback((m: MatchState | null) => {
    matchRef.current = m;
    setMatchState(m);
    saved = m && eng.current ? { match: m, sim: eng.current.sim } : null;
  }, []);

  /** mira parada: aponta para a bola mais perto da branca */
  const aimDefault = useCallback(() => {
    const e = eng.current;
    if (!e) return;
    const c = e.sim.cue;
    let best = Infinity;
    let dx = 0;
    let dz = -1;
    for (const b of e.sim.balls) {
      if (b.n === 0 || b.pocket >= 0) continue;
      const d = Math.hypot(b.x - c.x, b.z - c.z);
      if (d < best) {
        best = d;
        dx = (b.x - c.x) / d;
        dz = (b.z - c.z) / d;
      }
    }
    live.current.aim = { dx, dz, power: 0, held: false };
    live.current.cueIn = 0;
  }, []);

  const nameIn = (s: Setup, t: Team) => s.names[t].trim() || DEFAULT_NAMES[s.players][t];
  const nameOf = (t: Team) => nameIn(match?.setup ?? form, t);

  const startDraw = useCallback(
    (winner: Team) => {
      const m = matchRef.current;
      if (!m) return;
      const item = drawDrink(
        m.setup.cap,
        m.rounds.map((r) => r.item.id),
      );
      commit(addRound(m, winner, item));
      setDrawn({ winner, item, strip: reel(m.setup.cap, item), n: Date.now(), done: false });
      setStage("draw");
    },
    [commit, setStage],
  );

  // só no desenvolvimento: atalho para gravar o vídeo de apresentação (sorteio sem esperar as bolas)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    (window as unknown as { __sinucaDemo?: (t: Team) => void }).__sinucaDemo = (t) => startDraw(t);
  }, [startDraw]);

  // fim de uma tacada: as bolas pararam
  useEffect(() => {
    onStop.current = () => {
      const e = eng.current;
      const m = matchRef.current;
      if (!e || !m) return;
      const pocketed = e.sim.events.pocketed.slice();
      if (pocketed.includes(0)) {
        e.sim.respotCue();
        e.scene.syncBalls(e.sim);
      }
      const me = seatOf(m).team;
      const { next, result } = resolveShot(m, pocketed);
      commit(next);
      setLeft(e.sim.remaining);
      const other = nameIn(m.setup, (1 - me) as Team);
      if (result.foul) setFlash({ text: result.given ? `Falta! +${result.given} para ${other}` : "Falta! Branca na caçapa", tone: "bad", n: Date.now() });
      else if (result.made) setFlash({ text: result.eight ? `Bola 8! +${result.made}` : `+${result.made}`, tone: "good", n: Date.now() });
      else setFlash({ text: "Passou a vez", tone: "plain", n: Date.now() });
      aimDefault();
      const w = pendingDraw(next);
      if (w != null) {
        later(() => {
          setBusy(false);
          startDraw(w);
        }, 900);
      } else if (e.sim.remaining === 0) {
        later(() => {
          setBusy(false);
          setStage("over");
        }, 900);
      } else setBusy(false);
      e.wake();
    };
  });

  // a mesa 3D
  useEffect(() => {
    lockScroll();
    const cv = cvRef.current!;
    const ts = timers.current;
    const L = live.current;
    let off = () => {};
    // a mesa nasce no quadro seguinte: se o componente sair antes disso, nada chega a ser criado
    const boot = requestAnimationFrame(() => {
      let scene: PoolScene;
      try {
        scene = new PoolScene(cv, { room: false });
      } catch {
        setNoGL(true);
        return;
      }
      const sim = saved?.sim ?? new Sim();
      const gov = new FrameGovernor(scene);
      const margins = () => (cv.clientWidth > cv.clientHeight ? { top: 84, bottom: 150, side: 30 } : { top: 104, bottom: 138, side: 6 });
      scene.setLights(1, 1);
      scene.applyView(scene.playView(margins()));
      scene.syncBalls(sim);
      let raf = 0;
      let last = 0;
      let idle = 0;
      let clock = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        const dt = last ? Math.min(0.25, (now - last) / 1000) : 0;
        last = now;
        clock += dt;
        idle += dt;
        if (L.strike) {
          // o taco vai na bola
          const k = Math.min(1, (L.strike.t += dt) / 0.09);
          scene.setCue(true, sim, L.strike.dx, L.strike.dz, L.strike.power * (1 - k * k) - 0.02 * k, 1);
          scene.setGuide(null);
          if (k >= 1) {
            sim.shoot(L.strike.dx, L.strike.dz, shotSpeed(L.strike.power));
            L.strike = null;
            L.moving = true;
            L.fade = 1;
          }
          idle = 0;
        } else if (L.moving) {
          const still = !sim.step(dt);
          scene.syncBalls(sim);
          L.fade = Math.max(0, L.fade - dt * 3.2);
          scene.setCueAlpha(L.fade);
          idle = 0;
          if (still) {
            L.moving = false;
            L.before = null;
            onStop.current();
          }
        } else if (L.stage === "play" && !L.busy) {
          const a = L.aim;
          if (a.held) {
            scene.setCue(true, sim, a.dx, a.dz, a.power, 1);
            scene.setGuide(sim.predict(a.dx, a.dz), sim, a.power);
            idle = 0;
          } else {
            if (L.cueIn < 1) idle = 0;
            L.cueIn = Math.min(1, L.cueIn + dt * 4);
            scene.setCue(true, sim, a.dx, a.dz, 0.1, L.cueIn);
            scene.setGuide(sim.predict(a.dx, a.dz), sim, 0);
          }
        } else {
          scene.setCue(false);
          scene.setGuide(null);
        }
        scene.render(clock);
        if (idle < 0.3) gov.tick(dt);
        // nada mexendo: para de desenhar (bateria)
        if (idle > 0.5) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const wake = () => {
        idle = 0;
        if (!raf && !document.hidden) {
          last = 0;
          raf = requestAnimationFrame(loop);
        }
      };
      const sling = new Slingshot(cv, scene, {
        aim: (dx, dz, p) => {
          L.aim = { dx, dz, power: p, held: true };
          setPower(p);
          wake();
        },
        shoot: (dx, dz, p) => {
          L.aim = { dx, dz, power: 0, held: false };
          L.before = sim.balls.map((b) => ({ ...b }));
          L.strike = { t: 0, dx, dz, power: p };
          L.busy = true;
          setBusyState(true);
          setPower(0);
          haptic(p > 0.7 ? [14, 24, 10] : 9);
          wake();
        },
        cancel: () => {
          L.aim.held = false;
          setPower(0);
          wake();
        },
      });
      sling.enabled = L.stage === "play" && !L.busy;
      sim.onImpact = (i) => {
        if (i.kind === "pocket") haptic(12);
      };
      eng.current = { scene, sim, sling, wake };
      aimDefault();
      wake();
      // partida retomada com sorteio pendente (fechou a tela antes da roleta) ou com a mesa já limpa
      const m = matchRef.current;
      if (m) {
        const w = pendingDraw(m);
        if (w != null) startDraw(w);
        else if (sim.remaining === 0) setStage("over");
      }
      const onResize = () => {
        scene.resize();
        scene.applyView(scene.playView(margins()));
        wake();
      };
      const onVis = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else wake();
      };
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVis);
      off = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
        sim.onImpact = undefined;
        // fechou no meio de uma tacada: ela não vale, as bolas voltam para onde estavam
        if (L.before) {
          sim.balls = L.before;
          sim.events = { pocketed: [], firstHit: null };
        }
        L.before = null;
        L.strike = null;
        L.moving = false;
        L.busy = false;
        sling.dispose();
        scene.dispose();
        eng.current = null;
      };
    });
    return () => {
      cancelAnimationFrame(boot);
      unlockScroll();
      ts.forEach(clearTimeout);
      off();
    };
  }, [aimDefault, startDraw, setStage]);

  useEffect(() => {
    if (eng.current) eng.current.sling.enabled = stage === "play" && !busy;
  }, [stage, busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (tabOpen) setTabOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, tabOpen]);

  // ───────── ações ─────────
  const start = () => {
    haptic(10);
    const e = eng.current;
    if (e) {
      e.sim.rack();
      e.scene.syncBalls(e.sim);
      setLeft(15);
    }
    commit(newMatch({ ...form, names: [form.names[0].trim(), form.names[1].trim()] }));
    aimDefault();
    setStage("play");
    if (!prefersReducedMotion()) {
      setVs(Date.now());
      later(() => setVs(0), 1900);
    }
  };

  const afterDraw = (arrumar: boolean) => {
    haptic(8);
    const e = eng.current;
    let m = matchRef.current;
    if (arrumar && e && m) {
      e.sim.rack();
      e.scene.syncBalls(e.sim);
      setLeft(15);
      m = rerack(m);
      commit(m);
      aimDefault();
    }
    setDrawn(null);
    const w = m ? pendingDraw(m) : null;
    if (w != null) startDraw(w);
    else if (e && e.sim.remaining === 0) setStage("over");
    else setStage("play");
  };

  const reroll = () => {
    const m = matchRef.current;
    if (!m || !drawn) return;
    haptic(8);
    const item = drawDrink(
      m.setup.cap,
      m.rounds.map((r) => r.item.id),
    );
    commit({ ...m, rounds: [...m.rounds.slice(0, -1), { ...m.rounds[m.rounds.length - 1], item }] });
    setDrawn({ winner: drawn.winner, item, strip: reel(m.setup.cap, item), n: Date.now(), done: false });
  };

  /** mesma conta, mesa arrumada */
  const again = () => {
    const m = matchRef.current;
    const e = eng.current;
    if (!m || !e) return;
    haptic(10);
    e.sim.rack();
    e.scene.syncBalls(e.sim);
    setLeft(15);
    commit(rerack(m));
    aimDefault();
    setStage("play");
  };

  /** zera tudo e volta para a escolha de jogadores */
  const reset = () => {
    haptic(8);
    setTabOpen(false);
    setDrawn(null);
    commit(null);
    saved = null;
    const e = eng.current;
    if (e) {
      e.sim.rack();
      e.scene.syncBalls(e.sim);
      setLeft(15);
    }
    setStage("setup");
  };

  /** sem a mesa 3D: só o sorteio */
  const drawOnly = () => {
    haptic(10);
    const item = drawDrink(form.cap, drawn ? [drawn.item.id] : []);
    setDrawn({ winner: 0, item, strip: reel(form.cap, item), n: Date.now(), done: false });
  };

  const seat = match ? seatOf(match) : null;
  const owed = match ? tab(match) : ([0, 0] as [number, number]);
  /** ainda tem sorteio na fila (duas duplas de bolas na mesma tacada) */
  const more = !!match && pendingDraw(match) != null;
  const wins = (t: Team) => match?.rounds.filter((r) => r.winner === t).length ?? 0;

  return (
    <div className="sn" data-stage={stage} role="dialog" aria-modal="true" aria-label="Sinuca valendo drink">
      <canvas ref={cvRef} className="sn__gl" />
      <div className="sn__film" aria-hidden="true" />

      <button className="sn__x" onClick={onClose} aria-label="Fechar a sinuca">
        <IcX />
      </button>

      {noGL && (
        <div className="sn__panel sn__panel--solo">
          <p className="kicker">Sinuca valendo drink</p>
          <h2 className="display sn__h">Quem perdeu paga</h2>
          <p className="sn__lede">Este aparelho não abriu a mesa em 3D. Decidam no par ou ímpar e a roleta sorteia aqui o drink que quem perdeu paga.</p>
          <div className="sn__seg" role="radiogroup" aria-label="Valendo">
            {CAPS.map((c) => (
              <button key={c.label} role="radio" aria-checked={form.cap === c.cap} className={`sn__opt mono${form.cap === c.cap ? " is-on" : ""}`} onClick={() => setForm((f) => ({ ...f, cap: c.cap }))}>
                {c.label}
              </button>
            ))}
          </div>
          {drawn && (drawn.done ? <Prize item={drawn.item} /> : <Roulette key={drawn.n} strip={drawn.strip} onDone={() => setDrawn((d) => d && { ...d, done: true })} />)}
          <button className="btn btn--red sn__go" onClick={drawOnly}>
            {drawn ? "Sortear outra" : "Sortear o drink"}
          </button>
          {drawn?.done && (
            <button className="sn__link mono" onClick={() => ui.openItem(drawn.item.id)}>
              Ver no cardápio <IcSeta />
            </button>
          )}
        </div>
      )}

      {!noGL && stage === "setup" && (
        <div className="sn__panel">
          <p className="kicker">Sinuca do Mamadi · valendo drink</p>
          <h2 className="display sn__h">Quem perde paga</h2>
          <p className="sn__lede">Sinuca no celular, passando de mão em mão na mesa. A cada 2 bolas de um lado, a roleta sorteia uma bebida do cardápio e o outro lado paga.</p>

          <p className="sn__label mono">Escolha quem joga por você</p>
          <div className="sn__picks">
            {([0, 1] as const).map((t) => (
              <Pick
                key={t}
                side={t}
                id={form.avatars[t]}
                onChange={(id) => setForm((f) => ({ ...f, avatars: t === 0 ? [id, f.avatars[1]] : [f.avatars[0], id] }))}
              />
            ))}
            <span className="sn__picks-vs display" aria-hidden="true">
              VS
            </span>
          </div>

          <div className="sn__seg" role="radiogroup" aria-label="Quantos jogam">
            {([2, 4] as const).map((n) => (
              <button key={n} role="radio" aria-checked={form.players === n} className={`sn__opt display${form.players === n ? " is-on" : ""}`} onClick={() => setForm((f) => ({ ...f, players: n }))}>
                {n === 2 ? "1 × 1" : "2 × 2"}
                <small className="mono">{n === 2 ? "dois jogadores" : "duas duplas"}</small>
              </button>
            ))}
          </div>

          <div className="sn__names">
            {([0, 1] as const).map((t) => (
              <label key={t} className={`sn__field sn__field--${t}`}>
                <span className="sr-only">Nome do lado {t + 1}</span>
                <i className="sn__dot" aria-hidden="true" />
                <input
                  value={form.names[t]}
                  maxLength={14}
                  placeholder={DEFAULT_NAMES[form.players][t]}
                  autoComplete="off"
                  autoCapitalize="words"
                  enterKeyHint="done"
                  onChange={(e) => setForm((f) => ({ ...f, names: t === 0 ? [e.target.value, f.names[1]] : [f.names[0], e.target.value] }))}
                />
              </label>
            ))}
          </div>

          <p className="sn__label mono">O drink sorteado custa</p>
          <div className="sn__seg sn__seg--3" role="radiogroup" aria-label="Teto do preço do drink">
            {CAPS.map((c) => (
              <button key={c.label} role="radio" aria-checked={form.cap === c.cap} className={`sn__opt mono${form.cap === c.cap ? " is-on" : ""}`} onClick={() => setForm((f) => ({ ...f, cap: c.cap }))}>
                {c.label}
              </button>
            ))}
          </div>

          <button className="btn btn--red sn__go" onClick={start}>
            Começar <IcSeta />
          </button>
          <p className="sn__rules mono">Encaçapou, joga de novo · bola 8 vale 2 · branca na caçapa: as bolas da tacada vão para o outro lado</p>
        </div>
      )}

      {!noGL && match && stage !== "setup" && (
        <>
          <header className="sn__score">
            {([0, 1] as const).map((t) => (
              <div key={t} className={`sn__team sn__team--${t}${seat?.team === t && stage === "play" ? " is-turn" : ""}`}>
                <Avatar id={match.setup.avatars[t]} className="sn__team-av" />
                <span className="sn__name display">{nameOf(t)}</span>
                <span className="sn__pips" aria-label={`${match.points[t] % 2} de 2 bolas para o próximo drink`}>
                  <i className={match.points[t] % 2 >= 1 ? "is-on" : ""} />
                  <i />
                </span>
                <span className="sn__won mono">
                  {wins(t)} {wins(t) === 1 ? "drink ganho" : "drinks ganhos"}
                </span>
              </div>
            ))}
          </header>

          {flash && (
            <p key={flash.n} className={`sn__flash sn__flash--${flash.tone} display`} role="status">
              {flash.text}
            </p>
          )}

          <footer className="sn__bottom">
            <div className={`sn__turn sn__turn--${seat?.team ?? 0}`} key={`${match.turn}-${match.shots}`}>
              <span className="mono">{busy ? "na mesa" : "vez de"}</span>
              <strong className="display">
                {seat ? nameOf(seat.team) : ""}
                {match.setup.players === 4 && seat ? <small className="mono"> jogador {seat.n}</small> : null}
              </strong>
            </div>
            <button className="sn__tabbtn mono" onClick={() => setTabOpen(true)}>
              A conta{match.rounds.length ? ` (${match.rounds.length})` : ""}
            </button>
            <div className="sn__power" aria-hidden="true">
              <i style={{ transform: `scaleX(${power})` }} />
            </div>
            <p className="sn__hint mono">{busy ? "bolas rolando…" : power > 0 ? "solte para tacar" : "puxe para trás e solte"}</p>
          </footer>
        </>
      )}

      {!noGL && stage === "draw" && drawn && match && (
        <div className="sn__draw" role="dialog" aria-label="Sorteio do drink">
          <div className="sn__duelo" aria-hidden="true">
            <Avatar id={match.setup.avatars[drawn.winner]} className="sn__duelo-av is-win" />
            <Avatar id={match.setup.avatars[1 - drawn.winner]} className="sn__duelo-av is-pay" />
          </div>
          <p className="kicker">{nameOf(drawn.winner)} fez 2 bolas</p>
          <h3 className="display sn__payer">
            <span>{nameOf((1 - drawn.winner) as Team)}</span> paga
          </h3>
          {drawn.done ? <Prize item={drawn.item} /> : <Roulette key={drawn.n} strip={drawn.strip} onDone={() => setDrawn((d) => d && { ...d, done: true })} />}
          {drawn.done && (
            <div className="sn__after">
              <button className="btn btn--red sn__go" onClick={() => afterDraw(false)}>
                {more ? "Próximo sorteio" : left === 0 ? "Fechar a mesa" : "Seguir o jogo"} <IcSeta />
              </button>
              <div className="sn__links">
                <button className="sn__link mono" onClick={() => ui.openItem(drawn.item.id)}>
                  Ver no cardápio
                </button>
                <button className="sn__link mono" onClick={reroll}>
                  Sortear outra
                </button>
                {!more && left > 0 && (
                  <button className="sn__link mono" onClick={() => afterDraw(true)}>
                    Arrumar a mesa
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!noGL && stage === "over" && match && (
        <div className="sn__draw" role="dialog" aria-label="Fim da mesa">
          <p className="kicker">Mesa limpa</p>
          <h3 className="display sn__payer">A conta</h3>
          <Bill match={match} nameOf={nameOf} owed={owed} onItem={(id) => ui.openItem(id)} />
          <div className="sn__after">
            <button className="btn btn--red sn__go" onClick={again}>
              Mais uma <IcSeta />
            </button>
            <div className="sn__links">
              <button className="sn__link mono" onClick={reset}>
                Zerar a conta
              </button>
              <button className="sn__link mono" onClick={onClose}>
                Voltar ao cardápio
              </button>
            </div>
          </div>
        </div>
      )}

      {vs > 0 && match && <Versus key={vs} setup={match.setup} names={[nameOf(0), nameOf(1)]} />}

      {tabOpen && match && (
        <div className="sn__draw sn__draw--tab" role="dialog" aria-label="A conta da sinuca">
          <p className="kicker">Até agora</p>
          <h3 className="display sn__payer">A conta</h3>
          <Bill match={match} nameOf={nameOf} owed={owed} onItem={(id) => ui.openItem(id)} />
          <div className="sn__after">
            <button className="btn sn__go" onClick={() => setTabOpen(false)}>
              Voltar para a mesa
            </button>
            <div className="sn__links">
              <button className="sn__link mono" onClick={reset}>
                Zerar e recomeçar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** O drink sorteado. */
function Prize({ item }: { item: Item }) {
  const sub = detailLine(item);
  return (
    <div className="prize">
      <ArtTile item={item} className="prize__art" />
      <div className="prize__text">
        <strong className="display">{item.name}</strong>
        {sub && <span>{sub}</span>}
      </div>
      {item.price != null && <Price cents={item.price} className="prize__price" />}
    </div>
  );
}

/** A conta: o que cada lado já deve. */
function Bill({ match, nameOf, owed, onItem }: { match: MatchState; nameOf: (t: Team) => string; owed: [number, number]; onItem: (id: string) => void }) {
  if (!match.rounds.length) return <p className="sn__lede">Ninguém deve nada ainda. A cada 2 bolas de um lado sai um sorteio.</p>;
  return (
    <div className="bill">
      <ol className="bill__list">
        {match.rounds.map((r, i) => (
          <li key={i}>
            <button onClick={() => onItem(r.item.id)}>
              <span className="mono bill__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="bill__name display">{r.item.name}</span>
              <span className="bill__dots" aria-hidden="true" />
              <span className="mono bill__who">{nameOf(r.payer)}</span>
              <span className="bill__price display">{r.item.price != null ? brl(r.item.price) : "—"}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="bill__totals">
        {([0, 1] as const).map((t) => (
          <p key={t} className={`bill__total bill__total--${t}`}>
            <span className="mono">{nameOf(t)} paga</span>
            <strong className="display">{brl(owed[t])}</strong>
          </p>
        ))}
      </div>
    </div>
  );
}
