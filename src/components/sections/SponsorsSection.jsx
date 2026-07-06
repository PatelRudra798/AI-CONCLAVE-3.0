import SectionHeader from '../ui/SectionHeader';
import gdgLogo from '../../assets/icons/gdg white logo.png';
import maskGroupLogo from '../../assets/icons/Mask group.png';

const COLLABORATORS = [
  { src: gdgLogo, alt: 'GDG', name: 'Google Developer Groups' },
  { src: maskGroupLogo, alt: 'Mask Group', name: 'Community Partner' },
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="relative z-10 section-pad overflow-hidden">

      {/* Bg glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--glow) 0%, transparent 70%)' }} />

      <div className="max-container">
        <SectionHeader
          title="OUR COLLABORATORS"
        />

        <div className="relative py-10 sm:py-20">
          {/* Background Glow */}
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

          <div
            className="
              flex flex-col lg:flex-row
              justify-center items-center
              gap-12 lg:gap-24
              [perspective:1200px]
            "
          >
            {COLLABORATORS.map((img, idx) => (
              <div
                key={idx}
                className="
                  relative group
                  w-[280px] sm:w-[340px]
                  h-[170px] sm:h-[210px]
                  rounded-[40px]
                  overflow-hidden
                  backdrop-blur-2xl
                  border border-cyan-400/20
                  bg-white/5
                  shadow-[0_0_50px_rgba(0,255,255,0.15)]
                  transition-all duration-500
                  hover:scale-105
                  hover:-translate-y-2
                  hover:shadow-[0_20px_80px_rgba(0,255,255,0.35)]
                "
              >
                {/* Animated Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Moving Shine */}
                <div className="
                  absolute
                  -left-40
                  top-0
                  h-full
                  w-32
                  rotate-12
                  bg-white/10
                  blur-xl
                  transition-all
                  duration-1000
                  group-hover:left-[120%]
                " />

                {/* Inner Glass */}
                <div className="absolute inset-2 rounded-[32px] border border-white/10 bg-black/30" />

                {/* Logo */}
                <div
                  className="
                    relative z-10
                    flex h-full w-full
                    flex-col
                    items-center justify-center
                    gap-2
                  "
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="
                      max-w-[70%]
                      max-h-[60%]
                      object-contain
                      transition-all
                      duration-500
                      group-hover:scale-110
                    "
                  />
                  <span className="text-white/50 text-xs font-medium tracking-widest uppercase">{img.name}</span>
                </div>

                {/* Bottom Glow */}
                <div className="
                  absolute bottom-0 left-1/2
                  h-10 w-48
                  -translate-x-1/2
                  rounded-full
                  bg-cyan-400/30
                  blur-3xl
                " />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
