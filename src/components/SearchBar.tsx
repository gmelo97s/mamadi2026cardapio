import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "header";
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar drinks, shots, porções...",
  variant = "default",
  className = "",
  autoFocus = false,
}: SearchBarProps) {
  const isHeader = variant === "header";
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
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={
          isHeader
            ? "category-search-input w-full rounded-full border border-white/12 bg-white/6 py-1.5 px-3 text-center text-xs text-text placeholder:text-white/85 focus:border-pride-purple/60 focus:outline-none focus:ring-1 focus:ring-pride-purple/40 transition-colors"
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
