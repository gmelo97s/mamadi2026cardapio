import { isDrink, itemById, items } from "./menu";
import type { Item } from "./types";

export interface Pairing {
  item: Item;
  reason: string;
}

type Pair = [id: string, reason: string];

/*
 * "Combina com": 3 sugestões por item, escolhidas à mão.
 * Bebida sugere comida, comida sugere bebida (com algumas exceções que fazem sentido,
 * como tequila → limão e sal, ou burger → batata).
 * Se um item sugerido sair do cardápio, a sugestão é trocada por uma das reservas.
 */
const CURATED: Record<string, Pair[]> = {
  // Litrão & cervejas
  "litrao-brahma-skol-antarctica": [["calabresa-acebolada", "Dupla clássica de boteco"], ["mini-pasteis", "Pastel e gelada, não tem erro"], ["batata-mamadi", "A batata da casa pede litrão"]],
  "litrao-petra": [["coxinha", "Coxinha e litrão, o combo do centro"], ["mandioca-frita", "Crocante com gelada"], ["espetinho", "Um espetinho pra ir junto"]],
  "litrao-amstel": [["burger-bacon", "Burger e cerveja, simples assim"], ["batata-cheddar-bacon", "Cheddar chama gelada"], ["tabua-dupla-1", "Pra dividir com alguém"]],
  "litrao-budweiser-duplo-malte": [["burger-classico", "O burger mais caprichado da casa"], ["batata-louca", "Carne louca com malte"], ["espetinho", "Um espetinho pra ir junto"]],
  "litrao-original": [["churrasco-da-mamadi", "Churrasco pede Original"], ["tabua-espetinhos", "Rodada de espeto"], ["calabresa-acebolada", "Dupla clássica de boteco"]],
  "promo-3-litrao": [["tabua-mista", "Rodada de três pede tábua"], ["mini-pasteis", "Pastel pra mesa toda"], ["calabresa-acebolada", "Dupla clássica de boteco"]],
  "promo-3-litrao-original": [["tabua-espetinhos", "Espeto pra cada litrão"], ["tabua-mista", "Pra galera toda"], ["batata-mamadi", "A batata da casa"]],
  "heineken-600": [["batata-cheddar-bacon", "Cheddar chama gelada"], ["burger-original", "Burger e cerveja"], ["mini-pasteis", "Pastel e gelada, não tem erro"]],
  "eisenbahn-600": [["lanche-pernil", "Pernil com cerveja encorpada"], ["calabresa-acebolada", "Dupla clássica de boteco"], ["couvert-da-mamadi", "Pra ir beliscando"]],
  "cacildis-600": [["coxinha", "Coxinha e gelada"], ["mandioca-frita", "Crocante com gelada"], ["espetinho", "Um espetinho pra ir junto"]],
  "cerveja-long-neck": [["coxinha", "Coxinha e gelada"], ["batata-simples", "A batatinha de sempre"], ["lanche-calabresa", "Lanche de boteco raiz"]],
  "cerveja-lata": [["mini-pasteis", "Pastel e gelada, não tem erro"], ["espetinho", "Um espetinho pra ir junto"], ["coxinha", "Coxinha e gelada"]],

  // Copão
  "copao-vodka": [["batata-cheddar-bacon", "Pra forrar o estômago"], ["mini-pasteis", "Pra beliscar entre um gole e outro"], ["coxinha", "Promo com promo"]],
  "copao-gin": [["batata-louca", "Carne louca com gin, confia"], ["mini-pasteis", "Pra beliscar entre um gole e outro"], ["couvert-da-mamadi", "Petisco leve pro gin"]],
  "chevette": [["coxinha", "Barato com barato, a conta agradece"], ["batata-simples", "A batatinha de sempre"], ["mini-pasteis", "Pastel pra acompanhar"]],
  "copao-sorrah": [["calabresa-acebolada", "Pra segurar o energético"], ["batata-mamadi", "A batata da casa"], ["espetinho", "Um espetinho pra ir junto"]],
  "whisky-master-gold": [["calabresa-acebolada", "Clássico com whisky"], ["tabua-dupla-1", "Pra dividir"], ["gelo-sabor", "Troca o gelo e muda o drink"]],

  // Caipirinhas & drinks
  "caipirinha-viva-o-nordeste": [["baiao-de-dois", "Tudo nordestino, tudo nosso"], ["mandioca-frita", "Macaxeira e rapadura, casamento perfeito"], ["espetinho", "Peça o de queijo coalho"]],
  "caipilula": [["coxinha", "Barato com barato, a conta agradece"], ["mini-pasteis", "Pastel pra celebrar"], ["porcao-de-pao", "Pãozinho temperado"]],
  "choro-da-extrema-direita": [["mini-pasteis", "Pastel pra comemorar"], ["batata-mamadi", "Batata com close"], ["calabresa-acebolada", "Pra brindar com a mesa toda"]],
  "caipirinha-limao": [["mandioca-frita", "Bem brasileiro"], ["calabresa-acebolada", "Dupla clássica de boteco"], ["couvert-da-mamadi", "Pra ir beliscando"]],
  "promo-3-caipirinhas": [["tabua-dupla-1", "Três caipis, uma tábua, todo mundo feliz"], ["mini-pasteis", "Pastel pra mesa toda"], ["mandioca-frita", "Bem brasileiro"]],
  "caipirinha-sabores": [["batata-mamadi", "A batata da casa"], ["mini-pasteis", "Pastel e caipi"], ["coxinha", "Coxinha pra acompanhar"]],
  "mojito": [["couvert-da-mamadi", "Fresquinho com petisco leve"], ["mini-pasteis", "Pastel de queijo, de preferência"], ["lanche-vegano", "Leve e fresco"]],
  "cuba-libre": [["burger-bacon", "Rum, coca e bacon"], ["batata-cheddar-bacon", "Cheddar chama drink"], ["calabresa-acebolada", "Clássico de boteco"]],
  "kariri-mel-limao": [["espetinho", "Peça o de queijo coalho"], ["mandioca-frita", "Crocante com mel e limão"], ["couvert-da-mamadi", "Pra ir beliscando"]],
  "dreher-mel-limao": [["calabresa-acebolada", "Clássico de boteco"], ["espetinho", "Um espetinho pra ir junto"], ["mini-pasteis", "Pastel pra acompanhar"]],

  // Divas: drink especial pede petisco à altura (reservas abaixo variam por diva)
  "vogue": [["batata-cheddar-bacon", "O cheddar acalma a pimenta"], ["mini-pasteis", "Pastel com close"], ["coxinha", "Diva também belisca"]],
  "diamonds": [["mini-pasteis", "Brilha mais com pastel"], ["shot-limao-sal", "Brilho extra: sal e limão"], ["batata-mamadi", "Batata com close"]],

  // Doses
  "dose-tequila-ouro": [["shot-limao-sal", "O ritual completo: sal, tequila, limão"], ["mini-pasteis", "Pastel pra segurar"], ["calabresa-acebolada", "Petisco de respeito"]],
  "dose-tequila-prata": [["shot-limao-sal", "O ritual completo: sal, tequila, limão"], ["mini-pasteis", "Pastel pra segurar"], ["calabresa-acebolada", "Petisco de respeito"]],
  "dose-51-velho-barreiro": [["litrao-brahma-skol-antarctica", "A clássica: dose e litrão"], ["calabresa-acebolada", "Petisco de boteco raiz"], ["espetinho", "Um espetinho pra ir junto"]],
  "dose-jambu-dreher": [["litrao-brahma-skol-antarctica", "Depois do jambu, um gole de gelada"], ["mandioca-frita", "Crocante pra acompanhar"], ["espetinho", "Um espetinho pra ir junto"]],
  "dose-gengibre-mel": [["mini-pasteis", "Pastel pra acompanhar"], ["couvert-da-mamadi", "Pra ir beliscando"], ["porcao-de-pao", "Pãozinho temperado"]],
  "dose-bananinha-canelinha": [["mini-pasteis", "Pastel pra acompanhar"], ["coxinha", "Coxinha e licorzinho"], ["calabresa-acebolada", "Clássico de boteco"]],
  "dose-licor-43": [["copo-gelo-300", "Com gelo fica ainda melhor"], ["couvert-da-mamadi", "Pra ir beliscando"], ["mini-pasteis", "Pastel de queijo, de preferência"]],

  // Vinhos & prontos
  "vinho-tinto": [["couvert-da-mamadi", "Queijo, azeitona e vinho"], ["porcao-de-pao", "Pão temperado no azeite"], ["tabua-dupla-2", "Contra-filé com tinto"]],
  "vinho-rose": [["couvert-da-mamadi", "Queijo, azeitona e rosé"], ["mini-pasteis", "Pastel de queijo, de preferência"], ["porcao-de-pao", "Pão temperado no azeite"]],

  // Sem álcool & extras
  "refrigerante": [["burger-original", "Burger e refri, clássico"], ["lanche-calabresa", "Lanche de boteco raiz"], ["batata-simples", "A batatinha de sempre"]],
  "suco-natural": [["prato-executivo", "Almoço completo"], ["prato-vegano", "Leve e fresquinho"], ["lanche-vegano", "Leve e fresco"]],
  "soda-italiana": [["mini-pasteis", "Pastel pra acompanhar"], ["lanche-vegano", "Leve e fresco"], ["coxinha", "Coxinha pra acompanhar"]],
  "agua": [["litrao-brahma-skol-antarctica", "Um copo d'água entre um litrão e outro"], ["prato-executivo", "Almoço completo"], ["mini-pasteis", "Pastel pra acompanhar"]],
  "agua-tonica": [["copao-gin", "Tônica e gin, dupla certa"], ["whisky-master-gold", "Pra quem gosta de misturar"], ["couvert-da-mamadi", "Petisco leve"]],
  "monster": [["whisky-master-gold", "Energético pede Master Gold"], ["copao-vodka", "Vodka com energético"], ["gelo-sabor", "Gelo de coco por cima"]],
  "red-bull": [["whisky-master-gold", "Energético pede Master Gold"], ["copao-vodka", "Vodka com energético"], ["gelo-sabor", "Gelo de coco por cima"]],
  "gelo-sabor": [["whisky-master-gold", "Gelo de coco no whisky, clássico"], ["copao-vodka", "Pra dar sabor no copão"], ["red-bull", "Energético com gelo de sabor"]],
  "copo-energetico": [["copao-vodka", "Vodka com energético"], ["whisky-master-gold", "Master Gold com energético"], ["dose-jambu-dreher", "Dreher com energético"]],
  "copo-gelo-300": [["dose-licor-43", "Licor 43 com gelo"], ["refrigerante", "Refri bem gelado"], ["agua", "Água bem gelada"]],
  "copo-gelo-770": [["copao-vodka", "Copão bem gelado"], ["refrigerante", "Refri bem gelado"], ["agua-tonica", "Tônica bem gelada"]],
  "shot-limao-sal": [["dose-tequila-prata", "Sal, tequila, limão"], ["dose-tequila-ouro", "Sal, tequila, limão"], ["diamonds", "A diva da tequila"]],

  // Comidinhas da Mamadi
  "churrasco-da-mamadi": [["litrao-original", "Churrasco pede gelada"], ["caipirinha-limao", "Caipirinha com churrasco, sem erro"], ["refrigerante", "Pra quem tá de boa"]],
  "prato-executivo": [["suco-natural", "Almoço completo"], ["litrao-brahma-skol-antarctica", "Um litrão pra dividir no almoço"], ["refrigerante", "Clássico do almoço"]],
  "baiao-de-dois": [["caipirinha-viva-o-nordeste", "Tudo nordestino, tudo nosso"], ["litrao-original", "Serve 2? O litrão também"], ["suco-natural", "Pra quem vai de leve"]],
  "prato-vegano": [["suco-natural", "Leve e fresquinho"], ["caipirinha-sabores", "Caipi de kiwi pra acompanhar"], ["soda-italiana", "Refrescante"]],

  // Porções
  "mini-pasteis": [["litrao-brahma-skol-antarctica", "Pastel e gelada, não tem erro"], ["copao-vodka", "Promo com pastel"], ["caipirinha-limao", "Clássico brasileiro"]],
  "coxinha": [["litrao-petra", "Coxinha e litrão, o combo do centro"], ["caipilula", "Barato com barato, a conta agradece"], ["refrigerante", "Coxinha e refri"]],
  "batata-simples": [["litrao-brahma-skol-antarctica", "Batata e gelada"], ["copao-vodka", "Promo com batata"], ["maionese-barbecue", "Potinho pra mergulhar"]],
  "batata-cheddar-bacon": [["litrao-amstel", "Cheddar chama gelada"], ["copao-gin", "Gin pra equilibrar"], ["cuba-libre", "Rum, coca e bacon"]],
  "batata-mamadi": [["promo-3-litrao", "A batata da casa pede rodada"], ["copao-gin", "Gin pra equilibrar"], ["bad-romance", "Batata com close"]],
  "batata-louca": [["litrao-original", "Carne louca com Original"], ["copao-vodka", "Promo pra acompanhar"], ["caipirinha-sabores", "Caipi de maracujá, de preferência"]],
  "calabresa-acebolada": [["litrao-brahma-skol-antarctica", "Dupla clássica de boteco"], ["dose-51-velho-barreiro", "Uma dose pra acompanhar"], ["caipirinha-limao", "Clássico brasileiro"]],
  "mandioca-frita": [["caipirinha-viva-o-nordeste", "Macaxeira e rapadura"], ["litrao-brahma-skol-antarctica", "Crocante com gelada"], ["kariri-mel-limao", "Mel e limão com mandioca"]],
  "espetinho": [["litrao-original", "Espeto pede Original"], ["caipirinha-limao", "Clássico de churrasquinho"], ["refrigerante", "Pra quem tá de boa"]],
  "couvert-da-mamadi": [["vinho-tinto", "Queijo, azeitona e vinho"], ["mojito", "Fresquinho com petisco leve"], ["litrao-amstel", "Pra ir beliscando"]],
  "porcao-de-pao": [["vinho-tinto", "Pão no azeite com tinto"], ["caipirinha-limao", "Pãozinho e caipi"], ["litrao-brahma-skol-antarctica", "Pra ir beliscando"]],

  // Lanches & burgers
  "lanche-calabresa": [["litrao-brahma-skol-antarctica", "Lanche de boteco raiz"], ["refrigerante", "Lanche e refri"], ["batata-simples", "Batata pra completar"]],
  "lanche-carne-louca": [["litrao-original", "Carne louca com Original"], ["refrigerante", "Lanche e refri"], ["batata-simples", "Batata pra completar"]],
  "lanche-pernil": [["eisenbahn-600", "Pernil com cerveja encorpada"], ["refrigerante", "Lanche e refri"], ["extra-abacaxi", "Pernil com abacaxi é tradição"]],
  "lanche-vegano": [["suco-natural", "Leve e fresco"], ["soda-italiana", "Refrescante"], ["caipirinha-sabores", "Caipi de kiwi pra acompanhar"]],
  "burger-original": [["batata-simples", "Burger sem batata não dá"], ["refrigerante", "Burger e refri, clássico"], ["litrao-amstel", "Burger e cerveja"]],
  "burger-bacon": [["batata-cheddar-bacon", "Bacon em dobro"], ["litrao-budweiser-duplo-malte", "Burger e cerveja"], ["cuba-libre", "Rum, coca e bacon"]],
  "burger-classico": [["batata-mamadi", "O mais caprichado com a batata da casa"], ["litrao-original", "Burger e Original"], ["copao-gin", "Gin pra equilibrar"]],
  "maionese-barbecue": [["batata-simples", "Pra mergulhar a batata"], ["mandioca-frita", "Pra mergulhar a mandioca"], ["lanche-calabresa", "Maionese a mais no lanche"]],
  "extra-queijo": [["burger-original", "Queijo em dobro"], ["lanche-calabresa", "Mais queijo na calabresa"], ["lanche-carne-louca", "Carne louca com queijo"]],
  "extra-abacaxi": [["burger-classico", "Abacaxi no burger: experimente"], ["lanche-pernil", "Pernil com abacaxi é tradição"], ["burger-bacon", "Doce com bacon"]],

  // Tábuas
  "tabua-espetinhos": [["promo-3-litrao-original", "Tábua pede rodada"], ["caipirinha-limao", "Clássico de churrasquinho"], ["refrigerante", "Pra quem tá de boa"]],
  "tabua-mista": [["litrao-original", "Original gelada pra mesa"], ["caipirinha-viva-o-nordeste", "A caipirinha da casa pra brindar"], ["promo-3-litrao", "Pra galera toda"]],
  "tabua-dupla-1": [["litrao-brahma-skol-antarctica", "Um litrão pra dupla"], ["copao-vodka", "Dois copões pra dois"], ["caipirinha-limao", "Clássico brasileiro"]],
  "tabua-dupla-2": [["vinho-tinto", "Contra-filé com tinto"], ["litrao-original", "Um litrão pra dupla"], ["caipirinha-sabores", "Caipi pra acompanhar"]],
};

