import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TAGLINE = "Bebida gelada, comida gostosa e promoções todos os dias";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface HeroTaglineProps {
  introDelayMs?: number;
}

export default function HeroTagline({ introDelayMs = 0 }: HeroTaglineProps) {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? TAGLINE.length : 0);
  const [fadeOut, setFadeOut] = useState(false);
  const [loopReady, setLoopReady] = useState(Boolean(reducedMotion));

  useEffect(() => {
    if (reducedMotion) {
      setLoopReady(true);
      setVisibleCount(TAGLINE.length);
      return;
    }

    const readyTimer = window.setTimeout(() => setLoopReady(true), introDelayMs);
    return () => window.clearTimeout(readyTimer);
  }, [reducedMotion, introDelayMs]);

  useEffect(() => {
    if (!loopReady || reducedMotion) return;

    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        setFadeOut(false);
        setVisibleCount(0);
        await sleep(420);

        for (let i = 1; i <= TAGLINE.length; i++) {
          if (cancelled) return;
          setVisibleCount(i);
          await sleep(40);
        }

        await sleep(3800);

        setFadeOut(true);
        await sleep(900);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, [loopReady, reducedMotion]);

  return (
    <p className="hero-cta-tagline" aria-label={TAGLINE}>
      {TAGLINE.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="hero-cta-tagline__char"
          animate={{
            opacity: fadeOut ? 0 : i < visibleCount ? 1 : 0,
            x: fadeOut ? 10 : i < visibleCount ? 0 : -14,
            filter: fadeOut
              ? "blur(5px)"
              : i < visibleCount
                ? "blur(0px)"
                : "blur(6px)",
          }}
          transition={{
            duration: fadeOut ? 0.4 : 0.26,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </p>
  );
}
