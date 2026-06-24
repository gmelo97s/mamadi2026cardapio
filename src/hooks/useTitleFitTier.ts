import { useLayoutEffect, useRef, useState } from "react";

export type TitleFitTier = "default" | "compact" | "wrap";

const TIER_ORDER: TitleFitTier[] = ["default", "compact", "wrap"];

/** Encolhe o título do card só quando não cabe em uma linha no viewport atual. */
export function useTitleFitTier(label: string): {
  ref: React.RefObject<HTMLSpanElement | null>;
  tier: TitleFitTier;
} {
  const ref = useRef<HTMLSpanElement>(null);
  const [tier, setTier] = useState<TitleFitTier>("default");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const row = el.parentElement;
    if (!row) return;

    const measure = () => {
      let resolved: TitleFitTier = "wrap";

      for (const candidate of TIER_ORDER) {
        row.dataset.titleFit = candidate;
        el.style.whiteSpace = candidate === "wrap" ? "normal" : "nowrap";
        void row.offsetHeight;

        if (candidate === "wrap") {
          resolved = "wrap";
          break;
        }

        if (el.scrollWidth <= el.clientWidth + 1) {
          resolved = candidate;
          break;
        }
      }

      delete row.dataset.titleFit;
      el.style.whiteSpace = "";
      setTier(resolved);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [label]);

  return { ref, tier };
}
