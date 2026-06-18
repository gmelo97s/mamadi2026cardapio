import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import InstagramIcon from "./InstagramIcon";
import { business } from "../data/menu";

interface FloatingButtonsProps {
  visible?: boolean;
}

export default function FloatingButtons({ visible = true }: FloatingButtonsProps) {
  if (!visible) return null;

  return (
    <>
      <div style={{ position: "fixed", left: 24, bottom: 24, zIndex: 9999 }}>
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
          bottom: 24,
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
