import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Github, Twitter, Linkedin, Instagram, Send } from "lucide-react";
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
    <section id="contact" className="relative py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
              Contact
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Let's <span className="text-gradient">connect</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Have a project in mind, a question, or just want to say hi?
              Drop me a message — I'd love to hear from you.
            </p>

            <a
              href="mailto:hello@iris.dev"
              className="inline-flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary-glow transition-smooth mb-8"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Mail className="h-5 w-5 text-white" />
              </span>
              hello@iris.dev
            </a>

            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-xl glass transition-bounce hover:bg-gradient-primary hover:shadow-glow hover:-translate-y-1"
                >
                  <s.icon className="h-5 w-5 text-muted-foreground group-hover:text-white transition-smooth" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl glass p-8 shadow-soft glow-border space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input required placeholder="Your name" className="bg-muted/40" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input required type="email" placeholder="you@email.com" className="bg-muted/40" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <Textarea
                required
                rows={5}
                placeholder="Tell me a little about your idea…"
                className="bg-muted/40 resize-none"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? "Sending…" : (<>Send message <Send className="ml-2 h-4 w-4" /></>)}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
