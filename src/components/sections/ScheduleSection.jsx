import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';
import { motion, useSpring, useMotionValue, useAnimationFrame, useTransform, useScroll } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { SCHEDULE } from '../../data';
import { ModelResolver } from '../three/ThreeTimelineModels';

const BADGE_STYLES = {
  keynote: { label: 'Keynote', cls: 'bg-accent/15 text-accent border-accent/35' },
  opening: { label: 'Opening', cls: 'bg-accent/10 text-accent2-light border-accent/25' },
  workshop: { label: 'Workshop', cls: 'bg-accent2/20 text-accent2-light border-accent2/40' },
  panel: { label: 'Panel', cls: 'bg-accent/20 text-accent border-accent/45' },
  break: { label: 'Refreshment', cls: 'bg-accent/10 text-accent border-accent/25' },
  Arrival: { label: 'Arrival', cls: 'bg-accent/10 text-accent border-accent/25' },
};

const TRACK_BG = {
  keynote: 'from-accent/[0.06] to-transparent',
  workshop: 'from-accent2/[0.08] to-transparent',
  break: 'from-accent/[0.03] to-transparent',
  logistics: 'from-accent2-light/[0.05] to-transparent',
};

export default function ScheduleSection() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [coords, setCoords] = useState([]);
  const scrollContainerRef = useRef(null);

  const pathRef = useRef(null);
  const ballX = useMotionValue(0);
  const ballY = useMotionValue(0);
  const trail1X = useMotionValue(0);
  const trail1Y = useMotionValue(0);
  const trail2X = useMotionValue(0);
  const trail2Y = useMotionValue(0);
  const trail3X = useMotionValue(0);
  const trail3Y = useMotionValue(0);
  // Use a dedicated motion value for the breathing glow pulse
  const glowPulseVal = useMotionValue(0);

  // Create transforms at the top level to strictly obey the Rules of Hooks
  const ballOpacity = useTransform(glowPulseVal, [0, 1], [0.75, 1]);
  const ballScale = useTransform(glowPulseVal, [0, 1], [1, 1.08]);

  // Scroll tracking setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Use a dedicated motion value for the path progress (for SVG stroke)
  const pathProgressVal = useMotionValue(0);

  // Sync scroll progress to ball coordinates smoothly
  useAnimationFrame((time) => {
    // Breathing pulse for the glowing indicator
    const pulseCycle = (time % 3000) / 1500;
    glowPulseVal.set(pulseCycle > 1 ? 2 - pulseCycle : pulseCycle);

    // Read scroll progress
    const currentProgress = smoothProgress.get();
    pathProgressVal.set(currentProgress);

    if (!pathRef.current || coords.length === 0) return;
    try {
      const length = pathRef.current.getTotalLength();

      // Calculate continuous position along path
      const pt = pathRef.current.getPointAtLength(currentProgress * length);
      ballX.set(pt.x);
      ballY.set(pt.y);

      // Trailing effect smoothly follows
      const pt1 = pathRef.current.getPointAtLength(Math.max(0, currentProgress - 0.015) * length);
      trail1X.set(pt1.x);
      trail1Y.set(pt1.y);

      const pt2 = pathRef.current.getPointAtLength(Math.max(0, currentProgress - 0.030) * length);
      trail2X.set(pt2.x);
      trail2Y.set(pt2.y);

      const pt3 = pathRef.current.getPointAtLength(Math.max(0, currentProgress - 0.045) * length);
      trail3X.set(pt3.x);
      trail3Y.set(pt3.y);
    } catch (e) {
      // ignore
    }
  });

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

  const handleCardClick = (name) => {
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
  }, [isMobile]);

  // Helper to get sanitized URL ID (needed for hash changes)
  const getItemId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

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

            <motion.circle
              cx={ballX} cy={ballY} r="6.5" fill="#ffffff" filter="url(#ball-glow-mobile)"
              style={{
                opacity: ballOpacity,
                scale: ballScale
              }}
            />
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

          <motion.circle
            cx={ballX} cy={ballY} r="8" fill="#ffffff" filter="url(#ball-glow)"
            style={{
              opacity: ballOpacity,
              scale: ballScale
            }}
          />
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
                onClick={() => handleCardClick(item.name)}
                viewRef={viewRefs.current[i]}
                isMobile={isMobile}
                ballY={ballY}
                nodeCoord={coords[i]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Single shared Canvas tracking all 3D View nodes for extreme performance (Desktop only) */}
      {!isMobile && (
        <Canvas
          eventSource={containerRef}
          className="pointer-events-none fixed inset-0 z-20"
          camera={{ fov: 45, near: 0.1, far: 20 }}
        >
          <Suspense fallback={null}>
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
          </Suspense>
        </Canvas>
      )}
    </section>
  );
}

