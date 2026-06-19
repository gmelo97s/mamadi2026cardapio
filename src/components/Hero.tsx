import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroCopaHeadline from "./HeroCopaHeadline";
import HeroTagline from "./HeroTagline";

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-visual__wrap">
        <div className="hero-visual__inner">
          <motion.img
            src="/hero-neon.png"
            alt="Mamadi Food — cervejas, drinks e porções"
            className="hero-visual__photo"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="hero-tagline-wrap">
          <HeroCopaHeadline />
          <HeroTagline />
        </div>
      </div>

      <div className="hero-bottom">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="hero-cta-wrap"
        >
          <motion.button
            onClick={onExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="cta-btn hero-cta-btn flex items-center justify-center gap-1.5 rounded-full"
          >
            Ver cardápio
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </motion.button>
        </motion.div>

        <p className="hero-copyright">
          © 2026 Mamadi Food. Todos os direitos reservados.
        </p>
      </div>
    </section>
  );
}
