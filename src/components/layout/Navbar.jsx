import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../data';
import sousps from '../../assets/icons/Group.png';
import sou from '../../assets/icons/Group 16.png';



const go = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};


// Hamburger
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// Close
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Navbar({ isDark, onToggle, onOpenBadgeModal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]= useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => { 
    if (id === 'generate-badge' || id === 'badge-section') {
      if (onOpenBadgeModal) onOpenBadgeModal();
    } else if (id === 'registration') {
      window.open('https://forms.gle/Ucu9KrsA27EXH1X67', '_blank');
    } else if (id === 'gallery') {
      navigate('/gallery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => go(id), 100);
      } else {
        go(id);
      }
    }
    setMenuOpen(false); 
  };

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 sm:px-6 lg:px-10 py-2.5 sm:py-3.5 t-nav transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      >
        {/* Logo */}
        <button onClick={() => handleNav('hero')} className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
          <img src={sou} alt="img" className="h-5 xs:h-6 sm:h-10 w-auto flex-shrink-0" />
          <img src={sousps} alt="img" className="h-5 xs:h-6 sm:h-10 w-auto max-w-[110px] xs:max-w-[130px] sm:max-w-none object-contain flex-shrink" />
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7">
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="t-muted text-[13px] font-medium hover:text-accent transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">

          {/* Desktop CTA */}
          <button
            onClick={() => handleNav('badge-section')}
            className="hidden sm:block bg-transparent border border-accent/40 text-accent text-[12px] sm:text-[13px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-accent/10 hover:border-accent/70 transition-all duration-200 whitespace-nowrap"
          >
            Generate Badge
          </button>

          <button
            onClick={() => window.open('https://forms.gle/Ucu9KrsA27EXH1X67', '_blank')}
            className="hidden sm:block bg-transparent border border-accent/40 text-accent text-[12px] sm:text-[13px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-accent/10 hover:border-accent/70 transition-all duration-200 whitespace-nowrap"
          >
            Register Now
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[75vw] max-w-xs t-card-bg border-l border-accent/10 flex flex-col pt-20 pb-8 px-6 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="text-left px-4 py-3 rounded-xl text-[14px] font-medium t-text hover:text-accent hover:bg-accent/5 transition-all duration-200"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={() => handleNav('badge-section')}
              className="w-full bg-transparent border border-accent/40 text-accent py-3 rounded-xl hover:bg-accent/10 hover:border-accent/70 transition-all duration-200 font-semibold text-[14px]"
            >
              Generate Badge
            </button>
            <button
              onClick={() => window.open('https://forms.gle/Ucu9KrsA27EXH1X67', '_blank')}
              className="w-full bg-transparent border border-accent/40 text-accent py-3 rounded-xl hover:bg-accent/10 hover:border-accent/70 transition-all duration-200 font-semibold text-[14px]"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
