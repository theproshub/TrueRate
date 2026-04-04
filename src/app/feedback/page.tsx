export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-[600px] px-4 py-12">
      <h1 className="mb-1 text-[24px] font-black text-white">Feedback</h1>
      <p className="mb-8 text-[13px] text-[#666]">Help us improve TrueRate. All feedback is read by our team.</p>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#161618] p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#888]">Type</label>
            <select className="w-full rounded-lg bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2]">
              <option>General feedback</option>
              <option>Data error</option>
              <option>Feature request</option>
              <option>Bug report</option>
              <option>Content issue</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#888]">Email (optional)</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2]/20 placeholder:text-[#444]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#888]">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us what you think…"
              className="w-full rounded-lg bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2]/20 placeholder:text-[#444] resize-none"
            />
          </div>
          <button className="w-full rounded-lg bg-[#6001d2] py-3 text-[14px] font-semibold text-white transition hover:bg-[#490099]">
            Submit Feedback
          </button>
        </div>
      </div>
    </main>
  );
}
