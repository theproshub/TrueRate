import {
  getUpcomingEvents,
  getPastEvents,
  CATEGORY_LABELS,
  type EconomicEvent,
  type EventImpact,
} from '@/data/economic-events';

const IMPACT_STYLES: Record<EventImpact, string> = {
  high:   'bg-neg/10 text-neg border-neg/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  low:    'bg-gray-100 text-gray-500 border-gray-200',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(iso: string): { month: string; day: string; full: string } {
  const d = new Date(iso + 'T00:00:00');
  return {
    month: MONTHS[d.getMonth()],
    day: String(d.getDate()),
    full: `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  };
}

function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

function EventRow({ event, isPast }: { event: EconomicEvent; isPast?: boolean }) {
  const date = formatDate(event.date);
  const days = daysUntil(event.date);

  return (
    <li className={`flex gap-3 py-3 ${isPast ? 'opacity-50' : ''}`}>
      <div className="shrink-0 w-11 text-center" aria-hidden="true">
        <span className="block text-2xs font-bold uppercase tracking-wider text-gray-400">{date.month}</span>
        <span className="block text-lg font-black text-gray-900 leading-tight">{date.day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`inline-flex items-center text-2xs font-semibold uppercase tracking-wide px-1.5 py-px rounded-sm border ${IMPACT_STYLES[event.impact]}`}>
            {event.impact}
          </span>
          <span className="text-2xs text-gray-400 font-medium uppercase tracking-wide">
            {CATEGORY_LABELS[event.category]}
          </span>
        </div>
        {event.sourceUrl ? (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-gray-900 leading-snug hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 block"
          >
            {event.title}
          </a>
        ) : (
          <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-0">{event.title}</p>
        )}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5 mb-0">{event.body}</p>
        {!isPast && days >= 0 && (
          <span className="text-2xs text-gray-400 mt-0.5 block">
            {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
          </span>
        )}
      </div>
    </li>
  );
}

export default function EconomicEventsCalendar({ limit = 5 }: { limit?: number }) {
  const upcoming = getUpcomingEvents(new Date(), limit);
  const past = getPastEvents(new Date(), 2);

  if (upcoming.length === 0 && past.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-3 mb-1">
        Economic Calendar
      </h2>

      {upcoming.length > 0 && (
        <ul className="list-none m-0 p-0 divide-y divide-gray-100" role="list" aria-label="Upcoming economic events">
          {upcoming.map(e => <EventRow key={e.id} event={e} />)}
        </ul>
      )}

      {past.length > 0 && (
        <>
          <p className="text-2xs font-bold uppercase tracking-wider text-gray-400 mt-3 mb-0">Recent</p>
          <ul className="list-none m-0 p-0 divide-y divide-gray-100" role="list" aria-label="Recent economic events">
            {past.map(e => <EventRow key={e.id} event={e} isPast />)}
          </ul>
        </>
      )}

      <p className="text-2xs text-gray-400 mt-3 mb-0">
        Dates marked (est.) are projected from prior cadence.
      </p>
    </div>
  );
}
