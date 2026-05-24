// Real photography for specific news stories, keyed by news item id.
// When a story has a photo here, its thumbnail/hero renders the image instead
// of the category gradient — everywhere that story appears. No photo = gradient.

export const STORY_PHOTOS: Record<string, string> = {
  // Story 1: "The Man Who Holds Liberia's Interest Rates" — CBL Governor Henry F. Saamoi
  '1': '/images/samoi.png',
};

export function storyPhoto(id?: string): string | undefined {
  return id ? STORY_PHOTOS[id] : undefined;
}
