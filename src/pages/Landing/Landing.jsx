import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  HeartPulse,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Radio,
  ChevronRight,
  Sparkles,
  Stethoscope,
  Bed,
  Users,
  Calendar,
  Lock,
  ExternalLink,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
} from "lucide-react";

// Sub-components
import NeuralNetwork from "./NeuralNetwork";
import Hero from "./Hero";
import StatsBar from "./StatsBar";
import Features from "./Features";
import ModulesShowcase from "./ModulesShowcase";
import CTA from "./CTA";
import Footer from "./Footer";

// Same Portal CoPilot Widget
import CopilotWidget from "../../components/ai/CopilotWidget";

export default function Landing() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Both internal container and window scroll listeners
  useEffect(() => {
    const handleScroll = (e) => {
      const top = e.target === document ? window.scrollY : e.target.scrollTop;
      setScrolled(top > 24);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll handler for both internal container and window
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (!element) return;

    if (scrollContainerRef.current && scrollContainerRef.current.scrollHeight > window.innerHeight) {
      const targetPos = element.offsetTop - 80;
      scrollContainerRef.current.scrollTo({ top: targetPos, behavior: "smooth" });
    } else {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-[#070D1B] text-slate-100 selection:bg-violet-500/30 selection:text-violet-200"
      style={{
        WebkitOverflowScrolling: "touch",
        position: "relative",
      }}
    >
      {/* Background Synaptic Canvas (Fixed in place) */}
      <NeuralNetwork />

      {/* Global Sticky Enterprise Header - Exact Dashboard Palette */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
          scrolled
            ? "bg-[#0B1220]/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl shadow-indigo-950/30 py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Dashboard Matched Logo Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-black shadow-lg shadow-violet-500/30 transition-transform duration-200 group-hover:scale-105 border border-white/20">
                <HeartPulse size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black tracking-wider text-white flex items-center gap-2">
                  AY INT.<span className="text-violet-400 font-extrabold">PRO</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                    HOSPITAL SUITE
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Intelligent Patient Portal & Operations
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Pill Style) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#090F1F]/80 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
              >
                Clinical Modules
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("telemetry-status")}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
              >
                Telemetry Stats
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("modules")}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
              >
                Hospital Architecture
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("access-portal")}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
              >
                Deployment
              </button>
            </nav>

            {/* Right Action Tools */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ONLINE
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 hover:opacity-95 shadow-lg shadow-violet-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border border-white/20 cursor-pointer"
              >
                <Activity size={15} className="stroke-[2.5]" />
                Launch Console
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0B1220]/95 border-b border-slate-800 px-5 pt-4 pb-6 space-y-3 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <span>AY-INT-NODE // ONLINE</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  EHR Nominal
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => scrollToSection("features")}
                  className="px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition"
                >
                  Clinical Modules & EMR
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("telemetry-status")}
                  className="px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition"
                >
                  Live Telemetry Ticker
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("modules")}
                  className="px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition"
                >
                  Hospital Architecture
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("access-portal")}
                  className="px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition"
                >
                  Deployment Protocols
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 shadow-lg shadow-violet-500/25 border border-white/20"
                >
                  Enter Clinical Console
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Flow */}
      <main className="relative z-10 w-full pt-20">
        {/* Hero Section */}
        <Hero />

        {/* Live Operational Metrics Bar */}
        <section id="telemetry-status" className="w-full">
          <StatsBar />
        </section>

        {/* Core Clinical Capabilities */}
        <section id="features" className="w-full">
          <Features />
        </section>

        {/* Modular Systems & Schemas Showcase */}
        <section id="modules" className="w-full">
          <ModulesShowcase />
        </section>

        {/* Deployment & Sandbox Access CTA */}
        <section id="access-portal" className="w-full">
          <CTA />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Portal CoPilot AI Floating Widget */}
      <CopilotWidget />
    </div>
  );
}