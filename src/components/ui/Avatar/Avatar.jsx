import { useState, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 AVATAR COMPONENT — Professional User Avatar (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - 6 sizes (xs → 2xl)
   - Initials fallback (with Dr. stripping)
   - Consistent gradient per name (hash-based)
   - Image error handling (state-based, fixed)
   - Status indicator (5 states)
   - Ring option
   - Loading state
   - Full a11y
   - AvatarGroup with overflow + tooltip
   ============================================================ */

/* ============================================================
   🎨 BRAND GRADIENTS (Rule 5)
   ============================================================ */
const GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-fuchsia-600",
  "from-sky-500 to-indigo-600",
  "from-teal-500 to-emerald-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
];

const SIZES = {
  xs: { box: "w-6 h-6", text: "text-[9px]", dot: "w-1.5 h-1.5" },
  sm: { box: "w-8 h-8", text: "text-[10px]", dot: "w-2 h-2" },
  md: { box: "w-10 h-10", text: "text-xs", dot: "w-2.5 h-2.5" },
  lg: { box: "w-12 h-12", text: "text-sm", dot: "w-3 h-3" },
  xl: { box: "w-16 h-16", text: "text-base", dot: "w-4 h-4" },
  "2xl": { box: "w-20 h-20", text: "text-xl", dot: "w-5 h-5" },
};

const STATUS_COLORS = {
  online: "bg-emerald-500",
  offline: "bg-slate-400",
  busy: "bg-rose-500",
  away: "bg-amber-500",
  idle: "bg-amber-400",
};

const STATUS_LABELS = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
  idle: "Idle",
};

/* ============================================================
   🎯 HELPERS
   ============================================================ */

/**
 * Get initials from name (strips "Dr." prefix)
 */
function getInitials(name) {
  if (!name) return "?";
  return name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Get consistent gradient from name (full hash, not just first char)
 */
function getGradient(name) {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

/* ============================================================
   🎯 MAIN: Avatar
   ============================================================ */
export default function Avatar({
  src,
  name,
  size = "md",
  status,
  ring = false,
  className,
  alt,
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReduced = useReducedMotion();

  const initials = useMemo(() => getInitials(name), [name]);
  const gradient = useMemo(() => getGradient(name), [name]);
  const sizeConfig = SIZES[size] || SIZES.md;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const showImage = src && !imageError;

  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      title={name}
    >
      {/* Avatar body */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden",
          sizeConfig.box,
          sizeConfig.text,
          /* Ring */
          ring &&
            "ring-2 ring-white dark:ring-[#0B1220] ring-offset-2 ring-offset-white dark:ring-offset-[#0B1220]",
          /* Fallback bg */
          !showImage &&
            cn("bg-gradient-to-br text-white font-bold", gradient)
        )}
        aria-label={name || "User avatar"}
        role="img"
      >
        {showImage ? (
          <>
            {/* Image (shows when loaded) */}
            <img
              src={src}
              alt={alt || name || "Avatar"}
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Loading fallback (shows while loading) */}
            {!imageLoaded && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  "bg-gradient-to-br text-white font-bold",
                  gradient
                )}
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
          </>
        ) : (
          <span className="select-none">{initials}</span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <motion.span
          initial={prefersReduced ? false : { scale: 0 }}
          animate={prefersReduced ? false : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2",
            "ring-white dark:ring-[#0B1220]",
            STATUS_COLORS[status] || STATUS_COLORS.offline,
            sizeConfig.dot
          )}
          aria-label={STATUS_LABELS[status] || status}
          role="status"
        >
          {/* Pulse for online status */}
          {status === "online" && !prefersReduced && (
            <span
              className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-75",
                STATUS_COLORS.online
              )}
              aria-hidden="true"
            />
          )}
        </motion.span>
      )}
    </div>
  );
}

/* ============================================================
   🎯 AVATAR GROUP — Overlapping avatars with overflow
   ============================================================ */
export function AvatarGroup({
  children,
  max = 4,
  size = "md",
  className,
}) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const visible = childrenArray.slice(0, max);
  const hiddenCount = childrenArray.length - max;
  const sizeConfig = SIZES[size] || SIZES.md;

  return (
    <div className={cn("flex items-center -space-x-2 sm:-space-x-3", className)}>
      {visible.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          whileHover={{ scale: 1.1, zIndex: 10, y: -2 }}
          className={cn(
            "rounded-full transition-all",
            "ring-2 ring-white dark:ring-[#0B1220]"
          )}
          style={{ zIndex: visible.length - i }}
        >
          {child}
        </motion.div>
      ))}

      {hiddenCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: visible.length * 0.05 }}
          className={cn(
            "rounded-full font-bold flex items-center justify-center ring-2",
            "bg-slate-200 dark:bg-slate-800",
            "text-slate-700 dark:text-slate-300",
            "ring-white dark:ring-[#0B1220]",
            sizeConfig.box,
            sizeConfig.text
          )}
          title={`${hiddenCount} more ${hiddenCount === 1 ? "person" : "people"}`}
        >
          +{hiddenCount}
        </motion.div>
      )}
    </div>
  );
}