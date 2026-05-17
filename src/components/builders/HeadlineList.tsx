import Link from 'next/link';
import { LATEST_NEWS } from '@/lib/builders-data';

export default function HeadlineList() {
  return (
    <section
      aria-labelledby="builders-latest"
      className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6"
    >
      <Link href="/news" className="group inline-flex items-center gap-1.5 mb-4 no-underline">
        <h2 id="builders-latest" className="text-md font-bold text-white group-hover:text-brand-accent transition-colors">
          Latest News
        </h2>
        <span aria-hidden="true" className="text-md font-bold text-white/60 group-hover:text-brand-accent transition-colors">›</span>
      </Link>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 list-none p-0 m-0">
        {LATEST_NEWS.map((item, i) => (
          <li key={i} className="border-b border-white/[0.05] last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
            <Link href={item.href} className="group flex flex-col py-3 no-underline">
              <h3 className="text-sm sm:text-base font-semibold leading-snug text-white group-hover:text-brand-accent transition-colors mb-1">
                {item.title}
              </h3>
              <span className="text-xs text-gray-500">{item.source}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
