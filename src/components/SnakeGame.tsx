import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, RotateCcw, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section id="snake" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-4">
            <Gamepad2 className="h-3.5 w-3.5 text-primary" />
            Mini-jeu
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Snake <span className="text-gradient">Classic</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Mange les pommes 🍎, grandis, et évite les murs et ta queue. Flèches / WASD pour bouger, Espace pour pause.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="glass rounded-full px-4 py-2">
              Score: <span className="text-primary font-bold">{score}</span>
            </div>
            <div className="glass rounded-full px-4 py-2">
              Best: <span className="text-accent font-bold">{best}</span>
            </div>
          </div>

          <div
            className="relative glow-border rounded-2xl overflow-hidden shadow-elegant bg-gradient-card"
            style={{ width: SIZE, height: SIZE, maxWidth: "90vw", maxHeight: "90vw" }}
          >
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                backgroundSize: `${CELL}px ${CELL}px`,
              }}
            />

            {/* Food */}
            <motion.div
              key={`${food.x}-${food.y}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="absolute rounded-full"
              style={{
                width: CELL - 4,
                height: CELL - 4,
                left: food.x * CELL + 2,
                top: food.y * CELL + 2,
                background:
                  "radial-gradient(circle at 30% 30%, hsl(0 100% 70%), hsl(340 90% 55%))",
                boxShadow: "0 0 12px hsl(340 100% 60% / 0.7)",
              }}
            />

            {/* Snake */}
            {snake.map((s, i) => {
              const isHead = i === 0;
              return (
                <div
                  key={i}
                  className="absolute rounded-md"
                  style={{
                    width: CELL - 2,
                    height: CELL - 2,
                    left: s.x * CELL + 1,
                    top: s.y * CELL + 1,
                    background: isHead
                      ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))"
                      : `hsl(${250 + i * 2} 80% ${65 - Math.min(i, 25)}%)`,
                    boxShadow: isHead
                      ? "0 0 14px hsl(var(--primary) / 0.7)"
                      : "0 0 4px hsl(var(--primary) / 0.3)",
                    transition: "background 0.2s",
                  }}
                />
              );
            })}

            {/* Overlays */}
            {(paused || over) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                <p className="font-display text-3xl font-bold mb-2">
                  {over ? "Game Over" : "Pause"}
                </p>
                {over && (
                  <p className="text-muted-foreground mb-4">Score final: {score}</p>
                )}
                <Button
                  variant="hero"
                  onClick={() => (over ? reset() : setPaused(false))}
                >
                  {over ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" /> Rejouer
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Reprendre
                    </>
                  )}
                </Button>
              </div>
            )}
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
