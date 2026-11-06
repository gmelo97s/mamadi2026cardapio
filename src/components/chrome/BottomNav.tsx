import { useEffect, useState } from "react";
import { casa } from "../../data/casa";
import { IcCardapio, IcInsta, IcLupa, IcMic, IcMoto, IcTampinha } from "./icons";
import { haptic, originOf, useUI } from "../../lib/ui";
import "./chrome.css";

/** Menu inferior (celular): Início, Cardápio, Pesquisa, iFood e Instagram. */
export function BottomNav() {
  const ui = useUI();
  const [inMenu, setInMenu] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const top = document.getElementById("cardapio")?.getBoundingClientRect().top ?? 9999;
      setInMenu(top < window.innerHeight * 0.45);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav className="nav" aria-label="Menu">
      <div className="nav__inner">
        <button
          className={`nav__tab${!inMenu ? " is-active" : ""}`}
          aria-current={!inMenu ? "page" : undefined}
          onClick={(e) => {
            haptic(6);
            ui.goTo("topo", { origin: originOf(e.currentTarget) });
          }}
        >
          <span className="nav__icon">
            <IcTampinha />
          </span>
          <span className="nav__label">Início</span>
        </button>
        <button
          className={`nav__tab${inMenu ? " is-active" : ""}`}
          aria-current={inMenu ? "page" : undefined}
          onClick={(e) => {
            haptic(6);
            ui.goTo("cardapio", { origin: originOf(e.currentTarget) });
          }}
        >
          <span className="nav__icon">
            <IcCardapio />
          </span>
          <span className="nav__label">Cardápio</span>
        </button>
        <button
          className="nav__search"
          aria-label="Pesquisar (por texto ou voz)"
          onClick={(e) => {
            haptic(10);
            ui.openSearch({ origin: originOf(e.currentTarget) });
          }}
        >
          <span className="nav__search-disc">
            <IcLupa className="nav__search-lupa" />
            <IcMic className="nav__search-mic" />
          </span>
          <span className="nav__label">Pesquisa</span>
        </button>
        <a className="nav__tab" href={casa.ifoodUrl} target="_blank" rel="noreferrer">
          <span className="nav__icon">
            <IcMoto />
          </span>
          <span className="nav__label">iFood</span>
        </a>
        <a className="nav__tab" href={casa.instagramUrl} target="_blank" rel="noreferrer">
          <span className="nav__icon">
            <IcInsta />
          </span>
          <span className="nav__label">Instagram</span>
        </a>
      </div>
    </nav>
  );
}
