import type { CSSProperties } from "react";
import { CREW, MURO_CREDITO } from "../../data/crew";
import { haptic, originOf, useUI } from "../../lib/ui";
import { Burgao } from "./Burgao";
import "./muro.css";

/** A turma do muro, lado a lado, como na tela de escolher personagem. Tocar leva à categoria de cada um. */
export function Turma() {
  const ui = useUI();
  return (
    <section className="turma" aria-labelledby="turma-t">
      <div className="turma__head wrap">
        <h2 className="letreiro turma__title" id="turma-t">
          A turma do muro
        </h2>
        <p className="hand turma__note">cada um manda num canto do cardápio. Toca pra ir lá!</p>
      </div>
      <ul className="turma__list" role="list">
        {CREW.map((c, i) => (
          <li key={c.id} style={{ "--cor": c.cor, "--i": i, "--ar": `${c.w} / ${c.h}` } as CSSProperties}>
            <button
              className="turma__card"
              onClick={(e) => {
                haptic(6);
                ui.goTo(c.section, { origin: originOf(e.currentTarget) });
              }}
            >
              <span className="turma__fig">
                {c.id === "burgao" ? <Burgao /> : <img src={c.mini} alt="" width={Math.round((c.w / c.h) * 244)} height={244} loading="lazy" decoding="async" />}
              </span>
              <span className="turma__plate">
                <b>{c.nome}</b>
                <small>{c.manda}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="turma__credito wrap">
        Personagens recriados do muro da nossa fachada, na Praça Roosevelt · arte de{" "}
        <a href={MURO_CREDITO.url} target="_blank" rel="noreferrer">
          {MURO_CREDITO.artista}
        </a>
      </p>
    </section>
  );
}
