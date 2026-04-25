import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, RotateCcw, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfettiBurst3D from "./ConfettiBurst3D";

const GRID = 20; // 20x20 cells
const CELL = 20; // px
const SIZE = GRID * CELL;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const DIRS: Record<Dir, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const randomFood = (snake: Point[]): Point => {
  while (true) {
    const f = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
};

const SnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [eatBurst, setEatBurst] = useState(0);

  const dirRef = useRef<Dir>(dir);
  const queuedDirRef = useRef<Dir | null>(null);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    const stored = localStorage.getItem("snake-best");
    if (stored) setBest(Number(stored));
  }, []);

  const reset = useCallback(() => {
    const start: Point[] = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(start);
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    queuedDirRef.current = null;
    setFood(randomFood(start));
    setScore(0);
    setOver(false);
    setPaused(false);
  }, []);

  const tryTurn = useCallback((next: Dir) => {
    const current = dirRef.current;
    if (next === current || next === OPPOSITE[current]) return;
    queuedDirRef.current = next;
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === " ") {
        e.preventDefault();
        if (over) reset();
        else setPaused((p) => !p);
        return;
      }
      const map: Record<string, Dir> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };
      if (map[key]) {
        e.preventDefault();
        tryTurn(map[key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over, reset, tryTurn]);

  // Game loop
  useEffect(() => {
    if (paused || over) return;
    const speed = Math.max(70, 160 - score * 3);
    const id = setInterval(() => {
      setSnake((prev) => {
        if (queuedDirRef.current) {
          dirRef.current = queuedDirRef.current;
          setDir(queuedDirRef.current);
          queuedDirRef.current = null;
        }
        const d = DIRS[dirRef.current];
        const head = { x: prev[0].x + d.x, y: prev[0].y + d.y };

        // wall collision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setOver(true);
          return prev;
        }
        // self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setOver(true);
          return prev;
        }

        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (!ate) next.pop();
        else {
          setScore((s) => {
            const ns = s + 1;
            setBest((b) => {
              const nb = Math.max(b, ns);
              localStorage.setItem("snake-best", String(nb));
              return nb;
            });
            return ns;
          });
          setFood(randomFood(next));
        }
        return next;
      });
    }, speed);
    return () => clearInterval(id);
  }, [paused, over, score, food]);

  return (
    <section id="snake" className="py-24 relative overflow-hidden">
      {/* Neon background grid */}
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(180 100% 50% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(320 100% 60% / 0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] mb-4 border"
            style={{
              borderColor: "hsl(180 100% 50% / 0.5)",
              background: "hsl(180 100% 50% / 0.08)",
              color: "hsl(180 100% 75%)",
              boxShadow: "0 0 20px hsl(180 100% 50% / 0.3), inset 0 0 12px hsl(180 100% 50% / 0.15)",
            }}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            Arcade · 1989
          </div>
          <h2
            className="font-display text-5xl md:text-6xl font-black mb-3 tracking-widest uppercase"
            style={{
              background: "linear-gradient(90deg, hsl(180 100% 60%), hsl(290 100% 70%), hsl(330 100% 65%))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 18px hsl(290 100% 60% / 0.6))",
            }}
          >
            ◤ SNAKE ◢
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-mono text-sm">
            &gt; INSERT_COIN — flèches/WASD pour bouger, ESPACE pour pause.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          {/* HUD */}
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
            <div
              className="px-5 py-2.5 rounded-sm border"
              style={{
                borderColor: "hsl(180 100% 50% / 0.6)",
                background: "hsl(180 50% 5% / 0.6)",
                color: "hsl(180 100% 75%)",
                boxShadow: "0 0 14px hsl(180 100% 50% / 0.35), inset 0 0 8px hsl(180 100% 50% / 0.2)",
              }}
            >
              SCORE <span className="font-bold ml-2">{String(score).padStart(4, "0")}</span>
            </div>
            <div
              className="px-5 py-2.5 rounded-sm border"
              style={{
                borderColor: "hsl(330 100% 60% / 0.6)",
                background: "hsl(330 50% 5% / 0.6)",
                color: "hsl(330 100% 78%)",
                boxShadow: "0 0 14px hsl(330 100% 55% / 0.35), inset 0 0 8px hsl(330 100% 55% / 0.2)",
              }}
            >
              HI <span className="font-bold ml-2">{String(best).padStart(4, "0")}</span>
            </div>
          </div>

          {/* Arcade frame */}
          <div
            className="relative p-3 rounded-sm"
            style={{
              background: "linear-gradient(145deg, hsl(290 60% 12%), hsl(220 60% 8%))",
              boxShadow:
                "0 0 40px hsl(290 100% 50% / 0.4), 0 0 80px hsl(180 100% 50% / 0.2), inset 0 0 30px hsl(220 100% 50% / 0.15)",
              border: "2px solid hsl(290 100% 60% / 0.5)",
            }}
          >
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                width: SIZE,
                height: SIZE,
                maxWidth: "90vw",
                maxHeight: "90vw",
                background: "radial-gradient(ellipse at center, hsl(240 80% 8%), hsl(240 90% 3%))",
                boxShadow: "inset 0 0 60px hsl(290 100% 30% / 0.4)",
              }}
            >
              {/* Neon grid */}
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(180 100% 50% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(320 100% 60% / 0.15) 1px, transparent 1px)",
                  backgroundSize: `${CELL}px ${CELL}px`,
                }}
              />

              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0, transparent 2px, hsl(0 0% 0% / 0.4) 2px, hsl(0 0% 0% / 0.4) 3px)",
                }}
              />

              {/* Food - pulsing neon orb */}
              <motion.div
                key={`${food.x}-${food.y}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: 0,
                }}
                transition={{
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                  rotate: { type: "spring", stiffness: 200, damping: 12 },
                }}
                className="absolute"
                style={{
                  width: CELL - 2,
                  height: CELL - 2,
                  left: food.x * CELL + 1,
                  top: food.y * CELL + 1,
                  background:
                    "radial-gradient(circle at 30% 30%, hsl(60 100% 80%), hsl(45 100% 55%) 50%, hsl(20 100% 45%))",
                  borderRadius: "30%",
                  boxShadow:
                    "0 0 16px hsl(45 100% 55% / 0.9), 0 0 30px hsl(20 100% 50% / 0.6)",
                }}
              />

              {/* Snake - neon segments */}
              {snake.map((s, i) => {
                const isHead = i === 0;
                const hue = (180 + i * 6) % 360;
                return (
                  <motion.div
                    key={i}
                    initial={isHead ? false : { scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="absolute"
                    style={{
                      width: CELL - 2,
                      height: CELL - 2,
                      left: s.x * CELL + 1,
                      top: s.y * CELL + 1,
                      borderRadius: isHead ? "35%" : "25%",
                      background: isHead
                        ? "linear-gradient(135deg, hsl(180 100% 70%), hsl(290 100% 65%))"
                        : `linear-gradient(135deg, hsl(${hue} 100% 60%), hsl(${(hue + 40) % 360} 100% 55%))`,
                      boxShadow: isHead
                        ? "0 0 18px hsl(290 100% 60% / 0.9), 0 0 30px hsl(180 100% 60% / 0.5), inset 0 0 6px hsl(0 0% 100% / 0.4)"
                        : `0 0 10px hsl(${hue} 100% 60% / 0.7), inset 0 0 4px hsl(0 0% 100% / 0.2)`,
                      border: "1px solid hsl(0 0% 100% / 0.15)",
                    }}
                  >
                    {isHead && (
                      <>
                        {/* Eyes */}
                        <div
                          className="absolute rounded-full"
                          style={{
                            width: 4,
                            height: 4,
                            background: "hsl(0 0% 100%)",
                            top: 4,
                            left: 4,
                            boxShadow: "0 0 4px hsl(0 0% 100%)",
                          }}
                        />
                        <div
                          className="absolute rounded-full"
                          style={{
                            width: 4,
                            height: 4,
                            background: "hsl(0 0% 100%)",
                            top: 4,
                            right: 4,
                            boxShadow: "0 0 4px hsl(0 0% 100%)",
                          }}
                        />
                      </>
                    )}
                  </motion.div>
                );
              })}

              {/* CRT vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 50%, hsl(0 0% 0% / 0.6) 100%)",
                }}
              />

              {/* Overlays */}
              {(paused || over) && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm"
                  style={{ background: "hsl(240 90% 3% / 0.85)" }}
                >
                  <p
                    className="font-display text-4xl font-black mb-2 uppercase tracking-widest"
                    style={{
                      color: over ? "hsl(0 100% 65%)" : "hsl(180 100% 65%)",
                      textShadow: over
                        ? "0 0 20px hsl(0 100% 50% / 0.8)"
                        : "0 0 20px hsl(180 100% 50% / 0.8)",
                    }}
                  >
                    {over ? "GAME OVER" : "PAUSED"}
                  </p>
                  {over && (
                    <p className="text-muted-foreground mb-4 font-mono text-sm uppercase tracking-widest">
                      Score: {String(score).padStart(4, "0")}
                    </p>
                  )}
                  <Button
                    variant="hero"
                    onClick={() => (over ? reset() : setPaused(false))}
                  >
                    {over ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2" /> INSERT COIN
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> RESUME
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="glass" onClick={() => setPaused((p) => !p)} disabled={over}>
              {paused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {paused ? "Reprendre" : "Pause"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Recommencer
            </Button>
          </div>

          {/* Touch D-Pad */}
          <div className="grid grid-cols-3 gap-2 md:hidden mt-2 select-none">
            <div />
            <Button variant="glass" size="icon" onClick={() => tryTurn("UP")}>↑</Button>
            <div />
            <Button variant="glass" size="icon" onClick={() => tryTurn("LEFT")}>←</Button>
            <Button variant="glass" size="icon" onClick={() => tryTurn("DOWN")}>↓</Button>
            <Button variant="glass" size="icon" onClick={() => tryTurn("RIGHT")}>→</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SnakeGame;
