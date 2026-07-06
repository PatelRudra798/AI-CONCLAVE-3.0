import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';
import SectionHeader from './SectionHeader';
import { ACTIVITIES } from '../data';
import { ActivityModel } from './ActivityCanvas';

export default function ActivitiesSection() {
  const containerRef = useRef(null);
  
  // Create refs for tracking DOM elements
  const viewRefs = useRef([]);
  if (viewRefs.current.length !== ACTIVITIES.length) {
    viewRefs.current = Array(ACTIVITIES.length).fill().map((_, i) => viewRefs.current[i] || { current: null });
  }

  return (
    <section id="activities" ref={containerRef} className="relative z-10 section-pad">
      <div className="max-container">
        <SectionHeader label="Engagement" title="Activities & Engagement" sub="More than sessions — a full day of interactive experiences" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {ACTIVITIES.map((a, i) => (
            <ActivityCard 
              key={a.title} 
              activity={a} 
              index={i} 
              viewRef={viewRefs.current[i]}
            />
          ))}
        </div>
      </div>

      {/* Single shared Canvas for all Activity models to fix WebGL context limits on mobile */}
      <Canvas
        eventSource={containerRef}
        className="pointer-events-none fixed inset-0 z-20"
        camera={{ position: [0, 0, 4.2], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {ACTIVITIES.map((_, i) => (
          <View key={i} track={viewRefs.current[i]}>
            <ActivityModel index={i} />
          </View>
        ))}
        <Preload all />
      </Canvas>
    </section>
  );
}

function ActivityCard({ activity, index, viewRef }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="t-card rounded-2xl p-5 sm:p-7 t-card-purple group flex flex-col items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`activity-card-${index}`}
    >
      {/* Tracker div for the 3D View */}
      <div 
        ref={viewRef} 
        className="w-16 h-16 flex items-center justify-center mb-3 sm:mb-4 relative overflow-visible"
        data-hovered={isHovered}
      />
      <h3 className="text-[14px] sm:text-[15px] font-semibold t-text mb-2 group-hover:text-accent2-light transition-colors">
        {activity.title}
      </h3>
      <p className="text-[12px] sm:text-[13px] t-muted leading-relaxed">
        {activity.desc}
      </p>
    </div>
  );
}
