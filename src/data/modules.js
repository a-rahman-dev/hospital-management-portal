/* ============================================================
   ⚙️ MODULES DATA — System Modules, Roles & Permissions
   ─────────────────────────────────────────────
   Rule 3: Real module names + realistic user counts
   Rule 5: Cohesive categorization
   ============================================================ */

/* ============ SYSTEM MODULES ============ */
export const systemModules = [
  /* ============ CLINICAL ============ */
  {
    id: 1,
    name: "Patient Directory",
    category: "Clinical",
    description: "Electronic health records & patient registry",
    enabled: true,
    users: 42,
    version: "2.4.1",
  },
  {
    id: 2,
    name: "Appointments",
    category: "Clinical",
    description: "Scheduling, rosters & consultation management",
    enabled: true,
    users: 38,
    version: "1.8.3",
  },
  {
    id: 3,
    name: "Medications",
    category: "Clinical",
    description: "E-prescribing & pharmacotherapy tracking",
    enabled: true,
    users: 35,
    version: "2.1.0",
  },
  {
    id: 4,
    name: "Lab Reports",
    category: "Clinical",
    description: "Diagnostic test batteries & pathology",
    enabled: true,
    users: 28,
    version: "1.5.7",
  },
  {
    id: 14,
    name: "Telehealth",
    category: "Clinical",
    description: "Secure WebRTC video consultations",
    enabled: false,
    users: 0,
    version: "0.9.2",
  },
  {
    id: 15,
    name: "Pharmacy Integration",
    category: "Clinical",
    description: "External pharmacy API bridge & e-Rx routing",
    enabled: false,
    users: 0,
    version: "0.8.0",
  },

  /* ============ FINANCE ============ */
  {
    id: 5,
    name: "Billing",
    category: "Finance",
    description: "Invoicing, claims & patient copays",
    enabled: true,
    users: 12,
    version: "3.0.4",
  },
  {
    id: 6,
    name: "Insurance Claims",
    category: "Finance",
    description: "Payer directory & clearinghouse EDI",
    enabled: true,
    users: 8,
    version: "2.2.1",
  },

  /* ============ RECORDS ============ */
  {
    id: 7,
    name: "ICD Codes",
    category: "Records",
    description: "ICD-10-CM, CPT & HCPCS code catalog",
    enabled: true,
    users: 45,
    version: "4.1.2",
  },
  {
    id: 8,
    name: "OBGYN Diagnosis",
    category: "Records",
    description: "Obstetric registry & perinatal tracking",
    enabled: true,
    users: 15,
    version: "1.6.0",
  },
  {
    id: 9,
    name: "Procedures",
    category: "Records",
    description: "Surgical & clinical procedure catalog",
    enabled: true,
    users: 22,
    version: "1.9.5",
  },

  /* ============ ADMINISTRATION ============ */
  {
    id: 10,
    name: "Providers",
    category: "Administration",
    description: "Credentialed physician registry & shifts",
    enabled: true,
    users: 10,
    version: "1.4.3",
  },
  {
    id: 11,
    name: "Facilities",
    category: "Administration",
    description: "Wards, bed capacity & clinical units",
    enabled: true,
    users: 6,
    version: "1.3.0",
  },
  {
    id: 16,
    name: "Practices",
    category: "Administration",
    description: "Multi-site network & medical directorship",
    enabled: true,
    users: 8,
    version: "1.7.1",
  },

  /* ============ SYSTEM ============ */
  {
    id: 12,
    name: "Users",
    category: "System",
    description: "System users, roles & permissions",
    enabled: true,
    users: 2,
    version: "2.0.0",
  },
  {
    id: 13,
    name: "Reports & Analytics",
    category: "System",
    description: "Dashboard metrics & custom reports",
    enabled: false,
    users: 0,
    version: "0.7.5",
  },
];

/* ============ SYSTEM ROLES ============ */
export const systemRoles = [
  {
    id: 1,
    name: "Super Admin",
    users: 1,
    permissions: 48,
    color: "danger",
    description: "Full system access",
  },
  {
    id: 2,
    name: "Doctor",
    users: 12,
    permissions: 32,
    color: "primary",
    description: "Clinical & patient access",
  },
  {
    id: 3,
    name: "Nurse",
    users: 18,
    permissions: 24,
    color: "info",
    description: "Patient care access",
  },
  {
    id: 4,
    name: "Caregiver",
    users: 8,
    permissions: 16,
    color: "purple",
    description: "Basic patient care",
  },
  {
    id: 5,
    name: "Receptionist",
    users: 4,
    permissions: 12,
    color: "default",
    description: "Front desk access",
  },
  {
    id: 6,
    name: "Billing Manager",
    users: 3,
    permissions: 20,
    color: "warning",
    description: "Finance & billing access",
  },
  {
    id: 7,
    name: "Pharmacist",
    users: 5,
    permissions: 18,
    color: "success",
    description: "Medication access",
  },
  {
    id: 8,
    name: "Lab Technician",
    users: 6,
    permissions: 14,
    color: "info",
    description: "Lab reports access",
  },
  {
    id: 9,
    name: "Radiologist",
    users: 2,
    permissions: 16,
    color: "primary",
    description: "Radiology access",
  },
  {
    id: 10,
    name: "IT Support",
    users: 2,
    permissions: 22,
    color: "purple",
    description: "System support access",
  },
];

