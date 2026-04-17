import type { Metadata } from 'next';
import { COMPANIES, FEATURED_COMPANIES } from '@/data/companies';
import DirectoryClient from './DirectoryClient';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Business Directory — TrueRate',
  description: 'Profiles of private companies and industries operating in Liberia across mining, banking, agriculture, energy, telecom, and logistics.',
};

export const revalidate = 86400;

// Only show private and mixed-ownership companies — not state-owned or regulatory bodies
const PRIVATE_COMPANIES = COMPANIES.filter(
  c => c.ownership !== 'State-Owned' && c.sector !== 'Regulatory'
);
const PRIVATE_FEATURED = FEATURED_COMPANIES.filter(
  c => c.ownership !== 'State-Owned' && c.sector !== 'Regulatory'
);


export default function DirectoryPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8 pb-24">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Companies' }]} />

      <div className="mt-6 mb-12">
        <h1 className="text-[36px] sm:text-[48px] font-black text-white leading-[1.05] tracking-tight mb-4">
          Companies in Liberia
        </h1>
        <p className="text-[16px] text-gray-400 leading-[1.8] max-w-[600px]">
          Private companies and industries operating across mining, banking, agriculture, energy, and telecom — the businesses driving the Liberian economy.
        </p>
      </div>

      <DirectoryClient companies={PRIVATE_COMPANIES} featured={PRIVATE_FEATURED} />

    </main>
  );
}
