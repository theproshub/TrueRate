export default function Kicker({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[11px] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] ${className}`}
    >
      {children}
    </span>
  );
}
