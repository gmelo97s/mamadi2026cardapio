import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CardMicroHintProps {
  reducedMotion: boolean | null;
}

export default function CardMicroHint({ reducedMotion }: CardMicroHintProps) {
  const [dimmed, setDimmed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDimmed(true), 6000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="card-micro-hint-wrap"
      initial={reducedMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: dimmed ? 0.78 : 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
      role="note"
      aria-label="Toque nas laterais ou deslize para trocar a categoria."
    >
      <p className="card-micro-hint">
        <span className="card-micro-hint__text">
          Toque nas laterais • Deslize para trocar a categoria
        </span>
      </p>
    </motion.div>
  );
}
