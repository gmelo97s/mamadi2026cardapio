import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  heroAssemblySpring,
  HERO_ASSEMBLY_EASE,
  WORD_ASSEMBLY_OFFSETS,
} from "../lib/heroAssemblyMotion";

const PHRASES = [
  {
    text: "Copa do Mundo é no Mamadi!",
    holdMs: 3600,
    short: false,
  },
  {
    text: "Vai Brasil!",
    holdMs: 2800,
    short: true,
  },
] as const;

const PHRASE_SWAP = {
  duration: 0.58,
  ease: HERO_ASSEMBLY_EASE,
} as const;

const phraseSwapVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -34,
    scale: 0.9,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -18,
    rotateX: 34,
    scale: 0.92,
    filter: "blur(12px)",
  },
};

const reducedPhraseVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const neonPulse = {
  y: [0, -3, 0],
  opacity: [0.88, 1, 0.88],
  filter: [
    "drop-shadow(0 0 8px rgba(0,230,118,0.55)) drop-shadow(0 0 14px rgba(255,229,0,0.35))",
    "drop-shadow(0 0 14px rgba(255,229,0,0.7)) drop-shadow(0 0 22px rgba(0,230,118,0.5))",
    "drop-shadow(0 0 8px rgba(0,230,118,0.55)) drop-shadow(0 0 14px rgba(255,229,0,0.35))",
  ],
};

function NeonWords({
  words,
  introAssembly,
  reducedMotion,
}: {
  words: string[];
  introAssembly: boolean;
  reducedMotion: boolean | null;
}) {
  return (
    <>
      {words.map((word, i) => {
        const offset = WORD_ASSEMBLY_OFFSETS[i % WORD_ASSEMBLY_OFFSETS.length];
        const assembling = introAssembly && !reducedMotion;

        return (
          <motion.span
            key={`${word}-${i}`}
            className="hero-copa-headline__word"
            initial={
              assembling
                ? {
                    opacity: 0,
                    ...offset,
                    scale: 0.82,
                    filter: "blur(10px)",
                  }
                : false
            }
            animate={
              reducedMotion
                ? undefined
                : assembling
                  ? {
                      opacity: 1,
                      rotateY: 0,
                      rotateX: 0,
                      x: 0,
                      z: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }
                  : neonPulse
            }
            transition={
              assembling
                ? heroAssemblySpring(0.38 + i * 0.09)
                : {
                    duration: 2.6,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }
            }
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        );
      })}
    </>
  );
}

export default function HeroCopaHeadline() {
  const reducedMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(Boolean(reducedMotion));

  const phrase = PHRASES[phraseIndex];
  const words = phrase.text.split(" ");
  const isIntroPhrase = phraseIndex === 0 && !introComplete;

  useEffect(() => {
    if (reducedMotion) return;
    const firstWords = PHRASES[0].text.split(" ");
    const lastDelay = 0.38 + (firstWords.length - 1) * 0.09;
    const timer = window.setTimeout(
      () => setIntroComplete(true),
      (lastDelay + 0.85) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (!introComplete) return;
    const hold = reducedMotion ? PHRASES[phraseIndex].holdMs + 800 : PHRASES[phraseIndex].holdMs;
    const timer = window.setTimeout(
      () => setPhraseIndex((i) => (i + 1) % PHRASES.length),
      hold,
    );
    return () => window.clearTimeout(timer);
  }, [phraseIndex, introComplete, reducedMotion]);

  return (
    <motion.h2
      className="hero-copa-headline hero-piece-3d"
      aria-label={phrase.text}
      aria-live="polite"
      style={{ transformStyle: "preserve-3d" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phraseIndex}
          className={`hero-copa-headline__phrase${
            phrase.short ? " hero-copa-headline__phrase--short" : ""
          }`}
          variants={reducedMotion ? reducedPhraseVariants : phraseSwapVariants}
          initial={isIntroPhrase || reducedMotion ? false : "hidden"}
          animate="visible"
          exit="exit"
          transition={
            reducedMotion ? { duration: 0.25, ease: "easeInOut" } : PHRASE_SWAP
          }
        >
          <NeonWords
            words={words}
            introAssembly={isIntroPhrase}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </AnimatePresence>
    </motion.h2>
  );
}
