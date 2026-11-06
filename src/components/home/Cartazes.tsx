import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cartazes, type Cartaz } from "../../data/cartaz";
import { nowSP } from "../../lib/schedule";
import { haptic, originOf, prefersReducedMotion, useUI } from "../../lib/ui";
import { Art } from "../art/Art";
import { Glitter } from "../fx/Fx";
import { Price } from "../menu/bits";
import "./cartazes.css";

const DURATION = 3000;
const TITLE = "Promoções e Combos";

/** Cartazes com dia certo (churrasco, baião, executivo) só aparecem no dia, e vão para a frente. */
function ordered(list: Cartaz[]) {
  const { weekday } = nowSP();
  return [...list.filter((c) => c.days?.includes(weekday)), ...list.filter((c) => !c.days)];
}

function CartazArt({ c }: { c: Cartaz }) {
  const n = c.count ?? 1;
  if (n === 1) return <Art k={c.art} color={c.artColor} className="cartaz__art-one" />;
  return (
    <span className="cartaz__art-many" style={{ "--n": n } as CSSProperties}>
      {Array.from({ length: n }, (_, i) => (
        <Art key={i} k={c.art} color={c.artColor} className="cartaz__art-i" />
      ))}
    </span>
  );
}

export function Promos() {
  const ui = useUI();
  const list = useMemo(() => ordered(cartazes), []);
  const { weekday } = nowSP();
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((i: number, smooth = true) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: smooth ? "smooth" : "instant" as ScrollBehavior });
  }, []);

  // índice atual pela rolagem
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        Array.from(el.children).forEach((ch, i) => {
          const c = ch as HTMLElement;
          const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);

  // pausa quando sai da tela ou a aba fica escondida
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const vis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const reduced = prefersReducedMotion();
  const running = !paused && visible && !reduced && !ui.introOpen;

  // avança sozinho
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => goTo((index + 1) % list.length), DURATION);
    return () => window.clearTimeout(t);
  }, [running, index, list.length, goTo]);

  const hold = () => setPaused(true);
  useEffect(() => {
    if (!paused) return;
    const t = window.setTimeout(() => setPaused(false), 5200);
    return () => window.clearTimeout(t);
  }, [paused, index]);

  return (
    <section className="cartazes" aria-roledescription="carrossel" aria-label={TITLE}>
      <div className="cartazes__head wrap">
        <h1 className="letreiro cartazes__title" aria-label={TITLE}>
          {TITLE.split(" ").map((w, wi) => (
            <span key={wi} className="cartazes__word" aria-hidden="true">
              {w.split("").map((ch, ci) => (
                <span key={ci} className="cartazes__ch" style={{ "--d": `${(wi * 9 + ci) * 45}ms` } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>
      <div className="cartazes__bars wrap" aria-hidden="true">
        {list.map((c, i) => (
          <button
            key={c.id}
            tabIndex={-1}
            className={`bar${i < index ? " is-done" : ""}${i === index ? " is-now" : ""}${i === index && running ? " is-running" : ""}`}
            style={{ "--dur": `${DURATION}ms` } as CSSProperties}
            onClick={() => {
              hold();
              goTo(i);
            }}
          >
            <span />
          </button>
        ))}
      </div>
      <div className="cartazes__scroll" ref={scroller} onPointerDown={hold} onWheel={hold}>
        {list.map((c, i) => {
          const isToday = c.days?.includes(weekday);
          return (
            <button
              key={c.id}
              className={`cartaz cartaz--${c.paper}${i === index ? " is-current" : ""}`}
              style={{ "--tilt": `${i % 2 ? 0.8 : -0.8}deg` } as CSSProperties}
              aria-label={`${c.kicker}: ${c.title}${c.price ? `, ${(c.price / 100).toFixed(2).replace(".", ",")} reais` : ""}`}
              onClick={(e) => {
                haptic(6);
                if ("item" in c.open) ui.openItem(c.open.item, originOf(e.currentTarget));
                else ui.goTo(c.open.section as never, { origin: originOf(e.currentTarget) });
              }}
            >
              <span className="cartaz__tape" aria-hidden="true" />
              {c.paper === "pista" && <Glitter count={10} />}
              <span className="cartaz__kicker">{isToday ? "Hoje tem!" : c.kicker}</span>
              <span className="cartaz__title">{c.paper === "pista" ? <><span className="cartaz__neon">Divas</span> Pop</> : c.title}</span>
              {c.sub && <span className="cartaz__sub">{c.sub}</span>}
              {c.price != null && (
                <span className="cartaz__price">
                  <Price cents={c.price} />
                  {c.priceNote && <span className="cartaz__pnote">{c.priceNote}</span>}
                </span>
              )}
              <span className="cartaz__art">
                <CartazArt c={c} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
