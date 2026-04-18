import type { Metadata } from 'next';
import WatchlistClient from './WatchlistClient';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Watchlist — TrueRate',
  description: 'Your personal watchlist of Liberian indicators, forex pairs, and commodities.',
};

export default function WatchlistPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Watchlist' }]} />
      <WatchlistClient />
    </main>
  );
}
