import { useEffect, useRef, useState } from "react";
import { sections } from "../data/menu";
import type { SectionId } from "../data/types";
import { luzDa } from "../data/crew";
import { SectionBlock } from "../components/menu/SectionBlock";
import { DivasSection } from "../components/menu/Divas";
import { PratosSection } from "../components/menu/Pratos";
import "./screens.css";

const list = sections;

/** O cardápio inteiro em sequência, com as categorias fixas no topo (como no Botanikafe). */
export function Cardapio() {
  const [active, setActive] = useState<SectionId>(list[0].id);
  const chipsRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);

  // seção ativa conforme a rolagem
  useEffect(() => {
    let raf = 0;
    let luz = "";
    const root = document.documentElement;
    const spy = () => {
      raf = 0;
      const line = (chipsRef.current?.getBoundingClientRect().bottom ?? 120) + 24;
      // a luz troca quando a seção nova chega no meio da tela (junto com o dono dela)
      const meio = window.innerHeight * 0.55;
      let current = list[0].id;
      let lit: SectionId | null = null;
      for (const s of list) {
        const el = document.getElementById(`sec-${s.id}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line) current = s.id;
        if (top <= meio) lit = s.id;
      }
      // no fim da página, a última categoria fica ativa (mesmo sendo curta)
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) current = lit = list[list.length - 1].id;
      // a luz do muro pega a cor do dono da seção (antes do cardápio, o laranja da casa)
      const cor = lit ? luzDa(lit) : "#fa5a0a";
      if (cor !== luz) {
        luz = cor;
        root.style.setProperty("--luz", cor);
      }
      if (performance.now() < lockUntil.current) return;
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
      root.style.removeProperty("--luz");
    };
  }, []);

  // chip ativo sempre visível
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    const bar = chipsRef.current?.querySelector<HTMLElement>(".chips__scroll");
    if (chip && bar) {
      const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
      bar.scrollTo({ left, behavior: "smooth" });
    }
  }, [active]);

  const go = (id: SectionId, at: number) => {
    setActive(id);
    lockUntil.current = at + 1600;
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="menu" id="cardapio">
      <header className="menu__hero wrap">
        <h2 className="letreiro menu__title">Cardápio</h2>
        <p className="menu__note">Toque num item para ver os detalhes e o que combina com ele.</p>
      </header>

      <div className="chips" ref={chipsRef}>
        <div className="chips__scroll wrap" role="tablist" aria-label="Categorias">
          {list.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              data-chip={s.id}
              className={`chip${active === s.id ? " is-active" : ""}${s.id === "divas" ? " chip--divas" : ""}`}
              onClick={(e) => go(s.id, e.timeStamp)}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      {list.map((s) =>
        s.id === "divas" ? <DivasSection key={s.id} /> : s.id === "pratos" ? <PratosSection key={s.id} /> : <SectionBlock key={s.id} section={s} />,
      )}
      <p className="menu__end hand">Bebeu? Não dirija. E não esquece da água!</p>
    </div>
  );
}
