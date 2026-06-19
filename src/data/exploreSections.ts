/** Imagens curadas via Unsplash — substitua por assets locais em public/explore-sections/ se preferir. */
const EXPLORE_SECTION_IMAGES: Record<string, string> = {
  dividir:
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80&auto=format&fit=crop",
  economizar:
    "https://images.unsplash.com/photo-1608270575622-70caf0a9528d?w=800&q=80&auto=format&fit=crop",
  "matar-fome":
    "https://images.unsplash.com/photo-1568901346735-4efe35964925?w=800&q=80&auto=format&fit=crop",
  "beber-feliz":
    "https://images.unsplash.com/photo-1514362545857-3bc16ae4a932?w=800&q=80&auto=format&fit=crop",
  "so-pros-fortes":
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80&auto=format&fit=crop",
  "abriu-bebeu":
    "https://images.unsplash.com/photo-1436073163999-0ca3ce295be2?w=800&q=80&auto=format&fit=crop",
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
    tag: "DESTILADOS",
    description: "Doses e garrafas pra quem gosta de ir com tudo.",
    image: EXPLORE_SECTION_IMAGES["so-pros-fortes"],
    categoryIds: ["destilados"],
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
