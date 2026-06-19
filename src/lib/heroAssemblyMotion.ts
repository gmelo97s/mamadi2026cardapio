import type { Transition, Variants } from "framer-motion";

export const HERO_ASSEMBLY_EASE = [0.16, 1, 0.3, 1] as const;

export const heroAssemblySpring = (delay = 0): Transition => ({
  type: "spring",
  stiffness: 72,
  damping: 15,
  mass: 0.88,
  delay,
});

export const heroAssemblyTween = (delay = 0, duration = 0.95): Transition => ({
  duration,
  delay,
  ease: HERO_ASSEMBLY_EASE,
});

export const heroArtVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateX: 44,
    rotateY: -22,
    z: -340,
    y: -150,
    scale: 0.66,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
};

export const heroTaglineBlockVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateY: 58,
    rotateX: -12,
    x: 110,
    z: -100,
    scale: 0.86,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    x: 0,
    z: 0,
    scale: 1,
    filter: "blur(0px)",
  },
};

export const heroCtaVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateX: -62,
    rotateY: 8,
    y: 90,
    z: -150,
    scale: 0.78,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    y: 0,
    z: 0,
    scale: 1,
    filter: "blur(0px)",
  },
};

export const heroCopyrightVariants: Variants = {
  hidden: { opacity: 0, y: 16, z: -40 },
  visible: { opacity: 1, y: 0, z: 0 },
};

/** Offsets alternados — cada palavra “viaja” de um ângulo diferente. */
export const WORD_ASSEMBLY_OFFSETS = [
  { rotateY: -72, rotateX: 16, x: -100, z: -180 },
  { rotateY: 64, rotateX: -12, x: 80, z: -140 },
  { rotateY: -58, rotateX: 10, x: -70, z: -120 },
  { rotateY: 52, rotateX: -14, x: 65, z: -130 },
  { rotateY: -66, rotateX: 8, x: -85, z: -110 },
  { rotateY: 70, rotateX: -10, x: 95, z: -150 },
  { rotateY: -54, rotateX: 12, x: -60, z: -100 },
] as const;

export const TAGLINE_INTRO_DELAY_MS = 1150;
