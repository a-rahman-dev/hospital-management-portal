import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  labReportSchema,
  LAB_CATEGORY_OPTIONS,
  LAB_STATUS_OPTIONS,
  LAB_PRIORITY_OPTIONS,
  LAB_RESULT_OPTIONS,
  LAB_FLAG_OPTIONS,
  LAB_SAMPLE_TYPE_OPTIONS,
  LAB_DEPARTMENT_OPTIONS,
} from "@/schemas/labReportSchema";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import {
  FlaskConical,
  Calendar,
  Save,
  Stethoscope,
  User,
  FileText,
  AlertCircle,
  Loader2,
  Building,
  Beaker,
  Activity,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 LAB REPORT FORM (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Sections:
   1. Patient & Ordering
   2. Test Details
   3. Collection & Results
   4. Notes
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

const LAB_FACILITY_OPTIONS = [
  "Core Diagnostics L-2",
  "STAT Emergency Lab",
  "Immunology Lab 1",
  "Microbiology Lab 2",
  "Radiology Suite 1",
  "Cardiology Suite",
  "Neurology Suite 1",
  "Pulmonary Lab 2",
];

const selectClass =
  "w-full px-4 py-2.5 min-h-[44px] rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

const DEFAULT_VALUES = {
  patient: PATIENT_OPTIONS[0].name,
  patientId: PATIENT_OPTIONS[0].id,
  patientMrn: PATIENT_OPTIONS[0].mrn,
  testName: "",
  testCode: "",
  accessionNumber: "",
  category: "Hematology",
  orderedBy: DOCTOR_OPTIONS[0],
  department: "Internal Medicine",
  date: new Date().toISOString().split("T")[0],
  collectedDate: new Date().toISOString().split("T")[0],
  reportedDate: "",
  status: "Pending",
  priority: "Routine",
  result: "",
  resultValue: "",
  referenceRange: "",
  flag: "",
  sampleType: "Venous Blood / Serum",
  labFacility: "Core Diagnostics L-2",
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
   🎯 MAIN: LabReportForm
   ============================================================ */
export default function LabReportForm({ report, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(labReportSchema),
    defaultValues: report || DEFAULT_VALUES,
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
    if (report) reset(report);
    else reset(DEFAULT_VALUES);
  }, [report, reset]);

  const submitHandler = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {/* ============================================================
          SECTION 1: PATIENT & ORDERING
         ============================================================ */}
      <Section
        icon={User}
        title="Patient & Ordering"
        subtitle="Who is this test for and who ordered it?"
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
            label="Ordering Doctor"
            required
            error={errors.orderedBy?.message}
          >
            <select {...register("orderedBy")} className={selectClass}>
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
                <option value="">Select department</option>
                {LAB_DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Sample Type" error={errors.sampleType?.message}>
            <select {...register("sampleType")} className={selectClass}>
              {LAB_SAMPLE_TYPE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 2: TEST DETAILS
         ============================================================ */}
      <Section
        icon={FlaskConical}
        title="Test Details"
        subtitle="Test name, code and category"
        index={1}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Test Name" required error={errors.testName?.message}>
            <Input
              placeholder="e.g. Complete Blood Count (CBC)"
              icon={<FlaskConical size={16} />}
              error={errors.testName?.message}
              {...register("testName")}
            />
          </Field>

          <Field label="Category" required error={errors.category?.message}>
            <select {...register("category")} className={selectClass}>
              {LAB_CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Test Code" error={errors.testCode?.message}>
            <Input
              placeholder="e.g. CBC"
              icon={<FileText size={16} />}
              error={errors.testCode?.message}
              {...register("testCode", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
          </Field>

          <Field label="Accession Number" error={errors.accessionNumber?.message}>
            <Input
              placeholder="e.g. ACC-99201"
              icon={<FileCheck size={16} />}
              error={errors.accessionNumber?.message}
              {...register("accessionNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 3: COLLECTION & RESULTS
         ============================================================ */}
      <Section
        icon={Beaker}
        title="Collection & Results"
        subtitle="Sample collection and test results"
        index={2}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ordered Date" required error={errors.date?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.date?.message}
              {...register("date")}
            />
          </Field>

          <Field label="Collected Date" error={errors.collectedDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.collectedDate?.message}
              {...register("collectedDate")}
            />
          </Field>

          <Field label="Reported Date" error={errors.reportedDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.reportedDate?.message}
              {...register("reportedDate")}
            />
          </Field>

          <Field label="Lab Facility" error={errors.labFacility?.message}>
            <select {...register("labFacility")} className={selectClass}>
              {LAB_FACILITY_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" required error={errors.status?.message}>
            <select {...register("status")} className={selectClass}>
              {LAB_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Priority" required error={errors.priority?.message}>
            <select {...register("priority")} className={selectClass}>
              {LAB_PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Result" error={errors.result?.message}>
            <select {...register("result")} className={selectClass}>
              <option value="">—</option>
              {LAB_RESULT_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Flag" error={errors.flag?.message}>
            <div className="relative">
              <Activity
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"
                aria-hidden="true"
              />
              <select
                {...register("flag")}
                className={cn(selectClass, "pl-10")}
              >
                <option value="">—</option>
                {LAB_FLAG_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Reference Range" error={errors.referenceRange?.message}>
            <Input
              placeholder="e.g. WBC 4.5-11.0"
              icon={<FileText size={16} />}
              error={errors.referenceRange?.message}
              {...register("referenceRange")}
            />
          </Field>

          <Field label="Result Value" error={errors.resultValue?.message}>
            <textarea
              rows={2}
              placeholder="e.g. WBC 7.2, RBC 4.8, Hgb 14.2"
              {...register("resultValue")}
              className={cn(
                selectClass,
                "resize-none py-2.5",
                errors.resultValue && "border-rose-400"
              )}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 4: NOTES
         ============================================================ */}
      <Section
        icon={FileText}
        title="Clinical Notes"
        subtitle="Additional information for the lab"
        index={3}
      >
        <Field label="Notes" error={errors.notes?.message}>
          <textarea
            rows={3}
            placeholder="Additional notes or special instructions..."
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
          {report ? "Update Report" : "Add Report"}
        </Button>
      </div>
    </form>
  );
}