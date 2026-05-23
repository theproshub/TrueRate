import type { Metadata } from 'next';
import SportsChrome from '@/components/SportsChrome';

export const metadata: Metadata = {
  title: 'Sports Finance — Liberia & West Africa',
  description:
    'The money behind Liberian sports — club finance, sponsorships, transfers, and broadcast rights across Liberia and West Africa.',
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SportsChrome />
      {children}
    </>
  );
}
