import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  patientSchema,
  PATIENT_GENDER_OPTIONS,
  PATIENT_BLOOD_GROUP_OPTIONS,
  PATIENT_STATUS_OPTIONS,
  PATIENT_SPECIALTY_OPTIONS,
  PATIENT_INSURANCE_OPTIONS,
  PATIENT_RELATION_OPTIONS,
} from "@/schemas/patientSchema";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  HeartPulse,
  Save,
  Building,
  Shield,
  AlertCircle,
  Users,
  Calendar,
  Droplet,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 PATIENT FORM (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Sections:
   1. Personal Info
   2. Contact
   3. Emergency Contact
   4. Clinical Info
   5. Insurance & Admission
   ============================================================ */

const DOCTOR_OPTIONS = [
  "Dr. Jonathan Vance, MD",
  "Dr. Sarah Chen, MD, FACOG",
  "Dr. James Wilson, MD",
  "Dr. Michael Park, MD",
  "Dr. A. Rahman, MD",
  "Dr. Elena Rostova, MD",
  "Dr. Aisha Khan, MD, FCCP",
];

const selectClass =
  "w-full px-4 py-2.5 min-h-[44px] rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

const DEFAULT_VALUES = {
  name: "",
  mrn: "",
  dob: "",
  age: "",
  gender: "Male",
  bloodGroup: "O+",
  phone: "",
  email: "",
  address: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  disease: "",
  doctor: DOCTOR_OPTIONS[0],
  specialty: "Internal Medicine",
  status: "Active",
  room: "",
  allergies: "",
  insurance: "Blue Cross Blue Shield",
  admissionDate: "",
  notes: "",
};

/* ============================================================
   🎯 SECTION CARD
   ============================================================ */
function Section({ icon: Icon, title, subtitle, children, index = 0 }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
      animate={prefersReduced ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
          <Icon size={15} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/* ============================================================
   🎯 FIELD WRAPPER
   ============================================================ */
function Field({ label, required, error, children }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"
          role="alert"
        >
          <AlertCircle size={10} strokeWidth={2.5} />
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ============================================================
   🎯 MAIN: PatientForm
   ============================================================ */
export default function PatientForm({ patient, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: patient || DEFAULT_VALUES,
  });

  /* ============================================================
     🎯 AUTO-CALCULATE AGE FROM DOB
     ============================================================ */
  const dob = watch("dob");
  const age = watch("age");

  useEffect(() => {
    if (dob && !age) {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      if (calculatedAge > 0 && calculatedAge < 120) {
        setValue("age", calculatedAge);
      }
    }
  }, [dob, age, setValue]);

  useEffect(() => {
    if (patient) reset(patient);
    else reset(DEFAULT_VALUES);
  }, [patient, reset]);

  const submitHandler = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {/* ============================================================
          SECTION 1: PERSONAL INFO
         ============================================================ */}
      <Section
        icon={User}
        title="Personal Information"
        subtitle="Basic demographics & identity"
        index={0}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required error={errors.name?.message}>
            <Input
              placeholder="e.g. Jonathan Mitchell"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register("name")}
            />
          </Field>

          <Field label="Medical Record # (MRN)" error={errors.mrn?.message}>
            <Input
              placeholder="e.g. MRN-882109"
              icon={<FileText size={16} />}
              error={errors.mrn?.message}
              {...register("mrn")}
            />
          </Field>

          <Field label="Date of Birth" error={errors.dob?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.dob?.message}
              {...register("dob")}
            />
          </Field>

          <Field label="Age" required error={errors.age?.message}>
            <Input
              type="number"
              placeholder="e.g. 42"
              min="0"
              max="120"
              error={errors.age?.message}
              {...register("age", { valueAsNumber: true })}
            />
          </Field>

          <Field label="Gender" required error={errors.gender?.message}>
            <select {...register("gender")} className={selectClass}>
              {PATIENT_GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Blood Group" required error={errors.bloodGroup?.message}>
            <div className="relative">
              <Droplet
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none"
                aria-hidden="true"
              />
              <select
                {...register("bloodGroup")}
                className={cn(selectClass, "pl-10")}
              >
                {PATIENT_BLOOD_GROUP_OPTIONS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 2: CONTACT
         ============================================================ */}
      <Section
        icon={Phone}
        title="Contact Information"
        subtitle="Phone, email & address"
        index={1}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" required error={errors.phone?.message}>
            <Input
              placeholder="+1 (555) 100-2000"
              icon={<Phone size={16} />}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="patient@email.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
          </Field>

          <Field label="Address" error={errors.address?.message}>
            <Input
              placeholder="Street, City, State"
              icon={<Building size={16} />}
              error={errors.address?.message}
              containerClassName="sm:col-span-2"
              {...register("address")}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 3: EMERGENCY CONTACT
         ============================================================ */}
      <Section
        icon={Users}
        title="Emergency Contact"
        subtitle="Who to contact in case of emergency"
        index={2}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Contact Name" error={errors.emergencyContactName?.message}>
            <Input
              placeholder="e.g. Sarah Mitchell"
              icon={<User size={16} />}
              error={errors.emergencyContactName?.message}
              {...register("emergencyContactName")}
            />
          </Field>

          <Field label="Relation" error={errors.emergencyContactRelation?.message}>
            <select
              {...register("emergencyContactRelation")}
              className={selectClass}
            >
              <option value="">Select relation</option>
              {PATIENT_RELATION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Contact Phone" error={errors.emergencyContactPhone?.message}>
            <Input
              placeholder="+1 (555) 100-2001"
              icon={<Phone size={16} />}
              error={errors.emergencyContactPhone?.message}
              {...register("emergencyContactPhone")}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 4: CLINICAL INFO
         ============================================================ */}
      <Section
        icon={Stethoscope}
        title="Clinical Information"
        subtitle="Diagnosis, attending doctor & status"
        index={3}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Diagnosis / Condition"
            required
            error={errors.disease?.message}
          >
            <Input
              placeholder="e.g. Hypertension"
              icon={<HeartPulse size={16} />}
              error={errors.disease?.message}
              {...register("disease")}
            />
          </Field>

          <Field label="Assigned Doctor" required error={errors.doctor?.message}>
            <select {...register("doctor")} className={selectClass}>
              {DOCTOR_OPTIONS.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Specialty" error={errors.specialty?.message}>
            <select {...register("specialty")} className={selectClass}>
              <option value="">Select specialty</option>
              {PATIENT_SPECIALTY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" required error={errors.status?.message}>
            <select {...register("status")} className={selectClass}>
              {PATIENT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Room / Ward" error={errors.room?.message}>
            <Input
              placeholder="e.g. Room 304 - Tower A"
              icon={<Building size={16} />}
              error={errors.room?.message}
              {...register("room")}
            />
          </Field>

          <Field label="Known Allergies" error={errors.allergies?.message}>
            <Input
              placeholder="e.g. Penicillin, Shellfish"
              icon={<AlertCircle size={16} />}
              error={errors.allergies?.message}
              {...register("allergies")}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 5: INSURANCE & ADMISSION
         ============================================================ */}
      <Section
        icon={Shield}
        title="Insurance & Admission"
        subtitle="Payer details & admission date"
        index={4}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Insurance Provider" error={errors.insurance?.message}>
            <select {...register("insurance")} className={selectClass}>
              <option value="">Select insurance</option>
              {PATIENT_INSURANCE_OPTIONS.map((ins) => (
                <option key={ins} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Admission Date" error={errors.admissionDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.admissionDate?.message}
              {...register("admissionDate")}
            />
          </Field>

          <Field label="Notes" error={errors.notes?.message}>
            <textarea
              rows={3}
              placeholder="Additional clinical notes..."
              {...register("notes")}
              className={cn(
                selectClass,
                "resize-none",
                errors.notes && "border-rose-400 focus:border-rose-500"
              )}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          ACTIONS
         ============================================================ */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-gray-200 dark:border-[#1e293b]">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          loading={isSubmitting}
        >
          {patient ? "Update Patient" : "Save Patient"}
        </Button>
      </div>
    </form>
  );
}