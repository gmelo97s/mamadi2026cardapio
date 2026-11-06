import type { Cents, Item } from "../data/types";

/** R$ 17 · R$ 29,90 (sem ",00", como no cardápio impresso) */
export function brl(c: Cents): string {
  const reais = Math.floor(c / 100);
  const cents = c % 100;
  return cents ? `R$ ${reais},${String(cents).padStart(2, "0")}` : `R$ ${reais}`;
}

/** Partes para preço "de cartaz": R$ 29 ⁹⁰ */
export function priceParts(c: Cents) {
  const reais = Math.floor(c / 100);
  const cents = c % 100;
  return { reais: String(reais), cents: cents ? String(cents).padStart(2, "0") : "" };
}

/** Texto curto do preço de um item (para listas e leitura de tela). */
export function itemPriceLabel(it: Item): string {
  if (it.variants) return it.variants.map((v) => `${v.label} ${brl(v.price)}`).join(" · ");
  return it.price != null ? brl(it.price) : "";
}

export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
