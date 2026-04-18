import { motion } from "framer-motion";
import { Code2, Palette, Zap } from "lucide-react";

const skills = [
  {
    name: "HTML",
    icon: Code2,
    color: "from-orange-500 to-red-500",
    desc: "Semantic, accessible markup",
  },
  {
    name: "CSS",
    icon: Palette,
    color: "from-blue-500 to-cyan-500",
    desc: "Modern layouts & animations",
  },
  {
    name: "JavaScript",
    icon: Zap,
    color: "from-yellow-400 to-amber-500",
    desc: "Interactive, dynamic experiences",
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
            About me
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Curious mind,{" "}
            <span className="text-gradient">creative hands</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm IRIS — a student exploring the intersection of design and
            technology. I love turning ideas into smooth, interactive websites
            and learning a little more every day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl bg-gradient-card glass p-8 shadow-soft transition-smooth hover:shadow-elegant glow-border"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.color} shadow-glow mb-5 transition-bounce group-hover:scale-110 group-hover:rotate-6`}
              >
                <skill.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">{skill.name}</h3>
              <p className="text-muted-foreground">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
