const SUCCESS_RE =
  /\b(tests?\s+(all\s+)?(pass|passing|passed|green)|all\s+(tests|checks)\s+(pass|green)|build\s+(succeed|succeeded|passes|works|is\s+green|compiles)|compiles?\s+(cleanly|successfully|with\s+no\s+errors)|deployed(\s+to\s+production)?|it\s+works\s+now|(bug|issue|error|it)\s+is\s+fixed|fixed\s+(it|the\s+\w+))\b/i;

const URL_RE = /https?:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0|example\.(?:com|org))/i;

function contentOf(entry) {
  return entry.message?.content ?? entry.content;
}

function isRealUser(entry) {
  if (entry.type !== 'user') return false;
  const c = contentOf(entry);
  if (typeof c === 'string') return true;
  if (Array.isArray(c)) return c.some((b) => b.type === 'text');
  return false;
}

export function evaluate(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return [];

  let start = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (isRealUser(entries[i])) {
      start = i;
      break;
    }
  }

  let assistantText = '';
  let bashCount = 0;
  let fetchCount = 0;
  for (const entry of entries.slice(start)) {
    if (entry.type !== 'assistant') continue;
    const c = contentOf(entry);
    if (!Array.isArray(c)) continue;
    for (const block of c) {
      if (block.type === 'text') assistantText += '\n' + (block.text || '');
      if (block.type === 'tool_use') {
        const name = block.name || '';
        if (name === 'Bash') bashCount++;
        if (name === 'WebFetch' || name === 'WebSearch' || name.startsWith('mcp__')) fetchCount++;
      }
    }
  }

  const warnings = [];
  if (SUCCESS_RE.test(assistantText) && bashCount === 0) {
    warnings.push(
      'Claimed a success/result (tests pass, build works, deployed, or fixed) but ran no command this turn to verify it — anti-hallucination type 7. Run the command and show output before claiming.',
    );
  }
  if (URL_RE.test(assistantText) && fetchCount === 0) {
    warnings.push(
      'Introduced an external URL/citation without fetching it this turn — anti-hallucination type 3. Fetch the source before citing.',
    );
  }
  return warnings;
}
