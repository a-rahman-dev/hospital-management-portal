import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  User,
  AlertCircle,
  Check,
  CheckCheck,
  Trash2,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🔔 NOTIFICATIONS — Topbar Notifications Dropdown (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - Bell icon with unread count badge
   - Animated dropdown
   - Mark as read (individual + all)
   - Clear all with warning (Rule 4)
   - Empty state
   - Keyboard accessible (Esc to close)
   - Full a11y
   ============================================================ */

/* ============================================================
   📋 DEFAULT DATA (Rule 3 — real-looking notifications)
   ============================================================ */
const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    icon: User,
    color: "bg-indigo-500/15 text-indigo-500",
    title: "New patient registered",
    message: "Emma Rodriguez was added to the system",
    time: "5 min ago",
    unread: true,
    type: "info",
  },
  {
    id: 2,
    icon: Calendar,
    color: "bg-emerald-500/15 text-emerald-500",
    title: "Appointment confirmed",
    message: "Dr. Chen confirmed 10:30 AM slot",
    time: "20 min ago",
    unread: true,
    type: "success",
  },
  {
    id: 3,
    icon: AlertCircle,
    color: "bg-rose-500/15 text-rose-500",
    title: "Critical lab report",
    message: "Patient #103 — hs-cTnI elevated",
    time: "1 hour ago",
    unread: true,
    type: "danger",
  },
  {
    id: 4,
    icon: Check,
    color: "bg-violet-500/15 text-violet-500",
    title: "Payment received",
    message: "Invoice INV-2026-002 settled ($1,850)",
    time: "2 hours ago",
    unread: false,
    type: "success",
  },
];

/* ============================================================
   ⚠️ CONFIRM MODAL (Rule 4)
   ============================================================ */
function ConfirmModal({ open, onClose, onConfirm, count }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
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
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <Trash2 size={18} className="text-rose-500" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Clear all notifications?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This will permanently remove {count} notification
                    {count !== 1 ? "s" : ""}. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white text-xs font-black tracking-wider uppercase shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all"
                >
                  Clear All
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
   🎯 MAIN: Notifications
   ============================================================ */
export default function Notifications({
  notifications: initialNotifications = DEFAULT_NOTIFICATIONS,
}) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [confirmClear, setConfirmClear] = useState(false);
  const ref = useRef(null);

  /* ============================================================
     🎯 CLICK OUTSIDE TO CLOSE
     ============================================================ */
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ============================================================
     🎯 ESC KEY TO CLOSE
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
    setConfirmClear(false);
    setOpen(false);
  }, []);

  const handleViewAll = useCallback(() => {
    navigate("/notifications");
    setOpen(false);
  }, [navigate]);

  const handleNotificationClick = useCallback(
    (notification) => {
      // Mark as read when clicked
      if (notification.unread) {
        handleMarkAsRead(notification.id);
      }
      // Navigate if action exists
      if (notification.action) {
        navigate(notification.action);
        setOpen(false);
      }
    },
    [handleMarkAsRead, navigate]
  );

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  return (
    <>
      <div className="relative" ref={ref}>
        {/* ============================================================
            BELL BUTTON
           ============================================================ */}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={prefersReduced ? {} : { scale: 1.05 }}
          whileTap={prefersReduced ? {} : { scale: 0.95 }}
          aria-label={`Notifications${
            unreadCount > 0 ? ` (${unreadCount} unread)` : ""
          }`}
          aria-expanded={open}
          aria-haspopup="true"
          className={cn(
            "relative flex items-center justify-center",
            "w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl",
            "transition-colors duration-200",
            "text-slate-600 dark:text-slate-400",
            "hover:text-indigo-500 dark:hover:text-indigo-400",
            "hover:bg-slate-100 dark:hover:bg-white/[0.06]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
            open &&
              "bg-slate-100 dark:bg-white/[0.06] text-indigo-500 dark:text-indigo-400"
          )}
        >
          <Bell size={20} strokeWidth={2.2} />

          {/* Unread badge with count */}
          {unreadCount > 0 && (
            <motion.span
              initial={prefersReduced ? false : { scale: 0 }}
              animate={prefersReduced ? false : { scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className={cn(
                "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1",
                "flex items-center justify-center",
                "rounded-full",
                "bg-gradient-to-br from-rose-500 to-red-600",
                "text-white text-[10px] font-black tabular-nums",
                "ring-2 ring-white dark:ring-[#0B1220]",
                "shadow-lg shadow-rose-500/40"
              )}
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* ============================================================
            DROPDOWN
           ============================================================ */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              role="menu"
              aria-label="Notifications"
              className={cn(
                "absolute right-0 top-full mt-2 z-50",
                "w-[calc(100vw-2rem)] sm:w-80 max-w-[380px]",
                "bg-white dark:bg-[#0F172A]",
                "border border-gray-200 dark:border-white/[0.08]",
                "rounded-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40",
                "overflow-hidden"
              )}
            >
              {/* ============================================================
                  HEADER
                 ============================================================ */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-full",
                        "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
                        "border border-indigo-500/20"
                      )}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    aria-label="Mark all as read"
                    title="Mark all as read"
                    className={cn(
                      "shrink-0 p-1.5 rounded-lg transition-colors",
                      "text-slate-400 dark:text-slate-500",
                      "hover:text-indigo-500 hover:bg-indigo-500/10",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                    )}
                  >
                    <CheckCheck size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* ============================================================
                  NOTIFICATIONS LIST
                 ============================================================ */}
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
                      <Inbox
                        size={24}
                        className="text-slate-300 dark:text-slate-600"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      All caught up!
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      You have no notifications
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = n.icon || Bell;
                    return (
                      <motion.button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        whileHover={prefersReduced ? {} : { x: 2 }}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3 text-left",
                          "transition-colors duration-150",
                          "border-b border-gray-100 dark:border-white/[0.04] last:border-0",
                          "hover:bg-slate-50 dark:hover:bg-white/[0.03]",
                          "focus:outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-white/[0.05]",
                          n.unread && "bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05]"
                        )}
                        role="menuitem"
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                            n.color
                          )}
                        >
                          <Icon size={16} strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm truncate",
                              n.unread
                                ? "font-bold text-slate-900 dark:text-white"
                                : "font-medium text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {n.title}
                          </p>
                          {n.message && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {n.message}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                            {n.time}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {n.unread && (
                          <span
                            className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0 shadow-lg shadow-indigo-500/50"
                            aria-label="Unread"
                          />
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* ============================================================
                  FOOTER
                 ============================================================ */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
                <button
                  onClick={handleViewAll}
                  className={cn(
                    "text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-black tracking-wider uppercase",
                    "transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded"
                  )}
                >
                  View all
                </button>

                {notifications.length > 0 && (
                  <button
                    onClick={() => setConfirmClear(true)}
                    aria-label="Clear all notifications"
                    title="Clear all"
                    className={cn(
                      "shrink-0 p-1.5 rounded-lg transition-colors",
                      "text-slate-400 dark:text-slate-500",
                      "hover:text-rose-500 hover:bg-rose-500/10",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                    )}
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ⚠️ CLEAR ALL WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClearAll}
        count={notifications.length}
      />
    </>
  );
}