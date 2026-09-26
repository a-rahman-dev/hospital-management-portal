import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  X,
  ArrowUpRight,
  Sparkles,
  Download,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Sparkline from "@/components/ui/Sparkline/Sparkline";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 STATS CARD COLOR VARIANTS (Rule 5)
   Each stat gets its own color family — consistent within section
   ============================================================ */
const variants = {
  indigo: {
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    glowColor: "rgba(99, 102, 241, 0.35)",
    lineGradient: "linear-gradient(180deg, #6366F1 0%, #4F46E5 100%)",
    hex: "#6366F1",
    softText: "text-indigo-500",
  },
  emerald: {
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    glowColor: "rgba(16, 185, 129, 0.35)",
    lineGradient: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
    hex: "#10B981",
    softText: "text-emerald-500",
  },
  amber: {
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    glowColor: "rgba(245, 158, 11, 0.35)",
    lineGradient: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
    hex: "#F59E0B",
    softText: "text-amber-500",
  },
  cyan: {
    gradient: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
    glowColor: "rgba(6, 182, 212, 0.35)",
    lineGradient: "linear-gradient(180deg, #06B6D4 0%, #0284C7 100%)",
    hex: "#06B6D4",
    softText: "text-cyan-500",
  },
  rose: {
    gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
    glowColor: "rgba(244, 63, 94, 0.35)",
    lineGradient: "linear-gradient(180deg, #F43F5E 0%, #E11D48 100%)",
    hex: "#F43F5E",
    softText: "text-rose-500",
  },
  purple: {
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    glowColor: "rgba(168, 85, 247, 0.35)",
    lineGradient: "linear-gradient(180deg, #A855F7 0%, #9333EA 100%)",
    hex: "#A855F7",
    softText: "text-purple-500",
  },
  blue: {
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    glowColor: "rgba(59, 130, 246, 0.35)",
    lineGradient: "linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)",
    hex: "#3B82F6",
    softText: "text-blue-500",
  },
  emeraldGold: {
    gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    glowColor: "rgba(16, 185, 129, 0.35)",
    lineGradient: "linear-gradient(180deg, #10B981 0%, #047857 100%)",
    hex: "#10B981",
    softText: "text-emerald-500",
  },
};

/* ============================================================
   AnimatedValue — Counter with reduced-motion support
   ============================================================ */
