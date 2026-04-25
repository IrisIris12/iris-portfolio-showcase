import { motion } from "framer-motion";
import { BookOpen, Music, FolderGit2, Gamepad2 } from "lucide-react";

const features = [
  {
    name: "Blog",
    icon: BookOpen,
    color: "from-pink-500 to-rose-500",
    desc: "My thoughts, notes and stories.",
    href: "#blog",
  },
  {
    name: "Music",
    icon: Music,
    color: "from-fuchsia-500 to-purple-500",
    desc: "A few tunes I love and create.",
    href: "#",
  },
  {
    name: "Projects",
    icon: FolderGit2,
    color: "from-blue-500 to-cyan-500",
    desc: "Things I design and build.",
    href: "#projects",
  },
  {
    name: "Games",
    icon: Gamepad2,
    color: "from-violet-500 to-indigo-500",
    desc: "Little games to play and enjoy.",
    href: "#games",
  },
];

const About = () => {
  return (
    <section id="about" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
            About
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Hi, I'm{" "}
            <span className="name-gradient">Iris</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm a student from Morocco 🇲🇦. On this little corner of the web
            you'll find my <span className="text-foreground font-medium">blog</span>,
            some <span className="text-foreground font-medium">music</span> I love,
            my <span className="text-foreground font-medium">projects</span>, and a few
            <span className="text-foreground font-medium"> games</span> to play around with.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.a
              key={f.name}
              href={f.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl bg-gradient-card glass p-7 shadow-soft transition-smooth hover:shadow-elegant glow-border"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-glow mb-5 transition-bounce group-hover:scale-110 group-hover:rotate-6`}
              >
                <f.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">{f.name}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
