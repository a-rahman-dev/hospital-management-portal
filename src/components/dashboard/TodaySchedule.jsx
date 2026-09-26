import { useState, useEffect, useCallback, memo } from "react";
import {
  Clock,
  ArrowRight,
  Calendar,
  Sparkles,
  X,
  RefreshCw,
  Loader2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  CalendarX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Badge from "@/components/ui/Badge/Badge";
import Avatar from "@/components/ui/Avatar/Avatar";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 APPOINTMENTS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Primary:   Purple  (#a855f7)
   Secondary: Fuchsia (#d946ef)
   Accent:    Pink    (#ec4899)
   Success:   Emerald (#10b981)
   Warning:   Amber   (#f59e0b)
   Danger:    Rose    (#f43f5e)
   ============================================================ */

/* ==================== DEFAULT FOREIGN DATA (Rule 3) ==================== */
const DEFAULT_APPOINTMENTS = [
  { id: 1, time: "09:00 AM", patient: "Jonathan Mitchell", doctor: "Dr. Sarah Chen", type: "General", status: "Confirmed", color: "#3b82f6", gradient: "linear-gradient(180deg, #3b82f6 0%, #4f46e5 100%)", glow: "rgba(59, 130, 246, 0.35)" },
  { id: 2, time: "10:30 AM", patient: "Emma Rodriguez", doctor: "Dr. Michael Park", type: "Checkup", status: "Confirmed", color: "#a855f7", gradient: "linear-gradient(180deg, #a855f7 0%, #d946ef 100%)", glow: "rgba(168, 85, 247, 0.35)" },
  { id: 3, time: "12:00 PM", patient: "William Anderson", doctor: "Dr. Sarah Chen", type: "Follow-up", status: "Pending", color: "#f59e0b", gradient: "linear-gradient(180deg, #f59e0b 0%, #ea580c 100%)", glow: "rgba(245, 158, 11, 0.35)" },
  { id: 4, time: "02:30 PM", patient: "Sophia Bennett", doctor: "Dr. James Wilson", type: "Consultation", status: "Confirmed", color: "#10b981", gradient: "linear-gradient(180deg, #10b981 0%, #0d9488 100%)", glow: "rgba(16, 185, 129, 0.35)" },
  { id: 5, time: "04:00 PM", patient: "Alexander Hayes", doctor: "Dr. Michael Park", type: "Follow-up", status: "Cancelled", color: "#f43f5e", gradient: "linear-gradient(180deg, #f43f5e 0%, #ec4899 100%)", glow: "rgba(244, 63, 94, 0.35)" },
];

const statusVariant = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

/* ==================== TIME HELPERS ==================== */
function getTimeDiff(timeStr, status) {
  if (status === "Cancelled") return null;
  try {
    const now = new Date();
    const [time, period] = timeStr.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const aptTime = new Date();
    aptTime.setHours(h, m, 0, 0);
    const diffMin = Math.round((aptTime - now) / 60000);

    if (diffMin < -60) return { text: `${Math.abs(Math.round(diffMin / 60))}h ago`, variant: "past" };
    if (diffMin < 0) return { text: `${Math.abs(diffMin)}m ago`, variant: "past" };
    if (diffMin === 0) return { text: "Now", variant: "now" };
    if (diffMin < 60) return { text: `In ${diffMin}m`, variant: "soon" };
    return { text: `In ${Math.round(diffMin / 60)}h`, variant: "later" };
  } catch {
    return null;
  }
}

/* ==================== ANIMATION VARIANTS ==================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

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
          aria-labelledby="ts-confirm-title"
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
                    id="ts-confirm-title"
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
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              toast.variant === "error" ? "bg-rose-500" : "bg-emerald-500"
            )}
          >
            {toast.variant === "error" ? (
              <AlertCircle size={16} strokeWidth={2.5} className="text-white" />
            ) : (
              <CheckCircle2 size={16} strokeWidth={2.5} className="text-white" />
            )}
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
function TodayScheduleSkeleton() {
  return (
    <div className="relative h-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="h-2 w-40 bg-slate-200 dark:bg-white/10 rounded" />
          </div>
        </div>
        <div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded" />
      </div>
      <div className="flex-1 p-4 space-y-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-slate-100 dark:bg-white/[0.03]"
          />
        ))}
      </div>
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.06]">
        <div className="h-6 w-40 bg-slate-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}

/* ============================================================
   Empty State
   ============================================================ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 flex items-center justify-center">
          <CalendarX size={28} className="text-purple-500" strokeWidth={2} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-purple-500/20"
          aria-hidden="true"
        />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">
        No appointments today
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
        Your schedule is clear. Enjoy the break!
      </p>
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: TodaySchedule
   ============================================================ */
export default function TodaySchedule({
  appointments = DEFAULT_APPOINTMENTS,
  loading = false,
  onAppointmentClick,
  onCancelAppointment,
  onRescheduleAppointment,
}) {
  const prefersReduced = useReducedMotion();
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Handlers (Rule 3: Working buttons) ---- */
  const handleAppointmentClick = useCallback(
    (apt) => {
      if (onAppointmentClick) onAppointmentClick(apt);
      else showToast(`Opening ${apt.patient}'s details...`);
    },
    [onAppointmentClick, showToast]
  );

  const handleCancelClick = useCallback((e, apt) => {
    e.stopPropagation();
    setCancelTarget(apt);
  }, []);

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      if (onCancelAppointment) {
        await onCancelAppointment(cancelTarget);
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setCancelTarget(null);
      showToast(`Appointment with ${cancelTarget.patient} cancelled`);
    } catch (err) {
      showToast("Failed to cancel appointment", "error");
    } finally {
      setCancelling(false);
    }
  }, [cancelTarget, onCancelAppointment, showToast]);

  const handleRescheduleClick = useCallback(
    (e, apt) => {
      e.stopPropagation();
      if (onRescheduleAppointment) onRescheduleAppointment(apt);
      else showToast(`Rescheduling ${apt.patient}'s appointment...`);
    },
    [onRescheduleAppointment, showToast]
  );

  const handleKeyDown = useCallback(
    (e, apt) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleAppointmentClick(apt);
      }
    },
    [handleAppointmentClick]
  );

  /* ---- Stats ---- */
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  /* ---- States ---- */
  if (loading) return <TodayScheduleSkeleton />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group/card relative h-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col"
      >
        {/* Background breathing glow */}
        {!prefersReduced && (
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 opacity-60" />

        {/* ============ HEADER ============ */}
        <div className="relative z-10 flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-gray-100 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.2 }}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/30 shrink-0"
            >
              <Calendar size={18} className="text-white" strokeWidth={2.5} />
              <motion.span
                animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F172A]"
                aria-hidden="true"
              />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                Today's Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {appointments.length} appointments scheduled
              </p>
            </div>
          </div>

          <Link
            to="/patients/appointments"
            className="group inline-flex items-center gap-1.5 text-xs font-black text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shrink-0 tracking-wider uppercase"
          >
            View All
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </Link>
        </div>

        {/* ============ APPOINTMENTS LIST ============ */}
        {appointments.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex-1 overflow-y-auto scrollbar-hide p-3 sm:p-4 space-y-2.5"
          >
            {appointments.map((apt) => {
              const timeDiff = getTimeDiff(apt.time, apt.status);
              const isCancelled = apt.status === "Cancelled";

              return (
                <motion.div
                  key={apt.id}
                  variants={itemVariants}
                  whileHover={{ x: 4, scale: 1.01 }}
                  onClick={() => handleAppointmentClick(apt)}
                  onKeyDown={(e) => handleKeyDown(e, apt)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${apt.patient} appointment at ${apt.time} with ${apt.doctor}`}
                  className={cn(
                    "group/apt relative p-3 rounded-xl cursor-pointer",
                    "bg-slate-50 dark:bg-white/[0.02]",
                    "border border-slate-100 dark:border-white/[0.06]",
                    "hover:border-purple-400/40 dark:hover:border-purple-500/30",
                    "hover:bg-slate-100 dark:hover:bg-white/[0.04]",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/40",
                    "transition-all duration-200",
                    isCancelled && "opacity-60"
                  )}
                >
                  {/* Left gradient line */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                    style={{
                      background: apt.gradient,
                      boxShadow: `0 0 12px ${apt.glow}, 0 0 4px ${apt.glow}`,
                    }}
                    aria-hidden="true"
                  />

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover/apt:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at left, ${apt.glow} 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative pl-2">
                    {/* Row 1 — Time + TimeDiff + Status */}
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <motion.div
                          whileHover={{ rotate: 15 }}
                          className="p-1 rounded-md"
                          style={{ background: `${apt.color}15` }}
                        >
                          <Clock size={10} style={{ color: apt.color }} strokeWidth={2.5} />
                        </motion.div>
                        <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums">
                          {apt.time}
                        </span>
                        {timeDiff && (
                          <span
                            className={cn(
                              "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                              timeDiff.variant === "now" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                              timeDiff.variant === "soon" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                              timeDiff.variant === "later" && "bg-slate-500/15 text-slate-600 dark:text-slate-400",
                              timeDiff.variant === "past" && "bg-slate-500/10 text-slate-400 dark:text-slate-500"
                            )}
                          >
                            {timeDiff.text}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge variant={statusVariant[apt.status]} size="sm" dot>
                            {apt.status}
                          </Badge>
                        </motion.div>
                      </div>
                    </div>

                    {/* Row 2 — Patient + Doctor + Actions */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0F172A] transition-transform group-hover/apt:scale-110 duration-300 shrink-0"
                        style={{ boxShadow: `0 0 0 2px ${apt.color}30` }}
                      >
                        <Avatar name={apt.patient} size="xs" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover/apt:text-purple-500 transition-colors">
                          {apt.patient}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500 truncate">
                          <span className="truncate">{apt.doctor}</span>
                          <span
                            className="w-0.5 h-0.5 rounded-full shrink-0"
                            style={{ backgroundColor: apt.color }}
                          />
                          <span className="truncate">{apt.type}</span>
                        </div>
                      </div>

                      {/* Quick actions (Rule 3 + 4) */}
                      {!isCancelled && (
                        <div className="flex items-center gap-1 shrink-0 opacity-60 sm:opacity-0 group-hover/apt:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleRescheduleClick(e, apt)}
                            aria-label={`Reschedule appointment with ${apt.patient}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-500 hover:bg-purple-500/10 transition-colors"
                          >
                            <RefreshCw size={12} strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleCancelClick(e, apt)}
                            aria-label={`Cancel appointment with ${apt.patient}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <X size={12} strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      )}

                      {/* Arrow on hover */}
                      {isCancelled && (
                        <ArrowRight
                          size={13}
                          className="text-slate-300 dark:text-slate-600 shrink-0"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom fade gradient */}
        <div className="absolute bottom-12 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-[#0F172A] to-transparent pointer-events-none z-20" />

        {/* ============ FOOTER WITH STATS ============ */}
        <div className="relative z-30 px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] shrink-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {confirmed}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50" />
                <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 tabular-nums">
                  {pending}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
                <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 tabular-nums">
                  {cancelled}
                </span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/patients/appointments"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[10px] font-black tracking-wider uppercase shadow-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #d946ef 100%)",
                  boxShadow: "0 6px 18px rgba(168, 85, 247, 0.35)",
                }}
              >
                <Sparkles size={11} strokeWidth={2.5} />
                Full Schedule
                <ArrowRight size={11} strokeWidth={3} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ⚠️ Cancel warning modal */}
      <ConfirmModal
        open={!!cancelTarget}
        onClose={() => !cancelling && setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
        title="Cancel this appointment?"
        message={
          cancelTarget
            ? `You are about to cancel ${cancelTarget.patient}'s ${cancelTarget.type} appointment at ${cancelTarget.time} with ${cancelTarget.doctor}. The patient will be notified immediately.`
            : ""
        }
        confirmText="Yes, Cancel"
        cancelText="Keep It"
      />

      {/* Toast */}
      <Toast toast={toast} />
    </>
  );
}