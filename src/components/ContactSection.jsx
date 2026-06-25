import SectionHeader from './SectionHeader';
import { CONTACT_ITEMS } from '../data';

export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 section-pad" style={{ background: 'rgba(0,0,0,0.06)' }}>
      <div className="max-container text-center">
        <SectionHeader
          label="Get In Touch"
          title="Contact Us"
          sub="Reach out for registration, sponsorship, or speaker enquiries."
        />
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-8 sm:mb-10">
          {CONTACT_ITEMS.map((c) => (
            <div
              key={c.label}
              className="t-card rounded-xl sm:rounded-2xl px-6 sm:px-8 py-5 sm:py-6 min-w-[160px] sm:min-w-[190px] text-center transition-all duration-200 hover:border-accent/30 hover:-translate-y-1 w-full xs:w-auto"
            >
              <div className="text-xl sm:text-2xl mb-2">{c.icon}</div>
              <div className="text-[9px] t-muted uppercase tracking-[1.5px] mb-1">{c.label}</div>
              <div className="text-[12px] sm:text-[13px] t-text font-medium">{c.value}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] sm:text-[12px] t-muted px-4">
          Organized by IEEE Signal Processing Society Student Branch Chapter · Silver Oak University
        </p>
      </div>
    </section>
  );
}
