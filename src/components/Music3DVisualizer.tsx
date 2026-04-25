import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

const Vinyl = () => {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 1.2;
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <group rotation={[Math.PI / 2.6, 0, 0]}>
        {/* Disc */}
        <mesh ref={ref}>
          <cylinderGeometry args={[1.8, 1.8, 0.06, 64]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Grooves rings */}
        {[1.6, 1.4, 1.2, 1.0, 0.85].map((r) => (
          <mesh key={r} position={[0, 0.035, 0]}>
            <torusGeometry args={[r, 0.005, 8, 80]} />
            <meshStandardMaterial
              color="#1f1f1f"
              metalness={0.7}
              roughness={0.4}
              emissive="#6366f1"
              emissiveIntensity={0.15}
            />
          </mesh>
        ))}

        {/* Center label */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.02, 64]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

        {/* Center hole */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 32]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    </Float>
  );
};

const AudioBars = () => {
  const groupRef = useRef<Group>(null);
  const bars = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);
  const seeds = useMemo(() => bars.map(() => Math.random() * Math.PI * 2), [bars]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const m = child as Mesh;
      const h = 0.4 + (Math.sin(t * 3 + seeds[i]) * 0.5 + 0.5) * 2.2;
      m.scale.y = h;
      m.position.y = h / 2 - 1.2;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {bars.map((i) => {
        const x = (i - bars.length / 2) * 0.28 + 0.14;
        const hue = 200 + i * 8;
        return (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.18, 1, 0.18]} />
            <meshStandardMaterial
              color={`hsl(${hue}, 90%, 60%)`}
              emissive={`hsl(${hue}, 90%, 50%)`}
              emissiveIntensity={0.6}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Music3DVisualizer = () => {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 5.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-4, 2, 2]} intensity={1} color="#ec4899" />
      <pointLight position={[4, -2, 3]} intensity={0.8} color="#06b6d4" />
      <Suspense fallback={null}>
        <Vinyl />
        <AudioBars />
      </Suspense>
    </Canvas>
  );
};

export default Music3DVisualizer;
