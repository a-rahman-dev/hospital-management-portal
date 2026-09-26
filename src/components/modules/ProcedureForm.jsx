import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { procedureSchema } from "@/schemas/procedureSchema";
import Input from "@/components/ui/Input/Input";
import {
  Scissors,
  Save,
  Hash,
  DollarSign,
  Clock,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PROCEDURE FORM COLOR PALETTE (Rule 5)
   Primary: Violet (#7c3aed)
   ============================================================ */

const CATEGORIES = [
  "Surgical",
  "Endoscopy",
  "Cardiology",
  "Obstetric",
  "Gynecologic",
  "Ophthalmology",
  "ENT",
  "Orthopedic",
  "Dermatology",
  "General",
  "Diagnostic",
  "Radiology",
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/30 focus:border-violet-500 transition-all";

const DEFAULT_VALUES = {
  name: "",
  cptCode: "",
  category: "Surgical",
  units: 1,
  charge: 0,
  description: "",
  duration: "",
  durationMinutes: 0,
  anesthesiaType: "",
  status: "Active",
};

export default function ProcedureForm({ procedure, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(procedureSchema),
    defaultValues: procedure || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (procedure) reset(procedure);
    else reset(DEFAULT_VALUES);
  }, [procedure, reset]);

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
      {/* Name */}
      <div>
        <FieldLabel required>Procedure Name</FieldLabel>
        <Input
          placeholder="e.g. Appendectomy"
          icon={<Scissors size={16} />}
          error={errors.name?.message}
          {...register("name")}
        />
        <FieldError error={errors.name} />
      </div>

      {/* CPT + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>CPT Code</FieldLabel>
          <Input
            placeholder="e.g. 44950"
            icon={<Hash size={16} />}
            error={errors.cptCode?.message}
            {...register("cptCode", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          <FieldError error={errors.cptCode} />
        </div>

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
      </div>

      {/* Units + Charge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Units</FieldLabel>
          <Input
            type="number"
            placeholder="1"
            icon={<Hash size={16} />}
            error={errors.units?.message}
            {...register("units", { valueAsNumber: true })}
          />
          <FieldError error={errors.units} />
        </div>

        <div>
          <FieldLabel required>Charge ($)</FieldLabel>
          <Input
            type="number"
            placeholder="2500"
            icon={<DollarSign size={16} />}
            error={errors.charge?.message}
            {...register("charge", { valueAsNumber: true })}
          />
          <FieldError error={errors.charge} />
        </div>
      </div>

      {/* Duration + Anesthesia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Duration (display)</FieldLabel>
          <Input
            placeholder="e.g. 60 min"
            icon={<Clock size={16} />}
            error={errors.duration?.message}
            {...register("duration")}
          />
          <FieldError error={errors.duration} />
        </div>

        <div>
          <FieldLabel>Anesthesia Protocol</FieldLabel>
          <Input
            placeholder="e.g. General Endotracheal"
            icon={<Stethoscope size={16} />}
            error={errors.anesthesiaType?.message}
            {...register("anesthesiaType")}
          />
          <FieldError error={errors.anesthesiaType} />
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

      {/* Status */}
      <div>
        <FieldLabel required>Status</FieldLabel>
        <select {...register("status")} className={selectClass}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <FieldError error={errors.status} />
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
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
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
              <span>{procedure ? "Update Procedure" : "Add Procedure"}</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}