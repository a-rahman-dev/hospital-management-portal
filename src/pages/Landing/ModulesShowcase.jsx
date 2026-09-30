import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
  Activity,
  HeartPulse,
  Stethoscope,
  Receipt,
  Terminal,
  Zap,
  Clock,
  Bed,
  Users,
  AlertTriangle,
  Play,
  RotateCw,
  Sliders,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Check,
  Copy,
  SlidersHorizontal,
} from "lucide-react";

// ==========================================
// 🏥 CLINICAL MODULES COMPREHENSIVE DATASET
// ==========================================
const CLINICAL_MODULES = [
  {
    id: "patients-ehr",
    name: "Inpatient EMR & Telemetry",
    category: "Clinical Core",
    tagline: "Sub-millisecond vitals telemetry with HL7 FHIR bidirectional pipeline",
    icon: Stethoscope,
    badge: "FHIR R4 CERTIFIED",
    badgeType: "emerald",
    route: "/patients",
    endpoint: "GET /api/v2/clinical/patients/PT-9041/telemetry",
    stats: [
      { label: "Active Census", value: "1,248 pts" },
      { label: "Stream Latency", value: "0.42 ms" },
      { label: "Telemetry Leads", value: "12 Channels" },
      { label: "Bed Allocation", value: "98.4% Accuracy" },
    ],
    highlights: [
      "Continuous Lead II ECG, SpO₂, and Non-Invasive Blood Pressure (NIBP) acquisition",
      "Dynamic bed-to-ward matrix linking acute CCU, ICU, and Post-Op recovery suites",
      "Automated clinical alerts triggering instant on-call doctor notification chains",
      "Bilingual clinician notes with ICD-10 automated diagnosis tagging and e-signatures",
    ],
    // High-End Interactive UI Preview Data
    previewData: {
      title: "Patient Telemetry Monitor",
      patient: "Tariq Mahmood (M/58)",
      mrn: "PT-9041",
      ward: "Cardiology CCU — Bed 04",
      doctor: "Dr. Salman Tariq",
      status: "Stable / Monitored",
      vitals: [
        { label: "HEART RATE", value: "74 BPM", status: "normal", color: "text-emerald-400" },
        { label: "BLOOD PRESSURE", value: "120/78", status: "optimal", color: "text-white" },
        { label: "OXYGEN (SpO₂)", value: "99%", status: "normal", color: "text-violet-400" },
        { label: "RESPIRATION", value: "16 rpm", status: "normal", color: "text-cyan-400" },
      ],
      alertText: "Continuous telemetry stream active. No acute ST changes in last 4 hours.",
    },
  },
  {
    id: "icd-diagnostic",
    name: "ICD-10 Diagnostic Registry",
    category: "Diagnostic Intel",
    tagline: "AI-indexed diagnostic tree covering 72,000+ WHO clinical disease codes",
    icon: Database,
    badge: "WHO-ICD10 VALIDATED",
    badgeType: "violet",
    route: "/icd",
    endpoint: "POST /api/v2/diagnostics/icd10/validate-claim",
    stats: [
      { label: "Indexed Codes", value: "72,400+" },
      { label: "Search Velocity", value: "12 ms" },
      { label: "Scrubber Accuracy", value: "99.8%" },
      { label: "Cross-Reference", value: "SNOMED CT" },
    ],
    highlights: [
      "Natural language clinical symptom search converting doctor notes into exact ICD-10-CM codes",
      "Pre-emptive insurance claim scrubber checking medical necessity before submission",
      "Maternal and neonatal specialized diagnostic registry for high-risk deliveries",
      "Dual cross-walk integration with CPT procedural billing codes",
    ],
    previewData: {
      title: "Diagnostic Adjudication Node",
      patient: "Amina Bibi (F/42)",
      mrn: "PT-8812",
      ward: "Internal Medicine Ward 2",
      doctor: "Dr. Ayesha Malik",
      status: "Verified Adjudicated",
      diagnoses: [
        { code: "I21.0", name: "STEMI of anterior wall", status: "Primary / Critical", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
        { code: "I10", name: "Essential Hypertension", status: "Secondary / Chronic", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
        { code: "E11.9", name: "Type 2 Diabetes Mellitus", status: "Secondary / Managed", color: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
      ],
      alertText: "Pre-claim validation engine: Passed with zero procedural mismatches.",
    },
  },
  {
    id: "surgical-ot",
    name: "Surgical OT & Procedure Suites",
    category: "Surgical Operations",
    tagline: "Dynamic theater slotting, sterilization workflows, and anesthesiology logs",
    icon: Activity,
    badge: "STERILE CERTIFIED",
    badgeType: "fuchsia",
    route: "/procedures",
    endpoint: "GET /api/v2/surgery/theaters/live-matrix",
    stats: [
      { label: "Active Suites", value: "4 Theaters" },
      { label: "Sterilization Turn", value: "22 mins" },
      { label: "On-Duty Surgeons", value: "6 Leads" },
      { label: "Safety Checklist", value: "WHO 100%" },
    ],
    highlights: [
      "Real-time countdown timer tracking incision-to-closure and anesthesia recovery milestones",
      "Integrated surgical tray tracking ensuring sterile supply chain validation before wheel-in",
      "Post-Anesthesia Care Unit (PACU) bed auto-reservation upon surgical incision",
      "Biometric surgeon roster sync preventing fatigue with regulated on-call duty cycles",
    ],
    previewData: {
      title: "OT Theater Live Matrix",
      theater: "Suite 01 — Cardiothoracic",
      procedure: "Coronary Artery Bypass (OPCAB)",
      surgeon: "Dr. Salman Tariq",
      status: "In Progress (1h 42m)",
      checkpoints: [
        { label: "WHO Surgical Safety Sign-In", done: true, time: "08:15 PKT" },
        { label: "Anesthesia Induction (Bis Index: 42)", done: true, time: "08:30 PKT" },
        { label: "Surgical Incision & Graft Prep", done: true, time: "08:50 PKT" },
        { label: "Closure & PACU Bed Reserved (Bed 03)", done: false, time: "11:45 PKT" },
      ],
      alertText: "Perfusion parameters optimal. Recovery bed PACU-03 confirmed and staffed.",
    },
  },
  {
    id: "insurance-revenue",
    name: "Revenue Cycle & Claims Hub",
    category: "Financial Administration",
    tagline: "Automated billing adjudication, co-pay calculation, and payer compliance",
    icon: Receipt,
    badge: "99.2% CLEAN CLAIMS",
    badgeType: "indigo",
    route: "/insurance",
    endpoint: "POST /api/v2/billing/claims/scrub-and-transmit",
    stats: [
      { label: "Clean Claim Rate", value: "99.2%" },
      { label: "Adjudication Time", value: "1.4s" },
      { label: "Supported Payers", value: "32 Insurers" },
      { label: "Audit Trailing", value: "Immutable" },
    ],
    highlights: [
      "Instant electronic eligibility verification for corporate and personal health policies",
      "Automated co-payment calculations separating patient liability from institutional billing",
      "Rule-engine claim scrubbing reducing rejections by over 80%",
      "Exportable ANSI 837 EDI files compatible with central government healthcare registries",
    ],
    previewData: {
      title: "Real-time Adjudication Summary",
      claimId: "CLM-9941-AY",
      payer: "State Life Corporate Care",
      patient: "Tariq Mahmood (PT-9041)",
      status: "Clean / Approved",
      breakdown: [
        { label: "CCU Ward & Monitoring (3 Days)", amount: "PKR 45,000" },
        { label: "Cardiothoracic Surgical Procedures", amount: "PKR 85,000" },
        { label: "Specialist Consultation & Nursing", amount: "PKR 18,200" },
        { label: "Diagnostic Labs & Cardiac Imaging", amount: "PKR 12,500" },
      ],
      total: "PKR 160,700",
      patientPortion: "PKR 15,000 (Co-Pay)",
      alertText: "Pre-authorization code PA-8891-CCU locked. Direct corporate settlement dispatched.",
    },
  },
];

export default function ModulesShowcase() {
  const navigate = useNavigate();

  // State
  const [selectedModuleId, setSelectedModuleId] = useState(CLINICAL_MODULES[0].id);
  const [interactiveMode, setInteractiveMode] = useState("preview"); // 'preview' | 'telemetry-stream'
  const [isSimulating, setIsSimulating] = useState(false);
  const [pingLatency, setPingLatency] = useState("0.42 ms");

  const currentModule = CLINICAL_MODULES.find((m) => m.id === selectedModuleId) || CLINICAL_MODULES[0];

  // Live Ping Simulator (Rule 2)
  const handleSimulateSync = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const ms = (0.35 + Math.random() * 0.15).toFixed(2);
      setPingLatency(`${ms} ms`);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#070D1B] text-slate-100 select-none overflow-hidden border-t border-slate-800/80">
      
      {/* Background Glow Accents matching Dashboard Palette */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* ========================================================
            1. SECTION HEADER
           ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono font-bold text-violet-400">
              <Layers size={14} className="stroke-[2.5]" />
              ENTERPRISE HOSPITAL SUBSYSTEMS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Interoperable Systems Engineered for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-fuchsia-400">
                Hospital Scale.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              High-throughput FHIR resources, automated ICD-10 diagnostic pipelines, and surgical suite matrix operating in real time across departments.
            </p>
          </div>

          {/* Module Switcher Pills - Dashboard Styled */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B1220] border border-slate-800 text-xs font-mono shrink-0 overflow-x-auto no-scrollbar max-w-full">
            {CLINICAL_MODULES.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                  }}
                  className={`relative px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer whitespace-nowrap z-10 ${
                    isSelected ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeModuleTab"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-600/30 -z-10"
                    />
                  )}
                  <span>{mod.name.split(" ")[0]} Hub</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            2. INTERACTIVE DUAL-WINDOW SHOWCASE
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT WINDOW: Deep Clinical Overview & KPIs (5 Cols) */}
          <motion.div
            key={`left-${currentModule.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 rounded-[28px] bg-[#0B1220] border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-2xl space-y-6"
          >
            <div className="space-y-6">
              
              {/* Top Tag & Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  {currentModule.category}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border ${
                    currentModule.badgeType === "emerald"
                      ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                      : currentModule.badgeType === "fuchsia"
                      ? "bg-fuchsia-950/40 text-fuchsia-300 border-fuchsia-500/30"
                      : "bg-violet-950/40 text-violet-300 border-violet-500/30"
                  }`}
                >
                  {currentModule.badge}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
                    <currentModule.icon size={22} className="stroke-[2.2]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentModule.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {currentModule.tagline}
                </p>
              </div>

              {/* 4-Cell Clinical Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {currentModule.stats.map((st, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800/90 text-left font-mono"
                  >
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{st.label}</div>
                    <div className="text-sm font-black text-white mt-0.5">{st.value}</div>
                  </div>
                ))}
              </div>

              {/* Highlights List */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Architectural Deliverables
                </div>
                <div className="space-y-2">
                  {currentModule.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="stroke-[3]" />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Launch Console CTA Button */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => navigate(currentModule.route)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-violet-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/20 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Launch {currentModule.name.split(" ")[0]} Console</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </motion.div>

          {/* RIGHT WINDOW: Ultra-Modern Clinical UI Interactive Preview (7 Cols) */}
          <motion.div
            key={`right-${currentModule.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 rounded-[28px] bg-[#0B1220] border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Window Top Controls Header */}
            <div className="px-5 py-4 bg-[#0F172A]/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                </div>
                <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
                  <Activity size={14} className="text-violet-400" />
                  {currentModule.previewData.title}
                </span>
              </div>

              {/* Functional Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateSync}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070D1B] hover:bg-[#111A30] border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
                  title="Simulate Real-time Sync"
                >
                  <RotateCw size={12} className={isSimulating ? "animate-spin text-violet-400" : "text-violet-400"} />
                  <span>{isSimulating ? "Syncing..." : "Sync Node"}</span>
                </button>

                <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {pingLatency}
                </span>
              </div>
            </div>

            {/* Sub-Header: Live Operational Context */}
            <div className="px-5 py-3 bg-[#070D1B]/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Context:</span>
                <span className="text-white font-bold">{currentModule.previewData.patient || currentModule.previewData.theater}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Attending:</span>
                <span className="text-violet-300 font-semibold">{currentModule.previewData.doctor || currentModule.previewData.surgeon || currentModule.previewData.payer}</span>
              </div>
            </div>

            {/* Main Interactive Clinical Canvas (Replaces Raw JSON with High-End SaaS UI) */}
            <div className="p-5 sm:p-6 bg-[#070D1B] flex-1 flex flex-col justify-between space-y-5">
              
              {/* 1. If Patient EMR: Live Vitals Grid + Alert Strip */}
              {currentModule.id === "patients-ehr" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {currentModule.previewData.vitals.map((v, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#0B1220] border border-slate-800 text-center font-mono">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">{v.label}</div>
                        <div className={`text-lg font-black mt-1 ${v.color}`}>{v.value}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{v.status}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Ward Allocation: {currentModule.previewData.ward}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">MRN: {currentModule.previewData.mrn} • Lead II Telemetry Synced</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                      CCU ACTIVE
                    </span>
                  </div>
                </div>
              )}

              {/* 2. If ICD Diagnostic: Live Coding Scrubbing Cards */}
              {currentModule.id === "icd-diagnostic" && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    Assigned Clinical Diagnostic Codes (ICD-10-CM)
                  </div>
                  <div className="space-y-2">
                    {currentModule.previewData.diagnoses.map((dx, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#0B1220] border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono font-bold text-white">
                            {dx.code}
                          </span>
                          <span className="font-semibold text-slate-200">{dx.name}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${dx.color}`}>
                          {dx.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. If Surgical OT: Live Procedure Schedule Timeline */}
              {currentModule.id === "surgical-ot" && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>In-Theater Milestones</span>
                    <span className="text-rose-400 font-bold">CASE: SURG-4421</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {currentModule.previewData.checkpoints.map((cp, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#0B1220] border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${cp.done ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                            {cp.done ? <Check size={12} className="stroke-[3]" /> : <Clock size={12} />}
                          </div>
                          <span className={cp.done ? "text-slate-200 font-semibold" : "text-slate-500"}>{cp.label}</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{cp.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. If Revenue Cycle: Realtime Claims Breakdown */}
              {currentModule.id === "insurance-revenue" && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Adjudicated Itemized Billing</span>
                    <span className="text-emerald-400 font-bold">{currentModule.previewData.claimId}</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {currentModule.previewData.breakdown.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#0B1220] border border-slate-800 flex justify-between">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-bold">{item.amount}</span>
                      </div>
                    ))}
                    <div className="p-3 rounded-2xl bg-[#0B1220] border border-violet-500/30 flex justify-between items-center text-xs mt-2">
                      <div>
                        <div className="font-bold text-white">Total Payer Settlement: {currentModule.previewData.total}</div>
                        <div className="text-[10px] text-slate-400">Patient Liability: {currentModule.previewData.patientPortion}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        VERIFIED 100%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Insight Strip */}
              <div className="p-3 rounded-2xl bg-[#0B1220] border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 truncate max-w-sm sm:max-w-none">
                  {currentModule.previewData.alertText}
                </span>
                <span className="text-violet-400 font-bold flex items-center gap-1 shrink-0">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  EHR Compliant
                </span>
              </div>

            </div>

            {/* Bottom Status Bar */}
            <div className="px-5 py-3.5 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>REST Node: {currentModule.endpoint.split(" ")[1]}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate(currentModule.route)}
                className="text-violet-400 hover:text-violet-300 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Full Module Specs</span>
                <ChevronRight size={13} />
              </button>
            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}