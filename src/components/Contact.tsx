import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Github, Twitter, Linkedin, Instagram, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1 + 0.5,
      duration: 0.5,
      ease: "backOut",
    },
  }),
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message sent ✨",
        description: "Thanks for reaching out — I'll get back to you soon!",
      });
      (e.target as HTMLFormElement).reset();
    }, 900);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <motion.p
                className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3 inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4" />
                Contact
              </motion.p>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl font-bold mb-6"
            >
              Let's <span className="text-gradient">connect</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8 max-w-md"
            >
              Have a project in mind, a question, or just want to say hi?
              Drop me a message — I'd love to hear from you.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.a
                href="mailto:hello@iris.dev"
                className="inline-flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary-glow transition-smooth mb-8"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Mail className="h-5 w-5 text-white" />
                </motion.span>
                hello@iris.dev
              </motion.a>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              variants={itemVariants}
            >
              {socials.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={socialVariants}
                  whileHover={{
                    scale: 1.15,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex h-11 w-11 items-center justify-center rounded-xl glass transition-bounce hover:bg-gradient-primary hover:shadow-glow"
                >
                  <s.icon className="h-5 w-5 text-muted-foreground group-hover:text-white transition-smooth" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.form
            onSubmit={onSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="rounded-2xl glass p-8 shadow-soft glow-border space-y-5"
            whileHover={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
          >
            <motion.div
              className="grid sm:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <motion.div
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input
                  required
                  placeholder="Your name"
                  className="bg-muted/40 focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </motion.div>
              <motion.div
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  required
                  type="email"
                  placeholder="you@email.com"
                  className="bg-muted/40 focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-2"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <Textarea
                required
                rows={5}
                placeholder="Tell me a little about your idea…"
                className="bg-muted/40 resize-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={loading}
                  className="w-full relative overflow-hidden"
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {loading ? (
                      "Sending…"
                    ) : (
                      <>
                        Send message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </motion.span>
                  {!loading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{
                        x: "100%",
                        transition: { duration: 0.6 },
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
