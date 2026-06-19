/**
 * Gera placeholders PNG genéricos para todo o cardápio Mamadi.
 * Uso: node scripts/generate-menu-images.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "generated-menu");

const CATEGORY_META = {
  drinks: { emoji: "🍹", from: "#FF3B3B", to: "#FF4081", label: "DRINKS" },
  destilados: { emoji: "🥃", from: "#FF8C00", to: "#FFE500", label: "DESTILADOS" },
  cervejas: { emoji: "🍺", from: "#FFE500", to: "#00E676", label: "CERVEJAS" },
  prontos: { emoji: "🥤", from: "#00E676", to: "#2979FF", label: "PRONTOS" },
  combos: { emoji: "🎉", from: "#2979FF", to: "#AA00FF", label: "COMBOS" },
  porcoes: { emoji: "🍟", from: "#AA00FF", to: "#FF4081", label: "PORÇÕES" },
  lanches: { emoji: "🥪", from: "#FF3B3B", to: "#FF8C00", label: "LANCHES" },
  menu: { emoji: "🍽️", from: "#FF8C00", to: "#00E676", label: "MENU" },
};

const SLUG_OVERRIDES = {
  dr01: "gin-tonica",
  dr02: "caipirinha-limao",
  dr04: "caipiroska-limao",
  dr05: "caipirinha-sabores",
  dr08: "batidao-tropical",
  dr11: "caipirinha-mamadi",
  de02: "cachaca-51-velho-barreiro",
  de04: "bananinha-canelinha",
  de05: "kariri-mel-limao",
  de07: "dreher-mel-limao",
  de10: "campari-aperol",
  de12: "master-gold-chanceler",
  de13: "cavalo-branco-passport",
  bu03: "mamadi-classico",
  me03: "prato-executivo-espetinhos",
  me04: "baiao-de-dois",
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function itemFilename(id, name) {
  const slug = SLUG_OVERRIDES[id] ?? slugify(name);
  return `${id}-${slug}.png`;
}

function itemEmoji(name, categoryId) {
  const n = name.toLowerCase();
  if (/caipirinha|limão|limao|caipiroska|caipilula|mojito|cuba/.test(n)) return "🍹";
  if (/gin|tonica|tônica/.test(n)) return "🍸";
  if (/cerveja|litrão|litrao|heineken|brahma|skol|stella|corona|budweiser|amstel|petra|original|eisenbahn|spaten|beck/.test(n)) return "🍺";
  if (/whisky|jack|label|dreher|tequila|vodka|cachaça|cachaca|jambu|campari|aperol|tanqueray|absolut|smirnoff|balalaika|vinho/.test(n)) return "🥃";
  if (/batata|mandioca|calabresa|coxinha|espetinho|pastel|couvert|tábua|tabua|porção|porcoes/.test(n)) return "🍟";
  if (/lanche|burger|mamadi original|mamadi bacon|mamadi clássico|mamadi classico/.test(n)) return "🥪";
  if (/café|cafe|churrasco|baiao|executivo|berinjela|prato/.test(n)) return "🍽️";
  if (/red bull|monster|energético|energetico|vibes|draft|beats|ice/.test(n)) return "🥤";
  if (/combo|copão|copao|pack|3 /.test(n)) return "🎉";
  if (/água|agua|refri|suco|soda|gelo/.test(n)) return "🧊";
  return CATEGORY_META[categoryId]?.emoji ?? "✨";
}

function wrapText(text, maxChars = 22) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg({ width, height, from, to, emoji, title, subtitle, badge, layout = "item" }) {
  const lines = wrapText(title, layout === "card" ? 16 : 24);
  const titleY = layout === "hero" ? height * 0.72 : layout === "card" ? height * 0.62 : height * 0.78;
  const emojiSize = layout === "hero" ? 180 : layout === "card" ? 120 : 140;
  const emojiY = layout === "hero" ? height * 0.38 : layout === "card" ? height * 0.38 : height * 0.42;
  const fontSize = layout === "card" ? 34 : layout === "hero" ? 42 : 38;
  const lineHeight = fontSize * 1.15;

  const titleTspans = lines
    .map((line, i) => {
      const dy = i === 0 ? 0 : lineHeight;
      return `<tspan x="50%" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0a"/>
  <rect width="100%" height="100%" fill="url(#bg)" opacity="0.92"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <circle cx="${width * 0.15}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.18}" fill="#FF3B3B" opacity="0.12"/>
  <circle cx="${width * 0.85}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.14}" fill="#00E676" opacity="0.12"/>
  <circle cx="${width * 0.78}" cy="${height * 0.82}" r="${Math.min(width, height) * 0.16}" fill="#AA00FF" opacity="0.1"/>
  <text x="50%" y="${emojiY}" text-anchor="middle" font-size="${emojiSize}" filter="url(#shadow)">${emoji}</text>
  <text x="50%" y="${titleY}" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="${fontSize}" font-weight="900" filter="url(#shadow)">
    ${titleTspans}
  </text>
  ${
    subtitle
      ? `<text x="50%" y="${titleY + lines.length * lineHeight + 28}" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(subtitle)}</text>`
      : ""
  }
  ${
    badge
      ? `<rect x="36" y="36" rx="18" ry="18" width="${badge.length * 14 + 36}" height="42" fill="rgba(0,0,0,0.45)"/>
         <text x="54" y="66" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="700">${escapeXml(badge)}</text>`
      : ""
  }
  <rect x="0" y="${height - 8}" width="100%" height="8" fill="url(#bg)"/>
</svg>`;
}

async function renderPng(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
}

function extractMenuItems(ts) {
  const items = [];
  const re = /id:\s*"([a-z]{2}\d+)"[\s\S]*?category:\s*"(\w+)"[\s\S]*?name:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(ts)) !== null) {
    items.push({ id: match[1], category: match[2], name: match[3] });
  }
  return items;
}

async function main() {
  const menuTs = readFileSync(join(ROOT, "src", "data", "menu.ts"), "utf8");
  const items = extractMenuItems(menuTs);

  mkdirSync(join(OUT, "items"), { recursive: true });
  mkdirSync(join(OUT, "categories"), { recursive: true });
  mkdirSync(join(OUT, "hero"), { recursive: true });

  const manifest = [];

  // Hero
  const heroSvg = buildSvg({
    width: 1200,
    height: 1600,
    from: "#FF4081",
    to: "#00E676",
    emoji: "🍺",
    title: "MAMADI FOOD",
    subtitle: "Cervejas · Drinks · Porções",
    layout: "hero",
  });
  const heroPath = join(OUT, "hero", "hero-neon.png");
  await renderPng(heroSvg, heroPath);
  manifest.push({ file: "hero/hero-neon.png", name: "Hero Mamadi", size: "1200x1600" });

  // Category cards + capas
  for (const [catId, meta] of Object.entries(CATEGORY_META)) {
    const cardSvg = buildSvg({
      width: 1200,
      height: 1200,
      from: meta.from,
      to: meta.to,
      emoji: meta.emoji,
      title: meta.label,
      subtitle: "Categoria",
      layout: "card",
    });
    const cardName = `cat-${catId}-card.png`;
    await renderPng(cardSvg, join(OUT, "categories", cardName));
    manifest.push({ file: `categories/${cardName}`, name: meta.label, size: "1200x1200" });

    const capaSvg = buildSvg({
      width: 1920,
      height: 1080,
      from: meta.from,
      to: meta.to,
      emoji: meta.emoji,
      title: meta.label,
      subtitle: "Capa da categoria",
      layout: "item",
    });
    const capaName = `cat-${catId}-capa.png`;
    await renderPng(capaSvg, join(OUT, "categories", capaName));
    manifest.push({ file: `categories/${capaName}`, name: `${meta.label} capa`, size: "1920x1080" });
  }

  // Items
  for (const item of items) {
    const meta = CATEGORY_META[item.category] ?? CATEGORY_META.drinks;
    const emoji = itemEmoji(item.name, item.category);
    const filename = itemFilename(item.id, item.name);
    const svg = buildSvg({
      width: 1200,
      height: 900,
      from: meta.from,
      to: meta.to,
      emoji,
      title: item.name,
      subtitle: meta.label,
      badge: item.id.toUpperCase(),
      layout: "item",
    });
    await renderPng(svg, join(OUT, "items", filename));
    manifest.push({ file: `items/${filename}`, name: item.name, size: "1200x900", id: item.id });
  }

  writeFileSync(
    join(OUT, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), total: manifest.length, files: manifest }, null, 2),
  );

  console.log(`✓ ${manifest.length} imagens geradas em public/generated-menu/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
