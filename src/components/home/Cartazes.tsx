import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cartazes, type Cartaz } from "../../data/cartaz";
import { itemById } from "../../data/menu";
import { brl } from "../../lib/format";
import { nowSP } from "../../lib/schedule";
import { haptic, originOf, prefersReducedMotion, useUI } from "../../lib/ui";
import { Art } from "../art/Art";
import { IcSeta } from "../chrome/icons";
import "./cartazes.css";

const TITLE = "Promoções e Combos";

/** Cartazes com dia certo (churrasco, baião, executivo) só aparecem no dia, e vão para a frente. */
function ordered(list: Cartaz[]) {
  const { weekday } = nowSP();
  return [...list.filter((c) => c.days?.includes(weekday)), ...list.filter((c) => !c.days)];
}

function badgeOf(c: Cartaz, weekday: number) {
  if (c.days?.includes(weekday)) return "Hoje tem";
  if (c.kicker === "Promoção") return "Promo";
  if (c.kicker === "Novidade") return "Novo";
  return c.kicker;
}

function Media({ c }: { c: Cartaz }) {
  const photo = "item" in c.open ? itemById.get(c.open.item)?.photo : undefined;
  if (photo) return <img className="ncard__img" src={photo} alt="" loading="lazy" decoding="async" draggable={false} />;
  const n = c.count ?? 1;
  return (
    <span className={`ncard__art ncard__art--${c.paper}`}>
      {Array.from({ length: n }, (_, i) => (
        <Art key={i} k={c.art} color={c.artColor} className={`ncard__ill ncard__ill--${n}-${i}`} />
      ))}
    </span>
  );
}

/** Carrossel em loop infinito (igual às Novidades do Botanikafe): anda sozinho, desacelera com o mouse
 *  em cima, arrasta com o dedo e um toque simples continua sendo clique. */
function useLoop(el: React.RefObject<HTMLDivElement | null>, track: React.RefObject<HTMLDivElement | null>, setLen: number, paused: boolean) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const box = el.current;
    const tr = track.current;
    if (!box || !tr) return;
    const reduced = prefersReducedMotion();
    const SPEED = window.innerWidth < 760 ? 38 : 50; // px/s
    let items: HTMLElement[] = [];
    let medias: HTMLElement[] = [];
    let x = 0;
    let v = 0;
    let setW = 0;
    let step = 0;
    let cardW = 0;
    let baseLeft = 0;
    let pressed = false;
    let dragging = false;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let moved = 0;
    let pid = -1;
    let resumeAt = 0;
    let hover = false;
    let focus = false;
    let visible = false;
    let raf = 0;
    let prev = 0;
    const measure = () => {
      const a = items[0];
      const b = items[1];
      const c = items[setLen];
      if (!a || !b || !c) return;
      setW = c.offsetLeft - a.offsetLeft;
      step = b.offsetLeft - a.offsetLeft;
      cardW = a.offsetWidth;
      baseLeft = box.getBoundingClientRect().left + a.offsetLeft;
    };
    const collect = () => {
      items = Array.from(tr.querySelectorAll<HTMLElement>(".ncard"));
      medias = items.map((it) => it.querySelector<HTMLElement>(".ncard__media > *")!);
      measure();
    };
    collect();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (t - (prev || t)) / 1000);
      prev = t;
      if (!dragging) {
        const stopped = reduced || pressed || focus || pausedRef.current || t < resumeAt;
        const auto = stopped ? 0 : (hover ? 0.25 : 1) * SPEED;
        v += (-auto - v) * Math.min(1, dt * (pressed ? 8 : 2.2)); // segurar freia; ao soltar o ritmo volta suave
        x += v * dt;
      }
      if (setW) {
        while (x <= -setW) x += setW;
        while (x > 0) x -= setW;
      }
      tr.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      // parallax leve na imagem
      const vw = window.innerWidth;
      for (let i = 0; i < medias.length; i++) {
        const m = medias[i];
        if (!m) continue;
        const cx = baseLeft + x + i * step + cardW / 2;
        if (cx < -cardW || cx > vw + cardW) continue;
        m.style.setProperty("--px", `${(-6 - ((cx - vw / 2) / vw) * 6).toFixed(2)}%`);
      }
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        prev = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(box);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const down = (e: PointerEvent) => {
      if (e.button > 0) return;
      pressed = true;
      dragging = false;
      moved = 0;
      startX = lastX = e.clientX;
      lastT = performance.now();
      pid = e.pointerId;
    };
    const move = (e: PointerEvent) => {
      if (!pressed) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      if (!dragging) {
        if (Math.abs(e.clientX - startX) < 6) return;
        dragging = true;
        v = 0;
        box.classList.add("is-dragging");
        try {
          box.setPointerCapture(pid);
        } catch {
          /* ok */
        }
      }
      x += dx;
      moved += Math.abs(dx);
      v = 0.8 * (dx / Math.max(1, now - lastT)) * 1000 + 0.2 * v;
      lastX = e.clientX;
      lastT = now;
    };
    const end = () => {
      if (!pressed) return;
      pressed = false;
      if (dragging) {
        dragging = false;
        box.classList.remove("is-dragging");
        resumeAt = performance.now() + 1400;
      }
    };
    const click = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
    };
    const leave = () => {
      hover = false;
    };
    const fin = () => {
      focus = true;
    };
    const fout = () => {
      focus = false;
    };
    box.addEventListener("pointerdown", down);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
    box.addEventListener("lostpointercapture", end);
    box.addEventListener("click", click, true);
    box.addEventListener("pointerenter", enter);
    box.addEventListener("pointerleave", leave);
    box.addEventListener("focusin", fin);
    box.addEventListener("focusout", fout);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", onVis);
      box.removeEventListener("pointerdown", down);
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerup", end);
      box.removeEventListener("pointercancel", end);
      box.removeEventListener("lostpointercapture", end);
      box.removeEventListener("click", click, true);
      box.removeEventListener("pointerenter", enter);
      box.removeEventListener("pointerleave", leave);
      box.removeEventListener("focusin", fin);
      box.removeEventListener("focusout", fout);
    };
  }, [el, track, setLen]);
}

