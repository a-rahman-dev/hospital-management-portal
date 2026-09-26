import { memo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Pill,
  FlaskConical,
  DollarSign,
  Stethoscope,
  Baby,
  Scissors,
  Hospital,
  UserCog,
  Shield,
  Settings,
  ArrowRight,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 MODULES SHOWCASE (Rule 5)
   ─────────────────────────────────────────────
   Palette: Multi-color per module (semantic)
   ============================================================ */

/* ============================================================
   🎯 MODULES DATA (Rule 3)
   ============================================================ */
const modules = [
  {
    id: 1,
    name: "Patient Directory",
    description: "Complete patient management",
    icon: Users,
    path: "/patients",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.35)",
    hex: "#06b6d4",
    count: "1,248",
  },
  {
    id: 2,
    name: "Appointments",
    description: "Smart scheduling system",
    icon: Calendar,
    path: "/patients/appointments",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.35)",
    hex: "#10b981",
    count: "318",
  },
  {
    id: 3,
    name: "Medications",
    description: "Prescription tracking",
    icon: Pill,
    path: "/patients/medications",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.35)",
    hex: "#8b5cf6",
    count: "892",
  },
  {
    id: 4,
    name: "Lab Reports",
    description: "Diagnostic results",
    icon: FlaskConical,
    path: "/patients/lab-reports",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
    hex: "#f43f5e",
    count: "425",
  },
  {
    id: 5,
    name: "Billing",
    description: "Revenue cycle mgmt",
    icon: DollarSign,
    path: "/patients/billing",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
    hex: "#f59e0b",
    count: "124",
  },
  {
    id: 6,
    name: "ICD Codes",
    description: "Diagnostic coding",
    icon: Stethoscope,
    path: "/icd",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glow: "rgba(59, 130, 246, 0.35)",
    hex: "#3b82f6",
    count: "14.5K",
  },
  {
    id: 7,
    name: "OBGYN Diagnosis",
    description: "Women's health registry",
    icon: Baby,
    path: "/obgyn",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    glow: "rgba(236, 72, 153, 0.35)",
    hex: "#ec4899",
    count: "68",
  },
  {
    id: 8,
    name: "Procedures",
    description: "CPT procedures registry",
    icon: Scissors,
    path: "/procedures",
    gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
    glow: "rgba(249, 115, 22, 0.35)",
    hex: "#f97316",
    count: "210",
  },
  {
    id: 9,
    name: "Facilities",
    description: "Hospital branches",
    icon: Hospital,
    path: "/facilities",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)",
    glow: "rgba(20, 184, 166, 0.35)",
    hex: "#14b8a6",
    count: "15",
  },
  {
    id: 10,
    name: "Providers",
    description: "Doctors & specialists",
    icon: UserCog,
    path: "/providers",
    gradient: "linear-gradient(135deg, #6366f1 0%, #2563eb 100%)",
    glow: "rgba(99, 102, 241, 0.35)",
    hex: "#6366f1",
    count: "42",
  },
  {
    id: 11,
    name: "Insurance",
    description: "Payer management",
    icon: Shield,
    path: "/insurance",
    gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
    glow: "rgba(239, 68, 68, 0.35)",
    hex: "#ef4444",
    count: "20",
  },
  {
    id: 12,
    name: "Module Management",
    description: "System configuration",
    icon: Settings,
    path: "/modules",
    gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    glow: "rgba(100, 116, 139, 0.35)",
    hex: "#64748b",
    count: "15",
  },
];

/* ============================================================
   🎯 MODULE CARD (memoized)
   ============================================================ */
const ModuleCard = memo(function ModuleCard({ module, index, onNavigate }) {
  const Icon = module.icon;
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onNavigate(module.path)}
      initial={prefersReduced ? false : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={prefersReduced ? false : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={prefersReduced ? {} : { y: -6, scale: 1.03 }}
      whileTap={prefersReduced ? {} : { scale: 0.98 }}
      aria-label={`${module.name}: ${module.description}. ${module.count} records. Click to open.`}
      className="group relative text-left cursor-pointer w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded-2xl"
    >
      {/* Glow */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${module.glow} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative h-full p-4 sm:p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 overflow-hidden">
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: module.gradient }}
          aria-hidden="true"
        />

        {/* Icon + count */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={cn(
              "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0",
              !prefersReduced &&
                "transition-transform duration-300 group-hover:scale-110"
            )}
            style={{
              background: module.gradient,
              boxShadow: `0 8px 20px ${module.glow}`,
            }}
          >
            <Icon size={18} className="text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>

          <div className="px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] shrink-0">
            <span
              className="text-[10px] font-black tabular-nums"
              style={{ color: module.hex }}
            >
              {module.count}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-white mb-1 tracking-tight truncate">
          {module.name}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
          {module.description}
        </p>

        {/* Arrow + Open */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-[10px] font-black tracking-wider uppercase",
              !prefersReduced
                ? "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                : "opacity-70"
            )}
            style={{ color: module.hex }}
          >
            Open
          </span>
          <ArrowRight
            size={12}
            strokeWidth={2.5}
            className={cn(
              !prefersReduced
                ? "transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
                : "opacity-70"
            )}
            style={{ color: module.hex }}
            aria-hidden="true"
          />
        </div>

        {/* Bottom corner accent */}
        <div
          className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-25 blur-2xl transition-opacity duration-500 pointer-events-none"
          style={{ background: module.hex }}
          aria-hidden="true"
        />
      </div>
    </motion.button>
  );
});

/* ============================================================
   🎯 MAIN: ModulesShowcase
   ============================================================ */
export default function ModulesShowcase() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <section className="relative py-16 sm:py-24 bg-[#0b1220] overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* Ambient orb (disabled on reduced motion) */}
      {!prefersReduced && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #06b6d4 0%, #8b5cf6 50%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            SECTION HEADER
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-4">
            <LayoutGrid size={14} className="text-cyan-400" aria-hidden="true" />
            <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em] uppercase">
              12 Integrated Modules
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Explore Every{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-blue-500 bg-clip-text text-transparent">
              Module
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Click any module to jump directly into that section of the portal.
            Each designed with real-world clinical workflows.
          </p>
        </motion.div>

        {/* ============================================================
            MODULES GRID
           ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {modules.map((module, idx) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={idx}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* ============================================================
            BOTTOM CTA
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-600 text-white font-bold shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all hover:scale-105 active:scale-95 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              aria-hidden="true"
            />
            <Sparkles size={18} className="relative z-10" aria-hidden="true" />
            <span className="relative z-10">Enter Full Portal</span>
            <ArrowRight
              size={18}
              className={cn(
                "relative z-10",
                !prefersReduced &&
                  "transition-transform group-hover:translate-x-1"
              )}
              aria-hidden="true"
            />
          </button>

          <p className="text-xs text-slate-500 mt-4">
            12 modules • 40+ pages • Real hospital workflows
          </p>
        </motion.div>
      </div>
    </section>
  );
}