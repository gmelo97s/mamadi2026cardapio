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
  const [introDone, setIntroDone] = useState(Boolean(reducedMotion));

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(TAGLINE.length);
      setIntroDone(true);
      return;
    }

    let cancelled = false;

    const runOnce = async () => {
      await sleep(introDelayMs);
      if (cancelled) return;

      await sleep(420);

      for (let i = 1; i <= TAGLINE.length; i++) {
        if (cancelled) return;
        setVisibleCount(i);
        await sleep(40);
      }

      if (!cancelled) setIntroDone(true);
    };

    runOnce();
    return () => {
      cancelled = true;
    };
  }, [reducedMotion, introDelayMs]);

  return (
    <p className="hero-cta-tagline" aria-label={TAGLINE}>
      {TAGLINE.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="hero-cta-tagline__char"
          animate={
            introDone || i < visibleCount
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -14, filter: "blur(6px)" }
          }
          transition={{
            duration: 0.26,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </p>
  );
}
