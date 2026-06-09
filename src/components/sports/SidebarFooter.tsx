import Link from 'next/link';
import { Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';

const LINKS: { label: string; href: string }[] = [
  { label: 'About TrueRate', href: '/about' },
  { label: 'Terms of Service',  href: '/terms' },
  { label: 'Privacy Policy',    href: '/privacy' },
  { label: 'Advertise with Us', href: '/advertise' },
  { label: 'Contact',           href: '/contact' },
  { label: 'Send Feedback',     href: '/feedback' },
];

export default function SidebarFooter() {
  return (
    <aside aria-label="Site information" className="border-t border-gray-900/15 pt-6">
      {/* Social icons */}
      <ul className="flex items-center gap-3 mb-4" aria-label="TrueRate on social media">
        {ACTIVE_SOCIAL_LINKS.map(s => (
          <li key={s.key}>
            <a
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1"
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d={s.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      {/* Attribution */}
      <Text variant="meta" className="leading-relaxed text-gray-500 mb-4">
        TrueRate Sports. Match data via{' '}
        <a href="https://liberianfa.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-accent-ink transition-colors">
          LFA
        </a>
        {' '}and{' '}
        <a href="#" className="text-gray-600 hover:text-brand-accent-ink transition-colors">
          LBA
        </a>
        . Diaspora coverage powered by TrueRate correspondents.
      </Text>

      {/* Nav links */}
      <nav aria-label="Site footer links">
        <ul className="flex flex-col gap-1.5">
          {LINKS.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Copyright */}
      <Text variant="meta" className="mt-4 text-gray-500">
        © {new Date().getFullYear()} TrueRate. All rights reserved.
      </Text>
    </aside>
  );
}
