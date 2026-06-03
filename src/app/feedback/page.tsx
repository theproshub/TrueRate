import type { Metadata } from 'next';
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
      <Heading level={2} as="h1" className="mb-1 text-white">Feedback</Heading>
      <p className="mb-8 text-base text-gray-500">Help us improve TrueRate. All feedback is read by our team.</p>

      <FeedbackForm />
    </main>
  );
}
