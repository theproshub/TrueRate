/**
 * <SourceTag/> — provenance line. Critical for trust in Liberian econ data:
 * names the real published source + last-updated date. No icon, just text.
 */
export default function SourceTag({
  source,
  updatedAt,
}: {
  source: string;
  updatedAt: string;
}) {
  return (
    <p className="text-2xs uppercase tracking-[0.08em] text-gray-600">
      <span className="text-gray-500">{source}</span>
      <span aria-hidden className="mx-1.5 text-gray-700">·</span>
      <span>Updated {updatedAt}</span>
    </p>
  );
}
