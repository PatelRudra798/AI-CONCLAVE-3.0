import { useState, useEffect, useRef } from 'react';

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function HeroSection({ onOpenBadgeModal }) {
  const [realTime, setRealTime] = useState('');
  const [isOff, setIsOff] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // 2-second delay to turn the clock "on"
    const timer = setTimeout(() => {
      setIsOff(false);
    }, 2000);

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      const formatted = `${hours < 10 ? '0' : ''}${hours} : ${minutes < 10 ? '0' : ''}${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
      setRealTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const toggleGlitch = (e) => {
    e.preventDefault();
    setGlitchActive(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('screen-glitch');
      } else {
        document.body.classList.remove('screen-glitch');
      }
      return next;
    });
  };

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16"
    >
      {/* Eyebrow */}
      <p className="text-[9px] sm:text-[10px] t-muted uppercase tracking-[2px] sm:tracking-[3px] mb-3 sm:mb-4 px-2">
        SILVER OAK UNIVERSITY IEEE Signal Processing Society Student Branch Chapter
      </p>

      {/* Title */}
      <h1 className="leading-[1] mb-5 flex flex-col items-center gap-2 sm:gap-4 mt-6 z-10" style={{ fontSize: 'clamp(44px, 12vw, 120px)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 select-none">
          <span
            className="font-black leading-none tracking-tight glitch-span"
            data-text="AI"
            style={{ background: 'linear-gradient(135deg, #00D2FF 0%, #00A3FF 40%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 24px rgba(0,210,255,0.55))' }}
          >
            AI
          </span>
          <span
            className="font-black leading-none glitch-span"
            data-text="CONCLAVE"
            style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 45%, #7dd3fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            CONCLAVE
          </span>
          <span
            className="font-black leading-none glitch-span"
            data-text="3.0"
            style={{ background: 'linear-gradient(135deg, #00D2FF 0%, #0052FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 32px rgba(0,163,255,0.7))' }}
          >
            3.0
          </span>
        </div>
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

      {/* Real-time Clock */}
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-10 w-full px-1">
        <div className={`clock transition-all duration-1000 ${isOff ? 'is-off opacity-15 blur-[2px]' : 'opacity-100'}`}>
          <div 
            className="time font-mono tracking-[4px] font-bold text-gradient-timer"
            data-time={realTime}
            style={{ fontSize: 'clamp(32px, 7vw, 68px)' }}
          >
            {realTime || '00 : 00 : 00'}
          </div>
        </div>
        
        {/* Futuristic Switcher Toggle */}
        <button
          onClick={toggleGlitch}
          className={`switcher mt-4 border text-[10px] uppercase tracking-[2px] font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${
            glitchActive 
              ? 'border-accent text-accent bg-accent/10 shadow-[0_0_15px_rgba(0,210,255,0.3)]' 
              : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/25'
          }`}
        >
          {glitchActive ? 'Glitch Mode: ON' : 'Glitch Mode: OFF'}
        </button>
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
