import type { Category, MenuItem } from "../../data/menu";
import { isCustomMenuImage, resolveSwipeCardImage } from "../../lib/menuImage";
import VerifiedBadge from "./VerifiedBadge";

interface SearchResultCardProps {
  item: MenuItem;
  category: Category;
  onClick: () => void;
}

function primaryPriceValue(item: MenuItem): number | null {
  if (item.price != null) return item.price;
  if (item.priceA != null) return item.priceA;
  return null;
}

export default function SearchResultCard({ item, category, onClick }: SearchResultCardProps) {
  const imageSrc = resolveSwipeCardImage(item, category);
  const priceValue = primaryPriceValue(item);

  return (
    <button type="button" className="search-result-card" onClick={onClick}>
      <div className="search-result-card__media">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className={`search-result-card__image${
              isCustomMenuImage(imageSrc) ? " search-result-card__image--product" : ""
            }`}
            loading="lazy"
          />
        ) : (
          <div className="search-result-card__media-black" aria-hidden />
        )}
        <div className="search-result-card__shade" aria-hidden />
        <div className="search-result-card__dock">
          <h3 className="search-result-card__title">
            {item.name}
            {priceValue != null && (
              <span className="search-result-card__title-price">, {priceValue}</span>
            )}
          </h3>
          <p className="search-result-card__brand">
            <span className="search-result-card__brand-text">{category.label}</span>
            <VerifiedBadge size="sm" />
          </p>
          <p className="search-result-card__desc">{item.description}</p>
        </div>
      </div>
    </button>
  );
}
