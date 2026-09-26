import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

/* ============================================================
   ⚡ VITE CONFIG (Rule 5)
   ─────────────────────────────────────────────
   Optimized for production + fast development.
   ============================================================ */

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    /* ============================================================
       🔌 PLUGINS
       ============================================================ */
    plugins: [
      react({
        fastRefresh: true,
      }),
      tailwindcss(),
    ],

    /* ============================================================
       📁 PATH ALIASES
       ============================================================ */
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },

    /* ============================================================
       🚀 DEV SERVER
       ============================================================ */
    server: {
      port: 5173,
      open: true,
      host: true,
      strictPort: false,
      hmr: {
        overlay: true,
      },
    },

    /* ============================================================
       👀 PREVIEW SERVER
       ============================================================ */
    preview: {
      port: 4173,
      open: true,
      host: true,
    },

    /* ============================================================
       🏗️ PRODUCTION BUILD
       ============================================================ */
    build: {
      target: "es2020",
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: "esbuild",
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "charts-vendor": ["recharts"],
            "motion-vendor": ["framer-motion"],
            "forms-vendor": [
              "react-hook-form",
              "@hookform/resolvers",
              "zod",
            ],
            "data-vendor": [
              "@tanstack/react-query",
              "@tanstack/react-table",
              "axios",
            ],
            "icons-vendor": ["lucide-react", "react-icons"],
            "utils-vendor": ["clsx", "tailwind-merge", "date-fns"],
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },

      reportCompressedSize: false,
      assetsInlineLimit: 4096,
    },

    /* ============================================================
       📦 DEPENDENCY PRE-BUNDLING
       ============================================================ */
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "framer-motion",
        "lucide-react",
        "recharts",
        "clsx",
        "tailwind-merge",
      ],
      exclude: [],
    },

    /* Note: esbuild options removed (oxc is used by default in Vite v8) */

    /* ============================================================
       🌐 BASE PATH
       ============================================================ */
    base: "/",

    /* ============================================================
       📝 LOG LEVEL
       ============================================================ */
    logLevel: "info",

    /* ============================================================
       🎯 CSS CONFIG
       ============================================================ */
    css: {
      devSourcemap: true,
    },

    /* ============================================================
       🔍 DEFINE
       ============================================================ */
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});