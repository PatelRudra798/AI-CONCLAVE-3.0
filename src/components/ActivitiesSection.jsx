import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { ACTIVITIES } from '../data';
import { ActivityCanvas } from './ActivityCanvas';

export default function ActivitiesSection() {
  return (
    <section id="activities" className="relative z-10 section-pad">
      <div className="max-container">
        <SectionHeader label="Engagement" title="Activities & Engagement" sub="More than sessions — a full day of interactive experiences" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ACTIVITIES.map((a, i) => (
            <ActivityCard key={a.title} activity={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ activity, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="t-card rounded-2xl p-5 sm:p-7 t-card-purple group flex flex-col items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ActivityCanvas index={index} isHovered={isHovered} />
      <h3 className="text-[14px] sm:text-[15px] font-semibold t-text mb-2 group-hover:text-accent2-light transition-colors">
        {activity.title}
      </h3>
      <p className="text-[12px] sm:text-[13px] t-muted leading-relaxed">
        {activity.desc}
      </p>
    </div>
  );
}
