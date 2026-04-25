import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

// ----- Types & constants -----
type Obstacle = { id: number; x: number; type: "cactus" | "rock" };

const GROUND_Y = 0;
const DINO_X = -4;
const SPAWN_X = 12;
const DESPAWN_X = -10;
const GRAVITY = -55;
const JUMP_VELOCITY = 18;

// ----- Dino mesh -----
const Dino = ({ y, dead }: { y: number; dead: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && !dead) {
      ref.current.rotation.z = Math.sin(performance.now() / 120) * 0.05;
    }
  });
  return (
    <group ref={ref} position={[DINO_X, y, 0]}>
      {/* body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1, 1.2, 0.8]} />
        <meshStandardMaterial color={dead ? "#888" : "#a855f7"} />
      </mesh>
      {/* head */}
      <mesh position={[0.55, 1.5, 0]} castShadow>
        <boxGeometry args={[0.9, 0.8, 0.7]} />
        <meshStandardMaterial color={dead ? "#777" : "#c084fc"} />
      </mesh>
      {/* eye */}
      <mesh position={[0.85, 1.65, 0.36]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* tail */}
      <mesh position={[-0.7, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial color={dead ? "#777" : "#a855f7"} />
      </mesh>
      {/* legs */}
      <mesh position={[-0.25, -0.1, 0.2]} castShadow>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshStandardMaterial color={dead ? "#666" : "#7e22ce"} />
      </mesh>
      <mesh position={[0.25, -0.1, -0.2]} castShadow>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshStandardMaterial color={dead ? "#666" : "#7e22ce"} />
      </mesh>
    </group>
  );
};

// ----- Cactus / rock -----
const Cactus = ({ x }: { x: number }) => (
  <group position={[x, 0.7, 0]}>
    <mesh castShadow>
      <boxGeometry args={[0.5, 1.4, 0.5]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
    <mesh position={[0.4, 0.2, 0]} castShadow>
      <boxGeometry args={[0.35, 0.6, 0.35]} />
      <meshStandardMaterial color="#16a34a" />
    </mesh>
    <mesh position={[-0.4, 0.0, 0]} castShadow>
      <boxGeometry args={[0.35, 0.5, 0.35]} />
      <meshStandardMaterial color="#16a34a" />
    </mesh>
  </group>
);

const Rock = ({ x }: { x: number }) => (
  <mesh position={[x, 0.4, 0]} castShadow>
    <boxGeometry args={[0.9, 0.8, 0.7]} />
    <meshStandardMaterial color="#64748b" />
  </mesh>
);

// ----- Ground with moving stripes -----
const Ground = ({ speed, running }: { speed: number; running: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current && running) {
      const mat = ref.current.material as THREE.MeshStandardMaterial & {
        map?: THREE.Texture;
      };
      if (mat.map) {
        mat.map.offset.x += dt * speed * 0.15;
      }
    }
  });

  // procedural stripes texture
  const texture = (() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 24, 0);
      ctx.lineTo(i * 24 + 12, 128);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(8, 1);
    return t;
  })();

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[60, 8]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// ----- Game scene -----
const Scene = ({
  dinoY,
  obstacles,
  speed,
  running,
  dead,
}: {
  dinoY: number;
  obstacles: Obstacle[];
  speed: number;
  running: boolean;
  dead: boolean;
}) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Ground speed={speed} running={running} />
      <Dino y={dinoY} dead={dead} />
      {obstacles.map((o) =>
        o.type === "cactus" ? (
          <Cactus key={o.id} x={o.x} />
        ) : (
          <Rock key={o.id} x={o.x} />
        )
      )}
      {/* sky backdrop */}
      <mesh position={[0, 4, -8]}>
        <planeGeometry args={[60, 16]} />
        <meshBasicMaterial color="#0f0a2e" />
      </mesh>
    </>
  );
};

