import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/* ============================================================
   🛡️ ERROR BOUNDARY (Rule 2 — Professional Error Handling)
   ─────────────────────────────────────────────
   Catches React errors and shows a friendly fallback.
   ============================================================ */

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex items-center justify-center p-6 transition-colors">
          <div className="text-center max-w-md">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-rose-500/40">
              <AlertTriangle size={28} className="text-white" strokeWidth={2.5} />
            </div>

            {/* Heading */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>

            {/* Error details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-6 p-4 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
                <summary className="text-xs font-black text-slate-700 dark:text-slate-300 cursor-pointer uppercase tracking-wider">
                  Error details (dev)
                </summary>
                <pre className="mt-3 text-[11px] text-rose-500 overflow-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} strokeWidth={2.5} />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 8px 24px rgba(79, 70, 229, 0.35)",
                }}
              >
                <Home size={14} strokeWidth={2.5} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}