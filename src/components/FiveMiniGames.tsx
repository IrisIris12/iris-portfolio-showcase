import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Brain, CircleDot, Hand, Hash, MousePointerClick, RotateCcw, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mark = "X" | "O" | null;
type Choice = "Pierre" | "Feuille" | "Ciseaux";
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const choices: Choice[] = ["Pierre", "Feuille", "Ciseaux"];
const colorTargets = [
  { name: "Rose", value: "hsl(194, 90%, 65%)" },
  { name: "Cyan", value: "hsl(0, 0%, 0%)" },
  { name: "Jaune", value: "hsl(48, 85%, 46%)" },
  { name: "Vert", value: "hsl(199, 77%, 49%)" },
  { name: "Violet", value: "hsl(284, 97%, 61%)" },
];

const winnerFor = (board: Mark[]) => {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? "Draw" : null;
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const raisedPanel =
  "relative rounded-lg border border-white/10 bg-black/30 shadow-[0_18px_28px_hsl(240_70%_3%_/_0.36),inset_0_1px_0_hsl(0_0%_100%_/_0.10)] [transform:translateZ(34px)]";

const pressable3d =
  "transition duration-200 [transform:translateZ(28px)] hover:[transform:translateZ(40px)_translateY(-3px)] active:[transform:translateZ(12px)_translateY(2px)]";

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Exclude<Mark, null>>("X");
  const winner = winnerFor(board);

  const play = (index: number) => {
    if (board[index] || winner) return;
    setBoard((current) => current.map((cell, i) => (i === index ? turn : cell)));
    setTurn((current) => (current === "X" ? "O" : "X"));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
  };

  return (
    <MiniGameCard
      icon={CircleDot}
      title="Morpion"
      subtitle={winner ? (winner === "Draw" ? "Match nul" : `${winner} gagne`) : `Tour de ${turn}`}
      accent="hsl(190 90% 58%)"
    >
      <div className={`grid grid-cols-3 gap-2 p-2 ${raisedPanel}`}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => play(index)}
            className={`aspect-square rounded-md border border-white/15 bg-white/[0.06] text-3xl font-black shadow-[0_10px_0_hsl(190_90%_20%_/_0.35),0_18px_24px_hsl(0_0%_0%_/_0.28),inset_0_1px_0_hsl(0_0%_100%_/_0.12)] hover:border-cyan-300/70 hover:bg-cyan-300/15 ${pressable3d}`}
            aria-label={`Case ${index + 1}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <Button variant="glass" size="sm" onClick={reset}>
        <RotateCcw className="h-4 w-4" /> Rejouer
      </Button>
    </MiniGameCard>
  );
};

const GuessNumberGame = () => {
  const [target, setTarget] = useState(() => randomInt(1, 20));
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Devine un nombre entre 1 et 20.");
  const [tries, setTries] = useState(0);

  const check = () => {
    const value = Number(guess);
    if (!value) {
      setMessage("Entre un nombre valide.");
      return;
    }
    setTries((n) => n + 1);
    if (value === target) setMessage(`Bravo, trouve en ${tries + 1} essai(s) !`);
    else setMessage(value < target ? "Plus grand." : "Plus petit.");
  };

  const reset = () => {
    setTarget(randomInt(1, 20));
    setGuess("");
    setTries(0);
    setMessage("Nouveau nombre pret.");
  };

  return (
    <MiniGameCard icon={Hash} title="Nombre mystere" subtitle={`${tries} essai(s)`} accent="hsl(48 95% 58%)">
      <div className={`flex gap-2 p-2 ${raisedPanel}`}>
        <input
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && check()}
          className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm shadow-inner outline-none transition focus:border-yellow-300/70 focus:ring-2 focus:ring-yellow-300/30"
          inputMode="numeric"
          placeholder="1-20"
        />
        <Button variant="hero" size="sm" onClick={check}>OK</Button>
      </div>
      <p className="min-h-10 text-sm text-muted-foreground">{message}</p>
      <Button variant="glass" size="sm" onClick={reset}>
        <RotateCcw className="h-4 w-4" /> Nouveau
      </Button>
    </MiniGameCard>
  );
};

const ReactionGame = () => {
  const [status, setStatus] = useState<"idle" | "wait" | "go" | "done">("idle");
  const [result, setResult] = useState("Clique sur Start puis attends le signal.");
  const startedAt = useRef(0);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = () => {
    window.clearTimeout(timer.current);
    setStatus("wait");
    setResult("Attends...");
    timer.current = window.setTimeout(() => {
      startedAt.current = performance.now();
      setStatus("go");
      setResult("Clique !");
    }, randomInt(900, 2600));
  };

  const tap = () => {
    if (status === "wait") {
      window.clearTimeout(timer.current);
      setStatus("idle");
      setResult("Trop tot. Recommence.");
      return;
    }
    if (status === "go") {
      const ms = Math.round(performance.now() - startedAt.current);
      setStatus("done");
      setResult(`${ms} ms`);
    }
  };

  return (
    <MiniGameCard icon={Zap} title="Reflexe" subtitle={status === "go" ? "Maintenant" : "Vitesse"} accent="hsl(145 70% 48%)">
      <button
        onClick={tap}
        className={`h-32 rounded-lg border text-xl font-black shadow-[0_16px_0_hsl(145_80%_14%_/_0.45),0_30px_42px_hsl(0_0%_0%_/_0.35),inset_0_1px_0_hsl(0_0%_100%_/_0.16)] ${pressable3d} ${
          status === "go"
            ? "border-emerald-300 bg-emerald-400/25 text-emerald-100 shadow-[0_0_34px_hsl(145_70%_48%_/_0.35)]"
            : "border-white/15 bg-black/30 text-foreground"
        }`}
      >
        {result}
      </button>
      <Button variant="hero" size="sm" onClick={start}>Start</Button>
    </MiniGameCard>
  );
};

const ColorClickGame = () => {
  const [target, setTarget] = useState(() => randomInt(0, colorTargets.length - 1));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || time <= 0) return;
    const id = window.setInterval(() => setTime((n) => n - 1), 1000);
    return () => window.clearInterval(id);
  }, [running, time]);

  const start = () => {
    setScore(0);
    setTime(20);
    setRunning(true);
    setTarget(randomInt(0, colorTargets.length - 1));
  };

  const pick = (index: number) => {
    if (!running || time <= 0) return;
    if (index === target) {
      setScore((n) => n + 1);
      setTarget(randomInt(0, colorTargets.length - 1));
    } else {
      setScore((n) => Math.max(0, n - 1));
    }
  };

  return (
    <MiniGameCard icon={MousePointerClick} title="Couleur rapide" subtitle={`Score ${score} · ${time}s`} accent="hsl(330 90% 65%)">
      <p className="text-center text-sm text-muted-foreground">
        Clique sur <span className="font-bold text-foreground">{colorTargets[target].name}</span>
      </p>
      <div className={`grid grid-cols-5 gap-2 p-2 ${raisedPanel}`}>
        {colorTargets.map((color, index) => (
          <button
            key={color.name}
            onClick={() => pick(index)}
            className={`aspect-square rounded-md border border-white/25 hover:border-white/70 ${pressable3d}`}
            style={{
              background: `linear-gradient(145deg, hsl(0 0% 100% / 0.25), ${color.value} 45%, hsl(240 35% 5% / 0.25))`,
              boxShadow: `0 10px 0 hsl(240 50% 4% / 0.45), 0 18px 24px ${color.value.replace(")", " / 0.28)")}, inset 0 1px 0 hsl(0 0% 100% / 0.32)`,
            }}
            aria-label={color.name}
          />
        ))}
      </div>
      <Button variant="hero" size="sm" onClick={start}>{running && time > 0 ? "Restart" : "Start"}</Button>
    </MiniGameCard>
  );
};

const RockPaperScissorsGame = () => {
  const [message, setMessage] = useState("Choisis ton coup.");
  const [score, setScore] = useState({ player: 0, cpu: 0 });

  const play = (player: Choice) => {
    const cpu = choices[randomInt(0, choices.length - 1)];
    const win =
      (player === "Pierre" && cpu === "Ciseaux") ||
      (player === "Feuille" && cpu === "Pierre") ||
      (player === "Ciseaux" && cpu === "Feuille");
    if (player === cpu) {
      setMessage(`${player} vs ${cpu} : egalite.`);
      return;
    }
    setScore((current) => ({
      player: current.player + (win ? 1 : 0),
      cpu: current.cpu + (win ? 0 : 1),
    }));
    setMessage(`${player} vs ${cpu} : ${win ? "tu gagnes" : "ordi gagne"}.`);
  };

  return (
    <MiniGameCard icon={Hand} title="Pierre Feuille Ciseaux" subtitle={`${score.player} - ${score.cpu}`} accent="hsl(270 85% 68%)">
      <div className={`grid grid-cols-3 gap-2 p-2 ${raisedPanel}`}>
        {choices.map((choice) => (
          <Button key={choice} variant="glass" size="sm" onClick={() => play(choice)} className={`h-auto min-h-10 whitespace-normal px-2 shadow-[0_8px_0_hsl(270_85%_18%_/_0.45)] ${pressable3d}`}>
            {choice}
          </Button>
        ))}
      </div>
      <p className="min-h-10 text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={() => setScore({ player: 0, cpu: 0 })}>
        <RotateCcw className="h-4 w-4" /> Reset score
      </Button>
    </MiniGameCard>
  );
};

const MiniGameCard = ({
  icon: Icon,
  title,
  subtitle,
  accent,
  children,
}: {
  icon: typeof Brain;
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    whileHover={{ y: -12, rotateX: 5, rotateY: -5 }}
    transition={{ type: "spring", stiffness: 260, damping: 22 }}
    className="group relative flex min-h-[350px] flex-col gap-4 overflow-visible rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-soft backdrop-blur-xl [transform-style:preserve-3d]"
    style={{
      boxShadow: `0 18px 60px hsl(240 50% 3% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.08), 0 0 0 1px ${accent.replace(")", " / 0.24)")}`,
      transformPerspective: 1200,
    }}
  >
    <div
      className="absolute inset-0 -z-10 rounded-lg opacity-80 [transform:translate3d(14px,16px,-38px)]"
      style={{
        background: `linear-gradient(145deg, hsl(240 45% 5%), ${accent.replace(")", " / 0.22)")})`,
        boxShadow: "0 26px 52px hsl(240 80% 2% / 0.65)",
      }}
    />
    <div
      className="absolute inset-0 -z-10 rounded-lg border border-white/5 [transform:translateZ(-18px)]"
      style={{ background: "hsl(240 45% 5% / 0.82)" }}
    />
    <div
      className="absolute inset-x-0 top-0 h-1"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
    />
    <div
      className="pointer-events-none absolute inset-0 opacity-35"
      style={{
        backgroundImage:
          "linear-gradient(hsl(0 0% 100% / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.04) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    />
    <div className="relative flex items-start justify-between gap-4 [transform:translateZ(46px)]">
      <div>
        <h3 className="font-display text-2xl font-bold tracking-tight">{title}</h3>
        <p
          className="mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            borderColor: accent.replace(")", " / 0.35)"),
            background: accent.replace(")", " / 0.12)"),
            color: accent,
          }}
        >
          {subtitle}
        </p>
      </div>
      <div
        className="rounded-lg border p-3 shadow-[0_12px_26px_hsl(0_0%_0%_/_0.26)] transition group-hover:scale-105"
        style={{
          borderColor: accent.replace(")", " / 0.35)"),
          background: accent.replace(")", " / 0.12)"),
          color: accent,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="relative flex flex-1 flex-col justify-between gap-4 [transform-style:preserve-3d]">{children}</div>
  </motion.article>
);

const FiveMiniGames = () => {
  const games = useMemo(
    () => [
      <TicTacToeGame key="morpion" />,
      <GuessNumberGame key="guess" />,
      <ReactionGame key="reaction" />,
      <ColorClickGame key="colors" />,
      <RockPaperScissorsGame key="rps" />,
    ],
    [],
  );

  return (
    <section id="mini-games" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(hsl(190 90% 58% / 0.10) 1px, transparent 1px), linear-gradient(90deg, hsl(330 90% 65% / 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-4xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Bonus Arcade
          </div>
          <div className="rounded-lg border border-white/10 bg-black/35 p-4 shadow-[0_24px_60px_hsl(0_0%_0%_/_0.35),inset_0_1px_0_hsl(0_0%_100%_/_0.10)] backdrop-blur-xl [transform:perspective(900px)_rotateX(3deg)]">
            <h2 className="font-display text-4xl font-black md:text-6xl">
              Mini <span className="name-gradient">Game Station</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              5 jeux rapides dans une interface plus arcade, compacte et jouable sur mobile.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-7 [perspective:1400px] md:grid-cols-2 xl:grid-cols-5">{games}</div>
      </div>
    </section>
  );
};

export default FiveMiniGames;
