import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Category, MenuItem } from "../../data/menu";
import { allMenuItems } from "../../data/menu";
import { searchMenuItems, type MenuSearchResult } from "../../lib/menuSearch";
import SearchResultCard from "./SearchResultCard";

interface MenuPreviewScreenProps {
  categories: Category[];
  itemsByCategory: Record<string, MenuItem[]>;
  filterQuery: string;
  reducedMotion: boolean | null;
  onSelectItem: (item: MenuItem) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
};

function buildPreviewSections(
  categories: Category[],
  itemsByCategory: Record<string, MenuItem[]>,
  searchResult: MenuSearchResult,
) {
  if (searchResult.kind === "idle") {
    return categories
      .map((category) => ({
        category,
        items: itemsByCategory[category.id] ?? [],
      }))
      .filter((section) => section.items.length > 0);
  }

  if (searchResult.kind === "empty") {
    return [];
  }

  const matchedIds = new Set(searchResult.items.map((item) => item.id));
  return categories
    .map((category) => ({
      category,
      items: (itemsByCategory[category.id] ?? []).filter((item) => matchedIds.has(item.id)),
    }))
    .filter((section) => section.items.length > 0);
}

export default function MenuPreviewScreen({
  categories,
  itemsByCategory,
  filterQuery,
  reducedMotion,
  onSelectItem,
}: MenuPreviewScreenProps) {
  const searchResult = useMemo(
    () => searchMenuItems(filterQuery, allMenuItems, categories),
    [filterQuery, categories],
  );

  const sections = useMemo(
    () => buildPreviewSections(categories, itemsByCategory, searchResult),
    [categories, itemsByCategory, searchResult],
  );

  const isFiltering = searchResult.kind !== "idle";
  let cardDelay = 0;

  return (
    <section className="menu-preview-screen" aria-label="Visualizar cardápio completo">
      <motion.h1
        className="menu-preview-screen__title"
        initial={reducedMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        Cardápio
      </motion.h1>

      {searchResult.kind === "matches" && (
        <p className="menu-preview-screen__hint">
          {searchResult.items.length} resultado
          {searchResult.items.length === 1 ? "" : "s"}
        </p>
      )}

      {searchResult.kind === "suggestions" && (
        <p className="menu-preview-screen__hint">
          Nenhum item com esse nome exato. Você quis dizer...?
        </p>
      )}

      {searchResult.kind === "empty" && (
        <p className="menu-preview-screen__empty">
          Nenhum item para &ldquo;{searchResult.query}&rdquo;.
        </p>
      )}

      <div className="menu-preview-screen__sections">
        {sections.map((section) => {
          const sectionDelay = cardDelay;
          cardDelay += isFiltering ? 0.03 : 0.06;

          return (
            <motion.section
              key={section.category.id}
              className="menu-preview-section"
              initial={reducedMotion || isFiltering ? false : "hidden"}
              animate="visible"
              variants={sectionVariants}
              transition={{ delay: sectionDelay }}
            >
              <h2 className="menu-preview-section__title">{section.category.label}</h2>
              <div className="search-results-list">
                {section.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={reducedMotion || isFiltering ? false : "hidden"}
                    animate="visible"
                    variants={cardVariants}
                    transition={{
                      delay: sectionDelay + 0.04 + index * (isFiltering ? 0.02 : 0.035),
                    }}
                  >
                    <SearchResultCard
                      item={item}
                      category={section.category}
                      onClick={() => onSelectItem(item)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </section>
  );
}