export function Promos() {
  const ui = useUI();
  const list = useMemo(() => ordered(cartazes), []);
  const { weekday } = nowSP();
  // o conjunto se repete até ficar mais largo que a tela (o loop não pode ter buraco)
  const [reps] = useState(() => {
    const w = window.innerWidth;
    const cardW = (w >= 1024 ? 320 : w >= 760 ? 300 : Math.min(300, w * 0.74)) + 14;
    return Math.max(1, Math.ceil((w + cardW) / (list.length * cardW)));
  });
  const set = useMemo(() => Array.from({ length: reps }, () => list).flat(), [reps, list]);
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useLoop(boxRef, trackRef, set.length, ui.introOpen);

  const open = (c: Cartaz, el: HTMLElement) => {
    haptic(6);
    if ("item" in c.open) ui.openItem(c.open.item, originOf(el));
    else ui.goTo(c.open.section as never, { origin: originOf(el) });
  };

  // inclinação 3D com o mouse (computador)
  const tilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    c.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 10).toFixed(2)}deg)`;
    c.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    c.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  return (
    <section className="promos" aria-label={TITLE}>
      <div className="promos__head wrap">
        <h1 className="letreiro promos__title" aria-label={TITLE}>
          {TITLE.split(" ").map((w, wi) => (
            <span key={wi} className="promos__word" aria-hidden="true">
              {w.split("").map((ch, ci) => (
                <span key={ci} className="promos__ch" style={{ "--d": `${(wi * 9 + ci) * 45}ms` } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="promos__sub">As ofertas da casa e o que chegou de novo. Toque para ver.</p>
      </div>
      <div className="nloop" ref={boxRef}>
        <div className="nloop__track" ref={trackRef}>
          {[...set, ...set].map((c, k) => {
            const dup = k >= list.length;
            const item = "item" in c.open ? itemById.get(c.open.item) : undefined;
            const price = c.price != null ? brl(c.price) : item?.price != null ? brl(item.price) : "";
            return (
              <button
                key={`${c.id}-${k}`}
                className={`ncard${c.paper === "pista" ? " ncard--pista" : ""}`}
                aria-hidden={dup ? true : undefined}
                tabIndex={dup ? -1 : undefined}
                aria-label={dup ? undefined : `${c.title}, ${price}`}
                onClick={(e) => open(c, e.currentTarget)}
                onPointerMove={tilt}
                onPointerLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                <span className="ncard__media">
                  <Media c={c} />
                  <span className="ncard__tag">{badgeOf(c, weekday)}</span>
                </span>
                <span className="ncard__body">
                  <span className="ncard__name">{c.title}</span>
                  {c.sub && <span className="ncard__desc">{c.sub}</span>}
                  <span className="ncard__foot">
                    <span className="ncard__price">
                      {price}
                      {c.priceNote && <small> · {c.priceNote}</small>}
                    </span>
                    <span className="ncard__more">
                      Ver <IcSeta />
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
