/* ============================================================
   👥 USERS DATA — System Access Registry
   ─────────────────────────────────────────────
   Rule 3: Foreign names + realistic departments
   Rule 5: Cohesive grouping by role type
   ============================================================ */

export const initialUsers = [
  /* ============ ADMINISTRATION ============ */
  {
    id: 1,
    name: "Dr. A. Rahman",
    email: "a.rahman@ayint-hospital.com",
    role: "Super Admin",
    department: "Administration",
    phone: "+1 (555) 100-2000",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-indigo-600 to-violet-600",
  },
  {
    id: 17,
    name: "Stephanie Harris",
    email: "s.harris@ayint-hospital.com",
    role: "HR Manager",
    department: "Human Resources",
    phone: "+1 (555) 100-2016",
    status: "Active",
    lastLogin: "2026-09-15",
    avatarColor: "from-amber-500 to-orange-600",
  },
  {
    id: 16,
    name: "Joshua White",
    email: "j.white@ayint-hospital.com",
    role: "IT Support",
    department: "Information Technology",
    phone: "+1 (555) 100-2015",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-slate-600 to-slate-800",
  },

  /* ============ CLINICAL — DOCTORS ============ */
  {
    id: 2,
    name: "Dr. Sarah Chen",
    email: "s.chen@ayint-hospital.com",
    role: "Doctor",
    department: "Internal Medicine",
    phone: "+1 (555) 100-2001",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-blue-600 to-indigo-600",
  },
  {
    id: 3,
    name: "Dr. Michael Park",
    email: "m.park@ayint-hospital.com",
    role: "Doctor",
    department: "Cardiology",
    phone: "+1 (555) 100-2002",
    status: "Active",
    lastLogin: "2026-09-15",
    avatarColor: "from-cyan-600 to-blue-600",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    email: "j.wilson@ayint-hospital.com",
    role: "Doctor",
    department: "Neurology",
    phone: "+1 (555) 100-2003",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-teal-600 to-cyan-600",
  },
  {
    id: 14,
    name: "Dr. Daniel Moore",
    email: "d.moore@ayint-hospital.com",
    role: "Doctor",
    department: "Orthopedics",
    phone: "+1 (555) 100-2013",
    status: "Inactive",
    lastLogin: "2026-08-20",
    avatarColor: "from-rose-500 to-red-600",
  },
  {
    id: 20,
    name: "Dr. Brian Lewis",
    email: "b.lewis@ayint-hospital.com",
    role: "Doctor",
    department: "Pediatrics",
    phone: "+1 (555) 100-2019",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-violet-600 to-purple-600",
  },

  /* ============ CLINICAL — NURSES ============ */
  {
    id: 5,
    name: "Emily Davis",
    email: "e.davis@ayint-hospital.com",
    role: "Nurse",
    department: "ICU",
    phone: "+1 (555) 100-2004",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-emerald-600 to-teal-600",
  },
  {
    id: 6,
    name: "Robert Martinez",
    email: "r.martinez@ayint-hospital.com",
    role: "Nurse",
    department: "Emergency",
    phone: "+1 (555) 100-2005",
    status: "Active",
    lastLogin: "2026-09-15",
    avatarColor: "from-red-600 to-rose-600",
  },
  {
    id: 13,
    name: "Jessica Taylor",
    email: "j.taylor@ayint-hospital.com",
    role: "Nurse",
    department: "Pediatrics",
    phone: "+1 (555) 100-2012",
    status: "Active",
    lastLogin: "2026-09-14",
    avatarColor: "from-pink-600 to-fuchsia-600",
  },

  /* ============ CLINICAL — SPECIALISTS ============ */
  {
    id: 10,
    name: "Christopher Brown",
    email: "c.brown@ayint-hospital.com",
    role: "Pharmacist",
    department: "Pharmacy",
    phone: "+1 (555) 100-2009",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-green-600 to-emerald-600",
  },
  {
    id: 11,
    name: "Amanda Garcia",
    email: "a.garcia@ayint-hospital.com",
    role: "Lab Technician",
    department: "Laboratory",
    phone: "+1 (555) 100-2010",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-cyan-600 to-teal-600",
  },
  {
    id: 12,
    name: "Matthew Wilson",
    email: "m.wilson@ayint-hospital.com",
    role: "Radiologist",
    department: "Radiology",
    phone: "+1 (555) 100-2011",
    status: "Active",
    lastLogin: "2026-09-15",
    avatarColor: "from-sky-600 to-blue-600",
  },
  {
    id: 19,
    name: "Nancy Clark",
    email: "n.clark@ayint-hospital.com",
    role: "Dietitian",
    department: "Nutrition",
    phone: "+1 (555) 100-2018",
    status: "Inactive",
    lastLogin: "2026-08-15",
    avatarColor: "from-lime-600 to-green-600",
  },

  /* ============ SUPPORT STAFF ============ */
  {
    id: 7,
    name: "Linda Thompson",
    email: "l.thompson@ayint-hospital.com",
    role: "Caregiver",
    department: "Patient Care",
    phone: "+1 (555) 100-2006",
    status: "Active",
    lastLogin: "2026-09-14",
    avatarColor: "from-orange-500 to-amber-600",
  },
  {
    id: 15,
    name: "Ashley Jackson",
    email: "a.jackson@ayint-hospital.com",
    role: "Caregiver",
    department: "Patient Care",
    phone: "+1 (555) 100-2014",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-amber-600 to-yellow-600",
  },
  {
    id: 8,
    name: "David Anderson",
    email: "d.anderson@ayint-hospital.com",
    role: "Receptionist",
    department: "Front Desk",
    phone: "+1 (555) 100-2007",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-blue-500 to-cyan-500",
  },
  {
    id: 9,
    name: "Jennifer Lee",
    email: "j.lee@ayint-hospital.com",
    role: "Billing Manager",
    department: "Finance",
    phone: "+1 (555) 100-2008",
    status: "Active",
    lastLogin: "2026-09-15",
    avatarColor: "from-yellow-600 to-orange-600",
  },
  {
    id: 18,
    name: "Kevin Martin",
    email: "k.martin@ayint-hospital.com",
    role: "Security",
    department: "Security",
    phone: "+1 (555) 100-2017",
    status: "Active",
    lastLogin: "2026-09-16",
    avatarColor: "from-slate-700 to-gray-800",
  },
];

