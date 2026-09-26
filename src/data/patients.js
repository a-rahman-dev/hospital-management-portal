/* ============================================================
   👥 PATIENTS DATA — Patient Management
   ─────────────────────────────────────────────
   Used by:
   - RecentPatients.jsx (dashboard widget)
   - Patients.jsx (main page with 4 tabs)
   
   Status mapping:
   - "Active"    → Currently admitted or outpatient
   - "Critical"  → Requires immediate attention
   - "Recovered" → Discharged / treated
   
   Foreign data + real-looking medical details (Rule 3)
   ============================================================ */

/* ============================================================
   🏥 INSURANCE PROVIDERS — Realistic list
   ============================================================ */
export const INSURANCE_PROVIDERS = [
  "Blue Cross Blue Shield",
  "Aetna Health",
  "Medicare Part B",
  "Medicare Part A & B",
  "UnitedHealthcare",
  "Cigna Commercial",
  "Humana Gold",
  "Kaiser Permanente",
];

/* ============================================================
   👥 PATIENTS — Full list
   ─────────────────────────────────────────────
   Status (matches Patients.jsx tabs):
   - "Active"    → Admitted / Outpatient under care
   - "Critical"  → ICU / emergency / critical
   - "Recovered" → Discharged / resolved
   ============================================================ */
