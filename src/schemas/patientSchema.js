import { z } from "zod";

/* ============================================================
   📋 PATIENT SCHEMA — Patient Registration Validation
   ─────────────────────────────────────────────
   Used by:
   - PatientForm.jsx
   - Patients.jsx (add/edit)
   ============================================================ */

/* ============================================================
   🎯 ENUMS
   ============================================================ */

const GENDERS = ["Male", "Female", "Other"];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STATUSES = ["Active", "Recovered", "Critical"];

const SPECIALTIES = [
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
  "Gastroenterology",
  "Urology",
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

const RELATIONS = [
  "Spouse",
  "Wife",
  "Husband",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Friend",
  "Guardian",
  "Other",
];

/* ============================================================
   📋 SCHEMA
   ============================================================ */

export const patientSchema = z.object({
  /* ============ PERSONAL INFO ============ */
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long (max 80 characters)")
    .regex(
      /^[A-Za-z\s.'-]+$/,
      "Name can only contain letters, spaces, and .'-"
    ),

  mrn: z
    .string()
    .min(3, "MRN required")
    .max(30, "MRN too long")
    .regex(/^MRN-\d+$/i, "Format: MRN-NNNNNN")
    .optional()
    .or(z.literal("")),

  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .optional()
    .or(z.literal("")),

  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(120, "Age cannot exceed 120"),

  gender: z.enum(GENDERS, {
    errorMap: () => ({ message: "Select a gender" }),
  }),

  bloodGroup: z.enum(BLOOD_GROUPS, {
    errorMap: () => ({ message: "Select a blood group" }),
  }),

  /* ============ CONTACT ============ */
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .max(20, "Phone too long")
    .regex(/^[+\-\s0-9()]+$/, "Invalid phone number"),

  email: z
    .string()
    .email("Invalid email address")
    .max(120, "Email too long")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "Address too long")
    .optional()
    .or(z.literal("")),

  /* ============ EMERGENCY CONTACT ============ */
  emergencyContactName: z
    .string()
    .max(80, "Emergency contact name too long")
    .optional()
    .or(z.literal("")),

  emergencyContactRelation: z
    .enum(RELATIONS, {
      errorMap: () => ({ message: "Select relation" }),
    })
    .optional()
    .or(z.literal("")),

  emergencyContactPhone: z
    .string()
    .max(20, "Emergency phone too long")
    .regex(/^[+\-\s0-9()]*$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),

  /* ============ CLINICAL INFO ============ */
  disease: z
    .string()
    .min(2, "Diagnosis must be at least 2 characters")
    .max(200, "Diagnosis too long (max 200 characters)"),

  doctor: z
    .string()
    .min(3, "Doctor name must be at least 3 characters")
    .max(80, "Doctor name too long")
    .regex(
      /^(Dr\.|Prof\.)?\s?[A-Za-z\s.'-]+$/i,
      "Use format: Dr. Name or Name"
    ),

  specialty: z
    .enum(SPECIALTIES, {
      errorMap: () => ({ message: "Select a specialty" }),
    })
    .optional()
    .or(z.literal("")),

  status: z.enum(STATUSES, {
    errorMap: () => ({ message: "Select a status" }),
  }),

  room: z
    .string()
    .max(100, "Room name too long")
    .optional()
    .or(z.literal("")),

  /* ============ MEDICAL DETAILS ============ */
  allergies: z
    .string()
    .max(300, "Allergies list too long")
    .optional()
    .or(z.literal("")),

  /* ============ INSURANCE ============ */
  insurance: z
    .enum(INSURANCE_PROVIDERS, {
      errorMap: () => ({ message: "Select insurance provider" }),
    })
    .optional()
    .or(z.literal("")),

  /* ============ DATES ============ */
  admissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      { message: "Invalid date" }
    )
    .optional()
    .or(z.literal("")),

  /* ============ NOTES ============ */
  notes: z
    .string()
    .max(500, "Notes too long (max 500 characters)")
    .optional()
    .or(z.literal("")),
});

/* ============================================================
   🎯 CONSTANTS EXPORT
   ============================================================ */

export const PATIENT_GENDER_OPTIONS = GENDERS;
export const PATIENT_BLOOD_GROUP_OPTIONS = BLOOD_GROUPS;
export const PATIENT_STATUS_OPTIONS = STATUSES;
export const PATIENT_SPECIALTY_OPTIONS = SPECIALTIES;
export const PATIENT_INSURANCE_OPTIONS = INSURANCE_PROVIDERS;
export const PATIENT_RELATION_OPTIONS = RELATIONS;

export default patientSchema;