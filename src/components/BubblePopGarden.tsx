import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Bubble = {
  id: number;
  x: number; // 0..100 (%)
  size: number; // px
  speed: number; // px/s
  y: number; // px from bottom
  emoji: string;
  hue: number;
  wobble: number;
  born: number;
};

type Pop = {
  id: number;
  x: number;
  y: number;
  emoji: string;
  hue: number;
  combo: number;
};

const CUTE_EMOJIS = ["🐰", "🐱", "🐼", "🦊", "🐻", "🐨", "🐹", "🐧", "🦄", "🐸"];
const BONUS_EMOJI = "⭐";
const HEART_EMOJI = "💖";

const GAME_DURATION = 60; // seconds

const BubblePopGarden = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);

  const fieldRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);
  const lastPopAt = useRef(0);
  const lastSpawnAt = useRef(0);
  const rafRef = useRef<number>();
  const lastFrameAt = useRef(performance.now());

  useEffect(() => {
    const stored = localStorage.getItem("bubble-pop-best");
    if (stored) setBest(Number(stored));
  }, []);

  const reset = useCallback(() => {
    setBubbles([]);
    setPops([]);
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setOver(false);
    setRunning(true);
    lastPopAt.current = 0;
    lastSpawnAt.current = 0;
    lastFrameAt.current = performance.now();
  }, []);

  // Timer
  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setOver(true);
          setRunning(false);
          setBest((b) => {
            const nb = Math.max(b, score);
            localStorage.setItem("bubble-pop-best", String(nb));
            return nb;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, over, score]);

  // Game loop: spawn + move bubbles
  useEffect(() => {
    if (!running || over) return;

    const tick = (now: number) => {
      const dt = Math.min(50, now - lastFrameAt.current) / 1000;
      lastFrameAt.current = now;

      const fieldH = fieldRef.current?.clientHeight ?? 500;

      // Spawn
      const spawnInterval = Math.max(280, 900 - (GAME_DURATION - timeLeft) * 10);
      if (now - lastSpawnAt.current > spawnInterval) {
        lastSpawnAt.current = now;
        const isBonus = Math.random() < 0.08;
        const isHeart = !isBonus && Math.random() < 0.06;
        const emoji = isBonus
          ? BONUS_EMOJI
          : isHeart
          ? HEART_EMOJI
          : CUTE_EMOJIS[Math.floor(Math.random() * CUTE_EMOJIS.length)];
        const newB: Bubble = {
          id: idRef.current++,
          x: 8 + Math.random() * 84,
          size: 52 + Math.random() * 36,
          speed: 55 + Math.random() * 70,
          y: -60,
          emoji,
          hue: Math.floor(Math.random() * 360),
          wobble: Math.random() * Math.PI * 2,
          born: now,
        };
        setBubbles((prev) => [...prev, newB]);
      }

      // Move + cull
      setBubbles((prev) => {
        const next: Bubble[] = [];
        for (const b of prev) {
          const ny = b.y + b.speed * dt;
          if (ny < fieldH + 80) {
            next.push({ ...b, y: ny });
          } else {
            // missed (only counts for cute animals, not bonuses)
            if (b.emoji !== BONUS_EMOJI && b.emoji !== HEART_EMOJI) {
              setCombo(0);
            }
          }
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, over, timeLeft]);

  // Cleanup pops
  useEffect(() => {
    if (pops.length === 0) return;
    const id = setTimeout(() => {
      setPops((prev) => prev.slice(Math.max(0, prev.length - 12)));
    }, 900);
    return () => clearTimeout(id);
  }, [pops]);

  const popBubble = (b: Bubble, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!running || over) return;
    const now = performance.now();
    const fieldRect = fieldRef.current?.getBoundingClientRect();
    if (!fieldRect) return;

    let cx = 0;
    let cy = 0;
    if ("touches" in e && e.touches[0]) {
      cx = e.touches[0].clientX - fieldRect.left;
      cy = e.touches[0].clientY - fieldRect.top;
    } else if ("clientX" in e) {
      cx = (e as React.MouseEvent).clientX - fieldRect.left;
      cy = (e as React.MouseEvent).clientY - fieldRect.top;
    }

    // Combo if popped within 1.2s
    let nextCombo = 1;
    setCombo((c) => {
      nextCombo = now - lastPopAt.current < 1200 ? c + 1 : 1;
      return nextCombo;
    });
    lastPopAt.current = now;

    let basePoints = 10;
    if (b.emoji === BONUS_EMOJI) basePoints = 50;
    if (b.emoji === HEART_EMOJI) {
      basePoints = 0;
      setTimeLeft((t) => Math.min(GAME_DURATION, t + 3));
    }
    const gained = basePoints * Math.max(1, nextCombo);
    setScore((s) => s + gained);

    setPops((prev) => [
      ...prev,
      { id: idRef.current++, x: cx, y: cy, emoji: b.emoji, hue: b.hue, combo: nextCombo },
    ]);
    setBubbles((prev) => prev.filter((x) => x.id !== b.id));
  };

  return (
    <section id="bubble-pop" className="py-24 relative overflow-hidden">
      {/* Soft pastel background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 10%, hsl(330 100% 88% / 0.35), transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(200 100% 85% / 0.35), transparent 50%), radial-gradient(ellipse at 50% 90%, hsl(280 100% 88% / 0.3), transparent 50%)",
          }}
        />
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
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4 border"
            style={{
              borderColor: "hsl(330 100% 75% / 0.5)",
              background: "hsl(330 100% 95% / 0.6)",
              color: "hsl(330 70% 45%)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Kawaii Game · Free
          </div>
          <h2
            className="font-display text-5xl md:text-6xl font-black mb-3"
            style={{
              background:
                "linear-gradient(90deg, hsl(330 90% 65%), hsl(280 90% 70%), hsl(200 90% 65%))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bubble Pop Garden 🌸
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fais éclater les bulles d'animaux mignons ! ⭐ = bonus points · 💖 = +3s
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          {/* HUD */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            <div
              className="px-5 py-2.5 rounded-full border backdrop-blur-sm"
              style={{
                borderColor: "hsl(330 80% 70% / 0.5)",
                background: "hsl(330 100% 97% / 0.7)",
                color: "hsl(330 70% 45%)",
              }}
            >
              Score <span className="font-black ml-2">{score}</span>
            </div>
            <div
              className="px-5 py-2.5 rounded-full border backdrop-blur-sm"
              style={{
                borderColor: "hsl(280 80% 70% / 0.5)",
                background: "hsl(280 100% 97% / 0.7)",
                color: "hsl(280 70% 45%)",
              }}
            >
              Best <span className="font-black ml-2">{best}</span>
            </div>
            <div
              className="px-5 py-2.5 rounded-full border backdrop-blur-sm"
              style={{
                borderColor: "hsl(200 80% 70% / 0.5)",
                background: "hsl(200 100% 97% / 0.7)",
                color: "hsl(200 70% 40%)",
              }}
            >
              Time <span className="font-black ml-2">{timeLeft}s</span>
            </div>
            <AnimatePresence>
              {combo > 1 && (
                <motion.div
                  key={combo}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.4, opacity: 0 }}
                  className="px-5 py-2.5 rounded-full font-black"
                  style={{
                    background: "linear-gradient(90deg, hsl(45 100% 60%), hsl(330 100% 65%))",
                    color: "white",
                    boxShadow: "0 6px 20px hsl(330 100% 60% / 0.5)",
                  }}
                >
                  Combo x{combo} 🔥
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Game field */}
          <div
            ref={fieldRef}
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden border-4 select-none"
            style={{
              height: "min(70vh, 560px)",
              borderColor: "hsl(330 80% 85%)",
              background:
                "linear-gradient(180deg, hsl(200 100% 95%) 0%, hsl(280 100% 96%) 50%, hsl(330 100% 95%) 100%)",
              boxShadow:
                "0 20px 60px hsl(330 50% 60% / 0.25), inset 0 0 60px hsl(280 100% 90% / 0.4)",
            }}
          >
            {/* Decorative clouds */}
            <div className="absolute top-4 left-6 text-4xl opacity-60 pointer-events-none">☁️</div>
            <div className="absolute top-10 right-12 text-3xl opacity-50 pointer-events-none">☁️</div>
            <div className="absolute bottom-6 left-1/3 text-2xl opacity-40 pointer-events-none">🌷</div>
            <div className="absolute bottom-4 right-8 text-3xl opacity-50 pointer-events-none">🌼</div>
            <div className="absolute bottom-8 left-8 text-2xl opacity-40 pointer-events-none">🌸</div>

            {/* Bubbles */}
            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={(e) => popBubble(b, e)}
                onTouchStart={(e) => popBubble(b, e)}
                className="absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                style={{
                  left: `calc(${b.x}% - ${b.size / 2}px)`,
                  top: b.y,
                  width: b.size,
                  height: b.size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.9), hsl(${b.hue} 100% 80% / 0.5) 60%, hsl(${b.hue} 100% 70% / 0.3))`,
                  border: `2px solid hsl(${b.hue} 100% 75% / 0.7)`,
                  boxShadow: `0 4px 20px hsl(${b.hue} 100% 60% / 0.4), inset 0 -8px 16px hsl(${b.hue} 100% 70% / 0.3), inset 4px 4px 12px hsl(0 0% 100% / 0.6)`,
                  fontSize: b.size * 0.5,
                  transform: `translateX(${Math.sin((performance.now() / 600) + b.wobble) * 14}px)`,
                }}
                aria-label={`Pop ${b.emoji}`}
              >
                <span style={{ filter: "drop-shadow(0 2px 4px hsl(0 0% 0% / 0.2))" }}>
                  {b.emoji}
                </span>
                {/* Highlight */}
                <span
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: b.size * 0.25,
                    height: b.size * 0.25,
                    background: "hsl(0 0% 100% / 0.8)",
                    top: b.size * 0.15,
                    left: b.size * 0.2,
                    filter: "blur(2px)",
                  }}
                />
              </button>
            ))}

            {/* Pop effects */}
            <AnimatePresence>
              {pops.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ scale: 0.6, opacity: 1, y: 0 }}
                  animate={{ scale: 1.6, opacity: 0, y: -50 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute pointer-events-none flex flex-col items-center"
                  style={{ left: p.x - 30, top: p.y - 30, width: 60 }}
                >
                  <div className="text-3xl">{p.emoji}✨</div>
                  {p.combo > 1 && (
                    <div
                      className="text-sm font-black"
                      style={{
                        color: `hsl(${p.hue} 90% 50%)`,
                        textShadow: "0 2px 4px hsl(0 0% 100% / 0.8)",
                      }}
                    >
                      x{p.combo}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Start / Game over overlay */}
            {(!running || over) && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
                style={{ background: "hsl(330 100% 97% / 0.7)" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center px-6"
                >
                  {over ? (
                    <>
                      <div className="text-6xl mb-3">🎉</div>
                      <p className="font-display text-4xl font-black mb-2" style={{ color: "hsl(330 70% 45%)" }}>
                        Bravo !
                      </p>
                      <p className="text-lg mb-1">
                        Score : <span className="font-black">{score}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-5">
                        Meilleur : {best}
                      </p>
                      <Button variant="hero" size="lg" onClick={reset}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Rejouer
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-3">🌸</div>
                      <p className="font-display text-3xl font-black mb-2" style={{ color: "hsl(330 70% 45%)" }}>
                        Bubble Pop Garden
                      </p>
                      <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                        Clique sur les bulles avant qu'elles ne s'envolent !
                      </p>
                      <Button variant="hero" size="lg" onClick={reset}>
                        <Play className="h-4 w-4 mr-2" /> Jouer
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Controls */}
          {running && !over && (
            <div className="flex gap-3">
              <Button
                variant="glass"
                onClick={() => {
                  setRunning(false);
                }}
              >
                <Pause className="h-4 w-4 mr-2" /> Pause
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" /> Recommencer
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Heart className="h-3 w-3 fill-current" /> Fait avec amour · 100% gratuit
          </p>
        </div>
      </div>
    </section>
  );
};

export default BubblePopGarden;
