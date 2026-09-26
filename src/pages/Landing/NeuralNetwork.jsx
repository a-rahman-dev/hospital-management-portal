import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   🎨 NEURAL NETWORK BACKGROUND (Rule 5)
   ─────────────────────────────────────────────
   Cinematic animated background for Hero section.
   
   Optimizations:
   - useReducedMotion: Disables all animations
   - Mobile: Reduces particle count (60 → 25)
   - Performance: will-change hints
   ============================================================ */

export default function NeuralNetwork() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);
  const [burstNodes, setBurstNodes] = useState([]);
  const [trail, setTrail] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 DETECT MOBILE (Rule 1)
     ============================================================ */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ============================================================
     🎯 NODES (memoized)
     ============================================================ */
  const nodes = useMemo(
    () => [
      // Background layer (blurred, small)
      { id: 1, x: 8, y: 15, size: 2, color: "#06b6d4", depth: 3 },
      { id: 2, x: 22, y: 8, size: 1.5, color: "#8b5cf6", depth: 3 },
      { id: 3, x: 35, y: 22, size: 2, color: "#10b981", depth: 3 },
      { id: 4, x: 55, y: 12, size: 1.5, color: "#06b6d4", depth: 3 },
      { id: 5, x: 72, y: 18, size: 2, color: "#f43f5e", depth: 3 },
      { id: 6, x: 88, y: 10, size: 1.5, color: "#8b5cf6", depth: 3 },
      // Middle layer
      { id: 7, x: 12, y: 45, size: 2.5, color: "#f59e0b", depth: 2 },
      { id: 8, x: 28, y: 55, size: 2.5, color: "#06b6d4", depth: 2 },
      { id: 9, x: 45, y: 48, size: 2, color: "#10b981", depth: 2 },
      { id: 10, x: 62, y: 52, size: 2.5, color: "#8b5cf6", depth: 2 },
      { id: 11, x: 82, y: 45, size: 2.5, color: "#06b6d4", depth: 2 },
      // Foreground layer (sharp, big)
      { id: 12, x: 18, y: 78, size: 3.5, color: "#f43f5e", depth: 1 },
      { id: 13, x: 38, y: 85, size: 3, color: "#8b5cf6", depth: 1 },
      { id: 14, x: 58, y: 80, size: 3.5, color: "#06b6d4", depth: 1 },
      { id: 15, x: 78, y: 88, size: 3, color: "#10b981", depth: 1 },
      { id: 16, x: 92, y: 72, size: 3, color: "#f59e0b", depth: 1 },
      { id: 17, x: 5, y: 65, size: 3, color: "#06b6d4", depth: 1 },
      { id: 18, x: 50, y: 70, size: 3.5, color: "#8b5cf6", depth: 1 },
      { id: 19, x: 68, y: 88, size: 3, color: "#10b981", depth: 1 },
      { id: 20, x: 95, y: 40, size: 3, color: "#f43f5e", depth: 1 },
    ],
    []
  );

  /* ============================================================
     🎯 CONNECTIONS (memoized)
     ============================================================ */
  const connections = useMemo(
    () => [
      { from: 1, to: 2, weight: 0.15, layer: 1 },
      { from: 2, to: 3, weight: 0.15, layer: 1 },
      { from: 3, to: 4, weight: 0.15, layer: 1 },
      { from: 4, to: 5, weight: 0.15, layer: 1 },
      { from: 5, to: 6, weight: 0.15, layer: 1 },
      { from: 7, to: 8, weight: 0.15, layer: 1 },
      { from: 8, to: 9, weight: 0.15, layer: 1 },
      { from: 9, to: 10, weight: 0.15, layer: 1 },
      { from: 10, to: 11, weight: 0.15, layer: 1 },
      { from: 12, to: 13, weight: 0.15, layer: 1 },
      { from: 13, to: 14, weight: 0.15, layer: 1 },
      { from: 14, to: 15, weight: 0.15, layer: 1 },
      { from: 15, to: 16, weight: 0.15, layer: 1 },
      { from: 1, to: 7, weight: 0.1, layer: 2 },
      { from: 2, to: 8, weight: 0.1, layer: 2 },
      { from: 3, to: 9, weight: 0.1, layer: 2 },
      { from: 4, to: 10, weight: 0.1, layer: 2 },
      { from: 5, to: 11, weight: 0.1, layer: 2 },
      { from: 6, to: 11, weight: 0.1, layer: 2 },
      { from: 7, to: 12, weight: 0.1, layer: 2 },
      { from: 8, to: 13, weight: 0.1, layer: 2 },
      { from: 9, to: 14, weight: 0.1, layer: 2 },
      { from: 10, to: 14, weight: 0.1, layer: 2 },
      { from: 11, to: 15, weight: 0.1, layer: 2 },
      { from: 11, to: 16, weight: 0.1, layer: 2 },
      { from: 1, to: 8, weight: 0.06, layer: 3 },
      { from: 3, to: 10, weight: 0.06, layer: 3 },
      { from: 4, to: 9, weight: 0.06, layer: 3 },
      { from: 6, to: 20, weight: 0.06, layer: 3 },
      { from: 7, to: 17, weight: 0.06, layer: 3 },
      { from: 8, to: 17, weight: 0.06, layer: 3 },
      { from: 9, to: 18, weight: 0.06, layer: 3 },
      { from: 10, to: 18, weight: 0.06, layer: 3 },
      { from: 13, to: 18, weight: 0.06, layer: 3 },
      { from: 14, to: 19, weight: 0.06, layer: 3 },
      { from: 15, to: 19, weight: 0.06, layer: 3 },
      { from: 11, to: 20, weight: 0.06, layer: 3 },
      { from: 16, to: 20, weight: 0.06, layer: 3 },
    ],
    []
  );

  /* ============================================================
     🎯 MOUNT + MOUSE EFFECTS (with reduced motion)
     ============================================================ */
  useEffect(() => {
    setMounted(true);

    // Skip mouse effects on mobile or reduced motion
    if (prefersReduced || isMobile) return;

    let lastTrailTime = 0;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });

      // Mouse trail
      const now = Date.now();
      if (now - lastTrailTime > 40) {
        lastTrailTime = now;
        const trailId = now;
        const colors = ["#06b6d4", "#8b5cf6", "#10b981", "#f43f5e", "#f59e0b"];
        setTrail((prev) => [
          ...prev.slice(-15),
          {
            id: trailId,
            x,
            y,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
        ]);
        setTimeout(() => {
          setTrail((prev) => prev.filter((t) => t.id !== trailId));
        }, 800);
      }

      // Burst effect
      if (Math.random() > 0.96) {
        const burstId = Date.now();
        setBurstNodes((prev) => [
          ...prev.slice(-2),
          {
            id: burstId,
            x,
            y,
            color: nodes[Math.floor(Math.random() * nodes.length)].color,
          },
        ]);
        setTimeout(() => {
          setBurstNodes((prev) => prev.filter((b) => b.id !== burstId));
        }, 1200);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReduced, isMobile, nodes]);

  /* ============================================================
     🎯 DUST PARTICLES (reduced count on mobile)
     ============================================================ */
  const dustCount = isMobile ? 25 : 60;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Deep cinematic base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050810] via-[#0b1220] to-[#050510]" />

      {/* Deep space dust — reduced count on mobile */}
      {mounted &&
        Array.from({ length: dustCount }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={
              prefersReduced
                ? { opacity: 0.2 }
                : {
                    y: [null, Math.random() * -50 - 20 + "%"],
                    opacity: [0, 0.4, 0],
                  }
            }
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: prefersReduced ? 0 : Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            className="absolute rounded-full will-change-transform"
            style={{
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              backgroundColor: ["#06b6d4", "#8b5cf6", "#10b981", "#f43f5e"][i % 4],
              boxShadow: `0 0 4px currentColor`,
            }}
          />
        ))}

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.85) 100%)",
        }}
      />

      {/* Breathing color blobs — disabled on reduced motion */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              y: [0, -40, 0],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] will-change-transform"
            style={{
              background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            }}
          />

          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -60, 0],
              y: [0, 50, 0],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] will-change-transform"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            }}
          />

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 40, 0],
              y: [0, -50, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full blur-[160px] will-change-transform"
            style={{
              background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* Mouse spotlight + ripple + trail — desktop only, not reduced motion */}
      {mounted && !isMobile && !prefersReduced && (
        <>
          <motion.div
            animate={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
            }}
          />

          <motion.div
            animate={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              scale: [1, 1.5, 2],
              opacity: [0.4, 0.15, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30"
          />

          {trail.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0.9, scale: 1 }}
              animate={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none will-change-transform"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: "6px",
                height: "6px",
                backgroundColor: t.color,
                boxShadow: `0 0 12px ${t.color}, 0 0 24px ${t.color}60`,
              }}
            />
          ))}
        </>
      )}

      {/* SVG Neural Network */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
          </linearGradient>

          <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {mounted &&
          connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const gradId = `lineGrad${conn.layer}`;
            const avgDepth = (fromNode.depth + toNode.depth) / 2;
            const opacity = avgDepth === 3 ? 0.3 : avgDepth === 2 ? 0.6 : 1;

            return (
              <g key={idx} style={{ opacity }}>
                <motion.line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={`url(#${gradId})`}
                  strokeWidth={conn.weight}
                  initial={prefersReduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={prefersReduced ? false : { pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 1.5,
                    delay: idx * 0.02,
                    ease: "easeOut",
                  }}
                />

                {/* Data pulse — disabled on reduced motion */}
                {!prefersReduced && (
                  <motion.circle
                    r={conn.layer === 1 ? "0.5" : "0.3"}
                    fill={fromNode.color}
                    filter="url(#strongGlow)"
                    initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 0 }}
                    animate={{
                      cx: [fromNode.x, toNode.x],
                      cy: [fromNode.y, toNode.y],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2.5 + conn.layer * 0.5,
                      repeat: Infinity,
                      delay: idx * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </g>
            );
          })}
      </svg>

      {/* Nodes with depth of field */}
      {nodes.map((node, idx) => (
        <motion.div
          key={node.id}
          initial={prefersReduced ? false : { opacity: 0, scale: 0 }}
          animate={prefersReduced ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: idx * 0.04, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            filter:
              node.depth === 3
                ? "blur(2px)"
                : node.depth === 2
                ? "blur(1px)"
                : "none",
            zIndex: 10 - node.depth,
          }}
        >
          {/* Outer halo — disabled on reduced motion */}
          {!prefersReduced && (
            <motion.div
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: node.color,
                width: `${node.size * 8}px`,
                height: `${node.size * 8}px`,
                marginLeft: `${-node.size * 4}px`,
                marginTop: `${-node.size * 4}px`,
              }}
            />
          )}

          {/* The node dot */}
          <motion.div
            animate={
              prefersReduced
                ? {}
                : {
                    scale: [1, 1.4, 1],
                    opacity: [0.8, 1, 0.8],
                  }
            }
            transition={{
              duration: 2 + (idx % 4),
              repeat: prefersReduced ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="relative rounded-full"
            style={{
              width: `${node.size * 5}px`,
              height: `${node.size * 5}px`,
              background: node.color,
              boxShadow: `0 0 ${node.size * 6}px ${node.color}, 0 0 ${
                node.size * 12
              }px ${node.color}80, 0 0 ${node.size * 24}px ${node.color}30`,
            }}
          />
        </motion.div>
      ))}

      {/* Burst effects — desktop only, not reduced motion */}
      {mounted && !isMobile && !prefersReduced && burstNodes.map((burst) => (
        <motion.div
          key={burst.id}
          initial={{
            left: `${burst.x}%`,
            top: `${burst.y}%`,
            width: "10px",
            height: "10px",
            opacity: 0.9,
          }}
          animate={{ width: "120px", height: "120px", opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 will-change-transform"
          style={{
            borderColor: burst.color,
            boxShadow: `0 0 30px ${burst.color}, inset 0 0 20px ${burst.color}40`,
          }}
        />
      ))}

      {/* Anamorphic light streaks — disabled on reduced motion */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-0 w-96 h-[2px] pointer-events-none will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, #06b6d4, transparent)",
              boxShadow: "0 0 20px #06b6d4, 0 0 40px #06b6d4",
            }}
          />

          <motion.div
            animate={{
              x: ["200%", "-100%"],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: 2,
              ease: "easeInOut",
            }}
            className="absolute top-[60%] left-0 w-80 h-[2px] pointer-events-none will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, transparent, #8b5cf6, #f43f5e, #8b5cf6, transparent)",
              boxShadow: "0 0 20px #8b5cf6, 0 0 40px #8b5cf6",
            }}
          />

          <motion.div
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: 5,
              ease: "easeInOut",
            }}
            className="absolute top-[80%] left-0 w-72 h-[1px] pointer-events-none will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, transparent, #10b981, #06b6d4, #10b981, transparent)",
              boxShadow: "0 0 15px #10b981",
            }}
          />

          {/* Cinematic scanline */}
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-24 opacity-[0.08] will-change-transform"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.6), transparent)",
            }}
          />
        </>
      )}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner rays — disabled on reduced motion */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
            }}
          />

          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}