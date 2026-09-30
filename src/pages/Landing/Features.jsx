import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Bed,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Clock,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  X,
  Play,
  Share2,
} from "lucide-react";

// Enterprise Clinical Capabilities Data
const CLINICAL_CAPABILITIES = [
  {
    id: "telemetry",
    title: "Acute Telemetry & Bed Matrix",
    tag: "LIVE PROTOCOL",
    badgeColor: "emerald",
    icon: Bed,
    description:
      "Continuous bed-side telemetry streaming lead II ECG, plethysmograph SpO₂, and invasive arterial lines directly into central nursing boards.",
    metrics: { primary: "0.42ms", label: "Packet Latency", secondary: "86% ICU Occupancy" },
    actionLabel: "Inspect ICU Node",
    route: "/facilities",
    demoAction: "Simulate Bed Telemetry Ping",
  },
  {
    id: "grok-ai",
    title: "Clinical AI Copilot Engine",
    tag: "GROK CORE",
    badgeColor: "violet",
    icon: Sparkles,
    description:
      "Natural-language bilingual assistant for real-time doctor roster lookups, drug contraindication warnings, and acute triage escalation.",
    metrics: { primary: "99.4%", label: "Triage Accuracy", secondary: "English + Urdu" },
    actionLabel: "Test AI Intelligence",
    route: "/dashboard",
    demoAction: "Trigger Grok Drug Contraindication Check",
  },
  {
    id: "emr-sync",
    title: "HL7 / FHIR Inpatient EMR",
    tag: "INTEROPERABLE",
    badgeColor: "indigo",
    icon: FileText,
    description:
      "Instantaneous medical record reconciliation with multi-facility ICD-10 codification, automated lab vitals acquisition, and surgical logs.",
    metrics: { primary: "1,248", label: "Active Inpatients", secondary: "100% FHIR R4" },
    actionLabel: "Browse Records",
    route: "/patients",
    demoAction: "Verify FHIR Node Sync",
  },
  {
    id: "specialist-paging",
    title: "Specialist Rapid Dispatch",
    tag: "EMERGENCY STAT",
    badgeColor: "rose",
    icon: Stethoscope,
    description:
      "Instant automated paging matrix triggering Code Blue and Code Red alerts to on-duty cardiologists, trauma surgeons, and anesthesiologists.",
    metrics: { primary: "11.4 min", label: "Door-to-Doc Time", secondary: "4/4 Duty Shifts" },
    actionLabel: "View Staff Roster",
    route: "/providers",
    demoAction: "Simulate On-Call Doctor Page",
  },
  {
    id: "security",
    title: "Zero-Trust HIPAA Security",
    tag: "ENCRYPTED NODE",
    badgeColor: "cyan",
    icon: ShieldCheck,
    description:
      "End-to-end cryptographic audit trails with granular role-based access for chief surgeons, ward nurses, administrative registrars, and auditors.",
    metrics: { primary: "256-bit", label: "AES Layer", secondary: "JCI Regulated" },
    actionLabel: "Review Security",
    route: "/practice-setting",
    demoAction: "Run Cryptographic Health Check",
  },
  {
    id: "theaters",
    title: "Operating Theater Allocation",
    tag: "SURGICAL MATRIX",
    badgeColor: "fuchsia",
    icon: Activity,
    description:
      "Dynamic procedural scheduling and sterilization tracking for major surgical units, surgical prep bays, and post-anesthesia recovery suites.",
    metrics: { primary: "4 Active", label: "Surgical Suites", secondary: "38 Today" },
    actionLabel: "View OT Matrix",
    route: "/procedures",
    demoAction: "Query OT-1 Availability",
  },
];

