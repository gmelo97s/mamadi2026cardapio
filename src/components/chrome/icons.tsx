/* Ícones de traço (24px) desenhados para o Mamadi. */
import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/** Tampinha (início) */
export const IcTampinha = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 2.6l1.6 1.2 2-.4 1 1.7 2 .5.2 2 1.6 1.2-.7 1.9.7 1.9-1.6 1.2-.2 2-2 .5-1 1.7-2-.4L12 21.4l-1.6-1.2-2 .4-1-1.7-2-.5-.2-2-1.6-1.2.7-1.9-.7-1.9L5.2 8.2l.2-2 2-.5 1-1.7 2 .4z" />
    <circle cx="12" cy="12" r="4.4" />
  </svg>
);

/** Litrão (beber) */
export const IcLitrao = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10.2 2.5h3.6M10.4 2.5v4.2c0 1.6-3 2.4-3 5.2v8.2c0 .9.7 1.4 1.5 1.4h6.2c.8 0 1.5-.5 1.5-1.4v-8.2c0-2.8-3-3.6-3-5.2V2.5" />
    <path d="M7.4 13.2h9.2v4.4H7.4z" />
  </svg>
);

/** Burger (comer) */
export const IcBurger = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 10.6C4 6.8 7.6 4 12 4s8 2.8 8 6.6c0 .5-.4.9-.9.9H4.9c-.5 0-.9-.4-.9-.9z" />
    <path d="M3.4 14.4c1.4-1 2.2.8 3.4 0s2-1 3.4 0 2 1 3.4 0 2-1 3.4 0 2 .8 3.6 0" />
    <path d="M4.4 17.6h15.2c0 1.7-1.3 2.9-3 2.9H7.4c-1.7 0-3-1.2-3-2.9z" />
  </svg>
);

/** Cadeira de plástico (a casa) */
export const IcCadeira = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 12.6C6.4 9 6.3 5.8 7.2 4c.6-1.1 1.8-1.6 4.8-1.6s4.2.5 4.8 1.6c.9 1.8.8 5 .2 8.6" />
    <path d="M10 5.4v3.4M14 5.4v3.4" />
    <path d="M4.6 14.2c1-1.4 3.4-2 7.4-2s6.4.6 7.4 2c-1.2 1.2-4 1.6-7.4 1.6s-6.2-.4-7.4-1.6z" />
    <path d="M5.2 15.4 4 21.6M18.8 15.4 20 21.6M8.6 15.9l-.6 4.2M15.4 15.9l.6 4.2" />
  </svg>
);

export const IcLupa = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="10.6" cy="10.6" r="6.4" />
    <path d="M15.4 15.4 20.6 20.6" />
  </svg>
);

export const IcMic = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="9" y="2.8" width="6" height="11.4" rx="3" />
    <path d="M5.6 11.4a6.4 6.4 0 0 0 12.8 0M12 17.8v3.4M8.8 21.2h6.4" />
  </svg>
);

export const IcX = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IcSeta = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IcVoltar = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const IcPin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 21.4s-6.6-6.2-6.6-11.2a6.6 6.6 0 0 1 13.2 0c0 5-6.6 11.2-6.6 11.2z" />
    <circle cx="12" cy="10.2" r="2.4" />
  </svg>
);

export const IcRelogio = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3 2" />
  </svg>
);

export const IcInsta = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);

export const IcMoto = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M9 17h6l2.6-6H14M14 11l-2-4H9.4M6 17l3.4-6h4.6" />
  </svg>
);

export const IcGota = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3.4s5.6 6.2 5.6 10.2a5.6 5.6 0 0 1-11.2 0C6.4 9.6 12 3.4 12 3.4z" />
  </svg>
);

/** Cardápio aberto */
export const IcCardapio = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 6.2C10.2 4.8 7.4 4.2 3.8 4.4v14c3.6-.2 6.4.4 8.2 1.8 1.8-1.4 4.6-2 8.2-1.8v-14c-3.6-.2-6.4.4-8.2 1.8z" />
    <path d="M12 6.2v14M6.6 8.6c1.4 0 2.6.3 3.4.8M6.6 12c1.4 0 2.6.3 3.4.8M14 9.4c.8-.5 2-.8 3.4-.8M14 12.8c.8-.5 2-.8 3.4-.8" />
  </svg>
);

export const IcSol = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5" />
  </svg>
);

export const IcLua = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M20 14.4A8 8 0 0 1 9.6 4a8 8 0 1 0 10.4 10.4z" />
  </svg>
);
