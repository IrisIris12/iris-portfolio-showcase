import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import arcadeKawaii from "@/assets/games/arcade-kawaii.jpg";
import controllerCute from "@/assets/games/controller-cute.jpg";
import snakeCute from "@/assets/games/snake-cute.jpg";
import bubblesKawaii from "@/assets/games/bubbles-kawaii.jpg";
import dinoCute from "@/assets/games/dino-cute.jpg";
import memoryCute from "@/assets/games/memory-cute.jpg";
import arcadeNeon from "@/assets/games/arcade-neon.jpg";
import joystickHearts from "@/assets/games/joystick-hearts.jpg";

const images = [
  { src: arcadeKawaii, label: "Arcade", emoji: "🕹️" },
  { src: controllerCute, label: "Controller", emoji: "🎮" },
  { src: snakeCute, label: "Snake", emoji: "🐍" },
  { src: bubblesKawaii, label: "Bubbles", emoji: "🫧" },
  { src: dinoCute, label: "Dino", emoji: "🦖" },
  { src: memoryCute, label: "Memory", emoji: "🧠" },
  { src: arcadeNeon, label: "Neon", emoji: "✨" },
  { src: joystickHearts, label: "Love Play", emoji: "💖" },
];

// Doubled for seamless infinite loop
const loop = [...images, ...images];

const Particle = ({ i }: { i: number }) => {
  const left = (i * 137) % 100;
  const delay = (i % 8) * 0.6;
  const duration = 8 + (i % 5) * 2;
  const size = 8 + (i % 4) * 6;
  const emoji = ["✨", "💖", "⭐", "🌸", "🫧", "🎮"][i % 6];
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${left}%`, fontSize: size, bottom: -40 }}
      initial={{ y: 0, opacity: 0, rotate: 0 }}
      animate={{
        y: -600,
        opacity: [0, 1, 1, 0],
        rotate: 360,
        x: [0, 30, -20, 10],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {emoji}
    </motion.div>
  );
};

const GamesGallery = () => {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      setTilt({ x: (cy / r.height) * -8, y: (cx / r.width) * 8 });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, hsl(330 100% 88% / 0.4), transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(280 100% 85% / 0.4), transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(200 100% 88% / 0.3), transparent 60%)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <Particle key={i} i={i} />
        ))}
      </div>

      <div className="container mb-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4 border backdrop-blur-sm"
            style={{
              borderColor: "hsl(330 100% 75% / 0.5)",
              background: "hsl(330 100% 95% / 0.6)",
              color: "hsl(330 70% 45%)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Games Gallery
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
            Bienvenue dans l'Arcade Zone 🎀
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Plonge dans un univers kawaii — survole pour incliner, le carrousel défile à l'infini ✨
          </p>
        </motion.div>
      </div>

      {/* Infinite carousel */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden py-6"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setTilt({ x: 0, y: 0 });
        }}
      >
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-32 z-20 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 z-20 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: paused ? undefined : ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.3s ease-out",
          }}
        >
          {loop.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, y: -8, rotate: i % 2 === 0 ? -2 : 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative shrink-0 group cursor-pointer"
              style={{ width: 260, height: 260 }}
            >
              <div
                className="absolute -inset-1 rounded-3xl opacity-60 group-hover:opacity-100 blur-xl transition-opacity"
                style={{
                  background: `linear-gradient(135deg, hsl(${(i * 45) % 360} 100% 75%), hsl(${
                    (i * 45 + 60) % 360
                  } 100% 75%))`,
                }}
              />
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden border-4"
                style={{
                  borderColor: "hsl(0 0% 100% / 0.7)",
                  boxShadow:
                    "0 20px 50px hsl(330 50% 60% / 0.35), inset 0 0 20px hsl(0 0% 100% / 0.2)",
                }}
              >
                <img
                  src={img.src}
                  alt={`${img.label} kawaii illustration`}
                  loading="lazy"
                  width={260}
                  height={260}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay label */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 text-white font-bold text-lg drop-shadow-lg">
                    <span className="text-2xl">{img.emoji}</span>
                    {img.label}
                  </div>
                </div>
                {/* Sparkle on hover */}
                <div className="absolute top-3 right-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  ✨
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <p className="text-center mt-8 text-sm text-muted-foreground">
        ↓ Scroll pour jouer aux jeux ↓
      </p>
    </section>
  );
};

export default GamesGallery;
