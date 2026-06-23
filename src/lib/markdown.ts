import { Marked } from 'marked';
import sanitize from 'sanitize-html';

const renderer = new Marked({
  breaks: true,
  gfm: true,
  async: false,
});

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: [
    ...sanitize.defaults.allowedTags,
    'img', 'figure', 'figcaption', 'details', 'summary',
    'del', 'ins', 'sup', 'sub', 'mark',
  ],
  allowedAttributes: {
    ...sanitize.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    a: ['href', 'title', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

export function renderMarkdown(md: string): string {
  const raw = renderer.parse(md) as string;
  return sanitize(raw, SANITIZE_OPTIONS);
}
