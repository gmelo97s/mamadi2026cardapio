import { hasMenuPhoto } from "../lib/menuPhoto";

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price?: number; // preço único
  priceA?: number; // meia / dose / lanche
  priceB?: number; // inteira / combo
  labelA?: string; // label do preço A
  labelB?: string; // label do preço B
  image: string;
  badge?: string;
  obs?: string; // observação adicional
  /** light = foto com fundo claro (exibe normal + máscara suave); dark = fundo preto na foto (screen) */
  imageBlend?: "dark" | "light";
  /** wide = prato largo; pack = lata/garrafa/copo (slot fixo calibrado na lata Skol 350ml) */
  imageFit?: "default" | "wide" | "pack";
  /** Escala extra no deck quando imageFit é pack (1 = garrafa Brahma litrão ce01) */
  imageScale?: number;
  /** Deslocamento vertical no deck pack, em % (positivo = desce) */
  imagePackY?: number;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  gradient: string; // classes tailwind (bg-gradient-to-br)
  from: string; // hex inicial
  to: string; // hex final
  glow: string; // cor do glow
  cardImage?: string;
  coverImage?: string;
}

function visibleMenuItems(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => hasMenuPhoto(item.image));
}

// ─────────────────────────────────────────────────────────
// 🍹 DRINKS (ordem do deck)
// ─────────────────────────────────────────────────────────
const COPAO_GIN_IMAGE =
  "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/e_copao_de_gin_jy8t3z.png";

/** Mesma base do copão gin — líquido do copo esquerdo em verde (overlay Cloudinary). */
const COPAO_VODKA_IMAGE =
  "https://res.cloudinary.com/du8l3x4rh/image/upload/" +
  "l_v1782502472:e_copao_de_gin_jy8t3z,w_0.44,h_1.0,c_crop,g_west," +
  "e_colorize:88,co_rgb:00e676/fl_layer_apply,g_west,w_0.44/" +
  "v1782502472/e_copao_de_gin_jy8t3z.png";

export const drinks: MenuItem[] = [
  {
    id: "dr05",
    category: "drinks",
    name: "CAIPIRINHA SABORES copo 550ml",
    description:
      "51/Velho Barreiro / Balalaika / Jambu / Saquê. Sabores: Kiwi / Morango / Maracujá / Caju / Limão.",
    price: 30,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502482/caipirinha_sabores_copo_500ml_fnpwvt.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "dr11",
    category: "drinks",
    name: "CAIPIRINHA DA MAMADI",
    description: "Caipirinha de Goiaba com Limão.",
    price: 30,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502474/caipirinha_da_mamadi_dubapf.png",
    imageBlend: "dark",
    imageFit: "pack",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "dr02",
    category: "drinks",
    name: "CAIPIRINHA LIMÃO copo 300ml",
    description: "51/Velho Barreiro.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502482/caiprinha_300ml_agoesr.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "dr07",
    category: "drinks",
    name: "GIN SABORES",
    description: "Sabores: Tropical / Melancia / Morango / Maçã Verde.",
    price: 25,
    image: COPAO_GIN_IMAGE,
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "dr06",
    category: "drinks",
    name: "CHEVETTE",
    description: "Corote de Limão, Suco Mid de Baunilha e Gelo de Coco.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502481/chevette_wuoo8r.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "dr01",
    category: "drinks",
    name: "GIN TÔNICA",
    description: "GIN Nacional, Água Tônica e Limão Taiti.",
    price: 25,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781812072/dr01-gin-tonica_rmpvzh.png",
    badge: "⭐ Destaque",
  },
  {
    id: "dr03",
    category: "drinks",
    name: "CAIPILULA copo 300ml",
    description: "Caipirinha de Gengibre com Mel.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502482/caiprinha_300ml_agoesr.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "dr04",
    category: "drinks",
    name: "CAIPIROSKA LIMÃO copo 300ml",
    description: "Balalaika/Saquê.",
    price: 22,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502482/caiprinha_300ml_agoesr.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "dr08",
    category: "drinks",
    name: "BATIDÃO TROPICAL",
    description: "Caipirinha de Abacaxi com Hortelã.",
    price: 30,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr08-batidao-tropical.jpg",
    imageBlend: "dark",
  },
  {
    id: "dr09",
    category: "drinks",
    name: "MOJITO",
    description: "Rum, Limão e Hortelã.",
    price: 30,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr09-mojito.jpg",
    imageBlend: "dark",
  },
  {
    id: "dr10",
    category: "drinks",
    name: "CUBA LIBRE",
    description: "Rum, Coca e Limão.",
    price: 30,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr10-cuba-libre.jpg",
    imageBlend: "dark",
  },
];

