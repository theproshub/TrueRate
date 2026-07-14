import type { ComponentType } from 'react';
import type { CardTweaks, TemplateFormat } from './types';
import { BreakingTerminal, BreakingBroadsheet } from './breaking';
import { ArticleTerminal, ArticleBroadsheet } from './article';
import { QuoteTerminal, QuoteBroadsheet } from './quote';
import { StatTerminal, StatBroadsheet } from './stat';
import { MarketsTerminal, MarketsBroadsheet } from './markets';

export interface TemplateEntry {
  terminal: ComponentType<{ data: CardTweaks }>;
  broadsheet: ComponentType<{ data: CardTweaks }>;
  label: string;
  size?: { w: number; h: number };
}

// Task 5 fills in rate/event/explainer/story/cover.
export const TR_TEMPLATES = {
  breaking: { terminal: BreakingTerminal, broadsheet: BreakingBroadsheet, label: 'Breaking' },
  article: { terminal: ArticleTerminal, broadsheet: ArticleBroadsheet, label: 'Article' },
  quote: { terminal: QuoteTerminal, broadsheet: QuoteBroadsheet, label: 'Quote' },
  stat: { terminal: StatTerminal, broadsheet: StatBroadsheet, label: 'Big Stat' },
  markets: { terminal: MarketsTerminal, broadsheet: MarketsBroadsheet, label: 'Markets' },
} as Record<TemplateFormat, TemplateEntry>;

export function templateSize(format: TemplateFormat): { w: number; h: number } {
  return TR_TEMPLATES[format]?.size ?? { w: 1080, h: 1350 };
}
