import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

/* ============================================================
   🎯 REACT QUERY CLIENT (Rule 3 — installed but not used!)
   ─────────────────────────────────────────────
   Configure global data fetching defaults.
   ============================================================ */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /* Don't refetch too aggressively */
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
    },
  },
});

/* ============================================================
   🎯 INITIAL THEME (Rule 5 — prevent flash on load)
   ─────────────────────────────────────────────
   Apply theme BEFORE React renders to avoid FOUC.
   ============================================================ */
(function initializeTheme() {
  try {
    const THEME_KEY = "patient-portal-theme";
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const effectiveTheme =
      saved === "system" || !saved
        ? prefersDark
          ? "dark"
          : "light"
        : saved;

    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch {
    // Silent fail — use default
  }
})();

/* ============================================================
   🎯 ROOT RENDER (Rule 2 — professional structure)
   ─────────────────────────────────────────────
   Order:
   1. ErrorBoundary (outermost — catches everything)
   2. React Query (data layer)
   3. BrowserRouter (routing)
   4. App (routes + layout)
   ============================================================ */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure your index.html has a <div id=\"root\"></div>"
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);