import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';
import SectionHeader from './SectionHeader';
import { SCHEDULE } from '../data';
import { ModelResolver } from './ThreeTimelineModels';

const BADGE_STYLES = {
  keynote: { label: 'Keynote', cls: 'bg-accent/15 text-accent border-accent/35' },
  opening: { label: 'Opening', cls: 'bg-accent/10 text-accent2-light border-accent/25' },
  workshop: { label: 'Workshop', cls: 'bg-accent2/20 text-accent2-light border-accent2/40' },
  panel: { label: 'Panel', cls: 'bg-accent/20 text-accent border-accent/45' },
  break: { label: 'Break', cls: 'bg-accent/10 text-accent border-accent/25' },
};

const TRACK_BG = {
  keynote: 'from-accent/[0.06] to-transparent',
  workshop: 'from-accent2/[0.08] to-transparent',
  break: 'from-accent/[0.03] to-transparent',
  logistics: 'from-accent2-light/[0.05] to-transparent',
};

export default function ScheduleSection() {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [coords, setCoords] = useState([]);
  const scrollContainerRef = useRef(null);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create refs for each item's 3D View tracking element
  const viewRefs = useRef([]);
  if (viewRefs.current.length !== SCHEDULE.length) {
    viewRefs.current = Array(SCHEDULE.length).fill().map((_, i) => viewRefs.current[i] || { current: null });
  }

  // Measure the coordinates of timeline nodes in the DOM
  const updateCoords = () => {
    if (!scrollContainerRef.current) return;
    const parentRect = scrollContainerRef.current.getBoundingClientRect();
    const parentScrollTop = scrollContainerRef.current.scrollTop;

    const newCoords = viewRefs.current
      .map((ref) => {
        if (!ref.current) return null;
        const rect = ref.current.getBoundingClientRect();
        return {
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + parentScrollTop + rect.height / 2,
        };
      })
      .filter(Boolean);

    setCoords(newCoords);
  };

  // Recalculate node coordinates on render triggers (expanding card, resizing window)
  useEffect(() => {
    updateCoords();

    window.addEventListener('resize', updateCoords);
    const timer = setTimeout(updateCoords, 200);

    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && scrollContainerRef.current) {
      observer = new ResizeObserver(() => {
        updateCoords();
      });
      observer.observe(scrollContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateCoords);
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [active, isMobile]);

  // Draw the connecting vertical curve dynamically based on measured node coordinates
  const renderTimelineCurve = () => {
    if (coords.length === 0) return null;

    if (isMobile) {
      const first = coords[0];
      const last = coords[coords.length - 1];
      return (
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-visible z-10">
          <line 
            x1={first.x} 
            y1={first.y} 
            x2={last.x} 
            y2={last.y} 
            stroke="var(--accent)" 
            strokeWidth="2" 
            strokeOpacity="0.4" 
          />
        </svg>
      );
    }

    // Wavy curve connecting each node smoothly on desktop
    let d = '';
    for (let i = 0; i < coords.length; i++) {
      const p = coords[i];
      if (i === 0) {
        d += `M ${p.x} ${p.y}`;
      } else {
        const prev = coords[i - 1];
        const midY = (prev.y + p.y) / 2;
        d += ` C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
      }
    }

    const maxY = coords[coords.length - 1].y;

    return (
      <svg 
        className="absolute left-0 top-0 w-full pointer-events-none overflow-visible z-10" 
        style={{ height: maxY + 50 }}
      >
        <path 
          d={d} 
          fill="none" 
          stroke="var(--accent)" 
          strokeWidth="2" 
          strokeOpacity="0.3" 
          className="drop-shadow-[0_0_4px_rgba(57,255,143,0.2)]" 
        />
      </svg>
    );
  };

  return (
    <section id="schedule" ref={containerRef} className="relative z-10 pt-12 pb-6 px-4 md:section-pad overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.06)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />
      <div className="absolute bottom-10 left-0 w-[300px] h-[300px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, var(--accent2), transparent 70%)' }} />

      <div className="max-container relative">
        <SectionHeader
          title="Day Schedule"
          sub="08:00 AM – 05:30 PM · Silver Oak University, Ahmedabad"
        />

        {/* Legend */}
        {/* <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {Object.entries(BADGE_STYLES).map(([key, { label, cls }]) => (
            <span key={key} className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
              {label}
            </span>
          ))}
        </div> */}

        {/* Vertical Compact Roadmap Timeline */}
        <div ref={scrollContainerRef} className="max-w-5xl mx-auto max-h-[500px] overflow-y-auto pr-1 py-4 relative scroll-smooth" 
             style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent) transparent' }}>
          
          {/* Connecting road curve path */}
          {renderTimelineCurve()}

          <div className="flex flex-col gap-4 relative z-10 w-full px-2">
            {SCHEDULE.map((item, i) => (
              <ScheduleCard
                key={i}
                item={item}
                index={i}
                isActive={active === i}
                onClick={() => setActive(active === i ? null : i)}
                viewRef={viewRefs.current[i]}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Single shared Canvas tracking all 3D View nodes for extreme performance */}
      <Canvas
        eventSource={containerRef}
        className="pointer-events-none fixed inset-0 z-20"
        camera={{ fov: 45, near: 0.1, far: 20 }}
      >
        {SCHEDULE.map((item, i) => (
          <View key={i} track={viewRefs.current[i]}>
            <ambientLight intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#39ff8f" />
            <pointLight position={[-5, -5, 5]} intensity={1} color="#8a2be2" />
            <directionalLight position={[0, 10, 0]} intensity={0.5} />
            
            <ModelResolver iconUrl={item.icon} track={item.track} />
            
            <Preload all />
          </View>
        ))}
      </Canvas>
    </section>
  );
}

function ScheduleCard({ item, index, isActive, onClick, viewRef, isMobile }) {
  const b = item.badge ? BADGE_STYLES[item.badge] : null;
  const trackGrad = TRACK_BG[item.track] || '';
  const isLeft = index % 2 === 0;

  const getTrackColor = (track) => {
    switch(track) {
      case 'keynote': return 'var(--accent)';
      case 'workshop': return 'var(--accent2)';
      case 'break': return 'rgba(57,255,143,0.4)';
      case 'logistics': return 'var(--accent2-light)';
      default: return 'rgba(255,255,255,0.15)';
    }
  };

  const trackBorderColor = getTrackColor(item.track);

  // Desktop wiggling margins to match wavy path
  // Left nodes are at X=462 (45%), right nodes at X=562 (55%)
  // Cards are pushed to opposite sides
  const cardAlignmentClass = isMobile 
    ? 'pl-12 w-full text-left' 
    : isLeft 
      ? 'pr-[55%] pl-2 text-right justify-end ml-auto mr-0' 
      : 'pl-[55%] pr-2 text-left justify-start mr-auto ml-0';

  const nodePositionStyle = isMobile
    ? { left: '32px', transform: 'translate(-50%, -50%)' }
    : isLeft
      ? { left: 'calc(50% - 45px)', transform: 'translate(-50%, -50%)' }
      : { left: 'calc(50% + 45px)', transform: 'translate(-50%, -50%)' };

  return (
    <div className={`relative flex items-center w-full min-h-[90px] py-1.5 group`}>
      
      {/* 3D Model View Node (scaled down by 30-40% to w-10 h-10) */}
      <div 
        ref={viewRef}
        className={`absolute top-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 transition-transform duration-300 cursor-pointer ${isActive ? 'scale-110 shadow-[0_0_15px_rgba(57,255,143,0.4)]' : 'group-hover:scale-105'}`}
        style={{
          ...nodePositionStyle,
          background: 'rgba(10, 10, 20, 0.65)',
          borderColor: item.special ? 'var(--accent)' : 'var(--card-border)',
        }}
        onClick={onClick}
      />

      {/* Card Content (Tighter padding & margin) */}
      <div
        onClick={onClick}
        className={`flex w-full ${cardAlignmentClass}`}
      >
        <div 
          className={`
            relative rounded-xl border transition-all duration-300 overflow-hidden w-full max-w-[360px]
            ${isMobile ? 'border-l-4' : isLeft ? 'md:border-r-4 md:border-l-px' : 'border-l-4 md:border-r-px'}
            ${isActive
              ? 'shadow-[0_4px_20px_rgba(57,255,143,0.08)] scale-[1.01]'
              : 'hover:shadow-[0_2px_12px_rgba(0,0,0,0.1)] hover:scale-[1.005]'
            }
          `}
          style={{
            borderColor: 'var(--card-border)',
            borderLeftColor: isMobile || !isLeft ? trackBorderColor : 'var(--card-border)',
            borderRightColor: !isMobile && isLeft ? trackBorderColor : 'var(--card-border)',
            background: 'rgba(25, 25, 35, 0.45)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Gradient wash */}
          <div className={`absolute inset-0 bg-gradient-to-r ${trackGrad} pointer-events-none opacity-40`} />

          <div className="relative p-3.5 flex flex-col justify-center">
            {/* Time range */}
            <div className={`flex items-center gap-1.5 mb-1.5 flex-wrap ${!isMobile && isLeft ? 'md:justify-end' : 'justify-start'}`}>
              <span className="text-[10px] font-mono font-semibold text-accent">
                {item.time}
              </span>
              <span className="text-[8px] text-white/30">→</span>
              <span className="text-[10px] font-mono t-muted">
                {item.end}
              </span>
              {b && (
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${b.cls} ${!isMobile && isLeft ? 'md:ml-0 md:mr-auto' : 'ml-auto'}`}>
                  {b.label}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className={`text-[13px] sm:text-[14px] font-semibold t-text mb-0.5 transition-colors duration-200 ${isActive ? 'text-accent' : ''}`}>
              {item.name}
            </h3>

            {/* Speaker tag */}
            {item.speaker && (
              <p className="text-[10px] text-accent2-light font-medium mb-1">🎤 {item.speaker}</p>
            )}

            {/* Expandable description (Tighter height) */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isActive ? '80px' : '0px', opacity: isActive ? 1 : 0 }}
            >
              <p className="text-[11px] t-muted leading-relaxed pt-1 pb-0.5">{item.desc}</p>
            </div>

            {/* Hint */}
            {!isActive && (
              <p className="text-[9px] t-muted opacity-40 mt-0.5">Tap to expand</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
