import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Stethoscope,
  User,
  Inbox,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PROCEDURES SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All         → Violet  (#7c3aed) — brand
   - Completed   → Emerald (#10b981) — success
   - Scheduled   → Amber   (#f59e0b) — warning
   - Urgent      → Rose    (#f43f5e) — danger
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All Procedures",
    icon: Scissors,
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
    glow: "rgba(124, 58, 237, 0.45)",
    softText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-500/10",
    softBorder: "border-violet-500/20",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-500/50",
    hoverBg: "hover:bg-violet-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.45)",
    softText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-500/10",
    softBorder: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Scheduled",
    label: "Scheduled",
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
    id: "Urgent",
    label: "Urgent STAT",
    icon: AlertTriangle,
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

const STATUS_CONFIG = {
  Completed: { hex: "#10b981", label: "Completed", pulse: false },
  Scheduled: { hex: "#f59e0b", label: "Scheduled", pulse: false },
  Urgent: { hex: "#f43f5e", label: "Urgent STAT", pulse: true },
};

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/30 focus:border-violet-500 transition-all";

/* ==================== FOREIGN DATA (Rule 3) ==================== */
const DEFAULT_PROCEDURES = [
  { id: "PRC-501", cptCode: "33533", procedureName: "Coronary Artery Bypass Graft (CABG x1)", department: "Cardiothoracic Surgery", operatingRoom: "OR Suite 3 - Main Cardiac", patientName: "Jonathan Mitchell", patientId: "PAT-101", leadSurgeon: "Dr. Jonathan Vance, MD", anesthesiaType: "General Endotracheal", scheduledDate: "2026-09-15", duration: "180 mins", status: "Completed", riskLevel: "High" },
  { id: "PRC-502", cptCode: "59510", procedureName: "Routine Cesarean Delivery (C-Section)", department: "Obstetrics & Gynecology", operatingRoom: "Maternity OR 2", patientName: "Emma Rodriguez", patientId: "PAT-102", leadSurgeon: "Dr. Sarah Chen, MD, FACOG", anesthesiaType: "Spinal / Epidural", scheduledDate: "2026-09-15", duration: "65 mins", status: "Scheduled", riskLevel: "Moderate" },
  { id: "PRC-503", cptCode: "61510", procedureName: "Craniectomy for Decompression / Subdural", department: "Neurosurgery", operatingRoom: "Neuro OR Suite 1", patientName: "William Anderson", patientId: "PAT-103", leadSurgeon: "Dr. James Wilson, MD", anesthesiaType: "General Anesthesia", scheduledDate: "2026-09-15", duration: "210 mins", status: "Urgent", riskLevel: "Critical" },
  { id: "PRC-504", cptCode: "27447", procedureName: "Total Knee Arthroplasty (TKA)", department: "Orthopedic Surgery", operatingRoom: "Surgical Suite 4", patientName: "Alexander Hayes", patientId: "PAT-105", leadSurgeon: "Dr. Marcus Park, FAAP", anesthesiaType: "Regional Nerve Block", scheduledDate: "2026-09-14", duration: "115 mins", status: "Completed", riskLevel: "Moderate" },
  { id: "PRC-505", cptCode: "43239", procedureName: "Upper GI Endoscopy with Biopsy", department: "Gastroenterology", operatingRoom: "Endoscopy Suite B", patientName: "Sophia Bennett", patientId: "PAT-104", leadSurgeon: "Dr. A. Rahman, MD", anesthesiaType: "MAC / Moderate Sedation", scheduledDate: "2026-09-15", duration: "40 mins", status: "Scheduled", riskLevel: "Low" },
  { id: "PRC-506", cptCode: "11104", procedureName: "Full Thickness Punch Biopsy (Skin 4mm)", department: "Dermatologic Surgery", operatingRoom: "Minor Procedure Room 1", patientName: "Olivia Zhang", patientId: "PAT-106", leadSurgeon: "Dr. Elena Rostova, MD", anesthesiaType: "Local Infiltration 1% Lido", scheduledDate: "2026-09-14", duration: "25 mins", status: "Completed", riskLevel: "Low" },
  { id: "PRC-507", cptCode: "31622", procedureName: "Diagnostic Flexible Bronchoscopy", department: "Interventional Pulmonology", operatingRoom: "Bronchoscopy Lab 1", patientName: "David Miller", patientId: "PAT-107", leadSurgeon: "Dr. Aisha Khan, MD, FCCP", anesthesiaType: "Conscious Sedation", scheduledDate: "2026-09-15", duration: "45 mins", status: "Urgent", riskLevel: "High" },
  { id: "PRC-508", cptCode: "27130", procedureName: "Total Hip Arthroplasty", department: "Orthopedic Surgery", operatingRoom: "Surgical Suite 6", patientName: "Isabella Martinez", patientId: "PAT-108", leadSurgeon: "Dr. Marcus Park, FAAP", anesthesiaType: "Spinal / Epidural", scheduledDate: "2026-09-16", duration: "120 mins", status: "Scheduled", riskLevel: "Moderate" },
  { id: "PRC-509", cptCode: "47562", procedureName: "Laparoscopic Cholecystectomy", department: "General Surgery", operatingRoom: "Surgical Suite 2", patientName: "Charlotte Davies", patientId: "PAT-110", leadSurgeon: "Dr. A. Rahman, MD", anesthesiaType: "General Endotracheal", scheduledDate: "2026-09-16", duration: "90 mins", status: "Scheduled", riskLevel: "Moderate" },
];

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
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentGradient }} />
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
                    style={{ background: accentGradient, boxShadow: `0 6px 18px ${accentGlow}` }}
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
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
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
                  style={{ background: accentGradient, boxShadow: `0 8px 24px ${accentGlow}` }}
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
   Empty State
   ============================================================ */
function ProceduresEmpty({ onAdd, hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center">
          <Inbox size={32} className="text-violet-500" strokeWidth={1.5} />
        </div>
        {!prefersReduced && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-violet-500/20"
          />
        )}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {hasFilters ? "No matching procedures" : "No procedures booked"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters
          ? "Try changing filter or search query"
          : "Book your first surgical procedure to get started"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Book Procedure
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: Procedures
   ============================================================ */
export default function Procedures({ procedures: proceduresProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [procedures, setProcedures] = useState(proceduresProp || DEFAULT_PROCEDURES);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("scheduledDate");
  const [sortDir, setSortDir] = useState("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    cptCode: "",
    procedureName: "",
    department: "Cardiothoracic Surgery",
    operatingRoom: "OR Suite 1",
    patientName: "",
    patientId: "",
    leadSurgeon: "Dr. Jonathan Vance, MD",
    anesthesiaType: "General Endotracheal",
    scheduledDate: new Date().toISOString().split("T")[0],
    duration: "90 mins",
    status: "Scheduled",
    riskLevel: "Moderate",
  });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const counts = useMemo(
    () => ({
      All: procedures.length,
      Completed: procedures.filter((p) => p.status === "Completed").length,
      Scheduled: procedures.filter((p) => p.status === "Scheduled").length,
      Urgent: procedures.filter((p) => p.status === "Urgent").length,
    }),
    [procedures]
  );

  const filteredProcedures = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = procedures.filter((item) => {
      const matchesFilter =
        activeFilter === "All" || item.status === activeFilter;
      const matchesSearch =
        !q ||
        item.procedureName.toLowerCase().includes(q) ||
        item.cptCode.toLowerCase().includes(q) ||
        item.patientName.toLowerCase().includes(q) ||
        item.leadSurgeon.toLowerCase().includes(q) ||
        item.operatingRoom.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [procedures, activeFilter, searchQuery, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingProcedure(item);
      setFormData(item);
    } else {
      setEditingProcedure(null);
      setFormData({
        cptCode: `${Math.floor(10000 + Math.random() * 90000)}`,
        procedureName: "",
        department: "General Surgery",
        operatingRoom: "Surgical Suite 2",
        patientName: "",
        patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        leadSurgeon: "Dr. Jonathan Vance, MD",
        anesthesiaType: "General Anesthesia",
        scheduledDate: new Date().toISOString().split("T")[0],
        duration: "90 mins",
        status: "Scheduled",
        riskLevel: "Moderate",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProcedure = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingProcedure) {
        setProcedures((prev) =>
          prev.map((p) => (p.id === editingProcedure.id ? { ...formData } : p))
        );
        showToast("Procedure updated");
      } else {
        const newEntry = {
          ...formData,
          id: `PRC-${Date.now().toString().slice(-4)}`,
        };
        setProcedures((prev) => [newEntry, ...prev]);
        showToast("Procedure booked");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save procedure", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (proc) => setDeleteTarget(proc);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcedures((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`Procedure ${deleteTarget.cptCode} cancelled`);
    } catch {
      showToast("Failed to cancel procedure", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewProcedure = (proc) => {
    navigate(`/procedures/${proc.id}`);
  };

  const handleExportCSV = () => {
    const headers =
      "CPT Code,Procedure Name,Department,Operating Room,Patient,Surgeon,Anesthesia,Duration,Status\n";
    const rows = filteredProcedures
      .map(
        (p) =>
          `"${p.cptCode}","${p.procedureName}","${p.department}","${p.operatingRoom}","${p.patientName}","${p.leadSurgeon}","${p.anesthesiaType}","${p.duration}","${p.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `procedures_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredProcedures.length} procedures exported`);
  };

  const handleAIScheduling = async () => {
    showToast("Optimizing OR turnaround...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Optimization complete — 3 slots improved");
  };

  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Scheduled;
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border"
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <Scissors size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Surgical & Clinical Procedures
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              OR bookings, post-op logs & surgeon roster
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAIScheduling}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-violet-500/30 bg-violet-50/50 dark:bg-[#0d1629] text-violet-600 dark:text-violet-400 hover:bg-violet-100/50 dark:hover:bg-violet-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI OR scheduling"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI OR Scheduling</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export procedures"
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
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} procedures`}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Operating Room & Procedure Registry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-violet-500 tabular-nums">
                {filteredProcedures.length}
              </span>{" "}
              of {procedures.length} cases
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search procedure, CPT, surgeon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search procedures"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
              }}
              aria-label="Book new procedure"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Book Procedure</span>
            </motion.button>
          </div>
        </div>

        {filteredProcedures.length === 0 ? (
          <ProceduresEmpty
            onAdd={() => handleOpenModal()}
            hasFilters={searchQuery !== "" || activeFilter !== "All"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#182338] bg-gray-50/75 dark:bg-[#090f1c]/60 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                  <th className="py-4 px-6">
                    <button
                      onClick={() => handleSort("procedureName")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Procedure & CPT
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-3">OR Location</th>
                  <th className="py-4 px-3">Patient</th>
                  <th className="py-4 px-3">Lead Surgeon</th>
                  <th className="py-4 px-3">Anesthesia / Duration</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredProcedures.map((proc, idx) => (
                  <motion.tr
                    key={proc.id}
                    initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                    animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + idx * 0.04 }}
                    whileHover={prefersReduced ? {} : { x: 4 }}
                    className="hover:bg-gray-50/80 dark:hover:bg-[#0f172a]/60 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={prefersReduced ? {} : { scale: 1.1 }}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0"
                        >
                          <Scissors className="w-4 h-4" strokeWidth={2.5} />
                        </motion.div>
                        <div className="min-w-0">
                          <button
                            onClick={() => handleViewProcedure(proc)}
                            className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-500 transition-colors truncate max-w-[240px] block text-left"
                          >
                            {proc.procedureName}
                          </button>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span className="font-mono font-black text-violet-600 dark:text-violet-400">
                              CPT #{proc.cptCode}
                            </span>
                            <span>•</span>
                            <span className="truncate">{proc.department}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 truncate">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                        <span className="truncate">{proc.operatingRoom}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                        Date: {proc.scheduledDate}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 truncate">
                        {proc.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        ID: #{proc.patientId}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[180px]">
                        <Stethoscope className="w-3.5 h-3.5 text-violet-500 shrink-0" strokeWidth={2.5} />
                        <span className="truncate">{proc.leadSurgeon}</span>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="text-slate-800 dark:text-slate-200 font-black tabular-nums">
                        {proc.duration}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[150px]">
                        {proc.anesthesiaType}
                      </div>
                    </td>

                    <td className="py-4 px-3">{renderStatusBadge(proc.status)}</td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewProcedure(proc)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                          title="View"
                          aria-label={`View ${proc.procedureName}`}
                        >
                          <Eye className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal(proc)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                          title="Edit"
                          aria-label={`Edit ${proc.procedureName}`}
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(proc)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                          title="Cancel"
                          aria-label={`Cancel ${proc.procedureName}`}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                    <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingProcedure
                        ? "Update Procedure Entry"
                        : "Book Surgical Procedure"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Configure OR, surgeon, CPT code & anesthesia
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

              <form onSubmit={handleSaveProcedure} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Procedure Title"
                    required
                    placeholder="e.g. Coronary Artery Bypass Graft"
                    value={formData.procedureName}
                    onChange={(e) =>
                      setFormData({ ...formData, procedureName: e.target.value })
                    }
                    icon={<Scissors size={16} />}
                  />
                  <Input
                    label="CPT Procedure Code"
                    required
                    value={formData.cptCode}
                    onChange={(e) =>
                      setFormData({ ...formData, cptCode: e.target.value })
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
                      Lead Operating Surgeon
                    </label>
                    <select
                      value={formData.leadSurgeon}
                      onChange={(e) =>
                        setFormData({ ...formData, leadSurgeon: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Dr. Jonathan Vance, MD</option>
                      <option>Dr. Sarah Chen, MD, FACOG</option>
                      <option>Dr. James Wilson, MD</option>
                      <option>Dr. Marcus Park, FAAP</option>
                      <option>Dr. A. Rahman, MD</option>
                      <option>Dr. Elena Rostova, MD</option>
                      <option>Dr. Aisha Khan, MD, FCCP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Surgical Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Cardiothoracic Surgery</option>
                      <option>Obstetrics & Gynecology</option>
                      <option>Neurosurgery</option>
                      <option>Orthopedic Surgery</option>
                      <option>Gastroenterology</option>
                      <option>Dermatologic Surgery</option>
                      <option>Interventional Pulmonology</option>
                    </select>
                  </div>
                  <Input
                    label="Assigned OR Suite"
                    required
                    value={formData.operatingRoom}
                    onChange={(e) =>
                      setFormData({ ...formData, operatingRoom: e.target.value })
                    }
                    icon={<Building size={16} />}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Anesthesia Protocol
                    </label>
                    <select
                      value={formData.anesthesiaType}
                      onChange={(e) =>
                        setFormData({ ...formData, anesthesiaType: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>General Endotracheal</option>
                      <option>Spinal / Epidural</option>
                      <option>Regional Nerve Block</option>
                      <option>MAC / Moderate Sedation</option>
                      <option>Local Infiltration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Case Urgency
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Scheduled</option>
                      <option>Completed</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <Input
                    label="Expected Duration"
                    required
                    placeholder="e.g. 90 mins"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                  <Input
                    label="Scheduled Date"
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledDate: e.target.value })
                    }
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
                      background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                      boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>
                        {editingProcedure ? "Update Case" : "Confirm Booking"}
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ CANCEL WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Cancel this surgical procedure?"
        message={
          deleteTarget
            ? `You are about to cancel ${deleteTarget.procedureName} (CPT ${deleteTarget.cptCode}) for ${deleteTarget.patientName} in ${deleteTarget.operatingRoom}. The OR slot will be released and the surgical team notified.`
            : ""
        }
        confirmText="Yes, Cancel"
        cancelText="Keep Booked"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}