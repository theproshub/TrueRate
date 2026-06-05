/**
 * Read a dropped/uploaded draft file and return Markdown text.
 *
 * Supported:
 *   - .docx  — Word documents (converted to Markdown via mammoth → turndown)
 *   - .md / .markdown / .txt — read as-is
 *
 * The returned Markdown is fed to `parseTemplate` (see article-template.ts),
 * which splits it into the form's Title / Standfirst / Body fields. Nothing is
 * invented — it only restructures what the file already contains.
 *
 * The heavy parsers are dynamically imported so they ship only in the admin
 * editor bundle, not on the public site.
 */

export const ACCEPTED_DRAFT_TYPES =
  '.docx,.md,.markdown,.txt,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
  'text/markdown,text/plain';

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

export async function extractDraftFile(file: File): Promise<string> {
  const ext = extensionOf(file.name);

  if (ext === 'md' || ext === 'markdown' || ext === 'txt' || ext === 'text') {
    return (await file.text()).trim();
  }

  if (ext === 'docx') {
    const [mammothMod, turndownMod] = await Promise.all([
      import('mammoth'),
      import('turndown'),
    ]);
    const mammoth = mammothMod.default;
    const TurndownService = turndownMod.default;

    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    // Word inlines images as base64 data URIs — strip them; the hero image is
    // set separately and base64 blobs would bloat the body field.
    const cleaned = html.replace(/<img[^>]*>/gi, '');

    const turndown = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
    });
    return turndown.turndown(cleaned).trim();
  }

  if (ext === 'doc') {
    throw new Error(
      'Old .doc files aren’t supported — re-save as .docx, or paste the text instead.',
    );
  }

  throw new Error(
    `Can’t read “.${ext || 'unknown'}” files. Use .docx, .md, or .txt — or paste the text instead.`,
  );
}
