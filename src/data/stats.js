import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  Activity,
  FileCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

/* ============================================================
   🎨 STATS DATA — Dashboard Stats Grid
   ─────────────────────────────────────────────
   Colors match StatsCard variants:
   indigo | emerald | amber | cyan | rose | purple | blue | emeraldGold
   
   Foreign data + real-looking numbers (Rule 3)
   ============================================================ */

export const stats = [
  /* ============================================================
     1. TOTAL PATIENTS — Hero stat
     ============================================================ */
  {
    id: "stat-total-patients",
    label: "Total Patients",
    value: "1,248",
    rawValue: 1248,
    format: "number",           // number | currency | percentage
    change: "+12.5%",
    trend: "up",
    priority: "high",
    icon: Users,
    color: "indigo",
    context: "vs last week",
    lastUpdated: "2 min ago",
    sparkline: [180, 220, 195, 260, 290, 340, 420],
    breakdown: [
      { label: "New this week", value: "42" },
      { label: "Returning", value: "186" },
      { label: "Inactive", value: "23" },
      { label: "Critical", value: "8" },
      { label: "Discharged", value: "12" },
    ],
  },

  /* ============================================================
     2. ACTIVE PROVIDERS
     ============================================================ */
  {
    id: "stat-active-providers",
    label: "Active Providers",
    value: "42",
    rawValue: 42,
    format: "number",
    change: "+3.2%",
    trend: "up",
    priority: "medium",
    icon: Stethoscope,
    color: "purple",
    context: "vs last week",
    lastUpdated: "5 min ago",
    sparkline: [38, 39, 40, 40, 41, 41, 42],
    breakdown: [
      { label: "On duty", value: "28" },
      { label: "Off duty", value: "10" },
      { label: "On leave", value: "4" },
      { label: "Pending", value: "0" },
      { label: "New hires", value: "2" },
    ],
  },

  /* ============================================================
     3. SCHEDULED VISITS
     ============================================================ */
  {
    id: "stat-scheduled-visits",
    label: "Scheduled Visits",
    value: "318",
    rawValue: 318,
    format: "number",
    change: "+6.8%",
    trend: "up",
    priority: "high",
    icon: Calendar,
    color: "emerald",
    context: "Scrubbed & ready",
    lastUpdated: "1 min ago",
    sparkline: [280, 290, 305, 295, 310, 318, 318],
    breakdown: [
      { label: "Confirmed", value: "186" },
      { label: "Pending", value: "98" },
      { label: "Rescheduled", value: "14" },
      { label: "Waitlist", value: "12" },
      { label: "No-show", value: "8" },
    ],
  },

  /* ============================================================
     4. IN PROGRESS — Real-time activity
     ============================================================ */
  {
    id: "stat-in-progress",
    label: "In Progress",
    value: "94",
    rawValue: 94,
    format: "number",
    change: "+4.1%",
    trend: "up",
    priority: "high",
    icon: Activity,
    color: "amber",
    context: "Currently in rooms",
    lastUpdated: "Just now",
    sparkline: [72, 78, 82, 85, 88, 92, 94],
    breakdown: [
      { label: "In consultation", value: "42" },
      { label: "In triage", value: "28" },
      { label: "In waiting", value: "18" },
      { label: "In procedure", value: "4" },
      { label: "Overdue", value: "2" },
    ],
  },

  /* ============================================================
     5. COMPLETED ENCOUNTERS
     ============================================================ */
  {
    id: "stat-completed-encounters",
    label: "Completed Encounters",
    value: "1,247",
    rawValue: 1247,
    format: "number",
    change: "+8.9%",
    trend: "up",
    priority: "medium",
    icon: FileCheck,
    color: "cyan",
    context: "85% of daily target",
    lastUpdated: "3 min ago",
    sparkline: [980, 1050, 1120, 1180, 1200, 1230, 1247],
    breakdown: [
      { label: "Signed off", value: "1,182" },
      { label: "Pending sign", value: "48" },
      { label: "Amended", value: "12" },
      { label: "Draft", value: "5" },
      { label: "Archived", value: "0" },
    ],
  },

  /* ============================================================
     6. CANCELLED / NO-SHOW — Down trend (good!)
     ============================================================ */
  {
    id: "stat-cancelled-noshow",
    label: "Cancelled / No-Show",
    value: "24",
    rawValue: 24,
    format: "number",
    change: "-2.4%",
    trend: "down",
    priority: "low",
    icon: Clock,
    color: "rose",
    context: "vs last week",
    lastUpdated: "8 min ago",
    sparkline: [38, 34, 32, 30, 28, 26, 24],
    breakdown: [
      { label: "Patient cancel", value: "14" },
      { label: "Provider cancel", value: "4" },
      { label: "No-show", value: "5" },
      { label: "Weather", value: "1" },
      { label: "Other", value: "0" },
    ],
  },

  /* ============================================================
     7. PENDING CLAIMS
     ============================================================ */
  {
    id: "stat-pending-claims",
    label: "Pending Claims",
    value: "47",
    rawValue: 47,
    format: "number",
    change: "+8.2%",
    trend: "up",
    priority: "medium",
    icon: FileCheck,
    color: "blue",
    context: "Awaiting payer review",
    lastUpdated: "6 min ago",
    sparkline: [30, 32, 35, 38, 42, 44, 47],
    breakdown: [
      { label: "In review", value: "18" },
      { label: "Awaiting payer", value: "15" },
      { label: "Denied", value: "8" },
      { label: "Appealed", value: "4" },
      { label: "Over 30 days", value: "2" },
    ],
  },

  /* ============================================================
     8. REVENUE (MTD) — Currency stat
     ============================================================ */
  {
    id: "stat-revenue-mtd",
    label: "Revenue (MTD)",
    value: "$42,850",
    rawValue: 42850,
    format: "currency",          // tells StatsCard to treat as $
    currency: "USD",
    change: "+18.3%",
    trend: "up",
    priority: "high",
    icon: DollarSign,
    color: "emeraldGold",
    context: "Month to date",
    lastUpdated: "Just now",
    sparkline: [18000, 22000, 26000, 30000, 34000, 38000, 42850],
    breakdown: [
      { label: "Insurance", value: "$32,200" },
      { label: "Self-pay", value: "$6,150" },
      { label: "Copays", value: "$3,800" },
      { label: "Pending", value: "$700" },
      { label: "Refunds", value: "-$240" },
    ],
  },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

/**
 * Get stats sorted by priority (high → medium → low)
 * Useful for mobile views where only top stats show
 */
export const getStatsByPriority = () => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...stats].sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );
};

/**
 * Get only high-priority stats (for compact mobile view)
 */
export const getHighPriorityStats = () =>
  stats.filter((s) => s.priority === "high");

/**
 * Get stat by ID
 */
export const getStatById = (id) => stats.find((s) => s.id === id);

/**
 * Get stats by color family
 */
export const getStatsByColor = (color) =>
  stats.filter((s) => s.color === color);

/* ============================================================
   📊 DEFAULT EXPORT — for convenience
   ============================================================ */
export default stats;