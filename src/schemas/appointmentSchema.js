import { z } from "zod";

/* ============================================================
   📋 APPOINTMENT SCHEMA — Validation
   ─────────────────────────────────────────────
   Used by:
   - AppointmentForm.jsx
   - TodaySchedule.jsx (edit)
   - PatientAppointments.jsx
   ============================================================ */

/* ============================================================
   🎯 ENUMS (match data + UI)
   ============================================================ */

const APPOINTMENT_TYPES = [
  "In-Person",
  "Telehealth",
  "Emergency",
];

const APPOINTMENT_STATUSES = [
  "Confirmed",
  "Pending",
  "Cancelled",
  "Completed",
  "No-Show",
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

const REASONS = [
  "General",
  "Checkup",
  "Follow-up",
  "Consultation",
  "Emergency",
  "Procedure",
  "Lab Review",
  "Imaging Review",
];

/* ============================================================
   📋 SCHEMA
   ============================================================ */

export const appointmentSchema = z.object({
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

  /* ============ DOCTOR & DEPARTMENT ============ */
  doctor: z
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

  /* ============ DATE & TIME ============ */
  date: z
    .string()
    .min(1, "Date is required")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date must be in YYYY-MM-DD format"
    )
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: "Invalid date" }
    ),

  time: z
    .string()
    .min(1, "Time is required")
    .regex(
      /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,
      "Time must be in format: HH:MM AM/PM"
    ),

  duration: z
    .string()
    .regex(/^\d+\s?(min|mins|minutes|hr|hrs|hours)$/i, "Format: 30 min or 1 hr")
    .optional()
    .or(z.literal("")),

  /* ============ TYPE & STATUS ============ */
  type: z.enum(APPOINTMENT_TYPES, {
    errorMap: () => ({ message: "Select appointment type" }),
  }),

  status: z.enum(APPOINTMENT_STATUSES, {
    errorMap: () => ({ message: "Select status" }),
  }),

  reason: z
    .enum(REASONS, {
      errorMap: () => ({ message: "Select a reason" }),
    })
    .optional()
    .or(z.literal("")),

  /* ============ LOCATION ============ */
  room: z
    .string()
    .max(100, "Room name too long (max 100 characters)")
    .optional()
    .or(z.literal("")),

  /* ============ NOTES ============ */
  notes: z
    .string()
    .max(500, "Notes too long (max 500 characters)")
    .optional()
    .or(z.literal("")),

  /* ============ PRIORITY ============ */
  priority: z
    .enum(["Low", "Moderate", "High", "Critical"], {
      errorMap: () => ({ message: "Select priority" }),
    })
    .optional()
    .or(z.literal("")),
});

/* ============================================================
   🎯 CONSTANTS EXPORT (for forms)
   ============================================================ */

export const APPOINTMENT_TYPE_OPTIONS = APPOINTMENT_TYPES;
export const APPOINTMENT_STATUS_OPTIONS = APPOINTMENT_STATUSES;
export const DEPARTMENT_OPTIONS = DEPARTMENTS;
export const REASON_OPTIONS = REASONS;
export const PRIORITY_OPTIONS = ["Low", "Moderate", "High", "Critical"];

export default appointmentSchema;