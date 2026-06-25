import ThreeScene from './ThreeScene';

export default function AboutSection({ mouseRef }) {
  const paras = [
    'AI Conclave 3.0 continues its tradition of bringing together bright minds from academia and industry to explore the rapidly evolving world of Artificial Intelligence.',
    'The conclave serves as a platform for intellectual discussions, innovation, collaboration, and practical learning through keynote sessions, expert talks, and networking.',
    'Whether you are a student, researcher, developer, entrepreneur, or technology enthusiast — AI Conclave 3.0 is your gateway into the AI ecosystem.',
  ];

  return (
    <section id="about" className="relative z-10 section-pad">
      <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

        {/* Text */}
        <div>
          <span className="text-[11px] text-accent font-semibold uppercase tracking-[3px] block mb-3">About the Event</span>
          <h2 className="font-sora font-bold t-text leading-tight mb-5 sm:mb-6" style={{ fontSize: 'clamp(24px,3.5vw,40px)' }}>
            Building on a<br />Remarkable Legacy
          </h2>
          {paras.map((p, i) => (
            <p key={i} className="text-[13px] sm:text-[14px] t-muted leading-[1.85] mb-3 sm:mb-4">{p}</p>
          ))}
        </div>

        {/* 3D canvas — hidden on small screens, shown on large */}
        <div className="hidden lg:block h-[420px]">
          <ThreeScene mouseRef={mouseRef} />
        </div>

        {/* Simple decorative block for mobile */}
        <div className="lg:hidden flex flex-wrap gap-3 mt-2">
          {['🤖 AI Research','⚡ HPC','☁️ Cloud','🛰️ Space Tech'].map((tag) => (
            <span key={tag} className="t-card px-4 py-2 rounded-full text-[12px] text-accent font-medium border border-accent/15">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
