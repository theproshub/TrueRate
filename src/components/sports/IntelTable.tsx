import type { ReactNode } from 'react';

export type IntelColumn<T> = {
  key: string;
  label: string;
  align?: 'left' | 'right';
  /** Emphasise the column (gray-900, semibold). */
  primary?: boolean;
  /** Right-aligned tabular figure. */
  numeric?: boolean;
  hideOnMobile?: boolean;
  render?: (row: T) => ReactNode;
};

/**
 * Generic data table for ranked intelligence (valuations, sponsor leaderboards,
 * athlete market values). Accessible: real <table> with an sr-only <caption>
 * and scope="col" headers. Light styling.
 */
export default function IntelTable<T extends Record<string, unknown>>({
  columns,
  rows,
  caption,
  getRowKey,
}: {
  columns: IntelColumn<T>[];
  rows: T[];
  caption: string;
  getRowKey: (row: T, i: number) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-3 py-2.5 text-2xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap ${
                  c.align === 'right' || c.numeric ? 'text-right' : 'text-left'
                } ${c.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={getRowKey(row, i)} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              {columns.map((c) => {
                const content = c.render ? c.render(row) : (row[c.key] as ReactNode);
                return (
                  <td
                    key={c.key}
                    className={`px-3 py-2.5 ${
                      c.align === 'right' || c.numeric ? 'text-right tabular-nums' : 'text-left'
                    } ${c.primary ? 'font-semibold text-gray-900' : 'text-gray-600'} ${
                      c.hideOnMobile ? 'hidden sm:table-cell' : ''
                    }`}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
