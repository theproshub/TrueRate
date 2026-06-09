import { publicClient } from '@/lib/supabase/public';
import {
  CLUB_VALUATIONS,
  CLUB_PNL,
  ATHLETE_INTELLIGENCE,
  SPONSORSHIP_LEADERBOARD,
  TRANSFERS_TOP10,
  BROADCAST_DEALS,
  type ClubValuation,
  type ClubPnL,
  type AthleteIntel,
  type Sponsorship,
  type Transfer,
  type BroadcastDeal,
  type DealStatus,
} from '@/lib/sports-finance-data';

/**
 * Structured "intelligence" reads for the /sports numeric modules — the
 * companion to src/lib/sports/feed.ts (which handles editorial articles).
 *
 * Each helper queries its `sports_*` table (migration 019) and maps rows back
 * to the exact mock type the components already render, so the UI is untouched.
 * When a table is empty it returns the mock array, keeping the design preview
 * full until an editor uploads real figures.
 */

export async function fetchClubs(): Promise<{ valuations: ClubValuation[]; pnl: ClubPnL[] }> {
  const { data } = await publicClient.from('sports_clubs').select('*').order('rank', { ascending: true });
  if (!data || data.length === 0) return { valuations: CLUB_VALUATIONS, pnl: CLUB_PNL };
  return {
    valuations: data.map((r) => ({
      rank: r.rank, club: r.club, estValue: r.est_value ?? '', yoy: r.yoy ?? '',
      up: r.up ?? false, capacity: r.capacity ?? '', founded: r.founded ?? 0,
    })),
    pnl: data.map((r) => ({
      club: r.club, revenue: r.revenue ?? '', wages: r.wages ?? '',
      profit: r.profit ?? '', profitable: r.profitable ?? false, margin: r.margin ?? '',
    })),
  };
}

export async function fetchAthletes(): Promise<AthleteIntel[]> {
  const { data } = await publicClient.from('sports_athletes').select('*').order('rank', { ascending: true });
  if (!data || data.length === 0) return ATHLETE_INTELLIGENCE;
  return data.map((r) => ({
    rank: r.rank, name: r.name, pos: r.pos ?? '', club: r.club ?? '',
    marketValue: r.market_value ?? '', trend: r.trend ?? '', up: r.up ?? false,
  }));
}

export async function fetchSponsorships(): Promise<Sponsorship[]> {
  const { data } = await publicClient.from('sports_sponsorships').select('*').order('rank', { ascending: true });
  if (!data || data.length === 0) return SPONSORSHIP_LEADERBOARD;
  return data.map((r) => ({
    rank: r.rank, party: r.party, sponsor: r.sponsor,
    category: (r.category ?? 'Title') as Sponsorship['category'],
    annual: r.annual ?? '', totalValue: r.total_value ?? '',
    since: r.since_year ?? 0, expiry: r.expiry_year ?? 0,
    status: (r.status ?? 'active') as DealStatus,
  }));
}

export async function fetchTransfers(): Promise<Transfer[]> {
  const { data } = await publicClient.from('sports_transfers').select('*').order('rank', { ascending: true });
  if (!data || data.length === 0) return TRANSFERS_TOP10;
  return data.map((r) => ({
    rank: r.rank, player: r.player, pos: r.pos ?? '', from: r.from_club ?? '', to: r.to_club ?? '',
    fee: r.fee ?? '', contract: r.contract ?? '', status: (r.status ?? 'active') as DealStatus,
    date: r.deal_date ?? '', direction: (r.direction ?? 'domestic') as Transfer['direction'],
  }));
}

export async function fetchBroadcastDeals(): Promise<BroadcastDeal[]> {
  const { data } = await publicClient.from('sports_broadcast_deals').select('*').order('sort_order', { ascending: true });
  if (!data || data.length === 0) return BROADCAST_DEALS;
  return data.map((r) => ({
    comp: r.comp, rights: r.rights ?? '', value: r.value ?? '', perSeason: r.per_season ?? '',
    territory: r.territory ?? '', expiry: r.expiry ?? '', status: (r.status ?? 'active') as DealStatus,
  }));
}
