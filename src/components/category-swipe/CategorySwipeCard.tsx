import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import type { Category, MenuItem } from "../../data/menu";
import { formatPrice } from "../../data/menu";
import { resolveSwipeCardImage } from "../../lib/menuImage";
import ItemProgressBars from "./ItemProgressBars";
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

function priceLabel(item: MenuItem) {
  if (item.priceA != null && item.priceB != null) {
    return `${item.labelA ?? "Opção A"} ${formatPrice(item.priceA)} · ${item.labelB ?? "Opção B"} ${formatPrice(item.priceB)}`;
  }
  if (item.price != null) return formatPrice(item.price);
  return null;
}

export default function CategorySwipeCard({
  category,
  item,
  itemIndex,
  itemTotal,
  reducedMotion,
  onPrevItem,
  onNextItem,
  onPrevCategory,
  onNextCategory,
}: CategorySwipeCardProps) {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-180, 0, 180], reducedMotion ? [0, 0, 0] : [-10, 0, 10]);
  const dragOffset = useRef(0);
  const [tapFlash, setTapFlash] = useState<"left" | "right" | null>(null);

  const imageSrc = resolveSwipeCardImage(item, category);
  const price = item ? priceLabel(item) : null;

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

  return (
    <motion.div
      className="category-swipe-card category-swipe-card-rainbow"
      style={{ x: dragX, rotate }}
      drag={reducedMotion ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.32}
      onDrag={(_, info) => {
        dragOffset.current = info.offset.x;
      }}
      onDragEnd={handleDragEnd}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <div className="category-swipe-card__inner">
        <div className="category-swipe-card__top">
          <ItemProgressBars total={itemTotal} active={itemIndex} />
        </div>

        <div className="category-swipe-card__media">
          <AnimatePresence mode="wait">
            <motion.div
              key={item ? item.id : `cat-${category.id}`}
              className="category-swipe-card__media-layer"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {imageSrc ? (
                <>
                  <img
                    src={imageSrc}
                    alt=""
                    aria-hidden
                    className="category-swipe-card__media-bg"
                    draggable={false}
                  />
                  <img
                    src={imageSrc}
                    alt={item?.name ?? category.label}
                    className="category-swipe-card__media-fg"
                    draggable={false}
                  />
                </>
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
            <p className="category-swipe-card__brand">
              <span className="category-swipe-card__brand-led mamadi-logo">MAMADI FOOD</span>
              <VerifiedBadge />
            </p>

            <h2 className="category-swipe-card__category">{category.label}</h2>

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
                    <h3 className="category-swipe-card__item">{item.name}</h3>
                    <p className="category-swipe-card__desc">{item.description}</p>
                    {price && <p className="category-swipe-card__price">{price}</p>}
                  </>
                ) : (
                  <p className="category-swipe-card__desc">Nenhum item nesta categoria.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <span
            className="category-swipe-card__count"
            aria-label={`${itemTotal} ${itemTotal === 1 ? "opção" : "opções"} nesta categoria`}
          >
            {itemTotal} {itemTotal === 1 ? "opção" : "opções"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
