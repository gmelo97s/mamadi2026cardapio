/*
 * Física da sinuca, sem desenho: serve para a abertura (a tacada que abre o cardápio)
 * e para o jogo valendo drink. Mesa em metros no plano XZ (y é para cima):
 * x cresce para a direita, z cresce em direção a quem joga (a branca sai de z > 0).
 */
export const TABLE = {
  /** área de jogo, até o nariz das tabelas */
  W: 1.1,
  L: 2.2,
  /** raio da bola (um pouco maior que o real, para ler bem no celular) */
  R: 0.045,
  /** profundidade da borracha e largura da madeira */
  cushion: 0.05,
  rail: 0.125,
  /** distância do canto até onde a tabela começa (boca da caçapa) */
  mouthCorner: 0.112,
  /** meia-abertura da caçapa do meio */
  mouthSide: 0.092,
} as const;

const HW = TABLE.W / 2;
const HL = TABLE.L / 2;
const R = TABLE.R;

export interface Pocket {
  x: number;
  z: number;
  r: number;
  corner: boolean;
}

export const POCKETS: Pocket[] = [
  { x: -HW - 0.02, z: -HL - 0.02, r: 0.09, corner: true },
  { x: HW + 0.02, z: -HL - 0.02, r: 0.09, corner: true },
  { x: -HW - 0.045, z: 0, r: 0.082, corner: false },
  { x: HW + 0.045, z: 0, r: 0.082, corner: false },
  { x: -HW - 0.02, z: HL + 0.02, r: 0.09, corner: true },
  { x: HW + 0.02, z: HL + 0.02, r: 0.09, corner: true },
];

/** onde a branca sai e onde fica a ponta do triângulo */
export const HEAD_SPOT = { x: 0, z: HL * 0.5 };
export const FOOT_SPOT = { x: 0, z: -HL * 0.44 };

export interface SimBall {
  /** 0 = branca */
  n: number;
  x: number;
  z: number;
  vx: number;
  vz: number;
  /** índice da caçapa em que caiu (-1 = na mesa) */
  pocket: number;
  /** 0 → 1 enquanto afunda na caçapa */
  sink: number;
  /** já saiu da mesa */
  out: boolean;
}

export interface ShotEvents {
  /** bolas encaçapadas nesta tacada, na ordem (pode incluir a branca = 0) */
  pocketed: number[];
  /** primeira bola em que a branca tocou */
  firstHit: number | null;
}

export interface Impact {
  kind: "ball" | "cushion" | "pocket";
  /** força 0–1 */
  power: number;
  x: number;
  z: number;
  n?: number;
}

export interface Prediction {
  /** onde a branca para de andar em linha reta (bola-fantasma ou tabela) */
  x: number;
  z: number;
  /** bola que seria atingida e a direção em que ela sairia */
  ball?: SimBall;
  outX?: number;
  outZ?: number;
}

const DECEL = 0.68; // atrito de rolamento (m/s²)
const DRAG = 0.34; // perda proporcional à velocidade (1/s)
const REST_BALL = 0.965;
const REST_CUSHION = 0.76;
const STEP = 1 / 240;

export class Sim {
  balls: SimBall[] = [];
  events: ShotEvents = { pocketed: [], firstHit: null };
  onImpact?: (i: Impact) => void;
  private acc = 0;

  constructor() {
    this.rack();
  }

  get cue() {
    return this.balls[0];
  }

  /** triângulo (1 na ponta, 8 no meio) e a branca no ponto de saída */
  rack() {
    const gap = R * 0.06;
    const jit = () => (Math.random() - 0.5) * R * 0.07; // triângulo nunca é perfeito
    const order = [1, 9, 2, 10, 8, 3, 11, 4, 12, 13, 5, 14, 6, 15, 7];
    const mk = (n: number, x: number, z: number): SimBall => ({ n, x, z, vx: 0, vz: 0, pocket: -1, sink: 0, out: false });
    const balls = [mk(0, HEAD_SPOT.x, HEAD_SPOT.z)];
    let k = 0;
    for (let row = 0; row < 5; row++) {
      for (let i = 0; i <= row; i++) {
        balls.push(mk(order[k++], FOOT_SPOT.x + (i - row / 2) * (2 * R + gap) + jit(), FOOT_SPOT.z - row * (2 * R + gap) * 0.866 + jit()));
      }
    }
    this.balls = balls;
    this.events = { pocketed: [], firstHit: null };
    this.acc = 0;
  }

