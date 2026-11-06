// Gera public/brand/og.jpg (prévia de link no WhatsApp/Instagram). Com `npm run dev` rodando em :5173.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:5173/design/render/og.html");
await page.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 30000 });
await page.waitForTimeout(200);
await page.locator("#og").screenshot({ path: path.join(root, "public/brand/og.jpg"), type: "jpeg", quality: 86 });
await browser.close();
console.log("ok public/brand/og.jpg");
