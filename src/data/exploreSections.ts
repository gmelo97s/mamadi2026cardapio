/** Imagens curadas a partir dos melhores cards do cardápio Mamadi. */
const EXPLORE_SECTION_IMAGES: Record<string, string> = {
  dividir:
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900276/porcoespo03-batata-cheddar-bacon.png_jxh3x4.png",
  economizar:
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326067/bhmojdxieygtmeunnhjh.jpg",
  "matar-fome":
    "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326089/gsc9sda3vlwbxl9knizd.jpg",
  "beber-feliz":
    "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr11-caipirinha-da-mamadi.jpg",
  "so-pros-fortes":
    "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr10-cuba-libre.jpg",
  "abriu-bebeu":
    "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr01-skol-beats.jpg",
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
  {
    id: "so-pros-fortes",
    label: "Só pros fortes...",
    tag: "FORTE",
    description: "Drinks potentes e combos pra quem gosta de ir com tudo.",
    image: EXPLORE_SECTION_IMAGES["so-pros-fortes"],
    categoryIds: ["drinks", "combos"],
  },
  {
    id: "abriu-bebeu",
    label: "Abriu bebeu",
    tag: "OPEN BAR",
    description: "Prontos, drinks, cerveja, copão e combo — já era!",
    image: EXPLORE_SECTION_IMAGES["abriu-bebeu"],
    categoryIds: ["prontos", "drinks", "cervejas", "combos"],
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
