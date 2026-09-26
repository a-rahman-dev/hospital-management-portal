import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Stethoscope,
  Building,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Activity,
  Inbox,
  AlertCircle,
  Loader2,
  Eye,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 LAB REPORTS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Cohesive design system with semantic progression:
   - All       → Cyan    (#06b6d4) — brand
   - Normal    → Emerald (#10b981) — success
   - Pending   → Amber   (#f59e0b) — warning
   - Critical  → Rose    (#f43f5e) — danger (highest severity)
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All Reports",
    icon: FlaskConical,
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.45)",
    softText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-500/10",
    softBorder: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-50/30 dark:hover:bg-[#0e172a]",
    hoverShadow: "hover:shadow-cyan-500/10",
  },
  {
    id: "Normal",
    label: "Normal WNL",
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
    label: "In Progress",
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
    id: "Critical",
    label: "Critical Flags",
    icon: AlertTriangle,
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

const FLAG_CONFIG = {
  Normal: {
    hex: "#10b981",
    label: "Normal WNL",
    pulse: false,
  },
  Pending: {
    hex: "#f59e0b",
    label: "Processing",
    pulse: false,
  },
  Critical: {
    hex: "#f43f5e",
    label: "Critical Alert",
    pulse: true,
  },
};

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/30 focus:border-cyan-500 transition-all";

/* ==================== FOREIGN DATA (Rule 3) ==================== */
const defaultLabReports = [
  { id: "LAB-701", accessionNumber: "ACC-99201", testName: "Comprehensive Metabolic Panel (CMP)", specimenType: "Venous Blood / Serum", category: "Biochemistry", patientName: "Jonathan Mitchell", patientId: "PAT-101", orderingDoctor: "Dr. Jonathan Vance, MD", department: "Cardiology", collectedDate: "2026-09-14", resultDate: "2026-09-15", resultSummary: "Glucose 104 mg/dL, eGFR >90, Electrolytes WNL", flagLevel: "Normal", labFacility: "Core Diagnostics L-2" },
  { id: "LAB-702", accessionNumber: "ACC-99202", testName: "Beta-hCG & Rh Antibody Panel", specimenType: "Whole Blood EDTA", category: "Immunology", patientName: "Emma Rodriguez", patientId: "PAT-102", orderingDoctor: "Dr. Sarah Chen, MD", department: "OB/GYN", collectedDate: "2026-09-14", resultDate: "2026-09-15", resultSummary: "Rh Positive, Antibody Titer Negative (<1:4)", flagLevel: "Normal", labFacility: "Women's Health Pathology" },
  { id: "LAB-703", accessionNumber: "ACC-99203", testName: "Cardiac Troponin I (High-Sensitivity)", specimenType: "Plasma Heparin", category: "Critical Assay", patientName: "William Anderson", patientId: "PAT-103", orderingDoctor: "Dr. James Wilson, MD", department: "Neurology", collectedDate: "2026-09-15", resultDate: "2026-09-15", resultSummary: "hs-cTnI: 0.18 ng/mL (Ref <0.04) [ELEVATED]", flagLevel: "Critical", labFacility: "STAT Emergency Lab" },
  { id: "LAB-704", accessionNumber: "ACC-99204", testName: "Glycated Hemoglobin (HbA1c)", specimenType: "Whole Blood EDTA", category: "Endocrinology", patientName: "Sophia Bennett", patientId: "PAT-104", orderingDoctor: "Dr. A. Rahman", department: "Internal Medicine", collectedDate: "2026-09-13", resultDate: "2026-09-14", resultSummary: "HbA1c: 7.4% (Estimated Average Glucose: 165)", flagLevel: "Critical", labFacility: "Core Diagnostics L-2" },
  { id: "LAB-705", accessionNumber: "ACC-99205", testName: "Synovial Fluid & Gram Stain", specimenType: "Joint Aspirate", category: "Microbiology", patientName: "Alexander Hayes", patientId: "PAT-105", orderingDoctor: "Dr. Marcus Park, FAAP", department: "Orthopedics", collectedDate: "2026-09-15", resultDate: "2026-09-16", resultSummary: "Incubation in progress (Gram: No organisms)", flagLevel: "Pending", labFacility: "Surgical Microbiology" },
  { id: "LAB-706", accessionNumber: "ACC-99206", testName: "Punch Biopsy Histopathology", specimenType: "Formalin Tissue 3mm", category: "Histopathology", patientName: "Olivia Zhang", patientId: "PAT-106", orderingDoctor: "Dr. Elena Rostova, MD", department: "Dermatology", collectedDate: "2026-09-12", resultDate: "2026-09-14", resultSummary: "Spongiotic dermatitis (Allergic contact reaction)", flagLevel: "Normal", labFacility: "DermPath Center" },
  { id: "LAB-707", accessionNumber: "ACC-99207", testName: "Arterial Blood Gas (ABG Panel)", specimenType: "Heparinized Arterial", category: "Pulmonary Panel", patientName: "David Miller", patientId: "PAT-107", orderingDoctor: "Dr. Aisha Khan, MD", department: "Pulmonology", collectedDate: "2026-09-15", resultDate: "2026-09-15", resultSummary: "pH 7.38, PaCO2 42 mmHg, PaO2 88 mmHg, SaO2 96%", flagLevel: "Normal", labFacility: "STAT Emergency Lab" },
  { id: "LAB-708", accessionNumber: "ACC-99208", testName: "Lipid Panel (Fasting)", specimenType: "Venous Blood / Serum", category: "Biochemistry", patientName: "Isabella Martinez", patientId: "PAT-108", orderingDoctor: "Dr. James Wilson, MD", department: "Cardiology", collectedDate: "2026-09-15", resultDate: "2026-09-16", resultSummary: "LDL 142 mg/dL (Ref <100) [BORDERLINE HIGH]", flagLevel: "Pending", labFacility: "Core Diagnostics L-2" },
  { id: "LAB-709", accessionNumber: "ACC-99209", testName: "Thyroid Function Panel (TSH, Free T4)", specimenType: "Venous Blood / Serum", category: "Endocrinology", patientName: "Charlotte Davies", patientId: "PAT-110", orderingDoctor: "Dr. Elena Rostova, MD", department: "Endocrinology", collectedDate: "2026-09-14", resultDate: "2026-09-15", resultSummary: "TSH 2.1 mIU/L, Free T4 1.2 ng/dL — Euthyroid", flagLevel: "Normal", labFacility: "Metro Health Labs" },
  { id: "LAB-710", accessionNumber: "ACC-99210", testName: "Sputum Culture & Sensitivity", specimenType: "Deep Sputum", category: "Microbiology", patientName: "Benjamin Clarke", patientId: "PAT-109", orderingDoctor: "Dr. Aisha Khan, MD", department: "Pulmonology", collectedDate: "2026-09-14", resultDate: "2026-09-16", resultSummary: "Streptococcus pneumoniae — Sensitive to Amoxicillin", flagLevel: "Critical", labFacility: "STAT Emergency Lab" },
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
   Empty State
   ============================================================ */
function LabReportsEmpty({ onAdd, hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Inbox size={32} className="text-cyan-500" strokeWidth={1.5} />
        </div>
        {!prefersReduced && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-cyan-500/20"
          />
        )}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {hasFilters ? "No matching lab reports" : "No lab reports yet"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters
          ? "Try changing filter or search query"
          : "Order your first diagnostic test to get started"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Order Lab Test
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: PatientLabReports
   ============================================================ */
export default function PatientLabReports() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [reports, setReports] = useState(defaultLabReports);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("collectedDate");
  const [sortDir, setSortDir] = useState("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    accessionNumber: "",
    testName: "",
    specimenType: "Venous Blood / Serum",
    category: "Biochemistry",
    patientName: "",
    patientId: "",
    orderingDoctor: "Dr. Jonathan Vance, MD",
    department: "Cardiology",
    collectedDate: new Date().toISOString().split("T")[0],
    resultDate: new Date().toISOString().split("T")[0],
    resultSummary: "",
    flagLevel: "Normal",
    labFacility: "Core Diagnostics L-2",
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
      All: reports.length,
      Normal: reports.filter((r) => r.flagLevel === "Normal").length,
      Pending: reports.filter((r) => r.flagLevel === "Pending").length,
      Critical: reports.filter((r) => r.flagLevel === "Critical").length,
    }),
    [reports]
  );

  /* ---- Filtered + sorted ---- */
  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = reports.filter((rep) => {
      const matchesFilter = activeFilter === "All" || rep.flagLevel === activeFilter;
      const matchesSearch =
        !q ||
        rep.testName.toLowerCase().includes(q) ||
        rep.patientName.toLowerCase().includes(q) ||
        rep.accessionNumber.toLowerCase().includes(q) ||
        rep.orderingDoctor.toLowerCase().includes(q) ||
        rep.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [reports, activeFilter, searchQuery, sortKey, sortDir]);

  /* ---- Sort ---- */
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---- Open modal ---- */
  const handleOpenModal = (rep = null) => {
    if (rep) {
      setEditingReport(rep);
      setFormData(rep);
    } else {
      setEditingReport(null);
      setFormData({
        accessionNumber: `ACC-${Math.floor(10000 + Math.random() * 90000)}`,
        testName: "",
        specimenType: "Venous Blood / Serum",
        category: "Biochemistry",
        patientName: "",
        patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        orderingDoctor: "Dr. Jonathan Vance, MD",
        department: "Cardiology",
        collectedDate: new Date().toISOString().split("T")[0],
        resultDate: new Date().toISOString().split("T")[0],
        resultSummary: "",
        flagLevel: "Normal",
        labFacility: "Core Diagnostics L-2",
      });
    }
    setIsModalOpen(true);
  };

  /* ---- Save ---- */
  const handleSaveReport = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingReport) {
        setReports((prev) =>
          prev.map((r) => (r.id === editingReport.id ? { ...formData } : r))
        );
        showToast("Lab report updated");
      } else {
        const newEntry = {
          ...formData,
          id: `LAB-${Date.now().toString().slice(-4)}`,
        };
        setReports((prev) => [newEntry, ...prev]);
        showToast("Lab order transmitted");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save lab report", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Delete via warning modal (Rule 4) ---- */
  const handleDeleteClick = (rep) => setDeleteTarget(rep);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`Requisition ${deleteTarget.accessionNumber} voided`);
    } catch {
      showToast("Failed to void requisition", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ---- View ---- */
  const handleViewReport = (rep) => {
    navigate(`/patients/lab-reports/${rep.id}`);
  };

  /* ---- Export CSV ---- */
  const handleExportCSV = () => {
    const headers =
      "Accession,Test Name,Category,Patient,Doctor,Result Summary,Status,Date\n";
    const rows = filteredReports
      .map(
        (r) =>
          `"${r.accessionNumber}","${r.testName}","${r.category}","${r.patientName}","${r.orderingDoctor}","${r.resultSummary}","${r.flagLevel}","${r.resultDate}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lab_reports_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredReports.length} reports exported`);
  };

  /* ---- AI Triage ---- */
  const handleAITriage = async () => {
    showToast("Analyzing critical lab values...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Triage complete — 3 critical values flagged");
  };

  /* ---- Flag badge ---- */
  const renderFlagBadge = (flag) => {
    const config = FLAG_CONFIG[flag] || FLAG_CONFIG.Normal;
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <FlaskConical size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Laboratory & Pathology
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Diagnostic test batteries, specimen assays & urgent flags
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAITriage}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-[#0d1629] text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100/50 dark:hover:bg-cyan-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI critical value triage"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Triage</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export lab reports"
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
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} reports`}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Pathology & Diagnostic Results
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-cyan-500 tabular-nums">
                {filteredReports.length}
              </span>{" "}
              of {reports.length} specimen analyses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search assay, patient, accession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search lab reports"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
              }}
              aria-label="Order new lab test"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Order Lab Test</span>
            </motion.button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <LabReportsEmpty
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
                      onClick={() => handleSort("testName")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Assay & Specimen
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-3">Accession #</th>
                  <th className="py-4 px-3">Patient</th>
                  <th className="py-4 px-3">Ordering MD</th>
                  <th className="py-4 px-3">Findings</th>
                  <th className="py-4 px-3">Triage</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredReports.map((rep, idx) => (
                  <motion.tr
                    key={rep.id}
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
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0"
                        >
                          <Activity className="w-4 h-4" strokeWidth={2.5} />
                        </motion.div>
                        <div className="min-w-0">
                          <button
                            onClick={() => handleViewReport(rep)}
                            className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 transition-colors truncate max-w-[240px] block text-left"
                          >
                            {rep.testName}
                          </button>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {rep.specimenType} • {rep.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-mono font-black text-cyan-600 dark:text-cyan-400 text-xs tabular-nums">
                        #{rep.accessionNumber}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 truncate">
                        {rep.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        ID: #{rep.patientId}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate">
                        <Stethoscope
                          className="w-3.5 h-3.5 text-cyan-500 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="truncate">{rep.orderingDoctor}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {rep.department}
                      </div>
                    </td>
                    <td className="py-4 px-3 max-w-[220px]">
                      <div className="text-slate-800 dark:text-slate-200 font-medium truncate">
                        {rep.resultSummary}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Verified: {rep.resultDate}
                      </div>
                    </td>
                    <td className="py-4 px-3">{renderFlagBadge(rep.flagLevel)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewReport(rep)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                          title="View Report"
                          aria-label={`View ${rep.testName}`}
                        >
                          <Eye className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal(rep)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                          title="Edit"
                          aria-label={`Edit ${rep.testName}`}
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(rep)}
                          className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                          title="Void Test"
                          aria-label={`Void ${rep.testName}`}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
                    <FlaskConical className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingReport
                        ? "Update Laboratory Requisition"
                        : "Order Diagnostic Test"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Configure specimen, assay panel & alert flags
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

              <form onSubmit={handleSaveReport} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Diagnostic Assay Name"
                    required
                    placeholder="e.g. Comprehensive Metabolic Panel"
                    value={formData.testName}
                    onChange={(e) =>
                      setFormData({ ...formData, testName: e.target.value })
                    }
                    icon={<FlaskConical size={16} />}
                  />
                  <Input
                    label="Accession #"
                    required
                    value={formData.accessionNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accessionNumber: e.target.value })
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
                      Specimen Matrix
                    </label>
                    <select
                      value={formData.specimenType}
                      onChange={(e) =>
                        setFormData({ ...formData, specimenType: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Venous Blood / Serum</option>
                      <option>Whole Blood EDTA</option>
                      <option>Plasma Heparin</option>
                      <option>Clean Catch Midstream Urine</option>
                      <option>Joint Aspirate</option>
                      <option>Tissue Biopsy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Ordering Physician
                    </label>
                    <select
                      value={formData.orderingDoctor}
                      onChange={(e) =>
                        setFormData({ ...formData, orderingDoctor: e.target.value })
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
                      Clinical Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Cardiology</option>
                      <option>OB/GYN</option>
                      <option>Neurology</option>
                      <option>Internal Medicine</option>
                      <option>Orthopedics</option>
                      <option>Dermatology</option>
                      <option>Pulmonology</option>
                      <option>Endocrinology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Finding Status
                    </label>
                    <select
                      value={formData.flagLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, flagLevel: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Normal</option>
                      <option>Pending</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <Input
                    label="Processing Laboratory"
                    value={formData.labFacility}
                    onChange={(e) =>
                      setFormData({ ...formData, labFacility: e.target.value })
                    }
                    icon={<Building size={16} />}
                  />
                  <Input
                    label="Quantitative Findings"
                    required
                    placeholder="e.g. Glucose 104 mg/dL"
                    value={formData.resultSummary}
                    onChange={(e) =>
                      setFormData({ ...formData, resultSummary: e.target.value })
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
                      background: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                      boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {editingReport ? "Update Requisition" : "Transmit Order"}
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ VOID WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Void this lab requisition?"
        message={
          deleteTarget
            ? `You are about to void requisition ${deleteTarget.accessionNumber} — ${deleteTarget.testName} for ${deleteTarget.patientName}. This will remove the report from the patient's record.`
            : ""
        }
        confirmText="Yes, Void Report"
        cancelText="Keep Report"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}