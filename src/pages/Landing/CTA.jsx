import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Server,
  Lock,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Radio,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";

export default function CTA() {
  const navigate = useNavigate();

  // Functional Interactive State
  const [clusterNode, setClusterNode] = useState("ay-core-node-01");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const sampleApiKey = "ay_live_sec_9941_fhir_r4_00x8f2a";

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(sampleApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2200);
  };

  const handleSimulateDeployment = (e) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeploymentSuccess(false);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentSuccess(true);
      setShowTerminalModal(true);
    }, 900);
  };

  return (
    <section className="relative w-full py-16 sm:py-28 bg-[#070D1B] text-slate-100 select-none overflow-hidden border-t border-slate-800/80">
      
      {/* Background Soft Glow Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Glassmorphic Command Box */}
        <div className="relative rounded-[32px] bg-gradient-to-b from-[#0B1220] to-[#070D1B] border border-slate-800/90 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden backdrop-blur-2xl">
          
          {/* Subtle Top Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Mission Call & Deployment Parameters (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono font-bold text-violet-400">
                <Radio size={14} className="animate-pulse" />
                ENTERPRISE HOSPITAL CLOUD // DEPLOYMENT SUITE
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Launch High-Performance{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-fuchsia-400">
                  Clinical Intelligence
                </span>{" "}
                Today.
              </h2>

              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Deploy real-time ICU telemetry, predictive Grok triage models, and automated inpatient revenue cycles with zero cold-boot latency.
              </p>

              {/* Interactive Deployment Form */}
              <form onSubmit={handleSimulateDeployment} className="space-y-4 max-w-lg mx-auto lg:mx-0 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative w-full">
                    <Server size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={clusterNode}
                      onChange={(e) => setClusterNode(e.target.value)}
                      placeholder="Enter Clinical Node ID..."
                      className="w-full bg-[#070D1B] border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/60 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isDeploying}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-violet-500/25 transition-all duration-200 shrink-0 cursor-pointer border border-white/20 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="stroke-[2.5]" />
                        <span>Launch Sandbox</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sub-text security assurance */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={14} />
                    AES-256 Bit Encryption
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>JCI & HIPAA Compliant</span>
                  <span className="text-slate-600">•</span>
                  <span>Zero Data Retention Risk</span>
                </div>
              </form>

            </div>

            {/* Right Column: Live Node Status & Direct Console Box (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-[#090F1F] border border-slate-800 p-6 shadow-2xl space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                  <span className="font-bold text-slate-300 flex items-center gap-2">
                    <Terminal size={14} className="text-violet-400" />
                    AY-INT NODE CONFIG
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    STATUS: READY
                  </span>
                </div>

                {/* Micro Details List */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">Region Cluster:</span>
                    <span className="text-white font-bold">Asia-South (Islamabad Edge)</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">HL7 Telemetry:</span>
                    <span className="text-violet-400 font-bold">Active Sub-0.5ms</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">Grok Copilot:</span>
                    <span className="text-emerald-400 font-bold">Online v2.4</span>
                  </div>
                </div>

                {/* API Key Box */}
                <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>PUBLIC TEST ACCESS KEY</span>
                    <button
                      type="button"
                      onClick={handleCopyApiKey}
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{copiedKey ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 truncate">
                    {sampleApiKey}
                  </div>
                </div>

                {/* Direct Console Route Button */}
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <Activity size={16} className="stroke-[2.5]" />
                  <span>Enter Live Clinical Portal</span>
                  <ChevronRight size={15} />
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Deployment Result Modal */}
      <AnimatePresence>
        {showTerminalModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0B1220] border border-slate-800 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase">
                      Cluster Node Initialized
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Target: {clusterNode} // Connected to AY Core
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTerminalModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#070D1B] border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Secure handshake established (TLS 1.3 / AES-256).</span>
                </div>
                <div className="text-slate-300">
                  Telemetry channel mapped to CCU-04 and ER-Bay 3.
                </div>
                <div className="text-violet-400">
                  Grok Copilot hooked to clinical decision endpoints.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTerminalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Stay on Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTerminalModal(false);
                    navigate("/dashboard");
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr from-violet-600 to-indigo-600 text-white hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}