import SectionHeader from './SectionHeader';
import { REG_TIERS, REG_INCLUDES } from '../data';

export default function RegistrationSection() {
  return (
    <section id="registration" className="relative z-10 section-pad" style={{ background: 'rgba(0,0,0,0.06)' }}>
      <div className="max-container">
        <SectionHeader label="Join Us" title="Register Now" sub="Secure your seat at AI Conclave 3.0" />
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-7 sm:mb-9">
          {REG_TIERS.map((tier) => <TierCard key={tier.type} {...tier} />)}
        </div>
        <div className="max-w-xl mx-auto t-card rounded-2xl p-6 sm:p-8">
          <h4 className="text-[10px] sm:text-[11px] text-accent font-semibold uppercase tracking-[1.5px] text-center mb-4 sm:mb-5">
            All registrations include
          </h4>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
            {REG_INCLUDES.map((item) => (
              <div key={item} className="flex items-center gap-2 text-[12px] sm:text-[13px] t-muted">
                <span className="text-accent font-bold flex-shrink-0">✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TierCard({ type, price, symbol, note, featured, cta }) {
  const isFree = price === 'Free';
  return (
    <div className={`relative rounded-[18px] sm:rounded-[20px] p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1.5 overflow-hidden
      ${featured
        ? 'border border-accent/40 bg-gradient-to-br from-accent/5 to-accent2/[0.03] shadow-[0_0_36px_rgba(57,255,143,0.07)]'
        : 't-card2-bg border border-accent/10'
      }`}>
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-accent text-bg text-[8px] sm:text-[9px] font-black uppercase tracking-[1.5px] px-3 sm:px-4 py-1 rounded-b-lg whitespace-nowrap">
          Best Value
        </div>
      )}
      <p className="text-[9px] sm:text-[10px] t-muted uppercase tracking-[1.5px] mt-3 mb-2 sm:mb-3">{type}</p>
      <div className="font-sora font-extrabold t-text leading-none mb-1" style={{ fontSize: isFree ? 28 : 42 }}>
        {!isFree && <sup className="text-[18px] align-super">{symbol}</sup>}
        {price}
      </div>
      <p className="text-[10px] sm:text-[11px] text-accent mb-4 sm:mb-5 min-h-[16px]">{note}</p>
      <button className={`w-full py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all duration-200
        ${featured
          ? 'bg-gradient-to-r from-accent to-accent text-bg hover:opacity-90'
          : 'border border-accent/15 t-text hover:bg-gradient-to-r hover:from-accent hover:to-accent hover:text-bg hover:border-transparent'
        }`}>
        {cta}
      </button>
    </div>
  );
}
