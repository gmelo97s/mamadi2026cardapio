import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SiIfood } from "react-icons/si";
import type { MenuItem } from "../data/menu";
import {
  business,
  complementosLanches,
  formatPrice,
} from "../data/menu";

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ProductModal({ item, onClose }: ProductModalProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-surface no-scrollbar sm:rounded-3xl"
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex justify-center bg-surface pt-3 sm:hidden">
              <div className="h-1.5 w-12 rounded-full bg-border" />
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-20 rounded-full bg-bg/70 p-1.5 text-text backdrop-blur-sm transition-colors hover:bg-bg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5">
              {item.badge && (
                <span className="mb-2 inline-block rounded-full bg-bg px-2.5 py-1 text-xs font-bold text-text">
                  {item.badge}
                </span>
              )}

              <h2 className="font-display text-xl font-bold text-text">
                {item.name}
              </h2>

              <div className="mt-2">
                {item.priceA != null && item.priceB != null ? (
                  <div className="flex flex-col gap-1 text-base font-bold text-price">
                    <span>
                      {item.labelA}: {formatPrice(item.priceA)}
                    </span>
                    <span>
                      {item.labelB}: {formatPrice(item.priceB)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-price">
                    {formatPrice(item.price ?? 0)}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>

              {item.obs && (
                <p className="mt-3 rounded-lg border border-border bg-bg/50 p-3 text-xs text-muted">
                  ℹ️ {item.obs}
                </p>
              )}

              {item.category === "lanches" && (
                <div className="mt-3 rounded-lg border border-border bg-bg/50 p-3">
                  <p className="mb-1.5 text-xs font-semibold text-text">
                    Complementos (adicionais):
                  </p>
                  <ul className="space-y-0.5 text-xs text-muted">
                    {complementosLanches.map((c) => (
                      <li key={c.name} className="flex justify-between">
                        <span>{c.name}</span>
                        <span className="text-price">{formatPrice(c.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={business.ifoodUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ifood-btn mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-bold text-white transition-opacity hover:opacity-90"
              >
                <SiIfood className="h-5 w-5" />
                Pedir também pelo iFood?
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
