import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Pencil,
  Inbox,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   📊 DATA TABLE — Professional Table Component (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - Sortable columns (with case-insensitive sort)
   - Global search with clear button
   - Pagination (page size, first/prev/next/last)
   - Row click support
   - Loading skeleton
   - Empty states (no data / no results)
   - Delete warning modal (Rule 4)
   - Sticky header option
   - Full a11y
   ============================================================ */

const ROWS_OPTIONS = [10, 25, 50, 100];

/* ============================================================
   🎯 SORT COMPARATOR — Handles strings, numbers, dates
   ============================================================ */
function compareValues(a, b) {
  // Handle nulls
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  // Numbers
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // Dates (ISO strings)
  if (typeof a === "string" && typeof b === "string") {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!isNaN(dateA) && !isNaN(dateB) && a.length >= 10) {
      return dateA - dateB;
    }
  }

  // Case-insensitive string comparison
  const strA = String(a).toLowerCase();
  const strB = String(b).toLowerCase();
  if (strA < strB) return -1;
  if (strA > strB) return 1;
  return 0;
}

/* ============================================================
   Loading Skeleton
   ============================================================ */
function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          className="border-b border-gray-100 dark:border-white/[0.04]"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-3 sm:px-4 py-3">
              <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ============================================================
   Empty State
   ============================================================ */
function EmptyState({ message, isSearching, onClear }) {
  const prefersReduced = useReducedMotion();

  return (
    <tr>
      <td colSpan={100} className="py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center">
              <Inbox
                size={32}
                className="text-slate-300 dark:text-slate-600"
                strokeWidth={1.5}
              />
            </div>
            {!prefersReduced && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-indigo-500/10"
                aria-hidden="true"
              />
            )}
          </div>

          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {message}
          </p>

          {isSearching && onClear && (
            <button
              onClick={onClear}
              className="mt-1 text-xs font-black tracking-wider uppercase text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   🎯 MAIN: DataTable
   ============================================================ */
export default function DataTable({
  title,
  subtitle,
  columns = [],
  data = [],
  searchKeys = [],
  onAdd,
  onEdit,
  onDelete,
  onRowClick,
  addLabel = "Add New",
  emptyMessage = "No records found",
  pageSize: initialPageSize = 10,
  loading = false,
  stickyHeader = false,
  className,
}) {
  const prefersReduced = useReducedMotion();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  /* ============================================================
     🎯 FILTER + SORT (memoized)
     ============================================================ */
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase().trim();
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key] || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const result = compareValues(a[sortKey], b[sortKey]);
      return sortDir === "asc" ? result : -result;
    });
  }, [filtered, sortKey, sortDir]);

  /* ============================================================
     🎯 PAGINATION (with clamping)
     ============================================================ */
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  // Reset page if it goes out of bounds
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sorted.length);
  const paginated = sorted.slice(startIndex, endIndex);

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortKey]
  );

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const handleRowKeyDown = useCallback(
    (e, row) => {
      if (!onRowClick) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  /* ============================================================
     🎯 COLUMN COUNT (for colSpan)
     ============================================================ */
  const hasActions = onEdit || onDelete;
  const totalColumns = columns.length + (hasActions ? 1 : 0);
  const isEmpty = paginated.length === 0;
  const isSearching = search.trim().length > 0;

  /* ============================================================
     🎯 SORT ICON
     ============================================================ */
  const SortIcon = ({ column }) => {
    if (column.sortable === false) return null;
    if (sortKey === column.key) {
      return sortDir === "asc" ? (
        <ArrowUp size={11} className="text-indigo-500" />
      ) : (
        <ArrowDown size={11} className="text-indigo-500" />
      );
    }
    return (
      <ArrowUpDown
        size={11}
        className="text-slate-400 dark:text-slate-600"
      />
    );
  };

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm dark:shadow-xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="min-w-0">
          {title && (
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              icon={<Search size={15} />}
              containerClassName="w-full"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Add Button */}
          {onAdd && (
            <Button
              icon={<Plus size={15} />}
              onClick={onAdd}
              size="md"
              className="shrink-0"
            >
              <span className="hidden sm:inline">{addLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead
            className={cn(
              "bg-slate-50 dark:bg-white/[0.02]",
              stickyHeader && "sticky top-0 z-10"
            )}
          >
            <tr className="border-b border-gray-100 dark:border-white/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "text-left px-3 sm:px-4 py-3 text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.1em] whitespace-nowrap",
                    col.sortable !== false &&
                      "cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors",
                    col.className
                  )}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon column={col} />
                  </div>
                </th>
              ))}

              {hasActions && (
                <th
                  scope="col"
                  className="text-right px-3 sm:px-4 py-3 text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.1em] whitespace-nowrap"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableSkeleton rows={pageSize} cols={totalColumns} />
            ) : isEmpty ? (
              <EmptyState
                message={
                  isSearching
                    ? `No results for "${search}"`
                    : emptyMessage
                }
                isSearching={isSearching}
                onClear={handleClearSearch}
              />
            ) : (
              paginated.map((row, idx) => (
                <motion.tr
                  key={row.id ?? idx}
                  initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                  animate={prefersReduced ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick ? (e) => handleRowKeyDown(e, row) : undefined
                  }
                  role={onRowClick ? "button" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-label={onRowClick ? `View row ${idx + 1}` : undefined}
                  className={cn(
                    "border-b border-gray-100 dark:border-white/[0.04] last:border-0",
                    "hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors",
                    "focus:outline-none focus:bg-slate-50 dark:focus:bg-white/[0.03]",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 sm:px-4 py-3 text-sm text-slate-700 dark:text-slate-300",
                        col.cellClassName
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}

                  {hasActions && (
                    <td
                      className="px-3 sm:px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <motion.button
                            whileHover={prefersReduced ? {} : { scale: 1.1 }}
                            whileTap={prefersReduced ? {} : { scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            aria-label={`Edit row ${idx + 1}`}
                            title="Edit"
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                          >
                            <Pencil size={15} strokeWidth={2.5} />
                          </motion.button>
                        )}

                        {onDelete && (
                          <motion.button
                            whileHover={prefersReduced ? {} : { scale: 1.1 }}
                            whileTap={prefersReduced ? {} : { scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                            aria-label={`Delete row ${idx + 1}`}
                            title="Delete"
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                          >
                            <Trash2 size={15} strokeWidth={2.5} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 flex-wrap justify-center sm:justify-start">
          <span className="font-bold">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Rows per page"
            className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/[0.08] rounded-lg px-2 py-1 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
          >
            {ROWS_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="font-medium tabular-nums">
            {sorted.length > 0
              ? `${startIndex + 1}–${endIndex} of ${sorted.length}`
              : "0 of 0"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1 || loading}
            onClick={() => setPage(1)}
            aria-label="First page"
            className="hidden sm:inline-flex"
          >
            <ChevronsLeft size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </Button>

          <span className="text-xs text-slate-600 dark:text-slate-400 px-1.5 tabular-nums">
            <span className="font-black text-slate-900 dark:text-white">
              {page}
            </span>{" "}
            / {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage(totalPages)}
            aria-label="Last page"
            className="hidden sm:inline-flex"
          >
            <ChevronsRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}