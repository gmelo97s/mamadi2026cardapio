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
