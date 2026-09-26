/* ============================================================
   🎨 LANDING PAGE DATA (Rule 5)
   ─────────────────────────────────────────────
   Central data for the landing page.
   
   Note: Icon and color names are strings — components map them.
   Adding path + gradient + glow for direct use.
   ============================================================ */

/* ============================================================
   🎯 COLOR PALETTE MAP
   ─────────────────────────────────────────────
   Maps color names to hex, gradient, glow, and Tailwind classes.
   ============================================================ */
export const colorPalette = {
  cyan: {
    hex: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glow: "rgba(6, 182, 212, 0.35)",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  emerald: {
    hex: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.35)",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  violet: {
    hex: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.35)",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  rose: {
    hex: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  amber: {
    hex: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  blue: {
    hex: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glow: "rgba(59, 130, 246, 0.35)",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

/* ============================================================
   🎯 HERO STATS (Rule 3 — with path + trend)
   ============================================================ */
export const heroStats = [
  {
    id: "patients",
    label: "Active Patients",
    value: 1248,
    suffix: "+",
    icon: "users",
    color: "cyan",
    trend: "+12%",
    path: "/patients",
  },
  {
    id: "doctors",
    label: "Expert Doctors",
    value: 42,
    suffix: "",
    icon: "stethoscope",
    color: "emerald",
    trend: "+3%",
    path: "/providers",
  },
  {
    id: "facilities",
    label: "Facilities",
    value: 15,
    suffix: "",
    icon: "hospital",
    color: "violet",
    trend: "+2",
    path: "/facilities",
  },
  {
    id: "emergency",
    label: "Emergency",
    value: 24,
    suffix: "/7",
    icon: "ambulance",
    color: "amber",
    trend: "Online",
    path: "/dashboard",
  },
];

/* ============================================================
   🎯 FEATURES (Rule 3 — with path)
   ============================================================ */
export const features = [
  {
    id: "patients",
    title: "Patient Management",
    description:
      "Complete patient profiles, medical history, and care coordination in one place.",
    icon: "users",
    color: "cyan",
    path: "/patients",
  },
  {
    id: "appointments",
    title: "Smart Scheduling",
    description:
      "AI-powered appointment booking with real-time availability and reminders.",
    icon: "calendar",
    color: "emerald",
    path: "/patients/appointments",
  },
  {
    id: "labs",
    title: "Lab Diagnostics",
    description:
      "Instant lab reports with critical value alerts and trend analysis.",
    icon: "flask",
    color: "rose",
    path: "/patients/lab-reports",
  },
  {
    id: "medications",
    title: "Medication Tracking",
    description:
      "Prescription management with drug interaction warnings and refill alerts.",
    icon: "pill",
    color: "amber",
    path: "/patients/medications",
  },
  {
    id: "billing",
    title: "Revenue Cycle",
    description:
      "Insurance claims, billing, and payment tracking with automated workflows.",
    icon: "dollar",
    color: "violet",
    path: "/patients/billing",
  },
  {
    id: "analytics",
    title: "AI Analytics",
    description:
      "Predictive insights, patient trends, and operational intelligence.",
    icon: "sparkles",
    color: "cyan",
    path: "/dashboard",
  },
];

/* ============================================================
   🎯 MODULES (Rule 3 — with path + description)
   ============================================================ */
export const modules = [
  {
    id: 1,
    name: "Patient Directory",
    description: "Complete patient management",
    icon: "users",
    count: 1248,
    color: "cyan",
    path: "/patients",
  },
  {
    id: 2,
    name: "Appointments",
    description: "Smart scheduling system",
    icon: "calendar",
    count: 318,
    color: "emerald",
    path: "/patients/appointments",
  },
  {
    id: 3,
    name: "Medications",
    description: "Prescription tracking",
    icon: "pill",
    count: 892,
    color: "violet",
    path: "/patients/medications",
  },
  {
    id: 4,
    name: "Lab Reports",
    description: "Diagnostic results",
    icon: "flask",
    count: 425,
    color: "rose",
    path: "/patients/lab-reports",
  },
  {
    id: 5,
    name: "Billing",
    description: "Revenue cycle mgmt",
    icon: "dollar",
    count: 124,
    color: "amber",
    path: "/patients/billing",
  },
  {
    id: 6,
    name: "ICD Codes",
    description: "Diagnostic coding",
    icon: "stethoscope",
    count: 14500,
    color: "cyan",
    path: "/icd",
  },
  {
    id: 7,
    name: "OBGYN",
    description: "Women's health registry",
    icon: "baby",
    count: 68,
    color: "rose",
    path: "/obgyn",
  },
  {
    id: 8,
    name: "Procedures",
    description: "CPT procedures registry",
    icon: "scissors",
    count: 210,
    color: "amber",
    path: "/procedures",
  },
  {
    id: 9,
    name: "Facilities",
    description: "Hospital branches",
    icon: "hospital",
    count: 15,
    color: "emerald",
    path: "/facilities",
  },
  {
    id: 10,
    name: "Providers",
    description: "Doctors & specialists",
    icon: "userCog",
    count: 42,
    color: "violet",
    path: "/providers",
  },
  {
    id: 11,
    name: "Insurance",
    description: "Payer management",
    icon: "shield",
    count: 20,
    color: "cyan",
    path: "/insurance",
  },
  {
    id: 12,
    name: "Module Management",
    description: "System configuration",
    icon: "settings",
    count: 15,
    color: "amber",
    path: "/modules",
  },
];

/* ============================================================
   🎯 TRUST BADGES
   ============================================================ */
export const trustBadges = [
  { id: "hipaa", label: "HIPAA Compliant", icon: "shield" },
  { id: "jci", label: "JCI Accredited", icon: "award" },
  { id: "iso", label: "ISO 9001", icon: "checkCircle" },
  { id: "nabh", label: "NABH Certified", icon: "badgeCheck" },
];

/* ============================================================
   🎯 NETWORK NODES (for NeuralNetwork visualization)
   ─────────────────────────────────────────────
   Icon names mapped to available lucide icons
   ============================================================ */
export const networkNodes = [
  { id: 1, x: 10, y: 20, label: "Cardiology", icon: "heart" },
  { id: 2, x: 25, y: 15, label: "Neurology", icon: "brain" },
  { id: 3, x: 40, y: 25, label: "Oncology", icon: "ribbon" },
  { id: 4, x: 55, y: 18, label: "Pediatrics", icon: "baby" },
  { id: 5, x: 70, y: 22, label: "Orthopedics", icon: "bone" },
  { id: 6, x: 85, y: 15, label: "Radiology", icon: "scan" },
  { id: 7, x: 15, y: 50, label: "Pathology", icon: "flaskConical" },
  { id: 8, x: 30, y: 55, label: "Emergency", icon: "ambulance" },
  { id: 9, x: 50, y: 50, label: "AY INT.", icon: "logo" },
  { id: 10, x: 70, y: 52, label: "Surgery", icon: "scissors" },
  { id: 11, x: 85, y: 48, label: "Pharmacy", icon: "pill" },
  { id: 12, x: 20, y: 80, label: "OBGYN", icon: "baby" },
  { id: 13, x: 40, y: 78, label: "Dermatology", icon: "sun" },
  { id: 14, x: 60, y: 82, label: "Pulmonology", icon: "lungs" },
  { id: 15, x: 80, y: 80, label: "Nephrology", icon: "droplet" },
];

export const networkConnections = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [1, 7], [2, 8], [3, 9], [4, 9], [5, 10], [6, 11],
  [7, 12], [8, 9], [9, 10], [9, 14], [10, 15], [11, 15],
  [7, 13], [12, 13], [13, 14], [14, 15], [8, 14], [1, 9],
];

/* ============================================================
   🎯 TESTIMONIALS (Rule 3 — new section)
   ============================================================ */
export const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    role: "Chief Medical Officer",
    facility: "Boston Medical Center",
    avatar: "SM",
    avatarColor: "cyan",
    quote:
      "AY International Hospital transformed how we manage patient care. The AI analytics help us identify critical cases before they escalate.",
    rating: 5,
  },
  {
    id: 2,
    name: "Dr. James Chen",
    role: "Head of Cardiology",
    facility: "Johns Hopkins Hospital",
    avatar: "JC",
    avatarColor: "emerald",
    quote:
      "The integrated workflow saves our team 15+ hours a week. Documentation, billing, and coordination are finally in one place.",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    role: "Director of Operations",
    facility: "Mayo Clinic",
    avatar: "ER",
    avatarColor: "violet",
    quote:
      "Revenue cycle management is now fully automated. Our claim denial rate dropped from 12% to 3% in just 6 months.",
    rating: 5,
  },
];

