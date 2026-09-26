import { z } from "zod";

/* ============================================================
   📋 BILLING SCHEMA — Invoice Validation
   ─────────────────────────────────────────────
   Used by:
   - BillingForm.jsx
   - PatientBilling.jsx
   - InsuranceForm.jsx
   ============================================================ */

/* ============================================================
   🎯 ENUMS
   ============================================================ */

const STATUSES = ["Paid", "Pending", "Overdue", "Cancelled"];

const PAYMENT_METHODS = [
  "Insurance Wire",
  "Credit Card",
  "Debit Card",
  "Cash",
  "Bank Transfer",
  "Direct ACH",
  "Electronic Claim",
  "CMS Clearinghouse",
  "Medicare Direct",
];

const DEPARTMENTS = [
  "Cardiology",
  "OB/GYN",
  "Neurology",
  "Internal Medicine",
  "Orthopedics",
  "Dermatology",
  "Pulmonology",
  "Pediatrics",
  "General Surgery",
  "Endocrinology",
  "Radiology",
  "Emergency",
];

const INSURANCE_PROVIDERS = [
  "Blue Cross Blue Shield",
  "Aetna Health",
  "Medicare Part B",
  "Medicare Part A & B",
  "UnitedHealthcare",
  "Cigna Commercial",
  "Humana Gold",
  "Kaiser Permanente",
  "Self-Pay",
];

/* ============================================================
   📋 SCHEMA
   ============================================================ */

export const billingSchema = z
  .object({
    /* ============ PATIENT ============ */
    patient: z
      .string()
      .min(2, "Patient name must be at least 2 characters")
      .max(80, "Patient name too long (max 80 characters)")
      .regex(
        /^[A-Za-z\s.'-]+$/,
        "Patient name can only contain letters, spaces, and .'-"
      ),

    patientId: z
      .string()
      .min(1, "Patient ID required")
      .max(20, "Patient ID too long")
      .optional()
      .or(z.literal("")),

    patientMrn: z
      .string()
      .max(30, "MRN too long")
      .optional()
      .or(z.literal("")),

    /* ============ INVOICE ============ */
    invoiceNo: z
      .string()
      .min(3, "Invoice number required")
      .max(30, "Invoice number too long")
      .regex(
        /^INV-\d{4}-\d{3,}$/,
        "Format: INV-YYYY-NNN (e.g. INV-2026-001)"
      ),

    service: z
      .string()
      .min(2, "Service description required")
      .max(200, "Service description too long (max 200 characters)"),

    department: z
      .enum(DEPARTMENTS, {
        errorMap: () => ({ message: "Select a department" }),
      })
      .optional()
      .or(z.literal("")),

    /* ============ AMOUNTS ============ */
    amount: z.coerce
      .number()
      .min(0, "Amount must be at least 0")
      .max(1000000, "Amount too large (max 1,000,000)"),

    insuranceCovered: z.coerce
      .number()
      .min(0, "Insurance amount must be at least 0")
      .max(1000000, "Insurance amount too large"),

    patientPay: z.coerce
      .number()
      .min(0, "Patient amount must be at least 0")
      .max(1000000, "Patient amount too large"),

    /* ============ INSURANCE ============ */
    insurance: z
      .enum(INSURANCE_PROVIDERS, {
        errorMap: () => ({ message: "Select insurance provider" }),
      }),

    /* ============ DATES ============ */
    serviceDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
      .optional()
      .or(z.literal("")),

    date: z
      .string()
      .min(1, "Billed date required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
      .refine(
        (val) => {
          const d = new Date(val);
          return !isNaN(d.getTime());
        },
        { message: "Invalid date" }
      ),

    dueDate: z
      .string()
      .min(1, "Due date required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
      .refine(
        (val) => {
          const d = new Date(val);
          return !isNaN(d.getTime());
        },
        { message: "Invalid date" }
      ),

    /* ============ STATUS & METHOD ============ */
    status: z.enum(STATUSES, {
      errorMap: () => ({ message: "Select status" }),
    }),

    method: z.enum(PAYMENT_METHODS, {
      errorMap: () => ({ message: "Select payment method" }),
    }),

    /* ============ NOTES ============ */
    notes: z
      .string()
      .max(500, "Notes too long (max 500 characters)")
      .optional()
      .or(z.literal("")),
  })
  /* ============================================================
     🎯 CROSS-FIELD VALIDATION
     ============================================================ */
  .refine(
    (data) => {
      // Total must equal insurance + patient
      const total = data.amount || 0;
      const insurance = data.insuranceCovered || 0;
      const copay = data.patientPay || 0;
      return Math.abs(total - (insurance + copay)) < 0.01;
    },
    {
      message: "Total must equal Insurance Covered + Patient Pay",
      path: ["amount"],
    }
  )
  .refine(
    (data) => {
      // Due date must be >= billed date
      if (!data.date || !data.dueDate) return true;
      return new Date(data.dueDate) >= new Date(data.date);
    },
    {
      message: "Due date must be on or after billed date",
      path: ["dueDate"],
    }
  )
  .refine(
    (data) => {
      // Insurance amount cannot exceed total
      if (data.insuranceCovered > data.amount) return false;
      return true;
    },
    {
      message: "Insurance covered cannot exceed total amount",
      path: ["insuranceCovered"],
    }
  );

/* ============================================================
   🎯 CONSTANTS EXPORT
   ============================================================ */

export const BILLING_STATUS_OPTIONS = STATUSES;
export const PAYMENT_METHOD_OPTIONS = PAYMENT_METHODS;
export const BILLING_DEPARTMENT_OPTIONS = DEPARTMENTS;
export const BILLING_INSURANCE_OPTIONS = INSURANCE_PROVIDERS;

export default billingSchema;