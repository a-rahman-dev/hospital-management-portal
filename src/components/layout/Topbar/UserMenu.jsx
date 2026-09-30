import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl cursor-pointer transition-all",
          "bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-slate-800",
          "hover:border-violet-500/50 shadow-sm"
        )}
      >
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center">
          AR
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Dr. A. Rahman
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Administrator
          </span>
        </div>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0B1220] border border-gray-200 dark:border-slate-800 p-2 shadow-2xl z-50 text-xs"
          >
            {/* User Header Info */}
            <div className="p-3 border-b border-gray-100 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white text-sm">Dr. A. Rahman</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                a.rahman@ayint-hospital.com
              </div>
              <div className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                ADMINISTRATOR
              </div>
            </div>

            {/* Menu Options (Notifications removed to avoid duplicate) */}
            <div className="py-1 space-y-0.5">
              <button
                onClick={() => handleOptionClick("/patients")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer font-medium"
              >
                <User size={15} className="text-violet-500" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleOptionClick("/practice-setting")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer font-medium"
              >
                <Settings size={15} className="text-indigo-500" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => handleOptionClick("/landing")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer font-medium"
              >
                <HelpCircle size={15} className="text-amber-500" />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-1 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => handleOptionClick("/landing")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer font-bold"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}