import type { ReactNode } from "react";
import { IcBurger, IcCadeira, IcLitrao, IcLupa, IcMic, IcTampinha } from "./icons";
import { haptic, originOf, useUI, type Tab } from "../../lib/ui";
import "./chrome.css";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "inicio", label: "Início", icon: <IcTampinha /> },
  { id: "beber", label: "Beber", icon: <IcLitrao /> },
  { id: "comer", label: "Comer", icon: <IcBurger /> },
  { id: "casa", label: "A casa", icon: <IcCadeira /> },
];

export function BottomNav() {
  const ui = useUI();
  const btn = (t: (typeof TABS)[number]) => (
    <button
      key={t.id}
      className={`nav__tab${ui.tab === t.id ? " is-active" : ""}`}
      aria-current={ui.tab === t.id ? "page" : undefined}
      onClick={(e) => {
        haptic(6);
        ui.goTab(t.id, { origin: originOf(e.currentTarget) });
      }}
    >
      <span className="nav__icon">{t.icon}</span>
      <span className="nav__label">{t.label}</span>
    </button>
  );
  return (
    <nav className="nav" aria-label="Seções do cardápio">
      <div className="nav__inner">
        {btn(TABS[0])}
        {btn(TABS[1])}
        <button
          className="nav__search"
          aria-label="Buscar (por texto ou voz)"
          onClick={(e) => {
            haptic(10);
            ui.openSearch({ origin: originOf(e.currentTarget) });
          }}
        >
          <span className="nav__search-disc">
            <IcLupa className="nav__search-lupa" />
            <IcMic className="nav__search-mic" />
          </span>
          <span className="nav__label">Buscar</span>
        </button>
        {btn(TABS[2])}
        {btn(TABS[3])}
      </div>
    </nav>
  );
}
