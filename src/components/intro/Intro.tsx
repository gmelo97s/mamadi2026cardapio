import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { casa } from "../../data/casa";
import { EXAMPLES } from "../../lib/search";
import { haptic, prefersReducedMotion } from "../../lib/ui";
import { IcLupa, IcMic } from "../chrome/icons";
import { useTyping } from "../search/useTyping";
import type { Anchor, CapScene } from "./capScene";
import { Pour } from "./Pour";
import { capLayout } from "./layout";
import garrafaSvg from "./garrafa-olho.svg?raw";
import { CORES_MURO } from "../../data/crew";
import "./intro.css";

type Phase = "idle" | "popping" | "pouring" | "covered";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const FRASES = [
  { t: "Comida de mãe...", k: "mae" },
  { t: "Litrão gelado", k: "litrao" },
  { t: "Maior bar LGBT de SP", k: "lgbt" },
  { t: "Viva a democracia!", k: "demo" },
];

/** a mesma garrafa da tela de carregamento, com ids próprios (as duas ficam na página por um instante) */
const GARRAFA_SVG = garrafaSvg.replaceAll("gid-", "gir-");

/** garrafinhas do muro em volta da garrafa do olho (como na fachada) */
const HERO_GARRAFAS = [
  { x: 8, y: 14, s: 30, r: -24, c: 1 },
  { x: 84, y: 9, s: 26, r: 18, c: 0 },
  { x: 4, y: 52, s: 34, r: 16, c: 2 },
  { x: 88, y: 46, s: 36, r: -14, c: 1 },
  { x: 78, y: 70, s: 28, r: 30, c: 3 },
  { x: 14, y: 80, s: 24, r: -40, c: 4 },
];

/** as bolhas brancas que saem do gargalo quando a tampinha estoura (as do muro) */
const BOLHAS = [
  { x: -0.067, y: -1.000, s: 0.307, d: 0, r: "48% 52% 45% 55%" },
  { x: 0.227, y: -1.533, s: 0.387, d: 0.06, r: "55% 45% 52% 48%" },
  { x: -0.307, y: -1.733, s: 0.253, d: 0.1, r: "42% 58% 50% 50%" },
  { x: 0.067, y: -2.200, s: 0.467, d: 0.12, r: "50% 50% 40% 60%" },
  { x: 0.413, y: -0.800, s: 0.187, d: 0.04, r: "50%" },
  { x: -0.427, y: -0.733, s: 0.160, d: 0.08, r: "50%" },
  { x: -0.133, y: -2.667, s: 0.293, d: 0.16, r: "58% 42% 55% 45%" },
  { x: 0.360, y: -2.400, s: 0.240, d: 0.18, r: "46% 54% 50% 50%" },
  { x: -0.467, y: -2.267, s: 0.200, d: 0.2, r: "50%" },
  { x: 0.160, y: -0.533, s: 0.133, d: 0.02, r: "50%" },
];

function Frase({ f, out }: { f: (typeof FRASES)[number]; out?: boolean }) {
  return (
    <p className={`frase frase--${f.k}${out ? " is-out" : ""}`}>
      {f.t.split(" ").map((w, wi) => (
        <span key={wi} className="frase__w" style={{ "--w": wi } as CSSProperties}>
          {w}
        </span>
      ))}
    </p>
  );
}

/** Frases que se revezam acima da tampinha: palavra por palavra, saindo do desfoque, com um brilho que passa. */
function Frases({ i, prev }: { i: number; prev: number | null }) {
  return (
    <div className="frases">
      <p className="sr-only">{FRASES.map((x) => x.t).join(" ")}</p>
      <div className="frases__stage" aria-hidden="true">
        {prev !== null && <Frase key={`o${prev}-${i}`} f={FRASES[prev]} out />}
        <Frase key={`i${i}`} f={FRASES[i]} />
      </div>
    </div>
  );
}

