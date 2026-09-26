/* ============================================================
   🏥 PROCEDURES CATALOG — Surgical & Clinical Procedures
   ─────────────────────────────────────────────
   Rule 3: Foreign data + real CPT codes + realistic charges
   Rule 5: Cohesive categorization
   ============================================================ */

export const initialProcedures = [
  /* ============ SURGICAL ============ */
  { id: "PRC-001", name: "Appendectomy", cptCode: "44950", category: "Surgical", units: 1, charge: 2500, description: "Surgical removal of appendix (open or laparoscopic)", duration: "60 min", durationMinutes: 60, anesthesiaType: "General Endotracheal", status: "Active" },
  { id: "PRC-002", name: "Cholecystectomy", cptCode: "47562", category: "Surgical", units: 1, charge: 4200, description: "Laparoscopic gallbladder removal", duration: "90 min", durationMinutes: 90, anesthesiaType: "General Endotracheal", status: "Active" },
  { id: "PRC-003", name: "Inguinal Hernia Repair", cptCode: "49505", category: "Surgical", units: 1, charge: 3100, description: "Open or laparoscopic inguinal hernia repair with mesh", duration: "75 min", durationMinutes: 75, anesthesiaType: "Regional Nerve Block", status: "Active" },
  { id: "PRC-004", name: "Coronary Artery Bypass Graft (CABG x1)", cptCode: "33533", category: "Surgical", units: 1, charge: 28000, description: "Single arterial bypass graft via sternotomy", duration: "180 min", durationMinutes: 180, anesthesiaType: "General Endotracheal", status: "Active" },
  { id: "PRC-005", name: "Total Hip Arthroplasty", cptCode: "27130", category: "Surgical", units: 1, charge: 12000, description: "Total hip replacement with prosthetic implant", duration: "120 min", durationMinutes: 120, anesthesiaType: "Spinal / Epidural", status: "Active" },

  /* ============ ENDOSCOPY ============ */
  { id: "PRC-006", name: "Diagnostic Colonoscopy", cptCode: "45378", category: "Endoscopy", units: 1, charge: 1800, description: "Colonoscopy with visualization to cecum, no biopsy", duration: "30 min", durationMinutes: 30, anesthesiaType: "MAC / Moderate Sedation", status: "Active" },
  { id: "PRC-007", name: "Colonoscopy with Biopsy", cptCode: "45380", category: "Endoscopy", units: 1, charge: 2200, description: "Colonoscopy with single or multiple biopsies", duration: "45 min", durationMinutes: 45, anesthesiaType: "MAC / Moderate Sedation", status: "Active" },
  { id: "PRC-008", name: "Upper GI Endoscopy with Biopsy", cptCode: "43239", category: "Endoscopy", units: 1, charge: 1500, description: "Esophagogastroduodenoscopy (EGD) with biopsy", duration: "40 min", durationMinutes: 40, anesthesiaType: "MAC / Moderate Sedation", status: "Active" },
  { id: "PRC-009", name: "Diagnostic Bronchoscopy", cptCode: "31622", category: "Endoscopy", units: 1, charge: 2200, description: "Flexible bronchoscopy for airway evaluation", duration: "45 min", durationMinutes: 45, anesthesiaType: "Conscious Sedation", status: "Active" },

  /* ============ CARDIOLOGY ============ */
  { id: "PRC-010", name: "Cardiac Catheterization (Left Heart)", cptCode: "93458", category: "Cardiology", units: 1, charge: 5500, description: "Left heart catheterization with coronary angiography", duration: "60 min", durationMinutes: 60, anesthesiaType: "Local Infiltration", status: "Active" },
  { id: "PRC-011", name: "Pacemaker Insertion (Dual Chamber)", cptCode: "33206", category: "Cardiology", units: 1, charge: 8500, description: "Dual chamber permanent pacemaker placement", duration: "90 min", durationMinutes: 90, anesthesiaType: "MAC / Moderate Sedation", status: "Active" },
  { id: "PRC-012", name: "Percutaneous Coronary Intervention (PCI)", cptCode: "92928", category: "Cardiology", units: 1, charge: 14500, description: "Coronary stent placement via catheter", duration: "90 min", durationMinutes: 90, anesthesiaType: "Local Infiltration", status: "Active" },

  /* ============ OBSTETRIC ============ */
  { id: "PRC-013", name: "Cesarean Delivery (C-Section)", cptCode: "59510", category: "Obstetric", units: 1, charge: 4800, description: "Cesarean section with postpartum care", duration: "65 min", durationMinutes: 65, anesthesiaType: "Spinal / Epidural", status: "Active" },
  { id: "PRC-014", name: "Vaginal Delivery (Routine)", cptCode: "59400", category: "Obstetric", units: 1, charge: 3200, description: "Vaginal delivery with postpartum care", duration: "Variable", durationMinutes: 240, anesthesiaType: "Epidural / None", status: "Active" },
  { id: "PRC-015", name: "Cervical Cerclage", cptCode: "59320", category: "Obstetric", units: 1, charge: 2400, description: "Cervical stitch placement for incompetent cervix", duration: "45 min", durationMinutes: 45, anesthesiaType: "Spinal / Epidural", status: "Active" },

  /* ============ GYNECOLOGIC ============ */
  { id: "PRC-016", name: "Total Abdominal Hysterectomy", cptCode: "58150", category: "Gynecologic", units: 1, charge: 6200, description: "Total abdominal hysterectomy with or without tubes/ovaries", duration: "120 min", durationMinutes: 120, anesthesiaType: "General Endotracheal", status: "Active" },
  { id: "PRC-017", name: "Laparoscopic Hysterectomy", cptCode: "58570", category: "Gynecologic", units: 1, charge: 7800, description: "Total laparoscopic hysterectomy", duration: "135 min", durationMinutes: 135, anesthesiaType: "General Endotracheal", status: "Active" },

  /* ============ OPHTHALMOLOGY ============ */
  { id: "PRC-018", name: "Cataract Surgery (Phaco + IOL)", cptCode: "66984", category: "Ophthalmology", units: 1, charge: 2800, description: "Phacoemulsification with intraocular lens implant", duration: "30 min", durationMinutes: 30, anesthesiaType: "Topical / Local", status: "Active" },
  { id: "PRC-019", name: "Vitrectomy", cptCode: "67036", category: "Ophthalmology", units: 1, charge: 4500, description: "Pars plana vitrectomy for retinal pathology", duration: "90 min", durationMinutes: 90, anesthesiaType: "Local Infiltration", status: "Active" },

  /* ============ ENT ============ */
  { id: "PRC-020", name: "Tonsillectomy", cptCode: "42826", category: "ENT", units: 1, charge: 1900, description: "Tonsil removal with or without adenoidectomy", duration: "45 min", durationMinutes: 45, anesthesiaType: "General Endotracheal", status: "Active" },
  { id: "PRC-021", name: "Functional Endoscopic Sinus Surgery", cptCode: "31255", category: "ENT", units: 1, charge: 4200, description: "FESS for chronic sinusitis", duration: "120 min", durationMinutes: 120, anesthesiaType: "General Endotracheal", status: "Active" },

  /* ============ ORTHOPEDIC ============ */
  { id: "PRC-022", name: "Knee Arthroscopy with Meniscectomy", cptCode: "29881", category: "Orthopedic", units: 1, charge: 3600, description: "Knee arthroscopy with partial meniscectomy", duration: "60 min", durationMinutes: 60, anesthesiaType: "Regional Nerve Block", status: "Active" },
  { id: "PRC-023", name: "Total Knee Arthroplasty (TKA)", cptCode: "27447", category: "Orthopedic", units: 1, charge: 11000, description: "Total knee replacement with prosthetic implant", duration: "115 min", durationMinutes: 115, anesthesiaType: "Spinal / Epidural", status: "Active" },
  { id: "PRC-024", name: "Lumbar Spinal Fusion", cptCode: "22612", category: "Orthopedic", units: 1, charge: 15000, description: "Posterior lumbar interbody fusion (PLIF)", duration: "180 min", durationMinutes: 180, anesthesiaType: "General Endotracheal", status: "Active" },
  { id: "PRC-025", name: "Carpal Tunnel Release", cptCode: "64721", category: "Orthopedic", units: 1, charge: 1700, description: "Open carpal tunnel decompression", duration: "25 min", durationMinutes: 25, anesthesiaType: "Local Infiltration", status: "Active" },

  /* ============ DERMATOLOGY ============ */
  { id: "PRC-026", name: "Punch Skin Biopsy", cptCode: "11104", category: "Dermatology", units: 1, charge: 250, description: "Full thickness punch biopsy of skin (4mm)", duration: "25 min", durationMinutes: 25, anesthesiaType: "Local Infiltration", status: "Active" },
  { id: "PRC-027", name: "Excision of Malignant Lesion", cptCode: "11602", category: "Dermatology", units: 1, charge: 850, description: "Excision of malignant skin lesion with margins", duration: "45 min", durationMinutes: 45, anesthesiaType: "Local Infiltration", status: "Active" },

  /* ============ GENERAL ============ */
  { id: "PRC-028", name: "Simple Wound Repair (Suturing)", cptCode: "12001", category: "General", units: 1, charge: 180, description: "Simple wound repair, superficial", duration: "15 min", durationMinutes: 15, anesthesiaType: "Local Infiltration", status: "Active" },
  { id: "PRC-029", name: "Incision & Drainage (Abscess)", cptCode: "10060", category: "General", units: 1, charge: 320, description: "Incision and drainage of skin abscess", duration: "20 min", durationMinutes: 20, anesthesiaType: "Local Infiltration", status: "Active" },

  /* ============ DIAGNOSTIC ============ */
  { id: "PRC-030", name: "12-Lead Electrocardiogram (ECG)", cptCode: "93000", category: "Diagnostic", units: 1, charge: 120, description: "Routine 12-lead ECG with interpretation", duration: "10 min", durationMinutes: 10, anesthesiaType: "None", status: "Active" },
  { id: "PRC-031", name: "Complete Echocardiography", cptCode: "93306", category: "Diagnostic", units: 1, charge: 850, description: "Complete 2D echocardiogram with Doppler", duration: "45 min", durationMinutes: 45, anesthesiaType: "None", status: "Active" },
  { id: "PRC-032", name: "Holter Monitor (48-hr)", cptCode: "93248", category: "Diagnostic", units: 1, charge: 420, description: "48-hour continuous cardiac rhythm monitoring", duration: "Variable", durationMinutes: 2880, anesthesiaType: "None", status: "Active" },

  /* ============ RADIOLOGY ============ */
  { id: "PRC-033", name: "CT Head Without Contrast", cptCode: "70450", category: "Radiology", units: 1, charge: 950, description: "Non-contrast CT of the head/brain", duration: "15 min", durationMinutes: 15, anesthesiaType: "None", status: "Active" },
  { id: "PRC-034", name: "MRI Brain Without Contrast", cptCode: "70551", category: "Radiology", units: 1, charge: 1400, description: "Non-contrast MRI of the brain", duration: "45 min", durationMinutes: 45, anesthesiaType: "None", status: "Active" },
  { id: "PRC-035", name: "Chest X-Ray (2 Views)", cptCode: "71046", category: "Radiology", units: 1, charge: 180, description: "Chest X-ray, PA and lateral views", duration: "10 min", durationMinutes: 10, anesthesiaType: "None", status: "Active" },
  { id: "PRC-036", name: "Abdominal Ultrasound", cptCode: "76700", category: "Radiology", units: 1, charge: 480, description: "Complete abdominal ultrasound (liver, gallbladder, kidneys)", duration: "30 min", durationMinutes: 30, anesthesiaType: "None", status: "Active" },

  /* ============ DEPRECATED ============ */
  { id: "PRC-037", name: "[DEPRECATED] Open Cholecystectomy", cptCode: "47600", category: "Surgical", units: 1, charge: 5800, description: "Legacy open gallbladder removal — replaced by laparoscopic approach", duration: "120 min", durationMinutes: 120, anesthesiaType: "General Endotracheal", status: "Inactive" },
  { id: "PRC-038", name: "[DEPRECATED] Traditional Pap Smear", cptCode: "88150", category: "Gynecologic", units: 1, charge: 90, description: "Legacy conventional Pap — replaced by liquid-based cytology", duration: "15 min", durationMinutes: 15, anesthesiaType: "None", status: "Inactive" },
];

