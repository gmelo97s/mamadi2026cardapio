import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

/** A tela de carregamento (index.html) desenha a mesma garrafa do olho da abertura, sem esperar o JavaScript. */
const garrafaNoBoot = {
  name: "garrafa-no-boot",
  transformIndexHtml(html: string) {
    const svg = readFileSync(new URL("./src/components/intro/garrafa-olho.svg", import.meta.url), "utf8");
    return html.replace("<!--garrafa-olho-->", svg.replace(/\n\s*/g, " "));
  },
};

export default defineConfig({
  plugins: [react(), garrafaNoBoot],
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
