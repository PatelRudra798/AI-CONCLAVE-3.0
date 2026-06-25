import SectionHeader from './SectionHeader';
import { ACTIVITIES } from '../data';

export default function ActivitiesSection() {
  return (
    <section id="activities" className="relative z-10 section-pad">
      <div className="max-container">
        <SectionHeader label="Engagement" title="Activities & Engagement" sub="More than sessions — a full day of interactive experiences" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ACTIVITIES.map((a) => (
            <div key={a.title} className="t-card rounded-2xl p-5 sm:p-7 t-card-purple group">
              <span className="text-[28px] sm:text-[32px] mb-3 sm:mb-4 block">{a.icon}</span>
              <h3 className="text-[14px] sm:text-[15px] font-semibold t-text mb-2 group-hover:text-accent2-light transition-colors">{a.title}</h3>
              <p className="text-[12px] sm:text-[13px] t-muted leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