/* ============================================================
   🎯 HELPERS
   ============================================================ */

export const getProceduresByCategory = (category = "All") => {
  if (category === "All") return initialProcedures;
  return initialProcedures.filter((p) => p.category === category);
};

export const getActiveProcedures = () =>
  initialProcedures.filter((p) => p.status === "Active");

export const getInactiveProcedures = () =>
  initialProcedures.filter((p) => p.status === "Inactive");

export const getProcedureById = (id) =>
  initialProcedures.find((p) => p.id === id);

export const getProcedureByCpt = (cptCode) =>
  initialProcedures.find((p) => p.cptCode === cptCode);

export const getCategoryCounts = () => {
  const counts = { All: initialProcedures.length };
  const categories = [...new Set(initialProcedures.map((p) => p.category))];
  categories.forEach((cat) => {
    counts[cat] = initialProcedures.filter((p) => p.category === cat).length;
  });
  return counts;
};

export const getAverageChargeByCategory = () => {
  const result = {};
  const categories = [...new Set(initialProcedures.map((p) => p.category))];
  categories.forEach((cat) => {
    const procs = initialProcedures.filter((p) => p.category === cat);
    const total = procs.reduce((sum, p) => sum + (p.charge || 0), 0);
    result[cat] = Math.round(total / procs.length);
  });
  return result;
};

export const searchProcedures = (query) => {
  if (!query) return initialProcedures;
  const q = query.toLowerCase();
  return initialProcedures.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.cptCode.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};

export default {
  initialProcedures,
  getProceduresByCategory,
  getActiveProcedures,
  getInactiveProcedures,
  getProcedureById,
  getProcedureByCpt,
  getCategoryCounts,
  getAverageChargeByCategory,
  searchProcedures,
};