// Reservas: completam a lista quando falta sugestão (ou quando um item sai do cardápio)
const FOOD_FALLBACK: Pair[] = [
  ["mini-pasteis", "Diva também belisca"],
  ["batata-mamadi", "Batata com close"],
  ["coxinha", "Petisco à altura"],
  ["batata-cheddar-bacon", "Pra dançar sem fome"],
  ["couvert-da-mamadi", "Pra ir beliscando"],
  ["mandioca-frita", "Crocante pra acompanhar"],
  ["calabresa-acebolada", "Clássico de boteco"],
  ["espetinho", "Um espetinho pra ir junto"],
];
const DRINK_FALLBACK: Pair[] = [
  ["litrao-brahma-skol-antarctica", "Gelada pra acompanhar"],
  ["caipirinha-limao", "Clássico brasileiro"],
  ["copao-vodka", "Promo pra acompanhar"],
  ["refrigerante", "Pra quem tá de boa"],
  ["litrao-original", "Gelada pra acompanhar"],
];

/*
 * Promoção junto: bebida que tem promoção parecida sugere 2 comidas + a promoção dela
 * (litrão → 3 litrões, caipirinha → 3 caipirinhas, copão → 2 copões, energético → copão de vodka).
 */
const P3L: Pair = ["promo-3-litrao", "Na rodada de 3 sai R$ 15 cada (Brahma ou Skol)"];
const P3C: Pair = ["promo-3-caipirinhas", "Rodada de caipirinha: 3 por R$ 30"];
const PCV: Pair = ["copao-vodka", "Promo: 2 copões de vodka por R$ 15"];
const PCG: Pair = ["copao-gin", "Promo: 2 copões de gin por R$ 30"];
const P3O: Pair = ["promo-3-litrao-original", "Na rodada de 3 sai R$ 20 cada"];

