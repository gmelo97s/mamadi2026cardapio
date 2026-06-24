import type { MenuItem } from "../data/menu";

/** Calibração visual do deck — referência: garrafa Brahma litrão (ce01) = pack scale 1.0 */
export type DeckCalibration = Pick<
  MenuItem,
  "imageBlend" | "imageFit" | "imageScale" | "imagePackY"
>;

const P = {
  litrao: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1, imagePackY: 4 },
  garrafa600: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.18, imagePackY: 4 },
  longNeck: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.42, imagePackY: 4 },
  pack3Garrafa: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.1, imagePackY: 4 },
  pack3Litrao: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.05, imagePackY: 4 },
  copoDrink: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.52, imagePackY: 4 },
  copoCopao: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.24, imagePackY: 4 },
  dose: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.62, imagePackY: 4 },
  garrafaDose: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.55, imagePackY: 4 },
  vinho: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.38, imagePackY: 4 },
  prato: { imageBlend: "dark" as const, imageFit: "wide" as const, imageScale: 1.1, imagePackY: 2 },
  porcaoVert: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.38, imagePackY: 3 },
  lanche: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.5, imagePackY: 3 },
};

export const DECK_CALIBRATION: Record<string, DeckCalibration> = {
  // ── Drinks ──
  dr02: P.copoDrink,
  dr03: P.copoDrink,
  dr04: P.copoDrink,
  dr06: P.copoDrink,
  dr08: P.copoDrink,
  dr09: P.copoDrink,
  dr10: P.copoDrink,
  dr11: P.copoDrink,

  // ── Cervejas ──
  ce01: P.litrao,
  ce02: P.litrao,
  ce03: P.litrao,
  ce04: P.litrao,
  ce05: P.litrao,
  ce06: P.litrao,
  ce09: P.garrafa600,
  ce16: P.longNeck,

  // ── Abrir e Beber (ajustes finos sobre valores do menu) ──
  pr01: { imageBlend: "dark", imageFit: "pack", imageScale: 1.28, imagePackY: 4 },
  pr02: { imageBlend: "dark", imageFit: "pack", imageScale: 1.28, imagePackY: 4 },
  pr03: { imageBlend: "dark", imageFit: "pack", imageScale: 2.55, imagePackY: 6 },
  pr04: { imageBlend: "dark", imageFit: "pack", imageScale: 2.25, imagePackY: 5 },
  pr05: { imageBlend: "dark", imageFit: "pack", imageScale: 1.95, imagePackY: 4 },
  pr06: { imageBlend: "dark", imageFit: "pack", imageScale: 1.05, imagePackY: 4 },
  pr07: { imageBlend: "dark", imageFit: "pack", imageScale: 1.18, imagePackY: 4 },
  pr08: { imageBlend: "dark", imageFit: "pack", imageScale: 1.12, imagePackY: 4 },
  pr09: { imageBlend: "dark", imageFit: "pack", imageScale: 1.1, imagePackY: 4 },
  pr10: { imageBlend: "dark", imageFit: "pack", imageScale: 1.45, imagePackY: 4 },
  pr11: { imageBlend: "dark", imageFit: "pack", imageScale: 1.5, imagePackY: 4 },
  pr12: { imageBlend: "dark", imageFit: "pack", imageScale: 1.38, imagePackY: 4 },
  pr13: { imageBlend: "dark", imageFit: "pack", imageScale: 1.38, imagePackY: 4 },
  pr14: { imageBlend: "dark", imageFit: "pack", imageScale: 2.35, imagePackY: 5 },
  pr15: { imageBlend: "dark", imageFit: "pack", imageScale: 1.2, imagePackY: 4 },
  pr16: { imageBlend: "dark", imageFit: "pack", imageScale: 1.85, imagePackY: 5 },

  // ── Combos ──
  co07: P.pack3Garrafa,
  co08: P.pack3Garrafa,
  co09: P.pack3Litrao,
  co10: P.pack3Litrao,
  co11: P.pack3Litrao,

  // ── Porções ──
  po01: P.porcaoVert,
  po02: { ...P.prato, imageScale: 1.12 },
  po03: { ...P.prato, imageScale: 1.12 },
  po04: P.prato,
  po05: P.prato,
  po06: P.prato,
  po07: { ...P.porcaoVert, imageScale: 1.35 },
  po09: { ...P.porcaoVert, imageScale: 1.45 },
  po10: P.prato,

  // ── Tábuas ──
  ta01: P.prato,
  ta02: P.prato,
  ta03: P.prato,
  ta04: P.prato,

  // ── Lanches & Burgers ──
  la01: P.lanche,
  la02: P.lanche,
  la03: P.lanche,
  la04: P.lanche,
  bu02: P.lanche,
  bu03: P.lanche,

  // ── Menu Mamadi ──
  me01: P.prato,
  me02: P.prato,
  me03: P.prato,
  me04: P.prato,
  me05: P.prato,

  // ── Super Like ──
  sl01: P.prato,
  sl05: P.pack3Litrao,
  sl06: P.pack3Garrafa,
  sl07: P.pack3Litrao,
};

export function applyDeckCalibration(item: MenuItem | null): MenuItem | null {
  if (!item) return null;
  const cal = DECK_CALIBRATION[item.id];
  if (!cal) return item;
  return {
    ...item,
    imageBlend: cal.imageBlend ?? item.imageBlend,
    imageFit: cal.imageFit ?? item.imageFit,
    imageScale: cal.imageScale ?? item.imageScale,
    imagePackY: cal.imagePackY ?? item.imagePackY,
  };
}
