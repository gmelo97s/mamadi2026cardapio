import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import type { Category, MenuItem } from "../../data/menu";
import { formatPrice, SUPER_LIKE_CATEGORY_ID } from "../../data/menu";
import { isCustomMenuImage, resolveSwipeCardImage } from "../../lib/menuImage";
import VerifiedBadge from "./VerifiedBadge";

const SWIPE_THRESHOLD = 96;
const TAP_DRAG_MAX = 14;

interface CategorySwipeCardProps {
  category: Category;
  item: MenuItem | null;
  itemIndex: number;
  itemTotal: number;
  reducedMotion: boolean | null;
  onPrevItem: () => void;
  onNextItem: () => void;
  onPrevCategory: () => void;
  onNextCategory: () => void;
}

function primaryPriceValue(item: MenuItem): number | null {
  if (item.price != null) return item.price;
  if (item.priceA != null) return item.priceA;
  return null;
}

export default function CategorySwipeCard({
  category,
  item,
  reducedMotion,
  onPrevItem,
  onNextItem,
  onPrevCategory,
  onNextCategory,
}: CategorySwipeCardProps) {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-180, 0, 180], reducedMotion ? [0, 0, 0] : [-6, 0, 6]);
  const dragOffset = useRef(0);
  const [tapFlash, setTapFlash] = useState<"left" | "right" | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const imageSrc = resolveSwipeCardImage(item, category);
  const hasDouble = item != null && item.priceA != null && item.priceB != null;
  const priceValue = item ? primaryPriceValue(item) : null;

  useEffect(() => {
    setShowOptions(false);
  }, [item?.id]);

  const flashSide = (side: "left" | "right") => {
    if (reducedMotion) return;
    setTapFlash(side);
    window.setTimeout(() => setTapFlash(null), 300);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    dragOffset.current = info.offset.x;
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_THRESHOLD || velocity.x < -650) {
      onNextCategory();
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > 650) {
      onPrevCategory();
    }
    dragX.set(0);
    window.setTimeout(() => {
      dragOffset.current = 0;
    }, 80);
  };

  const tryTapZone = (side: "left" | "right") => {
    if (Math.abs(dragOffset.current) > TAP_DRAG_MAX) return;
    flashSide(side);
    if (side === "left") onPrevItem();
    else onNextItem();
  };

  const isSecretCard = category.id === SUPER_LIKE_CATEGORY_ID;

  return (
    <motion.div
      className={`category-swipe-card${isSecretCard ? " category-swipe-card--secret" : ""}`}
      style={{ x: dragX, rotate }}
      drag={reducedMotion ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.32}
      onDrag={(_, info) => {
        dragOffset.current = info.offset.x;
      }}
      onDragEnd={handleDragEnd}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="category-swipe-card__inner">
        <div className="category-swipe-card__media">
          <AnimatePresence mode="wait">
            <motion.div
              key={item ? item.id : `cat-${category.id}`}
              className="category-swipe-card__media-layer"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={item?.name ?? category.label}
                  className={`category-swipe-card__media-cover${
                    isCustomMenuImage(imageSrc)
                      ? " category-swipe-card__media-cover--product"
                      : ""
                  }`}
                  draggable={false}
                />
              ) : (
                <div className="category-swipe-card__media-black" aria-hidden />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="category-swipe-card__shade" aria-hidden />

          <button
            type="button"
            className="category-swipe-card__tap category-swipe-card__tap--left"
            aria-label="Item anterior"
            onClick={() => tryTapZone("left")}
          />
          <button
            type="button"
            className="category-swipe-card__tap category-swipe-card__tap--right"
            aria-label="Próximo item"
            onClick={() => tryTapZone("right")}
          />

          <AnimatePresence>
            {tapFlash && (
              <motion.div
                key={tapFlash}
                className={`tap-flash tap-flash--${tapFlash}`}
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              >
                <span className="tap-flash__ring" />
                <span className="tap-flash__glyph">
                  {tapFlash === "right" ? "›" : "‹"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="category-swipe-card__dock">
            <AnimatePresence mode="wait">
              <motion.div
                key={item?.id ?? "empty"}
                className="category-swipe-card__item-block"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
              >
                {item ? (
                  <>
                    <h2 className="category-swipe-card__title">
                      {item.name}
                      {priceValue != null && (
                        <span className="category-swipe-card__title-price">, {priceValue}</span>
                      )}
                    </h2>

                    <p className="category-swipe-card__brand">
                      <span className="category-swipe-card__brand-led" aria-label={category.label}>
                        {category.label.split("").map((char, index) => (
                          <span
                            key={`${char}-${index}`}
                            className="category-swipe-card__brand-led-char"
                            style={{ animationDelay: `${index * 0.09}s` }}
                            aria-hidden
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        ))}
                      </span>
                      <VerifiedBadge size="md" variant={isSecretCard ? "gold" : "blue"} />
                    </p>

                    <p className="category-swipe-card__desc">{item.description}</p>

                    {hasDouble && (
                      <>
                        <button
                          type="button"
                          className="category-swipe-card__options-btn"
                          onClick={() => setShowOptions((v) => !v)}
                          aria-expanded={showOptions}
                        >
                          Opções disponíveis
                        </button>
                        {showOptions && (
                          <div className="category-swipe-card__options-list">
                            <p>
                              {item.labelA ?? "Opção A"}: {formatPrice(item.priceA!)}
                            </p>
                            <p>
                              {item.labelB ?? "Opção B"}: {formatPrice(item.priceB!)}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <p className="category-swipe-card__desc">Nenhum item nesta categoria.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
