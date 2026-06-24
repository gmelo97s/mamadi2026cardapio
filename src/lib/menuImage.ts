import type { CSSProperties } from "react";
import type { Category, MenuItem } from "../data/menu";
import { applyDeckCalibration } from "./menuDeckCalibration";

/** URLs que ainda não foram trocadas por imagens reais do cliente. */
const PLACEHOLDER_PATTERNS = [/picsum\.photos/i, /\/generated-menu\//i];

export type MenuImageSize = "thumb" | "card" | "full";

const IMAGE_WIDTH: Record<MenuImageSize, number> = {
  thumb: 480,
  card: 1200,
  full: 1200,
};

/** Imagens já em canvas 1200×1500 — não reaplicar c_pad (evita blur e barras). */
function isPreprocessedDeckImage(src: string): boolean {
  return (
    src.includes("fundo_preto/") ||
    /\/v1782326\d+\//.test(src) ||
    src.includes("b_rgb:000000") ||
    /\/v178190027[0-9]\//.test(src) ||
    /\/v1781895[0-9]{3}\//.test(src) ||
    /\/v1781893643\//.test(src)
  );
}

/** Cloudinary: formato automático, qualidade máxima no deck. */
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
    const preprocessed = isPreprocessedDeckImage(trimmed);
    const height = size === "card" && !preprocessed ? Math.round(width * 1.25) : undefined;
    const canvas =
      size === "card" && !preprocessed
        ? `b_rgb:000000,c_pad,g_center,w_${width},h_${height},`
        : "";
    const quality = size === "card" ? "q_auto:best" : "q_auto:good";
    return trimmed.replace(
      "/image/upload/",
      `/image/upload/${canvas}f_auto,${quality},w_${width}/`,
    );
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

/** Classes do deck swipe — suporta pratos largos, pack e escala unificada. */
export function resolveSwipeProductImageClasses(item: MenuItem | null): string {
  const calibrated = applyDeckCalibration(item);
  const base = "category-swipe-card__media-cover";
  if (!calibrated || !isCustomMenuImage(calibrated.image)) return base;
  const blend = calibrated.imageBlend === "light" ? "light" : "dark";
  const wide = calibrated.imageFit === "wide" ? ` ${base}--product-wide` : "";
  const pack = calibrated.imageFit === "pack" ? ` ${base}--product-pack` : "";
  const scaled =
    calibrated.imageScale != null && calibrated.imageFit !== "pack" && calibrated.imageFit !== "wide"
      ? ` ${base}--product-scaled`
      : "";
  return `${base} ${base}--product ${base}--product-${blend}${wide}${pack}${scaled}`;
}

/** Deslocamento vertical padrão no deck pack conforme a escala. */
function resolvePackOffsetY(scale: number, explicit?: number): number {
  if (explicit != null) return explicit;
  if (scale >= 2.4) return 6;
  if (scale >= 2) return 5;
  if (scale >= 1.6) return 5;
  return 4;
}

/** Escala CSS no deck — pack, wide e default calibrados. */
export function resolveSwipeProductImageStyle(
  item: MenuItem | null,
): CSSProperties | undefined {
  const calibrated = applyDeckCalibration(item);
  if (!calibrated) return undefined;

  const scale =
    calibrated.imageScale ??
    (calibrated.imageFit === "pack" ? 1 : calibrated.imageFit === "wide" ? 1.08 : undefined);

  if (scale == null) return undefined;

  const y = resolvePackOffsetY(scale, calibrated.imagePackY);
  return {
    ["--product-pack-scale" as string]: String(scale),
    ["--product-pack-y" as string]: `${y}%`,
  };
}

/** Imagem do card Tinder: só item customizado, ou capa da categoria quando não há item. */
export function resolveSwipeCardImage(
  item: MenuItem | null,
  category: Category,
): string | null {
  const calibrated = applyDeckCalibration(item);
  if (calibrated?.image && isCustomMenuImage(calibrated.image)) {
    return optimizeItemImage(calibrated, "card");
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

export function resolveExploreSectionImage(src: string): string {
  const trimmed = src?.trim();
  if (!trimmed) return "";
  return optimizeMenuImageUrl(trimmed, "card") ?? trimmed;
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
