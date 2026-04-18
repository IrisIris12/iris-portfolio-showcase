import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Aurora Dashboard",
    tag: "Web App",
    desc: "Analytics dashboard with real-time charts and dark UI.",
    gradient: "from-blue-600 via-indigo-600 to-purple-700",
  },
  {
    title: "Nova Portfolio",
    tag: "Design",
    desc: "Personal portfolio with 3D scenes and motion design.",
    gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
  },
  {
    title: "PulseChat",
    tag: "Realtime",
    desc: "Minimal chat app with smooth UI and instant sync.",
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
  },
  {
    title: "Lumen Store",
    tag: "E-commerce",
    desc: "Concept storefront with product gallery & animations.",
    gradient: "from-violet-600 via-purple-600 to-blue-600",
  },
  {
    title: "Echo Notes",
    tag: "Productivity",
    desc: "Markdown-based notes app with a calming interface.",
    gradient: "from-indigo-600 via-blue-600 to-cyan-500",
  },
  {
    title: "Orbit Landing",
    tag: "Marketing",
    desc: "High-conversion SaaS landing page template.",
    gradient: "from-fuchsia-600 via-violet-600 to-indigo-700",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
              Projects
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold">
              Selected <span className="text-gradient">work</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            A small gallery of things I've designed, built, and shipped while
            learning along the way.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl glass shadow-soft transition-smooth hover:shadow-elegant"
            >
              {/* Preview */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.gradient} transition-smooth group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-background/40 backdrop-blur px-3 py-1 text-xs font-medium text-white border border-white/20">
                    {p.tag}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-white/90 drop-shadow-lg">
                    {p.title}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">{p.desc}</p>
                <Button variant="outline" size="sm" className="group/btn">
                  View Project
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
