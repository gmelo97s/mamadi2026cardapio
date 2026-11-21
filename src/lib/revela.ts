import { useEffect, useLayoutEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./ui";

/** já está (ao menos em parte) na tela? */
export function naTela(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Entrada em cena ao rolar: marca o elemento com `is-armed` (estado escondido, só com JS)
 * e troca para `is-in` quando ele aparece na tela. Acontece uma vez só; o que já nasce na tela
 * não é escondido (nada de piscar), e com movimento reduzido nada disso acontece.
 */
export function useRevela<T extends HTMLElement>(ref: RefObject<T | null>, threshold = 0.1) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined" || naTela(el)) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
}

/** Marca `is-live` enquanto o elemento está na tela: as animações em loop só rodam aí (poupa bateria). */
export function useNaTela<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-live", e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
