import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Users, Activity, AlertCircle, RefreshCw, UserX } from "lucide-react";
import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PATIENTS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Primary:   Blue    (#3b82f6)
   Secondary: Indigo  (#6366f1)
   Accent:    Violet  (#8b5cf6)
   Success:   Emerald (#10b981)
   Danger:    Rose    (#f43f5e)
   ============================================================ */

/* ==================== DEFAULT FOREIGN DATA (Rule 3) ==================== */
const DEFAULT_PATIENTS = [
  { id: 1, name: "Jonathan Mitchell", age: 42, disease: "Hypertension", doctor: "Dr. S. Chen", status: "Active" },
  { id: 2, name: "Emma Rodriguez", age: 28, disease: "Routine Checkup", doctor: "Dr. M. Park", status: "Recovered" },
  { id: 3, name: "William Anderson", age: 56, disease: "Diabetes T2", doctor: "Dr. S. Chen", status: "Critical" },
  { id: 4, name: "Sophia Bennett", age: 34, disease: "Migraine", doctor: "Dr. J. Wilson", status: "Recovered" },
  { id: 5, name: "Alexander Hayes", age: 61, disease: "Arrhythmia", doctor: "Dr. M. Park", status: "Active" },
  { id: 6, name: "Olivia Thompson", age: 45, disease: "Asthma", doctor: "Dr. S. Chen", status: "Recovered" },
  { id: 7, name: "Daniel Foster", age: 38, disease: "Bronchitis", doctor: "Dr. J. Wilson", status: "Active" },
  { id: 8, name: "Isabella Martinez", age: 52, disease: "Thyroid Disorder", doctor: "Dr. M. Park", status: "Critical" },
  { id: 9, name: "Benjamin Clarke", age: 29, disease: "Food Allergy", doctor: "Dr. J. Wilson", status: "Recovered" },
];

const statusConfig = {
  Active: {
    variant: "primary",
    ring: "ring-blue-500/40",
    hex: "#3b82f6",
  },
  Recovered: {
    variant: "success",
    ring: "ring-emerald-500/40",
    hex: "#10b981",
  },
  Critical: {
    variant: "danger",
    ring: "ring-rose-500/40",
    hex: "#f43f5e",
  },
};

/* ============================================================
   Loading Skeleton
   ============================================================ */
function RecentPatientsSkeleton() {
  return (
    <div className="relative h-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col animate-pulse">
      {/* Header */}
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

      {/* Rows */}
      <div className="flex-1 p-3 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
          >
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3 w-32 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="h-2 w-40 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
            <div className="h-5 w-16 bg-slate-200 dark:bg-white/10 rounded-full shrink-0" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.06]">
        <div className="h-5 w-40 bg-slate-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}

/* ============================================================
   Empty State
   ============================================================ */
function RecentPatientsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
          <UserX size={28} className="text-blue-500" strokeWidth={2} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-blue-500/20"
          aria-hidden="true"
        />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">
        No recent patients
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
        New patient registrations will appear here.
      </p>
    </motion.div>
  );
}

/* ============================================================
   Error State
   ============================================================ */
function RecentPatientsError({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center"
      role="alert"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-rose-500" strokeWidth={2.5} />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">
        Failed to load patients
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
          aria-label="Retry loading patients"
        >
          <RefreshCw size={12} strokeWidth={2.5} />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: RecentPatients
   ============================================================ */
function RecentPatients({
  patients = DEFAULT_PATIENTS,
  loading = false,
  error = null,
  onRetry,
  onPatientClick,
}) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();

  /* ---- Handlers (Rule 3: Working buttons) ---- */
  const handlePatientClick = (patient) => {
    if (onPatientClick) {
      onPatientClick(patient);
    } else {
      navigate(`/patients/${patient.id}`);
    }
  };

  const handleKeyDown = (e, patient) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePatientClick(patient);
    }
  };

  /* ---- Stats ---- */
  const activeCount = patients.filter((p) => p.status === "Active").length;
  const recoveredCount = patients.filter((p) => p.status === "Recovered").length;
  const criticalCount = patients.filter((p) => p.status === "Critical").length;

  /* ---- States ---- */
  if (loading) return <RecentPatientsSkeleton />;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group/card relative h-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col"
    >
      {/* Background glow */}
      {!prefersReduced && (
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-60" />

      {/* ============ HEADER ============ */}
      <div className="relative z-10 flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-gray-100 dark:border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
            transition={{ duration: 0.2 }}
            className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 shrink-0"
          >
            <Users size={18} className="text-white" strokeWidth={2.5} />
            {/* Live pulse */}
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F172A]"
              aria-hidden="true"
            />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Recent Patients
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Latest patient registrations
            </p>
          </div>
        </div>

        <Link
          to="/patients"
          className="group inline-flex items-center gap-1.5 text-xs font-black text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 tracking-wider uppercase"
        >
          View All
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </Link>
      </div>

      {/* ============ PATIENT LIST ============ */}
      {error ? (
        <RecentPatientsError message={error} onRetry={onRetry} />
      ) : patients.length === 0 ? (
        <RecentPatientsEmpty />
      ) : (
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
          {patients.map((p, i) => {
            const config = statusConfig[p.status] || statusConfig.Active;

            return (
              <motion.div
                key={p.id}
                initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.05,
                  ease: "easeOut",
                }}
                whileHover={prefersReduced ? {} : { x: 4 }}
                onClick={() => handlePatientClick(p)}
                onKeyDown={(e) => handleKeyDown(e, p)}
                role="button"
                tabIndex={0}
                aria-label={`${p.name}, age ${p.age}, ${p.disease}, ${p.status}. Click for details.`}
                className={cn(
                  "group/row relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 cursor-pointer transition-colors",
                  i !== 0 && "border-t border-gray-100 dark:border-white/[0.04]",
                  "hover:bg-slate-50 dark:hover:bg-white/[0.03]",
                  "focus:outline-none focus:bg-slate-50 dark:focus:bg-white/[0.03] focus:ring-2 focus:ring-blue-500/30 focus:ring-inset"
                )}
              >
                {/* Hover left accent */}
                <div
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full opacity-0 group-hover/row:opacity-100 transition-opacity"
                  style={{ background: config.hex }}
                  aria-hidden="true"
                />

                {/* Avatar with status ring */}
                <div
                  className={cn(
                    "rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0F172A] shrink-0 transition-transform duration-300",
                    config.ring,
                    "group-hover/row:scale-110"
                  )}
                >
                  <Avatar name={p.name} size="sm" />
                </div>

                {/* Name + age + disease */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover/row:text-blue-500 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500 truncate">
                    <span className="font-semibold">Age {p.age}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                    <span className="truncate">{p.disease}</span>
                  </div>
                </div>

                {/* Doctor info (desktop only) */}
                <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 mr-2">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                    {p.doctor}
                  </p>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Attending
                  </span>
                </div>

                {/* Status badge */}
                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.05 }}
                  className="shrink-0"
                >
                  <Badge variant={config.variant} size="sm" dot>
                    {p.status}
                  </Badge>
                </motion.div>

                {/* Arrow indicator on hover */}
                <div className="opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0">
                  <ArrowRight
                    size={14}
                    className="text-slate-400"
                    strokeWidth={2.5}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom fade gradient (indicating scroll) */}
      {!error && patients.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-[#0F172A] to-transparent pointer-events-none z-20" />
      )}

      {/* ============ FOOTER WITH STATS ============ */}
      <div className="relative z-30 px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-blue-500" strokeWidth={2.5} />
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              {patients.length} total today
            </span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {[
              { label: "Active", color: "#3b82f6", count: activeCount },
              { label: "Recovered", color: "#10b981", count: recoveredCount },
              { label: "Critical", color: "#f43f5e", count: criticalCount },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: s.color,
                    boxShadow: `0 0 6px ${s.color}`,
                  }}
                  aria-hidden="true"
                />
                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 tabular-nums">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(RecentPatients);