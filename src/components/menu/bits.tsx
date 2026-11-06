import type { Cents, Item, Tag } from "../../data/types";
import { priceParts } from "../../lib/format";
import { Art } from "../art/Art";
import { ART_TINT } from "../art/artTint";

const TAG_LABEL: Partial<Record<Tag, string>> = {
  promo: "promo",
  novo: "novidade",
  vegano: "vegano",
  serve2: "serve 2",
  fds: "sáb e dom",
  domingo: "domingo",
  "da-casa": "da casa",
};

export function Tags({ tags, className = "" }: { tags?: Tag[]; className?: string }) {
  const shown = (tags ?? []).filter((t) => TAG_LABEL[t]);
  if (!shown.length) return null;
  return (
    <span className={`tags ${className}`}>
      {shown.map((t) => (
        <span key={t} className={`tag tag--${t}`}>
          {TAG_LABEL[t]}
        </span>
      ))}
    </span>
  );
}

/** Preço pintado: "R$" pequeno, reais grandes, centavos em cima (como cartaz de oferta). */
export function Price({ cents, className = "" }: { cents: Cents; className?: string }) {
  const { reais, cents: c } = priceParts(cents);
  return (
    <span className={`price ${className}`} aria-label={`${reais}${c ? "," + c : ""} reais`}>
      <span className="price__cur" aria-hidden="true">
        R$
      </span>
      <span className="price__int" aria-hidden="true">
        {reais}
      </span>
      {c && (
        <span className="price__cents" aria-hidden="true">
          ,{c}
        </span>
      )}
    </span>
  );
}

/** Selo com a ilustração (vira foto quando houver `photo`). */
export function ArtTile({ item, className = "" }: { item: Item; className?: string }) {
  const tint = ART_TINT[item.art] ?? "var(--paper-2)";
  if (item.photo) {
    return (
      <span className={`art-tile art-tile--photo ${className}`}>
        <img src={item.photo} alt="" loading="lazy" decoding="async" />
      </span>
    );
  }
  return (
    <span className={`art-tile ${className}`} style={{ background: tint }}>
      <Art k={item.art} color={item.diva?.colors[0] ?? item.color} />
    </span>
  );
}