/* ============================================================
   🎯 HELPERS — Easy access
   ============================================================ */

export const ROLES = [
  "Super Admin",
  "Doctor",
  "Nurse",
  "Caregiver",
  "Receptionist",
  "Billing Manager",
  "Pharmacist",
  "Lab Technician",
  "Radiologist",
  "IT Support",
  "HR Manager",
  "Security",
  "Dietitian",
];

export const CLINICAL_ROLES = [
  "Doctor",
  "Nurse",
  "Caregiver",
  "Pharmacist",
  "Lab Technician",
  "Radiologist",
  "Dietitian",
];

export const ADMIN_ROLES = ["Super Admin", "IT Support", "HR Manager"];

export const getUsersByStatus = (status = "All") => {
  if (status === "All") return initialUsers;
  return initialUsers.filter((u) => u.status === status);
};

export const getActiveUsers = () =>
  initialUsers.filter((u) => u.status === "Active");

export const getInactiveUsers = () =>
  initialUsers.filter((u) => u.status === "Inactive");

export const getClinicalUsers = () =>
  initialUsers.filter((u) => CLINICAL_ROLES.includes(u.role));

export const getUserById = (id) => initialUsers.find((u) => u.id === id);

export const getUserByEmail = (email) =>
  initialUsers.find((u) => u.email === email);

export const getUsersByRole = (role) =>
  initialUsers.filter((u) => u.role === role);

export const getUsersByDepartment = (department) =>
  initialUsers.filter((u) => u.department === department);

export const getStatusCounts = () => ({
  all: initialUsers.length,
  Active: initialUsers.filter((u) => u.status === "Active").length,
  Inactive: initialUsers.filter((u) => u.status === "Inactive").length,
  clinical: initialUsers.filter((u) => CLINICAL_ROLES.includes(u.role)).length,
});

export const getRoleCounts = () => {
  const counts = {};
  ROLES.forEach((role) => {
    counts[role] = initialUsers.filter((u) => u.role === role).length;
  });
  return counts;
};

export const searchUsers = (query) => {
  if (!query) return initialUsers;
  const q = query.toLowerCase();
  return initialUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.status.toLowerCase().includes(q)
  );
};

export default {
  initialUsers,
  ROLES,
  CLINICAL_ROLES,
  ADMIN_ROLES,
  getUsersByStatus,
  getActiveUsers,
  getInactiveUsers,
  getClinicalUsers,
  getUserById,
  getUserByEmail,
  getUsersByRole,
  getUsersByDepartment,
  getStatusCounts,
  getRoleCounts,
  searchUsers,
};