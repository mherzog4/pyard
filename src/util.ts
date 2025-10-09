export const norm = (s: string) => s.toLowerCase();

export const includesCI = (haystack: string, needle: string) => {
  return norm(haystack).includes(norm(needle));
};

export const anyIncludes = (items: string[], q: string) => {
  return items.some((s) => includesCI(s, q));
};
