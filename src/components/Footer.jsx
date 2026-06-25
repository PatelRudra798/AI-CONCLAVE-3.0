const LINKS = [
  { label: 'Home',         id: 'hero'         },
  { label: 'About',        id: 'about'        },
  { label: 'Topics',       id: 'topics'       },
  { label: 'Schedule',     id: 'schedule'     },
  { label: 'Workshops',    id: 'workshops'    },
  { label: 'Speakers',     id: 'speakers'     },
  { label: 'Sponsors',     id: 'sponsors'     },
  { label: 'Register',     id: 'registration' },
  { label: 'FAQ',          id: 'faq'          },
  { label: 'Contact',      id: 'contact'      },
];

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-10 border-t py-12 sm:py-16 px-5 sm:px-12 text-center"
      style={{ background: 'var(--bg2)', borderColor: 'var(--card-border)' }}>

      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="font-sora font-extrabold text-[24px] sm:text-[30px] text-gradient-brand mb-2">
          AI CONCLAVE 3.0
        </div>
        <p className="text-[12px] sm:text-[13px] t-muted mb-1 font-medium italic">
          Where Intelligence Meets Innovation
        </p>
        <p className="text-[10px] sm:text-[11px] t-muted opacity-40 mb-8 px-4">
          IEEE Signal Processing Society Student Branch Chapter · Silver Oak University, Ahmedabad
        </p>

        {/* Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-8 max-w-2xl mx-auto">
          {LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="text-[11px] sm:text-[12px] t-muted hover:text-accent transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <a href="#" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <LinkedInIcon />
          </a>
          <a href="#" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <InstagramIcon />
          </a>
        </div>

        {/* Divider */}
        <div className="t-divider max-w-sm mx-auto mb-5" />

        <p className="text-[10px] t-muted opacity-35">
          © 2026 AI Conclave 3.0. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
