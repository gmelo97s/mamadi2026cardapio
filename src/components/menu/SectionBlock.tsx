import { Fragment } from "react";
import { itemsBySection } from "../../data/menu";
import type { Section } from "../../data/types";
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

export function SectionHead({ section, aside }: { section: Section; aside?: React.ReactNode }) {
  return (
    <header className="sec-head">
      <div className="sec-head__titles">
        <h2 className="letreiro sec-head__title" id={`t-${section.id}`}>
          {section.title}
        </h2>
        <p className="hand sec-head__note">{section.note}</p>
        {aside}
      </div>
    </header>
  );
}

export function SectionBlock({ section, highlight }: { section: Section; highlight?: string }) {
  const list = itemsBySection(section.id);
  const blockAt = new Map((section.blocks ?? []).map((b) => [b.from, b.title]));
  return (
    <section className="sec wrap" id={`sec-${section.id}`} data-section={section.id} aria-labelledby={`t-${section.id}`}>
      <SectionHead section={section} />
      <ul className="rows">
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
    </section>
  );
}
