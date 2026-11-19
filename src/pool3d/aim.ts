/*
 * A tacada no dedo: encosta, puxa para trás e solta (como um estilingue).
 * A direção é o contrário do puxão, medida no pano da mesa; a força é o tamanho do puxão na tela.
 */
import type { PoolScene } from "./scene";

export interface AimHandlers {
  /** enquanto puxa: direção da tacada (no pano) e força 0–1 */
  aim(dx: number, dz: number, power: number): void;
  /** soltou com força: tacada */
  shoot(dx: number, dz: number, power: number): void;
  /** soltou sem puxar (toque simples) */
  tap?(): void;
  /** desistiu (voltou o dedo ou o toque foi cancelado) */
  cancel(): void;
}

const DEAD = 14; // px sem contar, para o toque não virar tacada
const MIN_POWER = 0.06;

export class Slingshot {
  enabled = false;
  private id: number | null = null;
  private x0 = 0;
  private y0 = 0;
  private cur: { dx: number; dz: number; power: number } | null = null;
  private el: HTMLElement;
  private scene: PoolScene;
  private h: AimHandlers;

  constructor(el: HTMLElement, scene: PoolScene, h: AimHandlers) {
    this.el = el;
    this.scene = scene;
    this.h = h;
    el.addEventListener("pointerdown", this.down);
    el.addEventListener("pointermove", this.move);
    el.addEventListener("pointerup", this.up);
    el.addEventListener("pointercancel", this.abort);
  }

  get dragging() {
    return this.id !== null;
  }

  private down = (e: PointerEvent) => {
    if (!this.enabled || this.id !== null || (e.pointerType === "mouse" && e.button !== 0)) return;
    this.id = e.pointerId;
    this.x0 = e.clientX;
    this.y0 = e.clientY;
    this.cur = null;
    try {
      this.el.setPointerCapture(e.pointerId);
    } catch {
      /* alguns navegadores não capturam: segue sem */
    }
  };

  private move = (e: PointerEvent) => {
    if (e.pointerId !== this.id) return;
    const len = Math.hypot(e.clientX - this.x0, e.clientY - this.y0);
    if (len < DEAD) {
      if (this.cur) {
        this.cur = null;
        this.h.cancel();
      }
      return;
    }
    const a = this.scene.bedPoint(this.x0, this.y0);
    const b = this.scene.bedPoint(e.clientX, e.clientY);
    if (!a || !b) return;
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    const l = Math.hypot(dx, dz);
    if (l < 1e-5) return;
    const max = Math.min(200, this.scene.height * 0.27);
    const power = Math.min(1, (len - DEAD) / max);
    this.cur = { dx: dx / l, dz: dz / l, power };
    this.h.aim(this.cur.dx, this.cur.dz, power);
  };

  private up = (e: PointerEvent) => {
    if (e.pointerId !== this.id) return;
    this.id = null;
    const c = this.cur;
    this.cur = null;
    if (!this.enabled) return this.h.cancel();
    if (!c) {
      const still = Math.hypot(e.clientX - this.x0, e.clientY - this.y0) < DEAD;
      if (still && this.h.tap) this.h.tap();
      else this.h.cancel();
    } else if (c.power < MIN_POWER) this.h.cancel();
    else this.h.shoot(c.dx, c.dz, c.power);
  };

  private abort = (e: PointerEvent) => {
    if (e.pointerId !== this.id) return;
    this.id = null;
    this.cur = null;
    this.h.cancel();
  };

  dispose() {
    this.el.removeEventListener("pointerdown", this.down);
    this.el.removeEventListener("pointermove", this.move);
    this.el.removeEventListener("pointerup", this.up);
    this.el.removeEventListener("pointercancel", this.abort);
  }
}

/** força 0–1 → velocidade da branca em m/s */
export function shotSpeed(power: number) {
  return 0.9 + Math.pow(power, 1.25) * 7.4;
}
