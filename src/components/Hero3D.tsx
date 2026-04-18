import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Icosahedron, Torus } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

const Knot = () => {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15;
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={ref} args={[1.4, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const FloatingShapes = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <Icosahedron args={[0.45, 0]} position={[-2.6, 1.4, -1]}>
          <meshStandardMaterial color="#3b82f6" wireframe />
        </Icosahedron>
      </Float>
      <Float speed={1.6} rotationIntensity={1.5} floatIntensity={2.5}>
        <Torus args={[0.4, 0.14, 16, 64]} position={[2.4, -1.2, -0.5]}>
          <meshStandardMaterial color="#a855f7" metalness={0.8} roughness={0.2} />
        </Torus>
      </Float>
      <Float speed={1.2} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron args={[0.3, 0]} position={[2.8, 1.6, -2]}>
          <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.3} />
        </Icosahedron>
      </Float>
    </>
  );
};

const Hero3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#3b82f6" />
      <Suspense fallback={null}>
        <Knot />
        <FloatingShapes />
      </Suspense>
    </Canvas>
  );
};

export default Hero3D;
