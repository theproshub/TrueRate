import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SectionEndNav from '@/components/SectionEndNav';
import FeedClient from './FeedClient';

export const metadata: Metadata = {
  title: 'Live Feed — TrueRate',
  description:
    'Breaking news, markets, big stats, and analysis for Liberia and West Africa — refreshed daily.',
};

export default function FeedPage() {
  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Feed' }]} />
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">Live Feed</h1>
      <p className="mb-6 text-sm text-gray-500">
        Markets update daily from live sources. Editorial cards are reviewed before publishing.
      </p>
      <FeedClient />
      <SectionEndNav currentHref="/feed" />
    </main>
  );
}
