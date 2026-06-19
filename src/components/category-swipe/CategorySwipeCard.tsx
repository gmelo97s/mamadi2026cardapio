import { useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import type { Category, MenuItem } from "../../data/menu";
import { formatPrice } from "../../data/menu";
import ItemProgressBars from "./ItemProgressBars";
import VerifiedBadge from "./VerifiedBadge";

const SWIPE_THRESHOLD = 96;
const TAP_DRAG_MAX = 14;

interface CategorySwipeCardProps {
  category: Category;
  item: MenuItem | null;
  itemIndex: number;
  itemTotal: number;
  categoryIndex: number;
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
  categoryIndex,
  reducedMotion,
  onPrevItem,
  onNextItem,
  onPrevCategory,
  onNextCategory,
}: CategorySwipeCardProps) {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-180, 0, 180], reducedMotion ? [0, 0, 0] : [-10, 0, 10]);
  const dragOffset = useRef(0);

  const imageSrc = item?.image ?? category.cardImage ?? category.coverImage;

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
          <div className="category-swipe-card__pills">
            <span className="category-swipe-card__pill">
              {category.emoji} {itemTotal} itens
            </span>
            <span className="category-swipe-card__pill category-swipe-card__pill--index">
              {String(categoryIndex + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="category-swipe-card__media">
          <AnimatePresence mode="wait">
            <motion.div
              key={item ? item.id : `cat-${category.id}`}
              className="category-swipe-card__media-layer"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={item?.name ?? category.label}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div
                  className={`h-full w-full bg-gradient-to-br ${category.gradient}`}
                  style={{ boxShadow: `inset 0 0 80px ${category.glow}44` }}
                />
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
        </div>

        <div className="category-swipe-card__dock">
          <div className="category-swipe-card__dock-head">
            <p className="category-swipe-card__brand">
              Mamadi Food
              <VerifiedBadge />
            </p>
            <h2 className="category-swipe-card__category">{category.label}</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item?.id ?? "empty"}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              {item ? (
                <>
                  <h3 className="category-swipe-card__item">{item.name}</h3>
                  <p className="category-swipe-card__desc">{item.description}</p>
                  {priceLabel(item) && (
                    <p className="category-swipe-card__price">{priceLabel(item)}</p>
                  )}
                  {item.badge && (
                    <span className="category-swipe-card__badge">{item.badge}</span>
                  )}
                </>
              ) : (
                <p className="category-swipe-card__desc">Nenhum item nesta categoria.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
