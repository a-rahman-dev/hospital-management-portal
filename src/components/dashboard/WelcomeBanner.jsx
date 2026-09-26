import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Plus,
  Activity,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  X,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

/* ============================================================
   🎨 DASHBOARD SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Primary:   Cyan    (#06b6d4)
   Secondary: Violet  (#8b5cf6)
   Accent:    Blue    (#3b82f6)
   Success:   Emerald (#10b981)
   Danger:    Rose    (#f43f5e)
   ============================================================ */

/* ==================== DEFAULT FOREIGN DATA (Rule 3) ==================== */
const DEFAULT_DATA = {
  user: { name: "Dr. A.Rehman", role: "Chief Cardiologist" },
  hospital: { name: "AY Int. Hospital" },
  stats: {
    appointments: 18,
    alerts: 3,
    successRate: 98.4,
  },
};

/* ==================== ANIMATION VARIANTS ==================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ============================================================
   MiniStat — Compact stat pill with glow (memoized)
   ============================================================ */
const MiniStat = memo(function MiniStat({
  icon: Icon,
  value,
  label,
  color,
  glow,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      role="status"
      aria-label={`${label}: ${value}`}
      className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 overflow-hidden cursor-default"
      style={{
        background: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: glow }}
        aria-hidden="true"
      />
      <div
        className="relative p-1 rounded-md flex items-center justify-center"
        style={{ background: `${color}20` }}
      >
        <Icon size={11} style={{ color }} strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div className="relative flex items-baseline gap-1">
        <span
          className="text-sm font-black tabular-nums leading-none"
          style={{ color }}
        >
          {value}
        </span>
        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          {label}
        </span>
      </div>
    </motion.div>
  );
});

/* ============================================================
   ⚠️ ConfirmModal — Professional Warning Modal (Rule 4)
   ─────────────────────────────────────────────
   NOTE: Baad mein ise `ui/Modal/Modal.jsx` se replace karna hai.
   Abhi ke liye self-contained hai.
   ============================================================ */
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  const prefersReduced = useReducedMotion();

  // ESC key to close
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: prefersReduced ? 0 : 0.25,
              ease: "easeOut",
            }}
            className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Top danger accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />

            <div className="p-5 sm:p-6">
              {/* Warning Icon */}
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
                  className="relative shrink-0"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/40">
                    <AlertTriangle
                      size={24}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-rose-500/40"
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3
                    id="confirm-title"
                    className="text-lg font-black text-slate-900 dark:text-white leading-tight"
                  >
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {message}
                  </p>
                  <p className="mt-2 text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertCircle size={12} strokeWidth={2.5} />
                    This action cannot be undone.
                  </p>
                </div>

                {/* Close btn */}
                <button
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close dialog"
                  className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <motion.button
                  onClick={onConfirm}
                  disabled={loading}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden inline-flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
                    boxShadow: "0 8px 24px rgba(244, 63, 94, 0.35)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{confirmText}</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Toast — Success feedback
   ============================================================ */
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl max-w-[calc(100vw-2rem)]"
          role="status"
          aria-live="polite"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} strokeWidth={2.5} className="text-white" />
          </div>
          <p className="text-sm font-bold">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Loading Skeleton
   ============================================================ */
function WelcomeBannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] p-4 lg:p-5 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-2.5 w-32 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="h-6 w-64 max-w-full bg-slate-200 dark:bg-white/10 rounded" />
            <div className="h-2.5 w-48 max-w-full bg-slate-200 dark:bg-white/10 rounded" />
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
              <div className="h-7 w-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
              <div className="h-7 w-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-32 bg-slate-200 dark:bg-white/10 rounded-xl" />
          <div className="h-11 w-40 bg-slate-200 dark:bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Error State
   ============================================================ */
