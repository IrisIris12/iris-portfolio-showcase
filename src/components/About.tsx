import { motion } from "framer-motion";
import { Code2, Palette, Zap } from "lucide-react";
import butterfliesImg from "@/assets/butterflies.jpg";

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
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-pink-500/30 via-fuchsia-500/20 to-blue-500/30 rounded-3xl blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl glow-border shadow-elegant animate-float">
              <img
                src={butterfliesImg}
                alt="Papillons lumineux et magiques en rose et bleu"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
              À propos
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Esprit curieux,{" "}
              <span className="name-gradient">mains créatives</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Je suis IRIS ESSABRI — une étudiante qui explore le croisement entre
              le design et la technologie. J'aime transformer des idées en sites
              web fluides et interactifs, et apprendre un peu plus chaque jour.
            </p>
          </motion.div>
        </div>

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
