import { useState } from "react";
import type { Category, MenuItem } from "../../data/menu";
import { resolveProductImageClasses, resolveSwipeCardImage, resolveSwipeProductImageStyle } from "../../lib/menuImage";
import { applyDeckCalibration } from "../../lib/menuDeckCalibration";
import { useTitleFitTier } from "../../hooks/useTitleFitTier";
import MenuArtFallback from "./MenuArtFallback";
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
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = resolveSwipeCardImage(item, category);
  const showImage = imageSrc != null && failedSrc !== imageSrc;
  const priceValue = primaryPriceValue(item);
  const titleLabel = `${item.name}${priceValue != null ? `, ${priceValue}` : ""}`;
  const { ref: titleRef, tier: titleFitTier } = useTitleFitTier(titleLabel);

  return (
    <button type="button" className="search-result-card" onClick={onClick}>
      <div className="search-result-card__media">
        {showImage ? (
          <img
            src={imageSrc}
            alt={item.name}
            className={resolveProductImageClasses(applyDeckCalibration(item), "search-result-card__image")}
            style={resolveSwipeProductImageStyle(item)}
            loading="lazy"
            decoding="async"
            onError={() => setFailedSrc(imageSrc)}
          />
        ) : (
          <MenuArtFallback category={category} variant="result" />
        )}
        <div className="search-result-card__shade" aria-hidden />
        <div className="search-result-card__dock">
          <h3 className="search-result-card__title" data-title-fit={titleFitTier}>
            <span ref={titleRef} className="search-result-card__title-text">
              <span className="search-result-card__title-name">{item.name}</span>
              <span className="search-result-card__title-meta">
                {priceValue != null && (
                  <span className="search-result-card__title-price">, {priceValue}</span>
                )}
                <VerifiedBadge size="xs" />
              </span>
            </span>
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
