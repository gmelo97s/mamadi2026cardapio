/*
 * Busca inteligente do cardápio, 100% no aparelho.
 * Entende fala natural em português: preço ("até 20 conto", "entre 10 e 20", "barato"),
 * tipo ("cerveja", "drink", "pra dividir", "sem álcool"), sabores, divas ("drink da Anitta"),
 * negação ("sem bacon"), harmonização ("o que combina com coxinha?"),
 * "me surpreende", gírias (breja, cerva, rango) e erros de digitação.
 */
import { items, isDrink, minPrice, sectionById } from "../data/menu";
import { pairingsFor } from "../data/pairings";
import type { Item, SectionId, Tag } from "../data/types";
import { norm } from "./format";
import { itemsForTag } from "../data/tags";

export type ChipKind = "price" | "tag" | "concept" | "neg" | "sort" | "pair" | "note";
export interface Chip {
  k: ChipKind;
  label: string;
}
export interface Result {
  item: Item;
  score: number;
  why?: string;
}
export interface SearchOutput {
  chips: Chip[];
  results: Result[];
  relaxed: boolean;
  suggestion: string | null;
  pairFor?: Item;
  surprise?: boolean;
  allergy?: boolean;
}

const words = (s: string) =>
  norm(s)
    .replace(/[^a-z0-9$]+/g, " ")
    .split(" ")
    .filter(Boolean);

const STOP = new Set(
  (
    "de da do das dos com e o a os as um uma uns umas para pra pro pros que quero queria queremos gostaria algo alguma algum alguns " +
    "ate coisa coisas tem tenho voces vcs voce me mostra mostre mostrar ver opcao opcoes no na nos nas em por favor bem muito bom boa " +
    "gostoso gostosa delicioso deliciosa tipo so ai hoje agora aqui la isso esse essa quais qual como pode ser mais menos to estou " +
    "ou r$ reais real conto pila preco valor custa custando pessoa pessoas verdade oi ola mamadi bar cardapio menu tomar beber comer " +
    "vou vamos quer pedir peco pede traz traga manda mandar desce sai ve da um dois tres posso comprar compro gastar gasto levar borba aqui ali outro outra lugar bar do que mais"
  ).split(" "),
);

