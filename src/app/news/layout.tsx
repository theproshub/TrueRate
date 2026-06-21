import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'News',
    template: '%s | TrueRate',
  },
  description: "The latest news from Liberia — finance, sports, technology, and more.",
  alternates: { canonical: '/news' },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
