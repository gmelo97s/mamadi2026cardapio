import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Hand, Heart } from "lucide-react";

export const DECK_HINTS_KEY = "mamadi-deck-hints-seen";

/** Já viu as instruções de navegação do deck? (primeira visita = false) */
export function hasSeenDeckHints(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return Boolean(window.localStorage.getItem(DECK_HINTS_KEY));
  } catch {
    return true;
  }
}

export function markDeckHintsSeen(): void {
  try {
    window.localStorage.setItem(DECK_HINTS_KEY, "1");
  } catch {
    /* modo privado / storage bloqueado — segue sem persistir */
  }
}

/** Ponteiro fino (mouse) = desktop; usado só para trocar o verbo das dicas. */
function usePointerVerbs() {
  const [fine, setFine] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = (event: MediaQueryListEvent) => setFine(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return fine
    ? { tap: "Clique", drag: "Arraste", act: "clique", keys: true }
    : { tap: "Toque", drag: "Arraste", act: "toque", keys: false };
}

const AUTO_DISMISS_MS = 9000;

interface DeckNavigationHintsProps {
  reducedMotion: boolean | null;
  onDismiss: () => void;
}

/** Dicas flutuantes discretas de navegação, só na primeira visita. */
export default function DeckNavigationHints({
  reducedMotion,
  onDismiss,
}: DeckNavigationHintsProps) {
  const verbs = usePointerVerbs();

  // Aparecem uma vez só: marca como visto já na abertura.
  useEffect(() => {
    markDeckHintsSeen();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  const pill = (delay: number) =>
    reducedMotion
      ? { initial: false as const, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 8, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <motion.div
      className="deck-hints"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
      role="note"
      aria-label={`${verbs.tap} no card para ver o próximo item. ${verbs.drag} o card para o lado ou ${verbs.act} no coração para ir para a próxima categoria.`}
    >
      <motion.p className="deck-hints__pill deck-hints__pill--item" {...pill(0.5)}>
        <span className="deck-hints__icon" aria-hidden>
          <Hand size={13} strokeWidth={2.25} />
          <ChevronRight className="deck-hints__icon-chevron" size={13} strokeWidth={2.75} />
        </span>
        <span className="deck-hints__text">
          {verbs.tap} para o próximo item
          {verbs.keys && <span className="deck-hints__keys"> ou use ← →</span>}
        </span>
      </motion.p>

      <motion.p className="deck-hints__pill deck-hints__pill--category" {...pill(0.95)}>
        <span className="deck-hints__icon" aria-hidden>
          <Heart size={13} strokeWidth={2.5} fill="currentColor" />
        </span>
        <span className="deck-hints__text">
          {verbs.drag} ou dê &ldquo;amei&rdquo; para a próxima categoria
        </span>
      </motion.p>
    </motion.div>
  );
}
