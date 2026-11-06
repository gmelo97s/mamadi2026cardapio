import { useEffect, useRef, useState, type CSSProperties } from "react";
import { itemById, itemsBySection, sectionById } from "../../data/menu";
import { pairingsFor } from "../../data/pairings";
import { ingredientsOf } from "../../data/tags";
import type { Item } from "../../data/types";
import { brl } from "../../lib/format";
import { isAvailableToday, kitchenStatus } from "../../lib/schedule";
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
        <Tags tags={item.tags} ingredients={ingredientsOf(item).slice(0, 6)} className="sheet__tags" />
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
            <span className="sheet__opts-label">{g.label}</span>
            {g.values.map((v) => (
              <span key={v} className="opt">
                {v}
              </span>
            ))}
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
                  <span className="pair__price">
                    {p.item.variants && <small>a partir de</small>}
                    {brl(p.item.variants ? Math.min(...p.item.variants.map((v) => v.price)) : (p.item.price ?? 0))}
                  </span>
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

/** Puxar para baixo (no topo do conteúdo) fecha a ficha. */
function usePullToClose(sheet: React.RefObject<HTMLDivElement | null>, scroller: React.RefObject<HTMLDivElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    const el = sheet.current;
    if (!el || !active) return;
    let startY = 0;
    let pulling = false;
    let dy = 0;
    let lastY = 0;
    let lastT = 0;
    let vel = 0;
    const onStart = (e: TouchEvent) => {
      startY = lastY = e.touches[0].clientY;
      lastT = e.timeStamp;
      pulling = false;
      vel = 0;
      dy = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (window.innerWidth >= 900) return;
      const cy = e.touches[0].clientY;
      dy = cy - startY;
      const atTop = (scroller.current?.scrollTop ?? 0) <= 0;
      if (!pulling && dy > 8 && atTop) pulling = true;
      if (!pulling) return;
      e.preventDefault();
      el.style.transition = "none";
      el.style.transform = `translate3d(0, ${Math.max(0, dy * 0.9)}px, 0)`;
      vel = ((cy - lastY) / Math.max(1, e.timeStamp - lastT)) * 1000;
      lastY = cy;
      lastT = e.timeStamp;
    };
    const onEnd = () => {
      if (!pulling) return;
      pulling = false;
      if (dy > 120 || vel > 800) onClose();
      else {
        el.style.transition = "transform .3s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "";
      }
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
  }, [active, onClose, scroller, sheet]);
}

export function ItemSheet({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
  // mantém o item na tela durante a animação de saída
  const [shown, setShown] = useState<string | null>(itemId);
  const [prev, setPrev] = useState<string | null>(itemId);
  if (itemId !== prev) {
    setPrev(itemId);
    if (itemId) setShown(itemId);
  }
  const closing = !itemId && !!shown;
  const item = shown ? itemById.get(shown) : undefined;
  const open = !!itemId;
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // trava a rolagem da página e fecha no Esc
  useEffect(() => {
    if (!open) return;
    const lastFocus = document.activeElement as HTMLElement | null;
    document.body.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
      lastFocus?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!itemId) return;
    scrollRef.current?.scrollTo({ top: 0 });
    const t = window.setTimeout(() => document.getElementById("sheet-title")?.focus({ preventScroll: true }), 300);
    return () => window.clearTimeout(t);
  }, [itemId]);

  usePullToClose(sheetRef, scrollRef, onClose, open);

  if (!item) return null;
  return (
    <div className={`sheet-layer${closing ? " is-closing" : ""}`}>
      <div className="sheet-backdrop" onClick={onClose} />
      <div
        ref={sheetRef}
        className={`sheet${item.diva ? " sheet--divas" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) setShown(null);
        }}
      >
        <div className="sheet__grab" aria-hidden="true">
          <span />
        </div>
        <button className="sheet__close" onClick={onClose} aria-label="Fechar">
          <IcX />
        </button>
        <div className="sheet__scroll" ref={scrollRef}>
          <div key={item.id} className="sheet__page">
            <Body item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
