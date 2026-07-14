import SocialCardStudio from './_components/SocialCardStudio';
import { refreshStories, refreshRates, refreshCommodities } from './_actions';

export const metadata = { title: 'Social Cards' };
export const dynamic = 'force-dynamic';

export default async function SocialCardsPage() {
  // Layout already ran requireAdmin(); actions re-check per call.
  const [stories, rates, commodities] = await Promise.all([
    refreshStories(),
    refreshRates(),
    refreshCommodities(),
  ]);

  return (
    <SocialCardStudio
      initialStories={stories}
      initialRates={rates}
      initialCommodities={commodities}
    />
  );
}
