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
  );
}
