import type { Category, MenuItem } from "../data/menu";
import { categories as allCategories } from "../data/menu";

export type MenuSearchResult =
  | { kind: "idle" }
  | { kind: "matches"; items: MenuItem[] }
  | { kind: "suggestions"; items: MenuItem[]; query: string }
  | { kind: "empty"; query: string };

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function nameSimilarity(term: string, name: string): number {
  const t = normalizeSearchText(term);
  const n = normalizeSearchText(name);
  if (!t || !n) return 0;
  if (n.includes(t) || t.includes(n)) return 1;

  const dist = levenshtein(t, n);
  const maxLen = Math.max(t.length, n.length);
  const base = 1 - dist / maxLen;

  const tTokens = t.split(" ").filter(Boolean);
  const nTokens = n.split(" ").filter(Boolean);
  let tokenScore = 0;
  for (const token of tTokens) {
    let best = 0;
    for (const nt of nTokens) {
      if (nt.includes(token) || token.includes(nt)) best = 1;
      else {
        const td = levenshtein(token, nt);
        best = Math.max(best, 1 - td / Math.max(token.length, nt.length));
      }
    }
    tokenScore += best;
  }
  const tokenAvg = tTokens.length ? tokenScore / tTokens.length : 0;

  return Math.max(base, tokenAvg * 0.92);
}

function matchesBroad(item: MenuItem, term: string, categories: Category[]): boolean {
  const catLabel =
    categories.find((c) => c.id === item.category)?.label.toLowerCase() ?? "";
  const n = normalizeSearchText(item.name);
  const d = normalizeSearchText(item.description);
  const c = normalizeSearchText(catLabel);
  return n.includes(term) || d.includes(term) || c.includes(term);
}

function fuzzyNameSuggestions(term: string, items: MenuItem[], limit = 8): MenuItem[] {
  const normalizedTerm = normalizeSearchText(term);
  const threshold = normalizedTerm.length <= 3 ? 0.52 : 0.42;

  return items
    .map((item) => ({ item, score: nameSimilarity(normalizedTerm, item.name) }))
    .filter((entry) => entry.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function searchMenuItems(
  rawTerm: string,
  items: MenuItem[],
  categories: Category[] = allCategories
): MenuSearchResult {
  const term = normalizeSearchText(rawTerm);
  if (!term) return { kind: "idle" };

  const hasNameMatch = items.some((item) =>
    normalizeSearchText(item.name).includes(term)
  );

  if (hasNameMatch) {
    const matches = items.filter((item) => matchesBroad(item, term, categories));
    return { kind: "matches", items: matches };
  }

  const suggestions = fuzzyNameSuggestions(term, items);
  if (suggestions.length > 0) {
    return { kind: "suggestions", items: suggestions, query: rawTerm.trim() };
  }

  return { kind: "empty", query: rawTerm.trim() };
}
