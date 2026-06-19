import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export default function VerifiedBadge({ size = "sm", className = "" }: VerifiedBadgeProps) {
  const dim = size === "md" ? "h-6 w-6" : "h-5 w-5";
  const icon = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";

  return (
    <span
      className={`verified-badge inline-flex shrink-0 items-center justify-center rounded-full ${dim} ${className}`}
      aria-label="Verificado Mamadi Food"
      title="Mamadi Food verificado"
    >
      <BadgeCheck className={icon} strokeWidth={2.5} />
    </span>
  );
}
