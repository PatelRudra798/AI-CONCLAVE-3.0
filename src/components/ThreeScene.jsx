import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Reads a CSS custom property and returns it as a THREE.Color hex number */
function cssVarToHex(varName, fallback) {
  if (typeof document === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!val) return fallback;
  // val is typically a hex like "#39FF8F"
  return parseInt(val.replace('#', '0x'), 16);
}

export default function ThreeScene({ mouseRef }) {
  const mountRef = useRef(null);
  const materialsRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(56, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // Read live theme colors (cyan/purple in dark, green in light)
    const accentHex   = cssVarToHex('--accent', 0x00e5ff);
    const accent2Hex  = cssVarToHex('--accent2', 0x6a0dad);
    const accent2LHex = cssVarToHex('--accent2-light', 0xb07fff);

    // Outer wireframe
    const icoMat = new THREE.MeshBasicMaterial({ color: accentHex, wireframe: true, transparent: true, opacity: 0.3 });
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), icoMat);
    scene.add(ico);

    // Inner wireframe
    const innerMat = new THREE.MeshBasicMaterial({ color: accent2Hex, wireframe: true, transparent: true, opacity: 0.5 });
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.82, 1), innerMat);
    scene.add(inner);

    // Rings
    const ringDefs = [
      { r: 1.75, tube: 0.007, color: accentHex,   rx: Math.PI / 3,  ry: 0 },
      { r: 1.95, tube: 0.006, color: accent2Hex,  rx: Math.PI / 6,  ry: Math.PI / 4 },
      { r: 2.15, tube: 0.005, color: accent2LHex, rx: Math.PI / 2,  ry: Math.PI / 3 },
    ];
    const ringMats = [];
    const rings = ringDefs.map(({ r, tube, color, rx, ry }) => {
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 });
      ringMats.push(mat);
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 120), mat);
      m.rotation.x = rx; m.rotation.y = ry;
      scene.add(m); return m;
    });

    // Particle cloud — two-tone using theme accent colors
    const N = 240;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const cA = new THREE.Color(accentHex);
    const cB = new THREE.Color(accent2Hex);
    for (let i = 0; i < N; i++) {
      const r   = 2.5 + Math.random() * 1.5;
      const th  = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(phi) * Math.cos(th);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(th);
      pos[i*3+2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? cA : cB;
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.032, vertexColors: true, transparent: true, opacity: 0.85 }));
    scene.add(pts);

    // Lights
    const l1 = new THREE.PointLight(accentHex, 3, 10);
    const l2 = new THREE.PointLight(accent2Hex, 2.5, 10);
    l1.position.set(2, 2, 2); l2.position.set(-2, -2, 2);
    scene.add(l1, l2);

    materialsRef.current = { icoMat, innerMat, ringMats, l1, l2 };

    let frame = 0;
    const smooth = { x: 0, y: 0 };
    let rafId;

    const animate = () => {
      frame++;
      const t = frame * 0.008;

      const { x: mx, y: my } = mouseRef.current;
      smooth.x += (mx - smooth.x) * 0.08;
      smooth.y += (my - smooth.y) * 0.08;

      ico.rotation.y   = t * 0.38 + smooth.x * 0.9;
      ico.rotation.x   = t * 0.18 + smooth.y * 0.9;
      inner.rotation.y = -t * 0.5  + smooth.x * 0.7;
      inner.rotation.x =  t * 0.28 - smooth.y * 0.6;
      pts.rotation.y   = t * 0.055 + smooth.x * 0.3;
      pts.rotation.x   = t * 0.028 + smooth.y * 0.3;

      rings[0].rotation.z = t * 0.28;
      rings[0].rotation.y = t * 0.09 + smooth.x * 0.45;
      rings[1].rotation.z = -t * 0.19;
      rings[1].rotation.x = Math.PI / 6 + smooth.y * 0.38;
      rings[2].rotation.y = t * 0.23;
      rings[2].rotation.z = smooth.x * 0.28;

      l1.position.x =  Math.sin(t * 0.5)  * 2.6;
      l1.position.y =  Math.cos(t * 0.42) * 2.6;
      l2.position.x = -Math.sin(t * 0.38) * 2.6;
      l2.position.y = -Math.cos(t * 0.5)  * 2.6;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Watch for theme class changes on <html> and re-color materials live
    const observer = new MutationObserver(() => {
      const a  = cssVarToHex('--accent', accentHex);
      const a2 = cssVarToHex('--accent2', accent2Hex);
      const a2l= cssVarToHex('--accent2-light', accent2LHex);
      icoMat.color.setHex(a);
      innerMat.color.setHex(a2);
      ringMats[0].color.setHex(a);
      ringMats[1].color.setHex(a2);
      ringMats[2].color.setHex(a2l);
      l1.color.setHex(a);
      l2.color.setHex(a2);
      // Recolor particle vertex colors
      const cA2 = new THREE.Color(a);
      const cB2 = new THREE.Color(a2);
      const colorsAttr = pGeo.attributes.color;
      for (let i = 0; i < N; i++) {
        const useA = colorsAttr.array[i*3+1] > 0.6; // heuristic: was bright before
        const c = useA ? cA2 : cB2;
        colorsAttr.array[i*3] = c.r;
        colorsAttr.array[i*3+1] = c.g;
        colorsAttr.array[i*3+2] = c.b;
      }
      colorsAttr.needsUpdate = true;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [mouseRef]);

  return <div ref={mountRef} className="w-full h-full rounded-2xl" />;
}