// ----- Main component -----
const DinoGame = () => {
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [dinoY, setDinoY] = useState(GROUND_Y);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const stateRef = useRef({
    y: GROUND_Y,
    vy: 0,
    speed: 8,
    spawnTimer: 0,
    nextId: 1,
    score: 0,
    obstacles: [] as Obstacle[],
    running: false,
    dead: false,
    raf: 0 as number,
    last: 0,
  });

  const start = () => {
    stateRef.current.y = GROUND_Y;
    stateRef.current.vy = 0;
    stateRef.current.speed = 8;
    stateRef.current.spawnTimer = 1;
    stateRef.current.nextId = 1;
    stateRef.current.score = 0;
    stateRef.current.obstacles = [];
    stateRef.current.running = true;
    stateRef.current.dead = false;
    setObstacles([]);
    setDinoY(GROUND_Y);
    setScore(0);
    setDead(false);
    setRunning(true);
  };

  const jump = () => {
    const s = stateRef.current;
    if (!s.running) {
      start();
      return;
    }
    if (s.dead) {
      start();
      return;
    }
    if (s.y <= GROUND_Y + 0.001) {
      s.vy = JUMP_VELOCITY;
    }
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // game loop
  useEffect(() => {
    const tick = (t: number) => {
      const s = stateRef.current;
      const dt = s.last ? Math.min((t - s.last) / 1000, 0.05) : 0;
      s.last = t;

      if (s.running && !s.dead) {
        // physics
        s.vy += GRAVITY * dt;
        s.y += s.vy * dt;
        if (s.y < GROUND_Y) {
          s.y = GROUND_Y;
          s.vy = 0;
        }

        // move obstacles
        s.obstacles = s.obstacles
          .map((o) => ({ ...o, x: o.x - s.speed * dt }))
          .filter((o) => o.x > DESPAWN_X);

        // spawn
        s.spawnTimer -= dt;
        if (s.spawnTimer <= 0) {
          s.obstacles.push({
            id: s.nextId++,
            x: SPAWN_X,
            type: Math.random() > 0.3 ? "cactus" : "rock",
          });
          s.spawnTimer = 0.9 + Math.random() * 1.1;
        }

        // score & speed
        s.score += dt * 10;
        s.speed = 8 + Math.min(s.score / 30, 10);

        // collisions (AABB roughly around dino)
        const dinoBox = {
          minX: DINO_X - 0.5,
          maxX: DINO_X + 0.7,
          minY: s.y,
          maxY: s.y + 1.9,
        };
        for (const o of s.obstacles) {
          const w = o.type === "cactus" ? 0.6 : 0.9;
          const h = o.type === "cactus" ? 1.4 : 0.8;
          const obox = {
            minX: o.x - w / 2,
            maxX: o.x + w / 2,
            minY: 0,
            maxY: h,
          };
          if (
            dinoBox.maxX > obox.minX &&
            dinoBox.minX < obox.maxX &&
            dinoBox.maxY > obox.minY &&
            dinoBox.minY < obox.maxY
          ) {
            s.dead = true;
            s.running = false;
            setDead(true);
            setRunning(false);
            setBest((b) => Math.max(b, Math.floor(s.score)));
            break;
          }
        }

        setDinoY(s.y);
        setObstacles([...s.obstacles]);
        setScore(Math.floor(s.score));
      }

      stateRef.current.raf = requestAnimationFrame(tick);
    };
    stateRef.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(stateRef.current.raf);
  }, []);

  return (
    <section id="dino" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-12"
        >
          <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
            3D Game
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Dino <span className="name-gradient">Runner 3D</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Press <kbd className="px-2 py-1 rounded-md glass text-sm">Space</kbd> or{" "}
            <kbd className="px-2 py-1 rounded-md glass text-sm">↑</kbd> to jump.
            Avoid the cactuses and rocks!
          </p>
        </motion.div>

        <div
          className="relative rounded-3xl overflow-hidden bg-gradient-card glass shadow-soft glow-border"
          onClick={jump}
          role="button"
          tabIndex={0}
        >
          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
            <div className="glass rounded-xl px-4 py-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Score
              </p>
              <p className="font-display text-2xl font-bold">{score}</p>
            </div>
            <div className="glass rounded-xl px-4 py-2 text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Best
              </p>
              <p className="font-display text-2xl font-bold">{best}</p>
            </div>
          </div>

          {/* Canvas */}
          <div className="h-[420px] md:h-[480px] cursor-pointer">
            <Canvas
              shadows
              camera={{ position: [0, 3, 9], fov: 50 }}
              gl={{ antialias: true }}
            >
              <color attach="background" args={["#0f0a2e"]} />
              <Scene
                dinoY={dinoY}
                obstacles={obstacles}
                speed={stateRef.current.speed}
                running={running}
                dead={dead}
              />
            </Canvas>
          </div>

          {/* Overlay */}
          {(!running || dead) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {dead ? "Game Over" : "Ready?"}
                </h3>
                {dead && (
                  <p className="text-muted-foreground mb-5">
                    Score: <span className="text-foreground font-semibold">{score}</span>
                  </p>
                )}
                <Button
                  variant="hero"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    start();
                  }}
                  className="gap-2"
                >
                  {dead ? (
                    <>
                      <RotateCcw className="h-5 w-5" /> Play again
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" /> Start
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DinoGame;