const DRINK_PROMO: Record<string, Pair> = {
  "litrao-brahma-skol-antarctica": ["promo-3-litrao", "Na rodada de 3 sai R$ 15 cada"],
  "litrao-petra": P3L,
  "litrao-amstel": P3L,
  "litrao-budweiser-duplo-malte": P3L,
  "litrao-original": P3O,
  "heineken-600": ["promo-3-litrao", "Mais cerveja por menos: 3 litrões por R$ 45"],
  "eisenbahn-600": ["promo-3-litrao", "Mais cerveja por menos: 3 litrões por R$ 45"],
  "cacildis-600": ["promo-3-litrao", "Mais cerveja por menos: 3 litrões por R$ 45"],
  "cerveja-long-neck": ["promo-3-litrao", "Mais cerveja por menos: 3 litrões por R$ 45"],
  "cerveja-lata": ["promo-3-litrao", "Mais cerveja por menos: 3 litrões por R$ 45"],
  "caipirinha-limao": ["promo-3-caipirinhas", "Leva 3 por R$ 30 e sai R$ 10 cada"],
  "caipilula": ["promo-3-caipirinhas", "Rodada de caipirinha: 3 por R$ 30"],
  "caipirinha-viva-o-nordeste": P3C,
  "choro-da-extrema-direita": P3C,
  "caipirinha-sabores": P3C,
  "kariri-mel-limao": P3C,
  "dreher-mel-limao": P3C,
  "dose-51-velho-barreiro": ["promo-3-caipirinhas", "Caipirinha de 51: 3 por R$ 30"],
  "chevette": PCV,
  "copao-sorrah": PCV,
  "whisky-master-gold": PCV,
  "copao-vodka": ["copao-gin", "Prefere gin? 2 copões por R$ 30"],
  "copao-gin": ["copao-vodka", "Ou de vodka: 2 copões por R$ 15"],
  "monster": ["copao-vodka", "Vodka com energético: 2 copões por R$ 15"],
  "red-bull": ["copao-vodka", "Vodka com energético: 2 copões por R$ 15"],
  "copo-energetico": ["copao-vodka", "Vodka com energético: 2 copões por R$ 15"],
  "gelo-sabor": ["copao-vodka", "Gelo de sabor no copão: 2 por R$ 15"],
  "agua-tonica": ["copao-gin", "Gin tônica no copão: 2 por R$ 30"],
};

