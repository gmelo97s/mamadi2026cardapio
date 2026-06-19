import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiIfood } from "react-icons/si";
import { business } from "../../data/menu";

export default function CategoryFooterLinks() {
  return (
    <footer className="category-footer-links" aria-label="Redes e pedidos">
      <a
        href={business.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram do Mamadi Food"
        className="category-footer-links__btn category-footer-links__instagram"
      >
        <FaInstagram className="category-footer-links__icon" />
      </a>
      <a
        href={business.ifoodUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir no iFood"
        className="category-footer-links__btn category-footer-links__ifood"
      >
        <SiIfood className="category-footer-links__icon" />
      </a>
      <a
        href={business.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir pelo WhatsApp"
        className="category-footer-links__btn category-footer-links__whatsapp"
      >
        <FaWhatsapp className="category-footer-links__icon" />
      </a>
    </footer>
  );
}
