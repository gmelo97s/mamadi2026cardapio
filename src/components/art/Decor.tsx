/* Peças decorativas: cadeira de plástico, globo de espelhos, limão, gelo, brilhos, faixa do logo. */
import type { CSSProperties } from "react";

const K = "#24160d";

/** A cadeira de plástico vermelha do boteco (aparece nos cardápios impressos). */
export function Cadeira({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 130" className={className} style={style} aria-hidden="true">
      <g stroke={K} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round">
        <ellipse cx="60" cy="124" rx="44" ry="4" fill={K} opacity=".14" stroke="none" />
        {/* pernas de trás */}
        <path d="M37 72 31 114h7l6-40M83 71l6 41h-7l-6-38" fill="#a30000" />
        {/* encosto */}
        <path d="M30 70c-3-18-4-38 1-50 3-7 9-10 29-10s26 3 29 10c5 12 4 32 1 50z" fill="#dc0000" />
        <path d="M41 24.5c0-2 1.4-3 3-3s3 1 3 3v17c0 2-1.4 3-3 3s-3-1-3-3zM52.4 23.5c0-2 1.4-3 3-3s3 1 3 3v18.6c0 2-1.4 3-3 3s-3-1-3-3zM63.6 23.5c0-2 1.4-3 3-3s3 1 3 3v18.6c0 2-1.4 3-3 3s-3-1-3-3zM75 24.5c0-2 1.4-3 3-3s3 1 3 3v17c0 2-1.4 3-3 3s-3-1-3-3z" fill="#7d0000" />
        {/* assento */}
        <path d="M22 79c4-7 12-10 38-10s34 3 38 10c-6 6-20 8-38 8s-32-2-38-8z" fill="#ff2a1f" />
        {/* braços */}
        <path d="M31 46c-7 1-13 6-15 13-2 6 1 15 6 20l6-1c-4-5-6-12-4-17 1.6-4 5-7 9-7.6zM89 46c7 1 13 6 15 13 2 6-1 15-6 20l-6-1c4-5 6-12 4-17-1.6-4-5-7-9-7.6z" fill="#dc0000" />
        {/* pernas da frente */}
        <path d="M22 79l-6 42h8l8-39M98 79l6 42h-8l-8-39" fill="#dc0000" />
        <path d="M36 15c-3 5-4.6 14-4.4 24M27 84.5c8 3.4 22 4.4 34 4" stroke="rgba(255,255,255,.55)" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

/** Globo de espelhos (Divas Pop). */
export function Globo({ className, style }: { className?: string; style?: CSSProperties }) {
  const rows = [-15, -9, -3, 3, 9, 15];
  return (
    <svg viewBox="0 0 64 72" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="globo-g" cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".35" stopColor="#d9d6e3" />
          <stop offset=".75" stopColor="#8e889e" />
          <stop offset="1" stopColor="#3d3748" />
        </radialGradient>
        <clipPath id="globo-c">
          <circle cx="32" cy="42" r="23" />
        </clipPath>
      </defs>
      <path d="M32 0v16" stroke="#cfc9db" strokeWidth="1.6" />
      <rect x="28.5" y="15" width="7" height="5" rx="1.4" fill="#9a93aa" stroke={K} strokeWidth="1.6" />
      <circle cx="32" cy="42" r="23" fill="url(#globo-g)" />
      <g clipPath="url(#globo-c)" stroke="rgba(36,22,13,.35)" strokeWidth="1" fill="none">
        {rows.map((y) => (
          <ellipse key={y} cx="32" cy={42 + y} rx="25" ry={3 + Math.abs(y) * 0.05} />
        ))}
        {[-18, -12, -6, 0, 6, 12, 18].map((x) => (
          <ellipse key={x} cx={32 + x * 0.2} cy="42" rx={Math.abs(x) * 1.25 + 0.5} ry="23" />
        ))}
      </g>
      <g clipPath="url(#globo-c)">
        <rect x="18" y="27" width="6" height="5" fill="#fff" opacity=".9" />
        <rect x="25" y="33" width="5" height="5" fill="#ffd6ef" opacity=".9" />
        <rect x="37" y="45" width="5" height="5" fill="#fff" opacity=".55" />
        <rect x="20" y="47" width="5" height="5" fill="#ffd6ef" opacity=".55" />
      </g>
      <circle cx="32" cy="42" r="23" fill="none" stroke={K} strokeWidth="2.4" />
    </svg>
  );
}

export function Limao({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <g stroke={K} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="32" cy="32" r="26" fill="#7cc242" />
        <circle cx="32" cy="32" r="21" fill="#e3f4c4" strokeWidth="1.8" />
        <path d="M32 13v38M13 32h38M18.6 18.6l26.8 26.8M45.4 18.6 18.6 45.4" stroke="#b6dd84" strokeWidth="2.2" />
        <circle cx="32" cy="32" r="3" fill="#fff" strokeWidth="1.4" />
        <path d="M14 26a19 19 0 0 1 9-10" stroke="rgba(255,255,255,.8)" strokeWidth="2.4" fill="none" />
      </g>
    </svg>
  );
}

export function Cubo({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <g stroke={K} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <rect x="12" y="12" width="40" height="40" rx="9" fill="#e6f6ff" transform="rotate(-12 32 32)" />
        <path d="M21 24c2-4 6-6 10-6.4M20 30v5" stroke="#fff" strokeWidth="3.4" />
      </g>
    </svg>
  );
}

/** Brilho de 4 pontas (glitter das Divas). */
export function Brilho({ className, style, color = "#fff" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0c.8 6.6 4.8 10.8 12 12-7.2 1.2-11.2 5.4-12 12-.8-6.6-4.8-10.8-12-12 7.2-1.2 11.2-5.4 12-12z" fill={color} />
    </svg>
  );
}

/** Faixa vermelha do logo com "Mamadi" (marca pequena do topo). */
export function Faixa({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 168 46" className={className} style={style} role="img" aria-label="Mamadi">
      <g stroke="#fff4e6" strokeWidth="2.4" strokeLinejoin="round">
        <path d="M24 12 3 15l6 10-6 10 23-2z" fill="#9e0b06" />
        <path d="M144 12l21 3-6 10 6 10-23-2z" fill="#9e0b06" />
        <path d="M18 8c22-6 110-6 132 0v28c-22-6-110-6-132 0z" fill="#e3140b" />
      </g>
      <path d="M20 10c22-5 106-5 128 0v6c-22-4-106-4-128 0z" fill="rgba(255,255,255,.14)" />
      <text
        x="84"
        y="31"
        textAnchor="middle"
        fontFamily="Lilita One, sans-serif"
        fontSize="27"
        letterSpacing=".5"
        fill="#fffaf0"
        stroke="#5e0a05"
        strokeWidth="4.2"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        Mamadi
      </text>
    </svg>
  );
}
