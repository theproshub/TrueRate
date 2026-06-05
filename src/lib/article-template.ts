/**
 * Parse a pasted / uploaded "template" into draft article fields.
 *
 * Nothing is invented — it only reorganises the text you provide into the
 * form's fields. Two shapes are supported:
 *
 * 1. FIELD SHEET (e.g. the newsroom "maps 1:1 to /admin/articles/new" draft).
 *    Labels sit on their own line, the value follows on the next line(s), and a
 *    `---` divider ends the form section (notes after it are ignored):
 *
 *      TITLE:
 *      Mines minister tours ArcelorMittal …
 *
 *      STANDFIRST / SUBTITLE:  (one sentence)
 *      The minister praised the Buchanan investments …
 *
 *      CATEGORY:
 *      News   [alt: Economy]
 *
 *      BODY (Markdown):
 *      Liberia's Minister of Mines …
 *
 *      STATUS:
 *      Draft
 *      ---
 *      ## BEFORE YOU PUBLISH — ignored
 *
 *    Parenthetical hints `(one sentence)`, bracket notes `[alt: Economy]`, and
 *    placeholder values like `(leave blank …)` are stripped/ignored.
 *
 * 2. INLINE / MARKDOWN — `Label: value` on one line, or plain Markdown where a
 *    leading `# Heading` becomes the title and the rest becomes the body.
 */

export interface ParsedTemplate {
  title?: string;
  slug?: string;
  dek?: string;
  heroImage?: string;
  heroAlt?: string;
  category?: string;
  author?: string;
  sourceName?: string;
  sourceUrl?: string;
  status?: 'draft' | 'published' | 'archived';
  body: string;
}

type FieldKey =
  | 'title'
  | 'slug'
  | 'dek'
  | 'heroImage'
  | 'heroAlt'
  | 'category'
  | 'author'
  | 'source'
  | 'status'
  | 'body'
  | 'ignore';

/** Normalised label text → field. Covers the newsroom sheet + common aliases. */
const LABELS: Record<string, FieldKey> = {
  title: 'title',
  headline: 'title',
  'url slug': 'slug',
  slug: 'slug',
  url: 'slug',
  'standfirst / subtitle': 'dek',
  'standfirst/subtitle': 'dek',
  standfirst: 'dek',
  subtitle: 'dek',
  subhead: 'dek',
  dek: 'dek',
  summary: 'dek',
  category: 'category',
  section: 'category',
  author: 'author',
  byline: 'author',
  'hero image': 'heroImage',
  hero: 'heroImage',
  image: 'heroImage',
  'hero alt text': 'heroAlt',
  'hero alt': 'heroAlt',
  'alt text': 'heroAlt',
  source: 'source',
  sources: 'source',
  outlet: 'source',
  credit: 'source',
  via: 'source',
  body: 'body',
  'body markdown': 'body',
  article: 'body',
  content: 'body',
  story: 'body',
  status: 'status',
  'published at': 'ignore',
  published: 'ignore',
  'published date': 'ignore',
};

