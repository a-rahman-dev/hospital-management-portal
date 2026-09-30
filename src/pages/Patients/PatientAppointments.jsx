import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Video,
  User,
  Stethoscope,
  Building,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Inbox,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Eye,
  MapPin,
  CheckCheck,
  IdCard,
  Phone,
  Mail,
  FileText,
  Activity,
  ShieldCheck,
  Save,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { initialAppointments } from "@/data/appointments";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 APPOINTMENTS SECTION COLOR PALETTE (Rule 5)
   ============================================================ */
const TABS = [
  {
    id: "All",
    label: "All",
    icon: Calendar,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.45)",
    softText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-500/10",
    softBorder: "border-violet-500/20",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-500/50",
    hoverBg: "hover:bg-violet-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-violet-500/10",
  },
  {
    id: "Confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.45)",
    softText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-500/10",
    softBorder: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-emerald-500/10",
  },
  {
    id: "Pending",
    label: "Pending",
    icon: Clock,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    softText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-500/10",
    softBorder: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-amber-500/10",
  },
  {
    id: "Cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.45)",
    softText: "text-rose-600 dark:text-rose-400",
    softBg: "bg-rose-500/10",
    softBorder: "border-rose-500/20",
    hoverBorder: "hover:border-rose-400 dark:hover:border-rose-500/50",
    hoverBg: "hover:bg-rose-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-rose-500/10",
  },
];

const STATUS_CONFIG = {
  Confirmed: { hex: "#10b981", label: "Confirmed", pulse: true },
  Pending: { hex: "#f59e0b", label: "Pending", pulse: false },
  Cancelled: { hex: "#f43f5e", label: "Cancelled", pulse: false },
  Completed: { hex: "#14b8a6", label: "Completed", pulse: false },
  "No-Show": { hex: "#64748b", label: "No-Show", pulse: false },
};

const TYPE_CONFIG = {
  Telehealth: {
    icon: Video,
    softText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-500/10",
    softBorder: "border-cyan-500/20",
  },
  "In-Person": {
    icon: User,
    softText: "text-slate-700 dark:text-slate-300",
    softBg: "bg-slate-500/10",
    softBorder: "border-slate-500/20",
  },
  Emergency: {
    icon: AlertTriangle,
    softText: "text-rose-600 dark:text-rose-400",
    softBg: "bg-rose-500/10",
    softBorder: "border-rose-500/20",
  },
};

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/30 focus:border-violet-500 transition-all";

/* ============================================================
   ⚠️ ConfirmModal
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

  const accentGradient = "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)";
  const accentGlow = "rgba(244, 63, 94, 0.35)";

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
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentGradient }} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                  style={{
                    background: accentGradient,
                    boxShadow: `0 6px 18px ${accentGlow}`,
                  }}
                >
                  <AlertTriangle size={24} className="text-white" strokeWidth={2.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
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
                  className="relative w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center justify-center gap-2"
                  style={{
                    background: accentGradient,
                    boxShadow: `0 8px 24px ${accentGlow}`,
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
   Toast
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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl max-w-[calc(100vw-2rem)]"
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
   Empty State
   ============================================================ */
