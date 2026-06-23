import type { MenuItem } from "../data/menu";
import { formatPrice } from "../data/menu";
import { resolveProductCardImage, resolveProductImageClasses } from "../lib/menuImage";

interface ProductCardProps {
  item: MenuItem;
  onClick?: () => void;
}

export default function ProductCard({ item, onClick }: ProductCardProps) {
  const hasDouble = item.priceA != null && item.priceB != null;
  const imageSrc = resolveProductCardImage(item);

  return (
    <button
      onClick={onClick}
      className="rainbow-border group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface text-left"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${resolveProductImageClasses(
              item,
              "product-card__image",
            )}`}
          />
        ) : (
          <div className="menu-card-image-black h-full w-full" aria-hidden />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold leading-tight text-text">
          {item.name}
        </h3>

        <div className="mt-1.5 mb-2">
          {hasDouble ? (
            <div className="flex flex-col gap-0.5 text-sm font-bold text-price">
              <span>
                {item.labelA}: {formatPrice(item.priceA!)}
              </span>
              <span>
                {item.labelB}: {formatPrice(item.priceB!)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-price">
              {formatPrice(item.price ?? 0)}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted">
          {item.description}
        </p>
      </div>
    </button>
  );
}
