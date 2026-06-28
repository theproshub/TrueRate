export default function HeroBanner() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#0A1628]"
      role="banner"
      aria-label="TrueRate Business hub"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0057B8]" />

      <div className="relative mx-auto max-w-[1280px] px-5 py-8 sm:py-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#0057B8] mb-2">
          TrueRate
        </p>
        <h1 className="text-[24px] sm:text-[32px] font-extrabold leading-[1.1] text-white tracking-[-0.01em]">
          Business
        </h1>
        <p className="mt-2 text-[14px] sm:text-[15px] text-[#8899B0] font-montserrat leading-[1.4] max-w-[500px]">
          The small business news, data, and analysis you need to build in Liberia.
        </p>
      </div>
    </div>
  );
}
