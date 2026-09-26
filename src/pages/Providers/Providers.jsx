import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  UserX,
  Phone,
  Mail,
  Building,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Inbox,
  AlertCircle,
  Loader2,
  Eye,
  Users,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ProviderForm from "@/components/modules/ProviderForm";
import { providersData, getStatusCounts } from "@/data/providers";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PROVIDERS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All        → Indigo  (#4f46e5) — brand
   - On Duty    → Emerald (#10b981) — active
   - On Call    → Amber   (#f59e0b) — standby
   - On Leave   → Rose    (#f43f5e) — unavailable
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All Providers",
    icon: Stethoscope,
    color: "#4f46e5",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
    glow: "rgba(79, 70, 229, 0.45)",
    softText: "text-indigo-600 dark:text-indigo-400",
    softBg: "bg-indigo-500/10",
    softBorder: "border-indigo-500/20",
    hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500/50",
    hoverBg: "hover:bg-indigo-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "On Duty",
    label: "On Duty",
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
    id: "On Call",
    label: "On Call",
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
    id: "On Leave",
    label: "On Leave",
    icon: UserX,
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
  "On Duty": { hex: "#10b981", label: "On Duty", pulse: true },
  "On Call": { hex: "#f59e0b", label: "On Call", pulse: false },
  "On Leave": { hex: "#f43f5e", label: "On Leave", pulse: false },
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
                    <AlertCircle size={24} className="text-white" strokeWidth={2.5} />
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
   Empty State
   ============================================================ */
function ProvidersEmpty({ onAdd, hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Inbox size={32} className="text-indigo-500" strokeWidth={1.5} />
        </div>
        {!prefersReduced && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-indigo-500/20"
          />
        )}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {hasFilters ? "No matching providers" : "No providers onboarded"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters
          ? "Try changing filter or search query"
          : "Onboard your first credentialed provider"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Onboard Provider
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: Providers
   ============================================================ */
export default function Providers({ providers: providersProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [providers, setProviders] = useState(providersProp || providersData);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(
    () => ({
      All: providers.length,
      "On Duty": providers.filter((p) => p.status === "On Duty").length,
      "On Call": providers.filter((p) => p.status === "On Call").length,
      "On Leave": providers.filter((p) => p.status === "On Leave").length,
    }),
    [providers]
  );

  /* ---- Stats summary ---- */
  const stats = useMemo(() => {
    const totalPatients = providers.reduce(
      (sum, p) => sum + (p.activePatients || 0),
      0
    );
    const avgPatients =
      providers.length > 0 ? Math.round(totalPatients / providers.length) : 0;
    return { totalPatients, avgPatients };
  }, [providers]);

  /* ---- Filtered + sorted ---- */
  const filteredProviders = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = providers.filter((prov) => {
      const matchesFilter = activeFilter === "All" || prov.status === activeFilter;
      const matchesSearch =
        !q ||
        prov.name.toLowerCase().includes(q) ||
        prov.npi.toLowerCase().includes(q) ||
        prov.specialty.toLowerCase().includes(q) ||
        prov.department.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [providers, activeFilter, searchQuery, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleOpenModal = (prov = null) => {
    setEditingProvider(prov);
    setIsModalOpen(true);
  };

  const handleSaveProvider = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      if (editingProvider) {
        setProviders((prev) =>
          prev.map((p) => (p.id === editingProvider.id ? { ...p, ...data } : p))
        );
        showToast("Provider credentials updated");
      } else {
        setProviders((prev) => [data, ...prev]);
        showToast("Provider onboarded");
      }
      setIsModalOpen(false);
      setEditingProvider(null);
    } catch {
      showToast("Failed to save provider", "error");
    }
  };

  const handleDeleteClick = (prov) => setDeleteTarget(prov);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProviders((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${deleteTarget.name} offboarded`);
    } catch {
      showToast("Failed to offboard", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewProvider = (prov) => {
    navigate(`/providers/${prov.id}`);
  };

  const handleExportCSV = () => {
    const headers =
      "NPI,Provider Name,Role,Specialty,Department,Status,Room,Phone,Email,Active Patients\n";
    const rows = filteredProviders
      .map(
        (p) =>
          `"${p.npi}","${p.name}","${p.role}","${p.specialty}","${p.department}","${p.status}","${p.room}","${p.phone}","${p.email}","${p.activePatients}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `providers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredProviders.length} providers exported`);
  };

  const handleAIRoster = async () => {
    showToast("Analyzing shift coverage...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Roster optimization complete");
  };

  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG["On Duty"];
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Stethoscope size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Medical Providers
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Credentialed physicians, attending surgeons & shifts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAIRoster}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-[#0d1629] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI roster optimization"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Roster</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export providers"
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
            label: "Total Providers",
            value: providers.length,
            icon: Stethoscope,
            color: "#4f46e5",
            bg: "bg-indigo-500/10 border-indigo-500/20",
            text: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "On Duty Now",
            value: counts["On Duty"],
            icon: CheckCircle2,
            color: "#10b981",
            bg: "bg-emerald-500/10 border-emerald-500/20",
            text: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Active Patients",
            value: stats.totalPatients,
            icon: Users,
            color: "#06b6d4",
            bg: "bg-cyan-500/10 border-cyan-500/20",
            text: "text-cyan-600 dark:text-cyan-400",
          },
          {
            label: "Avg Load / MD",
            value: stats.avgPatients,
            icon: Activity,
            color: "#f59e0b",
            bg: "bg-amber-500/10 border-amber-500/20",
            text: "text-amber-600 dark:text-amber-400",
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

      {/* 4 TABS */}
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
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} providers`}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Medical Staff Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-indigo-500 tabular-nums">
                {filteredProviders.length}
              </span>{" "}
              of {providers.length} providers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search physician, NPI, specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search providers"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
                boxShadow: "0 8px 24px rgba(79, 70, 229, 0.35)",
              }}
              aria-label="Onboard new provider"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Onboard Provider</span>
            </motion.button>
          </div>
        </div>

        {filteredProviders.length === 0 ? (
          <ProvidersEmpty
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
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      Provider & Title
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-3">NPI</th>
                  <th className="py-4 px-3">Department</th>
                  <th className="py-4 px-3">Clinic Office</th>
                  <th className="py-4 px-3">Contact</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredProviders.map((prov, idx) => {
                  const initials = prov.name
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <motion.tr
                      key={prov.id}
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
                              prov.avatarColor || "from-indigo-600 to-blue-600"
                            )}
                          >
                            {initials}
                          </motion.div>
                          <div className="min-w-0">
                            <button
                              onClick={() => handleViewProvider(prov)}
                              className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition-colors truncate block text-left"
                            >
                              {prov.name}
                            </button>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {prov.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-xs tabular-nums">
                          #{prov.npi}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-200 truncate">
                          {prov.specialty}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                          {prov.department}
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 truncate">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                          <span className="truncate">{prov.room}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Patients:{" "}
                          <span className="font-black text-indigo-500 tabular-nums">
                            {prov.activePatients} active
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={2.5} />
                          {prov.phone}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 truncate max-w-[170px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={2.5} />
                          <span className="truncate">{prov.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3">{renderStatusBadge(prov.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewProvider(prov)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                            title="View"
                            aria-label={`View ${prov.name}`}
                          >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(prov)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                            title="Edit"
                            aria-label={`Edit ${prov.name}`}
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(prov)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Offboard"
                            aria-label={`Offboard ${prov.name}`}
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

      {/* ADD/EDIT MODAL — using ProviderForm */}
      <AnimatePresence>
        {isModalOpen && (
          <ProviderForm
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingProvider(null);
            }}
            onSave={handleSaveProvider}
            editData={editingProvider}
          />
        )}
      </AnimatePresence>

      {/* ⚠️ OFFBOARD WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Offboard this provider?"
        message={
          deleteTarget
            ? `You are about to offboard ${deleteTarget.name} (${deleteTarget.role}). Their NPI #${deleteTarget.npi} and credentialing will be removed from the active roster. All ${deleteTarget.activePatients} active patient assignments will need reassignment.`
            : ""
        }
        confirmText="Yes, Offboard"
        cancelText="Keep Provider"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}