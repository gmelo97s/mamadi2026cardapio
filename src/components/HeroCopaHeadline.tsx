import { motion, useReducedMotion } from "framer-motion";

const HEADLINE = "Copa do Mundo é no Mamadi!";
const WORDS = HEADLINE.split(" ");

export default function HeroCopaHeadline() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.h2
      className="hero-copa-headline"
      aria-label={HEADLINE}
      initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {WORDS.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="hero-copa-headline__word"
          animate={
            reducedMotion
              ? undefined
              : {
                  y: [0, -3, 0],
                  opacity: [0.88, 1, 0.88],
                  filter: [
                    "drop-shadow(0 0 8px rgba(0,230,118,0.55)) drop-shadow(0 0 14px rgba(255,229,0,0.35))",
                    "drop-shadow(0 0 14px rgba(255,229,0,0.7)) drop-shadow(0 0 22px rgba(0,230,118,0.5))",
                    "drop-shadow(0 0 8px rgba(0,230,118,0.55)) drop-shadow(0 0 14px rgba(255,229,0,0.35))",
                  ],
                }
          }
          transition={{
            duration: 2.6,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        >
          {word}
          {i < WORDS.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.h2>
  );
}
