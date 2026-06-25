import { useState, useEffect } from 'react';
import { NAV_LINKS } from '../data';
import sousps from '../assets/icons/Group.png';
import sou from '../assets/icons/Group 16.png';



const go = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// Sun icon
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

// Moon icon
const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

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

export default function Navbar({ isDark, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]= useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => { go(id); setMenuOpen(false); };

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 sm:px-6 lg:px-10 py-2.5 sm:py-3.5 t-nav transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      >
        {/* Logo */}
        <button onClick={() => handleNav('hero')} className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
          <img src={sou} alt="img" className="h-7 sm:h-10 w-auto flex-shrink-0" />
          <img src={sousps} alt="img" className="h-7 sm:h-10 w-auto max-w-[140px] sm:max-w-none object-contain flex-shrink" />
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
          {/* Theme toggle */}
          <button
            onClick={onToggle}
            aria-label="Toggle theme"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center t-card transition-all duration-200 hover:border-accent/40 t-muted hover:text-accent"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Desktop CTA */}
          <button
            onClick={() => handleNav('badge-section')}
            className="hidden md:block bg-accent/10 border border-accent/40 text-accent text-[12px] sm:text-[13px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-accent hover:text-black hover:border-accent transition-all duration-200 whitespace-nowrap font-medium"
          >
            Get Badge 🎫
          </button>

          <button
            onClick={() => handleNav('registration')}
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
              className="w-full bg-accent/10 border border-accent/40 text-accent py-3 rounded-xl hover:bg-accent hover:text-black transition-all duration-200 font-semibold text-[14px]"
            >
              Get Badge 🎫
            </button>
            <button
              onClick={() => handleNav('registration')}
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
