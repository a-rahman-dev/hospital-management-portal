import { useState, useCallback, useMemo, useEffect } from "react";
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
  Clock,
  Send,
  AlertTriangle,
  Stethoscope,
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
   Primary:      Cyan → Violet → Blue (header/brand)
   Alerts:       Rose / Amber
   Stats:        Indigo / Emerald / Amber / Cyan
   Trends:       Blue / Violet
   Appointments: Violet / Fuchsia
   Patients:     Blue / Indigo / Violet
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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl max-w-[calc(100vw-2rem)] select-none border border-slate-800 dark:border-slate-200"
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
          <p className="text-sm font-bold tracking-tight">{toast.message}</p>
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
    <div className="space-y-3 sm:space-y-4 animate-pulse">
      {/* Welcome Banner skeleton */}
      <div className="h-40 sm:h-32 rounded-2xl bg-slate-200 dark:bg-white/5" />
      {/* Alert skeleton */}
      <div className="h-14 rounded-2xl bg-slate-200 dark:bg-white/5" />
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-200 dark:bg-white/5"
          />
        ))}
      </div>
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-200 dark:bg-white/5" />
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-white/5" />
      </div>
      {/* Bottom row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-white/5" />
        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-white/5" />
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

  /* ---- Functional Modals State (Rule 2) ---- */
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [cancelModalData, setCancelModalData] = useState(null);

  /* ---- Form states for quick actions ---- */
  const [formData, setFormData] = useState({
    patientName: "",
    department: "Cardiology",
    doctor: "Dr. Salman Tariq",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "10:30 AM",
    notes: "",
  });

  /* ---- Toast helper ---- */
  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, []);

  /* ---- Keyboard escape handler ---- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsNewAppointmentModalOpen(false);
        setRescheduleData(null);
        setCancelModalData(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ============================================================
      🎯 Handlers (Rule 2: Every button works)
     ============================================================ */

  /* ---- WelcomeBanner actions ---- */
  const handleNewAppointment = useCallback(() => {
    setIsNewAppointmentModalOpen(true);
  }, []);

  const handleViewSchedule = useCallback(() => {
    navigate("/patients/appointments");
  }, [navigate]);

  const handleDismissAlert = useCallback(
    async (alerts) => {
      await new Promise((r) => setTimeout(r, 400));
      const count = Array.isArray(alerts) ? alerts.length : 1;
      showToast(`${count} critical telemetry alerts cleared from active ticker.`);
    },
    [showToast]
  );

  /* ---- Stats card clicks ---- */
  const handleStatCardClick = useCallback(
    (stat) => {
      const target = stat?.id || stat?.label?.toLowerCase().replace(/\s+/g, "-") || "general";
      if (target.includes("patient")) {
        navigate("/patients");
      } else if (target.includes("appointment") || target.includes("schedule")) {
        navigate("/patients/appointments");
      } else if (target.includes("bed") || target.includes("occupancy")) {
        navigate("/facilities");
      } else {
        navigate(`/patients/billing`);
      }
    },
    [navigate]
  );

  const handleViewReport = useCallback(
    (stat) => {
      handleStatCardClick(stat);
    },
    [handleStatCardClick]
  );

  /* ---- Recent patients actions ---- */
  const handlePatientClick = useCallback(
    (patient) => {
      if (patient?.id) {
        navigate(`/patients/${patient.id}/lab-reports`);
      } else {
        navigate("/patients");
      }
    },
    [navigate]
  );

  /* ---- Today schedule actions ---- */
  const handleAppointmentClick = useCallback(
    (appointment) => {
      if (appointment?.id) {
        navigate(`/patients/${appointment.id}/appointments`);
      } else {
        navigate("/patients/appointments");
      }
    },
    [navigate]
  );

  const handleCancelAppointment = useCallback(
    (appointment) => {
      setCancelModalData(appointment);
    },
    []
  );

  const confirmCancelAppointment = useCallback(async () => {
    if (!cancelModalData) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    showToast(
      `Appointment for ${cancelModalData.patient || "Patient"} successfully cancelled.`,
      "success"
    );
    setCancelModalData(null);
  }, [cancelModalData, showToast]);

  const handleRescheduleAppointment = useCallback((appointment) => {
    setRescheduleData(appointment);
  }, []);

  const confirmReschedule = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    showToast(
      `Appointment rescheduled to ${formData.date} (${formData.timeSlot}).`,
      "success"
    );
    setRescheduleData(null);
  }, [formData, showToast]);

  const handleCreateAppointmentSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      showToast("Please enter a valid patient name.", "error");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    showToast(
      `Scheduled ${formData.patientName} with ${formData.doctor} for ${formData.timeSlot}.`,
      "success"
    );
    setIsNewAppointmentModalOpen(false);
    setFormData({
      patientName: "",
      department: "Cardiology",
      doctor: "Dr. Salman Tariq",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "10:30 AM",
      notes: "",
    });
  }, [formData, showToast]);

  /* ---- Alert ticker actions ---- */
  const handleOpenVitals = useCallback(
    (alert) => {
      navigate(`/patients/lab-reports`);
    },
    [navigate]
  );

  /* ---- Department chart actions ---- */
  const handleDepartmentClick = useCallback(
    (dept) => {
      const deptName = dept?.name || "General";
      navigate(`/patients/appointments?dept=${encodeURIComponent(deptName)}`);
    },
    [navigate]
  );

  /* ---- Global retry ---- */
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Clinical command hub synchronized with primary EMR node.");
    }, 600);
  }, [showToast]);

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
        className="space-y-3 sm:space-y-4 max-w-full overflow-hidden"
      >
        {loading && <DashboardSkeleton />}

        {!loading && (
          <>
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
          </>
        )}
      </motion.div>

      {/* ============================================================
          🎯 INTERACTIVE MODALS & DRAWERS (Rule 2: No Dead Buttons)
         ============================================================ */}

      {/* 1. Quick New Appointment Modal */}
      <AnimatePresence>
        {isNewAppointmentModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Schedule Appointment</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Book consult in central EMR registry
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAppointmentModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAppointmentSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium mb-1 text-slate-600 dark:text-slate-300">
                    Patient Name / MRN
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Tariq Mahmood or PT-9041"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium mb-1 text-slate-600 dark:text-slate-300">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option>Cardiology</option>
                      <option>Pulmonology</option>
                      <option>Orthopedics</option>
                      <option>General Medicine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-slate-600 dark:text-slate-300">
                      Attending Doctor
                    </label>
                    <select
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option>Dr. Salman Tariq</option>
                      <option>Dr. Ayesha Malik</option>
                      <option>Dr. Bilal Naeem</option>
                      <option>Dr. Farooq Shah</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium mb-1 text-slate-600 dark:text-slate-300">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-slate-600 dark:text-slate-300">
                      Time Slot
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option>09:30 AM</option>
                      <option>10:30 AM</option>
                      <option>11:45 AM</option>
                      <option>02:15 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewAppointmentModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-95"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Reschedule Appointment Modal */}
      <AnimatePresence>
        {rescheduleData && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-violet-500" />
                  <h3 className="text-sm font-bold">Reschedule Visit</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleData(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Updating schedule for <strong>{rescheduleData.patient || "Selected Patient"}</strong>.
              </p>

              <form onSubmit={confirmReschedule} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block mb-1 text-slate-600 dark:text-slate-300">New Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600 dark:text-slate-300">New Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option>09:30 AM</option>
                    <option>11:00 AM</option>
                    <option>01:30 PM</option>
                    <option>03:45 PM</option>
                  </select>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleData(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Dismiss
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Cancel Appointment Confirmation Modal */}
      <AnimatePresence>
        {cancelModalData && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#0B1220] border border-rose-500/30 p-5 shadow-2xl text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center gap-2.5 text-rose-500 mb-2">
                <AlertTriangle size={20} />
                <h3 className="text-sm font-bold">Confirm Cancellation</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to cancel the appointment for{" "}
                <strong>{cancelModalData.patient || "this patient"}</strong>? This action will free up the doctor's roster slot.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCancelModalData(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={confirmCancelAppointment}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============ TOAST ============ */}
      <Toast toast={toast} />
    </>
  );
}