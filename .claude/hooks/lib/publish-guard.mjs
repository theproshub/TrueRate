const PUBLISH_CMD_RE = /(import-news-articles|scripts\/[\w-]*publish[\w-]*)/i;
const STATUS_PUBLISHED_RE = /status\s*[:=]\s*['"]published['"]/;
const SLUG_RE = /slug\s*[:=]\s*['"]([a-z0-9-]+)['"]/i;
const CMD_SLUG_RE = /--slug[= ]([a-z0-9-]+)/i;
const DEFAULT_MAX_AGE_MS = 24 * 3600 * 1000;

export function detectPublish(toolName, input = {}) {
  if (toolName === 'Bash') {
    const cmd = input.command || '';
    if (PUBLISH_CMD_RE.test(cmd)) {
      const m = cmd.match(CMD_SLUG_RE);
      return { isPublish: true, slug: m ? m[1] : null };
    }
    return { isPublish: false, slug: null };
  }
  if (toolName === 'Edit' || toolName === 'Write') {
    const fp = input.file_path || '';
    if (!/news\.ts$/.test(fp)) return { isPublish: false, slug: null };
    const text = input.new_string ?? input.content ?? '';
    if (!STATUS_PUBLISHED_RE.test(text)) return { isPublish: false, slug: null };
    const m = text.match(SLUG_RE);
    return { isPublish: true, slug: m ? m[1] : null };
  }
  return { isPublish: false, slug: null };
}

export function decide(det, lookup, now = Date.now(), maxAgeMs = DEFAULT_MAX_AGE_MS) {
  if (!det.isPublish) return { deny: false };
  if (!det.slug) {
    return {
      deny: true,
      reason:
        'Bulk/unattributed publish detected. Run /number-lock <slug> and publish articles individually so every figure is verified (anti-hallucination publish-guard, type 1).',
    };
  }
  const r = lookup(det.slug);
  if (!r || !r.valid) {
    return {
      deny: true,
      reason: `No number-lock receipt for "${det.slug}". Run /number-lock ${det.slug} before publishing (anti-hallucination publish-guard, type 1).`,
    };
  }
  if (now - r.issuedAt > maxAgeMs) {
    return {
      deny: true,
      reason: `number-lock receipt for "${det.slug}" is stale (>24h). Re-run /number-lock ${det.slug} (anti-hallucination publish-guard, type 1).`,
    };
  }
  return { deny: false };
}
