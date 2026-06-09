import Link from 'next/link';
import { AuthorAvatar } from '@/components/NewsThumbnail';
import type { ExecutiveInterview } from '@/lib/sports-finance-data';

/**
 * Executive interview block — pull-quote led, attributed to a named leader
 * (owner, coach, federation official, athlete). Light editorial styling.
 */
export default function InterviewCard({ item }: { item: ExecutiveInterview }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 no-underline hover:border-gray-300 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2"
    >
      <span className="text-2xs font-bold uppercase tracking-wider text-brand-accent-ink mb-3">{item.topic}</span>
      <blockquote className="flex-1">
        <p className="text-md leading-relaxed text-gray-800 text-pretty">
          <span aria-hidden="true" className="text-brand-accent-ink">“</span>
          {item.quote}
          <span aria-hidden="true" className="text-brand-accent-ink">”</span>
        </p>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-200">
        <AuthorAvatar name={item.name} className="h-10 w-10 shrink-0" />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-gray-900 truncate group-hover:text-brand-accent-ink transition-colors">{item.name}</span>
          <span className="block text-xs text-gray-500 truncate">{item.role}</span>
        </span>
      </figcaption>
    </Link>
  );
}
