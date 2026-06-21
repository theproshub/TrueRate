import { z } from 'zod';
import { TOPIC_TAGS } from '@/lib/category-colors';

/**
 * Card payload schemas. These both (a) constrain the AI's structured output
 * via generateObject and (b) validate anything before it hits content_cards.
 * Keep the constraints tight — they encode the editorial rules (word caps,
 * allowed categories, topic tags) so the model can't drift.
 */

/** Fine-grained badge — constrained to the canonical site vocabulary. */
export const TopicTagEnum = z.enum(TOPIC_TAGS);

// Matches TrueRate's real top-level sections (public.categories labels) so
// generated cards color correctly via getCatColor and map to live sections.
export const CARD_CATEGORIES = [
  'Economy',
  'Markets',
  'Business',
  'Technology',
  'Sports',
  'World',
] as const;
export const CategoryEnum = z.enum(CARD_CATEGORIES);

/** ≤N words helper */
const maxWords = (n: number) =>
  z.string().trim().refine((s) => s.split(/\s+/).filter(Boolean).length <= n, {
    message: `must be ${n} words or fewer`,
  });

// 1. BREAKING
export const BreakingSchema = z.object({
  headline: maxWords(10),
  summary: maxWords(25),
  category: CategoryEnum,        // top-level section
  topicTag: TopicTagEnum,        // fine-grained badge (required)
  source: z.string().trim().min(2), // attribution, e.g. "per league data"
});
export type Breaking = z.infer<typeof BreakingSchema>;

// 2. ARTICLE
export const ArticleSchema = z.object({
  headline: maxWords(14),
  deck: maxWords(30),
  thumbnailPrompt: z.string().trim().min(4), // for image gen / stock lookup
  readMinutes: z.number().int().min(2).max(6),
  category: CategoryEnum,
  topicTag: TopicTagEnum,
  tags: z.array(z.string().trim().min(2)).length(2),
});
export type Article = z.infer<typeof ArticleSchema>;

// 3. QUOTE — composite/illustrative speaker only (never a real named figure with invented words)
export const QuoteSchema = z.object({
  quote: maxWords(30),
  speakerName: z.string().trim().min(2),
  speakerTitle: z.string().trim().min(2),
  speakerOrg: z.string().trim().min(2),
  context: maxWords(15),
  topicTag: TopicTagEnum,        // replaces the old freeform `topic`
});
export type Quote = z.infer<typeof QuoteSchema>;

// 4. BIG STAT
export const BigStatSchema = z.object({
  value: z.string().trim().min(1),      // pre-formatted, e.g. "$2.4T", "87.3%"
  descriptor: maxWords(12),
  context: maxWords(15),                // "highest since March 2020"
  topicTag: TopicTagEnum,
  source: z.string().trim().min(2),
});
export type BigStat = z.infer<typeof BigStatSchema>;

// 5. MARKETS — assembled from a live API, never AI-generated.
export const MarketsTickerSchema = z.object({
  symbol: z.string().trim().min(1),
  name: z.string().trim().min(1),
  assetClass: z.enum(['index', 'forex', 'commodity', 'crypto', 'equity']),
  price: z.number(),
  change: z.number().nullable(),
  changePct: z.number().nullable(),
  sparkline: z.array(z.number()).max(7),
});
export type MarketsTicker = z.infer<typeof MarketsTickerSchema>;

export const MarketsSnapshotSchema = z.object({
  tickers: z.array(MarketsTickerSchema).min(1).max(6),
});
export type MarketsSnapshot = z.infer<typeof MarketsSnapshotSchema>;

// Batch schemas for the generator (it returns arrays per type)
export const BreakingBatchSchema = z.object({ cards: z.array(BreakingSchema).max(6) });
export const ArticleBatchSchema  = z.object({ cards: z.array(ArticleSchema).max(6) });
export const QuoteBatchSchema    = z.object({ cards: z.array(QuoteSchema).max(6) });
export const BigStatBatchSchema  = z.object({ cards: z.array(BigStatSchema).max(6) });

// Discriminated card shape as stored/returned
export type CardType = 'breaking' | 'article' | 'quote' | 'big_stat' | 'markets';
