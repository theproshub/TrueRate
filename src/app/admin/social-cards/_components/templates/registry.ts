import type { ComponentType } from 'react';
import type { CardTweaks, TemplateFormat } from './types';
import { BreakingTerminal, BreakingBroadsheet } from './breaking';
import { ArticleTerminal, ArticleBroadsheet } from './article';
import { QuoteTerminal, QuoteBroadsheet } from './quote';
import { StatTerminal, StatBroadsheet } from './stat';
import { MarketsTerminal, MarketsBroadsheet } from './markets';
import { RateTerminal, RateBroadsheet } from './rate';
import { EventTerminal, EventBroadsheet } from './event';
import { ExplainerTerminal, ExplainerBroadsheet } from './explainer';
import { StoryTerminal, StoryBroadsheet } from './story';
import { CoverTerminal, CoverBroadsheet } from './cover';

export interface TemplateEntry {
  terminal: ComponentType<{ data: CardTweaks }>;
  broadsheet: ComponentType<{ data: CardTweaks }>;
  label: string;
  size?: { w: number; h: number };
}

export const TR_TEMPLATES: Record<TemplateFormat, TemplateEntry> = {
  breaking: { terminal: BreakingTerminal, broadsheet: BreakingBroadsheet, label: 'Breaking' },
  article: { terminal: ArticleTerminal, broadsheet: ArticleBroadsheet, label: 'Article' },
  quote: { terminal: QuoteTerminal, broadsheet: QuoteBroadsheet, label: 'Quote' },
  stat: { terminal: StatTerminal, broadsheet: StatBroadsheet, label: 'Big Stat' },
  markets: { terminal: MarketsTerminal, broadsheet: MarketsBroadsheet, label: 'Markets' },
  rate: { terminal: RateTerminal, broadsheet: RateBroadsheet, label: 'Daily Rate' },
  event: { terminal: EventTerminal, broadsheet: EventBroadsheet, label: 'Event' },
  explainer: { terminal: ExplainerTerminal, broadsheet: ExplainerBroadsheet, label: 'Explainer' },
  story: { terminal: StoryTerminal, broadsheet: StoryBroadsheet, label: 'Story', size: { w: 1080, h: 1920 } },
  cover: { terminal: CoverTerminal, broadsheet: CoverBroadsheet, label: 'Video Cover', size: { w: 1080, h: 1920 } },
};

export function templateSize(format: TemplateFormat): { w: number; h: number } {
  return TR_TEMPLATES[format]?.size ?? { w: 1080, h: 1350 };
}
