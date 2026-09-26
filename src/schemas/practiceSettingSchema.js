import { z } from "zod";

/* ============================================================
   📋 PRACTICE SETTING SCHEMA — Validation
   ============================================================ */

const phoneRegex = /^\+?[\d\s()-]{7,20}$/;
const npiRegex = /^\d{10}$/;
const einRegex = /^\d{2}-?\d{7}$/;
const zipRegex = /^\d{5}(-\d{4})?$/;

export const practiceSettingSchema = z.object({
  /* ============ LEGAL IDENTITY ============ */
  clinicName: z
    .string()
    .min(3, "Clinic name must be at least 3 characters")
    .max(100, "Clinic name too long"),

  legalName: z
    .string()
    .min(3, "Legal entity name required")
    .max(150, "Legal name too long"),

  npi: z.string().regex(npiRegex, "NPI must be exactly 10 digits"),

  npiType: z.string().min(2, "NPI type required"),

  groupNPI: z
    .string()
    .regex(npiRegex, "Group NPI must be exactly 10 digits")
    .optional()
    .or(z.literal("")),

  billingNPI: z
    .string()
    .regex(npiRegex, "Billing NPI must be exactly 10 digits")
    .optional()
    .or(z.literal("")),

  taxId: z.string().regex(einRegex, "EIN must be XX-XXXXXXX format"),

  license: z.string().min(3, "License # required").max(50),

  licenseState: z.string().min(2, "State required"),

  taxonomyCode: z
    .string()
    .min(5, "Taxonomy code required")
    .max(20, "Taxonomy code too long"),

  /* ============ CONTACT ============ */
  phone: z.string().regex(phoneRegex, "Invalid phone format"),

  secondaryPhone: z
    .string()
    .regex(phoneRegex, "Invalid phone format")
    .optional()
    .or(z.literal("")),

  emergencyPhone: z.string().regex(phoneRegex, "Invalid phone format"),

  email: z.string().email("Invalid email format"),

  billingEmail: z.string().email("Invalid billing email"),

  hipaaOfficerEmail: z
    .string()
    .email("Invalid HIPAA officer email")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .url("Must be a valid URL (include https://)")
    .optional()
    .or(z.literal("")),

  address: z.string().min(5, "Street address required").max(200),

  addressLine2: z.string().max(100).optional().or(z.literal("")),

  city: z.string().min(2, "City required").max(50),

  state: z.string().min(2, "State required").max(50),

  zipCode: z.string().regex(zipRegex, "Invalid ZIP (use 12345 or 12345-6789)"),

  country: z.string().min(2, "Country required"),

  /* ============ PROVIDER ============ */
  primaryProvider: z.string().min(3, "Provider name required").max(80),

  providerTitle: z.string().min(2, "Title required").max(30),

  specialty: z.string().min(2, "Specialty required").max(60),

  providerNPI: z
    .string()
    .regex(npiRegex, "Provider NPI must be exactly 10 digits")
    .optional()
    .or(z.literal("")),

  providerDEA: z
    .string()
    .min(5, "DEA # required")
    .max(15, "DEA # too long")
    .optional()
    .or(z.literal("")),

  medicalSchool: z.string().max(100).optional().or(z.literal("")),

  yearsOfExperience: z
    .string()
    .regex(/^\d{1,2}$/, "Years must be 1-2 digits")
    .optional()
    .or(z.literal("")),

  languagesSpoken: z.string().max(150).optional().or(z.literal("")),

  /* ============ BILLING ============ */
  billingAddress: z.string().min(5, "Billing address required").max(200),

  billingCity: z.string().min(2, "Billing city required"),

  billingState: z.string().min(2, "Billing state required"),

  billingZip: z.string().regex(zipRegex, "Invalid billing ZIP"),

  paymentTerms: z.string().min(2, "Payment terms required"),

  acceptedInsurances: z.string().max(300).optional().or(z.literal("")),

  clearinghouse: z.string().min(2, "Clearinghouse required"),

  ediPayerId: z.string().min(2, "EDI Payer ID required"),

  clearinghouseEdiId: z.string().min(2, "EDI Gateway ID required"),

  /* ============ LOCALE ============ */
  timezone: z.string().min(3, "Timezone required"),

  currency: z.string().min(2, "Currency required"),

  language: z.string().min(2, "Language required"),

  dateFormat: z.string().min(2, "Date format required"),

  timeFormat: z.string().min(2, "Time format required"),

  defaultSlotDuration: z
    .string()
    .regex(/^\d{2,3}$/, "Duration must be 2-3 digits"),

  /* ============ POLICIES ============ */
  autoAppointmentReminders: z.boolean().default(true),
  telehealthIntegration: z.boolean().default(true),
  twoFactorEnforcement: z.boolean().default(true),
  hipaaAuditLogging: z.boolean().default(true),
});

export default practiceSettingSchema;