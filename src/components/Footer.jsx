import { useState } from 'react';

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

const WebIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
);

const ThreadsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9m4.5-1.206a8.959 8.959 0 0 1-4.5 1.207"/></svg>
);

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t py-14 sm:py-20 px-4 sm:px-12 text-center overflow-hidden bg-transparent"
      style={{ borderColor: 'var(--card-border)' }}>

      {/* Giant Background Text "AI CONCLAVE 3.0" (faded watermark, unselectable) */}
      <div 
        className="absolute bottom-[-3%] sm:bottom-[-4%] lg:bottom-[-5%] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 text-zinc-600 font-sora font-extrabold text-[16vw] sm:text-[18vw] lg:text-[200px] tracking-wider opacity-[0.03] leading-none uppercase whitespace-nowrap"
      >
        AI CONCLAVE 3.0
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Logo and Tagline */}
        <div className="font-sora font-extrabold text-[24px] sm:text-[30px] text-gradient-brand mb-2">
          AI CONCLAVE 3.0
        </div>
        <p className="text-[12px] sm:text-[13px] t-muted mb-1 font-medium italic">
          Where Intelligence Meets Innovation
        </p>
        <p className="text-[10px] sm:text-[11px] t-muted opacity-40 mb-12 px-4">
          IEEE Signal Processing Society Student Branch Chapter · Silver Oak University, Ahmedabad
        </p>

        {/* Location Section in Footer with Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12 text-left">
          {/* Info Card */}
          <div className="t-card rounded-2xl p-6 sm:p-8 flex flex-col justify-center border border-accent/15 bg-gradient-to-br from-accent/5 to-transparent">
            <div>
              <span className="text-[10px] text-accent font-semibold uppercase tracking-[2px] block mb-2">Venue Location</span>
              <h3 className="font-sora font-bold text-xl text-white mb-4">Aryabhata Auditorium</h3>
              <a href="https://maps.app.goo.gl/Fm6TAotg4mqjV6on8" target="_blank" rel="noreferrer" className="text-[13px] t-muted leading-relaxed mb-6 block hover:text-accent transition-colors">
                Silver Oak University Campus,<br />
                Opp. Bhagwat Vidyapith, S.G. Highway,<br />
                Gota, Ahmedabad, Gujarat - 382481
              </a>
              
              <div className="flex flex-col gap-3 text-[13px] t-muted">
                {/* 3D Phone Icon and Stacked Numbers */}
                <div className="flex items-start gap-3">
                  <img src="https://img.icons8.com/3d-fluency/94/phone.png" alt="Phone" className="w-6 h-6 object-contain shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 font-medium">
                    <div>Rishi Amrutya — +91 63524 74784</div>
                    <div>Dhruv Chavda — +91 79908 15230</div>
                  </div>
                </div>
                {/* 3D Mail Icon and Dynamic Mail Link */}
                <div className="flex items-center gap-3">
                  <img src="https://img.icons8.com/3d-fluency/94/mail.png" alt="Mail" className="w-6 h-6 object-contain shrink-0" />
                  <a href="mailto:ieee.tr@socet.edu.in" className="hover:text-accent font-medium transition-colors">ieee.tr@socet.edu.in</a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <a 
            href="https://maps.app.goo.gl/Fm6TAotg4mqjV6on8"
            target="_blank"
            rel="noreferrer"
            className="t-card rounded-2xl overflow-hidden border border-accent/15 min-h-[300px] relative block cursor-pointer group"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 pointer-events-auto"></div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.1854928480457!2d72.5346378!3d23.090304600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833af6f39347%3A0xf1db9065daea7008!2sSilver%20Oak%20University!5e0!3m2!1sen!2sin!4v1783060491828!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '300px', filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </a>
        </div>

        {/* Social */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <a href="http://ieee.silveroakuni.ac.in/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <WebIcon />
          </a>
          <a href="https://twitter.com/IEEE_SilverOak" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <TwitterIcon />
          </a>
          <a href="https://www.facebook.com/IEEESilverOakUni" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <FacebookIcon />
          </a>
          <a href="https://www.instagram.com/ieee_silveroakuni/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <InstagramIcon />
          </a>
          <a href="https://www.linkedin.com/company/ieee-silveroakuni/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <LinkedInIcon />
          </a>
          <a href="https://www.threads.net/@ieee_silveroakuni" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center t-card t-muted hover:text-accent hover:border-accent/40 transition-all duration-200">
            <ThreadsIcon />
          </a>
        </div>

        {/* Divider */}
        <div className="t-divider max-w-sm mx-auto mb-5" />

        <p className="text-[10px] t-muted opacity-35">
          &copy; {new Date().getFullYear()} AI Conclave 3.0. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
