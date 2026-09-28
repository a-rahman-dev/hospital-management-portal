import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import { cn } from "@/lib/utils";

/* ============================================================
   🏛️ DASHBOARD LAYOUT — Main App Shell (Rule 5)
   ─────────────────────────────────────────────
   Features:
   - Sidebar (desktop fixed, mobile drawer)
   - Topbar (sticky)
   - Mobile backdrop overlay
   - Route change closes sidebar
   - iOS safe viewport (h-dvh)
   - Skip to content (a11y)
   - Reduced motion support
   ============================================================ */

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 CLOSE SIDEBAR ON ROUTE CHANGE (Mobile UX)
     ============================================================ */
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /* ============================================================
     🎯 LOCK BODY SCROLL WHEN MOBILE SIDEBAR OPEN
     ============================================================ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 1024;
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div
      className={cn(
        /* Fixed viewport lock: window scroll ko bilkul disable karega */
        "fixed inset-0 h-screen h-[100dvh] w-screen overflow-hidden flex",
        /* Background — uses CSS var for theming */
        "bg-slate-50 dark:bg-[#0B1220]",
        "transition-colors duration-300"
      )}
    >
      {/* ============================================================
          SKIP TO CONTENT (a11y)
         ============================================================ */}
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200]",
          "px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        )}
      >
        Skip to content
      </a>

      {/* ============================================================
          SIDEBAR (handles its own responsive behavior)
         ============================================================ */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* ============================================================
          MAIN COLUMN
         ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content area */}
        <main
          id="main-content"
          role="main"
          aria-label="Main content"
          tabIndex={-1}
          className={cn(
            "flex-1 overflow-y-auto scrollbar-hide",
            "p-3 sm:p-4 lg:p-6 xl:p-8",
            "focus:outline-none"
          )}
        >
          {/* Page content with subtle entrance animation */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={location.pathname}
              initial={
                prefersReduced ? false : { opacity: 0, y: 8 }
              }
              animate={
                prefersReduced ? false : { opacity: 1, y: 0 }
              }
              exit={
                prefersReduced ? false : { opacity: 0 }
              }
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}