import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entertainment — TrueRate',
  description: "Music, film, and the creative economy driving Liberian culture.",
};

export default function EntertainmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