export default function Intro({ onOpened, onSearch }: { onOpened: () => void; onSearch: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const stringRef = useRef<SVGPathElement>(null);
  const sceneRef = useRef<CapScene | null>(null);
  const anchorRef = useRef<Anchor | null>(null);
  const dragRef = useRef<{ y: number; t: number; id: number; dy: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hint, setHint] = useState(false);
  const phaseRef = useRef<Phase>("idle");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  const [reduced] = useState(prefersReducedMotion);
  const [use3D] = useState(() => !reduced && hasWebGL());
  const typing = useTyping(EXAMPLES, phase === "idle");
  // a abertura já está na tela: tira a tela de carregamento do HTML (mesmo desenho, sem piscar)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.remove("boot");
      document.getElementById("boot")?.remove();
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const zoneRef = useRef<HTMLDivElement>(null);
  const garrafaRef = useRef<HTMLDivElement>(null);
  const [fr, setFr] = useState<{ i: number; prev: number | null }>({ i: 0, prev: null });
  useEffect(() => {
    if (reduced) return;
    let clear = 0;
    const t = window.setInterval(() => {
      setFr((s) => ({ i: (s.i + 1) % FRASES.length, prev: s.i }));
      window.clearTimeout(clear);
      clear = window.setTimeout(() => setFr((s) => ({ ...s, prev: null })), 1000);
    }, 3300);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(clear);
    };
  }, [reduced]);

  // posiciona a etiqueta pendurada no furo do abridor
  const placeTag = useCallback(() => {
    const a = anchorRef.current;
    const tag = tagRef.current;
    if (!a || !tag) return;
    const pull = dragRef.current ? Math.max(0, dragRef.current.dy) : 0;
    // a etiqueta acompanha o dedo, com um elástico no fim
    const extra = pull < 140 ? pull * 0.55 : 77 + (pull - 140) * 0.2;
    tag.style.transform = `translate3d(${a.x}px, ${a.y + extra}px, 0)`;
    const p = stringRef.current;
    if (p) p.setAttribute("d", `M 0 ${-extra} C 3 ${10 - extra * 0.5}, -3 18, 0 26`);
    // área de puxar: do meio da tampinha até abaixo da etiqueta
    const zone = zoneRef.current;
    if (zone) {
      const capY = capLayout(window.innerWidth, window.innerHeight).centerY * window.innerHeight;
      zone.style.transform = `translate3d(${a.x - 120}px, ${capY}px, 0)`;
      zone.style.height = `${Math.max(120, a.y + 150 - capY)}px`;
    }
  }, []);

  // cena 3D (carrega o Three.js sob demanda)
  useEffect(() => {
    if (!use3D || !canvasRef.current) return;
    let disposed = false;
    let scene: CapScene | null = null;
    // o 3D carrega depois da primeira pintura (a foto da tampinha aparece na hora)
    const start = () =>
      import("./capScene").then(({ createCapScene }) => {
      if (disposed || !canvasRef.current) return;
      scene = createCapScene({
        canvas: canvasRef.current,
        texture: "/brand/cap-print.webp",
        onReady: () => setReady(true),
        onAnchor: (a) => {
          anchorRef.current = a;
          placeTag();
        },
      });
      sceneRef.current = scene;
    });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => void start(), { timeout: 700 });
    else window.setTimeout(() => void start(), 200);
    const onResize = () => sceneRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [use3D, placeTag]);

  // sem 3D: etiqueta fica num ponto fixo
  useEffect(() => {
    if (use3D) return;
    const set = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const { centerY, size } = capLayout(w, h);
      anchorRef.current = { x: w / 2, y: h * centerY + size * 0.47, angle: 0, ppu: 100 };
      placeTag();
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [use3D, placeTag]);

  // dica (setinha) aparece depois de um tempo parado
  useEffect(() => {
    const t = window.setTimeout(() => setHint(true), 2200);
    return () => window.clearTimeout(t);
  }, []);

  // o olho da garrafa acompanha o dedo/mouse
  const lookAt = useCallback((x: number, y: number) => {
    const box = garrafaRef.current;
    const iris = box?.querySelector(".go-iris");
    if (!box || !iris) return;
    const r = iris.getBoundingClientRect();
    const dx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / 220));
    const dy = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / 260));
    box.style.setProperty("--lx", dx.toFixed(3));
    box.style.setProperty("--ly", dy.toFixed(3));
    box.classList.add("is-olhando");
  }, []);

  // inclinação: dedo/mouse e giroscópio
  useEffect(() => {
    if (!use3D) return;
    const onMove = (e: PointerEvent) => {
      if (dragRef.current) return;
      sceneRef.current?.setTilt((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      lookAt(e.clientX, e.clientY);
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      sceneRef.current?.setTilt(e.gamma / 30, (e.beta - 45) / 40);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [use3D, lookAt]);

  const open = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    haptic(18);
    setHint(false);
    if (reduced) {
      setPhase("covered");
      onOpened();
      return;
    }
    setPhase("popping");
    const go = () => setPhase("pouring");
    if (sceneRef.current) sceneRef.current.pop().then(() => window.setTimeout(go, 90));
    else window.setTimeout(go, 160);
  }, [onOpened, reduced]);

  // gestos: deslizar pra cima, rodinha do mouse e teclado também abrem
  useEffect(() => {
    let sy = 0;
    const onTouchStart = (e: TouchEvent) => {
      sy = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (dragRef.current) return;
      const dy = sy - (e.changedTouches[0]?.clientY ?? sy);
      if (dy > 60) open();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 24) open();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") open();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // puxar a etiqueta = alavanca do abridor
  // segurar e arrastar para baixo = puxar o abridor (no celular e no computador)
  const PULL = 170;
  const ticks = useRef(0);
  const onPointerDown = (e: React.PointerEvent) => {
    if (phaseRef.current !== "idle" || e.button > 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { y: e.clientY, t: performance.now(), id: e.pointerId, dy: 0 };
    ticks.current = 0;
    tagRef.current?.classList.add("is-pulling");
    garrafaRef.current?.classList.add("is-puxando");
    setHint(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    d.dy = e.clientY - d.y;
    const p = Math.max(0, d.dy) / PULL;
    sceneRef.current?.setPull(p);
    placeTag();
    // "tec, tec": vibra a cada terço do caminho
    const step = Math.min(3, Math.floor(p * 3));
    if (step > ticks.current) {
      ticks.current = step;
      haptic(7);
    }
    garrafaRef.current?.style.setProperty("--puxa", Math.min(1, p).toFixed(3));
    if (p >= 1) {
      dragRef.current = null;
      tagRef.current?.classList.remove("is-pulling");
      open();
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    tagRef.current?.classList.remove("is-pulling");
    garrafaRef.current?.classList.remove("is-puxando");
    garrafaRef.current?.style.setProperty("--puxa", "0");
    // toque simples (mesmo que demore, enquanto o 3D carrega) ou puxada passando da metade abrem
    if (d.dy > PULL * 0.45 || Math.abs(d.dy) < 12) open();
    else {
      sceneRef.current?.setPull(0);
      placeTag();
    }
  };
  const pullHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };

  const covered = phase === "covered";

  return (
    <div className={`intro is-${phase}${ready ? " is-ready" : ""}${use3D ? " has-3d" : ""}`} role="dialog" aria-label="Abertura do cardápio do Mamadi">
      {!covered && (
        <>
          <div className="intro__bg" data-f={FRASES[fr.i].k} aria-hidden="true">
            <div className="intro__glow" />
            <div className="intro__pride" />
            {HERO_GARRAFAS.map((g, i) => (
              <i
                key={i}
                className="garrafa intro__garrafinha"
                style={{ left: `${g.x}%`, top: `${g.y}%`, width: `${g.s}px`, "--r": `${g.r}deg`, "--c": CORES_MURO[g.c], "--t": `${7 + i}s`, "--d": `${-i * 1.3}s` } as CSSProperties}
              />
            ))}
            <div className="intro__bubbles">
              {Array.from({ length: 16 }, (_, i) => (
                <span key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
          </div>

          <div className="intro__garrafa" ref={garrafaRef} aria-hidden="true">
            <div className="intro__svg" dangerouslySetInnerHTML={{ __html: GARRAFA_SVG }} />
            <div className="intro__bolhas">
              {BOLHAS.map((b, i) => (
                <i key={i} style={{ "--x": b.x, "--y": b.y, "--s": b.s, "--d": `${b.d}s`, "--r": b.r } as CSSProperties} />
              ))}
            </div>
          </div>

          {use3D && <canvas ref={canvasRef} className="intro__canvas" aria-hidden="true" />}
          <img className="intro__poster" src="/brand/cap-poster.webp" alt="" aria-hidden="true" />

          <Frases i={fr.i} prev={fr.prev} />

          <div className="pull-zone" ref={zoneRef} {...pullHandlers} aria-hidden="true" />

          <div className="intro__tag" ref={tagRef}>
            <svg className="intro__string" viewBox="-6 -50 12 80" aria-hidden="true">
              <path ref={stringRef} d="M 0 0 C 3 10, -3 18, 0 26" />
            </svg>
            <button
              className="pull-tag"
              {...pullHandlers}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open();
                }
              }}
              aria-label="Abrir o cardápio"
            >
              <span className="pull-tag__hole" aria-hidden="true" />
              <span className="pull-tag__small">clique para</span>
              <span className="pull-tag__big">abrir o cardápio</span>
            </button>
            <span className={`intro__hint${hint && phase === "idle" ? " is-on" : ""}`} aria-hidden="true">
              <span className="intro__hint-line" />
              <svg viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>

          <div className="intro__bottom">
            <button className="intro__search" onClick={onSearch} aria-label="Buscar no cardápio">
              <IcLupa className="intro__lupa" />
              <span className="intro__typed">
                Busque: <strong>{typing}</strong>
                <span className="intro__caret" />
              </span>
              <span className="intro__mic">
                <IcMic />
              </span>
            </button>
            <button className="intro__skip" onClick={open}>
              ou só deslize pra cima
            </button>
            <p className="intro__since">Bar {casa.nome} · desde {casa.desde}</p>
          </div>
        </>
      )}

      {(phase === "pouring" || covered) && (
        <Pour
          onCovered={() => setPhase("covered")}
          onDone={() => {
            onOpened();
          }}
        />
      )}
    </div>
  );
}
