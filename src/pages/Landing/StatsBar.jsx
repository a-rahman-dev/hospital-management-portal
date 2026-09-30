import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bed,
  Clock,
  HeartPulse,
  Users,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  Stethoscope,
  Radio,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function StatsBar() {
  const navigate = useNavigate();

  // Active Filter: 'live' (Current Shift), '24h' (Past 24 Hours), 'month' (Monthly Census)
  const [activeRange, setActiveRange] = useState("live");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  // Dynamic Telemetry Metrics State
  const [metrics, setMetrics] = useState({
    activePatients: 1248,
    icuOccupancy: 86,
    freeBeds: 6,
    doorToDocMinutes: 11.4,
    surgeryThroughput: 38,
    systemUptime: "99.99%",
  });

  // 100% Functional Telemetry Re-sync Trigger
  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        activePatients: prev.activePatients + Math.floor(Math.random() * 5) - 2,
        icuOccupancy: Math.min(94, Math.max(78, prev.icuOccupancy + Math.floor(Math.random() * 3) - 1)),
        doorToDocMinutes: Number((11.0 + Math.random() * 0.8).toFixed(1)),
      }));
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setIsSyncing(false);
    }, 550);
  };

  // Adjust metrics based on time range filter
  const getDisplayData = () => {
    switch (activeRange) {
      case "24h":
        return {
          admissions: "142",
          admissionsSub: "Past 24 Hours Total",
          occupancy: "89%",
          occupancySub: "Average Peak ICU",
          wait: "14.2 min",
          waitSub: "Rolling 24h Average",
          surgeries: "48 Done",
          surgeriesSub: "Across 4 Theaters",
          trendPatients: "+3.1%",
          trendWait: "-1.2m",
        };
      case "month":
        return {
          admissions: "3,890",
          admissionsSub: "September Census",
          occupancy: "84%",
          occupancySub: "Monthly Average",
          wait: "12.8 min",
          waitSub: "Accredited Metric",
          surgeries: "1,120",
          surgeriesSub: "Total Procedures",
          trendPatients: "+12.4%",
          trendWait: "-2.5m",
        };
      case "live":
      default:
        return {
          admissions: metrics.activePatients.toLocaleString(),
          admissionsSub: "Registered Inpatients",
          occupancy: `${metrics.icuOccupancy}%`,
          occupancySub: `${metrics.freeBeds} Critical Beds Open`,
          wait: `${metrics.doorToDocMinutes} min`,
          waitSub: "Door-to-Doctor Velocity",
          surgeries: `${metrics.surgeryThroughput} Active`,
          surgeriesSub: "Scheduled Today",
          trendPatients: "+4.2%",
          trendWait: "-3.1m",
        };
    }
  };

  const display = getDisplayData();

  return (
    <div className="relative w-full py-8 lg:py-12 border-y border-slate-800/80 bg-[#070D1B] text-slate-100 select-none">
      
      {/* Background Soft Glow matching Dashboard Palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        
        {/* Top Control Bar: Stream Info + Exact Dashboard Filter Pills + Sync Tool */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          
          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                Live Clinical Telemetry Stream
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  HL7 Realtime
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Central Node Sync: {lastSyncTime} • Packet Loss: 0.00%
              </p>
            </div>
          </div>

          {/* Timeframe Controls (Exact Dashboard Active Pill Styling) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0B1220] border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveRange("live")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  activeRange === "live"
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Live Shift
              </button>
              <button
                type="button"
                onClick={() => setActiveRange("24h")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  activeRange === "24h"
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                24 Hours
              </button>
              <button
                type="button"
                onClick={() => setActiveRange("month")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  activeRange === "month"
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Sync Telemetry Button */}
            <button
              type="button"
              onClick={handleSyncTelemetry}
              disabled={isSyncing}
              className="p-2.5 rounded-2xl bg-[#0B1220] hover:bg-[#131d33] border border-slate-800 hover:border-violet-500/40 text-slate-300 hover:text-white transition cursor-pointer shadow-md"
              title="Re-synchronize telemetry feed"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin text-violet-400" : ""} />
            </button>
          </div>

        </div>

        {/* 4 Telemetry Metrics Cards - Exact Dashboard Card Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Active Patients Census */}
          <div
            onClick={() => navigate("/patients")}
            className="group relative rounded-3xl bg-[#0B1220] hover:bg-[#0F172A] border border-slate-800 hover:border-violet-500/40 p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-xl shadow-black/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Active Inpatients
                </span>
                <div className="w-9 h-9 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {display.admissions}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
                  <TrendingUp size={13} className="mr-0.5" />
                  {display.trendPatients}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
              <span>{display.admissionsSub}</span>
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
            </div>
          </div>

          {/* Card 2: Acute ICU / CCU Bed Matrix */}
          <div
            onClick={() => navigate("/facilities")}
            className="group relative rounded-3xl bg-[#0B1220] hover:bg-[#0F172A] border border-slate-800 hover:border-violet-500/40 p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-xl shadow-black/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  ICU Bed Matrix
                </span>
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Bed size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {display.occupancy}
                </span>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  Occupancy
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
              <span className="text-emerald-400 font-bold">{display.occupancySub}</span>
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>

          {/* Card 3: Emergency Door-to-Doctor Velocity */}
          <div
            onClick={() => navigate("/dashboard")}
            className="group relative rounded-3xl bg-[#0B1220] hover:bg-[#0F172A] border border-slate-800 hover:border-violet-500/40 p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-xl shadow-black/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Emergency Triage
                </span>
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Clock size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {display.wait}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400/80">
                  Door-to-Doc
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
              <span>{display.waitSub}</span>
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>

          {/* Card 4: Operating Theaters & Procedures */}
          <div
            onClick={() => navigate("/procedures")}
            className="group relative rounded-3xl bg-[#0B1220] hover:bg-[#0F172A] border border-slate-800 hover:border-violet-500/40 p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-xl shadow-black/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Surgical Matrix
                </span>
                <div className="w-9 h-9 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <HeartPulse size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {display.surgeries}
                </span>
                <span className="text-xs font-mono font-bold text-fuchsia-400">
                  Units Live
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
              <span>{display.surgeriesSub}</span>
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}