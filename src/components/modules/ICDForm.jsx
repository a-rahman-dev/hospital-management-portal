import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { icdSchema } from "@/schemas/icdSchema";
import Input from "@/components/ui/Input/Input";
import {
  Stethoscope,
  Save,
  FileCode2,
  Tag,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 ICD FORM COLOR PALETTE (matches ICD.jsx — Rule 5)
   ─────────────────────────────────────────────
   Primary: Cyan (#06b6d4)
   ============================================================ */

const CATEGORIES = [
  "Infectious Diseases",
  "Endocrine",
  "Endocrinology",
  "Mental Health",
  "Neurology",
  "Cardiovascular",
  "Respiratory",
  "Pulmonology",
  "Gastrointestinal",
  "Musculoskeletal",
  "Genitourinary",
  "Symptoms",
  "Evaluation & Management",
  "Diagnostic Cardiology",
  "Diagnostic Radiology",
  "Laboratory",
  "Orthopedics",
  "DME & Transport",
  "Pharmacy & Drugs",
];

const CODE_TYPES = ["ICD-10-CM", "CPT", "HCPCS"];
const USAGE_FREQUENCIES = ["Low", "Moderate", "High", "Very High"];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/30 focus:border-cyan-500 transition-all";

const DEFAULT_VALUES = {
  code: "",
  codeType: "ICD-10-CM",
  category: "Cardiovascular",
  description: "",
  billable: true,
  hccEligible: false,
  usageFrequency: "Moderate",
  reimbursementTier: "Standard Outpatient",
  status: "Active",
};

export default function ICDForm({ icd, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(icdSchema),
    defaultValues: icd || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (icd) reset(icd);
    else reset(DEFAULT_VALUES);
  }, [icd, reset]);

  const submitHandler = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
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

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Code + Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Code Identifier</FieldLabel>
          <Input
            placeholder="e.g. I10, 99213"
            icon={<FileCode2 size={16} />}
            error={errors.code?.message}
            {...register("code", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          <FieldError error={errors.code} />
        </div>

        <div>
          <FieldLabel required>Code Type</FieldLabel>
          <select {...register("codeType")} className={selectClass}>
            {CODE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError error={errors.codeType} />
        </div>
      </div>

      {/* Description */}
      <div>
        <FieldLabel required>Official Description</FieldLabel>
        <textarea
          rows={3}
          placeholder="e.g. Essential (primary) hypertension"
          {...register("description")}
          className={cn(
            selectClass,
            "resize-none",
            errors.description && "border-rose-400 focus:border-rose-500"
          )}
        />
        <FieldError error={errors.description} />
      </div>

      {/* Category + Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Clinical Category</FieldLabel>
          <select {...register("category")} className={selectClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <FieldError error={errors.category} />
        </div>

        <div>
          <FieldLabel required>Usage Frequency</FieldLabel>
          <select {...register("usageFrequency")} className={selectClass}>
            {USAGE_FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <FieldError error={errors.usageFrequency} />
        </div>
      </div>

      {/* Reimbursement + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Reimbursement Tier</FieldLabel>
          <Input
            placeholder="e.g. Standard Outpatient"
            {...register("reimbursementTier")}
            error={errors.reimbursementTier?.message}
          />
          <FieldError error={errors.reimbursementTier} />
        </div>

        <div>
          <FieldLabel required>Status</FieldLabel>
          <select {...register("status")} className={selectClass}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <FieldError error={errors.status} />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6 flex-wrap pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            {...register("billable")}
            className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:border-slate-700"
          />
          Directly Billable
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            {...register("hccEligible")}
            className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:border-slate-700"
          />
          HCC Risk Adjustment
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-gray-200 dark:border-[#1e293b] mt-6">
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          whileHover={prefersReduced ? {} : { y: -1, scale: 1.02 }}
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase bg-gray-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1b2844] transition-all disabled:opacity-50"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={prefersReduced ? {} : { y: -1, scale: 1.02 }}
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          className="group relative w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-black tracking-wider uppercase text-white shadow-lg overflow-hidden inline-flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
            boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
          }}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={14} strokeWidth={2.5} />
              <span>{icd ? "Update Code" : "Register Code"}</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}