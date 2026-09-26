import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 BUTTON COMPONENT — Professional Action Button (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - 8 variants (primary, secondary, outline, ghost, danger, 
     success, warning, danger-outline)
   - 4 sizes + full-width option
   - 2 shapes (rounded, pill)
   - Loading state with spinner
   - Icon support (left/right)
   - Gradient backgrounds
   - Hover animations
   - Full a11y (aria-busy, disabled, focus)
   ============================================================ */

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      shape = "rounded", // "rounded" | "pill"
      fullWidth = false,
      loading = false,
      icon = null,
      iconPosition = "left",
      className,
      disabled,
      type = "button",
      animate = true,
      ...props
    },
    ref
  ) => {
    const prefersReduced = useReducedMotion();
    const shouldAnimate = animate && !prefersReduced;

    /* ============================================================
       🎨 VARIANT STYLES (Rule 5 — Indigo palette)
       ============================================================ */
    const variants = {
      primary: cn(
        "bg-gradient-to-br from-indigo-600 to-violet-600",
        "text-white",
        "hover:from-indigo-500 hover:to-violet-500",
        "shadow-lg shadow-indigo-600/30",
        "hover:shadow-xl hover:shadow-indigo-600/40",
        "focus:ring-indigo-500/50"
      ),
      secondary: cn(
        "bg-slate-700 dark:bg-slate-600",
        "text-white",
        "hover:bg-slate-600 dark:hover:bg-slate-500",
        "shadow-lg shadow-slate-700/20",
        "focus:ring-slate-500/50"
      ),
      outline: cn(
        "border-2 border-indigo-600 dark:border-indigo-500",
        "text-indigo-600 dark:text-indigo-400",
        "bg-transparent",
        "hover:bg-indigo-600 hover:text-white",
        "dark:hover:bg-indigo-500 dark:hover:text-white",
        "focus:ring-indigo-500/50"
      ),
      ghost: cn(
        "text-slate-700 dark:text-slate-300",
        "bg-transparent",
        "hover:bg-slate-100 dark:hover:bg-white/5",
        "focus:ring-slate-500/40"
      ),
      danger: cn(
        "bg-gradient-to-br from-rose-500 to-red-600",
        "text-white",
        "hover:from-rose-400 hover:to-red-500",
        "shadow-lg shadow-rose-600/30",
        "hover:shadow-xl hover:shadow-rose-600/40",
        "focus:ring-rose-500/50"
      ),
      "danger-outline": cn(
        "border-2 border-rose-500 dark:border-rose-400",
        "text-rose-500 dark:text-rose-400",
        "bg-transparent",
        "hover:bg-rose-500 hover:text-white",
        "dark:hover:bg-rose-400 dark:hover:text-white",
        "focus:ring-rose-500/50"
      ),
      success: cn(
        "bg-gradient-to-br from-emerald-500 to-teal-600",
        "text-white",
        "hover:from-emerald-400 hover:to-teal-500",
        "shadow-lg shadow-emerald-600/30",
        "hover:shadow-xl hover:shadow-emerald-600/40",
        "focus:ring-emerald-500/50"
      ),
      warning: cn(
        "bg-gradient-to-br from-amber-500 to-orange-600",
        "text-white",
        "hover:from-amber-400 hover:to-orange-500",
        "shadow-lg shadow-amber-600/30",
        "hover:shadow-xl hover:shadow-amber-600/40",
        "focus:ring-amber-500/50"
      ),
    };

    /* ============================================================
       📏 SIZE STYLES (min 44px touch targets on mobile)
       ============================================================ */
    const sizes = {
      xs: "min-h-[32px] px-2.5 py-1 text-xs gap-1",
      sm: "min-h-[40px] sm:min-h-[36px] px-3 py-1.5 text-sm gap-1.5",
      md: "min-h-[44px] px-4 py-2.5 text-sm gap-2",
      lg: "min-h-[48px] px-5 py-3 text-base gap-2.5",
      xl: "min-h-[56px] px-6 py-3.5 text-lg gap-3",
      icon: "min-h-[44px] min-w-[44px] p-2.5",
    };

    /* ============================================================
       🔄 SHAPE STYLES
       ============================================================ */
    const shapes = {
      rounded: "rounded-xl",
      pill: "rounded-full",
    };

    /* ============================================================
       🎯 ICON SIZE MAP
       ============================================================ */
    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      icon: 18,
    };

    const iconSize = iconSizes[size] || 16;

    /* ============================================================
       🎯 RENDER
       ============================================================ */
    const buttonClass = cn(
      /* Base */
      "inline-flex items-center justify-center font-bold tracking-tight",
      "transition-all duration-200",
      "select-none cursor-pointer",
      "relative overflow-hidden",

      /* Focus */
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "dark:focus:ring-offset-[#0B1220]",

      /* Disabled */
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",

      /* Active scale */
      shouldAnimate && "active:scale-[0.97]",

      /* Full width */
      fullWidth && "w-full",

      /* Shape */
      shapes[shape] || shapes.rounded,

      /* Variant */
      variants[variant] || variants.primary,

      /* Size */
      sizes[size] || sizes.md,

      /* Custom */
      className
    );

    /* ============================================================
       🎯 CONTENT
       ============================================================ */
    const content = (
      <>
        {/* Loading spinner */}
        {loading && (
          <Loader2
            size={iconSize}
            className="animate-spin shrink-0"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}

        {/* Left icon */}
        {!loading && icon && iconPosition === "left" && (
          <span className="shrink-0 flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Children */}
        {children && <span className="inline-flex items-center">{children}</span>}

        {/* Right icon */}
        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0 flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Shimmer effect on hover (only for solid variants) */}
        {shouldAnimate &&
          ["primary", "danger", "success", "warning"].includes(variant) && (
            <span
              className={cn(
                "absolute inset-0 -translate-x-full pointer-events-none",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                "group-hover:translate-x-full transition-transform duration-700"
              )}
              aria-hidden="true"
            />
          )}
      </>
    );

    /* ============================================================
       🎯 WITH / WITHOUT ANIMATION
       ============================================================ */
    if (!shouldAnimate) {
      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          aria-busy={loading ? "true" : undefined}
          className={cn("group", buttonClass)}
          {...props}
        >
          {content}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading ? "true" : undefined}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn("group", buttonClass)}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;