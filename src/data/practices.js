/* ============================================================
   🏥 PRACTICES DATA — Multi-site Network Registry
   ─────────────────────────────────────────────
   Rule 3: Real foreign names + realistic NPI + locations
   Rule 5: Cohesive grouping
   ============================================================ */

export const practicesData = [
  {
    id: "PRAC-101",
    practiceCode: "PRAC-MAIN",
    name: "ApexCare Central Academic Hospital",
    type: "Main Academic Hospital",
    specialties: "Full Inpatient & Emergency Care",
    npi: "1982019401",
    medicalDirector: "Dr. Jonathan Vance, MD",
    location: "742 Evergreen Pkwy, New York, NY",
    phone: "+1 (555) 840-2000",
    email: "central@apexcarehealth.org",
    activeProviders: 42,
    activePatients: 1240,
    status: "Active",
    createdDate: "2019-06-15",
    avatarColor: "from-indigo-600 to-blue-600",
  },
  {
    id: "PRAC-102",
    practiceCode: "PRAC-WEST",
    name: "ApexCare Women's & Maternal Pavilion",
    type: "Specialty Clinic",
    specialties: "Obstetrics, Gynecology & NICU",
    npi: "1871920312",
    medicalDirector: "Dr. Sarah Chen, MD, FACOG",
    location: "120 Park Ave West, New York, NY",
    phone: "+1 (555) 840-2001",
    email: "maternity@apexcarehealth.org",
    activeProviders: 18,
    activePatients: 480,
    status: "Active",
    createdDate: "2020-03-10",
    avatarColor: "from-pink-600 to-rose-600",
  },
  {
    id: "PRAC-103",
    practiceCode: "PRAC-NEURO",
    name: "ApexCare Institute of Neuroscience",
    type: "Specialty Clinic",
    specialties: "Neurology, Neurosurgery & Rehab",
    npi: "1762938423",
    medicalDirector: "Dr. James Wilson, MD",
    location: "450 Lexington Blvd, New York, NY",
    phone: "+1 (555) 840-2002",
    email: "neuro@apexcarehealth.org",
    activeProviders: 14,
    activePatients: 320,
    status: "Active",
    createdDate: "2021-01-20",
    avatarColor: "from-cyan-600 to-blue-600",
  },
  {
    id: "PRAC-104",
    practiceCode: "PRAC-AMB1",
    name: "Midtown Urgent Care & Primary Health",
    type: "Ambulatory Center",
    specialties: "Family Medicine & Urgent Care",
    npi: "1651829334",
    medicalDirector: "Dr. A. Rahman, MD",
    location: "880 Broadway Suite 200, New York, NY",
    phone: "+1 (555) 840-2003",
    email: "midtown@apexcarehealth.org",
    activeProviders: 11,
    activePatients: 280,
    status: "Ambulatory",
    createdDate: "2022-04-08",
    avatarColor: "from-teal-600 to-emerald-600",
  },
  {
    id: "PRAC-105",
    practiceCode: "PRAC-SURG",
    name: "ApexCare Ambulatory Surgical Center",
    type: "Ambulatory Center",
    specialties: "Day Orthopedics & Minor Procedures",
    npi: "1540918245",
    medicalDirector: "Dr. Marcus Park, FAAP",
    location: "310 East 64th St, New York, NY",
    phone: "+1 (555) 840-2004",
    email: "surgery@apexcarehealth.org",
    activeProviders: 9,
    activePatients: 210,
    status: "Ambulatory",
    createdDate: "2022-09-12",
    avatarColor: "from-violet-600 to-purple-600",
  },
  {
    id: "PRAC-106",
    practiceCode: "PRAC-SOUTH",
    name: "South Brooklyn Family Health Clinic",
    type: "Community Health Clinic",
    specialties: "Pediatrics & Community Wellness",
    npi: "1439827156",
    medicalDirector: "Dr. Elena Rostova, MD",
    location: "15 Ocean Parkway, Brooklyn, NY",
    phone: "+1 (555) 840-2005",
    email: "brooklyn@apexcarehealth.org",
    activeProviders: 6,
    activePatients: 145,
    status: "Under Review",
    createdDate: "2023-11-05",
    avatarColor: "from-amber-600 to-orange-600",
  },
  {
    id: "PRAC-107",
    practiceCode: "PRAC-CARD",
    name: "ApexCare Advanced Heart & Vascular Institute",
    type: "Specialty Clinic",
    specialties: "Interventional Cardiology & Heart Failure",
    npi: "1928301928",
    medicalDirector: "Dr. Jonathan Vance, MD, FACC",
    location: "1250 Healthcare Blvd, Pavilion East, New York, NY",
    phone: "+1 (555) 840-2200",
    email: "cardio@apexcarehealth.org",
    activeProviders: 28,
    activePatients: 620,
    status: "Active",
    createdDate: "2019-06-15",
    avatarColor: "from-rose-600 to-red-600",
  },
  {
    id: "PRAC-108",
    practiceCode: "PRAC-PULM",
    name: "ApexCare Pulmonary & Sleep Medicine",
    type: "Specialty Clinic",
    specialties: "Pulmonology, Sleep Studies & Respiratory Therapy",
    npi: "1837291847",
    medicalDirector: "Dr. Aisha Khan, MD, FCCP",
    location: "220 Park Avenue South, New York, NY",
    phone: "+1 (555) 840-2006",
    email: "pulm@apexcarehealth.org",
    activeProviders: 12,
    activePatients: 265,
    status: "Active",
    createdDate: "2021-08-22",
    avatarColor: "from-sky-600 to-cyan-600",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access
   ============================================================ */

export const getPracticesByStatus = (status = "All") => {
  if (status === "All") return practicesData;
  return practicesData.filter((p) => p.status === status);
};

export const getActivePractices = () =>
  practicesData.filter((p) => p.status === "Active");

export const getAmbulatoryPractices = () =>
  practicesData.filter((p) => p.status === "Ambulatory");

export const getUnderReviewPractices = () =>
  practicesData.filter((p) => p.status === "Under Review");

export const getPracticeById = (id) =>
  practicesData.find((p) => p.id === id);

export const getPracticeByCode = (code) =>
  practicesData.find((p) => p.practiceCode === code);

export const getStatusCounts = () => ({
  All: practicesData.length,
  Active: practicesData.filter((p) => p.status === "Active").length,
  Ambulatory: practicesData.filter((p) => p.status === "Ambulatory").length,
  "Under Review": practicesData.filter((p) => p.status === "Under Review")
    .length,
});

export const getTotalProviders = () =>
  practicesData.reduce((sum, p) => sum + (p.activeProviders || 0), 0);

export const getTotalPatients = () =>
  practicesData.reduce((sum, p) => sum + (p.activePatients || 0), 0);

export const searchPractices = (query) => {
  if (!query) return practicesData;
  const q = query.toLowerCase();
  return practicesData.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.practiceCode.toLowerCase().includes(q) ||
      p.medicalDirector.toLowerCase().includes(q) ||
      p.specialties.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
  );
};

export default {
  practicesData,
  getPracticesByStatus,
  getActivePractices,
  getAmbulatoryPractices,
  getUnderReviewPractices,
  getPracticeById,
  getPracticeByCode,
  getStatusCounts,
  getTotalProviders,
  getTotalPatients,
  searchPractices,
};