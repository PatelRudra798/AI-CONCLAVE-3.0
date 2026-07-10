import SectionHeader from '../ui/SectionHeader';
import { SPEAKERS } from '../../data';

export default function SpeakersSection() {
    return (
        <section id="speakers" className="relative z-10 section-pad overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.06)' }}>

            {/* Bg glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, var(--glow), transparent)' }} />

            <div className="max-container relative">
                <SectionHeader
                    label="Distinguished Experts"
                    title="Meet Our Speakers"
                    sub="Learn directly from thought leaders across industry and academia"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
                    {SPEAKERS.map((s, i) => (
                        <div key={i} className="bg-[#0b1221] border border-white/5 rounded-[24px] p-6 flex flex-col items-center relative overflow-hidden group transition-all duration-500 hover:border-white/5 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] h-[370px]">
                            
                            {/* Hover Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Initials / Image */}
                            <div className="mt-8 mb-6 transform group-hover:-translate-y-6 group-hover:scale-90 transition-all duration-500 z-20 relative">
                                <div className="w-[100px] h-[100px] rounded-full bg-white/[0.02] flex items-center justify-center border border-white/[0.04] overflow-hidden">
                                    {s.img ? (
                                        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-[34px] text-white tracking-widest">{s.initials}</span>
                                    )}
                                </div>
                            </div>

                            {/* Default State Container */}
                            <div className="absolute inset-x-6 top-[175px] bottom-8 flex flex-col items-center transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:translate-y-8 pointer-events-auto group-hover:pointer-events-none z-10">
                                <h3 className="text-[18px] font-bold text-white mb-2 text-center">{s.name}</h3>
                                <p className="text-[13px] font-medium text-white/80 text-center mb-1">{s.role}</p>
                                {s.org && <p className="text-[12px] text-white/40 text-center mb-auto">{s.org}</p>}

                                <div className="w-full mt-auto border border-white/10 rounded-full px-4 py-3 flex items-center justify-center bg-white/[0.02]">
                                    <span className="text-[11px] text-white/40 italic text-center line-clamp-1">"{s.topic}"</span>
                                </div>
                            </div>

                            {/* Hover State Container */}
                            <div className="absolute inset-x-6 top-[145px] bottom-8 flex flex-col items-center transition-all duration-500 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-10">
                                
                                {/* Tags */}
                                <div className="flex flex-nowrap justify-center gap-1.5 mb-5 w-full">
                                    {s.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-white/[0.03] border border-white/20 rounded-full text-[9px] font-semibold text-white/90 whitespace-nowrap">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Bio */}
                                <p className="text-[13px] text-white/60 text-center leading-relaxed mb-auto line-clamp-5 px-1">
                                    {s.bio}
                                </p>

                                {/* Connect Button */}
                                <a href={s.linkedin} target="_blank" rel="noreferrer" className="w-full mt-auto py-3 bg-[#111827] hover:bg-white/10 border border-white/5 rounded-xl text-white/60 hover:text-white text-[12px] font-semibold transition-colors flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    Connect on LinkedIn
                                </a>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[13px] text-white/30 font-medium tracking-wide">
                        Full speaker lineup will be announced soon — stay tuned!
                    </p>
                </div>

            </div>
        </section>
    );
}
