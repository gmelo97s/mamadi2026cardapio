import { itemsBySection, sectionById } from "../../data/menu";
import type { Item } from "../../data/types";
import { isAvailableToday, kitchenStatus } from "../../lib/schedule";
import { haptic, originOf, useUI } from "../../lib/ui";
import { Art } from "../art/Art";
import { Price, Tags } from "./bits";
import { SectionHead } from "./SectionBlock";
import "./menu.css";

function when(it: Item) {
  if (it.tags?.includes("domingo")) return "todo domingo";
  if (it.tags?.includes("fds")) return "sábado e domingo";
  return "quarta a domingo";
}

/** Comidinhas caseiras: cartões grandes, com o dia em que saem. */
export function PratosSection() {
  const ui = useUI();
  const section = sectionById.get("pratos")!;
  const k = kitchenStatus();
  return (
    <section className="sec sec--pratos wrap" id="sec-pratos" data-section="pratos" aria-labelledby="t-pratos">
      <SectionHead
        section={section}
        aside={
          <p className={`kitchen${k.open ? " is-open" : ""}`}>
            <span className="kitchen__dot" aria-hidden="true" />
            {k.label}
          </p>
        }
      />
      <ul className="pratos">
        {itemsBySection("pratos").map((it) => {
          const today = isAvailableToday(it.tags) && (it.tags?.includes("fds") || it.tags?.includes("domingo"));
          return (
            <li key={it.id}>
              <div className="prato" data-item={it.id}>
                <button
                  className="prato__btn"
                  aria-label={it.name}
                  onClick={(e) => {
                    haptic(5);
                    ui.openItem(it.id, originOf(e.currentTarget.parentElement?.querySelector(".prato__art")));
                  }}
                />
                <span className="prato__when hand">{today ? "hoje tem!" : when(it)}</span>
                <span className="prato__art">
                  <Art k={it.art} />
                </span>
                <span className="prato__body">
                  <span className="prato__name">{it.name}</span>
                  <span className="prato__desc">{[it.unit, it.desc].filter(Boolean).join(" · ")}</span>
                  {it.options && <span className="prato__opts">{it.options[0].label}: {it.options[0].values.join(", ")}</span>}
                  <span className="prato__foot">
                    <Price cents={it.price!} className="prato__price" />
                    <Tags tags={it.tags?.filter((t) => t === "vegano" || t === "serve2")} className="prato__tags" />
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="pratos__foot hand">Feitas pela Mamadi, de quarta a domingo, das 12h às 19h.</p>
    </section>
  );
}
