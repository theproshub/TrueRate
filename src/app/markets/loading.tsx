export default function MarketsLoading() {
  return (
    <div className="mx-auto max-w-container px-4 py-6">
      <div className="animate-pulse space-y-6">
        {/* Breadcrumb */}
        <div className="h-4 w-40 rounded bg-white" />

        {/* Top Movers + Today's Markets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-gray-200">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-5 w-48 rounded bg-white" />
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 w-20 rounded bg-white" />
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-4 w-full rounded bg-white" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-5 w-32 rounded bg-white" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-white" />
            ))}
          </div>
        </div>

        {/* Financial Markets row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-gray-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="h-4 w-36 rounded bg-white" />
              <div className="h-3 w-full rounded bg-white" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 w-full rounded bg-white" />
              ))}
              <div className="h-[140px] w-full rounded bg-white" />
            </div>
          ))}
        </div>

        {/* Lead story placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[280px] w-full rounded-xl bg-white" />
            <div className="h-6 w-3/4 rounded bg-white" />
            <div className="h-4 w-1/2 rounded bg-white" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-28 rounded bg-white" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-[60px] w-[88px] shrink-0 rounded-lg bg-white" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 rounded bg-white" />
                  <div className="h-4 w-full rounded bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
