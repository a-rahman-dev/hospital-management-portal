import { z } from "zod";

/* ============================================================
   📋 MEDICATION SCHEMA — Prescription Validation
   ============================================================ */

const STATUSES = ["Active", "Refill Needed", "Completed", "Discontinued"];

const ROUTES = [
  "Oral Tablet", "Oral Capsule", "Oral Extended Release", "Oral Solution",
  "Intravenous (IV)", "Intramuscular (IM)", "Subcutaneous Injection",
  "Inhalation Aerosol", "Inhalation Powder", "Topical Ointment", "Topical Cream",
  "Ophthalmic Drops", "Otic Drops", "Nasal Spray", "Rectal Suppository",
];

const FREQUENCIES = [
  "Once daily", "Once daily at bedtime", "Once daily morning",
  "Twice daily", "Twice daily with meals", "Three times daily",
  "Four times daily", "Every 4-6 hours PRN", "Every 6 hours",
  "Every 8 hours", "As needed", "Weekly", "Monthly",
];

const DEPARTMENTS = [
  "Cardiology", "OB/GYN", "Neurology", "Internal Medicine",
  "Orthopedics", "Dermatology", "Pulmonology", "Pediatrics",
  "Endocrinology", "Gastroenterology", "Mental Health", "Urology", "Emergency",
];

export const medicationSchema = z
  .object({
    patient: z
      .string()
      .min(2, "Patient name must be at least 2 characters")
      .max(80, "Patient name too long")
      .regex(/^[A-Za-z\s.'-]+$/, "Patient name can only contain letters, spaces, and .'-"),

    patientId: z.string().max(20, "Patient ID too long").optional().or(z.literal("")),
    patientMrn: z.string().max(30, "MRN too long").optional().or(z.literal("")),

    medicine: z
      .string()
      .min(2, "Medicine name must be at least 2 characters")
      .max(100, "Medicine name too long"),

    genericName: z.string().max(100, "Generic name too long").optional().or(z.literal("")),

    rxNumber: z
      .string()
      .max(30, "Rx number too long")
      .regex(/^RX-\d+$/i, "Format: RX-NNNNN")
      .optional()
      .or(z.literal("")),

    dosage: z
      .string()
      .min(1, "Dosage required")
      .max(50, "Dosage too long")
      .regex(/^\d+(\.\d+)?\s?(mg|mcg|g|ml|IU|%)$/i, "Format: 10 mg, 500 mcg, 5 ml, etc."),

    frequency: z.enum(FREQUENCIES, {
      errorMap: () => ({ message: "Select frequency" }),
    }),

    route: z
      .enum(ROUTES, { errorMap: () => ({ message: "Select route" }) })
      .optional()
      .or(z.literal("")),

    duration: z
      .string()
      .min(1, "Duration required")
      .max(30, "Duration too long")
      .regex(/^\d+\s?(day|days|week|weeks|month|months)$/i, "Format: 30 days, 2 weeks, etc."),

    doctor: z
      .string()
      .min(3, "Doctor name must be at least 3 characters")
      .max(80, "Doctor name too long")
      .regex(/^(Dr\.|Prof\.)?\s?[A-Za-z\s.'-]+$/i, "Use format: Dr. Name or Name"),

    department: z
      .enum(DEPARTMENTS, { errorMap: () => ({ message: "Select a department" }) })
      .optional()
      .or(z.literal("")),

    prescribedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
      .optional()
      .or(z.literal("")),

    startDate: z
      .string()
      .min(1, "Start date required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
      .refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid date" }),

    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
      .optional()
      .or(z.literal("")),

    pharmacy: z.string().max(100, "Pharmacy name too long").optional().or(z.literal("")),

    refillsRemaining: z.coerce
      .number()
      .int("Must be whole number")
      .min(0, "Cannot be negative")
      .max(12, "Max 12 refills")
      .optional(),

    status: z.enum(STATUSES, {
      errorMap: () => ({ message: "Select status" }),
    }),

    notes: z.string().max(500, "Notes too long").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    { message: "End date must be on or after start date", path: ["endDate"] }
  )
  .refine(
    (data) => {
      if (data.status === "Refill Needed" && data.refillsRemaining > 0) return false;
      return true;
    },
    { message: "Refill Needed status requires 0 refills remaining", path: ["refillsRemaining"] }
  )
  .refine(
    (data) => {
      if (data.status === "Active" && data.refillsRemaining === 0) return false;
      return true;
    },
    { message: "Active medication should have at least 1 refill", path: ["refillsRemaining"] }
  );

export const MEDICATION_STATUS_OPTIONS = STATUSES;
export const MEDICATION_ROUTE_OPTIONS = ROUTES;
export const MEDICATION_FREQUENCY_OPTIONS = FREQUENCIES;
export const MEDICATION_DEPARTMENT_OPTIONS = DEPARTMENTS;

export default medicationSchema;