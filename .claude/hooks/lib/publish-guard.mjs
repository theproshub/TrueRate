// publish-guard: a stop-and-confirm tripwire on Claude-initiated bulk article
// publishes. TrueRate publishes by running the bulk importer
// (scripts/import-news-articles.mjs), which writes status:'published' to the
// Supabase `articles` table — NOT to src/data/news.ts (the fallback seed has
// no status/slug fields). Because the importer publishes many articles at once
// with no per-article slug, this hook cannot verify a per-article number-lock;
// it denies the command so a human confirms every article was number-locked
// first. Heuristic: a JS runner (`node`) AND a publish-y script target must
// both appear, so inspecting the script (cat/grep/git log) is not blocked.

const RUNNER_RE = /\bnode\b/i;
const PUBLISH_TARGET_RE = /(?:import-news-articles|scripts\/publish[\w-]*\.(?:mjs|js|ts))/i;

export function isPublishCommand(toolName, input = {}) {
  if (toolName !== 'Bash') return false;
  const cmd = input.command || '';
  return RUNNER_RE.test(cmd) && PUBLISH_TARGET_RE.test(cmd);
}

export const DENY_REASON =
  'Bulk article publish detected. Before publishing, confirm every affected ' +
  'article has passed /number-lock with its figures verified against the CBL ' +
  'warehouse. Stop-and-confirm gate — anti-hallucination publish-guard (type 1).';