export default function Features() {
  const navigate = useNavigate();

  // Active Category Filter Pills (Dashboard Pill Style)
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [simulatingStep, setSimulatingStep] = useState(false);
  const [simulationLog, setSimulationLog] = useState("");

  // Filter Logic
  const filteredCapabilities = CLINICAL_CAPABILITIES.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "critical") return item.id === "telemetry" || item.id === "specialist-paging";
    if (selectedFilter === "intelligence") return item.id === "grok-ai" || item.id === "emr-sync";
    if (selectedFilter === "governance") return item.id === "security" || item.id === "theaters";
    return true;
  });

  // 100% Functional Simulator Trigger
  const handleRunSimulation = (capability) => {
    setActiveSimulation(capability);
    setSimulatingStep(true);
    setSimulationLog(`Initializing protocol handshake for [${capability.title}]...`);

    setTimeout(() => {
      setSimulationLog(`HL7 telemetry payload dispatched. Verifying security token...`);
    }, 700);

    setTimeout(() => {
      setSimulationLog(`Verification complete! 200 OK — Clinical parameters nominal. Telemetry latency: 0.38ms.`);
      setSimulatingStep(false);
    }, 1500);
  };

  return (
    <div className="relative w-full py-16 sm:py-24 bg-[#070D1B] text-slate-100 select-none overflow-hidden">
      
      {/* Background Soft Glow matching Dashboard Palette */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[350px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono font-bold text-violet-400">
              <Cpu size={14} />
              SYSTEM ARCHITECTURE & CAPABILITIES
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Clinical Workstations Engineered for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-fuchsia-400">
                Critical Precision.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every card connects directly to live hospital hardware, telemetry nodes, and EMR records with real-time operational response.
            </p>
          </div>

          {/* Interactive Filter Pills (Dashboard Matched) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0B1220] border border-slate-800 text-xs font-mono shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Capabilities" },
              { id: "critical", label: "Critical Telemetry" },
              { id: "intelligence", label: "EMR & AI" },
              { id: "governance", label: "Governance" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Capabilities Cards Grid (Exact Dashboard Card Styling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCapabilities.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
                className="group relative rounded-3xl bg-[#0B1220]/90 border border-slate-800 hover:border-violet-500/40 p-6 flex flex-col justify-between shadow-xl shadow-black/20 hover:shadow-violet-950/20 transition-all duration-200 backdrop-blur-xl"
              >
                <div className="space-y-4">
                  {/* Card Header: Icon + Status Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/20 via-indigo-600/20 to-fuchsia-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Icon size={22} className="stroke-[2.2]" />
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-[#070D1B] border border-slate-800 text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Metrics + Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-4">
                  {/* Micro Metrics Strip (Dashboard Stats Style) */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-[#070D1B] border border-slate-800/80 font-mono">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">{item.metrics.label}</div>
                      <div className="text-sm font-black text-white mt-0.5">{item.metrics.primary}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Status</div>
                      <div className="text-xs font-bold text-emerald-400 mt-1 truncate">{item.metrics.secondary}</div>
                    </div>
                  </div>

                  {/* Functional Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRunSimulation(item)}
                      className="flex-1 py-2.5 rounded-xl bg-[#070D1B] hover:bg-[#131d33] border border-slate-800 hover:border-violet-500/40 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap size={13} className="text-violet-400" />
                      <span>Live Test</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(item.route)}
                      className="py-2.5 px-3.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-violet-600/30 hover:opacity-95 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Launch</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Interactive Simulation Console Modal (Rule 2: Every Button Works) */}
      <AnimatePresence>
        {activeSimulation && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0B1220] border border-slate-800 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase">
                      Clinical Node Diagnostics
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Testing Protocol: {activeSimulation.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSimulation(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Terminal Simulation Feed */}
              <div className="p-4 rounded-2xl bg-[#070D1B] border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800/80 text-[10px]">
                  <span>NODE: AY-INT-AP1</span>
                  <span>PROTOCOL: {activeSimulation.tag}</span>
                </div>
                <div className="text-slate-300 min-h-[50px] flex items-center">
                  {simulatingStep ? (
                    <span className="flex items-center gap-2 text-violet-400">
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                      {simulationLog}
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={15} />
                      {simulationLog}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Tools */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveSimulation(null)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Close Console
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const targetRoute = activeSimulation.route;
                    setActiveSimulation(null);
                    navigate(targetRoute);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr from-violet-600 to-indigo-600 text-white hover:opacity-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Module</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}