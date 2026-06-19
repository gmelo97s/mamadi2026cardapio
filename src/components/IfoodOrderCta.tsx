import { SiIfood } from "react-icons/si";
import { business } from "../data/menu";

interface IfoodOrderCtaProps {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function IfoodCtaArrow() {
  return (
    <svg
      className="ifood-cta-arrow ifood-order-cta__arrow"
      width="28"
      height="10"
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

export default function IfoodOrderCta({ className = "", onClick }: IfoodOrderCtaProps) {
  return (
    <a
      href={business.ifoodUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir no iFood"
      className={`ifood-order-cta font-ifood ${className}`}
      onClick={onClick}
    >
      <span className="ifood-order-cta__icon" aria-hidden>
        <SiIfood className="h-3.5 w-3.5" />
      </span>
      <span className="ifood-order-cta__label">Pedir no iFood</span>
      <IfoodCtaArrow />
    </a>
  );
}
