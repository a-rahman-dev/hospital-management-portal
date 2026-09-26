import { z } from "zod";

/* ============================================================
   📋 USER SCHEMA — Validation
   ============================================================ */

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name too long (max 60 characters)"),

  email: z
    .string()
    .email("Invalid email address")
    .max(120, "Email too long"),

  role: z.enum(
    [
      "Super Admin",
      "Doctor",
      "Nurse",
      "Caregiver",
      "Receptionist",
      "Billing Manager",
      "Pharmacist",
      "Lab Technician",
      "Radiologist",
      "IT Support",
      "HR Manager",
      "Security",
      "Dietitian",
    ],
    { errorMap: () => ({ message: "Select a role" }) }
  ),

  department: z
    .string()
    .min(2, "Department required")
    .max(60, "Department name too long"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .max(20, "Phone too long")
    .regex(/^[+\-\s0-9()]+$/, "Only digits, spaces, and +-() allowed"),

  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Select status" }),
  }),
});

export default userSchema;