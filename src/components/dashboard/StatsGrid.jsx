import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, RefreshCw, Inbox } from "lucide-react";
import { stats as defaultStats } from "@/data/stats";
import StatsCard from "./StatsCard";

/* ============================================================
   🎨 STATS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Har card ka apna color — StatsCard handle karta hai.
   Grid sirf layout + states deta hai.
   ============================================================ */

/* ==================== ANIMATION VARIANTS ==================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/* ============================================================
   Loading Skeleton — 4 cards shimmer
   ============================================================ */
function StatsGridSkeleton({ count = 4 }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      aria-busy="true"
      aria-label="Loading statistics"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] p-4 sm:p-5 animate-pulse"
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-white/10" />

          {/* Icon */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="w-12 h-5 rounded-lg bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Value */}
          <div className="mt-4 h-7 w-24 bg-slate-200 dark:bg-white/10 rounded" />

          {/* Label */}
          <div className="mt-2 h-2.5 w-32 bg-slate-200 dark:bg-white/10 rounded" />

          {/* Sparkline */}
          <div className="mt-4 h-8 w-full bg-slate-100 dark:bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Empty State — Agar koi stat nahi
   ============================================================ */
function StatsGridEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] p-8 sm:p-10 text-center"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Inbox size={24} className="text-cyan-500" strokeWidth={2} />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-cyan-500/20"
            aria-hidden="true"
          />
        </div>
        <h4 className="text-sm font-black text-slate-900 dark:text-white">
          No statistics available
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
          Stats will appear here once data is available.
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Error State — Agar data fetch fail ho
   ============================================================ */
function StatsGridError({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-rose-200 dark:border-rose-500/20 p-5"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-rose-500" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Failed to load statistics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {message || "Something went wrong. Please try again."}
          </p>
        </div>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="shrink-0 px-3 py-2 min-h-[44px] rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black tracking-wider uppercase hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1.5"
            aria-label="Retry loading statistics"
          >
            <RefreshCw size={12} strokeWidth={2.5} />
            Retry
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: StatsGrid
   ============================================================ */
function StatsGrid({
  stats = defaultStats,
  loading = false,
  error = null,
  onRetry,
  onCardClick,
}) {
  const prefersReduced = useReducedMotion();

  /* ---- States ---- */
  if (loading) return <StatsGridSkeleton count={4} />;
  if (error) return <StatsGridError message={error} onRetry={onRetry} />;
  if (!stats || stats.length === 0) return <StatsGridEmpty />;

  return (
    <motion.div
      variants={prefersReduced ? {} : containerVariants}
      initial={prefersReduced ? false : "hidden"}
      animate={prefersReduced ? false : "visible"}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      role="region"
      aria-label="Key statistics"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label || stat.id || idx}
          variants={prefersReduced ? {} : itemVariants}
          className="min-w-0"
        >
          <StatsCard stat={stat} onClick={onCardClick} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default memo(StatsGrid);