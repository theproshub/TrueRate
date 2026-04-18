import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback — TrueRate',
  description: 'Help us improve TrueRate. Share bug reports, data corrections, or feature ideas.',
};

export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-[600px] px-4 py-12">
      <h1 className="mb-1 text-[26px] font-bold text-white">Feedback</h1>
      <p className="mb-8 text-[13px] text-gray-500">Help us improve TrueRate. All feedback is read by our team.</p>

      <div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-400">Type</label>
            <select className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-[14px] text-white outline-none focus:border-emerald-400/50">
              <option>General feedback</option>
              <option>Data error</option>
              <option>Feature request</option>
              <option>Bug report</option>
              <option>Content issue</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-400">Email (optional)</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-[14px] text-white outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-400">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us what you think…"
              className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-[14px] text-white outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 placeholder:text-gray-500 resize-none"
            />
          </div>
          <button className="w-full rounded-lg bg-white py-3 text-[14px] font-semibold text-[#0a0a0d] hover:bg-white/90 transition">
            Submit Feedback
          </button>
        </div>
      </div>
    </main>
  );
}