// A "Label:" line — anything up to the first colon that doesn't start with a
// Markdown heading marker. We only treat it as a field when the normalised
// label is one we know, so body prose like "What to watch:" stays in the body.
const LABEL_LINE = /^\s*([^:#][^:]*):\s*(.*)$/;
const DIVIDER = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;

function normalizeLabel(raw: string): string {
  return raw
    .replace(/\([^)]*\)/g, '') // drop "(one sentence)" / "(Markdown)"
    .replace(/\[[^\]]*\]/g, '') // drop "[alt: …]"
    .replace(/[*_`]/g, '') // drop markdown emphasis chars
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** A value that's really an instruction, e.g. "(leave blank — …)". */
function isPlaceholder(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (/^\(.*\)$/.test(v)) return true; // fully parenthesised
  if (/^[—–-]+$/.test(v)) return true; // just a dash
  return false;
}

/** Tidy a scalar field value: drop bracket notes, surrounding quotes, dashes. */
function cleanScalar(value: string): string {
  let v = value.split('[')[0]; // "News   [alt: Economy]" → "News"
  v = v.replace(/\s+/g, ' ').trim();
  v = v.replace(/^["'“”]+|["'“”]+$/g, '').trim();
  return v;
}

/** Parse a SOURCE value: a Markdown link, "Name | url", a bare URL, or a name. */
function parseSourceValue(raw: string): { name?: string; url?: string } | null {
  const v = raw.trim();
  if (!v) return null;

  const md = v.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (md) return { name: md[1].trim() || undefined, url: md[2].trim() || undefined };

  if (v.includes('|')) {
    const [a, ...rest] = v.split('|');
    const b = rest.join('|').trim();
    if (/^https?:\/\//i.test(b)) return { name: a.trim() || undefined, url: b };
    if (/^https?:\/\//i.test(a.trim())) return { name: b || undefined, url: a.trim() };
  }

  const url = v.match(/https?:\/\/\S+/);
  if (url) {
    const name = v.replace(url[0], '').replace(/[—–\-•|:]+/g, ' ').trim();
    return { name: name || undefined, url: url[0] };
  }
  return { name: v };
}

/** Find a "Sources:" line in the body and pull its first link as the source. */
function extractSourceFromBody(body: string): { name?: string; url?: string } | null {
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (/^\**\s*sources?\b\s*:?/i.test(t)) {
      const parsed = parseSourceValue(t.replace(/^\**\s*sources?\b\s*:?\**/i, '').trim());
      if (parsed && (parsed.name || parsed.url)) return parsed;
    }
  }
  return null;
}

function normalizeStatus(
  value: string | undefined,
): ParsedTemplate['status'] {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v.includes('publish')) return 'published';
  if (v.includes('archiv')) return 'archived';
  if (v.includes('draft')) return 'draft';
  return undefined;
}

export function parseTemplate(input: string): ParsedTemplate {
  const text = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!text) return { body: '' };

  const lines = text.split('\n');
  const sheet = parseFieldSheet(lines);
  if (sheet) return sheet;
  return parseInline(lines);
}

/**
 * Field-sheet parser: labels on their own line, value on following lines, body
 * runs until the next known label or a `---` divider. Returns null when no
 * known label is present so the caller can fall back to inline/Markdown.
 */
function parseFieldSheet(lines: string[]): ParsedTemplate | null {
  const buffers = new Map<FieldKey, string[]>();
  let current: FieldKey | null = null;
  let sawLabel = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (DIVIDER.test(trimmed)) break; // notes follow — stop here

    const match = trimmed.match(LABEL_LINE);
    if (match) {
      const key = LABELS[normalizeLabel(match[1])];
      // Once inside the body, only the tail fields (status / published) may end
      // it. A "Sources:" reference line in the body must stay in the body.
      if (key && !(current === 'body' && key !== 'status' && key !== 'ignore')) {
        sawLabel = true;
        current = key;
        if (!buffers.has(key)) buffers.set(key, []);
        const inline = match[2].trim();
        if (inline && !isPlaceholder(inline)) buffers.get(key)!.push(inline);
        continue;
      }
    }

    if (!current) continue; // preamble before the first label → ignore

    if (current === 'body') {
      buffers.get('body')!.push(line); // preserve raw Markdown (incl. blanks)
      continue;
    }
    // Scalar field: skip blanks and placeholder instructions.
    if (!trimmed || isPlaceholder(trimmed)) continue;
    buffers.get(current)!.push(trimmed);
  }

  if (!sawLabel) return null;

  const scalar = (k: FieldKey): string | undefined => {
    const arr = buffers.get(k);
    if (!arr || arr.length === 0) return undefined;
    const cleaned = cleanScalar(arr.join(' '));
    return cleaned || undefined;
  };

  const body = normalizeBodyHeadings((buffers.get('body') ?? []).join('\n').trim());

  // Source: an explicit SOURCE: label wins; otherwise pull the first link from a
  // "Sources:" line in the body (kept in the body for the reference list).
  const rawSource = (buffers.get('source') ?? []).join(' ').trim();
  const source = rawSource
    ? parseSourceValue(rawSource)
    : extractSourceFromBody(body);

  const result: ParsedTemplate = {
    title: scalar('title'),
    slug: scalar('slug'),
    dek: scalar('dek'),
    heroImage: scalar('heroImage'),
    heroAlt: scalar('heroAlt'),
    category: scalar('category'),
    author: scalar('author'),
    sourceName: source?.name,
    sourceUrl: source?.url,
    status: normalizeStatus(scalar('status')),
    body,
  };

  // Drop undefined keys for a clean object.
  (Object.keys(result) as (keyof ParsedTemplate)[]).forEach((k) => {
    if (result[k] === undefined) delete result[k];
  });
  return result;
}

/** Inline `Label: value` + plain-Markdown parser (leading `# Heading` = title). */
function parseInline(lines: string[]): ParsedTemplate {
  const fields: { title?: string; slug?: string; dek?: string } = {};
  const bodyLines: string[] = [];
  let inBody = false;

  for (const line of lines) {
    if (inBody) {
      bodyLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!fields.title && /^#\s+\S/.test(trimmed)) {
      fields.title = trimmed.replace(/^#\s+/, '').trim();
      continue;
    }

    const match = trimmed.match(/^([A-Za-z][A-Za-z /]{1,20}):\s*(.*)$/);
    if (match) {
      const label = normalizeLabel(match[1]);
      const value = match[2].trim();
      const key = LABELS[label];
      if (key === 'body') {
        inBody = true;
        if (value) bodyLines.push(value);
        continue;
      }
      if (key === 'title' || key === 'slug' || key === 'dek') {
        if (value) fields[key] = value;
        continue;
      }
    }

    if (!trimmed && bodyLines.length === 0) continue;

    inBody = true;
    bodyLines.push(line);
  }

  let body = normalizeBodyHeadings(bodyLines.join('\n').trim());

  if (!fields.dek) {
    const lead = extractLeadDek(body);
    if (lead) {
      fields.dek = lead.dek;
      body = lead.body;
    }
  }

  const source = extractSourceFromBody(body);
  return {
    ...fields,
    ...(source?.name ? { sourceName: source.name } : {}),
    ...(source?.url ? { sourceUrl: source.url } : {}),
    body,
  };
}

/**
 * Keep the body within the site's styled heading hierarchy. The public article
 * layout renders the headline as the page <h1> and styles only h2/h3/h4 inside
 * `.article-body`, so demote any body-level H1 to H2. Fenced code is untouched.
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

function extractLeadDek(body: string): { dek: string; body: string } | null {
  const text = body.trimStart();
  const breakIdx = text.indexOf('\n\n');
  if (breakIdx === -1) return null;

  const first = text.slice(0, breakIdx).trim();
  const rest = text.slice(breakIdx + 2).trim();

  const looksStructural = /^(#{1,6}\s|>\s?|[-*+]\s|\d+\.\s|```|~~~|!\[)/.test(first);
  const isPlainShortLine =
    first.length > 0 && first.length <= 220 && !first.includes('\n') && !looksStructural;

  if (isPlainShortLine && rest.length > 0) {
    return { dek: first, body: rest };
  }
  return null;
}
