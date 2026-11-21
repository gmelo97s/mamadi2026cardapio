import { Fragment, useRef, type CSSProperties } from "react";
import { itemsBySection } from "../../data/menu";
import type { Section } from "../../data/types";
import { vezes } from "../../data/crew";
import { useRevela } from "../../lib/revela";
import { Dono } from "../muro/Dono";
import { Proxima } from "../muro/Proxima";
import { ItemRow } from "./ItemRow";
import "./menu.css";

/** Sublinhado à mão embaixo do título. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg className={`squiggle ${className}`} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 8.5C30 3 52 10 82 6s52-4.6 78-1.4S190 7 198 4.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Cabeçalho da seção. Com dono, vira um palco: o dono da seção anterior passa a vez
 * e o novo chega andando, do lado dele (que alterna de uma seção para outra).
 */
export function SectionHead({ section, aside }: { section: Section; aside?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useRevela(ref, 0.2);
  const vez = vezes.get(section.id);
  const dono = vez?.dono;
  const lado = vez?.lado ?? 1;
  const style = dono ? ({ "--hw": dono.h / dono.w, "--cor": dono.cor } as CSSProperties) : undefined;
  return (
    <header ref={ref} className={`sec-head${dono ? " sec-head--dono" : ""}${dono && lado < 0 ? " sec-head--esq" : ""}`} style={style}>
      <div className="sec-head__titles">
        <h2 className="letreiro sec-head__title" id={`t-${section.id}`}>
          {section.title}
        </h2>
        <p className="hand sec-head__note">{section.note}</p>
        {aside}
      </div>
      {dono && <Dono crew={dono} prev={vez?.prev} lado={lado} />}
    </header>
  );
}

export function SectionBlock({ section, highlight }: { section: Section; highlight?: string }) {
  const list = itemsBySection(section.id);
  const blockAt = new Map((section.blocks ?? []).map((b) => [b.from, b.title]));
  const dono = vezes.get(section.id)?.dono;
  const rows = useRef<HTMLUListElement>(null);
  useRevela(rows, 0.02);
  return (
    <section className={`sec wrap${dono ? " sec--dono" : ""}`} id={`sec-${section.id}`} data-section={section.id} aria-labelledby={`t-${section.id}`}>
      <SectionHead section={section} />
      <ul className="rows" ref={rows}>
        {list.map((it) => (
          <Fragment key={it.id}>
            {blockAt.has(it.id) && (
              <li className="block-title" aria-hidden={false}>
                <span>{blockAt.get(it.id)}</span>
              </li>
            )}
            <ItemRow item={it} highlight={highlight === it.id} />
          </Fragment>
        ))}
      </ul>
      <Proxima from={section.id} />
    </section>
  );
}
