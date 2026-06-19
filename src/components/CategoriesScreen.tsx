import CategorySwipeScreen from "./category-swipe/CategorySwipeScreen";

interface CategoriesScreenProps {
  onBack: () => void;
}

/** Tela de categorias — deck Tinder com itens dentro do card. */
export default function CategoriesScreen({ onBack }: CategoriesScreenProps) {
  return <CategorySwipeScreen onBack={onBack} />;
}
