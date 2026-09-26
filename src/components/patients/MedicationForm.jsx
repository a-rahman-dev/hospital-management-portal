import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  medicationSchema,
  MEDICATION_STATUS_OPTIONS,
  MEDICATION_ROUTE_OPTIONS,
  MEDICATION_FREQUENCY_OPTIONS,
  MEDICATION_DEPARTMENT_OPTIONS,
} from "@/schemas/medicationSchema";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import {
  Pill,
  Calendar,
  Save,
  Clock,
  FlaskConical,
  User,
  Stethoscope,
  FileText,
  Building,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Loader2,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 MEDICATION FORM (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Sections:
   1. Patient & Prescriber
   2. Medication Details
   3. Schedule & Dosage
   4. Pharmacy & Refills
   5. Notes
   ============================================================ */

/* ============================================================
   🎯 DEFAULT DATA
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

const PATIENT_OPTIONS = [
  { id: "PAT-101", name: "Jonathan Mitchell", mrn: "MRN-882109" },
  { id: "PAT-102", name: "Emma Rodriguez", mrn: "MRN-902144" },
  { id: "PAT-103", name: "William Anderson", mrn: "MRN-781920" },
  { id: "PAT-104", name: "Sophia Bennett", mrn: "MRN-674312" },
  { id: "PAT-105", name: "Alexander Hayes", mrn: "MRN-551940" },
  { id: "PAT-106", name: "Olivia Zhang", mrn: "MRN-442811" },
  { id: "PAT-107", name: "David Miller", mrn: "MRN-331908" },
  { id: "PAT-108", name: "Isabella Martinez", mrn: "MRN-229081" },
  { id: "PAT-109", name: "Benjamin Clarke", mrn: "MRN-119873" },
  { id: "PAT-110", name: "Charlotte Davies", mrn: "MRN-098712" },
];

const PHARMACY_OPTIONS = [
  "CVS Caremark Central #44",
  "Walgreens Specialty Rx",
  "Rite Aid Community Pharmacy",
  "Metro Health Express Rx",
  "In-House Hospital Pharmacy",
  "CVS Pharmacy Main Blvd",
  "Surgical Tower Satellite Rx",
];

const selectClass =
  "w-full px-4 py-2.5 min-h-[44px] rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

const DEFAULT_VALUES = {
  patient: PATIENT_OPTIONS[0].name,
  patientId: PATIENT_OPTIONS[0].id,
  patientMrn: PATIENT_OPTIONS[0].mrn,
  medicine: "",
  genericName: "",
  rxNumber: "",
  dosage: "",
  frequency: "Once daily",
  route: "Oral Tablet",
  duration: "30 days",
  doctor: DOCTOR_OPTIONS[0],
  department: "Internal Medicine",
  prescribedDate: new Date().toISOString().split("T")[0],
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  pharmacy: "CVS Caremark Central #44",
  refillsRemaining: 3,
  status: "Active",
  notes: "",
};

/* ============================================================
   🎯 SECTION
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
   🎯 FIELD
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
   🎯 MAIN: MedicationForm
   ============================================================ */
export default function MedicationForm({ medication, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: medication || DEFAULT_VALUES,
  });

  /* ============================================================
     🎯 AUTO-FILL PATIENT ID/MRN
     ============================================================ */
  const selectedPatientName = watch("patient");

  useEffect(() => {
    const patient = PATIENT_OPTIONS.find(
      (p) => p.name === selectedPatientName
    );
    if (patient) {
      setValue("patientId", patient.id);
      setValue("patientMrn", patient.mrn);
    }
  }, [selectedPatientName, setValue]);

  useEffect(() => {
    if (medication) reset(medication);
    else reset(DEFAULT_VALUES);
  }, [medication, reset]);

  const submitHandler = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {/* ============================================================
          SECTION 1: PATIENT & PRESCRIBER
         ============================================================ */}
      <Section
        icon={User}
        title="Patient & Prescriber"
        subtitle="Who is this prescription for?"
        index={0}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Patient"
            required
            error={errors.patient?.message}
          >
            <select {...register("patient")} className={selectClass}>
              {PATIENT_OPTIONS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Prescribing Doctor"
            required
            error={errors.doctor?.message}
          >
            <select {...register("doctor")} className={selectClass}>
              {DOCTOR_OPTIONS.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Department" error={errors.department?.message}>
            <div className="relative">
              <Building
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"
                aria-hidden="true"
              />
              <select
                {...register("department")}
                className={cn(selectClass, "pl-10")}
              >
                {MEDICATION_DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Prescribed Date" error={errors.prescribedDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.prescribedDate?.message}
              {...register("prescribedDate")}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 2: MEDICATION DETAILS
         ============================================================ */}
      <Section
        icon={Pill}
        title="Medication Details"
        subtitle="Drug name and identification"
        index={1}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Brand Name" required error={errors.medicine?.message}>
            <Input
              placeholder="e.g. Lisinopril"
              icon={<Pill size={16} />}
              error={errors.medicine?.message}
              {...register("medicine")}
            />
          </Field>

          <Field label="Generic Name" error={errors.genericName?.message}>
            <Input
              placeholder="e.g. Lisinopril"
              icon={<FlaskConical size={16} />}
              error={errors.genericName?.message}
              {...register("genericName")}
            />
          </Field>

          <Field label="Rx Number" error={errors.rxNumber?.message}>
            <Input
              placeholder="e.g. RX-88401"
              icon={<FileText size={16} />}
              error={errors.rxNumber?.message}
              {...register("rxNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
          </Field>

          <Field label="Route" required error={errors.route?.message}>
            <select {...register("route")} className={selectClass}>
              {MEDICATION_ROUTE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 3: SCHEDULE & DOSAGE
         ============================================================ */}
      <Section
        icon={Clock}
        title="Schedule & Dosage"
        subtitle="How and when to take the medication"
        index={2}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Dosage" required error={errors.dosage?.message}>
            <Input
              placeholder="e.g. 10 mg"
              icon={<Timer size={16} />}
              error={errors.dosage?.message}
              {...register("dosage")}
            />
          </Field>

          <Field label="Frequency" required error={errors.frequency?.message}>
            <select {...register("frequency")} className={selectClass}>
              {MEDICATION_FREQUENCY_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Duration" required error={errors.duration?.message}>
            <Input
              placeholder="e.g. 30 days"
              icon={<Calendar size={16} />}
              error={errors.duration?.message}
              {...register("duration")}
            />
          </Field>

          <Field label="Start Date" required error={errors.startDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.startDate?.message}
              {...register("startDate")}
            />
          </Field>

          <Field label="End Date" error={errors.endDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.endDate?.message}
              {...register("endDate")}
            />
          </Field>

          <Field label="Status" required error={errors.status?.message}>
            <select {...register("status")} className={selectClass}>
              {MEDICATION_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 4: PHARMACY & REFILLS
         ============================================================ */}
      <Section
        icon={ShoppingBag}
        title="Pharmacy & Refills"
        subtitle="Where to fill and how many refills"
        index={3}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Pharmacy" error={errors.pharmacy?.message}>
            <div className="relative">
              <ShoppingBag
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"
                aria-hidden="true"
              />
              <select
                {...register("pharmacy")}
                className={cn(selectClass, "pl-10")}
              >
                {PHARMACY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field
            label="Refills Remaining"
            error={errors.refillsRemaining?.message}
          >
            <div className="relative">
              <RefreshCw
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="number"
                min="0"
                max="12"
                placeholder="e.g. 3"
                {...register("refillsRemaining", { valueAsNumber: true })}
                className={cn(
                  selectClass,
                  "pl-10",
                  errors.refillsRemaining &&
                    "border-rose-400 focus:border-rose-500"
                )}
              />
            </div>
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 5: NOTES
         ============================================================ */}
      <Section
        icon={FileText}
        title="Clinical Notes"
        subtitle="Additional information"
        index={4}
      >
        <Field label="Notes" error={errors.notes?.message}>
          <textarea
            rows={3}
            placeholder="Additional notes or instructions..."
            {...register("notes")}
            className={cn(
              selectClass,
              "resize-none py-3",
              errors.notes && "border-rose-400 focus:border-rose-500"
            )}
          />
        </Field>
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
          icon={
            isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )
          }
          loading={isSubmitting}
        >
          {medication ? "Update Medication" : "Add Medication"}
        </Button>
      </div>
    </form>
  );
}