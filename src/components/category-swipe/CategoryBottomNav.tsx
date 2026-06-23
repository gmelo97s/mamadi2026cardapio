import { Compass, Eye, Flame, Search } from "lucide-react";
import { SiIfood } from "react-icons/si";
import { business } from "../../data/menu";

export type CategoryNavTab = "swipe" | "explore";

interface CategoryBottomNavProps {
  activeTab: CategoryNavTab;
  searchActive: boolean;
  menuPreviewActive: boolean;
  onSwipe: () => void;
  onExplore: () => void;
  onSearch: () => void;
  onMenuPreview: () => void;
}

export default function CategoryBottomNav({
  activeTab,
  searchActive,
  menuPreviewActive,
  onSwipe,
  onExplore,
  onSearch,
  onMenuPreview,
}: CategoryBottomNavProps) {
  const swipeActive = activeTab === "swipe" && !searchActive && !menuPreviewActive;
  const exploreActive = activeTab === "explore" && !searchActive && !menuPreviewActive;

  return (
    <nav className="category-bottom-nav" aria-label="Navegação principal">
      <button
        type="button"
        className={`category-bottom-nav__item${
          swipeActive ? " category-bottom-nav__item--active" : " category-bottom-nav__item--muted"
        }`}
        onClick={onSwipe}
        aria-current={swipeActive ? "page" : undefined}
      >
        <Flame size={24} fill="currentColor" />
        <span>Deslizar</span>
      </button>

      <button
        type="button"
        className={`category-bottom-nav__item${
          exploreActive
            ? " category-bottom-nav__item--active category-bottom-nav__item--explore-active"
            : " category-bottom-nav__item--muted"
        }`}
        onClick={onExplore}
        aria-current={exploreActive ? "page" : undefined}
      >
        <span className="category-bottom-nav__compass-wrap">
          <Compass size={24} fill={exploreActive ? "currentColor" : "none"} />
        </span>
        <span>Explorar</span>
      </button>

      <button
        type="button"
        className={`category-bottom-nav__item${
          searchActive ? " category-bottom-nav__item--active" : " category-bottom-nav__item--muted"
        }`}
        onClick={onSearch}
        aria-expanded={searchActive}
        aria-label="Pesquisar"
      >
        <Search size={24} strokeWidth={2.25} />
        <span>Pesquisar</span>
      </button>

      <button
        type="button"
        className={`category-bottom-nav__item${
          menuPreviewActive ? " category-bottom-nav__item--active" : " category-bottom-nav__item--muted"
        }`}
        onClick={onMenuPreview}
        aria-pressed={menuPreviewActive}
        aria-label={
          menuPreviewActive ? "Fechar visualização do cardápio" : "Visualizar cardápio"
        }
      >
        <Eye size={28} strokeWidth={1.75} />
        <span>Ver tudo</span>
      </button>

      <a
        href={business.ifoodUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="category-bottom-nav__item category-bottom-nav__item--ifood"
      >
        <span className="category-bottom-nav__ifood-icon" aria-hidden>
          <SiIfood />
        </span>
        <span>iFood</span>
      </a>
    </nav>
  );
}
