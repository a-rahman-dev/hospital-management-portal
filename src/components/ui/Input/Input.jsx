import { forwardRef, useState, useId, useMemo } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 INPUT COMPONENT — Professional Form Input (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - Mobile-first responsive (min-h 44px touch targets)
   - Password visibility toggle (accessible)
   - Icon + loading + success + error states
   - Smooth animations
   - Full a11y (aria-invalid, aria-describedby, aria-label)
   - Char counter (optional)
   ============================================================ */

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      success,
      loading = false,
      icon = null,
      type = "text",
      className,
      containerClassName,
      id,
      required,
      disabled,
      maxLength,
      showCharCount = false,
      iconPosition = "left", // "left" | "right"
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const prefersReduced = useReducedMotion();

    /* ---- Stable ID generation (no re-render changes) ---- */
    const reactId = useId();
    const inputId = id || `input-${reactId}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    /* ---- Character counter ---- */
    const currentLength = props.value?.toString().length || 0;
    const showCounter = showCharCount && maxLength;

    /* ---- Icon color based on state ---- */
    const iconColor = useMemo(() => {
      if (error)
        return "text-rose-500 dark:text-rose-400";
      if (success)
        return "text-emerald-500 dark:text-emerald-400";
      if (isFocused)
        return "text-indigo-500 dark:text-indigo-400";
      return "text-slate-400 dark:text-slate-500";
    }, [error, success, isFocused]);

    /* ---- Build aria-describedby ---- */
    const describedBy = [
      error ? errorId : null,
      hint && !error ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        {/* Label row */}
        {(label || showCounter) && (
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "block text-xs font-bold uppercase tracking-wider transition-colors",
                  error
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-700 dark:text-slate-300"
                )}
              >
                {label}
                {required && (
                  <span className="text-rose-500 ml-1" aria-label="required">
                    *
                  </span>
                )}
              </label>
            )}
            {showCounter && (
              <span
                className={cn(
                  "text-[10px] font-black tabular-nums tracking-wider",
                  currentLength >= maxLength
                    ? "text-rose-500"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                {currentLength} / {maxLength}
              </span>
            )}
          </div>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === "left" && (
            <span
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 shrink-0",
                iconColor
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled || loading}
            required={required}
            maxLength={maxLength}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={describedBy}
            aria-required={required ? "true" : undefined}
            className={cn(
              /* Base */
              "w-full rounded-xl text-sm font-medium transition-all duration-200",
              "min-h-[44px] px-4 py-2.5",
              /* Background */
              "bg-white dark:bg-[#090f1d]",
              /* Text */
              "text-slate-900 dark:text-slate-100",
              "placeholder-slate-400 dark:placeholder-slate-500",
              /* Border */
              "border",
              /* Focus */
              "focus:outline-none focus:ring-2",
              /* Icon padding */
              icon && iconPosition === "left" && "pl-11",
              icon && iconPosition === "right" && "pr-11",
              /* Password padding */
              isPassword && "pr-11",
              /* Loading padding */
              loading && "pr-11",
              /* Error state */
              error
                ? "border-rose-400 dark:border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                : success
                ? "border-emerald-400 dark:border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                : "border-gray-200 dark:border-[#1e293b] focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500/20",
              /* Disabled */
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-[#070c18]",
              className
            )}
            {...props}
          />

          {/* Right icon / password toggle / loading spinner */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {/* Loading spinner */}
            {loading && (
              <Loader2
                size={16}
                className="animate-spin text-indigo-500"
                aria-hidden="true"
              />
            )}

            {/* Success checkmark */}
            {!loading && success && !error && (
              <motion.div
                initial={prefersReduced ? false : { scale: 0, rotate: -90 }}
                animate={prefersReduced ? false : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <CheckCircle2
                  size={16}
                  className="text-emerald-500"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </motion.div>
            )}

            {/* Password toggle */}
            {isPassword && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
                  "hover:bg-slate-100 dark:hover:bg-white/5",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                )}
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={2.5} />
                ) : (
                  <Eye size={16} strokeWidth={2.5} />
                )}
              </button>
            )}

            {/* Right icon */}
            {icon && iconPosition === "right" && !isPassword && !loading && (
              <span
                className={cn(
                  "pointer-events-none transition-colors duration-200",
                  iconColor
                )}
                aria-hidden="true"
              >
                {icon}
              </span>
            )}
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: -4 }}
              animate={prefersReduced ? false : { opacity: 1, y: 0 }}
              exit={prefersReduced ? false : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              id={errorId}
              role="alert"
              className="flex items-start gap-1.5 mt-1.5"
            >
              <AlertCircle
                size={12}
                className="text-rose-500 shrink-0 mt-0.5"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <p className="text-[11px] font-bold text-rose-500 leading-tight">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {!error && hint && (
          <p
            id={hintId}
            className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-tight"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;