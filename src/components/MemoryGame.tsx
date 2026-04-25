import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameScene3D from "./GameScene3D";
import ConfettiBurst3D from "./ConfettiBurst3D";

const EMOJIS = ["🦋", "🌸", "🌙", "⭐", "🎵", "💜", "🪐", "🌷"];

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const buildDeck = (): Card[] => {
  const deck = [...EMOJIS, ...EMOJIS]
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5)
    .map((c, i) => ({ ...c, id: i }));
  return deck;
};

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [matchBurst, setMatchBurst] = useState(0);
  const [winBurst, setWinBurst] = useState(0);

  const won = useMemo(() => cards.length > 0 && cards.every((c) => c.matched), [cards]);

  useEffect(() => {
    if (won) setWinBurst((n) => n + 1);
  }, [won]);

  useEffect(() => {
    if (selected.length !== 2) return;
    setLocked(true);
    const [a, b] = selected;
    const cardA = cards.find((c) => c.id === a)!;
    const cardB = cards.find((c) => c.id === b)!;
    const isMatch = cardA.emoji === cardB.emoji;

    const t = setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.id === a || c.id === b
            ? { ...c, matched: isMatch, flipped: isMatch }
            : c
        )
      );
      if (isMatch) setMatchBurst((n) => n + 1);
      setSelected([]);
      setLocked(false);
    }, isMatch ? 450 : 800);

    return () => clearTimeout(t);
  }, [selected, cards]);

  const handleFlip = (id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setSelected((prev) => {
      const next = [...prev, id];
      if (next.length === 2) setMoves((m) => m + 1);
      return next;
    });
  };

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <section id="games" className="relative py-32 overflow-hidden">
      {/* 3D animated header */}
      <div className="absolute top-0 left-0 right-0 h-[420px] -z-10 pointer-events-none opacity-80">
        <GameScene3D />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[420px] -z-10 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-12 text-center mx-auto"
        >
          <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
            🎮 Arcade Zone
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Butterfly <span className="name-gradient">Memory</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Find all matching pairs. Take a little break and have fun 🦋
          </p>
        </motion.div>

        <div className="relative rounded-3xl bg-gradient-card glass shadow-soft glow-border p-6 md:p-10 overflow-hidden">
          <ConfettiBurst3D trigger={matchBurst} count={50} />
          <ConfettiBurst3D trigger={winBurst} count={150} />
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Moves</p>
                <p className="font-display text-3xl font-bold">{moves}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Pairs</p>
                <p className="font-display text-3xl font-bold">
                  {cards.filter((c) => c.matched).length / 2}
                  <span className="text-muted-foreground text-lg">/{EMOJIS.length}</span>
                </p>
              </div>
            </div>
            <Button onClick={reset} variant="glass" className="gap-2">
              <RotateCcw className="h-4 w-4" /> New game
            </Button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {cards.map((card) => {
              const isUp = card.flipped || card.matched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  className="relative aspect-square [perspective:1000px] focus:outline-none"
                  aria-label="memory card"
                >
                  <motion.div
                    animate={{ rotateY: isUp ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative h-full w-full [transform-style:preserve-3d]"
                  >
                    {/* Back */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center [backface-visibility:hidden]">
                      <Sparkles className="h-6 w-6 text-white/80" />
                    </div>
                    {/* Front */}
                    <div
                      className={`absolute inset-0 rounded-2xl glass flex items-center justify-center text-3xl md:text-4xl [transform:rotateY(180deg)] [backface-visibility:hidden] transition-smooth ${
                        card.matched ? "ring-2 ring-primary-glow shadow-elegant" : ""
                      }`}
                    >
                      {card.emoji}
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {won && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-primary/20 glass p-6"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary-glow" />
                  <div>
                    <p className="font-display text-2xl font-bold">You won! 🎉</p>
                    <p className="text-muted-foreground text-sm">
                      Finished in {moves} moves.
                    </p>
                  </div>
                </div>
                <Button onClick={reset} variant="hero" className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Play again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MemoryGame;
