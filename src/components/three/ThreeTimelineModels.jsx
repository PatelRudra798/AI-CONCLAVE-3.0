import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Common premium glass material
const GlassMaterial = ({ color = '#39ff8f', emissive = '#000000', emissiveIntensity = 0.5 }) => (
 <meshPhysicalMaterial
 color={color}
 emissive={emissive}
 emissiveIntensity={emissiveIntensity}
 roughness={0.1}
 metalness={0.9}
 clearcoat={1}
 clearcoatRoughness={0.1}
 transmission={0.6}
 thickness={1.5}
 ior={1.5}
 />
);

// Common emissive neon material
const NeonMaterial = ({ color = '#39ff8f' }) => (
 <meshStandardMaterial
 color={color}
 emissive={color}
 emissiveIntensity={2.5}
 toneMapped={false}
 />
);

// 1. QR Scanner / Kiosk (Registration)
export function QRScanner() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
 });

 return (
 <group ref={ref}>
 {/* Kiosk Body */}
 <mesh position={[0, -0.4, 0]}>
 <boxGeometry args={[0.4, 0.8, 0.3]} />
 <GlassMaterial color="#1a1a2e" emissive="#8a2be2" emissiveIntensity={0.2} />
 </mesh>
 {/* Scanner Head */}
 <mesh position={[0, 0.2, 0]} rotation={[0.2, 0, 0]}>
 <boxGeometry args={[0.5, 0.3, 0.4]} />
 <GlassMaterial color="#8a2be2" />
 </mesh>
 {/* Scanner Laser (Glowing green ring) */}
 <mesh position={[0, 0.2, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
 <torusGeometry args={[0.15, 0.02, 8, 24]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 </group>
 );
}

// 2. Connected Network Nodes (Networking)
export function NetworkNodes() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.4;
 ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
 });

 return (
 <group ref={ref}>
 {/* Center Node */}
 <mesh position={[0, 0, 0]}>
 <sphereGeometry args={[0.22, 16, 16]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 {/* Outer Node 1 */}
 <mesh position={[0.5, 0.3, 0]}>
 <sphereGeometry args={[0.12, 16, 16]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Outer Node 2 */}
 <mesh position={[-0.4, -0.3, 0.3]}>
 <sphereGeometry args={[0.12, 16, 16]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Outer Node 3 */}
 <mesh position={[0.2, -0.4, -0.4]}>
 <sphereGeometry args={[0.12, 16, 16]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Connections (Cylinders) */}
 <mesh position={[0.25, 0.15, 0]} rotation={[0, 0, -Math.PI / 6]}>
 <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 <mesh position={[-0.2, -0.15, 0.15]} rotation={[0.4, 0.3, Math.PI / 4]}>
 <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 <mesh position={[0.1, -0.2, -0.2]} rotation={[-0.4, 0.2, -Math.PI / 5]}>
 <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 </group>
 );
}

// 3. Stage Podium (Inauguration)
export function StagePodium() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
 });

 return (
 <group ref={ref} position={[0, -0.1, 0]}>
 {/* Base */}
 <mesh position={[0, -0.5, 0]}>
 <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
 <GlassMaterial color="#1a1a2e" emissive="#8a2be2" />
 </mesh>
 {/* Pillar */}
 <mesh position={[0, -0.1, 0]}>
 <cylinderGeometry args={[0.1, 0.15, 0.7, 16]} />
 <GlassMaterial color="#8a2be2" />
 </mesh>
 {/* Table Top */}
 <mesh position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
 <boxGeometry args={[0.5, 0.06, 0.4]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Glowing Mic */}
 <mesh position={[0, 0.45, -0.05]} rotation={[0.3, 0, 0]}>
 <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 </group>
 );
}

