import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
}

/** Traços internos ( sulcos ) da bola — painel rainbow principal */
const GROOVE_MAIN = [
  "M 212,122 C 268,108 338,126 358,154",
  "M 208,136 C 262,124 330,140 352,166",
  "M 204,150 C 256,140 322,156 344,178",
  "M 200,164 C 250,156 312,172 332,192",
  "M 196,178 C 244,170 302,186 318,204",
  "M 192,192 C 236,184 288,198 302,214",
  "M 188,206 C 228,198 274,212 284,224",
  "M 218,106 C 278,92 352,112 368,150",
  "M 248,252 C 198,228 190,186 C 184,152 192,122 218,106",
];

/** Sulcos do painel secundário inferior-esquerda */
const GROOVE_SECONDARY = [
  "M 128,172 C 152,158 182,154 200,166",
  "M 124,182 C 148,172 174,170 192,180",
  "M 120,192 C 142,184 166,184 182,192",
  "M 118,168 C 142,148 178,142 210,158",
];

function BallNeonEffect() {
  return (
    <div className="hero-ball-effect" aria-hidden>
      <svg
        className="hero-ball-effect__svg"
        viewBox="0 0 400 280"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="heroBallClip">
            <ellipse cx="200" cy="142" rx="186" ry="128" />
          </clipPath>

          <linearGradient
            id="heroNeonLgbt"
            gradientUnits="userSpaceOnUse"
            x1="100"
            y1="100"
            x2="340"
            y2="220"
          >
            <stop offset="0%" stopColor="#ff1744" />
            <stop offset="16%" stopColor="#ff9100" />
            <stop offset="32%" stopColor="#ffea00" />
            <stop offset="48%" stopColor="#00e676" />
            <stop offset="64%" stopColor="#2979ff" />
            <stop offset="80%" stopColor="#d500f9" />
            <stop offset="100%" stopColor="#ff4081" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-80 0; 80 0; -80 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>

          <filter id="heroNeonRaceGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.2 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g clipPath="url(#heroBallClip)">
          {GROOVE_MAIN.map((d, i) => (
            <g key={`main-${i}`}>
              <path
                d={d}
                className="hero-ball-race hero-ball-race--trail"
                pathLength={1}
                style={{ animationDelay: `${i * -0.42}s` }}
              />
              <path
                d={d}
                className="hero-ball-race hero-ball-race--core"
                pathLength={1}
                style={{ animationDelay: `${i * -0.42}s` }}
                filter="url(#heroNeonRaceGlow)"
              />
            </g>
          ))}

          {GROOVE_SECONDARY.map((d, i) => (
            <g key={`sec-${i}`}>
              <path
                d={d}
                className="hero-ball-race hero-ball-race--trail"
                pathLength={1}
                style={{ animationDelay: `${i * -0.55 - 1.2}s` }}
              />
              <path
                d={d}
                className="hero-ball-race hero-ball-race--core"
                pathLength={1}
                style={{ animationDelay: `${i * -0.55 - 1.2}s` }}
                filter="url(#heroNeonRaceGlow)"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="hero-section relative h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-black">
      <div className="hero-visual">
        <motion.div
          className="hero-visual__frame"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/hero.png"
            alt="Cerveja Mamadi Pride Edition com bola de futebol"
            className="hero-visual__photo"
            draggable={false}
          />
          <BallNeonEffect />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="absolute bottom-[14%] left-0 right-0 z-[3] flex justify-center px-6 sm:bottom-[15%] md:bottom-[16%]"
      >
        <motion.button
          onClick={onExplore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="cta-btn flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase shadow-[0_0_30px_rgba(255,64,129,0.4)]"
        >
          Conhecer Cardápio
          <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </motion.button>
      </motion.div>
    </section>
  );
}
