import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Users,
  Lock,
  Download,
  Sparkles,
  Shield,
  CheckCircle2,
  Star,
  Crown,
  Heart,
  Briefcase,
  UserCog,
  Pill,
  FlaskConical,
  ScanLine,
  ShieldCheck,
  Search,
  AlertCircle,
  Loader2,
  Eye,
  TrendingUp,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Badge from "@/components/ui/Badge/Badge";
import { systemRoles } from "@/data/modules";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 ROLES MANAGEMENT COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   Each role has its own color for visual distinction (by design)
   ============================================================ */

const ROLE_COLOR_VARIANT = {
  danger: "danger",
  primary: "primary",
  info: "info",
  purple: "purple",
  default: "default",
  warning: "warning",
  success: "success",
};

const ROLE_ICONS = {
  "Super Admin": Crown,
  Doctor: Star,
  Nurse: Heart,
  Caregiver: UserCog,
  Receptionist: Briefcase,
  "Billing Manager": Lock,
  Pharmacist: Pill,
  "Lab Technician": FlaskConical,
  Radiologist: ScanLine,
  "IT Support": ShieldCheck,
};

const ROLE_GRADIENTS = {
  danger: {
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.4)",
    hex: "#f43f5e",
  },
  primary: {
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glow: "rgba(59, 130, 246, 0.4)",
    hex: "#3b82f6",
  },
  info: {
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.4)",
    hex: "#06b6d4",
  },
  purple: {
    gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
    glow: "rgba(168, 85, 247, 0.4)",
    hex: "#a855f7",
  },
  default: {
    gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    glow: "rgba(100, 116, 139, 0.4)",
    hex: "#64748b",
  },
  warning: {
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.4)",
    hex: "#f59e0b",
  },
  success: {
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.4)",
    hex: "#10b981",
  },
};

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
function RolesEmpty({ hasFilters }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="py-16 text-center col-span-full">
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center">
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
        {hasFilters ? "No matching roles" : "No roles configured"}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        Try changing search query
      </p>
    </div>
  );
}

/* ============================================================
   🎯 MAIN: RolesManagement
   ============================================================ */
export default function RolesManagement({ roles: rolesProp } = {}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [roles] = useState(rolesProp || systemRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Stats (memoized) ---- */
  const statValues = useMemo(() => {
    const totalUsers = roles.reduce((s, r) => s + (r.users || 0), 0);
    const totalPermissions = roles.reduce(
      (s, r) => s + (r.permissions || 0),
      0
    );
    return {
      roles: roles.length,
      users: totalUsers,
      perms: totalPermissions,
      avg: roles.length > 0 ? Math.round(totalPermissions / roles.length) : 0,
    };
  }, [roles]);

  /* ---- Stat cards ---- */
  const STAT_CARDS = useMemo(
    () => [
      {
        key: "roles",
        label: "Total Roles",
        icon: Award,
        gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        glow: "rgba(99, 102, 241, 0.45)",
        color: "#6366f1",
      },
      {
        key: "users",
        label: "Total Users",
        icon: Users,
        gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
        glow: "rgba(16, 185, 129, 0.45)",
        color: "#10b981",
      },
      {
        key: "perms",
        label: "Total Permissions",
        icon: Lock,
        gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
        glow: "rgba(168, 85, 247, 0.45)",
        color: "#a855f7",
      },
      {
        key: "avg",
        label: "Avg Perms / Role",
        icon: Shield,
        gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
        glow: "rgba(245, 158, 11, 0.45)",
        color: "#f59e0b",
      },
    ],
    []
  );

  /* ---- Filtered roles ---- */
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  /* ---- Handlers ---- */
  const handleRoleClick = (role) => {
    navigate(`/module-management/roles/${role.id}`);
  };

  const handleRoleKeyDown = (e, role) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoleClick(role);
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Role", "Users", "Permissions", "Description"];
    const rows = filteredRoles.map((r) => [
      r.id,
      r.name,
      r.users,
      r.permissions,
      r.description,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roles-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filteredRoles.length} roles exported`);
  };

  const handleRoleAnalytics = async () => {
    showToast("Analyzing role distribution...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast(
      `Analysis complete — ${statValues.roles} roles, ${statValues.users} users`
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Award size={22} className="text-white" strokeWidth={2.5} />
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
              Roles Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              User roles, counts & permission levels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRoleAnalytics}
            className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-[#0d1629] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Run role analytics"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Role Analytics
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export roles"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {STAT_CARDS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={prefersReduced ? {} : { y: -4, scale: 1.03 }}
              className="group relative h-[68px] px-4 rounded-2xl border border-gray-200 dark:border-[#182338] bg-white dark:bg-[#0b1220] shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-3.5 select-none overflow-hidden cursor-default"
            >
              {!prefersReduced && (
                <motion.div
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl"
                  style={{ background: stat.color }}
                  aria-hidden="true"
                />
              )}
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110"
                style={{
                  background: stat.gradient,
                  boxShadow: `0 6px 18px ${stat.glow}`,
                }}
              >
                <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="relative leading-tight min-w-0">
                <div className="text-lg sm:text-xl font-black tabular-nums text-slate-900 dark:text-white">
                  {statValues[stat.key]}
                </div>
                <div className="text-[10px] font-black tracking-[0.1em] uppercase text-slate-500 dark:text-slate-400 truncate">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search role by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search roles"
            className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#182338] rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* ROLE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {filteredRoles.length === 0 ? (
          <RolesEmpty hasFilters={searchQuery !== ""} />
        ) : (
          filteredRoles.map((role, idx) => {
            const Icon = ROLE_ICONS[role.name] || Award;
            const variant = ROLE_GRADIENTS[role.color] || ROLE_GRADIENTS.default;

            return (
              <motion.div
                key={role.id}
                initial={
                  prefersReduced ? false : { opacity: 0, y: 20, scale: 0.95 }
                }
                animate={
                  prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }
                }
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={prefersReduced ? {} : { y: -4, scale: 1.02 }}
                onClick={() => handleRoleClick(role)}
                onKeyDown={(e) => handleRoleKeyDown(e, role)}
                role="button"
                tabIndex={0}
                aria-label={`View ${role.name} role details`}
                className="group relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {/* Top gradient accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: variant.gradient }}
                  aria-hidden="true"
                />

                {/* Background glow */}
                {!prefersReduced && (
                  <motion.div
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
                    style={{ background: variant.hex }}
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <motion.div
                      whileHover={
                        prefersReduced ? {} : { scale: 1.15, rotate: -8 }
                      }
                      transition={{ duration: 0.2 }}
                      className="p-2.5 rounded-xl flex items-center justify-center shadow-md shrink-0"
                      style={{
                        background: variant.gradient,
                        boxShadow: `0 6px 18px ${variant.glow}`,
                      }}
                    >
                      <Icon size={16} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                    <Badge
                      variant={ROLE_COLOR_VARIANT[role.color] || "default"}
                      size="sm"
                    >
                      {role.name}
                    </Badge>
                  </div>

                  <Eye
                    size={14}
                    className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                  />
                </div>

                <p className="relative text-xs font-medium text-slate-500 dark:text-slate-500 mb-4 min-h-[32px]">
                  {role.description}
                </p>

                <div className="relative flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-slate-500 shrink-0" strokeWidth={2.5} />
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      {role.users}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      users
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Lock
                      size={12}
                      style={{ color: variant.hex }}
                      strokeWidth={2.5}
                      className="shrink-0"
                    />
                    <span
                      className="text-sm font-black tabular-nums"
                      style={{ color: variant.hex }}
                    >
                      {role.permissions}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      perms
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}