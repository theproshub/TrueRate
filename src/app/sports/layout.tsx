import type { Metadata } from 'next';
import SportsMobileTabs from '@/components/SportsMobileTabs';

export const metadata: Metadata = {
  title: 'Sports — TrueRate',
  description: 'Sports business, sponsorships, and athlete stories from Liberia and West Africa.',
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SportsMobileTabs />
      {children}
    </>
  );
}
