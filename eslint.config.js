import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

/* ============================================================
   🎯 ESLINT CONFIG (Rule 5)
   ─────────────────────────────────────────────
   Modern flat config for React 19 + Vite + Tailwind v4.
   
   Rules:
   - JS recommended
   - React Hooks (exhaustive-deps, rules-of-hooks)
   - React Refresh (Vite HMR safety)
   - Custom: no-console, no-var, prefer-const, unused-vars
   ============================================================ */

export default defineConfig([
  /* ============================================================
     🚫 GLOBAL IGNORES
     ============================================================ */
  globalIgnores([
    "dist",
    "build",
    "coverage",
    "node_modules",
    ".vite",
    "_trash",
    "**/*.min.js",
    "**/*.config.js", // Config files themselves
  ]),

  /* ============================================================
     🎯 MAIN CONFIG — JS/JSX files
     ============================================================ */
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node, // For config files
        __APP_VERSION__: "readonly", // From vite.config.js define
        __BUILD_TIME__: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      /* ============================================================
         🎯 JAVASCRIPT BEST PRACTICES
         ============================================================ */

      /* No var — use let/const */
      "no-var": "error",

      /* Prefer const when not reassigned */
      "prefer-const": "error",

      /* No console.log in code (warn — Vite drops them in prod anyway) */
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],

      /* No debugger statements */
      "no-debugger": "error",

      /* Prefer === over == */
      eqeqeq: ["error", "always", { null: "ignore" }],

      /* No unused vars (allow _ prefix) */
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      /* No unreachable code */
      "no-unreachable": "error",

      /* No duplicate keys */
      "no-dupe-keys": "error",

      /* No duplicate imports */
      "no-duplicate-imports": "error",

      /* No useless catch */
      "no-useless-catch": "warn",

      /* No empty blocks */
      "no-empty": ["error", { allowEmptyCatch: true }],

      /* No fallthrough in switch */
      "no-fallthrough": "error",

      /* No case declarations without block */
      "no-case-declarations": "error",

      /* Consistent brace style */
      curly: ["error", "multi-line"],

      /* ============================================================
         🎯 REACT BEST PRACTICES
         ============================================================ */

      /* Disable prop-types (React 19 — use TS or JSDoc) */
      "react/prop-types": "off",

      /* Warning: JSX keys missing in lists */
      "react/jsx-key": "error",

      /* No array index as key (warn — sometimes OK) */
      "react/no-array-index-key": "off", // Optional — turn on for strict

      /* No unknown DOM props */
      "react/no-unknown-property": "error",

      /* Self-closing components */
      "react/self-closing-comp": [
        "warn",
        { component: true, html: true },
      ],

      /* Fragment shorthand */
      "react/jsx-fragments": ["warn", "syntax"],

      /* No target="_blank" without rel="noopener noreferrer" */
      "react/jsx-no-target-blank": [
        "error",
        { allowReferrer: false },
      ],

      /* No dangerous innerHTML */
      "react/no-danger": "warn",

      /* ============================================================
         🎯 REACT HOOKS
         ============================================================ */

      /* Already from reactHooks.configs.flat.recommended — kept here for clarity */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* ============================================================
         🎯 MODERN JS
         ============================================================ */

      /* Prefer arrow functions */
      "prefer-arrow-callback": "warn",

      /* Prefer template literals */
      "prefer-template": "warn",

      /* Object shorthand */
      "object-shorthand": ["warn", "always"],

      /* Prefer spread over apply */
      "prefer-spread": "warn",

      /* No new for non-constructor */
      "no-new": "off",

      /* No shadowing (warn — common with `_`) */
      "no-shadow": [
        "warn",
        {
          builtinGlobals: false,
          hoist: "functions",
          allow: ["_"],
        },
      ],

      /* No nested ternaries (keep readable) */
      "no-nested-ternary": "off", // Sometimes needed

      /* No unused expressions */
      "no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
  },

  /* ============================================================
     🎯 CONFIG FILES (relaxed rules)
     ============================================================ */
  {
    files: ["*.config.js", "vite.config.js", "eslint.config.js"],
    rules: {
      "no-console": "off",
      "no-undef": "off",
    },
  },

  /* ============================================================
     🎯 TEST FILES (if any)
     ============================================================ */
  {
    files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
]);