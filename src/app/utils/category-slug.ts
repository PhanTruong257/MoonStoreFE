export const toCategorySlug = (name: string) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Temporary compatibility with requested route format.
  if (base === "gaming") {
    return "gameing";
  }

  return base;
};

export const normalizeCategorySlug = (slug: string) => {
  const value = slug.toLowerCase().trim();
  if (value === "gaming") {
    return "gameing";
  }
  return value;
};