// ─────────────────────────────────────────────────────────
// 🥃 DESTILADOS (Cachaças, Doses, Whiskys, Vodkas, Vinhos)
// ─────────────────────────────────────────────────────────
export const destilados: MenuItem[] = [
  {
    id: "de01",
    category: "destilados",
    name: "JAMBU",
    description: "Cachaça de Jambu. Dose.",
    price: 13,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde01-jambu.jpg",
    imageBlend: "dark",
  },
  {
    id: "de02",
    category: "destilados",
    name: "51 / VELHO BARREIRO",
    description: "Dose de cachaça.",
    price: 5,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde02-51-velho-barreiro.jpg",
    imageBlend: "dark",
  },
  {
    id: "de03",
    category: "destilados",
    name: "GENGIBRE COM MEL",
    description: "Dose de cachaça de gengibre com mel.",
    price: 10,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde03-gengibre-com-mel.jpg",
    imageBlend: "dark",
  },
  {
    id: "de04",
    category: "destilados",
    name: "BANANINHA / CANELINHA",
    description: "Dose de cachaça de banana ou canela.",
    price: 10,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde04-bananinha-canelinha.jpg",
    imageBlend: "dark",
  },
  {
    id: "de05",
    category: "destilados",
    name: "KARIRI MEL E LIMÃO",
    description: "Kariri mel e limão.",
    priceA: 15,
    priceB: 25,
    labelA: "Copo 150ml",
    labelB: "Copo 550ml",
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde05-kariri-mel-limao.jpg",
    imageBlend: "dark",
  },
  {
    id: "de06",
    category: "destilados",
    name: "DREHER",
    description: "Dose de Dreher.",
    price: 13,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde06-dreher.jpg",
    imageBlend: "dark",
  },
  {
    id: "de07",
    category: "destilados",
    name: "DREHER MEL E LIMÃO",
    description: "Dose de Dreher com mel e limão.",
    price: 18,
    image: "https://picsum.photos/seed/drehermell/400/300",
  },
  {
    id: "de08",
    category: "destilados",
    name: "TEQUILA OURO José Cuervo",
    description: "Dose de tequila ouro.",
    price: 28,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde08-tequila-ouro.jpg",
    imageBlend: "dark",
  },
  {
    id: "de09",
    category: "destilados",
    name: "TEQUILA PRATA José Cuervo",
    description: "Dose de tequila prata.",
    price: 28,
    image: "https://picsum.photos/seed/tequilaprata/400/300",
  },
  {
    id: "de10",
    category: "destilados",
    name: "CAMPARI / APEROL",
    description: "Dose de Campari ou Aperol.",
    price: 15,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde10-campari-aperol.jpg",
    imageBlend: "dark",
  },
  {
    id: "de11",
    category: "destilados",
    name: "TANQUERAY (DOSE)",
    description: "Dose de gin Tanqueray.",
    price: 25,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde11-tanqueray.jpg",
    imageBlend: "dark",
    badge: "⭐ Destaque",
  },
  {
    id: "de12",
    category: "destilados",
    name: "MASTER GOLD / CHANCELER",
    description: "Whisky nacional.",
    priceA: 13,
    priceB: 22,
    labelA: "Dose",
    labelB: "Combo",
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde12-master-gold-chanceler.jpg",
    imageBlend: "dark",
    obs: "Combo: Whisky + Energético de Garrafa + Gelo de Sabor",
  },
  {
    id: "de13",
    category: "destilados",
    name: "CAVALO BRANCO / PASSPORT",
    description: "Whisky escocês blend.",
    priceA: 40,
    priceB: 50,
    labelA: "Dose",
    labelB: "Combo",
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde13-cavalo-branco-passport.jpg",
    imageBlend: "dark",
    obs: "Combo: Whisky + Energético de Garrafa + Gelo de Sabor",
  },
  {
    id: "de14",
    category: "destilados",
    name: "RED LABEL",
    description: "Johnnie Walker Red Label.",
    priceA: 40,
    priceB: 50,
    labelA: "Dose",
    labelB: "Combo",
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde14-red-label.jpg",
    imageBlend: "dark",
    obs: "Combo: Whisky + Energético de Garrafa + Gelo de Sabor",
  },
  {
    id: "de15",
    category: "destilados",
    name: "JACK DANIEL'S",
    description: "Tennessee Whiskey.",
    priceA: 70,
    priceB: 80,
    labelA: "Dose",
    labelB: "Combo",
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde15-jack-daniels.jpg",
    imageBlend: "dark",
    badge: "⭐ Destaque",
    obs: "Combo: Whisky + Energético de Garrafa + Gelo de Sabor",
  },
  {
    id: "de16",
    category: "destilados",
    name: "BALALAIKA",
    description: "Vodka nacional. Dose.",
    price: 15,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde16-balalaika.jpg",
    imageBlend: "dark",
  },
  {
    id: "de17",
    category: "destilados",
    name: "ABSOLUT",
    description: "Vodka sueca Absolut. Dose.",
    price: 25,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde17-absolut.jpg",
    imageBlend: "dark",
  },
  {
    id: "de18",
    category: "destilados",
    name: "SMIRNOFF",
    description: "Vodka Smirnoff. Dose.",
    price: 25,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde18-smirnoff.jpg",
    imageBlend: "dark",
  },
  {
    id: "de19",
    category: "destilados",
    name: "VINHO TINTO",
    description: "Garrafa de vinho tinto.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde19-vinho-tinto.jpg",
    imageBlend: "dark",
  },
  {
    id: "de20",
    category: "destilados",
    name: "VINHO ROSÉ",
    description: "Garrafa de vinho rosé.",
    price: 35,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/destiladosde20-vinho-rose.jpg",
    imageBlend: "dark",
  },
];

