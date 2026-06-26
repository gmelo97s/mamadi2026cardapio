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
  /** Referência ideal — lote v1782488 (balde Mamadi, ex.: co09) */
  mamadiPackV2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.05, imagePackY: 4 },
  /** Copo único 300ml — lote v1782488 */
  copo300V2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.96, imagePackY: 2 },
  /** Caipirinha sabores — composição múltipla, lote v1782488 */
  copoSaboresV2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.03, imagePackY: 3 },
  /** Pack 3 copos — lote v1782491 */
  copo3PackV2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.0, imagePackY: 2 },
  /** Lote v1782502 — contido, centralizado, abaixo do topo do card */
  v2502Bucket: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.88, imagePackY: 7 },
  v2502Copo1: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.82, imagePackY: 7 },
  v2502CopoMulti: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.84, imagePackY: 7 },
  v2502Copo2: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.82, imagePackY: 7 },
  v2502Lanche: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 1.02, imagePackY: 7 },
  v2502Prato: { imageBlend: "dark" as const, imageFit: "wide" as const, imageScale: 0.92, imagePackY: 6 },
  v2502PackCentro: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.84, imagePackY: 7 },
  v2502Lata: { imageBlend: "dark" as const, imageFit: "pack" as const, imageScale: 0.9, imagePackY: 6 },
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
  dr01: P.copoDrink,
  dr02: P.v2502Copo1,
  dr03: P.v2502Copo1,
  dr04: P.v2502Copo1,
  dr05: P.v2502CopoMulti,
  dr06: P.v2502Copo1,
  dr08: P.copoDrink,
  dr09: P.copoDrink,
  dr10: P.copoDrink,
  dr11: P.v2502Copo1,

  // ── Destilados ──
  de01: P.dose,
  de02: P.dose,
  de03: P.dose,
  de04: P.dose,
  de05: { ...P.copoDrink, imageScale: 1.45 },
  de06: P.dose,
  de08: P.garrafaDose,
  de10: P.dose,
  de11: P.garrafaDose,
  de12: P.garrafaDose,
  de13: P.garrafaDose,
  de14: P.garrafaDose,
  de15: { ...P.garrafaDose, imageScale: 1.6 },
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

  // ── Abrir e Beber (ajustes finos sobre valores do menu) ──
  pr01: { imageBlend: "dark", imageFit: "pack", imageScale: 1.05, imagePackY: 4 },
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
  pr12: P.v2502Lata,
  pr13: { imageBlend: "dark", imageFit: "pack", imageScale: 1.38, imagePackY: 4 },
  pr14: { imageBlend: "dark", imageFit: "pack", imageScale: 2.35, imagePackY: 5 },
  pr15: { imageBlend: "dark", imageFit: "pack", imageScale: 1.2, imagePackY: 4 },
  pr16: { imageBlend: "dark", imageFit: "pack", imageScale: 1.85, imagePackY: 5 },

  // ── Combos ──
  co01: P.v2502CopoMulti,
  co02: P.v2502Copo2,
  co03: P.v2502Copo2,
  co05: P.copoCopao,
  co06: P.v2502Bucket,
  co07: P.v2502Bucket,
  co08: P.mamadiPackV2,
  co09: P.mamadiPackV2,
  co10: P.v2502Bucket,
  co11: P.mamadiPackV2,

  // ── Porções ──
  po01: P.porcaoVert,
  po02: { ...P.prato, imageScale: 1.12 },
  po03: { ...P.prato, imageScale: 1.12 },
  po04: P.v2502Prato,
  po05: P.prato,
  po06: P.prato,
  po07: { ...P.porcaoVert, imageScale: 1.2 },
  po09: { ...P.porcaoVert, imageScale: 1.45 },
  po10: P.v2502PackCentro,

  // ── Tábuas ──
  ta01: P.prato,
  ta02: P.v2502Prato,
  ta03: P.v2502Prato,
  ta04: P.v2502Prato,

  // ── Lanches & Burgers ──
  la01: P.v2502Lanche,
  la02: P.v2502Lanche,
  la03: P.v2502Lanche,
  la04: P.v2502Lanche,
  bu01: P.v2502Lanche,
  bu02: P.lanche,
  bu03: P.lanche,

  // ── Menu Mamadi ──
  me01: P.v2502PackCentro,
  me02: P.v2502Prato,
  me03: P.prato,
  me04: P.prato,
  me05: P.prato,

  // ── Super Like ──
  sl01: P.v2502Prato,
  sl02: P.copoCopao,
  sl03: P.v2502Copo2,
  sl04: P.v2502CopoMulti,
  sl05: P.mamadiPackV2,
  sl06: P.mamadiPackV2,
  sl07: P.mamadiPackV2,
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
