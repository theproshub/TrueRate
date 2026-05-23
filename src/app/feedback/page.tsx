import type { Metadata } from 'next';
import { Heading } from '@/components/ui';

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

      <div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-400">Type</label>
            <select className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-md text-white outline-none focus:border-emerald-700/50">
              <option>General feedback</option>
              <option>Data error</option>
              <option>Feature request</option>
              <option>Bug report</option>
              <option>Content issue</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-400">Email (optional)</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-md text-white outline-none focus:border-emerald-700/50 focus:ring-1 focus:ring-emerald-700/20 placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-400">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us what you think…"
              className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-md text-white outline-none focus:border-emerald-700/50 focus:ring-1 focus:ring-emerald-700/20 placeholder:text-gray-500 resize-none"
            />
          </div>
          <button className="w-full rounded-lg bg-white py-3 text-md font-semibold text-brand-ink hover:bg-white/90 transition">
            Submit Feedback
          </button>
        </div>
      </div>
    </main>
  );
}
