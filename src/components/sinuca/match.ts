/*
 * Regras da sinuca valendo drink (sem desenho nem física):
 *  - 1 × 1 ou 2 × 2 no mesmo celular, cada um na sua vez;
 *  - encaçapou, joga de novo; errou, passa a vez;
 *  - cada bola vale 1 ponto (a bola 8 vale 2);
 *  - branca na caçapa é falta: as bolas daquela tacada contam para o outro lado;
 *  - a cada 2 pontos de um lado, sorteia-se uma bebida do cardápio e o OUTRO lado paga.
 */
import { items } from "../../data/menu";
import type { Cents, Item, SectionId } from "../../data/types";

export type Team = 0 | 1;

export interface Setup {
  /** 2 = um contra um; 4 = duplas */
  players: 2 | 4;
  /** nome de cada lado (jogador ou dupla) */
  names: [string, string];
  /** personagem do muro que representa cada lado (id da turma) */
  avatars: [string, string];
  /** teto do preço da bebida sorteada, em centavos (null = qualquer uma) */
  cap: Cents | null;
}

export interface Round {
  /** quem fez as 2 bolas */
  winner: Team;
  /** quem paga */
  payer: Team;
  item: Item;
}

export interface MatchState {
  setup: Setup;
  /** pontos de cada lado nesta mesa */
  points: [number, number];
  /** sorteios já feitos nesta mesa para cada lado (um a cada 2 pontos) */
  drawn: [number, number];
  /** a conta da noite: todos os drinks sorteados */
  rounds: Round[];
  /** posição na ordem de quem joga */
  turn: number;
  shots: number;
}

export interface Seat {
  team: Team;
  /** 1 ou 2: qual jogador da dupla (em 1 × 1 é sempre 1) */
  n: 1 | 2;
}

export interface ShotResult {
  /** pontos que quem jogou fez */
  made: number;
  /** pontos que foram para o adversário (falta com bola encaçapada) */
  given: number;
  foul: boolean;
  eight: boolean;
  /** continua na mesa */
  again: boolean;
}

export const DEFAULT_NAMES: Record<2 | 4, [string, string]> = { 2: ["Jogador 1", "Jogador 2"], 4: ["Dupla 1", "Dupla 2"] };
export const DEFAULT_AVATARS: [string, string] = ["breja", "rainha"];

export function newMatch(setup: Setup): MatchState {
  return { setup, points: [0, 0], drawn: [0, 0], rounds: [], turn: 0, shots: 0 };
}

/** ordem das tacadas: os lados se alternam; nas duplas, os dois de cada lado também */
export function seats(players: 2 | 4): Seat[] {
  return players === 2
    ? [
        { team: 0, n: 1 },
        { team: 1, n: 1 },
      ]
    : [
        { team: 0, n: 1 },
        { team: 1, n: 1 },
        { team: 0, n: 2 },
        { team: 1, n: 2 },
      ];
}

export function seatOf(s: MatchState): Seat {
  const order = seats(s.setup.players);
  return order[s.turn % order.length];
}

/** fecha uma tacada: `pocketed` são as bolas que caíram (0 = branca) */
export function resolveShot(s: MatchState, pocketed: number[]): { next: MatchState; result: ShotResult } {
  const me = seatOf(s).team;
  const other = (1 - me) as Team;
  const foul = pocketed.includes(0);
  const balls = pocketed.filter((n) => n > 0);
  const pts = balls.reduce((a, n) => a + (n === 8 ? 2 : 1), 0);
  const points: [number, number] = [s.points[0], s.points[1]];
  points[foul ? other : me] += pts;
  const again = !foul && pts > 0;
  const order = seats(s.setup.players);
  return {
    next: { ...s, points, shots: s.shots + 1, turn: again ? s.turn : (s.turn + 1) % order.length },
    result: { made: foul ? 0 : pts, given: foul ? pts : 0, foul, eight: balls.includes(8), again },
  };
}

/** lado que completou 2 pontos e ainda não teve o sorteio (o outro lado paga); null = ninguém */
export function pendingDraw(s: MatchState): Team | null {
  for (const t of [0, 1] as Team[]) if (Math.floor(s.points[t] / 2) > s.drawn[t]) return t;
  return null;
}

export function addRound(s: MatchState, winner: Team, item: Item): MatchState {
  const drawn: [number, number] = [s.drawn[0], s.drawn[1]];
  drawn[winner]++;
  return { ...s, drawn, rounds: [...s.rounds, { winner, payer: (1 - winner) as Team, item }] };
}

/** mesa arrumada de novo: zera os pontos e mantém a conta */
export function rerack(s: MatchState): MatchState {
  return { ...s, points: [0, 0], drawn: [0, 0], turn: 0, shots: 0 };
}

/** quanto cada lado já deve */
export function tab(s: MatchState): [Cents, Cents] {
  const t: [Cents, Cents] = [0, 0];
  for (const r of s.rounds) t[r.payer] += r.item.price ?? 0;
  return t;
}

const DRINKS: SectionId[] = ["cervejas", "copao", "drinks", "divas", "doses", "prontos"];

/** bebidas que podem sair no sorteio (com preço e dentro do teto; as rodadas de 3 ficam de fora) */
export function drinkPool(cap: Cents | null): Item[] {
  return items.filter((it) => it.price != null && DRINKS.includes(it.section) && !it.id.startsWith("promo-3") && (cap == null || it.price <= cap));
}

export function drawDrink(cap: Cents | null, avoid: string[] = []): Item {
  const pool = drinkPool(cap);
  const fresh = pool.filter((it) => !avoid.includes(it.id));
  const list = fresh.length ? fresh : pool;
  return list[Math.floor(Math.random() * list.length)];
}

/** nomes para a roleta girar antes de parar no sorteado */
export function reel(cap: Cents | null, winner: Item, n = 16): Item[] {
  const pool = drinkPool(cap).filter((it) => it.id !== winner.id);
  const out: Item[] = [];
  for (let i = 0; i < n; i++) out.push(pool[Math.floor(Math.random() * pool.length)] ?? winner);
  out.push(winner);
  return out;
}

export const CAPS: { label: string; cap: Cents | null }[] = [
  { label: "até R$ 20", cap: 2000 },
  { label: "até R$ 30", cap: 3000 },
  { label: "qualquer um", cap: null },
];
