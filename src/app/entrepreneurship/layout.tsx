import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrepreneurship — TrueRate',
  description: "Founders, small businesses, and the people building Liberia's private sector.",
};

export default function EntrepreneurshipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