// conceito → seções / tags / termos
interface Concept {
  re: RegExp;
  label: string;
  sections?: SectionId[];
  tags?: Tag[];
  terms?: string[];
  kill?: RegExp;
}
const CONCEPTS: Concept[] = [
  { re: /\b(sem alcool|zero alcool|nao alcoolic[oa]s?|sem birita|nao bebo|de boa)\b/, label: "Sem álcool", tags: ["sem-alcool"] },
  { re: /\b(promo|promos|promocao|promocoes|oferta|ofertas|combo|combos|rodada)\b/, label: "Promoção", tags: ["promo"] },
  { re: /\b(novidade|novidades|novo|nova|novos|novas|lancamento|lancamentos)\b/, label: "Novidade", tags: ["novo"] },
  { re: /\b(vegan[oa]s?|vegan|plant based|sem carne|vegetarian[oa]s?|veggie)\b/, label: "Vegano", tags: ["vegano"], terms: ["vegana"] },
  { re: /\b(pra dividir|para dividir|dividir|compartilhar|galera|turma|mesa toda|pra mesa|amigos|amigas|grupo)\b/, label: "Pra dividir", tags: ["compartilhar", "serve2"] },
  { re: /\b(pra dois|para dois|a dois|casal|nos dois|2 pessoas|duas pessoas)\b/, label: "Pra dois", tags: ["serve2"] },
  { re: /\b(domingo)\b/, label: "Domingo", tags: ["domingo", "fds"] },
  { re: /\b(sabado|fim de semana|final de semana|fds)\b/, label: "Fim de semana", tags: ["fds"] },
  { re: /\b(divas?|pop|cantoras?|musica|hits?|pista)\b/, label: "Divas Pop", sections: ["divas"] },
  { re: /\b(cervejas?|breja|brejas|cerva|cervas|gelada|geladas|loira|loiras|chopp|chope|beer)\b/, label: "Cerveja", sections: ["cervejas"] },
  { re: /\b(copao|copoes|copo grande|copao de)\b/, label: "Copão", sections: ["copao"] },
  { re: /\b(drinks?|drinques?|coquete(l|is)|coquetel|caipis?|batida)\b/, label: "Drinks", sections: ["drinks", "divas", "copao"] },
  { re: /\b(doses?|shots?|dosinha|pinga|cachaca|cachacinha|branquinha|destilado)\b/, label: "Doses", sections: ["doses"] },
  { re: /\b(vinhos?|wine)\b/, label: "Vinho", terms: ["vinho"] },
  { re: /\b(petiscos?|porcao|porcoes|beliscar|tira gosto|tiragosto|aperitivo|aperitivos|entrada|entradinha)\b/, label: "Porções", sections: ["porcoes"] },
  { re: /\b(almoco|almocar|prato feito|pf|marmita|comida caseira|comidinhas?|caseir[oa]|executivo)\b/, label: "Comidinhas", sections: ["pratos"] },
  { re: /\b(lanches?|sanduiches?|sanduba|sandubas|burgers?|burguers?|hamburguer(es)?|hamburger|x burger|x burguer|xburger|xburguer|x bacon|x salada|x tudo)\b/, label: "Lanches", sections: ["lanches"] },
  { re: /\b(tabuas?)\b/, label: "Tábuas", sections: ["tabuas"] },
  { re: /\b(comida|comidas|comer|fome|rango|larica|matar a fome|janta|jantar)\b/, label: "Comida", sections: ["pratos", "porcoes", "lanches", "tabuas"] },
  { re: /\b(bebidas?|beber|tomar algo|bebe)\b/, label: "Bebida", sections: ["cervejas", "copao", "drinks", "divas", "doses", "prontos", "sem-alcool"] },
  { re: /\b(picante|apimentad[oa]|pimenta|ardid[oa])\b/, label: "Picante", terms: ["pimenta"] },
  { re: /\b(doce|doces|docinho|sobremesa|adocicad[oa])\b/, label: "Docinho", terms: ["licor", "bananinha", "mel", "soda"] },
  { re: /\b(energetico|energeticos|energy|pra ficar acordad[oa]|pilhad[oa])\b/, label: "Energético", terms: ["energetico", "monster", "red bull"] },
];

// sinônimos de termos soltos
const SYN: Record<string, string[]> = {
  fritas: ["batata"],
  litroes: ["litrao"],
  litrinho: ["litrao"],
  batatinha: ["batata"],
  aipim: ["mandioca"],
  macaxeira: ["mandioca"],
  espeto: ["espetinho"],
  churrasquinho: ["espetinho"],
  hamburguer: ["burger"],
  refri: ["refrigerante"],
  coca: ["refrigerante", "cuba"],
  guarana: ["refrigerante"],
  agua: ["agua"],
  caipirinha: ["caipiroska", "caipi"],
  caipiroska: ["caipirinha", "vodka"],
  caipi: ["caipirinha", "caipiroska"],
  vodca: ["vodka"],
  uisque: ["whisky"],
  wisky: ["whisky"],
  saque: ["sake"],
  mexerica: ["tangerina"],
  bergamota: ["tangerina"],
  mirtilo: ["blueberry"],
  limao: ["limao"],
  pastel: ["pasteis", "pastel"],
  pasteis: ["pastel"],
  coxinhas: ["coxinha"],
  linguica: ["linguica", "calabresa"],
  file: ["contra-file"],
  carne: ["carne", "contra-file", "churrasco", "burger"],
  frango: ["frango"],
  queijo: ["queijo", "catupiry", "cheddar", "parmesao", "coalho"],
  heineken: ["heineken"],
  bud: ["budweiser"],
  anita: ["anitta"],
  gaga: ["gaga"],
  beyonce: ["beyonce"],
  riri: ["rihanna"],
  pablo: ["pabllo"],
  sonza: ["sonza"],
};

