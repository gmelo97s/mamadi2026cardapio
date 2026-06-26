/** URLs que ainda não são foto real do produto. */
const PLACEHOLDER_PATTERNS = [/picsum\.photos/i, /\/generated-menu\//i];

export function hasMenuPhoto(src: string | undefined | null): boolean {
  const trimmed = src?.trim();
  if (!trimmed) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}
