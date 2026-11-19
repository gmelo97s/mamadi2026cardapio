import type { CSSProperties } from "react";
import { crewById } from "../../data/crew";
import { haptic, originOf, useUI } from "../../lib/ui";
import { IcSeta } from "../chrome/icons";
import "./sinuca-card.css";

const LADOS = ["breja", "rainha"] as const;

/** Cartaz do desafio: sinuca valendo drink, com dois da turma do muro se encarando. */
export function SinucaCard() {
  const ui = useUI();
  return (
    <section className="desafio wrap" aria-labelledby="desafio-t">
      <button
        className="desafio__card"
        onClick={(e) => {
          haptic(10);
          ui.openGame(originOf(e.currentTarget));
        }}
      >
        <span className="desafio__mesa" aria-hidden="true">
          <i className="desafio__bola desafio__bola--1" />
          <i className="desafio__bola desafio__bola--8" />
          <i className="desafio__bola desafio__bola--3" />
        </span>
        <span className="desafio__lados" aria-hidden="true">
          {LADOS.map((id, i) => {
            const c = crewById.get(id)!;
            return (
              <span key={id} className={`desafio__lado desafio__lado--${i}`} style={{ "--cor": c.cor } as CSSProperties}>
                <img src={c.mini} alt="" width={Math.round((c.w / c.h) * 244)} height={244} loading="lazy" decoding="async" />
              </span>
            );
          })}
          <b className="desafio__vs">VS</b>
        </span>
        <span className="desafio__txt">
          <span className="desafio__kicker">Novo no cardápio</span>
          <strong className="desafio__t" id="desafio-t">
            Sinuca valendo drink
          </strong>
          <span className="desafio__d">Quem perde paga: a cada 2 bolas, a roleta sorteia um drink do cardápio.</span>
          <span className="desafio__cta">
            Bora jogar <IcSeta />
          </span>
        </span>
      </button>
    </section>
  );
}
