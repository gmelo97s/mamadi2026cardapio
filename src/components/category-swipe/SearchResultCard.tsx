import type { Category, MenuItem } from "../../data/menu";
import { resolveProductImageClasses, resolveSwipeCardImage } from "../../lib/menuImage";
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
            className={resolveProductImageClasses(item, "search-result-card__image")}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="search-result-card__media-black" aria-hidden />
        )}
        <div className="search-result-card__shade" aria-hidden />
        <div className="search-result-card__dock">
          <h3 className="search-result-card__title">
            <span className="search-result-card__title-text">
              {item.name}
              {priceValue != null && (
                <span className="search-result-card__title-price">, {priceValue}</span>
              )}
            </span>
            <VerifiedBadge size="xs" />
          </h3>
          <p className="search-result-card__brand">
            <span className="search-result-card__brand-text">{category.label}</span>
          </p>
          <p className="search-result-card__desc">{item.description}</p>
        </div>
      </div>
    </button>
  );
}
