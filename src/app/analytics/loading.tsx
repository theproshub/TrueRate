export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-container px-4 py-6">
      <div className="animate-pulse space-y-6">
        {/* Ticker tape */}
        <div className="h-10 w-full rounded bg-white/[0.04] border-y border-white/10" />

        {/* Header */}
        <div className="h-5 w-48 rounded bg-white/[0.06]" />

        {/* Terminal layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Stat columns */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, s) => (
              <div key={s} className="space-y-2">
                <div className="h-4 w-28 rounded bg-white/[0.06]" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 w-full rounded bg-white/[0.05]" />
                ))}
              </div>
            ))}
          </div>

          {/* Focus panel */}
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-white/[0.06]" />
            <div className="h-[260px] w-full rounded-lg bg-white/[0.04]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 rounded bg-white/[0.05]" />
              <div className="h-16 rounded bg-white/[0.05]" />
            </div>
            <div className="h-4 w-3/4 rounded bg-white/[0.05]" />
          </div>
        </div>
      </div>
    </div>
  );
}
