/* ============================================================
   🎨 LAYOUT COMPONENTS — Barrel Export
   ─────────────────────────────────────────────
   Clean imports for all layout components.
   
   Usage:
     import { DashboardLayout, Sidebar, Topbar } from "@/components/layout";
   ============================================================ */

/* ============================================================
   🎯 MAIN LAYOUT
   ============================================================ */

// DashboardLayout — Shell with sidebar + topbar
export { default as DashboardLayout } from "./DashboardLayout/DashboardLayout";

/* ============================================================
   🎯 SIDEBAR
   ============================================================ */

// Sidebar — Main navigation sidebar
export { default as Sidebar } from "./Sidebar/Sidebar";

// SidebarItem — Individual navigation item
export { default as SidebarItem } from "./Sidebar/SidebarItem";

/* ============================================================
   🎯 TOPBAR
   ============================================================ */

// Topbar — Top navigation bar
export { default as Topbar } from "./Topbar/Topbar";

// SearchBar — Global search input
export { default as SearchBar } from "./Topbar/SearchBar";

// Notifications — Notification dropdown
export { default as Notifications } from "./Topbar/Notifications";

// UserMenu — User dropdown menu
export { default as UserMenu } from "./Topbar/UserMenu";

// ThemeToggle — Dark/light mode toggle
export { default as ThemeToggle } from "./Topbar/ThemeToggle";

// ShiftSelector — Shift/ward selector
export { default as ShiftSelector } from "./Topbar/ShiftSelector";