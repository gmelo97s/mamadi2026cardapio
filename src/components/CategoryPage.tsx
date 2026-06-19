import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Category, MenuItem } from "../data/menu";
import ProductCarousel from "./ProductCarousel";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import IfoodIcon from "./IfoodIcon";

interface CategoryPageProps {
  category: Category;
  items: MenuItem[];
  onBack: () => void;
  onSelect: (item: MenuItem) => void;
}

export default function CategoryPage({
  category,
  items,
  onBack,
  onSelect,
}: CategoryPageProps) {
  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 400], [0, 120]);
  const bannerScale = useTransform(scrollY, [0, 400], [1, 1.15]);
  const emojiY = useTransform(scrollY, [0, 400], [0, -40]);
  const bannerOpacity = useTransform(scrollY, [0, 320], [1, 0.15]);
  const bannerImage = category.coverImage ?? category.cardImage;

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-pride-purple"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <span className="font-display text-base font-bold pride-text">
            {category.emoji} {category.label}
          </span>

          <IfoodIcon size={24} />
        </div>
      </header>

      {/* Banner com parallax */}
      <div
        className="relative flex h-[38vh] items-center justify-center overflow-hidden"
        style={{ perspective: 1000 }}
      >
        {bannerImage ? (
          <motion.img
            src={bannerImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ y: bannerY, scale: bannerScale, opacity: bannerOpacity }}
          />
        ) : (
          <motion.div
            aria-hidden
            className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}
            style={{ y: bannerY, scale: bannerScale, opacity: bannerOpacity }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-bg" />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ y: emojiY }}
          initial={{ opacity: 0, scale: 0.6, rotateX: -25 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ fontSize: 90, lineHeight: 1 }} className="drop-shadow-2xl">
            {category.emoji}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-white drop-shadow-lg">
            {category.label}
          </h1>
          <p className="mt-1 text-sm font-medium text-white/80">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </p>
        </motion.div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        {/* Carrossel 3D em destaque */}
        <section className="-mt-4">
          <ProductCarousel items={items} onSelect={onSelect} />
        </section>

        {/* Grade completa com entrada 3D escalonada */}
        <section className="mt-10">
          <h2 className="mb-5 font-display text-lg font-bold text-muted">
            Todos os itens
          </h2>
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            style={{ perspective: 1300 }}
          >
            {items.map((item, i) => {
              const fromLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: fromLeft ? -120 : 120,
                    y: 80,
                    rotateY: fromLeft ? -35 : 35,
                    rotateX: -14,
                    scale: 0.7,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotateY: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 16,
                    mass: 0.8,
                    delay: (i % 4) * 0.07,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ProductCard item={item} onClick={() => onSelect(item)} />
                </motion.div>
              );
            })}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
