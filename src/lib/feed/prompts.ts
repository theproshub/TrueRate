/**
 * Prompts for the daily feed generator. One shared system prompt encodes the
 * Bloomberg/Yahoo-Finance editorial voice; per-type builders inject the
 * anti-repetition list. All generated cards are reviewed by an editor before
 * publishing, so prompts aim for plausible, neutral drafts — not finished copy.
 */

export const EDITORIAL_SYSTEM = `You are a senior financial/sports wire editor for TrueRate, a Liberia-focused markets and sports outlet. Write to Bloomberg + Yahoo Finance standards:
- Authoritative, neutral, data-led. Active voice. Present tense for breaking news.
- Specific numbers over vague claims ("up 4.2%", "+25 bps"), never "skyrockets/plunges/stunning/massive".
- Correct financial/sports terminology (basis points, YoY, MoM, season avg, PPG).
- Headlines are declarative, never clickbait.
- These are DRAFTS for human review. Do not invent quotes from real named public figures. For QUOTE cards use clearly illustrative/composite speakers. For statistics, prefer figures you are confident are real and cite a real source; if a number is illustrative, make the source note say so.
- Favor Liberia / West Africa / African-market relevance where natural.`;

function avoidBlockText(recentHeadlines: string[]): string {
  if (recentHeadlines.length === 0) return 'No recent headlines to avoid.';
  return `Avoid duplicating these topics/angles from the last 7 days:\n${recentHeadlines
    .map((h) => `- ${h}`)
    .join('\n')}`;
}

export function breakingPrompt(count: number, recentHeadlines: string[]): string {
  return `Generate ${count} BREAKING news cards.
Each: headline (≤10 words, urgent but factual), one-sentence summary (≤25 words), a category from [Markets, Sports, Macro, Crypto, Earnings], and a plausible source attribution (e.g. "per league data", "according to Fed minutes").
Spread categories — at most 2 cards share a category.
${avoidBlockText(recentHeadlines)}`;
}

export function articlePrompt(count: number, recentHeadlines: string[]): string {
  return `Generate ${count} ARTICLE cards (feature/explainer drafts).
Each: headline (≤14 words), deck/subhead (≤30 words), a thumbnailPrompt describing an image to generate or look up, readMinutes (2–6), a category from [Markets, Sports, Macro, Crypto, Earnings], and exactly 2 tags.
Spread categories — at most 2 cards share a category.
${avoidBlockText(recentHeadlines)}`;
}

export function quotePrompt(count: number, recentHeadlines: string[]): string {
  return `Generate ${count} QUOTE cards using ILLUSTRATIVE / COMPOSITE speakers only — never attribute invented words to a real named public figure.
Each: quote (≤30 words, sounds attributable and analytical), speakerName, speakerTitle, speakerOrg (a plausible but composite institution), context line (≤15 words), and a topic tag.
${avoidBlockText(recentHeadlines)}`;
}

export function bigStatPrompt(count: number, recentHeadlines: string[]): string {
  return `Generate ${count} BIG STAT cards.
Each: value (pre-formatted, e.g. "$2.4T", "87.3%", "12,450 pts"), a one-line descriptor (≤12 words), a comparison/context (≤15 words, e.g. "highest since March 2020"), and a source.
Prefer figures you are confident are real and cite the real source. If a figure is illustrative, the source must say so.
${avoidBlockText(recentHeadlines)}`;
}
