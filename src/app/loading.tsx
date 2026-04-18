export default function Loading() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 rounded bg-white/[0.06]" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-4">
            <div className="h-[260px] w-full rounded-lg bg-white/[0.06]" />
            <div className="h-6 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-4 w-1/2 rounded bg-white/[0.05]" />
            <div className="h-4 w-5/6 rounded bg-white/[0.05]" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-24 rounded bg-white/[0.06]" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-white/[0.05]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
