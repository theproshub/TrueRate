import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Economy — TrueRate',
  description: "Liberia's macroeconomic indicators — GDP, inflation, reserves, the CBL policy rate and public debt, tracked against the region.",
};

export default function EconomyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
