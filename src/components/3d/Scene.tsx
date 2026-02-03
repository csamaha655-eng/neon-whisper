import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DataCore, FloatingParticles } from './DataCore';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />

      {/* Main Data Core */}
      <DataCore scale={2} rotationSpeed={0.15} color="#00f5ff" />

      {/* Floating particles */}
      <FloatingParticles count={100} />

      {/* Optional: Allow subtle orbit control for interactivity */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
