import { useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Category, MenuItem } from "../data/menu";
import { allMenuItems, categories, itemsByCategory } from "../data/menu";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import MamadiLogo from "./MamadiLogo";
import IfoodIcon from "./IfoodIcon";

interface CategoriesScreenProps {
  onBack: () => void;
  onOpenCategory: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
}

/** Posição inicial "espalhada" determinística para o efeito de imã. */
function scatterFor(i: number) {
  const dir = i % 2 === 0 ? -1 : 1;
  const x = dir * (320 + ((i * 47) % 200));
  const y = 220 + ((i * 83) % 220);
  const r = (i % 3 === 0 ? -1 : 1) * (18 + ((i * 31) % 34));
  return { x, y, r };
}

function CategoryTile({
  cat,
  count,
  index,
  onOpen,
}: {
  cat: Category;
  count: number;
  index: number;
  onOpen: (id: string) => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), {
    stiffness: 200,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), {
    stiffness: 200,
    damping: 15,
  });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const s = useMemo(() => scatterFor(index), [index]);

  return (
    <motion.button
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => onOpen(cat.id)}
      initial={{ opacity: 0, x: s.x, y: s.y, rotate: s.r, scale: 0.2 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 13,
        mass: 0.8,
        delay: index * 0.07,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        boxShadow: `0 0 40px ${cat.glow}44`,
      }}
      className="rainbow-border relative aspect-square overflow-hidden rounded-2xl max-sm:h-full max-sm:w-auto max-sm:max-w-full max-sm:justify-self-center sm:rounded-3xl"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`}
        style={{ boxShadow: `inset 0 0 70px ${cat.glow}55` }}
      />
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center gap-0.5 p-2 sm:gap-2 sm:p-4"
        style={{ transformStyle: "preserve-3d" }}
      >
        <span
          className="text-2xl drop-shadow-2xl sm:text-6xl"
          style={{ lineHeight: 1, transform: "translateZ(50px)" }}
        >
          {cat.emoji}
        </span>
        <h3
          className="line-clamp-2 text-center font-display text-[10px] font-bold leading-tight text-white drop-shadow-lg sm:line-clamp-none sm:text-lg"
          style={{ transform: "translateZ(30px)" }}
        >
          {cat.label}
        </h3>
        <span
          className="text-[9px] font-medium text-white/85 sm:text-xs"
          style={{ transform: "translateZ(18px)" }}
        >
          {count} itens
        </span>
      </div>
    </motion.button>
  );
}

export default function CategoriesScreen({
  onBack,
  onOpenCategory,
  onSelectItem,
}: CategoriesScreenProps) {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return null;
    return allMenuItems.filter((item) => {
      const catLabel =
        categories.find((c) => c.id === item.category)?.label.toLowerCase() ?? "";
      return (
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        catLabel.includes(term)
      );
    });
  }, [term]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">
      {/* Blobs ambiente */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #AA00FF, transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #2979FF, transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/4 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #FF4081, transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-pride-purple"
          >
            <ArrowLeft className="h-4 w-4" />
            Início
          </button>
          <MamadiLogo variant="header" />
          <IfoodIcon size={24} />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-3 pb-24 pt-3 sm:px-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-center sm:mb-6"
        >
          <h1 className="font-display text-xl font-bold sm:text-4xl">
            Escolha sua vibe
          </h1>
          <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">
            Toque em uma categoria para abrir os itens
          </p>
        </motion.div>

        <div className="mx-auto mb-3 max-w-md sm:mb-8">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {results ? (
          <section>
            <h2 className="mb-5 font-display text-xl font-bold">
              Resultados <span className="text-muted">({results.length})</span>
            </h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {results.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectItem(item)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-muted">
                Nenhum item encontrado para &ldquo;{search}&rdquo;.
              </p>
            )}
          </section>
        ) : (
          <div
            className="grid grid-cols-2 gap-2 max-sm:h-[calc(100svh-12.5rem)] max-sm:grid-rows-4 sm:grid-cols-3 sm:gap-4"
            style={{ perspective: 1200 }}
          >
            {categories.map((cat, i) => (
              <CategoryTile
                key={cat.id}
                cat={cat}
                index={i}
                count={itemsByCategory[cat.id]?.length ?? 0}
                onOpen={onOpenCategory}
              />
            ))}
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
