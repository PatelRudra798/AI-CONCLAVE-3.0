import SectionHeader from './SectionHeader';
import { PAST_EVENTS } from '../data';

export default function PastEventsSection() {
  const { editions, photos } = PAST_EVENTS;

  return (
    <section id="past-events" className="relative z-10 section-pad overflow-hidden">
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

        {/* Photo gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
          {photos.map((photo, i) => (
            <PhotoCard key={i} photo={photo} index={i} />
          ))}
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
  const spanClass = photo.featured
    ? 'col-span-2 row-span-2'
    : photo.wide
      ? 'col-span-2'
      : '';

  return (
    <figure
      className={`past-event-photo group relative overflow-hidden rounded-xl sm:rounded-2xl ${spanClass}`}
      style={{
        border: '1px solid var(--card-border)',
        animationDelay: `${index * 0.06}s`,
      }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(6,11,20,0.92) 0%, rgba(6,11,20,0.15) 50%, transparent 100%)',
        }}
      />

      <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        {photo.edition && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[1.5px] text-accent mb-1">
            AI Conclave {photo.edition}
          </span>
        )}
        <p className="text-[11px] sm:text-[13px] font-medium text-white/90 leading-snug">
          {photo.caption}
        </p>
      </figcaption>
    </figure>
  );
}
