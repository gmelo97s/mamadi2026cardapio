import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: true },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 700,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // O 3D da tampinha fica num pedaço separado: o cardápio carrega primeiro.
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
        },
      },
    },
  },
});
