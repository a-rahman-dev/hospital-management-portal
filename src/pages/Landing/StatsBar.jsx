import { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Stethoscope,
  Calendar,
  FlaskConical,
  DollarSign,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 STATS BAR (Rule 5)
   ─────────────────────────────────────────────
   Palette: Cyan → Violet → Blue (brand)
   ============================================================ */

/* ============================================================
   🎯 STATS DATA (Rule 3 — with navigation)
   ============================================================ */
const stats = [
  {
    id: 1,
    label: "Active Patients",
    value: 1248,
    suffix: "+",
    icon: Users,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.35)",
    hex: "#06b6d4",
    path: "/patients",
  },
  {
    id: 2,
    label: "Expert Doctors",
    value: 42,
    suffix: "",
    icon: Stethoscope,
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.35)",
    hex: "#10b981",
    path: "/providers",
  },
  {
    id: 3,
    label: "Appointments",
    value: 318,
    suffix: "",
    icon: Calendar,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.35)",
    hex: "#8b5cf6",
    path: "/patients/appointments",
  },
  {
    id: 4,
    label: "Lab Reports",
    value: 425,
    suffix: "",
    icon: FlaskConical,
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
    hex: "#f43f5e",
    path: "/patients/lab-reports",
  },
  {
    id: 5,
    label: "Revenue (MTD)",
    value: 42850,
    suffix: "",
    prefix: "$",
    icon: DollarSign,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
    hex: "#f59e0b",
    path: "/patients/billing",
  },
  {
    id: 6,
    label: "Satisfaction",
    value: 98,
    suffix: "%",
    icon: Activity,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glow: "rgba(59, 130, 246, 0.35)",
    hex: "#3b82f6",
    path: "/dashboard",
  },
];

/* ============================================================
   🎯 CountUp — with reduced motion + memo
   ============================================================ */
const CountUp = memo(function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const prefersReduced = useReducedMotion();

  /* ---- IntersectionObserver trigger ---- */
  useEffect(() => {
    if (prefersReduced) {
      setCount(value);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, value, prefersReduced]);

  /* ---- Count animation ---- */
  useEffect(() => {
    if (!started || prefersReduced) return;

    const startTime = Date.now();
    let frame;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(update);
      } else {
        setCount(value);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration, prefersReduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
});

/* ============================================================
   🎯 STAT CARD — Clickable
   ============================================================ */
const StatCard = memo(function StatCard({ stat, index, onNavigate }) {
  const Icon = stat.icon;
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onNavigate(stat.path)}
      initial={prefersReduced ? false : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={prefersReduced ? {} : { y: -6, scale: 1.02 }}
      aria-label={`${stat.label}: ${stat.value}${stat.suffix} — click for details`}
      className="group relative text-left cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded-2xl"
    >
      {/* Glow */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 overflow-hidden h-full">
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: stat.gradient }}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300"
            style={{
              background: stat.gradient,
              boxShadow: `0 8px 24px ${stat.glow}`,
            }}
          >
            <Icon size={18} className="text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
        </div>

        <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-none mb-2">
          <CountUp
            value={stat.value}
            prefix={stat.prefix || ""}
            suffix={stat.suffix || ""}
          />
        </div>

        <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">
          {stat.label}
        </p>

        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                !prefersReduced && "animate-pulse"
              )}
              style={{ backgroundColor: stat.hex }}
              aria-hidden="true"
            />
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
              Live
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
});

/* ============================================================
   🎯 MAIN: StatsBar
   ============================================================ */
export default function StatsBar() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <section className="relative py-16 sm:py-20 bg-[#0b1220] overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Animated glow orbs (disabled on reduced motion) */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{
              background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            HEADER
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-4">
            <Activity size={14} className="text-cyan-400" aria-hidden="true" />
            <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em] uppercase">
              Live System Metrics
            </span>
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full bg-emerald-500",
                !prefersReduced && "animate-pulse"
              )}
              aria-hidden="true"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Numbers That{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-blue-500 bg-clip-text text-transparent">
              Speak
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Real-time metrics from AY International Hospital's operations —
            trusted by thousands of patients and providers.
          </p>
        </motion.div>

        {/* ============================================================
            STATS GRID
           ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={idx}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* ============================================================
            BOTTOM DIVIDER
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scaleX: 0 }}
          whileInView={prefersReduced ? false : { opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-16 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}