import { z } from "zod";

/* ============================================================
   📋 INSURANCE SCHEMA — Validation
   ============================================================ */

export const insuranceSchema = z.object({
  company: z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(80, "Company name too long"),

  payerId: z
    .string()
    .min(3, "Payer ID required")
    .max(20, "Payer ID too long")
    .regex(/^[A-Z0-9-]+$/, "Only uppercase letters, numbers, and dashes"),

  program: z.enum(
    [
      "Commercial",
      "Medicare",
      "Medicaid",
      "Medicaid MCO",
      "Medicare Advantage",
      "Marketplace",
      "Military",
      "Behavioral Health",
    ],
    { errorMap: () => ({ message: "Select program" }) }
  ),

  planType: z.enum(
    ["PPO", "HMO", "MCO", "MA", "ACA", "Federal", "State", "Specialty"],
    { errorMap: () => ({ message: "Select plan type" }) }
  ),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .max(20, "Phone too long")
    .regex(/^[+\-\s0-9()]+$/, "Only digits, spaces, and +-() allowed"),

  email: z.string().email("Invalid email address"),

  clearinghouse: z
    .string()
    .min(2, "Clearinghouse required")
    .max(50, "Clearinghouse too long"),

  ediId: z
    .string()
    .min(3, "EDI ID required")
    .max(30, "EDI ID too long"),

  coverage: z
    .string()
    .min(1, "Coverage % required")
    .regex(/^\d{1,3}%$/, "Format: 80% (number followed by %)"),

  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Select status" }),
  }),
});

export default insuranceSchema;