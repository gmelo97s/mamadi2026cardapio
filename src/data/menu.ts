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
    id: "dr01",
    category: "drinks",
    name: "GIN TÔNICA",
    description: "GIN Nacional, Água Tônica e Limão Taiti.",
    price: 25,
    image: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781812072/dr01-gin-tonica_rmpvzh.png",
    badge: "⭐ Destaque",
  },
  {
    id: "dr02",
    category: "drinks",
    name: "CAIPIRINHA LIMÃO copo 300ml",
    description: "51/Velho Barreiro.",
    price: 20,
    image: "https://picsum.photos/seed/caipirinha/400/300",
  },
  {
    id: "dr03",
    category: "drinks",
    name: "CAIPILULA copo 300ml",
    description: "Caipirinha de Gengibre com Mel.",
    price: 20,
    image: "https://picsum.photos/seed/caipilula/400/300",
  },
  {
    id: "dr04",
    category: "drinks",
    name: "CAIPIROSKA LIMÃO copo 300ml",
    description: "Balalaika/Saquê.",
    price: 22,
    image: "https://picsum.photos/seed/caipiroska/400/300",
  },
  {
    id: "dr05",
    category: "drinks",
    name: "CAIPIRINHA SABORES copo 550ml",
    description:
      "51/Velho Barreiro / Balalaika / Jambu / Saquê. Sabores: Kiwi / Morango / Maracujá / Caju / Limão.",
    price: 30,
    image: "https://picsum.photos/seed/caipirinhasabores/400/300",
  },
  {
    id: "dr06",
    category: "drinks",
    name: "CHEVETTE",
    description: "Corote de Limão, Suco Mid de Baunilha e Gelo de Coco.",
    price: 20,
    image: "https://picsum.photos/seed/chevette/400/300",
  },
  {
    id: "dr07",
    category: "drinks",
    name: "GIN SABORES",
    description: "Sabores: Tropical / Melancia / Morango / Maçã Verde.",
    price: 25,
    image: "https://picsum.photos/seed/ginsabores/400/300",
  },
  {
    id: "dr08",
    category: "drinks",
    name: "BATIDÃO TROPICAL",
    description: "Caipirinha de Abacaxi com Hortelã.",
    price: 30,
    image: "https://picsum.photos/seed/batidao/400/300",
  },
  {
    id: "dr09",
    category: "drinks",
    name: "MOJITO",
    description: "Rum, Limão e Hortelã.",
    price: 30,
    image: "https://picsum.photos/seed/mojito/400/300",
  },
  {
    id: "dr10",
    category: "drinks",
    name: "CUBA LIBRE",
    description: "Rum, Coca e Limão.",
    price: 30,
    image: "https://picsum.photos/seed/cubalibre/400/300",
  },
  {
    id: "dr11",
    category: "drinks",
    name: "CAIPIRINHA DA MAMADI",
    description: "Caipirinha de Goiaba com Limão.",
    price: 30,
    image: "https://picsum.photos/seed/mamadidrinque/400/300",
    badge: "🌈 Especial Mamadi",
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
    image: "https://picsum.photos/seed/jambu/400/300",
  },
  {
    id: "de02",
    category: "destilados",
    name: "51 / VELHO BARREIRO",
    description: "Dose de cachaça.",
    price: 5,
    image: "https://picsum.photos/seed/51/400/300",
  },
  {
    id: "de03",
    category: "destilados",
    name: "GENGIBRE COM MEL",
    description: "Dose de cachaça de gengibre com mel.",
    price: 10,
    image: "https://picsum.photos/seed/gengibremell/400/300",
  },
  {
    id: "de04",
    category: "destilados",
    name: "BANANINHA / CANELINHA",
    description: "Dose de cachaça de banana ou canela.",
    price: 10,
    image: "https://picsum.photos/seed/bananinha/400/300",
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
    image: "https://picsum.photos/seed/kariri/400/300",
  },
  {
    id: "de06",
    category: "destilados",
    name: "DREHER",
    description: "Dose de Dreher.",
    price: 13,
    image: "https://picsum.photos/seed/dreher/400/300",
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
    image: "https://picsum.photos/seed/tequilaouro/400/300",
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
    image: "https://picsum.photos/seed/campari/400/300",
  },
  {
    id: "de11",
    category: "destilados",
    name: "TANQUERAY (DOSE)",
    description: "Dose de gin Tanqueray.",
    price: 25,
    image: "https://picsum.photos/seed/tanqueray/400/300",
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
    image: "https://picsum.photos/seed/mastergold/400/300",
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
    image: "https://picsum.photos/seed/cavalobranco/400/300",
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
    image: "https://picsum.photos/seed/redlabel/400/300",
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
    image: "https://picsum.photos/seed/jackdaniels/400/300",
    badge: "⭐ Destaque",
    obs: "Combo: Whisky + Energético de Garrafa + Gelo de Sabor",
  },
  {
    id: "de16",
    category: "destilados",
    name: "BALALAIKA",
    description: "Vodka nacional. Dose.",
    price: 15,
    image: "https://picsum.photos/seed/balalaika/400/300",
  },
  {
    id: "de17",
    category: "destilados",
    name: "ABSOLUT",
    description: "Vodka sueca Absolut. Dose.",
    price: 25,
    image: "https://picsum.photos/seed/absolut/400/300",
  },
  {
    id: "de18",
    category: "destilados",
    name: "SMIRNOFF",
    description: "Vodka Smirnoff. Dose.",
    price: 25,
    image: "https://picsum.photos/seed/smirnoff/400/300",
  },
  {
    id: "de19",
    category: "destilados",
    name: "VINHO TINTO",
    description: "Garrafa de vinho tinto.",
    price: 20,
    image: "https://picsum.photos/seed/vinhotinto/400/300",
  },
  {
    id: "de20",
    category: "destilados",
    name: "VINHO ROSÉ",
    description: "Garrafa de vinho rosé.",
    price: 35,
    image: "https://picsum.photos/seed/vinhorose/400/300",
  },
];

