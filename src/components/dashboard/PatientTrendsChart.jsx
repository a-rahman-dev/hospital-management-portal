import { useState, useEffect, useRef, useMemo, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Users,
  Calendar,
  AlertCircle,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { patientTrends as defaultTrends } from "@/data/trends";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 TRENDS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Primary:   Blue    (#3B82F6) — Patients
   Secondary: Violet  (#A855F7) — Appointments
   Accent:    Indigo  (#6366F1) — Grid/cursor
   Success:   Emerald (#10B981) — Growth badge
   ============================================================ */

/* ============================================================
   CountUp — with reduced motion + IntersectionObserver
   ============================================================ */
function CountUp({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setCount(value);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, value, prefersReduced]);

  useEffect(() => {
    if (!started || prefersReduced) return;
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
  }, [started, value, duration, prefersReduced]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ============================================================
   CustomTooltip — animated, respects reduced motion
   ============================================================ */
function CustomTooltip({ active, payload, label }) {
  const prefersReduced = useReducedMotion();
  if (!active || !payload?.length) return null;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 5, scale: 0.95 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
      className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl p-3 min-w-[150px]"
    >
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
          {label}
        </p>
      </div>

      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-3 mb-1 last:mb-0"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: entry.color,
                boxShadow: `0 0 8px ${entry.color}`,
              }}
            />
            <span className="text-[11px] font-medium text-slate-300">
              {entry.name}
            </span>
          </div>
          <span className="text-[12px] font-black text-white tabular-nums">
            {entry.value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ============================================================
   StatChip
   ============================================================ */
function StatChip({ icon: Icon, label, value, color, glow, delay }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={prefersReduced ? {} : { y: -3, scale: 1.02 }}
      className="group relative flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 overflow-hidden"
      style={{
        background: `${color}08`,
        borderColor: `${color}20`,
      }}
    >
      <div
        className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: glow }}
        aria-hidden="true"
      />

      <motion.div
        whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
        transition={{ duration: 0.2 }}
        className="relative p-1.5 sm:p-2 rounded-lg flex items-center justify-center shadow-lg shrink-0"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          boxShadow: `0 6px 18px ${glow}`,
        }}
      >
        <Icon size={13} className="text-white" strokeWidth={2.5} />
      </motion.div>

      <div className="relative min-w-0">
        <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] truncate">
          {label}
        </p>
        <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white tabular-nums leading-tight">
          <CountUp value={value} />
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Loading Skeleton
   ============================================================ */
function PatientTrendsSkeleton() {
  return (
    <div className="relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden h-full animate-pulse">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="h-2 w-48 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-7 w-24 bg-slate-200 dark:bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 gap-3 p-4 pb-0">
        <div className="h-14 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="h-14 bg-slate-200 dark:bg-white/10 rounded-xl" />
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="h-48 sm:h-60 bg-slate-100 dark:bg-white/[0.03] rounded-xl" />
      </div>
    </div>
  );
}

/* ============================================================
   Error State
   ============================================================ */
function PatientTrendsError({ message, onRetry }) {
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
        Failed to load trends
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[260px]">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="mt-4 px-3 py-2 min-h-[44px] rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black tracking-wider uppercase hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1.5"
          aria-label="Retry loading trends"
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
function PatientTrendsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl h-full flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center">
          <BarChart3 size={28} className="text-blue-500" strokeWidth={2} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-blue-500/20"
          aria-hidden="true"
        />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">
        No trend data
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
        Trend data will appear once available.
      </p>
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: PatientTrendsChart
   ============================================================ */
function PatientTrendsChart({
  trends = defaultTrends,
  loading = false,
  error = null,
  onRetry,
}) {
  const prefersReduced = useReducedMotion();
  const [period, setPeriod] = useState("Last 6 months");
  const [visibleSeries, setVisibleSeries] = useState({
    patients: true,
    appointments: true,
  });

  /* ---- Defensive: empty array guard ---- */
  const safeTrends = Array.isArray(trends) && trends.length > 0 ? trends : [];

  /* ---- Period filter (Rule 3: Working selector) ---- */
  const filteredTrends = useMemo(() => {
    if (safeTrends.length === 0) return [];
    if (period === "Last 3 months") return safeTrends.slice(-3);
    if (period === "All time") return safeTrends;
    return safeTrends.slice(-6); // Last 6 months
  }, [safeTrends, period]);

  /* ---- Stats ---- */
  const totalPatients = filteredTrends.reduce((s, d) => s + (d.patients || 0), 0);
  const totalAppointments = filteredTrends.reduce(
    (s, d) => s + (d.appointments || 0),
    0
  );

  const avgGrowth = useMemo(() => {
    if (filteredTrends.length < 2) return "0.0";
    const first = filteredTrends[0]?.patients || 0;
    const last = filteredTrends[filteredTrends.length - 1]?.patients || 0;
    if (first === 0) return "0.0";
    return (((last - first) / first) * 100).toFixed(1);
  }, [filteredTrends]);

  /* ---- Legend toggle (Rule 3: Working buttons) ---- */
  const toggleSeries = (series) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  /* ---- States ---- */
  if (loading) return <PatientTrendsSkeleton />;
  if (error) return <PatientTrendsError message={error} onRetry={onRetry} />;
  if (safeTrends.length === 0) return <PatientTrendsEmpty />;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden h-full"
    >
      {/* Background orbs */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 opacity-60" />

      {/* ============ HEADER ============ */}
      <div className="relative z-10 flex items-start justify-between gap-3 p-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
            transition={{ duration: 0.2 }}
            className="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 shrink-0"
          >
            <Activity size={15} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
              Patient Trends
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Monthly overview of patients & appointments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
            role="status"
          >
            <TrendingUp size={11} className="text-emerald-500" strokeWidth={2.5} />
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              +{avgGrowth}%
            </span>
          </motion.div>

          <div className="relative">
            <label htmlFor="trends-period" className="sr-only">
              Select period
            </label>
            <select
              id="trends-period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none text-[11px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-2.5 pr-7 py-2 min-h-[36px] text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>All time</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="9"
                height="9"
                viewBox="0 0 10 10"
                fill="none"
                className="text-slate-500"
              >
                <path
                  d="M1 3L5 7L9 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ============ STAT CHIPS ============ */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 p-3 sm:p-4 pb-0">
        <StatChip
          icon={Users}
          label="Patients"
          value={totalPatients}
          color="#3b82f6"
          glow="rgba(59, 130, 246, 0.35)"
          delay={0.1}
        />
        <StatChip
          icon={Calendar}
          label="Appointments"
          value={totalAppointments}
          color="#a855f7"
          glow="rgba(168, 85, 247, 0.35)"
          delay={0.2}
        />
      </div>

      {/* ============ CHART ============ */}
      <div className="relative z-10 p-3 sm:p-4 pt-3">
        <div className="h-48 sm:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredTrends}
              margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id="patientsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="appointmentsGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
                <filter id="line-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/[0.06]"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fontWeight: 700 }}
                dy={6}
              />

              <YAxis
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fontWeight: 700 }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#6366F1",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                  opacity: 0.5,
                }}
              />

              {visibleSeries.patients && (
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#patientsGrad)"
                  name="Patients"
                  animationDuration={prefersReduced ? 0 : 1500}
                  dot={{
                    r: 3.5,
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#3B82F6",
                    stroke: "#fff",
                    strokeWidth: 3,
                    filter: "url(#line-glow)",
                  }}
                />
              )}

              {visibleSeries.appointments && (
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  fill="url(#appointmentsGrad)"
                  name="Appointments"
                  animationDuration={prefersReduced ? 0 : 1500}
                  animationBegin={prefersReduced ? 0 : 300}
                  dot={{
                    r: 3.5,
                    fill: "#A855F7",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#A855F7",
                    stroke: "#fff",
                    strokeWidth: 3,
                    filter: "url(#line-glow)",
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ============ LEGEND (Working toggle) ============ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={prefersReduced ? false : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06]"
        >
          <button
            type="button"
            onClick={() => toggleSeries("patients")}
            aria-pressed={visibleSeries.patients}
            aria-label={`Toggle Patients series ${visibleSeries.patients ? "off" : "on"}`}
            className={cn(
              "group flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 min-h-[36px] transition-all",
              "hover:bg-slate-100 dark:hover:bg-white/5",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
              !visibleSeries.patients && "opacity-40"
            )}
          >
            <motion.span
              whileHover={prefersReduced ? {} : { scale: 1.4 }}
              className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
            />
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
              Patients
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries("appointments")}
            aria-pressed={visibleSeries.appointments}
            aria-label={`Toggle Appointments series ${visibleSeries.appointments ? "off" : "on"}`}
            className={cn(
              "group flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 min-h-[36px] transition-all",
              "hover:bg-slate-100 dark:hover:bg-white/5",
              "focus:outline-none focus:ring-2 focus:ring-purple-500/30",
              !visibleSeries.appointments && "opacity-40"
            )}
          >
            <motion.span
              whileHover={prefersReduced ? {} : { scale: 1.4 }}
              className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"
            />
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-purple-500 transition-colors">
              Appointments
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default memo(PatientTrendsChart);