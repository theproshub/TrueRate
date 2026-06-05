/**
 * Map an article category to its default canonical byline (desk).
 *
 * Used by the admin editor to auto-fill the Author when a category is chosen.
 * Keys are category labels (lowercased); values are canonical author names
 * (see migration 017_canonicalize_authors). Categories without a dedicated desk
 * fall back to the general "TrueRate Newsroom" byline.
 */
export const CATEGORY_TO_AUTHOR: Record<string, string> = {
  news: 'TrueRate Newsroom',
  economy: 'TrueRate Economics',
  markets: 'TrueRate Economics',
  business: 'TrueRate Business',
  'small business': 'TrueRate Business',
  technology: 'TrueRate Tech',
  entertainment: 'TrueRate Newsroom',
  sports: 'TrueRate Sports',
  videos: 'TrueRate Newsroom',
  opinion: 'TrueRate Editorial Board',
  analysis: 'TrueRate Editorial Board',
  world: 'TrueRate Newsroom',
};

/** Canonical author name for a category label, if one is mapped. */
export function authorNameForCategory(label: string | undefined): string | undefined {
  if (!label) return undefined;
  return CATEGORY_TO_AUTHOR[label.trim().toLowerCase()];
}
