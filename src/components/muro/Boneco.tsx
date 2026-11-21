import type { CSSProperties } from "react";
import type { Crew } from "../../data/crew";
import { Burgao } from "./Burgao";

/**
 * O personagem do muro como boneco articulado (recorte animado, estilo animação de papel):
 * a mesma imagem em três camadas — pernas, tronco e cabeça — com as emendas em degradê.
 * O tronco dobra na cintura e leva a cabeça junto; a cabeça ainda balança no pescoço.
 * Assim o boneco respira, anda e olha em volta sem precisar redesenhar cada parte.
 */
export function Boneco({ crew, className = "" }: { crew: Crew; className?: string }) {
  if (crew.id === "burgao")
    return (
      <span className={`boneco boneco--svg ${className}`} aria-hidden="true">
        <Burgao className="boneco__svg" />
      </span>
    );
  const rig = crew.rig ?? { neck: 36, waist: 68 };
  const style = { "--neck": `${rig.neck}%`, "--waist": `${rig.waist}%`, "--nx": `${rig.nx ?? 50}%` } as CSSProperties;
  const img = (cls: string) => (
    <img className={`boneco__p ${cls}`} src={crew.img} width={crew.w} height={crew.h} alt="" loading="lazy" decoding="async" draggable={false} />
  );
  return (
    <span className={`boneco ${className}`} style={style} aria-hidden="true">
      {img("boneco__pernas")}
      <span className="boneco__sup">
        {img("boneco__tronco")}
        {img("boneco__cabeca")}
      </span>
    </span>
  );
}
