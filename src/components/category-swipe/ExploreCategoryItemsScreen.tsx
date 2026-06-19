import { ChevronLeft } from "lucide-react";
import type { Category, MenuItem } from "../../data/menu";
import { formatPrice } from "../../data/menu";
import { resolveExploreItemImage } from "../../lib/menuImage";
import ExploreTileCard from "./ExploreTileCard";

interface ExploreCategoryItemsScreenProps {
  category: Category;
  items: MenuItem[];
  onBack: () => void;
  onSelectItem: (item: MenuItem) => void;
}

function itemExploreMeta(item: MenuItem): string {
  if (item.priceA != null && item.priceB != null) {
    return formatPrice(Math.min(item.priceA, item.priceB));
  }
  return formatPrice(item.price ?? item.priceA ?? 0);
}

export default function ExploreCategoryItemsScreen({
  category,
  items,
  onBack,
  onSelectItem,
}: ExploreCategoryItemsScreenProps) {
  return (
    <section className="explore-screen" aria-label={`Itens de ${category.label}`}>
      <header className="explore-screen__subheader">
        <button
          type="button"
          className="explore-screen__back"
          onClick={onBack}
          aria-label="Voltar às categorias"
        >
          <ChevronLeft size={28} strokeWidth={2.25} />
        </button>
        <h1 className="explore-screen__title explore-screen__title--inline">
          {category.label}
        </h1>
      </header>
      <div className="explore-screen__grid">
        {items.map((item) => (
          <ExploreTileCard
            key={item.id}
            title={item.name}
            meta={itemExploreMeta(item)}
            imageSrc={resolveExploreItemImage(item)}
            emojiFallback={category.emoji}
            onClick={() => onSelectItem(item)}
          />
        ))}
      </div>
    </section>
  );
}
