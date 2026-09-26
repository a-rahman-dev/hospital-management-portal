import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* ============================================================
   🎨 CLASS NAME HELPER
   ============================================================ */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ============================================================
   📅 DATE & TIME HELPERS
   ============================================================ */

export function formatDate(date, format = "short") {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  };

  return d.toLocaleDateString("en-US", options[format] || options.short);
}

export function formatTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getRelativeTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  const diffMs = d.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const absMin = Math.abs(diffMin);
  const absHour = Math.abs(diffHour);
  const absDay = Math.abs(diffDay);
  const isPast = diffMs < 0;

  if (absMin < 1) return "Just now";
  if (absMin < 60) return isPast ? `${absMin}m ago` : `In ${absMin}m`;
  if (absHour < 24) return isPast ? `${absHour}h ago` : `In ${absHour}h`;
  if (absDay < 7) return isPast ? `${absDay}d ago` : `In ${absDay}d`;
  return formatDate(d, "short");
}

/* ============================================================
   🔢 NUMBER & CURRENCY HELPERS
   ============================================================ */

export function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "—";
  return num.toLocaleString("en-US");
}

export function formatCurrency(value, compact = false) {
  if (value === null || value === undefined) return "—";
  const num =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  if (isNaN(num)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatPercent(value, decimals = 0) {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "—";
  return `${num.toFixed(decimals)}%`;
}

/* ============================================================
   📝 STRING HELPERS
   ============================================================ */

export function capitalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getInitials(name, maxLength = 2) {
  if (!name) return "?";
  return name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, maxLength)
    .toUpperCase();
}

export function truncate(str, length = 50) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

export function generateId(prefix = "ID") {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

/* ============================================================
   🔍 SEARCH & FILTER HELPERS
   ============================================================ */

export function searchItems(items, query, keys = []) {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase().trim();

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(q);
    })
  );
}

export function sortItems(items, key, direction = "asc") {
  return [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return direction === "asc" ? -1 : 1;
    if (aStr > bStr) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/* ============================================================
   📊 DATA HELPERS
   ============================================================ */

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

export function getUniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].filter(Boolean);
}

export function sumBy(items, key) {
  return items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

export function averageBy(items, key) {
  if (items.length === 0) return 0;
  return sumBy(items, key) / items.length;
}

/* ============================================================
   ⚡ DEBOUNCE & THROTTLE
   ============================================================ */

export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, wait = 300) {
  let lastCall = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
}

/* ============================================================
   🎨 COLOR HELPERS
   ============================================================ */

export function getStatusColor(status) {
  const colors = {
    Active: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Inactive: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20",
    Pending: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    Confirmed: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Cancelled: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    Critical: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    Recovered: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    Operational: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Maintenance: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    Completed: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Scheduled: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    Urgent: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  };
  return colors[status] || colors.Inactive;
}

/* ============================================================
   🎯 DEFAULT EXPORT
   ============================================================ */
export default {
  cn,
  formatDate,
  formatTime,
  getRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  capitalize,
  getInitials,
  truncate,
  generateId,
  searchItems,
  sortItems,
  groupBy,
  getUniqueValues,
  sumBy,
  averageBy,
  debounce,
  throttle,
  getStatusColor,
};