function ScheduleCard({ item, index, onClick, viewRef, isMobile, ballY, nodeCoord }) {
  const b = item.badge ? BADGE_STYLES[item.badge] : null;
  const trackGrad = TRACK_BG[item.track] || '';
  const isLeft = index % 2 === 0;

  const nodeY = nodeCoord?.y || 0;

  // Transform values based on ball's Y distance to node (70px radius threshold)
  const distRange = [nodeY - 70, nodeY, nodeY + 70];
  const nodeScale = useTransform(ballY, distRange, [1.0, 1.15, 1.0]);

  // Card-specific transforms based on distance to ball (replaces isActive React state)
  const cardScale = useTransform(ballY, distRange, [1.0, 1.01, 1.0]);
  const cardShadow = useTransform(ballY, distRange, [
    '0px 2px 12px 0px rgba(0, 0, 0, 0.1)',
    '0px 4px 20px 0px rgba(57, 255, 143, 0.08)',
    '0px 2px 12px 0px rgba(0, 0, 0, 0.1)'
  ]);

  // Description and Hint transitions
  const descHeight = useTransform(ballY, distRange, ['0px', '80px', '0px']);
  const descOpacity = useTransform(ballY, distRange, [0, 1, 0]);

  // Define identical shadow structures so Framer Motion can interpolate them smoothly
  const DEFAULT_SHADOW = '0px 0px 6px 0px rgba(255, 255, 255, 0.05), inset 0px 0px 0px 0px rgba(0, 240, 255, 0)';
  const ACTIVE_SHADOW = '0px 0px 20px 0px rgba(0, 240, 255, 0.6), inset 0px 0px 10px 0px rgba(0, 240, 255, 0.4)';
  const HL_SHADOW = '0px 0px 15px 0px rgba(57, 255, 143, 0.4), inset 0px 0px 0px 0px rgba(0, 240, 255, 0)';

  // Smoothly brighten node
  const nodeShadow = useTransform(ballY, distRange, [
    DEFAULT_SHADOW,
    ACTIVE_SHADOW,
    DEFAULT_SHADOW
  ]);

  // Map exact RGBA colors for smooth framer-motion interpolation without CSS var snapping
  const BORDER_DEFAULT = 'rgba(255, 255, 255, 0.15)';
  const BORDER_ACTIVE = 'rgba(0, 240, 255, 1)';
  const BORDER_SPECIAL = 'rgba(57, 255, 143, 1)';

  const nodeBorderColor = useTransform(ballY, distRange, [
    item.special ? BORDER_SPECIAL : BORDER_DEFAULT,
    BORDER_ACTIVE,
    item.special ? BORDER_SPECIAL : BORDER_DEFAULT
  ]);

  const cardBorderTopColor = useTransform(ballY, distRange, [BORDER_DEFAULT, BORDER_ACTIVE, BORDER_DEFAULT]);
  const cardBorderBottomColor = useTransform(ballY, distRange, [BORDER_DEFAULT, BORDER_ACTIVE, BORDER_DEFAULT]);

  const getTrackColor = (track) => {
    switch (track) {
      case 'keynote': return 'rgba(57, 255, 143, 1)';
      case 'workshop': return 'rgba(15, 122, 69, 1)';
      case 'break': return 'rgba(57, 255, 143, 0.4)';
      case 'logistics': return 'rgba(124, 255, 184, 1)';
      default: return 'rgba(255, 255, 255, 0.15)';
    }
  };

  const trackBorderColor = getTrackColor(item.track);

  // Conditionally color side borders based on layout
  const sideBorderColorBase = isMobile || !isLeft ? trackBorderColor : BORDER_DEFAULT;
  const rightSideBorderColorBase = !isMobile && isLeft ? trackBorderColor : BORDER_DEFAULT;

  const cardBorderLeftColor = useTransform(ballY, distRange, [sideBorderColorBase, BORDER_ACTIVE, sideBorderColorBase]);
  const cardBorderRightColor = useTransform(ballY, distRange, [rightSideBorderColorBase, BORDER_ACTIVE, rightSideBorderColorBase]);

  const TEXT_DEFAULT = 'rgba(255, 255, 255, 0.8)';
  const TEXT_ACTIVE = 'rgba(124, 255, 184, 1)';

  const textTitleColor = useTransform(ballY, distRange, [
    TEXT_DEFAULT,
    BORDER_ACTIVE,
    TEXT_DEFAULT
  ]);

  // Desktop/mobile alignment layouts via Tailwind classes
  const cardAlignmentClass = isLeft
    ? 'pl-[72px] pr-4 md:pr-[calc(50%+123px)] md:pl-2 text-left md:text-right justify-start md:justify-end ml-0 md:ml-auto mr-auto md:mr-0'
    : 'pl-[72px] pr-4 md:pl-[calc(50%+123px)] md:pr-2 text-left justify-start mr-auto md:ml-0';

  const nodeAlignClass = isLeft
    ? 'left-[28px] md:left-[calc(50%-45px)]'
    : 'left-[28px] md:left-[calc(50%+45px)]';

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
        type: "tween",
        ease: "easeOut",
        duration: 0.6
      }
    }
  };

  const getItemId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const itemId = getItemId(item.name);

  return (
    <div id={itemId} className={`relative flex items-center w-full min-h-[90px] py-1.5 group`}>

      {/* 3D Model View Node (or Image Fallback on Mobile) */}
      <motion.div
        ref={viewRef}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 cursor-pointer ${nodeAlignClass}`}
        style={{
          scale: nodeScale,
          background: 'rgba(10, 10, 20, 0.65)',
          borderColor: nodeBorderColor,
          boxShadow: nodeShadow,
        }}
        onClick={onClick}
      >
        {/* Removed emoji icon image fallback on mobile for a clean minimal circle appearance */}
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
            relative rounded-xl border transition-all duration-300 overflow-hidden w-[90%] sm:w-[85%] md:max-w-[360px]
            border-l-4 md:border-l-px ${isLeft ? 'md:border-r-4' : 'md:border-l-4 md:border-r-px'}
            hover:shadow-[0_2px_12px_rgba(0,0,0,0.1)] hover:scale-[1.005]
          `}
          style={{
            scale: cardScale,
            boxShadow: cardShadow,
            borderTopColor: cardBorderTopColor,
            borderBottomColor: cardBorderBottomColor,
            borderLeftColor: cardBorderLeftColor,
            borderRightColor: cardBorderRightColor,
            background: 'rgba(25, 25, 35, 0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Gradient wash */}
          <div className={`absolute inset-0 bg-gradient-to-r ${trackGrad} pointer-events-none opacity-40`} />

          <div className="relative p-4 md:p-3.5 flex flex-col justify-center gap-1">
            {/* Time range */}
            <div className={`flex items-center gap-1.5 flex-wrap ${!isMobile && isLeft ? 'md:justify-end' : 'justify-start'}`}>
              <span className="text-[11px] md:text-[10px] font-mono font-semibold text-accent">
                {item.time}
              </span>
              <span className="text-[9px] md:text-[8px] text-white/50 drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">→</span>
              <span className="text-[11px] md:text-[10px] font-mono text-white/60 drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
                {item.end}
              </span>
              {b && (
                <span className={`text-[9px] md:text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${b.cls} ${!isMobile && isLeft ? 'md:ml-0 md:mr-auto' : 'ml-auto'}`}>
                  {b.label}
                </span>
              )}
            </div>

            {/* Name */}
            <motion.h3
              className={`text-[15px] sm:text-[16px] md:text-[14px] font-semibold leading-tight`}
              style={{ color: textTitleColor }}
            >
              {item.name}
            </motion.h3>

            {/* Speaker tag */}
            {item.speaker && (
              <p className="text-[10px] text-accent2-light font-medium mb-1"> {item.speaker}</p>
            )}

            {/* Expandable description (Scroll-driven) */}
            <motion.div
              className="overflow-hidden"
              style={{ maxHeight: descHeight, opacity: descOpacity }}
            >
              <p className="text-[11px] text-white/60 drop-shadow-[0_0_3px_rgba(255,255,255,0.3)] leading-relaxed pt-1 pb-0.5">{item.desc}</p>
            </motion.div>


          </div>
        </motion.div>
      </div>
    </div>
  );
}
