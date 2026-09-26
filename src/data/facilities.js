/* ============================================================
   🏥 FACILITIES DATA — Hospital Wards & Clinical Units
   ─────────────────────────────────────────────
   Rule 3: Real foreign nurse names + realistic bed numbers
   Rule 5: Cohesive categorization
   ============================================================ */

export const facilitiesData = [
  {
    id: "FAC-01",
    facilityCode: "TWR-B-ICU",
    name: "Cardiovascular Intensive Care Unit (CVICU)",
    buildingWing: "Tower B - 3rd Floor",
    type: "Critical Care (ICU)",
    totalBeds: 24,
    occupiedBeds: 22,
    nurseInCharge: "Nurse Sarah Jenkins, RN, BSN",
    contactExt: "Ext. 4301",
    status: "Near Capacity",
    avatarColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "FAC-02",
    facilityCode: "PAV-E-MAT",
    name: "Maternal & Perinatal Labor Pavilion",
    buildingWing: "Pavilion East - 2nd Floor",
    type: "Inpatient Maternity",
    totalBeds: 32,
    occupiedBeds: 21,
    nurseInCharge: "Nurse Rachel Adams, RNC-OB",
    contactExt: "Ext. 5200",
    status: "Operational",
    avatarColor: "from-pink-500 to-rose-600",
  },
  {
    id: "FAC-03",
    facilityCode: "SURG-OR-CTR",
    name: "Surgical Suites & Post-Anesthesia (PACU)",
    buildingWing: "Surgical Block - 1st Floor",
    type: "Surgical / Procedural",
    totalBeds: 18,
    occupiedBeds: 12,
    nurseInCharge: "Nurse David Ross, CRNA",
    contactExt: "Ext. 3100",
    status: "Operational",
    avatarColor: "from-indigo-600 to-violet-600",
  },
  {
    id: "FAC-04",
    facilityCode: "TWR-A-NEURO",
    name: "Neuroscience Step-Down Unit",
    buildingWing: "Tower A - 4th Floor",
    type: "Specialized Step-Down",
    totalBeds: 20,
    occupiedBeds: 18,
    nurseInCharge: "Nurse Lisa Wong, MSN, RN",
    contactExt: "Ext. 4410",
    status: "Near Capacity",
    avatarColor: "from-teal-500 to-emerald-600",
  },
  {
    id: "FAC-05",
    facilityCode: "ISO-WING-W3",
    name: "Negative Pressure Isolation Ward",
    buildingWing: "West Annex - Ground Level",
    type: "Infectious Disease Ward",
    totalBeds: 12,
    occupiedBeds: 0,
    nurseInCharge: "Nurse Michael Vance, RN",
    contactExt: "Ext. 1102",
    status: "Maintenance",
    avatarColor: "from-rose-500 to-red-600",
  },
  {
    id: "FAC-06",
    facilityCode: "AMB-MED-CLIN",
    name: "Comprehensive Day Ambulatory Infusion",
    buildingWing: "Plaza Center - Suite 100",
    type: "Outpatient Infusion",
    totalBeds: 16,
    occupiedBeds: 9,
    nurseInCharge: "Nurse Emily Blunt, OCN, RN",
    contactExt: "Ext. 2011",
    status: "Operational",
    avatarColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "FAC-07",
    facilityCode: "PULM-REHAB-2",
    name: "Respiratory Step-Down & Pulmonary Ward",
    buildingWing: "Tower B - 5th Floor",
    type: "Sub-Acute Respiratory",
    totalBeds: 22,
    occupiedBeds: 14,
    nurseInCharge: "Nurse Kevin Patel, BSN, RN",
    contactExt: "Ext. 4502",
    status: "Operational",
    avatarColor: "from-purple-500 to-violet-600",
  },
  {
    id: "FAC-08",
    facilityCode: "PED-WARD-E1",
    name: "Pediatric Inpatient & NICU Ward",
    buildingWing: "East Wing - 6th Floor",
    type: "Pediatric Care",
    totalBeds: 28,
    occupiedBeds: 19,
    nurseInCharge: "Nurse Jennifer Hayes, CPN, RN",
    contactExt: "Ext. 6100",
    status: "Operational",
    avatarColor: "from-amber-500 to-orange-600",
  },
  {
    id: "FAC-09",
    facilityCode: "ONCO-DAY-1",
    name: "Oncology Day Treatment & Chemotherapy",
    buildingWing: "Cancer Center - 2nd Floor",
    type: "Outpatient Oncology",
    totalBeds: 20,
    occupiedBeds: 17,
    nurseInCharge: "Nurse Priya Sharma, OCN, BSN",
    contactExt: "Ext. 7200",
    status: "Near Capacity",
    avatarColor: "from-violet-600 to-fuchsia-600",
  },
  {
    id: "FAC-10",
    facilityCode: "REHAB-PHY-3",
    name: "Physical Rehabilitation & Recovery Suite",
    buildingWing: "Tower C - 1st Floor",
    type: "Rehabilitation Unit",
    totalBeds: 24,
    occupiedBeds: 11,
    nurseInCharge: "Nurse Daniel Foster, RN, CRRN",
    contactExt: "Ext. 8100",
    status: "Operational",
    avatarColor: "from-emerald-600 to-teal-600",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

export const getFacilitiesByStatus = (status = "All") => {
  if (status === "All") return facilitiesData;
  return facilitiesData.filter((f) => f.status === status);
};

export const getOperationalFacilities = () =>
  facilitiesData.filter((f) => f.status === "Operational");

export const getNearCapacityFacilities = () =>
  facilitiesData.filter((f) => f.status === "Near Capacity");

export const getMaintenanceFacilities = () =>
  facilitiesData.filter((f) => f.status === "Maintenance");

export const getFacilityById = (id) =>
  facilitiesData.find((f) => f.id === id);

export const getFacilityByCode = (code) =>
  facilitiesData.find((f) => f.facilityCode === code);

export const getStatusCounts = () => ({
  All: facilitiesData.length,
  Operational: facilitiesData.filter((f) => f.status === "Operational").length,
  "Near Capacity": facilitiesData.filter((f) => f.status === "Near Capacity")
    .length,
  Maintenance: facilitiesData.filter((f) => f.status === "Maintenance").length,
});

/**
 * Get total bed capacity across all facilities
 */
export const getTotalBeds = () =>
  facilitiesData.reduce((sum, f) => sum + (f.totalBeds || 0), 0);

/**
 * Get total occupied beds
 */
export const getTotalOccupiedBeds = () =>
  facilitiesData.reduce((sum, f) => sum + (f.occupiedBeds || 0), 0);

/**
 * Get overall hospital occupancy percentage
 */
export const getOverallOccupancy = () => {
  const total = getTotalBeds();
  const occupied = getTotalOccupiedBeds();
  return total === 0 ? 0 : Math.round((occupied / total) * 100);
};

export const searchFacilities = (query) => {
  if (!query) return facilitiesData;
  const q = query.toLowerCase();
  return facilitiesData.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.facilityCode.toLowerCase().includes(q) ||
      f.buildingWing.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.nurseInCharge.toLowerCase().includes(q)
  );
};

export default {
  facilitiesData,
  getFacilitiesByStatus,
  getOperationalFacilities,
  getNearCapacityFacilities,
  getMaintenanceFacilities,
  getFacilityById,
  getFacilityByCode,
  getStatusCounts,
  getTotalBeds,
  getTotalOccupiedBeds,
  getOverallOccupancy,
  searchFacilities,
};