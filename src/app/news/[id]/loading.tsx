export default function ArticleLoading() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse mb-6" />
        <div className="flex gap-6 items-start">
          <div className="hidden lg:block w-[220px] shrink-0 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 min-w-0 pb-8">
            <div className="animate-pulse space-y-5 border-b border-gray-100 pb-8 mb-8">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-5/6 rounded bg-gray-200" />
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-64 rounded bg-gray-200" />
              <div className="h-[320px] w-full rounded bg-gray-200" />
            </div>
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-4 w-full rounded bg-gray-100" />
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-[280px] shrink-0 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 w-full rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
