import { createContext, useContext } from "react";
import type { SectionId } from "../data/types";

export interface Origin {
  x: number;
  y: number;
}

export type Theme = "dark" | "light";
/** destinos de rolagem da página única */
export type Spot = SectionId | "topo" | "cardapio" | "casa";

export interface UI {
  /** abertura (tampinha) na tela */
  introOpen: boolean;
  goTo: (spot: Spot, opts?: { origin?: Origin; smooth?: boolean }) => void;
  openItem: (id: string, origin?: Origin) => void;
  closeItem: () => void;
  openSearch: (opts?: { query?: string; voice?: boolean; origin?: Origin }) => void;
  closeSearch: () => void;
  openIntro: () => void;
  fizz: (origin: Origin, opts?: { count?: number; tone?: "beer" | "pink" | "lime" }) => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const UIContext = createContext<UI | null>(null);

export function useUI() {
  const ui = useContext(UIContext);
  if (!ui) throw new Error("useUI fora do UIContext");
  return ui;
}

export function originOf(el: Element | null | undefined): Origin | undefined {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Vibração curtinha (Android); no iPhone não faz nada. */
export function haptic(ms = 8) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
  } catch {
    /* ok */
  }
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function spotId(spot: Spot) {
  if (spot === "topo") return "topo";
  if (spot === "cardapio") return "cardapio";
  if (spot === "casa") return "casa";
  return `sec-${spot}`;
}
