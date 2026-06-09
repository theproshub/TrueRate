import type { Metadata } from 'next';
import SportsChrome from '@/components/SportsChrome';

export const metadata: Metadata = {
  title: 'Sports Finance — Liberia & West Africa',
  description:
    'The money behind Liberian sports — club finance, sponsorships, transfers, and broadcast rights across Liberia and West Africa.',
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SportsChrome />

      {/* Design-preview notice. The sports section currently runs on placeholder
          data so the layout can be reviewed before real sources are wired in.
          Self-contained colours so it reads on both the dark and light pages. */}
      <div role="note" aria-label="Sample data notice" className="bg-amber-400 text-amber-950">
        <div className="mx-auto max-w-container px-4 py-2 flex items-start gap-2 text-sm">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="leading-snug">
            <span className="font-bold uppercase tracking-wide">Sample data</span>
            {' — '}
            this section uses placeholder content for design preview. Scores, valuations and deal
            figures are illustrative, not real reporting. Live sources will replace them.
          </p>
        </div>
      </div>

      {children}
    </>
  );
}
