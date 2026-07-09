import SectionHeader from '../ui/SectionHeader';
import TopicIcon3D from '../three/TopicIcon3D';
import { TOPICS } from '../../data';

export default function TopicsSection() {
 return (
 <section id="topics" className="relative z-10 section-pad">
 <div className="max-container">
 <SectionHeader label="Focus Areas" title="Topics at AI Conclave 3.0" sub="Four cutting-edge domains shaping tomorrow's technology landscape" />
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
 {TOPICS.map((t) => (
 <div key={t.title} className="t-card rounded-2xl p-5 sm:p-6 group cursor-default">
 <div
 className="w-11 h-11 sm:w-12 sm:h-12 rounded-[13px] flex items-center justify-center mb-4 flex-shrink-0 overflow-hidden"
 style={{ background: t.color }}
 >
 <TopicIcon3D shape={t.shape} />
 </div>
 <h3 className="text-[14px] sm:text-[15px] font-semibold t-text mb-2 group-hover:text-accent transition-colors duration-200">{t.title}</h3>
 <p className="text-[12px] sm:text-[13px] t-muted leading-relaxed">{t.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
}
