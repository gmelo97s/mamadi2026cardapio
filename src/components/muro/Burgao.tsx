/**
 * O hambúrguer vermelho do muro, redesenhado em camadas (pão, queijo, carne, pão)
 * com a borda áspera do spray. Cada camada quica separada quando ele entra.
 */
export function Burgao({ className = "" }: { className?: string }) {
  return (
    <svg className={`burgao ${className}`} viewBox="0 0 300 300" aria-hidden="true">
      <defs>
        <filter id="burgao-spray" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id="burgao-pao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a45" />
          <stop offset="1" stopColor="#e2401f" />
        </linearGradient>
        <linearGradient id="burgao-carne" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d23a22" />
          <stop offset="1" stopColor="#a8261a" />
        </linearGradient>
      </defs>
      <g filter="url(#burgao-spray)" stroke="#120d10" strokeWidth="5" strokeLinejoin="round">
        {/* pão de baixo */}
        <g className="burgao__l burgao__l--4">
          <path d="M42 218h216c6 0 10 5 9 11-4 26-32 42-60 42H93c-28 0-56-16-60-42-1-6 3-11 9-11z" fill="url(#burgao-pao)" />
        </g>
        {/* carne */}
        <g className="burgao__l burgao__l--3">
          <rect x="30" y="178" width="240" height="40" rx="20" fill="url(#burgao-carne)" />
          <path d="M58 192h40M120 200h34M178 190h46" stroke="#7a1c12" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
        {/* queijo escorrendo */}
        <g className="burgao__l burgao__l--2">
          <path d="M36 160h228c5 0 8 4 6 9l-6 12-14-4-12 18-14-17-30 9-14-10-26 14-20-14-24 10-14-12-26 8-12-12-14 2-7-10c-2-5 1-9 6-9z" fill="#ffb21e" />
        </g>
        {/* pão de cima */}
        <g className="burgao__l burgao__l--1">
          <path d="M40 160c-6 0-10-6-8-12C46 92 92 52 150 52s104 40 118 96c2 6-2 12-8 12z" fill="url(#burgao-pao)" />
          <path d="M84 96c18-20 40-28 62-30" stroke="#ffd2b8" strokeWidth="9" strokeLinecap="round" fill="none" opacity=".75" />
          <g fill="#fff4e3" stroke="none">
            <ellipse cx="112" cy="104" rx="7" ry="4" transform="rotate(-20 112 104)" />
            <ellipse cx="150" cy="86" rx="7" ry="4" />
            <ellipse cx="190" cy="104" rx="7" ry="4" transform="rotate(20 190 104)" />
            <ellipse cx="132" cy="128" rx="7" ry="4" transform="rotate(10 132 128)" />
            <ellipse cx="174" cy="130" rx="7" ry="4" transform="rotate(-12 174 130)" />
            <ellipse cx="216" cy="130" rx="6" ry="3.5" transform="rotate(28 216 130)" />
            <ellipse cx="86" cy="132" rx="6" ry="3.5" transform="rotate(-28 86 132)" />
          </g>
        </g>
      </g>
      {/* risquinhos de traço, como no muro */}
      <path d="M24 92l-14-8M22 120H6M276 92l14-8M278 120h16" stroke="#fff4e3" strokeWidth="4" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
