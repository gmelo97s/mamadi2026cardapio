import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import type { Category } from "../data/menu";
import { categories, itemsByCategory } from "../data/menu";

const PRIDE = [
  "#FF3B3B",
  "#FF8C00",
  "#FFE500",
  "#00E676",
  "#2979FF",
  "#AA00FF",
  "#FF4081",
];

const STACK_PEEK = 2;
const SWIPE_THRESHOLD = 88;
const VELOCITY_THRESHOLD = 650;

interface CategoryStackDeckProps {
  onOpen: (id: string) => void;
}

function StackCardFace({
  cat,
  count,
  accentIndex,
  onOpen,
  interactive,
}: {
  cat: Category;
  count: number;
  accentIndex: number;
  onOpen: () => void;
  interactive?: boolean;
}) {
  const accent = PRIDE[accentIndex % PRIDE.length];
  const nextAccent = PRIDE[(accentIndex + 2) % PRIDE.length];

  return (
    <div className="category-stack-card__inner">
      <div className="category-stack-card__media">
        {cat.cardImage ? (
          <img src={cat.cardImage} alt="" aria-hidden className="h-full w-full object-cover" />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${cat.gradient}`}
            style={{ boxShadow: `inset 0 0 80px ${cat.glow}55` }}
          />
        )}
        <div className="category-stack-card__shade" />
        <div className="category-stack-card__tags">
          <span className="category-stack-card__tag">{cat.emoji}</span>
          <span className="category-stack-card__tag">{count} itens</span>
        </div>
      </div>

      <div className="category-stack-card__dock">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
            {cat.label}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/65 sm:text-sm">
            Toque em abrir ou deslize para ver mais categorias do cardápio.
          </p>
        </div>
        {interactive && (
          <button
            type="button"
            onClick={onOpen}
            className="category-stack-card__cta shrink-0"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${nextAccent})`,
            }}
          >
            Abrir
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function CategoryStackDeck({ onOpen }: CategoryStackDeckProps) {
  const [index, setIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(0);
  const dragY = useMotionValue(0);
  const rotate = useTransform(dragY, [-160, 0, 160], [6, 0, -6]);
  const dragOpacity = useTransform(dragY, [-140, 0, 140], [0.88, 1, 0.88]);

  const total = categories.length;
  const current = categories[index];

  const go = (dir: 1 | -1) => {
    if (dir === 1 && index >= total - 1) return;
    if (dir === -1 && index <= 0) return;
    setSlideDir(dir);
    setIndex((i) => i + dir);
    dragY.set(0);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y > SWIPE_THRESHOLD || velocity.y > VELOCITY_THRESHOLD) {
      go(1);
      return;
    }
    if (offset.y < -SWIPE_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD) {
      go(-1);
    }
  };

  return (
    <section className="category-stack" aria-label="Categorias do cardápio">
      <div
        className="category-stack__glow"
        style={{ background: `radial-gradient(circle, ${current.glow}55 0%, transparent 68%)` }}
        aria-hidden
      />

      <div className="category-stack__header">
        <p className="category-stack__eyebrow">Cardápio Mamadi</p>
        <h2 className="category-stack__title">
          {String(index + 1).padStart(2, "0")}{" "}
          <span className="text-white/35">/</span> {String(total).padStart(2, "0")}
        </h2>
      </div>

      <div className="category-stack__deck">
        {Array.from({ length: STACK_PEEK + 1 }).map((_, stackPos) => {
          const catIndex = index + stackPos;
          if (catIndex >= total) return null;
          const cat = categories[catIndex];
          const count = itemsByCategory[cat.id]?.length ?? 0;
          const isFront = stackPos === 0;

          if (isFront) {
            return (
              <motion.div
                key={`${cat.id}-${index}`}
                className="category-stack-card category-stack-card-rainbow category-stack-card--front"
                style={{
                  y: dragY,
                  rotate,
                  opacity: dragOpacity,
                  zIndex: 40,
                }}
                drag="y"
                dragConstraints={{ top: -130, bottom: 130 }}
                dragElastic={0.28}
                onDragEnd={handleDragEnd}
                initial={{
                  opacity: 0,
                  y: slideDir === 1 ? -72 : slideDir === -1 ? 72 : 24,
                  scale: 0.94,
                }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
              >
                <StackCardFace
                  cat={cat}
                  count={count}
                  accentIndex={catIndex}
                  onOpen={() => onOpen(cat.id)}
                  interactive
                />
              </motion.div>
            );
          }

          return (
            <motion.div
              key={`${cat.id}-peek-${stackPos}`}
              className="category-stack-card category-stack-card-rainbow category-stack-card--peek"
              style={{ zIndex: 40 - stackPos }}
              initial={false}
              animate={{
                y: stackPos * -22,
                scale: 1 - stackPos * 0.045,
                opacity: 1 - stackPos * 0.14,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <StackCardFace cat={cat} count={count} accentIndex={catIndex} onOpen={() => {}} />
            </motion.div>
          );
        })}
      </div>

      <div className="category-stack__controls">
        <button
          type="button"
          className="category-stack__nav"
          disabled={index <= 0}
          aria-label="Categoria anterior"
          onClick={() => go(-1)}
        >
          <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="category-stack__dots">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              aria-label={cat.label}
              className={`category-stack__dot${i === index ? " is-active" : ""}`}
              onClick={() => {
                setSlideDir(i > index ? 1 : -1);
                setIndex(i);
                dragY.set(0);
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="category-stack__nav"
          disabled={index >= total - 1}
          aria-label="Próxima categoria"
          onClick={() => go(1)}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      <p className="category-stack__hint">
        Deslize <strong>para baixo</strong> · próxima &nbsp;·&nbsp;{" "}
        <strong>para cima</strong> · anterior
      </p>
    </section>
  );
}
