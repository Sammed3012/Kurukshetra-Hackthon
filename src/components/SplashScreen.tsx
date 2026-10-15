import { motion } from "motion/react";
import { Leaf, Sprout } from "lucide-react";
import AppLogo from "./AppLogo";
import { Translate } from "../contexts/LanguageContext";

export default function SplashScreen() {
  // Generate random positions for floating leaves
  const leaves = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 2, // Reduced delay so they appear immediately
    driftX: Math.random() * 40 - 20,
    driftY: Math.random() * 40 - 20,
    initialOpacity: Math.random() * 0.3 + 0.1, // Start partially visible
  }));

  // Generate pollen particles
  const pollen = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 2, // Reduced delay
    initialOpacity: Math.random() * 0.3 + 0.1, // Start partially visible
  }));

  return (
    <div className="fixed inset-0 bg-[#5A5A40] flex flex-col items-center justify-center z-[200] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* God Rays / Sunlight Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-30%] left-[-20%] w-[180%] h-[180%] bg-[conic-gradient(from_180deg_at_20%_0%,transparent_0%,rgba(255,255,255,0.15)_10%,transparent_20%,rgba(255,255,255,0.08)_30%,transparent_40%)] animate-[spin_80s_linear_infinite]" />
        </div>

        {/* Animated Gradient Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-[#00FF88]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-white/5 rounded-full blur-[120px]"
        />

        {/* Floating Green Leaves */}
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
            className="absolute text-[#00FF88]/40"
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
            className="absolute bg-white rounded-full blur-[1px]"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`,
              width: p.size, 
              height: p.size 
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center relative z-10"
      >
        <AppLogo size="xl" className="mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)]" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg">
            <span className="text-white">Agri</span>
            <span className="text-[#00FF88]">Dhan</span>
          </h1>
          
          {/* Green Line */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-1 bg-[#00FF88] mt-2 rounded-full shadow-[0_0_10px_rgba(0,255,136,0.5)]"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-white/90 text-lg mt-3 font-medium tracking-wide italic"
          >
            <Translate>The Future of farmer</Translate>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Plant Loading Indicator */}
      <div className="absolute bottom-32 flex flex-col items-center gap-4 z-10">
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="flex flex-col items-center"
            >
              <Sprout className="w-8 h-8 text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]" />
              <div className="w-1 h-1 bg-white rounded-full mt-1" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Soil Field Visual at the Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 z-10 pointer-events-none">
        <svg 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Lush Side Path (Left) */}
          <path 
            fill="#3d3d2b" 
            d="M0,160 C120,120 240,200 360,180 C480,160 600,100 720,140 L720,320 L0,320 Z"
            className="drop-shadow-[0_-5px_10px_rgba(0,255,136,0.2)]"
          />
          {/* Dry Side Path (Right) */}
          <path 
            fill="#4a3b2a" 
            d="M720,140 C840,180 960,240 1080,220 C1200,200 1320,140 1440,180 L1440,320 L720,320 Z"
            className="drop-shadow-[0_-5px_10px_rgba(139,69,19,0.2)]"
          />
        </svg>

        {/* Lush Side Plants */}
        <div className="absolute bottom-0 left-0 w-1/2 h-full flex justify-around items-end pb-4 px-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              className="relative z-20"
            >
              <Sprout className="w-8 h-8 text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]" />
            </motion.div>
          ))}
        </div>

        {/* Dry Side Withered Leaves */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full flex justify-around items-end pb-4 px-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="opacity-40 rotate-12 relative z-20">
              <Leaf className="w-6 h-6 text-orange-900" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
