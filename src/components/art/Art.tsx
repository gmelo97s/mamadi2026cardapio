/*
 * Ilustrações do cardápio, desenhadas à mão em SVG no traço do mascote:
 * contorno grosso marrom-escuro, cores chapadas e um brilho branco.
 * Enquanto não há fotos, cada item usa uma delas (src/data/menu.ts → art).
 */
import type { ReactNode } from "react";
import type { ArtKey } from "../../data/types";

const K = "#24160d"; // tinta do contorno
const HL = "rgba(255,255,255,.62)"; // brilho

type P = { c?: string };

const Glass = ({ d }: { d: string }) => <path d={d} fill="rgba(255,255,255,.28)" />;

function Litrao({ c = "#e8332a" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="12" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <path d="M28.2 10.5h7.6v8.2c0 3.4 6.8 5.6 6.8 11.8v25.2c0 2.3-1.8 3.8-4 3.8H25.4c-2.2 0-4-1.5-4-3.8V30.5c0-6.2 6.8-8.4 6.8-11.8z" fill="#b5561a" />
      <path d="M21.4 37.5h21.2v12.6H21.4z" fill={c} />
      <path d="M26 41.5h12v4.6H26z" fill="#fff6e8" strokeWidth="1.6" />
      <path d="M27 4.8h10v5.7H27z" fill="#e2b53e" />
      <path d="M29.5 4.8v5.7M32 4.8v5.7M34.5 4.8v5.7" strokeWidth="1.1" />
      <path d="M25 31.5v4M25 52v3.5M30.5 13v5" stroke={HL} strokeWidth="2.2" />
    </>
  );
}

function Garrafa({ c = "#1f7a3a" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="11" ry="2" fill={K} opacity=".14" stroke="none" />
      <path d="M28.6 15h6.8v6.6c0 3 6 4.8 6 10.4v23.6c0 2.2-1.6 3.6-3.6 3.6H26.2c-2 0-3.6-1.4-3.6-3.6V32c0-5.6 6-7.4 6-10.4z" fill="#7a3b12" />
      <path d="M22.6 38h18.8v11.6H22.6z" fill={c} />
      <ellipse cx="32" cy="43.8" rx="5.6" ry="3.4" fill="#fff6e8" strokeWidth="1.6" />
      <path d="M27.6 9.8h8.8v5.2h-8.8z" fill="#d8d3c8" />
      <path d="M26.2 34v3M26.2 52.5v3" stroke={HL} strokeWidth="2.2" />
    </>
  );
}

function Longneck({ c = "#e2b33c" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="9" ry="1.8" fill={K} opacity=".14" stroke="none" />
      <path d="M29.4 9h5.2v12.5c0 2.6 4.6 4.4 4.6 9v25.2c0 2-1.4 3.3-3.2 3.3h-7.9c-1.8 0-3.2-1.3-3.2-3.3V30.5c0-4.6 4.5-6.4 4.5-9z" fill="#9b4a14" />
      <path d="M24.9 38.5h14.3v11H24.9z" fill={c} />
      <path d="M28.6 4.5h6.8v4.5h-6.8z" fill="#e2b53e" />
      <path d="M27.8 33v3.6M27.8 52.5v3M31 11v8" stroke={HL} strokeWidth="2" />
    </>
  );
}

function Lata({ c = "#d62828" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="13" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <path d="M20 14.5c0-2 5.4-3.6 12-3.6s12 1.6 12 3.6v40c0 2.4-5.4 4.4-12 4.4s-12-2-12-4.4z" fill={c} />
      <path d="M20 26c6 3.4 18 3.4 24-1.6M20 40c7 4 17 2 24-1.4" stroke="#fff6e8" strokeWidth="3.2" fill="none" />
      <ellipse cx="32" cy="14.5" rx="12" ry="3.6" fill="#d9d6cf" />
      <path d="M29 13.6h6" strokeWidth="2.2" />
      <path d="M23.5 20v6M23.5 44v8" stroke={HL} strokeWidth="2.2" />
    </>
  );
}

function Copao({ c = "#ff4f7b" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60.2" rx="12" ry="2" fill={K} opacity=".14" stroke="none" />
      <path d="M41 3.5 35.5 22" stroke={K} strokeWidth="4.6" />
      <path d="M41 3.5 35.5 22" stroke="#fff6e8" strokeWidth="2.2" strokeDasharray="2.6 2.6" />
      <path d="M15 19.5c3 9.6 4 26 5.6 36.2.3 1.9 2 3 3.9 3h15c1.9 0 3.6-1.1 3.9-3 1.6-10.2 2.6-26.6 5.6-36.2z" fill={c} opacity=".92" />
      <path d="M22.5 27.5h7v7h-7zM31.5 25h7.4v7.4h-7.4zM26 36h7v7h-7z" fill="#f4fbff" strokeWidth="1.8" />
      <path d="M13.2 12.8h37.6l-1.6 6.7H14.8z" fill="#f6efe2" />
      <Glass d="M18.6 22c1.6 8 2.6 20 3.6 30" />
      <path d="M18.4 23.5c1.2 7 2 17 3 27" stroke={HL} strokeWidth="2.2" fill="none" />
    </>
  );
}

