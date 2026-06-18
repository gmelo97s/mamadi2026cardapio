interface MamadiLogoProps {
  variant?: "hero" | "header";
  className?: string;
}

export default function MamadiLogo({ variant = "header", className = "" }: MamadiLogoProps) {
  const sizeClass =
    variant === "hero"
      ? "text-5xl sm:text-6xl md:text-7xl tracking-[0.12em]"
      : "text-base sm:text-lg tracking-[0.08em]";

  return (
    <h1
      className={`font-display font-black mamadi-logo ${sizeClass} ${className}`}
      aria-label="Mamadi Food"
    >
      MAMADI FOOD
    </h1>
  );
}
