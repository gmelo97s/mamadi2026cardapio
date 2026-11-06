// Renderiza as artes da marca (HTML/SVG em design/brand) para PNG com o Chromium do Playwright.
// Uso: node scripts/render-brand.mjs [--preview]
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = process.argv.includes("--preview");

const jobs = [
  { page: "design/brand/cap-print.html", out: "design/brand/cap-print.png", size: 1024 },
];

const browser = await chromium.launch();
for (const job of jobs) {
  const ctx = await browser.newContext({ viewport: { width: job.size, height: job.size }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(root, job.page)).href);
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  await page.waitForTimeout(150);
  if (preview) await page.evaluate(() => document.body.classList.add("preview"));
  const out = preview ? job.out.replace(/\.png$/, ".preview.png") : job.out;
  await page.locator("svg").first().screenshot({ path: path.join(root, out), omitBackground: !preview });
  console.log("ok", out);
  await ctx.close();
}
await browser.close();
