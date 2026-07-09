import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { PAST_EVENTS } from '../../data';

export default function PastEventsSection() {
 const { editions, photos } = PAST_EVENTS;
 const [isPaused, setIsPaused] = useState(false);
 const [activeEdition, setActiveEdition] = useState('All');

 const filteredPhotos = activeEdition === 'All' 
 ? photos 
 : photos.filter(p => p.edition === activeEdition);

 // To ensure the marquee is always wider than the screen, we duplicate the filtered set
 const originalSet = [...filteredPhotos, ...filteredPhotos, ...filteredPhotos];
 
 // Adjust animation duration so the scroll speed remains constant regardless of array length.
 // Base speed: 4 seconds per photo for a balanced scroll speed.
 const animationDuration = `${originalSet.length * 4}s`;

 return (
 <section id="past-events" className="relative z-10 section-pad overflow-hidden">
 <style>{`
 .carousel-track {
 animation: scroll var(--anim-duration) linear infinite;
 animation-play-state: running;
 }
 .carousel-track.paused {
 animation-play-state: paused;
 }
 @keyframes scroll {
 0% { transform: translateX(0); }
 100% { transform: translateX(-100%); }
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
 sub="A glimpse into previous editions of AI Conclave inspiring sessions, hands-on workshops and unforgettable moments."
 />

 {/* Edition highlights */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-12">
 {editions.map((edition) => {
 const version = edition.version || edition.title.split(' ').pop(); // '2.0' or '1.0'
 const isActive = activeEdition === version;
 const isFaded = activeEdition !== 'All' && !isActive;

 return (
 <button
 key={edition.title}
 onClick={() => setActiveEdition(isActive ? 'All' : version)}
 className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col items-start min-h-[140px] text-left transition-all duration-300 ${
 isFaded ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'
 } hover:opacity-100 hover:grayscale-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50`}
 style={{
 background: isActive ? 'var(--card-hover)' : 'var(--card)',
 border: `1px solid ${isActive ? 'var(--accent)' : 'var(--card-border)'}`,
 transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
 boxShadow: isActive ? '0 10px 30px -10px rgba(0,229,255,0.2)' : 'none'
 }}
 >
 <div
 className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 pointer-events-none transition-opacity duration-300"
 style={{ background: 'linear-gradient(135deg, var(--accent), transparent)' }}
 />
 <span className="text-[11px] text-accent font-semibold uppercase tracking-[2px] block mb-2 transition-colors">
 {edition.year}
 </span>
 <h3 className="font-sora font-bold text-[18px] sm:text-[20px] md:text-[22px] t-text mb-2">
 {edition.title}
 </h3>
 {isActive && (
 <div className="absolute bottom-0 left-0 h-1 bg-accent w-full animate-pulse" />
 )}
 </button>
 );
 })}
 </div>

 {/* Carousel Photo gallery */}
 <div 
 className="relative mt-8 overflow-hidden flex pb-14 pt-4"
 onMouseEnter={() => setIsPaused(true)}
 onMouseLeave={() => setIsPaused(false)}
 style={{ '--anim-duration': animationDuration }}
 >
 {/* First block */}
 <div className={`carousel-track flex w-max shrink-0 ${isPaused ? 'paused' : ''}`}>
 {originalSet.map((photo, i) => (
 <div key={`a-${i}`} className="w-[85vw] sm:w-[320px] lg:w-[360px] shrink-0 pr-4 sm:pr-5 lg:pr-6">
 <PhotoCard photo={photo} index={i} />
 </div>
 ))}
 </div>
 {/* Second identical block for seamless loop */}
 <div className={`carousel-track flex w-max shrink-0 ${isPaused ? 'paused' : ''}`} aria-hidden="true">
 {originalSet.map((photo, i) => (
 <div key={`b-${i}`} className="w-[85vw] sm:w-[320px] lg:w-[360px] shrink-0 pr-4 sm:pr-5 lg:pr-6">
 <PhotoCard photo={photo} index={i} />
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}



const PhotoCard = React.memo(function PhotoCard({ photo, index }) {
 const [isLoaded, setIsLoaded] = useState(false);
 const isEager = index < 3; // Eager load the first 3 images to prevent visible pop-in

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
 {/* Extremely low-res blur placeholder that loads instantly */}
 <div 
 className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md scale-110 transition-opacity duration-700"
 style={{ 
 backgroundImage: `url("${photo.src.blur}")`, 
 opacity: isLoaded ? 0 : 1 
 }}
 />

 {/* Responsive, modern WebP image loading */}
 <picture>
 <source media="(max-width: 640px)" srcSet={photo.src.sm} type="image/webp" />
 <source media="(max-width: 1024px)" srcSet={photo.src.md} type="image/webp" />
 <img
 src={photo.src.lg}
 alt={photo.alt}
 loading={isEager ? 'eager' : 'lazy'}
 decoding="async"
 onLoad={() => setIsLoaded(true)}
 className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
 />
 </picture>

 <div
 className="absolute inset-0 opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"
 style={{
 background: 'linear-gradient(to top, rgba(6,11,20,0.95) 0%, rgba(6,11,20,0.2) 50%, transparent 100%)',
 }}
 />

 <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
 {photo.edition && (
 <span className="inline-block text-[10px] font-semibold uppercase tracking-[2px] text-accent mb-2">
 {photo.edition === '1.0' ? 'AI Conclave' : `AI Conclave ${photo.edition}`}
 </span>
 )}
 <p className="text-[15px] sm:text-[17px] font-medium text-white/95 leading-snug font-sora">
 {photo.caption}
 </p>
 </figcaption>
 </motion.figure>
 );
});
