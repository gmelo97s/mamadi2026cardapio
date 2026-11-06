/*
 * A tampinha do Mamadi em 3D (Three.js).
 * O logo vira o topo de uma tampinha de cerveja (21 dentes, metal laranja envernizado)
 * com um abridor engatado na borda. Puxar o abridor abre a tampinha: ela estoura,
 * gira no ar e espirra espuma. É o "logo vira a chave" do Botanikafe, versão boteco.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { capLayout } from "./layout";

export interface Anchor {
  x: number;
  y: number;
  /** ângulo do abridor (rad) para a cordinha */
  angle: number;
  /** escala aparente (pixels por unidade) */
  ppu: number;
}

export interface CapSceneOptions {
  canvas: HTMLCanvasElement;
  texture: string;
  /** posição vertical do centro da tampinha (0 = topo, 1 = base da tela) */
  centerY?: number;
  onReady?: () => void;
  onAnchor?: (a: Anchor) => void;
  transparent?: boolean;
  /** só para gerar imagens: tamanho fixo da tampinha (px), sem abridor e sem movimento */
  capPx?: number;
  hideOpener?: boolean;
  still?: boolean;
}

export interface CapScene {
  setPull(p: number): void;
  setTilt(x: number, y: number): void;
  pop(): Promise<void>;
  reset(): void;
  resize(): void;
  pause(paused: boolean): void;
  dispose(): void;
}

const FLUTES = 21;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function capBody(): { outer: THREE.BufferGeometry; inner: THREE.BufferGeometry } {
  // perfil (raio, altura): topo plano → ombro arredondado → saia com dentes → beirada
  const prof: [number, number][] = [
    [0.925, 0.0],
    [0.955, -0.008],
    [0.982, -0.028],
    [0.998, -0.06],
    [1.006, -0.1],
    [1.018, -0.17],
    [1.034, -0.25],
    [1.054, -0.32],
    [1.082, -0.385],
    [1.108, -0.425],
    [1.112, -0.446],
    [1.098, -0.456],
  ];
  const pts = prof.map(([r, y]) => new THREE.Vector2(r, y));
  const make = (scale: number) => {
    const g = new THREE.LatheGeometry(
      pts.map((p) => new THREE.Vector2(p.x * scale, p.y)),
      FLUTES * 12,
    );
    g.rotateX(Math.PI / 2); // eixo da tampinha = +Z (topo virado para a câmera)
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const depth = clamp((-v.z - 0.075) / 0.37, 0, 1);
      if (depth <= 0) continue;
      const th = Math.atan2(v.y, v.x);
      const f = Math.pow(0.5 - 0.5 * Math.cos(FLUTES * th), 0.75);
      const d = 0.092 * Math.pow(depth, 1.15) * (f - 0.42);
      const r = Math.hypot(v.x, v.y);
      const k = (r + d) / r;
      pos.setXY(i, v.x * k, v.y * k);
    }
    g.computeVertexNormals();
    return g;
  };
  return { outer: make(1), inner: make(0.985) };
}

function openerShape() {
  const s = new THREE.Shape();
  const hw = 0.2; // meia largura do cabo
  const headR = 0.38;
  const a = Math.acos(hw / headR);
  const hy = -Math.sin(a) * headR;
  s.moveTo(-hw, -1.88);
  s.absarc(0, -1.88, hw, Math.PI, 0, false);
  s.lineTo(hw, hy);
  s.absarc(0, 0, headR, -a, Math.PI + a, false);
  s.lineTo(-hw, -1.88);
  const mouth = new THREE.Path();
  mouth.absellipse(0, 0.02, 0.2, 0.17, 0, Math.PI * 2, true, 0);
  const ring = new THREE.Path();
  ring.absarc(0, -1.9, 0.075, 0, Math.PI * 2, true);
  s.holes.push(mouth, ring);
  return s;
}

function labelTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 128, 0);
  grd.addColorStop(0, "#d94b07");
  grd.addColorStop(0.5, "#fa6a14");
  grd.addColorStop(1, "#d94b07");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 512);
  g.save();
  g.translate(64, 256);
  g.rotate(-Math.PI / 2);
  g.font = '68px "Lilita One", "Archivo Variable", sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.lineJoin = "round";
  g.lineWidth = 10;
  g.strokeStyle = "#4a1200";
  g.strokeText("MAMADI", 0, 4);
  g.fillStyle = "#fff4e3";
  g.fillText("MAMADI", 0, 4);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createCapScene(opts: CapSceneOptions): CapScene {
  const { canvas } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.42;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

  // luzes: principal quente, contraluz laranja/rosa e um brilho que passa
  const key = new THREE.DirectionalLight(0xfff0dc, 2.4);
  key.position.set(-3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff6a2a, 2.2);
  rim.position.set(4, -1.5, -3);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xff3fae, 0.55);
  rim2.position.set(-4, -2, -2);
  scene.add(rim2);
  scene.add(new THREE.HemisphereLight(0xffe7cc, 0x1a0c06, 0.5));
  const glint = new THREE.PointLight(0xffffff, 0, 6, 1.6);
  scene.add(glint);

  // ── tampinha
  const root = new THREE.Group();
  scene.add(root);
  const cap = new THREE.Group();
  root.add(cap);

  const loader = new THREE.TextureLoader();
  const print = loader.load(opts.texture, () => {
    renderOnce();
    opts.onReady?.();
  });
  print.colorSpace = THREE.SRGBColorSpace;
  print.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const topMat = new THREE.MeshPhysicalMaterial({ map: print, roughness: 0.48, metalness: 0.04, clearcoat: 0.7, clearcoatRoughness: 0.16 });
  const top = new THREE.Mesh(new THREE.CircleGeometry(0.925, 128), topMat);
  top.position.z = 0.0005;
  cap.add(top);

  const { outer, inner } = capBody();
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xf0550a, metalness: 0.22, roughness: 0.36, clearcoat: 0.45, clearcoatRoughness: 0.25 });
  cap.add(new THREE.Mesh(outer, bodyMat));
  const innerMat = new THREE.MeshStandardMaterial({ color: 0xcfc8bd, metalness: 0.85, roughness: 0.38, side: THREE.BackSide });
  cap.add(new THREE.Mesh(inner, innerMat));
  const liner = new THREE.Mesh(new THREE.CircleGeometry(0.97, 64), new THREE.MeshStandardMaterial({ color: 0xece6db, roughness: 0.75 }));
  liner.rotation.y = Math.PI;
  liner.position.z = -0.035;
  cap.add(liner);

  // ── abridor (engatado embaixo, à direita)
  const opener = new THREE.Group(); // pivô no engate
  root.add(opener);
  const hookAngle = THREE.MathUtils.degToRad(-76);
  opener.position.set(Math.cos(hookAngle) * 0.98, Math.sin(hookAngle) * 0.98, 0.16);
  opener.rotation.z = THREE.MathUtils.degToRad(11);
  opener.scale.setScalar(0.88);
  const swing = new THREE.Group();
  opener.add(swing);
  const lever = new THREE.Group();
  swing.add(lever);
  const steel = new THREE.MeshStandardMaterial({ color: 0xdcdde3, metalness: 1, roughness: 0.26 });
  const openerGeo = new THREE.ExtrudeGeometry(openerShape(), { depth: 0.05, bevelEnabled: true, bevelThickness: 0.016, bevelSize: 0.016, bevelSegments: 3, curveSegments: 40 });
  openerGeo.translate(0, 0, -0.025);
  const openerMesh = new THREE.Mesh(openerGeo, steel);
  lever.add(openerMesh);
  const labelTex = labelTexture();
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.28, 1.06),
    new THREE.MeshPhysicalMaterial({ map: labelTex, roughness: 0.3, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 }),
  );
  label.position.set(0, -1.12, 0.043);
  lever.add(label);
  document.fonts?.load?.('68px "Lilita One"').then(() => {
    const fresh = labelTexture();
    (label.material as THREE.MeshPhysicalMaterial).map = fresh;
    (label.material as THREE.MeshPhysicalMaterial).needsUpdate = true;
    labelTex.dispose();
  });
  const ringLocal = new THREE.Vector3(0, -1.9, 0);
  if (opts.hideOpener) opener.visible = false;

  // ── respingo de espuma
  const SPRAY = 80;
  const dropGeo = new THREE.SphereGeometry(0.034, 10, 8);
  const dropMat = new THREE.MeshStandardMaterial({ color: 0xfff6e2, roughness: 0.2, metalness: 0, emissive: 0x3a2a10, transparent: true });
  const drops = new THREE.InstancedMesh(dropGeo, dropMat, SPRAY);
  drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  drops.visible = false;
  scene.add(drops);
  const dropState = Array.from({ length: SPRAY }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, max: 1, s: 1 }));

  // ── estado
  let w = 1;
  let h = 1;
  let ppu = 100;
  let pull = 0;
  let pullShown = 0;
  let tiltX = 0;
  let tiltY = 0;
  let tx = 0;
  let ty = 0;
  let popping = false;
  let popT = 0;
  let flying = false;
  const vel = new THREE.Vector3();
  const ang = new THREE.Vector3();
  let paused = false;
  let raf = 0;
  let last = performance.now();
  const t0 = last;
  let popResolve: (() => void) | null = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // diâmetro da tampinha na tela
    const lay = capLayout(w, h);
    const target = opts.capPx ?? lay.size;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const dist = (2.25 * h) / (target * 2 * Math.tan(fov / 2));
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    ppu = h / (2 * dist * Math.tan(fov / 2));
    const cy = opts.centerY ?? lay.centerY;
    camera.setViewOffset(w, h, 0, (0.5 - cy) * h, w, h);
    camera.updateProjectionMatrix();
    renderOnce();
  }

  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  function emitAnchor() {
    if (!opts.onAnchor) return;
    lever.updateWorldMatrix(true, false);
    tmp.copy(ringLocal).applyMatrix4(lever.matrixWorld);
    tmp2.set(0, -1.2, 0).applyMatrix4(lever.matrixWorld);
    const a = tmp.clone().project(camera);
    const b = tmp2.clone().project(camera);
    const x = (a.x * 0.5 + 0.5) * w;
    const y = (-a.y * 0.5 + 0.5) * h;
    const bx = (b.x * 0.5 + 0.5) * w;
    const by = (-b.y * 0.5 + 0.5) * h;
    opts.onAnchor({ x, y, angle: Math.atan2(x - bx, y - by), ppu });
  }

  function renderOnce() {
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (paused) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;

    tx += (tiltX - tx) * Math.min(1, dt * 4);
    ty += (tiltY - ty) * Math.min(1, dt * 4);
    pullShown += (pull - pullShown) * Math.min(1, dt * (popping ? 30 : 14));

    if (opts.still) {
      root.rotation.set(-0.16, 0.22, -0.04);
    } else if (!flying) {
      // parado: flutua de leve e segue o dedo/inclinação
      root.position.y = Math.sin(t * 1.5) * 0.035;
      root.rotation.x = -ty * 0.28 + Math.sin(t * 0.9) * 0.03;
      root.rotation.y = tx * 0.38 + Math.sin(t * 0.7) * 0.05;
      root.rotation.z = Math.sin(t * 0.6) * 0.025;
      swing.rotation.z = Math.sin(t * 1.7 + 0.6) * 0.05 * (1 - pullShown);
      lever.rotation.x = -pullShown * 0.95;
      cap.rotation.x = -pullShown * 0.16;
      cap.rotation.y = -pullShown * 0.1;
      cap.position.z = pullShown * 0.08;
      cap.position.y = pullShown * 0.05;
    }

    if (popping && !flying) {
      popT += dt;
      pull = Math.min(1.25, pull + dt * 9);
      if (popT > 0.15) {
        flying = true;
        vel.set(0.9, 6.2, 5.6);
        ang.set(9.5 + Math.random() * 2, 3.5, 7 + Math.random() * 2);
        // espuma
        drops.visible = true;
        const origin = new THREE.Vector3();
        cap.getWorldPosition(origin);
        dropState.forEach((d) => {
          d.p.copy(origin).add(new THREE.Vector3((Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.9, 0.1));
          const a = Math.random() * Math.PI * 2;
          const sp = 1.4 + Math.random() * 3.4;
          d.v.set(Math.cos(a) * sp * 0.8, Math.sin(a) * sp * 0.6 + 2.6, 1.5 + Math.random() * 3.5);
          d.life = 0;
          d.max = 0.55 + Math.random() * 0.5;
          d.s = 0.6 + Math.random() * 1.4;
        });
        popResolve?.();
        popResolve = null;
      }
    }

    if (flying) {
      vel.y -= 13 * dt;
      cap.position.addScaledVector(vel, dt);
      cap.rotation.x += ang.x * dt;
      cap.rotation.y += ang.y * dt;
      cap.rotation.z += ang.z * dt;
      // o abridor solta e cai balançando
      swing.rotation.z += dt * 2.4;
      opener.position.y -= dt * dt * 60 + dt * 1.5;
      lever.rotation.x += dt * 3;
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      dropState.forEach((d, i) => {
        d.life += dt;
        d.v.y -= 9 * dt;
        d.p.addScaledVector(d.v, dt);
        const k = clamp(1 - d.life / d.max, 0, 1);
        const sc = d.s * k;
        m.compose(d.p, q, new THREE.Vector3(sc, sc, sc));
        drops.setMatrixAt(i, m);
      });
      drops.instanceMatrix.needsUpdate = true;
    }

    // brilho que atravessa a tampinha de tempos em tempos
    const gp = (t % 5.5) / 5.5;
    glint.intensity = opts.still ? 0 : gp < 0.35 ? Math.sin((gp / 0.35) * Math.PI) * 9 : 0;
    glint.position.set(-2.4 + (gp / 0.35) * 4.8, 1.6 - (gp / 0.35) * 2.4, 1.6);

    renderer.render(scene, camera);
    emitAnchor();
  }

  const onVis = () => {
    paused = document.hidden;
  };
  document.addEventListener("visibilitychange", onVis);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    setPull(p) {
      if (!popping) pull = clamp(p, 0, 1.2);
    },
    setTilt(x, y) {
      tiltX = clamp(x, -1, 1);
      tiltY = clamp(y, -1, 1);
    },
    pop() {
      if (popping) return Promise.resolve();
      popping = true;
      popT = 0;
      return new Promise<void>((res) => {
        popResolve = res;
      });
    },
    reset() {
      popping = false;
      flying = false;
      pull = pullShown = 0;
      cap.position.set(0, 0, 0);
      cap.rotation.set(0, 0, 0);
      opener.position.set(Math.cos(hookAngle) * 0.98, Math.sin(hookAngle) * 0.98, 0.16);
      swing.rotation.set(0, 0, 0);
      lever.rotation.set(0, 0, 0);
      drops.visible = false;
    },
    resize,
    pause(p) {
      paused = p;
    },
    dispose() {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      print.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

export const ease3 = ease;