/* ============ PERMISSIONS MATRIX ============ */
export const permissionsMatrix = [
  {
    id: 1,
    module: "Dashboard",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: false,
    receptionist: true,
    billing: true,
  },
  {
    id: 2,
    module: "Patients",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: true,
    receptionist: true,
    billing: false,
  },
  {
    id: 3,
    module: "Appointments",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: false,
    receptionist: true,
    billing: false,
  },
  {
    id: 4,
    module: "Medications",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: false,
    receptionist: false,
    billing: false,
  },
  {
    id: 5,
    module: "Lab Reports",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: false,
    receptionist: false,
    billing: false,
  },
  {
    id: 6,
    module: "Billing",
    super_admin: true,
    doctor: false,
    nurse: false,
    caregiver: false,
    receptionist: false,
    billing: true,
  },
  {
    id: 7,
    module: "Insurance",
    super_admin: true,
    doctor: false,
    nurse: false,
    caregiver: false,
    receptionist: false,
    billing: true,
  },
  {
    id: 8,
    module: "ICD Codes",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: false,
    receptionist: false,
    billing: true,
  },
  {
    id: 9,
    module: "Procedures",
    super_admin: true,
    doctor: true,
    nurse: true,
    caregiver: false,
    receptionist: false,
    billing: true,
  },
  {
    id: 10,
    module: "Providers",
    super_admin: true,
    doctor: false,
    nurse: false,
    caregiver: false,
    receptionist: false,
    billing: false,
  },
  {
    id: 11,
    module: "Facilities",
    super_admin: true,
    doctor: false,
    nurse: false,
    caregiver: false,
    receptionist: false,
    billing: false,
  },
  {
    id: 12,
    module: "Users",
    super_admin: true,
    doctor: false,
    nurse: false,
    caregiver: false,
    receptionist: false,
    billing: false,
  },
  {
    id: 13,
    module: "Settings",
    super_admin: true,
    doctor: false,
    nurse: false,
    caregiver: false,
    receptionist: false,
    billing: false,
  },
];

/* ============================================================
   🎯 CONSTANTS
   ============================================================ */

export const MODULE_CATEGORIES = [
  "Clinical",
  "Finance",
  "Records",
  "Administration",
  "System",
];

/* ============================================================
   🎯 HELPERS — Easy access
   ============================================================ */

export const getModulesByCategory = (category = "All") => {
  if (category === "All") return systemModules;
  return systemModules.filter((m) => m.category === category);
};

export const getEnabledModules = () =>
  systemModules.filter((m) => m.enabled);

export const getDisabledModules = () =>
  systemModules.filter((m) => !m.enabled);

export const getModuleById = (id) => systemModules.find((m) => m.id === id);

export const getModuleCounts = () => ({
  all: systemModules.length,
  enabled: systemModules.filter((m) => m.enabled).length,
  disabled: systemModules.filter((m) => !m.enabled).length,
  clinical: systemModules.filter((m) => m.category === "Clinical").length,
  finance: systemModules.filter((m) => m.category === "Finance").length,
  records: systemModules.filter((m) => m.category === "Records").length,
  administration: systemModules.filter((m) => m.category === "Administration")
    .length,
  system: systemModules.filter((m) => m.category === "System").length,
});

export const getTotalModuleUsers = () =>
  systemModules.reduce((sum, m) => sum + (m.users || 0), 0);

export const getRoleById = (id) => systemRoles.find((r) => r.id === id);

export const getRoleByName = (name) =>
  systemRoles.find((r) => r.name === name);

export const getTotalRoleUsers = () =>
  systemRoles.reduce((sum, r) => sum + (r.users || 0), 0);

export const getPermissionsForRole = (roleName) => {
  const key = roleName.toLowerCase().replace(/\s+/g, "_");
  return permissionsMatrix
    .filter((p) => p[key])
    .map((p) => p.module);
};

export const searchModules = (query) => {
  if (!query) return systemModules;
  const q = query.toLowerCase();
  return systemModules.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  );
};

export default {
  systemModules,
  systemRoles,
  permissionsMatrix,
  MODULE_CATEGORIES,
  getModulesByCategory,
  getEnabledModules,
  getDisabledModules,
  getModuleById,
  getModuleCounts,
  getTotalModuleUsers,
  getRoleById,
  getRoleByName,
  getTotalRoleUsers,
  getPermissionsForRole,
  searchModules,
};