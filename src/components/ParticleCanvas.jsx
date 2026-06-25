import { useEffect, useRef } from 'react';

export default function ParticleCanvas({ isDark }) {
  const ref       = useRef(null);
  const isDarkRef = useRef(isDark);

  // Keep ref in sync without restarting animation loop
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    let W, H, rafId;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const nodes = Array.from({ length: 70 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  Math.random() * 1.6 + 0.6,
      type: Math.random() > 0.5 ? 'a' : 'b',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Read live theme colors from CSS custom properties each frame's first
      // pixel read is cheap; cache once per draw call instead of per-particle.
      const rootStyle = getComputedStyle(document.documentElement);
      const c1 = rootStyle.getPropertyValue('--particle-c1').trim() || '0,229,255';
      const c2 = rootStyle.getPropertyValue('--particle-c2').trim() || '106,13,173';
      const dark = isDarkRef.current;

      const dotA = `rgba(${c1},0.9)`;
      const dotB = `rgba(${c2},0.9)`;
      const lineMaxA = dark ? 0.14 : 0.22;

      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.type === 'a' ? dotA : dotB;
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < 130) {
            const a = (1 - d / 130) * lineMaxA;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${c1},${a})`;
            ctx.lineWidth = dark ? 0.5 : 0.8;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []); // only once — isDark changes handled via ref + live CSS var reads

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: isDark ? 0.55 : 0.75 }}
    />
  );
}
