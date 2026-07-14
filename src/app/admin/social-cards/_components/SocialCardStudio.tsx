'use client';

import type { CommodityQuote } from '@/domain/markets/commodities';
import type { StoryItem } from './prefill';
import type { RatesPayload } from '../_actions';

export interface StudioProps {
  initialStories: StoryItem[];
  initialRates: RatesPayload;
  initialCommodities: CommodityQuote[];
}

export default function SocialCardStudio(props: StudioProps) {
  return <p className="text-gray-400">Studio loading… ({props.initialStories.length} stories)</p>;
}