  /** dá a tacada na branca: direção unitária e velocidade em m/s */
  shoot(dx: number, dz: number, speed: number) {
    const c = this.cue;
    const l = Math.hypot(dx, dz) || 1;
    c.vx = (dx / l) * speed;
    c.vz = (dz / l) * speed;
    this.events = { pocketed: [], firstHit: null };
  }

  get moving() {
    for (const b of this.balls) if (!b.out && (b.vx !== 0 || b.vz !== 0 || (b.pocket >= 0 && b.sink < 1))) return true;
    return false;
  }

  /** bolas numeradas ainda na mesa */
  get remaining() {
    return this.balls.filter((b) => b.n > 0 && b.pocket < 0).length;
  }

  /** devolve a branca ao ponto de saída (ou ao lugar livre mais perto dele) */
  respotCue() {
    const c = this.cue;
    c.pocket = -1;
    c.sink = 0;
    c.out = false;
    c.vx = c.vz = 0;
    for (let i = 0; i < 40; i++) {
      const side = i % 2 ? 1 : -1;
      const x = HEAD_SPOT.x + side * Math.ceil(i / 2) * R * 1.1;
      if (Math.abs(x) > HW - R * 1.2) continue;
      if (this.balls.every((b) => b === c || b.pocket >= 0 || Math.hypot(b.x - x, b.z - HEAD_SPOT.z) > 2 * R + 0.004)) {
        c.x = x;
        c.z = HEAD_SPOT.z;
        return;
      }
    }
    c.x = HEAD_SPOT.x;
    c.z = HEAD_SPOT.z;
  }

  /** avança a simulação; devolve true enquanto alguma bola anda */
  step(dt: number) {
    // até 1/4 de segundo por chamada: em aparelho lento as bolas continuam no tempo real, sem câmera lenta
    this.acc += Math.min(dt, 0.25);
    while (this.acc >= STEP) {
      this.acc -= STEP;
      this.sub(STEP);
    }
    return this.moving;
  }

