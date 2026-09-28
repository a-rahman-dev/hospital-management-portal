import { Routes, Route, Navigate } from "react-router-dom";

/* ============================================================
   LAYOUT
   ============================================================ */
import { DashboardLayout } from "./components/layout";

/* ============================================================
   PAGES — Dashboard
   ============================================================ */
import Dashboard from "./pages/Dashboard/Dashboard";

/* ============================================================
   PAGES — Clinical / Core
   ============================================================ */
import Patients from "./pages/Patients/Patients";
import PatientAppointments from "./pages/Patients/PatientAppointments";
import PatientBilling from "./pages/Patients/PatientBilling";
import PatientLabReports from "./pages/Patients/PatientLabReports";
import PatientMedications from "./pages/Patients/PatientMedications";

import Providers from "./pages/Providers/Providers";
import Practices from "./pages/Practices/Practices";
import Procedures from "./pages/Procedures/Procedures";
import Insurance from "./pages/Insurance/Insurance";
import ICD from "./pages/ICD/ICD";
import OBGYN from "./pages/OBGYN/OBGYN";
import Facilities from "./pages/Facilities/Facilities";

/* ============================================================
   PAGES — Admin / Settings
   ============================================================ */
import Users from "./pages/Users/Users";
import ModuleManagement from "./pages/ModuleManagement/ModuleManagement";
import PracticeSetting from "./pages/PracticeSetting/PracticeSetting";

/* ============================================================
   PAGES — Public
   ============================================================ */
import Landing from "./pages/Landing/Landing";

/* ============================================================
   APP — ROUTES
   ============================================================ */
export default function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC LANDING ---------- */}
      <Route path="/" element={<Landing />} />

      {/* ---------- PORTAL APPS WITH DASHBOARD LAYOUT ---------- */}
      {/* Notice: pathless layout — Sidebar & Topbar sab modules mein rahenge */}
      <Route element={<DashboardLayout />}>
        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ============ PATIENTS ============ */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/appointments" element={<PatientAppointments />} />
        <Route path="/patients/billing" element={<PatientBilling />} />
        <Route path="/patients/lab-reports" element={<PatientLabReports />} />
        <Route path="/patients/medications" element={<PatientMedications />} />

        {/* Deep links with ID */}
        <Route path="/patients/:id/appointments" element={<PatientAppointments />} />
        <Route path="/patients/:id/billing" element={<PatientBilling />} />
        <Route path="/patients/:id/lab-reports" element={<PatientLabReports />} />
        <Route path="/patients/:id/medications" element={<PatientMedications />} />

        {/* ============ CLINICAL ============ */}
        <Route path="/providers" element={<Providers />} />
        <Route path="/practices" element={<Practices />} />
        <Route path="/procedures" element={<Procedures />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/icd" element={<ICD />} />
        <Route path="/obgyn" element={<OBGYN />} />
        <Route path="/facilities" element={<Facilities />} />

        {/* ============ ADMIN ============ */}
        <Route path="/users" element={<Users />} />
        <Route path="/practice-setting" element={<PracticeSetting />} />

        {/* ============ SYSTEM — Module Management ============ */}
        <Route path="/modules" element={<ModuleManagement />} />
        <Route path="/modules/roles" element={<ModuleManagement />} />
        <Route path="/modules/permissions" element={<ModuleManagement />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}