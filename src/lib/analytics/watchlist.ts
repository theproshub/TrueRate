import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Supabase-backed watchlist (read side + resolution helpers).
 *
 * Source of truth: `watchlist_groups` + `watchlist_items` (RLS-scoped to
 * auth.uid()). Items reference either a `symbols` row (FX/commodity) or a
 * `macro_series` row. The app speaks string "ref ids":
 *   - price item  → symbols.ticker   (e.g. "USD/LRD", "gc.f")
 *   - macro item  → macro_series.series_id (e.g. "WB.NY.GDP.MKTP.KD.ZG")
 *
 * Anonymous users have no session → every read returns an empty set and the UI
 * shows a sign-in prompt. Never throws for the unauthenticated case.
 */

const DEFAULT_GROUP = 'My Watchlist';

export interface WatchlistState {
  /** True when a user session exists. */
  authed: boolean;
  /** Ref ids (tickers + series_ids) the user currently watches. */
  refIds: string[];
}

type SbClient = Awaited<ReturnType<typeof createClient>>;

async function currentUserId(sb: SbClient): Promise<string | null> {
  const { data } = await sb.auth.getUser();
  return data.user?.id ?? null;
}

/** Read the signed-in user's watchlist as ref ids. Empty when signed out. */
export async function getWatchlist(): Promise<WatchlistState> {
  const sb = await createClient();
  const userId = await currentUserId(sb);
  if (!userId) return { authed: false, refIds: [] };

  // Items joined to their symbol/macro keys. RLS limits rows to this user.
  const { data, error } = await sb
    .from('watchlist_items')
    .select('symbol_id, macro_id, symbols(ticker), macro_series(series_id)')
    .order('added_at', { ascending: true });

  if (error) return { authed: true, refIds: [] };

  const refIds: string[] = [];
  for (const row of data ?? []) {
    const r = row as unknown as {
      symbols: { ticker: string } | null;
      macro_series: { series_id: string } | null;
    };
    const ref = r.symbols?.ticker ?? r.macro_series?.series_id;
    if (ref) refIds.push(ref);
  }
  return { authed: true, refIds };
}

/** Resolve a ref id to its FK target. Returns null if unknown. */
export async function resolveRef(
  sb: SbClient,
  refId: string,
): Promise<{ symbol_id: string } | { macro_id: string } | null> {
  // Try symbols (ticker) first, then macro_series (series_id).
  const { data: sym } = await sb.from('symbols').select('id').eq('ticker', refId).maybeSingle();
  if (sym) return { symbol_id: sym.id };

  const { data: macro } = await sb.from('macro_series').select('id').eq('series_id', refId).maybeSingle();
  if (macro) return { macro_id: macro.id };

  return null;
}

/** Get the user's default watchlist group id, creating it if needed. */
export async function ensureDefaultGroup(sb: SbClient, userId: string): Promise<string | null> {
  const { data: existing } = await sb
    .from('watchlist_groups')
    .select('id')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await sb
    .from('watchlist_groups')
    .insert({ user_id: userId, name: DEFAULT_GROUP, display_order: 0 })
    .select('id')
    .single();
  if (error) return null;
  return created.id;
}

export { currentUserId };
