import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motionConfig, sceneMotion } from './motionConfig.js';

function HeroObject() {
  const group = useRef();
  const orb = useRef();
  const ring = useRef();
  const color = useRef(new THREE.Color());
  useFrame((_, delta) => {
    const p = sceneMotion.progress;
    if (!group.current) return;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, THREE.MathUtils.lerp(1.9, 0.4, p) + sceneMotion.pointerX * 0.22, 4, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, THREE.MathUtils.lerp(0.1, -0.15, p) + sceneMotion.pointerY * 0.16, 4, delta);
    const scale = THREE.MathUtils.lerp(0.92, 1.2, p);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 3, delta));
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, sceneMotion.pointerY * 0.12 + p * 0.45, 3, delta);
    if (ring.current) ring.current.rotation.z = THREE.MathUtils.damp(ring.current.rotation.z, p * motionConfig.scene.rotationTurns + sceneMotion.pointerX * 0.12, 3, delta);
    if (orb.current) {
      color.current.set(motionConfig.scene.accentStart).lerp(new THREE.Color(motionConfig.scene.accentEnd), p);
      orb.current.material.color.copy(color.current);
    }
  });
  return <group ref={group}>
    <Float speed={0.65} rotationIntensity={0.08} floatIntensity={0.16}>
      <mesh ref={orb} castShadow><icosahedronGeometry args={[1.12, 4]} /><MeshDistortMaterial color={motionConfig.scene.accentStart} metalness={0.72} roughness={0.2} distort={0.16} speed={1.1} clearcoat={0.9} clearcoatRoughness={0.16} /></mesh>
    </Float>
    <mesh ref={ring} rotation={[0.7, 0.2, 0.25]}><torusGeometry args={[1.55, 0.018, 12, 120]} /><meshStandardMaterial color="#e8b653" metalness={0.85} roughness={0.24} emissive="#9b6c20" emissiveIntensity={0.25} /></mesh>
    <mesh rotation={[1.18, 0.2, -0.35]}><torusGeometry args={[1.82, 0.008, 8, 120]} /><meshStandardMaterial color="#dbe6f2" metalness={0.8} roughness={0.25} transparent opacity={0.58} /></mesh>
  </group>;
}
function SceneContent() {
  return <><ambientLight intensity={0.9} /><directionalLight position={[4, 5, 5]} intensity={2.4} color="#fff1d4" /><pointLight position={[-4, -2, 2]} intensity={1.8} color="#7b9fc8" /><Suspense fallback={null}><HeroObject /></Suspense></>;
}
export default function Scene() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < motionConfig.performance.mobileBreakpoint;
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    const onPointer = (event) => { sceneMotion.pointerX = (event.clientX / window.innerWidth - 0.5) * 2; sceneMotion.pointerY = (0.5 - event.clientY / window.innerHeight) * 2; };
    if (!mobile && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [mobile, reduced]);
  if (mobile || reduced) return <div className="scene-static-glow" aria-hidden="true" />;
  return <div className="scene-canvas" aria-hidden="true"><Canvas dpr={motionConfig.performance.desktopDpr} camera={{ position: motionConfig.scene.cameraStart, fov: 42 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}><SceneContent /></Canvas></div>;
}
