import { useEffect, useRef, useState } from "react";
import { sections } from "../data/menu";
import type { Group, SectionId } from "../data/types";
import { Art } from "../components/art/Art";
import { SectionBlock } from "../components/menu/SectionBlock";
import { DivasSection } from "../components/menu/Divas";
import { PratosSection } from "../components/menu/Pratos";
import "./screens.css";

const COPY: Record<Group, { title: string; note: string }> = {
  beber: { title: "Beber", note: "o forte da casa: litrão, copão e caipirinha" },
  comer: { title: "Comer", note: "porção, lanche, tábua e a comida da Mamadi" },
};

export function MenuScreen({ group, focus, focusNonce }: { group: Group; focus?: SectionId; focusNonce?: number }) {
  const list = sections.filter((s) => s.group === group);
  const [active, setActive] = useState<SectionId>(list[0].id);
  const chipsRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);

  // seção ativa conforme a rolagem
  useEffect(() => {
    let raf = 0;
    const spy = () => {
      raf = 0;
      if (performance.now() < lockUntil.current) return;
      const line = (chipsRef.current?.getBoundingClientRect().bottom ?? 120) + 24;
      let current = list[0].id;
      for (const s of list) {
        const el = document.getElementById(`sec-${s.id}`);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      // no fim da página, a última categoria fica ativa (mesmo sendo curta)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = list[list.length - 1].id;
      setActive(current);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(spy);
    };
    // fim da rolagem suave (toque no chip): libera e recalcula
    const onEnd = () => {
      lockUntil.current = 0;
      spy();
    };
    spy();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("scrollend", onEnd);
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("scrollend", onEnd);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [group]); // eslint-disable-line react-hooks/exhaustive-deps

  // chip ativo sempre visível
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    const bar = chipsRef.current?.querySelector<HTMLElement>(".chips__scroll");
    if (chip && bar) {
      const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
      bar.scrollTo({ left, behavior: "smooth" });
    }
  }, [active]);

  // ir direto para uma seção (vindo do início, da busca ou de link)
  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(`sec-${focus}`);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" }));
  }, [focus, focusNonce]);

  const go = (id: SectionId, at: number) => {
    setActive(id);
    lockUntil.current = at + 1600;
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`menu menu--${group}`}>
      <header className="menu__hero">
        <h1 className="letreiro menu__title">{COPY[group].title}</h1>
        <p className="hand menu__note">{COPY[group].note}</p>
      </header>

      <div className="chips" ref={chipsRef}>
        <div className="chips__scroll" role="tablist" aria-label="Categorias">
          {list.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              data-chip={s.id}
              className={`chip${active === s.id ? " is-active" : ""}${s.id === "divas" ? " chip--divas" : ""}`}
              onClick={(e) => go(s.id, e.timeStamp)}
            >
              <Art k={s.art} className="chip__art" />
              {s.short}
            </button>
          ))}
        </div>
      </div>

      {list.map((s) =>
        s.id === "divas" ? (
          <DivasSection key={s.id} />
        ) : s.id === "pratos" ? (
          <PratosSection key={s.id} />
        ) : (
          <SectionBlock key={s.id} section={s} />
        ),
      )}
      <p className="menu__end hand">
        {group === "beber" ? "Bebeu? Não dirija. E não esquece da água!" : "Feito com carinho pela Mamadi."}
      </p>
    </div>
  );
}
