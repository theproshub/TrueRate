import DeskNav from '@/components/sports/DeskNav';

/**
 * Sports section masthead — the editorial desk nav. Light, editorial
 * (Bloomberg/FT-style) header. Search and the TrueRate wordmark live in the
 * global site header (see Header.tsx); the desk nav lives in <DeskNav>, a client
 * component that marks the active desk and scrolls horizontally on mobile.
 */
export default function SportsMasthead() {
  return (
    <header className="border-b border-gray-900/15 bg-brand-surface">
      <div className="mx-auto max-w-container px-4 pt-1">
        <DeskNav />
      </div>
    </header>
  );
}
