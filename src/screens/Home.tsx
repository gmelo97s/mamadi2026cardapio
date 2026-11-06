import type { CSSProperties } from "react";
import { itemById, itemsBySection, minPrice, sections } from "../data/menu";
import type { SectionId } from "../data/types";
import { casa } from "../data/casa";
import { Art } from "../components/art/Art";
import { Cadeira } from "../components/art/Decor";
import { Cartazes } from "../components/home/Cartazes";
import { Price } from "../components/menu/bits";
import { IcPin, IcSeta } from "../components/chrome/icons";
import { greeting, kitchenStatus, nowSP, todaySpecials } from "../lib/schedule";
import { brl } from "../lib/format";
import { haptic, originOf, useUI } from "../lib/ui";
import "./screens.css";

/** extras (potinho, copo com gelo…) não entram no "a partir de" */
const EXTRA = /^(extra-|maionese|copo-|shot-limao)/;

const TILES: { id: SectionId; tone: string }[] = [
  { id: "cervejas", tone: "#ffd9b8" },
  { id: "copao", tone: "#ffc9dc" },
  { id: "drinks", tone: "#dcf2bf" },
  { id: "divas", tone: "var(--night)" },
  { id: "pratos", tone: "#ffe6a8" },
  { id: "porcoes", tone: "#ffe9c2" },
  { id: "lanches", tone: "#f9d7b5" },
  { id: "tabuas", tone: "#efdcc4" },
];

export function Home() {
  const ui = useUI();
  const { hour } = nowSP();
  const k = kitchenStatus();
  const specials = todaySpecials();
  const special = specials.ids.length ? itemById.get(specials.ids[specials.ids.length - 1]) : undefined;

  return (
    <div className="home">
      <section className="hello">
        <div className="hello__text">
          <p className="hand hello__hi">{greeting(hour)}! Chegou, chegou.</p>
          <h1 className="letreiro hello__title">
            Puxa uma <span className="hello__chair-word">cadeira</span>.
          </h1>
          <p className="hello__sub">
            Litrão trincando, copão em promoção, drink de diva e a comida caseira da Mamadi. Em frente à Praça Roosevelt.
          </p>
        </div>
        <Cadeira className="hello__chair" />
      </section>

      <Cartazes />

      <section className="tiles-wrap" aria-labelledby="t-tiles">
        <div className="home__head">
          <h2 className="letreiro home__h2" id="t-tiles">
            O que vai ser?
          </h2>
        </div>
        <ul className="tiles">
          {TILES.map((t, i) => {
            const s = sections.find((x) => x.id === t.id)!;
            const list = itemsBySection(s.id).filter((it) => !EXTRA.test(it.id));
            const from = Math.min(...list.map(minPrice).filter((p) => p > 0));
            return (
              <li key={s.id} style={{ "--i": i } as CSSProperties}>
                <button
                  className={`tile${s.id === "divas" ? " tile--divas" : ""}`}
                  style={{ "--tone": t.tone } as CSSProperties}
                  onClick={(e) => {
                    haptic(6);
                    ui.goTab(s.group, { section: s.id, origin: originOf(e.currentTarget) });
                  }}
                >
                  <Art k={s.art} className="tile__art" />
                  <span className="tile__name">{s.id === "divas" ? <span className="tile__neon">Divas Pop</span> : s.title}</span>
                  <span className="tile__meta">
                    <span>
                      {list.length} {list.length === 1 ? "opção" : "opções"}
                    </span>
                    <span>a partir de {brl(from)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mamadi-card" aria-labelledby="t-mamadi">
        <img className="mamadi-card__stamp" src="/brand/logo-256.webp" alt="" width="104" height="104" loading="lazy" />
        <div className="mamadi-card__body">
          <p className="hand mamadi-card__kicker">{special ? `hoje é ${specials.dayName}!` : "comidinhas caseiras"}</p>
          <h2 className="mamadi-card__title" id="t-mamadi">
            {special ? `Hoje tem ${special.name}` : "A comida da Mamadi"}
          </h2>
          <p className="mamadi-card__text">
            {special
              ? special.desc
              : "Churrasco no sábado e no domingo, baião de dois no domingo e prato executivo com espetinho. Tudo feito por ela."}
          </p>
          <p className={`kitchen${k.open ? " is-open" : ""}`}>
            <span className="kitchen__dot" aria-hidden="true" />
            {k.label}
          </p>
          <button
            className="cta"
            onClick={(e) => (special ? ui.openItem(special.id, originOf(e.currentTarget)) : ui.goTab("comer", { section: "pratos", origin: originOf(e.currentTarget) }))}
          >
            {special ? (
              <>
                Ver o prato · <Price cents={special.price!} className="cta__price" />
              </>
            ) : (
              "Ver as comidinhas"
            )}
            <IcSeta />
          </button>
        </div>
      </section>

      <section className="where" aria-label="Endereço">
        <div className="checker checker--thin" />
        <a className="where__link" href={casa.mapsUrl} target="_blank" rel="noreferrer">
          <IcPin className="where__icon" />
          <span>
            <strong>{casa.endereco}</strong>
            <span>{casa.bairro}</span>
          </span>
          <IcSeta className="where__go" />
        </a>
      </section>
    </div>
  );
}
