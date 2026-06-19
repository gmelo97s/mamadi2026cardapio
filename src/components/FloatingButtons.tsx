import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import InstagramIcon from "./InstagramIcon";
import { business } from "../data/menu";

interface FloatingButtonsProps {
  visible?: boolean;
  elevated?: boolean;
}

export default function FloatingButtons({ visible = true, elevated = false }: FloatingButtonsProps) {
  if (!visible) return null;

  const bottom = elevated
    ? "max(5.75rem, calc(env(safe-area-inset-bottom, 0px) + 5.25rem))"
    : "max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))";

  return (
    <>
      <div style={{ position: "fixed", left: 24, bottom, zIndex: 9999 }}>
        <InstagramIcon variant="floating" size={26} />
      </div>

      <motion.a
        href={business.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir pelo WhatsApp"
        style={{
          position: "fixed",
          right: 24,
          bottom,
          zIndex: 9999,
          backgroundColor: "#25D366",
          boxShadow: "0 0 20px rgba(37,211,102,0.5)",
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <FaWhatsapp className="h-7 w-7" />
      </motion.a>
    </>
  );
}
