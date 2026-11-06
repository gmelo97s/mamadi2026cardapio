import type { ArtKey, Cents } from "./types";

/*
 * Carrossel "Em cartaz": promoções, combos e novidades.
 * Visual de cartaz de oferta pintado à mão (papel fluorescente, preço grande).
 * Para trocar uma promoção, edite esta lista.
 */
export type Paper = "laranja" | "rosa" | "limao" | "creme" | "pista" | "amarelo";

export interface Cartaz {
  id: string;
  /** item que abre ao tocar (ou seção, para "divas") */
  open: { item: string } | { section: string };
  kicker: string;
  title: string;
  sub?: string;
  price?: Cents;
  priceNote?: string;
  paper: Paper;
  art: ArtKey;
  /** quantas unidades desenhar (3 litrões, 2 copões…) */
  count?: number;
  artColor?: string;
  /** 0 = domingo … 6 = sábado. Nesses dias o cartaz vai para a frente com o selo "hoje". */
  days?: number[];
}

export const cartazes: Cartaz[] = [
  { id: "c-3-litrao", open: { item: "promo-3-litrao" }, kicker: "Promoção", title: "3 Litrão", sub: "Brahma ou Skol, trincando", price: 4500, priceNote: "sai a R$ 15 cada", paper: "laranja", art: "litrao", count: 3, artColor: "#e8332a" },
  { id: "c-copao-vodka", open: { item: "copao-vodka" }, kicker: "Promoção", title: "2 Copão de Vodka", sub: "Tradicional, tropical, melancia, morango ou maçã verde", price: 1500, priceNote: "os dois", paper: "rosa", art: "copao", count: 2, artColor: "#ff4f7b" },
  { id: "c-divas", open: { section: "divas" }, kicker: "Novidade", title: "Divas Pop", sub: "12 drinks em homenagem a quem domina a pista", price: 2500, priceNote: "cada", paper: "pista", art: "vinil" },
  { id: "c-3-caipis", open: { item: "promo-3-caipirinhas" }, kicker: "Promoção", title: "3 Caipirinhas", sub: "de limão, copo de 300 ml", price: 3000, priceNote: "sai a R$ 10 cada", paper: "limao", art: "caipirinha", count: 3, artColor: "#9bd14b" },
  { id: "c-churrasco", open: { item: "churrasco-da-mamadi" }, kicker: "Sábado e domingo", title: "Churrasco da Mamadi", sub: "com arroz, feijão, farofa e vinagrete", price: 2990, paper: "creme", art: "prato", days: [6, 0] },
  { id: "c-copao-gin", open: { item: "copao-gin" }, kicker: "Promoção", title: "2 Copão de Gin", sub: "5 sabores pra escolher", price: 3000, priceNote: "os dois", paper: "amarelo", art: "copao", count: 2, artColor: "#7ed957" },
  { id: "c-baiao", open: { item: "baiao-de-dois" }, kicker: "Todo domingo", title: "Baião de Dois", sub: "com mandioca frita e tiras de contra-filé, serve 2", price: 5990, paper: "laranja", art: "baiao", days: [0] },
  { id: "c-executivo", open: { item: "prato-executivo" }, kicker: "Almoço da Mamadi", title: "Prato executivo", sub: "com 2 espetinhos, arroz, feijão, fritas, vinagrete e farofa", price: 2999, paper: "creme", art: "prato", days: [3, 4, 5] },
  { id: "c-choro", open: { item: "choro-da-extrema-direita" }, kicker: "Novidade", title: "Choro da Extrema Direita", sub: "jambu, maracujá, limão e uma dose de 25/10/2026", price: 2500, paper: "creme", art: "caipirinha", artColor: "#ffc300" },
];
