import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

interface DataCoreProps {
  scale?: number;
  rotationSpeed?: number;
  color?: string;
}

export function DataCore({
  scale = 2,
  rotationSpeed = 0.15,
  color = '#00f5ff',
}: DataCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * rotationSpeed * 0.5;
      meshRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x = -clock.elapsedTime * rotationSpeed * 0.3;
      innerMeshRef.current.rotation.y = -clock.elapsedTime * rotationSpeed * 0.7;
    }
  });

  return (
    <group>
      {/* Outer Icosahedron */}
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges
          scale={1}
          threshold={15}
          color={color}
        />
      </mesh>

      {/* Inner smaller icosahedron */}
      <mesh ref={innerMeshRef} scale={scale * 0.5}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges
          scale={1}
          threshold={15}
          color="#ff00ff"
        />
      </mesh>

      {/* Center glow sphere */}
      <mesh scale={scale * 0.15}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Floating particles around the core
export function FloatingParticles({ count = 50 }: { count?: number }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = clock.elapsedTime * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(points, 3));
    return geo;
  }, [points]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#00f5ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
