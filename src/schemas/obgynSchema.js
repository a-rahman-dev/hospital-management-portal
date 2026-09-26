import { z } from "zod";

/* ============================================================
   📋 OBGYN EXAM SCHEMA — Validation
   ============================================================ */

export const obgynSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name too long (max 80 characters)"),

  code: z
    .string()
    .min(3, "Code required")
    .max(20, "Code too long (max 20 characters)")
    .regex(
      /^[A-Z0-9-]+$/,
      "Only uppercase letters, numbers, and dashes allowed"
    ),

  category: z.enum(
    [
      "General",
      "Pelvic",
      "Breast",
      "Cervical",
      "Imaging",
      "Biopsy",
      "Procedure",
      "Pregnancy",
      "Counseling",
      "Assessment",
      "Screening",
    ],
    { errorMap: () => ({ message: "Select category" }) }
  ),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description too long (max 300 characters)"),

  duration: z
    .string()
    .min(1, "Duration required")
    .max(20, "Duration too long"),

  durationMinutes: z
    .number()
    .int()
    .min(1, "Must be at least 1 minute")
    .max(240, "Cannot exceed 240 minutes")
    .optional(),

  cptCode: z
    .string()
    .regex(/^[0-9]{5}$/, "CPT must be 5 digits")
    .optional()
    .or(z.literal("")),

  billable: z.boolean().default(true),

  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Select status" }),
  }),
});

export default obgynSchema;