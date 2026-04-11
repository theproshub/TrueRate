export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-[600px] px-4 py-12">
      <h1 className="mb-1 text-[26px] font-bold text-white">Feedback</h1>
      <p className="mb-8 text-[13px] text-gray-500">Help us improve TrueRate. All feedback is read by our team.</p>

      <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-400">Type</label>
            <select className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2]">
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
              className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2]/20 placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-400">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us what you think…"
              className="w-full rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2]/20 placeholder:text-gray-500 resize-none"
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