// ─────────────────────────────────────────────────────────
// 🍺 CERVEJAS
// ─────────────────────────────────────────────────────────
export const cervejas: MenuItem[] = [
  { id: "ce01", category: "cervejas", name: "BRAHMA CHOPP Litrão", description: "Brahma Chopp 1 litro.", price: 16, image: "https://picsum.photos/seed/brahma/400/300" },
  { id: "ce02", category: "cervejas", name: "SKOL PILSEN Litrão", description: "Skol Pilsen 1 litro.", price: 16, image: "https://picsum.photos/seed/skol/400/300" },
  { id: "ce03", category: "cervejas", name: "AMSTEL Litrão", description: "Amstel 1 litro.", price: 18, image: "https://picsum.photos/seed/amstel/400/300" },
  { id: "ce04", category: "cervejas", name: "ANTÁRTICA Litrão", description: "Antártica 1 litro.", price: 16, image: "https://picsum.photos/seed/antartica/400/300" },
  { id: "ce05", category: "cervejas", name: "BUDWEISER Litrão", description: "Budweiser 1 litro.", price: 20, image: "https://picsum.photos/seed/budweiser/400/300" },
  { id: "ce06", category: "cervejas", name: "BRAHMA DUPLO MALTE Litrão", description: "Brahma Duplo Malte 1 litro.", price: 19, image: "https://picsum.photos/seed/brahmadupl/400/300" },
  { id: "ce07", category: "cervejas", name: "ORIGINAL Litrão", description: "Original 1 litro.", price: 22, image: "https://picsum.photos/seed/original/400/300" },
  { id: "ce08", category: "cervejas", name: "PETRA Litrão", description: "Petra 1 litro.", price: 13, image: "https://picsum.photos/seed/petra/400/300" },
  { id: "ce09", category: "cervejas", name: "HEINEKEN 600ml", description: "Heineken garrafa verde 600ml.", price: 22, image: "https://picsum.photos/seed/heineken600/400/300", badge: "⭐ Destaque" },
  { id: "ce10", category: "cervejas", name: "STELLA 600ml", description: "Stella Artois garrafa verde 600ml.", price: 18, image: "https://picsum.photos/seed/stella600/400/300" },
  { id: "ce11", category: "cervejas", name: "BECK'S 600ml", description: "Beck's garrafa verde 600ml.", price: 18, image: "https://picsum.photos/seed/becks600/400/300" },
  { id: "ce12", category: "cervejas", name: "SPATEN 600ml", description: "Spaten garrafa verde 600ml.", price: 18, image: "https://picsum.photos/seed/spaten600/400/300" },
  { id: "ce13", category: "cervejas", name: "AMSTEL 600ml", description: "Amstel 600ml.", price: 15, image: "https://picsum.photos/seed/amstel600/400/300" },
  { id: "ce14", category: "cervejas", name: "EISENBAHN 600ml", description: "Eisenbahn 600ml.", price: 15, image: "https://picsum.photos/seed/eisenbahn600/400/300" },
  { id: "ce15", category: "cervejas", name: "ORIGINAL 600ml", description: "Original 600ml.", price: 15, image: "https://picsum.photos/seed/original600/400/300" },
  { id: "ce16", category: "cervejas", name: "HEINEKEN 330ml", description: "Long neck Heineken.", price: 15, image: "https://picsum.photos/seed/heineken330/400/300" },
  { id: "ce17", category: "cervejas", name: "BUDWEISER 330ml", description: "Long neck Budweiser.", price: 15, image: "https://picsum.photos/seed/budweiser330/400/300" },
  { id: "ce18", category: "cervejas", name: "STELLA 330ml", description: "Long neck Stella Artois.", price: 15, image: "https://picsum.photos/seed/stella330/400/300" },
  { id: "ce19", category: "cervejas", name: "CORONA 330ml", description: "Long neck Corona.", price: 15, image: "https://picsum.photos/seed/corona330/400/300" },
  { id: "ce20", category: "cervejas", name: "HEINEKEN ZERO 330ml", description: "Long neck Heineken sem álcool.", price: 15, image: "https://picsum.photos/seed/heinekenzero/400/300" },
  { id: "ce21", category: "cervejas", name: "BUDWEISER ZERO 330ml", description: "Long neck Budweiser sem álcool.", price: 15, image: "https://picsum.photos/seed/budweiserzero/400/300" },
];

