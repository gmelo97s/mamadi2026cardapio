import { SiIfood } from "react-icons/si";
import { business } from "../data/menu";

interface IfoodHeaderLinkProps {
  size?: number;
  className?: string;
}

function IfoodStraightArrow() {
  return (
    <svg
      className="ifood-cta-arrow"
      width="40"
      height="12"
      viewBox="0 0 40 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M 1 6 H 30 M 24 2 L 33 6 L 24 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IfoodHeaderLink({
  size = 24,
  className = "",
}: IfoodHeaderLinkProps) {
  return (
    <a
      href={business.ifoodUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Bateu a fome? Pedir no iFood"
      className={`group inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 ${className}`}
    >
      <span className="hidden min-[380px]:flex flex-col items-end gap-0.5">
        <span className="font-ifood text-xs font-extrabold tracking-tight text-white sm:text-sm">
          Bateu a fome?
        </span>
        <IfoodStraightArrow />
      </span>
      <span
        className="ifood-header-btn inline-flex shrink-0 items-center justify-center rounded-xl text-white"
        style={{ width: size + 12, height: size + 12 }}
      >
        <SiIfood style={{ width: size, height: size }} />
      </span>
    </a>
  );
}
