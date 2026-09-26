import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  billingSchema,
  BILLING_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  BILLING_DEPARTMENT_OPTIONS,
  BILLING_INSURANCE_OPTIONS,
} from "@/schemas/billingSchema";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import {
  DollarSign,
  Calendar,
  Save,
  FileText,
  CreditCard,
  User,
  Building,
  Shield,
  AlertCircle,
  Loader2,
  Receipt,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 BILLING FORM (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Sections:
   1. Patient & Invoice
   2. Service
   3. Amounts
   4. Insurance & Payment
   5. Schedule
   ============================================================ */

/* ============================================================
   🎯 DEFAULT DATA
   ============================================================ */
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

const selectClass =
  "w-full px-4 py-2.5 min-h-[44px] rounded-xl text-sm bg-white dark:bg-[#090f1d] border border-gray-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

const DEFAULT_VALUES = {
  patient: PATIENT_OPTIONS[0].name,
  patientId: PATIENT_OPTIONS[0].id,
  patientMrn: PATIENT_OPTIONS[0].mrn,
  invoiceNo: `INV-2026-${String(Math.floor(100 + Math.random() * 900))}`,
  service: "",
  department: "Internal Medicine",
  amount: "",
  insuranceCovered: "",
  patientPay: "",
  insurance: "Blue Cross Blue Shield",
  status: "Pending",
  method: "Insurance Wire",
  serviceDate: new Date().toISOString().split("T")[0],
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
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
   🎯 MAIN: BillingForm
   ============================================================ */
export default function BillingForm({ bill, onSubmit, onCancel }) {
  const prefersReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: bill || DEFAULT_VALUES,
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

  /* ============================================================
     🎯 AUTO-CALCULATE PATIENT PAY
     ============================================================ */
  const amount = watch("amount");
  const insuranceCovered = watch("insuranceCovered");
  const patientPay = watch("patientPay");

  useEffect(() => {
    if (amount !== "" && insuranceCovered !== "") {
      const calc = Math.max(
        0,
        parseFloat(amount || 0) - parseFloat(insuranceCovered || 0)
      );
      setValue("patientPay", calc.toFixed(2));
    }
  }, [amount, insuranceCovered, setValue]);

  useEffect(() => {
    if (bill) reset(bill);
    else reset(DEFAULT_VALUES);
  }, [bill, reset]);

  const submitHandler = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {/* ============================================================
          SECTION 1: PATIENT & INVOICE
         ============================================================ */}
      <Section
        icon={User}
        title="Patient & Invoice"
        subtitle="Who is being billed and invoice reference"
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
            label="Invoice Number"
            required
            error={errors.invoiceNo?.message}
          >
            <Input
              placeholder="INV-2026-001"
              icon={<FileText size={16} />}
              error={errors.invoiceNo?.message}
              {...register("invoiceNo", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 2: SERVICE
         ============================================================ */}
      <Section
        icon={Receipt}
        title="Service Details"
        subtitle="What is being billed"
        index={1}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Service Description"
            required
            error={errors.service?.message}
          >
            <Input
              placeholder="e.g. Cardiac Angioplasty"
              icon={<FileText size={16} />}
              error={errors.service?.message}
              {...register("service")}
            />
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
                {BILLING_DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Service Date" error={errors.serviceDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.serviceDate?.message}
              {...register("serviceDate")}
            />
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 3: AMOUNTS
         ============================================================ */}
      <Section
        icon={Calculator}
        title="Amount Breakdown"
        subtitle="Total, insurance covered and patient pay"
        index={2}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            label="Total Amount ($)"
            required
            error={errors.amount?.message}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="150.00"
              icon={<DollarSign size={16} />}
              error={errors.amount?.message}
              {...register("amount")}
            />
          </Field>

          <Field
            label="Insurance Covered ($)"
            required
            error={errors.insuranceCovered?.message}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="120.00"
              icon={<DollarSign size={16} />}
              error={errors.insuranceCovered?.message}
              {...register("insuranceCovered")}
            />
          </Field>

          <Field
            label="Patient Pays ($) — Auto"
            required
            error={errors.patientPay?.message}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="30.00"
              icon={<DollarSign size={16} />}
              error={errors.patientPay?.message}
              readOnly
              className="bg-slate-50 dark:bg-white/[0.02] cursor-not-allowed"
              {...register("patientPay")}
            />
          </Field>
        </div>
        {amount && insuranceCovered && (
          <p className="text-[11px] font-bold text-indigo-500 flex items-center gap-1.5">
            <Calculator size={11} strokeWidth={2.5} />
            Auto-calculated: ${amount} − ${insuranceCovered} = $
            {patientPay || "0.00"}
          </p>
        )}
      </Section>

      {/* ============================================================
          SECTION 4: INSURANCE & PAYMENT
         ============================================================ */}
      <Section
        icon={Shield}
        title="Insurance & Payment"
        subtitle="Payer and settlement details"
        index={3}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Insurance Provider" required error={errors.insurance?.message}>
            <select {...register("insurance")} className={selectClass}>
              {BILLING_INSURANCE_OPTIONS.map((ins) => (
                <option key={ins} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Payment Method" required error={errors.method?.message}>
            <div className="relative">
              <CreditCard
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"
                aria-hidden="true"
              />
              <select
                {...register("method")}
                className={cn(selectClass, "pl-10")}
              >
                {PAYMENT_METHOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </div>
      </Section>

      {/* ============================================================
          SECTION 5: SCHEDULE
         ============================================================ */}
      <Section
        icon={Calendar}
        title="Schedule"
        subtitle="Billing dates and status"
        index={4}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Billed Date" required error={errors.date?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.date?.message}
              {...register("date")}
            />
          </Field>

          <Field label="Due Date" required error={errors.dueDate?.message}>
            <Input
              type="date"
              icon={<Calendar size={16} />}
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
          </Field>

          <Field label="Status" required error={errors.status?.message}>
            <select {...register("status")} className={selectClass}>
              {BILLING_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Notes" error={errors.notes?.message}>
          <textarea
            rows={3}
            placeholder="Additional billing notes..."
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
          {bill ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}