import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { Home } from "lucide-react";
import type { MenuItem } from "../../data/menu";
import { allMenuItems, categories, itemsByCategory } from "../../data/menu";
import { searchMenuItems } from "../../lib/menuSearch";
import SearchBar from "../SearchBar";
import ProductCard from "../ProductCard";
import CategorySwipeCard from "./CategorySwipeCard";
import CategoryControls from "./CategoryControls";
import CategoryFooterLinks from "./CategoryFooterLinks";
import CardMicroHint from "./CardMicroHint";
import NavigationOnboardingOverlay, {
  hasSeenCategoryOnboarding,
  ONBOARDING_KEY,
} from "./NavigationOnboardingOverlay";

interface CategorySwipeScreenProps {
  onBack: () => void;
}

export default function CategorySwipeScreen({ onBack }: CategorySwipeScreenProps) {
  const reducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndexByCategory, setItemIndexByCategory] = useState<Record<string, number>>({});
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenCategoryOnboarding());

  const searchResult = useMemo(
    () => searchMenuItems(search, allMenuItems, categories),
    [search]
  );

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding((current) => {
      if (!current) return current;
      localStorage.setItem(ONBOARDING_KEY, "1");
      return false;
    });
  }, []);

  const handleOnboardingInteraction = useCallback(() => {
    if (showOnboarding) dismissOnboarding();
  }, [showOnboarding, dismissOnboarding]);

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
      if (searchResult.kind !== "idle") return;
      if (showOnboarding) dismissOnboarding();
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
  }, [searchResult.kind, showOnboarding, dismissOnboarding, nextCategory, prevCategory, nextItem, prevItem]);

  const selectItemFromSearch = useCallback((item: MenuItem) => {
    const catIdx = categories.findIndex((c) => c.id === item.category);
    if (catIdx < 0) return;

    const categoryItems = itemsByCategory[item.category] ?? [];
    const itemIdx = categoryItems.findIndex((i) => i.id === item.id);

    setCategoryIndex(catIdx);
    if (itemIdx >= 0) {
      setItemIndexByCategory((prev) => ({ ...prev, [item.category]: itemIdx }));
    }
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isSearching = searchResult.kind !== "idle";

  const onboardingActive = showOnboarding && searchResult.kind === "idle";

  return (
    <div
      className="category-swipe-screen"
      onPointerDownCapture={onboardingActive ? handleOnboardingInteraction : undefined}
    >
      <header className="category-swipe-screen__header">
        <div className="category-swipe-screen__search-header">
          <SearchBar
            variant="header"
            value={search}
            onChange={setSearch}
            placeholder="Buscar..."
          />
        </div>
      </header>

      <AnimatePresence>
        {onboardingActive && (
          <NavigationOnboardingOverlay
            reducedMotion={reducedMotion}
            onDismiss={dismissOnboarding}
          />
        )}
      </AnimatePresence>

      <main
        className={`category-swipe-screen__main${isSearching ? " category-swipe-screen__main--search" : ""}`}
      >
        {searchResult.kind === "matches" && (
          <section className="category-swipe-screen__results">
            <h2 className="mb-4 font-display text-lg font-bold">
              Resultados ({searchResult.items.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {searchResult.items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onClick={() => selectItemFromSearch(item)}
                />
              ))}
            </div>
          </section>
        )}

        {searchResult.kind === "suggestions" && (
          <section className="category-swipe-screen__results">
            <p className="mb-2 text-center text-sm text-white/55">
              Nenhum item com esse nome exato.
            </p>
            <h2 className="mb-4 text-center font-display text-lg font-bold">
              Você quis dizer...?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {searchResult.items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onClick={() => selectItemFromSearch(item)}
                />
              ))}
            </div>
          </section>
        )}

        {searchResult.kind === "empty" && (
          <section className="category-swipe-screen__results">
            <p className="py-12 text-center text-white/45">
              Nenhum item para &ldquo;{searchResult.query}&rdquo;.
            </p>
          </section>
        )}

        {searchResult.kind === "idle" && (
          <div className="category-swipe-screen__deck">
            <div className="category-swipe-screen__card-wrap">
              <CategorySwipeCard
                key={category.id}
                category={category}
                item={currentItem}
                itemIndex={itemIndex}
                itemTotal={items.length}
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
              canPrev={categoryIndex > 0}
              canNext={categoryIndex < categories.length - 1}
              microHint={
                !showOnboarding ? (
                  <CardMicroHint reducedMotion={reducedMotion} />
                ) : null
              }
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

            <CategoryFooterLinks />
          </div>
        )}
      </main>

      <button
        type="button"
        onClick={onBack}
        className="category-swipe-screen__back category-swipe-screen__back--floating"
        aria-label="Início"
      >
        <Home className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}
