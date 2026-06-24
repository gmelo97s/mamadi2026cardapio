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

// ─────────────────────────────────────────────────────────
// 🍹 DRINKS
// ─────────────────────────────────────────────────────────
export const drinks: MenuItem[] = [
  {
    id: "dr02",
    category: "drinks",
    name: "CAIPIRINHA LIMÃO copo 300ml",
    description: "51/Velho Barreiro.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr02-caipirinha-limao-300ml.jpg",
    imageBlend: "dark",
  },
  {
    id: "dr03",
    category: "drinks",
    name: "CAIPILULA copo 300ml",
    description: "Caipirinha de Gengibre com Mel.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr03-caipilula-300ml.jpg",
    imageBlend: "dark",
  },
  {
    id: "dr04",
    category: "drinks",
    name: "CAIPIROSKA LIMÃO copo 300ml",
    description: "Balalaika/Saquê.",
    price: 22,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/Screenshot_3.jpg",
    imageBlend: "dark",
  },
  {
    id: "dr06",
    category: "drinks",
    name: "CHEVETTE",
    description: "Corote de Limão, Suco Mid de Baunilha e Gelo de Coco.",
    price: 20,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr06-chevette.jpg",
    imageBlend: "dark",
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
  {
    id: "dr11",
    category: "drinks",
    name: "CAIPIRINHA DA MAMADI",
    description: "Caipirinha de Goiaba com Limão.",
    price: 30,
    image:
      "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/drinksdr11-caipirinha-da-mamadi.jpg",
    imageBlend: "dark",
    badge: "🌈 Especial Mamadi",
  },
];

// ─────────────────────────────────────────────────────────
// 🥃 DESTILADOS — removidos até novas fotos com fundo preto e enquadramento adequado
// ─────────────────────────────────────────────────────────
export const destilados: MenuItem[] = [];

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
  { id: "ce09", category: "cervejas", name: "HEINEKEN 600ml", description: "Heineken garrafa verde 600ml.", price: 22, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900276/cervejasce09-heineken-600ml.png_hgjw0y.png", imageBlend: "dark", badge: "⭐ Destaque" },
  { id: "ce16", category: "cervejas", name: "HEINEKEN 330ml", description: "Long neck Heineken.", price: 15, image: "/menu-items/ce16-heineken-330ml.webp", imageBlend: "dark" },
];

// ─────────────────────────────────────────────────────────
// 🥤 ABRIR E BEBER
// ─────────────────────────────────────────────────────────
export const prontos: MenuItem[] = [
  { id: "pr01", category: "prontos", name: "SKOL BEATS", description: "Drink pronto Skol Beats.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr01-skol-beats.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.28, imagePackY: 4 },
  { id: "pr02", category: "prontos", name: "51 ICE", description: "Drink pronto 51 Ice.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr02-51-ice.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.28, imagePackY: 4 },
  { id: "pr03", category: "prontos", name: "XEQUE MATE", description: "Drink pronto Xeque Mate.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr03-xeque-mate.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 2.55, imagePackY: 6 },
  { id: "pr04", category: "prontos", name: "DRAFT", description: "Drink pronto Draft.", price: 20, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr04-draft.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 2.25, imagePackY: 5 },
  { id: "pr05", category: "prontos", name: "VIBES", description: "Drink pronto Vibes.", price: 10, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr05-vibes.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.95, imagePackY: 4 },
  { id: "pr06", category: "prontos", name: "CERVEJA LATA 350ml", description: "Cerveja em lata 350ml.", price: 10, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr06-cerveja-lata-350ml.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1, imagePackY: 4 },
  { id: "pr07", category: "prontos", name: "SMIRNOFF ICE", description: "Smirnoff Ice long neck.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr07-smirnoff-ice.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.16, imagePackY: 4 },
  { id: "pr08", category: "prontos", name: "RED BULL lata 250ml", description: "Energético Red Bull 250ml.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr08-red-bull-250ml.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1, imagePackY: 4 },
  { id: "pr09", category: "prontos", name: "MONSTER LATÃO", description: "Energético Monster latão.", price: 18, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr09-monster-latao.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.08, imagePackY: 4 },
  { id: "pr10", category: "prontos", name: "COPO ENERGÉTICO 300ml", description: "Energético no copo 300ml.", price: 5, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr10-copo-energetico-300ml.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.42, imagePackY: 4 },
  { id: "pr11", category: "prontos", name: "SODA ITALIANA", description: "Diversos sabores.", price: 13, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr11-soda-italiana.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.48, imagePackY: 4 },
  { id: "pr12", category: "prontos", name: "REFRIGERANTE", description: "Lata 350ml.", price: 7, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr12-refrigerante-lata.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1, imagePackY: 4 },
  { id: "pr13", category: "prontos", name: "SUCO LATA", description: "Suco em lata.", price: 7, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr13-suco-lata.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1, imagePackY: 4 },
  { id: "pr14", category: "prontos", name: "ÁGUA ou ÁGUA COM GÁS", description: "Garrafa.", price: 6, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr14-agua.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 2.35, imagePackY: 5 },
  { id: "pr15", category: "prontos", name: "ÁGUA TÔNICA", description: "Água tônica.", price: 6, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr15-agua-tonica.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.16, imagePackY: 4 },
  { id: "pr16", category: "prontos", name: "GELO SABORES", description: "Sabores: Coco / Maracujá / Morango.", price: 5, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/fundo_preto/prontospr16-gelo-sabores.jpg", imageBlend: "dark", imageFit: "pack", imageScale: 1.82, imagePackY: 5 },
];

// ─────────────────────────────────────────────────────────
// 🎉 COMBOS & COPÃO
// ─────────────────────────────────────────────────────────
export const combos: MenuItem[] = [
  { id: "co07", category: "combos", name: "3 ORIGINAL 600ml", description: "Pack com 3 garrafas Original 600ml.", price: 40, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326101/mmxxekph4chcwun65rpb.jpg", imageBlend: "dark", imageFit: "wide" },
  { id: "co08", category: "combos", name: "3 HEINEKEN 600ml", description: "Pack com 3 garrafas Heineken 600ml.", price: 60, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326091/zxufk3ewztmkxpndvpd4.jpg", imageBlend: "dark", imageFit: "wide", badge: "⭐ Destaque" },
  { id: "co09", category: "combos", name: "3 LITRÃO BRAHMA Chopp", description: "Pack com 3 litrões Brahma Chopp.", price: 45, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326067/bhmojdxieygtmeunnhjh.jpg", imageBlend: "dark", imageFit: "wide" },
  { id: "co10", category: "combos", name: "3 LITRÃO SKOL", description: "Pack com 3 litrões Skol.", price: 45, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326070/ynpactkvpc5e6ecywoms.webp", imageBlend: "dark", imageFit: "wide" },
  { id: "co11", category: "combos", name: "3 LITRÃO ORIGINAL", description: "Pack com 3 litrões Original.", price: 60, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326092/qxsbqrdhcc4kcssnhbbs.webp", imageBlend: "dark", imageFit: "wide" },
];

// ─────────────────────────────────────────────────────────
// ⭐ SUPER LIKE — card secreto (somente via botão estrela)
// ─────────────────────────────────────────────────────────
export const SUPER_LIKE_CATEGORY_ID = "superlike";

export const superLikeCategory: Category = {
  id: SUPER_LIKE_CATEGORY_ID,
  label: "SUPER LIKE",
  emoji: "⭐",
  gradient: "from-yellow-400 to-purple-600",
  from: "#FFE500",
  to: "#AA00FF",
  glow: "#FFE500",
  cardImage: "/generated-menu/categories/cat-combos-card.png",
};

export const superLikeItems: MenuItem[] = [
  {
    id: "sl01",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "CHURRASCO À VONTADE",
    description: "Churrasco à Vontade (Individual). Acompanha: Arroz, Farofa e Vinagrete.",
    price: 25,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326077/iuvspplms27ndqvorl0y.png",
    imageBlend: "dark",
    imageFit: "wide",
    badge: "⭐ Destaque",
    obs: "Prato de Todo Dia — Quarta a Domingo, 10:30 às 21hrs",
  },
  {
    id: "sl05",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 LITRÃO SKOL ou BRAHMA",
    description: "Pack com 3 litrões Skol ou 3 litrões Brahma Chopp.",
    price: 45,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326067/bhmojdxieygtmeunnhjh.jpg",
    imageBlend: "dark",
    imageFit: "wide",
  },
  {
    id: "sl06",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 HEINEKEN 600ml",
    description: "Pack com 3 garrafas Heineken 600ml.",
    price: 60,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326091/zxufk3ewztmkxpndvpd4.jpg",
    imageBlend: "dark",
    imageFit: "wide",
    badge: "⭐ Destaque",
  },
  {
    id: "sl07",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 LITRÃO ORIGINAL",
    description: "Pack com 3 litrões Original.",
    price: 60,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326092/qxsbqrdhcc4kcssnhbbs.webp",
    imageBlend: "dark",
    imageFit: "wide",
  },
];

// ─────────────────────────────────────────────────────────
// 🍟 PORÇÕES
// ─────────────────────────────────────────────────────────
export const porcoes: MenuItem[] = [
  { id: "po03", category: "porcoes", name: "BATATA FRITA C/ CHEDDAR E BACON", description: "Batata frita com cheddar derretido e bacon.", priceA: 35, priceB: 55, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900276/porcoespo03-batata-cheddar-bacon.png_jxh3x4.png", imageBlend: "dark", imageFit: "wide" },
  { id: "po02", category: "porcoes", name: "BATATA FRITA SIMPLES", description: "Batata frita crocante.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900274/porcoespo02-batata-frita-simples.png_xwi0dc.png", imageBlend: "dark", badge: "⭐ Destaque", imageFit: "wide" },
  { id: "po07", category: "porcoes", name: "COXINHA FRANGO", description: "4 unidades. Vegana: Brócolis, Cenoura e Batata.", priceA: 18, priceB: 18, labelA: "Frango", labelB: "Vegana", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900275/porcoespo07-coxinha-frango.png_wzu1vh.png", imageBlend: "dark" },
  { id: "po01", category: "porcoes", name: "MINI PASTÉIS", description: "Sabores: Carne, Queijo ou Misto.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781900274/porcoespo01-mini-pasteis.png_md4qrg.png", imageBlend: "dark" },
  { id: "po04", category: "porcoes", name: "BATATA MAMADI", description: "Batata com Cheddar, Catupiry, Bacon e Parmesão Ralado.", priceA: 45, priceB: 60, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326066/gyus9joaxjg5fle20gst.jpg", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi" },
  { id: "po05", category: "porcoes", name: "CALABRESA ACEBOLADA", description: "Calabresa grelhada com cebola.", priceA: 38.9, priceB: 79.9, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326105/z6xbkzwcvh1v5ud6rq5b.jpg", imageBlend: "dark", imageFit: "wide" },
  { id: "po06", category: "porcoes", name: "MANDIOCA FRITA", description: "Mandioca frita crocante.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326108/jz3xbd9wsmhbkqnrahft.jpg", imageBlend: "dark", imageFit: "wide" },
  { id: "po09", category: "porcoes", name: "ESPETINHO", description: "1 unidade. Sabores: Carne, Frango, Linguiça, Queijo Coalho ou Pão de Alho.", price: 16, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326106/ox0aflfbdrwjstlg5btf.jpg", imageBlend: "dark" },
  { id: "po10", category: "porcoes", name: "COUVERT DA MAMADI", description: "Sardela, Caponata de Berinjela, Azeitonas, Queijo Temperado, Calabresa Curada e Pão da Casa.", price: 30, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326074/busfm2xqw86ma3yybefm.jpg", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi" },
];

// ─────────────────────────────────────────────────────────
// 🥩 TÁBUAS
// ─────────────────────────────────────────────────────────
export const tabuas: MenuItem[] = [
  { id: "ta01", category: "porcoes", name: "TÁBUA DE ESPETINHOS", description: "6 Espetos: 2 de Carne + 1 de Frango + 1 de Linguiça + 1 de Queijo Coalho + 1 Pão de Alho. Acompanha Farofa e Vinagrete.", price: 89.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326114/kw0tdwzokq3odiwaklcy.jpg", imageBlend: "dark", imageFit: "wide", badge: "⭐ Destaque" },
  { id: "ta02", category: "porcoes", name: "TÁBUA MISTA", description: "Batata Frita Simples + Calabresa Acebolada + Contra-Filé Acebolado + Frango Acebolado + Mandioca Frita. Acompanha Pão + Farofa + Vinagrete + Maionese Temperada.", price: 129.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326072/sjkazuvopy7f9qo28fog.jpg", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi" },
  { id: "ta03", category: "porcoes", name: "TÁBUA DUPLA 1", description: "Batata Frita Simples + Calabresa Acebolada. Acompanha Pão + Vinagrete + Maionese Temperada.", price: 62.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326088/osqtphp1gga2hq3n6rid.jpg", imageBlend: "dark", imageFit: "wide" },
  { id: "ta04", category: "porcoes", name: "TÁBUA DUPLA 2", description: "Batata Frita Simples + Contra-Filé Acebolado. Acompanha Pão + Vinagrete + Maionese Temperada.", price: 99.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326079/hc5ajmaulhtx9zkfo2js.webp", imageBlend: "dark", imageFit: "wide" },
];

// ─────────────────────────────────────────────────────────
// 🥪 LANCHES & BURGERS
// ─────────────────────────────────────────────────────────
export const lanchesEBurgers: MenuItem[] = [
  { id: "la01", category: "lanches", name: "LANCHE DE CALABRESA", description: "Calabresa, Queijo e Cebola no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326069/p9dnwv78g72db3agfozq.jpg", imageBlend: "dark" },
  { id: "la02", category: "lanches", name: "LANCHE DE CARNE LOUCA", description: "Carne de Panela Desfiada e Temperada no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326100/i01hnokusaffykyvoncl.jpg", imageBlend: "dark", badge: "⭐ Destaque" },
  { id: "la03", category: "lanches", name: "LANCHE DE PERNIL", description: "Pernil com Molho Especial, Cebola Refogada no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326097/f3i2kotmjtgie9fa1uim.avif", imageBlend: "dark" },
  { id: "la04", category: "lanches", name: "LANCHE VEGANO", description: "Berinjela Temperada, Azeitona, Tomate e Cebola no Pão. Acompanha Barbecue. (Vegano)", price: 23.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326103/cd8xf2ftbby2uib0ceoc.webp", imageBlend: "dark", badge: "🌱 Vegano" },
  { id: "bu02", category: "lanches", name: "MAMADI BACON", description: "Pão Brioche, 70g de Carne, Queijo Cheddar, Bacon, Barbecue e Maionese Especial.", priceA: 32.9, priceB: 42.9, labelA: "Lanche", labelB: "Combo", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326089/gsc9sda3vlwbxl9knizd.jpg", imageBlend: "dark", badge: "⭐ Destaque", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
  { id: "bu03", category: "lanches", name: "MAMADI CLÁSSICO", description: "Pão Australiano, 70g de Carne, Queijo Cheddar, Cebola Caramelizada, Bacon, Barbecue e Maionese Especial.", priceA: 37.9, priceB: 47.9, labelA: "Lanche", labelB: "Combo", image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326084/tk450vqdlvhrj1ssnqox.jpg", imageBlend: "dark", badge: "🌈 Especial Mamadi", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
];

// ─────────────────────────────────────────────────────────
// 🍽️ MENU DA MAMADI (Comidinhas Caseiras)
// ─────────────────────────────────────────────────────────
export const menuMamadi: MenuItem[] = [
  { id: "me01", category: "menu", name: "CAFÉ DA MAMADI", description: "Pão na Chapa + Ovos Mexidos + Bacon + Café Preto.", price: 10, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326094/kqddl68lrkmruuo65xoa.jpg", imageBlend: "dark", imageFit: "wide", obs: "Disponível de Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me02", category: "menu", name: "CHURRASCO DA MAMADI", description: "Churrasco à Vontade (Individual). Acompanha: Arroz, Farofa e Vinagrete.", price: 25, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326077/iuvspplms27ndqvorl0y.png", imageBlend: "dark", imageFit: "wide", badge: "⭐ Destaque", obs: "Prato de Todo Dia — Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me03", category: "menu", name: "PRATO EXECUTIVO c/ 2 Espetinhos", description: "Sabores: Carne / Frango / Linguiça / Pão de Alho / Queijo Coalho. Acompanha: Arroz, Feijão, Fritas, Vinagrete e Farofa.", price: 29.99, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326112/ugtdfc420qvoshz5jlnb.png", imageBlend: "dark", imageFit: "wide", obs: "Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me04", category: "menu", name: "BAIÃO DE DOIS — Prato de Domingo", description: "Baião de Dois servido com Mandioca Frita e Tiras de Contra-Filé. Serve 2 pessoas.", price: 49.9, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326110/sd7zrsbpqzlpqec7fouu.png", imageBlend: "dark", imageFit: "wide", badge: "🌈 Especial Mamadi", obs: "Disponível somente aos Domingos" },
  { id: "me05", category: "menu", name: "BERINJELA REFOGADA (Vegano)", description: "Arroz, Berinjela Refogada, Feijão, Fritas, Vinagrete e Farofa.", price: 25, image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1782326085/fjvjxnssbgxhrdhuzkoe.png", imageBlend: "dark", imageFit: "wide", badge: "🌱 Vegano", obs: "Quarta a Domingo, 10:30 às 21hrs" },
];

// ─────────────────────────────────────────────────────────
// EXPORT AGRUPADO
// ─────────────────────────────────────────────────────────
export const allMenuItems: MenuItem[] = [
  ...drinks,
  ...destilados,
  ...cervejas,
  ...prontos,
  ...combos,
  ...porcoes,
  ...tabuas,
  ...lanchesEBurgers,
  ...menuMamadi,
];

export const categories: Category[] = [
  { id: "cervejas", label: "CERVEJAS", emoji: "🍺", gradient: "from-yellow-400 to-green-400", from: "#FFE500", to: "#00E676", glow: "#FFE500" },
  { id: "porcoes", label: "PORÇÕES", emoji: "🍟", gradient: "from-purple-600 to-pink-500", from: "#AA00FF", to: "#FF4081", glow: "#AA00FF" },
  { id: "menu", label: "MENU DA MAMADI", emoji: "🍽️", gradient: "from-orange-400 to-green-500", from: "#FF8C00", to: "#00E676", glow: "#FF8C00" },
  { id: "drinks", label: "DRINKS", emoji: "🍹", gradient: "from-red-600 to-pink-600", from: "#FF3B3B", to: "#FF4081", glow: "#FF3B3B", cardImage: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781813232/mamadicategoriasdrinks-card_obncis.png" },
  { id: "combos", label: "COMBOS & COPÃO", emoji: "🎉", gradient: "from-blue-500 to-purple-600", from: "#2979FF", to: "#AA00FF", glow: "#2979FF" },
  { id: "prontos", label: "ABRIR E BEBER", emoji: "🥤", gradient: "from-green-400 to-blue-500", from: "#00E676", to: "#2979FF", glow: "#00E676" },
  { id: "lanches", label: "LANCHES & BURGERS", emoji: "🥪", gradient: "from-red-600 to-orange-500", from: "#FF3B3B", to: "#FF8C00", glow: "#FF3B3B", cardImage: "/categories/cat-lanches-card.png", coverImage: "/categories/cat-lanches-card.png" },
];

export const itemsByCategory: Record<string, MenuItem[]> = {
  drinks,
  destilados,
  cervejas,
  prontos,
  combos,
  porcoes: [...porcoes, ...tabuas],
  lanches: lanchesEBurgers,
  menu: menuMamadi,
};

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
