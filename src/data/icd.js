/* ============================================================
   🏥 ICD / CPT / HCPCS CODES — Medical Coding Directory
   ─────────────────────────────────────────────
   Used by:
   - ICD.jsx (main page)
   - ICDForm.jsx (form)
   
   Standard codes with realistic metadata
   ============================================================ */

export const initialICD = [
  /* ============ ICD-10-CM Diagnosis Codes ============ */
  {
    id: "CODE-101",
    code: "I10",
    codeType: "ICD-10-CM",
    category: "Cardiovascular",
    description: "Essential (primary) hypertension",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-102",
    code: "E11.9",
    codeType: "ICD-10-CM",
    category: "Endocrinology",
    description: "Type 2 diabetes mellitus without complications",
    billable: true,
    hccEligible: true,
    usageFrequency: "High",
    reimbursementTier: "Chronic Disease Management",
    status: "Active",
  },
  {
    id: "CODE-103",
    code: "I25.10",
    codeType: "ICD-10-CM",
    category: "Cardiovascular",
    description: "Atherosclerotic heart disease of native coronary artery without angina",
    billable: true,
    hccEligible: true,
    usageFrequency: "High",
    reimbursementTier: "Cardiology Tier A",
    status: "Active",
  },
  {
    id: "CODE-104",
    code: "J44.1",
    codeType: "ICD-10-CM",
    category: "Pulmonology",
    description: "Chronic obstructive pulmonary disease with (acute) exacerbation",
    billable: true,
    hccEligible: true,
    usageFrequency: "High",
    reimbursementTier: "Inpatient / Urgent Care",
    status: "Active",
  },
  {
    id: "CODE-105",
    code: "A09",
    codeType: "ICD-10-CM",
    category: "Gastrointestinal",
    description: "Infectious gastroenteritis and colitis, unspecified",
    billable: true,
    hccEligible: false,
    usageFrequency: "Moderate",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-106",
    code: "F41.9",
    codeType: "ICD-10-CM",
    category: "Mental Health",
    description: "Anxiety disorder, unspecified",
    billable: true,
    hccEligible: false,
    usageFrequency: "High",
    reimbursementTier: "Behavioral Health Tier A",
    status: "Active",
  },
  {
    id: "CODE-107",
    code: "F32.9",
    codeType: "ICD-10-CM",
    category: "Mental Health",
    description: "Major depressive disorder, single episode, unspecified",
    billable: true,
    hccEligible: true,
    usageFrequency: "High",
    reimbursementTier: "Behavioral Health Tier A",
    status: "Active",
  },
  {
    id: "CODE-108",
    code: "G43.9",
    codeType: "ICD-10-CM",
    category: "Neurology",
    description: "Migraine, unspecified, not intractable",
    billable: true,
    hccEligible: false,
    usageFrequency: "High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-109",
    code: "G40.9",
    codeType: "ICD-10-CM",
    category: "Neurology",
    description: "Epilepsy, unspecified, not intractable",
    billable: true,
    hccEligible: true,
    usageFrequency: "Moderate",
    reimbursementTier: "Neurology Tier A",
    status: "Active",
  },
  {
    id: "CODE-110",
    code: "I48.91",
    codeType: "ICD-10-CM",
    category: "Cardiovascular",
    description: "Unspecified atrial fibrillation",
    billable: true,
    hccEligible: true,
    usageFrequency: "High",
    reimbursementTier: "Cardiology Tier A",
    status: "Active",
  },
  {
    id: "CODE-111",
    code: "J45.909",
    codeType: "ICD-10-CM",
    category: "Pulmonology",
    description: "Unspecified asthma, uncomplicated",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-112",
    code: "K21.9",
    codeType: "ICD-10-CM",
    category: "Gastrointestinal",
    description: "Gastro-esophageal reflux disease without esophagitis",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-113",
    code: "M54.5",
    codeType: "ICD-10-CM",
    category: "Musculoskeletal",
    description: "Low back pain, unspecified",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-114",
    code: "N39.0",
    codeType: "ICD-10-CM",
    category: "Genitourinary",
    description: "Urinary tract infection, site not specified",
    billable: true,
    hccEligible: false,
    usageFrequency: "High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-115",
    code: "N18.9",
    codeType: "ICD-10-CM",
    category: "Genitourinary",
    description: "Chronic kidney disease, unspecified",
    billable: true,
    hccEligible: true,
    usageFrequency: "Moderate",
    reimbursementTier: "Nephrology Tier A",
    status: "Active",
  },
  {
    id: "CODE-116",
    code: "R05",
    codeType: "ICD-10-CM",
    category: "Symptoms",
    description: "Cough",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-117",
    code: "R51",
    codeType: "ICD-10-CM",
    category: "Symptoms",
    description: "Headache",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Standard Outpatient",
    status: "Active",
  },
  {
    id: "CODE-118",
    code: "B34.9",
    codeType: "ICD-10-CM",
    category: "Infectious Diseases",
    description: "Viral infection, unspecified",
    billable: true,
    hccEligible: false,
    usageFrequency: "Moderate",
    reimbursementTier: "Standard Outpatient",
    status: "Inactive",
  },

  /* ============ CPT Procedure Codes ============ */
  {
    id: "CODE-201",
    code: "99213",
    codeType: "CPT",
    category: "Evaluation & Management",
    description: "Office or other outpatient visit, established patient, low-moderate MDM",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Level 3 Outpatient E/M",
    status: "Active",
  },
  {
    id: "CODE-202",
    code: "99214",
    codeType: "CPT",
    category: "Evaluation & Management",
    description: "Office or other outpatient visit, established patient, moderate MDM",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Level 4 Outpatient E/M",
    status: "Active",
  },
  {
    id: "CODE-203",
    code: "93000",
    codeType: "CPT",
    category: "Diagnostic Cardiology",
    description: "Electrocardiogram (ECG/EKG), routine ECG with at least 12 leads",
    billable: true,
    hccEligible: false,
    usageFrequency: "Moderate",
    reimbursementTier: "Diagnostic Technical + Pro",
    status: "Active",
  },
  {
    id: "CODE-204",
    code: "71046",
    codeType: "CPT",
    category: "Diagnostic Radiology",
    description: "Radiologic examination, chest, 2 views",
    billable: true,
    hccEligible: false,
    usageFrequency: "High",
    reimbursementTier: "Diagnostic Imaging Tier A",
    status: "Active",
  },
  {
    id: "CODE-205",
    code: "80053",
    codeType: "CPT",
    category: "Laboratory",
    description: "Comprehensive metabolic panel (CMP)",
    billable: true,
    hccEligible: false,
    usageFrequency: "Very High",
    reimbursementTier: "Lab Panel Tier A",
    status: "Active",
  },
  {
    id: "CODE-206",
    code: "27447",
    codeType: "CPT",
    category: "Orthopedics",
    description: "Total knee arthroplasty, with or without patellar resurfacing",
    billable: true,
    hccEligible: false,
    usageFrequency: "Low",
    reimbursementTier: "Surgical Tier A",
    status: "Active",
  },
  {
    id: "CODE-207",
    code: "29881",
    codeType: "CPT",
    category: "Orthopedics",
    description: "Arthroscopy, knee, surgical; with meniscectomy",
    billable: true,
    hccEligible: false,
    usageFrequency: "Low",
    reimbursementTier: "Surgical Tier B",
    status: "Active",
  },

  /* ============ HCPCS Level II Codes ============ */
  {
    id: "CODE-301",
    code: "A0428",
    codeType: "HCPCS",
    category: "DME & Transport",
    description: "Ambulance service, basic life support (BLS), non-emergency transport",
    billable: true,
    hccEligible: false,
    usageFrequency: "Low",
    reimbursementTier: "Commercial / Medicare Cap",
    status: "Active",
  },
  {
    id: "CODE-302",
    code: "J3301",
    codeType: "HCPCS",
    category: "Pharmacy & Drugs",
    description: "Injection, triamcinolone acetonide, not otherwise specified, 10 mg",
    billable: true,
    hccEligible: false,
    usageFrequency: "Moderate",
    reimbursementTier: "Drug Reimbursement ASP",
    status: "Active",
  },
  {
    id: "CODE-303",
    code: "E0601",
    codeType: "HCPCS",
    category: "DME & Transport",
    description: "Continuous positive airway pressure (CPAP) device",
    billable: true,
    hccEligible: false,
    usageFrequency: "Moderate",
    reimbursementTier: "DME Capped Rental",
    status: "Active",
  },

  /* ============ Deprecated / Retired ============ */
  {
    id: "CODE-401",
    code: "I10.OLD",
    codeType: "ICD-10-CM",
    category: "Cardiovascular",
    description: "[DEPRECATED] Legacy hypertension coding — replaced by I10",
    billable: false,
    hccEligible: false,
    usageFrequency: "Low",
    reimbursementTier: "Do Not Use",
    status: "Inactive",
  },
  {
    id: "CODE-402",
    code: "99201",
    codeType: "CPT",
    category: "Evaluation & Management",
    description: "[DELETED 2021] Office visit, new patient, straightforward MDM",
    billable: false,
    hccEligible: false,
    usageFrequency: "Low",
    reimbursementTier: "Deprecated — Use 99202",
    status: "Inactive",
  },
];

