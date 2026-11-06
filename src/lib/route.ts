import type { SectionId } from "../data/types";
import { itemById, sectionById } from "../data/menu";

/*
 * Rotas no hash, para link direto e para o "voltar" do celular fechar a ficha/busca:
 *   #/cardapio/porcoes  #/item/coxinha  #/busca
 * (#/beber e #/comer, dos links antigos, também levam ao cardápio)
 */
export interface Route {
  section?: SectionId;
  menu?: boolean;
  item?: string;
  search?: boolean;
}

export function parseHash(hash = location.hash): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return {};
  const [a, b] = parts;
  if (a === "item" && b && itemById.has(b)) return { item: b, section: itemById.get(b)!.section };
  if (a === "busca") return { search: true };
  if (a === "cardapio" || a === "beber" || a === "comer") {
    const sec = b && sectionById.has(b as SectionId) ? (b as SectionId) : undefined;
    return { menu: true, section: sec };
  }
  return {};
}

export function hashFor(r: Route) {
  if (r.item) return `#/item/${r.item}`;
  if (r.search) return "#/busca";
  if (r.section) return `#/cardapio/${r.section}`;
  if (r.menu) return "#/cardapio";
  return location.pathname + location.search;
}
