import { motion } from "framer-motion";
import { Music2, Play, ExternalLink } from "lucide-react";
import Music3DVisualizer from "./Music3DVisualizer";

type Track = {
  title: string;
  artist: string;
  cover: string;
  link: string;
  duration: string;
  mood: string;
};

const tracks: Track[] = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    link: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    duration: "3:20",
    mood: "Synthwave",
  },
  {
    title: "As It Was",
    artist: "Harry Styles",
    cover: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
    link: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7",
    duration: "2:47",
    mood: "Pop",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
    link: "https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9",
    duration: "3:23",
    mood: "Disco",
  },
  {
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    cover: "https://i.scdn.co/image/ab67616d0000b273419b0fec0d6eeb9d1976c4ff",
    link: "https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20",
    duration: "2:21",
    mood: "Pop",
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    link: "https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g",
    duration: "3:35",
    mood: "Synthpop",
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    cover: "https://i.scdn.co/image/ab67616d0000b27312e3f20d05a8d6d4d6e7a6f3",
    link: "https://open.spotify.com/track/02MWAaffLxlfxAUY7c5dvx",
    duration: "3:58",
    mood: "Indie",
  },
];

const Music = () => {
  return (
    <section id="music" className="py-24 relative overflow-hidden">
      <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-green-500/20 blur-3xl -z-10" />
      <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl -z-10" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-4">
            <Music2 className="h-3.5 w-3.5 text-green-400" />
            Ma playlist
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
            On Repeat <span className="text-gradient">🎧</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Les morceaux qui m'accompagnent quand je code, quand je dessine, ou juste pour rêver.
          </p>
        </motion.div>

        {/* 3D Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[280px] md:h-[340px] mb-12 rounded-2xl overflow-hidden glow-border bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-cyan-900/20"
        >
          <Music3DVisualizer />
          <div className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/80">
            ♪ Now spinning
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {tracks.map((track, i) => (
            <motion.a
              key={track.title}
              href={track.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative bg-gradient-card glass rounded-xl p-4 transition-all hover:shadow-elegant"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                <img
                  src={track.cover}
                  alt={`Pochette de ${track.title} par ${track.artist}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center shadow-elegant translate-y-2 group-hover:translate-y-0 transition-transform"
                    style={{
                      background: "hsl(141 76% 48%)",
                      boxShadow: "0 8px 24px hsl(141 76% 48% / 0.5)",
                    }}
                  >
                    <Play className="h-5 w-5 fill-black text-black ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full bg-background/70 backdrop-blur-md text-foreground">
                  {track.mood}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base truncate group-hover:text-green-400 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 mt-0.5 font-mono">
                  {track.duration}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-green-400 transition-colors"
          >
            Écouter la playlist complète sur Spotify
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Music;
