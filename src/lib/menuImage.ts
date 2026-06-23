import type { Category, MenuItem } from "../data/menu";

/** URLs que ainda não foram trocadas por imagens reais do cliente. */
const PLACEHOLDER_PATTERNS = [/picsum\.photos/i, /\/generated-menu\//i];

export type MenuImageSize = "thumb" | "card" | "full";

const IMAGE_WIDTH: Record<MenuImageSize, number> = {
  thumb: 480,
  card: 720,
  full: 960,
};

/** Cloudinary: formato automático, qualidade adaptativa e largura máxima por contexto. */
export function optimizeMenuImageUrl(
  src: string | null | undefined,
  size: MenuImageSize = "card",
): string | null {
  const trimmed = src?.trim();
  if (!trimmed) return null;

  if (
    trimmed.includes("res.cloudinary.com") &&
    trimmed.includes("/image/upload/") &&
    !/f_auto|q_auto/.test(trimmed)
  ) {
    const width = IMAGE_WIDTH[size];
    return trimmed.replace("/image/upload/", `/image/upload/f_auto,q_auto:good,w_${width}/`);
  }

  return trimmed;
}

function optimizeItemImage(item: MenuItem, size: MenuImageSize): string | null {
  return optimizeMenuImageUrl(item.image, size);
}

export function isCustomMenuImage(src: string | undefined | null): src is string {
  if (!src?.trim()) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(src));
}

/** Classes CSS para integrar produto ao fundo preto (#000) do card. */
export function resolveProductImageClasses(
  item: MenuItem | null,
  baseClass: string,
): string {
  if (!item || !isCustomMenuImage(item.image)) return baseClass;
  const blend = item.imageBlend === "light" ? "light" : "dark";
  return `${baseClass} ${baseClass}--product ${baseClass}--product-${blend}`;
}

/** Imagem do card Tinder: só item customizado, ou capa da categoria quando não há item. */
export function resolveSwipeCardImage(
  item: MenuItem | null,
  category: Category,
): string | null {
  if (item?.image && isCustomMenuImage(item.image)) {
    return optimizeItemImage(item, "card");
  }

  if (!item) {
    const fallback = category.cardImage ?? category.coverImage;
    if (fallback && isCustomMenuImage(fallback)) {
      return optimizeMenuImageUrl(fallback, "card");
    }
  }

  return null;
}

export function resolveProductCardImage(item: MenuItem): string | null {
  if (!isCustomMenuImage(item.image)) return null;
  return optimizeItemImage(item, "thumb");
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
  if (category.cardImage?.trim()) {
    return optimizeMenuImageUrl(category.cardImage, "thumb") ?? category.cardImage;
  }
  return EXPLORE_CATEGORY_IMAGES[category.id] ?? "";
}

/** Imagem do card Explorar — inclui placeholders gerados para substituição futura. */
export function resolveExploreItemImage(item: MenuItem): string | null {
  const src = item.image?.trim();
  if (!src) return null;
  if (isCustomMenuImage(src)) {
    return optimizeMenuImageUrl(src, "thumb");
  }
  return src;
}

/** Pré-carrega imagens adjacentes no deck para troca instantânea. */
export function preloadMenuImages(urls: Array<string | null | undefined>): void {
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
}

export function preloadAdjacentDeckImages(
  items: MenuItem[],
  index: number,
  category: Category,
): void {
  const offsets = [1, 2, -1];
  const urls = offsets
    .map((offset) => items[index + offset])
    .filter(Boolean)
    .map((item) => resolveSwipeCardImage(item!, category));

  preloadMenuImages(urls);
}
