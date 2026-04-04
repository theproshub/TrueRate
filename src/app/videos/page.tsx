const VIDEOS = [
  { title: "CBL Governor on rate outlook: 'We\u2019re watching food prices closely'", duration: '2:48', thumb: 'https://picsum.photos/seed/v1/640/360', source: 'TrueRate Video', time: '55m ago', desc: 'The Central Bank of Liberia Governor addresses concerns around food inflation and its impact on monetary policy decisions.' },
  { title: 'ArcelorMittal Nimba expansion \u2014 what it means for Liberia GDP', duration: '1:52', thumb: 'https://picsum.photos/seed/v2/640/360', source: 'TrueRate Video', time: '3h ago', desc: 'A deep-dive into the $120M expansion of iron ore operations and its projected contribution to national GDP.' },
  { title: 'Rubber prices surge: Firestone investors react to record output', duration: '3:14', thumb: 'https://picsum.photos/seed/v3/640/360', source: 'TrueRate Video', time: '8h ago', desc: 'Record rubber production at Firestone Liberia sends prices higher as global demand picks up.' },
  { title: 'Diaspora remittances hit $680M \u2014 a new record for Liberia', duration: '2:31', thumb: 'https://picsum.photos/seed/v4/640/360', source: 'TrueRate Video', time: '3h ago', desc: 'Liberian diaspora remittances reach an all-time high, bolstering household income and foreign reserves.' },
  { title: 'Ecobank West Africa Q1 earnings: What analysts are saying', duration: '4:05', thumb: 'https://picsum.photos/seed/v5/640/360', source: 'TrueRate Video', time: '1d ago', desc: 'A roundtable with financial analysts on Ecobank Transnational\'s strong Q1 results and the West Africa banking outlook.' },
  { title: 'Liberia infrastructure bonds — who\'s buying?', duration: '2:19', thumb: 'https://picsum.photos/seed/v6/640/360', source: 'TrueRate Video', time: '2d ago', desc: 'The World Bank-backed $45M infrastructure bond program draws interest from regional and international investors.' },
];

export default function VideosPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-1 text-[24px] font-black text-white">Videos</h1>
      <p className="mb-8 text-[13px] text-[#666]">Market analysis, interviews, and financial news from Liberia</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v, i) => (
          <div key={i} className="group flex flex-col cursor-pointer">
            <div className="relative overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt="" className="w-full object-cover transition-transform duration-300 group-hover:scale-105" style={{ height: '180px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 transition-transform duration-200 group-hover:scale-110">
                  <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">{v.duration}</span>
            </div>
            <div className="mt-3 flex-1">
              <h3 className="text-[14px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">{v.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[12px] text-[#777]">{v.desc}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#555]">
                <span>{v.source}</span>
                <span>·</span>
                <span>{v.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
