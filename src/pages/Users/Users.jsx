import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles,
  Mail,
  Phone,
  Briefcase,
  Shield,
  UserCog,
  Plus,
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
  X,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import DataTable from "@/components/ui/DataTable/DataTable";
import Badge from "@/components/ui/Badge/Badge";
import Avatar from "@/components/ui/Avatar/Avatar";
import UserForm from "@/components/modules/UserForm";
import {
  initialUsers,
  ROLES,
  CLINICAL_ROLES,
  getStatusCounts,
} from "@/data/users";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 USERS SECTION COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - All Users      → Indigo  (#4f46e5) — brand
   - Active         → Emerald (#10b981) — enabled
   - Inactive       → Rose    (#f43f5e) — disabled
   - Clinical Staff → Amber   (#f59e0b) — specialized
   ============================================================ */

const TABS = [
  {
    id: "all",
    label: "All Users",
    icon: UsersIcon,
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
    id: "clinical",
    label: "Clinical Staff",
    icon: UserCog,
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

const STATUS_VARIANT = {
  Active: "success",
  Inactive: "default",
};

const ROLE_VARIANT = {
  "Super Admin": "danger",
  Doctor: "primary",
  Nurse: "info",
  Caregiver: "purple",
  Receptionist: "default",
  "Billing Manager": "warning",
  Pharmacist: "success",
  "Lab Technician": "info",
  Radiologist: "primary",
  "IT Support": "purple",
  "HR Manager": "warning",
  Security: "danger",
  Dietitian: "success",
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
   Inline Modal (for form)
   ============================================================ */
function FormModal({ open, onClose, title, subtitle, children }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 15 }}
            animate={prefersReduced ? false : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 my-8 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500" />

            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                  <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-gray-100 dark:bg-[#141e33] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1f2c4a] transition-all shrink-0"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   🎯 MAIN: Users
   ============================================================ */
export default function Users({ users: usersProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [users, setUsers] = useState(usersProp || initialUsers);
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
      all: users.length,
      Active: users.filter((u) => u.status === "Active").length,
      Inactive: users.filter((u) => u.status === "Inactive").length,
      clinical: users.filter((u) => CLINICAL_ROLES.includes(u.role)).length,
    }),
    [users]
  );

  /* ---- Filtered ---- */
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (activeTab === "clinical") {
      filtered = filtered.filter((u) => CLINICAL_ROLES.includes(u.role));
    } else if (activeTab !== "all") {
      filtered = filtered.filter((u) => u.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [users, activeTab, searchQuery]);

  /* ---- Modal ---- */
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      if (editing) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editing.id ? { ...u, ...data } : u))
        );
        showToast("User updated successfully");
      } else {
        const newId = Math.max(...users.map((u) => u.id), 0) + 1;
        setUsers((prev) => [
          {
            id: newId,
            ...data,
            lastLogin: new Date().toISOString().split("T")[0],
            avatarColor: "from-indigo-600 to-blue-600",
          },
          ...prev,
        ]);
        showToast("User added successfully");
      }
      setModalOpen(false);
      setEditing(null);
    } catch {
      showToast("Failed to save user", "error");
    }
  };

  /* ---- Delete via warning modal (Rule 4) ---- */
  const handleDeleteClick = (user) => setDeleteTarget(user);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${deleteTarget.name} removed`);
    } catch {
      showToast("Failed to remove user", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  /* ---- Export ---- */
  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "Department",
      "Phone",
      "Status",
      "Last Login",
    ];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.department,
      u.phone,
      u.status,
      u.lastLogin,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredUsers.length} users exported`);
  };

  /* ---- AI Access Audit ---- */
  const handleAccessAudit = async () => {
    showToast("Running access audit...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Audit complete — 2 inactive accounts flagged");
  };

  /* ---- Table columns ---- */
  const columns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <button
              onClick={() => handleViewUser(row)}
              className="font-bold text-sm text-slate-900 dark:text-white truncate block text-left hover:text-indigo-500 transition-colors"
            >
              {row.name}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
              <Mail size={10} className="text-indigo-500 shrink-0" strokeWidth={2.5} />
              <span className="truncate max-w-[160px]">{row.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <Badge variant={ROLE_VARIANT[row.role] || "default"} size="sm">
          {row.role}
        </Badge>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Briefcase size={11} className="text-indigo-500 shrink-0" strokeWidth={2.5} />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
            {row.department}
          </span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <Phone size={11} className="text-indigo-500 shrink-0" strokeWidth={2.5} />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {row.lastLogin}
        </span>
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
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
              User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              System users, roles & permissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAccessAudit}
            className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-[#0d1629] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Run access audit"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Access Audit
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export users"
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
              aria-label={`Filter by ${tab.label}: ${count} users`}
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
        title="All Users"
        subtitle={`${filteredUsers.length} ${
          activeTab === "all" ? "total" : activeTab.toLowerCase()
        } user${filteredUsers.length !== 1 ? "s" : ""}`}
        columns={columns}
        data={filteredUsers}
        searchable
        searchPlaceholder="Search user, email, role..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDeleteClick}
        addLabel="Add User"
        emptyMessage="No users found in this category"
        pageSize={10}
      />

      {/* ADD/EDIT MODAL */}
      <FormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit User" : "Add New User"}
        subtitle={
          editing
            ? "Update user details and permissions"
            : "Fill in the user details below"
        }
      >
        <UserForm
          user={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </FormModal>

      {/* ⚠️ DELETE WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Remove this user?"
        message={
          deleteTarget
            ? `You are about to permanently remove ${deleteTarget.name} (${deleteTarget.role} — ${deleteTarget.department}). Their access to the system, permissions, and audit history will be revoked immediately.`
            : ""
        }
        confirmText="Yes, Remove User"
        cancelText="Keep User"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}