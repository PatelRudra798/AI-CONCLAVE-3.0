import SectionHeader from './SectionHeader';
import { SPEAKERS } from '../data';

/* LinkedIn SVG icon */
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

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

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SPEAKERS.map((sp, i) => (
            <SpeakerCard key={i} sp={sp} index={i} />
          ))}
        </div>

        <p className="text-center text-[11px] sm:text-[12px] t-muted mt-8 opacity-70">
          Full speaker lineup will be announced soon — stay tuned!
        </p>
      </div>
    </section>
  );
}

function SpeakerCard({ sp }) {
  return (
    <div className="speaker-card t-card rounded-2xl overflow-hidden group">
      {/* Base content */}
      <div className="speaker-base p-5 sm:p-6 text-center">
        {/* Avatar */}
        <div className={`w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full mx-auto mb-4 flex items-center justify-center font-sora font-bold text-[16px] sm:text-[20px] text-white bg-gradient-to-br ${sp.grad} shadow-lg`}>
          {sp.initials}
        </div>

        <h3 className="text-[13px] sm:text-[15px] font-semibold t-text mb-1 leading-tight">{sp.name}</h3>
        <p className="text-[11px] text-accent mb-0.5 font-medium">{sp.role}</p>
        <p className="text-[10px] sm:text-[11px] t-muted mb-3">{sp.org}</p>

        {/* Topic pill */}
        <div className="text-[10px] t-muted italic bg-accent/[0.04] border border-accent/10 rounded-xl px-3 py-2 leading-snug">
          "{sp.topic}"
        </div>
      </div>

      {/* Hover overlay */}
      <div className="speaker-overlay rounded-2xl">
        {/* Skills */}
        <div className="w-full mb-3">
          <div className="flex flex-wrap gap-1.5 justify-center mb-3">
            {sp.skills.map((skill) => (
              <span key={skill}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                {skill}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p className="text-[11px] text-white/80 text-center leading-snug px-1 mb-3">
            {sp.bio}
          </p>

          {/* LinkedIn button */}
          <a
            href={sp.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent hover:bg-[color:var(--accent-dim)] text-bg text-[12px] font-bold transition-all duration-200 hover:shadow-lg"
          >
            <LinkedInIcon />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
