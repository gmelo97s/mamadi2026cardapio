import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, Home } from "lucide-react";
import type { MenuItem } from "../../data/menu";
import { allMenuItems, categories, itemsByCategory } from "../../data/menu";
import { getExploreSection } from "../../data/exploreSections";
import { searchMenuItems } from "../../lib/menuSearch";
import SearchBar from "../SearchBar";
import CategorySwipeCard from "./CategorySwipeCard";
import ItemProgressBars from "./ItemProgressBars";
import SwipeActionButtons from "./SwipeActionButtons";
import CategoryBottomNav, { type CategoryNavTab } from "./CategoryBottomNav";
import ExploreSectionsScreen from "./ExploreSectionsScreen";
import MenuPreviewScreen from "./MenuPreviewScreen";
import SearchResultCard from "./SearchResultCard";
import NavigationOnboardingOverlay, {
  hasSeenCategoryOnboarding,
  ONBOARDING_KEY,
} from "./NavigationOnboardingOverlay";

interface CategorySwipeScreenProps {
  onBack: () => void;
}

const COMBOS_CATEGORY_ID = "combos";

export default function CategorySwipeScreen({ onBack }: CategorySwipeScreenProps) {
  const reducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [previewSearch, setPreviewSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuPreviewOpen, setMenuPreviewOpen] = useState(false);
  const [mainTab, setMainTab] = useState<CategoryNavTab>("swipe");
  const [categoryFilterIds, setCategoryFilterIds] = useState<string[] | null>(null);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndexByCategory, setItemIndexByCategory] = useState<Record<string, number>>({});
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenCategoryOnboarding());

  const activeCategories = useMemo(() => {
    if (!categoryFilterIds) return categories;
    return categories.filter((category) => categoryFilterIds.includes(category.id));
  }, [categoryFilterIds]);

  const combosCount = (itemsByCategory[COMBOS_CATEGORY_ID] ?? []).length;

  const searchResult = useMemo(
    () => searchMenuItems(search, allMenuItems, categories),
    [search],
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

  const category = activeCategories[categoryIndex] ?? activeCategories[0];
  const items = category ? itemsByCategory[category.id] ?? [] : [];
  const savedIndex = category ? itemIndexByCategory[category.id] ?? 0 : 0;
  const itemIndex = items.length ? Math.min(savedIndex, items.length - 1) : 0;
  const currentItem = items[itemIndex] ?? null;

  const setItemIndex = useCallback((catId: string, index: number) => {
    setItemIndexByCategory((prev) => ({ ...prev, [catId]: index }));
  }, []);

  const closeOverlays = useCallback(() => {
    setSearch("");
    setPreviewSearch("");
    setSearchOpen(false);
    setMenuPreviewOpen(false);
  }, []);

  const goToSwipeHome = useCallback(() => {
    setMainTab("swipe");
    setCategoryFilterIds(null);
    setCategoryIndex(0);
    setItemIndexByCategory({});
    closeOverlays();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeOverlays]);

  const goToExplore = useCallback(() => {
    setMainTab("explore");
    setCategoryFilterIds(null);
    closeOverlays();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeOverlays]);

  const toggleSearch = useCallback(() => {
    setSearchOpen((open) => {
      if (open) {
        setSearch("");
        return false;
      }
      setMenuPreviewOpen(false);
      return true;
    });
  }, []);

  const toggleMenuPreview = useCallback(() => {
    setMenuPreviewOpen((open) => {
      if (open) {
        setPreviewSearch("");
        return false;
      }
      setSearch("");
      setSearchOpen(false);
      return true;
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const selectExploreSection = useCallback((sectionId: string) => {
    const section = getExploreSection(sectionId);
    if (!section) return;

    setMainTab("swipe");
    setCategoryFilterIds(section.categoryIds);
    setCategoryIndex(0);
    setItemIndexByCategory({});
    closeOverlays();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeOverlays]);

  const nextItem = useCallback(() => {
    if (!category || items.length === 0) return;
    setItemIndex(category.id, Math.min(itemIndex + 1, items.length - 1));
  }, [category, itemIndex, items.length, setItemIndex]);

  const prevItem = useCallback(() => {
    if (!category || items.length === 0) return;
    setItemIndex(category.id, Math.max(itemIndex - 1, 0));
  }, [category, itemIndex, items.length, setItemIndex]);

  const nextCategory = useCallback(() => {
    setCategoryIndex((index) => Math.min(index + 1, activeCategories.length - 1));
  }, [activeCategories.length]);

  const prevCategory = useCallback(() => {
    setCategoryIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goToCombos = useCallback(() => {
    const idx = activeCategories.findIndex((c) => c.id === COMBOS_CATEGORY_ID);
    if (idx < 0) return;
    setCategoryIndex(idx);
    setItemIndex(COMBOS_CATEGORY_ID, 0);
  }, [activeCategories, setItemIndex]);

  const openItemInSwipe = useCallback((item: MenuItem) => {
    const catIdx = categories.findIndex((c) => c.id === item.category);
    if (catIdx < 0) return;

    const categoryItems = itemsByCategory[item.category] ?? [];
    const itemIdx = categoryItems.findIndex((i) => i.id === item.id);

    setMainTab("swipe");
    setCategoryFilterIds(null);
    setCategoryIndex(catIdx);
    if (itemIdx >= 0) {
      setItemIndexByCategory((prev) => ({ ...prev, [item.category]: itemIdx }));
    }
    closeOverlays();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeOverlays]);

  useEffect(() => {
    if (categoryIndex >= activeCategories.length) {
      setCategoryIndex(Math.max(0, activeCategories.length - 1));
    }
  }, [activeCategories.length, categoryIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mainTab !== "swipe" || searchResult.kind !== "idle" || searchOpen || menuPreviewOpen) {
        return;
      }
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
  }, [
    mainTab,
    searchOpen,
    menuPreviewOpen,
    searchResult.kind,
    showOnboarding,
    dismissOnboarding,
    nextCategory,
    prevCategory,
    nextItem,
    prevItem,
  ]);

  const isSearching = searchOpen && searchResult.kind !== "idle";
  const isPanelOpen = isSearching || menuPreviewOpen;
  const isSwipeDeck =
    mainTab === "swipe" && !isPanelOpen && category != null;
  const onboardingActive = showOnboarding && isSwipeDeck;

  return (
    <div
      className={`category-swipe-screen${isSwipeDeck ? " category-swipe-screen--deck" : ""}${
        mainTab === "explore" ? " category-swipe-screen--explore" : ""
      }${searchOpen ? " category-swipe-screen--search-open" : ""}${
        menuPreviewOpen ? " category-swipe-screen--menu-preview" : ""
      }${isPanelOpen ? " category-swipe-screen--panel-open" : ""}`}
      onPointerDownCapture={onboardingActive ? handleOnboardingInteraction : undefined}
    >
      <button
        type="button"
        className="category-swipe-screen__corner-btn category-swipe-screen__corner-btn--left"
        onClick={onBack}
        aria-label="Início"
      >
        <Home size={17} strokeWidth={1.75} fill="none" />
      </button>

      <button
        type="button"
        className={`category-swipe-screen__corner-btn category-swipe-screen__corner-btn--right${
          menuPreviewOpen ? " category-swipe-screen__corner-btn--active" : ""
        }`}
        onClick={toggleMenuPreview}
        aria-label={menuPreviewOpen ? "Fechar visualização do cardápio" : "Visualizar cardápio"}
        aria-pressed={menuPreviewOpen}
      >
        <Eye size={17} strokeWidth={1.75} />
      </button>

      <AnimatePresence>
        {(searchOpen || menuPreviewOpen) && (
          <motion.header
            className={`category-swipe-screen__header category-swipe-screen__header--search${
              menuPreviewOpen ? " category-swipe-screen__header--search-fixed" : ""
            }`}
            initial={reducedMotion ? false : { opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="category-swipe-screen__header-center">
              <div className="category-swipe-screen__search-header">
                <SearchBar
                  variant="header"
                  value={menuPreviewOpen ? previewSearch : search}
                  onChange={menuPreviewOpen ? setPreviewSearch : setSearch}
                  placeholder="Buscar..."
                  autoFocus={searchOpen}
                />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {!searchOpen && !menuPreviewOpen && mainTab === "swipe" && isSwipeDeck && items.length > 0 && (
        <header className="category-swipe-screen__header category-swipe-screen__header--progress">
          <div className="category-swipe-screen__header-center">
            <div className="category-swipe-screen__progress">
              <ItemProgressBars total={items.length} active={itemIndex} />
            </div>
          </div>
        </header>
      )}

      <AnimatePresence>
        {onboardingActive && (
          <NavigationOnboardingOverlay
            reducedMotion={reducedMotion}
            onDismiss={dismissOnboarding}
          />
        )}
      </AnimatePresence>

      <main
        className={`category-swipe-screen__main${
          isPanelOpen ? " category-swipe-screen__main--panel" : ""
        }${
          mainTab === "explore" && !isPanelOpen
            ? " category-swipe-screen__main--explore"
            : ""
        }`}
      >
        {mainTab === "explore" && !isPanelOpen && (
          <ExploreSectionsScreen onSelectSection={selectExploreSection} />
        )}

        {isPanelOpen && (
          <div className="category-swipe-screen__panel-scroll">
            {menuPreviewOpen && (
              <MenuPreviewScreen
                categories={categories}
                itemsByCategory={itemsByCategory}
                filterQuery={previewSearch}
                reducedMotion={reducedMotion}
                onSelectItem={openItemInSwipe}
              />
            )}

            {!menuPreviewOpen && isSearching && searchResult.kind === "matches" && (
              <section className="category-swipe-screen__results category-swipe-screen__results--cards">
                <h2 className="category-swipe-screen__results-title">
                  Resultados ({searchResult.items.length})
                </h2>
                <div className="search-results-list">
                  {searchResult.items.map((item) => {
                    const itemCategory = categories.find((c) => c.id === item.category);
                    if (!itemCategory) return null;
                    return (
                      <SearchResultCard
                        key={item.id}
                        item={item}
                        category={itemCategory}
                        onClick={() => openItemInSwipe(item)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {!menuPreviewOpen && isSearching && searchResult.kind === "suggestions" && (
              <section className="category-swipe-screen__results category-swipe-screen__results--cards">
                <p className="category-swipe-screen__results-hint">
                  Nenhum item com esse nome exato.
                </p>
                <h2 className="category-swipe-screen__results-title">Você quis dizer...?</h2>
                <div className="search-results-list">
                  {searchResult.items.map((item) => {
                    const itemCategory = categories.find((c) => c.id === item.category);
                    if (!itemCategory) return null;
                    return (
                      <SearchResultCard
                        key={item.id}
                        item={item}
                        category={itemCategory}
                        onClick={() => openItemInSwipe(item)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {!menuPreviewOpen && isSearching && searchResult.kind === "empty" && (
              <section className="category-swipe-screen__results category-swipe-screen__results--cards">
                <p className="py-12 text-center text-white/45">
                  Nenhum item para &ldquo;{searchResult.query}&rdquo;.
                </p>
              </section>
            )}
          </div>
        )}

        {isSwipeDeck && category && (
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
          </div>
        )}
      </main>

      {isSwipeDeck && (
        <SwipeActionButtons
          onReject={prevCategory}
          onLike={nextCategory}
          onSuperLike={goToCombos}
          canReject={categoryIndex > 0}
          canLike={categoryIndex < activeCategories.length - 1}
          combosCount={combosCount}
        />
      )}

      <CategoryBottomNav
        activeTab={mainTab}
        searchActive={searchOpen}
        onSwipe={goToSwipeHome}
        onExplore={goToExplore}
        onSearch={toggleSearch}
      />
    </div>
  );
}
