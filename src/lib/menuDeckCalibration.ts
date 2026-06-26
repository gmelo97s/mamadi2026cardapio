import type { MenuItem } from "../data/menu";

/** Calibração visual do deck — referência: garrafa Brahma litrão (ce01) = pack scale 1.0 */
export type DeckCalibration = Pick<
  MenuItem,
  "imageBlend" | "imageFit" | "imageScale" | "imagePackY"
>;

const P = {
  litrao: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1, imagePackY: 4 },
  garrafa600: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.05, imagePackY: 4 },
  longNeck: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.08, imagePackY: 4 },
  pack3Garrafa: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.02, imagePackY: 4 },
  pack3Litrao: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1, imagePackY: 4 },
  mamadiPackV2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1, imagePackY: 4 },
  copo300V2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.88, imagePackY: 3 },
  copoSaboresV2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.9, imagePackY: 3 },
  copo3PackV2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.88, imagePackY: 3 },
  v2502Bucket: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.82, imagePackY: 5 },
  v2502Copo1: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.78, imagePackY: 5 },
  v2502CopoMulti: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.8, imagePackY: 5 },
  v2502Copo2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.78, imagePackY: 5 },
  v2502Lanche: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.9, imagePackY: 5 },
  v2502Prato: { imageBlend: "dark" as const, imageFit: "wide" as const, imageScale: 0.82, imagePackY: -2 },
  v2502PratoCentro: { imageBlend: "dark" as const, imageFit: "wide" as const, imageScale: 0.8, imagePackY: -3 },
  v2502PackCentro: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.82, imagePackY: 5 },
  v2502Lata: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.88, imagePackY: 5 },
  /** Burgers altos — lote v1782506917 */
  v6917Burger: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.84, imagePackY: 4 },
  /** fundo_preto — produto pequeno no canvas, escala contida */
  fundoPretoPack: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.95, imagePackY: 5 },
  copoDrink: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.05, imagePackY: 4 },
  copoCopao: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.88, imagePackY: 5 },
  dose: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.05, imagePackY: 4 },
  garrafaDose: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.02, imagePackY: 4 },
  vinho: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1, imagePackY: 4 },
  prato: { imageBlend: "dark" as const, imageFit: "wide" as const, imageScale: 0.95, imagePackY: 0 },
  porcaoVert: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.95, imagePackY: 3 },
};

export const DECK_CALIBRATION: Record<string, DeckCalibration> = {
  // ── Drinks ──
  dr01: P.copoDrink,
  dr02: P.v2502Copo1,
  dr03: P.v2502Copo1,
  dr04: P.v2502Copo1,
  dr05: P.v2502CopoMulti,
  dr06: P.v2502Copo1,
  dr07: P.v2502Copo2,
  dr08: P.copoDrink,
  dr09: P.copoDrink,
  dr10: P.copoDrink,
  dr11: P.v2502Copo1,
  dr12: P.v2502Copo1,
  dr13: P.v2502Copo2,

  // ── Destilados ──
  de01: P.dose,
  de02: P.dose,
  de03: P.dose,
  de04: P.dose,
  de05: { ...P.copoDrink, imageScale: 1.02 },
  de06: P.dose,
  de08: P.garrafaDose,
  de10: P.dose,
  de11: P.garrafaDose,
  de12: P.garrafaDose,
  de13: P.garrafaDose,
  de14: P.garrafaDose,
  de15: { ...P.garrafaDose, imageScale: 1.05 },
  de16: P.garrafaDose,
  de17: P.garrafaDose,
  de18: P.garrafaDose,
  de19: P.vinho,
  de20: P.vinho,

  // ── Cervejas ──
  ce01: P.litrao,
  ce02: P.litrao,
  ce03: P.litrao,
  ce04: P.litrao,
  ce05: P.litrao,
  ce06: P.litrao,
  ce09: P.garrafa600,
  ce16: P.longNeck,

  // ── Abrir e Beber ──
  pr01: { imageBlend: "dark", imageFit: "pack", imageScale: 0.95, imagePackY: 5 },
  pr02: { imageBlend: "dark", imageFit: "pack", imageScale: 0.95, imagePackY: 5 },
  pr03: P.fundoPretoPack,
  pr04: P.fundoPretoPack,
  pr05: { ...P.fundoPretoPack, imageScale: 0.92 },
  pr06: { imageBlend: "dark", imageFit: "pack", imageScale: 0.78, imagePackY: 5 },
  pr07: { imageBlend: "dark", imageFit: "pack", imageScale: 0.95, imagePackY: 5 },
  pr08: { imageBlend: "dark", imageFit: "pack", imageScale: 0.88, imagePackY: 5 },
  pr09: { imageBlend: "dark", imageFit: "pack", imageScale: 0.9, imagePackY: 5 },
  pr10: { ...P.fundoPretoPack, imageScale: 0.92 },
  pr11: { ...P.fundoPretoPack, imageScale: 0.9 },
  pr12: { ...P.v2502Lata, imageScale: 0.95, imagePackY: 5 },
  pr13: { imageBlend: "dark", imageFit: "pack", imageScale: 0.88, imagePackY: 5 },
  pr14: { ...P.fundoPretoPack, imageScale: 0.9 },
  pr15: { imageBlend: "dark", imageFit: "pack", imageScale: 0.92, imagePackY: 5 },
  pr16: { ...P.fundoPretoPack, imageScale: 0.88 },

  // ── Combos ──
  co01: P.v2502CopoMulti,
  co02: P.v2502Copo2,
  co03: P.v2502Copo2,
  co05: P.v2502Copo2,
  co06: P.v2502Bucket,
  co07: P.v2502Bucket,
  co08: P.mamadiPackV2,
  co09: P.mamadiPackV2,
  co10: P.v2502Bucket,
  co11: P.mamadiPackV2,
  co12: P.v2502Copo2,

  // ── Porções ──
  po01: { ...P.porcaoVert, imageScale: 0.88, imagePackY: 2 },
  po02: P.prato,
  po03: P.prato,
  po11: P.v2502PratoCentro,
  po04: P.v2502PratoCentro,
  po05: P.prato,
  po07: { ...P.porcaoVert, imageScale: 0.9, imagePackY: 2 },
  po09: { ...P.porcaoVert, imageScale: 0.92, imagePackY: 2 },
  po10: P.v2502PratoCentro,

  // ── Tábuas ──
  ta01: P.prato,
  ta02: P.v2502PratoCentro,
  ta03: P.v2502PratoCentro,
  ta04: P.v2502PratoCentro,

  // ── Lanches & Burgers ──
  la01: P.v2502Lanche,
  la02: P.v2502Lanche,
  la03: P.v2502Lanche,
  la04: P.v2502Lanche,
  bu01: P.v2502Lanche,
  bu02: P.v6917Burger,
  bu03: P.v6917Burger,

  // ── Menu Mamadi ──
  me01: P.v2502PackCentro,
  me02: P.v2502PratoCentro,
  me03: P.prato,
  me04: P.prato,
  me05: P.prato,

  // ── Super Promos ──
  sl01: P.v2502PratoCentro,
  sl02: P.v2502Copo2,
  sl03: P.v2502Copo2,
  sl04: P.v2502CopoMulti,
  sl05: P.mamadiPackV2,
  sl06: P.mamadiPackV2,
  sl07: P.mamadiPackV2,
  sl08: P.v2502Copo2,
  sl09: P.v2502PratoCentro,
  sl10: P.v2502Copo1,
  sl11: P.v2502Copo2,
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
