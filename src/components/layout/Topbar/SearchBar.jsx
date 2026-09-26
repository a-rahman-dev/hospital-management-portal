import { useState, useEffect, useRef, useCallback, useId, useMemo } from "react";
import { Search, X, Command, Sparkles, Loader2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🔍 SEARCH BAR — Global Search Input (Rule 5)
   ============================================================ */

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar({
  className,
  placeholder = "Search patients, doctors, ICD codes...",
  onSearch,
  suggestions = [],
  recentSearches = [],
  loading = false,
  autoFocus = false,
}) {
  const prefersReduced = useReducedMotion();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const inputId = useId();
  const listboxId = useId();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 250);

  /* ============================================================
     🎯 FILTERED SUGGESTIONS
     ============================================================ */
  const filteredSuggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return suggestions
      .filter((s) =>
        typeof s === "string"
          ? s.toLowerCase().includes(q)
          : s.label?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [debouncedQuery, suggestions]);

  /* ============================================================
     🎯 TRIGGER SEARCH CALLBACK (debounced)
     ============================================================ */
  useEffect(() => {
    if (onSearch && debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  /* ============================================================
     🎯 ⌘K / CTRL+K SHORTCUT
     ============================================================ */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ============================================================
     🎯 CLICK OUTSIDE TO CLOSE DROPDOWN
     ============================================================ */
  useEffect(() => {
    if (!focused) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [focused]);

  /* ============================================================
     🎯 HANDLERS
     ============================================================ */
  const handleClear = useCallback(() => {
    setQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (value) => {
      if (!value.trim()) return;
      onSearch?.(value);
      setFocused(false);
      setHighlightedIndex(-1);
    },
    [onSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      const value =
        typeof suggestion === "string" ? suggestion : suggestion.label;
      setQuery(value);
      handleSubmit(value);
    },
    [handleSubmit]
  );

  const handleKeyDown = useCallback(
    (e) => {
      const list = query ? filteredSuggestions : recentSearches;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < list.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : list.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && list[highlightedIndex]) {
          handleSuggestionClick(list[highlightedIndex]);
        } else {
          handleSubmit(query);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setFocused(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
      }
    },
    [
      query,
      filteredSuggestions,
      recentSearches,
      highlightedIndex,
      handleSuggestionClick,
      handleSubmit,
    ]
  );

  /* ============================================================
     🎯 DROPDOWN VISIBILITY
     ============================================================ */
  const showDropdown =
    focused &&
    (query
      ? filteredSuggestions.length > 0 || loading
      : recentSearches.length > 0);

  const dropdownItems = query ? filteredSuggestions : recentSearches;

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-lg", className)}
      role="search"
    >
      <div
        className={cn(
          "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border",
          "min-h-[44px]",
          "transition-all duration-200",
          "bg-slate-50 dark:bg-white/[0.03]",
          "border-gray-200 dark:border-white/[0.06]",
          focused &&
            "border-indigo-500/50 ring-2 ring-indigo-500/20 bg-white dark:bg-white/[0.06]"
        )}
      >
        <Search
          size={17}
          strokeWidth={2.2}
          className={cn(
            "shrink-0 transition-colors",
            focused
              ? "text-indigo-500"
              : "text-slate-400 dark:text-slate-500"
          )}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${listboxId}-item-${highlightedIndex}`
              : undefined
          }
          aria-label="Search"
          className={cn(
            "flex-1 bg-transparent outline-none text-sm font-medium",
            "text-slate-900 dark:text-white",
            "placeholder-slate-400 dark:placeholder-slate-500",
            "[&::-webkit-search-cancel-button]:hidden",
            "[&::-webkit-search-decoration]:hidden"
          )}
        />

        {loading && (
          <Loader2
            size={15}
            className="shrink-0 animate-spin text-indigo-500"
            aria-label="Searching"
          />
        )}

        {!loading && query && (
          <motion.button
            initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
            animate={prefersReduced ? false : { scale: 1, opacity: 1 }}
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
            className={cn(
              "shrink-0 p-1 min-h-[28px] min-w-[28px] rounded-md",
              "text-slate-400 hover:text-slate-900 dark:hover:text-white",
              "hover:bg-slate-200/50 dark:hover:bg-white/5",
              "transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            )}
          >
            <X size={14} strokeWidth={2.5} />
          </motion.button>
        )}

        {!query && !focused && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <Sparkles size={11} className="text-indigo-500" aria-hidden="true" />
            <kbd
              className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5",
                "text-[10px] font-bold",
                "text-slate-500 dark:text-slate-400",
                "bg-white dark:bg-white/5",
                "rounded-md border border-gray-200 dark:border-white/10"
              )}
            >
              <Command size={9} strokeWidth={2.5} aria-hidden="true" />K
            </kbd>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? false : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            id={listboxId}
            role="listbox"
            aria-label="Search suggestions"
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "rounded-xl border overflow-hidden",
              "bg-white dark:bg-[#0F172A]",
              "border-gray-200 dark:border-white/[0.08]",
              "shadow-2xl shadow-slate-900/10 dark:shadow-black/40",
              "max-h-[320px] overflow-y-auto scrollbar-thin"
            )}
          >
            <div className="px-3 py-2 border-b border-gray-100 dark:border-white/[0.06]">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {query ? "Results" : "Recent searches"}
              </p>
            </div>

            <div className="py-1">
              {dropdownItems.map((item, i) => {
                const isString = typeof item === "string";
                const label = isString ? item : item.label;
                const subtitle = isString ? null : item.subtitle;
                const icon = isString ? null : item.icon;
                const ItemIcon = icon || (query ? Search : TrendingUp);

                return (
                  <button
                    key={i}
                    id={`${listboxId}-item-${i}`}
                    type="button"
                    role="option"
                    aria-selected={highlightedIndex === i}
                    onClick={() => handleSuggestionClick(item)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left",
                      "transition-colors",
                      highlightedIndex === i
                        ? "bg-indigo-500/10 dark:bg-indigo-500/10"
                        : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
                        highlightedIndex === i
                          ? "bg-indigo-500/20 text-indigo-500"
                          : "bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500"
                      )}
                    >
                      <ItemIcon size={14} strokeWidth={2.5} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {label}
                      </p>
                      {subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {subtitle}
                        </p>
                      )}
                    </div>

                    {highlightedIndex === i && (
                      <kbd
                        className={cn(
                          "shrink-0 px-1.5 py-0.5 text-[9px] font-black",
                          "text-indigo-500 bg-indigo-500/10",
                          "rounded border border-indigo-500/20"
                        )}
                      >
                        ↵
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>

            {query && filteredSuggestions.length === 0 && !loading && (
              <div className="px-3 py-8 text-center">
                <Search
                  size={24}
                  className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  No results for "{query}"
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}