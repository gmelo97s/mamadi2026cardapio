import type { Category, MenuItem } from "../../data/menu";
import { formatPrice } from "../../data/menu";

interface MenuTextRowProps {
  item: MenuItem;
  /** Mostra a categoria na linha — usado nos resultados de busca. */
  category?: Category;
}

/** Item do cardápio em modo texto: nome, descrição e preço, sem imagem. */
export default function MenuTextRow({ item, category }: MenuTextRowProps) {
  const hasDouble = item.priceA != null && item.priceB != null;
  const singlePrice = item.price ?? (hasDouble ? null : item.priceA ?? null);

  return (
    <article className="menu-row">
      <div className="menu-row__head">
        <h3 className="menu-row__name">{item.name}</h3>
        {singlePrice != null && (
          <span className="menu-row__price">{formatPrice(singlePrice)}</span>
        )}
      </div>

      {category && <p className="menu-row__cat">{category.label}</p>}

      <p className="menu-row__desc">{item.description}</p>

      {hasDouble && (
        <ul className="menu-row__options">
          <li className="menu-row__option">
            <span>{item.labelA ?? "Opção A"}</span>
            <strong>{formatPrice(item.priceA!)}</strong>
          </li>
          <li className="menu-row__option">
            <span>{item.labelB ?? "Opção B"}</span>
            <strong>{formatPrice(item.priceB!)}</strong>
          </li>
        </ul>
      )}

      {item.badge && <p className="menu-row__badge">{item.badge}</p>}
      {item.obs && <p className="menu-row__obs">{item.obs}</p>}
    </article>
  );
}