// ─────────────────────────────────────────────────────────
// 🍺 CERVEJAS
// ─────────────────────────────────────────────────────────
export const cervejas: MenuItem[] = [
  { id: "ce01", category: "cervejas", name: "BRAHMA CHOPP Litrão", description: "Brahma Chopp 1 litro.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781893643/cervejasce01-brahma-chopp-litrao.png_zyeftc.png", imageBlend: "dark" },
  { id: "ce02", category: "cervejas", name: "SKOL PILSEN Litrão", description: "Skol Pilsen 1 litro.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781895374/cervejasce02-skol-litrao.png_fgorhw.png", imageBlend: "dark" },
  { id: "ce03", category: "cervejas", name: "AMSTEL Litrão", description: "Amstel 1 litro.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781895373/cervejasce03-amstel-litrao.png_c2hwjg.png", imageBlend: "dark" },
  { id: "ce04", category: "cervejas", name: "ANTÁRTICA Litrão", description: "Antártica 1 litro.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781895373/cervejasce04-antartica-litrao.png_fx1u1a.png", imageBlend: "dark" },
  { id: "ce05", category: "cervejas", name: "BUDWEISER Litrão", description: "Budweiser 1 litro.", price: 20, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781895370/cervejasce05-budweiser-litrao.png_vrlzf5.png", imageBlend: "dark" },
  { id: "ce06", category: "cervejas", name: "BRAHMA DUPLO MALTE Litrão", description: "Brahma Duplo Malte 1 litro.", price: 19, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781895369/cervejasce06-brahma-duplo-malte-litrao.png_y0iayi.png", imageBlend: "dark" },
  { id: "ce07", category: "cervejas", name: "ORIGINAL Litrão", description: "Original 1 litro.", price: 22, image: "https://picsum.photos/seed/original/400/300" },
  { id: "ce08", category: "cervejas", name: "PETRA Litrão", description: "Petra 1 litro.", price: 13, image: "https://picsum.photos/seed/petra/400/300" },
  { id: "ce09", category: "cervejas", name: "HEINEKEN 600ml", description: "Heineken garrafa verde 600ml.", price: 22, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900276/cervejasce09-heineken-600ml.png_hgjw0y.png", imageBlend: "dark", badge: "⭐ Destaque" },
  { id: "ce10", category: "cervejas", name: "STELLA 600ml", description: "Stella Artois garrafa verde 600ml.", price: 18, image: "https://picsum.photos/seed/stella600/400/300" },
  { id: "ce11", category: "cervejas", name: "BECK'S 600ml", description: "Beck's garrafa verde 600ml.", price: 18, image: "https://picsum.photos/seed/becks600/400/300" },
  { id: "ce12", category: "cervejas", name: "SPATEN 600ml", description: "Spaten garrafa verde 600ml.", price: 18, image: "https://picsum.photos/seed/spaten600/400/300" },
  { id: "ce13", category: "cervejas", name: "AMSTEL 600ml", description: "Amstel 600ml.", price: 15, image: "https://picsum.photos/seed/amstel600/400/300" },
  { id: "ce14", category: "cervejas", name: "EISENBAHN 600ml", description: "Eisenbahn 600ml.", price: 15, image: "https://picsum.photos/seed/eisenbahn600/400/300" },
  { id: "ce15", category: "cervejas", name: "ORIGINAL 600ml", description: "Original 600ml.", price: 15, image: "https://picsum.photos/seed/original600/400/300" },
  { id: "ce16", category: "cervejas", name: "HEINEKEN 330ml", description: "Long neck Heineken.", price: 15, image: "/menu-items/ce16-heineken-330ml.webp" },
  { id: "ce17", category: "cervejas", name: "BUDWEISER 330ml", description: "Long neck Budweiser.", price: 15, image: "https://picsum.photos/seed/budweiser330/400/300" },
  { id: "ce18", category: "cervejas", name: "STELLA 330ml", description: "Long neck Stella Artois.", price: 15, image: "https://picsum.photos/seed/stella330/400/300" },
  { id: "ce19", category: "cervejas", name: "CORONA 330ml", description: "Long neck Corona.", price: 15, image: "https://picsum.photos/seed/corona330/400/300" },
  { id: "ce20", category: "cervejas", name: "HEINEKEN ZERO 330ml", description: "Long neck Heineken sem álcool.", price: 15, image: "https://picsum.photos/seed/heinekenzero/400/300" },
  { id: "ce21", category: "cervejas", name: "BUDWEISER ZERO 330ml", description: "Long neck Budweiser sem álcool.", price: 15, image: "https://picsum.photos/seed/budweiserzero/400/300" },
];

// ─────────────────────────────────────────────────────────
// 🥤 ABRIR E BEBER
// ─────────────────────────────────────────────────────────
export const prontos: MenuItem[] = [
  { id: "pr01", category: "prontos", name: "SKOL BEATS", description: "Drink pronto Skol Beats.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr01-skol-beats.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.05, imagePackY: 4 },
  { id: "pr02", category: "prontos", name: "51 ICE", description: "Drink pronto 51 Ice.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr02-51-ice.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.28, imagePackY: 4 },
  { id: "pr03", category: "prontos", name: "XEQUE MATE", description: "Drink pronto Xeque Mate.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr03-xeque-mate.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 2.55, imagePackY: 6 },
  { id: "pr04", category: "prontos", name: "DRAFT", description: "Drink pronto Draft.", price: 20, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr04-draft.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 2.25, imagePackY: 5 },
  { id: "pr05", category: "prontos", name: "VIBES", description: "Drink pronto Vibes.", price: 10, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr05-vibes.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.95, imagePackY: 4 },
  { id: "pr06", category: "prontos", name: "CERVEJA LATA 350ml", description: "Cerveja em lata 350ml.", price: 10, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr06-cerveja-lata-350ml.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 0.78, imagePackY: 4 },
  { id: "pr07", category: "prontos", name: "SMIRNOFF ICE", description: "Smirnoff Ice long neck.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr07-smirnoff-ice.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.16, imagePackY: 4 },
  { id: "pr08", category: "prontos", name: "RED BULL lata 250ml", description: "Energético Red Bull 250ml.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr08-red-bull-250ml.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1, imagePackY: 4 },
  { id: "pr09", category: "prontos", name: "MONSTER LATÃO", description: "Energético Monster latão.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr09-monster-latao.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.08, imagePackY: 4 },
  { id: "pr10", category: "prontos", name: "COPO ENERGÉTICO 300ml", description: "Energético no copo 300ml.", price: 5, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr10-copo-energetico-300ml.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.42, imagePackY: 4 },
  { id: "pr11", category: "prontos", name: "SODA ITALIANA", description: "Diversos sabores.", price: 13, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr11-soda-italiana.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.48, imagePackY: 4 },
  { id: "pr12", category: "prontos", name: "REFRIGERANTE", description: "Lata 350ml.", price: 7, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502469/refrigerante_jl678v.png", imageBlend: "dark", imageFit: "pack", imageScale: 1.12, imagePackY: 5 },
  { id: "pr13", category: "prontos", name: "SUCO LATA", description: "Suco em lata.", price: 7, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr13-suco-lata.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1, imagePackY: 4 },
  { id: "pr14", category: "prontos", name: "ÁGUA ou ÁGUA COM GÁS", description: "Garrafa.", price: 6, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr14-agua.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 2.35, imagePackY: 5 },
  { id: "pr15", category: "prontos", name: "ÁGUA TÔNICA", description: "Água tônica.", price: 6, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr15-agua-tonica.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.16, imagePackY: 4 },
  { id: "pr16", category: "prontos", name: "GELO SABORES", description: "Sabores: Coco / Maracujá / Morango.", price: 5, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr16-gelo-sabores.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.82, imagePackY: 5 },
];

// ─────────────────────────────────────────────────────────
// 🎉 COMBOS & COPÃO (ordem do deck)
// ─────────────────────────────────────────────────────────
export const combos: MenuItem[] = [
  { id: "co09", category: "combos", name: "3 LITRÃO BRAHMA Chopp", description: "Pack com 3 litrões Brahma Chopp.", price: 45, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782487997/3_litrao_skol_ou_brahma_tgthmz.png", imageBlend: "dark", imageFit: "pack" },
  { id: "co10", category: "combos", name: "3 LITRÃO SKOL", description: "Pack com 3 litrões Skol.", price: 45, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/3_litrao_skol_qq1ez4.png", imageBlend: "dark", imageFit: "pack" },
  { id: "co11", category: "combos", name: "3 LITRÃO ORIGINAL", description: "Pack com 3 litrões Original.", price: 60, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782487999/3_litrao_original_umyxny.png", imageBlend: "dark", imageFit: "pack" },
  { id: "co08", category: "combos", name: "3 HEINEKEN 600ml", description: "Pack com 3 garrafas Heineken 600ml.", price: 60, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782487996/3_heineken_600ml_yctyrx.png", imageBlend: "dark", imageFit: "pack", badge: "⭐ Destaque" },
  { id: "co07", category: "combos", name: "3 ORIGINAL 600ml", description: "Pack com 3 garrafas Original 600ml.", price: 40, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/3_original_600ml_hzczzf.png", imageBlend: "dark", imageFit: "pack" },
  { id: "co06", category: "combos", name: "3 EISENBAHN 600ml", description: "Pack com 3 garrafas Eisenbahn 600ml.", price: 40, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/3_einsenbahn_600ml_kcbmse.png", imageBlend: "dark", imageFit: "pack" },
  { id: "co01", category: "combos", name: "3 CAIPIRINHA LIMÃO", description: "Somente de limão. Copo 300ml. Pack com 3 unidades.", price: 30, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502481/3_caiprinhas_hg9mkg.png", imageBlend: "dark", imageFit: "pack", badge: "🌈 Especial Mamadi" },
  { id: "co02", category: "combos", name: "2 COPÃO DE GIN", description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.", price: 30, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/e_copao_de_gin_jy8t3z.png", imageBlend: "dark", imageFit: "pack", badge: "🌈 Especial Mamadi" },
  { id: "co03", category: "combos", name: "2 CHEVETTE", description: "Dois Chevettes: Corote de Limão, Suco Mid de Baunilha e Gelo de Coco.", price: 35, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/2_chevette_psofcx.png", imageBlend: "dark", imageFit: "pack" },
  { id: "co05", category: "combos", name: "COPÃO VODKA C/ ENERGÉTICO", description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.", price: 15, image: "/menu-items/co05-copao-vodka-energetico.png", badge: "🌈 Especial Mamadi" },
];

// ─────────────────────────────────────────────────────────
// ⭐ SUPER PROMOS — deck secreto (botão estrela)
// ─────────────────────────────────────────────────────────
export const SUPER_LIKE_CATEGORY_ID = "superlike";

export const superLikeCategory: Category = {
  id: SUPER_LIKE_CATEGORY_ID,
  label: "SUPER PROMOS",
  emoji: "⭐",
  gradient: "from-yellow-400 to-purple-600",
  from: "#FFE500",
  to: "#AA00FF",
  glow: "#FFE500",
  cardImage: "/generated-menu/categories/cat-combos-card.png",
};

export const superLikeItems = visibleMenuItems([
  {
    id: "sl03",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "2 COPÃO DE GIN",
    description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.",
    price: 30,
    image: COPAO_GIN_IMAGE,
    imageBlend: "dark",
    imageFit: "pack",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "sl02",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "2 COPÃO VODKA C/ ENERGÉTICO",
    description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.",
    price: 30,
    image: COPAO_VODKA_IMAGE,
    imageBlend: "dark",
    imageFit: "pack",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "sl04",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 CAIPIRINHA LIMÃO",
    description: "Somente de limão. Copo 300ml. Pack com 3 unidades.",
    price: 30,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502481/3_caiprinhas_hg9mkg.png",
    imageBlend: "dark",
    imageFit: "pack",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "sl05",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 LITRÃO SKOL ou BRAHMA",
    description: "Pack com 3 litrões Skol ou 3 litrões Brahma Chopp.",
    price: 45,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782487997/3_litrao_skol_ou_brahma_tgthmz.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "sl06",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 HEINEKEN 600ml",
    description: "Pack com 3 garrafas Heineken 600ml.",
    price: 60,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782487996/3_heineken_600ml_yctyrx.png",
    imageBlend: "dark",
    imageFit: "pack",
    badge: "⭐ Destaque",
  },
  {
    id: "sl07",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 LITRÃO ORIGINAL",
    description: "Pack com 3 litrões Original.",
    price: 60,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782487999/3_litrao_original_umyxny.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "sl08",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "2 CHEVETTE",
    description: "Dois Chevettes: Corote de Limão, Suco Mid de Baunilha e Gelo de Coco.",
    price: 35,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502472/2_chevette_psofcx.png",
    imageBlend: "dark",
    imageFit: "pack",
  },
  {
    id: "sl01",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "CHURRASCO À VONTADE",
    description: "Churrasco à Vontade (Individual). Acompanha: Arroz, Farofa e Vinagrete.",
    price: 25,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502479/churrasco_a_vontade_udj3ye.png",
    imageBlend: "dark",
    imageFit: "wide",
    badge: "⭐ Destaque",
    obs: "Prato de Todo Dia — Quarta a Domingo, 10:30 às 21hrs",
  },
]);

// ─────────────────────────────────────────────────────────
// 🍟 PORÇÕES (ordem do deck)
// ─────────────────────────────────────────────────────────
export const porcoes: MenuItem[] = [
  { id: "ta02", category: "porcoes", name: "TÁBUA MISTA", description: "Batata Frita Simples + Calabresa Acebolada + Contra-Filé Acebolado + Frango Acebolado + Mandioca Frita. Acompanha Pão + Farofa + Vinagrete + Maionese Temperada.", price: 129.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502479/t_abua_mista_bbiu5x.png", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi" },
  { id: "ta03", category: "porcoes", name: "TÁBUA DUPLA 1", description: "Batata Frita Simples + Calabresa Acebolada. Acompanha Pão + Vinagrete + Maionese Temperada.", price: 62.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502476/t%C3%A1bua_dupla_1_wi2ake.png", imageBlend: "dark", imageFit: "wide" },
  { id: "ta04", category: "porcoes", name: "TÁBUA DUPLA 2", description: "Batata Frita Simples + Contra-Filé Acebolado. Acompanha Pão + Vinagrete + Maionese Temperada.", price: 99.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502478/t%C3%A1bua_dupla_2_cpncsw.png", imageBlend: "dark", imageFit: "wide" },
  { id: "po10", category: "porcoes", name: "COUVERT DA MAMADI", description: "Sardela, Caponata de Berinjela, Azeitonas, Queijo Temperado, Calabresa Curada e Pão da Casa.", price: 30, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502477/courvert_dpvi2h.png", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi" },
  { id: "po03", category: "porcoes", name: "BATATA FRITA C/ CHEDDAR E BACON", description: "Batata frita com cheddar derretido e bacon.", priceA: 35, priceB: 55, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900276/porcoespo03-batata-cheddar-bacon.png_jxh3x4.png", imageBlend: "dark", imageFit: "wide" },
  { id: "po04", category: "porcoes", name: "BATATA MAMADI", description: "Batata com Cheddar, Catupiry, Bacon e Parmesão Ralado.", priceA: 45, priceB: 60, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502479/batata_da_mamadi_2_cogbhi.png", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi" },
  { id: "po02", category: "porcoes", name: "BATATA FRITA SIMPLES", description: "Batata frita crocante.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900274/porcoespo02-batata-frita-simples.png_xwi0dc.png", imageBlend: "dark", badge: "⭐ Destaque", imageFit: "wide" },
  { id: "po05", category: "porcoes", name: "CALABRESA ACEBOLADA", description: "Calabresa grelhada com cebola.", priceA: 38.9, priceB: 79.9, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326105/z6xbkzwcvh1v5ud6rq5b.jpg", imageBlend: "dark", imageFit: "wide" },
  { id: "po01", category: "porcoes", name: "MINI PASTÉIS", description: "Sabores: Carne, Queijo ou Misto.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900274/porcoespo01-mini-pasteis.png_md4qrg.png", imageBlend: "dark" },
  { id: "po07", category: "porcoes", name: "COXINHA FRANGO", description: "4 unidades. Vegana: Brócolis, Cenoura e Batata.", priceA: 18, priceB: 18, labelA: "Frango", labelB: "Vegana", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900275/porcoespo07-coxinha-frango.png_wzu1vh.png", imageBlend: "dark" },
  { id: "ta01", category: "porcoes", name: "TÁBUA DE ESPETINHOS", description: "6 Espetos: 2 de Carne + 1 de Frango + 1 de Linguiça + 1 de Queijo Coalho + 1 Pão de Alho. Acompanha Farofa e Vinagrete.", price: 89.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326114/kw0tdwzokq3odiwaklcy.jpg", imageBlend: "dark", imageFit: "wide", badge: "⭐ Destaque" },
  { id: "po09", category: "porcoes", name: "ESPETINHO", description: "1 unidade. Sabores: Carne, Frango, Linguiça, Queijo Coalho ou Pão de Alho.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326106/ox0aflfbdrwjstlg5btf.jpg", imageBlend: "dark" },
];

// ─────────────────────────────────────────────────────────
// 🥪 LANCHES & BURGERS
// ─────────────────────────────────────────────────────────
export const lanchesEBurgers: MenuItem[] = [
  { id: "la01", category: "lanches", name: "LANCHE DE CALABRESA", description: "Calabresa, Queijo e Cebola no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502468/lanche_de_calabresa_l6vaeq.png", imageBlend: "dark", imageFit: "pack" },
  { id: "la02", category: "lanches", name: "LANCHE DE CARNE LOUCA", description: "Carne de Panela Desfiada e Temperada no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502469/lanche_carne_louca_r25zr7.png", imageBlend: "dark", imageFit: "pack", badge: "⭐ Destaque" },
  { id: "la03", category: "lanches", name: "LANCHE DE PERNIL", description: "Pernil com Molho Especial, Cebola Refogada no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502467/lanche_de_pernil_w4ccne.png", imageBlend: "dark", imageFit: "pack" },
  { id: "la04", category: "lanches", name: "LANCHE VEGANO", description: "Berinjela Temperada, Azeitona, Tomate e Cebola no Pão. Acompanha Barbecue. (Vegano)", price: 23.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502467/lanche_vegano_sxxhel.png", imageBlend: "dark", imageFit: "pack", badge: "🌱 Vegano" },
  { id: "bu01", category: "lanches", name: "MAMADI ORIGINAL", description: "Pão Brioche, 70g de Carne, Queijo Cheddar e Maionese Especial.", priceA: 29.9, priceB: 39.9, labelA: "Lanche", labelB: "Combo", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502468/mamadi_original_twm3sf.png", imageBlend: "dark", imageFit: "pack", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
  { id: "bu02", category: "lanches", name: "MAMADI BACON", description: "Pão Brioche, 70g de Carne, Queijo Cheddar, Bacon, Barbecue e Maionese Especial.", priceA: 32.9, priceB: 42.9, labelA: "Lanche", labelB: "Combo", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326089/gsc9sda3vlwbxl9knizd.jpg", imageBlend: "dark", badge: "⭐ Destaque", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
  { id: "bu03", category: "lanches", name: "MAMADI CLÁSSICO", description: "Pão Australiano, 70g de Carne, Queijo Cheddar, Cebola Caramelizada, Bacon, Barbecue e Maionese Especial.", priceA: 37.9, priceB: 47.9, labelA: "Lanche", labelB: "Combo", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326084/tk450vqdlvhrj1ssnqox.jpg", imageBlend: "dark", badge: "🌈 Especial Mamadi", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
];

// ─────────────────────────────────────────────────────────
// 🍽️ MENU DA MAMADI (Comidinhas Caseiras)
// ─────────────────────────────────────────────────────────
export const menuMamadi: MenuItem[] = [
  { id: "me01", category: "menu", name: "CAFÉ DA MAMADI", description: "Pão na Chapa + Ovos Mexidos + Bacon + Café Preto.", price: 10, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502475/caf%C3%A9_da_mamadi_hyhjuq.png", imageBlend: "dark", imageFit: "wide", obs: "Disponível de Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me02", category: "menu", name: "CHURRASCO DA MAMADI", description: "Churrasco à Vontade (Individual). Acompanha: Arroz, Farofa e Vinagrete.", price: 25, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782502479/churrasco_a_vontade_udj3ye.png", imageBlend: "dark", imageFit: "wide", badge: "⭐ Destaque", obs: "Prato de Todo Dia — Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me03", category: "menu", name: "PRATO EXECUTIVO c/ 2 Espetinhos", description: "Sabores: Carne / Frango / Linguiça / Pão de Alho / Queijo Coalho. Acompanha: Arroz, Feijão, Fritas, Vinagrete e Farofa.", price: 29.99, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326112/ugtdfc420qvoshz5jlnb.png", imageBlend: "dark", imageFit: "wide", obs: "Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me04", category: "menu", name: "BAIÃO DE DOIS — Prato de Domingo", description: "Baião de Dois servido com Mandioca Frita e Tiras de Contra-Filé. Serve 2 pessoas.", price: 49.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326110/sd7zrsbpqzlpqec7fouu.png", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi", obs: "Disponível somente aos Domingos" },
  { id: "me05", category: "menu", name: "BERINJELA REFOGADA (Vegano)", description: "Arroz, Berinjela Refogada, Feijão, Fritas, Vinagrete e Farofa.", price: 25, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326085/fjvjxnssbgxhrdhuzkoe.png", imageBlend: "dark", imageFit: "wide", badge: "🌱 Vegano", obs: "Quarta a Domingo, 10:30 às 21hrs" },
];

// ─────────────────────────────────────────────────────────
// EXPORT AGRUPADO
// ─────────────────────────────────────────────────────────
export const itemsByCategory: Record<string, MenuItem[]> = {
  drinks: visibleMenuItems(drinks),
  destilados: visibleMenuItems(destilados),
  cervejas: visibleMenuItems(cervejas),
  prontos: visibleMenuItems(prontos),
  combos: visibleMenuItems(combos),
  porcoes: visibleMenuItems(porcoes),
  lanches: visibleMenuItems(lanchesEBurgers),
  menu: visibleMenuItems(menuMamadi),
};

export const allMenuItems: MenuItem[] = Object.values(itemsByCategory).flat();

export const categories: Category[] = [
  { id: "cervejas", label: "CERVEJAS", emoji: "🍺", gradient: "from-yellow-400 to-green-400", from: "#FFE500", to: "#00E676", glow: "#FFE500" },
  { id: "porcoes", label: "PORÇÕES", emoji: "🍟", gradient: "from-purple-600 to-pink-500", from: "#AA00FF", to: "#FF4081", glow: "#AA00FF" },
  { id: "menu", label: "MENU DA MAMADI", emoji: "🍽️", gradient: "from-orange-400 to-green-500", from: "#FF8C00", to: "#00E676", glow: "#FF8C00" },
  { id: "drinks", label: "DRINKS", emoji: "🍹", gradient: "from-red-600 to-pink-600", from: "#FF3B3B", to: "#FF4081", glow: "#FF3B3B", cardImage: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781813232/mamadicategoriasdrinks-card_obncis.png" },
  { id: "combos", label: "COMBOS & COPÃO", emoji: "🎉", gradient: "from-blue-500 to-purple-600", from: "#2979FF", to: "#AA00FF", glow: "#2979FF" },
  { id: "prontos", label: "ABRIR E BEBER", emoji: "🥤", gradient: "from-green-400 to-blue-500", from: "#00E676", to: "#2979FF", glow: "#00E676" },
  { id: "lanches", label: "LANCHES & BURGERS", emoji: "🥪", gradient: "from-red-600 to-orange-500", from: "#FF3B3B", to: "#FF8C00", glow: "#FF3B3B", cardImage: "/categories/cat-lanches-card.png", coverImage: "/categories/cat-lanches-card.png" },
];

export const complementosLanches = [
  { name: "Maionese Temperada extra", price: 1 },
  { name: "Pão extra", price: 4 },
  { name: "Queijo extra", price: 5 },
  { name: "Abacaxi extra", price: 5 },
];

export const business = {
  name: "Mamadi Food",
  tagline: "Bar LGBTQIA+ Friendly",
  location: "Santo André, SP",
  whatsapp: "5511958984481",
  instagram: "mamadifood",
  instagramUrl: "https://instagram.com/mamadifood",
  whatsappUrl: "https://wa.me/5511958984481",
  ifoodUrl:
    "https://www.ifood.com.br/delivery/sao-paulo-sp/mamadi-food-consolacao/1d7dc9b1-0e05-4c75-8baf-bbdd8356e60f?UTM_Medium=share&utm_content=link_in_bio&utm_medium=social&utm_source=ig",
  menuHours: "Comidinhas: Qua a Dom, 10:30 às 21hrs",
};

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function buildWhatsappOrderUrl(productName: string, price?: string): string {
  const pricePart = price ? ` - ${price}` : "";
  const text = `Olá, quero pedir: ${productName}${pricePart}`;
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
}