function Caipirinha({ c = "#9bd14b" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="15" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <path d="M43.5 6.5 36 26" stroke={K} strokeWidth="4.2" />
      <path d="M43.5 6.5 36 26" stroke="#f2c14e" strokeWidth="2" />
      <path d="M14.5 26.5h35l-2.6 28.6c-.2 2.2-2 3.9-4.2 3.9H21.3c-2.2 0-4-1.7-4.2-3.9z" fill="#eaf6d6" />
      <path d="M16.6 40.5h30.8l-1.3 14.6c-.2 2-1.8 3.4-3.8 3.4H21.7c-2 0-3.6-1.4-3.8-3.4z" fill={c} opacity=".55" stroke="none" />
      <path d="M20 34.5c2-3 6-3 8 0M31 38c2.4-3.4 6.6-3.2 8.6.4M22 47c2.2-2.6 5.6-2.4 7.4.6" fill="none" strokeWidth="1.6" />
      <path d="M24.6 44.8a6 6 0 0 1 11.6 0z" fill="#7cc242" strokeWidth="1.8" />
      <path d="M36.5 51a5 5 0 0 1 9.4-1.2z" fill="#7cc242" strokeWidth="1.8" />
      <circle cx="46.5" cy="24.5" r="7.2" fill="#9bd14b" />
      <circle cx="46.5" cy="24.5" r="4.6" fill="#e3f4c4" strokeWidth="1.4" />
      <path d="M46.5 20v9M42 24.5h9" strokeWidth="1.1" />
      <path d="M19 30v20" stroke={HL} strokeWidth="2.4" />
    </>
  );
}

function Longdrink({ c = "#b7e4a3" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60.2" rx="11" ry="2" fill={K} opacity=".14" stroke="none" />
      <path d="M38 3 33.5 18" stroke={K} strokeWidth="4.2" />
      <path d="M38 3 33.5 18" stroke="#f72585" strokeWidth="2" />
      <path d="M21 13.5h22l-1.8 41.6c-.1 2.1-1.8 3.7-3.9 3.7H26.7c-2.1 0-3.8-1.6-3.9-3.7z" fill="#eef7ff" />
      <path d="M21.8 24h20.4l-1.3 31c-.1 2-1.7 3.5-3.7 3.5H26.8c-2 0-3.6-1.5-3.7-3.5z" fill={c} opacity=".8" stroke="none" />
      <path d="M25 30h6v6h-6zM32 36.5h6v6h-6zM26 44h6v6h-6z" fill="#f4fbff" strokeWidth="1.6" />
      <path d="M22 16c4-6 9-6 11 0-4 2-8 2-11 0zM30 14c4-6 10-5 11 1-4 2-8 2-11-1z" fill="#3fa34d" strokeWidth="1.6" />
      <circle cx="43" cy="16.5" r="6" fill="#9bd14b" />
      <circle cx="43" cy="16.5" r="3.6" fill="#e3f4c4" strokeWidth="1.2" />
      <path d="M24.4 22v30" stroke={HL} strokeWidth="2.2" />
    </>
  );
}

function Dose({ c = "#f3e9d2" }: P) {
  return (
    <>
      <ellipse cx="32" cy="57.5" rx="12" ry="2" fill={K} opacity=".14" stroke="none" />
      <path d="M20.5 24h23l-2.3 29.4c-.1 1.6-1.4 2.8-3 2.8H25.8c-1.6 0-2.9-1.2-3-2.8z" fill="#f2f7fa" />
      <path d="M21.6 32h20.8l-1.4 16.5H23z" fill={c} stroke="none" />
      <path d="M22.9 48.5h18.2l-.3 4.9c-.1 1.6-1.4 2.8-3 2.8H25.8c-1.6 0-2.9-1.2-3-2.8z" fill="#dfe8ee" strokeWidth="1.8" />
      <path d="M21.6 32h20.8" strokeWidth="1.8" />
      <path d="M25 27v18" stroke={HL} strokeWidth="2.2" />
      <path d="M46 14l2-4M50 19l4-1.5M47.8 16.2l3.2-3" strokeWidth="2" />
    </>
  );
}

