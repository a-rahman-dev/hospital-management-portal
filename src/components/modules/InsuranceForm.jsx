import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insuranceSchema } from "@/schemas/insuranceSchema";
import Input from "@/components/ui/Input/Input";
import {
  Shield,
  Save,
  Hash,
  Mail,
  Phone,
  Percent,
  Building2,
  Loader2,
  Radio,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 INSURANCE FORM COLOR PALETTE (Rule 5)
   Primary: Amber (#f59e0b)
   ============================================================ */

const PROGRAMS = [
  "Commercial",
  "Medicare",
  "Medicaid",
  "Medicaid MCO",
  "Medicare Advantage",
  "Marketplace",
  "Military",
  "Behavioral Health",
];

const PLAN_TYPES = [
  "PPO",
  "HMO",
  "MCO",
  "MA",
  "ACA",
  "Federal",
  "State",
  "Specialty",
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/30 focus:border-amber-500 transition-all";

const DEFAULT_VALUES = {
  company: "",
  payerId: "",
  program: "Commercial",
  planType: "PPO",
  phone: "",
  email: "",
  clearinghouse: "Availity",
  ediId: "",
  coverage: "80%",
  status: "Active",
};

export default function InsuranceForm({ insurance, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(insuranceSchema),
    defaultValues: insurance || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (insurance) reset(insurance);
    else reset(DEFAULT_VALUES);
  }, [insurance, reset]);

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
      {/* Company */}
      <div>
        <FieldLabel required>Insurance Company</FieldLabel>
        <Input
          placeholder="e.g. Blue Cross Blue Shield"
          icon={<Building2 size={16} />}
          error={errors.company?.message}
          {...register("company")}
        />
        <FieldError error={errors.company} />
      </div>

      {/* Payer ID + Program */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Payer ID</FieldLabel>
          <Input
            placeholder="e.g. BCBS001"
            icon={<Hash size={16} />}
            error={errors.payerId?.message}
            {...register("payerId", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          <FieldError error={errors.payerId} />
        </div>

        <div>
          <FieldLabel required>Program</FieldLabel>
          <select {...register("program")} className={selectClass}>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError error={errors.program} />
        </div>
      </div>

      {/* Plan Type + Coverage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Plan Type</FieldLabel>
          <select {...register("planType")} className={selectClass}>
            {PLAN_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError error={errors.planType} />
        </div>

        <div>
          <FieldLabel required>Coverage %</FieldLabel>
          <Input
            placeholder="e.g. 80%"
            icon={<Percent size={16} />}
            error={errors.coverage?.message}
            {...register("coverage")}
          />
          <FieldError error={errors.coverage} />
        </div>
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Phone</FieldLabel>
          <Input
            placeholder="+1 (800) 555-0101"
            icon={<Phone size={16} />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FieldError error={errors.phone} />
        </div>

        <div>
          <FieldLabel required>Email</FieldLabel>
          <Input
            type="email"
            placeholder="claims@insurance.com"
            icon={<Mail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />
          <FieldError error={errors.email} />
        </div>
      </div>

      {/* Clearinghouse + EDI ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Clearinghouse</FieldLabel>
          <Input
            placeholder="e.g. Availity"
            icon={<Shield size={16} />}
            error={errors.clearinghouse?.message}
            {...register("clearinghouse")}
          />
          <FieldError error={errors.clearinghouse} />
        </div>

        <div>
          <FieldLabel required>EDI ID</FieldLabel>
          <Input
            placeholder="e.g. BCBS-EDI-01"
            icon={<Radio size={16} />}
            error={errors.ediId?.message}
            {...register("ediId")}
          />
          <FieldError error={errors.ediId} />
        </div>
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
        <button
          type="button"
          onClick={onCancel}
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
            background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.35)",
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
              <span>{insurance ? "Update Insurance" : "Add Insurance"}</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}