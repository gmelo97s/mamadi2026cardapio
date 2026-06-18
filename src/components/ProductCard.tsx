import type { MenuItem } from "../data/menu";
import { formatPrice } from "../data/menu";

interface ProductCardProps {
  item: MenuItem;
  onClick?: () => void;
}

function badgeColor(badge: string): string {
  if (badge.includes("Vegano")) return "#00E676";
  if (badge.includes("Mamadi")) return "#AA00FF";
  return "#FFD700";
}

export default function ProductCard({ item, onClick }: ProductCardProps) {
  const hasDouble = item.priceA != null && item.priceB != null;

  return (
    <button
      onClick={onClick}
      className="rainbow-border group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface text-left"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.badge && (
          <span
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold text-black shadow"
            style={{ backgroundColor: badgeColor(item.badge) }}
          >
            {item.badge}
          </span>
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
