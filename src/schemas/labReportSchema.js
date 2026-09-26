import { z } from "zod";

/* ============================================================
   📋 LAB REPORT SCHEMA — Diagnostic Test Validation
   ─────────────────────────────────────────────
   Used by:
   - LabReportForm.jsx
   - PatientLabReports.jsx
   ============================================================ */

/* ============================================================
   🎯 ENUMS
   ============================================================ */

const CATEGORIES = [
  "Hematology",
  "Biochemistry",
  "Radiology",
  "Cardiology",
  "Pulmonology",
  "Immunology",
  "Microbiology",
  "Endocrinology",
  "Neurology",
  "Gastroenterology",
];

const STATUSES = ["Pending", "Processing", "Completed", "Cancelled"];

const PRIORITIES = ["Routine", "Urgent", "Critical"];

const RESULTS = ["Normal", "Borderline", "Abnormal"];

const FLAGS = ["Normal", "High", "Low", "Critical"];

const SAMPLE_TYPES = [
  "Venous Blood / Serum",
  "Whole Blood / EDTA",
  "Plasma Heparin",
  "Heparinized Arterial",
  "Urine Sample",
  "Stool Sample",
  "Deep Sputum",
  "Joint Aspirate",
  "Tissue Biopsy",
  "Imaging Study",
  "Diagnostic Tracing",
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
  "Endocrinology",
  "Gastroenterology",
  "Radiology",
  "Emergency",
];

/* ============================================================
   📋 SCHEMA
   ============================================================ */

export const labReportSchema = z.object({
  /* ============ PATIENT ============ */
  patient: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .max(80, "Patient name too long")
    .regex(
      /^[A-Za-z\s.'-]+$/,
      "Patient name can only contain letters, spaces, and .'-"
    ),

  patientId: z
    .string()
    .max(20, "Patient ID too long")
    .optional()
    .or(z.literal("")),

  patientMrn: z
    .string()
    .max(30, "MRN too long")
    .optional()
    .or(z.literal("")),

  /* ============ TEST INFO ============ */
  testName: z
    .string()
    .min(2, "Test name must be at least 2 characters")
    .max(100, "Test name too long (max 100 characters)"),

  testCode: z
    .string()
    .max(20, "Test code too long")
    .regex(/^[A-Z0-9-]*$/i, "Only letters, numbers, and dashes")
    .optional()
    .or(z.literal("")),

  accessionNumber: z
    .string()
    .max(30, "Accession number too long")
    .regex(/^ACC-\d+$/i, "Format: ACC-NNNNN")
    .optional()
    .or(z.literal("")),

  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Select category" }),
  }),

  /* ============ ORDERING ============ */
  orderedBy: z
    .string()
    .min(3, "Doctor name must be at least 3 characters")
    .max(80, "Doctor name too long")
    .regex(
      /^(Dr\.|Prof\.)?\s?[A-Za-z\s.'-]+$/i,
      "Use format: Dr. Name or Name"
    ),

  department: z
    .enum(DEPARTMENTS, {
      errorMap: () => ({ message: "Select a department" }),
    })
    .optional()
    .or(z.literal("")),

  /* ============ DATES ============ */
  date: z
    .string()
    .min(1, "Date required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      { message: "Invalid date" }
    ),

  collectedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .optional()
    .or(z.literal("")),

  reportedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .optional()
    .or(z.literal("")),

  /* ============ STATUS ============ */
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: "Select status" }),
  }),

  priority: z.enum(PRIORITIES, {
    errorMap: () => ({ message: "Select priority" }),
  }),

  /* ============ RESULTS ============ */
  result: z
    .enum(RESULTS, {
      errorMap: () => ({ message: "Select result" }),
    })
    .optional()
    .or(z.literal("")),

  resultValue: z
    .string()
    .max(300, "Result value too long (max 300 characters)")
    .optional()
    .or(z.literal("")),

  referenceRange: z
    .string()
    .max(200, "Reference range too long")
    .optional()
    .or(z.literal("")),

  flag: z
    .enum(FLAGS, {
      errorMap: () => ({ message: "Select flag" }),
    })
    .optional()
    .or(z.literal("")),

  /* ============ SPECIMEN ============ */
  sampleType: z
    .enum(SAMPLE_TYPES, {
      errorMap: () => ({ message: "Select sample type" }),
    })
    .optional()
    .or(z.literal("")),

  labFacility: z
    .string()
    .max(100, "Lab facility too long")
    .optional()
    .or(z.literal("")),

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
      // Reported date must be >= collected date
      if (!data.collectedDate || !data.reportedDate) return true;
      return new Date(data.reportedDate) >= new Date(data.collectedDate);
    },
    {
      message: "Reported date must be on or after collected date",
      path: ["reportedDate"],
    }
  )
  .refine(
    (data) => {
      // Completed reports must have result
      if (data.status === "Completed" && !data.result) return false;
      return true;
    },
    {
      message: "Result is required when status is Completed",
      path: ["result"],
    }
  );

/* ============================================================
   🎯 CONSTANTS EXPORT
   ============================================================ */

export const LAB_CATEGORY_OPTIONS = CATEGORIES;
export const LAB_STATUS_OPTIONS = STATUSES;
export const LAB_PRIORITY_OPTIONS = PRIORITIES;
export const LAB_RESULT_OPTIONS = RESULTS;
export const LAB_FLAG_OPTIONS = FLAGS;
export const LAB_SAMPLE_TYPE_OPTIONS = SAMPLE_TYPES;
export const LAB_DEPARTMENT_OPTIONS = DEPARTMENTS;

export default labReportSchema;