export default function EconomyLoading() {
  return (
    <div className="mx-auto max-w-container px-4 py-6">
      <div className="animate-pulse space-y-6">
        {/* Breadcrumb */}
        <div className="h-4 w-32 rounded bg-white/[0.06]" />

        {/* Heading */}
        <div className="space-y-3">
          <div className="h-8 w-64 rounded bg-white/[0.06]" />
          <div className="h-4 w-96 rounded bg-white/[0.05]" />
        </div>

        {/* Indicators strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-white/[0.07] p-4 space-y-2">
              <div className="h-3 w-20 rounded bg-white/[0.06]" />
              <div className="h-6 w-24 rounded bg-white/[0.06]" />
              <div className="h-3 w-16 rounded bg-white/[0.05]" />
            </div>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[240px] w-full rounded-xl bg-white/[0.06]" />
            <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-4 w-1/2 rounded bg-white/[0.05]" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-white/[0.05]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
