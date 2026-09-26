import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { obgynSchema } from "@/schemas/obgynSchema";
import Input from "@/components/ui/Input/Input";
import {
  Baby,
  Save,
  Hash,
  Clock,
  FileCode2,
  Loader2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 OBGYN FORM COLOR PALETTE (Rule 5)
   Primary: Rose (#f43f5e)
   ============================================================ */

const CATEGORIES = [
  "General",
  "Pelvic",
  "Breast",
  "Cervical",
  "Imaging",
  "Biopsy",
  "Procedure",
  "Pregnancy",
  "Counseling",
  "Assessment",
  "Screening",
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/30 focus:border-rose-500 transition-all";

const DEFAULT_VALUES = {
  name: "",
  code: "",
  category: "General",
  description: "",
  duration: "15 min",
  durationMinutes: 15,
  cptCode: "",
  billable: true,
  status: "Active",
};

export default function OBGYNForm({ obgyn, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(obgynSchema),
    defaultValues: obgyn || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (obgyn) reset(obgyn);
    else reset(DEFAULT_VALUES);
  }, [obgyn, reset]);

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
      {/* Name + Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Examination Name</FieldLabel>
          <Input
            placeholder="e.g. Pelvic Examination"
            icon={<Baby size={16} />}
            error={errors.name?.message}
            {...register("name")}
          />
          <FieldError error={errors.name} />
        </div>

        <div>
          <FieldLabel required>Catalog Code</FieldLabel>
          <Input
            placeholder="e.g. PELV-EX-01"
            icon={<Hash size={16} />}
            error={errors.code?.message}
            {...register("code", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          <FieldError error={errors.code} />
        </div>
      </div>

      {/* Description */}
      <div>
        <FieldLabel required>Description</FieldLabel>
        <textarea
          rows={3}
          placeholder="Describe the procedure, indications, and protocol..."
          {...register("description")}
          className={cn(
            selectClass,
            "resize-none",
            errors.description && "border-rose-400 focus:border-rose-500"
          )}
        />
        <FieldError error={errors.description} />
      </div>

      {/* Category + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Category</FieldLabel>
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
          <FieldLabel required>Duration (display)</FieldLabel>
          <Input
            placeholder="e.g. 15 min"
            icon={<Clock size={16} />}
            error={errors.duration?.message}
            {...register("duration")}
          />
          <FieldError error={errors.duration} />
        </div>
      </div>

      {/* Duration Minutes + CPT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Duration (minutes)</FieldLabel>
          <Input
            type="number"
            placeholder="15"
            error={errors.durationMinutes?.message}
            {...register("durationMinutes", { valueAsNumber: true })}
          />
          <FieldError error={errors.durationMinutes} />
        </div>

        <div>
          <FieldLabel>CPT Code (5 digits)</FieldLabel>
          <Input
            placeholder="e.g. 99213"
            icon={<FileCode2 size={16} />}
            error={errors.cptCode?.message}
            {...register("cptCode")}
          />
          <FieldError error={errors.cptCode} />
        </div>
      </div>

      {/* Status + Billable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <FieldLabel required>Status</FieldLabel>
          <select {...register("status")} className={selectClass}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <FieldError error={errors.status} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 pb-2.5">
          <input
            type="checkbox"
            {...register("billable")}
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 dark:border-slate-700"
          />
          Directly Billable
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
            background: "linear-gradient(135deg, #f43f5e 0%, #db2777 100%)",
            boxShadow: "0 8px 24px rgba(244, 63, 94, 0.35)",
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
              <span>{obgyn ? "Update Exam" : "Add Exam"}</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}