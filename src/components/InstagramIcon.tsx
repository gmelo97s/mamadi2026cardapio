import { FaInstagram } from "react-icons/fa";
import { business } from "../data/menu";

interface InstagramIconProps {
  variant?: "floating" | "header";
  className?: string;
  size?: number;
}

/** Cores oficiais do Instagram — gradiente rosa/laranja/roxo. */
export default function InstagramIcon({
  variant = "header",
  className = "",
  size = 24,
}: InstagramIconProps) {
  if (variant === "floating") {
    return (
      <a
        href={business.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram do Mamadi Food"
        className={`instagram-brand-btn flex items-center justify-center rounded-full text-white shadow-lg ${className}`}
        style={{ width: size + 32, height: size + 32 }}
      >
        <FaInstagram style={{ width: size, height: size }} />
      </a>
    );
  }

  return (
    <a
      href={business.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className={`instagram-brand-btn inline-flex items-center justify-center rounded-xl text-white transition-opacity hover:opacity-85 ${className}`}
      style={{ width: size + 12, height: size + 12 }}
    >
      <FaInstagram style={{ width: size, height: size }} />
    </a>
  );
}
