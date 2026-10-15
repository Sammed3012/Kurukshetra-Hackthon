import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export default function Background() {
  // Generate random positions for floating leaves, memoized so they don't jump on re-renders
  const leaves = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 2,
    driftX: Math.random() * 40 - 20,
    driftY: Math.random() * 40 - 20,
    initialOpacity: Math.random() * 0.3 + 0.1,
  })), []);

  // Generate pollen particles
  const pollen = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 2,
    initialOpacity: Math.random() * 0.3 + 0.1,
  })), []);

  return (
    <>
      <div className="noise-overlay" />
      <div className="fixed inset-0 z-[-3] bg-agri-cream" />
      
      {/* Dynamic Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-agri-olive/5 rounded-full blur-[120px] pointer-events-none z-[-2]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-agri-glow/5 rounded-full blur-[150px] pointer-events-none z-[-2]" />

      {/* Floating Green Leaves Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ 
              opacity: leaf.initialOpacity,
              rotate: Math.random() * 360 
            }}
            animate={{ 
              y: [0, leaf.driftY * 3, 0],
              x: [0, leaf.driftX * 3, 0],
              opacity: [leaf.initialOpacity, 0.5, leaf.initialOpacity],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "linear",
            }}
            className="absolute text-agri-green/30"
            style={{ 
              left: `${leaf.x}%`, 
              top: `${leaf.y}%`,
              width: leaf.size, 
              height: leaf.size 
            }}
          >
            <Leaf size={leaf.size} />
          </motion.div>
        ))}

        {/* Pollen Particles */}
        {pollen.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: p.initialOpacity }}
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [p.initialOpacity, 0.6, p.initialOpacity] 
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
            className="absolute bg-agri-green rounded-full blur-[1px]"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`,
              width: p.size, 
              height: p.size 
            }}
          />
        ))}
      </div>
    </>
  );
}
