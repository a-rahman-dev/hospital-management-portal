import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Save,
  Hash,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Loader2,
  Check,
  X,
} from "lucide-react";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PRACTICE FORM COLOR PALETTE (Rule 5)
   Primary: Indigo (#4f46e5)
   ============================================================ */

const PRACTICE_TYPES = [
  "Main Academic Hospital",
  "Specialty Clinic",
  "Ambulatory Center",
  "Community Health Clinic",
];

const STATUS_OPTIONS = ["Active", "Ambulatory", "Under Review"];

const DOCTORS = [
  "Dr. Jonathan Vance, MD",
  "Dr. Sarah Chen, MD, FACOG",
  "Dr. James Wilson, MD",
  "Dr. Marcus Park, FAAP",
  "Dr. A. Rahman, MD",
  "Dr. Elena Rostova, MD",
  "Dr. Aisha Khan, MD, FCCP",
];

/* ============================================================
   📋 ZOD SCHEMA — Inline (can move to schemas/)
   ============================================================ */

const practiceSchema = z.object({
  name: z
    .string()
    .min(3, "Practice name must be at least 3 characters")
    .max(100, "Name too long"),

  practiceCode: z
    .string()
    .min(3, "Code required")
    .max(20, "Code too long")
    .regex(/^[A-Z0-9-]+$/, "Only uppercase letters, numbers, and dashes"),

  type: z.enum(PRACTICE_TYPES, {
    errorMap: () => ({ message: "Select practice type" }),
  }),

  specialties: z
    .string()
    .min(5, "Specialties must be at least 5 characters")
    .max(200, "Too long"),

  npi: z
    .string()
    .regex(/^\d{10}$/, "NPI must be exactly 10 digits"),

  medicalDirector: z.string().min(3, "Medical director required"),

  location: z
    .string()
    .min(5, "Address required")
    .max(200, "Address too long"),

  phone: z
    .string()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  activeProviders: z.coerce
    .number()
    .int("Must be whole number")
    .min(0, "Cannot be negative")
    .max(500, "Too many providers"),

  status: z.enum(STATUS_OPTIONS, {
    errorMap: () => ({ message: "Select status" }),
  }),
});

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

const DEFAULT_VALUES = {
  name: "",
  practiceCode: "",
  type: "Specialty Clinic",
  specialties: "Primary & Preventive Care",
  npi: "",
  medicalDirector: "Dr. Jonathan Vance, MD",
  location: "",
  phone: "+1 (555) 840-0000",
  email: "",
  activeProviders: 5,
  status: "Active",
};

/* ============================================================
   🎯 MAIN: PracticeForm
   ============================================================ */
export default function PracticeForm({
  isOpen,
  onClose,
  onSave,
  editData,
}) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(practiceSchema),
    defaultValues: editData || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (editData) reset(editData);
    else reset(DEFAULT_VALUES);
  }, [editData, reset, isOpen]);

  const currentStatus = watch("status");

  const submitHandler = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSave({
      ...data,
      id: editData ? editData.id : `PRAC-${Date.now().toString().slice(-4)}`,
      activePatients: editData ? editData.activePatients : 120,
      createdDate: editData
        ? editData.createdDate
        : new Date().toISOString().split("T")[0],
      avatarColor: editData ? editData.avatarColor : "from-indigo-600 to-blue-600",
    });
    onClose();
  };

  const FieldLabel = ({ children, required }) => (
    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );

  const FieldError = ({ error }) =>
    error ? (
      <motion.p
        initial={prefersReduced ? false : { opacity: 0, y: -4 }}
        animate={prefersReduced ? false : { opacity: 1, y: 0 }}
        className="text-[11px] text-rose-500 mt-1.5 font-bold"
        role="alert"
      >
        {error.message}
      </motion.p>
    ) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 15 }}
        animate={prefersReduced ? false : { opacity: 1, scale: 1, y: 0 }}
        exit={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 my-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500" />

        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#1e293b]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                {editData ? "Update Practice Facility" : "Register New Practice"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Configure clinic NPI, directorship & location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-gray-100 dark:bg-[#141e33] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1f2c4a] transition-all disabled:opacity-50 shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FieldLabel required>Practice / Facility Name</FieldLabel>
              <Input
                placeholder="e.g. ApexCare Brooklyn Health"
                icon={<Building2 size={16} />}
                error={errors.name?.message}
                {...register("name")}
              />
              <FieldError error={errors.name} />
            </div>

            <div>
              <FieldLabel required>Site Identification Code</FieldLabel>
              <Input
                placeholder="e.g. PRAC-MAIN"
                icon={<Hash size={16} />}
                error={errors.practiceCode?.message}
                {...register("practiceCode", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  },
                })}
              />
              <FieldError error={errors.practiceCode} />
            </div>

            <div>
              <FieldLabel required>Facility NPI</FieldLabel>
              <Input
                placeholder="10 digits"
                icon={<ShieldCheck size={16} />}
                error={errors.npi?.message}
                {...register("npi")}
              />
              <FieldError error={errors.npi} />
            </div>

            <div>
              <FieldLabel required>Practice Classification</FieldLabel>
              <select {...register("type")} className={selectClass}>
                {PRACTICE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <FieldError error={errors.type} />
            </div>

            <div>
              <FieldLabel required>Medical Director</FieldLabel>
              <select {...register("medicalDirector")} className={selectClass}>
                {DOCTORS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <FieldError error={errors.medicalDirector} />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel required>Clinical Specialties</FieldLabel>
              <Input
                placeholder="e.g. Primary Care, Cardiology & Lab"
                icon={<Stethoscope size={16} />}
                error={errors.specialties?.message}
                {...register("specialties")}
              />
              <FieldError error={errors.specialties} />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel required>Physical Location Address</FieldLabel>
              <Input
                placeholder="e.g. 100 Medical Plaza, New York, NY"
                icon={<MapPin size={16} />}
                error={errors.location?.message}
                {...register("location")}
              />
              <FieldError error={errors.location} />
            </div>

            <div>
              <FieldLabel>Primary Telephone</FieldLabel>
              <Input
                placeholder="+1 (555) 000-0000"
                icon={<Phone size={16} />}
                error={errors.phone?.message}
                {...register("phone")}
              />
              <FieldError error={errors.phone} />
            </div>

            <div>
              <FieldLabel>Institutional Email</FieldLabel>
              <Input
                type="email"
                placeholder="clinic@apexcarehealth.org"
                icon={<Mail size={16} />}
                error={errors.email?.message}
                {...register("email")}
              />
              <FieldError error={errors.email} />
            </div>

            <div>
              <FieldLabel required>Active Providers</FieldLabel>
              <Input
                type="number"
                min="0"
                error={errors.activeProviders?.message}
                {...register("activeProviders", { valueAsNumber: true })}
              />
              <FieldError error={errors.activeProviders} />
            </div>

            <div>
              <FieldLabel required>Operational Status</FieldLabel>
              <select {...register("status")} className={selectClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <FieldError error={errors.status} />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-gray-200 dark:border-[#1e293b] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase bg-gray-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1b2844] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={prefersReduced ? {} : { y: -1, scale: 1.02 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              className="group relative w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase text-white shadow-lg overflow-hidden inline-flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
                boxShadow: "0 8px 24px rgba(79, 70, 229, 0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} strokeWidth={2.5} />
                  <span>{editData ? "Update Site" : "Confirm Site"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}