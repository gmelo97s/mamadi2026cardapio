import type { Cents, Item, Tag } from "../../data/types";
import { priceParts } from "../../lib/format";
import { Art } from "../art/Art";
import { ART_TINT } from "../art/artTint";
import { TAG_LABEL } from "../../data/tags";
import { haptic, originOf, useUI } from "../../lib/ui";

/** Tags que pesquisam: tocar abre a busca com todos os itens da tag. */
export function Tags({ tags, ingredients, className = "" }: { tags?: Tag[]; ingredients?: { key: string; label: string }[]; className?: string }) {
  const ui = useUI();
  const shown = (tags ?? []).filter((t) => TAG_LABEL[t]);
  if (!shown.length && !ingredients?.length) return null;
  const go = (e: React.MouseEvent, q: string) => {
    e.stopPropagation();
    haptic(6);
    ui.openSearch({ query: q, origin: originOf(e.currentTarget) });
  };
  return (
    <span className={`tags ${className}`}>
      {shown.map((t) => (
        <button key={t} className={`tag tag--${t}`} onClick={(e) => go(e, `#${TAG_LABEL[t]}`)} aria-label={`Ver tudo com a tag ${TAG_LABEL[t]}`}>
          {TAG_LABEL[t]}
        </button>
      ))}
      {ingredients?.map((g) => (
        <button key={g.key} className="tag tag--ing" onClick={(e) => go(e, `#${g.label}`)} aria-label={`Ver tudo com ${g.label}`}>
          {g.label}
        </button>
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
