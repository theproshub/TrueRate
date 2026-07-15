import SocialCardStudio from './_components/SocialCardStudio';
import { refreshStories, refreshRates, refreshCommodities, refreshIndicators } from './_actions';

export const metadata = { title: 'Social Cards' };
export const dynamic = 'force-dynamic';

export default async function SocialCardsPage() {
  // Layout already ran requireAdmin(); actions re-check per call.
  const [stories, rates, commodities, indicators] = await Promise.all([
    refreshStories(),
    refreshRates(),
    refreshCommodities(),
    refreshIndicators(),
  ]);

  return (
    <SocialCardStudio
      initialStories={stories}
      initialRates={rates}
      initialCommodities={commodities}
      initialIndicators={indicators}
    />
  );
}
