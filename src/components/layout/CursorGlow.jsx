import { useEffect, useRef } from 'react';

export default function CursorGlow() {
 const glowRef = useRef(null);

 useEffect(() => {
 const el = glowRef.current;
 if (!el) return;

 // Only show on non-touch devices
 if (window.matchMedia('(hover: none)').matches) {
 el.style.display = 'none';
 return;
 }

 let cx = -999, cy = -999;
 let rafId;

 const onMove = (e) => { cx = e.clientX; cy = e.clientY; };

 const tick = () => {
 el.style.transform = `translate(${cx - 190}px, ${cy - 190}px)`;
 rafId = requestAnimationFrame(tick);
 };

 window.addEventListener('pointermove', onMove, { passive: true });
 rafId = requestAnimationFrame(tick);

 return () => {
 window.removeEventListener('pointermove', onMove);
 cancelAnimationFrame(rafId);
 };
 }, []);

 return (
 <div
 ref={glowRef}
 className="pointer-events-none fixed top-0 left-0 z-[9999] w-[380px] h-[380px] rounded-full will-change-transform"
 style={{
 background: 'radial-gradient(circle, var(--glow) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
 transform: 'translate(-999px,-999px)',
 }}
 />
 );
}
