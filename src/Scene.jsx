import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import VehicleModel from './VehicleModel.jsx';
import { motionConfig, sceneMotion } from './motionConfig.js';

function SceneContent({ mobile }) {
  const vehicle = useRef();
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const warmLight = useRef();
  const keyLight = useRef();
  useFrame((state, delta) => {
    const p = sceneMotion.progress;
    const heroToFleet = THREE.MathUtils.smoothstep(p, 0.08, 0.34);
    const towing = THREE.MathUtils.smoothstep(p, 0.48, 0.68);
    const contact = THREE.MathUtils.smoothstep(p, 0.76, 0.98);
    if (vehicle.current) {
      const position = new THREE.Vector3(
        THREE.MathUtils.lerp(motionConfig.scene.heroPosition[0], motionConfig.scene.fleetPosition[0], heroToFleet),
        THREE.MathUtils.lerp(motionConfig.scene.heroPosition[1], motionConfig.scene.fleetPosition[1], heroToFleet),
        0
      );
      position.lerp(new THREE.Vector3(...motionConfig.scene.towingPosition), towing);
      position.lerp(new THREE.Vector3(...motionConfig.scene.contactPosition), contact);
      vehicle.current.position.lerp(position, 1 - Math.exp(-delta * 3));
      const vehicleOrbit = sceneMotion.activeVehicle * 0.16;
      const targetRotation = new THREE.Euler(
        THREE.MathUtils.lerp(0.02, -0.11, towing) + sceneMotion.pointerY * 0.035,
        vehicleOrbit + heroToFleet * 0.9 + Math.sin(state.clock.elapsedTime * 0.22) * 0.04 + sceneMotion.pointerX * 0.045,
        sceneMotion.pointerX * -0.025
      );
      vehicle.current.rotation.x = THREE.MathUtils.damp(vehicle.current.rotation.x, targetRotation.x, 3, delta);
      vehicle.current.rotation.y = THREE.MathUtils.damp(vehicle.current.rotation.y, targetRotation.y, 3, delta);
      vehicle.current.rotation.z = THREE.MathUtils.damp(vehicle.current.rotation.z, targetRotation.z, 3, delta);
      const scale = THREE.MathUtils.lerp(motionConfig.scene.scaleStart, motionConfig.scene.scaleFleet, heroToFleet);
      vehicle.current.scale.setScalar(THREE.MathUtils.damp(vehicle.current.scale.x, scale * THREE.MathUtils.lerp(1, motionConfig.scene.scaleEnd / motionConfig.scene.scaleStart, contact), 3, delta));
    }
    const cameraZ = THREE.MathUtils.lerp(motionConfig.scene.cameraStart[2], motionConfig.scene.cameraEnd[2], contact);
    const cameraY = THREE.MathUtils.lerp(0.15, -0.2, towing) + sceneMotion.pointerY * 0.045;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, THREE.MathUtils.lerp(0, 0.25, contact) + sceneMotion.pointerX * 0.06, 2.6, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, cameraY, 2.6, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, cameraZ, 2.6, delta);
    cameraTarget.current.set(0, -0.05, 0);
    state.camera.lookAt(cameraTarget.current);
    if (warmLight.current) warmLight.current.intensity = THREE.MathUtils.damp(warmLight.current.intensity, mobile ? 0.4 : THREE.MathUtils.lerp(0.35, 2.2, towing), 2.5, delta);
    if (keyLight.current) keyLight.current.intensity = THREE.MathUtils.damp(keyLight.current.intensity, THREE.MathUtils.lerp(2.1, 1.1, contact), 2.5, delta);
  });
  return <>
    <ambientLight intensity={mobile ? 1.1 : 0.72} />
    <directionalLight ref={keyLight} position={[4, 5, 5]} intensity={2.1} color="#fff2da" castShadow={!mobile} />
    <pointLight position={[-4, -2, 2]} intensity={mobile ? 0.65 : 1.5} color="#789fc8" />
    <pointLight ref={warmLight} position={[-2.5, -1.5, 3]} intensity={0.4} color="#ffad50" distance={12} />
    <group ref={vehicle}>
      <Float speed={mobile ? 0.25 : 0.45} rotationIntensity={0.015} floatIntensity={0.035}>
        <Suspense fallback={null}><VehicleModel /></Suspense>
      </Float>
    </group>
    {!mobile && <ContactShadows position={[1.2, -0.78, 0]} opacity={0.32} scale={7} blur={2.5} far={3} resolution={256} frames={1} />}
    <Suspense fallback={null}><Environment preset="studio" /></Suspense>
    {!mobile && <EffectComposer multisampling={0}><Bloom intensity={0.24} luminanceThreshold={0.78} luminanceSmoothing={0.25} mipmapBlur /></EffectComposer>}
  </>;
}

export default function Scene() {
  const [mobile, setMobile] = [typeof window !== 'undefined' && window.innerWidth < motionConfig.performance.mobileBreakpoint, () => {}];
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    const onPointer = (event) => {
      sceneMotion.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      sceneMotion.pointerY = (0.5 - event.clientY / window.innerHeight) * 2;
    };
    if (!mobile && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [mobile, reduced]);
  if (reduced) return <div className="scene-static-glow" aria-hidden="true" />;
  return <div className={`scene-canvas ${mobile ? 'scene-canvas-mobile' : ''}`} aria-hidden="true">
    <Canvas dpr={mobile ? motionConfig.performance.mobileDpr : motionConfig.performance.desktopDpr} camera={{ position: motionConfig.scene.cameraStart, fov: mobile ? 48 : 42 }} shadows={!mobile} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
      <SceneContent mobile={mobile} />
    </Canvas>
  </div>;
}
