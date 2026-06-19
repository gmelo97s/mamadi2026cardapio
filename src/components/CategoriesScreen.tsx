import type { MenuItem } from "../data/menu";
import CategorySwipeScreen from "./category-swipe/CategorySwipeScreen";

interface CategoriesScreenProps {
  onBack: () => void;
  onOpenCategory?: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
}

/** Tela de categorias — deck Tinder com itens dentro do card. */
export default function CategoriesScreen({
  onBack,
  onSelectItem,
}: CategoriesScreenProps) {
  return <CategorySwipeScreen onBack={onBack} onSelectItem={onSelectItem} />;
}