// ─────────────────────────────────────────────────────────
// 🥤 PRONTOS & SOFTS
// ─────────────────────────────────────────────────────────
export const prontos: MenuItem[] = [
  { id: "pr01", category: "prontos", name: "SKOL BEATS", description: "Drink pronto Skol Beats.", price: 16, image: "https://picsum.photos/seed/skolbeats/400/300" },
  { id: "pr02", category: "prontos", name: "51 ICE", description: "Drink pronto 51 Ice.", price: 16, image: "https://picsum.photos/seed/51ice/400/300" },
  { id: "pr03", category: "prontos", name: "XEQUE MATE", description: "Drink pronto Xeque Mate.", price: 18, image: "https://picsum.photos/seed/xequemate/400/300" },
  { id: "pr04", category: "prontos", name: "DRAFT", description: "Drink pronto Draft.", price: 20, image: "https://picsum.photos/seed/draft/400/300" },
  { id: "pr05", category: "prontos", name: "VIBES", description: "Drink pronto Vibes.", price: 10, image: "https://picsum.photos/seed/vibes/400/300" },
  { id: "pr06", category: "prontos", name: "CERVEJA LATA 350ml", description: "Cerveja em lata 350ml.", price: 10, image: "https://picsum.photos/seed/cervejalata/400/300" },
  { id: "pr07", category: "prontos", name: "SMIRNOFF ICE", description: "Smirnoff Ice long neck.", price: 16, image: "https://picsum.photos/seed/smirnoffice/400/300" },
  { id: "pr08", category: "prontos", name: "RED BULL lata 250ml", description: "Energético Red Bull 250ml.", price: 18, image: "https://picsum.photos/seed/redbull/400/300" },
  { id: "pr09", category: "prontos", name: "MONSTER LATÃO", description: "Energético Monster latão.", price: 18, image: "https://picsum.photos/seed/monster/400/300" },
  { id: "pr10", category: "prontos", name: "COPO ENERGÉTICO 300ml", description: "Energético no copo 300ml.", price: 5, image: "https://picsum.photos/seed/energetico/400/300" },
  { id: "pr11", category: "prontos", name: "SODA ITALIANA", description: "Diversos sabores.", price: 13, image: "https://picsum.photos/seed/sodaitaliana/400/300" },
  { id: "pr12", category: "prontos", name: "REFRIGERANTE", description: "Lata 350ml.", price: 7, image: "https://picsum.photos/seed/refri/400/300" },
  { id: "pr13", category: "prontos", name: "SUCO LATA", description: "Suco em lata.", price: 7, image: "https://picsum.photos/seed/sucolata/400/300" },
  { id: "pr14", category: "prontos", name: "ÁGUA ou ÁGUA COM GÁS", description: "Garrafa.", price: 6, image: "https://picsum.photos/seed/agua/400/300" },
  { id: "pr15", category: "prontos", name: "ÁGUA TÔNICA", description: "Água tônica.", price: 6, image: "https://picsum.photos/seed/aguatonica/400/300" },
  { id: "pr16", category: "prontos", name: "GELO SABORES", description: "Sabores: Coco / Maracujá / Morango.", price: 5, image: "https://picsum.photos/seed/gelosabores/400/300" },
];

