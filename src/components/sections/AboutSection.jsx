import { useState, useEffect } from 'react';
import ThreeScene from '../three/ThreeScene';

export default function AboutSection({ mouseRef }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const paras = [
        'Every edition of AI Conclave has contributed to a journey defined by innovation, curiosity and the pursuit of knowledge. Over the years, it has evolved into a platform that celebrates ideas, connects disciplines and showcases the transformative potential of Artificial Intelligence.',
        'AI Conclave 3.0 continues this legacy through expert sessions, thought provoking discussions and immersive workshops that will bridge emerging concepts with practical application.',
        'As AI Conclave evolves, it remains committed to inspiring innovation, fostering collaboration and advancing the conversation around Artificial Intelligence.',
    ];

    return (
        <section id="about" className="relative z-10 section-pad">
            <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

                {/* Text */}
                <div>
                    <span className="text-[11px] text-accent font-semibold uppercase tracking-[3px] block mb-3">About the Event</span>
                    <h2 className="font-sora font-bold t-text leading-tight mb-4 sm:mb-6" style={{ fontSize: 'clamp(24px,3.5vw,40px)' }}>
                        Building on a<br />Remarkable Legacy
                    </h2>
                    {paras.map((p, i) => (
                        <p key={i} className="text-[13px] sm:text-[14px] t-muted leading-[1.85] mb-3 sm:mb-4">{p}</p>
                    ))}
                </div>

                {/* 3D canvas normal grid item on large screens. Disabled on mobile for performance/visibility. */}
                {!isMobile && (
                    <div className="hidden lg:flex lg:static lg:opacity-100 lg:z-auto lg:h-[420px] lg:pointer-events-auto lg:overflow-visible">
                        <ThreeScene mouseRef={mouseRef} />
                    </div>
                )}

            </div>
        </section>
    );
}
