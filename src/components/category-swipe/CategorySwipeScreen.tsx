import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MenuItem } from "../../data/menu";
import { allMenuItems, categories, itemsByCategory } from "../../data/menu";
import SearchBar from "../SearchBar";
import ProductCard from "../ProductCard";
import MamadiLogo from "../MamadiLogo";
import IfoodHeaderLink from "../IfoodIcon";
import CategorySwipeCard from "./CategorySwipeCard";
import CategoryControls from "./CategoryControls";

interface CategorySwipeScreenProps {
  onBack: () => void;
  onSelectItem: (item: MenuItem) => void;
}

export default function CategorySwipeScreen({
  onBack,
  onSelectItem,
}: CategorySwipeScreenProps) {
  const reducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndexByCategory, setItemIndexByCategory] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState(true);

  const term = search.trim().toLowerCase();

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  const category = categories[categoryIndex];
  const items = itemsByCategory[category.id] ?? [];
  const savedIndex = itemIndexByCategory[category.id] ?? 0;
  const itemIndex = items.length ? Math.min(savedIndex, items.length - 1) : 0;
  const currentItem = items[itemIndex] ?? null;

  const setItemIndex = useCallback((catId: string, index: number) => {
    setItemIndexByCategory((prev) => ({ ...prev, [catId]: index }));
  }, []);

  const nextItem = useCallback(() => {
    if (items.length === 0) return;
    setItemIndex(category.id, Math.min(itemIndex + 1, items.length - 1));
  }, [category.id, itemIndex, items.length, setItemIndex]);

  const prevItem = useCallback(() => {
    if (items.length === 0) return;
    setItemIndex(category.id, Math.max(itemIndex - 1, 0));
  }, [category.id, itemIndex, items.length, setItemIndex]);

  const nextCategory = useCallback(() => {
    setCategoryIndex((i) => Math.min(i + 1, categories.length - 1));
  }, []);

  const prevCategory = useCallback(() => {
    setCategoryIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (term) return;
      const shift = e.shiftKey;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (shift) nextCategory();
        else nextItem();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (shift) prevCategory();
        else prevItem();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [term, nextCategory, prevCategory, nextItem, prevItem]);

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
    <div className="category-swipe-screen">
      <header className="category-swipe-screen__header">
        <button
          type="button"
          onClick={onBack}
          className="category-swipe-screen__back"
        >
          <ArrowLeft className="h-4 w-4" />
          Início
        </button>
        <MamadiLogo variant="header" />
        <IfoodHeaderLink size={22} />
      </header>

      <main className="category-swipe-screen__main">
        <div className="category-swipe-screen__intro">
          <h1 className="category-swipe-screen__title">Escolha sua vibe</h1>
          <p className="category-swipe-screen__subtitle">
            Toque para ver os itens ou deslize para trocar de categoria
          </p>
        </div>

        <div className="category-swipe-screen__search">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {results ? (
          <section className="category-swipe-screen__results">
            <h2 className="mb-4 font-display text-lg font-bold">
              Resultados ({results.length})
            </h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {results.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectItem(item)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-white/45">
                Nenhum item para &ldquo;{search}&rdquo;.
              </p>
            )}
          </section>
        ) : (
          <>
            <div className="category-swipe-screen__card-wrap">
              <CategorySwipeCard
                key={category.id}
                category={category}
                item={currentItem}
                itemIndex={itemIndex}
                itemTotal={items.length}
                categoryIndex={categoryIndex}
                reducedMotion={reducedMotion}
                onPrevItem={prevItem}
                onNextItem={nextItem}
                onPrevCategory={prevCategory}
                onNextCategory={nextCategory}
              />
            </div>

            <CategoryControls
              onPrevCategory={prevCategory}
              onNextCategory={nextCategory}
              onItemDetails={() => currentItem && onSelectItem(currentItem)}
              canPrev={categoryIndex > 0}
              canNext={categoryIndex < categories.length - 1}
              hasItem={Boolean(currentItem)}
            />

            <div className="category-swipe-screen__cat-dots" aria-hidden>
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-label={cat.label}
                  className={`category-swipe-screen__cat-dot${i === categoryIndex ? " is-active" : ""}`}
                  onClick={() => setCategoryIndex(i)}
                />
              ))}
            </div>

            <motion.p
              className="category-swipe-screen__hint"
              animate={{ opacity: showHint ? 1 : 0.35, scale: showHint ? 1 : 0.98 }}
              transition={{ duration: 0.5 }}
            >
              Toque nas laterais para ver os itens · deslize para trocar a categoria
            </motion.p>
          </>
        )}
      </main>
    </div>
  );
}