const NUM_WORDS: Record<string, number> = {
  cinco: 5,
  dez: 10,
  doze: 12,
  treze: 13,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  vinte: 20,
  "vinte e cinco": 25,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100,
};

// ---------- índice ----------
interface Entry {
  it: Item;
  name: string[];
  kw: string[];
  sec: string[];
  opts: string[];
  desc: string[];
  diva: string[];
  all: string;
}
const W = { name: 6, kw: 4, diva: 5, sec: 3, opts: 2.6, desc: 1.6 } as const;

const INDEX: Entry[] = items.map((it) => {
  const sec = sectionById.get(it.section)!;
  const opts = (it.options ?? []).flatMap((g) => g.values).join(" ");
  return {
    it,
    name: words(it.name),
    kw: words((it.keywords ?? []).join(" ")),
    sec: words(`${sec.title} ${sec.short}`),
    opts: words(opts),
    desc: words(`${it.desc ?? ""} ${it.unit ?? ""}`),
    diva: words(it.diva ? `${it.diva.artist} ${it.diva.hook}` : ""),
    all: norm([it.name, it.desc, it.unit, opts, (it.keywords ?? []).join(" "), sec.title, it.diva?.artist].filter(Boolean).join(" | ")),
  };
});
const VOCAB = [...new Set(INDEX.flatMap((e) => [...e.name, ...e.kw, ...e.opts, ...e.diva]).filter((w) => w.length >= 3 && !/^\d+$/.test(w)))];

// ---------- distância de edição (Damerau-Levenshtein limitada) ----------
function dist(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] | null = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev2[j - 2] + 1);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}
const fuzzyMax = (t: string) => (t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0);

function wordScore(term: string, list: string[]) {
  let best = 0;
  for (const w of list) {
    if (w === term) return 1;
    if (term.length >= 3 && w.startsWith(term)) best = Math.max(best, 0.85);
    else if (term.length >= 4 && w.includes(term)) best = Math.max(best, 0.6);
    else if (w.length >= 4 && term.length >= 5 && term.startsWith(w)) best = Math.max(best, 0.72);
    else {
      const m = fuzzyMax(term);
      if (m && dist(term, w, m) <= m && (term[0] === w[0] || dist(term, w, 1) <= 1)) best = Math.max(best, 0.55);
    }
  }
  return best;
}

function termScore(term: string, e: Entry) {
  if (term.includes(" ")) {
    if (norm(e.it.name).includes(term)) return 7;
    return e.all.includes(term) ? 3 : 0;
  }
  let s = 0;
  for (const k of Object.keys(W) as (keyof typeof W)[]) {
    const v = wordScore(term, e[k]);
    if (v) s = Math.max(s, v * W[k]);
  }
  return s;
}