function Vinho({ c = "#7b1e3a" }: P) {
  return (
    <>
      <ellipse cx="30" cy="60" rx="16" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <path d="M21 6h6v12c0 2.6 5.2 4.6 5.2 10v27.4c0 2-1.6 3.4-3.6 3.4h-9.2c-2 0-3.6-1.4-3.6-3.4V28c0-5.4 5.2-7.4 5.2-10z" fill="#2d3b2a" />
      <path d="M15.8 36.5h16.4v13H15.8z" fill="#f6efe2" />
      <path d="M18.8 41h10.4M18.8 45h7" strokeWidth="1.6" />
      <path d="M20.6 3.5h6.8v3.4h-6.8z" fill={c} />
      <path d="M42 30c-4.6 0-7.2-3.5-7.2-8.4l1-9h12.4l1 9c0 4.9-2.6 8.4-7.2 8.4z" fill="#f2f7fa" />
      <path d="M35.4 20.5h13.2c.3 5-2.4 8.6-6.6 8.6s-6.9-3.6-6.6-8.6z" fill={c} stroke="none" />
      <path d="M42 30v20M36 51h12" />
      <path d="M18.6 30v4M18.6 52v3.5" stroke={HL} strokeWidth="2" />
    </>
  );
}

function Gelo({ c = "#dff3ff" }: P) {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="17" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M12.5 38.5l14-3.4 3.4 14-14 3.4z" fill={c} />
      <path d="M31.5 40.5l13.4-5.2 5.2 13.4-13.4 5.2z" fill={c} />
      <path d="M21.5 22.5l13.2-4.4 4.4 13.2-13.2 4.4z" fill={c} />
      <path d="M16 41.5l4-1M35 43l4-1.6M25.5 25l3.8-1.2" stroke="#fff" strokeWidth="2.2" />
    </>
  );
}

function Agua({ c = "#8ecae6" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="11" ry="2" fill={K} opacity=".14" stroke="none" />
      <path d="M28.5 12h7v4.5c0 2 6 3.2 6 8.6V55c0 2.2-1.8 3.8-4 3.8h-11c-2.2 0-4-1.6-4-3.8V25.1c0-5.4 6-6.6 6-8.6z" fill="#e8f6fc" />
      <path d="M22.5 34h19v12h-19z" fill={c} />
      <path d="M22.5 40c3-2 6-2 9.5 0s6.5 2 9.5 0" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M27.8 6.5h8.4V12h-8.4z" fill="#2a6fdb" />
      <path d="M26 27v4M26 49v4" stroke={HL} strokeWidth="2" />
    </>
  );
}

function Suco({ c = "#ff9f1c" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60.2" rx="12" ry="2" fill={K} opacity=".14" stroke="none" />
      <path d="M39 4.5 34 20" stroke={K} strokeWidth="4.2" />
      <path d="M39 4.5 34 20" stroke="#fff6e8" strokeWidth="2" />
      <path d="M19.5 16h25l-2.6 38.6c-.2 2.4-2.1 4.2-4.5 4.2H26.6c-2.4 0-4.3-1.8-4.5-4.2z" fill="#f4f9fb" />
      <path d="M20.4 24h23.2l-2 30.4c-.2 2.2-2 3.8-4.2 3.8H26.6c-2.2 0-4-1.6-4.2-3.8z" fill={c} stroke="none" />
      <path d="M20.4 24h23.2" strokeWidth="1.8" />
      <circle cx="43.5" cy="17" r="7.5" fill="#ffb627" />
      <circle cx="43.5" cy="17" r="5" fill="#ffe1a1" strokeWidth="1.3" />
      <path d="M43.5 12v10M38.5 17h10M40 13.5l7 7M47 13.5l-7 7" strokeWidth="1" />
      <path d="M23.6 27v24" stroke={HL} strokeWidth="2.2" />
    </>
  );
}

function LimaoSal({ c = "#9bd14b" }: P) {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="20" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M9 50a13 13 0 0 1 26 0z" fill={c} />
      <path d="M12 50a10 10 0 0 1 20 0z" fill="#e3f4c4" strokeWidth="1.4" />
      <path d="M22 41v9M15.8 44l6.2 6M28.2 44 22 50" strokeWidth="1.1" />
      <path d="M40 30c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4z" fill="#f6f8fb" />
      <path d="M40 26.5c0-5 12-5 12 0" fill="#c9ced6" />
      <path d="M44 22.5h1.2M47 21.6h1.2M45.4 19.4h1.2" strokeWidth="1.8" />
      <path d="M43.4 32v18" stroke={HL} strokeWidth="2" />
    </>
  );
}

