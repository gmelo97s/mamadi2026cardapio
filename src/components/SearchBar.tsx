import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "header";
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar drinks, shots, porções...",
  variant = "default",
  className = "",
}: SearchBarProps) {
  const isHeader = variant === "header";

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${
          isHeader ? "left-2.5 h-3.5 w-3.5" : "left-3 h-4 w-4"
        }`}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={
          isHeader
            ? "category-search-input w-full rounded-full border border-white/12 bg-white/6 py-1.5 pl-8 pr-8 text-xs text-text placeholder:text-white/40 focus:border-pride-purple/60 focus:outline-none focus:ring-1 focus:ring-pride-purple/40 transition-colors"
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
