import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { SCHEDULE } from '../data';

const BADGE_STYLES = {
  keynote: { label: 'Keynote', cls: 'bg-accent/15 text-accent border-accent/35' },
  opening: { label: 'Opening', cls: 'bg-accent/10 text-accent2-light border-accent/25' },
  workshop: { label: 'Workshop', cls: 'bg-accent2/20 text-accent2-light border-accent2/40' },
  panel: { label: 'Panel', cls: 'bg-accent/20 text-accent border-accent/45' },
  break: { label: 'Break', cls: 'bg-accent/10 text-accent border-accent/25' },
};

const TRACK_COLORS = {
  keynote: 'border-l-accent',
  workshop: 'border-l-accent2',
  break: 'border-l-accent/40',
  logistics: 'border-l-accent2-light',
};

const TRACK_BG = {
  keynote: 'from-accent/[0.06] to-transparent',
  workshop: 'from-accent2/[0.08] to-transparent',
  break: 'from-accent/[0.03] to-transparent',
  logistics: 'from-accent2-light/[0.05] to-transparent',
};

export default function ScheduleSection() {
  const [active, setActive] = useState(null);

  return (
    <section id="schedule" className="relative z-10 section-pad overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.06)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />
      <div className="absolute bottom-10 left-0 w-[300px] h-[300px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, var(--accent2), transparent 70%)' }} />

      <div className="max-container relative">
        <SectionHeader
          label="10 July 2026"
          title="Day Schedule"
          sub="08:00 AM – 05:30 PM · Silver Oak University, Ahmedabad"
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {Object.entries(BADGE_STYLES).map(([key, { label, cls }]) => (
            <span key={key} className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${cls}`}>
              {label}
            </span>
          ))}
        </div>

        {/* Timeline grid */}
        <div className="max-w-5xl mx-auto max-h-[550px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent) transparent' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SCHEDULE.map((item, i) => (
              <ScheduleCard
                key={i}
                item={item}
                index={i}
                isActive={active === i}
                onClick={() => setActive(active === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleCard({ item, isActive, onClick }) {
  const b = item.badge ? BADGE_STYLES[item.badge] : null;
  const trackBorder = TRACK_COLORS[item.track] || 'border-l-white/15';
  const trackGrad = TRACK_BG[item.track] || '';

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl border border-l-4 cursor-pointer overflow-hidden
        transition-all duration-300 select-none
        ${trackBorder}
        ${isActive
          ? 'shadow-[0_8px_40px_rgba(57,255,143,0.12)] scale-[1.01]'
          : 'hover:shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:scale-[1.005]'
        }
      `}
      style={{
        borderColor: 'var(--card-border)',
        background: isActive
          ? 'var(--card)'
          : 'var(--card)',
      }}
    >
      {/* Gradient wash */}
      <div className={`absolute inset-0 bg-gradient-to-r ${trackGrad} pointer-events-none`} />

      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Time + icon column */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl"
              style={{
                background: item.special
                  ? 'linear-gradient(135deg,rgba(var(--accent-rgb),0.15),rgba(var(--accent2-rgb),0.15))'
                  : 'rgba(var(--accent-rgb),0.06)',
                border: '1px solid var(--card-border)',
              }}>
              {item.icon}
            </div>
            {/* Connector dot for visual timeline feel */}
            <div className={`w-1.5 h-1.5 rounded-full ${item.special ? 'bg-accent' : 'bg-white/20'}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Time range */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-accent">
                {item.time}
              </span>
              <span className="text-[9px] text-white/30">→</span>
              <span className="text-[10px] sm:text-[11px] font-mono t-muted">
                {item.end}
              </span>
              {b && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${b.cls} ml-auto`}>
                  {b.label}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className={`text-[13px] sm:text-[14px] font-semibold t-text mb-0.5 transition-colors duration-200 ${isActive ? 'text-accent' : ''}`}>
              {item.name}
            </h3>

            {/* Speaker tag */}
            {item.speaker && (
              <p className="text-[11px] text-accent2-light font-medium mb-1">🎤 {item.speaker}</p>
            )}

            {/* Expandable description */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isActive ? '80px' : '0px', opacity: isActive ? 1 : 0 }}
            >
              <p className="text-[12px] t-muted leading-relaxed pt-1.5 pb-0.5">{item.desc}</p>
            </div>

            {/* Hint */}
            {!isActive && (
              <p className="text-[10px] t-muted opacity-50 mt-0.5">Tap to expand</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
