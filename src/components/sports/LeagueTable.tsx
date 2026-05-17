import { ReactNode } from 'react';

export type LeagueColumn<T> = {
  key: keyof T | string;
  label: string;
  align?: 'left' | 'right' | 'center';
  hideOnMobile?: boolean;
  render?: (row: T, i: number) => ReactNode;
  numeric?: boolean;
  primary?: boolean;
  width?: string;
};

type Props<T> = {
  columns: LeagueColumn<T>[];
  rows: T[];
  total?: Partial<Record<string, ReactNode>>;
  caption?: string;
};

const ALIGN: Record<NonNullable<LeagueColumn<unknown>['align']>, string> = {
  left:   'text-left',
  right:  'text-right',
  center: 'text-center',
};

export default function LeagueTable<T extends Record<string, unknown>>({ columns, rows, total, caption }: Props<T>) {
  return (
    <div className="overflow-x-auto border-y border-gray-300">
      <table className="w-full text-base">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-gray-300">
            {columns.map(c => (
              <th
                key={String(c.key)}
                scope="col"
                className={`px-3 py-2 text-xs font-semibold text-gray-500 ${ALIGN[c.align ?? 'left']} ${c.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const cells = columns.map(c => {
              const align = ALIGN[c.align ?? 'left'];
              const numeric = c.numeric ? 'tabular-nums' : '';
              const primary = c.primary ? 'font-semibold text-gray-900' : 'text-gray-700';
              const hide = c.hideOnMobile ? 'hidden sm:table-cell' : '';
              return (
                <td
                  key={String(c.key)}
                  className={`px-3 py-2.5 ${align} ${numeric} ${primary} ${hide}`}
                >
                  {c.render ? c.render(row, i) : (row[c.key as keyof T] as ReactNode)}
                </td>
              );
            });
            return (
              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                {cells}
              </tr>
            );
          })}
          {total && (
            <tr className="border-t border-gray-300">
              {columns.map(c => (
                <td
                  key={String(c.key)}
                  className={`px-3 py-2.5 text-sm font-bold tabular-nums text-gray-900 ${ALIGN[c.align ?? 'left']} ${c.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                >
                  {total[String(c.key)] ?? ''}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
