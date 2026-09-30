import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, Command, HelpCircle, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import ShiftSelector from "./ShiftSelector";
import { cn } from "@/lib/utils";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Scroll detection
  const ticking = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut (⌘K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="text"][placeholder*="Search"]'
        );
        if (searchInput) searchInput.focus();
        else setMobileSearchOpen(true);
      }
      if (e.key === "Escape") {
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHelp = useCallback(() => {
    navigate("/landing");
  }, [navigate]);

  const handleMobileSearch = useCallback(() => {
    setMobileSearchOpen((prev) => !prev);
  }, []);

  return (
    <motion.header
      initial={prefersReduced ? false : { y: -20, opacity: 0 }}
      animate={prefersReduced ? false : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      role="banner"
      className={cn(
        "sticky top-0 z-30 backdrop-blur-xl transition-all duration-300",
        "bg-white/80 dark:bg-[#0F172A]/80",
        "border-b border-gray-200 dark:border-white/[0.06]",
        scrolled && "shadow-lg shadow-slate-900/5 dark:shadow-black/20 border-gray-200/80 dark:border-white/[0.1]"
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" aria-hidden="true" />

      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 h-16">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={onMenuClick}
          whileHover={prefersReduced ? {} : { scale: 1.05 }}
          whileTap={prefersReduced ? {} : { scale: 0.95 }}
          aria-label="Open navigation menu"
          className={cn(
            "lg:hidden flex items-center justify-center w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl shrink-0 cursor-pointer",
            "text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400",
            "hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
          )}
        >
          <Menu size={20} strokeWidth={2.2} />
        </motion.button>

        {/* Search Desktop */}
        <div className="hidden sm:flex flex-1 min-w-0 max-w-md lg:max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex-1 sm:hidden" />

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
          {/* Mobile Search Toggle */}
          <motion.button
            onClick={handleMobileSearch}
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            whileTap={prefersReduced ? {} : { scale: 0.95 }}
            className={cn(
              "sm:hidden flex items-center justify-center w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl shrink-0 cursor-pointer",
              "text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            )}
          >
            {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </motion.button>

          {/* Shift Selector */}
          <div className="hidden md:flex">
            <ShiftSelector />
          </div>

          {/* Help Button */}
          <motion.button
            onClick={handleHelp}
            whileHover={prefersReduced ? {} : { scale: 1.05, y: -1 }}
            whileTap={prefersReduced ? {} : { scale: 0.95 }}
            title="Help & Support"
            className={cn(
              "hidden lg:flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer",
              "text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            )}
          >
            <HelpCircle size={18} strokeWidth={2.2} />
          </motion.button>

          <div className="hidden lg:block w-px h-7 bg-gradient-to-b from-transparent via-slate-300 dark:via-white/[0.15] to-transparent mx-1" />

          {/* Notifications */}
          <Notifications />

          {/* Theme Toggle */}
          <div className="hidden sm:flex">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Search Bar Slide */}
      <motion.div
        initial={false}
        animate={{ height: mobileSearchOpen ? "auto" : 0, opacity: mobileSearchOpen ? 1 : 0 }}
        className="sm:hidden overflow-hidden border-t border-gray-100 dark:border-white/[0.06]"
      >
        <div className="p-3">
          <SearchBar />
        </div>
      </motion.div>
    </motion.header>
  );
}