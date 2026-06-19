import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./components/Hero";
import CategoriesScreen from "./components/CategoriesScreen";

const easeSmooth = [0.22, 1, 0.36, 1] as const;

const screenVariants = {
  enter: (dir: number) =>
    dir > 0
      ? {
          opacity: 0,
          scale: 0.82,
          rotateX: 18,
          y: 90,
          z: -400,
          filter: "blur(12px)",
        }
      : {
          opacity: 0,
          scale: 1.18,
          rotateX: -6,
          y: -40,
          z: 200,
          filter: "blur(12px)",
        },
  center: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    y: 0,
    z: 0,
    filter: "blur(0px)",
  },
  exit: (dir: number) =>
    dir > 0
      ? {
          opacity: 0,
          scale: 1.2,
          rotateX: -10,
          y: -60,
          z: 300,
          filter: "blur(14px)",
        }
      : {
          opacity: 0,
          scale: 0.84,
          rotateX: 16,
          y: 80,
          z: -400,
          filter: "blur(14px)",
        },
};

type Screen = "hero" | "categories";

export default function App() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [direction, setDirection] = useState(1);

  const jumpTop = () => window.scrollTo({ top: 0, behavior: "auto" });

  const goCategories = () => {
    setDirection(1);
    jumpTop();
    setScreen("categories");
  };

  const backToHero = () => {
    setDirection(-1);
    jumpTop();
    setScreen("hero");
  };

  return (
    <div className="min-h-screen bg-black text-text">
      <div
        style={{ perspective: 2000, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {screen === "hero" && (
            <motion.div
              key="hero"
              custom={direction}
              variants={screenVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: easeSmooth }}
              style={{ transformOrigin: "center", transformStyle: "preserve-3d" }}
            >
              <Hero onExplore={goCategories} />
            </motion.div>
          )}

          {screen === "categories" && (
            <motion.div
              key="categories"
              custom={direction}
              variants={screenVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: easeSmooth }}
              style={{ transformOrigin: "center", transformStyle: "preserve-3d" }}
            >
              <CategoriesScreen onBack={backToHero} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
