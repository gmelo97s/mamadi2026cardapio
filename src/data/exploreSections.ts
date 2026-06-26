/** Capas da aba Explorar — imagens dos melhores cards do cardápio. */
const EXPLORE_SECTION_IMAGES: Record<string, string> = {
  dividir:
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502479/t_abua_mista_bbiu5x.png",
  economizar:
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781893643/cervejasce01-brahma-chopp-litrao.png_zyeftc.png",
  "matar-fome":
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502468/lanche_de_calabresa_l6vaeq.png",
  "beber-feliz":
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502482/caipirinha_sabores_copo_500ml_fnpwvt.png",
};

export interface ExploreSection {
  id: string;
  label: string;
  tag: string;
  description: string;
  image: string;
  categoryIds: string[];
}

/** Seções curadas da aba Explorar — estilo Tinder. */
export const exploreSections: ExploreSection[] = [
  {
    id: "dividir",
    label: "Para dividir",
    tag: "PORÇÕES",
    description: "Petiscos, batatas e tábuas pra compartilhar com a galera.",
    image: EXPLORE_SECTION_IMAGES.dividir,
    categoryIds: ["porcoes"],
  },
  {
    id: "economizar",
    label: "Economizar",
    tag: "PROMO",
    description: "Combos, cerveja e drinks com o melhor custo-benefício.",
    image: EXPLORE_SECTION_IMAGES.economizar,
    categoryIds: ["porcoes", "combos", "cervejas", "drinks"],
  },
  {
    id: "matar-fome",
    label: "Matar a fome",
    tag: "COMIDA",
    description: "Lanches, menu Mamadi e porções pra saciar de verdade.",
    image: EXPLORE_SECTION_IMAGES["matar-fome"],
    categoryIds: ["lanches", "menu", "porcoes"],
  },
  {
    id: "beber-feliz",
    label: "Beber feliz",
    tag: "DRINKS",
    description: "Drinks clássicos e cervejas geladas pro happy hour.",
    image: EXPLORE_SECTION_IMAGES["beber-feliz"],
    categoryIds: ["drinks", "cervejas"],
  },
];

export function getExploreSection(id: string): ExploreSection | undefined {
  return exploreSections.find((section) => section.id === id);
}

export function countExploreSectionItems(
  section: ExploreSection,
  itemsByCategory: Record<string, unknown[]>,
): number {
  return section.categoryIds.reduce(
    (total, categoryId) => total + (itemsByCategory[categoryId]?.length ?? 0),
    0,
  );
}

export function formatExploreSectionCount(count: number): string {
  if (count >= 1000) {
    const thousands = count / 1000;
    const rounded = Math.round(thousands * 10) / 10;
    return Number.isInteger(rounded)
      ? `${rounded} mil`
      : `${rounded.toString().replace(".", ",")} mil`;
  }
  return String(count);
}
