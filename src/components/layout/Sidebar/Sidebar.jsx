import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { sidebarMenu } from "@/data/sidebarMenu";
import SidebarItem from "./SidebarItem";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 SIDEBAR COMPONENT (Rule 5)
   ─────────────────────────────────────────────
   Features:
   - Desktop: fixed, collapsible, persisted state
   - Mobile: drawer with backdrop + ESC close
   - Body scroll lock when mobile open
   - Focus trap on mobile
   - Grouped navigation sections
   - Help card
   - Full a11y
   ============================================================ */

const COLLAPSE_KEY = "sidebar-collapsed";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 PERSIST COLLAPSED STATE
     ============================================================ */
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      // Silent fail
    }
  }, [collapsed]);

  /* ============================================================
     🎯 ESC KEY CLOSES MOBILE DRAWER
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, setOpen]);

  /* ============================================================
     🎯 CLOSE MOBILE DRAWER ON ROUTE CHANGE
     ============================================================ */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  /* ============================================================
     🎯 BODY SCROLL LOCK ON MOBILE
     ============================================================ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 1024;
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ============================================================
     🎯 FOCUS TRAP ON MOBILE
     ============================================================ */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Tab" || !open) return;
      const aside = e.currentTarget;
      const focusables = aside.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [open]
  );

  return (
    <>
      {/* ============================================================
          MOBILE OVERLAY
         ============================================================ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ============================================================
          SIDEBAR
         ============================================================ */}
      <motion.aside
        initial={prefersReduced ? false : { x: -20, opacity: 0 }}
        animate={prefersReduced ? false : { x: 0, opacity: 1 }}
        transition={{ duration: prefersReduced ? 0 : 0.3, ease: "easeOut" }}
        onKeyDown={handleKeyDown}
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          /* Position */
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col",
          /* Background */
          "bg-white dark:bg-[#0F172A]",
          "border-r border-gray-200 dark:border-white/[0.06]",
          /* Transition */
          "transition-all duration-300 ease-in-out",
          /* Width */
          collapsed ? "lg:w-20" : "lg:w-64",
          "w-64 max-w-[85vw]",
          /* Mobile position */
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
          aria-hidden="true"
        />

        {/* ============================================================
            HEADER
           ============================================================ */}
        <div
          className={cn(
            "relative flex items-center h-16 px-4 border-b border-gray-200 dark:border-white/[0.06] shrink-0",
            collapsed ? "lg:justify-center lg:px-2" : "gap-3"
          )}
        >
          {/* Logo */}
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.05, rotate: 3 }}
            transition={{ duration: 0.2 }}
            className="relative shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <Activity size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={
                prefersReduced
                  ? {}
                  : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F172A]"
              aria-label="System online"
              role="status"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 opacity-30 blur-lg -z-10" />
          </motion.div>

          {/* Brand text */}
          {!collapsed && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              animate={prefersReduced ? false : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 min-w-0 pr-8"
            >
              <h1 className="font-black text-slate-900 dark:text-white text-sm leading-tight tracking-tight truncate">
                AY INT.{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                  PRO
                </span>
              </h1>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-500 leading-tight uppercase tracking-widest">
                Hospital Suite
              </p>
            </motion.div>
          )}

          {/* Collapse button (expanded) */}
          {!collapsed && (
            <motion.button
              onClick={() => setCollapsed(true)}
              whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
              whileTap={prefersReduced ? {} : { scale: 0.9 }}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className={cn(
                "hidden lg:flex absolute top-2.5 right-2.5",
                "items-center justify-center w-8 h-8 rounded-lg shrink-0",
                "text-slate-500 dark:text-slate-400",
                "hover:text-cyan-500 dark:hover:text-cyan-400",
                "hover:bg-slate-100 dark:hover:bg-white/[0.06]",
                "border border-transparent hover:border-cyan-500/20",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              )}
            >
              <PanelLeftClose size={17} strokeWidth={2.5} />
            </motion.button>
          )}

          {/* Expand button (collapsed) */}
          {collapsed && (
            <motion.button
              onClick={() => setCollapsed(false)}
              whileHover={prefersReduced ? {} : { scale: 1.15 }}
              whileTap={prefersReduced ? {} : { scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className={cn(
                "hidden lg:flex absolute -right-3 top-4",
                "w-6 h-6 rounded-full items-center justify-center shrink-0",
                "bg-white dark:bg-[#0F172A]",
                "border border-gray-200 dark:border-white/[0.08]",
                "text-slate-500 dark:text-slate-400 shadow-lg",
                "hover:text-cyan-500 hover:border-cyan-400/40",
                "transition-colors duration-200 z-50",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              )}
            >
              <PanelLeftOpen size={13} strokeWidth={2.5} />
            </motion.button>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden ml-auto p-2 min-h-[40px] min-w-[40px] rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ============================================================
            NAVIGATION
           ============================================================ */}
        <nav
          className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-5"
          aria-label="Sidebar menu"
        >
          {sidebarMenu.map((group, groupIdx) => (
            <motion.div
              key={group.section}
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: groupIdx * 0.1 }}
            >
              {!collapsed && (
                <div className="flex items-center gap-2 px-3 mb-2.5">
                  <div
                    className="w-1 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                    {group.section}
                  </p>
                  <div
                    className="flex-1 h-px bg-gradient-to-r from-slate-200 dark:from-white/[0.06] to-transparent"
                    aria-hidden="true"
                  />
                </div>
              )}

              {collapsed && (
                <div
                  className="hidden lg:block h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/[0.1] to-transparent mx-2 mb-2"
                  aria-hidden="true"
                />
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.name}
                    item={item}
                    collapsed={collapsed}
                    onItemClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </nav>

        {/* ============================================================
            HELP CARD
           ============================================================ */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              exit={prefersReduced ? false : { opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="p-3 border-t border-gray-200 dark:border-white/[0.06] shrink-0"
            >
              <motion.div
                whileHover={prefersReduced ? {} : { scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden p-3 rounded-xl bg-gradient-to-br from-cyan-500/[0.08] via-violet-500/[0.08] to-blue-500/[0.08] border border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                <div className="relative flex items-start gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/30">
                    <Sparkles
                      size={11}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      Need Help?
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Check our docs
                    </p>
                  </div>
                </div>

                <Link
                  to="/help"
                  className="relative flex items-center justify-between text-[10px] font-black text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
                >
                  <span>View Documentation</span>
                  <ArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom gradient accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          aria-hidden="true"
        />
      </motion.aside>
    </>
  );
}