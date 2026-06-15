import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Finance News',
    template: '%s | TrueRate',
  },
  description: "Business, investing, policy and market news from Liberia and across West Africa.",
  alternates: { canonical: '/news/finance' },
};

export default function FinanceNewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
