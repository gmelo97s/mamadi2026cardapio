import type { Category } from "../../data/menu";
import { itemsByCategory } from "../../data/menu";
import { resolveExploreCategoryImage } from "../../lib/menuImage";
import ExploreTileCard from "./ExploreTileCard";

interface ExploreCategoriesScreenProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

function formatExploreCount(count: number): string {
  if (count >= 1000) {
    const thousands = count / 1000;
    const rounded =
      Math.round(thousands * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded} mil` : `${rounded.toString().replace(".", ",")} mil`;
  }
  return String(count);
}

export default function ExploreCategoriesScreen({
  categories,
  onSelectCategory,
}: ExploreCategoriesScreenProps) {
  return (
    <section className="explore-screen" aria-label="Explorar categorias">
      <h1 className="explore-screen__title">Explorar</h1>
      <div className="explore-screen__grid">
        {categories.map((category) => {
          const count = (itemsByCategory[category.id] ?? []).length;
          return (
            <ExploreTileCard
              key={category.id}
              title={category.label}
              meta={formatExploreCount(count)}
              imageSrc={resolveExploreCategoryImage(category)}
              emojiFallback={category.emoji}
              onClick={() => onSelectCategory(category.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
