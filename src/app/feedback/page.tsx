import type { Metadata } from 'next';
import Link from 'next/link';
import { Heading } from '@/components/ui';
import FeedbackForm from './_FeedbackForm';

export const metadata: Metadata = {
  title: 'Feedback',
  alternates: { canonical: '/feedback' },
  description: 'Help us improve TrueRate. Share bug reports, data corrections, or feature ideas.',
};

export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-[600px] px-4 py-12">
      <Heading level={2} as="h1" className="mb-1 text-gray-900">Feedback</Heading>
      <p className="mb-8 text-base text-gray-500">Help us improve TrueRate. All feedback is read by our team.</p>

      <FeedbackForm />

      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link href="/" className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 no-underline transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
