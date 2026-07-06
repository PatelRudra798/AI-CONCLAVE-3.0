import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { WORKSHOPS } from '../../data';

export default function WorkshopsSection() {
  return (
    <section id="workshops" className="relative z-10 section-pad">
      <div className="max-container">
        <SectionHeader label="Hands-On Learning" title="Workshops" sub="Two deep-dive workshops — practical, guided, and certificate-backed" />
        <div className="relative flex flex-col gap-6 sm:gap-8 pb-0 sm:pb-10">
          {WORKSHOPS.map((w) => (
            <div key={w.num}>
              <WorkshopCard {...w} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopCard({ num, tag, accent, title, desc, items }) {
  const isCyan = accent === 'cyan';
  return (
    <div className={`relative rounded-[20px] sm:rounded-[22px] p-7 sm:p-10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5
      ${isCyan
        ? 'border border-accent/22 bg-[var(--card)] bg-gradient-to-br from-accent/7 to-accent/[0.02]'
        : 'border border-accent2-light/22 bg-[var(--card)] bg-gradient-to-br from-accent2/9 to-accent2-light/[0.02]'
      }`}>
      <span className="absolute top-3 right-4 font-sora font-black text-[56px] sm:text-[72px] text-white/[0.04] leading-none select-none">{num}</span>
      <span className={`inline-block text-[9px] font-black uppercase tracking-[1.5px] px-3 py-1 rounded-full mb-3 sm:mb-4
        ${isCyan ? 'bg-accent/10 text-accent border border-accent/15' : 'bg-accent2/10 text-accent2-light border border-accent2/30'}`}>
        {tag}
      </span>
      <h3 className="font-sora font-bold t-text text-[18px] sm:text-[21px] mb-2 sm:mb-3">{title}</h3>
      <p className="text-[12px] sm:text-[13px] t-muted leading-[1.75] mb-4 sm:mb-5">{desc}</p>
      <ul>
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[12px] sm:text-[13px] t-muted border-b border-accent/10 py-2 last:border-0">
            <span className={`font-bold ${isCyan ? 'text-accent' : 'text-accent2-light'}`}>✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
