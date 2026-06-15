'use client';

import { usePathname } from 'next/navigation';

/** Thin client wrapper: hides Footer on /sports and /admin routes. */
export default function FooterVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}
