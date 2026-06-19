import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TAGLINE = "Bebida gelada, comida gostosa e promoções todos os dias";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function HeroTagline() {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(TAGLINE.length);
      setFadeOut(false);
      return;
    }

    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        setFadeOut(false);
        setVisibleCount(0);
        await sleep(280);

        for (let i = 1; i <= TAGLINE.length; i++) {
          if (cancelled) return;
          setVisibleCount(i);
          await sleep(36);
        }

        await sleep(2600);

        setFadeOut(true);
        await sleep(700);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

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
