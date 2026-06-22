'use client';

import { useEffect, useState } from 'react';

const focusRing =
  'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none focus-visible:rounded-sm';

const SECTIONS = [
  { label: 'Our Story',       id: 'our-story'    },
  { label: 'What We Cover',   id: 'coverage'     },
  { label: 'Platform',        id: 'platform'     },
  { label: 'Data Sources',    id: 'data-sources' },
  { label: 'Our Standards',   id: 'standards'    },
  { label: 'Disclaimer',      id: 'disclaimer'   },
];

export default function TableOfContents() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const headings = SECTIONS
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Active band sits just below the 126px sticky header, ending ~60% down the
    // viewport — so the "current" section is the one whose heading is near the top.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-150px 0px -60% 0px', threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="On this page">
      <p className="text-2xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">On this page</p>
      <ul className="space-y-1">
        {SECTIONS.map(({ label, id }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`flex items-center gap-2 py-2 text-base transition-colors no-underline group ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                } ${focusRing}`}
              >
                <span
                  className={`h-px bg-current motion-safe:transition-all motion-safe:duration-200 ${
                    isActive
                      ? 'w-5 text-brand-accent-ink'
                      : 'w-3 text-gray-300 motion-safe:group-hover:w-5 group-hover:text-gray-900'
                  }`}
                  aria-hidden="true"
                />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
