import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles,
  Hash,
  Mail,
  Phone,
  Percent,
  Building2,
  Award,
  AlertCircle,
  Loader2,
  X,
  AlertTriangle,
  Eye,
  Users,
  TrendingUp,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import DataTable from "@/components/ui/DataTable/DataTable";
import Badge from "@/components/ui/Badge/Badge";
import InsuranceForm from "@/components/modules/InsuranceForm";
import {
  initialInsurance,
  GOVERNMENT_PROGRAMS,
} from "@/data/insurance";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 INSURANCE SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All Insurances  → Amber   (#f59e0b) — brand
   - Active          → Emerald (#10b981) — enabled
   - Inactive        → Rose    (#f43f5e) — disabled
   - Govt Programs   → Violet  (#8b5cf6) — regulatory
   ============================================================ */

const TABS = [
  {
    id: "all",
    label: "All Insurances",
    icon: Shield,
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
    id: "Active",
    label: "Active",
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
    id: "Inactive",
    label: "Inactive",
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
  {
    id: "govt",
    label: "Govt Programs",
    icon: Award,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.45)",
    softText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-500/10",
    softBorder: "border-violet-500/20",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-500/50",
    hoverBg: "hover:bg-violet-50/30 dark:hover:bg-[#0e172a]",
  },
];

const STATUS_VARIANT = {
  Active: "success",
  Inactive: "default",
};

const PROGRAM_VARIANT = {
  Commercial: "primary",
  Medicare: "info",
  Medicaid: "success",
  "Medicaid MCO": "purple",
  "Medicare Advantage": "warning",
  Marketplace: "info",
  Military: "danger",
  "Behavioral Health": "purple",
};

const PLAN_VARIANT = {
  PPO: "primary",
  HMO: "info",
  MCO: "purple",
  MA: "warning",
  ACA: "success",
  Federal: "danger",
  State: "info",
  Specialty: "purple",
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
   🎯 MAIN: Insurance
   ============================================================ */
export default function Insurance({ insurances: insurancesProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [insurances, setInsurances] = useState(
    insurancesProp || initialInsurance
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(
    () => ({
      all: insurances.length,
      Active: insurances.filter((i) => i.status === "Active").length,
      Inactive: insurances.filter((i) => i.status === "Inactive").length,
      govt: insurances.filter((i) => GOVERNMENT_PROGRAMS.includes(i.program))
        .length,
    }),
    [insurances]
  );

  /* ---- Stats summary ---- */
  const stats = useMemo(() => {
    const totalMembers = insurances.reduce(
      (sum, i) => sum + (i.activeMembers || 0),
      0
    );
    const avgCoverage =
      insurances.length > 0
        ? Math.round(
            insurances.reduce(
              (sum, i) => sum + (i.coveragePercent || 0),
              0
            ) / insurances.length
          )
        : 0;
    return { totalMembers, avgCoverage };
  }, [insurances]);

  /* ---- Filtered ---- */
  const filteredInsurances = useMemo(() => {
    let filtered = insurances;

    if (activeTab === "govt") {
      filtered = filtered.filter((i) =>
        GOVERNMENT_PROGRAMS.includes(i.program)
      );
    } else if (activeTab !== "all") {
      filtered = filtered.filter((i) => i.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.company.toLowerCase().includes(q) ||
          i.payerId.toLowerCase().includes(q) ||
          i.program.toLowerCase().includes(q) ||
          i.planType.toLowerCase().includes(q) ||
          i.clearinghouse.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [insurances, activeTab, searchQuery]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (insurance) => {
    setEditing(insurance);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      if (editing) {
        setInsurances((prev) =>
          prev.map((i) => (i.id === editing.id ? { ...i, ...data } : i))
        );
        showToast("Insurance updated successfully");
      } else {
        const newId = Math.max(...insurances.map((i) => i.id), 0) + 1;
        setInsurances((prev) => [
          {
            id: newId,
            ...data,
            activeMembers: 0,
            avatarColor: "from-amber-600 to-orange-600",
          },
          ...prev,
        ]);
        showToast("Insurance added successfully");
      }
      setModalOpen(false);
      setEditing(null);
    } catch {
      showToast("Failed to save insurance", "error");
    }
  };

  /* ---- Delete via warning modal (Rule 4) ---- */
  const handleDeleteClick = (insurance) => setDeleteTarget(insurance);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setInsurances((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${deleteTarget.company} removed`);
    } catch {
      showToast("Failed to remove insurance", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ---- View ---- */
  const handleViewInsurance = (insurance) => {
    navigate(`/insurance/${insurance.id}`);
  };

  /* ---- Export ---- */
  const handleExport = () => {
    const headers = [
      "ID",
      "Company",
      "Payer ID",
      "Program",
      "Plan",
      "Phone",
      "Email",
      "Clearinghouse",
      "EDI ID",
      "Coverage",
      "Status",
    ];
    const rows = filteredInsurances.map((i) => [
      i.id,
      i.company,
      i.payerId,
      i.program,
      i.planType,
      i.phone,
      i.email,
      i.clearinghouse,
      i.ediId,
      i.coverage,
      i.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insurance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredInsurances.length} insurances exported`);
  };

  /* ---- Eligibility Check ---- */
  const handleEligibilityCheck = async () => {
    showToast("Running eligibility check...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Eligibility check complete — 18 payers verified");
  };

  const columns = [
    {
      key: "company",
      label: "Insurance Company",
      render: (row) => (
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "p-2 rounded-lg bg-gradient-to-br text-white mt-0.5",
              row.avatarColor || "from-amber-500 to-orange-600"
            )}
          >
            <Building2 size={13} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <button
              onClick={() => handleViewInsurance(row)}
              className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[220px] block text-left hover:text-amber-500 transition-colors"
            >
              {row.company}
            </button>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 truncate">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "payerId",
      label: "Payer ID",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Hash size={11} className="text-amber-500 shrink-0" strokeWidth={2.5} />
          <span className="font-bold text-xs text-slate-900 dark:text-white tabular-nums">
            {row.payerId}
          </span>
        </div>
      ),
    },
    {
      key: "program",
      label: "Program",
      render: (row) => (
        <Badge variant={PROGRAM_VARIANT[row.program] || "default"} size="sm">
          {row.program}
        </Badge>
      ),
    },
    {
      key: "planType",
      label: "Plan",
      render: (row) => (
        <Badge variant={PLAN_VARIANT[row.planType] || "default"} size="sm">
          {row.planType}
        </Badge>
      ),
    },
    {
      key: "coverage",
      label: "Coverage",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Percent size={11} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {row.coverage}
          </span>
        </div>
      ),
    },
    {
      key: "clearinghouse",
      label: "Clearinghouse",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs">
          <Shield size={11} className="text-amber-500 shrink-0" strokeWidth={2.5} />
          <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
            {row.clearinghouse}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "default"} size="sm" dot>
          {row.status}
        </Badge>
      ),
    },
  ];

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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Shield size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={
                prefersReduced
                  ? {}
                  : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Insurance Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Insurance companies, payer IDs & clearinghouse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEligibilityCheck}
            className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-[#0d1629] text-amber-600 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Run eligibility check"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Eligibility Check
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export insurance"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* STATS SUMMARY (unique feature) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {[
          {
            label: "Total Payers",
            value: insurances.length,
            icon: Shield,
            bg: "bg-amber-500/10 border-amber-500/20",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Active Now",
            value: counts.Active,
            icon: CheckCircle2,
            bg: "bg-emerald-500/10 border-emerald-500/20",
            text: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Active Members",
            value: stats.totalMembers.toLocaleString(),
            icon: Users,
            bg: "bg-cyan-500/10 border-cyan-500/20",
            text: "text-cyan-600 dark:text-cyan-400",
          },
          {
            label: "Avg Coverage",
            value: `${stats.avgCoverage}%`,
            icon: TrendingUp,
            bg: "bg-violet-500/10 border-violet-500/20",
            text: "text-violet-600 dark:text-violet-400",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  stat.bg,
                  stat.text
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="leading-tight min-w-0">
                <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4 TABS — Rule 5 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={prefersReduced ? {} : { y: -4, scale: 1.03 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              aria-pressed={isActive}
              aria-label={`Filter by ${tab.label}: ${count} insurances`}
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
                  {count}
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

      {/* DATA TABLE */}
      <DataTable
        title="All Insurance Companies"
        subtitle={`${filteredInsurances.length} ${
          activeTab === "all" ? "total" : activeTab.toLowerCase()
        } insurance${filteredInsurances.length !== 1 ? "s" : ""}`}
        columns={columns}
        data={filteredInsurances}
        searchable
        searchPlaceholder="Search company, payer ID, program..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDeleteClick}
        addLabel="Add Insurance"
        emptyMessage="No insurance companies found in this category"
        pageSize={10}
      />

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 15 }}
              animate={prefersReduced ? false : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 my-8 overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                    <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editing ? "Edit Insurance" : "Add New Insurance"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {editing
                        ? "Update insurance details"
                        : "Fill in the insurance details below"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                  aria-label="Close modal"
                  className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-gray-100 dark:bg-[#141e33] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1f2c4a] transition-all shrink-0"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="mt-5">
                <InsuranceForm
                  insurance={editing}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ DELETE WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Remove this insurance payer?"
        message={
          deleteTarget
            ? `You are about to permanently remove ${deleteTarget.company} (Payer ID: ${deleteTarget.payerId}, ${deleteTarget.program} — ${deleteTarget.planType}). This will remove the payer from the billing system and all associated claims will need to be re-routed.`
            : ""
        }
        confirmText="Yes, Remove Insurance"
        cancelText="Keep Insurance"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}