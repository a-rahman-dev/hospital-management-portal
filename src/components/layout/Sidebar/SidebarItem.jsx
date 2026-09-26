import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎯 SIDEBAR ITEM — Navigation Item (Rule 5)
   ─────────────────────────────────────────────
   Features:
   - Active route highlight
   - Nested children with expand/collapse
   - Collapsed mode with accessible tooltip
   - Badge support (number/string/node)
   - Keyboard accessible
   - Reduced motion support
   - Full a11y (aria-current, aria-expanded)
   ============================================================ */

/**
 * Check if a path is active (exact or sub-route match)
 */
function isPathActive(currentPath, targetPath) {
  if (!currentPath || !targetPath) return false;
  if (currentPath === targetPath) return true;
  // Sub-route match (e.g. /patients/123 → /patients)
  if (targetPath !== "/" && currentPath.startsWith(targetPath + "/")) {
    return true;
  }
  return false;
}

export default function SidebarItem({ item, collapsed, onItemClick }) {
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  /* ============================================================
     🎯 ACTIVE STATE DETECTION
     ============================================================ */
  const isChildActive = useMemo(() => {
    if (!hasChildren) return false;
    return item.children.some((child) =>
      isPathActive(location.pathname, child.path)
    );
  }, [hasChildren, item.children, location.pathname]);

  const isActive = useMemo(
    () => !hasChildren && isPathActive(location.pathname, item.path),
    [hasChildren, item.path, location.pathname]
  );

  const isAnyActive = isActive || isChildActive;

  /* ============================================================
     🎯 EXPAND/COLLAPSE STATE
     ============================================================ */
  const [expanded, setExpanded] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setExpanded(true);
  }, [isChildActive]);

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleClick = useCallback(() => {
    onItemClick?.();
  }, [onItemClick]);

  /* ============================================================
     🎯 BADGE RENDERING (number/string/node)
     ============================================================ */
  const renderBadge = () => {
    if (!item.badge) return null;
    return (
      <span
        className={cn(
          "text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 tabular-nums",
          isAnyActive
            ? "bg-white/20 text-white"
            : "bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-500"
        )}
      >
        {item.badge}
      </span>
    );
  };

  /* ============================================================
     🎯 TOOLTIP (collapsed mode)
     ============================================================ */
  const tooltip = collapsed ? (
    <span
      role="tooltip"
      className={cn(
        "hidden lg:block absolute left-full ml-3 px-3 py-1.5",
        "bg-slate-900 dark:bg-slate-800",
        "text-white text-xs font-semibold rounded-lg",
        "opacity-0 pointer-events-none",
        "group-hover:opacity-100 group-focus-visible:opacity-100",
        "transition-opacity whitespace-nowrap z-50",
        "shadow-xl border border-white/10"
      )}
    >
      {item.name}
      {item.badge && (
        <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
      {/* Arrow */}
      <span
        className="absolute top-1/2 right-full -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-slate-900 dark:border-r-slate-800"
        aria-hidden="true"
      />
    </span>
  ) : null;

  /* ============================================================
     🎯 PARENT WITH CHILDREN
     ============================================================ */
  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls={`submenu-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
          className={cn(
            "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
            isChildActive
              ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
          )}
        >
          <Icon
            size={19}
            strokeWidth={2.2}
            className={cn(
              "shrink-0 transition-transform group-hover:scale-110",
              isChildActive && "text-indigo-500 dark:text-indigo-400"
            )}
            aria-hidden="true"
          />

          <span className="flex-1 text-sm font-semibold truncate text-left">
            {item.name}
          </span>

          {renderBadge()}

          <ChevronDown
            size={15}
            strokeWidth={2.5}
            className={cn(
              "shrink-0 transition-transform duration-200 opacity-70",
              expanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={`submenu-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
              initial={prefersReduced ? false : { height: 0, opacity: 0 }}
              animate={prefersReduced ? false : { height: "auto", opacity: 1 }}
              exit={prefersReduced ? false : { height: 0, opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="relative ml-5 mt-1 pl-4 space-y-0.5 border-l-2 border-slate-200 dark:border-white/[0.08]">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildPathActive = isPathActive(
                    location.pathname,
                    child.path
                  );

                  return (
                    <Link
                      key={child.name}
                      to={child.path}
                      onClick={handleClick}
                      aria-current={isChildPathActive ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px]",
                        "transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                        isChildPathActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-semibold"
                          : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] font-medium"
                      )}
                    >
                      {ChildIcon && (
                        <ChildIcon
                          size={14}
                          strokeWidth={2.2}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{child.name}</span>
                      {child.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 tabular-nums",
                            isChildPathActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ============================================================
     🎯 SIMPLE ITEM (no children, or collapsed)
     ============================================================ */
  return (
    <Link
      to={item.path}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? undefined : item.name}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
        isActive
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]",
        collapsed && "lg:justify-center lg:px-2"
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50"
          transition={
            prefersReduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 30 }
          }
          aria-hidden="true"
        />
      )}

      <Icon
        size={19}
        strokeWidth={2.2}
        className={cn(
          "shrink-0 transition-transform group-hover:scale-110",
          isActive && "text-white"
        )}
        aria-hidden="true"
      />

      {!collapsed && (
        <>
          <span className="flex-1 text-sm font-semibold truncate">
            {item.name}
          </span>
          {renderBadge()}
        </>
      )}

      {tooltip}
    </Link>
  );
}