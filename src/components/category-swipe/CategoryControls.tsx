import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeftRight,
  Info,
  MoveHorizontal,
  X,
} from "lucide-react";

const HELP_ITEMS = [
  {
    icon: ChevronRight,
    label: "Toque à direita para ver o próximo item",
  },
  {
    icon: ChevronLeft,
    label: "Toque à esquerda para voltar",
  },
  {
    icon: MoveHorizontal,
    label: "Deslize para trocar de categoria",
  },
  {
    icon: ChevronsLeftRight,
    label: "Use as setas para avançar entre categorias",
  },
] as const;

interface CategoryControlsProps {
  onPrevCategory: () => void;
  onNextCategory: () => void;
  canPrev: boolean;
  canNext: boolean;
  microHint?: ReactNode;
}

export default function CategoryControls({
  onPrevCategory,
  onNextCategory,
  canPrev,
  canNext,
  microHint,
}: CategoryControlsProps) {
  const reducedMotion = useReducedMotion();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="category-controls-wrap">
      {microHint}

      <div className="category-controls">
        <motion.button
          type="button"
          aria-label="Categoria anterior"
          disabled={!canPrev}
          onClick={onPrevCategory}
          whileHover={reducedMotion ? undefined : { scale: 1.08 }}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          className="category-controls__btn category-controls__btn--side"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </motion.button>

        <motion.button
          type="button"
          aria-label="Como navegar"
          onClick={() => setShowHelp(true)}
          whileHover={reducedMotion ? undefined : { scale: 1.06 }}
          whileTap={reducedMotion ? undefined : { scale: 0.94 }}
          className="category-controls__btn category-controls__btn--center"
        >
          <Info className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>

        <motion.button
          type="button"
          aria-label="Próxima categoria"
          disabled={!canNext}
          onClick={onNextCategory}
          whileHover={reducedMotion ? undefined : { scale: 1.1 }}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          className="category-controls__btn category-controls__btn--side category-controls__btn--primary"
        >
          <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="category-controls__help-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              className="category-controls__help category-controls__help--rainbow"
              role="dialog"
              aria-labelledby="nav-help-title"
              initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="category-controls__help-close"
                aria-label="Fechar"
                onClick={() => setShowHelp(false)}
              >
                <X className="h-4 w-4" />
              </button>
              <h3 id="nav-help-title" className="category-controls__help-title">
                Como navegar
              </h3>
              <ul className="category-controls__help-list">
                {HELP_ITEMS.map(({ icon: Icon, label }) => (
                  <li key={label} className="category-controls__help-item">
                    <span className="category-controls__help-icon" aria-hidden>
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
