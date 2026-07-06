import { useState, Suspense, Component, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { ACTIVITIES } from '../../data';
import { ActivityModel } from '../three/ActivityCanvas';

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL/Canvas failed to load model:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-accent/5 rounded-full border border-accent/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <span className="text-5xl drop-shadow-md filter grayscale-[0.2] opacity-80" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
            {this.props.fallbackIcon}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ActivitiesSection() {
  return (
    <section id="activities" className="relative z-10 section-pad">
      <div className="max-container relative z-10">
        <SectionHeader label="Engagement" title="Activities & Engagement" sub="More than sessions — a full day of interactive experiences" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {ACTIVITIES.map((a, i) => (
            <ActivityCard 
              key={a.title} 
              activity={a} 
              index={i} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ activity, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  
  // Only mount the WebGL Canvas when the card is intersecting the viewport.
  // This completely prevents mobile WebGL context limits from being hit (max 2-3 at a time)
  // while ensuring perfect, native zero-lag scrolling!
  const isInView = useInView(ref, { margin: "200px" });

  return (
    <div
      ref={ref}
      className="t-card rounded-2xl p-5 sm:p-7 t-card-purple group flex flex-col items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`activity-card-${index}`}
    >
      <div 
        className="w-28 h-28 flex items-center justify-center mb-3 sm:mb-4 relative overflow-visible shrink-0"
        data-hovered={isHovered}
      >
        <CanvasErrorBoundary fallbackIcon={activity.icon}>
          {isInView ? (
            <Suspense fallback={<span className="text-5xl animate-pulse opacity-50">{activity.icon}</span>}>
              <Canvas
                camera={{ position: [0, 0, 4.2], fov: 45, near: 0.1, far: 100 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                className="pointer-events-none"
              >
                <ActivityModel index={index} />
              </Canvas>
            </Suspense>
          ) : (
            <span className="text-5xl opacity-50">{activity.icon}</span>
          )}
        </CanvasErrorBoundary>
      </div>
      <h3 className="text-[14px] sm:text-[15px] font-semibold t-text mb-2 group-hover:text-accent2-light transition-colors">
        {activity.title}
      </h3>
      <p className="text-[12px] sm:text-[13px] t-muted leading-relaxed">
        {activity.desc}
      </p>
    </div>
  );
}
