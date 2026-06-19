import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MenuItem } from "../data/menu";
import { allMenuItems, categories } from "../data/menu";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import CategoryStackDeck from "./CategoryStackDeck";
import Footer from "./Footer";
import MamadiLogo from "./MamadiLogo";
import IfoodIcon from "./IfoodIcon";

interface CategoriesScreenProps {
  onBack: () => void;
  onOpenCategory: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
}

export default function CategoriesScreen({
  onBack,
  onOpenCategory,
  onSelectItem,
}: CategoriesScreenProps) {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return null;
    return allMenuItems.filter((item) => {
      const catLabel =
        categories.find((c) => c.id === item.category)?.label.toLowerCase() ?? "";
      return (
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        catLabel.includes(term)
      );
    });
  }, [term]);

  return (
    <div className="categories-screen relative min-h-screen overflow-hidden bg-black text-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition-colors hover:border-pride-pink"
          >
            <ArrowLeft className="h-4 w-4" />
            Início
          </button>
          <MamadiLogo variant="header" />
          <IfoodIcon size={24} />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg px-3 pb-20 pt-2 sm:px-4 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-3 text-center"
        >
          <h1 className="font-display text-lg font-bold sm:text-2xl">Escolha sua vibe</h1>
          <p className="mt-0.5 text-xs text-white/45 sm:text-sm">
            Segure e deslize o card para navegar
          </p>
        </motion.div>

        <div className="mx-auto mb-4 max-w-md">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {results ? (
          <section>
            <h2 className="mb-5 font-display text-xl font-bold">
              Resultados <span className="text-muted">({results.length})</span>
            </h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectItem(item)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-muted">
                Nenhum item encontrado para &ldquo;{search}&rdquo;.
              </p>
            )}
          </section>
        ) : (
          <CategoryStackDeck onOpen={onOpenCategory} />
        )}

        <Footer />
      </main>
    </div>
  );
}
