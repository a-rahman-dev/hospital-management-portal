import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Pill,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
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
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 MEDICATIONS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Cohesive family with semantic meaning:
   - All          → Emerald (#10b981) — brand
   - Active       → Teal    (#14b8a6) — success
   - Refill       → Amber   (#f59e0b) — warning
   - Discontinued → Rose    (#f43f5e) — danger
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All RX",
    icon: Pill,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    glow: "rgba(16, 185, 129, 0.45)",
    softText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-500/10",
    softBorder: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Active",
    label: "Active",
    icon: CheckCircle2,
    color: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    glow: "rgba(20, 184, 166, 0.45)",
    softText: "text-teal-600 dark:text-teal-400",
    softBg: "bg-teal-500/10",
    softBorder: "border-teal-500/20",
    hoverBorder: "hover:border-teal-400 dark:hover:border-teal-500/50",
    hoverBg: "hover:bg-teal-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Refill Needed",
    label: "Refill Due",
    icon: Clock,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    softText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-500/10",
    softBorder: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Discontinued",
    label: "Discontinued",
    icon: XCircle,
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.45)",
    softText: "text-rose-600 dark:text-rose-400",
    softBg: "bg-rose-500/10",
    softBorder: "border-rose-500/20",
    hoverBorder: "hover:border-rose-400 dark:hover:border-rose-500/50",
    hoverBg: "hover:bg-rose-50/30 dark:hover:bg-[#0e172a]",
  },
];

/* ==================== FOREIGN DATA (Rule 3) ==================== */
const defaultMedications = [
  { id: "MED-401", rxNumber: "RX-88401", medicationName: "Atorvastatin Calcium", dosage: "40 mg", frequency: "Once daily at bedtime", route: "Oral Tablet", patientName: "Jonathan Mitchell", patientId: "PAT-101", prescribingDoctor: "Dr. Jonathan Vance, MD", department: "Cardiology", startDate: "2026-08-10", endDate: "2027-02-10", refillsRemaining: 4, pharmacy: "CVS Caremark Central #44", status: "Active" },
  { id: "MED-402", rxNumber: "RX-88402", medicationName: "Prenatal Multivitamin + DHA", dosage: "1 Capsule", frequency: "Once daily with meal", route: "Oral Capsule", patientName: "Emma Rodriguez", patientId: "PAT-102", prescribingDoctor: "Dr. Sarah Chen, MD", department: "OB/GYN", startDate: "2026-07-01", endDate: "2027-01-01", refillsRemaining: 2, pharmacy: "Walgreens Specialty Rx", status: "Active" },
  { id: "MED-403", rxNumber: "RX-88403", medicationName: "Clopidogrel (Plavix)", dosage: "75 mg", frequency: "Once daily", route: "Oral Tablet", patientName: "William Anderson", patientId: "PAT-103", prescribingDoctor: "Dr. James Wilson, MD", department: "Neurology", startDate: "2026-06-15", endDate: "2026-09-20", refillsRemaining: 0, pharmacy: "In-House Hospital Pharmacy", status: "Refill Needed" },
  { id: "MED-404", rxNumber: "RX-88404", medicationName: "Metformin HCl ER", dosage: "1000 mg", frequency: "Twice daily with meals", route: "Oral Extended Release", patientName: "Sophia Bennett", patientId: "PAT-104", prescribingDoctor: "Dr. A. Rahman", department: "Internal Medicine", startDate: "2026-05-10", endDate: "2026-11-10", refillsRemaining: 1, pharmacy: "Metro Health Express Rx", status: "Active" },
  { id: "MED-405", rxNumber: "RX-88405", medicationName: "Oxycodone-Acetaminophen", dosage: "5-325 mg", frequency: "Q6H PRN severe post-op pain", route: "Oral Tablet", patientName: "Alexander Hayes", patientId: "PAT-105", prescribingDoctor: "Dr. Marcus Park, FAAP", department: "Orthopedics", startDate: "2026-08-20", endDate: "2026-09-05", refillsRemaining: 0, pharmacy: "Surgical Tower Satellite Rx", status: "Discontinued" },
  { id: "MED-406", rxNumber: "RX-88406", medicationName: "Hydrocortisone Cream 2.5%", dosage: "Thin layer", frequency: "BID for 14 days", route: "Topical Ointment", patientName: "Olivia Zhang", patientId: "PAT-106", prescribingDoctor: "Dr. Elena Rostova, MD", department: "Dermatology", startDate: "2026-09-10", endDate: "2026-09-24", refillsRemaining: 0, pharmacy: "Rite Aid Community Pharmacy", status: "Active" },
  { id: "MED-407", rxNumber: "RX-88407", medicationName: "Albuterol Sulfate HFA Inhaler", dosage: "90 mcg/actuation", frequency: "2 puffs Q4-6H PRN wheezing", route: "Inhalation Aerosol", patientName: "David Miller", patientId: "PAT-107", prescribingDoctor: "Dr. Aisha Khan, MD", department: "Pulmonology", startDate: "2026-04-12", endDate: "2026-09-15", refillsRemaining: 0, pharmacy: "CVS Pharmacy Main Blvd", status: "Refill Needed" },
  { id: "MED-408", rxNumber: "RX-88408", medicationName: "Lisinopril", dosage: "10 mg", frequency: "Once daily", route: "Oral Tablet", patientName: "Isabella Martinez", patientId: "PAT-108", prescribingDoctor: "Dr. James Wilson, MD", department: "Cardiology", startDate: "2026-09-14", endDate: "2027-03-14", refillsRemaining: 5, pharmacy: "CVS Caremark Central #44", status: "Active" },
  { id: "MED-409", rxNumber: "RX-88409", medicationName: "Levothyroxine", dosage: "75 mcg", frequency: "Once daily morning, empty stomach", route: "Oral Tablet", patientName: "Charlotte Davies", patientId: "PAT-110", prescribingDoctor: "Dr. Elena Rostova, MD", department: "Endocrinology", startDate: "2026-08-01", endDate: "2027-02-01", refillsRemaining: 3, pharmacy: "Walgreens Specialty Rx", status: "Active" },
  { id: "MED-410", rxNumber: "RX-88410", medicationName: "Amoxicillin-Clavulanate", dosage: "875-125 mg", frequency: "BID for 10 days", route: "Oral Tablet", patientName: "Benjamin Clarke", patientId: "PAT-109", prescribingDoctor: "Dr. Aisha Khan, MD", department: "Pulmonology", startDate: "2026-09-01", endDate: "2026-09-11", refillsRemaining: 0, pharmacy: "Rite Aid Community Pharmacy", status: "Discontinued" },
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/30 focus:border-emerald-500 transition-all";

const STATUS_CONFIG = {
  Active: {
    hex: "#14b8a6",
    label: "Active RX",
    pulse: true,
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    glow: "rgba(20, 184, 166, 0.45)",
  },
  "Refill Needed": {
    hex: "#f59e0b",
    label: "Refill Due",
    pulse: false,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
  },
  Discontinued: {
    hex: "#f43f5e",
    label: "Discontinued",
    pulse: false,
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.45)",
  },
};

/* ============================================================
   ⚠️ ConfirmModal — Rule 4
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
                  />
                </motion.div>

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
   🎯 MAIN: PatientMedications
   ============================================================ */
export default function PatientMedications() {
  const prefersReduced = useReducedMotion();

  const [medications, setMedications] = useState(defaultMedications);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("medicationName");
  const [sortDir, setSortDir] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    rxNumber: "",
    medicationName: "",
    dosage: "",
    frequency: "Once daily",
    route: "Oral Tablet",
    patientName: "",
    patientId: "",
    prescribingDoctor: "Dr. Jonathan Vance, MD",
    department: "Cardiology",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    refillsRemaining: 3,
    pharmacy: "CVS Caremark Central #44",
    status: "Active",
  });

  /* ---- Toast ---- */
  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(() => ({
    All: medications.length,
    Active: medications.filter((m) => m.status === "Active").length,
    "Refill Needed": medications.filter((m) => m.status === "Refill Needed").length,
    Discontinued: medications.filter((m) => m.status === "Discontinued").length,
  }), [medications]);

  /* ---- Filtered + sorted ---- */
  const filteredMedications = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = medications.filter((med) => {
      const matchesFilter = activeFilter === "All" || med.status === activeFilter;
      const matchesSearch =
        !q ||
        med.medicationName.toLowerCase().includes(q) ||
        med.patientName.toLowerCase().includes(q) ||
        med.rxNumber.toLowerCase().includes(q) ||
        med.prescribingDoctor.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [medications, activeFilter, searchQuery, sortKey, sortDir]);

  /* ---- Sort ---- */
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---- Open modal ---- */
  const handleOpenModal = (med = null) => {
    if (med) {
      setEditingMed(med);
      setFormData(med);
    } else {
      setEditingMed(null);
      setFormData({
        rxNumber: `RX-${Math.floor(10000 + Math.random() * 90000)}`,
        medicationName: "",
        dosage: "",
        frequency: "Once daily with meal",
        route: "Oral Tablet",
        patientName: "",
        patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        prescribingDoctor: "Dr. Jonathan Vance, MD",
        department: "Cardiology",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        refillsRemaining: 3,
        pharmacy: "CVS Caremark Central #44",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  /* ---- Save ---- */
  const handleSaveMedication = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingMed) {
        setMedications((prev) =>
          prev.map((m) => (m.id === editingMed.id ? { ...formData } : m))
        );
        showToast("Prescription updated");
      } else {
        const newEntry = {
          ...formData,
          id: `MED-${Date.now().toString().slice(-4)}`,
        };
        setMedications((prev) => [newEntry, ...prev]);
        showToast("Prescription transmitted");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save prescription", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Delete / Discontinue via warning modal (Rule 4) ---- */
  const handleDeleteClick = (med) => setDeleteTarget(med);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setMedications((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Prescription discontinued");
    } catch {
      showToast("Failed to discontinue", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ---- Export ---- */
  const handleExportCSV = () => {
    const headers =
      "Rx Number,Medication,Dosage,Frequency,Patient,Doctor,Refills,Status\n";
    const rows = filteredMedications
      .map(
        (m) =>
          `"${m.rxNumber}","${m.medicationName}","${m.dosage}","${m.frequency}","${m.patientName}","${m.prescribingDoctor}","${m.refillsRemaining}","${m.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medications_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredMedications.length} prescriptions exported`);
  };

  /* ---- AI Drug Scan ---- */
  const handleAIDrugScan = async () => {
    showToast("Scanning drug interactions...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Scan complete — 2 potential interactions flagged");
  };

  /* ---- Status badge ---- */
  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
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

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: -10 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.08, rotate: -5 }}
            transition={{ duration: 0.2 }}
            className="relative shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <Pill size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Medications & E-Prescriptions
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Active pharmacotherapy regimens & refill tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            onClick={handleAIDrugScan}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-[#0d1629] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI drug interaction scan"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Drug Scan</span>
            <span className="sm:hidden">AI Scan</span>
          </motion.button>
          <motion.button
            onClick={handleExportCSV}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export medications"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 4 TABS — Rule 5 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={prefersReduced ? {} : { y: -4, scale: 1.03 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              aria-pressed={isActive}
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} prescriptions`}
              className={cn(
                "group relative h-[64px] sm:h-[68px] px-3 sm:px-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center gap-2.5 sm:gap-3.5 select-none overflow-hidden text-left",
                "focus:outline-none focus:ring-2",
                isActive
                  ? "border-transparent text-white shadow-xl"
                  : cn(
                      "bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] text-slate-500 dark:text-slate-400 shadow-sm hover:shadow-md",
                      tab.hoverBorder,
                      tab.hoverBg
                    )
              )}
              style={
                isActive
                  ? { background: tab.gradient, boxShadow: `0 10px 25px ${tab.glow}` }
                  : undefined
              }
            >
              {isActive && !prefersReduced && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                />
              )}
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

      {/* TABLE */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#182338] rounded-2xl overflow-hidden shadow-sm dark:shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Active Prescriptions & Regimens
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-emerald-500 tabular-nums">
                {filteredMedications.length}
              </span>{" "}
              of {medications.length} records
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search drug, patient, Rx #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search prescriptions"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
              }}
              aria-label="New prescription"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">New Prescription</span>
            </motion.button>
          </div>
        </div>

        {filteredMedications.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox
              className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              No medication records found
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Try changing filter or search query
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#182338] bg-gray-50/75 dark:bg-[#090f1c]/60 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                  <th className="py-4 px-6">
                    <button
                      onClick={() => handleSort("medicationName")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Medication & Dosage
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-3">Rx #</th>
                  <th className="py-4 px-3">Patient</th>
                  <th className="py-4 px-3">Frequency & Route</th>
                  <th className="py-4 px-3">Prescribing MD</th>
                  <th className="py-4 px-3">Refills / Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredMedications.map((med, idx) => (
                  <motion.tr
                    key={med.id}
                    initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                    animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + idx * 0.04 }}
                    whileHover={prefersReduced ? {} : { x: 4 }}
                    className="hover:bg-gray-50/80 dark:hover:bg-[#0f172a]/60 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <motion.div
                          whileHover={prefersReduced ? {} : { scale: 1.1 }}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0"
                        >
                          <Pill className="w-5 h-5" strokeWidth={2.5} />
                        </motion.div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors truncate max-w-[240px]">
                            {med.medicationName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Strength:{" "}
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {med.dosage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs tabular-nums">
                        #{med.rxNumber}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 truncate">
                        {med.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        ID: #{med.patientId}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 truncate max-w-[180px]">
                        {med.frequency}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {med.route}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate">
                        <Stethoscope
                          className="w-3.5 h-3.5 text-teal-500 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="truncate">{med.prescribingDoctor}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {med.department}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div>{renderStatusBadge(med.status)}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Refills:{" "}
                        <span
                          className={cn(
                            "font-black tabular-nums",
                            med.refillsRemaining === 0
                              ? "text-rose-500"
                              : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {med.refillsRemaining}
                        </span>{" "}
                        remaining
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal(med)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                          title="Edit"
                          aria-label={`Edit ${med.medicationName}`}
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(med)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                          title="Discontinue"
                          aria-label={`Discontinue ${med.medicationName}`}
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

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
              transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 my-8 overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                    <Pill className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingMed ? "Update Prescription" : "E-Prescribe New Medication"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Configure dosing, route & pharmacy fulfillment
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !saving && setIsModalOpen(false)}
                  disabled={saving}
                  aria-label="Close modal"
                  className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-gray-100 dark:bg-[#141e33] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1f2c4a] transition-all disabled:opacity-50 shrink-0"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <form onSubmit={handleSaveMedication} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Medication Name"
                    required
                    placeholder="e.g. Atorvastatin Calcium"
                    value={formData.medicationName}
                    onChange={(e) =>
                      setFormData({ ...formData, medicationName: e.target.value })
                    }
                    icon={<Pill size={16} />}
                  />
                  <Input
                    label="Dosage Strength"
                    required
                    placeholder="e.g. 40 mg"
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                  />
                  <Input
                    label="Patient Full Name"
                    required
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    icon={<User size={16} />}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Route
                    </label>
                    <select
                      value={formData.route}
                      onChange={(e) =>
                        setFormData({ ...formData, route: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Oral Tablet</option>
                      <option>Oral Capsule</option>
                      <option>Intravenous (IV)</option>
                      <option>Subcutaneous Injection</option>
                      <option>Inhalation Aerosol</option>
                      <option>Topical Ointment</option>
                    </select>
                  </div>
                  <Input
                    label="Frequency / Sig"
                    required
                    placeholder="e.g. Once daily at bedtime"
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                    containerClassName="sm:col-span-2"
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Prescribing Physician
                    </label>
                    <select
                      value={formData.prescribingDoctor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prescribingDoctor: e.target.value,
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Regimen Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Active</option>
                      <option>Refill Needed</option>
                      <option>Discontinued</option>
                    </select>
                  </div>
                  <Input
                    label="Authorized Refills"
                    type="number"
                    min="0"
                    value={formData.refillsRemaining}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        refillsRemaining: Math.max(0, Number(e.target.value)),
                      })
                    }
                  />
                  <Input
                    label="Fulfillment Pharmacy"
                    value={formData.pharmacy}
                    onChange={(e) =>
                      setFormData({ ...formData, pharmacy: e.target.value })
                    }
                    icon={<Building size={16} />}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-200 dark:border-[#1e293b] mt-6">
                  <button
                    type="button"
                    onClick={() => !saving && setIsModalOpen(false)}
                    disabled={saving}
                    className="px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase bg-gray-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1b2844] transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={prefersReduced ? {} : { scale: 1.03, y: -1 }}
                    whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    className="group relative px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase text-white shadow-lg overflow-hidden inline-flex items-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                      boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {editingMed ? "Update Order" : "Transmit E-Rx"}
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ DISCONTINUE WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Discontinue this prescription?"
        message={
          deleteTarget
            ? `You are about to discontinue ${deleteTarget.medicationName} (${deleteTarget.dosage}) for ${deleteTarget.patientName}. The patient will no longer receive refills.`
            : ""
        }
        confirmText="Yes, Discontinue"
        cancelText="Keep Active"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}