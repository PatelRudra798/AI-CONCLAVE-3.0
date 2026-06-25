import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { FAQS } from '../data';

export default function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative z-10 section-pad">
      <div className="max-container">
        <SectionHeader label="Questions" title="Frequently Asked" />
        <div className="max-w-[720px] mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300"
              style={{ border: '1px solid', borderColor: open === i ? 'var(--accent)' : 'var(--card-border)' }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-3 px-5 sm:px-6 py-4 sm:py-5 text-left t-card-bg hover:bg-accent/[0.03] transition-colors"
              >
                <span className="text-[13px] sm:text-[14px] font-medium t-text text-left">{faq.q}</span>
                <span className="text-accent text-xl flex-shrink-0 transition-transform duration-300 inline-block"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              <div className="overflow-hidden t-muted text-[12px] sm:text-[13px] leading-relaxed"
                style={{
                  maxHeight: open === i ? '200px' : '0px',
                  padding: open === i ? '14px 20px' : '0 20px',
                  opacity: open === i ? 1 : 0,
                  background: 'rgba(var(--accent-rgb), 0.025)',
                  transition: 'max-height 0.35s ease, padding 0.3s, opacity 0.3s',
                }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
