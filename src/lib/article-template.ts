/**
 * Parse a pasted "template" into draft article fields.
 *
 * The parser is intentionally forgiving so editors can paste a structure in a
 * few shapes and still get a sensible draft. Nothing is invented — it only
 * reorganises the text you paste into the form's fields.
 *
 * Recognised shapes (mix and match):
 *
 *   Labelled fields at the top, one per line:
 *     Title: CBL Holds Rate at 16.25%
 *     Standfirst: A one-sentence summary under the headline
 *     Slug: cbl-holds-rate          (optional; otherwise derived from title)
 *     Body:
 *     ## Lead
 *     ...
 *
 *   Or plain Markdown — a leading `# Heading` becomes the title and the rest
 *   becomes the body:
 *     # CBL Holds Rate at 16.25%
 *     ## Lead
 *     ...
 *
 * Accepted label aliases are listed below. The first `Body:` / `Article:` /
 * `Content:` marker (or the first unlabelled line) starts the body; everything
 * after it is kept verbatim, including Markdown headings.
 */

export interface ParsedTemplate {
  title?: string;
  slug?: string;
  dek?: string;
  body: string;
}

const FIELD_ALIASES: Record<string, 'title' | 'slug' | 'dek'> = {
  title: 'title',
  headline: 'title',
  slug: 'slug',
  url: 'slug',
  standfirst: 'dek',
  dek: 'dek',
  subtitle: 'dek',
  subhead: 'dek',
  summary: 'dek',
};

const BODY_MARKERS = new Set(['body', 'article', 'content', 'story']);

/**
 * Keep the body within the site's styled heading hierarchy.
 *
 * The public article layout renders the headline as the page <h1> and styles
 * only h2/h3/h4 inside `.article-body`. A stray top-level `# Heading` in the
 * body would render unstyled, so we demote any body-level H1 to H2 (`#` → `##`).
 * Fenced code blocks are left untouched.
 */
function normalizeBodyHeadings(body: string): string {
  let inFence = false;
  return body
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (!inFence && /^#\s+\S/.test(line)) {
        return line.replace(/^#(\s+)/, '##$1');
      }
      return line;
    })
    .join('\n');
}

// A label line: starts with a letter, up to ~20 chars of letters/spaces/slashes,
// then a colon. Excludes Markdown headings (`#`) and list markers.
const LABEL_RE = /^([A-Za-z][A-Za-z /]{1,20}):\s*(.*)$/;

export function parseTemplate(input: string): ParsedTemplate {
  const text = input.replace(/\r\n/g, '\n').trim();
  if (!text) return { body: '' };

  const lines = text.split('\n');
  const fields: { title?: string; slug?: string; dek?: string } = {};
  const bodyLines: string[] = [];
  let inBody = false;

  for (const line of lines) {
    if (inBody) {
      bodyLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Leading Markdown H1 → title (only the first one, before the body starts)
    if (!fields.title && /^#\s+\S/.test(trimmed)) {
      fields.title = trimmed.replace(/^#\s+/, '').trim();
      continue;
    }

    const match = trimmed.match(LABEL_RE);
    if (match) {
      const label = match[1].trim().toLowerCase();
      const value = match[2].trim();

      if (BODY_MARKERS.has(label)) {
        inBody = true;
        if (value) bodyLines.push(value);
        continue;
      }

      const field = FIELD_ALIASES[label];
      if (field) {
        if (value) fields[field] = value;
        continue;
      }
    }

    // Skip blank lines that precede any body content.
    if (!trimmed && bodyLines.length === 0) continue;

    // First unrecognised, non-blank line → body starts here.
    inBody = true;
    bodyLines.push(line);
  }

  let body = normalizeBodyHeadings(bodyLines.join('\n').trim());

  // If no standfirst was given explicitly, lift a short lead paragraph out of
  // the body into the dek — e.g. the opening line of a Word draft that sits
  // under the headline. Only when it's a plain one-line sentence followed by
  // more content, so we never strip a real article lead or a heading.
  if (!fields.dek) {
    const lead = extractLeadDek(body);
    if (lead) {
      fields.dek = lead.dek;
      body = lead.body;
    }
  }

  return { ...fields, body };
}

function extractLeadDek(body: string): { dek: string; body: string } | null {
  const text = body.trimStart();
  const breakIdx = text.indexOf('\n\n');
  if (breakIdx === -1) return null; // need content after the lead

  const first = text.slice(0, breakIdx).trim();
  const rest = text.slice(breakIdx + 2).trim();

  const looksStructural = /^(#{1,6}\s|>\s?|[-*+]\s|\d+\.\s|```|~~~|!\[)/.test(first);
  const isPlainShortLine =
    first.length > 0 &&
    first.length <= 220 &&
    !first.includes('\n') &&
    !looksStructural;

  if (isPlainShortLine && rest.length > 0) {
    return { dek: first, body: rest };
  }
  return null;
}
