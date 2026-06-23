import Link from 'next/link';
import { LATEST_NEWS } from '@/lib/builders-data';

export default function HeadlineList() {
  return (
    <section
      aria-labelledby="builders-latest"
      className="mb-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
    >
      <Link href="/news" className="group inline-flex items-center gap-1.5 mb-4 no-underline">
        <h2 id="builders-latest" className="text-md font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
          Latest News
        </h2>
        <span aria-hidden="true" className="text-md font-bold text-gray-900/60 group-hover:text-gray-600 transition-colors">›</span>
      </Link>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 list-none p-0 m-0">
        {LATEST_NEWS.map((item, i) => (
          <li key={i} className="border-b border-gray-200 last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
            <Link href={item.href} className="group flex flex-col py-3 no-underline">
              <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors mb-1">
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
