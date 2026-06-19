import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "xs" | "sm" | "md";
  variant?: "blue" | "gold";
  className?: string;
}

export default function VerifiedBadge({
  size = "sm",
  variant = "blue",
  className = "",
}: VerifiedBadgeProps) {
  const dim =
    size === "md" ? "h-5 w-5" : size === "sm" ? "h-[1.125rem] w-[1.125rem]" : "h-4 w-4";
  const icon =
    size === "md" ? "h-3 w-3" : size === "sm" ? "h-3 w-3" : "h-2.5 w-2.5";
  const variantClass = variant === "gold" ? "verified-badge--gold" : "";

  return (
    <span
      className={`verified-badge inline-flex shrink-0 items-center justify-center rounded-full ${dim} ${variantClass} ${className}`}
      aria-label="Verificado Mamadi Food"
      title="Mamadi Food verificado"
    >
      <BadgeCheck className={icon} strokeWidth={2.5} />
    </span>
  );
}
