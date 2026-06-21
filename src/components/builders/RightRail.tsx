import {
  TRENDING_SMES,
  TOP_GAINERS,
  ECON_EVENTS,
} from '@/lib/builders-data';
import LiveMarketsMini from '@/components/builders/LiveMarketsMini';
import StickySidebar from '@/components/StickySidebar';

function RightRailPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      aria-label={title}
      className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
    >
      <h3 className="text-sm font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-3">
        {title}
      </h3>
      {children}
    </section>
  );
}


function MarketsMini() {
  return (
    <RightRailPanel title="Liberia Markets">
      <LiveMarketsMini />
    </RightRailPanel>
  );
}

function TrendingSMEsPanel() {
  return (
    <RightRailPanel title="Trending SMEs">
      <ul className="list-none p-0 m-0 divide-y divide-white/[0.05]">
        {TRENDING_SMES.map((s, i) => (
          <li key={i} className="py-2.5 first:pt-0 last:pb-0">
            <p className="text-base font-bold text-white leading-tight">{s.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.sector} · {s.signal}</p>
          </li>
        ))}
      </ul>
    </RightRailPanel>
  );
}

function TopGainersPanel() {
  return (
    <RightRailPanel title="Top Gainers">
      <ul className="list-none p-0 m-0 divide-y divide-white/[0.05]">
        {TOP_GAINERS.map((g, i) => (
          <li key={i} className="flex items-baseline justify-between py-2 first:pt-0 last:pb-0 gap-3">
            <span className="text-sm font-semibold text-white/85">{g.label}</span>
            <span className="text-xs font-bold tabular-nums text-pos shrink-0">{g.change}</span>
          </li>
        ))}
      </ul>
    </RightRailPanel>
  );
}

function EventsListPanel() {
  return (
    <RightRailPanel title="Top Economic Events">
      <ul className="list-none p-0 m-0 divide-y divide-white/[0.05]">
        {ECON_EVENTS.map((e, i) => (
          <li key={i} className="py-2.5 first:pt-0 last:pb-0">
            <p className="text-xs font-semibold text-brand-accent mb-0.5 tabular-nums">{e.date}</p>
            <p className="text-sm font-semibold text-white/85 leading-snug">{e.title}</p>
          </li>
        ))}
      </ul>
    </RightRailPanel>
  );
}

export default function RightRail() {
  return (
    <aside className="w-full lg:w-[280px] shrink-0 lg:self-stretch lg:border-l lg:border-white/[0.08] lg:pl-5">
      <StickySidebar>
        <MarketsMini />
        <TrendingSMEsPanel />
        <TopGainersPanel />
        <EventsListPanel />
      </StickySidebar>
    </aside>
  );
}