  private sub(h: number) {
    const balls = this.balls;
    for (const b of balls) {
      if (b.out) continue;
      if (b.pocket >= 0) {
        // escorrega para o centro da caçapa enquanto afunda
        const p = POCKETS[b.pocket];
        b.x += (p.x - b.x) * Math.min(1, h * 14);
        b.z += (p.z - b.z) * Math.min(1, h * 14);
        b.sink = Math.min(1, b.sink + h * 4.2);
        if (b.sink >= 1) b.out = true;
        continue;
      }
      const sp = Math.hypot(b.vx, b.vz);
      if (sp === 0) continue;
      let ns = Math.max(0, sp - DECEL * h) * (1 - DRAG * h);
      if (ns < 0.012) ns = 0;
      b.vx *= ns / sp;
      b.vz *= ns / sp;
      b.x += b.vx * h;
      b.z += b.vz * h;
      this.walls(b, ns);
    }
    // choques entre bolas
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];
      if (a.pocket >= 0) continue;
      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j];
        if (b.pocket >= 0) continue;
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const d2 = dx * dx + dz * dz;
        if (d2 >= 4 * R * R || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const nz = dz / d;
        const overlap = (2 * R - d) / 2;
        a.x -= nx * overlap;
        a.z -= nz * overlap;
        b.x += nx * overlap;
        b.z += nz * overlap;
        const rel = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
        if (rel <= 0) continue;
        const imp = rel * (1 + REST_BALL) * 0.5;
        a.vx -= imp * nx;
        a.vz -= imp * nz;
        b.vx += imp * nx;
        b.vz += imp * nz;
        if (this.events.firstHit === null && (a.n === 0 || b.n === 0)) this.events.firstHit = a.n === 0 ? b.n : a.n;
        if (rel > 0.25) this.onImpact?.({ kind: "ball", power: Math.min(1, rel / 5), x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 });
      }
    }
  }

  /** tabelas, bocas das caçapas e queda */
  private walls(b: SimBall, speed: number) {
    for (let i = 0; i < POCKETS.length; i++) {
      const p = POCKETS[i];
      if (Math.hypot(b.x - p.x, b.z - p.z) < p.r) return this.drop(b, i, speed);
    }
    const ax = Math.abs(b.x);
    const az = Math.abs(b.z);
    // nas bocas das caçapas não há tabela
    const cornerX = HL - az < TABLE.mouthCorner; // perto do fim da mesa: a tabela lateral acabou
    const cornerZ = HW - ax < TABLE.mouthCorner; // perto do canto: a tabela de fundo acabou
    const side = az < TABLE.mouthSide;
    const overX = ax - (HW - R);
    const overZ = az - (HL - R);
    if (overX > 0) {
      if (!cornerX && !side) {
        b.x = Math.sign(b.x) * (HW - R);
        if (b.vx * Math.sign(b.x) > 0) {
          this.onImpact?.({ kind: "cushion", power: Math.min(1, Math.abs(b.vx) / 5), x: b.x, z: b.z });
          b.vx = -b.vx * REST_CUSHION;
          b.vz *= 0.985;
        }
      } else if (overX > R * 1.05) return this.drop(b, this.nearest(b), speed);
    }
    if (overZ > 0) {
      if (!cornerZ) {
        b.z = Math.sign(b.z) * (HL - R);
        if (b.vz * Math.sign(b.z) > 0) {
          this.onImpact?.({ kind: "cushion", power: Math.min(1, Math.abs(b.vz) / 5), x: b.x, z: b.z });
          b.vz = -b.vz * REST_CUSHION;
          b.vx *= 0.985;
        }
      } else if (overZ > R * 1.05) return this.drop(b, this.nearest(b), speed);
    }
  }

  private nearest(b: SimBall) {
    let best = 0;
    let bd = Infinity;
    POCKETS.forEach((p, i) => {
      const d = Math.hypot(b.x - p.x, b.z - p.z);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }

  private drop(b: SimBall, pocket: number, speed: number) {
    b.pocket = pocket;
    b.sink = 0;
    b.vx = b.vz = 0;
    this.events.pocketed.push(b.n);
    this.onImpact?.({ kind: "pocket", power: Math.min(1, 0.4 + speed / 6), x: b.x, z: b.z, n: b.n });
  }

  /** para a linha de mira: até onde a branca vai em linha reta nessa direção */
  predict(dx: number, dz: number): Prediction {
    const c = this.cue;
    const l = Math.hypot(dx, dz) || 1;
    const ux = dx / l;
    const uz = dz / l;
    let best = Infinity;
    let hit: SimBall | undefined;
    for (const b of this.balls) {
      if (b === c || b.pocket >= 0) continue;
      const ox = b.x - c.x;
      const oz = b.z - c.z;
      const proj = ox * ux + oz * uz;
      if (proj <= 0) continue;
      const perp2 = ox * ox + oz * oz - proj * proj;
      const rr = 4 * R * R;
      if (perp2 >= rr) continue;
      const t = proj - Math.sqrt(rr - perp2);
      if (t > 0 && t < best) {
        best = t;
        hit = b;
      }
    }
    // tabelas (retângulo encolhido de um raio)
    let tw = Infinity;
    if (ux > 0) tw = Math.min(tw, (HW - R - c.x) / ux);
    if (ux < 0) tw = Math.min(tw, (-HW + R - c.x) / ux);
    if (uz > 0) tw = Math.min(tw, (HL - R - c.z) / uz);
    if (uz < 0) tw = Math.min(tw, (-HL + R - c.z) / uz);
    if (hit && best < tw) {
      const gx = c.x + ux * best;
      const gz = c.z + uz * best;
      const ol = Math.hypot(hit.x - gx, hit.z - gz) || 1;
      return { x: gx, z: gz, ball: hit, outX: (hit.x - gx) / ol, outZ: (hit.z - gz) / ol };
    }
    const t = Math.max(0, Math.min(tw, 4));
    return { x: c.x + ux * t, z: c.z + uz * t };
  }
}