/* ============================================================
   🎯 FAQS (Rule 3 — new section)
   ============================================================ */
export const faqs = [
  {
    id: 1,
    question: "Is the platform HIPAA compliant?",
    answer:
      "Yes. AY International Hospital is fully HIPAA compliant with end-to-end encryption, audit logging, and role-based access controls.",
  },
  {
    id: 2,
    question: "How long does onboarding take?",
    answer:
      "Most facilities are fully operational within 2-3 weeks. Our team handles data migration, training, and custom configuration.",
  },
  {
    id: 3,
    question: "Can it integrate with existing EHR systems?",
    answer:
      "Yes. We support HL7 FHIR, custom APIs, and direct integrations with major EHR platforms including Epic, Cerner, and Allscripts.",
  },
  {
    id: 4,
    question: "What kind of support do you provide?",
    answer:
      "24/7 dedicated support with a guaranteed 15-minute response time for critical issues. Each facility gets a dedicated account manager.",
  },
];

/* ============================================================
   🎯 CTA CONFIG
   ============================================================ */
export const ctaConfig = {
  badge: "Ready to Transform",
  heading: "Experience the Future of Hospital Management",
  subheading:
    "Join 500+ healthcare providers already using AY International Hospital's intelligent platform to streamline operations and deliver exceptional patient care.",
  primaryCTA: {
    label: "Enter Portal Now",
    path: "/dashboard",
  },
  secondaryCTA: {
    label: "Contact Sales",
    href: "https://ayint-hospital.com",
  },
  benefits: [
    { id: 1, label: "Save 40% Time", icon: "clock", color: "cyan" },
    { id: 2, label: "10,000+ Patients", icon: "users", color: "emerald" },
    { id: 3, label: "Boost Revenue 25%", icon: "trendingUp", color: "violet" },
    { id: 4, label: "HIPAA Compliant", icon: "shield", color: "amber" },
  ],
};

