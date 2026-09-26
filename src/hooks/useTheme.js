import { useState, useEffect, useCallback, useMemo } from "react";

/* ============================================================
   🎨 useTheme Hook — Theme Management
   ============================================================
   Features:
   - Persists to localStorage
   - Respects system preference (prefers-color-scheme)
   - Syncs across browser tabs
   - Handles localStorage errors (private mode)
   - Supports "dark" | "light" | "system"
   ============================================================ */

const THEME_KEY = "patient-portal-theme";
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail
  }
}

function getSystemTheme() {
  if (typeof window === "undefined") return THEMES.DARK;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const effectiveTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;

  if (effectiveTheme === THEMES.DARK) {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    const saved = safeGetItem(THEME_KEY);
    if (
      saved === THEMES.LIGHT ||
      saved === THEMES.DARK ||
      saved === THEMES.SYSTEM
    ) {
      return saved;
    }
    return THEMES.DARK;
  });

  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const effectiveTheme = useMemo(() => {
    return theme === THEMES.SYSTEM ? systemTheme : theme;
  }, [theme, systemTheme]);

  const isDark = useMemo(
    () => effectiveTheme === THEMES.DARK,
    [effectiveTheme]
  );

  useEffect(() => {
    applyTheme(theme);
    safeSetItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e) => {
      if (e.key !== THEME_KEY || !e.newValue) return;
      if (
        e.newValue === THEMES.LIGHT ||
        e.newValue === THEMES.DARK ||
        e.newValue === THEMES.SYSTEM
      ) {
        setThemeState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (
      newTheme !== THEMES.LIGHT &&
      newTheme !== THEMES.DARK &&
      newTheme !== THEMES.SYSTEM
    ) {
      console.warn(`[useTheme] Invalid theme: ${newTheme}`);
      return;
    }
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === THEMES.SYSTEM) {
        return systemTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      }
      return prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    });
  }, [systemTheme]);

  const resetTheme = useCallback(() => {
    setThemeState(THEMES.SYSTEM);
  }, []);

  return {
    theme,
    effectiveTheme,
    isDark,
    setTheme,
    toggleTheme,
    resetTheme,
    THEMES,
  };
}

export default useTheme;
export { THEMES };