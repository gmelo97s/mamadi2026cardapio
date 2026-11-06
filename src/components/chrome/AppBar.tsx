import { useEffect, useState } from "react";
import { casa } from "../../data/casa";
import { Faixa } from "../art/Decor";
import { IcLua, IcLupa, IcSol } from "./icons";
import { originOf, useUI } from "../../lib/ui";
import "./chrome.css";

export function ThemeToggle() {
  const ui = useUI();
  const dark = ui.theme === "dark";
  return (
    <button
      className={`theme${dark ? " is-dark" : ""}`}
      onClick={ui.toggleTheme}
      aria-label={dark ? "Mudar para o modo dia" : "Mudar para o modo noite"}
      title="Dia ou noite"
    >
      <IcSol className="theme__sun" />
      <IcLua className="theme__moon" />
      <span className="theme__knob" aria-hidden="true" />
    </button>
  );
}

export function AppBar() {
  const ui = useUI();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`appbar${scrolled ? " is-scrolled" : ""}`}>
      <div className="appbar__inner wrap">
        <button className="appbar__brand" onClick={ui.openIntro} aria-label="Mamadi: voltar para a abertura">
          <img className="appbar__cap" src="/brand/cap-128.webp" alt="" width="40" height="40" />
          <Faixa className="appbar__faixa" />
        </button>
        <nav className="appbar__links" aria-label="Atalhos">
          <button onClick={() => ui.goTo("topo")}>Promoções</button>
          <button onClick={() => ui.goTo("cardapio")}>Cardápio</button>
          <a href={casa.ifoodUrl} target="_blank" rel="noreferrer">
            iFood
          </a>
          <a href={casa.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <button onClick={() => ui.goTo("casa")}>Como chegar</button>
        </nav>
        <button className="appbar__search" onClick={(e) => ui.openSearch({ origin: originOf(e.currentTarget) })} aria-label="Buscar no cardápio">
          <IcLupa />
          <span className="appbar__search-label">Buscar</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
