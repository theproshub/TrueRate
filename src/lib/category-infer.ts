/**
 * Infer the best-fit article category from a draft's topics.
 *
 * Scores the title (weighted highest), standfirst, and body against per-category
 * keyword sets, and returns the id of the highest-scoring category that actually
 * exists in the editor's dropdown. Returns undefined when nothing matches, so the
 * caller can leave the field on "— None —".
 *
 * Keys below are the canonical category labels (lowercased) seeded in
 * supabase/migrations/005_seed_editorial_basics.sql. Only categories present in
 * the passed-in options are considered.
 */

export interface CategoryOption {
  id: string;
  label: string;
}

const KEYWORDS: Record<string, RegExp[]> = {
  economy: [
    /econom/, /inflation/, /fiscal/, /monetary/, /budget/, /\bimf\b/, /central bank/,
    /\bcbl\b/, /royalt/, /\btax(es|ation)?\b/, /revenue/, /\bfdi\b/, /concession/,
    /mining/, /iron ore/, /commodit/, /\btrade\b/, /tariff/, /\bexports?\b/,
    /\bimports?\b/, /\bgdp\b/, /\bdebt\b/, /exchange rate/, /liberian dollar/,
    /investment/, /\bmda\b/,
  ],
  markets: [
    /\bmarkets?\b/, /equit/, /\bstocks?\b/, /\bindex\b/, /\bindices\b/, /\bbonds?\b/,
    /\byield/, /\bforex\b/, /\bfx\b/, /\bgold\b/, /\boil\b/, /\bbrent\b/, /ticker/,
    /\bshares?\b/, /securities/, /\bs&p\b/, /nasdaq/, /\bdow\b/,
  ],
  business: [
    /compan(y|ies)/, /corporate/, /merger/, /acquisition/, /earnings/, /\bceo\b/,
    /\bfirm\b/, /industry/, /\bbusiness\b/, /\bdeal\b/, /profit/,
  ],
  'small business': [
    /entrepreneur/, /\bmsmes?\b/, /\bsmes?\b/, /startup/, /small business/,
    /microfinance/, /\bvendor/, /founder/, /local enterprise/,
  ],
  technology: [
    /\btech\b/, /technolog/, /fintech/, /telecom/, /software/, /\bapps?\b/, /digital/,
    /internet/, /mobile money/, /broadband/, /\bai\b/, /artificial intelligence/,
    /platform/,
  ],
  entertainment: [
    /\bmusic\b/, /\bfilm\b/, /\bmovie/, /celebrit/, /culture/, /lifestyle/, /\bartist/,
    /concert/, /fashion/, /entertainment/,
  ],
  sports: [
    /football/, /soccer/, /\blpl\b/, /\blwpl\b/, /\blba\b/, /lone star/, /athletic/,
    /\bmatch\b/, /\bleague\b/, /tournament/, /\bsports?\b/,
  ],
  world: [
    /international/, /\bforeign\b/, /\bglobal\b/, /ecowas/, /united nations/,
    /diplomat/, /\bborder/,
  ],
  analysis: [/\banalysis\b/, /deep dive/, /explainer/],
  opinion: [/\bopinion\b/, /editorial/, /op-?ed/, /\bcolumn\b/],
  // General/announcement signals. Kept last and deliberately narrow so topical
  // stories (Economy, Markets, …) still win ties; News catches press releases,
  // appointments, launches, and ceremonies with no stronger topical signal.
  news: [
    /press release/, /press conference/, /\bannounce/, /\bstatement\b/,
    /communiqu/, /inaugurat/, /\blaunch/, /ceremony/, /sworn[- ]in/,
    /\bappointment\b/, /\bappointed\b/, /\bdecree\b/, /executive order/,
    /ratif/, /\bcabinet\b/,
  ],
};

function countMatches(text: string, re: RegExp): number {
  if (!text) return 0;
  const m = text.match(new RegExp(re.source, 'gi'));
  return m ? m.length : 0;
}

export function inferCategory(
  parts: { title?: string; dek?: string; body?: string },
  options: CategoryOption[],
): string | undefined {
  if (options.length === 0) return undefined;

  const title = (parts.title ?? '').toLowerCase();
  const dek = (parts.dek ?? '').toLowerCase();
  const body = (parts.body ?? '').toLowerCase();
  if (!title && !dek && !body) return undefined;

  const available = new Map(
    options.map((o) => [o.label.trim().toLowerCase(), o]),
  );

  let best: { id: string; score: number } | null = null;
  for (const [category, patterns] of Object.entries(KEYWORDS)) {
    const option = available.get(category);
    if (!option) continue; // only categories that exist in the dropdown

    let score = 0;
    for (const re of patterns) {
      score +=
        countMatches(title, re) * 3 +
        countMatches(dek, re) * 2 +
        countMatches(body, re);
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id: option.id, score };
    }
  }
  return best?.id;
}
