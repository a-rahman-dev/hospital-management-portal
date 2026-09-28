import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import AlertTicker from "@/components/dashboard/AlertTicker";
import PatientTrendsChart from "@/components/dashboard/PatientTrendsChart";
import AppointmentPieChart from "@/components/dashboard/AppointmentPieChart";
import RecentPatients from "@/components/dashboard/RecentPatients";
import TodaySchedule from "@/components/dashboard/TodaySchedule";

/* ============================================================
   🎨 DASHBOARD SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Primary:     Cyan → Violet → Blue (header/brand)
   Alerts:      Rose / Amber
   Stats:       Indigo / Emerald / Amber / Cyan
   Trends:      Blue / Violet
   Appointments: Violet / Fuchsia
   Patients:    Blue / Indigo / Violet
   ============================================================ */

/* ============================================================
   Toast — Global action feedback
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
   Loading Overlay — for full dashboard refresh
   ============================================================ */
function DashboardSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Welcome Banner skeleton */}
      <div className="h-40 sm:h-32 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      {/* Alert skeleton */}
      <div className="h-14 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      </div>
      {/* Bottom row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

/* ============================================================
   🎯 MAIN: Dashboard
   ============================================================ */
export default function Dashboard() {
  const navigate = useNavigate();

  /* ---- Global state ---- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  /* ---- Toast helper ---- */
  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ============================================================
      🎯 Handlers (Rule 3: Every button works)
     ============================================================ */

  /* ---- WelcomeBanner actions ---- */
  const handleNewAppointment = useCallback(() => {
    navigate("/dashboard/patients/appointments?action=new");
  }, [navigate]);

  const handleViewSchedule = useCallback(() => {
    navigate("/dashboard/patients/appointments");
  }, [navigate]);

  const handleDismissAlert = useCallback(
    async (alerts) => {
      await new Promise((r) => setTimeout(r, 600));
      showToast(`${alerts.length} alerts dismissed`);
    },
    [showToast]
  );

  /* ---- Stats card clicks ---- */
  const handleStatCardClick = useCallback(
    (stat) => {
      navigate(
        `/dashboard/reports/${stat.id || stat.label?.toLowerCase().replace(/\s+/g, "-")}`
      );
    },
    [navigate]
  );

  const handleViewReport = useCallback(
    (stat) => {
      navigate(
        `/dashboard/reports/${stat.id || stat.label?.toLowerCase().replace(/\s+/g, "-")}`
      );
    },
    [navigate]
  );

  /* ---- Recent patients actions ---- */
  const handlePatientClick = useCallback(
    (patient) => {
      navigate(`/dashboard/patients/${patient.id}`);
    },
    [navigate]
  );

  /* ---- Today schedule actions ---- */
  const handleAppointmentClick = useCallback(
    (appointment) => {
      navigate(`/dashboard/patients/appointments/${appointment.id}`);
    },
    [navigate]
  );

  const handleCancelAppointment = useCallback(
    async (appointment) => {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      showToast(`Appointment with ${appointment.patient} cancelled`);
    },
    [showToast]
  );

  const handleRescheduleAppointment = useCallback(
    (appointment) => {
      navigate(`/dashboard/patients/appointments/${appointment.id}?action=reschedule`);
    },
    [navigate]
  );

  /* ---- Alert ticker actions ---- */
  const handleOpenVitals = useCallback(
    (alert) => {
      navigate(`/dashboard/vitals/${alert.id}`);
    },
    [navigate]
  );

  /* ---- Department chart actions ---- */
  const handleDepartmentClick = useCallback(
    (dept) => {
      navigate(`/dashboard/patients/appointments?dept=${encodeURIComponent(dept.name)}`);
    },
    [navigate]
  );

  /* ---- Global retry ---- */
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  /* ============================================================
      RENDER
     ============================================================ */

  return (
    <>
      <motion.div
        key="dashboard-root-view"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-3 sm:space-y-4"
      >
        {/* ============ WELCOME BANNER ============ */}
        <WelcomeBanner
          onNewAppointment={handleNewAppointment}
          onViewSchedule={handleViewSchedule}
          onDismissAlert={handleDismissAlert}
        />

        {/* ============ ALERT TICKER ============ */}
        <AlertTicker
          onOpenVitals={handleOpenVitals}
          onDismissAlert={handleDismissAlert}
        />

        {/* ============ STATS GRID ============ */}
        <StatsGrid
          onCardClick={handleStatCardClick}
          onViewReport={handleViewReport}
        />

        {/* ============ CHARTS ROW ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2 min-w-0">
            <PatientTrendsChart />
          </div>
          <div className="min-w-0">
            <AppointmentPieChart onDepartmentClick={handleDepartmentClick} />
          </div>
        </div>

        {/* ============ BOTTOM ROW ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0">
            <RecentPatients onPatientClick={handlePatientClick} />
          </div>
          <div className="min-w-0">
            <TodaySchedule
              onAppointmentClick={handleAppointmentClick}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
            />
          </div>
        </div>
      </motion.div>

      {/* ============ TOAST ============ */}
      <Toast toast={toast} />
    </>
  );
}