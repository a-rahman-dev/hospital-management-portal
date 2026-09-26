/* ============================================================
   📊 TRENDS DATA — Patient Trends + Appointment Breakdown
   ─────────────────────────────────────────────
   Used by:
   - PatientTrendsChart.jsx (patientTrends)
   - AppointmentPieChart.jsx (appointmentData)
   
   Foreign data + real-looking numbers (Rule 3)
   Color palette consistent with dashboard sections (Rule 5)
   ============================================================ */

/* ============================================================
   📈 PATIENT TRENDS — Monthly overview
   ─────────────────────────────────────────────
   Blue (#3B82F6)   → Patients
   Violet (#A855F7) → Appointments
   ============================================================ */
export const patientTrends = [
  { id: "trend-jan", month: "Jan", fullMonth: "January", year: 2026, patients: 180, appointments: 120, revenue: 28400 },
  { id: "trend-feb", month: "Feb", fullMonth: "February", year: 2026, patients: 220, appointments: 145, revenue: 31200 },
  { id: "trend-mar", month: "Mar", fullMonth: "March", year: 2026, patients: 195, appointments: 160, revenue: 29800 },
  { id: "trend-apr", month: "Apr", fullMonth: "April", year: 2026, patients: 260, appointments: 190, revenue: 35600 },
  { id: "trend-may", month: "May", fullMonth: "May", year: 2026, patients: 290, appointments: 220, revenue: 38900 },
  { id: "trend-jun", month: "Jun", fullMonth: "June", year: 2026, patients: 340, appointments: 250, revenue: 42300 },
  { id: "trend-jul", month: "Jul", fullMonth: "July", year: 2026, patients: 380, appointments: 280, revenue: 45200 },
  { id: "trend-aug", month: "Aug", fullMonth: "August", year: 2026, patients: 420, appointments: 310, revenue: 48900 },
  { id: "trend-sep", month: "Sep", fullMonth: "September", year: 2026, patients: 390, appointments: 295, revenue: 47600 },
];

/* ============================================================
   🥧 APPOINTMENT DATA — Department breakdown
   ─────────────────────────────────────────────
   Colors match dashboard palette:
   - Blue     #3B82F6 — General
   - Violet   #8B5CF6 — Cardiology
   - Emerald  #10B981 — Pediatrics
   - Amber    #F59E0B — Orthopedics
   - Rose     #F43F5E — Dermatology
   ============================================================ */
export const appointmentData = [
  { id: "dept-general", name: "General", value: 45, color: "#3B82F6", trend: "up" },
  { id: "dept-cardiology", name: "Cardiology", value: 28, color: "#8B5CF6", trend: "up" },
  { id: "dept-pediatrics", name: "Pediatrics", value: 35, color: "#10B981", trend: "up" },
  { id: "dept-orthopedics", name: "Orthopedics", value: 22, color: "#F59E0B", trend: "down" },
  { id: "dept-dermatology", name: "Dermatology", value: 18, color: "#F43F5E", trend: "down" },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

/**
 * Get monthly trends for a specific period
 * @param {string} period - "Last 3 months" | "Last 6 months" | "All time"
 */
export const getMonthlyTrends = (period = "Last 6 months") => {
  if (period === "Last 3 months") return patientTrends.slice(-3);
  if (period === "All time") return patientTrends;
  return patientTrends.slice(-6); // Last 6 months
};

/**
 * Get total counts across all months
 */
export const getTrendsSummary = () => {
  const totalPatients = patientTrends.reduce((s, d) => s + d.patients, 0);
  const totalAppointments = patientTrends.reduce((s, d) => s + d.appointments, 0);
  const totalRevenue = patientTrends.reduce((s, d) => s + d.revenue, 0);
  const avgPatients = Math.round(totalPatients / patientTrends.length);
  const avgAppointments = Math.round(totalAppointments / patientTrends.length);

  return {
    totalPatients,
    totalAppointments,
    totalRevenue,
    avgPatients,
    avgAppointments,
    monthsCovered: patientTrends.length,
  };
};

/**
 * Get growth percentage between first and last month
 */
export const getGrowthPercentage = () => {
  if (patientTrends.length < 2) return 0;
  const first = patientTrends[0].patients;
  const last = patientTrends[patientTrends.length - 1].patients;
  return first === 0 ? 0 : (((last - first) / first) * 100).toFixed(1);
};

/**
 * Get top departments by value
 * @param {number} limit - Number of departments to return
 */
export const getTopDepartments = (limit = 5) =>
  [...appointmentData].sort((a, b) => b.value - a.value).slice(0, limit);

/**
 * Get total appointments across all departments
 */
export const getTotalDepartmentAppointments = () =>
  appointmentData.reduce((s, d) => s + d.value, 0);

/**
 * Get department by ID
 */
export const getDepartmentById = (id) =>
  appointmentData.find((d) => d.id === id);

/**
 * Get department breakdown with percentages
 */
export const getDepartmentBreakdown = () => {
  const total = getTotalDepartmentAppointments();
  return appointmentData.map((d) => ({
    ...d,
    percentage: total > 0 ? ((d.value / total) * 100).toFixed(1) : "0.0",
  }));
};

/* ============================================================
   📊 DEFAULT EXPORT — grouped object
   ============================================================ */
export default {
  patientTrends,
  appointmentData,
  getMonthlyTrends,
  getTrendsSummary,
  getGrowthPercentage,
  getTopDepartments,
  getTotalDepartmentAppointments,
  getDepartmentById,
  getDepartmentBreakdown,
};