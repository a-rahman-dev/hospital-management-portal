import { z } from "zod";

/* ============================================================
   📋 ICD SCHEMA — Validation for ICD/CPT/HCPCS codes
   ============================================================ */

export const icdSchema = z.object({
  code: z
    .string()
    .min(2, "Code required (min 2 characters)")
    .max(10, "Code too long (max 10 characters)")
    .regex(
      /^[A-Z0-9.]+$/,
      "Only uppercase letters, numbers, and dots allowed"
    ),

  codeType: z.enum(["ICD-10-CM", "CPT", "HCPCS"], {
    errorMap: () => ({ message: "Select code type" }),
  }),

  category: z.enum(
    [
      "Infectious Diseases",
      "Endocrine",
      "Endocrinology",
      "Mental Health",
      "Neurology",
      "Cardiovascular",
      "Respiratory",
      "Pulmonology",
      "Gastrointestinal",
      "Musculoskeletal",
      "Genitourinary",
      "Symptoms",
      "Evaluation & Management",
      "Diagnostic Cardiology",
      "Diagnostic Radiology",
      "Laboratory",
      "Orthopedics",
      "DME & Transport",
      "Pharmacy & Drugs",
    ],
    { errorMap: () => ({ message: "Select category" }) }
  ),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(300, "Description too long (max 300 characters)"),

  billable: z.boolean().default(true),
  hccEligible: z.boolean().default(false),

  usageFrequency: z.enum(["Low", "Moderate", "High", "Very High"], {
    errorMap: () => ({ message: "Select frequency" }),
  }),

  reimbursementTier: z
    .string()
    .min(2, "Reimbursement tier required")
    .max(100, "Tier name too long"),

  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Select status" }),
  }),
});

export default icdSchema;