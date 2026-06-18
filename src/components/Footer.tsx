import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { business } from "../data/menu";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border px-6 py-10 text-center">
      <h2 className="font-display text-2xl font-bold pride-text inline-block">
        MAMADI FOOD 🏳️‍🌈
      </h2>
      <p className="mt-2 text-sm text-muted">
        {business.tagline} · {business.location}
      </p>

      <div className="mt-5 flex items-center justify-center gap-6 text-sm">
        <a
          href={business.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-text hover:text-pride-pink transition-colors"
        >
          <FaInstagram className="h-4 w-4" />@{business.instagram}
        </a>
        <a
          href={business.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-text hover:text-pride-green transition-colors"
        >
          <FaWhatsapp className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <p className="mt-6 text-xs text-muted">
        Horário {business.menuHours}
      </p>
      <p className="mt-1 text-xs text-muted">
        Cardápio sujeito a alterações sem aviso prévio.
      </p>
      <p className="mt-4 text-xs font-semibold text-muted">
        Beba com moderação. Proibido para menores de 18 anos. 🔞
      </p>
    </footer>
  );
}
