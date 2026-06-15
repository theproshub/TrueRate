import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import TopStoriesGrid from '@/components/builders/TopStoriesGrid';
import HeadlineList from '@/components/builders/HeadlineList';
import SectionFourCards from '@/components/builders/SectionFourCards';
import VideoFeature from '@/components/builders/VideoFeature';
import MoreStoriesList from '@/components/builders/MoreStoriesList';
import RightRail from '@/components/builders/RightRail';
import {
  ENTREPRENEUR_CARDS,
  SIDE_HUSTLE_CARDS,
  THE_HUSTLE_CARDS,
  FRANCHISE_CARDS,
} from '@/lib/builders-data';

export const metadata: Metadata = {
  title: 'TrueRate Builders — Liberian Small Business & Entrepreneurship',
  alternates: { canonical: '/small-business' },
  description:
    "News, capital, and ideas for Liberia's small business owners, founders, and operators — from Monrovia to the counties.",
};

export default function SmallBusinessPage() {
  return (
    <>
      <div role="note" aria-label="Sample data notice" className="bg-amber-400 text-amber-950">
        <div className="mx-auto max-w-container px-4 py-2 flex items-start gap-2 text-sm">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="leading-snug">
            <span className="font-bold uppercase tracking-wide">Sample data</span>
            {' — '}
            this section uses placeholder content for design preview. Headlines and figures are
            illustrative, not real reporting. They will be replaced once entrepreneurship stories
            are published.
          </p>
        </div>
      </div>
    <main className="mx-auto max-w-container px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Entrepreneurship' }]} />

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main column (≈70%) */}
        <div className="flex-1 min-w-0">
          <TopStoriesGrid />
          <HeadlineList />

          <SectionFourCards
            id="builders-entrepreneur"
            badge="E"
            title="Entrepreneur"
            subtitle="Build Your Business"
            items={ENTREPRENEUR_CARDS}
          />

          <VideoFeature />

          <SectionFourCards
            id="builders-side-hustle"
            title="Start a Side Hustle"
            items={SIDE_HUSTLE_CARDS}
          />

          <SectionFourCards
            id="builders-the-hustle"
            badge="H"
            title="The Hustle"
            items={THE_HUSTLE_CARDS}
          />

          <SectionFourCards
            id="builders-franchise"
            title="Franchise"
            items={FRANCHISE_CARDS}
          />

          <MoreStoriesList />
        </div>

        {/* Right rail (≈30%) */}
        <RightRail />
      </div>

    </main>
    </>
  );
}
