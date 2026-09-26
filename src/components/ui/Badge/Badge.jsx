import { X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 BADGE COMPONENT — Professional Status Badge (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - 9 variants (default, primary, success, warning, danger,
     info, purple, outline, ghost)
   - 4 sizes (xs, sm, md, lg)
   - Dot indicator (with optional pulse)
   - Icon support (left/right)
   - Closable option
   - Uppercase option
   - Monospace option
   - Full a11y
   ============================================================ */

const VARIANT_STYLES = {
  default: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-500",
    border: "",
  },
  primary: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-600 dark:text-indigo-400",
    dot: "bg-indigo-500",
    border: "",
  },
  success: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "",
  },
  warning: {
    bg: "bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "",
  },
  danger: {
    bg: "bg-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    border: "",
  },
  info: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500",
    border: "",
  },
  purple: {
    bg: "bg-purple-500/15",
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    border: "",
  },
  outline: {
    bg: "bg-transparent",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-500",
    border: "border border-slate-300 dark:border-slate-700",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-slate-500 dark:text-slate-400",
    dot: "bg-slate-400",
    border: "",
  },
};

const SIZE_STYLES = {
  xs: "px-1.5 py-0.5 text-[9px] gap-1",
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-1.5",
};

const DOT_SIZES = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-1.5 h-1.5",
  lg: "w-2 h-2",
};

const ICON_SIZES = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
  icon = null,
  iconPosition = "left",
  closable = false,
  onClose,
  uppercase = false,
  monospace = false,
  className,
  onClick,
  ...props
}) {
  const prefersReduced = useReducedMotion();
  const config = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const dotSize = DOT_SIZES[size] || DOT_SIZES.md;
  const iconSize = ICON_SIZES[size] || 12;
  const isInteractive = !!onClick;

  const Component = isInteractive ? "button" : "span";

  return (
    <Component
      type={isInteractive ? "button" : undefined}
      onClick={onClick}
      className={cn(
        /* Base */
        "inline-flex items-center font-bold rounded-full whitespace-nowrap",
        "transition-colors duration-150",

        /* Variant */
        config.bg,
        config.text,
        config.border,

        /* Size */
        SIZE_STYLES[size] || SIZE_STYLES.md,

        /* Uppercase */
        uppercase && "uppercase tracking-wider",

        /* Monospace */
        monospace && "font-mono",

        /* Interactive */
        isInteractive && [
          "cursor-pointer",
          "hover:opacity-80",
          "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/40",
        ],

        className
      )}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span className="relative flex items-center justify-center shrink-0">
          {/* Ping animation */}
          {pulse && !prefersReduced && (
            <span
              className={cn(
                "absolute inline-flex rounded-full opacity-75 animate-ping",
                dotSize,
                config.dot
              )}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full",
              dotSize,
              config.dot
            )}
            aria-hidden="true"
          />
        </span>
      )}

      {/* Left icon */}
      {icon && iconPosition === "left" && !dot && (
        <span className="shrink-0 inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Children */}
      {children && <span className="inline-flex items-center">{children}</span>}

      {/* Right icon */}
      {icon && iconPosition === "right" && (
        <span className="shrink-0 inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Close button */}
      {closable && (
        <motion.span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onClose?.();
            }
          }}
          whileHover={prefersReduced ? {} : { scale: 1.2 }}
          whileTap={prefersReduced ? {} : { scale: 0.9 }}
          aria-label="Remove"
          className={cn(
            "shrink-0 -mr-1 ml-0.5 p-0.5 rounded-full inline-flex items-center justify-center",
            "hover:bg-black/10 dark:hover:bg-white/10",
            "cursor-pointer transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-current"
          )}
        >
          <X size={iconSize} strokeWidth={2.5} />
        </motion.span>
      )}
    </Component>
  );
}