/* Comida sugere 2 bebidas + uma das promoções mais pedidas da casa. */
const FOOD_PROMO: Record<string, Pair> = {
  "mini-pasteis": ["promo-3-litrao", "Pastel pede rodada: 3 litrões por R$ 45"],
  "coxinha": PCV,
  "batata-simples": P3L,
  "batata-cheddar-bacon": PCG,
  "batata-mamadi": ["promo-3-litrao", "A batata da casa pede rodada: 3 litrões por R$ 45"],
  "batata-louca": PCV,
  "calabresa-acebolada": ["promo-3-litrao", "Calabresa e rodada de litrão: 3 por R$ 45"],
  "mandioca-frita": P3C,
  "espetinho": P3O,
  "couvert-da-mamadi": P3C,
  "porcao-de-pao": P3C,
  "churrasco-da-mamadi": P3O,
  "prato-executivo": P3C,
  "baiao-de-dois": ["promo-3-caipirinhas", "Caipirinha pra mesa: 3 por R$ 30"],
  "prato-vegano": P3C,
  "lanche-calabresa": P3L,
  "lanche-carne-louca": PCV,
  "lanche-pernil": P3L,
  "lanche-vegano": P3C,
  "burger-original": PCV,
  "burger-bacon": P3L,
  "burger-classico": PCG,
  "tabua-espetinhos": P3O,
  "tabua-mista": ["promo-3-litrao", "Pra galera toda: 3 litrões por R$ 45"],
  "tabua-dupla-1": PCV,
  "tabua-dupla-2": PCG,
};

