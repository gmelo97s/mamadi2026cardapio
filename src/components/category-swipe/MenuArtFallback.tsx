import type { CSSProperties } from "react";
import type { Category } from "../../data/menu";

interface MenuArtFallbackProps {
  /** Categoria do item — define as cores neon da arte. */
  category: Category;
  /** Emoji exibido no centro (padrão: emoji da categoria). */
  glyph?: string;
  /** deck = card inteiro do deck; result = card de lista/busca. */
  variant?: "deck" | "result";
}

/**
 * Arte neon da casa usada quando o item não tem foto própria
 * ou quando a foto falha ao carregar — nunca deixa imagem quebrada na tela.
 */
export default function MenuArtFallback({
  category,
  glyph,
  variant = "deck",
}: MenuArtFallbackProps) {
  const style = {
    "--art-from": category.from,
    "--art-to": category.to,
    "--art-glow": category.glow,
  } as CSSProperties;

  return (
    <div className={`menu-art menu-art--${variant}`} style={style} aria-hidden>
      <span className="menu-art__halo" />
      <span className="menu-art__rays" />
      <span className="menu-art__glyph">{glyph ?? category.emoji}</span>
      <span className="menu-art__wordmark">MAMADI FOOD</span>
    </div>
  );
}
