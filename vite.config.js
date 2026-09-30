import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      "@tailwindcss/vite",
      "@tailwindcss/oxide",
      "@tailwindcss/oxide-win32-x64-msvc",
    ],
    esbuildOptions: {
      loader: {
        ".node": "empty",
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});