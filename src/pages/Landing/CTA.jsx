import { memo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Activity,
  Shield,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 CTA SECTION (Rule 5)
   ─────────────────────────────────────────────
   Palette: Cyan → Violet → Blue (brand)
   ============================================================ */

/* ============================================================
   🎯 BENEFITS DATA (Rule 3)
   ============================================================ */
const benefits = [
  {
    id: 1,
    icon: Clock,
    label: "Save 40% Time",
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.35)",
  },
  {
    id: 2,
    icon: Users,
    label: "10,000+ Patients",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    id: 3,
    icon: TrendingUp,
    label: "Boost Revenue 25%",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.35)",
  },
  {
    id: 4,
    icon: Shield,
    label: "HIPAA Compliant",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.35)",
  },
];

/* ============================================================
   🎯 BENEFIT CARD (memoized)
   ============================================================ */
const BenefitCard = memo(function BenefitCard({ benefit, index }) {
  const Icon = benefit.icon;
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
      whileInView={prefersReduced ? false : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
      whileHover={prefersReduced ? {} : { y: -4, scale: 1.05 }}
      className="group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-default"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          !prefersReduced &&
            "transition-transform duration-300 group-hover:scale-110"
        )}
        style={{
          background: `linear-gradient(135deg, ${benefit.color}40, ${benefit.color}20)`,
          border: `1px solid ${benefit.color}40`,
          boxShadow: `0 8px 20px ${benefit.glow}`,
        }}
      >
        <Icon
          size={16}
          style={{ color: benefit.color }}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>
      <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase text-center leading-tight">
        {benefit.label}
      </span>
    </motion.div>
  );
});

/* ============================================================
   🎯 MAIN: CTA
   ============================================================ */
export default function CTA() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const handleEnterPortal = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleContactSales = useCallback(() => {
    window.open(
      "https://ayint-hospital.com",
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  return (
    <section className="relative py-16 sm:py-24 bg-[#0b1220] overflow-hidden">
      {/* Big gradient background — disabled on reduced motion */}
      {!prefersReduced && (
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full blur-[100px] sm:blur-[150px] will-change-transform"
            style={{
              background:
                "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #0284c7, #06b6d4)",
            }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Static gradient fallback for reduced motion */}
      {prefersReduced && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at center, #06b6d4 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            MAIN CTA CARD
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40, scale: 0.95 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          {/* Outer glow — hidden on mobile (perf) */}
          <div className="hidden sm:block absolute -inset-2 rounded-[32px] bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-blue-500/30 blur-2xl" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] p-5 sm:p-8 lg:p-16">
            {/* Decorative corner accents */}
            <div
              className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-violet-500/20 to-transparent blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              {/* Badge */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                whileInView={prefersReduced ? false : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm mb-6"
              >
                <Sparkles size={14} className="text-cyan-400" aria-hidden="true" />
                <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em] uppercase">
                  Ready to Transform
                </span>
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full bg-emerald-500",
                    !prefersReduced && "animate-pulse"
                  )}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-6"
              >
                Experience the Future of{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-blue-500 bg-clip-text text-transparent">
                  Hospital Management
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto"
              >
                Join 500+ healthcare providers already using AY International
                Hospital's intelligent platform to streamline operations and
                deliver exceptional patient care.
              </motion.p>

              {/* ============================================================
                  CTA BUTTONS
                 ============================================================ */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
              >
                {/* Primary CTA */}
                <button
                  onClick={handleEnterPortal}
                  aria-label="Enter the hospital portal"
                  className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-600 text-white font-bold shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all hover:scale-105 active:scale-95 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    aria-hidden="true"
                  />
                  <Activity size={18} className="relative z-10" aria-hidden="true" />
                  <span className="relative z-10">Enter Portal Now</span>
                  <ArrowRight
                    size={18}
                    className={cn(
                      "relative z-10",
                      !prefersReduced &&
                        "transition-transform group-hover:translate-x-1"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={handleContactSales}
                  aria-label="Contact sales team"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-2xl bg-white/[0.05] border border-white/[0.15] text-white font-bold hover:bg-white/[0.1] hover:border-white/[0.25] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
                >
                  Contact Sales
                </button>
              </motion.div>

              {/* ============================================================
                  BENEFITS GRID
                 ============================================================ */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 sm:pt-8 border-t border-white/[0.08]"
              >
                {benefits.map((benefit, idx) => (
                  <BenefitCard key={benefit.id} benefit={benefit} index={idx} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}