import type { CSSProperties } from "react";
import { itemsBySection, sectionById } from "../../data/menu";
import type { Item } from "../../data/types";
import { haptic, originOf, useUI } from "../../lib/ui";
import { Globo } from "../art/Decor";
import { Glitter } from "../fx/Fx";
import { Price } from "./bits";
import "./divas.css";

/** Capa de single: cores da fruta, vinil saindo da capa. */
export function Sleeve({ item, index, big = false }: { item: Item; index: number; big?: boolean }) {
  const [a, b] = item.diva!.colors;
  return (
    <span className={`sleeve${big ? " sleeve--big" : ""}`} style={{ "--a": a, "--b": b } as CSSProperties}>
      <span className="sleeve__vinyl" aria-hidden="true">
        <span className="sleeve__label" />
      </span>
      <span className="sleeve__cover">
        <span className="sleeve__track">faixa {String(index + 1).padStart(2, "0")}</span>
        <span className="sleeve__name">{item.name}</span>
        <span className="sleeve__artist">{item.diva!.artist}</span>
      </span>
    </span>
  );
}

export function DivasSection() {
  const ui = useUI();
  const section = sectionById.get("divas")!;
  const list = itemsBySection("divas");
  return (
    <section className="divas" id="sec-divas" data-section="divas" aria-labelledby="t-divas">
      <div className="checker checker--pink checker--thin" />
      <div className="divas__inner">
        <Glitter count={18} />
        <div className="divas__ball" aria-hidden="true">
          <Globo className="divas__globo" />
          <span className="divas__beam divas__beam--1" />
          <span className="divas__beam divas__beam--2" />
        </div>
        <header className="divas__head">
          <p className="divas__kicker">Cardápio</p>
          <h2 className="divas__title" id="t-divas">
            <span className="divas__neon">Divas</span>
            <span className="divas__pop">Pop</span>
          </h2>
          <p className="divas__intro">
            Nesse menu a Mamadi celebra quem domina as pistas, os hits e o nosso coração. Escolha seu drink favorito e faça um brinde em homenagem às
            nossas divas!
          </p>
          <p className="divas__price hand">
            todos por <strong>R$ 25</strong> · {section.note}
          </p>
        </header>
        <ul className="divas__grid">
          {list.map((it, i) => (
            <li key={it.id}>
              <button
                className="divas__item"
                data-item={it.id}
                onClick={(e) => {
                  haptic(5);
                  ui.openItem(it.id, originOf(e.currentTarget));
                }}
                aria-label={`${it.name}, homenagem a ${it.diva!.artist}, 25 reais`}
              >
                <Sleeve item={it} index={i} />
                <span className="divas__meta">
                  <span className="divas__how">{it.desc!.split(".")[0]}.</span>
                  <Price cents={it.price!} className="divas__p" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="checker checker--pink checker--thin" />
    </section>
  );
}
