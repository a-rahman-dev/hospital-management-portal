/* ============================================================
   🛡️ INSURANCE DATA — Payer Directory
   ─────────────────────────────────────────────
   Rule 3: Real payer IDs + realistic clearinghouses
   Rule 5: Cohesive program groupings
   ============================================================ */

export const initialInsurance = [
  /* ============ COMMERCIAL — PPO ============ */
  {
    id: 1,
    company: "Blue Cross Blue Shield",
    payerId: "BCBS001",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0101",
    email: "claims@bcbs.com",
    clearinghouse: "Availity",
    ediId: "BCBS-EDI-01",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 2840,
    avatarColor: "from-blue-600 to-indigo-600",
  },
  {
    id: 5,
    company: "Cigna",
    payerId: "CIGNA005",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0105",
    email: "claims@cigna.com",
    clearinghouse: "Availity",
    ediId: "CIGNA-EDI-05",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 1920,
    avatarColor: "from-indigo-600 to-violet-600",
  },
  {
    id: 6,
    company: "UnitedHealthcare",
    payerId: "UHC006",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0106",
    email: "claims@uhc.com",
    clearinghouse: "Availity",
    ediId: "UHC-EDI-06",
    coverage: "75%",
    coveragePercent: 75,
    status: "Active",
    activeMembers: 3210,
    avatarColor: "from-sky-600 to-blue-600",
  },
  {
    id: 9,
    company: "Anthem",
    payerId: "ANTHEM009",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0109",
    email: "claims@anthem.com",
    clearinghouse: "Availity",
    ediId: "ANT-EDI-09",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 1560,
    avatarColor: "from-cyan-600 to-teal-600",
  },
  {
    id: 14,
    company: "Oscar Health",
    payerId: "OSCAR014",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0114",
    email: "claims@oscar.com",
    clearinghouse: "Availity",
    ediId: "OSC-EDI-14",
    coverage: "75%",
    coveragePercent: 75,
    status: "Active",
    activeMembers: 480,
    avatarColor: "from-teal-600 to-emerald-600",
  },
  {
    id: 18,
    company: "Highmark",
    payerId: "HIGHMARK018",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0118",
    email: "claims@highmark.com",
    clearinghouse: "Availity",
    ediId: "HM-EDI-18",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 890,
    avatarColor: "from-blue-500 to-cyan-600",
  },
  {
    id: 20,
    company: "Optum",
    payerId: "OPTUM020",
    program: "Commercial",
    planType: "PPO",
    phone: "+1 (800) 555-0120",
    email: "claims@optum.com",
    clearinghouse: "Availity",
    ediId: "OPT-EDI-20",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 720,
    avatarColor: "from-violet-600 to-purple-600",
  },

  /* ============ COMMERCIAL — HMO ============ */
  {
    id: 2,
    company: "Aetna",
    payerId: "AETNA002",
    program: "Commercial",
    planType: "HMO",
    phone: "+1 (800) 555-0102",
    email: "claims@aetna.com",
    clearinghouse: "Availity",
    ediId: "AETNA-EDI-02",
    coverage: "70%",
    coveragePercent: 70,
    status: "Active",
    activeMembers: 2180,
    avatarColor: "from-rose-600 to-pink-600",
  },
  {
    id: 8,
    company: "Kaiser Permanente",
    payerId: "KP008",
    program: "Commercial",
    planType: "HMO",
    phone: "+1 (800) 555-0108",
    email: "claims@kp.org",
    clearinghouse: "Internal",
    ediId: "KP-EDI-08",
    coverage: "90%",
    coveragePercent: 90,
    status: "Active",
    activeMembers: 1650,
    avatarColor: "from-emerald-600 to-teal-600",
  },
  {
    id: 17,
    company: "Health Net",
    payerId: "HLTHNET017",
    program: "Commercial",
    planType: "HMO",
    phone: "+1 (800) 555-0117",
    email: "claims@healthnet.com",
    clearinghouse: "Availity",
    ediId: "HN-EDI-17",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 540,
    avatarColor: "from-fuchsia-600 to-pink-600",
  },

  /* ============ MEDICARE ============ */
  {
    id: 3,
    company: "Medicare",
    payerId: "MEDIC003",
    program: "Medicare",
    planType: "Federal",
    phone: "+1 (800) 555-0103",
    email: "claims@medicare.gov",
    clearinghouse: "CMS",
    ediId: "CMS-EDI-03",
    coverage: "80%",
    coveragePercent: 80,
    status: "Active",
    activeMembers: 4250,
    avatarColor: "from-blue-700 to-indigo-700",
  },
  {
    id: 7,
    company: "Humana",
    payerId: "HUMANA007",
    program: "Medicare Advantage",
    planType: "MA",
    phone: "+1 (800) 555-0107",
    email: "claims@humana.com",
    clearinghouse: "Availity",
    ediId: "HUM-EDI-07",
    coverage: "85%",
    coveragePercent: 85,
    status: "Active",
    activeMembers: 1340,
    avatarColor: "from-green-600 to-emerald-700",
  },
  {
    id: 12,
    company: "WellCare",
    payerId: "WELLCARE012",
    program: "Medicare Advantage",
    planType: "MA",
    phone: "+1 (800) 555-0112",
    email: "claims@wellcare.com",
    clearinghouse: "Availity",
    ediId: "WC-EDI-12",
    coverage: "85%",
    coveragePercent: 85,
    status: "Active",
    activeMembers: 620,
    avatarColor: "from-orange-600 to-red-600",
  },

  /* ============ MEDICAID ============ */
  {
    id: 4,
    company: "Medicaid",
    payerId: "MCD004",
    program: "Medicaid",
    planType: "State",
    phone: "+1 (800) 555-0104",
    email: "claims@medicaid.gov",
    clearinghouse: "State Portal",
    ediId: "MCD-EDI-04",
    coverage: "100%",
    coveragePercent: 100,
    status: "Active",
    activeMembers: 2890,
    avatarColor: "from-emerald-700 to-green-700",
  },
  {
    id: 10,
    company: "Molina Healthcare",
    payerId: "MOLINA010",
    program: "Medicaid MCO",
    planType: "MCO",
    phone: "+1 (800) 555-0110",
    email: "claims@molina.com",
    clearinghouse: "Availity",
    ediId: "MOL-EDI-10",
    coverage: "100%",
    coveragePercent: 100,
    status: "Active",
    activeMembers: 1180,
    avatarColor: "from-teal-700 to-cyan-700",
  },
  {
    id: 11,
    company: "Centene",
    payerId: "CENTENE011",
    program: "Medicaid MCO",
    planType: "MCO",
    phone: "+1 (800) 555-0111",
    email: "claims@centene.com",
    clearinghouse: "Availity",
    ediId: "CEN-EDI-11",
    coverage: "100%",
    coveragePercent: 100,
    status: "Active",
    activeMembers: 1420,
    avatarColor: "from-cyan-700 to-sky-700",
  },
  {
    id: 16,
    company: "CareSource",
    payerId: "CARESRC016",
    program: "Medicaid MCO",
    planType: "MCO",
    phone: "+1 (800) 555-0116",
    email: "claims@caresource.com",
    clearinghouse: "Availity",
    ediId: "CS-EDI-16",
    coverage: "100%",
    coveragePercent: 100,
    status: "Active",
    activeMembers: 780,
    avatarColor: "from-pink-700 to-rose-700",
  },

  /* ============ MILITARY ============ */
  {
    id: 13,
    company: "TRICARE",
    payerId: "TRICARE013",
    program: "Military",
    planType: "Federal",
    phone: "+1 (800) 555-0113",
    email: "claims@tricare.mil",
    clearinghouse: "PGBA",
    ediId: "TRI-EDI-13",
    coverage: "90%",
    coveragePercent: 90,
    status: "Active",
    activeMembers: 340,
    avatarColor: "from-slate-700 to-gray-800",
  },

  /* ============ MARKETPLACE ============ */
  {
    id: 15,
    company: "Ambetter",
    payerId: "AMBETTER015",
    program: "Marketplace",
    planType: "ACA",
    phone: "+1 (800) 555-0115",
    email: "claims@ambetter.com",
    clearinghouse: "Availity",
    ediId: "AMB-EDI-15",
    coverage: "70%",
    coveragePercent: 70,
    status: "Inactive",
    activeMembers: 0,
    avatarColor: "from-gray-600 to-slate-700",
  },

  /* ============ BEHAVIORAL HEALTH ============ */
  {
    id: 19,
    company: "Magellan Health",
    payerId: "MAGELLAN019",
    program: "Behavioral Health",
    planType: "Specialty",
    phone: "+1 (800) 555-0119",
    email: "claims@magellan.com",
    clearinghouse: "Availity",
    ediId: "MAG-EDI-19",
    coverage: "70%",
    coveragePercent: 70,
    status: "Active",
    activeMembers: 410,
    avatarColor: "from-purple-600 to-violet-700",
  },
];

