import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  HeartPulse,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  CheckCircle2,
  Lock,
  Stethoscope,
  ChevronRight,
  Radio,
  Clock,
  Bed,
  Users,
  AlertCircle,
  Cpu,
  Layers,
} from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  // Active Interactive Tab inside the Hero Live Terminal
  const [activeTab, setActiveTab] = useState("telemetry"); // 'telemetry', 'ai-triage', 'or-matrix'
  const [isSimulating, setIsSimulating] = useState(true);
  const [ecgBpm, setEcgBpm] = useState(73);
  const [spo2Val, setSpo2Val] = useState(99);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Live Hospital Monitor Radar-Sweep ECG Canvas
  const ecgCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Buffer array for single continuous wave
    const waveBuffer = new Array(width).fill(midY);
    let sweepX = 0;
    let cyclePhase = 0;

    // First paint black
    ctx.fillStyle = "#070D1B";
    ctx.fillRect(0, 0, width, height);

    const renderSweep = () => {
      // Step movement
      const step = 2;
      for (let s = 0; s < step; s++) {
        let x = (sweepX + s) % width;
        cyclePhase = (cyclePhase + 1) % 110;

        let y = midY;

        // P-Q-R-S-T clean clinical wave without flat clipping
        if (cyclePhase >= 15 && cyclePhase < 26) {
          // P wave (Atrial)
          y = midY - Math.sin(((cyclePhase - 15) / 11) * Math.PI) * 4.5;
        } else if (cyclePhase >= 33 && cyclePhase < 37) {
          // Q dip
          y = midY + Math.sin(((cyclePhase - 33) / 4) * Math.PI) * 4;
        } else if (cyclePhase >= 37 && cyclePhase < 43) {
          // R spike (Sharp Needle)
          y = midY - Math.sin(((cyclePhase - 37) / 6) * Math.PI) * 26;
        } else if (cyclePhase >= 43 && cyclePhase < 48) {
          // S undershoot
          y = midY + Math.sin(((cyclePhase - 43) / 5) * Math.PI) * 7;
        } else if (cyclePhase >= 58 && cyclePhase < 76) {
          // T wave (Ventricular)
          y = midY - Math.sin(((cyclePhase - 58) / 18) * Math.PI) * 6;
        } else {
          y = midY;
        }

        waveBuffer[x] = y;
      }

      sweepX = (sweepX + step) % width;

      // Full clean frame clear to completely eliminate any horizontal phantom lines
      ctx.fillStyle = "#070D1B";
      ctx.fillRect(0, 0, width, height);

      // Draw single clean path with glowing phosphor head
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#a855f7";
      ctx.strokeStyle = "#c084fc";

      // Draw from after sweep erase-bar forward to create authentic monitor gap
      const eraseGap = 16;
      let started = false;

      for (let i = 0; i < width; i++) {
        // Leave a dark scanning gap ahead of the current sweep
        const distFromSweep = (i - sweepX + width) % width;
        if (distFromSweep < eraseGap) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(i, waveBuffer[i]);
          started = true;
        } else {
          ctx.lineTo(i, waveBuffer[i]);
        }
      }
      ctx.stroke();

      // Lead scanning laser dot
      ctx.beginPath();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#f43f5e";
      ctx.fillStyle = "#ffffff";
      ctx.arc(sweepX, waveBuffer[sweepX], 2.5, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(renderSweep);
    };

    renderSweep();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Periodic Telemetry Fluctuation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setEcgBpm((prev) => 72 + Math.floor(Math.random() * 5));
      setSpo2Val((prev) => (Math.random() > 0.85 ? 98 : 99));
    }, 2800);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="relative w-full pt-6 pb-16 sm:pb-24 lg:pt-10 lg:pb-32 overflow-hidden select-none">
      
      {/* Background Soft Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-fuchsia-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Top Status Pill */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 px-4 py-1.5 rounded-full bg-[#0B1220]/90 border border-slate-800 shadow-inner backdrop-blur-xl">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-violet-300">
                Next-Gen Hospital Operating System
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <ShieldCheck size={13} className="text-emerald-400" />
                HIPAA / JCI Certified
              </span>
            </div>

            {/* Kinetic Title */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                High-Performance{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-fuchsia-400">
                  Clinical Intelligence
                </span>{" "}
                & Hospital OS.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Unifying electronic medical records, real-time acute bed telemetry, 
                and predictive specialist dispatch in a sub-millisecond dark operational command architecture.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:opacity-95 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border border-white/20 cursor-pointer"
              >
                <Activity size={18} className="stroke-[2.5]" />
                <span>Launch Command Console</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0B1220]/80 hover:bg-[#131d33] border border-slate-800 hover:border-violet-500/40 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200 backdrop-blur-md cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Play size={12} className="fill-current ml-0.5" />
                </div>
                <span>Watch System Walkthrough</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">0.42ms</div>
                <div className="text-[11px] text-slate-500 font-medium">Telemetry Latency</div>
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl font-black text-violet-400 font-mono">99.99%</div>
                <div className="text-[11px] text-slate-500 font-medium">Uptime Guarantee</div>
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[11px] text-slate-500 font-medium">FHIR Compliant</div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Terminal Box */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-[28px] bg-[#0B1220]/90 border border-slate-800/90 shadow-2xl shadow-violet-950/30 overflow-hidden backdrop-blur-xl">
              
              {/* Header */}
              <div className="px-5 py-4 bg-[#0F172A]/70 border-b border-slate-800/90 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="ml-3 text-xs font-mono font-bold tracking-wider text-slate-300">
                    AY-CORE // NODE-01
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 transition hover:bg-emerald-900/40 cursor-pointer"
                >
                  {isSimulating ? "LIVE STREAM" : "PAUSED"}
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="p-3 border-b border-slate-800/80 bg-[#070D1B]/60">
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab("telemetry")}
                    className={`py-2 rounded-xl text-xs font-semibold tracking-wide font-sans transition-all duration-200 cursor-pointer ${
                      activeTab === "telemetry"
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Bed Telemetry
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("ai-triage")}
                    className={`py-2 rounded-xl text-xs font-semibold tracking-wide font-sans transition-all duration-200 cursor-pointer ${
                      activeTab === "ai-triage"
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Grok Triage
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("or-matrix")}
                    className={`py-2 rounded-xl text-xs font-semibold tracking-wide font-sans transition-all duration-200 cursor-pointer ${
                      activeTab === "or-matrix"
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    OT Matrix
                  </button>
                </div>
              </div>

              {/* Console Body */}
              <div className="p-5 space-y-4">
                
                {/* TAB 1: Bed Telemetry */}
                {activeTab === "telemetry" && (
                  <div className="space-y-3.5">
                    
                    {/* ECG Canvas Wave Card with Micro Grid Pattern */}
                    <div 
                      className="rounded-2xl bg-[#070D1B] border border-slate-800 p-3.5 relative overflow-hidden"
                      style={{
                        backgroundImage: "radial-gradient(rgba(147, 51, 234, 0.08) 1px, transparent 1px)",
                        backgroundSize: "14px 14px"
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                        <span className="flex items-center gap-1.5 text-violet-400 font-bold">
                          <Activity size={13} className="text-violet-400" />
                          LEAD II ECG TELEMETRY
                        </span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {ecgBpm} BPM
                        </span>
                      </div>
                      <canvas
                        ref={ecgCanvasRef}
                        width={340}
                        height={65}
                        className="w-full h-16 block rounded-lg bg-[#070D1B]"
                      />
                    </div>

                    {/* Vitals 3-Column Metrics */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 text-center">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                          OXYGEN (SpO₂)
                        </div>
                        <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                          {spo2Val}%
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 text-center">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                          BLOOD PRESSURE
                        </div>
                        <div className="text-xl font-black text-white font-mono mt-1">
                          120/78
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 text-center">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                          RESPIRATION
                        </div>
                        <div className="text-xl font-black text-violet-400 font-mono mt-1">
                          16 rpm
                        </div>
                      </div>
                    </div>

                    {/* Monitored Patient Strip */}
                    <div className="p-3.5 rounded-2xl bg-[#070D1B] border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white tracking-wide">
                          Hamza Farooq (M/32)
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Ward CCU-04 • Dr. Salman Tariq
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono bg-violet-500/15 text-violet-400 border border-violet-500/30">
                        MONITORED
                      </span>
                    </div>

                  </div>
                )}

                {/* TAB 2: Grok AI Triage */}
                {activeTab === "ai-triage" && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-violet-950/25 border border-violet-500/30 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-violet-300 font-bold text-xs font-mono">
                        <Sparkles size={14} className="text-violet-400" />
                        CLINICAL TRIAGE RECOMMENDATION
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Acute S-T segment elevation detected in Ward CCU Bed 4. Automatic pager protocol generated for on-call cardiology specialist.
                      </p>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">Emergency Door-to-Doc:</span>
                        <span className="text-emerald-400 font-bold">11.4 Minutes</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">ICU Bed Availability:</span>
                        <span className="text-violet-400 font-bold">2 Ventilators Ready</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: OT Matrix */}
                {activeTab === "or-matrix" && (
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">OT-1: Cardiothoracic Bypass</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Dr. Salman Tariq • Elapsed: 1h 42m</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        IN PROGRESS
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#070D1B] border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">OT-2: Laparoscopic Appendectomy</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Dr. Bilal Naeem • Prep Stage</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        READY (12m)
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom Full Dashboard Trigger Button */}
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 rounded-2xl bg-[#070D1B] hover:bg-[#0F172A] text-slate-200 hover:text-white border border-slate-800 hover:border-violet-500/40 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Open Full Dashboard Monitor</span>
                  <ChevronRight size={14} className="text-violet-400" />
                </button>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Video Walkthrough Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0B1220] border border-slate-800 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                    <Play size={14} className="fill-current ml-0.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    AY INT. SUITE — ARCHITECTURE DEMO
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <AlertCircle size={18} className="rotate-45" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl bg-[#070D1B] border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Interactive Console Online</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    System telemetry, appointment scheduler, and EMR records are live. Click below to enter the portal.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoModalOpen(false);
                    navigate("/dashboard");
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr from-violet-600 to-indigo-600 text-white hover:opacity-95"
                >
                  Enter Portal Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}