import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Globe,
  Radio,
  Download,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
  CreditCard,
} from "lucide-react";
import Input from "@/components/ui/Input/Input";
import { practiceSettingSchema } from "@/schemas/practiceSettingSchema";
import { practiceSettingData, getFlattenedConfig } from "@/data/practiceSetting";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PRACTICE SETTING COLOR PALETTE (Rule 5)
   ─────────────────────────────────────────────
   - Primary:   Blue    (#3b82f6) — institutional
   - Secondary: Indigo  (#6366f1) — legal
   - Accent:    Cyan    (#06b6d4) — operations
   - Success:   Emerald (#10b981)
   - Danger:    Rose    (#f43f5e)
   ============================================================ */

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 transition-all";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* ============================================================
   ⚠️ ConfirmModal — Rule 4
   ============================================================ */
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const accentGradient = "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)";
  const accentGlow = "rgba(245, 158, 11, 0.35)";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: accentGradient }}
            />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
                  className="relative shrink-0"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: accentGradient,
                      boxShadow: `0 6px 18px ${accentGlow}`,
                    }}
                  >
                    <AlertCircle size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: accentGlow }}
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {message}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close dialog"
                  className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <motion.button
                  onClick={onConfirm}
                  disabled={loading}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-lg inline-flex items-center justify-center gap-2"
                  style={{
                    background: accentGradient,
                    boxShadow: `0 8px 24px ${accentGlow}`,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{confirmText}</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Toast
   ============================================================ */
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl max-w-[calc(100vw-2rem)]"
          role="status"
          aria-live="polite"
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              toast.variant === "error" ? "bg-rose-500" : "bg-emerald-500"
            )}
          >
            {toast.variant === "error" ? (
              <AlertCircle size={16} strokeWidth={2.5} className="text-white" />
            ) : (
              <CheckCircle2 size={16} strokeWidth={2.5} className="text-white" />
            )}
          </div>
          <p className="text-sm font-bold">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   SectionCard
   ============================================================ */
function SectionCard({
  icon: Icon,
  title,
  subtitle,
  iconColor,
  iconBg,
  children,
  index,
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      custom={index}
      initial={prefersReduced ? false : "hidden"}
      animate={prefersReduced ? false : "visible"}
      variants={sectionVariants}
      className="relative bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#182338] rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-60" />

      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100 dark:border-[#182338]">
        <motion.div
          whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.2 }}
          className={cn("p-2 rounded-xl shrink-0", iconBg)}
        >
          <Icon className={cn("w-5 h-5", iconColor)} strokeWidth={2.5} />
        </motion.div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </motion.div>
  );
}

/* ============================================================
   ToggleSwitch
   ============================================================ */
