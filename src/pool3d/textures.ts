/* Texturas geradas no próprio aparelho (nada para baixar): pano, madeira, bolas, tijolo, brilho e taco. */
import * as THREE from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function finish(c: HTMLCanvasElement, rx = 1, ry = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  return t;
}

/** Feltro verde-petróleo (o das garrafinhas do muro): ruído fino com fio na diagonal. */
export function feltTexture() {
  const N = 256;
  const c = canvas(N, N);
  const g = c.getContext("2d")!;
  const img = g.createImageData(N, N);
  const rnd = mulberry(11);
  const base = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) base[i] = rnd();
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const k = y * N + x;
      const k2 = ((y + 1) % N) * N + ((x + 1) % N);
      const v = 0.86 + (base[k] * 0.6 + base[k2] * 0.4 - 0.5) * 0.34;
      const o = k * 4;
      img.data[o] = 10 * v;
      img.data[o + 1] = 104 * v;
      img.data[o + 2] = 112 * v;
      img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return finish(c, 5, 10);
}

/** Madeira preta envernizada (o preto do Mamadi), com um veio alaranjado. */
export function woodTexture() {
  const W = 256;
  const H = 512;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  g.fillStyle = "#171012";
  g.fillRect(0, 0, W, H);
  const rnd = mulberry(7);
  for (let i = 0; i < 150; i++) {
    const x0 = rnd() * W;
    g.strokeStyle = rnd() > 0.5 ? `rgba(250,110,40,${0.03 + rnd() * 0.08})` : `rgba(0,0,0,${0.08 + rnd() * 0.2})`;
    g.lineWidth = 0.5 + rnd() * 1.6;
    const amp = 2 + rnd() * 7;
    const f = 0.004 + rnd() * 0.012;
    const ph = rnd() * 10;
    g.beginPath();
    for (let y = 0; y <= H; y += 8) g.lineTo(x0 + Math.sin(y * f + ph) * amp, y);
    g.stroke();
  }
  return finish(c, 1.4, 1.1);
}

/** Chão de cimento queimado, escuro. */
export function floorTexture() {
  const N = 256;
  const c = canvas(N, N);
  const g = c.getContext("2d")!;
  const img = g.createImageData(N, N);
  const rnd = mulberry(3);
  for (let i = 0; i < N * N; i++) {
    const v = 0.75 + rnd() * 0.5;
    img.data[i * 4] = 46 * v;
    img.data[i * 4 + 1] = 28 * v;
    img.data[i * 4 + 2] = 26 * v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return finish(c, 10, 10);
}

/** Mancha de luz (halo dos neons e das lâmpadas). */
export function glowTexture() {
  const N = 128;
  const c = canvas(N, N);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,.55)");
  grad.addColorStop(0.5, "rgba(255,255,255,.13)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, N, N);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Taco: giz, virola, haste de maple, emenda, antebraço, empunhadura e cabo (a ponta fica em cima). */
export function cueTexture() {
  const W = 16;
  const H = 512;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  const seg: [number, number, string][] = [
    [0, 0.012, "#3a78c2"],
    [0.012, 0.034, "#f1ece2"],
    [0.034, 0.5, "#dcbf86"],
    [0.5, 0.512, "#c9c4bb"],
    [0.512, 0.7, "#fa5a0a"],
    [0.7, 0.88, "#161111"],
    [0.88, 0.9, "#fff4e3"],
    [0.9, 0.985, "#fa5a0a"],
    [0.985, 1, "#0a0a0a"],
  ];
  for (const [a, b, col] of seg) {
    g.fillStyle = col;
    g.fillRect(0, a * H, W, (b - a) * H + 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const BALL_RGB: Record<number, [number, number, number]> = {
  0: [240, 235, 222],
  1: [236, 172, 22],
  2: [26, 58, 160],
  3: [204, 22, 26],
  4: [78, 36, 122],
  5: [232, 98, 22],
  6: [20, 110, 58],
  7: [112, 20, 20],
  8: [14, 13, 14],
};
const IVORY: [number, number, number] = [242, 237, 226];

let GLYPHS: Map<number, Uint8ClampedArray> | null = null;
const GL = 64;
function glyphs() {
  if (GLYPHS) return GLYPHS;
  GLYPHS = new Map();
  const c = canvas(GL, GL);
  const g = c.getContext("2d", { willReadFrequently: true })!;
  for (let n = 1; n <= 15; n++) {
    g.clearRect(0, 0, GL, GL);
    g.fillStyle = "#000";
    g.font = `800 ${n > 9 ? 31 : 38}px "Archivo Variable", "Helvetica Neue", Arial, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String(n), GL / 2, GL / 2 + 2);
    if (n === 6 || n === 9) g.fillRect(GL / 2 - 8, GL / 2 + 18, 16, 2.6); // tracinho do 6 e do 9
    const d = g.getImageData(0, 0, GL, GL).data;
    const a = new Uint8ClampedArray(GL * GL);
    for (let i = 0; i < GL * GL; i++) a[i] = d[i * 4 + 3];
    GLYPHS.set(n, a);
  }
  return GLYPHS;
}

/**
 * Pele da bola (mapa equirretangular): cor, faixa das listradas e o número dos dois lados.
 * Calculado texel a texel na esfera, para os círculos dos números não deformarem.
 */
export function ballTexture(n: number) {
  const W = 256;
  const H = 128;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  const img = g.createImageData(W, H);
  const d = img.data;
  const base = BALL_RGB[n > 8 ? n - 8 : n];
  const stripe = n > 8;
  const glyph = n > 0 ? glyphs().get(n)! : null;
  const ring = 0.5; // raio do círculo do número (em unidades da esfera)
  const ringZ = Math.sqrt(1 - ring * ring);
  for (let py = 0; py < H; py++) {
    const th = ((py + 0.5) / H) * Math.PI;
    const st = Math.sin(th);
    const y = Math.cos(th);
    for (let px = 0; px < W; px++) {
      const ph = ((px + 0.5) / W) * Math.PI * 2;
      const x = -Math.cos(ph) * st;
      const z = Math.sin(ph) * st;
      let col = base;
      let ink = 0;
      if (n === 0) {
        // pinta vermelha da branca
        if (Math.hypot(x - 0.0, y - 0.0) < 0.09 && z > 0) col = [200, 24, 28];
      } else {
        if (stripe && Math.abs(y) >= 0.5) col = IVORY;
        if (Math.abs(z) > ringZ) {
          col = IVORY;
          const sx = z > 0 ? x : -x;
          const gx = Math.floor((0.5 + sx / (2 * ring)) * GL);
          const gy = Math.floor((0.5 - y / (2 * ring)) * GL);
          if (glyph && gx >= 0 && gy >= 0 && gx < GL && gy < GL) ink = glyph[gy * GL + gx] / 255;
        }
      }
      const o = (py * W + px) * 4;
      d[o] = col[0] * (1 - ink * 0.94);
      d[o + 1] = col[1] * (1 - ink * 0.94);
      d[o + 2] = col[2] * (1 - ink * 0.94);
      d[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
