import { useRef, useEffect } from 'react';

/**
 * Returns a ref whose .current = { x, y } in NDC [-1,1].
 * Uses a ref (not state) so updates are instant with zero re-render lag.
 */
export default function useMouse() {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      ref.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    // { passive: true } = no lag, no jank
    window.addEventListener('pointermove', handler, { passive: true });
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  return ref;
}
