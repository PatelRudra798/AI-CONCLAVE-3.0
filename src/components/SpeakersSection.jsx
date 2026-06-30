import SectionHeader from './SectionHeader';

export default function SpeakersSection() {
  return (
    <section id="speakers" className="relative z-10 section-pad overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.06)' }}>

      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, var(--glow), transparent)' }} />

      <div className="max-container relative">
        <SectionHeader
          label="Distinguished Experts"
          title="Meet Our Speakers"
          sub="Learn directly from thought leaders across industry and academia"
        />

        <div className="flex flex-col items-center justify-center py-10 sm:py-28 md:py-36 animate-fadeIn">
          <h2 
            className="text-center font-sora font-extrabold text-accent text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] tracking-tight leading-tight select-none"
            style={{ 
              textShadow: '0 0 20px rgba(0, 229, 255, 0.45), 0 0 40px rgba(0, 229, 255, 0.15)' 
            }}
          >
            Revealing Soon
          </h2>
        </div>
      </div>
    </section>
  );
}
