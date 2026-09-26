import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/schemas/userSchema";
import Input from "@/components/ui/Input/Input";
import {
  User,
  Save,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 USER FORM COLOR PALETTE (Rule 5 — Indigo)
   ============================================================ */

const ROLES = [
  "Super Admin",
  "Doctor",
  "Nurse",
  "Caregiver",
  "Receptionist",
  "Billing Manager",
  "Pharmacist",
  "Lab Technician",
  "Radiologist",
  "IT Support",
  "HR Manager",
  "Security",
  "Dietitian",
];

const selectClass =
  "w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

const DEFAULT_VALUES = {
  name: "",
  email: "",
  role: "Doctor",
  department: "",
  phone: "",
  status: "Active",
};

export default function UserForm({ user, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (user) reset(user);
    else reset(DEFAULT_VALUES);
  }, [user, reset]);

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
        <FieldLabel required>Full Name</FieldLabel>
        <Input
          placeholder="e.g. Sarah Chen"
          icon={<User size={16} />}
          error={errors.name?.message}
          {...register("name")}
        />
        <FieldError error={errors.name} />
      </div>

      {/* Email */}
      <div>
        <FieldLabel required>Email Address</FieldLabel>
        <Input
          type="email"
          placeholder="user@ayint-hospital.com"
          icon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email")}
        />
        <FieldError error={errors.email} />
      </div>

      {/* Role + Department */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Role</FieldLabel>
          <select {...register("role")} className={selectClass}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <FieldError error={errors.role} />
        </div>

        <div>
          <FieldLabel required>Department</FieldLabel>
          <Input
            placeholder="e.g. Cardiology"
            icon={<Briefcase size={16} />}
            error={errors.department?.message}
            {...register("department")}
          />
          <FieldError error={errors.department} />
        </div>
      </div>

      {/* Phone + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Phone</FieldLabel>
          <Input
            placeholder="+1 (555) 100-2000"
            icon={<Phone size={16} />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FieldError error={errors.phone} />
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
              <span>{user ? "Update User" : "Add User"}</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}