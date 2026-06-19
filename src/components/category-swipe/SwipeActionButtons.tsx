import { Heart, Star, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface SwipeActionButtonsProps {
  onReject: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  canReject: boolean;
  canLike: boolean;
  combosCount: number;
}

export default function SwipeActionButtons({
  onReject,
  onLike,
  onSuperLike,
  canReject,
  canLike,
  combosCount,
}: SwipeActionButtonsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <footer className="swipe-actions" aria-label="Ações de navegação">
      <motion.button
        type="button"
        aria-label="Categoria anterior"
        disabled={!canReject}
        onClick={onReject}
        whileTap={reducedMotion ? undefined : { scale: 0.9 }}
        className="swipe-actions__btn swipe-actions__btn--reject"
      >
        <X className="swipe-actions__icon" strokeWidth={2.5} />
      </motion.button>

      <div className="swipe-actions__super-wrap">
        <motion.button
          type="button"
          aria-label="Ir para Combos e Copão"
          onClick={onSuperLike}
          whileTap={reducedMotion ? undefined : { scale: 0.9 }}
          className="swipe-actions__btn swipe-actions__btn--super"
        >
          <Star className="swipe-actions__icon swipe-actions__icon--super" fill="currentColor" />
        </motion.button>
        <span className="swipe-actions__badge" aria-hidden>
          {combosCount}
        </span>
      </div>

      <motion.button
        type="button"
        aria-label="Próxima categoria"
        disabled={!canLike}
        onClick={onLike}
        whileTap={reducedMotion ? undefined : { scale: 0.9 }}
        className="swipe-actions__btn swipe-actions__btn--like"
      >
        <Heart className="swipe-actions__icon" fill="currentColor" />
      </motion.button>
    </footer>
  );
}