function Pastel() {
  return (
    <>
      <ellipse cx="32" cy="57" rx="22" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M8 46c0-9.6 7.6-17 17.4-17S43 36.4 43 46z" fill="#f2b84b" transform="rotate(-8 25 40)" />
      <path d="M10.3 43.6l2.6 2.4 2.4-2.4 2.6 2.4 2.4-2.4 2.6 2.4 2.4-2.4 2.6 2.4 2.4-2.4 2.6 2.4 2.4-2.4 2.6 2.4 2.4-2.4" fill="none" strokeWidth="1.5" transform="rotate(-8 25 40)" />
      <path d="M24 49.5c0-8.4 6.6-15 15.2-15s15.2 6.6 15.2 15z" fill="#f6c661" transform="rotate(10 39 44)" />
      <path d="M26.2 47.4l2.4 2.2 2.2-2.2 2.4 2.2 2.2-2.2 2.4 2.2 2.2-2.2 2.4 2.2 2.2-2.2 2.4 2.2 2.2-2.2 2.4 2.2" fill="none" strokeWidth="1.4" transform="rotate(10 39 44)" />
      <path d="M17 36c2-2 4.6-3.2 7.4-3.4M33.5 40.5c2-1.6 4.4-2.4 6.8-2.4" stroke={HL} strokeWidth="2" />
    </>
  );
}

function Batata({ c }: P) {
  return (
    <>
      <ellipse cx="32" cy="59.5" rx="16" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <path d="M22 26 20 8.5l4.6-.6 1.4 17M27.5 25.5l.2-19.6h4.6l-.4 19.6M33.6 25.6l2.6-17.8 4.6.7-2.4 17.2M38.4 27l5.2-14.8 4.4 1.6-4.6 13.6M17.5 27l-4.4-13 4.4-1.6 4 13.2" fill="#ffcf4a" />
      <path d="M14.5 25.5h35l-4.4 31.4c-.2 1.6-1.6 2.8-3.2 2.8H22.1c-1.6 0-3-1.2-3.2-2.8z" fill="#e8332a" />
      <path d="M24 26v33M32 26v33M40 26v33" stroke="#fff6e8" strokeWidth="3" />
      <path d="M14.5 25.5h35l-4.4 31.4c-.2 1.6-1.6 2.8-3.2 2.8H22.1c-1.6 0-3-1.2-3.2-2.8z" fill="none" />
      {c && (
        <>
          <path d="M16 25.5c2.6 6 6 1.4 8.4 5.6 2.4 4.4 5-3.2 8 1.4 3 4.6 5-2.2 7.6.8 2.4 2.8 4-2 7.8-7.8z" fill={c} strokeWidth="1.8" />
          <path d="M21 21l2.4.8M30 19.5l2.6-.4M38 21.5l2 1.4" stroke="#8c2f1b" strokeWidth="2.8" />
        </>
      )}
    </>
  );
}

function Mandioca() {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="20" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M14 22.5l9.6-4 7 17-9.6 4zM28 16.5l9.8 2.8-4.8 18-9.8-2.8zM36.4 22l8.6 5.8-10.2 15.4-8.6-5.8z" fill="#f3d58a" />
      <path d="M18.6 22.5l5 12M30.6 20.5l-3.4 12.8M40 27.5l-7.2 10.6" stroke="#e6b65c" strokeWidth="1.6" />
      <path d="M9.5 38.5h45c0 10.6-9.4 19.2-22.5 19.2S9.5 49.1 9.5 38.5z" fill="#c9653a" />
      <path d="M12 44c4 6 11 9.6 20 9.6" stroke={HL} strokeWidth="2.2" fill="none" />
    </>
  );
}

function Calabresa() {
  return (
    <>
      <ellipse cx="32" cy="58" rx="25" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <ellipse cx="32" cy="44" rx="26" ry="12" fill="#f6efe2" />
      <ellipse cx="32" cy="43" rx="20" ry="8.2" fill="none" strokeWidth="1.2" opacity=".5" />
      <circle cx="21" cy="40.5" r="6.4" fill="#c0392b" />
      <circle cx="21" cy="40.5" r="4" fill="#e8806f" strokeWidth="1.4" />
      <circle cx="33.5" cy="37" r="6.4" fill="#c0392b" />
      <circle cx="33.5" cy="37" r="4" fill="#e8806f" strokeWidth="1.4" />
      <circle cx="43.5" cy="44" r="6.4" fill="#c0392b" />
      <circle cx="43.5" cy="44" r="4" fill="#e8806f" strokeWidth="1.4" />
      <circle cx="29" cy="47.5" r="6.2" fill="#c0392b" />
      <circle cx="29" cy="47.5" r="3.8" fill="#e8806f" strokeWidth="1.4" />
      <path d="M12 46c4-4 9-4 12 .4M36 33c3-3 8.6-3 11 .6M38 52.5c3-2.6 7.4-2.4 9.6.6" fill="none" stroke="#a0447e" strokeWidth="2.2" />
      <path d="M18.4 38.5l1.6-1M31 35l1.6-1" stroke={HL} strokeWidth="1.6" />
    </>
  );
}