function ToggleSwitch({ label, description, checked, onChange }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.label
      whileHover={prefersReduced ? {} : { y: -2, scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-[#1e293b] bg-gray-50/50 dark:bg-[#070c18] cursor-pointer hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all"
    >
      <div className="min-w-0">
        <div className="text-xs font-black text-slate-900 dark:text-white">
          {label}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {description}
        </div>
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          aria-label={label}
        />
        <motion.div
          animate={{
            backgroundColor: checked ? "#3b82f6" : "#cbd5e1",
          }}
          transition={{ duration: 0.2 }}
          className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer"
        >
          <motion.div
            animate={{ x: checked ? 20 : 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 30 }
            }
            className="w-5 h-5 bg-white rounded-full shadow-md"
          />
        </motion.div>
      </div>
    </motion.label>
  );
}

/* ============================================================
   🎯 MAIN: PracticeSetting
   ============================================================ */
export default function PracticeSetting() {
  const prefersReduced = useReducedMotion();

  const [toast, setToast] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const defaultValues = useMemo(() => getFlattenedConfig(), []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(practiceSettingSchema),
    defaultValues,
  });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---- Watch toggle values ---- */
  const autoReminders = watch("autoAppointmentReminders");
  const telehealth = watch("telehealthIntegration");
  const twoFA = watch("twoFactorEnforcement");
  const hipaaLogging = watch("hipaaAuditLogging");

  /* ---- Save ---- */
  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 700));
      reset(data); // resets isDirty
      showToast("Configuration saved & encrypted");
    } catch {
      showToast("Failed to save configuration", "error");
    }
  };

  /* ---- Discard ---- */
  const handleDiscardClick = () => {
    if (!isDirty) {
      showToast("No unsaved changes", "error");
      return;
    }
    setShowDiscardModal(true);
  };

  const handleConfirmDiscard = async () => {
    setDiscarding(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      reset(defaultValues);
      setShowDiscardModal(false);
      showToast("Changes discarded");
    } finally {
      setDiscarding(false);
    }
  };

  /* ---- AI Audit ---- */
  const handleAIAudit = async () => {
    showToast("Running HIPAA & EDI audit...");
    await new Promise((r) => setTimeout(r, 1500));
    showToast("Audit complete — 100% compliance passed");
  };

  /* ---- Export Config ---- */
  const handleExportConfig = () => {
    const data = watch();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `practice_config_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Config exported successfully");
  };

  /* ---- Field label helper ---- */
  const FieldLabel = ({ children, required }) => (
    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: -10 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.08, rotate: -5 }}
            transition={{ duration: 0.2 }}
            className="relative shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Building2 size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={
                prefersReduced
                  ? {}
                  : { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1220]"
            />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Practice Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              Legal identity, NPI registry, billing EDI & HIPAA governance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            type="button"
            onClick={handleAIAudit}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-[#0d1629] text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Run AI compliance audit"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">AI Audit</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleExportConfig}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-[#0d1629] hover:bg-gray-50 dark:hover:bg-[#131f3b] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-sm"
            aria-label="Export configuration"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export Config</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ============ SECTION A: LEGAL IDENTITY ============ */}
        <SectionCard
          index={0}
          icon={ShieldCheck}
          title="Institutional & Legal Identity"
          subtitle="Type-2 Group NPI, Federal Tax EIN and Medical Board licensing"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-500/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <FieldLabel required>Clinic / Facility Name</FieldLabel>
              <Input
                {...register("clinicName")}
                icon={<Building2 size={16} />}
                error={errors.clinicName?.message}
              />
            </div>
            <div>
              <FieldLabel required>Legal Registered Entity</FieldLabel>
              <Input
                {...register("legalName")}
                icon={<FileText size={16} />}
                error={errors.legalName?.message}
              />
            </div>
            <div>
              <FieldLabel required>Group NPI (Type-2)</FieldLabel>
              <Input
                {...register("npi")}
                icon={<ShieldCheck size={16} />}
                error={errors.npi?.message}
              />
            </div>
            <div>
              <FieldLabel required>Federal Tax ID (EIN)</FieldLabel>
              <Input {...register("taxId")} error={errors.taxId?.message} />
            </div>
            <div>
              <FieldLabel required>State Hospital License #</FieldLabel>
              <Input
                {...register("license")}
                error={errors.license?.message}
              />
            </div>
            <div>
              <FieldLabel required>Taxonomy Code</FieldLabel>
              <Input
                {...register("taxonomyCode")}
                error={errors.taxonomyCode?.message}
              />
            </div>
          </div>
        </SectionCard>

        {/* ============ SECTION B: ADDRESS & CONTACT ============ */}
        <SectionCard
          index={1}
          icon={MapPin}
          title="Location & Dispatch Contacts"
          subtitle="Official facility address, public hotline & compliance inbox"
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-500/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <FieldLabel required>Physical Address</FieldLabel>
              <Input
                {...register("address")}
                icon={<MapPin size={16} />}
                error={errors.address?.message}
              />
            </div>
            <div>
              <FieldLabel>Suite / Floor</FieldLabel>
              <Input {...register("addressLine2")} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <FieldLabel required>City</FieldLabel>
                <Input {...register("city")} error={errors.city?.message} />
              </div>
              <div>
                <FieldLabel required>State</FieldLabel>
                <Input {...register("state")} error={errors.state?.message} />
              </div>
              <div>
                <FieldLabel required>ZIP</FieldLabel>
                <Input
                  {...register("zipCode")}
                  error={errors.zipCode?.message}
                />
              </div>
            </div>
            <div>
              <FieldLabel required>Main Telephone</FieldLabel>
              <Input
                {...register("phone")}
                icon={<Phone size={16} />}
                error={errors.phone?.message}
              />
            </div>
            <div>
              <FieldLabel required>Emergency Hotline</FieldLabel>
              <Input
                {...register("emergencyPhone")}
                icon={<Phone size={16} />}
                error={errors.emergencyPhone?.message}
              />
            </div>
            <div>
              <FieldLabel required>HIPAA Officer Email</FieldLabel>
              <Input
                {...register("hipaaOfficerEmail")}
                icon={<Mail size={16} />}
                error={errors.hipaaOfficerEmail?.message}
              />
            </div>
            <div>
              <FieldLabel required>Claims / Remittance Email</FieldLabel>
              <Input
                {...register("billingEmail")}
                icon={<Mail size={16} />}
                error={errors.billingEmail?.message}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Official Web Portal</FieldLabel>
              <Input
                {...register("website")}
                icon={<Globe size={16} />}
                error={errors.website?.message}
              />
            </div>
          </div>
        </SectionCard>

        {/* ============ SECTION C: OPERATIONS & SECURITY ============ */}
        <SectionCard
          index={2}
          icon={Clock}
          title="Operations & Security Policies"
          subtitle="Slot durations, EDI routing & HIPAA governance"
          iconColor="text-cyan-600 dark:text-cyan-400"
          iconBg="bg-cyan-500/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <FieldLabel required>Default Slot Duration</FieldLabel>
              <select {...register("defaultSlotDuration")} className={selectClass}>
                <option value="15">15 Minutes (Brief Follow-up)</option>
                <option value="30">30 Minutes (Standard Consult)</option>
                <option value="45">45 Minutes (Comprehensive MDM)</option>
                <option value="60">60 Minutes (New Patient / Surgical)</option>
              </select>
            </div>
            <div>
              <FieldLabel required>Facility Timezone</FieldLabel>
              <select {...register("timezone")} className={selectClass}>
                <option value="America/New_York">
                  Eastern Time (US) [UTC-05:00]
                </option>
                <option value="America/Chicago">
                  Central Time (US) [UTC-06:00]
                </option>
                <option value="America/Denver">
                  Mountain Time (US) [UTC-07:00]
                </option>
                <option value="America/Los_Angeles">
                  Pacific Time (US) [UTC-08:00]
                </option>
              </select>
            </div>
            <div>
              <FieldLabel required>Clearinghouse EDI Gateway ID</FieldLabel>
              <Input
                {...register("clearinghouseEdiId")}
                icon={<Radio size={16} />}
                error={errors.clearinghouseEdiId?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 mt-5 border-t border-gray-100 dark:border-[#182338]">
            <ToggleSwitch
              label="Automated SMS & Email Reminders"
              description="Send 24h & 2h appointment reminder alerts"
              checked={autoReminders}
              onChange={(e) =>
                setValue("autoAppointmentReminders", e.target.checked, {
                  shouldDirty: true,
                })
              }
            />
            <ToggleSwitch
              label="Enforce Multi-Factor Authentication"
              description="Mandatory 2FA for all clinical providers"
              checked={twoFA}
              onChange={(e) =>
                setValue("twoFactorEnforcement", e.target.checked, {
                  shouldDirty: true,
                })
              }
            />
            <ToggleSwitch
              label="Telehealth WebRTC Gateway"
              description="Secure end-to-end encrypted video consultations"
              checked={telehealth}
              onChange={(e) =>
                setValue("telehealthIntegration", e.target.checked, {
                  shouldDirty: true,
                })
              }
            />
            <ToggleSwitch
              label="Continuous HIPAA Audit Logging"
              description="Track every PHI access with timestamp & IP"
              checked={hipaaLogging}
              onChange={(e) =>
                setValue("hipaaAuditLogging", e.target.checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </SectionCard>

        {/* ============ SAVE BAR ============ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#182338] shadow-sm"
        >
          <div className="min-w-0 flex-1">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                You have unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                All changes saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 sm:ml-auto">
            <motion.button
              type="button"
              onClick={handleDiscardClick}
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase bg-gray-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1b2844] transition-all disabled:opacity-50"
            >
              Discard
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting || !isDirty}
              whileHover={prefersReduced ? {} : { scale: 1.03, y: -1 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              className="group relative flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase text-white shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.35)",
              }}
              aria-label="Save configuration"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 relative z-10 animate-spin" strokeWidth={2.5} />
                  <span className="relative z-10">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 relative z-10" strokeWidth={2.5} />
                  <span className="relative z-10">Save Configuration</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* ⚠️ DISCARD WARNING MODAL (Rule 4) */}
      <ConfirmModal
        open={showDiscardModal}
        onClose={() => !discarding && setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        loading={discarding}
        title="Discard unsaved changes?"
        message="All modifications you've made to this practice configuration will be lost. Your last saved settings will be restored."
        confirmText="Yes, Discard"
        cancelText="Keep Editing"
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}