import { useEffect, useRef, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 MODAL COMPONENT — Professional Modal Dialog (Rule 5)
   ─────────────────────────────────────────────
   Variants:
   - default → Indigo top accent
   - danger  → Rose accent (for sensitive actions)
   - warning → Amber accent
   - success → Emerald accent
   - info    → Cyan accent

   Features:
   - Portal rendering (no z-index issues)
   - Focus trap + initial focus + focus restoration
   - ESC key + click outside to close
   - Body scroll lock
   - Mobile full-screen option
   - Full a11y (role, aria-modal, aria-labelledby)
   - Reduced motion support
   ============================================================ */

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-[95vw]",
};

const VARIANT_MAP = {
  default: {
    accent: "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500",
    icon: Info,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
  },
  danger: {
    accent: "bg-gradient-to-r from-rose-500 via-red-500 to-rose-600",
    icon: AlertTriangle,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
  },
  warning: {
    accent: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600",
    icon: AlertCircle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  success: {
    accent: "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  info: {
    accent: "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600",
    icon: Info,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
  },
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  variant = "default",
  closeOnOverlay = true,
  closeOnEsc = true,
  showClose = true,
  fullScreenOnMobile = false,
  preventScrollClose = false,
  className,
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();

  const config = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const Icon = config.icon;

  /* ============================================================
     🎯 FOCUS RESTORATION — save/restore focus
     ============================================================ */
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
    } else if (previousFocusRef.current) {
      try {
        previousFocusRef.current.focus?.();
      } catch {
        // Silently fail if element no longer exists
      }
      previousFocusRef.current = null;
    }
  }, [open]);

  /* ============================================================
     🎯 INITIAL FOCUS — focus modal on open
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    // Delay to allow animation
    const t = setTimeout(() => {
      if (modalRef.current) {
        // Try to focus first focusable element
        const focusable = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
          focusable.focus({ preventScroll: true });
        } else {
          modalRef.current.focus({ preventScroll: true });
        }
      }
    }, 100);
    return () => clearTimeout(t);
  }, [open]);

  /* ============================================================
     🎯 ESC KEY
     ============================================================ */
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose, closeOnEsc]);

  /* ============================================================
     🎯 FOCUS TRAP — prevent Tab from leaving modal
     ============================================================ */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusables = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    []
  );

  /* ============================================================
     🎯 BODY SCROLL LOCK
     ============================================================ */
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverlay();
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open]);

  // Helper for cleanup
  function originalOverlay() {
    return "";
  }

  /* ============================================================
     🎯 OVERLAY CLICK
     ============================================================ */
  const handleOverlayClick = useCallback(() => {
    if (!closeOnOverlay || preventScrollClose) return;
    onClose?.();
  }, [closeOnOverlay, preventScrollClose, onClose]);

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={subtitle ? descriptionId : undefined}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={handleOverlayClick}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={
              prefersReduced ? false : { opacity: 0, scale: 0.95, y: 20 }
            }
            animate={prefersReduced ? false : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: prefersReduced ? 0 : 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className={cn(
              "relative w-full bg-white dark:bg-[#0e1626]",
              "rounded-2xl shadow-2xl",
              "border border-gray-200 dark:border-[#1e293b]",
              "overflow-hidden",
              "my-8",
              "focus:outline-none",
              /* Mobile full-screen */
              fullScreenOnMobile && "sm:rounded-2xl rounded-none sm:my-8 my-0",
              fullScreenOnMobile && "sm:max-h-none max-h-screen",
              SIZE_MAP[size] || SIZE_MAP.md,
              className
            )}
          >
            {/* Top gradient accent */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-1 opacity-80",
                config.accent
              )}
              aria-hidden="true"
            />

            {/* Header */}
            {(title || subtitle || showClose) && (
              <div className="flex items-start justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-[#1e293b]">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Icon (only if variant is not default and title exists) */}
                  {title && variant !== "default" && (
                    <motion.div
                      initial={
                        prefersReduced ? false : { scale: 0, rotate: -180 }
                      }
                      animate={
                        prefersReduced ? false : { scale: 1, rotate: 0 }
                      }
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        type: "spring",
                      }}
                      className={cn(
                        "shrink-0 p-2 rounded-xl flex items-center justify-center",
                        config.iconBg
                      )}
                    >
                      <Icon
                        size={18}
                        className={config.iconColor}
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  )}

                  <div className="min-w-0 flex-1">
                    {title && (
                      <h2
                        id={titleId}
                        className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate"
                      >
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p
                        id={descriptionId}
                        className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate"
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className={cn(
                      "shrink-0 p-2 min-h-[40px] min-w-[40px] rounded-lg",
                      "text-slate-400 hover:text-slate-900 dark:hover:text-white",
                      "hover:bg-slate-100 dark:hover:bg-white/5",
                      "transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    )}
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div
              className={cn(
                "px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto scrollbar-thin",
                fullScreenOnMobile
                  ? "max-h-[calc(100vh-180px)] sm:max-h-[70vh]"
                  : "max-h-[60vh] sm:max-h-[70vh]"
              )}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-[#1e293b]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}