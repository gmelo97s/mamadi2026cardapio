import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroCopaHeadline from "./HeroCopaHeadline";
import HeroTagline from "./HeroTagline";
import {
  heroArtVariants,
  heroAssemblySpring,
  heroAssemblyTween,
  heroCopyrightVariants,
  heroCtaVariants,
  heroTaglineBlockVariants,
  TAGLINE_INTRO_DELAY_MS,
} from "../lib/heroAssemblyMotion";

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="hero-section">
      <div className="hero-visual__wrap">
        <div className="hero-visual__inner">
          <motion.div
            className="hero-piece-3d hero-piece-3d--art"
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            variants={heroArtVariants}
            transition={heroAssemblySpring(0.05)}
          >
            <img
              src="/hero-neon.png"
              alt="Mamadi Food — cervejas, drinks e porções"
              className="hero-visual__photo"
              draggable={false}
            />
          </motion.div>
        </div>

        <div className="hero-tagline-wrap">
          <HeroCopaHeadline />
          <motion.div
            className="hero-piece-3d hero-piece-3d--tagline"
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            variants={heroTaglineBlockVariants}
            transition={heroAssemblySpring(0.42)}
          >
            <HeroTagline introDelayMs={reducedMotion ? 0 : TAGLINE_INTRO_DELAY_MS} />
          </motion.div>
        </div>
      </div>

      <div className="hero-bottom">
        <motion.div
          className="hero-cta-wrap hero-piece-3d hero-piece-3d--cta"
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={heroCtaVariants}
          transition={heroAssemblySpring(0.62)}
        >
          <motion.button
            onClick={onExplore}
            whileHover={reducedMotion ? undefined : { scale: 1.05, z: 8 }}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            className="cta-btn hero-cta-btn flex items-center justify-center gap-1.5 rounded-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            Ver cardápio
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </motion.button>
        </motion.div>

        <motion.p
          className="hero-copyright hero-piece-3d"
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={heroCopyrightVariants}
          transition={heroAssemblyTween(0.95, 0.55)}
        >
          © 2026 Mamadi Food. Todos os direitos reservados.
        </motion.p>
      </div>
    </section>
  );
}