// 4. AI Brain / Neural Net (Technical Sessions)
export function AIBrain() {
 const ref = useRef();
 const innerRef = useRef();

 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
 ref.current.rotation.x = state.clock.getElapsedTime() * 0.2;
 // Pulsing inner sphere
 innerRef.current.scale.setScalar(
 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.15
 );
 });

 return (
 <group ref={ref}>
 {/* Outer Wireframe Neural Network */}
 <mesh>
 <icosahedronGeometry args={[0.55, 1]} />
 <meshStandardMaterial
 color="#39ff8f"
 wireframe
 emissive="#39ff8f"
 emissiveIntensity={1.5}
 />
 </mesh>
 {/* Inner Glowing Core */}
 <mesh ref={innerRef}>
 <dodecahedronGeometry args={[0.25, 0]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 </group>
 );
}

// 5. Laptop + AI Chip (Workshops)
export function WorkshopLaptop() {
 const ref = useRef();
 const chipRef = useRef();

 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.4;
 // Chip floating above screen
 chipRef.current.position.y = 0.35 + Math.sin(state.clock.getElapsedTime() * 3) * 0.08;
 chipRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
 });

 return (
 <group ref={ref} position={[0, -0.15, 0]}>
 {/* Laptop Base */}
 <mesh position={[0, 0, 0]}>
 <boxGeometry args={[0.7, 0.04, 0.5]} />
 <GlassMaterial color="#1a1a2e" emissive="#8a2be2" />
 </mesh>
 {/* Laptop Screen */}
 <mesh position={[0, 0.22, -0.22]} rotation={[0.4, 0, 0]}>
 <boxGeometry args={[0.7, 0.45, 0.03]} />
 <GlassMaterial color="#8a2be2" />
 </mesh>
 {/* Glowing Screen Matrix/Laser */}
 <mesh position={[0, 0.22, -0.2]} rotation={[0.4, 0, 0]}>
 <planeGeometry args={[0.6, 0.38]} />
 <meshStandardMaterial
 color="#39ff8f"
 emissive="#39ff8f"
 emissiveIntensity={0.8}
 transparent
 opacity={0.3}
 />
 </mesh>
 {/* Floating AI Chip */}
 <group ref={chipRef} position={[0, 0.35, 0]}>
 <mesh>
 <boxGeometry args={[0.16, 0.05, 0.16]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 {/* Outer Ring of Chip */}
 <mesh rotation={[Math.PI / 2, 0, 0]}>
 <torusGeometry args={[0.15, 0.02, 6, 12]} />
 <GlassMaterial color="#8a2be2" />
 </mesh>
 </group>
 </group>
 );
}

