import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

interface CategoryControlsProps {
  onPrevCategory: () => void;
  onNextCategory: () => void;
  onItemDetails?: () => void;
  canPrev: boolean;
  canNext: boolean;
  hasItem: boolean;
}

export default function CategoryControls({
  onPrevCategory,
  onNextCategory,
  onItemDetails,
  canPrev,
  canNext,
  hasItem,
}: CategoryControlsProps) {
  const reducedMotion = useReducedMotion();

  return (
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
        aria-label="Detalhes do item"
        disabled={!hasItem}
        onClick={onItemDetails}
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
  );
}
