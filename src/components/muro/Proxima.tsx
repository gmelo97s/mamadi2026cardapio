import { useRef, type CSSProperties } from "react";
import { vezes } from "../../data/crew";
import type { SectionId } from "../../data/types";
import { haptic, originOf, useUI } from "../../lib/ui";
import { useNaTela, useRevela } from "../../lib/revela";
import { Burgao } from "./Burgao";
import "./muro.css";

/**
 * "Próxima parada": no fim de cada seção, o dono da próxima espia por cima do muro.
 * Liga uma seção na outra (a faixa vai da cor de um dono para a do outro) e leva até lá.
 */
export function Proxima({ from }: { from: SectionId }) {
  const ui = useUI();
  const ref = useRef<HTMLButtonElement>(null);
  useRevela(ref, 0.4);
  useNaTela(ref);
  const v = vezes.get(from);
  if (!v?.next) return null;
  const next = v.next;
  const quem = v.nextDono;
  const lado = vezes.get(next.id)?.lado ?? 1;
  const style = { "--de": v.dono?.cor ?? "#fa5a0a", "--para": quem?.cor ?? "#fa5a0a" } as CSSProperties;
  return (
    <button
      ref={ref}
      className={`proxima${lado < 0 ? " proxima--esq" : ""}${quem ? "" : " proxima--so"}`}
      style={style}
      aria-label={`Próxima parada: ${next.title}${quem ? `, com ${quem.nome}` : ""}`}
      onClick={(e) => {
        haptic(6);
        ui.goTo(next.id, { origin: originOf(e.currentTarget) });
      }}
    >
      {quem && (
        <span className="proxima__espia" aria-hidden="true">
          {quem.id === "burgao" ? <Burgao className="proxima__img" /> : <img className="proxima__img" src={quem.img || quem.mini} alt="" loading="lazy" decoding="async" draggable={false} />}
        </span>
      )}
      <span className="proxima__placa">
        <span className="proxima__k">Próxima parada</span>
        <span className="proxima__t">{next.title}</span>
        {quem && <span className="proxima__quem">com {quem.nome}</span>}
        <span className="proxima__seta" aria-hidden="true">
          ↓
        </span>
      </span>
    </button>
  );
}
