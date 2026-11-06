import { memo } from "react";
import type { Item } from "../../data/types";
import { brl, itemPriceLabel } from "../../lib/format";
import { haptic, originOf, useUI } from "../../lib/ui";
import { ArtTile, Price, Tags } from "./bits";
import "./menu.css";

function optionsLine(it: Item) {
  if (!it.options?.length) return "";
  return it.options.map((g) => `${g.label}: ${g.values.join(", ")}`).join(" · ");
}

export const ItemRow = memo(function ItemRow({ item, highlight }: { item: Item; highlight?: boolean }) {
  const ui = useUI();
  const sub = [item.unit, item.desc].filter(Boolean).join(" · ");
  const opts = optionsLine(item);
  return (
    <li className={`row${highlight ? " is-highlight" : ""}`} data-item={item.id}>
      <button
        className="row__btn"
        onClick={(e) => {
          haptic(5);
          ui.openItem(item.id, originOf(e.currentTarget.querySelector(".art-tile")));
        }}
        aria-label={`${item.name}, ${itemPriceLabel(item)}`}
      >
        <ArtTile item={item} className="row__art" />
        <span className="row__body">
          <span className="row__top">
            <span className="row__name">{item.name}</span>
            {!item.variants && item.price != null && (
              <>
                <span className="row__lead" aria-hidden="true" />
                <Price cents={item.price} className="row__price" />
              </>
            )}
          </span>
          {sub && <span className="row__desc">{sub}</span>}
          {opts && <span className="row__opts">{opts}</span>}
          {item.variants && (
            <span className="row__variants">
              {item.variants.map((v) => (
                <span key={v.label} className="variant">
                  <span className="variant__label">{v.label}</span>
                  <span className="variant__price">{brl(v.price)}</span>
                </span>
              ))}
            </span>
          )}
          <Tags tags={item.tags} className="row__tags" />
        </span>
      </button>
    </li>
  );
});