/* ============================================================
   🎯 CONSTANTS
   ============================================================ */

export const PROGRAMS = [
  "Commercial",
  "Medicare",
  "Medicaid",
  "Medicaid MCO",
  "Medicare Advantage",
  "Marketplace",
  "Military",
  "Behavioral Health",
];

export const PLAN_TYPES = [
  "PPO",
  "HMO",
  "MCO",
  "MA",
  "ACA",
  "Federal",
  "State",
  "Specialty",
];

export const GOVERNMENT_PROGRAMS = [
  "Medicare",
  "Medicaid",
  "Medicaid MCO",
  "Medicare Advantage",
  "Military",
];

export const CLEARINGHOUSES = [
  "Availity",
  "CMS",
  "State Portal",
  "Internal",
  "PGBA",
  "Change Healthcare",
  "Office Ally",
];

/* ============================================================
   🎯 HELPERS — Easy access
   ============================================================ */

export const getInsuranceByStatus = (status = "All") => {
  if (status === "All") return initialInsurance;
  return initialInsurance.filter((i) => i.status === status);
};

export const getActiveInsurance = () =>
  initialInsurance.filter((i) => i.status === "Active");

export const getInactiveInsurance = () =>
  initialInsurance.filter((i) => i.status === "Inactive");

export const getGovernmentInsurance = () =>
  initialInsurance.filter((i) => GOVERNMENT_PROGRAMS.includes(i.program));

