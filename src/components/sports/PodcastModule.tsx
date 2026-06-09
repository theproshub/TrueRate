import Link from 'next/link';
import type { PodcastEpisode } from '@/lib/sports-finance-data';

/**
 * "Business of Liberian Sport" podcast module — episode list with a play
 * affordance, guest, and duration. Light styling.
 */
export default function PodcastModule({ episodes }: { episodes: PodcastEpisode[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-ink text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" /><path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11Z" /></svg>
        </span>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">The Business of Liberian Sport</p>
          <p className="text-2xs uppercase tracking-wide text-gray-500">Podcast · weekly</p>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {episodes.map((e) => (
          <li key={e.ep}>
            <Link
              href={e.href}
              className="flex items-center gap-3 py-3 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-inset"
            >
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-700 group-hover:border-brand-accent-ink group-hover:text-brand-accent-ink transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 translate-x-px"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-accent-ink transition-colors line-clamp-1">
                  Ep {e.ep}. {e.title}
                </span>
                <span className="block text-2xs text-gray-500 truncate">{e.guest} · {e.duration} · {e.date}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
