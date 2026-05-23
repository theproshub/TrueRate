import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'News',
    template: '%s | TrueRate',
  },
  description: "Business, investing, policy and market news from Liberia and across West Africa.",
  alternates: { canonical: '/news' },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
