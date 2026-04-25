import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

const ArcadeJoystick = () => {
  const stickRef = useRef<Group>(null);
  useFrame((state) => {
    if (stickRef.current) {
      stickRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
      stickRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* Base */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.25, 32]} />
        <meshStandardMaterial color="#1f1f2e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Stick */}
      <group ref={stickRef} position={[0, -0.25, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.8, 16]} />
          <meshStandardMaterial color="#0a0a14" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Ball top */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      </group>
      {/* Buttons */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x + 1.1, -0.28, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
          <meshStandardMaterial
            color={["#06b6d4", "#fbbf24", "#a855f7"][i]}
            emissive={["#06b6d4", "#fbbf24", "#a855f7"][i]}
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const FloatingDie = () => {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.6;
      ref.current.rotation.y += delta * 0.8;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <RoundedBox ref={ref} args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={4} position={[-1.6, 1.2, 0]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          distort={0.15}
          speed={1.5}
          metalness={0.7}
          roughness={0.2}
          emissive="#6366f1"
          emissiveIntensity={0.4}
        />
      </RoundedBox>
    </Float>
  );
};

const FloatingPixel = () => {
  return (
    <Float speed={1.6} rotationIntensity={1.5} floatIntensity={1.8}>
      <mesh position={[1.7, 1.4, -0.5]}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#06b6d4"
          wireframe
          emissive="#06b6d4"
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
};

const SpinningRing = () => {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.5;
      ref.current.rotation.x += delta * 0.2;
    }
  });
  return (
    <group ref={ref} position={[0, 0.5, -1]}>
      <mesh>
        <torusGeometry args={[1.8, 0.04, 8, 80]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#ec4899"
          emissiveIntensity={0.6}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
};

const GameScene3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 1.3, 4.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#a78bfa" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={1} color="#ec4899" />
      <pointLight position={[3, -2, 3]} intensity={0.8} color="#06b6d4" />
      <Suspense fallback={null}>
        <SpinningRing />
        <ArcadeJoystick />
        <FloatingDie />
        <FloatingPixel />
      </Suspense>
    </Canvas>
  );
};

export default GameScene3D;
