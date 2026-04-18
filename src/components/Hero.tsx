import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero3D from "./Hero3D";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* 3D background */}
      <div className="absolute inset-0 -z-10">
        <Hero3D />
      </div>
      {/* Soft gradient overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/10 to-background pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl -z-10" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/30 blur-3xl -z-10" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
            Student • Web Developer • Creator
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            Hi, I'm <span className="text-gradient animated-gradient bg-clip-text text-transparent">IRIS</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
            A passionate student building beautiful, modern web experiences.
            I craft interactive interfaces with clean code and a sharp eye for design.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <a href="#projects">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href="#projects">
                <FolderGit2 className="mr-2 h-5 w-5" /> View Projects
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-xs tracking-widest"
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
};

export default Hero;