/* ============================================================
   🎯 HELPERS
   ============================================================ */

export const getCodesByType = (type = "All") => {
  if (type === "All") return initialICD;
  return initialICD.filter((c) => c.codeType === type);
};

export const getActiveCodes = () =>
  initialICD.filter((c) => c.status === "Active");

export const getInactiveCodes = () =>
  initialICD.filter((c) => c.status === "Inactive");

export const getHCCCodes = () =>
  initialICD.filter((c) => c.hccEligible);

export const getBillableCodes = () =>
  initialICD.filter((c) => c.billable);

export const getCodeById = (id) => initialICD.find((c) => c.id === id);

export const getCodeByValue = (code) =>
  initialICD.find((c) => c.code === code);

export const getCodesByCategory = (category) =>
  initialICD.filter((c) => c.category === category);

export const getTypeCounts = () => ({
  All: initialICD.length,
  "ICD-10-CM": initialICD.filter((c) => c.codeType === "ICD-10-CM").length,
  CPT: initialICD.filter((c) => c.codeType === "CPT").length,
  HCPCS: initialICD.filter((c) => c.codeType === "HCPCS").length,
});

export const searchCodes = (query) => {
  if (!query) return initialICD;
  const q = query.toLowerCase();
  return initialICD.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
};

/* ============================================================
   📊 DEFAULT EXPORT
   ============================================================ */
export default {
  initialICD,
  getCodesByType,
  getActiveCodes,
  getInactiveCodes,
  getHCCCodes,
  getBillableCodes,
  getCodeById,
  getCodeByValue,
  getCodesByCategory,
  getTypeCounts,
  searchCodes,
};