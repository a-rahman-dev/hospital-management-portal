/* ============================================================
   👨‍⚕️ PROVIDERS DATA — Credentialed Medical Staff Registry
   ─────────────────────────────────────────────
   Rule 3: Foreign names + realistic NPI + credentials
   Rule 5: Cohesive grouping
   ============================================================ */

export const providersData = [
  {
    id: "PRV-101",
    npi: "1982019481",
    name: "Dr. Jonathan Vance, MD",
    role: "Attending Cardiologist",
    specialty: "Cardiology",
    department: "Heart & Vascular Institute",
    status: "On Duty",
    license: "NY-MD-88219",
    room: "Suite 302 - Tower B",
    phone: "+1 (555) 840-2210",
    email: "j.vance@ayhospital.org",
    activePatients: 14,
    yearsExperience: 16,
    avatarColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "PRV-102",
    npi: "1871920392",
    name: "Dr. Sarah Chen, MD, FACOG",
    role: "Lead Obstetrician",
    specialty: "OB/GYN",
    department: "Maternal & Fetal Medicine",
    status: "On Duty",
    license: "NY-MD-90412",
    room: "Maternity Suite 12",
    phone: "+1 (555) 840-2211",
    email: "s.chen@ayhospital.org",
    activePatients: 21,
    yearsExperience: 14,
    avatarColor: "from-purple-600 to-pink-600",
  },
  {
    id: "PRV-103",
    npi: "1762938471",
    name: "Dr. James Wilson, MD",
    role: "Chief of Neurology",
    specialty: "Neurology",
    department: "Neuroscience Center",
    status: "On Call",
    license: "NY-MD-77192",
    room: "Neuro Wing 401",
    phone: "+1 (555) 840-2212",
    email: "j.wilson@ayhospital.org",
    activePatients: 9,
    yearsExperience: 22,
    avatarColor: "from-cyan-600 to-blue-600",
  },
  {
    id: "PRV-104",
    npi: "1651829304",
    name: "Dr. A. Rahman, MD",
    role: "Senior Consultant Internist",
    specialty: "Internal Medicine",
    department: "Ambulatory Primary Care",
    status: "On Duty",
    license: "NY-MD-66291",
    room: "Clinic Room 104",
    phone: "+1 (555) 840-2213",
    email: "a.rahman@ayhospital.org",
    activePatients: 18,
    yearsExperience: 18,
    avatarColor: "from-orange-500 to-amber-600",
  },
  {
    id: "PRV-105",
    npi: "1540918273",
    name: "Dr. Marcus Park, FAAP",
    role: "Orthopedic Surgeon",
    specialty: "Orthopedics",
    department: "Surgical Orthopedics",
    status: "On Leave",
    license: "NY-MD-55198",
    room: "Surgical Recovery 202",
    phone: "+1 (555) 840-2214",
    email: "m.park@ayhospital.org",
    activePatients: 0,
    yearsExperience: 12,
    avatarColor: "from-rose-500 to-red-600",
  },
  {
    id: "PRV-106",
    npi: "1439827162",
    name: "Dr. Elena Rostova, MD",
    role: "Clinical Dermatologist",
    specialty: "Dermatology",
    department: "Outpatient Dermatology",
    status: "On Duty",
    license: "NY-MD-44281",
    room: "Derm Clinic Suite 2B",
    phone: "+1 (555) 840-2215",
    email: "e.rostova@ayhospital.org",
    activePatients: 12,
    yearsExperience: 9,
    avatarColor: "from-teal-500 to-emerald-600",
  },
  {
    id: "PRV-107",
    npi: "1328716253",
    name: "Dr. Aisha Khan, MD, FCCP",
    role: "Pulmonary & Critical Care",
    specialty: "Pulmonology",
    department: "Respiratory Intensive Care",
    status: "On Call",
    license: "NY-MD-33190",
    room: "ICU Pod 3",
    phone: "+1 (555) 840-2216",
    email: "a.khan@ayhospital.org",
    activePatients: 8,
    yearsExperience: 15,
    avatarColor: "from-indigo-600 to-violet-600",
  },
  {
    id: "PRV-108",
    npi: "1217605142",
    name: "Dr. Michael Tanaka, MD, FACS",
    role: "Chief of Surgery",
    specialty: "General Surgery",
    department: "Surgical Services",
    status: "On Duty",
    license: "NY-MD-22081",
    room: "Surgical Suite 5",
    phone: "+1 (555) 840-2217",
    email: "m.tanaka@ayhospital.org",
    activePatients: 11,
    yearsExperience: 20,
    avatarColor: "from-violet-600 to-purple-600",
  },
  {
    id: "PRV-109",
    npi: "1106594031",
    name: "Dr. Olivia Bennett, MD, FAAP",
    role: "Pediatric Attending",
    specialty: "Pediatrics",
    department: "Pediatric Care",
    status: "On Duty",
    license: "NY-MD-11972",
    room: "Pediatric Ward - Floor 6",
    phone: "+1 (555) 840-2218",
    email: "o.bennett@ayhospital.org",
    activePatients: 24,
    yearsExperience: 11,
    avatarColor: "from-fuchsia-600 to-pink-600",
  },
  {
    id: "PRV-110",
    npi: "1095483920",
    name: "Dr. David Kim, MD, PhD",
    role: "Endocrinologist",
    specialty: "Endocrinology",
    department: "Diabetes & Metabolism",
    status: "On Call",
    license: "NY-MD-09863",
    room: "Endocrine Clinic 201",
    phone: "+1 (555) 840-2219",
    email: "d.kim@ayhospital.org",
    activePatients: 16,
    yearsExperience: 13,
    avatarColor: "from-sky-600 to-cyan-600",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

export const getProvidersByStatus = (status = "All") => {
  if (status === "All") return providersData;
  return providersData.filter((p) => p.status === status);
};

export const getOnDutyProviders = () =>
  providersData.filter((p) => p.status === "On Duty");

export const getOnCallProviders = () =>
  providersData.filter((p) => p.status === "On Call");

export const getOnLeaveProviders = () =>
  providersData.filter((p) => p.status === "On Leave");

export const getProviderById = (id) =>
  providersData.find((p) => p.id === id);

export const getProviderByNPI = (npi) =>
  providersData.find((p) => p.npi === npi);

export const getProvidersBySpecialty = (specialty) =>
  providersData.filter((p) => p.specialty === specialty);

export const getProvidersByDepartment = (department) =>
  providersData.filter((p) => p.department === department);

export const getStatusCounts = () => ({
  All: providersData.length,
  "On Duty": providersData.filter((p) => p.status === "On Duty").length,
  "On Call": providersData.filter((p) => p.status === "On Call").length,
  "On Leave": providersData.filter((p) => p.status === "On Leave").length,
});

/**
 * Get total active patients across all providers
 */
export const getTotalActivePatients = () =>
  providersData.reduce((sum, p) => sum + (p.activePatients || 0), 0);

/**
 * Get unique specialties list
 */
export const getUniqueSpecialties = () => [
  ...new Set(providersData.map((p) => p.specialty)),
];

/**
 * Get unique departments list
 */
export const getUniqueDepartments = () => [
  ...new Set(providersData.map((p) => p.department)),
];

export const searchProviders = (query) => {
  if (!query) return providersData;
  const q = query.toLowerCase();
  return providersData.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.npi.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
  );
};

export default {
  providersData,
  getProvidersByStatus,
  getOnDutyProviders,
  getOnCallProviders,
  getOnLeaveProviders,
  getProviderById,
  getProviderByNPI,
  getProvidersBySpecialty,
  getProvidersByDepartment,
  getStatusCounts,
  getTotalActivePatients,
  getUniqueSpecialties,
  getUniqueDepartments,
  searchProviders,
};