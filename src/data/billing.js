/* ============================================================
   💳 BILLING DATA — Patient Invoices & Claims
   ─────────────────────────────────────────────
   Rule 3: Real foreign names + realistic amounts
   Rule 5: Cohesive status flow
   ============================================================ */

export const initialBillingRecords = [
  /* ============ PAID — Settled claims ============ */
  {
    id: "INV-9021",
    invoiceNumber: "INV-2026-001",
    patientName: "Jonathan Mitchell",
    patientId: "PAT-101",
    patientMrn: "MRN-882109",
    insuranceProvider: "Blue Cross Blue Shield",
    serviceDescription: "Cardiac Angioplasty & Cath Lab Suite",
    department: "Cardiology",
    serviceDate: "2026-09-08",
    billedDate: "2026-09-10",
    dueDate: "2026-10-10",
    paidAt: "2026-09-14",
    totalAmount: "$14,500.00",
    totalAmountRaw: 14500,
    insuranceCovered: "$12,000.00",
    insuranceCoveredRaw: 12000,
    patientCopay: "$2,500.00",
    patientCopayRaw: 2500,
    paymentMethod: "Insurance Wire",
    status: "Paid",
    notes: "Pre-authorization approved",
    avatarColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "INV-9022",
    invoiceNumber: "INV-2026-002",
    patientName: "Emma Rodriguez",
    patientId: "PAT-102",
    patientMrn: "MRN-902144",
    insuranceProvider: "Aetna Health",
    serviceDescription: "Routine Prenatal Ultrasound & Lab Battery",
    department: "OB/GYN",
    serviceDate: "2026-09-10",
    billedDate: "2026-09-12",
    dueDate: "2026-10-12",
    paidAt: "2026-09-15",
    totalAmount: "$1,850.00",
    totalAmountRaw: 1850,
    insuranceCovered: "$1,500.00",
    insuranceCoveredRaw: 1500,
    patientCopay: "$350.00",
    patientCopayRaw: 350,
    paymentMethod: "Credit Card",
    status: "Paid",
    notes: "Routine prenatal care",
    avatarColor: "from-purple-600 to-pink-600",
  },
  {
    id: "INV-9024",
    invoiceNumber: "INV-2026-004",
    patientName: "Sophia Bennett",
    patientId: "PAT-104",
    patientMrn: "MRN-674312",
    insuranceProvider: "UnitedHealthcare",
    serviceDescription: "Endocrinology Comprehensive Consult",
    department: "Internal Medicine",
    serviceDate: "2026-09-06",
    billedDate: "2026-09-08",
    dueDate: "2026-10-08",
    paidAt: "2026-09-12",
    totalAmount: "$640.00",
    totalAmountRaw: 640,
    insuranceCovered: "$500.00",
    insuranceCoveredRaw: 500,
    patientCopay: "$140.00",
    patientCopayRaw: 140,
    paymentMethod: "Direct ACH",
    status: "Paid",
    notes: "Follow-up consult",
    avatarColor: "from-orange-500 to-amber-600",
  },
  {
    id: "INV-9027",
    invoiceNumber: "INV-2026-007",
    patientName: "David Miller",
    patientId: "PAT-107",
    patientMrn: "MRN-331908",
    insuranceProvider: "Medicare Part A & B",
    serviceDescription: "Pulmonary Rehabilitation & Nebulizer Cycle",
    department: "Pulmonology",
    serviceDate: "2026-09-03",
    billedDate: "2026-09-05",
    dueDate: "2026-10-05",
    paidAt: "2026-09-10",
    totalAmount: "$1,240.00",
    totalAmountRaw: 1240,
    insuranceCovered: "$1,100.00",
    insuranceCoveredRaw: 1100,
    patientCopay: "$140.00",
    patientCopayRaw: 140,
    paymentMethod: "Electronic Claim",
    status: "Paid",
    notes: "Medicare Part B covered",
    avatarColor: "from-indigo-600 to-violet-600",
  },

  /* ============ PENDING — Awaiting payer ============ */
  {
    id: "INV-9023",
    invoiceNumber: "INV-2026-003",
    patientName: "William Anderson",
    patientId: "PAT-103",
    patientMrn: "MRN-781920",
    insuranceProvider: "Medicare Part B",
    serviceDescription: "ICU Continuous Monitoring & Neuro Panel",
    department: "Neurology",
    serviceDate: "2026-09-12",
    billedDate: "2026-09-14",
    dueDate: "2026-10-14",
    paidAt: null,
    totalAmount: "$8,900.00",
    totalAmountRaw: 8900,
    insuranceCovered: "$7,200.00",
    insuranceCoveredRaw: 7200,
    patientCopay: "$1,700.00",
    patientCopayRaw: 1700,
    paymentMethod: "CMS Clearinghouse",
    status: "Pending",
    notes: "Awaiting Medicare adjudication",
    avatarColor: "from-cyan-600 to-blue-600",
  },
  {
    id: "INV-9026",
    invoiceNumber: "INV-2026-006",
    patientName: "Olivia Zhang",
    patientId: "PAT-106",
    patientMrn: "MRN-442811",
    insuranceProvider: "Humana Gold",
    serviceDescription: "Outpatient Allergy Biopsy & Patch Testing",
    department: "Dermatology",
    serviceDate: "2026-09-12",
    billedDate: "2026-09-14",
    dueDate: "2026-10-14",
    paidAt: null,
    totalAmount: "$920.00",
    totalAmountRaw: 920,
    insuranceCovered: "$750.00",
    insuranceCoveredRaw: 750,
    patientCopay: "$170.00",
    patientCopayRaw: 170,
    paymentMethod: "Pending Payer",
    status: "Pending",
    notes: "Awaiting claim review",
    avatarColor: "from-teal-500 to-emerald-600",
  },
  {
    id: "INV-9028",
    invoiceNumber: "INV-2026-008",
    patientName: "Isabella Martinez",
    patientId: "PAT-108",
    patientMrn: "MRN-229081",
    insuranceProvider: "Blue Cross Blue Shield",
    serviceDescription: "Cardiac ICU Admission — Post-MI Care",
    department: "Cardiology",
    serviceDate: "2026-09-15",
    billedDate: "2026-09-16",
    dueDate: "2026-10-16",
    paidAt: null,
    totalAmount: "$34,200.00",
    totalAmountRaw: 34200,
    insuranceCovered: "$27,360.00",
    insuranceCoveredRaw: 27360,
    patientCopay: "$6,840.00",
    patientCopayRaw: 6840,
    paymentMethod: "Insurance Wire",
    status: "Pending",
    notes: "High-cost claim — under review",
    avatarColor: "from-rose-500 to-pink-600",
  },

  /* ============ OVERDUE — Action required ============ */
  {
    id: "INV-9025",
    invoiceNumber: "INV-2026-005",
    patientName: "Alexander Hayes",
    patientId: "PAT-105",
    patientMrn: "MRN-551940",
    insuranceProvider: "Cigna Commercial",
    serviceDescription: "ACL Ligament Surgery & Surgical Tech Fee",
    department: "Orthopedics",
    serviceDate: "2026-08-12",
    billedDate: "2026-08-15",
    dueDate: "2026-09-01",
    paidAt: null,
    totalAmount: "$6,200.00",
    totalAmountRaw: 6200,
    insuranceCovered: "$4,800.00",
    insuranceCoveredRaw: 4800,
    patientCopay: "$1,400.00",
    patientCopayRaw: 1400,
    paymentMethod: null,
    status: "Overdue",
    notes: "Patient has not responded to payment requests",
    avatarColor: "from-rose-500 to-red-600",
  },
  {
    id: "INV-9029",
    invoiceNumber: "INV-2026-009",
    patientName: "Charlotte Davies",
    patientId: "PAT-110",
    patientMrn: "MRN-098712",
    insuranceProvider: "Aetna Health",
    serviceDescription: "Thyroid Function Panel & Endocrinology Consult",
    department: "Endocrinology",
    serviceDate: "2026-08-05",
    billedDate: "2026-08-08",
    dueDate: "2026-08-25",
    paidAt: null,
    totalAmount: "$780.00",
    totalAmountRaw: 780,
    insuranceCovered: "$624.00",
    insuranceCoveredRaw: 624,
    patientCopay: "$156.00",
    patientCopayRaw: 156,
    paymentMethod: null,
    status: "Overdue",
    notes: "Payment reminder sent 3 times",
    avatarColor: "from-violet-500 to-purple-600",
  },
  {
    id: "INV-9030",
    invoiceNumber: "INV-2026-010",
    patientName: "Benjamin Clarke",
    patientId: "PAT-109",
    patientMrn: "MRN-119873",
    insuranceProvider: "Kaiser Permanente",
    serviceDescription: "Community-Acquired Pneumonia Treatment",
    department: "Pulmonology",
    serviceDate: "2026-07-28",
    billedDate: "2026-07-30",
    dueDate: "2026-08-15",
    paidAt: null,
    totalAmount: "$2,400.00",
    totalAmountRaw: 2400,
    insuranceCovered: "$1,920.00",
    insuranceCoveredRaw: 1920,
    patientCopay: "$480.00",
    patientCopayRaw: 480,
    paymentMethod: null,
    status: "Overdue",
    notes: "Escalated to collections",
    avatarColor: "from-blue-500 to-indigo-600",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

export const getBillingByStatus = (status = "All") => {
  if (status === "All") return initialBillingRecords;
  return initialBillingRecords.filter((b) => b.status === status);
};

export const getPaidInvoices = () =>
  initialBillingRecords.filter((b) => b.status === "Paid");

export const getPendingInvoices = () =>
  initialBillingRecords.filter((b) => b.status === "Pending");

export const getOverdueInvoices = () =>
  initialBillingRecords.filter((b) => b.status === "Overdue");

export const getInvoiceById = (id) =>
  initialBillingRecords.find((b) => b.id === id);

export const getInvoiceByNumber = (invoiceNumber) =>
  initialBillingRecords.find((b) => b.invoiceNumber === invoiceNumber);

export const getInvoicesByPatient = (patientId) =>
  initialBillingRecords.filter((b) => b.patientId === patientId);

export const getInvoicesByDepartment = (department) =>
  initialBillingRecords.filter((b) => b.department === department);

export const getInvoicesByInsurance = (insuranceProvider) =>
  initialBillingRecords.filter((b) => b.insuranceProvider === insuranceProvider);

export const getStatusCounts = () => ({
  All: initialBillingRecords.length,
  Paid: initialBillingRecords.filter((b) => b.status === "Paid").length,
  Pending: initialBillingRecords.filter((b) => b.status === "Pending").length,
  Overdue: initialBillingRecords.filter((b) => b.status === "Overdue").length,
});

/**
 * Calculate total billed amount
 */
export const getTotalBilled = () =>
  initialBillingRecords.reduce((sum, b) => sum + (b.totalAmountRaw || 0), 0);

/**
 * Calculate total collected (Paid only)
 */
export const getTotalCollected = () =>
  initialBillingRecords
    .filter((b) => b.status === "Paid")
    .reduce((sum, b) => sum + (b.totalAmountRaw || 0), 0);

/**
 * Calculate total outstanding (Pending + Overdue)
 */
export const getTotalOutstanding = () =>
  initialBillingRecords
    .filter((b) => b.status !== "Paid")
    .reduce((sum, b) => sum + (b.totalAmountRaw || 0), 0);

/**
 * Get overall collection rate percentage
 */
export const getCollectionRate = () => {
  const total = getTotalBilled();
  const collected = getTotalCollected();
  return total === 0 ? 0 : Math.round((collected / total) * 100);
};

/**
 * Get revenue summary
 */
export const getRevenueSummary = () => ({
  total: getTotalBilled(),
  collected: getTotalCollected(),
  outstanding: getTotalOutstanding(),
  rate: getCollectionRate(),
});

/**
 * Get department revenue breakdown
 */
export const getDepartmentRevenue = () => {
  const result = {};
  initialBillingRecords.forEach((b) => {
    if (!result[b.department]) {
      result[b.department] = { total: 0, count: 0 };
    }
    result[b.department].total += b.totalAmountRaw || 0;
    result[b.department].count += 1;
  });
  return result;
};

export const searchBilling = (query) => {
  if (!query) return initialBillingRecords;
  const q = query.toLowerCase();
  return initialBillingRecords.filter(
    (b) =>
      b.patientName.toLowerCase().includes(q) ||
      b.invoiceNumber.toLowerCase().includes(q) ||
      b.insuranceProvider.toLowerCase().includes(q) ||
      b.serviceDescription.toLowerCase().includes(q) ||
      b.department.toLowerCase().includes(q)
  );
};

export default {
  initialBillingRecords,
  getBillingByStatus,
  getPaidInvoices,
  getPendingInvoices,
  getOverdueInvoices,
  getInvoiceById,
  getInvoiceByNumber,
  getInvoicesByPatient,
  getInvoicesByDepartment,
  getInvoicesByInsurance,
  getStatusCounts,
  getTotalBilled,
  getTotalCollected,
  getTotalOutstanding,
  getCollectionRate,
  getRevenueSummary,
  getDepartmentRevenue,
  searchBilling,
};