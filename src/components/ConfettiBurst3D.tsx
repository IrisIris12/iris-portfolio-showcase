import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import type { Group, Mesh } from "three";

type Particle = {
  velocity: [number, number, number];
  rotation: [number, number, number];
  rotSpeed: [number, number, number];
  color: string;
  scale: number;
  shape: "box" | "sphere" | "tetra";
};

const COLORS = [
  "#ec4899", "#f472b6", "#a855f7", "#8b5cf6",
  "#06b6d4", "#22d3ee", "#fbbf24", "#34d399",
];

const ConfettiPiece = ({ particle, life }: { particle: Particle; life: React.MutableRefObject<number> }) => {
  const ref = useRef<Mesh>(null);
  const pos = useRef<[number, number, number]>([0, 0, 0]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const gravity = -3;
    pos.current[0] += particle.velocity[0] * delta;
    pos.current[1] += particle.velocity[1] * delta;
    pos.current[2] += particle.velocity[2] * delta;
    particle.velocity[1] += gravity * delta;

    ref.current.position.set(...pos.current);
    ref.current.rotation.x += particle.rotSpeed[0] * delta;
    ref.current.rotation.y += particle.rotSpeed[1] * delta;
    ref.current.rotation.z += particle.rotSpeed[2] * delta;

    const opacity = Math.max(0, 1 - life.current / 1.6);
    const mat = ref.current.material as { opacity?: number; transparent?: boolean };
    if (mat) {
      mat.transparent = true;
      mat.opacity = opacity;
    }
    ref.current.scale.setScalar(particle.scale * opacity);
  });

  return (
    <mesh ref={ref}>
      {particle.shape === "box" && <boxGeometry args={[0.18, 0.06, 0.18]} />}
      {particle.shape === "sphere" && <sphereGeometry args={[0.1, 12, 12]} />}
      {particle.shape === "tetra" && <tetrahedronGeometry args={[0.14, 0]} />}
      <meshStandardMaterial
        color={particle.color}
        emissive={particle.color}
        emissiveIntensity={0.6}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
};

const Burst = ({ count = 60, onDone }: { count?: number; onDone: () => void }) => {
  const groupRef = useRef<Group>(null);
  const life = useRef(0);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      const upward = 2 + Math.random() * 3;
      const shapes: Particle["shape"][] = ["box", "sphere", "tetra"];
      return {
        velocity: [
          Math.cos(angle) * speed,
          upward,
          Math.sin(angle) * speed,
        ],
        rotation: [0, 0, 0],
        rotSpeed: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scale: 0.6 + Math.random() * 0.8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    life.current += delta;
    if (life.current > 1.8) onDone();
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <ConfettiPiece key={i} particle={p} life={life} />
      ))}
    </group>
  );
};

type ConfettiBurst3DProps = {
  trigger: number; // increment to fire a new burst
  count?: number;
};

const ConfettiBurst3D = ({ trigger, count = 60 }: ConfettiBurst3DProps) => {
  const [bursts, setBursts] = useState<number[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      setBursts((prev) => [...prev, trigger]);
    }
  }, [trigger]);

  if (bursts.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#ec4899" />
        <Suspense fallback={null}>
          {bursts.map((id) => (
            <Burst
              key={id}
              count={count}
              onDone={() => setBursts((prev) => prev.filter((b) => b !== id))}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ConfettiBurst3D;