// ─────────────────────────────────────────────────────────
// 🎉 COMBOS & COPÃO
// ─────────────────────────────────────────────────────────
export const combos: MenuItem[] = [
  { id: "co01", category: "combos", name: "3 CAIPIRINHA LIMÃO", description: "Somente de limão. Copo 300ml. Pack com 3 unidades.", price: 30, image: "https://picsum.photos/seed/3caipirinha/400/300", badge: "🌈 Especial Mamadi" },
  { id: "co02", category: "combos", name: "2 COPÃO DE GIN", description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.", price: 30, image: "https://picsum.photos/seed/2copaogin/400/300", badge: "🌈 Especial Mamadi" },
  { id: "co03", category: "combos", name: "2 CHEVETTE", description: "Dois Chevettes: Corote de Limão, Suco Mid de Baunilha e Gelo de Coco.", price: 35, image: "https://picsum.photos/seed/2chevette/400/300" },
  { id: "co04", category: "combos", name: "COPÃO DA SORRAH", description: "Dose de Dreher, limão, mel e energético.", price: 20, image: "https://picsum.photos/seed/sorrah/400/300" },
  { id: "co05", category: "combos", name: "COPÃO VODKA C/ ENERGÉTICO", description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.", price: 15, image: "https://picsum.photos/seed/copaovodka/400/300", badge: "🌈 Especial Mamadi" },
  { id: "co06", category: "combos", name: "3 EISENBAHN 600ml", description: "Pack com 3 garrafas Eisenbahn 600ml.", price: 40, image: "https://picsum.photos/seed/3eisenbahn/400/300" },
  { id: "co07", category: "combos", name: "3 ORIGINAL 600ml", description: "Pack com 3 garrafas Original 600ml.", price: 40, image: "https://picsum.photos/seed/3original/400/300" },
  { id: "co08", category: "combos", name: "3 HEINEKEN 600ml", description: "Pack com 3 garrafas Heineken 600ml.", price: 60, image: "https://picsum.photos/seed/3heineken/400/300", badge: "⭐ Destaque" },
  { id: "co09", category: "combos", name: "3 LITRÃO BRAHMA Chopp", description: "Pack com 3 litrões Brahma Chopp.", price: 45, image: "https://picsum.photos/seed/3litraobrahma/400/300" },
  { id: "co10", category: "combos", name: "3 LITRÃO SKOL", description: "Pack com 3 litrões Skol.", price: 45, image: "https://picsum.photos/seed/3litraoskol/400/300" },
  { id: "co11", category: "combos", name: "3 LITRÃO ORIGINAL", description: "Pack com 3 litrões Original.", price: 60, image: "https://picsum.photos/seed/3litraooriginal/400/300" },
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
    image: "https://picsum.photos/seed/churrascomamadi/400/300",
    badge: "⭐ Destaque",
    obs: "Prato de Todo Dia — Quarta a Domingo, 10:30 às 21hrs",
  },
  {
    id: "sl02",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "COPÃO VODKA C/ ENERGÉTICO",
    description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.",
    price: 15,
    image: "https://picsum.photos/seed/copaovodka/400/300",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "sl03",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "2 COPÃO DE GIN",
    description: "Diversos sabores: Tropical / Melancia / Morango / Maçã Verde. Copo 770ml.",
    price: 30,
    image: "https://picsum.photos/seed/2copaogin/400/300",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "sl04",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 CAIPIRINHA LIMÃO",
    description: "Somente de limão. Copo 300ml. Pack com 3 unidades.",
    price: 30,
    image: "https://picsum.photos/seed/3caipirinha/400/300",
    badge: "🌈 Especial Mamadi",
  },
  {
    id: "sl05",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 LITRÃO SKOL ou BRAHMA",
    description: "Pack com 3 litrões Skol ou 3 litrões Brahma Chopp.",
    price: 45,
    image: "https://picsum.photos/seed/3litraoskol/400/300",
  },
  {
    id: "sl06",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 HEINEKEN 600ml",
    description: "Pack com 3 garrafas Heineken 600ml.",
    price: 60,
    image: "https://picsum.photos/seed/3heineken/400/300",
    badge: "⭐ Destaque",
  },
  {
    id: "sl07",
    category: SUPER_LIKE_CATEGORY_ID,
    name: "3 LITRÃO ORIGINAL",
    description: "Pack com 3 litrões Original.",
    price: 60,
    image: "https://picsum.photos/seed/3litraooriginal/400/300",
  },
];

// ─────────────────────────────────────────────────────────
// 🍟 PORÇÕES
// ─────────────────────────────────────────────────────────
export const porcoes: MenuItem[] = [
  { id: "po01", category: "porcoes", name: "MINI PASTÉIS", description: "Sabores: Carne, Queijo ou Misto.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://picsum.photos/seed/pasteis/400/300" },
  { id: "po02", category: "porcoes", name: "BATATA FRITA SIMPLES", description: "Batata frita crocante.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://picsum.photos/seed/batatafrita/400/300", badge: "⭐ Destaque" },
  { id: "po03", category: "porcoes", name: "BATATA FRITA C/ CHEDDAR E BACON", description: "Batata frita com cheddar derretido e bacon.", priceA: 35, priceB: 55, labelA: "Meia", labelB: "Inteira", image: "https://picsum.photos/seed/batatacheddar/400/300" },
  { id: "po04", category: "porcoes", name: "BATATA MAMADI", description: "Batata com Cheddar, Catupiry, Bacon e Parmesão Ralado.", priceA: 45, priceB: 60, labelA: "Meia", labelB: "Inteira", image: "https://picsum.photos/seed/batatamamadi/400/300", badge: "🌈 Especial Mamadi" },
  { id: "po05", category: "porcoes", name: "CALABRESA ACEBOLADA", description: "Calabresa grelhada com cebola.", priceA: 38.9, priceB: 79.9, labelA: "Meia", labelB: "Inteira", image: "https://picsum.photos/seed/calabresa/400/300" },
  { id: "po06", category: "porcoes", name: "MANDIOCA FRITA", description: "Mandioca frita crocante.", priceA: 25, priceB: 45, labelA: "Meia", labelB: "Inteira", image: "https://picsum.photos/seed/mandioca/400/300" },
  { id: "po07", category: "porcoes", name: "COXINHA FRANGO", description: "4 unidades. Sabor Frango.", price: 18, image: "https://picsum.photos/seed/coxinhafrango/400/300" },
  { id: "po08", category: "porcoes", name: "COXINHA VEGANA", description: "4 unidades. Sabor Vegana: Brócolis, Cenoura e Batata.", price: 18, image: "https://picsum.photos/seed/coxinhavegana/400/300", badge: "🌱 Vegano" },
  { id: "po09", category: "porcoes", name: "ESPETINHO", description: "1 unidade. Sabores: Carne, Frango, Linguiça, Queijo Coalho ou Pão de Alho.", price: 16, image: "https://picsum.photos/seed/espetinho/400/300" },
  { id: "po10", category: "porcoes", name: "COUVERT DA MAMADI", description: "Sardela, Caponata de Berinjela, Azeitonas, Queijo Temperado, Calabresa Curada e Pão da Casa.", price: 30, image: "https://picsum.photos/seed/couvert/400/300", badge: "🌈 Especial Mamadi" },
];

// ─────────────────────────────────────────────────────────
// 🥩 TÁBUAS
// ─────────────────────────────────────────────────────────
export const tabuas: MenuItem[] = [
  { id: "ta01", category: "porcoes", name: "TÁBUA DE ESPETINHOS", description: "6 Espetos: 2 de Carne + 1 de Frango + 1 de Linguiça + 1 de Queijo Coalho + 1 Pão de Alho. Acompanha Farofa e Vinagrete.", price: 89.9, image: "https://picsum.photos/seed/tabuaespetinhos/400/300", badge: "⭐ Destaque" },
  { id: "ta02", category: "porcoes", name: "TÁBUA MISTA", description: "Batata Frita Simples + Calabresa Acebolada + Contra-Filé Acebolado + Frango Acebolado + Mandioca Frita. Acompanha Pão + Farofa + Vinagrete + Maionese Temperada.", price: 129.9, image: "https://picsum.photos/seed/tabuamista/400/300", badge: "🌈 Especial Mamadi" },
  { id: "ta03", category: "porcoes", name: "TÁBUA DUPLA 1", description: "Batata Frita Simples + Calabresa Acebolada. Acompanha Pão + Vinagrete + Maionese Temperada.", price: 62.9, image: "https://picsum.photos/seed/tabuadupla1/400/300" },
  { id: "ta04", category: "porcoes", name: "TÁBUA DUPLA 2", description: "Batata Frita Simples + Contra-Filé Acebolado. Acompanha Pão + Vinagrete + Maionese Temperada.", price: 99.9, image: "https://picsum.photos/seed/tabuadupla2/400/300" },
];

// ─────────────────────────────────────────────────────────
// 🥪 LANCHES & BURGERS
// ─────────────────────────────────────────────────────────
export const lanchesEBurgers: MenuItem[] = [
  { id: "la01", category: "lanches", name: "LANCHE DE CALABRESA", description: "Calabresa, Queijo e Cebola no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://picsum.photos/seed/lanchecalabresa/400/300" },
  { id: "la02", category: "lanches", name: "LANCHE DE CARNE LOUCA", description: "Carne de Panela Desfiada e Temperada no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://picsum.photos/seed/carnelouca/400/300", badge: "⭐ Destaque" },
  { id: "la03", category: "lanches", name: "LANCHE DE PERNIL", description: "Pernil com Molho Especial, Cebola Refogada no Pão. Acompanha Maionese Temperada.", price: 27.9, image: "https://picsum.photos/seed/lanchepernil/400/300" },
  { id: "la04", category: "lanches", name: "LANCHE VEGANO", description: "Berinjela Temperada, Azeitona, Tomate e Cebola no Pão. Acompanha Barbecue. (Vegano)", price: 23.9, image: "https://picsum.photos/seed/lanchevegano/400/300", badge: "🌱 Vegano" },
  { id: "bu01", category: "lanches", name: "MAMADI ORIGINAL", description: "Pão Brioche, 70g de Carne, Queijo Cheddar e Maionese Especial.", priceA: 29.9, priceB: 39.9, labelA: "Lanche", labelB: "Combo", image: "https://picsum.photos/seed/madadioriginal/400/300", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
  { id: "bu02", category: "lanches", name: "MAMADI BACON", description: "Pão Brioche, 70g de Carne, Queijo Cheddar, Bacon, Barbecue e Maionese Especial.", priceA: 32.9, priceB: 42.9, labelA: "Lanche", labelB: "Combo", image: "https://picsum.photos/seed/mamadibacon/400/300", badge: "⭐ Destaque", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
  { id: "bu03", category: "lanches", name: "MAMADI CLÁSSICO", description: "Pão Australiano, 70g de Carne, Queijo Cheddar, Cebola Caramelizada, Bacon, Barbecue e Maionese Especial.", priceA: 37.9, priceB: 47.9, labelA: "Lanche", labelB: "Combo", image: "https://picsum.photos/seed/madadiclassico/400/300", badge: "🌈 Especial Mamadi", obs: "Combo: Lanche + Batata Frita Simples + Refrigerante Lata" },
];

// ─────────────────────────────────────────────────────────
// 🍽️ MENU DA MAMADI (Comidinhas Caseiras)
// ─────────────────────────────────────────────────────────
export const menuMamadi: MenuItem[] = [
  { id: "me01", category: "menu", name: "CAFÉ DA MAMADI", description: "Pão na Chapa + Ovos Mexidos + Bacon + Café Preto.", price: 10, image: "https://picsum.photos/seed/cafemamadi/400/300", obs: "Disponível de Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me02", category: "menu", name: "CHURRASCO DA MAMADI", description: "Churrasco à Vontade (Individual). Acompanha: Arroz, Farofa e Vinagrete.", price: 25, image: "https://picsum.photos/seed/churrascomamadi/400/300", badge: "⭐ Destaque", obs: "Prato de Todo Dia — Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me03", category: "menu", name: "PRATO EXECUTIVO c/ 2 Espetinhos", description: "Sabores: Carne / Frango / Linguiça / Pão de Alho / Queijo Coalho. Acompanha: Arroz, Feijão, Fritas, Vinagrete e Farofa.", price: 29.99, image: "https://picsum.photos/seed/pratoexecutivo/400/300", obs: "Quarta a Domingo, 10:30 às 21hrs" },
  { id: "me04", category: "menu", name: "BAIÃO DE DOIS — Prato de Domingo", description: "Baião de Dois servido com Mandioca Frita e Tiras de Contra-Filé. Serve 2 pessoas.", price: 49.9, image: "https://picsum.photos/seed/baiaomedois/400/300", badge: "🌈 Especial Mamadi", obs: "Disponível somente aos Domingos" },
  { id: "me05", category: "menu", name: "BERINJELA REFOGADA (Vegano)", description: "Arroz, Berinjela Refogada, Feijão, Fritas, Vinagrete e Farofa.", price: 25, image: "https://picsum.photos/seed/berinjela/400/300", badge: "🌱 Vegano", obs: "Quarta a Domingo, 10:30 às 21hrs" },
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
  { id: "prontos", label: "PRONTOS & SOFTS", emoji: "🥤", gradient: "from-green-400 to-blue-500", from: "#00E676", to: "#2979FF", glow: "#00E676" },
  { id: "destilados", label: "DESTILADOS", emoji: "🥃", gradient: "from-orange-500 to-yellow-400", from: "#FF8C00", to: "#FFE500", glow: "#FF8C00", cardImage: "https://res.cloudinary.com/du8l3x4rh/image/upload/v1781813557/destilados-card_fuifl2.png" },
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
