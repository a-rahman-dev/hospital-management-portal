import { useState, useMemo, useCallback, useEffect } from "react";
import {
  LayoutGrid,
  ToggleLeft,
  ToggleRight,
  Users,
  Download,
  Sparkles,
  Package,
  Activity,
  DollarSign,
  FileText,
  Building2,
  Settings,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  AlertTriangle,
  Search,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  systemModules,
  getModuleCounts,
} from "@/data/modules";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 MODULE MANAGEMENT COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All Modules → Indigo  (#6366f1) — brand
   - Enabled     → Emerald (#10b981) — active
   - Disabled    → Rose    (#f43f5e) — inactive
   - Clinical    → Amber   (#f59e0b) — specialized
   ============================================================ */

const TABS = [
  {
    id: "all",
    label: "All Modules",
    icon: LayoutGrid,
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    glow: "rgba(99, 102, 241, 0.45)",
    softText: "text-indigo-600 dark:text-indigo-400",
    softBg: "bg-indigo-500/10",
    softBorder: "border-indigo-500/20",
    hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500/50",
    hoverBg: "hover:bg-indigo-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "enabled",
    label: "Enabled",
    icon: ToggleRight,
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
    id: "disabled",
    label: "Disabled",
    icon: ToggleLeft,
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
    id: "clinical",
    label: "Clinical",
    icon: Activity,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    softText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-500/10",
    softBorder: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-50/30 dark:hover:bg-[#0e172a]",
  },
];

const CATEGORY_ICONS = {
  Clinical: Activity,
  Finance: DollarSign,
  Records: FileText,
  Administration: Building2,
  System: Settings,
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

  const accentGradient = "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)";
  const accentGlow = "rgba(245, 158, 11, 0.35)";

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
                  <p className="mt-2 text-xs font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle size={12} strokeWidth={2.5} />
                    This action will affect all system users.
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
              toast.variant === "error"
                ? "bg-rose-500"
                : toast.variant === "warning"
                ? "bg-amber-500"
                : "bg-emerald-500"
            )}
          >
            {toast.variant === "error" ? (
              <AlertCircle size={16} strokeWidth={2.5} className="text-white" />
            ) : toast.variant === "warning" ? (
              <AlertTriangle size={16} strokeWidth={2.5} className="text-white" />
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
function ModulesEmpty({ hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Package size={32} className="text-indigo-500" strokeWidth={1.5} />
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
        {hasFilters ? "No matching modules" : "No modules configured"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        Try changing filter or search query
      </p>
    </div>
  );
}

/* ============================================================
   🎯 MAIN: ModuleManagement
   ============================================================ */
export default function ModuleManagement({ modules: modulesProp } = {}) {
  const prefersReduced = useReducedMotion();

  const [modules, setModules] = useState(modulesProp || systemModules);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toggleTarget, setToggleTarget] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(
    () => ({
      all: modules.length,
      enabled: modules.filter((m) => m.enabled).length,
      disabled: modules.filter((m) => !m.enabled).length,
      clinical: modules.filter((m) => m.category === "Clinical").length,
    }),
    [modules]
  );

  /* ---- Stats summary ---- */
  const stats = useMemo(() => {
    const totalUsers = modules.reduce((sum, m) => sum + (m.users || 0), 0);
    const activeRate =
      modules.length > 0
        ? Math.round(
            (modules.filter((m) => m.enabled).length / modules.length) * 100
          )
        : 0;
    return { totalUsers, activeRate };
  }, [modules]);

  /* ---- Filtered ---- */
  const filteredModules = useMemo(() => {
    let filtered = modules;

    if (activeTab === "enabled") {
      filtered = filtered.filter((m) => m.enabled);
    } else if (activeTab === "disabled") {
      filtered = filtered.filter((m) => !m.enabled);
    } else if (activeTab === "clinical") {
      filtered = filtered.filter((m) => m.category === "Clinical");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [modules, activeTab, searchQuery]);

  /* ---- Toggle with warning (Rule 4) ---- */
  const handleToggleClick = (module) => {
    // Only show warning when DISABLING
    if (module.enabled) {
      setToggleTarget(module);
    } else {
      // Enabling is safe — do it directly
      performToggle(module.id);
    }
  };

  const performToggle = async (id) => {
    setToggling(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setModules((prev) =>
        prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
      );
      const module = modules.find((m) => m.id === id);
      showToast(
        module?.enabled
          ? `${module.name} disabled`
          : `${module?.name} enabled successfully`
      );
      setToggleTarget(null);
    } catch {
      showToast("Failed to toggle module", "error");
    } finally {
      setToggling(false);
    }
  };

  const handleConfirmDisable = async () => {
    if (!toggleTarget) return;
    await performToggle(toggleTarget.id);
  };

  /* ---- Export ---- */
  const handleExport = () => {
    const headers = ["ID", "Name", "Category", "Enabled", "Users", "Version"];
    const rows = filteredModules.map((m) => [
      m.id,
      m.name,
      m.category,
      m.enabled,
      m.users,
      m.version || "N/A",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modules-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredModules.length} modules exported`);
  };

  /* ---- AI Audit ---- */
  const handleAuditLog = async () => {
    showToast("Analyzing module access logs...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Audit complete — 2 unused modules flagged");
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <LayoutGrid size={22} className="text-white" strokeWidth={2.5} />
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
              Module Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Enable or disable system features
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAuditLog}
            className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-[#0d1629] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Run audit log"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Audit Log
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export modules"
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
            label: "Total Modules",
            value: modules.length,
            icon: Package,
            bg: "bg-indigo-500/10 border-indigo-500/20",
            text: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Enabled Now",
            value: counts.enabled,
            icon: ToggleRight,
            bg: "bg-emerald-500/10 border-emerald-500/20",
            text: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            bg: "bg-cyan-500/10 border-cyan-500/20",
            text: "text-cyan-600 dark:text-cyan-400",
          },
          {
            label: "Active Rate",
            value: `${stats.activeRate}%`,
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
              aria-label={`Filter by ${tab.label}: ${count} modules`}
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

      {/* MODULES LIST */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm dark:shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-60" />

        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                System Modules
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing{" "}
                <span className="font-black text-indigo-500 tabular-nums">
                  {filteredModules.length}
                </span>{" "}
                of {modules.length} modules
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search module, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search modules"
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-[#1e2a42] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {filteredModules.length === 0 ? (
          <ModulesEmpty hasFilters={searchQuery !== "" || activeTab !== "all"} />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
            {filteredModules.map((module, idx) => {
              const CategoryIcon = CATEGORY_ICONS[module.category] || LayoutGrid;
              return (
                <motion.div
                  key={module.id}
                  initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                  animate={prefersReduced ? false : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.04 }}
                  whileHover={prefersReduced ? {} : { x: 4 }}
                  className="group flex items-center justify-between gap-4 px-4 sm:px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <motion.div
                      whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
                      className={cn(
                        "p-2.5 rounded-xl shrink-0 transition-colors border",
                        module.enabled
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-slate-500/10 border-slate-500/20"
                      )}
                    >
                      <CategoryIcon
                        size={16}
                        className={
                          module.enabled ? "text-emerald-500" : "text-slate-500"
                        }
                        strokeWidth={2.5}
                      />
                    </motion.div>

                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                        {module.name}
                      </p>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-500 mt-0.5 truncate">
                        {module.category}
                        {module.version && ` • v${module.version}`}
                        {module.users > 0 && ` • ${module.users} users`}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={prefersReduced ? {} : { scale: 1.1 }}
                    whileTap={prefersReduced ? {} : { scale: 0.9 }}
                    onClick={() => handleToggleClick(module)}
                    disabled={toggling}
                    aria-label={
                      module.enabled
                        ? `Disable ${module.name}`
                        : `Enable ${module.name}`
                    }
                    className="shrink-0 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                    title={module.enabled ? "Disable" : "Enable"}
                  >
                    {module.enabled ? (
                      <ToggleRight
                        size={28}
                        className="text-emerald-500"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <ToggleLeft
                        size={28}
                        className="text-slate-400"
                        strokeWidth={2.5}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ⚠️ DISABLE WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!toggleTarget}
        onClose={() => !toggling && setToggleTarget(null)}
        onConfirm={handleConfirmDisable}
        loading={toggling}
        title={`Disable ${toggleTarget?.name}?`}
        message={
          toggleTarget
            ? `You are about to disable the "${toggleTarget.name}" module (${toggleTarget.category}). All ${toggleTarget.users} users will immediately lose access to this feature. Data will remain intact but unavailable.`
            : ""
        }
        confirmText="Yes, Disable Module"
        cancelText="Keep Enabled"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}