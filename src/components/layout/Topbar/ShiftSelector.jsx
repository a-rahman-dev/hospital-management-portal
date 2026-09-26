import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Sun, Moon, Sunrise, Sunset, ChevronDown, Check, Clock } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🌅 SHIFT SELECTOR — Current Shift Display (Rule 5)
   ─────────────────────────────────────────────
   Palette: Multi-color per shift
   - Morning: Amber → Orange
   - Evening: Violet → Fuchsia
   - Night:   Indigo → Blue
   
   Features:
   - 3 shifts (Morning, Evening, Night)
   - Auto-detect current shift based on time
   - Animated dropdown
   - Keyboard accessible
   - Persistence
   - Mobile responsive
   - Full a11y
   ============================================================ */

/* ============================================================
   📋 SHIFTS DATA (Rule 3)
   ============================================================ */
const SHIFTS = [
  {
    id: "morning",
    name: "Morning",
    time: "6:00 AM - 2:00 PM",
    startHour: 6,
    endHour: 14,
    icon: Sunrise,
    textClass: "text-amber-700 dark:text-amber-400",
    bgClass: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
    borderClass: "border-amber-500/20",
    iconColor: "text-amber-500",
    glow: "bg-amber-500/40",
  },
  {
    id: "evening",
    name: "Evening",
    time: "2:00 PM - 10:00 PM",
    startHour: 14,
    endHour: 22,
    icon: Sunset,
    textClass: "text-violet-700 dark:text-violet-400",
    bgClass: "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10",
    borderClass: "border-violet-500/20",
    iconColor: "text-violet-500",
    glow: "bg-violet-500/40",
  },
  {
    id: "night",
    name: "Night",
    time: "10:00 PM - 6:00 AM",
    startHour: 22,
    endHour: 6,
    icon: Moon,
    textClass: "text-indigo-700 dark:text-indigo-400",
    bgClass: "bg-gradient-to-br from-indigo-500/10 to-blue-500/10",
    borderClass: "border-indigo-500/20",
    iconColor: "text-indigo-500",
    glow: "bg-indigo-500/40",
  },
];

/* ============================================================
   🎯 AUTO-DETECT CURRENT SHIFT
   ============================================================ */
function getCurrentShift() {
  const hour = new Date().getHours();
  return (
    SHIFTS.find((shift) => {
      if (shift.startHour < shift.endHour) {
        return hour >= shift.startHour && hour < shift.endHour;
      }
      // Overnight shift (night: 22-6)
      return hour >= shift.startHour || hour < shift.endHour;
    }) || SHIFTS[0]
  );
}

const SHIFT_KEY = "current-shift";

export default function ShiftSelector() {
  const prefersReduced = useReducedMotion();
  const menuId = useId();
  const buttonId = useId();

  /* ============================================================
     🎯 STATE (with persistence)
     ============================================================ */
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") return getCurrentShift();
    try {
      const saved = localStorage.getItem(SHIFT_KEY);
      const savedShift = SHIFTS.find((s) => s.id === saved);
      return savedShift || getCurrentShift();
    } catch {
      return getCurrentShift();
    }
  });
  const [autoDetected, setAutoDetected] = useState(
    () => !localStorage.getItem(SHIFT_KEY)
  );

  const ref = useRef(null);
  const buttonRef = useRef(null);

  /* ============================================================
     🎯 PERSIST SELECTION
     ============================================================ */
  useEffect(() => {
    try {
      localStorage.setItem(SHIFT_KEY, selected.id);
    } catch {
      // Silent fail
    }
  }, [selected]);

  /* ============================================================
     🎯 CLICK OUTSIDE TO CLOSE
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  /* ============================================================
     🎯 ESC KEY + FOCUS RESTORATION
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const handleSelect = useCallback((shift) => {
    setSelected(shift);
    setAutoDetected(false);
    setOpen(false);
  }, []);

  const handleReset = useCallback(() => {
    const current = getCurrentShift();
    setSelected(current);
    setAutoDetected(true);
    try {
      localStorage.removeItem(SHIFT_KEY);
    } catch {
      // Silent fail
    }
  }, []);

  const Icon = selected.icon;

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  return (
    <div className="relative" ref={ref}>
      {/* ============================================================
          MAIN BUTTON
         ============================================================ */}
      <motion.button
        ref={buttonRef}
        id={buttonId}
        onClick={() => setOpen((o) => !o)}
        whileHover={prefersReduced ? {} : { scale: 1.02 }}
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        aria-label={`Current shift: ${selected.name}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        title={`Current shift: ${selected.name} (${selected.time})`}
        className={cn(
          "hidden md:flex items-center gap-2 px-3 py-2 min-h-[44px]",
          "rounded-xl transition-all duration-200",
          selected.bgClass,
          "border",
          selected.borderClass,
          "shadow-sm hover:shadow-md",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
          open && "ring-2 ring-indigo-500/20"
        )}
      >
        {/* Icon with glow */}
        <div className="relative flex items-center justify-center shrink-0">
          <Icon size={15} className={selected.iconColor} strokeWidth={2.5} />
          <span
            className={cn(
              "absolute inset-0 rounded-full blur-md",
              selected.glow
            )}
            aria-hidden="true"
          />
        </div>

        {/* Shift name */}
        <span
          className={cn(
            "text-[12px] font-bold tracking-tight whitespace-nowrap",
            selected.textClass
          )}
        >
          {selected.name}
        </span>

        {/* Auto indicator dot */}
        {autoDetected && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              selected.iconColor
            )}
            title="Auto-detected"
            aria-label="Auto-detected"
          />
        )}

        {/* Chevron */}
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={cn(
            "transition-transform duration-200 opacity-70 shrink-0",
            selected.textClass,
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
            initial={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
            animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: prefersReduced ? 0 : 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full mt-2 z-50",
              "w-64 max-w-[calc(100vw-2rem)]",
              "bg-white dark:bg-[#0F172A]",
              "border border-gray-200 dark:border-white/[0.08]",
              "rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40",
              "overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Select Shift
              </p>
              {!autoDetected && (
                <button
                  onClick={handleReset}
                  className={cn(
                    "text-[10px] font-black tracking-wider uppercase",
                    "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400",
                    "transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded"
                  )}
                  aria-label="Reset to auto-detected shift"
                >
                  Auto
                </button>
              )}
            </div>

            {/* Options */}
            <div className="p-2" role="none">
              {SHIFTS.map((shift) => {
                const ShiftIcon = shift.icon;
                const isActive = selected.id === shift.id;

                return (
                  <motion.button
                    key={shift.id}
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => handleSelect(shift)}
                    whileHover={prefersReduced ? {} : { x: 2 }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl",
                      "text-left transition-colors duration-150",
                      "focus:outline-none focus-visible:bg-indigo-500/10",
                      isActive
                        ? "bg-slate-50 dark:bg-white/[0.05]"
                        : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        shift.bgClass,
                        "border",
                        shift.borderClass
                      )}
                    >
                      <ShiftIcon
                        size={16}
                        className={shift.iconColor}
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-bold truncate",
                          isActive
                            ? shift.textClass
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        {shift.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500 truncate tabular-nums">
                        {shift.time}
                      </p>
                    </div>

                    {/* Checkmark */}
                    {isActive && (
                      <motion.div
                        initial={
                          prefersReduced ? false : { scale: 0, rotate: -90 }
                        }
                        animate={
                          prefersReduced ? false : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.2 }}
                        className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0"
                      >
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
              <p className="text-[10px] text-slate-500 dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
                <Clock size={10} strokeWidth={2.5} aria-hidden="true" />
                Shift changes reflect in your dashboard
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}