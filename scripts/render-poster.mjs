// Renderiza a tampinha 3D parada (fundo transparente) e gera os ícones do app.
// Uso: com `npm run dev` rodando em :5173 →  node scripts/render-poster.mjs
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1100, height: 1100 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:5173/design/render/poster.html");
await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
await page.waitForTimeout(300);
await page.locator("canvas").screenshot({ path: path.join(root, "design/render/cap-render.png"), omitBackground: true });
await browser.close();
console.log("ok design/render/cap-render.png");
