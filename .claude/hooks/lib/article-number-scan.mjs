const MONEY_RE =
  /(?:US\$|L\$|\$)\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:million|billion|thousand|bn|MT|metric tons))?/gi;
const PCT_RE = /\b\d[\d,]*(?:\.\d+)?\s?(?:percent|%)/gi;
const PERIOD_RE =
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-\s]?(?:20)?\d{2}\b|\bQ[1-4][-\s]?20\d{2}\b/i;

export function scan(text) {
  if (!text) return [];
  const flags = [];
  for (const re of [MONEY_RE, PCT_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const token = m[0].trim();
      const from = Math.max(0, m.index - 60);
      const to = Math.min(text.length, m.index + m[0].length + 60);
      const window = text.slice(from, to);
      if (!PERIOD_RE.test(window)) flags.push(token);
    }
  }
  return [...new Set(flags)];
}