function AnimatedValue({ value, animate = true }) {
  const [display, setDisplay] = useState(animate ? 0 : parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!animate || prefersReduced) {
      const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
      setDisplay(numericValue);
      return;
    }

    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    let start = 0;
    const duration = 1200;
    const increment = numericValue / (duration / 16);
    let frame;

    const update = () => {
      start += increment;
      if (start < numericValue) {
        setDisplay(Math.floor(start));
        frame = requestAnimationFrame(update);
      } else {
        setDisplay(numericValue);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value, animate, prefersReduced]);

  const prefix = String(value).match(/^[^0-9]*/)?.[0] || "";
  const suffix = String(value).match(/[^0-9.]*$/)?.[0] || "";

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ============================================================
   📊 StatsCard
   ============================================================ */
function StatsCard({ stat, onClick, onViewReport }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();

  const Icon = stat.icon || Sparkles;
  const isUp = stat.trend === "up";
  const v = variants[stat.color] || variants.blue;
  const sparkline = Array.isArray(stat.sparkline) ? stat.sparkline : [0, 0, 0, 0, 0, 0, 0];
  const breakdown = Array.isArray(stat.breakdown) ? stat.breakdown : [];

  /* ---- Open drawer (respects external onClick) ---- */
  const handleCardClick = useCallback(() => {
    if (onClick) {
      onClick(stat);
    } else {
      setDrawerOpen(true);
    }
  }, [onClick, stat]);

  /* ---- Close drawer ---- */
  const handleClose = useCallback(() => setDrawerOpen(false), []);

  /* ---- ESC key + body scroll lock ---- */
  useEffect(() => {
    if (!drawerOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = original;
    };
  }, [drawerOpen, handleClose]);

  /* ---- View Full Report (Rule 3: Working button) ---- */
  const handleViewReport = useCallback(() => {
    if (onViewReport) {
      onViewReport(stat);
    } else {
      navigate(`/reports/${stat.id || stat.label?.toLowerCase().replace(/\s+/g, "-")}`);
    }
  }, [onViewReport, stat, navigate]);

  return (
    <>
      {/* ============ MAIN CARD ============ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20, scale: 0.95 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={prefersReduced ? {} : { y: -4, scale: 1.01 }}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${stat.label}: ${stat.value}, ${stat.change} ${isUp ? "up" : "down"}. Click for details.`}
        className={cn(
          "group relative cursor-pointer",
          "rounded-2xl p-4 pl-5",
          "bg-white dark:bg-[#0F172A]",
          "border border-gray-200 dark:border-white/[0.08]",
          "shadow-[0_4px_20px_rgba(15,23,42,0.04)]",
          "dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
          "hover:border-indigo-400/40 dark:hover:border-indigo-500/40",
          "hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]",
          "dark:hover:shadow-[0_12px_40px_rgba(99,102,241,0.25)]",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
          "transition-all duration-300",
          "overflow-hidden"
        )}
      >
        {/* Left accent line */}
        <div
          className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full"
          style={{
            background: v.lineGradient,
            boxShadow: `0 0 12px ${v.glowColor}, 0 0 4px ${v.glowColor}`,
          }}
          aria-hidden="true"
        />

        {/* Breathing glow orb */}
        {!prefersReduced && (
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-12 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-2xl pointer-events-none"
            style={{ background: v.glowColor }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3.5">
            {/* Icon */}
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: v.gradient,
                boxShadow: `0 6px 18px ${v.glowColor}`,
              }}
            >
              <Icon size={19} className="text-white" strokeWidth={2.5} />
            </motion.div>

            {/* Trend Badge */}
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.05 }}
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black backdrop-blur-sm",
                isUp
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              )}
            >
              {isUp ? (
                <TrendingUp size={11} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={11} strokeWidth={2.5} />
              )}
              {stat.change}
            </motion.div>
          </div>

          {/* Value */}
          <p className="text-[1.55rem] font-black tracking-[-0.5px] text-slate-900 dark:text-slate-50 leading-none tabular-nums">
            <AnimatedValue value={stat.value} />
          </p>

          {/* Label */}
          <p className="text-[0.7rem] font-black text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-[0.1em]">
            {stat.label}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.06]">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              {stat.context || "vs last week"}
            </span>
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.2, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight
                size={13}
                className={cn("transition-colors", v.softText)}
                strokeWidth={2.5}
              />
            </motion.div>
          </div>
        </div>

        {/* Top-right subtle glow */}
        <div
          className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{ background: v.glowColor }}
          aria-hidden="true"
        />
      </motion.div>

      {/* ============ DRAWER ============ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { type: "spring", damping: 30, stiffness: 300 }
              }
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white dark:bg-[#0F172A] border-l border-gray-200 dark:border-white/[0.08] shadow-2xl z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="stat-drawer-title"
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: v.gradient }}
                aria-hidden="true"
              />

              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-white/[0.08]">
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div
                    whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: v.gradient,
                      boxShadow: `0 6px 18px ${v.glowColor}`,
                    }}
                  >
                    <Icon size={20} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                  <div className="min-w-0">
                    <h3
                      id="stat-drawer-title"
                      className="font-black text-slate-900 dark:text-slate-50 tracking-tight truncate"
                    >
                      {stat.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Detailed breakdown
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleClose}
                  whileHover={prefersReduced ? {} : { scale: 1.1, rotate: 90 }}
                  whileTap={prefersReduced ? {} : { scale: 0.9 }}
                  aria-label="Close details"
                  className="shrink-0 p-2 min-h-[40px] min-w-[40px] rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Current Value Card */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={prefersReduced ? false : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/[0.06]"
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
                    style={{ background: v.glowColor }}
                    aria-hidden="true"
                  />

                  <div className="relative">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Current Value
                    </p>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                      {stat.value}
                    </p>

                    <div className="mt-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black border",
                          isUp
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        )}
                      >
                        {isUp ? (
                          <TrendingUp size={11} strokeWidth={2.5} />
                        ) : (
                          <TrendingDown size={11} strokeWidth={2.5} />
                        )}
                        {stat.change} vs last week
                      </span>
                    </div>

                    <div className="mt-4 overflow-hidden">
                      <Sparkline
                        data={sparkline}
                        color={v.hex}
                        width={340}
                        height={60}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Breakdown */}
                {breakdown.length > 0 && (
                  <motion.div
                    initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                    animate={prefersReduced ? false : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={12} style={{ color: v.hex }} />
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-50 tracking-wider uppercase">
                        Breakdown
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {breakdown.map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                          animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          whileHover={prefersReduced ? {} : { x: 4 }}
                          className="group/item flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.06] hover:border-slate-200 dark:hover:border-white/[0.1] transition-colors cursor-default"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: v.hex,
                                boxShadow: `0 0 6px ${v.hex}`,
                              }}
                              aria-hidden="true"
                            />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-sm font-black text-slate-900 dark:text-slate-50 tabular-nums shrink-0">
                            {item.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Last 7 Days Bar Chart */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={prefersReduced ? false : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={12} style={{ color: v.hex }} />
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-50 tracking-wider uppercase">
                      Last 7 Days
                    </h4>
                  </div>
                  <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-24">
                    {sparkline.map((val, i) => {
                      const max = Math.max(...sparkline) || 1;
                      const pct = (val / max) * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-1 group/bar"
                        >
                          <motion.div
                            initial={prefersReduced ? false : { height: 0 }}
                            animate={prefersReduced ? false : { height: `${pct}%` }}
                            transition={{
                              duration: 0.6,
                              delay: 0.4 + i * 0.05,
                              ease: "easeOut",
                            }}
                            whileHover={prefersReduced ? {} : { scale: 1.1 }}
                            className="w-full rounded-t-md cursor-pointer"
                            style={{
                              background: v.gradient,
                              opacity: 0.75,
                              boxShadow: `0 0 8px ${v.glowColor}`,
                            }}
                            aria-label={`Day ${i + 1}: ${val}`}
                          />
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Actions — working buttons (Rule 3) */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={prefersReduced ? false : { opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2 pt-2"
                >
                  {/* Primary — View Full Report */}
                  <motion.button
                    onClick={handleViewReport}
                    whileHover={prefersReduced ? {} : { scale: 1.02, y: -2 }}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    aria-label={`View full report for ${stat.label}`}
                    className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-xl text-white font-black tracking-wider uppercase text-xs shadow-lg transition-all"
                    style={{
                      background: v.gradient,
                      boxShadow: `0 8px 24px ${v.glowColor}`,
                    }}
                  >
                    <Sparkles size={14} strokeWidth={2.5} />
                    View Full Report
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </motion.button>

                  {/* Secondary — Export */}
                  <motion.button
                    onClick={() =>
                      console.warn("Export — will be wired later")
                    }
                    whileHover={prefersReduced ? {} : { scale: 1.02 }}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    aria-label={`Export ${stat.label} data`}
                    className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-black tracking-wider uppercase text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  >
                    <Download size={14} strokeWidth={2.5} />
                    Export Data
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(StatsCard);