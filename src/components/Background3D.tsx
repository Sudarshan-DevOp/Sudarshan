'use client';

import { useRef, useMemo, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  geometry: ReactNode;
  position: [number, number, number];
  speed: { x: number; y: number };
  color: string;
}

function FloatingShape({ geometry, position, speed, color }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed.x;
      meshRef.current.rotation.y += speed.y;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

export default function Background3D() {
  const shapes = useMemo(() => [
    { 
      geometry: <icosahedronGeometry args={[1, 0]} />, 
      position: [-4, 2, -3] as [number, number, number], 
      speed: { x: 0.002, y: 0.003 }, 
      color: '#00f2fe' 
    },
    { 
      geometry: <torusGeometry args={[0.8, 0.2, 16, 100]} />, 
      position: [4, -1, -2] as [number, number, number], 
      speed: { x: 0.003, y: 0.002 }, 
      color: '#2563eb' 
    },
    { 
      geometry: <octahedronGeometry args={[0.8]} />, 
      position: [-3, -2, -4] as [number, number, number], 
      speed: { x: 0.004, y: 0.003 }, 
      color: '#00f2fe' 
    },
    { 
      geometry: <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />, 
      position: [3, 3, -3] as [number, number, number], 
      speed: { x: 0.002, y: 0.004 }, 
      color: '#2563eb' 
    },
    { 
      geometry: <dodecahedronGeometry args={[0.7]} />, 
      position: [0, 0, -5] as [number, number, number], 
      speed: { x: 0.003, y: 0.002 }, 
      color: '#00f2fe' 
    },
  ], []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0, 
      pointerEvents: 'none' 
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        {shapes.map((shape, i) => (
          <FloatingShape key={i} {...shape} />
        ))}
      </Canvas>
    </div>
  );
}
