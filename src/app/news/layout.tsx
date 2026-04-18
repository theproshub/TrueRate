import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News — TrueRate',
  description: "Business, investing, policy and market news from Liberia and across West Africa.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
