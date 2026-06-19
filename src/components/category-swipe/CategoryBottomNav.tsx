import { Compass, Flame, Search } from "lucide-react";
import { SiIfood } from "react-icons/si";
import { business } from "../../data/menu";

export type CategoryNavTab = "swipe" | "explore";

interface CategoryBottomNavProps {
  activeTab: CategoryNavTab;
  searchActive: boolean;
  onSwipe: () => void;
  onExplore: () => void;
  onSearch: () => void;
}

function InstagramNavIcon() {
  return (
    <svg
      className="category-bottom-nav__instagram-icon"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

export default function CategoryBottomNav({
  activeTab,
  searchActive,
  onSwipe,
  onExplore,
  onSearch,
}: CategoryBottomNavProps) {
  const swipeActive = activeTab === "swipe" && !searchActive;
  const exploreActive = activeTab === "explore" && !searchActive;

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

      <a
        href={business.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="category-bottom-nav__item category-bottom-nav__item--instagram"
      >
        <InstagramNavIcon />
        <span>Instagram</span>
      </a>

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
