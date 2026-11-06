import { useEffect, useRef, type CSSProperties } from "react";
import { AnimatePresence, animate, m, useMotionValue } from "motion/react";
import { itemById, itemsBySection, sectionById } from "../../data/menu";
import { pairingsFor } from "../../data/pairings";
import type { Item } from "../../data/types";
import { brl } from "../../lib/format";
import { isAvailableToday, kitchenStatus, nowSP } from "../../lib/schedule";
import { haptic, originOf, useUI } from "../../lib/ui";
import { Art } from "../art/Art";
import { ART_TINT } from "../art/artTint";
import { IcX } from "../chrome/icons";
import { ArtTile, Price, Tags } from "../menu/bits";
import { Sleeve } from "../menu/Divas";
import "./sheet.css";

function availability(it: Item): string | null {
  const sec = it.section;
  if (it.tags?.includes("domingo")) return isAvailableToday(it.tags) ? "Hoje é domingo: tem!" : "Sai só aos domingos, das 12h às 19h.";
  if (it.tags?.includes("fds")) return isAvailableToday(it.tags) ? "Hoje tem! Sai sábado e domingo, das 12h às 19h." : "Sai só aos sábados e domingos, das 12h às 19h.";
  if (sec === "pratos") {
    const k = kitchenStatus();
    return k.open ? `Servindo agora, até as 19h.` : k.detail;
  }
  return null;
}

function Hero({ item }: { item: Item }) {
  if (item.diva) {
    const idx = itemsBySection("divas").findIndex((x) => x.id === item.id);
    return (
      <div className="sheet__hero sheet__hero--divas">
        <Sleeve item={item} index={idx} big />
      </div>
    );
  }
  return (
    <div className="sheet__hero" style={{ "--tint": ART_TINT[item.art] ?? "var(--paper-2)" } as CSSProperties}>
      <span className="sheet__bubbles" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
      {item.photo ? <img className="sheet__photo" src={item.photo} alt="" /> : <Art k={item.art} color={item.color} className="sheet__art" />}
    </div>
  );
}

function Body({ item }: { item: Item }) {
  const ui = useUI();
  const section = sectionById.get(item.section)!;
  const pairs = pairingsFor(item);
  const avail = availability(item);
  return (
    <>
      <Hero item={item} />
      <div className="sheet__content">
        <p className="sheet__kicker">{section.title}</p>
        <h2 className="sheet__name" id="sheet-title" tabIndex={-1}>
          {item.name}
        </h2>
        {item.diva && <p className="sheet__artist">em homenagem a {item.diva.artist}</p>}
        <Tags tags={item.tags} className="sheet__tags" />
        {item.diva && <p className="sheet__hook hand">“{item.diva.hook}”</p>}
        {item.desc && <p className="sheet__desc">{item.desc}</p>}

        <div className="sheet__pricing">
          {item.variants ? (
            <div className="sheet__variants">
              {item.variants.map((v) => (
                <div key={v.label} className="sheet__variant">
                  <span>{v.label}</span>
                  <Price cents={v.price} className="sheet__vprice" />
                </div>
              ))}
            </div>
          ) : (
            item.price != null && (
              <div className="sheet__single">
                <Price cents={item.price} className="sheet__price" />
                {item.unit && <span className="sheet__unit hand">{item.unit}</span>}
              </div>
            )
          )}
          {item.variants && item.unit && <p className="sheet__unit hand">{item.unit}</p>}
        </div>

        {item.options?.map((g) => (
          <div key={g.label} className="sheet__opts">
            <p className="sheet__opts-label">{g.label}</p>
            <div className="sheet__opts-list">
              {g.values.map((v) => (
                <span key={v} className="opt">
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}

        {avail && <p className="sheet__avail">{avail}</p>}

        <section className="pairs" aria-labelledby="pairs-title">
          <h3 className="pairs__title" id="pairs-title">
            <span className="letreiro">Combina com</span>
            <span className="hand pairs__note">sugestão da casa</span>
          </h3>
          <ul className="pairs__list">
            {pairs.map((p, i) => (
              <li key={p.item.id} style={{ "--i": i } as CSSProperties}>
                <button
                  className="pair"
                  onClick={(e) => {
                    haptic(6);
                    ui.fizz(originOf(e.currentTarget)!, { count: 8 });
                    ui.openItem(p.item.id);
                  }}
                >
                  <ArtTile item={p.item} className="pair__art" />
                  <span className="pair__name">{p.item.name}</span>
                  <span className="pair__price">{p.item.variants ? `a partir de ${brl(Math.min(...p.item.variants.map((v) => v.price)))}` : brl(p.item.price ?? 0)}</span>
                  <span className="pair__why hand">{p.reason}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

/** Puxar para baixo (no topo do conteúdo ou na alça) fecha a ficha. */
function usePullToClose(sheet: React.RefObject<HTMLDivElement | null>, scroller: React.RefObject<HTMLDivElement | null>, onClose: () => void, active: boolean) {
  const y = useMotionValue(0);
  useEffect(() => {
    const el = sheet.current;
    if (!el || !active) return;
    let startY = 0;
    let pulling = false;
    let lastY = 0;
    let lastT = 0;
    let vel = 0;
    const onStart = (e: TouchEvent) => {
      startY = lastY = e.touches[0].clientY;
      lastT = e.timeStamp;
      pulling = false;
      vel = 0;
    };
    const onMove = (e: TouchEvent) => {
      const cy = e.touches[0].clientY;
      const dy = cy - startY;
      const atTop = (scroller.current?.scrollTop ?? 0) <= 0;
      if (!pulling && dy > 8 && atTop) pulling = true;
      if (!pulling) return;
      e.preventDefault();
      y.set(Math.max(0, dy * 0.9));
      const dt = Math.max(1, e.timeStamp - lastT);
      vel = ((cy - lastY) / dt) * 1000;
      lastY = cy;
      lastT = e.timeStamp;
    };
    const onEnd = () => {
      if (!pulling) return;
      pulling = false;
      if (y.get() > 120 || vel > 800) onClose();
      else animate(y, 0, { type: "spring", stiffness: 420, damping: 36 });
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [active, onClose, scroller, sheet, y]);
  return y;
}

export function ItemSheet({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
  const item = itemId ? itemById.get(itemId) : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const open = !!item;

  // trava a rolagem da página e fecha no Esc
  useEffect(() => {
    if (!open) return;
    lastFocus.current = (document.activeElement as HTMLElement) ?? null;
    document.body.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!item) return;
    scrollRef.current?.scrollTo({ top: 0 });
    const t = window.setTimeout(() => document.getElementById("sheet-title")?.focus({ preventScroll: true }), 280);
    return () => window.clearTimeout(t);
  }, [item]);

  const y = usePullToClose(sheetRef, scrollRef, onClose, open);
  useEffect(() => {
    if (open) y.set(0);
  }, [open, y]);

  const { weekday } = nowSP();

  return (
    <AnimatePresence>
      {item && (
        <m.div className="sheet-layer" key="layer" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <m.div
            className="sheet-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <m.div
            ref={sheetRef}
            className={`sheet${item.diva ? " sheet--divas" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            data-weekday={weekday}
            style={{ y }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.9 }}
          >
            <div className="sheet__grab" aria-hidden="true">
              <span />
            </div>
            <button className="sheet__close" onClick={onClose} aria-label="Fechar">
              <IcX />
            </button>
            <div className="sheet__scroll" ref={scrollRef}>
              <AnimatePresence mode="popLayout" initial={false}>
                <m.div
                  key={item.id}
                  className="sheet__page"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Body item={item} />
                </m.div>
              </AnimatePresence>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
