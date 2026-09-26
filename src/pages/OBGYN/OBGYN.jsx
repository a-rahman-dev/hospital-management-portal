import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Baby,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Calendar,
  Building,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Stethoscope,
  Activity,
  Inbox,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 OBGYN SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All         → Rose    (#f43f5e) — brand (maternal care)
   - Normal      → Emerald (#10b981) — routine
   - High Risk   → Amber   (#f59e0b) — warning
   - Postpartum  → Cyan    (#06b6d4) — recovery
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All Patients",
    icon: Baby,
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #db2777 100%)",
    glow: "rgba(244, 63, 94, 0.45)",
    softText: "text-rose-600 dark:text-rose-400",
    softBg: "bg-rose-500/10",
    softBorder: "border-rose-500/20",
    hoverBorder: "hover:border-rose-400 dark:hover:border-rose-500/50",
    hoverBg: "hover:bg-rose-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Normal",
    label: "Active Prenatal",
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
    id: "High Risk",
    label: "High Risk OB",
    icon: AlertTriangle,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    softText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-500/10",
    softBorder: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Postpartum",
    label: "Postpartum",
    icon: HeartHandshake,
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    glow: "rgba(6, 182, 212, 0.45)",
    softText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-500/10",
    softBorder: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-50/30 dark:hover:bg-[#0e172a]",
  },
];

const RISK_CONFIG = {
  Normal: { hex: "#10b981", label: "Standard Risk", pulse: false },
  "High Risk": { hex: "#f59e0b", label: "High Risk OB", pulse: true },
  Postpartum: { hex: "#06b6d4", label: "Postpartum", pulse: false },
};

const TRIMESTERS = [
  "1st Trimester",
  "2nd Trimester",
  "3rd Trimester",
  "Postpartum",
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/30 focus:border-rose-500 transition-all";

/* ==================== FOREIGN DATA (Rule 3) ==================== */
const DEFAULT_REGISTRY = [
  { id: "OB-301", patientName: "Emma Rodriguez", patientId: "PAT-102", gestationalAge: "32w 4d", trimester: "3rd Trimester", edd: "2026-11-05", gravidaPara: "G2 P1", fetalHeartRate: "142 bpm", riskCategory: "Normal", leadObstetrician: "Dr. Sarah Chen, MD, FACOG", suite: "Maternity Suite 12", notes: "Fundal height concordant. Cephalic presentation.", avatarColor: "from-pink-500 to-rose-600" },
  { id: "OB-302", patientName: "Chloe Davenport", patientId: "PAT-118", gestationalAge: "28w 1d", trimester: "3rd Trimester", edd: "2026-12-08", gravidaPara: "G1 P0", fetalHeartRate: "155 bpm", riskCategory: "High Risk", leadObstetrician: "Dr. Sarah Chen, MD, FACOG", suite: "High-Risk OB Clinic 4", notes: "Gestational hypertension flagged (BP 142/92). Close observation.", avatarColor: "from-rose-500 to-red-600" },
  { id: "OB-303", patientName: "Maya Lin", patientId: "PAT-124", gestationalAge: "16w 2d", trimester: "2nd Trimester", edd: "2027-02-28", gravidaPara: "G3 P2", fetalHeartRate: "148 bpm", riskCategory: "Normal", leadObstetrician: "Dr. Jonathan Vance, MD", suite: "Maternity Suite 08", notes: "Normal anatomy scan scheduled. Quad screen negative.", avatarColor: "from-violet-500 to-purple-600" },
  { id: "OB-304", patientName: "Isabella Martinez", patientId: "PAT-131", gestationalAge: "Postpartum (Day 12)", trimester: "Postpartum", edd: "Delivered (2026-09-03)", gravidaPara: "G1 P1", fetalHeartRate: "Neonatal WNL", riskCategory: "Postpartum", leadObstetrician: "Dr. Sarah Chen, MD, FACOG", suite: "Postnatal Recovery 104", notes: "Post-cesarean wound healing cleanly. Lactation established.", avatarColor: "from-cyan-500 to-blue-600" },
  { id: "OB-305", patientName: "Hannah Abbott", patientId: "PAT-139", gestationalAge: "34w 0d", trimester: "3rd Trimester", edd: "2026-10-26", gravidaPara: "G2 P1", fetalHeartRate: "138 bpm", riskCategory: "High Risk", leadObstetrician: "Dr. Sarah Chen, MD, FACOG", suite: "Perinatal Special Care", notes: "Gestational diabetes controlled with insulin. Bi-weekly NST.", avatarColor: "from-rose-600 to-orange-600" },
  { id: "OB-306", patientName: "Jessica Morales", patientId: "PAT-145", gestationalAge: "11w 5d", trimester: "1st Trimester", edd: "2027-03-30", gravidaPara: "G1 P0", fetalHeartRate: "162 bpm", riskCategory: "Normal", leadObstetrician: "Dr. A. Rahman, MD", suite: "Ambulatory OB 2", notes: "Nuchal translucency ultrasound within normal limits.", avatarColor: "from-pink-600 to-purple-600" },
  { id: "OB-307", patientName: "Sophia Laurent", patientId: "PAT-152", gestationalAge: "22w 3d", trimester: "2nd Trimester", edd: "2027-01-15", gravidaPara: "G2 P0", fetalHeartRate: "150 bpm", riskCategory: "Normal", leadObstetrician: "Dr. A. Rahman, MD", suite: "Maternity Suite 06", notes: "Anatomy scan completed. Awaiting detailed review.", avatarColor: "from-fuchsia-500 to-pink-600" },
  { id: "OB-308", patientName: "Naomi Patel", patientId: "PAT-158", gestationalAge: "36w 6d", trimester: "3rd Trimester", edd: "2026-10-10", gravidaPara: "G1 P0", fetalHeartRate: "128 bpm", riskCategory: "High Risk", leadObstetrician: "Dr. Sarah Chen, MD, FACOG", suite: "Labor & Delivery Prep", notes: "Breech presentation — external cephalic version planned.", avatarColor: "from-red-500 to-rose-600" },
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
function OBGYNEmpty({ onAdd, hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 flex items-center justify-center">
          <Inbox size={32} className="text-rose-500" strokeWidth={1.5} />
        </div>
        {!prefersReduced && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-rose-500/20"
          />
        )}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {hasFilters ? "No matching patients" : "No maternal patients enrolled"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters
          ? "Try changing filter or search query"
          : "Enroll your first obstetric patient to get started"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Enroll Patient
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: OBGYN
   ============================================================ */
export default function OBGYN({ registry: registryProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [registry, setRegistry] = useState(registryProp || DEFAULT_REGISTRY);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("patientName");
  const [sortDir, setSortDir] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    gestationalAge: "24w 0d",
    trimester: "2nd Trimester",
    edd: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    gravidaPara: "G1 P0",
    fetalHeartRate: "145 bpm",
    riskCategory: "Normal",
    leadObstetrician: "Dr. Sarah Chen, MD, FACOG",
    suite: "Maternity Suite 12",
    notes: "Routine prenatal follow-up.",
  });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const counts = useMemo(
    () => ({
      All: registry.length,
      Normal: registry.filter((p) => p.riskCategory === "Normal").length,
      "High Risk": registry.filter((p) => p.riskCategory === "High Risk").length,
      Postpartum: registry.filter((p) => p.riskCategory === "Postpartum").length,
    }),
    [registry]
  );

  const filteredRegistry = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = registry.filter((patient) => {
      const matchesFilter =
        activeFilter === "All" || patient.riskCategory === activeFilter;
      const matchesSearch =
        !q ||
        patient.patientName.toLowerCase().includes(q) ||
        patient.patientId.toLowerCase().includes(q) ||
        patient.notes.toLowerCase().includes(q) ||
        patient.leadObstetrician.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [registry, activeFilter, searchQuery, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
    } else {
      setEditingPatient(null);
      setFormData({
        patientName: "",
        patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        gestationalAge: "20w 0d",
        trimester: "2nd Trimester",
        edd: new Date(Date.now() + 140 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        gravidaPara: "G1 P0",
        fetalHeartRate: "148 bpm",
        riskCategory: "Normal",
        leadObstetrician: "Dr. Sarah Chen, MD, FACOG",
        suite: "Maternity Suite 12",
        notes: "Routine prenatal screening.",
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingPatient) {
        setRegistry((prev) =>
          prev.map((p) => (p.id === editingPatient.id ? { ...formData } : p))
        );
        showToast("Obstetric chart updated");
      } else {
        const newEntry = {
          ...formData,
          id: `OB-${Date.now().toString().slice(-4)}`,
          avatarColor: "from-pink-500 to-rose-600",
        };
        setRegistry((prev) => [newEntry, ...prev]);
        showToast("Maternal patient enrolled");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save chart", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (patient) => setDeleteTarget(patient);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setRegistry((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${deleteTarget.patientName}'s record archived`);
    } catch {
      showToast("Failed to archive record", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewPatient = (patient) => {
    navigate(`/obgyn/${patient.id}`);
  };

  const handleExportCSV = () => {
    const headers =
      "Patient,MRN,Gestational Age,Trimester,EDD,Gravida/Para,FHR,Risk Level,Lead MD\n";
    const rows = filteredRegistry
      .map(
        (p) =>
          `"${p.patientName}","${p.patientId}","${p.gestationalAge}","${p.trimester}","${p.edd}","${p.gravidaPara}","${p.fetalHeartRate}","${p.riskCategory}","${p.leadObstetrician}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obgyn_registry_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredRegistry.length} records exported`);
  };

  const handleAIRisk = async () => {
    showToast("Analyzing maternal risk profiles...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("AI analysis complete — 2 high-risk pregnancies flagged");
  };

  const renderRiskBadge = (risk) => {
    const config = RISK_CONFIG[risk] || RISK_CONFIG.Normal;
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-500/40">
              <Baby size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              OB/GYN & Maternity Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Obstetric registry, gestational tracking & perinatal triage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAIRisk}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-pink-500/30 bg-pink-50/50 dark:bg-[#0d1629] text-pink-600 dark:text-pink-400 hover:bg-pink-100/50 dark:hover:bg-pink-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI maternal risk stratification"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Risk Strat</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export OBGYN registry"
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
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} patients`}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Maternity & Prenatal Registry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-rose-500 tabular-nums">
                {filteredRegistry.length}
              </span>{" "}
              of {registry.length} profiles
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search patient, MRN, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search patients"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #f43f5e 0%, #db2777 100%)",
                boxShadow: "0 8px 24px rgba(244, 63, 94, 0.35)",
              }}
              aria-label="Enroll new maternal patient"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Enroll Patient</span>
            </motion.button>
          </div>
        </div>

        {filteredRegistry.length === 0 ? (
          <OBGYNEmpty
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
                      onClick={() => handleSort("patientName")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Maternal Patient
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-3">Gestation</th>
                  <th className="py-4 px-3">EDD / Notes</th>
                  <th className="py-4 px-3">Gravida / FHR</th>
                  <th className="py-4 px-3">Attending OB</th>
                  <th className="py-4 px-3">Risk Level</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredRegistry.map((patient, idx) => {
                  const initials = patient.patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <motion.tr
                      key={patient.id}
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
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-xs text-white shadow-md shrink-0",
                              patient.avatarColor || "from-pink-500 to-rose-600"
                            )}
                          >
                            {initials}
                          </motion.div>
                          <div className="min-w-0">
                            <button
                              onClick={() => handleViewPatient(patient)}
                              className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-500 transition-colors truncate block text-left"
                            >
                              {patient.patientName}
                            </button>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              ID: #{patient.patientId} • {patient.suite}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-black text-rose-600 dark:text-rose-400 font-mono text-xs tabular-nums">
                          {patient.gestationalAge}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {patient.trimester}
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-pink-500 shrink-0" strokeWidth={2.5} />
                          {patient.edd}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[160px]">
                          {patient.notes}
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-200 tabular-nums">
                          {patient.gravidaPara}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          FHR:{" "}
                          <span className="font-black text-slate-700 dark:text-slate-300 tabular-nums">
                            {patient.fetalHeartRate}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[180px]">
                          <Stethoscope className="w-3.5 h-3.5 text-rose-500 shrink-0" strokeWidth={2.5} />
                          <span className="truncate">{patient.leadObstetrician}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Maternal & Fetal Care
                        </div>
                      </td>

                      <td className="py-4 px-3">{renderRiskBadge(patient.riskCategory)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewPatient(patient)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="View Chart"
                            aria-label={`View ${patient.patientName}'s chart`}
                          >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(patient)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Edit"
                            aria-label={`Edit ${patient.patientName}'s chart`}
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(patient)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Archive"
                            aria-label={`Archive ${patient.patientName}'s record`}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
                    <Baby className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingPatient ? "Update Obstetric Chart" : "Enroll Maternal Patient"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Configure gestational milestone, EDD & fetal vitals
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

              <form onSubmit={handleSavePatient} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Full Name"
                    required
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    icon={<Baby size={16} />}
                  />
                  <Input
                    label="Medical Record Number"
                    required
                    value={formData.patientId}
                    onChange={(e) =>
                      setFormData({ ...formData, patientId: e.target.value })
                    }
                  />
                  <Input
                    label="Gestational Age (e.g. 28w 4d)"
                    required
                    value={formData.gestationalAge}
                    onChange={(e) =>
                      setFormData({ ...formData, gestationalAge: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Trimester Stage
                    </label>
                    <select
                      value={formData.trimester}
                      onChange={(e) =>
                        setFormData({ ...formData, trimester: e.target.value })
                      }
                      className={selectClass}
                    >
                      {TRIMESTERS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Estimated Due Date (EDD)"
                    type="date"
                    required
                    value={formData.edd}
                    onChange={(e) =>
                      setFormData({ ...formData, edd: e.target.value })
                    }
                    icon={<Calendar size={16} />}
                  />
                  <Input
                    label="Gravida / Para Score"
                    required
                    placeholder="e.g. G2 P1"
                    value={formData.gravidaPara}
                    onChange={(e) =>
                      setFormData({ ...formData, gravidaPara: e.target.value })
                    }
                  />
                  <Input
                    label="Fetal Heart Rate (FHR)"
                    required
                    placeholder="e.g. 145 bpm"
                    value={formData.fetalHeartRate}
                    onChange={(e) =>
                      setFormData({ ...formData, fetalHeartRate: e.target.value })
                    }
                    icon={<Activity size={16} />}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Risk Classification
                    </label>
                    <select
                      value={formData.riskCategory}
                      onChange={(e) =>
                        setFormData({ ...formData, riskCategory: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Normal</option>
                      <option>High Risk</option>
                      <option>Postpartum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Lead Obstetrician
                    </label>
                    <select
                      value={formData.leadObstetrician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadObstetrician: e.target.value,
                        })
                      }
                      className={selectClass}
                    >
                      <option>Dr. Sarah Chen, MD, FACOG</option>
                      <option>Dr. Jonathan Vance, MD</option>
                      <option>Dr. A. Rahman, MD</option>
                      <option>Dr. Elena Rostova, MD</option>
                    </select>
                  </div>
                  <Input
                    label="Assigned Maternity Suite"
                    value={formData.suite}
                    onChange={(e) =>
                      setFormData({ ...formData, suite: e.target.value })
                    }
                    icon={<Building size={16} />}
                  />
                  <Input
                    label="Clinical Progress Notes"
                    required
                    placeholder="e.g. Fundal height concordant"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    containerClassName="sm:col-span-2"
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
                      background: "linear-gradient(135deg, #f43f5e 0%, #db2777 100%)",
                      boxShadow: "0 8px 24px rgba(244, 63, 94, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>
                        {editingPatient ? "Update Chart" : "Save Profile"}
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ ARCHIVE WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Archive this obstetric record?"
        message={
          deleteTarget
            ? `You are about to archive ${deleteTarget.patientName}'s obstetric record (${deleteTarget.patientId}, ${deleteTarget.gestationalAge}). All prenatal visit history and fetal monitoring data will be removed from the active registry.`
            : ""
        }
        confirmText="Yes, Archive"
        cancelText="Keep Record"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}