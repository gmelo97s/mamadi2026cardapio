/*
 * A mesa de sinuca do Mamadi em 3D (three.js): pano verde-petróleo (o das garrafinhas do muro)
 * com o logo da casa estampado, madeira preta, bolas, taco laranja e a luminária.
 * Veio da sinuca do Outs Pub (mesma física e mesma mira), com a cara do Mamadi.
 */
import * as THREE from "three";
import { POCKETS, TABLE, type Prediction, type Sim } from "./sim";
import { ballTexture, cueTexture, feltTexture, floorTexture, woodTexture } from "./textures";

const HW = TABLE.W / 2;
const HL = TABLE.L / 2;
const R = TABLE.R;
const C = TABLE.cushion;
const CUSH_H = R * 1.3;
const RAIL_TOP = CUSH_H + 0.006;
const OUT_X = HW + C + TABLE.rail;
const OUT_Z = HL + C + TABLE.rail;
const FLOOR_Y = -0.82;
const LAMP_Y = 1.2;
const CEIL_Y = 2.5;
/** parede do fundo e o letreiro (caixa do logo de 512 → SIGN.size metros) */
/** o preto da casa: o mesmo fundo da tela de carregamento, para a passagem não aparecer */
export const VOID = 0x111318;
export const WALL_Z = -(HL + 1.8);
export const SIGN = { x: -0.95, y: 1.38, size: 1.06, z: WALL_Z + 0.03 };

export interface View {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  /** desloca a imagem na tela (px, positivo = para baixo), para dar lugar ao que fica por cima */
  shiftY: number;
}
export interface Margins {
  top: number;
  bottom: number;
  side: number;
}

function flat(shape: THREE.Shape, depth: number, topY: number, bevel = 0.005) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 10 });
  g.rotateX(Math.PI / 2); // forma em (x, z) do mundo; a espessura desce a partir do topo
  g.translate(0, topY - bevel, 0);
  return g;
}

function roundedRect(hx: number, hz: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-hx + r, -hz);
  s.lineTo(hx - r, -hz);
  s.absarc(hx - r, -hz + r, r, -Math.PI / 2, 0, false);
  s.lineTo(hx, hz - r);
  s.absarc(hx - r, hz - r, r, 0, Math.PI / 2, false);
  s.lineTo(-hx + r, hz);
  s.absarc(-hx + r, hz - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-hx, -hz + r);
  s.absarc(-hx + r, -hz + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** contorno do vão da mesa: retângulo das tabelas unido aos furos das caçapas (visto do centro) */
function holeOutline() {
  const hx = HW + C;
  const hz = HL + C;
  const pts: THREE.Vector2[] = [];
  const N = 540;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const ux = Math.cos(a);
    const uz = Math.sin(a);
    let r = Math.min(hx / Math.max(1e-9, Math.abs(ux)), hz / Math.max(1e-9, Math.abs(uz)));
    for (const p of POCKETS) {
      const pr = p.r + 0.008;
      const b = ux * p.x + uz * p.z;
      const disc = b * b - (p.x * p.x + p.z * p.z - pr * pr);
      if (disc > 0) r = Math.max(r, b + Math.sqrt(disc));
    }
    pts.push(new THREE.Vector2(ux * r, uz * r));
  }
  return pts;
}


