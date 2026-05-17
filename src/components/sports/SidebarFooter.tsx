import Link from 'next/link';
import { Text } from '@/components/ui';

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/truerate',
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/truerate',
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/truerate',
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@truerate',
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#050d11" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/truerate',
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L0 24l6.335-1.507A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.002-1.37l-.36-.213-3.757.894.952-3.653-.234-.376A9.818 9.818 0 1 1 12 21.818z" />
      </svg>
    ),
  },
];

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
    <aside aria-label="Site information" className="border-t border-white/[0.08] pt-6">
      {/* Social icons */}
      <ul className="flex items-center gap-3 mb-4" aria-label="TrueRate on social media">
        {SOCIALS.map(s => (
          <li key={s.label}>
            <a
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-7 w-7 rounded-full bg-white/[0.06] text-gray-400 hover:bg-lime-500/20 hover:text-lime-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
              {s.icon}
            </a>
          </li>
        ))}
      </ul>

      {/* Attribution */}
      <Text variant="meta" className="leading-relaxed text-gray-500 mb-4">
        TrueRate Sports. Match data via{' '}
        <a href="https://liberianfa.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition-colors">
          LFA
        </a>
        {' '}and{' '}
        <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
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
                className="text-sm text-gray-400 hover:text-white transition-colors no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Copyright */}
      <Text variant="meta" className="mt-4 text-gray-600">
        © {new Date().getFullYear()} TrueRate. All rights reserved.
      </Text>
    </aside>
  );
}
