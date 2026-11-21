/*
 * A turma do muro: os personagens pintados na fachada do Mamadi (arte de @dupont.br),
 * recortados e recriados. Cada um "manda" numa categoria do cardápio.
 * As posições dos efeitos (fx) são em % da imagem do adesivo.
 */
import { sections } from "./menu";
import type { Section, SectionId } from "./types";

export type CrewFx =
  | { k: "espuma"; x: number; y: number } // bolhas subindo da espuma
  | { k: "som"; x: number; y: number } // ondas de som + notinhas
  | { k: "gole"; x1: number; y1: number; x2: number; y2: number } // bolhas correndo pela garrafa até a boca
  | { k: "brilho"; x: number; y: number; w: number } // reflexo passando (óculos, garrafa)
  | { k: "faisca"; x: number; y: number }; // brilhinho piscando

export interface Crew {
  id: string;
  /** apelido na plaquinha */
  nome: string;
  /** onde manda */
  manda: string;
  section: SectionId;
  img: string;
  mini: string;
  w: number;
  h: number;
  /** cor do spray atrás do adesivo */
  cor: string;
  /** o que fala quando tocam */
  fala: string;
  /** pedido da casa (abre a ficha) */
  pick: string;
  /** barrinhas de atributo, estilo jogo de rua */
  stats: [string, number][];
  fx?: CrewFx[];
  /** ritmo do balanço (s) */
  beat?: number;
  /** "esqueleto" do boneco (em % da imagem): pescoço e cintura, onde a cabeça e o tronco dobram */
  rig?: { neck: number; waist: number; nx?: number };
}

export const CREW: Crew[] = [
  {
    id: "breja",
    rig: { neck: 50, waist: 78, nx: 42 },
    nome: "Breja",
    manda: "manda no litrão",
    section: "cervejas",
    img: "/muro/breja.webp",
    mini: "/muro/breja-mini.webp",
    w: 424,
    h: 690,
    cor: "#3fa9f5",
    fala: "Litrão bom é litrão suando. Na rodada de 3 sai R$ 15 cada!",
    pick: "promo-3-litrao",
    stats: [
      ["Gelada", 10],
      ["Resenha", 9],
    ],
    fx: [{ k: "espuma", x: 58, y: 55 }],
    beat: 3.2,
  },
  {
    id: "skatista",
    rig: { neck: 31, waist: 63, nx: 52 },
    nome: "Skate",
    manda: "manda no copão",
    section: "copao",
    img: "/muro/skatista.webp",
    mini: "/muro/skatista-mini.webp",
    w: 371,
    h: 690,
    cor: "#f6c21e",
    fala: "Um é pouco, dois é promo: 2 copões de vodka por R$ 15.",
    pick: "copao-vodka",
    stats: [
      ["Rolê", 10],
      ["Gelo", 8],
    ],
    fx: [{ k: "faisca", x: 70, y: 10 }],
    beat: 2.6,
  },
  {
    id: "rainha",
    rig: { neck: 27, waist: 60, nx: 50 },
    nome: "Rainha",
    manda: "manda nas caipis",
    section: "drinks",
    img: "/muro/rainha.webp",
    mini: "/muro/rainha-mini.webp",
    w: 366,
    h: 690,
    cor: "#fc00a0",
    fala: "Caipirinha é feita na hora, meu bem. Pede a Caipilula, o drink da vitória!",
    pick: "caipilula",
    stats: [
      ["Limão", 10],
      ["Close", 10],
    ],
    fx: [{ k: "faisca", x: 33, y: 19 }],
    beat: 3.6,
  },
  {
    id: "dj",
    rig: { neck: 44, waist: 70, nx: 48 },
    nome: "DJ Fita",
    manda: "manda nas Divas",
    section: "divas",
    img: "/muro/dj.webp",
    mini: "/muro/dj-mini.webp",
    w: 512,
    h: 690,
    cor: "#ff4fbf",
    fala: "Aumenta que é hino! Toxic com a pista cheia não tem erro.",
    pick: "toxic",
    stats: [
      ["Volume", 10],
      ["Hinos", 10],
    ],
    fx: [{ k: "som", x: 50, y: 72 }],
    beat: 0.95,
  },
  {
    id: "oculos",
    rig: { neck: 37, waist: 66, nx: 30 },
    nome: "Pista",
    manda: "manda nas doses",
    section: "doses",
    img: "/muro/oculos.webp",
    mini: "/muro/oculos-mini.webp",
    w: 650,
    h: 690,
    cor: "#21d4c4",
    fala: "Uma dose de coragem e bora pra pista. Gengibre com mel esquenta a alma.",
    pick: "dose-gengibre-mel",
    stats: [
      ["Coragem", 10],
      ["Brilho", 9],
    ],
    fx: [{ k: "brilho", x: 29, y: 8, w: 18 }],
    beat: 3.4,
  },
  {
    id: "gole",
    rig: { neck: 70, waist: 92, nx: 78 },
    nome: "Gole",
    manda: "manda nos prontos",
    section: "prontos",
    img: "/muro/gole.webp",
    mini: "/muro/gole-mini.webp",
    w: 957,
    h: 690,
    cor: "#2fbf71",
    fala: "É só abrir e brindar. Xeque Mate trincando, confia.",
    pick: "xeque-mate",
    stats: [
      ["Gelada", 9],
      ["Estilo", 10],
    ],
    fx: [{ k: "gole", x1: 10, y1: 64, x2: 62, y2: 58 }],
    beat: 2.2,
  },
  {
    id: "agachado",
    rig: { neck: 50, waist: 80, nx: 58 },
    nome: "Na Moral",
    manda: "manda nas porções",
    section: "porcoes",
    img: "/muro/agachado.webp",
    mini: "/muro/agachado-mini.webp",
    w: 662,
    h: 690,
    cor: "#8b7bff",
    fala: "Porção é pra dividir. A Batata Mamadi é a da casa, pede logo.",
    pick: "batata-mamadi",
    stats: [
      ["Crocância", 10],
      ["Partilha", 7],
    ],
    fx: [{ k: "brilho", x: 41, y: 44, w: 7 }],
    beat: 3.8,
  },
  {
    id: "brinde",
    rig: { neck: 40, waist: 76, nx: 50 },
    nome: "Saúde",
    manda: "manda nas tábuas",
    section: "tabuas",
    img: "/muro/brinde.webp",
    mini: "/muro/brinde-mini.webp",
    w: 453,
    h: 690,
    cor: "#f6a21e",
    fala: "Tábua chegou, levanta o copo! A Mista é pra galera toda.",
    pick: "tabua-mista",
    stats: [
      ["Fartura", 10],
      ["Galera", 10],
    ],
    fx: [{ k: "espuma", x: 46, y: 8 }],
    beat: 2.8,
  },
  {
    id: "burgao",
    nome: "Burgão",
    manda: "manda nos lanches",
    section: "lanches",
    // o hambúrguer vermelho do muro é desenhado em vetor (Burgao.tsx)
    img: "",
    mini: "",
    w: 300,
    h: 300,
    cor: "#e3140b",
    fala: "Os melhores da região, falei. O Mamadi Original é o clássico da casa.",
    pick: "burger-original",
    stats: [
      ["Suculência", 10],
      ["Tamanho", 9],
    ],
    fx: [{ k: "faisca", x: 82, y: 22 }],
    beat: 1.6,
  },
];

