import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Hand, MoveHorizontal } from "lucide-react";

export const ONBOARDING_KEY = "mamadi_category_onboarding_seen";

interface NavigationOnboardingOverlayProps {
  reducedMotion: boolean | null;
}

const zoneMotion = (reducedMotion: boolean | null, delay: number) =>
  reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      };

export default function NavigationOnboardingOverlay({
  reducedMotion,
}: NavigationOnboardingOverlayProps) {
  return (
    <motion.div
      className="nav-onboarding"
      role="dialog"
      aria-label="Como navegar no cardápio"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="nav-onboarding__zone nav-onboarding__zone--left"
        {...zoneMotion(reducedMotion, 0.08)}
      >
        <div className="nav-onboarding__card nav-onboarding__card--left">
          <span className="nav-onboarding__icon-wrap" aria-hidden>
            <Hand className="nav-onboarding__hand" strokeWidth={2} />
            <ChevronLeft className="nav-onboarding__chevron" strokeWidth={2.5} />
          </span>
          <span className="nav-onboarding__label">Toque para voltar item</span>
        </div>
      </motion.div>

      <motion.div
        className="nav-onboarding__zone nav-onboarding__zone--right"
        {...zoneMotion(reducedMotion, 0.16)}
      >
        <div className="nav-onboarding__card nav-onboarding__card--right">
          <span className="nav-onboarding__icon-wrap" aria-hidden>
            <Hand className="nav-onboarding__hand nav-onboarding__hand--right" strokeWidth={2} />
            <ChevronRight className="nav-onboarding__chevron" strokeWidth={2.5} />
          </span>
          <span className="nav-onboarding__label">Toque para próximo item</span>
        </div>
      </motion.div>

      <motion.div
        className="nav-onboarding__swipe"
        {...zoneMotion(reducedMotion, 0.24)}
      >
        <div className="nav-onboarding__swipe-card">
          <span className="nav-onboarding__swipe-icon" aria-hidden>
            <MoveHorizontal className="nav-onboarding__swipe-glyph" strokeWidth={2.25} />
          </span>
          <span className="nav-onboarding__label nav-onboarding__label--swipe">
            Deslize para trocar categoria
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
