export default function SourceLabel({
  source,
  time,
  className = '',
}: {
  source: string;
  time: string;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-1.5 text-[11px] text-[#767676] ${className}`}>
      <span className="font-semibold text-[#555]">{source}</span>
      {time && <><span aria-hidden>&middot;</span><time>{time}</time></>}
    </p>
  );
}
