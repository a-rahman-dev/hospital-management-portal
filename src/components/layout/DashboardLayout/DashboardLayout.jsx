import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import { cn } from "@/lib/utils";
import CopilotWidget from "@/components/ai/CopilotWidget";

/* ============================================================
   🏛️ DASHBOARD LAYOUT — Full Enterprise App Shell
   ============================================================ */

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef(null);

  /* Route change hone par mobile drawer band aur scroll instant top reset */
  useEffect(() => {
    setSidebarOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  /* Mobile sidebar khulne par background scroll lock */
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
        "fixed inset-0 h-screen h-[100dvh] w-screen overflow-hidden flex",
        /* Dynamic Theme Palette (Light + Dark Support) */
        "bg-slate-100 dark:bg-[#070D1B]",
        "text-slate-900 dark:text-slate-100",
        "transition-colors duration-200"
      )}
    >
      {/* ============================================================
          SKIP TO CONTENT (Accessibility standard)
         ============================================================ */}
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200]",
          "px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        )}
      >
        Skip to content
      </a>

      {/* ============================================================
          SIDEBAR (Desktop permanent + Mobile slide-over)
         ============================================================ */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* ============================================================
          MAIN VIEWPORT COLUMN
         ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Header Topbar with all functional actions */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Main Area (Instant Render without freeze) */}
        <main
          ref={mainContentRef}
          id="main-content"
          role="main"
          aria-label="Main content"
          tabIndex={-1}
          className={cn(
            "flex-1 overflow-y-auto scrollbar-hide",
            "p-3 sm:p-4 lg:p-6 xl:p-8",
            "bg-slate-50 dark:bg-[#070D1B]",
            "transition-colors duration-200",
            "focus:outline-none"
          )}
        >
          {/* 
            Key based re-mount: Kisi bhi page se wapis aane par 
            blank screen ya double-tap ka issue hamesha ke liye khatam!
          */}
          <div key={location.pathname} className="w-full min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ============================================================
          FLOATING AI COPILOT ASSISTANT
         ============================================================ */}
      <CopilotWidget />
    </div>
  );
}