import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Users,
  Calendar,
  FlaskConical,
  Pill,
  DollarSign,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 FEATURES SECTION (Rule 5)
   ─────────────────────────────────────────────
   Palette: Cyan → Violet → Blue (brand)
   ============================================================ */

/* ============================================================
   🎯 FEATURES DATA (Rule 3 — with navigation)
   ============================================================ */
const features = [
  {
    id: "patients",
    title: "Patient Management",
    description:
      "Complete patient profiles, medical history, and care coordination in one intelligent workspace.",
    icon: Users,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.35)",
    hex: "#06b6d4",
    path: "/patients",
  },
  {
    id: "appointments",
    title: "Smart Scheduling",
    description:
      "AI-powered appointment booking with real-time availability, automated reminders, and queue management.",
    icon: Calendar,
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.35)",
    hex: "#10b981",
    path: "/patients/appointments",
  },
  {
    id: "labs",
    title: "Lab Diagnostics",
    description:
      "Instant lab reports with critical value alerts, trend analysis, and pathologist verification.",
    icon: FlaskConical,
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
    hex: "#f43f5e",
    path: "/patients/lab-reports",
  },
  {
    id: "medications",
    title: "Medication Tracking",
    description:
      "Prescription management with drug interaction warnings, dosage tracking, and refill alerts.",
    icon: Pill,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
    hex: "#f59e0b",
    path: "/patients/medications",
  },
  {
    id: "billing",
    title: "Revenue Cycle",
    description:
      "Insurance claims, billing, payment tracking, and automated workflows for complete financial control.",
    icon: DollarSign,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.35)",
    hex: "#8b5cf6",
    path: "/patients/billing",
  },
  {
    id: "analytics",
    title: "AI Analytics",
    description:
      "Predictive insights, patient trends, operational intelligence, and real-time decision support.",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glow: "rgba(59, 130, 246, 0.35)",
    hex: "#3b82f6",
    path: "/dashboard",
  },
];

/* ============================================================
   🎯 FEATURE CARD (memoized)
   ============================================================ */
const FeatureCard = memo(function FeatureCard({
  feature,
  index,
  onNavigate,
}) {
  const Icon = feature.icon;
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onNavigate(feature.path)}
      initial={prefersReduced ? false : { opacity: 0, y: 40, scale: 0.95 }}
      whileInView={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={prefersReduced ? {} : { y: -8, scale: 1.02 }}
      aria-label={`${feature.title}: ${feature.description} — click to explore`}
      className="group relative text-left cursor-pointer w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded-2xl"
    >
      {/* Glow */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative h-full p-5 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 overflow-hidden">
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: feature.gradient }}
          aria-hidden="true"
        />

        {/* Icon */}
        <div className="relative mb-5">
          <div
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xl",
              !prefersReduced &&
                "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            )}
            style={{
              background: feature.gradient,
              boxShadow: `0 10px 30px ${feature.glow}`,
            }}
          >
            <Icon size={22} className="text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-5">
          {feature.description}
        </p>

        {/* Learn more link */}
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase",
            !prefersReduced && "transition-colors duration-300"
          )}
          style={{ color: feature.hex }}
        >
          <span>Learn More</span>
          <ArrowRight
            size={12}
            strokeWidth={2.5}
            className={cn(
              !prefersReduced &&
                "transition-transform duration-300 group-hover:translate-x-1"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Corner accent */}
        <div
          className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 pointer-events-none"
          style={{ background: feature.hex }}
          aria-hidden="true"
        />
      </div>
    </motion.button>
  );
});

/* ============================================================
   🎯 MAIN: Features
   ============================================================ */
export default function Features() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 NAVIGATE HANDLER
     ============================================================ */
  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <section className="relative py-16 sm:py-24 bg-[#0b1220] overflow-hidden">
      {/* Ambient orbs (disabled on reduced motion) */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            SECTION HEADER
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-4">
            <Zap
              size={14}
              className={cn(
                "text-cyan-400",
                !prefersReduced && "animate-pulse"
              )}
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em] uppercase">
              Powerful Features
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Everything Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-blue-500 bg-clip-text text-transparent">
              Hospital
            </span>{" "}
            Needs
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From patient registration to revenue cycle management — every module
            built with modern healthcare workflows in mind.
          </p>
        </motion.div>

        {/* ============================================================
            FEATURES GRID
           ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={idx}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* ============================================================
            BOTTOM CTA
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
            <Sparkles size={16} className="text-cyan-400 shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm text-slate-300">
              <span className="font-bold text-white">12+ modules</span> ready
              to transform your hospital
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}