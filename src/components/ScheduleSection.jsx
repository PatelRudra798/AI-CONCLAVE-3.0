import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
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

  const scrollYVal = useMotionValue(0);

  const scaleY = useSpring(scrollYVal, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Window scroll handler for robust coordinate progress mapping
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height || 1;
      const centerY = window.innerHeight / 2;
      const p = Math.max(0, Math.min(1, (centerY - rect.top) / sectionHeight));
      scrollYVal.set(p);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    
    // Initial trigger
    handleScroll();
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const pathRef = useRef(null);
  const ballX = useMotionValue(0);
  const ballY = useMotionValue(0);
  const trail1X = useMotionValue(0);
  const trail1Y = useMotionValue(0);
  const trail2X = useMotionValue(0);
  const trail2Y = useMotionValue(0);
  const trail3X = useMotionValue(0);
  const trail3Y = useMotionValue(0);
  const pathProgressVal = useMotionValue(0);

  const [nearestIndex, setNearestIndex] = useState(0);

  // Helper to get sanitized URL ID
  const getItemId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Helper to map scroll progress non-linearly to node positions
  const getMappedPathProgress = (v, coordsList) => {
    if (coordsList.length <= 1) return v;
    
    const N = coordsList.length;
    const progresses = coordsList.map(c => c.ySecProgress || 0);

    const firstP = progresses[0];
    const lastP = progresses[N - 1];

    if (v <= firstP) {
      return 0;
    }

    if (v >= lastP) {
      return 1;
    }

    // Find the segment [i, i+1] that contains v
    let i = 0;
    for (let j = 0; j < N - 1; j++) {
      if (v >= progresses[j] && v <= progresses[j + 1]) {
        i = j;
        break;
      }
    }

    const p0 = progresses[i];
    const p1 = progresses[i + 1];
    
    const t = (v - p0) / (p1 - p0);

    const pathP0 = i / (N - 1);
    const pathP1 = (i + 1) / (N - 1);
    return pathP0 + t * (pathP1 - pathP0);
  };

  // Track and update scroll-driven ball position and active node highlights
  useEffect(() => {
    const updateBall = (latest) => {
      if (!pathRef.current || coords.length === 0) return;
      try {
        const length = pathRef.current.getTotalLength();
        
        // Apply non-linear mapping to the scroll progress
        const mapped = getMappedPathProgress(latest, coords);

        // Update path progress value to synchronize path glow perfectly
        pathProgressVal.set(mapped);

        // Lead Ball
        const pt = pathRef.current.getPointAtLength(mapped * length);
        
        // Snap to node center coordinates when progress is near node positions
        const closestIdx = Math.round(mapped * (coords.length - 1));
        const nodePt = coords[closestIdx];
        
        let finalX = pt.x;
        let finalY = pt.y;

        if (nodePt) {
          const nodeProgress = closestIdx / (coords.length - 1);
          const diff = Math.abs(mapped - nodeProgress);
          // 0.08 progress threshold for magnet snapping
          if (diff < 0.08) {
            const t = 1 - diff / 0.08;
            const easeT = t * t * (3 - 2 * t); // smoothstep
            finalX = pt.x + (nodePt.x - pt.x) * easeT;
            finalY = pt.y + (nodePt.y - pt.y) * easeT;
          }
        }

        ballX.set(finalX);
        ballY.set(finalY);

        // Trail 1
        const pt1 = pathRef.current.getPointAtLength(Math.max(0, mapped - 0.015) * length);
        trail1X.set(pt1.x);
        trail1Y.set(pt1.y);

        // Trail 2
        const pt2 = pathRef.current.getPointAtLength(Math.max(0, mapped - 0.030) * length);
        trail2X.set(pt2.x);
        trail2Y.set(pt2.y);

        // Trail 3
        const pt3 = pathRef.current.getPointAtLength(Math.max(0, mapped - 0.045) * length);
        trail3X.set(pt3.x);
        trail3Y.set(pt3.y);

        setNearestIndex(closestIdx);
      } catch (e) {
        // ignore
      }
    };

    // Update immediately with the current scroll progress when coordinates change
    updateBall(scaleY.get());

    // Subscribe to future scroll progress changes
    const unsubscribe = scaleY.on("change", (latest) => {
      updateBall(latest);
    });

    return () => unsubscribe();
  }, [scaleY, coords]);

  // Listen to hash changes and initial load hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return;

      const index = SCHEDULE.findIndex(item => getItemId(item.name) === hash);
      if (index !== -1) {
        setActive(index);
        const cardEl = document.getElementById(hash);
        if (cardEl) {
          setTimeout(() => {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
          // Adjust scroll after transition finishes
          setTimeout(() => {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 650);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    setTimeout(handleHashChange, 600);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCardClick = (index, name) => {
    setActive(index);
    const id = getItemId(name);
    window.location.hash = id;
    const cardEl = document.getElementById(id);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Re-trigger scroll after transition completes to adjust for card height changes
      setTimeout(() => {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 320);
    }
  };

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
    if (!scrollContainerRef.current || !containerRef.current) return;
    const parentRect = scrollContainerRef.current.getBoundingClientRect();
    const parentScrollTop = scrollContainerRef.current.scrollTop;
    const containerRect = containerRef.current.getBoundingClientRect();
    const sectionHeight = containerRect.height || 1;

    const newCoords = viewRefs.current
      .map((ref) => {
        if (!ref.current) return null;
        const rect = ref.current.getBoundingClientRect();
        return {
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + parentScrollTop + rect.height / 2,
          ySecProgress: (rect.top - containerRect.top + rect.height / 2) / sectionHeight,
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
            stroke="rgba(255, 255, 255, 0.08)" 
            strokeWidth="2" 
          />
          <motion.line 
            x1={first.x} 
            y1={first.y} 
            x2={last.x} 
            y2={last.y} 
            stroke="var(--accent)" 
            strokeWidth="2" 
            strokeOpacity="0.8" 
            style={{ pathLength: pathProgressVal }}
          />
          {/* Dummy path for mobile scroll ball alignment */}
          <path 
            ref={pathRef}
            d={`M ${first.x} ${first.y} L ${last.x} ${last.y}`}
            fill="none"
            stroke="transparent"
            strokeWidth="0"
          />
          {/* Scroll-driven energy ball on mobile */}
          <g>
            <defs>
              <filter id="ball-glow-mobile" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.circle cx={trail3X} cy={trail3Y} r="2.5" fill="#00f0ff" opacity="0.15" />
            <motion.circle cx={trail2X} cy={trail2Y} r="4.0" fill="#00f0ff" opacity="0.35" />
            <motion.circle cx={trail1X} cy={trail1Y} r="5.0" fill="#00f0ff" opacity="0.6" />
            <motion.circle cx={ballX} cy={ballY} r="6.5" fill="#ffffff" filter="url(#ball-glow-mobile)" />
          </g>
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
          stroke="rgba(255, 255, 255, 0.08)" 
          strokeWidth="2" 
        />
        <motion.path 
          ref={pathRef}
          d={d} 
          fill="none" 
          stroke="var(--accent)" 
          strokeWidth="2" 
          strokeOpacity="0.8" 
          className="drop-shadow-[0_0_4px_rgba(57,255,143,0.3)]" 
          style={{ pathLength: pathProgressVal }}
        />
        {/* Scroll-driven energy ball on desktop */}
        <g>
          <defs>
            <filter id="ball-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <motion.circle cx={trail3X} cy={trail3Y} r="3.5" fill="#00f0ff" opacity="0.15" />
          <motion.circle cx={trail2X} cy={trail2Y} r="5.0" fill="#00f0ff" opacity="0.35" />
          <motion.circle cx={trail1X} cy={trail1Y} r="6.5" fill="#00f0ff" opacity="0.6" />
          <motion.circle cx={ballX} cy={ballY} r="8" fill="#ffffff" filter="url(#ball-glow)" />
        </g>
      </svg>
    );
  };

  return (
    <section id="schedule" ref={containerRef} className="relative z-10 pt-12 pb-6 px-4 md:section-pad overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.06)' }}>

      <style>{`
        @keyframes pulseGlowEffect {
          0%, 100% {
            box-shadow: 0 0 8px 1px rgba(57,255,143,0.15);
          }
          50% {
            box-shadow: 0 0 16px 3px rgba(57,255,143,0.4);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0s !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

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

        {/* Vertical Compact Roadmap Timeline */}
        <div ref={scrollContainerRef} className="max-w-5xl mx-auto py-4 relative scroll-smooth" 
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
                onClick={() => handleCardClick(i, item.name)}
                viewRef={viewRefs.current[i]}
                isMobile={isMobile}
                nearestIndex={nearestIndex}
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

function ScheduleCard({ item, index, isActive, onClick, viewRef, isMobile, nearestIndex }) {
  const isBallActive = nearestIndex === index;
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

  // Desktop/mobile alignment layouts
  const cardAlignmentClass = isMobile 
    ? 'pl-12 w-full text-left' 
    : isLeft 
      ? 'pr-[calc(50%+123px)] pl-2 text-right justify-end ml-auto mr-0' 
      : 'pl-[calc(50%+123px)] pr-2 text-left justify-start mr-auto ml-0';

  const nodePositionStyle = isMobile
    ? { left: '32px', transform: 'translate(-50%, -50%)' }
    : isLeft
      ? { left: 'calc(50% - 45px)', transform: 'translate(-50%, -50%)' }
      : { left: 'calc(50% + 45px)', transform: 'translate(-50%, -50%)' };

  // Card slide-in variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isMobile ? 30 : (isLeft ? -50 : 50),
      y: 20 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        duration: 0.6
      }
    }
  };

  // Helper to get sanitized URL ID
  const getItemId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const itemId = getItemId(item.name);

  return (
    <div id={itemId} className={`relative flex items-center w-full min-h-[90px] py-1.5 group`}>
      
      {/* 3D Model View Node (scaled down by 30-40% to w-10 h-10) */}
      <motion.div 
        ref={viewRef}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className={`absolute top-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-300`}
        style={{
          ...nodePositionStyle,
          scale: isBallActive ? 1.18 : (isActive ? 1.1 : 1.0),
          background: 'rgba(10, 10, 20, 0.65)',
          borderColor: isBallActive ? 'var(--accent2, #00f0ff)' : (item.special ? 'var(--accent)' : 'var(--card-border)'),
          boxShadow: isBallActive 
            ? '0 0 20px var(--accent2, #00f0ff), inset 0 0 10px var(--accent2, #00f0ff)' 
            : (isActive ? '0 0 15px rgba(57,255,143,0.4)' : '0 0 6px rgba(255,255,255,0.05)'),
          animation: isBallActive ? 'none' : 'pulseGlowEffect 3s infinite ease-in-out',
        }}
        onClick={onClick}
      >
        {/* Reactive ripple effect when ball is active on node */}
        {isBallActive && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 pointer-events-none"
            style={{ borderColor: 'var(--accent2, #00f0ff)' }}
          />
        )}
      </motion.div>

      {/* Card Content (Tighter padding & margin) */}
      <div
        onClick={onClick}
        className={`flex w-full ${cardAlignmentClass}`}
      >
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={`
            relative rounded-xl border transition-all duration-300 overflow-hidden w-full max-w-[360px]
            ${isMobile ? 'border-l-4' : isLeft ? 'md:border-r-4 md:border-l-px' : 'border-l-4 md:border-r-px'}
            ${isActive || isBallActive
              ? 'shadow-[0_4px_20px_rgba(57,255,143,0.08)] scale-[1.01]'
              : 'hover:shadow-[0_2px_12px_rgba(0,0,0,0.1)] hover:scale-[1.005]'
            }
          `}
          style={{
            borderTopColor: isBallActive ? 'var(--accent2, #00f0ff)' : 'var(--card-border)',
            borderBottomColor: isBallActive ? 'var(--accent2, #00f0ff)' : 'var(--card-border)',
            borderLeftColor: isMobile || !isLeft ? (isBallActive ? 'var(--accent2, #00f0ff)' : trackBorderColor) : 'var(--card-border)',
            borderRightColor: !isMobile && isLeft ? (isBallActive ? 'var(--accent2, #00f0ff)' : trackBorderColor) : 'var(--card-border)',
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
            <h3 className={`text-[13px] sm:text-[14px] font-semibold t-text mb-0.5 transition-colors duration-200 ${isActive || isBallActive ? 'text-accent2-light' : ''}`}>
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
              <p className="text-[9px] t-muted opacity-40 mt-0.5">Tap to expand / scroll to highlight</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
