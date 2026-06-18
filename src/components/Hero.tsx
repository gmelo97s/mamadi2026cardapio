import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-black">
      {/* Fundo preto sólido — preenche toda a área (letterbox do object-contain) */}
      <div className="absolute inset-0 z-0 bg-black" aria-hidden />

      <motion.img
        src="/hero.png"
        alt="Cerveja Mamadi Pride Edition com bola de futebol"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-[1] h-full w-full object-contain object-center"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="absolute bottom-[14%] left-0 right-0 z-[3] flex justify-center px-6 sm:bottom-[15%] md:bottom-[16%]"
      >
        <motion.button
          onClick={onExplore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="cta-btn flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase shadow-[0_0_30px_rgba(255,64,129,0.4)]"
        >
          Conhecer Cardápio
          <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </motion.button>
      </motion.div>
    </section>
  );
}
