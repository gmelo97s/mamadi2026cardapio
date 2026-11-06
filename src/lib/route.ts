import type { SectionId } from "../data/types";
import { itemById, sectionById } from "../data/menu";
import type { Tab } from "./ui";

/*
 * Rotas no hash, para link direto e para o "voltar" do celular fechar a ficha/busca:
 *   #/beber  #/comer/porcoes  #/item/coxinha  #/busca
 */
export interface Route {
  tab?: Tab;
  section?: SectionId;
  item?: string;
  search?: boolean;
}

export function parseHash(hash = location.hash): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return {};
  const [a, b] = parts;
  if (a === "item" && b && itemById.has(b)) {
    const it = itemById.get(b)!;
    const group = sectionById.get(it.section)!.group;
    return { tab: group, section: it.section, item: b };
  }
  if (a === "busca") return { search: true };
  if (a === "beber" || a === "comer" || a === "casa" || a === "inicio") {
    const sec = b && sectionById.has(b as SectionId) ? (b as SectionId) : undefined;
    return { tab: a, section: sec };
  }
  return {};
}

export function hashFor(r: Route) {
  if (r.item) return `#/item/${r.item}`;
  if (r.search) return "#/busca";
  if (r.tab && r.tab !== "inicio") return `#/${r.tab}${r.section ? "/" + r.section : ""}`;
  return "#/";
}
