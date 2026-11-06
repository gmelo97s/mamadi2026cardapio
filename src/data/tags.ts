import type { Item, Tag } from "./types";
import { sectionById } from "./menu";
import { norm } from "../lib/format";

/*
 * Tags que pesquisam: tocar numa tag (na lista ou na ficha) abre a busca
 * com todos os itens dela. A busca recebe "#chave".
 */
export const TAG_LABEL: Partial<Record<Tag, string>> = {
  promo: "promo",
  novo: "novidade",
  vegano: "vegano",
  serve2: "serve 2",
  fds: "sáb e dom",
  domingo: "domingo",
  "da-casa": "da casa",
};

/** Ingredientes que viram tag (procurados no nome, descrição e opções do item). */
export const INGREDIENTS: { key: string; label: string; re: RegExp }[] = [
  { key: "queijo", label: "queijo", re: /\b(queijo|catupiry|cheddar|parmesao|coalho)/ },
  { key: "bacon", label: "bacon", re: /\bbacon/ },
  { key: "calabresa", label: "calabresa", re: /\bcalabresa/ },
  { key: "carne", label: "carne", re: /\b(carne|contra-file|churrasco|burger)\b|70 g de carne/ },
  { key: "frango", label: "frango", re: /\bfrango/ },
  { key: "linguica", label: "linguiça", re: /\blinguica/ },
  { key: "pernil", label: "pernil", re: /\bpernil/ },
  { key: "berinjela", label: "berinjela", re: /\bberinjela/ },
  { key: "batata", label: "batata", re: /\bbatata/ },
  { key: "mandioca", label: "mandioca", re: /\bmandioca/ },
  { key: "cebola", label: "cebola", re: /\bcebola/ },
  { key: "limao", label: "limão", re: /\blimao/ },
  { key: "maracuja", label: "maracujá", re: /\bmaracuja/ },
  { key: "morango", label: "morango", re: /\bmorango/ },
  { key: "abacaxi", label: "abacaxi", re: /\babacaxi/ },
  { key: "hortela", label: "hortelã", re: /\bhortela/ },
  { key: "gengibre", label: "gengibre", re: /\bgengibre/ },
  { key: "mel", label: "mel", re: /\bmel\b/ },
  { key: "pimenta", label: "pimenta", re: /\bpimenta/ },
  { key: "vodka", label: "vodka", re: /\b(vodka|caipiroska|balalaika)/ },
  { key: "gin", label: "gin", re: /\bgin\b/ },
  { key: "cachaca", label: "cachaça", re: /\b(cachaca|51|velho barreiro|jambu)\b/ },
  { key: "rum", label: "rum", re: /\brum\b/ },
  { key: "tequila", label: "tequila", re: /\btequila/ },
  { key: "whisky", label: "whisky", re: /\bwhisky/ },
  { key: "energetico", label: "energético", re: /\benergetico/ },
];

function text(it: Item) {
  return norm([it.name, it.desc, ...(it.options ?? []).flatMap((g) => g.values)].filter(Boolean).join(" "));
}

export function ingredientsOf(it: Item) {
  const t = text(it);
  return INGREDIENTS.filter((g) => g.re.test(t));
}

/** Itens de uma tag ("#vegano", "#queijo"…). */
export function itemsForTag(key: string, all: Item[]): { label: string; items: Item[] } | null {
  const k = norm(key.replace(/^#/, "").trim());
  const tag = (Object.entries(TAG_LABEL) as [Tag, string][]).find(([id, label]) => norm(label) === k || id === k);
  if (tag) {
    const [id] = tag;
    const items = all.filter((it) => it.tags?.includes(id) || (id === "vegano" && /vegan/.test(text(it))) || (id === "fds" && it.tags?.includes("domingo")));
    return { label: tag[1], items };
  }
  const ing = INGREDIENTS.find((g) => g.key === k || norm(g.label) === k);
  if (ing) {
    const items = all.filter((it) => ing.re.test(text(it)) && sectionById.has(it.section));
    return { label: ing.label, items };
  }
  return null;
}
