import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  ArrowUp,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  Radio,
  FileText,
  Lock,
  Stethoscope,
  Building2,
  Zap,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  // Functional Newsletter State
  const [emailInput, setEmailInput] = useState("");
  const [subscriptionState, setSubscriptionState] = useState("idle"); // 'idle' | 'loading' | 'success'
  const [subscribeMessage, setSubscribeMessage] = useState("");

  // Smooth Scroll To Top Handler
  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".overflow-y-auto");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Subscription Form Submission (Rule 2: Every Button Works)
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setSubscriptionState("error");
      setSubscribeMessage("Please enter a valid clinical institutional email address.");
      setTimeout(() => setSubscriptionState("idle"), 3500);
      return;
    }

    setSubscriptionState("loading");
    setTimeout(() => {
      setSubscriptionState("success");
      setSubscribeMessage("Subscribed to AY Clinical Dispatch & Telemetry Bulletins.");
      setEmailInput("");
      setTimeout(() => setSubscriptionState("idle"), 4000);
    }, 700);
  };

  return (
    <footer className="relative w-full bg-[#050A14] text-slate-100 border-t border-slate-800/80 pt-16 pb-12 select-none overflow-hidden">
      
      {/* Background Soft Glow matching Dashboard Palette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-t from-violet-600/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================
            1. TOP CALLOUT / EMERGENCY HOTLINE BAR
           ======================================================== */}
        <div className="rounded-3xl bg-[#0B1220] border border-slate-800/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center shrink-0">
              <Phone size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center md:justify-start gap-2">
                <span>AY Acute Emergency Hotline</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mt-0.5">
                +92 (51) 844-9000 <span className="text-slate-500 font-normal text-sm">/ Toll-Free Extension 1122</span>
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition cursor-pointer border border-white/20"
            >
              <Activity size={15} />
              <span>Direct Telemetry Portal</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#070D1B] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="Return to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* ========================================================
            2. MAIN 4-COLUMN FOOTER NAVIGATION
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pt-4">
          
          {/* Column 1 & 2: Hospital Suite Brand & Compliance (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/dashboard" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-black shadow-lg shadow-violet-500/30 border border-white/20 transition-transform group-hover:scale-105">
                <HeartPulse size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black tracking-wider text-white flex items-center gap-2">
                  AY INT.<span className="text-violet-400 font-extrabold">PRO</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                    SUITE
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Autonomous Clinical Operating Architecture
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              AY International Hospital operates high-velocity acute care telemetry, predictive surgical scheduling, and electronic health record reconciliation under ISO-27001 and JCI standards.
            </p>

            {/* Live Operational Status Strip */}
            <div className="p-3.5 rounded-2xl bg-[#0B1220] border border-slate-800/80 space-y-2 max-w-sm">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Primary Edge Node: AP-1
                </span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                <span>Telemetry Ingestion: 0.38ms</span>
                <span>FHIR R4 Nominal</span>
              </div>
            </div>
          </div>

          {/* Column 3: Clinical Modules Navigation */}
          <div className="space-y-4">
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Clinical Modules
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/patients" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Inpatient EMR Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/patients/appointments" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>OPD & Ward Scheduler</span>
                </Link>
              </li>
              <li>
                <Link to="/patients/lab-reports" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Telemetry & Lab Feeds</span>
                </Link>
              </li>
              <li>
                <Link to="/icd" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>ICD-10 Diagnostic Engine</span>
                </Link>
              </li>
              <li>
                <Link to="/procedures" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Surgical Operating Theaters</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Facilities */}
          <div className="space-y-4">
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Governance & Admin
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/facilities" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Acute ICU Bed Matrix</span>
                </Link>
              </li>
              <li>
                <Link to="/practices" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Specialist Practice Roster</span>
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Revenue Cycle & Claims</span>
                </Link>
              </li>
              <li>
                <Link to="/practice-setting" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Security & Access Control</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-violet-400 transition flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-slate-600" />
                  <span>Clinical Command Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Telemetry Alerts & Institutional Dispatch Form */}
          <div className="space-y-4">
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Clinical Advisory Feed
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Receive automated notifications regarding hospital system updates, ICD schema revisions, and drug interaction advisories.
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="physician@hospital.org"
                  className="w-full bg-[#0B1220] border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/60 transition"
                />
                <button
                  type="submit"
                  disabled={subscriptionState === "loading"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition cursor-pointer"
                >
                  <Send size={13} />
                </button>
              </div>

              {/* Feedback Alert */}
              <AnimatePresence>
                {subscriptionState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>{subscribeMessage}</span>
                  </motion.div>
                )}

                {subscriptionState === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1.5"
                  >
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{subscribeMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

        </div>

        {/* ========================================================
            3. REGULATORY ACCREDITATION & BOTTOM BAR
           ======================================================== */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck size={14} className="text-violet-400" />
              HIPAA & HITECH Enforced
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock size={13} className="text-emerald-400" />
              AES-256 Cloud Encryption
            </span>
            <span>•</span>
            <span className="text-slate-400">JCI International Standard</span>
          </div>

          <div className="text-center md:text-right text-slate-400">
            © 2026 AY International Hospital Suite. All clinical rights reserved.
          </div>

        </div>

      </div>

    </footer>
  );
}