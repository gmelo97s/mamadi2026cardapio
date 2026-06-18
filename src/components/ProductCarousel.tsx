import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuItem } from "../data/menu";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
}

const CARD_WIDTH = 280;
const SIDE_OFFSET = 168;

export default function ProductCarousel({ items, onSelect }: ProductCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = items.length;

  if (n === 0) return null;

  const go = (dir: number) => setIndex((p) => (p + dir + n) % n);

  return (
    <div className="relative w-full">
      <div
        className="relative mx-auto h-[440px] w-full max-w-3xl"
        style={{ perspective: 1500 }}
      >
        {items.map((item, i) => {
          let offset = i - index;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          if (Math.abs(offset) > 1) return null;

          const isCenter = offset === 0;

          return (
            <motion.div
              key={item.id}
              className="absolute top-0"
              style={{ left: "50%", width: CARD_WIDTH, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.4, y: 160, rotateY: 0 }}
              animate={{
                x: offset * SIDE_OFFSET - CARD_WIDTH / 2,
                y: 0,
                scale: isCenter ? 1 : 0.82,
                rotateY: offset * -24,
                z: isCenter ? 80 : -160,
                opacity: isCenter ? 1 : 0.55,
                zIndex: isCenter ? 30 : 10,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
            >
              <ProductCard
                item={item}
                onClick={() => (isCenter ? onSelect(item) : setIndex(i))}
              />
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Produto anterior"
        className="absolute left-1 top-[180px] z-40 rounded-full bg-surface/80 p-2 text-text backdrop-blur-sm transition-colors hover:bg-surface"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Próximo produto"
        className="absolute right-1 top-[180px] z-40 rounded-full bg-surface/80 p-2 text-text backdrop-blur-sm transition-colors hover:bg-surface"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-2 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setIndex(i)}
            aria-label={`Ir para ${item.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-pride-pink" : "w-1.5 bg-border hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