/* ============================================================
   🎯 HELPER FUNCTIONS
   ============================================================ */

/**
 * Get color palette for a given color name
 */
export const getColorPalette = (colorName) => {
  return colorPalette[colorName] || colorPalette.cyan;
};

/**
 * Get stat by ID
 */
export const getHeroStatById = (id) => {
  return heroStats.find((stat) => stat.id === id);
};

/**
 * Get feature by ID
 */
export const getFeatureById = (id) => {
  return features.find((feature) => feature.id === id);
};

/**
 * Get module by ID
 */
export const getModuleById = (id) => {
  return modules.find((module) => module.id === id);
};

/**
 * Get all modules (sorted)
 */
export const getAllModules = () => {
  return [...modules].sort((a, b) => a.id - b.id);
};

/**
 * Get top N modules by count
 */
export const getTopModules = (limit = 4) => {
  return [...modules].sort((a, b) => b.count - a.count).slice(0, limit);
};

/**
 * Get testimonials (all)
 */
export const getTestimonials = () => testimonials;

/**
 * Get FAQs (all)
 */
export const getFAQs = () => faqs;

/**
 * Get trust badges
 */
export const getTrustBadges = () => trustBadges;

/**
 * Get all landing page data (grouped)
 */
export const getLandingData = () => ({
  heroStats,
  features,
  modules,
  trustBadges,
  testimonials,
  faqs,
  ctaConfig,
  networkNodes,
  networkConnections,
});

/* ============================================================
   🎯 DEFAULT EXPORT
   ============================================================ */
export default {
  heroStats,
  features,
  modules,
  trustBadges,
  testimonials,
  faqs,
  ctaConfig,
  networkNodes,
  networkConnections,
  colorPalette,
  getColorPalette,
  getHeroStatById,
  getFeatureById,
  getModuleById,
  getAllModules,
  getTopModules,
  getTestimonials,
  getFAQs,
  getTrustBadges,
  getLandingData,
};