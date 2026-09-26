import { z } from "zod";

/* ============================================================
   📋 PROCEDURE SCHEMA — Validation
   ============================================================ */

export const procedureSchema = z.object({
  name: z
    .string()
    .min(3, "Procedure name must be at least 3 characters")
    .max(100, "Procedure name too long (max 100 characters)"),

  cptCode: z
    .string()
    .min(3, "CPT code required")
    .max(10, "CPT code too long")
    .regex(/^[0-9A-Z]+$/, "Only numbers and uppercase letters"),

  category: z.enum(
    [
      "Surgical",
      "Endoscopy",
      "Cardiology",
      "Obstetric",
      "Gynecologic",
      "Ophthalmology",
      "ENT",
      "Orthopedic",
      "Dermatology",
      "General",
      "Diagnostic",
      "Radiology",
    ],
    { errorMap: () => ({ message: "Select category" }) }
  ),

  units: z.coerce
    .number()
    .int("Units must be a whole number")
    .min(1, "At least 1 unit")
    .max(100, "Max 100 units"),

  charge: z.coerce
    .number()
    .min(0, "Charge must be positive")
    .max(500000, "Charge too large"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description too long (max 300 characters)"),

  duration: z
    .string()
    .min(1, "Duration required")
    .max(30, "Duration too long")
    .optional(),

  durationMinutes: z
    .number()
    .int()
    .min(1, "Must be at least 1 minute")
    .max(10000, "Cannot exceed 10000 minutes")
    .optional(),

  anesthesiaType: z
    .string()
    .min(2, "Anesthesia type required")
    .max(50, "Anesthesia type too long")
    .optional(),

  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Select status" }),
  }),
});

export default procedureSchema;