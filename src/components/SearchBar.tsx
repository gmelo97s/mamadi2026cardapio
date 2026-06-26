import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "header";
  className?: string;
  autoFocus?: boolean;
  /** Placeholder “Buscar” com efeito LED arco-íris (aba pesquisar / ver tudo). */
  pridePlaceholder?: boolean;
}

function PridePlaceholderLabel({ suffix = "..." }: { suffix?: string }) {
  const label = "Buscar";
  return (
    <span className="category-search-placeholder-led" aria-hidden>
      {label.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="category-swipe-card__brand-led-char category-search-placeholder-led__char"
          style={{ animationDelay: `${index * 0.09}s` }}
        >
          {char}
        </span>
      ))}
      {suffix ? (
        <span className="category-search-placeholder-led__suffix">{suffix}</span>
      ) : null}
    </span>
  );
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar drinks, shots, porções...",
  variant = "default",
  className = "",
  autoFocus = false,
  pridePlaceholder = false,
}: SearchBarProps) {
  const isHeader = variant === "header";
  const showPridePlaceholder = isHeader && pridePlaceholder && !value.trim();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <div className={`relative w-full ${isHeader ? "category-search-notch" : ""} ${className}`}>
      {!isHeader && (
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
        />
      )}
      {showPridePlaceholder && (
        <PridePlaceholderLabel suffix={placeholder.replace(/^Buscar/i, "") || "..."} />
      )}
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={showPridePlaceholder ? " " : placeholder}
        autoComplete="off"
        aria-label={showPridePlaceholder ? "Buscar" : undefined}
        className={
          isHeader
            ? "category-search-input w-full rounded-full border border-white/12 bg-white/6 py-1.5 px-3 text-center text-xs text-text placeholder:text-transparent focus:border-pride-purple/60 focus:outline-none focus:ring-1 focus:ring-pride-purple/40 transition-colors"
            : "w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-9 text-sm text-text placeholder:text-muted focus:border-pride-purple focus:outline-none focus:ring-1 focus:ring-pride-purple/50 transition-colors"
        }
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className={`absolute top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors ${
            isHeader ? "right-2.5" : "right-3"
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
