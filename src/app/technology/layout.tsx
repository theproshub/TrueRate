import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology — TrueRate',
  description: "Fintech, mobile money, telecom, and the startup ecosystem shaping Liberia's tech economy.",
};

export default function TechnologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
