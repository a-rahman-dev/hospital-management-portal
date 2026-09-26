import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Play,
  Users,
  Stethoscope,
  Pill,
  DollarSign,
  Calendar,
  TrendingUp,
  Shield,
  Lock,
  Zap,
} from "lucide-react";
import NeuralNetwork from "./NeuralNetwork";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 HERO SECTION (Rule 5)
   ─────────────────────────────────────────────
   Palette: Cyan → Violet → Blue (brand gradient)
   ============================================================ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ============================================================
   🎯 CountUp — with reduced motion support
   ============================================================ */
function CountUp({ value, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setCount(value);
      return;
    }

    let start = 0;
    const increment = value / (duration / 16);
    let frame;

    const update = () => {
      start += increment;
      if (start < value) {
        setCount(Math.floor(start));
        frame = requestAnimationFrame(update);
      } else {
        setCount(value);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, prefersReduced]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ============================================================
   🎯 BentoCard — with click support
   ============================================================ */
function BentoCard({
  icon: Icon,
  value,
  label,
  color,
  gradient,
  glow,
  className,
  suffix,
  showChart,
  onClick,
  trend,
}) {
  const prefersReduced = useReducedMotion();

  const Component = onClick ? "button" : "div";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={prefersReduced ? {} : { y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className={cn("min-w-0", className)}
    >
      <Component
        onClick={onClick}
        type={onClick ? "button" : undefined}
        aria-label={onClick ? `${label}: ${value}` : undefined}
        className={cn(
          "group relative overflow-hidden rounded-2xl w-full h-full text-left",
          "border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
          "p-4 sm:p-5 shadow-2xl hover:border-white/[0.15]",
          "transition-colors",
          onClick && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
        )}
      >
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: gradient }}
          aria-hidden="true"
        />

        {/* Glow */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none"
          style={{ background: glow }}
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div
              className="p-2.5 rounded-xl shadow-lg transition-transform group-hover:scale-110"
              style={{ background: gradient, boxShadow: `0 6px 18px ${glow}` }}
            >
              <Icon size={18} className="text-white" strokeWidth={2.5} />
            </div>

            {!showChart && trend && (
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <TrendingUp size={9} strokeWidth={2.5} />
                {trend}
              </span>
            )}
          </div>

          {showChart ? (
            <>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-lg font-black text-white tabular-nums">
                <CountUp value={value} suffix={suffix} />
              </p>
              {/* Mini chart */}
              <svg
                viewBox="0 0 100 30"
                className="w-full h-10 mt-2"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`chartGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,25 L15,20 L30,22 L45,15 L60,18 L75,10 L90,12 L100,5 L100,30 L0,30 Z"
                  fill={`url(#chartGrad-${color.replace("#", "")})`}
                />
                <path
                  d="M0,25 L15,20 L30,22 L45,15 L60,18 L75,10 L90,12 L100,5"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          ) : (
            <>
              <p className="text-2xl font-black text-white tabular-nums mb-1">
                <CountUp value={value} suffix={suffix} />
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {label}
              </p>
            </>
          )}
        </div>
      </Component>
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: Hero
   ============================================================ */
export default function Hero() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 SCROLL TO SECTION
     ============================================================ */
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [prefersReduced]);

  /* ============================================================
     🎯 BENTO CARDS (with actions — fixed paths)
     ============================================================ */
  const bentoCards = [
    {
      icon: Users,
      value: 1248,
      label: "Total Patients",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
      glow: "rgba(6, 182, 212, 0.5)",
      className: "col-span-1 row-span-1",
      trend: "+12%",
      onClick: () => navigate("/dashboard/patients"),
    },
    {
      icon: Stethoscope,
      value: 42,
      label: "Doctors",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
      glow: "rgba(16, 185, 129, 0.5)",
      className: "col-span-1 row-span-1",
      trend: "+3%",
      onClick: () => navigate("/dashboard/providers"),
    },
    {
      icon: Activity,
      value: 318,
      label: "Appointments Today",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      glow: "rgba(139, 92, 246, 0.5)",
      className: "col-span-2 row-span-1",
      showChart: true,
      onClick: () => navigate("/dashboard/patients/appointments"),
    },
    {
      icon: Pill,
      value: 892,
      label: "Medications",
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
      glow: "rgba(244, 63, 94, 0.5)",
      className: "col-span-1 row-span-1",
      trend: "+8%",
      onClick: () => navigate("/dashboard/patients/medications"),
    },
    {
      icon: DollarSign,
      value: 42850,
      label: "Revenue (MTD)",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
      glow: "rgba(245, 158, 11, 0.5)",
      className: "col-span-1 row-span-1",
      suffix: "",
      trend: "+18%",
      onClick: () => navigate("/dashboard/patients/billing"),
    },
    {
      icon: Calendar,
      value: 18,
      label: "Scheduled",
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      glow: "rgba(14, 165, 233, 0.5)",
      className: "col-span-1 row-span-1",
      trend: "+5%",
      onClick: () => navigate("/dashboard/patients/appointments"),
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-20">
      {/* Neural network background */}
      <NeuralNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ============================================================
              LEFT SIDE — Text
             ============================================================ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Brand badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-6"
            >
              <Activity size={12} className="text-cyan-400" aria-hidden="true" />
              <span className="text-[10px] font-black text-slate-300 tracking-[0.15em] uppercase">
                AY INT. HOSPITAL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6"
            >
              Smart Healthcare,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-blue-500 bg-clip-text text-transparent">
                Delivered.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Complete hospital management system with{" "}
              <span className="text-white font-semibold">patient care</span>,{" "}
              <span className="text-white font-semibold">appointments</span>,{" "}
              <span className="text-white font-semibold">billing</span>, and
              AI-powered insights.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-8"
            >
              {/* Primary CTA — Try Live Demo */}
              <button
                onClick={() => navigate("/dashboard")}
                aria-label="Try the live demo"
                className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 min-h-[52px] rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-600 text-white font-bold shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all hover:scale-105 active:scale-95 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
                <span className="relative z-10">Try Live Demo</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>

              {/* Secondary CTA — Watch Video */}
              <button
                onClick={() => scrollToSection("features")}
                aria-label="Watch product tour"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/[0.1] text-white font-bold hover:bg-white/[0.06] hover:border-white/[0.2] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
              >
                <Play size={16} aria-hidden="true" />
                Watch Tour
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3"
            >
              {[
                { icon: Shield, label: "HIPAA" },
                { icon: Lock, label: "Secure" },
                { icon: Zap, label: "Fast" },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
                  >
                    <Icon size={11} className="text-cyan-400" strokeWidth={2.5} aria-hidden="true" />
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-wider uppercase">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ============================================================
              RIGHT SIDE — Bento Grid
             ============================================================ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {bentoCards.map((card, idx) => (
              <BentoCard key={idx} {...card} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Scroll indicator — visible on all sizes
         ============================================================ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={prefersReduced ? false : { opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-500 to-transparent"
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}