import SectionHeader from '../ui/SectionHeader';

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

 <div className="flex flex-col items-center justify-center py-10 sm:py-20 md:py-24 animate-fadeIn">
 <h2 
 className="text-center font-mono font-medium text-white/50 text-[14px] sm:text-[16px] md:text-[18px] tracking-[4px] uppercase select-none"
 style={{ 
 textShadow: '0 2px 10px rgba(255, 255, 255, 0.05)' 
 }}
 >
 Revealing Soon
 </h2>
 </div>
 </div>
 </section>
 );
}
