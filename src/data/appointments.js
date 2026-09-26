/* ============================================================
   📅 APPOINTMENTS DATA — Appointment Management
   ─────────────────────────────────────────────
   Used by:
   - TodaySchedule.jsx (dashboard widget)
   - PatientAppointments.jsx (main page)
   
   Status flow:
   Scheduled → Confirmed → In-Progress → Completed
                           ↓
                        Cancelled / No-Show
   
   Foreign data + real-looking schedule (Rule 3)
   Patient IDs match patients.js (consistency)
   ============================================================ */

import { initialPatients } from "./patients";

/* ============================================================
   📅 APPOINTMENTS — Full list
   ─────────────────────────────────────────────
   Each appointment includes:
   - Timing (date, time, duration)
   - Patient + Doctor info
   - Type (In-Person / Telehealth / Emergency)
   - Status (Confirmed | Pending | Cancelled | Completed | No-Show)
   ============================================================ */
export const initialAppointments = [
  /* ============ TODAY'S SCHEDULE (Morning) ============ */
  {
    id: "APT-201",
    patientName: "Jonathan Mitchell",
    patientId: "PAT-101",
    patientMrn: "MRN-882109",
    doctorName: "Dr. Jonathan Vance, MD",
    department: "Cardiology",
    date: "2026-09-17",
    time: "09:30 AM",
    duration: 30,
    type: "In-Person",
    reason: "Post-Angioplasty Follow-up",
    room: "Suite 302 - Tower B",
    status: "Confirmed",
    checkInTime: "09:25 AM",
    notes: "Patient reports mild chest discomfort",
    avatarColor: "from-blue-600 to-indigo-600",
    createdAt: "2026-09-10T08:15:00Z",
  },
  {
    id: "APT-202",
    patientName: "Emma Rodriguez",
    patientId: "PAT-102",
    patientMrn: "MRN-902144",
    doctorName: "Dr. Sarah Chen, MD",
    department: "OB/GYN",
    date: "2026-09-17",
    time: "10:15 AM",
    duration: 45,
    type: "In-Person",
    reason: "Third Trimester Ultrasound",
    room: "Maternity Suite 12",
    status: "Confirmed",
    checkInTime: "10:10 AM",
    notes: "32 weeks — routine scan",
    avatarColor: "from-purple-600 to-pink-600",
    createdAt: "2026-09-08T14:30:00Z",
  },
  {
    id: "APT-203",
    patientName: "William Anderson",
    patientId: "PAT-103",
    patientMrn: "MRN-781920",
    doctorName: "Dr. James Wilson, MD",
    department: "Neurology",
    date: "2026-09-17",
    time: "11:00 AM",
    duration: 30,
    type: "Telehealth",
    reason: "EEG & Stroke Recovery Review",
    room: "Virtual Room 4",
    status: "Pending",
    checkInTime: null,
    notes: "Awaiting patient confirmation",
    avatarColor: "from-cyan-600 to-blue-600",
    createdAt: "2026-09-12T09:45:00Z",
  },
  {
    id: "APT-204",
    patientName: "Sophia Bennett",
    patientId: "PAT-104",
    patientMrn: "MRN-674312",
    doctorName: "Dr. A. Rahman",
    department: "Internal Medicine",
    date: "2026-09-17",
    time: "11:45 AM",
    duration: 30,
    type: "In-Person",
    reason: "HbA1c & Blood Pressure Control",
    room: "Clinic Room 104",
    status: "Confirmed",
    checkInTime: null,
    notes: "Fasting labs required",
    avatarColor: "from-orange-500 to-amber-600",
    createdAt: "2026-09-11T16:20:00Z",
  },

  /* ============ TODAY'S SCHEDULE (Afternoon) ============ */
  {
    id: "APT-205",
    patientName: "Alexander Hayes",
    patientId: "PAT-105",
    patientMrn: "MRN-551940",
    doctorName: "Dr. Marcus Park, FAAP",
    department: "Orthopedics",
    date: "2026-09-17",
    time: "01:30 PM",
    duration: 45,
    type: "In-Person",
    reason: "Knee Ligament Rehab Evaluation",
    room: "Physio Ward 2",
    status: "Pending",
    checkInTime: null,
    notes: "6-week post-op assessment",
    avatarColor: "from-rose-500 to-red-600",
    createdAt: "2026-09-09T11:00:00Z",
  },
  {
    id: "APT-206",
    patientName: "Olivia Zhang",
    patientId: "PAT-106",
    patientMrn: "MRN-442811",
    doctorName: "Dr. Elena Rostova, MD",
    department: "Dermatology",
    date: "2026-09-17",
    time: "02:15 PM",
    duration: 30,
    type: "Telehealth",
    reason: "Allergy Flare Treatment Check",
    room: "Virtual Room 2",
    status: "Confirmed",
    checkInTime: null,
    notes: "Follow-up on topical steroid response",
    avatarColor: "from-teal-500 to-emerald-600",
    createdAt: "2026-09-10T13:00:00Z",
  },
  {
    id: "APT-207",
    patientName: "David Miller",
    patientId: "PAT-107",
    patientMrn: "MRN-331908",
    doctorName: "Dr. Aisha Khan, MD",
    department: "Pulmonology",
    date: "2026-09-17",
    time: "03:00 PM",
    duration: 30,
    type: "In-Person",
    reason: "Routine Spirometry Check",
    room: "Pulmonary Wing 101",
    status: "Cancelled",
    cancelledReason: "Patient rescheduled to next week",
    cancelledAt: "2026-09-16T18:30:00Z",
    checkInTime: null,
    notes: "Rescheduled by patient",
    avatarColor: "from-indigo-600 to-violet-600",
    createdAt: "2026-09-05T10:00:00Z",
  },

  /* ============ MORE TODAY (Added for realistic schedule) ============ */
  {
    id: "APT-208",
    patientName: "Isabella Martinez",
    patientId: "PAT-108",
    patientMrn: "MRN-229081",
    doctorName: "Dr. James Wilson, MD",
    department: "Cardiology",
    date: "2026-09-17",
    time: "03:45 PM",
    duration: 30,
    type: "In-Person",
    reason: "Post-MI Cardiac Assessment",
    room: "Cardio Suite 401",
    status: "Confirmed",
    checkInTime: null,
    notes: "Urgent — post-MI monitoring",
    avatarColor: "from-rose-500 to-pink-600",
    createdAt: "2026-09-16T08:00:00Z",
  },
  {
    id: "APT-209",
    patientName: "Benjamin Clarke",
    patientId: "PAT-109",
    patientMrn: "MRN-119873",
    doctorName: "Dr. Aisha Khan, MD",
    department: "Pulmonology",
    date: "2026-09-17",
    time: "04:30 PM",
    duration: 30,
    type: "Telehealth",
    reason: "Post-Pneumonia Follow-up",
    room: "Virtual Room 1",
    status: "Confirmed",
    checkInTime: null,
    notes: "Recovery progress check",
    avatarColor: "from-blue-500 to-indigo-600",
    createdAt: "2026-09-11T12:00:00Z",
  },
  {
    id: "APT-210",
    patientName: "Charlotte Davies",
    patientId: "PAT-110",
    patientMrn: "MRN-098712",
    doctorName: "Dr. Elena Rostova, MD",
    department: "Endocrinology",
    date: "2026-09-17",
    time: "05:15 PM",
    duration: 30,
    type: "In-Person",
    reason: "Thyroid Function Panel Review",
    room: "Clinic Room 208",
    status: "Completed",
    checkInTime: "05:10 PM",
    completedAt: "2026-09-17T17:40:00Z",
    notes: "Thyroid levels stable — continue current dose",
    avatarColor: "from-violet-500 to-purple-600",
    createdAt: "2026-09-04T15:30:00Z",
  },

  /* ============ TOMORROW / UPCOMING ============ */
  {
    id: "APT-211",
    patientName: "Jonathan Mitchell",
    patientId: "PAT-101",
    patientMrn: "MRN-882109",
    doctorName: "Dr. Jonathan Vance, MD",
    department: "Cardiology",
    date: "2026-09-18",
    time: "10:00 AM",
    duration: 30,
    type: "In-Person",
    reason: "Echocardiogram Review",
    room: "Imaging Suite 5",
    status: "Confirmed",
    checkInTime: null,
    notes: "Bring previous reports",
    avatarColor: "from-blue-600 to-indigo-600",
    createdAt: "2026-09-12T10:00:00Z",
  },
  {
    id: "APT-212",
    patientName: "Emma Rodriguez",
    patientId: "PAT-102",
    patientMrn: "MRN-902144",
    doctorName: "Dr. Sarah Chen, MD",
    department: "OB/GYN",
    date: "2026-09-20",
    time: "11:30 AM",
    duration: 30,
    type: "In-Person",
    reason: "Prenatal Checkup",
    room: "Maternity Suite 12",
    status: "Confirmed",
    checkInTime: null,
    notes: "34-week visit",
    avatarColor: "from-purple-600 to-pink-600",
    createdAt: "2026-09-15T09:00:00Z",
  },

  /* ============ PAST (for history) ============ */
  {
    id: "APT-213",
    patientName: "David Miller",
    patientId: "PAT-107",
    patientMrn: "MRN-331908",
    doctorName: "Dr. Aisha Khan, MD",
    department: "Pulmonology",
    date: "2026-09-12",
    time: "02:00 PM",
    duration: 30,
    type: "In-Person",
    reason: "Initial Consultation",
    room: "Pulmonary Wing 101",
    status: "Completed",
    checkInTime: "01:55 PM",
    completedAt: "2026-09-12T14:30:00Z",
    notes: "Diagnosed with acute bronchitis",
    avatarColor: "from-indigo-600 to-violet-600",
    createdAt: "2026-09-05T10:00:00Z",
  },
  {
    id: "APT-214",
    patientName: "Olivia Zhang",
    patientId: "PAT-106",
    patientMrn: "MRN-442811",
    doctorName: "Dr. Elena Rostova, MD",
    department: "Dermatology",
    date: "2026-09-10",
    time: "11:00 AM",
    duration: 30,
    type: "In-Person",
    reason: "Initial Allergy Assessment",
    room: "Derm Suite 301",
    status: "Completed",
    checkInTime: "10:55 AM",
    completedAt: "2026-09-10T11:30:00Z",
    notes: "Started topical steroid treatment",
    avatarColor: "from-teal-500 to-emerald-600",
    createdAt: "2026-09-02T14:00:00Z",
  },
  {
    id: "APT-215",
    patientName: "William Anderson",
    patientId: "PAT-103",
    patientMrn: "MRN-781920",
    doctorName: "Dr. James Wilson, MD",
    department: "Neurology",
    date: "2026-09-14",
    time: "09:00 AM",
    duration: 45,
    type: "Emergency",
    reason: "Acute Stroke Evaluation",
    room: "ER Bay 3",
    status: "Completed",
    checkInTime: "08:50 AM",
    completedAt: "2026-09-14T09:45:00Z",
    notes: "Admitted to ICU Bay 4",
    avatarColor: "from-cyan-600 to-blue-600",
    createdAt: "2026-09-14T08:45:00Z",
  },
  {
    id: "APT-216",
    patientName: "Sophia Bennett",
    patientId: "PAT-104",
    patientMrn: "MRN-674312",
    doctorName: "Dr. A. Rahman",
    department: "Internal Medicine",
    date: "2026-09-08",
    time: "10:30 AM",
    duration: 30,
    type: "In-Person",
    reason: "Diabetes Management Review",
    room: "Clinic Room 104",
    status: "No-Show",
    checkInTime: null,
    notes: "Patient did not arrive",
    avatarColor: "from-orange-500 to-amber-600",
    createdAt: "2026-08-30T10:00:00Z",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

/**
 * Get appointments by status
 * @param {string} status - "Confirmed" | "Pending" | "Cancelled" | "Completed" | "No-Show" | "All"
 */
export const getAppointmentsByStatus = (status = "All") => {
  if (status === "All") return initialAppointments;
  return initialAppointments.filter((a) => a.status === status);
};

/**
 * Get today's appointments (based on current date)
 * Falls back to "2026-09-17" for demo purposes
 */
export const getTodayAppointments = (date = "2026-09-17") =>
  initialAppointments
    .filter((a) => a.date === date)
    .sort((a, b) => {
      // Sort by time
      const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
      const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
      return timeA - timeB;
    });

/**
 * Get upcoming appointments (future dates)
 */
export const getUpcomingAppointments = (fromDate = "2026-09-17") =>
  initialAppointments
    .filter((a) => a.date > fromDate && a.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

/**
 * Get past appointments (for history)
 */
export const getPastAppointments = (untilDate = "2026-09-17") =>
  initialAppointments
    .filter((a) => a.date < untilDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

/**
 * Get appointments for a specific patient
 */
export const getAppointmentsByPatient = (patientId) =>
  initialAppointments
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

/**
 * Get appointments for a specific doctor
 */
export const getAppointmentsByDoctor = (doctorName) =>
  initialAppointments.filter((a) => a.doctorName === doctorName);

/**
 * Get appointments for a specific department
 */
export const getAppointmentsByDepartment = (department) =>
  initialAppointments.filter((a) => a.department === department);

/**
 * Get appointment by ID
 */
export const getAppointmentById = (id) =>
  initialAppointments.find((a) => a.id === id);

/**
 * Get status counts (for tabs)
 */
export const getAppointmentStatusCounts = () => ({
  All: initialAppointments.length,
  Confirmed: initialAppointments.filter((a) => a.status === "Confirmed").length,
  Pending: initialAppointments.filter((a) => a.status === "Pending").length,
  Completed: initialAppointments.filter((a) => a.status === "Completed").length,
  Cancelled: initialAppointments.filter((a) => a.status === "Cancelled").length,
  "No-Show": initialAppointments.filter((a) => a.status === "No-Show").length,
});

/**
 * Get today's schedule stats
 */
export const getTodayScheduleStats = (date = "2026-09-17") => {
  const today = getTodayAppointments(date);
  return {
    total: today.length,
    confirmed: today.filter((a) => a.status === "Confirmed").length,
    pending: today.filter((a) => a.status === "Pending").length,
    completed: today.filter((a) => a.status === "Completed").length,
    cancelled: today.filter((a) => a.status === "Cancelled").length,
  };
};

/**
 * Search appointments by patient name, doctor, or reason
 */
export const searchAppointments = (query) => {
  if (!query) return initialAppointments;
  const q = query.toLowerCase();
  return initialAppointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(q) ||
      a.doctorName.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
  );
};

/**
 * Get next appointment for a patient
 */
export const getNextAppointmentForPatient = (patientId) => {
  const today = "2026-09-17";
  return initialAppointments
    .filter(
      (a) =>
        a.patientId === patientId &&
        a.date >= today &&
        a.status !== "Cancelled"
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
};

/**
 * Get all unique departments from appointments
 */
export const getUniqueDepartments = () => [
  ...new Set(initialAppointments.map((a) => a.department)),
];

/* ============================================================
   📊 DEFAULT EXPORT — grouped object
   ============================================================ */
export default {
  initialAppointments,
  getAppointmentsByStatus,
  getTodayAppointments,
  getUpcomingAppointments,
  getPastAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAppointmentsByDepartment,
  getAppointmentById,
  getAppointmentStatusCounts,
  getTodayScheduleStats,
  searchAppointments,
  getNextAppointmentForPatient,
  getUniqueDepartments,
};