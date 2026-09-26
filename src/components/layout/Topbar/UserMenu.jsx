import { useState, useRef, useEffect, useCallback, useId } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  HelpCircle,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   👤 USER MENU — Topbar User Dropdown (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - Avatar + name + role
   - Animated dropdown
   - Keyboard nav (arrow keys, Esc)
   - Working menu items
   - LOGOUT with warning (Rule 4)
   - Focus restoration
   - Full a11y
   ============================================================ */

/* ============================================================
   📋 DEFAULT USER (Rule 3 — will be prop in future)
   ============================================================ */
const DEFAULT_USER = {
  name: "Dr. A. Rahman",
  role: "Administrator",
  initials: "AR",
  email: "a.rahman@ayint-hospital.com",
  status: "online", // online | offline | busy | away
};

/* ============================================================
   ⚠️ CONFIRM MODAL (Rule 4)
   ============================================================ */
function ConfirmModal({ open, onClose, onConfirm, loading }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && !loading && onClose()
          }
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <LogOut size={18} className="text-amber-500" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Sign out of the system?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    You'll need to sign in again to access the patient portal
                    and any unsaved changes will be lost.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Stay Signed In
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={cn(
                    "w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-lg",
                    "bg-gradient-to-br from-amber-500 to-orange-600",
                    "text-white text-xs font-black tracking-wider uppercase",
                    "shadow-lg shadow-amber-500/30 hover:shadow-xl",
                    "transition-all disabled:opacity-50",
                    "inline-flex items-center justify-center gap-2"
                  )}
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    "Yes, Sign Out"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   🎯 MAIN: UserMenu
   ============================================================ */
export default function UserMenu({ user = DEFAULT_USER, onLogout }) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const menuId = useId();
  const buttonId = useId();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const ref = useRef(null);
  const buttonRef = useRef(null);

  /* ============================================================
     🎯 MENU ITEMS
     ============================================================ */
  const menuItems = [
    {
      id: "profile",
      icon: User,
      label: "My Profile",
      action: () => navigate("/profile"),
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      action: () => navigate("/settings"),
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      action: () => navigate("/notifications"),
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help & Support",
      action: () => navigate("/help"),
    },
  ];

  /* ============================================================
     🎯 CLICK OUTSIDE TO CLOSE
     ============================================================ */
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ============================================================
     🎯 ESC KEY + FOCUS RESTORATION
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  /* ============================================================
     🎯 KEYBOARD NAVIGATION (Arrow keys)
     ============================================================ */
  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;
      const totalItems = menuItems.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < totalItems - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : totalItems - 1
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        menuItems[highlightedIndex].action();
        setOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [open, highlightedIndex, menuItems]
  );

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const handleMenuItemClick = useCallback((item) => {
    item.action();
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleLogoutClick = useCallback(() => {
    setConfirmLogout(true);
    setOpen(false);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (onLogout) {
        onLogout();
      } else {
        navigate("/login");
      }
    } catch {
      setLoggingOut(false);
      setConfirmLogout(false);
    }
  }, [onLogout, navigate]);

  /* ============================================================
     🎯 STATUS COLORS
     ============================================================ */
  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-400",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  };

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  return (
    <>
      <div className="relative" ref={ref}>
        {/* ============================================================
            AVATAR BUTTON
           ============================================================ */}
        <motion.button
          ref={buttonRef}
          id={buttonId}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          whileHover={prefersReduced ? {} : { scale: 1.02 }}
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          aria-label={`User menu for ${user.name}`}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          className={cn(
            "flex items-center gap-2 sm:gap-2.5 p-1.5 sm:pr-3 rounded-xl",
            "min-h-[44px]",
            "transition-colors duration-200",
            "hover:bg-slate-100 dark:hover:bg-white/[0.06]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
            open && "bg-slate-100 dark:bg-white/[0.06]"
          )}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">
              {user.initials}
            </div>
            {/* Status dot */}
            {user.status && (
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#0B1220]",
                  statusColors[user.status] || statusColors.offline
                )}
                aria-label={`Status: ${user.status}`}
                role="status"
              />
            )}
          </div>

          {/* Name + Role (hidden on mobile) */}
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[120px]">
              {user.role}
            </p>
          </div>

          {/* Chevron */}
          <ChevronDown
            size={16}
            strokeWidth={2.5}
            className={cn(
              "hidden sm:block text-slate-500 dark:text-slate-400",
              "transition-transform duration-200 shrink-0",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </motion.button>

        {/* ============================================================
            DROPDOWN MENU
           ============================================================ */}
        <AnimatePresence>
          {open && (
            <motion.div
              id={menuId}
              role="menu"
              aria-labelledby={buttonId}
              initial={
                prefersReduced ? false : { opacity: 0, y: -8, scale: 0.96 }
              }
              animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute right-0 top-full mt-2 z-50",
                "w-64 sm:w-72",
                "bg-white dark:bg-[#0F172A]",
                "border border-gray-200 dark:border-white/[0.08]",
                "rounded-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40",
                "overflow-hidden"
              )}
            >
              {/* ============================================================
                  USER INFO HEADER
                 ============================================================ */}
              <div className="px-4 py-4 border-b border-gray-200 dark:border-white/[0.06] bg-gradient-to-br from-slate-50 to-white dark:from-white/[0.02] dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30">
                      {user.initials}
                    </div>
                    {user.status && (
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#0F172A]",
                          statusColors[user.status] || statusColors.offline
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate text-sm">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 mt-1",
                        "text-[9px] font-black tracking-wider uppercase",
                        "px-1.5 py-0.5 rounded-full",
                        "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
                        "border border-indigo-500/20"
                      )}
                    >
                      <Shield size={8} strokeWidth={3} />
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  MENU ITEMS
                 ============================================================ */}
              <div className="py-1.5" role="none">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  const isHighlighted = highlightedIndex === i;

                  return (
                    <motion.button
                      key={item.id}
                      role="menuitem"
                      onClick={() => handleMenuItemClick(item)}
                      onMouseEnter={() => setHighlightedIndex(i)}
                      onMouseLeave={() => setHighlightedIndex(-1)}
                      whileHover={prefersReduced ? {} : { x: 2 }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5",
                        "text-sm font-medium text-left",
                        "transition-colors duration-150",
                        "focus:outline-none",
                        isHighlighted
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon
                        size={17}
                        strokeWidth={2.2}
                        className={cn(
                          "shrink-0 transition-colors",
                          isHighlighted
                            ? "text-indigo-500"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* ============================================================
                  SIGN OUT
                 ============================================================ */}
              <div className="border-t border-gray-200 dark:border-white/[0.06] py-1.5">
                <motion.button
                  role="menuitem"
                  onClick={handleLogoutClick}
                  whileHover={prefersReduced ? {} : { x: 2 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5",
                    "text-sm font-bold text-left",
                    "text-rose-500 dark:text-rose-400",
                    "hover:bg-rose-500/10",
                    "transition-colors duration-150",
                    "focus:outline-none focus-visible:bg-rose-500/10"
                  )}
                >
                  <LogOut size={17} strokeWidth={2.5} className="shrink-0" />
                  <span className="flex-1">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ⚠️ LOGOUT WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={confirmLogout}
        onClose={() => !loggingOut && setConfirmLogout(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </>
  );
}