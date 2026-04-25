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
    title: "Dynamite",
    artist: "BTS",
    cover: "https://i.scdn.co/image/ab67616d0000b2735320a8d15035b337b3d23ee0",
    link: "https://open.spotify.com/track/0t1kP63rueHleOhQkYSXFY",
    duration: "3:19",
    mood: "Disco-Pop",
  },
  {
    title: "How You Like That",
    artist: "BLACKPINK",
    cover: "https://i.scdn.co/image/ab67616d0000b273c50ad77b1ae0b246b8a4f0a5",
    link: "https://open.spotify.com/track/4SFknyjLcyTLJFPKD2m96o",
    duration: "3:01",
    mood: "Hip-Hop",
  },
  {
    title: "Super Shy",
    artist: "NewJeans",
    cover: "https://i.scdn.co/image/ab67616d0000b273e72b7e64668b4a07b32cf591",
    link: "https://open.spotify.com/track/5sdQOyqq2IDhvmx2lHOpwd",
    duration: "2:34",
    mood: "Bubblegum",
  },
  {
    title: "God's Menu",
    artist: "Stray Kids",
    cover: "https://i.scdn.co/image/ab67616d0000b273f6c2c0d9f97a6c1fd1ebf6a4",
    link: "https://open.spotify.com/track/3VqeTFIvhxu3DIe4eZVzGq",
    duration: "3:29",
    mood: "Hip-Hop",
  },
  {
    title: "FANCY",
    artist: "TWICE",
    cover: "https://i.scdn.co/image/ab67616d0000b27348d4317103ea9bd16a4e1cd0",
    link: "https://open.spotify.com/track/3DamFFqW32WihKkTVlwTYQ",
    duration: "3:33",
    mood: "K-Pop",
  },
  {
    title: "LALISA",
    artist: "LISA",
    cover: "https://i.scdn.co/image/ab67616d0000b273e0e57f185b59d6651567f3b3",
    link: "https://open.spotify.com/track/0x9XdpFBOkA9KRrtPGFhQA",
    duration: "3:25",
    mood: "Hip-Hop",
  },
  {
    title: "Next Level",
    artist: "aespa",
    cover: "https://i.scdn.co/image/ab67616d0000b27331b50f24b84a37a5f10c5b4d",
    link: "https://open.spotify.com/track/2zrhoHlFKxFRoNFvpqQy5d",
    duration: "3:40",
    mood: "Future-Pop",
  },
  {
    title: "Spring Day",
    artist: "BTS",
    cover: "https://i.scdn.co/image/ab67616d0000b27346eb7d5074b39ff48b6cd9e3",
    link: "https://open.spotify.com/track/3aDp4xOyuDEK8YGdLEvGhf",
    duration: "4:34",
    mood: "Ballad",
  },
  {
    title: "DDU-DU DDU-DU",
    artist: "BLACKPINK",
    cover: "https://i.scdn.co/image/ab67616d0000b273aa66f8472a31f17d30a6c52d",
    link: "https://open.spotify.com/track/5Eax0qFko2dh7Rl2lYs3bx",
    duration: "3:29",
    mood: "Hip-Hop",
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