function Espeto() {
  return (
    <>
      <ellipse cx="32" cy="58" rx="22" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <path d="M8 54 56 8" stroke={K} strokeWidth="4.4" />
      <path d="M8 54 56 8" stroke="#d9a35b" strokeWidth="2" />
      <rect x="11.5" y="38" width="12" height="12" rx="3" fill="#8b4a2b" transform="rotate(-44 17.5 44)" />
      <rect x="21" y="28.5" width="11" height="11" rx="4" fill="#f6efe2" transform="rotate(-44 26.5 34)" />
      <rect x="29.5" y="20" width="12" height="12" rx="3" fill="#8b4a2b" transform="rotate(-44 35.5 26)" />
      <rect x="39" y="11" width="10" height="10" rx="3" fill="#e8332a" transform="rotate(-44 44 16)" />
      <path d="M14.5 42l4 4M33 23.5l4 4" stroke="#5a2a14" strokeWidth="1.6" />
    </>
  );
}

function Couvert() {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="26" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M6 45c0-4 5-6 11-6s11 2 11 6c0 5-4.6 9-11 9S6 50 6 45z" fill="#c9653a" />
      <circle cx="12.5" cy="44" r="3.2" fill="#556b2f" />
      <circle cx="19" cy="42.6" r="3.2" fill="#2d3b2a" />
      <circle cx="21" cy="47.5" r="3.2" fill="#556b2f" />
      <path d="M33 46c0-4 5-6 11.4-6S56 42 56 46c0 5-4.6 9-11.4 9S33 51 33 46z" fill="#c9653a" />
      <path d="M37 45.5c2-3 4-2 6-3.6 2.4-1.8 5.4-.8 8 1.6-2.4 3-6 4.4-9 4-2.4-.2-3.6-.6-5-2z" fill="#b5341f" strokeWidth="1.6" />
      <path d="M20 26c0-6.6 5.4-10 12-10s12 3.4 12 10c0 2-1 3.4-2.6 3.4H22.6C21 29.4 20 28 20 26z" fill="#e5b56b" />
      <path d="M24 22l3 2M30 20.5l2.6 2M37 22l-2.4 2" stroke="#b37a35" strokeWidth="1.8" />
      <rect x="25" y="31" width="5.4" height="5.4" rx="1" fill="#fff3c4" strokeWidth="1.6" />
      <rect x="32.6" y="32.6" width="5.4" height="5.4" rx="1" fill="#fff3c4" strokeWidth="1.6" />
    </>
  );
}

function Pao() {
  return (
    <>
      <ellipse cx="32" cy="57" rx="22" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M8 44c0-9 8-15 16-15s14 5 14 12c0 4-2 7.6-6 8.6l-18 2.6C10 52.6 8 49 8 44z" fill="#e5b56b" />
      <path d="M13.6 42.6c1-6 6-9.4 11.4-9.4" stroke="#b37a35" strokeWidth="1.8" fill="none" />
      <path d="M26 49c0-9 8-15 16-15s14 5 14 12c0 4-2 7.6-6 8.6l-18 2.6C28 57.6 26 54 26 49z" fill="#efc77c" />
      <path d="M32 44.5l2-1M38 41.5l2.4.4M44.6 43l1.4 1.8M36 48.5l1.8 1.2M42.6 48l2-.4" stroke="#3f7d3a" strokeWidth="2.2" />
      <path d="M31.6 47.6c1-6 6-9.4 11.4-9.4" stroke={HL} strokeWidth="2" fill="none" />
    </>
  );
}

function Coxinha() {
  const one = (x: number, y: number, s: number, r: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0-19c3 4 11.6 12.6 11.6 21.4 0 6.8-5.2 11.6-11.6 11.6S-11.6 9.2-11.6 2.4C-11.6-6.4-3-15 0-19z" fill="#d98a36" />
      <path d="M-5 4l1 0M4-2l1 .6M-1-8l.8.6M5 7l.8 0M-7-3l1 .4" stroke="#a65a1f" strokeWidth="2.2" />
      <path d="M-6-4c1.6-3.6 3.4-6.4 5.2-8.6" stroke={HL} strokeWidth="2" fill="none" />
    </g>
  );
  return (
    <>
      <ellipse cx="32" cy="58" rx="22" ry="2.4" fill={K} opacity=".14" stroke="none" />
      {one(22, 41, 1, -10, "a")}
      {one(42, 43, 0.92, 12, "b")}
    </>
  );
}

