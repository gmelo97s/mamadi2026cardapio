import { useEffect, useState } from "react";
import { Faixa } from "../art/Decor";
import { IcLupa } from "./icons";
import { originOf, useUI } from "../../lib/ui";
import "./chrome.css";

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
      <button className="appbar__brand" onClick={ui.openIntro} aria-label="Mamadi: voltar para a abertura">
        <img className="appbar__cap" src="/brand/cap-128.webp" alt="" width="40" height="40" />
        <Faixa className="appbar__faixa" />
      </button>
      <button className="appbar__search" onClick={(e) => ui.openSearch({ origin: originOf(e.currentTarget) })} aria-label="Buscar no cardápio">
        <IcLupa />
      </button>
    </header>
  );
}
