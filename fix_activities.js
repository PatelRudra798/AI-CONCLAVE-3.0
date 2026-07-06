const fs = require('fs');

const activitiesSectionContent = `import { useState, useRef } from 'react';
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

      {/* Single shared Canvas for all Activity models */}
      <Canvas
        eventSource={containerRef}
        className="pointer-events-none fixed inset-0 z-20"
        camera={{ position: [0, 0, 4.2], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
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

  // Expose hover state using a custom event or store if necessary.
  // Actually, for simplicity and performance, the R3F model can just use a slow constant rotation,
  // or we can attach hover state via DOM event listeners inside the R3F component.

  return (
    <div
      className="t-card rounded-2xl p-5 sm:p-7 t-card-purple group flex flex-col items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={\`activity-card-\${index}\`}
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
`;

fs.writeFileSync('src/components/ActivitiesSection.jsx', activitiesSectionContent);

const activityCanvasContent = `import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import useTheme from '../hooks/useTheme';

export function ActivityModel({ index }) {
  const { isDark } = useTheme();
  const mainObjectRef = useRef(null);

  const colors = useMemo(() => isDark
    ? {
      primary: 0x00e5ff,
      secondary: 0x6a0dad,
      light: 0xb07fff,
      emissiveIntensity1: 0.6,
      emissiveIntensity2: 0.7,
    }
    : {
      primary: 0xffffff,
      secondary: 0xcccccc,
      light: 0xffffff,
      emissiveIntensity1: 0.4,
      emissiveIntensity2: 0.5,
    }, [isDark]);

  const group = useMemo(() => {
    let mainObject;

    if (index === 0) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0.95);
      shape.lineTo(0.35, 0.1);
      shape.lineTo(0.1, 0.1);
      shape.lineTo(0.25, -0.85);
      shape.lineTo(-0.35, -0.1);
      shape.lineTo(-0.1, -0.1);
      shape.closePath();

      const extrudeSettings = {
        depth: 0.18,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center();
      const material = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.1,
        metalness: isDark ? 0.9 : 0.95,
      });

      mainObject = new THREE.Mesh(geometry, material);
    } else if (index === 1) {
      const group = new THREE.Group();
      const camShape = new THREE.Shape();
      const size = 0.6;
      const radius = 0.12;
      camShape.moveTo(-size/2 + radius, -size/2);
      camShape.lineTo(size/2 - radius, -size/2);
      camShape.quadraticCurveTo(size/2, -size/2, size/2, -size/2 + radius);
      camShape.lineTo(size/2, size/2 - radius);
      camShape.quadraticCurveTo(size/2, size/2, size/2 - radius, size/2);
      camShape.lineTo(-size/2 + radius, size/2);
      camShape.quadraticCurveTo(-size/2, size/2, -size/2, size/2 - radius);
      camShape.lineTo(-size/2, -size/2 + radius);
      camShape.quadraticCurveTo(-size/2, -size/2, -size/2 + radius, -size/2);
      camShape.closePath();

      const camGeom = new THREE.ExtrudeGeometry(camShape, { depth: 0.08, bevelEnabled: false });
      const camMat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.1,
        metalness: 0.85,
      });
      const camBody = new THREE.Mesh(camGeom, camMat);
      group.add(camBody);

      const lensGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 32);
      const lensMat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: 1.5,
        roughness: 0.05,
        metalness: 0.9,
      });
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.045);
      group.add(lens);

      const innerGeom = new THREE.SphereGeometry(0.07, 16, 16);
      const inner = new THREE.Mesh(innerGeom, lensMat);
      inner.position.set(0, 0, 0.05);
      group.add(inner);

      const flashGeom = new THREE.SphereGeometry(0.05, 12, 12);
      const flash = new THREE.Mesh(flashGeom, camMat);
      flash.position.set(0.18, 0.18, 0.04);
      group.add(flash);

      mainObject = group;
    } else if (index === 2) {
      const group = new THREE.Group();
      const globeGeom = new THREE.SphereGeometry(0.32, 16, 12);
      const globeMat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.6,
      });
      const globe = new THREE.Mesh(globeGeom, globeMat);
      group.add(globe);

      const ring1Geom = new THREE.TorusGeometry(0.44, 0.045, 12, 80);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.1,
        metalness: 0.9,
      });
      const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
      group.add(ring1);

      const ring2Geom = new THREE.TorusGeometry(0.44, 0.045, 12, 80);
      const ring2 = new THREE.Mesh(ring2Geom, ring1Mat);
      ring2.rotation.x = Math.PI / 2.5;
      group.add(ring2);

      mainObject = group;
    } else {
      const group = new THREE.Group();
      const bubble1 = new THREE.Group();
      const disk1Geom = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);
      disk1Geom.rotateX(Math.PI / 2);
      const mat1 = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.15,
        metalness: 0.6,
        transparent: true,
        opacity: 0.92,
      });
      const d1 = new THREE.Mesh(disk1Geom, mat1);
      bubble1.add(d1);

      const tail1Geom = new THREE.ConeGeometry(0.08, 0.2, 4);
      tail1Geom.rotateZ(Math.PI / 4);
      const t1 = new THREE.Mesh(tail1Geom, mat1);
      t1.position.set(-0.2, -0.25, 0);
      bubble1.add(t1);
      bubble1.position.set(-0.15, 0.15, 0.1);
      group.add(bubble1);

      const bubble2 = new THREE.Group();
      const disk2Geom = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 32);
      disk2Geom.rotateX(Math.PI / 2);
      const mat2 = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.2,
        metalness: 0.7,
        transparent: true,
        opacity: 0.88,
      });
      const d2 = new THREE.Mesh(disk2Geom, mat2);
      bubble2.add(d2);

      const tail2Geom = new THREE.ConeGeometry(0.06, 0.15, 4);
      tail2Geom.rotateZ(-Math.PI / 4);
      const t2 = new THREE.Mesh(tail2Geom, mat2);
      t2.position.set(0.12, -0.18, 0);
      bubble2.add(t2);
      bubble2.position.set(0.2, -0.15, -0.1);
      group.add(bubble2);

      mainObject = group;
    }

    if (index !== 0 && mainObject) {
      mainObject.scale.set(1.25, 1.25, 1.25);
    }

    mainObject.rotation.x = 0.3;
    mainObject.rotation.z = 0.15;

    return mainObject;
  }, [index, colors, isDark]);

  useFrame((state, delta) => {
    if (mainObjectRef.current) {
      // Access hover state from the DOM via data attribute
      const cardEl = document.getElementById(\`activity-card-\${index}\`);
      let isHovered = false;
      if (cardEl) {
        const tracker = cardEl.querySelector('[data-hovered]');
        if (tracker && tracker.getAttribute('data-hovered') === 'true') {
          isHovered = true;
        }
      }
      const speedMultiplier = isHovered ? 3.0 : 1.0;
      mainObjectRef.current.rotation.y += (0.015 * 60 * delta) * speedMultiplier;
    }
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.7 : 0.8} color={0xffffff} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.5 : 1.8} color={0xffffff} />
      <pointLight position={[-2, 2, 2]} intensity={3.0} distance={10} color={isDark ? colors.primary : 0xffffff} />
      
      <primitive ref={mainObjectRef} object={group} />
    </>
  );
}
`;

fs.writeFileSync('src/components/ActivityCanvas.jsx', activityCanvasContent);
