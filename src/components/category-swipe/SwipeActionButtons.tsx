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
      <div className="swipe-actions__cluster">
        <div className="swipe-actions__col swipe-actions__col--reject">
          <span className="swipe-actions__label swipe-actions__label--red">
            Voltar Categoria
          </span>
          <motion.button
            type="button"
            aria-label="Voltar categoria"
            disabled={!canReject}
            onClick={onReject}
            whileTap={reducedMotion ? undefined : { scale: 0.92 }}
            className="swipe-actions__btn swipe-actions__btn--reject"
          >
            <X size={28} strokeWidth={3.8} />
          </motion.button>
        </div>

        <div className="swipe-actions__col swipe-actions__col--super">
          <div className="swipe-actions__super-wrap">
            <motion.button
              type="button"
              aria-label="Ir para Combos e Copão"
              onClick={onSuperLike}
              whileTap={reducedMotion ? undefined : { scale: 0.92 }}
              className="swipe-actions__btn swipe-actions__btn--super"
            >
              <Star size={26} strokeWidth={3.2} fill="currentColor" />
            </motion.button>
            <span className="swipe-actions__badge" aria-hidden>
              {combosCount}
            </span>
          </div>
        </div>

        <div className="swipe-actions__col swipe-actions__col--like">
          <span className="swipe-actions__label swipe-actions__label--green">
            Pular categoria
          </span>
          <motion.button
            type="button"
            aria-label="Pular categoria"
            disabled={!canLike}
            onClick={onLike}
            whileTap={reducedMotion ? undefined : { scale: 0.92 }}
            className="swipe-actions__btn swipe-actions__btn--like"
          >
            <Heart size={28} strokeWidth={3.2} fill="currentColor" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
