import useCountdown from '../hooks/useCountdown';
import { EVENT_DATE, HERO_STATS } from '../data';
import group7 from '../assets/icons/Group 7.png';

const pad = (n) => String(n).padStart(2, '0');
const go  = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function TimerBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-accent/5 border border-accent/15 rounded-2xl px-3 xs:px-4 sm:px-5 py-3 sm:py-4 min-w-[68px] xs:min-w-[76px] sm:min-w-[82px]">
      <span className="font-sora font-extrabold leading-none text-gradient-timer"
        style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>
        {pad(value)}
      </span>
      <span className="text-[8px] xs:text-[9px] t-muted uppercase tracking-[2px] font-semibold mt-1.5">
        {label}
      </span>
    </div>
  );
}

export default function HeroSection() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 border border-accent/20 bg-accent/[0.04] px-4 sm:px-5 py-2 rounded-full text-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[1.5px] mb-6 sm:mb-8 text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2 inline-block flex-shrink-0" />
        <span>10 July 2026 · Silver Oak University</span>
      </div>

      {/* Eyebrow */}
      <p className="text-[9px] sm:text-[10px] t-muted uppercase tracking-[2px] sm:tracking-[3px] mb-3 sm:mb-4 px-2">
        IEEE Signal Processing Society Student Branch Chapter
      </p>

      {/* Title */}
      <h1 className="leading-[0.93] mb-3" style={{ fontSize: 'clamp(44px, 9vw, 108px)' }}>
        <img
          src={group7}
          alt="Group 7"
          className="mx-auto h-[190px] sm:h-[196px] md:h-[210px] lg:h-[220px] w-auto select-none pointer-events-none"
        />
      </h1>


      {/* Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-4 sm:my-5 px-2">
        {['High Performance Computing', 'Agentic AI', 'Future Technologies'].map((t) => (
          <span key={t} className="border border-accent2/35 bg-accent2/[0.08] text-accent2-light text-[10px] sm:text-[11px] font-medium px-3 sm:px-4 py-1.5 rounded-full">
            {t}
          </span>
        ))}
      </div>

      {/* Subtitle */}
      <p className="text-[13px] sm:text-[14px] t-muted max-w-[480px] sm:max-w-[520px] mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
        Join industry experts, researchers, innovators, and students for a day filled with
        technical sessions, hands-on workshops, and future-focused discussions.
      </p>

      {/* Countdown */}
      <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap justify-center">
        <TimerBlock value={d} label="Days"  />
        <span className="font-sora text-2xl sm:text-3xl font-bold text-accent/30 pb-3 select-none">:</span>
        <TimerBlock value={h} label="Hours" />
        <span className="font-sora text-2xl sm:text-3xl font-bold text-accent/30 pb-3 select-none">:</span>
        <TimerBlock value={m} label="Mins"  />
        <span className="font-sora text-2xl sm:text-3xl font-bold text-accent/30 pb-3 select-none">:</span>
        <TimerBlock value={s} label="Secs"  />
      </div>

      {/* CTAs */}
      <div className="flex flex-col xs:flex-row items-center justify-center gap-3 mb-10 sm:mb-14 w-full px-4">
        <button
          onClick={() => go('registration')}
          className="w-full xs:w-auto border border-accent/25 bg-accent/[0.03] t-text font-semibold text-[13px] sm:text-[14px] px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl hover:border-accent hover:text-accent hover:-translate-y-1 transition-all duration-200"
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 40px var(--glow)`; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          Register Now →
        </button>
        <button
          onClick={() => go('schedule')}
          className="w-full xs:w-auto border border-accent/25 bg-accent/[0.03] t-text font-semibold text-[13px] sm:text-[14px] px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl hover:border-accent hover:text-accent hover:-translate-y-1 transition-all duration-200"
        >
          View Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {HERO_STATS.map(({ num, label }) => (
          <div key={label} className="text-center">
            <div className="font-sora font-bold text-2xl sm:text-3xl text-gradient-num">{num}</div>
            <div className="text-[9px] sm:text-[10px] t-muted uppercase tracking-[1.5px] mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
