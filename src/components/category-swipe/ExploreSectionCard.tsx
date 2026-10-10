import { useState } from "react";
import type { ExploreSection } from "../../data/exploreSections";
import { formatExploreSectionCount } from "../../data/exploreSections";
import { resolveExploreSectionImage } from "../../lib/menuImage";
import { SHOW_ITEM_PHOTOS } from "../../config/menuDisplay";

interface ExploreSectionCardProps {
  section: ExploreSection;
  itemCount: number;
  onClick: () => void;
}

function BrandLed({ label }: { label: string }) {
  return (
    <span className="explore-tile__brand-led" aria-label={label}>
      {label.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="category-swipe-card__brand-led-char explore-tile__brand-led-char"
          style={{ animationDelay: `${index * 0.09}s` }}
          aria-hidden
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

export default function ExploreSectionCard({
  section,
  itemCount,
  onClick,
}: ExploreSectionCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!SHOW_ITEM_PHOTOS) {
    return (
      <button type="button" className="explore-tile explore-tile--text" onClick={onClick}>
        <span className="explore-tile__tag">{section.tag}</span>
        <p className="explore-tile__brand">
          <BrandLed label={section.label} />
        </p>
        <p className="explore-tile__text-desc">{section.description}</p>
        <span className="explore-tile__meta">{formatExploreSectionCount(itemCount)}</span>
      </button>
    );
  }

  return (
    <button type="button" className="explore-tile" onClick={onClick}>
      <div className="explore-tile__visual">
        {!imageFailed ? (
          <img
            src={resolveExploreSectionImage(section.image)}
            alt=""
            className="explore-tile__image explore-tile__image--photo"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="menu-art menu-art--tile menu-art--pride" aria-hidden>
            <span className="menu-art__halo" />
            <span className="menu-art__rays" />
            <span className="menu-art__glyph">{section.emoji}</span>
          </div>
        )}
      </div>
      <div className="explore-tile__footer">
        <p className="explore-tile__brand">
          <BrandLed label={section.label} />
        </p>
        <span className="explore-tile__meta">{formatExploreSectionCount(itemCount)}</span>
      </div>
    </button>
  );
}
