import { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  RefreshCw,
  PieChart as PieChartIcon,
} from "lucide-react";
import { appointmentData as defaultData } from "@/data/trends";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 APPOINTMENTS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Primary:   Violet  (#8b5cf6)
   Secondary: Fuchsia (#d946ef)
   Accent:    Purple  (#a855f7)
   Top badge: Amber   (#f59e0b)
   ============================================================ */

/* ============================================================
   CountUp — reduced motion aware
   ============================================================ */
function CountUp({ value, duration = 1500 }) {
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

  return <span>{count}</span>;
}

/* ============================================================
   CustomTooltip — reduced motion aware
   ============================================================ */
function CustomTooltip({ active, payload }) {
  const prefersReduced = useReducedMotion();
  if (!active || !payload?.length) return null;
  const data = payload[0];

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 5, scale: 0.95 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
      className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl p-3 min-w-[140px]"
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: data.payload.color,
            boxShadow: `0 0 8px ${data.payload.color}`,
          }}
        />
        <p className="text-[11px] font-bold text-white">{data.name}</p>
      </div>
      <p className="text-[10px] text-slate-400 ml-4">
        <span className="font-black text-white">{data.value}</span> appointments
      </p>
    </motion.div>
  );
}

/* ============================================================
   Loading Skeleton
   ============================================================ */
function AppointmentPieSkeleton() {
  return (
    <div className="relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden h-full animate-pulse">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="h-2 w-20 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-200 dark:bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Chart circle */}
      <div className="p-4 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-white/[0.03]" />
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 bg-slate-100 dark:bg-white/[0.03] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Error State
   ============================================================ */
function AppointmentPieError({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-[#0F172A] border border-rose-200 dark:border-rose-500/20 rounded-2xl h-full flex flex-col items-center justify-center py-12 px-4 text-center"
      role="alert"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-rose-500" strokeWidth={2.5} />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">
        Failed to load appointments
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="mt-4 px-3 py-2 min-h-[44px] rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black tracking-wider uppercase hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1.5"
          aria-label="Retry loading appointments"
        >
          <RefreshCw size={12} strokeWidth={2.5} />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}

/* ============================================================
   Empty State
   ============================================================ */
function AppointmentPieEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl h-full flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center">
          <PieChartIcon size={28} className="text-violet-500" strokeWidth={2} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-violet-500/20"
          aria-hidden="true"
        />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">
        No appointment data
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
        Department breakdown will appear here.
      </p>
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: AppointmentPieChart
   ============================================================ */
function AppointmentPieChart({
  data = defaultData,
  loading = false,
  error = null,
  onRetry,
  onDepartmentClick,
}) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  /* ---- Defensive: empty array guard ---- */
  const safeData = Array.isArray(data) && data.length > 0 ? data : [];

  /* ---- Derived values ---- */
  const total = useMemo(
    () => safeData.reduce((sum, d) => sum + (d.value || 0), 0),
    [safeData]
  );

  const topDept = useMemo(() => {
    if (safeData.length === 0) return null;
    return [...safeData].sort((a, b) => b.value - a.value)[0];
  }, [safeData]);

  /* ---- Handlers (Rule 3: Working buttons) ---- */
  const handleLegendClick = (dept) => {
    if (onDepartmentClick) {
      onDepartmentClick(dept);
    } else {
      navigate(
        `/appointments?dept=${encodeURIComponent(dept.name.toLowerCase())}`
      );
    }
  };

  const handleKeyDown = (e, dept) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLegendClick(dept);
    }
  };

  /* ---- States ---- */
  if (loading) return <AppointmentPieSkeleton />;
  if (error) return <AppointmentPieError message={error} onRetry={onRetry} />;
  if (safeData.length === 0) return <AppointmentPieEmpty />;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden h-full"
    >
      {/* Background glow */}
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {!prefersReduced && (
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 opacity-60" />

      {/* ============ HEADER ============ */}
      <div className="relative z-10 flex items-start justify-between p-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="relative p-2 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30 shrink-0"
          >
            <Activity size={15} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
              Appointments
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              By department
            </p>
          </div>
        </div>

        <motion.div
          whileHover={prefersReduced ? {} : { scale: 1.05 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 shrink-0"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"
            aria-hidden="true"
          />
          <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 tracking-wider">
            {safeData.length} DEPTS
          </span>
        </motion.div>
      </div>

      {/* ============ CHART ============ */}
      <div className="relative z-10 p-4">
        <div className="relative h-44 sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {safeData.map((dept, i) => (
                  <linearGradient
                    key={i}
                    id={`pie-grad-${i}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={dept.color} stopOpacity={1} />
                    <stop
                      offset="100%"
                      stopColor={dept.color}
                      stopOpacity={0.7}
                    />
                  </linearGradient>
                ))}
                <filter id="slice-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <Pie
                data={safeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={80}
                paddingAngle={3}
                cornerRadius={6}
                stroke="none"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={prefersReduced ? 0 : 800}
              >
                {safeData.map((entry, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <Cell
                      key={entry.name}
                      fill={`url(#pie-grad-${i})`}
                      style={{
                        filter: isActive ? "url(#slice-glow)" : "none",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.p
              initial={prefersReduced ? false : { scale: 0.5, opacity: 0 }}
              animate={prefersReduced ? false : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="text-2xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums"
            >
              <CountUp value={total} />
            </motion.p>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mt-0.5">
              Total
            </p>
          </div>
        </div>

        {/* ============ LEGEND (Working buttons — Rule 3) ============ */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06] space-y-1">
          {safeData.map((dept, i) => {
            const pct = ((dept.value / total) * 100).toFixed(0);
            const isActive = activeIndex === i;
            const isTop = topDept && dept.name === topDept.name;

            return (
              <motion.button
                key={dept.name}
                type="button"
                initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => handleLegendClick(dept)}
                onKeyDown={(e) => handleKeyDown(e, dept)}
                aria-label={`${dept.name}: ${dept.value} appointments (${pct}%). Click to view.`}
                className={cn(
                  "group/row w-full flex items-center justify-between p-2 -mx-1.5 rounded-lg transition-all duration-200 cursor-pointer text-left",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/30",
                  isActive
                    ? "bg-slate-100 dark:bg-white/[0.06]"
                    : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <motion.span
                    animate={{ scale: isActive ? 1.4 : 1 }}
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: dept.color,
                      boxShadow: isActive
                        ? `0 0 12px ${dept.color}`
                        : `0 0 6px ${dept.color}80`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "text-[11px] font-bold truncate transition-colors",
                      isActive
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {dept.name}
                  </span>
                  {isTop && (
                    <motion.span
                      animate={
                        prefersReduced ? {} : { y: [0, -2, 0] }
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 tracking-wider"
                    >
                      TOP
                    </motion.span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Progress bar (hidden on very small) */}
                  <div className="hidden xs:flex sm:flex w-10 sm:w-14 h-1.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                    <motion.div
                      initial={prefersReduced ? false : { width: 0 }}
                      animate={prefersReduced ? false : { width: `${pct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + i * 0.05,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: dept.color,
                        boxShadow: isActive ? `0 0 8px ${dept.color}` : "none",
                      }}
                    />
                  </div>

                  {/* Percentage */}
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tabular-nums w-8 text-right">
                    {pct}%
                  </span>

                  {/* Value */}
                  <span
                    className={cn(
                      "text-[11px] font-black tabular-nums w-8 text-right transition-colors",
                      isActive
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {dept.value}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(AppointmentPieChart);