export const initialPatients = [
  {
    id: "PAT-101",
    mrn: "MRN-882109",
    name: "Jonathan Mitchell",
    gender: "Male",
    age: 52,
    dob: "1974-04-12",
    bloodGroup: "O+",
    phone: "+1 (555) 234-8901",
    email: "j.mitchell@email.com",
    emergencyContact: {
      name: "Sarah Mitchell",
      relation: "Wife",
      phone: "+1 (555) 234-8902",
    },
    allergies: ["Penicillin", "Shellfish"],
    room: "Room 304 - Tower A",
    attendingDoctor: "Dr. Jonathan Vance, MD",
    specialty: "Cardiology",
    diagnosis: "Coronary Artery Disease (CAD)",
    admissionDate: "2026-09-10",
    lastVisit: "2026-09-15",
    insurance: "Blue Cross Blue Shield",
    status: "Active",
    avatarColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "PAT-102",
    mrn: "MRN-902144",
    name: "Emma Rodriguez",
    gender: "Female",
    age: 29,
    dob: "1997-08-23",
    bloodGroup: "A+",
    phone: "+1 (555) 456-7890",
    email: "emma.rodriguez@email.com",
    emergencyContact: {
      name: "Carlos Rodriguez",
      relation: "Husband",
      phone: "+1 (555) 456-7891",
    },
    allergies: [],
    room: "Maternity Suite 12",
    attendingDoctor: "Dr. Sarah Chen, MD",
    specialty: "OB/GYN",
    diagnosis: "Gestational Monitoring (32 Weeks)",
    admissionDate: "2026-09-12",
    lastVisit: "2026-09-15",
    insurance: "Aetna Health",
    status: "Active",
    avatarColor: "from-purple-500 to-pink-600",
  },
  {
    id: "PAT-103",
    mrn: "MRN-781920",
    name: "William Anderson",
    gender: "Male",
    age: 64,
    dob: "1962-11-05",
    bloodGroup: "B+",
    phone: "+1 (555) 345-6712",
    email: "w.anderson@email.com",
    emergencyContact: {
      name: "Margaret Anderson",
      relation: "Daughter",
      phone: "+1 (555) 345-6713",
    },
    allergies: ["Aspirin"],
    room: "ICU Bay 4",
    attendingDoctor: "Dr. James Wilson, MD",
    specialty: "Neurology",
    diagnosis: "Ischemic Stroke Observation",
    admissionDate: "2026-09-14",
    lastVisit: "2026-09-15",
    insurance: "Medicare Part B",
    status: "Critical",
    avatarColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "PAT-104",
    mrn: "MRN-674312",
    name: "Sophia Bennett",
    gender: "Female",
    age: 38,
    dob: "1988-02-17",
    bloodGroup: "AB-",
    phone: "+1 (555) 890-1234",
    email: "sophia.b@email.com",
    emergencyContact: {
      name: "James Bennett",
      relation: "Brother",
      phone: "+1 (555) 890-1235",
    },
    allergies: ["Latex"],
    room: "Outpatient Clinic",
    attendingDoctor: "Dr. A. Rahman",
    specialty: "Internal Medicine",
    diagnosis: "Type 2 Diabetes Mellitus & HTN",
    admissionDate: "2026-09-08",
    lastVisit: "2026-09-15",
    insurance: "UnitedHealthcare",
    status: "Active",
    avatarColor: "from-orange-500 to-amber-600",
  },
  {
    id: "PAT-105",
    mrn: "MRN-551940",
    name: "Alexander Hayes",
    gender: "Male",
    age: 45,
    dob: "1981-06-30",
    bloodGroup: "O-",
    phone: "+1 (555) 987-6543",
    email: "hayes.alex@email.com",
    emergencyContact: {
      name: "Rachel Hayes",
      relation: "Wife",
      phone: "+1 (555) 987-6544",
    },
    allergies: ["Codeine"],
    room: "Surgical Recovery 202",
    attendingDoctor: "Dr. Marcus Park, FAAP",
    specialty: "Orthopedics",
    diagnosis: "Post-op ACL Reconstruction",
    admissionDate: "2026-09-13",
    lastVisit: "2026-09-15",
    insurance: "Cigna Commercial",
    status: "Active",
    avatarColor: "from-rose-500 to-red-600",
  },
  {
    id: "PAT-106",
    mrn: "MRN-442811",
    name: "Olivia Zhang",
    gender: "Female",
    age: 22,
    dob: "2004-09-02",
    bloodGroup: "B-",
    phone: "+1 (555) 678-2345",
    email: "olivia.zhang@email.com",
    emergencyContact: {
      name: "Wei Zhang",
      relation: "Father",
      phone: "+1 (555) 678-2346",
    },
    allergies: ["Peanuts", "Dust"],
    room: "Day Care Ward",
    attendingDoctor: "Dr. Elena Rostova, MD",
    specialty: "Dermatology",
    diagnosis: "Severe Allergic Dermatitis",
    admissionDate: "2026-09-14",
    lastVisit: "2026-09-15",
    insurance: "Humana Gold",
    status: "Active",
    avatarColor: "from-teal-500 to-emerald-600",
  },
  {
    id: "PAT-107",
    mrn: "MRN-331908",
    name: "David Miller",
    gender: "Male",
    age: 71,
    dob: "1955-03-19",
    bloodGroup: "A-",
    phone: "+1 (555) 112-9900",
    email: "david.miller@email.com",
    emergencyContact: {
      name: "Linda Miller",
      relation: "Wife",
      phone: "+1 (555) 112-9901",
    },
    allergies: [],
    room: "Discharged",
    attendingDoctor: "Dr. Aisha Khan, MD",
    specialty: "Pulmonology",
    diagnosis: "Acute Bronchitis (Resolved)",
    admissionDate: "2026-09-05",
    lastVisit: "2026-09-12",
    insurance: "Medicare Part A & B",
    status: "Recovered",
    avatarColor: "from-indigo-500 to-purple-600",
  },
  {
    id: "PAT-108",
    mrn: "MRN-229081",
    name: "Isabella Martinez",
    gender: "Female",
    age: 47,
    dob: "1979-05-11",
    bloodGroup: "O+",
    phone: "+1 (555) 223-4455",
    email: "isabella.m@email.com",
    emergencyContact: {
      name: "Diego Martinez",
      relation: "Husband",
      phone: "+1 (555) 223-4456",
    },
    allergies: ["Sulfa drugs"],
    room: "ICU Bay 7",
    attendingDoctor: "Dr. James Wilson, MD",
    specialty: "Cardiology",
    diagnosis: "Acute Myocardial Infarction",
    admissionDate: "2026-09-14",
    lastVisit: "2026-09-15",
    insurance: "Blue Cross Blue Shield",
    status: "Critical",
    avatarColor: "from-rose-500 to-pink-600",
  },
  {
    id: "PAT-109",
    mrn: "MRN-119873",
    name: "Benjamin Clarke",
    gender: "Male",
    age: 33,
    dob: "1993-07-25",
    bloodGroup: "A+",
    phone: "+1 (555) 334-5566",
    email: "b.clarke@email.com",
    emergencyContact: {
      name: "Hannah Clarke",
      relation: "Sister",
      phone: "+1 (555) 334-5567",
    },
    allergies: ["Ibuprofen"],
    room: "Discharged",
    attendingDoctor: "Dr. Aisha Khan, MD",
    specialty: "Pulmonology",
    diagnosis: "Community-Acquired Pneumonia (Resolved)",
    admissionDate: "2026-09-01",
    lastVisit: "2026-09-10",
    insurance: "Kaiser Permanente",
    status: "Recovered",
    avatarColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "PAT-110",
    mrn: "MRN-098712",
    name: "Charlotte Davies",
    gender: "Female",
    age: 56,
    dob: "1970-01-30",
    bloodGroup: "B+",
    phone: "+1 (555) 445-6677",
    email: "charlotte.d@email.com",
    emergencyContact: {
      name: "Oliver Davies",
      relation: "Son",
      phone: "+1 (555) 445-6678",
    },
    allergies: [],
    room: "Recovery Ward 5",
    attendingDoctor: "Dr. Elena Rostova, MD",
    specialty: "Endocrinology",
    diagnosis: "Hypothyroidism Management",
    admissionDate: "2026-09-06",
    lastVisit: "2026-09-14",
    insurance: "Aetna Health",
    status: "Recovered",
    avatarColor: "from-violet-500 to-purple-600",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

/**
 * Get patients by status
 * @param {string} status - "Active" | "Critical" | "Recovered" | "All"
 */
export const getPatientsByStatus = (status = "All") => {
  if (status === "All") return initialPatients;
  return initialPatients.filter((p) => p.status === status);
};

/**
 * Get only critical patients (for urgent alerts)
 */
export const getCriticalPatients = () =>
  initialPatients.filter((p) => p.status === "Critical");

/**
 * Get active patients (admitted or outpatient)
 */
export const getActivePatients = () =>
  initialPatients.filter((p) => p.status === "Active");

/**
 * Get recovered patients
 */
export const getRecoveredPatients = () =>
  initialPatients.filter((p) => p.status === "Recovered");

/**
 * Get patient by ID
 */
export const getPatientById = (id) =>
  initialPatients.find((p) => p.id === id);

/**
 * Get patient by MRN
 */
export const getPatientByMRN = (mrn) =>
  initialPatients.find((p) => p.mrn === mrn);

/**
 * Get patients by attending doctor
 */
export const getPatientsByDoctor = (doctorName) =>
  initialPatients.filter((p) => p.attendingDoctor === doctorName);

/**
 * Get patients by specialty
 */
export const getPatientsBySpecialty = (specialty) =>
  initialPatients.filter((p) => p.specialty === specialty);

/**
 * Get status counts (for tabs)
 */
export const getStatusCounts = () => ({
  All: initialPatients.length,
  Active: initialPatients.filter((p) => p.status === "Active").length,
  Critical: initialPatients.filter((p) => p.status === "Critical").length,
  Recovered: initialPatients.filter((p) => p.status === "Recovered").length,
});

/**
 * Get recent patients (sorted by admission date, newest first)
 * @param {number} limit - Number of patients to return
 */
export const getRecentPatients = (limit = 5) =>
  [...initialPatients]
    .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
    .slice(0, limit);

/**
 * Search patients by name, MRN, or diagnosis
 */
export const searchPatients = (query) => {
  if (!query) return initialPatients;
  const q = query.toLowerCase();
  return initialPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.diagnosis.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
  );
};

/* ============================================================
   📊 DEFAULT EXPORT — grouped object
   ============================================================ */
export default {
  initialPatients,
  INSURANCE_PROVIDERS,
  getPatientsByStatus,
  getCriticalPatients,
  getActivePatients,
  getRecoveredPatients,
  getPatientById,
  getPatientByMRN,
  getPatientsByDoctor,
  getPatientsBySpecialty,
  getStatusCounts,
  getRecentPatients,
  searchPatients,
};