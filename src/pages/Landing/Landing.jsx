import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Hero from "./Hero";
import StatsBar from "./StatsBar";
import Features from "./Features";
import ModulesShowcase from "./ModulesShowcase";
import CTA from "./CTA";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 LANDING PAGE (Rule 5)
   ─────────────────────────────────────────────
   Composition:
   1. Scroll progress bar (top)
   2. Hero
   3. StatsBar
   4. Features
   5. ModulesShowcase
   6. CTA
   7. Footer
   8. Back-to-top button
   ============================================================ */

/* ============================================================
   🎯 SCROLL PROGRESS BAR
   ============================================================ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}

/* ============================================================
   🎯 BACK TO TOP BUTTON
   ============================================================ */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [prefersReduced]);

  return (
    <motion.button
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-11 h-11 min-w-[44px] min-h-[44px] rounded-full",
        "flex items-center justify-center",
        "text-white shadow-2xl",
        "bg-gradient-to-br from-indigo-600 to-violet-600",
        "shadow-indigo-500/40",
        "hover:scale-110 active:scale-95",
        "transition-transform duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
      )}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </motion.button>
  );
}

/* ============================================================
   🎯 MAIN: Landing
   ============================================================ */
export default function Landing() {
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 SCROLL TO TOP ON MOUNT
     ============================================================ */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-screen",
        "bg-slate-50 dark:bg-[#0B1220]",
        "text-slate-900 dark:text-white",
        "antialiased",
        "overflow-x-clip"
      )}
    >
      {/* ============================================================
          SCROLL PROGRESS BAR
         ============================================================ */}
      <ScrollProgress />

      {/* ============================================================
          MAIN SECTIONS
         ============================================================ */}
      <main role="main">
        {/* Hero — with id for anchor link */}
        <section id="home">
          <Hero />
        </section>

        {/* Stats Bar */}
        <section id="stats">
          <StatsBar />
        </section>

        {/* Features */}
        <section id="features">
          <Features />
        </section>

        {/* Modules Showcase */}
        <section id="modules">
          <ModulesShowcase />
        </section>

        {/* CTA */}
        <section id="cta">
          <CTA />
        </section>

        {/* Footer */}
        <Footer />
      </main>

      {/* ============================================================
          BACK TO TOP
         ============================================================ */}
      <BackToTop />
    </div>
  );
}