import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  color?: string; // optional category color class
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  light?: boolean;
  className?: string;
}

export default function Breadcrumb({ items, light = false, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-[12px] font-medium mb-5 ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className={light ? 'text-gray-400' : 'text-gray-600'}>/</span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={`no-underline transition-colors ${
                  light
                    ? 'text-gray-500 hover:text-gray-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={item.color ?? (light ? 'text-gray-800 font-semibold' : 'text-white font-semibold')}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