function AppointmentsEmpty({ onAdd, hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center">
          <Inbox size={32} className="text-violet-500" strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {hasFilters ? "No matching appointments" : "No appointments yet"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters ? "Try changing filter or search query" : "Book your first appointment to get started"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Book Appointment
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: PatientAppointments
   ============================================================ */
export default function PatientAppointments() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  // Normalize initial appointments with stable Patient IDs
  const normalizedInitial = useMemo(() => {
    return initialAppointments.map((apt, index) => ({
      ...apt,
      patientId: apt.patientId || `PT-${9040 + (index + 1)}`,
      gender: apt.gender || (index % 2 === 0 ? "Male" : "Female"),
      age: apt.age || (28 + ((index * 7) % 40)),
      phone: apt.phone || `+92 (300) 84${index}2-119`,
      email: apt.email || `${apt.patientName.toLowerCase().replace(/\s+/g, ".")}@ayhospital.pk`,
      bloodGroup: apt.bloodGroup || ["A+", "B+", "O+", "AB+"][index % 4],
      emergencyContact: apt.emergencyContact || "+92 (321) 9011-443",
      allergies: apt.allergies || "Penicillin, Cephalosporins",
      chronicConditions: apt.chronicConditions || "Essential Hypertension, Type-2 Diabetes",
    }));
  }, []);

  const [appointments, setAppointments] = useState(normalizedInitial);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // Appointment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Patient Full Form Modal (Triggered by clicking Patient ID)
  const [selectedPatientForForm, setSelectedPatientForForm] = useState(null);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [patientFormData, setPatientFormData] = useState(null);
  const [savingPatientForm, setSavingPatientForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "PT-9041",
    doctorName: "Dr. Jonathan Vance, MD",
    department: "Cardiology",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    type: "In-Person",
    reason: "",
    room: "Suite 302 - Tower B",
    status: "Confirmed",
  });

  /* ---- Toast ---- */
  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(
    () => ({
      All: appointments.length,
      Confirmed: appointments.filter((a) => a.status === "Confirmed").length,
      Pending: appointments.filter((a) => a.status === "Pending").length,
      Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    }),
    [appointments]
  );

  /* ---- Filtered + sorted ---- */
  const filteredAppointments = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = appointments.filter((apt) => {
      const matchesFilter = activeFilter === "All" || apt.status === activeFilter;
      const matchesSearch =
        !q ||
        apt.patientName.toLowerCase().includes(q) ||
        (apt.patientId && apt.patientId.toLowerCase().includes(q)) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.department.toLowerCase().includes(q) ||
        apt.reason.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [appointments, activeFilter, searchQuery, sortKey, sortDir]);

  /* ---- Sort ---- */
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---- Open Appointment Modal ---- */
  const handleOpenModal = (apt = null) => {
    if (apt) {
      setEditingAppointment(apt);
      setFormData(apt);
    } else {
      setEditingAppointment(null);
      setFormData({
        patientName: "",
        patientId: `PT-${Math.floor(9000 + Math.random() * 999)}`,
        doctorName: "Dr. Jonathan Vance, MD",
        department: "Cardiology",
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM",
        type: "In-Person",
        reason: "",
        room: "Suite 302 - Tower B",
        status: "Confirmed",
      });
    }
    setIsModalOpen(true);
  };

  /* ---- Open Patient Full Form Modal via Patient ID Click ---- */
  const handleOpenPatientForm = (e, apt) => {
    e.stopPropagation();
    setSelectedPatientForForm(apt);
    setPatientFormData({
      patientId: apt.patientId || `PT-${Math.floor(9000 + Math.random() * 999)}`,
      patientName: apt.patientName || "",
      age: apt.age || 45,
      gender: apt.gender || "Male",
      bloodGroup: apt.bloodGroup || "O+",
      phone: apt.phone || "+92 (300) 8400-000",
      email: apt.email || "patient@ayhospital.pk",
      emergencyContact: apt.emergencyContact || "+92 (321) 9000-111",
      department: apt.department || "Cardiology",
      primaryDoctor: apt.doctorName || "Dr. Jonathan Vance, MD",
      allergies: apt.allergies || "None",
      chronicConditions: apt.chronicConditions || "Under Evaluation",
      notes: apt.reason || "Scheduled for routine consultation",
    });
    setIsPatientFormOpen(true);
  };

  /* ---- Save Patient Full Form Changes ---- */
  const handleSavePatientForm = async (e) => {
    e.preventDefault();
    setSavingPatientForm(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setAppointments((prev) =>
        prev.map((item) =>
          item.patientId === patientFormData.patientId
            ? {
                ...item,
                patientName: patientFormData.patientName,
                age: patientFormData.age,
                gender: patientFormData.gender,
                bloodGroup: patientFormData.bloodGroup,
                phone: patientFormData.phone,
                email: patientFormData.email,
                emergencyContact: patientFormData.emergencyContact,
                department: patientFormData.department,
                doctorName: patientFormData.primaryDoctor,
                allergies: patientFormData.allergies,
                chronicConditions: patientFormData.chronicConditions,
              }
            : item
        )
      );
      showToast(`EMR updated for ${patientFormData.patientName} (${patientFormData.patientId})`);
      setIsPatientFormOpen(false);
    } catch {
      showToast("Failed to update patient file", "error");
    } finally {
      setSavingPatientForm(false);
    }
  };

  /* ---- Save Appointment ---- */
  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingAppointment) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === editingAppointment.id ? { ...formData } : a))
        );
        showToast("Appointment updated");
      } else {
        const newEntry = {
          ...formData,
          id: `APT-${Date.now().toString().slice(-4)}`,
          avatarColor: "from-violet-500 to-indigo-600",
          createdAt: new Date().toISOString(),
        };
        setAppointments((prev) => [newEntry, ...prev]);
        showToast("Appointment booked successfully");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save appointment", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Delete / Cancel via warning modal ---- */
  const handleDeleteClick = (apt) => setDeleteTarget(apt);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setAppointments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`Appointment for ${deleteTarget.patientName} cancelled`);
    } catch {
      showToast("Failed to cancel appointment", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ---- View ---- */
  const handleViewAppointment = (apt) => {
    navigate(`/patients/appointments/${apt.id}`);
  };

  /* ---- Export CSV ---- */
  const handleExportCSV = () => {
    const headers = "ID,Patient ID,Patient,Doctor,Department,Date,Time,Type,Reason,Status\n";
    const rows = filteredAppointments
      .map(
        (a) =>
          `"${a.id}","${a.patientId || ""}","${a.patientName}","${a.doctorName}","${a.department}","${a.date}","${a.time}","${a.type}","${a.reason}","${a.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredAppointments.length} appointments exported`);
  };

  /* ---- AI Schedule ---- */
  const handleAISchedule = async () => {
    showToast("Optimizing schedule...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Optimization complete — 3 slots improved");
  };

  /* ---- Status badge ---- */
  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Confirmed;
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border"
        style={{
          backgroundColor: `${config.hex}15`,
          borderColor: `${config.hex}40`,
          color: config.hex,
        }}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            config.pulse && !prefersReduced && "animate-pulse"
          )}
          style={{ backgroundColor: config.hex }}
        />
        {config.label}
      </span>
    );
  };

  /* ---- Type badge ---- */
  const renderTypeBadge = (type) => {
    const config = TYPE_CONFIG[type] || TYPE_CONFIG["In-Person"];
    const TypeIcon = config.icon;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border",
          config.softBg,
          config.softText,
          config.softBorder
        )}
      >
        <TypeIcon className="w-3 h-3" strokeWidth={2.5} />
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ============ HEADER ============ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: -10 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <Calendar size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Appointments
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Manage patient consultations & scheduling roster
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAISchedule}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-violet-500/30 bg-violet-50/50 dark:bg-[#0d1629] text-violet-600 dark:text-violet-400 hover:bg-violet-100/50 dark:hover:bg-violet-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Schedule</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ============ 4 TABS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "group relative h-[64px] sm:h-[68px] px-3 sm:px-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center gap-2.5 sm:gap-3.5 select-none overflow-hidden text-left",
                "focus:outline-none focus:ring-2",
                isActive
                  ? "border-transparent text-white shadow-xl"
                  : cn(
                      "bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] text-slate-500 dark:text-slate-400 shadow-sm hover:shadow-md",
                      tab.hoverBorder,
                      tab.hoverBg,
                      tab.hoverShadow
                    )
              )}
              style={
                isActive
                  ? { background: tab.gradient, boxShadow: `0 10px 25px ${tab.glow}` }
                  : undefined
              }
            >
              <div
                className={cn(
                  "relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 group-hover:scale-110 border",
                  isActive
                    ? "bg-white/20 text-white border-white/20"
                    : cn(tab.softBg, tab.softText, tab.softBorder)
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>

              <div className="relative leading-tight min-w-0">
                <div
                  className={cn(
                    "text-lg sm:text-xl font-black tabular-nums",
                    isActive ? "text-white" : "text-slate-900 dark:text-white"
                  )}
                >
                  {counts[tab.id]}
                </div>
                <div
                  className={cn(
                    "text-[10px] font-black tracking-[0.1em] uppercase truncate",
                    isActive ? "text-white/90" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {tab.label}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ============ TABLE ============ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#182338] rounded-2xl overflow-hidden shadow-sm dark:shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-60" />

        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Appointments Roster
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-violet-500 tabular-nums">
                {filteredAppointments.length}
              </span>{" "}
              of {appointments.length} visits
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search patient, doctor, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.35)",
              }}
            >
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Book Appointment</span>
            </motion.button>
          </div>
        </div>

        {/* Table */}
        {filteredAppointments.length === 0 ? (
          <AppointmentsEmpty onAdd={() => handleOpenModal()} hasFilters={searchQuery !== "" || activeFilter !== "All"} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#182338] bg-gray-50/75 dark:bg-[#090f1c]/60 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                  <th className="py-4 px-6">
                    <button
                      onClick={() => handleSort("patientName")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Patient (ID & Reason)
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4">Consultant</th>
                  <th className="py-4 px-4">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Schedule
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredAppointments.map((apt, idx) => {
                  const initials = apt.patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  const patientId = apt.patientId || `PT-${9040 + idx}`;

                  return (
                    <motion.tr
                      key={apt.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-[#0f172a]/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar */}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-xs text-white shadow-md shrink-0 transition-transform group-hover:scale-105",
                              apt.avatarColor || "from-violet-500 to-indigo-600"
                            )}
                          >
                            {initials}
                          </div>

                          <div className="min-w-0 space-y-1">
                            {/* Patient ID Badge (Clickable to open Full Patient Form) */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={(e) => handleOpenPatientForm(e, apt)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 hover:border-violet-500/50 hover:scale-105 transition-all cursor-pointer shadow-sm"
                                title="Click to view & edit full patient record"
                              >
                                <IdCard size={11} className="shrink-0 text-violet-500" />
                                <span>{patientId}</span>
                              </button>

                              <button
                                onClick={() => handleViewAppointment(apt)}
                                className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate block text-left"
                              >
                                {apt.patientName}
                              </button>
                            </div>

                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {apt.reason}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <Stethoscope
                            className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0"
                            strokeWidth={2.5}
                          />
                          <span className="truncate">{apt.doctorName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {apt.department}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-900 dark:text-slate-200 font-bold flex items-center gap-1.5 tabular-nums">
                          <Calendar
                            className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0"
                            strokeWidth={2.5}
                          />
                          {apt.date}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 tabular-nums">
                          <Clock className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                          {apt.time}
                          {apt.duration && (
                            <span className="text-slate-400 dark:text-slate-500">
                              • {apt.duration}min
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">{renderTypeBadge(apt.type)}</td>

                      <td className="py-4 px-4">
                        <div className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 truncate">
                          <MapPin
                            className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0"
                            strokeWidth={2.5}
                          />
                          <span className="truncate">{apt.room}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">{renderStatusBadge(apt.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewAppointment(apt)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(apt)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(apt)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Cancel"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ============================================================
          🎯 PATIENT COMPLETE CLINICAL RECORD FORM MODAL (New Feature)
         ============================================================ */}
      <AnimatePresence>
        {isPatientFormOpen && patientFormData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#0B1220] border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 my-6 overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-violet-500/25">
                    <User size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Patient Clinical Record
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                        {patientFormData.patientId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Central EMR Electronic Chart & Registration Details
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPatientFormOpen(false)}
                  disabled={savingPatientForm}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSavePatientForm} className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Section 1: Demographics */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#070D1B] border border-gray-200 dark:border-slate-800/80 space-y-3">
                  <span className="text-xs font-mono font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Personal Demographics
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={patientFormData.patientName}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, patientName: e.target.value })
                        }
                        className={selectClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Patient ID (MRN)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={patientFormData.patientId}
                        className={cn(selectClass, "opacity-60 cursor-not-allowed font-mono")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Age
                      </label>
                      <input
                        type="number"
                        value={patientFormData.age}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, age: e.target.value })
                        }
                        className={selectClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Gender
                      </label>
                      <select
                        value={patientFormData.gender}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, gender: e.target.value })
                        }
                        className={selectClass}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Blood Group
                      </label>
                      <select
                        value={patientFormData.bloodGroup}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, bloodGroup: e.target.value })
                        }
                        className={selectClass}
                      >
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact Information */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#070D1B] border border-gray-200 dark:border-slate-800/80 space-y-3">
                  <span className="text-xs font-mono font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={14} />
                    Contact & Emergency Channels
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Primary Phone
                      </label>
                      <input
                        type="text"
                        value={patientFormData.phone}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, phone: e.target.value })
                        }
                        className={selectClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        value={patientFormData.emergencyContact}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, emergencyContact: e.target.value })
                        }
                        className={selectClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={patientFormData.email}
                      onChange={(e) =>
                        setPatientFormData({ ...patientFormData, email: e.target.value })
                      }
                      className={selectClass}
                    />
                  </div>
                </div>

                {/* Section 3: Clinical Background & Direct EMR */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#070D1B] border border-gray-200 dark:border-slate-800/80 space-y-3">
                  <span className="text-xs font-mono font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} />
                    Clinical History & Known Conditions
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Assigned Department
                      </label>
                      <select
                        value={patientFormData.department}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, department: e.target.value })
                        }
                        className={selectClass}
                      >
                        <option>Cardiology</option>
                        <option>Neurology</option>
                        <option>Orthopedics</option>
                        <option>Pulmonology</option>
                        <option>General Medicine</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                        Primary Consultant
                      </label>
                      <input
                        type="text"
                        value={patientFormData.primaryDoctor}
                        onChange={(e) =>
                          setPatientFormData({ ...patientFormData, primaryDoctor: e.target.value })
                        }
                        className={selectClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                      Known Allergies
                    </label>
                    <input
                      type="text"
                      value={patientFormData.allergies}
                      onChange={(e) =>
                        setPatientFormData({ ...patientFormData, allergies: e.target.value })
                      }
                      placeholder="e.g. Penicillin, NSAIDs"
                      className={selectClass}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                      Chronic Diagnostic Flags
                    </label>
                    <input
                      type="text"
                      value={patientFormData.chronicConditions}
                      onChange={(e) =>
                        setPatientFormData({ ...patientFormData, chronicConditions: e.target.value })
                      }
                      placeholder="e.g. Hypertension, Asthma"
                      className={selectClass}
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPatientFormOpen(false)}
                    disabled={savingPatientForm}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={savingPatientForm}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-violet-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    {savingPatientForm ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Updating Record...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save Clinical File</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============ APPOINTMENT ADD/EDIT MODAL ============ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && !saving && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 my-8 overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                    <Calendar className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingAppointment ? "Reschedule Appointment" : "Book New Patient Visit"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Configure consultation slot, doctor & room
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !saving && setIsModalOpen(false)}
                  disabled={saving}
                  className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-gray-100 dark:bg-[#141e33] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-50 shrink-0"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <form onSubmit={handleSaveAppointment} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Full Name"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    icon={<User size={16} />}
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Attending Doctor
                    </label>
                    <select
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className={selectClass}
                    >
                      <option>Dr. Jonathan Vance, MD</option>
                      <option>Dr. Sarah Chen, MD</option>
                      <option>Dr. James Wilson, MD</option>
                      <option>Dr. Marcus Park, FAAP</option>
                      <option>Dr. A. Rahman</option>
                      <option>Dr. Elena Rostova, MD</option>
                      <option>Dr. Aisha Khan, MD</option>
                    </select>
                  </div>

                  <Input
                    label="Appointment Date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    icon={<Calendar size={16} />}
                  />

                  <Input
                    label="Time Slot"
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    icon={<Clock size={16} />}
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Session Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className={selectClass}
                    >
                      <option>In-Person</option>
                      <option>Telehealth</option>
                      <option>Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Booking Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={selectClass}
                    >
                      <option>Confirmed</option>
                      <option>Pending</option>
                      <option>Cancelled</option>
                      <option>Completed</option>
                      <option>No-Show</option>
                    </select>
                  </div>

                  <Input
                    label="Consultation Room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    icon={<Building size={16} />}
                  />

                  <Input
                    label="Clinical Reason"
                    required
                    placeholder="e.g. Annual Cardiovascular Review"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    containerClassName="sm:col-span-2"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-200 dark:border-[#1e293b] mt-6">
                  <button
                    type="button"
                    onClick={() => !saving && setIsModalOpen(false)}
                    disabled={saving}
                    className="px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase bg-gray-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase text-white shadow-lg inline-flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingAppointment ? "Update Schedule" : "Confirm Appointment"}</span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ CANCEL WARNING MODAL */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Cancel this appointment?"
        message={
          deleteTarget
            ? `You are about to cancel ${deleteTarget.patientName}'s ${deleteTarget.type} appointment on ${deleteTarget.date} at ${deleteTarget.time} with ${deleteTarget.doctorName}.`
            : ""
        }
        confirmText="Yes, Cancel"
        cancelText="Keep It"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}