/**
 * Inline SVG shield with team initials in TrueRate red.
 * No external assets — purely decorative placeholder.
 */
export default function TeamCrest({
  short,
  size = 28,
  className = '',
}: {
  short: string;
  size?: number;
  className?: string;
}) {
  // Up to 3 letters fit comfortably; truncate longer.
  const text = short.slice(0, 3).toUpperCase();
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M4 4h24v14c0 6-4.5 9.5-12 12-7.5-2.5-12-6-12-12V4z"
        fill="#1a1f29"
        stroke="#ef4444"
        strokeWidth="1.5"
      />
      <text
        x="16"
        y="19"
        textAnchor="middle"
        fontSize={text.length > 2 ? 9 : 11}
        fontWeight="800"
        fill="#fca5a5"
        fontFamily="ui-sans-serif,system-ui,sans-serif"
        letterSpacing="0.5"
      >
        {text}
      </text>
    </svg>
  );
}
