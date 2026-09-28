import {
  LayoutDashboard,
  Building2,
  Shield,
  Users,
  Stethoscope,
  Baby,
  Pill,
  UserCog,
  Scissors,
  Hospital,
  Briefcase,
  Settings,
  HeartPulse,
  Calendar,
  FlaskConical,
  DollarSign,
  LayoutGrid,
  Award,
  Key,
} from "lucide-react";

export const sidebarMenu = [
  /* ============ OVERVIEW ============ */
  {
    section: "Overview",
    color: "#06b6d4",
    defaultOpen: true,
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        description: "Main dashboard overview",
      },
    ],
  },

  /* ============ CLINICAL ============ */
  {
    section: "Clinical",
    color: "#10b981",
    defaultOpen: true,
    items: [
      {
        name: "Patients",
        icon: HeartPulse,
        description: "Patient directory & records",
        children: [
          {
            name: "Patient Directory",
            path: "/patients",
            icon: Users,
            description: "All registered patients",
          },
          {
            name: "Appointments",
            path: "/patients/appointments",
            icon: Calendar,
            description: "Scheduling & rosters",
          },
          {
            name: "Medications",
            path: "/patients/medications",
            icon: Pill,
            description: "E-prescriptions & refills",
          },
          {
            name: "Lab Reports",
            path: "/patients/lab-reports",
            icon: FlaskConical,
            description: "Diagnostic test results",
          },
          {
            name: "Billing",
            path: "/patients/billing",
            icon: DollarSign,
            description: "Invoices & claims",
          },
        ],
      },
      {
        name: "ICD Codes",
        path: "/icd",
        icon: Stethoscope,
        description: "ICD-10 & CPT catalog",
      },
      {
        name: "OBGYN Diagnosis",
        path: "/obgyn",
        icon: Baby,
        description: "Obstetric registry",
      },
      {
        name: "Procedures",
        path: "/procedures",
        icon: Scissors,
        description: "Surgical & clinical procedures",
      },
    ],
  },

  /* ============ ADMINISTRATION ============ */
  {
    section: "Administration",
    color: "#8b5cf6",
    defaultOpen: false,
    items: [
      {
        name: "Practice Setting",
        path: "/practice-setting",
        icon: Briefcase,
        description: "Clinic configuration",
      },
      {
        name: "Practices",
        path: "/practices",
        icon: Building2,
        description: "Multi-site network",
      },
      {
        name: "Facilities",
        path: "/facilities",
        icon: Hospital,
        description: "Wards & bed capacity",
      },
      {
        name: "Providers",
        path: "/providers",
        icon: UserCog,
        description: "Credentialed physicians",
      },
      {
        name: "Users",
        path: "/users",
        icon: Users,
        description: "System users & roles",
      },
      {
        name: "Insurance",
        path: "/insurance",
        icon: Shield,
        description: "Payers & clearinghouse",
      },
    ],
  },

  /* ============ SYSTEM ============ */
  {
    section: "System",
    color: "#f59e0b",
    defaultOpen: false,
    items: [
      {
        name: "Module Management",
        icon: Settings,
        description: "System configuration",
        children: [
          {
            name: "Modules",
            path: "/modules",
            icon: LayoutGrid,
            description: "Feature toggles",
          },
          {
            name: "Roles",
            path: "/modules/roles",
            icon: Award,
            description: "Role definitions",
          },
          {
            name: "Permissions",
            path: "/modules/permissions",
            icon: Key,
            description: "Access matrix",
          },
        ],
      },
    ],
  },
];

/* Helper functions bilkul waise hi rahenge */
export const getAllMenuItems = () => {
  const items = [];
  sidebarMenu.forEach((section) => {
    section.items.forEach((item) => {
      items.push(item);
      if (item.children) {
        item.children.forEach((child) => items.push(child));
      }
    });
  });
  return items;
};

export const getMenuItemByPath = (path) => {
  return getAllMenuItems().find((item) => item.path === path);
};

export const getParentByChildPath = (childPath) => {
  for (const section of sidebarMenu) {
    for (const item of section.items) {
      if (item.children?.some((c) => c.path === childPath)) {
        return { section, item };
      }
    }
  }
  return null;
};

export const getSectionByName = (sectionName) => {
  return sidebarMenu.find((s) => s.section === sectionName);
};

export const getSectionCounts = () => {
  const counts = {};
  sidebarMenu.forEach((section) => {
    let count = 0;
    section.items.forEach((item) => {
      count += 1;
      if (item.children) {
        count += item.children.length;
      }
    });
    counts[section.section] = count;
  });
  return counts;
};

export const getAllMenuPaths = () => {
  return getAllMenuItems()
    .map((item) => item.path)
    .filter(Boolean);
};

export const getMenuForRole = (role) => {
  const ROLE_PERMISSIONS = {
    "Super Admin": "all",
    Doctor: ["Overview", "Clinical"],
    Nurse: ["Overview", "Clinical"],
    Caregiver: ["Overview", "Clinical"],
    Receptionist: ["Overview", "Clinical"],
    "Billing Manager": ["Overview", "Clinical", "Administration"],
    Pharmacist: ["Overview", "Clinical"],
    "Lab Technician": ["Overview", "Clinical"],
    Radiologist: ["Overview", "Clinical"],
    "IT Support": ["Overview", "System"],
    "HR Manager": ["Overview", "Administration"],
    Security: ["Overview"],
    Dietitian: ["Overview", "Clinical"],
  };

  const allowedSections = ROLE_PERMISSIONS[role] || ["Overview"];

  if (allowedSections === "all") return sidebarMenu;

  return sidebarMenu
    .filter((section) => allowedSections.includes(section.section))
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.permissions && role) {
          return item.permissions.includes(role);
        }
        return true;
      }),
    }));
};

export const getDefaultOpenSections = () => {
  return sidebarMenu
    .filter((s) => s.defaultOpen)
    .map((s) => s.section);
};

export const searchMenu = (query) => {
  if (!query) return sidebarMenu;
  const q = query.toLowerCase();

  return sidebarMenu
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const itemMatch =
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q);

        const childMatch = item.children?.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
        );

        return itemMatch || childMatch;
      }),
    }))
    .filter((section) => section.items.length > 0);
};

export default {
  sidebarMenu,
  getAllMenuItems,
  getMenuItemByPath,
  getParentByChildPath,
  getSectionByName,
  getSectionCounts,
  getAllMenuPaths,
  getMenuForRole,
  getDefaultOpenSections,
  searchMenu,
};