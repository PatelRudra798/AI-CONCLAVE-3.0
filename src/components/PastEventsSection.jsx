import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { PAST_EVENTS } from '../data';

export default function PastEventsSection() {
  const { editions, photos } = PAST_EVENTS;
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="past-events" className="relative z-10 section-pad overflow-hidden">
      <style>{`
        .carousel-track {
          animation: scroll 35s linear infinite;
          animation-play-state: running;
        }
        .carousel-track.paused {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* -50% plus half the gap to loop seamlessly */
        }
      `}</style>
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--glow) 0%, transparent 70%)' }}
      />

      <div className="max-container">
        <SectionHeader
          label="Our Journey"
          title="Past Events"
          sub="A glimpse into previous editions of AI Conclave — inspiring sessions, hands-on workshops, and unforgettable moments."
        />

        {/* Edition highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {editions.map((edition) => (
            <div
              key={edition.title}
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, var(--accent), transparent)' }}
              />
              <span className="text-[11px] text-accent font-semibold uppercase tracking-[2px] block mb-2">
                {edition.year}
              </span>
              <h3 className="font-sora font-bold text-[18px] sm:text-[20px] t-text mb-3">
                {edition.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                <Stat label="Participants" value={edition.participants} />
                <Stat label="Speakers" value={edition.speakers} />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Photo gallery */}
        <div 
          className="relative mt-8 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`carousel-track flex w-max gap-4 sm:gap-5 lg:gap-6 pb-14 pt-4 ${isPaused ? 'paused' : ''}`}>
            {[...photos, ...photos].map((photo, i) => (
              <div key={i} className="w-[85vw] sm:w-[320px] lg:w-[360px] shrink-0">
                <PhotoCard photo={photo} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[18px] sm:text-[20px] font-sora font-bold text-accent leading-none mb-1">
        {value}
      </p>
      <p className="text-[11px] sm:text-[12px] t-muted">{label}</p>
    </div>
  );
}

function PhotoCard({ photo, index }) {
  return (
    <motion.figure
      whileHover={{ 
        scale: 1.06, 
        y: -8, 
        zIndex: 50,
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-[18px] sm:rounded-[24px] h-[280px] sm:h-[320px] lg:h-[360px] w-full cursor-grab active:cursor-grabbing"
      style={{
        border: '1px solid var(--card-border)',
        background: 'var(--card)',
        transformOrigin: 'center bottom',
      }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div
        className="absolute inset-0 opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(6,11,20,0.95) 0%, rgba(6,11,20,0.2) 50%, transparent 100%)',
        }}
      />

      <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
        {photo.edition && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[2px] text-accent mb-2">
            AI Conclave {photo.edition}
          </span>
        )}
        <p className="text-[15px] sm:text-[17px] font-medium text-white/95 leading-snug font-sora">
          {photo.caption}
        </p>
      </figcaption>
    </motion.figure>
  );
}
