import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  "Show critical patients today",
  "Any pending lab reports?",
  "Total appointments scheduled?",
  "Check ICU bed availability",
];

function getClinicalResponse(query = "") {
  const q = query.toLowerCase();

  if (q.includes("critical") || q.includes("serious") || q.includes("alert") || q.includes("khatarnak")) {
    return {
      reply: "There are currently 3 critical alerts requiring immediate attention:\n• Patient #89 — O₂ saturation dropped to 89% (Ward B-5)\n• Patient #104 — Acute Arrhythmia (CCU Bed 4)\n• Patient #42 — Post-op hypothermia (Recovery Room 2)",
      actions: [
        { label: "View Alerts Ticker", route: "/dashboard" },
        { label: "Patient Roster", route: "/dashboard" },
      ],
      suggestedReplies: ["Check Ward B-5 vitals", "Contact CCU on-call doctor"],
    };
  }

  if (q.includes("bed") || q.includes("icu") || q.includes("capacity") || q.includes("jagah")) {
    return {
      reply: "ICU occupancy is currently at 86% (12 of 14 beds occupied). General Inpatient Ward has 42 available beds across East & West Wings.",
      actions: [{ label: "View Bed Facilities", route: "/dashboard" }],
      suggestedReplies: ["Show ICU roster", "Pending admissions"],
    };
  }

  if (q.includes("schedule") || q.includes("appointment") || q.includes("aaj") || q.includes("today")) {
    return {
      reply: "You have 18 total appointments scheduled for today across General Medicine, OBGYN, and Orthopedics. Next appointment is in 25 minutes.",
      actions: [{ label: "Open Daily Schedule", route: "/dashboard" }],
      suggestedReplies: ["View morning rounds", "Next surgical procedure"],
    };
  }

  if (
    q.includes("kaise") ||
    q.includes("kya") ||
    q.includes("hai") ||
    q.includes("salam") ||
    q.includes("mariz") ||
    q.includes("shukriya")
  ) {
    return {
      reply: "Walaikum Assalam! Hospital database active hai. Aaj total 1,248 registered patients hain aur 18 appointments line up hain. 3 critical alerts hain jin par tawajjo darkaar hai.",
      actions: [{ label: "Dashboard Par Dekhein", route: "/dashboard" }],
      suggestedReplies: ["Critical alerts dikhao", "ICU status batao"],
    };
  }

  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return {
      reply: "Hello Dr. Rehman! All clinical modules and telemetry monitors are active. How can I assist your rounds or administrative workflow right now?",
      actions: [{ label: "View Patients", route: "/dashboard" }],
      suggestedReplies: ["Show critical patients today", "Check ICU bed availability"],
    };
  }

  return {
    reply: `Clinical query noted: "${query}". Patient database and EMR synchronization are nominal. You can review live analytics on the main telemetry board.`,
    actions: [{ label: "Go to Dashboard", route: "/dashboard" }],
    suggestedReplies: ["Show critical patients today", "Check ICU bed availability"],
  };
}

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am your AY International Hospital AI Clinical & Administrative Co-Pilot. You can query patient vitals, active schedules, or ask questions in both English and Urdu/Roman Urdu.",
      actions: [
        { label: "View Patients", route: "/dashboard" },
        { label: "Today's Schedule", route: "/dashboard" },
      ],
      suggestedReplies: [
        "Critical patients list",
        "Recent admissions summary",
      ],
    },
  ]);

  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let data = null;

      // Agar production build ho to live serverless endpoint hit kare
      try {
        const history = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            userRole: "admin",
            currentPage: location.pathname,
          }),
        });

        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Dev fallback
      }

      // Local dev mode fallback
      if (!data || !data.reply) {
        await new Promise((r) => setTimeout(r, 600));
        data = getClinicalResponse(query);
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        actions: data.actions || [],
        suggestedReplies: data.suggestedReplies || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "System temporarily busy. Please retry.",
          actions: [],
          suggestedReplies: ["Retry"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[100] select-none">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative flex items-center justify-center p-3.5 sm:p-4 rounded-2xl shadow-2xl text-white",
            "bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500",
            "shadow-violet-500/30 border border-white/20",
            "focus:outline-none focus:ring-4 focus:ring-violet-500/30"
          )}
          aria-label="Open AI Assistant"
        >
          {/* Top AI Badge */}
          <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-slate-950 text-[10px] font-black tracking-wider text-violet-300 border border-violet-400/40 shadow-sm">
            AI
          </span>

          {isOpen ? (
            <X size={24} strokeWidth={2.5} />
          ) : (
            <>
              {/* Online Pulse Status Dot */}
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-slate-900"></span>
              </span>
              <Sparkles size={24} className="animate-pulse" />
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed right-4 sm:right-6 bottom-24 z-[100] flex flex-col overflow-hidden",
              "top-20 sm:top-auto sm:max-h-[calc(100dvh-7.5rem)]",
              "bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800",
              "rounded-3xl shadow-2xl transition-all duration-300",
              isExpanded
                ? "w-[calc(100vw-2rem)] sm:w-[620px] h-[calc(100dvh-7.5rem)]"
                : "w-[calc(100vw-2rem)] sm:w-[420px] h-[540px]"
            )}
          >
            {/* Header */}
            <div className="shrink-0 px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    AY Hospital Co-Pilot
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold border border-violet-500/20">
                      Grok AI
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clinical & Operations Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessages([
                      {
                        id: "welcome-reset",
                        role: "assistant",
                        content:
                          "Conversation reset! How can I assist you with clinical or operational data today?",
                        actions: [],
                        suggestedReplies: [],
                      },
                    ])
                  }
                  className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                  title="Reset conversation"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-1.5",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-start gap-2.5 max-w-[85%]",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                        msg.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {msg.role === "user" ? <User size={13} /> : <Bot size={13} />}
                    </div>

                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-violet-600 text-white rounded-tr-none"
                          : "bg-slate-100 dark:bg-[#131d33] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-800"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>

                  {/* Actions / Deep Links */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-9 mt-1">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            navigate(act.route);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/60 border border-violet-200 dark:border-violet-800/80 text-xs font-semibold transition"
                        >
                          {act.label}
                          <ArrowRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Follow-up / Suggested Replies */}
                  {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-9 mt-1">
                      {msg.suggestedReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(reply)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs transition"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 pl-2 text-slate-400 text-xs">
                  <Loader2 size={16} className="animate-spin text-violet-500" />
                  Grok Co-Pilot is processing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="shrink-0 px-4 py-2.5 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
                {QUICK_PROMPTS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/40 dark:hover:text-violet-300 border border-transparent dark:border-slate-700/50 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <div className="shrink-0 p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0B1220]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 bg-slate-100 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-violet-500/40"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything (English or Urdu)..."
                  className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white transition shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}