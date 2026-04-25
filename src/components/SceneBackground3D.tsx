import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Icosahedron, Torus, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

const FloatingOrbs = () => {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={1.5} floatIntensity={2}>
        <Icosahedron args={[0.6, 0]} position={[-4, 2, -3]}>
          <meshStandardMaterial
            color="#8b5cf6"
            wireframe
            emissive="#6366f1"
            emissiveIntensity={0.4}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <Torus args={[0.5, 0.18, 16, 64]} position={[4, -1.5, -4]}>
          <meshStandardMaterial
            color="#ec4899"
            metalness={0.9}
            roughness={0.1}
            emissive="#ec4899"
            emissiveIntensity={0.3}
          />
        </Torus>
      </Float>

      <Float speed={0.8} rotationIntensity={1} floatIntensity={2.5}>
        <mesh position={[3, 2.5, -5]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <MeshDistortMaterial
            color="#3b82f6"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.7}
            emissive="#1e40af"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={2}>
        <Icosahedron args={[0.35, 1]} position={[-3.5, -2.2, -3.5]}>
          <meshStandardMaterial
            color="#06b6d4"
            metalness={0.8}
            roughness={0.2}
            emissive="#0891b2"
            emissiveIntensity={0.4}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.8} rotationIntensity={2} floatIntensity={2.5}>
        <Torus args={[0.3, 0.1, 16, 48]} position={[0, 3, -6]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial
            color="#a855f7"
            metalness={0.9}
            roughness={0.15}
            emissive="#7e22ce"
            emissiveIntensity={0.3}
          />
        </Torus>
      </Float>
    </group>
  );
};

const PulsingCore = () => {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      ref.current.scale.set(s, s, s);
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -8]}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <MeshDistortMaterial
        color="#1e1b4b"
        distort={0.3}
        speed={1}
        roughness={0.4}
        metalness={0.6}
        emissive="#6366f1"
        emissiveIntensity={0.6}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

const SceneBackground3D = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#a78bfa" />
        <pointLight position={[-5, -5, -5]} intensity={0.6} color="#ec4899" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#06b6d4" />

        <Suspense fallback={null}>
          <Stars
            radius={50}
            depth={50}
            count={2500}
            factor={4}
            saturation={0.5}
            fade
            speed={0.5}
          />
          <PulsingCore />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneBackground3D;
