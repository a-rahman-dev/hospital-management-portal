import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  HeartPulse,
  UserCheck,
  Building,
  Pencil,
  Trash2,
  X,
  Stethoscope,
  FileText,
  ArrowUpDown,
  AlertTriangle,
  AlertCircle,
  Loader2,
  UserX,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import {
  initialPatients,
  getStatusCounts,
  INSURANCE_PROVIDERS,
} from "@/data/patients";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PATIENTS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   4 Tabs (Blue family):
   - All        → Cyan    (#06b6d4)
   - Active     → Emerald (#10b981)
   - Critical   → Rose    (#f43f5e)
   - Recovered  → Amber   (#f59e0b)
   ============================================================ */

const TAB_CONFIG = {
  All: {
    label: "All",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.45)",
    icon: Users,
    hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-cyan-500/10",
    iconBg: "bg-cyan-50 dark:bg-[#111c30]",
    iconText: "text-cyan-600 dark:text-cyan-400",
    iconBorder: "border-cyan-100 dark:border-transparent",
  },
  Active: {
    label: "Active",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.45)",
    icon: CheckCircle2,
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-emerald-500/10",
    iconBg: "bg-emerald-50 dark:bg-[#111c30]",
    iconText: "text-emerald-600 dark:text-emerald-400",
    iconBorder: "border-emerald-100 dark:border-transparent",
  },
  Critical: {
    label: "Critical",
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.45)",
    icon: HeartPulse,
    hoverBorder: "hover:border-rose-400 dark:hover:border-rose-500/50",
    hoverBg: "hover:bg-rose-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-rose-500/10",
    iconBg: "bg-rose-50 dark:bg-[#111c30]",
    iconText: "text-rose-600 dark:text-rose-400",
    iconBorder: "border-rose-100 dark:border-transparent",
  },
  Recovered: {
    label: "Recovered",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    icon: UserCheck,
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-amber-500/10",
    iconBg: "bg-amber-50 dark:bg-[#111c30]",
    iconText: "text-amber-600 dark:text-amber-400",
    iconBorder: "border-amber-100 dark:border-transparent",
  },
};

const STATUS_CONFIG = {
  Active: { hex: "#10b981", label: "Active", pulse: true },
  Critical: { hex: "#f43f5e", label: "Critical", pulse: true },
  Recovered: { hex: "#f59e0b", label: "Recovered", pulse: false },
};

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 transition-all";

/* ============================================================
   ⚠️ ConfirmModal — Professional Warning Modal (Rule 4)
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
  variant = "danger",
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

  const isDanger = variant === "danger";
  const accentGradient = isDanger
    ? "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)"
    : "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)";
  const accentGlow = isDanger
    ? "rgba(244, 63, 94, 0.35)"
    : "rgba(245, 158, 11, 0.35)";

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
          aria-labelledby="patients-confirm-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: accentGradient }}
            />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
                  className="relative shrink-0"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: accentGradient,
                      boxShadow: `0 6px 18px ${accentGlow}`,
                    }}
                  >
                    <AlertTriangle size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: accentGlow }}
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3
                    id="patients-confirm-title"
                    className="text-lg font-black text-slate-900 dark:text-white leading-tight"
                  >
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {message}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-xs font-bold flex items-center gap-1.5",
                      isDanger
                        ? "text-rose-500 dark:text-rose-400"
                        : "text-amber-500 dark:text-amber-400"
                    )}
                  >
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
   Empty State
   ============================================================ */
function PatientsEmpty({ onAdd, hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
      animate={prefersReduced ? false : { opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
          <UserX size={32} className="text-blue-500" strokeWidth={1.75} />
        </div>
        {!prefersReduced && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-blue-500/20"
            aria-hidden="true"
          />
        )}
      </div>
      <h4 className="text-base font-black text-slate-900 dark:text-white">
        {hasFilters ? "No matching patients" : "No patients yet"}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Start by registering your first patient to build the directory."}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black tracking-wider uppercase shadow-lg shadow-blue-500/30 inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Register Patient
        </motion.button>
      )}
    </motion.div>
  );
}

/* ============================================================
   🎯 MAIN: Patients
   ============================================================ */