// ---------- limpeza da fala ----------
const CORR = /\b(?:na verdade|alias|ou melhor|quer dizer|melhor dizendo)\b/;
function clean(raw: string) {
  let q = " " + norm(raw).replace(/[“”"'?!.,;:¿¡…]+/g, " ").replace(/\s+/g, " ") + " ";
  if (CORR.test(q)) {
    const parts = q.split(new RegExp(CORR.source, "g")).map((x) => x.trim()).filter(Boolean);
    q = " " + (parts[parts.length - 1] ?? q) + " ";
  }
  for (const [w, n] of Object.entries(NUM_WORDS).sort((a, b) => b[0].length - a[0].length)) {
    q = q.replace(new RegExp(`\\b${w}\\b`, "g"), String(n));
  }
  q = q.replace(/\b(?:quais|qual)\s+(?:sao\s+)?(?:as\s+)?opcoes\s+de\b|\b(?:voces|vcs|voce)\s+(?:tem|teria|tem ai)\b|\b(?:eu\s+)?(?:quero|queria|gostaria de)\b|\bme\s+(?:ve|da|traz|manda)\b|\bo que (?:tem|voces tem) de\b/g, " ");
  return q.replace(/\s+/g, " ");
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ","));

// ---------- pedidos especiais ----------
const PAIR_RE = /\b(?:combina\w*|vai bem|harmoniza\w*|acompanha\w*|junto)\s+(?:com|pra|para|de)?\s*(?:o|a|os|as|um|uma|meu|minha|esse|essa)?\s*(.+)$/;
// "sugestão de drink pro baião", "bebida pra acompanhar churrasco", "cerveja pra coxinha"
const PAIR_RE2 = /\b(?:sugest\w*|indica\w*|recomenda\w*|drinks?|bebidas?|cervejas?|algo)\s+(?:de\s+\w+\s+)?(?:pro|pra|para)\s+(?:o|a|os|as)?\s*(.+)$/;
const SURPRISE_RE = /\b(me surpreend\w*|surpresa|sei la|escolhe pra mim|escolhe por mim|tanto faz|qualquer coisa|o que (?:voce|vc) (?:recomenda|indica|sugere)|recomenda(?:cao)?|indica(?:cao)?|sugestao da casa|aleatori\w*|roleta)\b/;
const ALLERGY_RE = /\b(gluten|lactose|alergi\w*|intoleran\w*|celiac\w*|amendoim|frutos do mar)\b/;

/** Item citado na frase (só quando o nome bate de verdade). */
function bestItem(q: string): Item | undefined {
  const out = run(q, { noSpecial: true });
  const r = out.results[0];
  return r && r.score >= 5 ? r.item : undefined;
}

function surprise(): SearchOutput {
  const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
  const drinks = items.filter((it) => isDrink(it) && (it.tags?.some((t) => t === "promo" || t === "novo" || t === "da-casa") ?? false));
  const foods = items.filter((it) => !isDrink(it) && !/^(extra-|maionese)/.test(it.id));
  const d = pick(drinks);
  const f = pick(foods.filter((x) => x.price || x.variants));
  const extra = pairingsFor(d).find((p) => p.item.id !== f.id)?.item;
  const results: Result[] = [
    { item: d, score: 3, why: "pra beber" },
    { item: f, score: 2, why: "pra comer" },
  ];
  if (extra) results.push({ item: extra, score: 1, why: "e pra acompanhar" });
  return { chips: [{ k: "note", label: "Sugestão da casa" }], results, relaxed: false, suggestion: null, surprise: true };
}

// ---------- busca ----------
export function search(raw: string, disabled: Set<string> = new Set()): SearchOutput {
  return run(raw, { disabled });
}

function run(raw: string, opts: { disabled?: Set<string>; noSpecial?: boolean }): SearchOutput {
  const disabled = opts.disabled ?? new Set<string>();
  // "#vegano", "#queijo": tags que pesquisam
  if (raw.trim().startsWith("#")) {
    const t = itemsForTag(raw.trim(), items);
    if (t) return { chips: [{ k: "tag", label: `#${t.label}` }], results: t.items.map((item) => ({ item, score: 1 })), relaxed: false, suggestion: null };
  }
  let q = clean(raw);
  const chips: Chip[] = [];
  const allergy = ALLERGY_RE.test(q);

  if (!opts.noSpecial) {
    if (SURPRISE_RE.test(q)) return surprise();
    const pm = q.match(PAIR_RE) ?? q.match(PAIR_RE2);
    if (pm && pm[1] && !disabled.has("pair")) {
      const target = bestItem(pm[1]);
      if (target) {
        const pairs = pairingsFor(target);
        return {
          chips: [{ k: "pair", label: `Combina com ${target.name}` }],
          results: [{ item: target, score: 9, why: "você pediu" }, ...pairs.map((p) => ({ item: p.item, score: 5, why: p.reason }))],
          relaxed: false,
          suggestion: null,
          pairFor: target,
        };
      }
    }
  }

  // preço
  let price: { min: number; max: number } | null = null;
  let sort: "asc" | "desc" | null = null;
  const PRICE: { re: RegExp; kind: "range" | "max" | "min" }[] = [
    { re: /\b(?:entre|de)\s*r?\$?\s*(\d+(?:[.,]\d+)?)\s*(?:e|a|ate|-)\s*r?\$?\s*(\d+(?:[.,]\d+)?)/, kind: "range" },
    { re: /\b(?:ate|abaixo de|menos de|maximo|no maximo|por ate|nao passa de|custando ate)\s*(?:de\s*)?r?\$?\s*(\d+(?:[.,]\d+)?)\s*(?:reais|conto|pila|real)?/, kind: "max" },
    { re: /\b(?:acima de|mais de|a partir de|minimo|pelo menos)\s*r?\$?\s*(\d+(?:[.,]\d+)?)/, kind: "min" },
    { re: /r\$\s*(\d+(?:[.,]\d+)?)|\b(\d+(?:[.,]\d+)?)\s*(?:reais|conto|contos|pila|real|pilas)\b/, kind: "max" },
  ];
  for (const p of PRICE) {
    const m = q.match(p.re);
    if (!m) continue;
    const n1 = parseFloat((m[1] ?? m[2] ?? "0").replace(",", "."));
    let label: string;
    if (p.kind === "range") {
      const n2 = parseFloat(m[2].replace(",", "."));
      price = { min: Math.min(n1, n2) * 100, max: Math.max(n1, n2) * 100 };
      label = `R$ ${fmt(Math.min(n1, n2))} a ${fmt(Math.max(n1, n2))}`;
    } else if (p.kind === "max") {
      price = { min: 0, max: n1 * 100 };
      label = `até R$ ${fmt(n1)}`;
    } else {
      price = { min: n1 * 100, max: Infinity };
      label = `a partir de R$ ${fmt(n1)}`;
    }
    q = q.replace(m[0], " ");
    if (disabled.has(label)) price = null;
    else chips.push({ k: "price", label });
    break;
  }
  if (/\bmais barat[oa]s?\b|\bmenor preco\b|\bbaratinh[oa]s?\b/.test(q)) {
    sort = "asc";
    q = q.replace(/\bmais barat[oa]s?\b|\bmenor preco\b|\bbaratinh[oa]s?\b/g, " ");
  }
  if (/\bbarat[oa]s?\b|\bem conta\b|\beconomic[oa]s?\b|\bpouco dinheiro\b|\bliso\b|\blisa\b|\bduro\b|\bdura\b/.test(q)) {
    if (!price && !disabled.has("até R$ 15")) {
      price = { min: 0, max: 1500 };
      chips.push({ k: "price", label: "até R$ 15" });
    }
    sort = sort ?? "asc";
    q = q.replace(/\bbarat[oa]s?\b|\bem conta\b|\beconomic[oa]s?\b|\bpouco dinheiro\b|\bliso\b|\blisa\b|\bduro\b|\bdura\b/g, " ");
  }
  if (/\bmais car[oa]s?\b|\bcaprichad[oa]\b|\bpremium\b/.test(q)) {
    sort = "desc";
    q = q.replace(/\bmais car[oa]s?\b|\bcaprichad[oa]\b|\bpremium\b/g, " ");
  }
  if (sort) chips.push({ k: "sort", label: sort === "asc" ? "Mais em conta primeiro" : "Mais caprichados primeiro" });

  // conceitos
  const groups: { label: string; sections?: SectionId[]; tags?: Tag[]; terms?: string[] }[] = [];
  const tagFilters: { label: string; tags: Tag[] }[] = [];
  for (const c of CONCEPTS) {
    if (!c.re.test(q)) continue;
    q = q.replace(new RegExp(c.re.source, "g"), " ");
    if (disabled.has(c.label)) continue;
    chips.push({ k: c.tags && !c.sections ? "tag" : "concept", label: c.label });
    if (c.tags && !c.sections && !c.terms) tagFilters.push({ label: c.label, tags: c.tags });
    else groups.push({ label: c.label, sections: c.sections, tags: c.tags, terms: c.terms });
  }

  // negação: "sem bacon"
  const neg: string[] = [];
  q = q.replace(/\bsem\s+([a-z]{3,})\b/g, (_, w: string) => {
    if (!disabled.has(`sem ${w}`)) {
      neg.push(w);
      chips.push({ k: "neg", label: `sem ${w}` });
    }
    return " ";
  });

  // termos que sobraram
  const terms = q
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t) && !/^\d+$/.test(t) && t.length > 1);
  const termGroups = terms.map((t) => ({ label: t, alts: [t, ...(SYN[t] ?? []).map(norm)] }));
  const phrase = terms.length > 1 ? terms.join(" ") : "";

  if (allergy) chips.push({ k: "note", label: "Alergias: confirme com a equipe" });

  const hasAny = groups.length || termGroups.length || tagFilters.length || price || neg.length || sort;
  if (!hasAny) return { chips, results: [], relaxed: false, suggestion: null, allergy };

  const strict: Result[] = [];
  const loose: Result[] = [];
  for (const e of INDEX) {
    const it = e.it;
    if (price) {
      const p = minPrice(it);
      if (!p || p < price.min || p > price.max) continue;
    }
    if (tagFilters.length && !tagFilters.every((f) => f.tags.some((t) => it.tags?.includes(t)) || (f.label === "Vegano" && /vegan/.test(e.all)))) continue;
    if (neg.length && neg.some((w) => e.all.includes(w))) continue;
    // extras e copos só aparecem quando pedidos pelo nome
    const isExtra = /^(copo-|extra-|maionese|shot-limao)/.test(it.id);

    let total = 0;
    let matched = 0;
    const need = groups.length + termGroups.length;
    for (const g of groups) {
      let s = 0;
      if (g.sections?.includes(it.section)) s = 3;
      if (g.tags && g.tags.some((t) => it.tags?.includes(t))) s = Math.max(s, 3);
      if (g.terms) for (const t of g.terms) s = Math.max(s, termScore(t, e) * 0.8);
      if (s > 0) {
        matched++;
        total += s;
      }
    }
    for (const g of termGroups) {
      let best = 0;
      for (const a of g.alts) best = Math.max(best, termScore(a, e));
      if (best > 0) {
        matched++;
        total += best;
      }
    }
    if (phrase && norm(it.name).includes(phrase)) total += 8;
    if (isExtra && !termGroups.length) continue;
    if (!need) {
      strict.push({ item: it, score: 1 });
      continue;
    }
    if (matched === need) strict.push({ item: it, score: total });
    else if (matched >= Math.max(1, Math.ceil(need / 2)) && termGroups.length) loose.push({ item: it, score: total - 3 });
  }

  let relaxed = false;
  let list = strict;
  // quando há resultados fortes (nome bate), corta os que só bateram de raspão
  const top = Math.max(0, ...list.map((r) => r.score));
  if (top >= 4.5) list = list.filter((r) => r.score >= top * 0.55);
  if (!strict.length && loose.length) {
    list = loose;
    relaxed = true;
  }
  if (sort === "asc") list.sort((a, b) => minPrice(a.item) - minPrice(b.item) || b.score - a.score);
  else if (sort === "desc") list.sort((a, b) => minPrice(b.item) - minPrice(a.item) || b.score - a.score);
  else if (price && !termGroups.length) list.sort((a, b) => b.score - a.score || minPrice(a.item) - minPrice(b.item));
  else list.sort((a, b) => b.score - a.score);

  let suggestion: string | null = null;
  if (!list.length && termGroups.length) {
    let s = norm(raw);
    let changed = false;
    for (const g of termGroups) {
      let best: string | null = null;
      let bd = 99;
      for (const v of VOCAB) {
        const d = dist(g.label, v, 3);
        if (d < bd || (d === bd && best && v.length < best.length)) {
          bd = d;
          best = v;
        }
      }
      if (best && bd <= Math.max(2, Math.floor(g.label.length / 3)) && best !== g.label) {
        s = s.replace(g.label, best);
        changed = true;
      }
    }
    if (changed) suggestion = s;
  }

  return { chips, results: list.slice(0, 40), relaxed, suggestion, allergy };
}

/** Exemplos que aparecem na busca vazia (e no letreiro digitando da abertura). */
export const EXAMPLES = [
  "O que tem de mais barato do que na Borba?",
  "O que posso comprar até R$20?",
  "drink da Anitta",
  "o que combina com coxinha?",
  "tem coisa vegana?",
  "pra dividir com a galera",
  "me surpreende",
];