function Lanche() {
  return (
    <>
      <ellipse cx="32" cy="57.5" rx="26" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M7 41c0-3 2-5 5-5h40c3 0 5 2 5 5 0 6-4 11-10 11H17C11 52 7 47 7 41z" fill="#e5b56b" />
      <path d="M8.5 37.5c3-1.6 4.6 1.8 7.6 0s4.6 1.8 7.6 0 4.6 1.8 7.6 0 4.6 1.8 7.6 0 4.6 1.8 7.6 0 4.6 1.8 7.6 0" fill="none" stroke="#5fa83a" strokeWidth="3.2" />
      <path d="M10 34h44" stroke="#c0392b" strokeWidth="5.4" />
      <path d="M10 31.4c2.2 1 4.4 1 6.6 0M20.6 31.4c2.2 1 4.4 1 6.6 0M31.2 31.4c2.2 1 4.4 1 6.6 0" stroke="#fff3c4" strokeWidth="1.6" />
      <path d="M9 30c0-7 9.4-13 23-13s23 6 23 13c0 1.6-1.2 2.6-2.8 2.6H11.8C10.2 32.6 9 31.6 9 30z" fill="#efc77c" />
      <path d="M19 22l3 3M29 20l2.6 3.6M40 21.5l2.4 3.4" stroke="#b37a35" strokeWidth="2" />
      <path d="M15 26c3.6-4 9-6 15-6.4" stroke={HL} strokeWidth="2.2" fill="none" />
    </>
  );
}

function Burger() {
  return (
    <>
      <ellipse cx="32" cy="59" rx="22" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M11 49h42c0 4.4-3.6 8-8 8H19c-4.4 0-8-3.6-8-8z" fill="#e8a14c" />
      <path d="M10 44.5h44c1.6 0 2.6 1.2 2.6 2.4 0 1.4-1 2.4-2.6 2.4H10c-1.6 0-2.6-1-2.6-2.4 0-1.2 1-2.4 2.6-2.4z" fill="#5a2a14" />
      <path d="M9 40.5h46l-6 6.6-5-4.4-5 5.2-5-5-5 5-5-5.2-5 4.6z" fill="#ffc533" strokeWidth="2" />
      <path d="M8.6 38.4c3-2 5 2 8.2 0s5 2 8.2 0 5 2 8.2 0 5 2 8.2 0 5 2 8.2 0 5 2 6.8.4" fill="none" stroke="#5fa83a" strokeWidth="3.4" />
      <path d="M9 34.5C9 22 19.4 13 32 13s23 9 23 21.5c0 1.6-1.2 2.8-2.8 2.8H11.8C10.2 37.3 9 36.1 9 34.5z" fill="#eaa451" />
      <path d="M22 21.5l2.4 1M30 18.6l2.6.2M39 21l2.2 1.4M26 27l2.4.6M35 26l2.4.2M44 27.5l2 1" stroke="#fff6e8" strokeWidth="2.2" />
      <path d="M14.6 30c1.6-6 6.4-10.4 12-12" stroke={HL} strokeWidth="2.2" fill="none" />
    </>
  );
}

function Tabua() {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="27" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M4 42c0-8 12.6-14 28-14s28 6 28 14-12.6 14-28 14S4 50 4 42z" fill="#c98a4b" />
      <path d="M58 41.5h4.6c1 0 1.4.8 1 1.6l-.8 1.2c-.4.6-1 .8-1.6.8H58" fill="#c98a4b" strokeWidth="2" />
      <path d="M10 44c4 4.4 12.6 7.4 22 7.4M18 34c4-1.2 9-1.8 14-1.8" stroke="#a96a32" strokeWidth="1.6" fill="none" />
      <path d="M14 38.5l3.2-12 3.4 1-2.4 12M19.6 39l1.6-13.4 3.4.4-.8 13.4M24.5 39l3.6-11.4 3.2 1.2-3.2 10.6" fill="#ffcf4a" strokeWidth="1.8" />
      <circle cx="38" cy="38" r="5" fill="#c0392b" strokeWidth="2" />
      <circle cx="38" cy="38" r="2.8" fill="#e8806f" strokeWidth="1.2" />
      <circle cx="47" cy="41.5" r="5" fill="#c0392b" strokeWidth="2" />
      <circle cx="47" cy="41.5" r="2.8" fill="#e8806f" strokeWidth="1.2" />
      <path d="M26 44c0-2.4 3-4 6.6-4s6.4 1.6 6.4 4-2.8 4-6.4 4-6.6-1.6-6.6-4z" fill="#8b4a2b" strokeWidth="2" />
      <path d="M29 43.2l6-1" stroke="#5a2a14" strokeWidth="1.4" />
    </>
  );
}

