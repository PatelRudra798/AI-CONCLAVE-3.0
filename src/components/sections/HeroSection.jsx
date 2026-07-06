import { useState, useEffect, useRef } from 'react';
import useCountdown from '../../hooks/useCountdown';
import { EVENT_DATE, HERO_STATS } from '../../data';
import group7 from '../../assets/icons/Group 7.png';

function StatCounter({ num }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const numericPart = parseInt(num.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = num.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic out
      setCount(Math.floor(ease * numericPart));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(numericPart);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, numericPart]);

  return (
    <span
      ref={elementRef}
      className={`inline-block transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1) transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
    >
      {count}
      {suffix}
    </span>
  );
}


const pad = (n) => String(n).padStart(2, '0');
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function TimerBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-accent/5 border border-accent/15 rounded-2xl px-2 xs:px-4 sm:px-5 py-2 sm:py-4 min-w-[60px] xs:min-w-[76px] sm:min-w-[82px]">
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

export default function HeroSection({ onOpenBadgeModal }) {
  const { d, h, m, s } = useCountdown(EVENT_DATE);

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16"
    >
      {/* Badge
      <div className="inline-flex items-center gap-2 border border-accent/20 bg-accent/[0.04] px-4 sm:px-5 py-2 rounded-full text-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[1.5px] mb-6 sm:mb-8 text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2 inline-block flex-shrink-0" />
        <span>10 July 2026 · Silver Oak University</span>
      </div> */}

      {/* Eyebrow */}
      <p className="text-[9px] sm:text-[10px] t-muted uppercase tracking-[2px] sm:tracking-[3px] mb-3 sm:mb-4 px-2">
        SILVER OAK UNIVERSITY IEEE Signal Processing Society Student Branch Chapter
      </p>

      {/* Title */}
      <h1 className="leading-[1] mb-5 flex flex-col items-center gap-2 sm:gap-4 mt-6 z-10" style={{ fontSize: 'clamp(44px, 12vw, 120px)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 select-none">
          <span
            className="font-black text-white leading-none tracking-tight glitch-span"
            data-text="AI"
          >
            AI
          </span>
          <span
            className="font-black text-white leading-none glitch-span"
            data-text="CONCLAVE"
          >
            CONCLAVE
          </span>
          <span
            className="font-black text-white leading-none glitch-span"
            data-text="3.0"
          >
            3.0
          </span>
        </div>
        {/* <div className="flex items-center gap-3 mt-1 sm:mt-2">
          <span className="text-accent text-[14px] sm:text-[22px] font-mono tracking-widest">// 2026 EDITION</span>
          <span className="text-[32px] sm:text-[48px] font-black text-white drop-shadow-[0_8px_16px_rgba(59,130,246,1)]">3.0</span>
        </div> */}
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
      <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 mb-8 sm:mb-10 flex-nowrap justify-center w-full px-1">
        <TimerBlock value={d} label="Days" />
        <span className="font-sora text-2xl sm:text-3xl font-bold text-accent/30 pb-3 select-none">:</span>
        <TimerBlock value={h} label="Hours" />
        <span className="font-sora text-2xl sm:text-3xl font-bold text-accent/30 pb-3 select-none">:</span>
        <TimerBlock value={m} label="Mins" />
        <span className="font-sora text-2xl sm:text-3xl font-bold text-accent/30 pb-3 select-none">:</span>
        <TimerBlock value={s} label="Secs" />
      </div>

      {/* CTAs */}
      <div className="flex flex-col xs:flex-row items-center justify-center gap-3 mb-10 sm:mb-14 w-full px-4">
        <button
          onClick={() => window.open('https://forms.gle/Ucu9KrsA27EXH1X67', '_blank')}
          className="w-full xs:w-auto border border-accent/25 bg-accent/[0.03] t-text font-semibold text-[13px] sm:text-[14px] px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl hover:border-accent hover:text-accent hover:-translate-y-1 transition-all duration-200"
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 40px var(--glow)`; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          Register Now
        </button>
        <button
          onClick={onOpenBadgeModal}
          className="w-full xs:w-auto border border-accent/25 bg-accent/[0.03] t-text font-semibold text-[13px] sm:text-[14px] px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl hover:border-accent hover:text-accent hover:-translate-y-1 transition-all duration-200"
        >
          Generate Badge
        </button>
      </div>


    </section>
  );
}
