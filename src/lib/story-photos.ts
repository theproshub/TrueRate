// Real photography for specific news stories, keyed by news item id.
// When a story has a photo here, its thumbnail/hero renders the image instead
// of the category gradient — everywhere that story appears. No photo = gradient.

export const STORY_PHOTOS: Record<string, string> = {};

export function storyPhoto(id?: string): string | undefined {
  return id ? STORY_PHOTOS[id] : undefined;
}
