import type { Metadata } from 'next';
import MarketWomenMode from './MarketWomenMode';

export const metadata: Metadata = {
  title: 'Market Women Mode — Today’s Money News, Made Simple',
  description:
    'A simple, spoken view of Liberia’s key money numbers — the US dollar rate, prices, fuel, and the cost to borrow. Tap any box to hear it read aloud.',
  robots: { index: true, follow: true },
};

export default function MarketWomenModePage() {
  return <MarketWomenMode />;
}
