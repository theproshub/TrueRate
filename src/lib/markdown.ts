import { Marked } from 'marked';

// Per-process instance with our defaults — keeps the global `marked` clean
// in case anything else imports it.
const renderer = new Marked({
  breaks: true,   // single newline → <br>
  gfm: true,      // GitHub-flavored markdown (tables, strikethrough, autolinks)
  async: false,
});

/**
 * Render trusted Markdown (admin-authored only) to HTML.
 *
 * We do not sanitize — only `is_admin = true` users can write articles, and
 * RLS enforces that on the server. If we ever open up authoring to less
 * trusted users (e.g. user-submitted op-eds), add DOMPurify or sanitize-html
 * around the output.
 */
export function renderMarkdown(md: string): string {
  return renderer.parse(md) as string;
}
