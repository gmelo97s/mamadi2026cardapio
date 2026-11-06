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
  "tabua-mista": [["promo-3-litrao", "Pra galera toda"], ["copao-gin", "Gin pra equilibrar"], ["promo-3-caipirinhas", "Uma caipi pra cada"]],
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

function hash(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function pairingsFor(it: Item): Pairing[] {
  const out: Pairing[] = [];
  const seen = new Set([it.id]);
  const push = ([id, reason]: Pair) => {
    if (out.length >= 3 || seen.has(id)) return;
    const target = itemById.get(id);
    if (!target) return;
    seen.add(id);
    out.push({ item: target, reason });
  };
  (CURATED[it.id] ?? []).forEach(push);
  if (out.length < 3) {
    const pool = isDrink(it) ? FOOD_FALLBACK : DRINK_FALLBACK;
    // cada item começa num ponto diferente da lista, para as Divas não sugerirem todas a mesma coisa
    const start = hash(it.id) % pool.length;
    for (let i = 0; i < pool.length && out.length < 3; i++) push(pool[(start + i) % pool.length]);
  }
  return out;
}

/** Usado nos testes de sanidade: todo item tem 3 sugestões válidas. */
export function checkPairings() {
  return items.filter((it) => pairingsFor(it).length < 3).map((it) => it.id);
}
