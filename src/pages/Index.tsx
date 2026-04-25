import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Music from "@/components/Music";
import MemoryGame from "@/components/MemoryGame";
import DinoGame from "@/components/DinoGame";
import SnakeGame from "@/components/SnakeGame";
import Contact from "@/components/Contact";
import SceneBackground3D from "@/components/SceneBackground3D";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <SceneBackground3D />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Music />
        <MemoryGame />
        <DinoGame />
        <SnakeGame />
        <Contact />
      </main>
    </div>
  );
};

export default Index;

