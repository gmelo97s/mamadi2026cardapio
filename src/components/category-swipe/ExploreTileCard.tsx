import { useState } from "react";

interface ExploreTileCardProps {
  title: string;
  meta: string;
  imageSrc?: string | null;
  emojiFallback?: string;
  onClick: () => void;
}

export default function ExploreTileCard({
  title,
  meta,
  imageSrc,
  emojiFallback = "🍽️",
  onClick,
}: ExploreTileCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageSrc) && !imageFailed;

  return (
    <button type="button" className="explore-tile" onClick={onClick}>
      <div className="explore-tile__visual">
        {showImage ? (
          <img
            src={imageSrc!}
            alt=""
            className="explore-tile__image"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="explore-tile__emoji" aria-hidden>
            {emojiFallback}
          </span>
        )}
      </div>
      <div className="explore-tile__footer">
        <span className="explore-tile__title">{title}</span>
        <span className="explore-tile__meta">{meta}</span>
      </div>
    </button>
  );
}
