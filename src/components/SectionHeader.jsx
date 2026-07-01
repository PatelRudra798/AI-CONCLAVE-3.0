export default function SectionHeader({ label, title, sub }) {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-14">
      {label && (
        <span className="text-[11px] text-accent font-semibold uppercase tracking-[3px] block mb-3">
          {label}
        </span>
      )}
      <h2 className="font-sora font-bold t-text leading-tight mb-4 sm:mb-3" style={{ fontSize: 'clamp(24px,3.5vw,40px)' }}>
        {title}
      </h2>
      {sub && <p className="text-[14px] t-muted leading-relaxed max-w-lg mx-auto px-2">{sub}</p>}
    </div>
  );
}
