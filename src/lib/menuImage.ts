import type { Category, MenuItem } from "../data/menu";

/** URLs que ainda não foram trocadas por imagens reais do cliente. */
const PLACEHOLDER_PATTERNS = [/picsum\.photos/i, /\/generated-menu\//i];

export function isCustomMenuImage(src: string | undefined | null): src is string {
  if (!src?.trim()) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(src));
}

/** Imagem do card Tinder: só item customizado, ou capa da categoria quando não há item. */
export function resolveSwipeCardImage(
  item: MenuItem | null,
  category: Category,
): string | null {
  if (item?.image && isCustomMenuImage(item.image)) {
    return item.image;
  }

  if (!item) {
    const fallback = category.cardImage ?? category.coverImage;
    if (fallback && isCustomMenuImage(fallback)) {
      return fallback;
    }
  }

  return null;
}

export function resolveProductCardImage(item: MenuItem): string | null {
  return isCustomMenuImage(item.image) ? item.image : null;
}

/** Placeholder por categoria — troque os PNGs em public/generated-menu/categories/ */
const EXPLORE_CATEGORY_IMAGES: Record<string, string> = {
  drinks: "/generated-menu/categories/cat-drinks-card.png",
  destilados: "/generated-menu/categories/cat-destilados-card.png",
  cervejas: "/generated-menu/categories/cat-cervejas-card.png",
  prontos: "/generated-menu/categories/cat-prontos-card.png",
  combos: "/generated-menu/categories/cat-combos-card.png",
  porcoes: "/generated-menu/categories/cat-porcoes-card.png",
  lanches: "/generated-menu/categories/cat-lanches-card.png",
  menu: "/generated-menu/categories/cat-menu-card.png",
};

export function resolveExploreCategoryImage(category: Category): string {
  if (category.cardImage?.trim()) return category.cardImage;
  return EXPLORE_CATEGORY_IMAGES[category.id] ?? "";
}

/** Imagem do card Explorar — inclui placeholders gerados para substituição futura. */
export function resolveExploreItemImage(item: MenuItem): string | null {
  return item.image?.trim() || null;
}
