import { exploreSections } from "../../data/exploreSections";
import { countExploreSectionItems } from "../../data/exploreSections";
import { itemsByCategory } from "../../data/menu";
import ExploreSectionCard from "./ExploreSectionCard";

interface ExploreSectionsScreenProps {
  onSelectSection: (sectionId: string) => void;
}

export default function ExploreSectionsScreen({ onSelectSection }: ExploreSectionsScreenProps) {
  return (
    <section className="explore-screen explore-screen--sections" aria-label="Explorar">
      <h1 className="explore-screen__title">Explorar</h1>
      <div className="explore-screen__grid">
        {exploreSections.map((section) => (
          <ExploreSectionCard
            key={section.id}
            section={section}
            itemCount={countExploreSectionItems(section, itemsByCategory)}
            onClick={() => onSelectSection(section.id)}
          />
        ))}
      </div>
    </section>
  );
}
