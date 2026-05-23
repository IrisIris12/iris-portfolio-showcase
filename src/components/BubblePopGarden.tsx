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
      {/* Arcade garden background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(224 70% 7% / 0.92), hsl(260 62% 10% / 0.72) 48%, hsl(148 55% 9% / 0.82)), linear-gradient(90deg, hsl(178 90% 62% / 0.08) 1px, transparent 1px), linear-gradient(hsl(330 90% 68% / 0.08) 1px, transparent 1px)",
            backgroundSize: "auto, 54px 54px, 54px 54px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-100 shadow-[0_0_24px_hsl(145_70%_48%_/_0.18)] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Garden Arcade
          </div>
          <h2
            className="font-display text-5xl md:text-6xl font-black mb-3"
            style={{
              background:
                "linear-gradient(90deg, hsl(145 85% 62%), hsl(190 90% 66%), hsl(330 90% 70%))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 22px hsl(170 90% 60% / 0.35))",
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
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold [perspective:900px]">
            <div
              className="rounded-lg border px-5 py-2.5 backdrop-blur-md shadow-[0_12px_0_hsl(145_70%_12%_/_0.35),0_22px_36px_hsl(0_0%_0%_/_0.24)] [transform:rotateX(8deg)]"
              style={{
                borderColor: "hsl(145 80% 65% / 0.35)",
                background: "hsl(145 70% 12% / 0.72)",
                color: "hsl(145 90% 78%)",
              }}
            >
              Score <span className="font-black ml-2">{score}</span>
            </div>
            <div
              className="rounded-lg border px-5 py-2.5 backdrop-blur-md shadow-[0_12px_0_hsl(270_70%_13%_/_0.35),0_22px_36px_hsl(0_0%_0%_/_0.24)] [transform:rotateX(8deg)]"
              style={{
                borderColor: "hsl(280 80% 72% / 0.35)",
                background: "hsl(280 60% 13% / 0.72)",
                color: "hsl(280 90% 80%)",
              }}
            >
              Best <span className="font-black ml-2">{best}</span>
            </div>
            <div
              className="rounded-lg border px-5 py-2.5 backdrop-blur-md shadow-[0_12px_0_hsl(195_70%_13%_/_0.35),0_22px_36px_hsl(0_0%_0%_/_0.24)] [transform:rotateX(8deg)]"
              style={{
                borderColor: "hsl(190 85% 65% / 0.35)",
                background: "hsl(195 75% 12% / 0.72)",
                color: "hsl(190 95% 78%)",
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
                  className="rounded-lg px-5 py-2.5 font-black shadow-[0_12px_26px_hsl(330_80%_45%_/_0.28)]"
                  style={{
                    background: "linear-gradient(135deg, hsl(45 100% 60%), hsl(330 100% 65%))",
                    color: "white",
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
            className="relative w-full max-w-3xl select-none overflow-hidden rounded-2xl border"
            style={{
              height: "min(70vh, 560px)",
              borderColor: "hsl(160 70% 70% / 0.42)",
              backgroundImage:
                "linear-gradient(180deg, hsl(218 75% 13%) 0%, hsl(250 66% 16%) 42%, hsl(160 62% 17%) 100%)",
              boxShadow:
                "0 28px 0 hsl(158 55% 8% / 0.65), 0 44px 90px hsl(0 0% 0% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.16), inset 0 0 80px hsl(190 90% 62% / 0.12)",
              perspective: "900px",
            }}
          >
            {/* Scene layers */}
            <div
              className="absolute inset-x-0 top-0 h-40 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, hsl(190 100% 70% / 0.16), transparent), repeating-linear-gradient(90deg, transparent 0 34px, hsl(190 90% 70% / 0.12) 34px 35px)",
              }}
            />
            <div
              className="absolute inset-x-[-10%] bottom-[-12%] h-56 pointer-events-none rounded-[45%_45%_0_0]"
              style={{
                background:
                  "linear-gradient(180deg, hsl(140 60% 35%), hsl(155 70% 14%))",
                boxShadow: "inset 0 22px 30px hsl(80 90% 70% / 0.14)",
                transform: "rotateX(58deg)",
                transformOrigin: "bottom center",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsl(145 90% 65% / 0.16) 1px, transparent 1px), linear-gradient(hsl(145 90% 70% / 0.12) 1px, transparent 1px)",
                backgroundSize: "34px 24px",
                transform: "perspective(520px) rotateX(58deg) translateY(24px)",
                transformOrigin: "bottom center",
              }}
            />
            <div className="absolute bottom-5 left-8 text-3xl opacity-80 pointer-events-none drop-shadow-lg">🌷</div>
            <div className="absolute bottom-8 left-1/3 text-2xl opacity-75 pointer-events-none drop-shadow-lg">🌼</div>
            <div className="absolute bottom-6 right-10 text-3xl opacity-80 pointer-events-none drop-shadow-lg">🌸</div>

            {/* Bubbles */}
            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={(e) => popBubble(b, e)}
                onTouchStart={(e) => popBubble(b, e)}
                className="absolute flex cursor-pointer items-center justify-center rounded-full border transition-transform duration-200 hover:scale-110 active:scale-90"
                style={{
                  left: `calc(${b.x}% - ${b.size / 2}px)`,
                  top: b.y,
                  width: b.size,
                  height: b.size,
                  background: `radial-gradient(circle at 28% 24%, hsl(0 0% 100% / 0.96) 0 12%, hsl(${b.hue} 100% 86% / 0.62) 34%, hsl(${b.hue} 100% 65% / 0.34) 66%, hsl(${b.hue} 100% 55% / 0.18))`,
                  borderColor: `hsl(${b.hue} 100% 82% / 0.75)`,
                  boxShadow: `0 16px 28px hsl(${b.hue} 100% 45% / 0.28), 0 2px 0 hsl(0 0% 100% / 0.34) inset, inset -10px -14px 22px hsl(${b.hue} 100% 42% / 0.24), inset 9px 9px 16px hsl(0 0% 100% / 0.58)`,
                  fontSize: b.size * 0.5,
                  transform: `translate3d(${Math.sin((performance.now() / 600) + b.wobble) * 14}px, 0, 80px) rotateX(10deg)`,
                  backdropFilter: "blur(3px)",
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
                    background: "hsl(0 0% 100% / 0.9)",
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
                  animate={{ scale: 1.8, opacity: 0, y: -58, rotate: 10 }}
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
                style={{ background: "hsl(220 70% 7% / 0.72)" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-2xl border border-white/12 bg-black/45 px-8 py-7 text-center shadow-[0_24px_80px_hsl(0_0%_0%_/_0.45),inset_0_1px_0_hsl(0_0%_100%_/_0.12)]"
                >
                  {over ? (
                    <>
                      <div className="text-6xl mb-3">🎉</div>
                      <p className="font-display text-4xl font-black mb-2" style={{ color: "hsl(145 90% 72%)" }}>
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
                      <p className="font-display text-3xl font-black mb-2" style={{ color: "hsl(145 90% 72%)" }}>
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