export const crewBySection = new Map<SectionId, Crew>(CREW.map((c) => [c.section, c]));
export const crewById = new Map(CREW.map((c) => [c.id, c]));

/**
 * A "vez" de cada seção, na ordem do cardápio: quem manda nela, quem mandava na anterior
 * (e passa a vez com um toca aqui), de que lado o dono chega e qual é a próxima parada.
 * Os lados se alternam (direita, esquerda...) para a rolagem ter ritmo; as Divas ficam à direita,
 * embaixo do globo.
 */
export interface Vez {
  dono?: Crew;
  prev?: Crew;
  /** 1: o dono fica à direita e chega pela direita; -1: pela esquerda */
  lado: 1 | -1;
  next?: Section;
  nextDono?: Crew;
}
/** cor da luz do muro em cada seção (as seções sem dono usam a cor da arte) */
const LUZ_SEM_DONO: Partial<Record<SectionId, string>> = { "sem-alcool": "#8cc63f", pratos: "#fa5a0a" };

export const vezes = new Map<SectionId, Vez>();
{
  let prev: Crew | undefined;
  let n = 0;
  sections.forEach((s, i) => {
    const dono = crewBySection.get(s.id);
    const next = sections[i + 1];
    const lado: 1 | -1 = s.id === "divas" || !dono ? 1 : n++ % 2 === 0 ? 1 : -1;
    vezes.set(s.id, { dono, prev: dono ? prev : undefined, lado, next, nextDono: next ? crewBySection.get(next.id) : undefined });
    if (dono) prev = dono;
  });
}

export const luzDa = (id: SectionId) => crewBySection.get(id)?.cor ?? LUZ_SEM_DONO[id] ?? "#fa5a0a";

/** cores das garrafinhas pintadas no muro de verdade */
export const CORES_MURO = ["#43d1dc", "#1ec8a6", "#e7b4c6", "#2b64c9", "#e2cd3b", "#b8708f", "#f3dde2"];

/** crédito da arte do muro */
export const MURO_CREDITO = { artista: "@dupont.br", url: "https://www.instagram.com/dupont.br/" };