export default function Patients() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  /* ---- Data ---- */
  const [patients, setPatients] = useState(initialPatients);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  /* ---- UI state ---- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  /* ---- Form ---- */
  const [formData, setFormData] = useState({
    name: "",
    mrn: "",
    gender: "Male",
    age: "",
    bloodGroup: "O+",
    phone: "",
    email: "",
    room: "Room 101 - Ward A",
    attendingDoctor: "Dr. Jonathan Vance, MD",
    specialty: "Cardiology",
    diagnosis: "",
    insurance: "Blue Cross Blue Shield",
    status: "Active",
  });

  /* ---- Toast helper ---- */
  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(() => getStatusCounts(), []);

  /* ---- Filtered + sorted ---- */
  const filteredPatients = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = patients.filter((p) => {
      const matchesFilter = activeFilter === "All" || p.status === activeFilter;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        p.attendingDoctor.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [patients, activeFilter, searchQuery, sortKey, sortDir]);

  /* ---- Sort toggle ---- */
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---- Open modal ---- */
  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
    } else {
      setEditingPatient(null);
      setFormData({
        name: "",
        mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
        gender: "Male",
        age: "",
        bloodGroup: "O+",
        phone: "",
        email: "",
        room: "Room 201 - Tower B",
        attendingDoctor: "Dr. Jonathan Vance, MD",
        specialty: "Cardiology",
        diagnosis: "",
        insurance: "Blue Cross Blue Shield",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  /* ---- Save ---- */
  const handleSavePatient = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingPatient) {
        setPatients((prev) =>
          prev.map((p) => (p.id === editingPatient.id ? { ...formData } : p))
        );
        showToast("Patient record updated");
      } else {
        const newEntry = {
          ...formData,
          id: `PAT-${Date.now().toString().slice(-4)}`,
          admissionDate: new Date().toISOString().split("T")[0],
          lastVisit: new Date().toISOString().split("T")[0],
          emergencyContact: { name: "—", relation: "—", phone: "—" },
          allergies: [],
          avatarColor: "from-blue-600 to-indigo-600",
        };
        setPatients((prev) => [newEntry, ...prev]);
        showToast("Patient registered successfully");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save patient", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Delete ---- */
  const handleDeleteClick = (patient) => setDeleteTarget(patient);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Patient record deleted");
    } catch {
      showToast("Failed to delete patient", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ---- View ---- */
  const handleViewPatient = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  /* ---- Export CSV ---- */
  const handleExportCSV = () => {
    const headers =
      "ID,MRN,Name,Age,Gender,Blood Group,Doctor,Specialty,Diagnosis,Insurance,Status\n";
    const rows = filteredPatients
      .map(
        (p) =>
          `"${p.id}","${p.mrn}","${p.name}","${p.age}","${p.gender}","${p.bloodGroup}","${p.attendingDoctor}","${p.specialty}","${p.diagnosis}","${p.insurance}","${p.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredPatients.length} records exported`);
  };

  /* ---- AI Risk ---- */
  const handleAIRisk = async () => {
    showToast("Analyzing patient risk profiles...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("AI analysis complete — 3 high-risk patients identified");
  };

  /* ---- Status badge ---- */
  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
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

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Users size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Patient Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Complete electronic health records & triage registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            onClick={handleAIRisk}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-[#0d1629] text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 text-xs font-semibold transition-all shadow-sm"
            aria-label="Run AI risk stratification"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Risk Stratification</span>
            <span className="sm:hidden">AI Risk</span>
          </motion.button>

          <motion.button
            onClick={handleExportCSV}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-semibold transition-all shadow-sm"
            aria-label="Export patients to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </div>

      {/* TABS — Rule 5 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {Object.entries(TAB_CONFIG).map(([key, tab]) => {
          const isActive = activeFilter === key;
          const TabIcon = tab.icon;
          const count = counts[key] ?? 0;

          return (
            <motion.button
              key={key}
              onClick={() => setActiveFilter(key)}
              whileHover={prefersReduced ? {} : { y: -3, scale: 1.02 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              aria-pressed={isActive}
              aria-label={`Filter by ${tab.label}: ${count} patients`}
              className={cn(
                "relative h-[64px] sm:h-[68px] px-3 sm:px-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center gap-2.5 sm:gap-3.5 select-none text-left",
                "focus:outline-none focus:ring-2",
                isActive
                  ? "border-transparent text-white"
                  : cn(
                      "bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338]",
                      "text-slate-500 dark:text-slate-400 shadow-sm hover:shadow-md",
                      tab.hoverBorder,
                      tab.hoverBg,
                      tab.hoverShadow
                    )
              )}
              style={
                isActive
                  ? {
                      background: tab.gradient,
                      boxShadow: `0 8px 25px ${tab.glow}`,
                    }
                  : {}
              }
            >
              <div
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150",
                  isActive
                    ? "bg-white/20 text-white"
                    : cn(tab.iconBg, tab.iconText, "border", tab.iconBorder)
                )}
              >
                <TabIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="leading-tight min-w-0">
                <div
                  className={cn(
                    "text-lg sm:text-xl font-black tabular-nums",
                    isActive ? "text-white" : "text-slate-900 dark:text-white"
                  )}
                >
                  {count}
                </div>
                <div
                  className={cn(
                    "text-[10px] font-black tracking-wider uppercase truncate",
                    isActive
                      ? "text-white/90"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {tab.label}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#182338] rounded-2xl overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide truncate">
              All Registered Patients
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {filteredPatients.length}
              </span>{" "}
              of {patients.length} records
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search patient, MRN, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search patients"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <motion.button
              onClick={() => handleOpenModal()}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
              aria-label="Register new patient"
            >
              <Plus className="w-4 h-4" />
              Register Patient
            </motion.button>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <PatientsEmpty
            onAdd={() => handleOpenModal()}
            hasFilters={searchQuery !== "" || activeFilter !== "All"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#182338] bg-gray-50/75 dark:bg-[#090f1c]/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Patient & Location
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4">MRN</th>
                  <th className="py-4 px-4">Demographics</th>
                  <th className="py-4 px-4">Diagnosis</th>
                  <th className="py-4 px-4">Physician</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredPatients.map((patient) => {
                  const initials = patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-[#0f172a]/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-xs text-white shadow-md shrink-0",
                              patient.avatarColor || "from-blue-500 to-indigo-600"
                            )}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => handleViewPatient(patient)}
                              className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block text-left"
                            >
                              {patient.name}
                            </button>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              <Building className="w-3 h-3 shrink-0" />
                              <span className="truncate">{patient.room}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        #{patient.mrn}
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-900 dark:text-slate-200 font-medium">
                          {patient.age} yrs • {patient.gender}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Blood:{" "}
                          <span className="font-semibold text-rose-500 dark:text-rose-400">
                            {patient.bloodGroup}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-[210px]">
                        <div className="font-medium text-slate-900 dark:text-slate-200 truncate">
                          {patient.diagnosis}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          Payer: {patient.insurance}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                          <span className="truncate">{patient.attendingDoctor}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {patient.specialty}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {renderStatusBadge(patient.status)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-slate-400">
                          <button
                            onClick={() => handleViewPatient(patient)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2640] hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                            title="View"
                            aria-label={`View ${patient.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(patient)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2640] hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                            title="Edit"
                            aria-label={`Edit ${patient.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Delete"
                            aria-label={`Delete ${patient.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) =>
              e.target === e.currentTarget && !saving && setIsModalOpen(false)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: prefersReduced ? 0 : 0.2 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 my-8"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide truncate">
                      {editingPatient
                        ? "Update Medical Record"
                        : "Register New Patient"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Enter demographics and triage assignment
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !saving && setIsModalOpen(false)}
                  disabled={saving}
                  aria-label="Close modal"
                  className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-gray-100 dark:bg-[#141e33] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1f2c4a] transition-all disabled:opacity-50 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePatient} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Full Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    icon={<Users size={16} />}
                  />

                  <Input
                    label="Medical Record Number"
                    required
                    value={formData.mrn}
                    onChange={(e) =>
                      setFormData({ ...formData, mrn: e.target.value })
                    }
                    icon={<FileText size={16} />}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Age"
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Blood
                      </label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          setFormData({ ...formData, bloodGroup: e.target.value })
                        }
                        className={selectClass}
                      >
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                          (bg) => (
                            <option key={bg}>{bg}</option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Primary Diagnosis"
                    required
                    value={formData.diagnosis}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnosis: e.target.value })
                    }
                    containerClassName="sm:col-span-2"
                  />

                  <Input
                    label="Assigned Ward / Room"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                    icon={<Building size={16} />}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Attending Physician
                    </label>
                    <select
                      value={formData.attendingDoctor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attendingDoctor: e.target.value,
                        })
                      }
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Insurance Provider
                    </label>
                    <select
                      value={formData.insurance}
                      onChange={(e) =>
                        setFormData({ ...formData, insurance: e.target.value })
                      }
                      className={selectClass}
                    >
                      {INSURANCE_PROVIDERS.map((ins) => (
                        <option key={ins}>{ins}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Triage Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Active</option>
                      <option>Critical</option>
                      <option>Recovered</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-200 dark:border-[#1e293b] mt-6">
                  <button
                    type="button"
                    onClick={() => !saving && setIsModalOpen(false)}
                    disabled={saving}
                    className="px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-medium bg-gray-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1b2844] transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={prefersReduced ? {} : { y: -2, scale: 1.02 }}
                    whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
                      boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingPatient
                          ? "Update Record"
                          : "Confirm Admission"}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        variant="danger"
        title="Delete patient record?"
        message={
          deleteTarget
            ? `You are about to permanently delete ${deleteTarget.name}'s medical record (${deleteTarget.mrn}). All associated data will be removed from the system.`
            : ""
        }
        confirmText="Yes, Delete Record"
        cancelText="Keep Record"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}