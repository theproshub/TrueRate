import {
  TRENDING_SMES,
  TOP_GAINERS,
} from '@/lib/builders-data';
import LiveMarketsMini from '@/components/builders/LiveMarketsMini';
import EconomicEventsCalendar from '@/components/EconomicEventsCalendar';
import StickySidebar from '@/components/StickySidebar';

function RightRailPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      aria-label={title}
      className="rounded-xl border border-gray-200 bg-white p-4"
    >
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-3">
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
      <ul className="list-none p-0 m-0 divide-y divide-gray-200">
        {TRENDING_SMES.map((s, i) => (
          <li key={i} className="py-2.5 first:pt-0 last:pb-0">
            <p className="text-base font-bold text-gray-900 leading-tight">{s.name}</p>
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
      <ul className="list-none p-0 m-0 divide-y divide-gray-200">
        {TOP_GAINERS.map((g, i) => (
          <li key={i} className="flex items-baseline justify-between py-2 first:pt-0 last:pb-0 gap-3">
            <span className="text-sm font-semibold text-gray-700">{g.label}</span>
            <span className="text-xs font-bold tabular-nums text-pos shrink-0">{g.change}</span>
          </li>
        ))}
      </ul>
    </RightRailPanel>
  );
}

function EventsListPanel() {
  return <EconomicEventsCalendar limit={4} />;
}

export default function RightRail() {
  return (
    <aside className="w-full lg:w-[280px] shrink-0 lg:self-stretch lg:border-l lg:border-gray-200 lg:pl-5">
      <StickySidebar>
        <MarketsMini />
        <TrendingSMEsPanel />
        <TopGainersPanel />
        <EventsListPanel />
      </StickySidebar>
    </aside>
  );
}
