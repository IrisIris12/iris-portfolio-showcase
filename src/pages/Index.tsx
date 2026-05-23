import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Music from "@/components/Music";
import GamesGallery from "@/components/GamesGallery";
import MemoryGame from "@/components/MemoryGame";
import DinoGame from "@/components/DinoGame";
import SnakeGame from "@/components/SnakeGame";
import BubblePopGarden from "@/components/BubblePopGarden";
import FiveMiniGames from "@/components/FiveMiniGames";
import Contact from "@/components/Contact";
import SceneBackground3D from "@/components/SceneBackground3D";
import CuteCursor from "@/components/CuteCursor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <CuteCursor />
      <SceneBackground3D />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Music />
        <GamesGallery />
        <MemoryGame />
        <DinoGame />
        <SnakeGame />
        <BubblePopGarden />
        <FiveMiniGames />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
