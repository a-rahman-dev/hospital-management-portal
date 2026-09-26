import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Sparkles,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bed,
  Layers,
  Phone,
  UserCheck,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Inbox,
  AlertCircle,
  Loader2,
  Eye,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "@/components/ui/Input/Input";
import { facilitiesData, getStatusCounts } from "@/data/facilities";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 FACILITIES SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All             → Cyan    (#06b6d4) — brand
   - Operational     → Emerald (#10b981) — success
   - Near Capacity   → Amber   (#f59e0b) — warning
   - Maintenance     → Rose    (#f43f5e) — danger
   ============================================================ */

const TABS = [
  {
    id: "All",
    label: "All Facilities",
    icon: Building,
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.45)",
    softText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-500/10",
    softBorder: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-50/30 dark:hover:bg-[#0e172a]",
  },
  {
    id: "Operational",
    label: "Operational",
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
    id: "Near Capacity",
    label: "Near Capacity",
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
    id: "Maintenance",
    label: "Maintenance",
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
  Operational: { hex: "#10b981", label: "Operational", pulse: false },
  "Near Capacity": { hex: "#f59e0b", label: "Near Capacity", pulse: true },
  Maintenance: { hex: "#f43f5e", label: "Maintenance", pulse: false },
};

const FACILITY_TYPES = [
  "Critical Care (ICU)",
  "Inpatient Maternity",
  "Surgical / Procedural",
  "Specialized Step-Down",
  "Infectious Disease Ward",
  "Outpatient Infusion",
  "General Medical Ward",
  "Pediatric Care",
  "Outpatient Oncology",
  "Rehabilitation Unit",
  "Sub-Acute Respiratory",
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/30 focus:border-cyan-500 transition-all";

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
function FacilitiesEmpty({ onAdd, hasFilters }) {
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
        {hasFilters ? "No matching facilities" : "No facility wings registered"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {hasFilters
          ? "Try changing filter or search query"
          : "Register your first ward to get started"}
      </p>
      {!hasFilters && onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Facility
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: Facilities
   ============================================================ */
export default function Facilities({ facilities: facilitiesProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [facilities, setFacilities] = useState(facilitiesProp || facilitiesData);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    facilityCode: "",
    name: "",
    buildingWing: "Tower A - 2nd Floor",
    type: "General Medical Ward",
    totalBeds: 20,
    occupiedBeds: 0,
    nurseInCharge: "Nurse Emily Blunt, RN",
    contactExt: "Ext. 2000",
    status: "Operational",
  });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Counts ---- */
  const counts = useMemo(
    () => ({
      All: facilities.length,
      Operational: facilities.filter((f) => f.status === "Operational").length,
      "Near Capacity": facilities.filter((f) => f.status === "Near Capacity").length,
      Maintenance: facilities.filter((f) => f.status === "Maintenance").length,
    }),
    [facilities]
  );

  /* ---- Capacity summary (unique feature) ---- */
  const capacitySummary = useMemo(() => {
    const total = facilities.reduce((sum, f) => sum + (f.totalBeds || 0), 0);
    const occupied = facilities.reduce((sum, f) => sum + (f.occupiedBeds || 0), 0);
    const available = total - occupied;
    const pct = total === 0 ? 0 : Math.round((occupied / total) * 100);
    return { total, occupied, available, pct };
  }, [facilities]);

  /* ---- Filtered + sorted ---- */
  const filteredFacilities = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = facilities.filter((fac) => {
      const matchesFilter = activeFilter === "All" || fac.status === activeFilter;
      const matchesSearch =
        !q ||
        fac.name.toLowerCase().includes(q) ||
        fac.facilityCode.toLowerCase().includes(q) ||
        fac.buildingWing.toLowerCase().includes(q) ||
        fac.type.toLowerCase().includes(q) ||
        fac.nurseInCharge.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [facilities, activeFilter, searchQuery, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleOpenModal = (fac = null) => {
    if (fac) {
      setEditingFacility(fac);
      setFormData(fac);
    } else {
      setEditingFacility(null);
      setFormData({
        facilityCode: `FAC-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        buildingWing: "Tower B - 2nd Floor",
        type: "General Medical Ward",
        totalBeds: 24,
        occupiedBeds: 8,
        nurseInCharge: "Nurse Sarah Jenkins, RN",
        contactExt: `Ext. ${Math.floor(2000 + Math.random() * 8000)}`,
        status: "Operational",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveFacility = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editingFacility) {
        setFacilities((prev) =>
          prev.map((f) => (f.id === editingFacility.id ? { ...formData } : f))
        );
        showToast("Facility updated");
      } else {
        const newEntry = {
          ...formData,
          id: `FAC-${Date.now().toString().slice(-4)}`,
          avatarColor: "from-cyan-500 to-blue-600",
        };
        setFacilities((prev) => [newEntry, ...prev]);
        showToast("Facility wing commissioned");
      }
      setIsModalOpen(false);
    } catch {
      showToast("Failed to save facility", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (fac) => setDeleteTarget(fac);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setFacilities((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${deleteTarget.name} decommissioned`);
    } catch {
      showToast("Failed to decommission", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewFacility = (fac) => {
    navigate(`/facilities/${fac.id}`);
  };

  const handleExportCSV = () => {
    const headers =
      "Code,Facility Name,Wing & Floor,Type,Total Beds,Occupied Beds,Occupancy %,Nurse In Charge,Status\n";
    const rows = filteredFacilities
      .map((f) => {
        const pct = f.totalBeds > 0 ? Math.round((f.occupiedBeds / f.totalBeds) * 100) : 0;
        return `"${f.facilityCode}","${f.name}","${f.buildingWing}","${f.type}","${f.totalBeds}","${f.occupiedBeds}","${pct}%","${f.nurseInCharge}","${f.status}"`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facilities_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredFacilities.length} facilities exported`);
  };

  const handleAICapacity = async () => {
    showToast("Analyzing surge capacity...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Capacity analysis complete — 2 wings flagged");
  };

  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Operational;
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <Building size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Hospital Facilities & Capacity
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Campus wings, inpatient wards & live bed occupancy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAICapacity}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-[#0d1629] text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100/50 dark:hover:bg-cyan-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="AI capacity optimization"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Capacity</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export facilities"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* CAPACITY SUMMARY (unique feature) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <Bed className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white">
              {capacitySummary.total}
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Total Beds
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white">
              {capacitySummary.occupied}
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Occupied
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white">
              {capacitySummary.available}
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Available
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative h-[68px] px-4 rounded-2xl border bg-white dark:bg-[#0b1220] border-gray-200 dark:border-[#182338] shadow-sm flex items-center gap-3.5"
        >
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              capacitySummary.pct >= 85
                ? "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
                : capacitySummary.pct >= 70
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            )}
          >
            <Building className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white">
              {capacitySummary.pct}%
            </div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              Occupancy
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
              aria-label={`Filter by ${tab.label}: ${counts[tab.id]} facilities`}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 opacity-60" />

        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#182338]">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Wards & Clinical Units Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing{" "}
              <span className="font-black text-cyan-500 tabular-nums">
                {filteredFacilities.length}
              </span>{" "}
              of {facilities.length} units
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search facility, code, wing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search facilities"
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
              aria-label="Add new facility"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-4 h-4 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Add Facility</span>
            </motion.button>
          </div>
        </div>

        {filteredFacilities.length === 0 ? (
          <FacilitiesEmpty
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
                      Facility & Code
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-3">Location</th>
                  <th className="py-4 px-3">Bed Occupancy</th>
                  <th className="py-4 px-3">Nurse In-Charge</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#151f33] text-xs">
                {filteredFacilities.map((fac, idx) => {
                  const occupancyPct =
                    fac.totalBeds > 0
                      ? Math.round((fac.occupiedBeds / fac.totalBeds) * 100)
                      : 0;
                  return (
                    <motion.tr
                      key={fac.id}
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
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md shrink-0",
                              fac.avatarColor || "from-cyan-600 to-blue-600"
                            )}
                          >
                            <Building className="w-4 h-4" strokeWidth={2.5} />
                          </motion.div>
                          <div className="min-w-0">
                            <button
                              onClick={() => handleViewFacility(fac)}
                              className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 transition-colors truncate max-w-[260px] block text-left"
                            >
                              {fac.name}
                            </button>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                              #{fac.facilityCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-200 truncate">
                          {fac.buildingWing}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                          {fac.type}
                        </div>
                      </td>

                      <td className="py-4 px-3 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-black text-slate-900 dark:text-slate-200 tabular-nums">
                            {fac.occupiedBeds} / {fac.totalBeds}
                          </span>
                          <span
                            className={cn(
                              "font-black font-mono tabular-nums",
                              occupancyPct >= 85
                                ? "text-amber-500"
                                : occupancyPct === 0
                                ? "text-slate-400"
                                : "text-emerald-500"
                            )}
                          >
                            {occupancyPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={prefersReduced ? false : { width: 0 }}
                            animate={prefersReduced ? false : { width: `${occupancyPct}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}
                            className={cn(
                              "h-full rounded-full",
                              occupancyPct >= 85
                                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                : occupancyPct === 0
                                ? "bg-slate-400"
                                : "bg-gradient-to-r from-emerald-500 to-teal-500"
                            )}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[180px]">
                          <UserCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" strokeWidth={2.5} />
                          <span className="truncate">{fac.nurseInCharge}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {fac.contactExt}
                        </div>
                      </td>

                      <td className="py-4 px-3">{renderStatusBadge(fac.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewFacility(fac)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                            title="View"
                            aria-label={`View ${fac.name}`}
                          >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(fac)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                            title="Edit"
                            aria-label={`Edit ${fac.name}`}
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(fac)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                            title="Decommission"
                            aria-label={`Decommission ${fac.name}`}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
                    <Building className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                      {editingFacility
                        ? "Update Facility Parameters"
                        : "Register New Facility Wing"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Configure floor level, bed capacity & nursing
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

              <form onSubmit={handleSaveFacility} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Facility / Ward Name"
                    required
                    placeholder="e.g. Pediatric Intensive Care"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    icon={<Building size={16} />}
                  />
                  <Input
                    label="Facility Unit Code"
                    required
                    value={formData.facilityCode}
                    onChange={(e) =>
                      setFormData({ ...formData, facilityCode: e.target.value })
                    }
                  />
                  <Input
                    label="Campus Building & Floor"
                    required
                    placeholder="e.g. Tower B - 3rd Floor"
                    value={formData.buildingWing}
                    onChange={(e) =>
                      setFormData({ ...formData, buildingWing: e.target.value })
                    }
                    icon={<Layers size={16} />}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Care Classification
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className={selectClass}
                    >
                      {FACILITY_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Total Licensed Beds"
                    type="number"
                    min="0"
                    required
                    value={formData.totalBeds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalBeds: Math.max(0, Number(e.target.value)),
                      })
                    }
                    icon={<Bed size={16} />}
                  />
                  <Input
                    label="Currently Occupied Beds"
                    type="number"
                    min="0"
                    max={formData.totalBeds}
                    required
                    value={formData.occupiedBeds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        occupiedBeds: Math.max(
                          0,
                          Math.min(formData.totalBeds, Number(e.target.value))
                        ),
                      })
                    }
                    icon={<Bed size={16} />}
                  />
                  <Input
                    label="Supervising Nurse"
                    required
                    value={formData.nurseInCharge}
                    onChange={(e) =>
                      setFormData({ ...formData, nurseInCharge: e.target.value })
                    }
                    icon={<UserCheck size={16} />}
                  />
                  <Input
                    label="Internal Extension"
                    required
                    value={formData.contactExt}
                    onChange={(e) =>
                      setFormData({ ...formData, contactExt: e.target.value })
                    }
                    icon={<Phone size={16} />}
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Operational Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Operational</option>
                      <option>Near Capacity</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>
                        {editingFacility ? "Update Facility" : "Commission Wing"}
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ DECOMMISSION WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Decommission this facility wing?"
        message={
          deleteTarget
            ? `You are about to decommission ${deleteTarget.name} (#${deleteTarget.facilityCode}) in ${deleteTarget.buildingWing}. All ${deleteTarget.totalBeds} beds and current occupancy data will be removed from the active registry.`
            : ""
        }
        confirmText="Yes, Decommission"
        cancelText="Keep Facility"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}