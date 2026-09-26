import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Building,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  FileText,
  Inbox,
  AlertCircle,
  Loader2,
  Eye,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 BILLING SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Cohesive design with semantic progression:
   - All       → Violet  (#9333ea) — brand
   - Paid      → Emerald (#10b981) — success
   - Pending   → Amber   (#f59e0b) — warning
   - Overdue   → Rose    (#f43f5e) — danger
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All Invoices",
    icon: Receipt,
    color: "#9333ea",
    gradient: "linear-gradient(135deg, #9333ea 0%, #6366f1 100%)",
    glow: "rgba(147, 51, 234, 0.45)",
    softText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-500/10",
    softBorder: "border-violet-500/20",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-500/50",
    hoverBg: "hover:bg-violet-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Paid",
    label: "Settled",
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
  },
  {
    id: "Overdue",
    label: "Overdue",
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
  Paid: {
    hex: "#10b981",
    label: "Paid & Settled",
    pulse: false,
  },
  Pending: {
    hex: "#f59e0b",
    label: "Pending Payer",
    pulse: false,
  },
  Overdue: {
    hex: "#f43f5e",
    label: "Overdue",
    pulse: true,
  },
};

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/30 focus:border-violet-500 transition-all";

/* ==================== DEFAULT DATA (in case data/billing.js missing) ==================== */
const DEFAULT_BILLING = [
  { id: "INV-001", invoiceNumber: "INV-2026-001", patientName: "Jonathan Mitchell", patientId: "PAT-101", insuranceProvider: "Blue Cross Blue Shield", serviceDescription: "Cardiac Catheterization & Angioplasty", department: "Cardiology", billedDate: "2026-09-10", dueDate: "2026-10-10", totalAmount: "$12,500.00", insuranceCovered: "$10,000.00", patientCopay: "$2,500.00", paymentMethod: "Insurance Wire", status: "Paid", avatarColor: "from-emerald-500 to-teal-600" },
  { id: "INV-002", invoiceNumber: "INV-2026-002", patientName: "Emma Rodriguez", patientId: "PAT-102", insuranceProvider: "Aetna Health", serviceDescription: "Prenatal Ultrasound & Consultation", department: "OB/GYN", billedDate: "2026-09-12", dueDate: "2026-10-12", totalAmount: "$1,850.00", insuranceCovered: "$1,480.00", patientCopay: "$370.00", paymentMethod: "Credit Card", status: "Pending", avatarColor: "from-purple-500 to-pink-600" },
  { id: "INV-003", invoiceNumber: "INV-2026-003", patientName: "William Anderson", patientId: "PAT-103", insuranceProvider: "Medicare Part B", serviceDescription: "ICU Admission & Stroke Workup", department: "Neurology", billedDate: "2026-09-14", dueDate: "2026-09-14", totalAmount: "$28,400.00", insuranceCovered: "$22,720.00", patientCopay: "$5,680.00", paymentMethod: "Medicare Direct", status: "Overdue", avatarColor: "from-cyan-500 to-blue-600" },
  { id: "INV-004", invoiceNumber: "INV-2026-004", patientName: "Sophia Bennett", patientId: "PAT-104", insuranceProvider: "UnitedHealthcare", serviceDescription: "Endocrine Follow-up & Lab Panel", department: "Internal Medicine", billedDate: "2026-09-08", dueDate: "2026-10-08", totalAmount: "$680.00", insuranceCovered: "$544.00", patientCopay: "$136.00", paymentMethod: "Insurance Wire", status: "Paid", avatarColor: "from-orange-500 to-amber-600" },
  { id: "INV-005", invoiceNumber: "INV-2026-005", patientName: "Alexander Hayes", patientId: "PAT-105", insuranceProvider: "Cigna Commercial", serviceDescription: "ACL Reconstruction Surgery & PT", department: "Orthopedics", billedDate: "2026-09-13", dueDate: "2026-10-13", totalAmount: "$18,900.00", insuranceCovered: "$15,120.00", patientCopay: "$3,780.00", paymentMethod: "Insurance Wire", status: "Pending", avatarColor: "from-rose-500 to-red-600" },
  { id: "INV-006", invoiceNumber: "INV-2026-006", patientName: "Olivia Zhang", patientId: "PAT-106", insuranceProvider: "Humana Gold", serviceDescription: "Dermatology Patch Testing & Biopsy", department: "Dermatology", billedDate: "2026-09-11", dueDate: "2026-10-11", totalAmount: "$1,240.00", insuranceCovered: "$992.00", patientCopay: "$248.00", paymentMethod: "Credit Card", status: "Paid", avatarColor: "from-teal-500 to-emerald-600" },
  { id: "INV-007", invoiceNumber: "INV-2026-007", patientName: "David Miller", patientId: "PAT-107", insuranceProvider: "Medicare Part A & B", serviceDescription: "Pulmonology Consultation & Spirometry", department: "Pulmonology", billedDate: "2026-09-05", dueDate: "2026-09-05", totalAmount: "$920.00", insuranceCovered: "$828.00", patientCopay: "$92.00", paymentMethod: "Medicare Direct", status: "Overdue", avatarColor: "from-indigo-500 to-purple-600" },
  { id: "INV-008", invoiceNumber: "INV-2026-008", patientName: "Isabella Martinez", patientId: "PAT-108", insuranceProvider: "Blue Cross Blue Shield", serviceDescription: "Cardiac ICU Admission — Post-MI Care", department: "Cardiology", billedDate: "2026-09-15", dueDate: "2026-10-15", totalAmount: "$34,200.00", insuranceCovered: "$27,360.00", patientCopay: "$6,840.00", paymentMethod: "Insurance Wire", status: "Pending", avatarColor: "from-rose-500 to-pink-600" },
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
function BillingEmpty({ onAdd, hasFilters }) {
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
        {hasFilters ? "No matching invoices" : "No billing records yet"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters
          ? "Try changing filter or search query"
          : "Generate your first invoice to get started"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Generate Invoice
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: PatientBilling
   ============================================================ */
export default function PatientBilling({ invoices: invoicesProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [invoices, setInvoices] = useState(invoicesProp || DEFAULT_BILLING);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("billedDate");
  const [sortDir, setSortDir] = useState("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    patientName: "",
    patientId: "",
    insuranceProvider: "Blue Cross Blue Shield",
    serviceDescription: "",
    department: "Cardiology",
    billedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    totalAmount: "$1,500.00",
    insuranceCovered: "$1,200.00",
    patientCopay: "$300.00",
    paymentMethod: "Insurance Wire",
    status: "Pending",
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
      All: invoices.length,
      Paid: invoices.filter((i) => i.status === "Paid").length,
      Pending: invoices.filter((i) => i.status === "Pending").length,
      Overdue: invoices.filter((i) => i.status === "Overdue").length,
    }),
    [invoices]
  );

  /* ---- Revenue summary (unique feature) ---- */
  const revenueSummary = useMemo(() => {
    const parse = (s) => parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
    const total = invoices.reduce((sum, i) => sum + parse(i.totalAmount), 0);
    const collected = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + parse(i.totalAmount), 0);
    const outstanding = invoices
      .filter((i) => i.status !== "Paid")
      .reduce((sum, i) => sum + parse(i.totalAmount), 0);
    return { total, collected, outstanding };
  }, [invoices]);

  /* ---- Filtered + sorted ---- */
  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = invoices.filter((inv) => {
      const matchesFilter = activeFilter === "All" || inv.status === activeFilter;
      const matchesSearch =
        !q ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.insuranceProvider.toLowerCase().includes(q) ||
        inv.serviceDescription.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [invoices, activeFilter, searchQuery, sortKey, sortDir]);

  /* ---- Sort ---- */
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---- Open modal ---- */
  const handleOpenModal = (inv = null) => {
    if (inv) {
      setEditingInvoice(inv);
      setFormData(inv);
    } else {
      setEditingInvoice(null);
      setFormData({
        invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        patientName: "",
        patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        insuranceProvider: "Blue Cross Blue Shield",
        serviceDescription: "",
        department: "Cardiology",
        billedDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        totalAmount: "$1,500.00",
        insuranceCovered: "$1,200.00",
        patientCopay: "$300.00",
        paymentMethod: "Insurance Wire",
        status: "Pending",
      });
    }
    setIsModalOpen(true);
  };

  /* ---- Save ---- */
  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingInvoice) {
        setInvoices((prev) =>
          prev.map((i) => (i.id === editingInvoice.id ? { ...formData } : i))
        );
        showToast("Invoice updated");
      } else {
        const newEntry = {
          ...formData,
          id: `INV-${Date.now().toString().slice(-4)}`,
          avatarColor: "from-violet-600 to-indigo-600",
        };
        setInvoices((prev) => [newEntry, ...prev]);
        showToast("Invoice issued");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save invoice", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Delete via warning modal (Rule 4) ---- */
  const handleDeleteClick = (inv) => setDeleteTarget(inv);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setInvoices((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`Invoice ${deleteTarget.invoiceNumber} voided`);
    } catch {
      showToast("Failed to void invoice", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ---- View ---- */
  const handleViewInvoice = (inv) => {
    navigate(`/patients/billing/${inv.id}`);
  };

  /* ---- Export CSV ---- */
  const handleExportCSV = () => {
    const headers =
      "Invoice,Patient,Payer,Department,Total,Insurance Covered,Copay,Billed Date,Status\n";
    const rows = filteredInvoices
      .map(
        (i) =>
          `"${i.invoiceNumber}","${i.patientName}","${i.insuranceProvider}","${i.department}","${i.totalAmount}","${i.insuranceCovered}","${i.patientCopay}","${i.billedDate}","${i.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredInvoices.length} invoices exported`);
  };

  /* ---- AI Audit ---- */
  const handleAIAudit = async () => {
    showToast("Auditing revenue integrity...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Audit complete — 2 denial risks flagged");
  };

  /* ---- Status badge ---- */
  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <DollarSign size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Billing & Invoicing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Claims processing, patient copays & revenue cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAIAudit}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-violet-500/30 bg-violet-50/50 dark:bg-[#0d1629] text-violet-600 dark:text-violet-400 hover:bg-violet-100/50 dark:hover:bg-violet-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI revenue audit"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Audit</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export invoices"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* REVENUE SUMMARY (unique feature) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
            <Receipt className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white truncate">
              ${revenueSummary.total.toLocaleString()}
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Total Billed
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white truncate">
              ${revenueSummary.collected.toLocaleString()}
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Collected
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white truncate">
              ${revenueSummary.outstanding.toLocaleString()}
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Outstanding
            </div>
          </div>
        </motion.div>
      </div>

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
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} invoices`}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Claims & Billing Ledger
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-violet-500 tabular-nums">
                {filteredInvoices.length}
              </span>{" "}
              of {invoices.length} records
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search patient, invoice, payer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search invoices"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #9333ea 0%, #6366f1 100%)",
                boxShadow: "0 8px 24px rgba(147, 51, 234, 0.35)",
              }}
              aria-label="Generate new invoice"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Generate Invoice</span>
            </motion.button>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <BillingEmpty
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
                      Patient & Service
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4">Invoice #</th>
                  <th className="py-4 px-4">Insurance Payer</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Covered / Copay</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredInvoices.map((inv, idx) => {
                  const initials = inv.patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <motion.tr
                      key={inv.id}
                      initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                      animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + idx * 0.04 }}
                      whileHover={prefersReduced ? {} : { x: 4 }}
                      className="hover:bg-gray-50/80 dark:hover:bg-[#0f172a]/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-xs text-white shadow-md shrink-0 transition-transform group-hover:scale-110",
                              inv.avatarColor || "from-violet-600 to-indigo-600"
                            )}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => handleViewInvoice(inv)}
                              className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate block text-left"
                            >
                              {inv.patientName}
                            </button>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[210px]">
                              {inv.serviceDescription}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono font-black text-violet-600 dark:text-violet-400 text-xs tabular-nums">
                          {inv.invoiceNumber}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <ShieldCheck
                            className="w-3.5 h-3.5 text-blue-500 shrink-0"
                            strokeWidth={2.5}
                          />
                          <span className="truncate">{inv.insuranceProvider}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {inv.department}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 dark:text-white text-sm tabular-nums">
                          {inv.totalAmount}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-900 dark:text-slate-200 font-bold text-xs tabular-nums">
                          {inv.insuranceCovered}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Copay:{" "}
                          <span className="font-black text-violet-600 dark:text-violet-400 tabular-nums">
                            {inv.patientCopay}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">{renderStatusBadge(inv.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewInvoice(inv)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                            title="View Invoice"
                            aria-label={`View invoice ${inv.invoiceNumber}`}
                          >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(inv)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                            title="Edit"
                            aria-label={`Edit invoice ${inv.invoiceNumber}`}
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(inv)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Void"
                            aria-label={`Void invoice ${inv.invoiceNumber}`}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                    <CreditCard className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingInvoice
                        ? "Update Claim & Invoice"
                        : "Generate Patient Invoice"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Itemize clinical services & payer breakdown
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

              <form onSubmit={handleSaveInvoice} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Full Name"
                    required
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    icon={<FileText size={16} />}
                  />

                  <Input
                    label="Invoice Reference #"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceNumber: e.target.value })
                    }
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Insurance Payer
                    </label>
                    <select
                      value={formData.insuranceProvider}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          insuranceProvider: e.target.value,
                        })
                      }
                      className={selectClass}
                    >
                      <option>Blue Cross Blue Shield</option>
                      <option>Aetna Health</option>
                      <option>Medicare Part B</option>
                      <option>Medicare Part A & B</option>
                      <option>UnitedHealthcare</option>
                      <option>Cigna Commercial</option>
                      <option>Humana Gold</option>
                      <option>Kaiser Permanente</option>
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

                  <Input
                    label="Total Billed Amount"
                    required
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, totalAmount: e.target.value })
                    }
                    icon={<DollarSign size={16} />}
                  />

                  <Input
                    label="Insurance Covered"
                    value={formData.insuranceCovered}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insuranceCovered: e.target.value,
                      })
                    }
                    icon={<DollarSign size={16} />}
                  />

                  <Input
                    label="Patient Copay"
                    value={formData.patientCopay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientCopay: e.target.value,
                      })
                    }
                    icon={<DollarSign size={16} />}
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Settlement Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Overdue</option>
                    </select>
                  </div>

                  <Input
                    label="Clinical Service Itemization"
                    required
                    placeholder="e.g. Inpatient Catheterization Procedure"
                    value={formData.serviceDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceDescription: e.target.value,
                      })
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
                      background: "linear-gradient(135deg, #9333ea 0%, #6366f1 100%)",
                      boxShadow: "0 8px 24px rgba(147, 51, 234, 0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {editingInvoice ? "Update Claim" : "Issue Invoice"}
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
        title="Void this invoice?"
        message={
          deleteTarget
            ? `You are about to void invoice ${deleteTarget.invoiceNumber} for ${deleteTarget.patientName} (${deleteTarget.totalAmount}). This will remove the billing record permanently and cannot be recovered.`
            : ""
        }
        confirmText="Yes, Void Invoice"
        cancelText="Keep Invoice"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}