function hash(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

const isPromo = (it: Item) => !!it.tags?.includes("promo");
/** a promoção já é desse produto: não sugerir o mesmo produto avulso junto */
const SAME_AS_PROMO: Record<string, string> = {
  "promo-3-litrao": "litrao-brahma-skol-antarctica",
  "promo-3-litrao-original": "litrao-original",
  "promo-3-caipirinhas": "caipirinha-limao",
};

export function pairingsFor(it: Item): Pairing[] {
  const out: Pairing[] = [];
  const seen = new Set([it.id]);
  const push = ([id, reason]: Pair, ok: (x: Item) => boolean = () => true, limit = 3) => {
    if (out.length >= limit || seen.has(id)) return;
    const target = itemById.get(id);
    if (!target || !ok(target)) return;
    seen.add(id);
    out.push({ item: target, reason });
  };
  const drink = isDrink(it);
  const promo = (drink ? DRINK_PROMO : FOOD_PROMO)[it.id];
  const promoItem = promo && itemById.get(promo[0]);
  const curated = CURATED[it.id] ?? [];
  const pool = drink ? FOOD_FALLBACK : DRINK_FALLBACK;
  const start = hash(it.id) % pool.length;

  if (promoItem) {
    // 2 do outro tipo (comida para bebida, bebida para comida), sem promoção, e a promoção por último
    const other = (x: Item) => isDrink(x) !== drink && !isPromo(x) && x.id !== SAME_AS_PROMO[promo[0]];
    curated.forEach((p) => push(p, other, 2));
    for (let i = 0; i < pool.length && out.length < 2; i++) push(pool[(start + i) % pool.length], other, 2);
    push(promo);
  }
  // sem promoção relacionada (Divas, doses, vinhos, extras…): as sugestões escolhidas à mão
  curated.forEach((p) => push(p));
  for (let i = 0; i < pool.length && out.length < 3; i++) push(pool[(start + i) % pool.length]);
  return out;
}

/** Usado nos testes de sanidade: todo item tem 3 sugestões válidas. */
export function checkPairings() {
  return items.filter((it) => pairingsFor(it).length < 3).map((it) => it.id);
}