function Prato() {
  return (
    <>
      <ellipse cx="32" cy="57.5" rx="27" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <ellipse cx="32" cy="41" rx="28" ry="15" fill="#f6efe2" />
      <ellipse cx="32" cy="40" rx="21" ry="10.6" fill="none" strokeWidth="1.2" opacity=".45" />
      <path d="M12 39c0-5 4.6-8 10-8s9 3 9 7.4c0 3.6-4 6-9.6 6S12 42.6 12 39z" fill="#fffdf6" strokeWidth="2" />
      <path d="M16 36.5l1.4.4M20.5 35l1.4.2M24 37.5l1.2.6M18 40l1.4.2M23 40.5l1.2.2" stroke="#d9cfba" strokeWidth="1.6" />
      <path d="M28.5 46c0-4 4.4-6.6 9.4-6.6s8.4 2.4 8.4 6c0 3.4-3.8 5.6-8.6 5.6s-9.2-2-9.2-5z" fill="#6b3a1e" strokeWidth="2" />
      <path d="M33 45.5l1.4-.6M37.6 47.6l1.6-.2M41.4 44.6l1.2.4" stroke="#a96a32" strokeWidth="1.6" />
      <path d="M33 31c2-4.6 8.6-6.4 14-4.6 5 1.6 6.6 6 3.6 9.2-3.4 3.6-11 3.6-15.2 1.6-2.6-1.2-3.4-3.6-2.4-6.2z" fill="#8b4a2b" strokeWidth="2" />
      <path d="M37 29.6l9 6M41 28l7.4 5" stroke="#5a2a14" strokeWidth="1.6" />
      <path d="M11.5 46.5c1.6 2.4 4.4 3.6 7.4 3.6s5.6-1.2 6.6-3.6c-3.4-1-10.4-1-14 0z" fill="#e3c27a" strokeWidth="1.8" />
      <path d="M48 46l1.6.4M51 44l1.4 1M49.6 48.4l1.6-.4" stroke="#e8332a" strokeWidth="2.4" />
      <path d="M50.4 46.4l1.2.2" stroke="#3f7d3a" strokeWidth="2.4" />
    </>
  );
}

function Baiao() {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="25" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M44 22.5l9-3.6 4.8 12-9 3.6zM47 31.4l8.6 1.6-2.4 12.6-8.6-1.6z" fill="#f3d58a" strokeWidth="2" />
      <path d="M8 32c0-3.6 10.8-6 24-6s24 2.4 24 6" fill="#e9dcc2" />
      <path d="M8.6 33c3.2 2 6.4-1 9.4 1.2 3 2.2 6-1.4 9 .6s6.2-1.6 9.4.4 6.2-1.2 9.2.8 6.2-1 9.8-1" fill="none" strokeWidth="1.8" />
      <path d="M17 29.5l1.6.4M24 28l1.4.6M31 29.6l1.6-.2M38 28.2l1.4.6M45 29.8l1.6-.2M21 31.6l1.4.2M35 31.8l1.4-.2" stroke="#6b3a1e" strokeWidth="2.4" />
      <path d="M28 27.6l1.2-1M41 27l1.2.6" stroke="#3f7d3a" strokeWidth="2.4" />
      <path d="M7.4 32.6h49.2c0 13-11 23.2-24.6 23.2S7.4 45.6 7.4 32.6z" fill="#b5562b" />
      <path d="M12 38c3.4 8 11 12.6 20 12.6" stroke={HL} strokeWidth="2.2" fill="none" />
      <path d="M16 42.5h4M44 42.5h4" stroke="#7a3214" strokeWidth="2" />
    </>
  );
}

function Berinjela() {
  return (
    <>
      <ellipse cx="32" cy="58.5" rx="20" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M24.6 17.4c5.4-1 9.8 2.2 11.4 7.4 1.8 5.6 6.6 8 10.4 13.4 4.2 6 2.6 14.4-4.4 17.4-7.6 3.4-15.6-.4-18.8-7.6-2.4-5.4.6-9.4-.6-15-1-4.6-4.8-14.4 2-15.6z" fill="#5e2b7e" />
      <path d="M21.6 18c2.6-2 6.4-2.6 9.6-1.4 1.6-2.2 4.2-2.4 5.6-1-1.8.8-2.8 2.4-3 4.2-2.6-1.6-6-1.8-8.4-.4-1.4-1.2-2.4-1.6-3.8-1.4z" fill="#4f8f3a" />
      <path d="M31.2 16.6c-.4-4 1-7.4 3.6-9" stroke={K} strokeWidth="3" />
      <path d="M31.2 16.6c-.4-4 1-7.4 3.6-9" stroke="#4f8f3a" strokeWidth="1.4" />
      <path d="M28 30c-.6 5.6 1.4 12 5.6 16" stroke={HL} strokeWidth="2.4" fill="none" />
    </>
  );
}

