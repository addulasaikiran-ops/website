import { Component, Suspense } from 'react';
import { Text, useGLTF } from '@react-three/drei';
import { modelConfig } from './motionConfig.js';

function LoadedVehicle() {
  const gltf = useGLTF(modelConfig.path, modelConfig.dracoPath);
  return <primitive object={gltf.scene} scale={1.25} position={[0, -0.45, 0]} />;
}

class ModelFallbackBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.warn('Vehicle GLB could not be loaded; using placeholder vehicle.', error); }
  render() { return this.state.failed ? <PlaceholderVehicle /> : this.props.children; }
}

function Wheel({ position }) {
  return <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
    <cylinderGeometry args={[0.25, 0.25, 0.16, 28]} />
    <meshStandardMaterial color="#10151c" roughness={0.78} metalness={0.2} />
    <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.115, 0.115, 0.018, 20]} />
      <meshStandardMaterial color="#c3ccd5" metalness={0.85} roughness={0.28} />
    </mesh>
  </mesh>;
}

export function PlaceholderVehicle() {
  return <group position={[0, -0.2, 0]} scale={0.9}>
    {/* REPLACE WITH REAL MODEL: stylized primitive vehicle placeholder until public/models/sriram-vehicle.glb is supplied. */}
    <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.6, 0.42, 1.05]} />
      <meshPhysicalMaterial color="#b8c8d7" metalness={0.78} roughness={0.23} clearcoat={0.8} />
    </mesh>
    <mesh position={[-0.08, 0.48, 0]} castShadow>
      <boxGeometry args={[1.25, 0.52, 0.88]} />
      <meshPhysicalMaterial color="#26384b" metalness={0.45} roughness={0.16} transmission={0.12} transparent opacity={0.94} clearcoat={1} />
    </mesh>
    <mesh position={[0.02, 0.12, 0.53]}>
      <boxGeometry args={[0.44, 0.13, 0.035]} />
      <meshStandardMaterial color="#f9dca0" emissive="#d39b43" emissiveIntensity={0.9} />
    </mesh>
    <mesh position={[0.02, 0.12, -0.53]}>
      <boxGeometry args={[0.44, 0.13, 0.035]} />
      <meshStandardMaterial color="#b24d37" emissive="#812b20" emissiveIntensity={0.45} />
    </mesh>
    {[-0.82, 0.82].map((x) => [-0.51, 0.51].map((z) => <Wheel key={x + ':' + z} position={[x, -0.16, z]} />))}
    <Text position={[0, -0.62, 0.64]} fontSize={0.095} color="#f1c875" anchorX="center" anchorY="middle" outlineWidth={0.003} outlineColor="#101c2b">REPLACE WITH REAL MODEL</Text>
  </group>;
}

export default function VehicleModel() {
  if (!modelConfig.enabled) return <PlaceholderVehicle />;
  return <ModelFallbackBoundary><Suspense fallback={<PlaceholderVehicle />}><LoadedVehicle /></Suspense></ModelFallbackBoundary>;
}
