import { useState } from "react";
import type { ExploreSection } from "../../data/exploreSections";
import { formatExploreSectionCount } from "../../data/exploreSections";

interface ExploreSectionCardProps {
  section: ExploreSection;
  itemCount: number;
  onClick: () => void;
}

export default function ExploreSectionCard({
  section,
  itemCount,
  onClick,
}: ExploreSectionCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <button type="button" className="explore-tile" onClick={onClick}>
      <div className="explore-tile__visual">
        {!imageFailed ? (
          <img
            src={section.image}
            alt=""
            className="explore-tile__image explore-tile__image--photo"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="explore-tile__emoji" aria-hidden>
            🍽️
          </span>
        )}
      </div>
      <div className="explore-tile__footer">
        <p className="explore-tile__brand">
          <span className="explore-tile__brand-led" aria-label={section.label}>
            {section.label.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="category-swipe-card__brand-led-char explore-tile__brand-led-char"
                style={{ animationDelay: `${index * 0.09}s` }}
                aria-hidden
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </p>
        <span className="explore-tile__meta">{formatExploreSectionCount(itemCount)}</span>
      </div>
    </button>
  );
}