function Molho({ c = "#f6e7b5" }: P) {
  return (
    <>
      <ellipse cx="32" cy="58" rx="18" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M13 34h38l-3.6 19.6c-.4 2.2-2.4 3.8-4.6 3.8H21.2c-2.2 0-4.2-1.6-4.6-3.8z" fill="#f6f8fb" />
      <ellipse cx="32" cy="34" rx="19" ry="5.4" fill={c} />
      <ellipse cx="44" cy="34" rx="7.4" ry="2.6" fill="#7a2a14" strokeWidth="1.6" />
      <path d="M20 32.6c3-1.6 7-2 11-1.6" stroke={HL} strokeWidth="2" />
      <path d="M17.6 40v10" stroke={HL} strokeWidth="2.2" />
    </>
  );
}

function Queijo() {
  return (
    <>
      <ellipse cx="32" cy="57.5" rx="22" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <path d="M10 37 46 22l8 12v16H10z" fill="#ffd34d" />
      <path d="M10 37h44" />
      <ellipse cx="22" cy="45" rx="3.6" ry="3" fill="#f2b81c" strokeWidth="1.6" />
      <ellipse cx="38" cy="43" rx="2.6" ry="2.2" fill="#f2b81c" strokeWidth="1.6" />
      <ellipse cx="45" cy="47.5" rx="2.2" ry="1.8" fill="#f2b81c" strokeWidth="1.6" />
      <circle cx="35" cy="31" r="2" fill="#f2b81c" strokeWidth="1.4" />
    </>
  );
}

function Abacaxi() {
  return (
    <>
      <ellipse cx="32" cy="57.5" rx="20" ry="2.4" fill={K} opacity=".14" stroke="none" />
      <circle cx="32" cy="36" r="19" fill="#ffd43b" />
      <circle cx="32" cy="36" r="15" fill="none" stroke="#f5b700" strokeWidth="2.2" />
      <circle cx="32" cy="36" r="5.4" fill="#fff3b0" strokeWidth="2" />
      <path d="M32 21.5v8.6M32 41.4V50M17.5 36h8.6M37.9 36h8.6M21.8 25.8l6 6M36.2 40.2l6 6M42.2 25.8l-6 6M27.8 40.2l-6 6" stroke="#f5b700" strokeWidth="1.6" />
    </>
  );
}

function Vinil({ c = "#fc00a0" }: P) {
  return (
    <>
      <ellipse cx="32" cy="60" rx="20" ry="2.2" fill={K} opacity=".14" stroke="none" />
      <circle cx="32" cy="33" r="25" fill="#151012" />
      <circle cx="32" cy="33" r="20" fill="none" stroke="#3a3135" strokeWidth="1" />
      <circle cx="32" cy="33" r="16" fill="none" stroke="#3a3135" strokeWidth="1" />
      <circle cx="32" cy="33" r="12.5" fill="none" stroke="#3a3135" strokeWidth="1" />
      <circle cx="32" cy="33" r="9" fill={c} />
      <circle cx="32" cy="33" r="1.8" fill="#151012" stroke="none" />
      <path d="M15 22a20 20 0 0 1 9-8.4" stroke="rgba(255,255,255,.45)" strokeWidth="2.4" fill="none" />
    </>
  );
}

const ART: Record<ArtKey, (p: P) => ReactNode> = {
  litrao: Litrao,
  garrafa: Garrafa,
  longneck: Longneck,
  lata: Lata,
  copao: Copao,
  caipirinha: Caipirinha,
  longdrink: Longdrink,
  dose: Dose,
  vinho: Vinho,
  gelo: Gelo,
  agua: Agua,
  suco: Suco,
  limaosal: LimaoSal,
  pastel: Pastel,
  batata: Batata,
  mandioca: Mandioca,
  calabresa: Calabresa,
  espeto: Espeto,
  couvert: Couvert,
  pao: Pao,
  coxinha: Coxinha,
  lanche: Lanche,
  burger: Burger,
  tabua: Tabua,
  prato: Prato,
  baiao: Baiao,
  berinjela: Berinjela,
  molho: Molho,
  queijo: Queijo,
  abacaxi: Abacaxi,
  vinil: Vinil,
};

export function Art({ k, color, className, title }: { k: ArtKey; color?: string; className?: string; title?: string }) {
  const Comp = ART[k];
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <g stroke={K} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <Comp c={color} />
      </g>
    </svg>
  );
}