function WelcomeBannerError({ message, onRetry }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-rose-200 dark:border-rose-500/20 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-rose-500" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Failed to load dashboard
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {message || "Something went wrong. Please try again."}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black tracking-wider uppercase hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={12} strokeWidth={2.5} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   🎯 MAIN: WelcomeBanner
   ============================================================ */
export default function WelcomeBanner({
  user = DEFAULT_DATA.user,
  hospital = DEFAULT_DATA.hospital,
  stats = DEFAULT_DATA.stats,
  loading = false,
  error = null,
  onNewAppointment,
  onViewSchedule,
  onDismissAlert,
  onRetry,
}) {
  const [greeting, setGreeting] = useState("Welcome back");
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [toast, setToast] = useState(null);
  const prefersReduced = useReducedMotion();

  /* ---- Greeting based on time ---- */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  /* ---- Toast helper ---- */
  const showToast = useCallback((message) => {
    setToast({ message });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Handlers (Rule 3: Every button works) ---- */
  const handleViewSchedule = useCallback(() => {
    if (onViewSchedule) onViewSchedule();
    else showToast("Opening your schedule...");
  }, [onViewSchedule, showToast]);

  const handleNewAppointment = useCallback(() => {
    if (onNewAppointment) onNewAppointment();
    else showToast("Opening new appointment form...");
  }, [onNewAppointment, showToast]);

  /* ---- Sensitive: Dismiss critical alert (Rule 4) ---- */
  const handleDismissClick = useCallback(() => {
    setShowDismissModal(true);
  }, []);

  const handleConfirmDismiss = useCallback(async () => {
    setDismissing(true);
    try {
      if (onDismissAlert) {
        await onDismissAlert();
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setShowDismissModal(false);
      showToast("Alert dismissed successfully");
    } catch (err) {
      showToast("Failed to dismiss alert");
    } finally {
      setDismissing(false);
    }
  }, [onDismissAlert, showToast]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* ---- States ---- */
  if (loading) return <WelcomeBannerSkeleton />;
  if (error) return <WelcomeBannerError message={error} onRetry={onRetry} />;

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-500 opacity-60" />

        {/* Breathing orbs (disabled on reduced motion) */}
        {!prefersReduced && (
          <>
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
          </>
        )}

        {/* ============ MAIN CONTENT ============ */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 lg:p-5">
          {/* ---- Left Section ---- */}
          <motion.div
            variants={itemVariants}
            className="flex items-start sm:items-center gap-3 min-w-0 flex-1"
          >
            {/* Icon (hidden on very small) */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: -5 }}
              transition={{ duration: 0.2 }}
              className="relative shrink-0 hidden sm:flex"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <Stethoscope size={24} className="text-white" strokeWidth={2.2} />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 opacity-30 blur-lg -z-10" />
              <motion.span
                animate={
                  prefersReduced
                    ? {}
                    : { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }
                }
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F172A] flex items-center justify-center"
                aria-label="Online status"
              >
                <span className="w-1 h-1 rounded-full bg-white" />
              </motion.span>
            </motion.div>

            {/* Text Content */}
            <div className="min-w-0 flex-1">
              {/* Top row — Brand + Date */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <Activity
                    size={11}
                    className="text-cyan-500"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.15em] truncate">
                    {hospital.name}
                  </p>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                  {today}
                </p>
              </div>

              {/* Greeting */}
              <motion.h1
                variants={itemVariants}
                className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight"
              >
                {greeting},{" "}
                <span className="bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </motion.h1>

              {/* Sub text */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.appointments} appointments
                </span>{" "}
                today,{" "}
                <button
                  onClick={handleDismissClick}
                  className="font-bold text-rose-500 hover:text-rose-600 hover:underline underline-offset-2 transition-colors"
                  aria-label="Review critical alerts"
                >
                  {stats.alerts} critical alerts
                </button>{" "}
                need attention.
              </p>

              {/* Mini Stats */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <MiniStat
                  icon={Calendar}
                  value={stats.appointments}
                  label="Appts"
                  color="#06b6d4"
                  glow="rgba(6, 182, 212, 0.4)"
                  delay={0.2}
                />
                <MiniStat
                  icon={AlertTriangle}
                  value={stats.alerts}
                  label="Alerts"
                  color="#f43f5e"
                  glow="rgba(244, 63, 94, 0.4)"
                  delay={0.3}
                />
                <MiniStat
                  icon={TrendingUp}
                  value={`${stats.successRate}%`}
                  label="Success"
                  color="#10b981"
                  glow="rgba(16, 185, 129, 0.4)"
                  delay={0.4}
                />
              </div>
            </div>
          </motion.div>

          {/* ---- Right Section — Actions ---- */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto"
          >
            <motion.button
              onClick={handleViewSchedule}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="View schedule"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <Calendar size={14} strokeWidth={2.5} aria-hidden="true" />
              View Schedule
            </motion.button>

            <motion.button
              onClick={handleNewAppointment}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Create new appointment"
              className="group relative flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
              }}
            >
              <span
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                aria-hidden="true"
              />
              <Plus size={14} className="relative z-10" strokeWidth={2.5} />
              <span className="relative z-10 whitespace-nowrap">
                New Appointment
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom subtle glow */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </motion.div>

      {/* ⚠️ Warning Modal for sensitive action */}
      <ConfirmModal
        open={showDismissModal}
        onClose={() => !dismissing && setShowDismissModal(false)}
        onConfirm={handleConfirmDismiss}
        loading={dismissing}
        title="Dismiss critical alerts?"
        message={`You are about to dismiss ${stats.alerts} critical alert${
          stats.alerts > 1 ? "s" : ""
        } without reviewing. Patients may need immediate attention.`}
        confirmText="Yes, Dismiss"
        cancelText="Review Now"
      />

      {/* Toast */}
      <Toast toast={toast} />
    </>
  );
}