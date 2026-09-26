import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  X,
  Activity,
  Heart,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BellOff,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 ALERTS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Critical: Rose    (#f43f5e)
   Warning:  Amber   (#f59e0b)
   Info:     Cyan    (#06b6d4)
   Success:  Emerald (#10b981)
   ============================================================ */

/* ==================== DEFAULT FOREIGN DATA (Rule 3) ==================== */
const DEFAULT_ALERTS = [
  {
    id: 1,
    severity: "critical",
    icon: Heart,
    message: "Patient #104 — BP spike 180/110 mmHg",
    room: "ICU-2",
    time: "Just now",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
    hex: "#f43f5e",
    bgClass: "bg-rose-500/[0.08] border-rose-500/30",
    textClass: "text-rose-600 dark:text-rose-400",
    label: "CRITICAL",
  },
  {
    id: 2,
    severity: "critical",
    icon: Activity,
    message: "Patient #217 — Heart rate 142 bpm",
    room: "Room 5",
    time: "2 min ago",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
    hex: "#f43f5e",
    bgClass: "bg-rose-500/[0.08] border-rose-500/30",
    textClass: "text-rose-600 dark:text-rose-400",
    label: "CRITICAL",
  },
  {
    id: 3,
    severity: "warning",
    icon: AlertTriangle,
    message: "Patient #89 — Oxygen saturation 89%",
    room: "Ward B",
    time: "5 min ago",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
    hex: "#f59e0b",
    bgClass: "bg-amber-500/[0.08] border-amber-500/30",
    textClass: "text-amber-600 dark:text-amber-400",
    label: "WARNING",
  },
];

const ROTATE_MS = 5000;

/* ============================================================
   ⚠️ ConfirmModal — Professional Warning Modal (Rule 4)
   NOTE: Baad mein ise ui/Modal/Modal.jsx se replace karna hai.
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

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

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
          aria-labelledby="alert-confirm-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
                  className="relative shrink-0"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/40">
                    <AlertTriangle size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-rose-500/40"
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3
                    id="alert-confirm-title"
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

                <button
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close dialog"
                  className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

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
   Toast — Action feedback
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
function AlertTickerSkeleton() {
  return (
    <div className="relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F172A] animate-pulse">
      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/10 shrink-0 ml-1" />
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-2.5 w-24 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-3 w-64 max-w-full bg-slate-200 dark:bg-white/10 rounded" />
      </div>
      <div className="hidden sm:block h-7 w-24 bg-slate-200 dark:bg-white/10 rounded-xl shrink-0" />
      <div className="w-7 h-7 bg-slate-200 dark:bg-white/10 rounded-lg shrink-0" />
    </div>
  );
}

/* ============================================================
   Empty State
   ============================================================ */
function AlertTickerEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-emerald-500/20 bg-emerald-500/[0.05]"
      role="status"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
        <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-[0.15em] uppercase">
          All Clear
        </p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
          No active alerts — all patients stable
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Error State
   ============================================================ */
function AlertTickerError({ message, onRetry }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: -10 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0 }}
      className="relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-rose-500/20 bg-rose-500/[0.05]"
      role="alert"
    >
      <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
        <AlertCircle size={18} className="text-rose-500" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 tracking-[0.15em] uppercase">
          Alerts Error
        </p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
          {message || "Failed to load alerts"}
        </p>
      </div>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="shrink-0 px-3 py-2 min-h-[40px] rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-black tracking-wider uppercase hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1.5"
          aria-label="Retry loading alerts"
        >
          <RefreshCw size={12} strokeWidth={2.5} />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: AlertTicker
   ============================================================ */
function AlertTicker({
  alerts: alertsProp = DEFAULT_ALERTS,
  loading = false,
  error = null,
  onRetry,
  onOpenVitals,
  onDismissAlert,
}) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [toast, setToast] = useState(null);

  const alerts = Array.isArray(alertsProp) ? alertsProp : [];

  /* ---- Toast helper ---- */
  const showToast = useCallback((message) => {
    setToast({ message });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Auto-rotate (respects reduced motion + pause) ---- */
  useEffect(() => {
    if (
      dismissed ||
      paused ||
      loading ||
      error ||
      alerts.length <= 1 ||
      prefersReduced
    ) {
      return;
    }
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % alerts.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [dismissed, paused, alerts.length, loading, error, prefersReduced]);

  /* ---- Reset current index if it exceeds new length ---- */
  useEffect(() => {
    if (current >= alerts.length && alerts.length > 0) {
      setCurrent(0);
    }
  }, [alerts.length, current]);

  /* ---- Handlers (Rule 3: Working buttons) ---- */
  const handleOpenVitals = useCallback(() => {
    const alert = alerts[current];
    if (!alert) return;
    if (onOpenVitals) {
      onOpenVitals(alert);
    } else {
      navigate(`/vitals/${alert.id}`);
    }
  }, [alerts, current, onOpenVitals, navigate]);

  const handleDismissClick = useCallback(() => {
    setShowDismissModal(true);
  }, []);

  const handleConfirmDismiss = useCallback(async () => {
    setDismissing(true);
    try {
      if (onDismissAlert) {
        await onDismissAlert(alerts);
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setShowDismissModal(false);
      setDismissed(true);
      showToast("All alerts dismissed");
    } catch (err) {
      showToast("Failed to dismiss alerts");
    } finally {
      setDismissing(false);
    }
  }, [alerts, onDismissAlert, showToast]);

  const handleDotClick = (i) => {
    setCurrent(i);
  };

  /* ---- States ---- */
  if (loading) return <AlertTickerSkeleton />;
  if (error) return <AlertTickerError message={error} onRetry={onRetry} />;
  if (dismissed) return null;
  if (alerts.length === 0) return <AlertTickerEmpty />;

  const alert = alerts[current] || alerts[0];
  const Icon = alert.icon || AlertTriangle;

  return (
    <>
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: -20, scale: 0.98 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
        exit={prefersReduced ? false : { opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="alert"
        aria-live="polite"
        aria-label={`${alert.label}: ${alert.message} in ${alert.room}`}
        className={cn(
          "group relative overflow-hidden flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-2xl",
          "backdrop-blur-xl border",
          alert.bgClass,
          "shadow-lg shadow-slate-900/5 dark:shadow-black/20"
        )}
      >
        {/* Animated background glow */}
        {!prefersReduced && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at left, ${alert.glow} 0%, transparent 50%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Left gradient accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: alert.gradient }}
          aria-hidden="true"
        />

        {/* Pulsing dot (hidden on very small) */}
        <span className="relative hidden xs:flex w-2.5 h-2.5 shrink-0 ml-1">
          {!prefersReduced && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: alert.hex }}
            />
          )}
          <span
            className="relative inline-flex rounded-full w-2.5 h-2.5"
            style={{ backgroundColor: alert.hex }}
          />
        </span>

        {/* Icon */}
        <motion.div
          animate={prefersReduced ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative p-2 rounded-xl shrink-0 shadow-lg"
          style={{
            background: alert.gradient,
            boxShadow: `0 6px 18px ${alert.glow}`,
          }}
        >
          <Icon size={16} className="text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={alert.id}
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={prefersReduced ? false : { opacity: 1, y: 0 }}
            exit={prefersReduced ? false : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span
                className={cn(
                  "text-[9px] font-black tracking-[0.15em] uppercase px-1.5 py-0.5 rounded",
                  alert.severity === "critical"
                    ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                    : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                )}
              >
                {alert.label}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 tracking-wider uppercase">
                {alert.room}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 tracking-wider uppercase">
                • {alert.time}
              </span>
            </div>
            <p
              className={cn(
                "text-sm font-bold truncate tracking-tight",
                alert.textClass
              )}
            >
              {alert.message}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots — now visible on mobile too */}
        {alerts.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            {alerts.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to alert ${i + 1} of ${alerts.length}`}
                aria-current={i === current}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
                  i === current
                    ? "w-5 sm:w-6"
                    : "w-1.5 hover:w-3 opacity-50 hover:opacity-100"
                )}
                style={{
                  backgroundColor: i === current ? alert.hex : "currentColor",
                }}
              />
            ))}
          </div>
        )}

        {/* Open Vitals Button (desktop only) */}
        <motion.button
          onClick={handleOpenVitals}
          whileHover={prefersReduced ? {} : { scale: 1.05, y: -1 }}
          whileTap={prefersReduced ? {} : { scale: 0.95 }}
          aria-label={`Open vitals for ${alert.message}`}
          className={cn(
            "hidden md:flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl shrink-0",
            "text-[11px] font-bold tracking-wider uppercase",
            "text-white shadow-lg transition-all",
            "hover:shadow-xl",
            "focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
          style={{
            background: alert.gradient,
            boxShadow: `0 6px 18px ${alert.glow}`,
          }}
        >
          <Zap size={12} strokeWidth={2.5} />
          Open Vitals
          <ArrowRight size={11} strokeWidth={3} />
        </motion.button>

        {/* Dismiss button */}
        <motion.button
          onClick={handleDismissClick}
          whileHover={prefersReduced ? {} : { scale: 1.1, rotate: 90 }}
          whileTap={prefersReduced ? {} : { scale: 0.9 }}
          aria-label="Dismiss all alerts"
          className={cn(
            "p-1.5 rounded-lg shrink-0 transition-colors",
            "text-slate-500 dark:text-slate-400",
            "hover:bg-slate-200/50 dark:hover:bg-white/10",
            "hover:text-slate-700 dark:hover:text-white",
            "focus:outline-none focus:ring-2 focus:ring-slate-400/50"
          )}
        >
          <X size={16} strokeWidth={2.5} />
        </motion.button>

        {/* Bottom progress bar — auto-rotate timing (hidden on reduced motion) */}
        {!paused && !prefersReduced && alerts.length > 1 && (
          <motion.div
            key={current}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
            style={{ background: alert.gradient }}
            aria-hidden="true"
          />
        )}
      </motion.div>

      {/* ⚠️ Dismiss warning modal (Rule 4) */}
      <ConfirmModal
        open={showDismissModal}
        onClose={() => !dismissing && setShowDismissModal(false)}
        onConfirm={handleConfirmDismiss}
        loading={dismissing}
        title="Dismiss all alerts?"
        message={`You are about to dismiss ${alerts.length} active alert${
          alerts.length > 1 ? "s" : ""
        }. Critical patient conditions may go unnoticed until you reload.`}
        confirmText="Yes, Dismiss All"
        cancelText="Keep Alerts"
      />

      {/* Toast */}
      <Toast toast={toast} />
    </>
  );
}

export default memo(AlertTicker);