// 6. Coffee Cup / Dining Tray (Lunch Break)
export function CoffeeCup() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.4;
 });

 return (
 <group ref={ref} position={[0, -0.1, 0]}>
 {/* Plate */}
 <mesh position={[0, -0.3, 0]}>
 <cylinderGeometry args={[0.45, 0.45, 0.03, 16]} />
 <GlassMaterial color="#1a1a2e" emissive="#8a2be2" />
 </mesh>
 {/* Cup Body */}
 <mesh position={[0, -0.05, 0]}>
 <cylinderGeometry args={[0.26, 0.2, 0.42, 16]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Cup Handle */}
 <mesh position={[0.22, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
 <torusGeometry args={[0.12, 0.04, 8, 16, Math.PI]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Glowing Coffee Surface */}
 <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
 <circleGeometry args={[0.24, 16]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 </group>
 );
}

// 7. Microphones + Round Table (Panel Discussion)
export function PanelTable() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
 });

 return (
 <group ref={ref} position={[0, -0.15, 0]}>
 {/* Table */}
 <mesh position={[0, 0, 0]}>
 <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
 <GlassMaterial color="#1a1a2e" emissive="#8a2be2" />
 </mesh>
 {/* Table Stand */}
 <mesh position={[0, -0.3, 0]}>
 <cylinderGeometry args={[0.08, 0.15, 0.5, 12]} />
 <GlassMaterial color="#8a2be2" />
 </mesh>
 {/* Microphone 1 */}
 <group position={[0.25, 0.15, 0.1]} rotation={[0, 0, -0.2]}>
 <mesh>
 <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 <mesh position={[0, 0.12, 0]}>
 <sphereGeometry args={[0.035, 8, 8]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 </group>
 {/* Microphone 2 */}
 <group position={[-0.25, 0.15, -0.1]} rotation={[0, 0, 0.2]}>
 <mesh>
 <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 <mesh position={[0, 0.12, 0]}>
 <sphereGeometry args={[0.035, 8, 8]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 </group>
 </group>
 );
}

// 8. Trophy (Closing Note)
export function Trophy() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
 });

 return (
 <group ref={ref} position={[0, -0.15, 0]}>
 {/* Base */}
 <mesh position={[0, -0.35, 0]}>
 <boxGeometry args={[0.4, 0.2, 0.4]} />
 <GlassMaterial color="#1a1a2e" emissive="#8a2be2" />
 </mesh>
 {/* Stem */}
 <mesh position={[0, -0.1, 0]}>
 <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Cup Top */}
 <mesh position={[0, 0.2, 0]}>
 <cylinderGeometry args={[0.26, 0.08, 0.35, 12, 1, true]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Glowing Star Inside Trophy */}
 <mesh position={[0, 0.2, 0]}>
 <octahedronGeometry args={[0.15, 0]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 {/* Left Handle */}
 <mesh position={[-0.2, 0.18, 0]} rotation={[0, 0, -Math.PI / 6]}>
 <torusGeometry args={[0.1, 0.03, 8, 12]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 {/* Right Handle */}
 <mesh position={[0.2, 0.18, 0]} rotation={[0, 0, Math.PI / 6]}>
 <torusGeometry args={[0.1, 0.03, 8, 12]} />
 <GlassMaterial color="#39ff8f" />
 </mesh>
 </group>
 );
}

// 9. Digital Swag Box / Certificate (Swag)
export function SwagBox() {
 const ref = useRef();
 useFrame((state) => {
 ref.current.rotation.y = state.clock.getElapsedTime() * 0.4;
 ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
 });

 return (
 <group ref={ref}>
 {/* Glass Swag Box */}
 <mesh>
 <boxGeometry args={[0.55, 0.55, 0.55]} />
 <GlassMaterial color="#8a2be2" />
 </mesh>
 {/* Glowing Inner Chip/Sphere */}
 <mesh>
 <dodecahedronGeometry args={[0.2, 0]} />
 <NeonMaterial color="#39ff8f" />
 </mesh>
 {/* Laser Framing Ring */}
 <mesh rotation={[Math.PI / 2, 0, 0]}>
 <torusGeometry args={[0.42, 0.02, 6, 24]} />
 <NeonMaterial color="#8a2be2" />
 </mesh>
 </group>
 );
}

// Factory resolver mapping data icon strings or tracks to 3D components
export function ModelResolver({ iconUrl, track }) {
 const url = iconUrl ? iconUrl.toLowerCase() : '';
 const trk = track ? track.toLowerCase() : '';
 
 if (url.includes('ticket')) return <QRScanner />;
 if (url.includes('coffee') || url.includes('tea')) return <NetworkNodes />;
 if (url.includes('microphone') || url.includes(' ceremony')) return <StagePodium />;
 if (url.includes('robot') || url.includes('lightning') || trk === 'keynote') return <AIBrain />;
 if (url.includes('brain') || url.includes('laptop') || trk === 'workshop') return <WorkshopLaptop />;
 if (url.includes('pizza') || url.includes('lunch') || url.includes('meal')) return <CoffeeCup />;
 if (url.includes('mic') || trk === 'panel') return <PanelTable />;
 if (url.includes('trophy') || url.includes('award') || url.includes('closing')) return <Trophy />;
 if (url.includes('gift') || url.includes('swag')) return <SwagBox />;
 
 // Default fallback
 return <AIBrain />;
}
