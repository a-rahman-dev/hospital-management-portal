import { forwardRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 CARD COMPONENT — Professional Card (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - Multiple variants (default, elevated, glass, bordered, gradient)
   - Hover effects (lift, glow, border)
   - Clickable cards
   - Header/Title/Subtitle/Body/Footer
   - Accent bar (top gradient)
   - Full a11y
   ============================================================ */

const VARIANT_STYLES = {
  default: cn(
    "bg-white dark:bg-[#0F172A]",
    "border border-gray-200 dark:border-white/[0.08]",
    "shadow-sm dark:shadow-lg"
  ),
  elevated: cn(
    "bg-white dark:bg-[#0F172A]",
    "border border-gray-200 dark:border-white/[0.08]",
    "shadow-lg dark:shadow-2xl",
    "shadow-slate-900/5 dark:shadow-black/40"
  ),
  glass: cn(
    "bg-white/70 dark:bg-white/[0.03]",
    "backdrop-blur-xl",
    "border border-white/40 dark:border-white/10",
    "shadow-lg shadow-slate-900/5 dark:shadow-black/30"
  ),
  bordered: cn(
    "bg-white dark:bg-[#0F172A]",
    "border-2 border-gray-200 dark:border-white/10"
  ),
  gradient: cn(
    "bg-gradient-to-br from-white to-slate-50",
    "dark:from-[#0F172A] dark:to-[#0B1220]",
    "border border-gray-200 dark:border-white/[0.08]",
    "shadow-md"
  ),
  flat: cn(
    "bg-slate-50 dark:bg-white/[0.02]",
    "border border-transparent"
  ),
};

const HOVER_STYLES = {
  lift: "hover:-translate-y-1 hover:shadow-xl",
  glow: "hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/40",
  border: "hover:border-indigo-500/50 dark:hover:border-indigo-500/50",
  scale: "hover:scale-[1.02]",
  none: "",
};

const PADDING_STYLES = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
};

/* ============================================================
   🎯 MAIN: Card
   ============================================================ */
const Card = forwardRef(
  (
    {
      children,
      className,
      variant = "default",
      padding = "none", // padding is applied to CardBody usually
      hover = false,
      hoverStyle = "lift",
      clickable = false,
      accent = false,
      accentColor = "from-indigo-500 via-violet-500 to-purple-500",
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const prefersReduced = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    const isInteractive = clickable || !!onClick;
    const hoverClass = hover && HOVER_STYLES[hoverStyle] ? HOVER_STYLES[hoverStyle] : "";

    const Component = isInteractive ? "button" : "div";

    return (
      <Component
        ref={ref}
        type={isInteractive ? "button" : undefined}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={
          onKeyDown ||
          (isInteractive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e);
                }
              }
            : undefined)
        }
        className={cn(
          /* Base */
          "relative rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-out",

          /* Variant */
          VARIANT_STYLES[variant] || VARIANT_STYLES.default,

          /* Padding */
          PADDING_STYLES[padding] || "",

          /* Hover */
          hoverClass,

          /* Interactive */
          isInteractive && [
            "cursor-pointer text-left w-full",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2",
            "dark:focus:ring-offset-[#0B1220]",
          ],

          /* Reduced motion */
          prefersReduced && "transition-none",

          className
        )}
        {...props}
      >
        {/* Accent bar */}
        {accent && (
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1 z-10",
              "bg-gradient-to-r opacity-70 group-hover:opacity-100 transition-opacity",
              accentColor
            )}
            aria-hidden="true"
          />
        )}

        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

/* ============================================================
   🎯 CardHeader — Header with optional action slot
   ============================================================ */
export function CardHeader({ children, className, action, accent = false }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4",
        "px-4 sm:px-5 py-4",
        "border-b border-gray-200 dark:border-white/[0.08]",
        accent && "pt-5",
        className
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ============================================================
   🎯 CardTitle
   ============================================================ */
export function CardTitle({ children, className, icon: Icon }) {
  return (
    <h3
      className={cn(
        "text-base font-black text-slate-900 dark:text-white tracking-tight",
        "flex items-center gap-2 min-w-0",
        className
      )}
    >
      {Icon && (
        <span className="shrink-0 text-indigo-500">
          <Icon size={18} strokeWidth={2.5} />
        </span>
      )}
      <span className="truncate">{children}</span>
    </h3>
  );
}

/* ============================================================
   🎯 CardSubtitle
   ============================================================ */
export function CardSubtitle({ children, className }) {
  return (
    <p
      className={cn(
        "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate",
        className
      )}
    >
      {children}
    </p>
  );
}

/* ============================================================
   🎯 CardBody
   ============================================================ */
export function CardBody({ children, className, padding = "md" }) {
  return (
    <div className={cn(PADDING_STYLES[padding] || PADDING_STYLES.md, className)}>
      {children}
    </div>
  );
}

/* ============================================================
   🎯 CardFooter
   ============================================================ */
export function CardFooter({ children, className, align = "end" }) {
  const alignClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  }[align] || "justify-end";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 sm:gap-3",
        alignClass,
        "px-4 sm:px-5 py-3 sm:py-4",
        "bg-slate-50/50 dark:bg-white/[0.02]",
        "border-t border-gray-200 dark:border-white/[0.08]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;