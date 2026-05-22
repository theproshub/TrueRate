'use client';

import useSWR from 'swr';
import type { CardType } from '@/lib/feed/schemas';

export interface FeedCard {
  id: string;
  type: CardType;
  category: string | null;
  payload: unknown;
  priority: number;
  is_ai_generated: boolean;
  source_note: string | null;
  published_at: string | null;
}

export interface FeedResponse {
  updatedAt: string;
  count: number;
  cards: Record<CardType, FeedCard[]>;
}

const fetcher = async (url: string): Promise<FeedResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
  return res.json();
};

/**
 * Client hook for the live feed. Revalidates on focus and every 5 minutes so
 * the UI stays fresh between the daily cron runs (e.g. when an editor publishes
 * a reviewed draft). Server response is already CDN-cached for an hour.
 */
export function useFeed() {
  const { data, error, isLoading, mutate } = useSWR<FeedResponse>('/api/feed', fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });

  return {
    cards: data?.cards,
    updatedAt: data?.updatedAt ?? null,
    count: data?.count ?? 0,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  };
}
