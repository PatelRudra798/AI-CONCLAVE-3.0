import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Read a CSS custom property as a THREE.Color hex number */
function cssVar(name, fallback) {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!v) return fallback;
  return parseInt(v.replace('#', '0x'), 16);
}

/**
 * TopicIcon3D
 * Renders a tiny Three.js canvas whose 3D shape matches the topic emoji:
 *   robot_head    → 🤖  (box head + eyes + antenna)
 *   lightning     → ⚡  (extruded bolt)
 *   cloud         → ☁️  (sphere cluster)
 *   satellite     → 🛰️  (body + solar wings + dish)
 *   film          → 🎬  (film reel)
 *   medical_cross → 🏥  (+ cross + center orb)
 */
export default function TopicIcon3D({ shape = 'robot_head' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const SIZE = el.clientWidth || 48;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.set(0, 0, 3.6);

    const accent  = cssVar('--accent',        0x00e5ff);
    const accent2 = cssVar('--accent2',       0x6a0dad);
    const accentL = cssVar('--accent2-light', 0xb07fff);

    // ── material helpers ───────────────────────────────────────────────────
    const wire  = (c, op = 0.85) =>
      new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: op });
    const solid = (c, op = 0.80) =>
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op });
    const std   = (c, em, emI = 0.45) =>
      new THREE.MeshStandardMaterial({ color: c, emissive: em, emissiveIntensity: emI, transparent: true, opacity: 0.95 });

    const group = new THREE.Group();
    scene.add(group);

    // Spin params (overridden per shape)
    let speedY = 0.013;
    let wobble = 0.28; // amplitude of x-tilt sway

    // ═══════════════════════════════════════════════════════════════════════
    // 🤖  ROBOT HEAD
    // ═══════════════════════════════════════════════════════════════════════
    if (shape === 'robot_head') {
      // Head box
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.88, 0.72), wire(accent, 0.82));
      group.add(head);

      // Solid face panel (slightly inset)
      const face = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.70, 0.05), solid(accent2, 0.22));
      face.position.z = 0.385;
      group.add(face);

      // Eyes
      [-0.26, 0.26].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), std(accent, accent, 0.9));
        eye.position.set(x, 0.10, 0.395);
        group.add(eye);

        // Eye ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 6, 20), solid(accentL, 0.6));
        ring.position.set(x, 0.10, 0.375);
        group.add(ring);
      });

      // Mouth grille (3 bars)
      for (let i = -1; i <= 1; i++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.04), solid(accentL, 0.65));
        bar.position.set(0, -0.20 + i * 0.075, 0.395);
        group.add(bar);
      }

      // Antenna stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.32, 7), solid(accentL, 0.80));
      stem.position.set(0, 0.60, 0);
      group.add(stem);

      // Antenna orb
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.10, 10, 10), std(accent, accent, 1.0));
      orb.position.set(0, 0.81, 0);
      group.add(orb);

      // Ear nubs
      [-0.56, 0.56].forEach(x => {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.18), solid(accent2, 0.70));
        ear.position.set(x, 0, 0);
        group.add(ear);
      });

      speedY  = 0.014;
      wobble  = 0.22;

    // ═══════════════════════════════════════════════════════════════════════
    // ⚡  LIGHTNING BOLT (ExtrudeGeometry)
    // ═══════════════════════════════════════════════════════════════════════
    } else if (shape === 'lightning') {
      const boltShape = new THREE.Shape();
      boltShape.moveTo( 0.18,  1.05);
      boltShape.lineTo(-0.10,  0.12);
      boltShape.lineTo( 0.14,  0.12);
      boltShape.lineTo(-0.18, -1.05);
      boltShape.lineTo( 0.10, -0.12);
      boltShape.lineTo(-0.14, -0.12);
      boltShape.closePath();

      const extCfg = {
        depth: 0.28,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize:      0.05,
        bevelSegments:  3,
      };

      const boltGeo = new THREE.ExtrudeGeometry(boltShape, extCfg);
      boltGeo.center();

      // Solid bolt
      const bolt = new THREE.Mesh(boltGeo, std(accent, accent, 0.55));
      bolt.scale.setScalar(0.82);
      group.add(bolt);

      // Wireframe overlay
      const boltW = new THREE.Mesh(boltGeo, wire(accentL, 0.55));
      boltW.scale.setScalar(0.84);
      group.add(boltW);

      // Outer glow ring
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.022, 6, 48), solid(accent2, 0.50));
      halo.rotation.x = Math.PI / 2;
      group.add(halo);

      speedY = 0.018;
      wobble = 0.30;

    // ═══════════════════════════════════════════════════════════════════════
    // ☁️  CLOUD  (sphere cluster)
    // ═══════════════════════════════════════════════════════════════════════
    } else if (shape === 'cloud') {
      const blobs = [
        { x:  0.00, y:  0.12, r: 0.50 },
        { x: -0.40, y: -0.05, r: 0.36 },
        { x:  0.40, y: -0.05, r: 0.36 },
        { x: -0.20, y:  0.28, r: 0.32 },
        { x:  0.20, y:  0.28, r: 0.30 },
        { x:  0.00, y: -0.28, r: 0.24 }, // flat bottom
      ];

      blobs.forEach(({ x, y, r }, i) => {
        const geo = new THREE.SphereGeometry(r, 11, 11);
        const s = new THREE.Mesh(geo, i === 0 ? wire(accent, 0.72) : solid(accent2, 0.28));
        s.position.set(x, y, 0);
        group.add(s);
      });

      // Thin wireframe outline over whole cluster
      const outline = new THREE.Mesh(new THREE.SphereGeometry(0.72, 7, 7), wire(accentL, 0.28));
      outline.position.set(0, 0.12, 0);
      group.add(outline);

      speedY = 0.009;
      wobble = 0.20;

    // ═══════════════════════════════════════════════════════════════════════
    // 🛰️  SATELLITE  (body + solar panels + dish)
    // ═══════════════════════════════════════════════════════════════════════
    } else if (shape === 'satellite') {
      group.scale.setScalar(1.35); // increase size a bit more
      // Central body box
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), wire(accent, 0.88));
      group.add(body);
      const bodyFill = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), solid(accent2, 0.18));
      group.add(bodyFill);

      // Solar wings  (left & right flat panels)
      [-1, 1].forEach(side => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.26, 0.035), solid(accent2, 0.72));
        panel.position.set(side * 0.56, 0.03, 0);
        group.add(panel);

        const panelW = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.26, 0.037), wire(accentL, 0.70));
        panelW.position.set(side * 0.56, 0.03, 0);
        group.add(panelW);

        // Grid lines on the panel (3 vertical dividers)
        for (let k = -1; k <= 1; k++) {
          const div = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.26, 0.04), solid(accentL, 0.55));
          div.position.set(side * 0.56 + k * 0.18, 0.03, 0);
          group.add(div);
        }
      });

      // Dish base (small cylinder stem)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.22, 6), solid(accentL, 0.80));
      stem.position.set(0.10, 0.35, 0.10);
      stem.rotation.z = -Math.PI / 6;
      group.add(stem);

      // Dish circle
      const dish = new THREE.Mesh(new THREE.CircleGeometry(0.18, 14), solid(accent, 0.85));
      dish.position.set(0.22, 0.50, 0.12);
      dish.rotation.x = -Math.PI / 5;
      dish.rotation.z =  Math.PI / 8;
      group.add(dish);

      const dishRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 7, 22), wire(accent, 0.90));
      dishRing.position.copy(dish.position);
      dishRing.rotation.copy(dish.rotation);
      group.add(dishRing);

      speedY = 0.012;
      wobble = 0.25;

    // ═══════════════════════════════════════════════════════════════════════
    // 🎬  FILM REEL
    // ═══════════════════════════════════════════════════════════════════════
    } else if (shape === 'film') {
      // Outer ring
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.13, 10, 36), wire(accent, 0.82));
      group.add(outerRing);

      // Reel face (thin disc)
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.06, 36), solid(accent2, 0.18));
      face.rotation.x = Math.PI / 2;
      group.add(face);

      // Central hub cylinder
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.18, 10), solid(accent2, 0.80));
      hub.rotation.x = Math.PI / 2;
      group.add(hub);

      const hubW = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.20, 10), wire(accentL, 0.70));
      hubW.rotation.x = Math.PI / 2;
      group.add(hubW);

      // 6 spokes
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.54, 5), solid(accentL, 0.68));
        spoke.rotation.z = angle;          // orient spoke radially
        group.add(spoke);
      }

      // 8 sprocket holes around the outer ring
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const hole  = new THREE.Mesh(new THREE.CircleGeometry(0.055, 7), solid(accentL, 0.72));
        hole.position.set(Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, 0.075);
        group.add(hole);
      }

      speedY = 0.020;
      wobble = 0.18;

    // ═══════════════════════════════════════════════════════════════════════
    // 🏥  MEDICAL CROSS  (Robotics in Healthcare)
    // ═══════════════════════════════════════════════════════════════════════
    } else if (shape === 'medical_cross') {
      // Vertical arm
      const vArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.10, 0.22), wire(accent, 0.86));
      group.add(vArm);
      const vFill = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.06, 0.18), solid(accent2, 0.20));
      group.add(vFill);

      // Horizontal arm
      const hArm = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.28, 0.22), wire(accent, 0.86));
      group.add(hArm);
      const hFill = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.24, 0.18), solid(accent2, 0.20));
      group.add(hFill);

      // Center glowing orb
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), std(accent, accent, 1.0));
      group.add(orb);

      // Outer pulse ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.80, 0.022, 7, 48), solid(accentL, 0.45));
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // Corner dots (4 small spheres at arm tips)
      [[0, 0.55], [0, -0.55], [0.55, 0], [-0.55, 0]].forEach(([x, y]) => {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), solid(accentL, 0.80));
        dot.position.set(x, y, 0.12);
        group.add(dot);
      });

      speedY = 0.012;
      wobble = 0.24;
    }

    // ── Lights ────────────────────────────────────────────────────────────
    const l1  = new THREE.PointLight(accent,  6, 12);
    const l2  = new THREE.PointLight(accent2, 4, 12);
    const amb = new THREE.AmbientLight(0xffffff, 0.50);
    l1.position.set(2, 2, 2);
    l2.position.set(-2, -1, 1);
    scene.add(l1, l2, amb);

    // ── Animation ─────────────────────────────────────────────────────────
    let frame = 0;
    let rafId;

    const animate = () => {
      frame++;
      const t = frame * 0.012;
      group.rotation.y += speedY;
      group.rotation.x  = Math.sin(t * 0.38) * wobble;
      l1.position.x = Math.sin(t * 0.5) * 2.2;
      l1.position.y = Math.cos(t * 0.4) * 2.2;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [shape]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minWidth: 44, minHeight: 44 }}
    />
  );
}