export const getInsuranceById = (id) =>
  initialInsurance.find((i) => i.id === id);

export const getInsuranceByPayerId = (payerId) =>
  initialInsurance.find((i) => i.payerId === payerId);

export const getInsuranceByProgram = (program) =>
  initialInsurance.filter((i) => i.program === program);

export const getInsuranceByPlanType = (planType) =>
  initialInsurance.filter((i) => i.planType === planType);

export const getInsuranceByClearinghouse = (clearinghouse) =>
  initialInsurance.filter((i) => i.clearinghouse === clearinghouse);

export const getStatusCounts = () => ({
  all: initialInsurance.length,
  Active: initialInsurance.filter((i) => i.status === "Active").length,
  Inactive: initialInsurance.filter((i) => i.status === "Inactive").length,
  govt: initialInsurance.filter((i) => GOVERNMENT_PROGRAMS.includes(i.program))
    .length,
});

/**
 * Get total active members across all payers
 */
export const getTotalActiveMembers = () =>
  initialInsurance.reduce((sum, i) => sum + (i.activeMembers || 0), 0);

/**
 * Get average coverage percentage
 */
export const getAverageCoverage = () => {
  if (initialInsurance.length === 0) return 0;
  const total = initialInsurance.reduce(
    (sum, i) => sum + (i.coveragePercent || 0),
    0
  );
  return Math.round(total / initialInsurance.length);
};

export const getUniqueClearinghouses = () => [
  ...new Set(initialInsurance.map((i) => i.clearinghouse)),
];

export const searchInsurance = (query) => {
  if (!query) return initialInsurance;
  const q = query.toLowerCase();
  return initialInsurance.filter(
    (i) =>
      i.company.toLowerCase().includes(q) ||
      i.payerId.toLowerCase().includes(q) ||
      i.program.toLowerCase().includes(q) ||
      i.planType.toLowerCase().includes(q) ||
      i.clearinghouse.toLowerCase().includes(q)
  );
};

export default {
  initialInsurance,
  PROGRAMS,
  PLAN_TYPES,
  GOVERNMENT_PROGRAMS,
  CLEARINGHOUSES,
  getInsuranceByStatus,
  getActiveInsurance,
  getInactiveInsurance,
  getGovernmentInsurance,
  getInsuranceById,
  getInsuranceByPayerId,
  getInsuranceByProgram,
  getInsuranceByPlanType,
  getInsuranceByClearinghouse,
  getStatusCounts,
  getTotalActiveMembers,
  getAverageCoverage,
  getUniqueClearinghouses,
  searchInsurance,
};