export const norm = (s) => s.toLowerCase();
export const includesCI = (haystack, needle) => {
    return norm(haystack).includes(norm(needle));
};
export const anyIncludes = (items, q) => {
    return items.some((s) => includesCI(s, q));
};
//# sourceMappingURL=util.js.map