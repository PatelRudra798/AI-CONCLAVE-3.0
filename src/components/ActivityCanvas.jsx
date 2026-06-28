import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useTheme from '../hooks/useTheme';

export function ActivityCanvas({ index, isHovered }) {
  const mountRef = useRef(null);
  const isHoveredRef = useRef(isHovered);
  const animationFrameRef = useRef(null);
  const mainObjectRef = useRef(null);

  const { isDark } = useTheme();

  // Sync hover state ref
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const width = 80;
    const height = 80;

    // Define colors dynamically:
    // Dark Mode -> Cyber Cyan/Purple
    // Light Mode (White Theme) -> Minimalist White/Chrome
    const colors = isDark
      ? {
        primary: 0x00e5ff, // Cyan
        secondary: 0x6a0dad, // Purple
        light: 0xb07fff, // Light Purple
        emissiveIntensity1: 0.6,
        emissiveIntensity2: 0.7,
      }
      : {
        primary: 0xffffff, // White
        secondary: 0xcccccc, // Silver / Chrome
        light: 0xffffff, // White
        emissiveIntensity1: 0.4,
        emissiveIntensity2: 0.5,
      };

    // Create scene, camera, renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const container = mountRef.current;
    if (container) {
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.5 : 1.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLightColor = isDark ? colors.primary : 0xffffff;
    const pointLight = new THREE.PointLight(pointLightColor, 3.0, 10);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    let mainObject;

    if (index === 0) {
      // 1. Rapid Fire - Cyber Lightning Bolt
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
      // 2. Social Media — 3D Instagram‑like camera icon (single primary color)
      const group = new THREE.Group();

      // Camera body – rounded square extruded
      const camShape = new THREE.Shape();
      const size = 0.6; // overall size
      const radius = 0.12; // corner radius
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

      const camExtrudeSettings = { depth: 0.08, bevelEnabled: false };
      const camGeom = new THREE.ExtrudeGeometry(camShape, camExtrudeSettings);
      const camMat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.1,
        metalness: 0.85,
      });
      const camBody = new THREE.Mesh(camGeom, camMat);
      group.add(camBody);

      // Lens – thin cylinder
      const lensGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 32);
      const lensMat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: 1.5,
        roughness: 0.05,
        metalness: 0.9,
      });
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.rotation.x = Math.PI / 2; // face forward
      lens.position.set(0, 0, 0.045);
      group.add(lens);

      // Inner circle – small sphere at the centre of the lens
      const innerGeom = new THREE.SphereGeometry(0.07, 16, 16);
      const innerMat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: 1.2,
        roughness: 0.05,
        metalness: 0.9,
      });
      const inner = new THREE.Mesh(innerGeom, innerMat);
      inner.position.set(0, 0, 0.05);
      group.add(inner);

      // Flash dot – small sphere at top‑right corner
      const flashGeom = new THREE.SphereGeometry(0.05, 12, 12);
      const flash = new THREE.Mesh(flashGeom, camMat);
      flash.position.set(0.18, 0.18, 0.04);
      group.add(flash);

      mainObject = group;
    } else if (index === 2) {
      // 3. Networking — Globe with orbit rings (theme-colored)
      const group = new THREE.Group();

      // Globe sphere (wireframe, primary)
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

      // Equatorial ring (secondary)
      const ring1Geom = new THREE.TorusGeometry(0.44, 0.045, 12, 80);
      // Use primary color for equatorial ring to avoid mixing secondary
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.1,
        metalness: 0.9,
      });
      const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
      group.add(ring1);

      // Tilted orbit ring (primary)
      const ring2Geom = new THREE.TorusGeometry(0.44, 0.045, 12, 80);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: colors.emissiveIntensity1,
        roughness: 0.1,
        metalness: 0.9,
      });
      const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
      ring2.rotation.x = Math.PI / 2.5;
      group.add(ring2);

      mainObject = group;
    } else {
      // 4. Panel Discussion — Chat Bubbles (theme-colored)
      const group = new THREE.Group();

      // Bubble 1 (Large — primary)
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

      // Bubble 2 (Small — secondary)
      const bubble2 = new THREE.Group();
      const disk2Geom = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 32);
      disk2Geom.rotateX(Math.PI / 2);
      // Use primary color for small bubble to keep single color per model
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

    // Scale up other models (except Rapid Fire lightning at index 0)
    if (index !== 0 && mainObject) {
      mainObject.scale.set(1.25, 1.25, 1.25);
    }

    // Add to scene
    mainObjectRef.current = mainObject;
    scene.add(mainObject);

    // Initial slight tilts
    mainObject.rotation.x = 0.3;
    mainObject.rotation.z = 0.15;

    // Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (mainObjectRef.current) {
        const speedMultiplier = isHoveredRef.current ? 3.0 : 1.0;
        const targetSpeed = 0.015 * speedMultiplier;
        mainObjectRef.current.rotation.y += targetSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up WebGL resources
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [index, isDark]);

  return (
    <div
      ref={mountRef}
      className="w-16 h-16 flex items-center justify-center mb-3 sm:mb-4 relative overflow-visible pointer-events-none"
    />
  );
}
