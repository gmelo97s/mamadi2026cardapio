import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar drinks, shots, porções...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-9 text-sm text-text placeholder:text-muted focus:border-pride-purple focus:outline-none focus:ring-1 focus:ring-pride-purple/50 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