export class PoolScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(44, 1, 0.04, 40);
  private w = 1;
  private h = 1;
  private balls: THREE.Mesh[] = [];
  private last: { x: number; z: number }[] = [];
  private cue = new THREE.Group();
  private cueMat!: THREE.MeshStandardMaterial;
  private guide = new THREE.Group();
  private guideLine!: THREE.Mesh;
  private guideGhost!: THREE.Mesh;
  private guideOut!: THREE.Mesh;
  private lampPivot = new THREE.Group();
  private spot!: THREE.SpotLight;
  private roomLights: THREE.PointLight[] = [];
  private hemi!: THREE.HemisphereLight;
  private signLayers: { g: THREE.Object3D; depth: number }[] = [];
  private signLight?: THREE.PointLight;
  private signHalo?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private spots: THREE.Sprite[] = [];
  private dust?: THREE.Points;
  private disposables: { dispose: () => void }[] = [];
  private ray = new THREE.Raycaster();
  private bedPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private fit = new THREE.PerspectiveCamera();
  private lampK = 1;
  private roomK = 1;
  readonly hasRoom: boolean;

  constructor(canvas: HTMLCanvasElement, opts: { room: boolean }) {
    this.hasRoom = opts.room;
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" }));
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.08;
    this.scene.background = new THREE.Color(VOID);
    this.scene.fog = new THREE.FogExp2(VOID, 0.075);
    this.buildEnv();
    this.buildTable();
    this.buildBalls();
    this.buildCue();
    this.buildGuide();
    this.buildLamp();
    this.buildRoom();
    this.resize();
  }

  // ───────────── construção ─────────────
  private track<T extends { dispose: () => void }>(x: T) {
    this.disposables.push(x);
    return x;
  }

  private buildEnv() {
    // reflexos das bolas: a luminária em cima e as luzes vermelhas da casa em volta
    const env = new THREE.Scene();
    env.background = new THREE.Color(0x020203);
    const panel = (rgb: [number, number, number], w: number, h: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(rgb[0], rgb[1], rgb[2]), side: THREE.DoubleSide }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel([9, 7.6, 5.6], 1.4, 1.4, 0, 3, 0);
    panel([3.2, 0.9, 0.12], 5, 2, -5, 1, -2);
    panel([2.6, 0.2, 1.2], 5, 2, 5, 1.4, 1);
    panel([1.6, 0.5, 0.06], 6, 1.6, 0, 0.8, 6);
    panel([2.4, 0.7, 0.12], 2, 2, -2, 1.5, -6);
    const pm = new THREE.PMREMGenerator(this.renderer);
    const rt = pm.fromScene(env, 0.03);
    this.scene.environment = rt.texture;
    this.scene.environmentIntensity = 0.85;
    this.track(rt.texture);
    pm.dispose();
    env.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    });
  }

  private buildTable() {
    const felt = this.track(feltTexture());
    const wood = this.track(woodTexture());
    const feltMat = this.track(new THREE.MeshStandardMaterial({ map: felt, roughness: 1, metalness: 0, envMapIntensity: 0.12 }));
    const cushMat = this.track(new THREE.MeshStandardMaterial({ map: felt, color: 0xb8c8c0, roughness: 1, metalness: 0, envMapIntensity: 0.12 }));
    const woodMat = this.track(new THREE.MeshStandardMaterial({ map: wood, roughness: 0.36, metalness: 0, envMapIntensity: 0.6 }));
    const darkWood = this.track(new THREE.MeshStandardMaterial({ map: wood, color: 0x7a6660, roughness: 0.6, metalness: 0, envMapIntensity: 0.3 }));
    const add = (g: THREE.BufferGeometry, m: THREE.Material, cast = false, receive = true) => {
      const mesh = new THREE.Mesh(this.track(g), m);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      this.scene.add(mesh);
      return mesh;
    };

    // pano
    const bed = new THREE.PlaneGeometry(2 * (HW + C) + 0.03, 2 * (HL + C) + 0.03);
    bed.rotateX(-Math.PI / 2);
    add(bed, feltMat);

    // o logo da casa estampado no meio do pano, como nas mesas de bar
    const logoTex = this.track(new THREE.TextureLoader().load("/brand/logo-256.webp"));
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Mesh(
      this.track(new THREE.CircleGeometry(0.21, 64)),
      this.track(new THREE.MeshStandardMaterial({ map: logoTex, transparent: true, opacity: 0.38, roughness: 1, metalness: 0, depthWrite: false, envMapIntensity: 0 })),
    );
    logo.rotation.x = -Math.PI / 2;
    logo.position.set(0, 0.0012, 0);
    logo.receiveShadow = true;
    this.scene.add(logo);

    // moldura de madeira, com os recortes das caçapas
    const frame = roundedRect(OUT_X, OUT_Z, 0.1);
    frame.holes.push(new THREE.Path(holeOutline()));
    add(flat(frame, RAIL_TOP + 0.05, RAIL_TOP, 0.007), woodMat, true);

    // tabelas forradas (as bocas das caçapas ficam abertas)
    const mc = TABLE.mouthCorner;
    const ms = TABLE.mouthSide;
    const poly = (p: [number, number][]) => new THREE.Shape(p.map(([x, z]) => new THREE.Vector2(x, z)));
    const pieces: [number, number][][] = [];
    for (const s of [-1, 1]) {
      pieces.push([
        [-HW + mc, s * HL],
        [HW - mc, s * HL],
        [HW - mc + 0.8 * C, s * (HL + C)],
        [-HW + mc - 0.8 * C, s * (HL + C)],
      ]);
      for (const t of [-1, 1]) {
        pieces.push([
          [s * HW, t * (HL - mc)],
          [s * HW, t * ms],
          [s * (HW + C), t * ms],
          [s * (HW + C), t * (HL - mc + 0.8 * C)],
        ]);
      }
    }
    for (const p of pieces) add(flat(poly(p), CUSH_H + 0.01, CUSH_H, 0.004), cushMat, true);

    // caçapas: fundo preto, parede escura e a boca de couro
    const black = this.track(new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }));
    const inner = this.track(new THREE.MeshBasicMaterial({ color: 0x060303, side: THREE.BackSide, fog: false }));
    const leather = this.track(new THREE.MeshStandardMaterial({ color: 0x1c110e, roughness: 0.55, metalness: 0, envMapIntensity: 0.4 }));
    for (const p of POCKETS) {
      const pr = p.r + 0.008;
      const disc = new THREE.CircleGeometry(pr, 40);
      disc.rotateX(-Math.PI / 2);
      const d = add(disc, black, false, false);
      d.position.set(p.x, 0.0014, p.z);
      const wall = new THREE.CylinderGeometry(pr, pr * 0.9, 0.2, 40, 1, true);
      const wm = add(wall, inner, false, false);
      wm.position.set(p.x, RAIL_TOP - 0.1, p.z);
      // arco de couro só do lado da madeira
      const open = Math.atan2(-Math.sign(p.z), -Math.sign(p.x) || 0);
      const arc = p.corner ? Math.PI * 1.5 : Math.PI;
      const start = (p.corner ? Math.atan2(-Math.sign(p.z), -Math.sign(p.x)) : open) + (Math.PI * 2 - arc) / 2;
      const lip = new THREE.TorusGeometry(pr, 0.009, 8, 40, arc);
      lip.rotateX(Math.PI / 2);
      const lm = add(lip, leather, false, true);
      lm.position.set(p.x, RAIL_TOP + 0.002, p.z);
      lm.rotation.y = -start;
    }

    // marcações de madrepérola
    const pearl = this.track(new THREE.MeshStandardMaterial({ color: 0xe8e2da, roughness: 0.25, metalness: 0, envMapIntensity: 1 }));
    const dia = this.track(new THREE.CircleGeometry(0.011, 4));
    dia.rotateX(-Math.PI / 2);
    const sight = (x: number, z: number, rot: number) => {
      const m = new THREE.Mesh(dia, pearl);
      m.position.set(x, RAIL_TOP + 0.0012, z);
      m.rotation.y = rot;
      m.scale.set(1, 1, 0.62);
      this.scene.add(m);
    };
    const mid = C + TABLE.rail * 0.55;
    for (let i = 1; i < 4; i++) for (const s of [-1, 1]) sight(-HW + (TABLE.W * i) / 4, s * (HL + mid), Math.PI / 2);
    for (let i = 1; i < 8; i++) if (i !== 4) for (const s of [-1, 1]) sight(s * (HW + mid), -HL + (TABLE.L * i) / 8, 0);

    // corpo e pés
    const apron = new THREE.BoxGeometry(2 * OUT_X - 0.05, 0.2, 2 * OUT_Z - 0.05);
    add(apron, darkWood, true).position.y = -0.15;
    const leg = this.track(new THREE.BoxGeometry(0.15, 0.6, 0.15));
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) {
        const m = new THREE.Mesh(leg, darkWood);
        m.position.set(sx * (OUT_X - 0.16), -0.52, sz * (OUT_Z - 0.2));
        m.castShadow = true;
        this.scene.add(m);
      }
  }

  private buildBalls() {
    const geo = this.track(new THREE.SphereGeometry(R, 36, 24));
    for (let n = 0; n <= 15; n++) {
      const mat = this.track(new THREE.MeshStandardMaterial({ map: this.track(ballTexture(n)), roughness: 0.14, metalness: 0, envMapIntensity: 1.05 }));
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = true;
      m.quaternion.setFromEuler(new THREE.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28));
      this.balls.push(m);
      this.last.push({ x: NaN, z: NaN });
      this.scene.add(m);
    }
  }

  private buildCue() {
    const len = 1.42;
    const g = this.track(new THREE.CylinderGeometry(0.0058, 0.0135, len, 14, 1));
    g.rotateX(Math.PI / 2); // a ponta fica virada para +z
    g.translate(0, 0, -len / 2);
    this.cueMat = this.track(new THREE.MeshStandardMaterial({ map: this.track(cueTexture()), roughness: 0.35, metalness: 0, envMapIntensity: 0.7, transparent: true }));
    const m = new THREE.Mesh(g, this.cueMat);
    m.castShadow = true;
    this.cue.add(m);
    this.cue.visible = false;
    this.scene.add(this.cue);
  }

  private buildGuide() {
    const mat = this.track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false, fog: false }));
    const strip = this.track(new THREE.PlaneGeometry(1, 1));
    strip.rotateX(-Math.PI / 2);
    strip.translate(0, 0, -0.5); // cresce para -z a partir da origem
    this.guideLine = new THREE.Mesh(strip, mat);
    this.guideOut = new THREE.Mesh(strip, mat);
    const ring = this.track(new THREE.RingGeometry(R * 0.86, R, 40));
    ring.rotateX(-Math.PI / 2);
    this.guideGhost = new THREE.Mesh(ring, mat);
    this.guide.add(this.guideLine, this.guideOut, this.guideGhost);
    this.guide.visible = false;
    this.guide.position.y = 0.004;
    this.scene.add(this.guide);
  }

  private buildLamp() {
    // a luminária da mesa: só a luz (a cúpula ficaria na frente da câmera de jogo)
    const spot = (this.spot = new THREE.SpotLight(0xfff0d6, 16, 9, 1.02, 0.6, 2));
    spot.position.set(0, LAMP_Y - CEIL_Y, 0);
    spot.target.position.set(0, LAMP_Y - CEIL_Y - 1.5, 0);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.camera.near = 0.2;
    spot.shadow.camera.far = 4;
    spot.shadow.bias = -0.0004;
    spot.shadow.normalBias = 0.012;
    spot.shadow.radius = 5;
    this.lampPivot.position.y = CEIL_Y;
    this.lampPivot.add(spot, spot.target);
    this.scene.add(this.lampPivot);

    // as luzes da casa: laranja do letreiro e rosa das Divas
    this.hemi = new THREE.HemisphereLight(0x4a2a1a, 0x0a0b10, 0.7);
    this.scene.add(this.hemi);
    const red = (x: number, y: number, z: number, i: number, cor = 0xff6a1a) => {
      const l = new THREE.PointLight(cor, i, 9, 2);
      l.position.set(x, y, z);
      l.userData.i = i;
      this.roomLights.push(l);
      this.scene.add(l);
    };
    red(-2.7, 1.9, 0.5, 7);
    red(2.6, 1.5, 1.4, 8, 0xff3fae);
    red(0.6, 1.9, 3.4, 5);

    // poeira na luz (só na abertura, quando a câmera passa pelo cone da luminária)
    if (!this.hasRoom) return;
    const n = 60;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * 0.75;
      pos[i * 3] = Math.cos(a) * rr;
      pos[i * 3 + 1] = 0.12 + Math.random() * 0.85;
      pos[i * 3 + 2] = Math.sin(a) * rr * 1.5;
    }
    const dg = this.track(new THREE.BufferGeometry());
    dg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.dust = new THREE.Points(dg, this.track(new THREE.PointsMaterial({ color: 0xffd9b0, size: 0.006, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })));
    this.scene.add(this.dust);
  }

  private buildRoom() {
    const floor = new THREE.Mesh(this.track(new THREE.PlaneGeometry(18, 18)), this.track(new THREE.MeshStandardMaterial({ map: this.track(floorTexture()), roughness: 0.82, metalness: 0, envMapIntensity: 0.35 })));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  // ───────────── estado ─────────────
  resize() {
    const c = this.renderer.domElement;
    this.w = Math.max(1, c.clientWidth);
    this.h = Math.max(1, c.clientHeight);
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
  }
  get width() {
    return this.w;
  }
  get height() {
    return this.h;
  }

  /** 2 = tudo; 1 = menos pixels e sombra menor; 0 = sem sombras */
  setQuality(q: 0 | 1 | 2) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q === 2 ? 2 : q === 1 ? 1.5 : 1));
    this.renderer.shadowMap.enabled = q > 0;
    this.spot.castShadow = q > 0;
    this.spot.shadow.mapSize.setScalar(q === 2 ? 1024 : 512);
    this.spot.shadow.map?.dispose();
    this.spot.shadow.map = null;
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m && !Array.isArray(m)) m.needsUpdate = true;
    });
    this.resize();
  }

  /** copia a posição das bolas da física e gira cada uma conforme rolou */
  syncBalls(sim: Sim) {
    const q = new THREE.Quaternion();
    const axis = new THREE.Vector3();
    for (const b of sim.balls) {
      const m = this.balls[b.n];
      const l = this.last[b.n];
      m.visible = !b.out;
      const s = b.pocket >= 0 ? b.sink : 0;
      m.position.set(b.x, R - s * R * 2.6, b.z);
      m.scale.setScalar(1 - s * 0.25);
      const dx = b.x - l.x;
      const dz = b.z - l.z;
      const d = Math.hypot(dx, dz);
      if (d > 1e-6 && d < 0.3) {
        axis.set(dz / d, 0, -dx / d);
        q.setFromAxisAngle(axis, d / R);
        m.quaternion.premultiply(q);
      }
      l.x = b.x;
      l.z = b.z;
    }
  }

  /** taco atrás da branca, apontando na direção da tacada (dx, dz); pull 0–1 = quanto está puxado */
  setCue(show: boolean, sim?: Sim, dx = 0, dz = -1, pull = 0, alpha = 1) {
    this.cue.visible = show && alpha > 0.01;
    if (!show || !sim) return;
    const c = sim.cue;
    const e = 0.075; // o cabo fica um pouco mais alto que a ponta
    const dir = new THREE.Vector3(dx * Math.cos(e), -Math.sin(e), dz * Math.cos(e)).normalize();
    this.cue.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    const gap = R + 0.012 + pull * 0.34;
    this.cue.position.set(c.x - dir.x * gap, R * 1.02 - dir.y * gap, c.z - dir.z * gap);
    this.cueMat.opacity = alpha;
  }

  /** só a transparência do taco (depois da tacada ele fica onde estava e some) */
  setCueAlpha(alpha: number) {
    this.cue.visible = alpha > 0.01;
    this.cueMat.opacity = alpha;
  }

  /** linha de mira até a bola-fantasma e a direção em que a bola atingida sairia */
  setGuide(p: Prediction | null, sim?: Sim, strength = 1) {
    this.guide.visible = !!p;
    if (!p || !sim) return;
    const c = sim.cue;
    const dx = p.x - c.x;
    const dz = p.z - c.z;
    const len = Math.hypot(dx, dz);
    this.guideLine.position.set(c.x, 0, c.z);
    this.guideLine.rotation.y = Math.atan2(-dx, -dz);
    this.guideLine.scale.set(0.007, 1, Math.max(0.001, len - R));
    this.guideGhost.position.set(p.x, 0, p.z);
    this.guideGhost.visible = !!p.ball;
    this.guideOut.visible = !!p.ball;
    if (p.ball) {
      this.guideOut.position.set(p.ball.x, 0, p.ball.z);
      this.guideOut.rotation.y = Math.atan2(-p.outX!, -p.outZ!);
      this.guideOut.scale.set(0.007, 1, 0.16 + strength * 0.2);
    }
    (this.guideLine.material as THREE.MeshBasicMaterial).opacity = 0.28 + strength * 0.34;
  }

  /** luzes: lamp = luminária da mesa (0–1), room = vermelho da casa (0–1) */
  setLights(lamp: number, room: number) {
    this.lampK = lamp;
    this.roomK = room;
    this.spot.intensity = 16 * lamp;
    this.scene.environmentIntensity = 0.85 * Math.min(1, lamp + room * 0.45);
    for (const l of this.roomLights) l.intensity = (l.userData.i as number) * room;
    this.hemi.intensity = 0.5 * room + 0.12 * lamp;
    for (const s of this.spots) s.material.opacity = room * 0.9;
    if (this.dust) (this.dust.material as THREE.PointsMaterial).opacity = 0.22 * lamp;
  }

  /** ajusta as camadas do letreiro para, vistas de frente a d metros, casarem com o logo plano */
  alignSign(d: number) {
    for (const l of this.signLayers) l.g.scale.setScalar((d - l.depth) / d);
  }

  // ───────────── câmera ─────────────
  /** câmera de frente para o letreiro, com o logo ocupando logoPx de largura na tela */
  signView(logoPx: number, fov: number): View {
    const d = (SIGN.size * this.h) / (2 * logoPx * Math.tan((fov * Math.PI) / 360));
    this.alignSign(d);
    return { pos: new THREE.Vector3(SIGN.x, SIGN.y, SIGN.z + d), target: new THREE.Vector3(SIGN.x, SIGN.y, SIGN.z), fov, shiftY: 0 };
  }

  /** vista de jogo: a mesa inteira cabendo na área livre da tela */
  playView(m: Margins, pitchDeg?: number): View {
    const portrait = this.h >= this.w;
    const pitch = ((pitchDeg ?? (portrait ? 64 : 42)) * Math.PI) / 180;
    const fov = portrait ? 42 : 34;
    const freeW = Math.max(40, this.w - m.side * 2) / this.w;
    const freeH = Math.max(40, this.h - m.top - m.bottom) / this.h;
    const cam = this.fit;
    cam.fov = fov;
    cam.aspect = this.w / this.h;
    cam.updateProjectionMatrix();
    const pts: THREE.Vector3[] = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const y of [0, RAIL_TOP]) pts.push(new THREE.Vector3(sx * OUT_X, y, sz * OUT_Z));
    const v = new THREE.Vector3();
    const span = (d: number, tz: number) => {
      cam.position.set(0, d * Math.sin(pitch), tz + d * Math.cos(pitch));
      cam.lookAt(0, 0, tz);
      cam.updateMatrixWorld();
      let x = 0;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (const p of pts) {
        v.copy(p).project(cam);
        x = Math.max(x, Math.abs(v.x));
        y0 = Math.min(y0, v.y);
        y1 = Math.max(y1, v.y);
      }
      return { x, y0, y1 };
    };
    const center = (d: number) => {
      let a = -1.5;
      let b = 1.5;
      for (let i = 0; i < 22; i++) {
        const tz = (a + b) / 2;
        const s = span(d, tz);
        if (s.y0 + s.y1 > 0) b = tz;
        else a = tz;
      }
      return (a + b) / 2;
    };
    let lo = 1.2;
    let hi = 16;
    for (let i = 0; i < 22; i++) {
      const d = (lo + hi) / 2;
      const s = span(d, center(d));
      if (s.x <= freeW && s.y1 <= freeH) hi = d;
      else lo = d;
    }
    const tz = center(hi);
    return { pos: new THREE.Vector3(0, hi * Math.sin(pitch), tz + hi * Math.cos(pitch)), target: new THREE.Vector3(0, 0, tz), fov, shiftY: (m.top - m.bottom) / 2 };
  }

  /** olhando de cima para dentro de uma caçapa, bem de perto: a tela fica preta */
  pocketView(i: number, fov: number): View {
    const p = POCKETS[i];
    return { pos: new THREE.Vector3(p.x, 0.07, p.z), target: new THREE.Vector3(p.x, -1, p.z - 0.03), fov, shiftY: 0 };
  }

  applyView(v: View) {
    this.camera.fov = v.fov;
    this.camera.position.copy(v.pos);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(v.target);
    if (Math.abs(v.shiftY) > 0.5) this.camera.setViewOffset(this.w, this.h, 0, -v.shiftY, this.w, this.h);
    else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  }

  /** mistura duas vistas (e 0–1, já suavizado); bend afasta o caminho para o lado, lift levanta o meio do caminho */
  mixView(a: View, b: View, e: number, bend = 0, lift = 0): View {
    const pos = a.pos.clone().lerp(b.pos, e);
    pos.x += Math.sin(Math.PI * e) * bend;
    pos.y += Math.sin(Math.PI * e) * lift;
    return { pos, target: a.target.clone().lerp(b.target, e), fov: a.fov + (b.fov - a.fov) * e, shiftY: a.shiftY + (b.shiftY - a.shiftY) * e };
  }

  /** ponto do pano embaixo de um ponto da tela */
  bedPoint(clientX: number, clientY: number) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1), this.camera);
    const out = new THREE.Vector3();
    return this.ray.ray.intersectPlane(this.bedPlane, out) ? { x: out.x, z: out.z } : null;
  }

  /** posição na tela (px) de um ponto do pano */
  screenPoint(x: number, z: number, y = R) {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h };
  }

  /** desenha a sala toda uma vez, fora de vista, para compilar os materiais e subir as texturas */
  warmUp(views: View[]) {
    this.renderer.compile(this.scene, this.camera);
    for (const v of views) {
      this.applyView(v);
      this.renderer.render(this.scene, this.camera);
    }
  }

  render(time: number) {
    // a luminária balança de leve: as sombras das bolas mexem junto
    this.lampPivot.rotation.z = Math.sin(time * 0.9) * 0.012 * this.lampK;
    this.lampPivot.rotation.x = Math.cos(time * 0.7) * 0.008 * this.lampK;
    if (this.dust) this.dust.rotation.y = time * 0.03;
    if (this.signHalo) this.signHalo.material.opacity = (0.5 + Math.sin(time * 2.1) * 0.03) * this.roomK;
    if (this.signLight) this.signLight.intensity = (4 + Math.sin(time * 2.1) * 0.15) * this.roomK;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    for (const d of this.disposables) d.dispose();
    this.spot.shadow.map?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss(); // solta a GPU já (o jogo abre outro contexto depois)
  }
}

/** Se o aparelho não dá conta dos 60 quadros, baixa a qualidade (resolução e sombras) sozinho. */
export class FrameGovernor {
  private n = 0;
  private sum = 0;
  private warm = 0;
  private q: 0 | 1 | 2 = 2;
  private scene: PoolScene;
  constructor(scene: PoolScene) {
    this.scene = scene;
  }
  tick(dt: number) {
    if (this.warm < 10) {
      this.warm++;
      return;
    }
    this.n++;
    this.sum += dt;
    if (this.n < 24) return;
    const avg = this.sum / this.n;
    this.n = 0;
    this.sum = 0;
    // abaixo de ~22 quadros por segundo (30 fixos, como no modo de economia do iPhone, ainda passa)
    if (avg > 0.045 && this.q > 0) {
      this.q = (this.q - 1) as 0 | 1;
      this.scene.setQuality(this.q);
      this.warm = 0;
    }
  }
}
