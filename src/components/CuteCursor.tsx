import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CuteCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        target.onclick !== null ||
        target.style.cursor === "pointer";
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main cursor - neon crystal pointer */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 0.82 : isHovering ? 1.16 : 1,
          opacity: isVisible ? 1 : 0,
          rotate: isHovering ? -12 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 620,
          damping: 32,
          mass: 0.5,
        }}
      >
        <div className="relative h-8 w-8">
          <div className="absolute -inset-3 rounded-full bg-cyan-300/30 blur-xl" />
          <div
            className="absolute left-0 top-0 h-7 w-5 origin-top-left rotate-[-18deg]"
            style={{
              clipPath: "polygon(0 0, 100% 54%, 52% 64%, 32% 100%)",
              background:
                "linear-gradient(135deg, hsl(0 0% 100%), hsl(180 100% 72%) 34%, hsl(285 92% 70%) 76%)",
              boxShadow:
                "0 0 18px hsl(180 100% 62% / 0.65), 0 10px 22px hsl(260 90% 20% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.9)",
            }}
          />
          <div className="absolute left-2 top-2 h-2 w-2 rounded-full bg-white/90 shadow-[0_0_12px_hsl(0_0%_100%)]" />
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full border border-white/40 bg-cyan-300/20 text-[10px] shadow-[0_0_18px_hsl(180_100%_62%_/_0.55)] backdrop-blur"
            >
              <span className="text-white drop-shadow-lg">✦</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Magnetic ring - follows with delay */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
        animate={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18,
          scale: isClicking ? 0.72 : isHovering ? 1.42 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 190,
          damping: 20,
          mass: 0.1,
        }}
      >
        <div className="h-9 w-9 rounded-full border border-cyan-200/55 shadow-[0_0_24px_hsl(180_100%_62%_/_0.35),inset_0_0_16px_hsl(285_92%_70%_/_0.22)]" />
      </motion.div>

      {/* Glow trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        animate={{
          x: mousePosition.x - 9,
          y: mousePosition.y - 9,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 18,
          mass: 0.2,
        }}
      >
        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-300/20 via-fuchsia-300/20 to-blue-300/20 blur-md" />
      </motion.div>

      {/* Crystal particles on click */}
      {isClicking && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed top-0 left-0 pointer-events-none z-[9996]"
              initial={{
                x: mousePosition.x,
                y: mousePosition.y,
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: mousePosition.x + Math.cos((i * Math.PI) / 4) * 36,
                y: mousePosition.y + Math.sin((i * Math.PI) / 4) * 36,
                scale: 0,
                opacity: 0,
                rotate: 180,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
            >
              <div className="h-2 w-2 rotate-45 rounded-[2px] bg-gradient-to-br from-white via-cyan-200 to-fuchsia-300 shadow-[0_0_12px_hsl(180_100%_70%_/_0.75)]" />
            </motion.div>
          ))}
        </>
      )}
    </>
  );
};

export default CuteCursor;
