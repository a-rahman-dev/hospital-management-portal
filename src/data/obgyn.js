/* ============================================================
   🩺 OBGYN EXAM CATALOG — Standard Procedures Registry
   ─────────────────────────────────────────────
   Rule 3: Foreign data + real medical codes
   Rule 5: Cohesive categorization
   ============================================================ */

export const initialOBGYN = [
  /* ============ GENERAL ============ */
  { id: "EX-001", name: "Skin Examination", code: "SKIN-EX-01", category: "General", description: "Full skin assessment for lesions and abnormalities", duration: "10 min", durationMinutes: 10, cptCode: "99213", billable: true, status: "Active" },
  { id: "EX-002", name: "Annual Well-Woman Exam", code: "WELL-WM-01", category: "General", description: "Comprehensive annual gynecological wellness visit", duration: "40 min", durationMinutes: 40, cptCode: "99395", billable: true, status: "Active" },
  
  /* ============ PELVIC ============ */
  { id: "EX-003", name: "Pelvic Examination", code: "PELV-EX-01", category: "Pelvic", description: "Standard pelvic exam including speculum and bimanual palpation", duration: "20 min", durationMinutes: 20, cptCode: "99213", billable: true, status: "Active" },
  { id: "EX-004", name: "Bimanual Pelvic Exam", code: "BIM-EX-01", category: "Pelvic", description: "Manual palpation of uterus, ovaries, and adnexal structures", duration: "15 min", durationMinutes: 15, cptCode: "99213", billable: true, status: "Active" },

  /* ============ BREAST ============ */
  { id: "EX-005", name: "Breast Examination", code: "BRST-EX-01", category: "Breast", description: "Clinical breast exam for lumps, masses, and skin changes", duration: "15 min", durationMinutes: 15, cptCode: "99213", billable: true, status: "Active" },
  { id: "EX-006", name: "Mammography Screening", code: "MAMM-01", category: "Breast", description: "Digital breast X-ray for cancer screening (bilateral)", duration: "20 min", durationMinutes: 20, cptCode: "77067", billable: true, status: "Active" },
  { id: "EX-007", name: "Breast Ultrasound", code: "BRST-US-01", category: "Breast", description: "Targeted breast ultrasound for palpable mass or dense tissue", duration: "30 min", durationMinutes: 30, cptCode: "76642", billable: true, status: "Active" },

  /* ============ CERVICAL ============ */
  { id: "EX-008", name: "Pap Smear (Liquid-Based)", code: "PAP-SM-01", category: "Cervical", description: "Liquid-based cervical cytology screening (ThinPrep)", duration: "15 min", durationMinutes: 15, cptCode: "88142", billable: true, status: "Active" },
  { id: "EX-009", name: "HPV Co-Testing", code: "HPV-TS-01", category: "Cervical", description: "Human papillomavirus DNA testing with genotype (with Pap)", duration: "15 min", durationMinutes: 15, cptCode: "87624", billable: true, status: "Active" },
  { id: "EX-010", name: "Colposcopy", code: "COLP-01", category: "Cervical", description: "Magnified view of cervix with acetic acid for abnormal Pap follow-up", duration: "25 min", durationMinutes: 25, cptCode: "57452", billable: true, status: "Active" },
  { id: "EX-011", name: "LEEP Procedure", code: "LEEP-01", category: "Cervical", description: "Loop electrosurgical excision for cervical dysplasia", duration: "30 min", durationMinutes: 30, cptCode: "57522", billable: true, status: "Active" },

  /* ============ IMAGING ============ */
  { id: "EX-012", name: "Transvaginal Ultrasound", code: "TVUS-01", category: "Imaging", description: "Internal ultrasound for uterine, ovarian, and adnexal assessment", duration: "30 min", durationMinutes: 30, cptCode: "76830", billable: true, status: "Active" },
  { id: "EX-013", name: "Obstetric Ultrasound (1st Tri)", code: "OBUS-01", category: "Imaging", description: "First-trimester pregnancy ultrasound for viability and dating", duration: "30 min", durationMinutes: 30, cptCode: "76801", billable: true, status: "Active" },
  { id: "EX-014", name: "Obstetric Ultrasound (2nd/3rd Tri)", code: "OBUS-02", category: "Imaging", description: "Anatomy scan and fetal growth assessment", duration: "45 min", durationMinutes: 45, cptCode: "76805", billable: true, status: "Active" },
  { id: "EX-015", name: "Pelvic MRI", code: "MRI-PELV-01", category: "Imaging", description: "Magnetic resonance imaging for complex pelvic pathology", duration: "60 min", durationMinutes: 60, cptCode: "72197", billable: true, status: "Active" },
  { id: "EX-016", name: "Bone Density Scan (DEXA)", code: "BDS-01", category: "Imaging", description: "Dual-energy X-ray absorptiometry for osteoporosis screening", duration: "15 min", durationMinutes: 15, cptCode: "77080", billable: true, status: "Active" },

  /* ============ BIOPSY ============ */
  { id: "EX-017", name: "Endometrial Biopsy", code: "ENDB-01", category: "Biopsy", description: "Tissue sample from uterine lining for pathology", duration: "20 min", durationMinutes: 20, cptCode: "58100", billable: true, status: "Active" },
  { id: "EX-018", name: "Vulvar Biopsy", code: "VULB-01", category: "Biopsy", description: "Punch or excisional biopsy of vulvar lesions", duration: "20 min", durationMinutes: 20, cptCode: "56605", billable: true, status: "Active" },
  { id: "EX-019", name: "Cervical Biopsy", code: "CERVB-01", category: "Biopsy", description: "Directed cervical biopsy during colposcopy", duration: "20 min", durationMinutes: 20, cptCode: "57500", billable: true, status: "Active" },

  /* ============ PROCEDURE ============ */
  { id: "EX-020", name: "Hysteroscopy (Diagnostic)", code: "HYST-01", category: "Procedure", description: "Endoscopic view of uterine cavity for diagnostic evaluation", duration: "30 min", durationMinutes: 30, cptCode: "58555", billable: true, status: "Active" },
  { id: "EX-021", name: "Amniocentesis", code: "AMNI-01", category: "Procedure", description: "Amniotic fluid sampling for genetic testing", duration: "30 min", durationMinutes: 30, cptCode: "59000", billable: true, status: "Active" },
  { id: "EX-022", name: "Cervical Cerclage", code: "CERC-01", category: "Procedure", description: "Cervical stitch placement for high-risk pregnancy (incompetent cervix)", duration: "45 min", durationMinutes: 45, cptCode: "59320", billable: true, status: "Active" },
  { id: "EX-023", name: "IUD Insertion", code: "IUD-IN-01", category: "Procedure", description: "Intrauterine device placement (hormonal or copper)", duration: "15 min", durationMinutes: 15, cptCode: "58300", billable: true, status: "Active" },
  { id: "EX-024", name: "IUD Removal", code: "IUD-RM-01", category: "Procedure", description: "Intrauterine device removal with strings visualization", duration: "10 min", durationMinutes: 10, cptCode: "58301", billable: true, status: "Active" },
  { id: "EX-025", name: "Nexplanon Insertion", code: "NEX-IN-01", category: "Procedure", description: "Subdermal contraceptive implant placement", duration: "15 min", durationMinutes: 15, cptCode: "11981", billable: true, status: "Active" },
  { id: "EX-026", name: "Nexplanon Removal", code: "NEX-RM-01", category: "Procedure", description: "Subdermal contraceptive implant removal", duration: "20 min", durationMinutes: 20, cptCode: "11982", billable: true, status: "Active" },

  /* ============ PREGNANCY ============ */
  { id: "EX-027", name: "Fetal Heart Monitoring (NST)", code: "FHM-01", category: "Pregnancy", description: "Non-stress test for fetal heart rate and reactivity", duration: "30 min", durationMinutes: 30, cptCode: "59025", billable: true, status: "Active" },
  { id: "EX-028", name: "Prenatal Visit", code: "PREN-01", category: "Pregnancy", description: "Routine prenatal checkup with fundal height and FHR", duration: "30 min", durationMinutes: 30, cptCode: "99213", billable: true, status: "Active" },
  { id: "EX-029", name: "Postpartum Exam (6-week)", code: "POST-01", category: "Pregnancy", description: "Post-delivery health assessment at 6 weeks", duration: "30 min", durationMinutes: 30, cptCode: "59430", billable: true, status: "Active" },
  { id: "EX-030", name: "Urine Pregnancy Test", code: "UPT-01", category: "Pregnancy", description: "Rapid urine hCG qualitative test", duration: "5 min", durationMinutes: 5, cptCode: "81025", billable: true, status: "Active" },
  { id: "EX-031", name: "Quantitative Blood hCG", code: "BPT-01", category: "Pregnancy", description: "Quantitative serum beta-hCG test for pregnancy dating", duration: "10 min", durationMinutes: 10, cptCode: "84702", billable: true, status: "Active" },

  /* ============ COUNSELING ============ */
  { id: "EX-032", name: "Contraceptive Counseling", code: "CONT-01", category: "Counseling", description: "Birth control options consultation and selection", duration: "20 min", durationMinutes: 20, cptCode: "99401", billable: true, status: "Active" },
  { id: "EX-033", name: "Infertility Consultation", code: "INFR-01", category: "Counseling", description: "Fertility evaluation and treatment planning", duration: "45 min", durationMinutes: 45, cptCode: "99204", billable: true, status: "Active" },
  { id: "EX-034", name: "Menopause Counseling", code: "MENO-C-01", category: "Counseling", description: "Hormone therapy and symptom management counseling", duration: "30 min", durationMinutes: 30, cptCode: "99401", billable: true, status: "Active" },

  /* ============ ASSESSMENT ============ */
  { id: "EX-035", name: "Menopause Assessment", code: "MENO-01", category: "Assessment", description: "Clinical evaluation of perimenopausal symptoms", duration: "30 min", durationMinutes: 30, cptCode: "99214", billable: true, status: "Active" },
  { id: "EX-036", name: "Infertility Workup", code: "INFW-01", category: "Assessment", description: "Comprehensive fertility evaluation including labs and imaging", duration: "60 min", durationMinutes: 60, cptCode: "99215", billable: true, status: "Active" },

  /* ============ SCREENING ============ */
  { id: "EX-037", name: "STI Screening Panel", code: "STI-SC-01", category: "Screening", description: "Comprehensive STI testing (Chlamydia, Gonorrhea, Syphilis, HIV)", duration: "15 min", durationMinutes: 15, cptCode: "87491", billable: true, status: "Active" },
  { id: "EX-038", name: "Genetic Carrier Screening", code: "GEN-CS-01", category: "Screening", description: "Expanded carrier screening for inherited conditions", duration: "20 min", durationMinutes: 20, cptCode: "81443", billable: true, status: "Active" },

  /* ============ DEPRECATED ============ */
  { id: "EX-039", name: "[DEPRECATED] Traditional Pap", code: "PAP-OLD-01", category: "Cervical", description: "Legacy conventional Pap smear — replaced by liquid-based cytology", duration: "15 min", durationMinutes: 15, cptCode: "88150", billable: false, status: "Inactive" },
  { id: "EX-040", name: "[DEPRECATED] Manual Fetal Doppler", code: "FHR-OLD-01", category: "Pregnancy", description: "Legacy handheld Doppler — replaced by electronic FHR monitoring", duration: "10 min", durationMinutes: 10, cptCode: "76815", billable: false, status: "Inactive" },
];

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

export const getExamsByCategory = (category = "All") => {
  if (category === "All") return initialOBGYN;
  return initialOBGYN.filter((e) => e.category === category);
};

export const getActiveExams = () =>
  initialOBGYN.filter((e) => e.status === "Active");

export const getInactiveExams = () =>
  initialOBGYN.filter((e) => e.status === "Inactive");

export const getBillableExams = () =>
  initialOBGYN.filter((e) => e.billable);

export const getExamById = (id) => initialOBGYN.find((e) => e.id === id);

export const getExamByCode = (code) =>
  initialOBGYN.find((e) => e.code === code);

export const getCategoryCounts = () => {
  const counts = { All: initialOBGYN.length };
  const categories = [...new Set(initialOBGYN.map((e) => e.category))];
  categories.forEach((cat) => {
    counts[cat] = initialOBGYN.filter((e) => e.category === cat).length;
  });
  return counts;
};

export const getAverageDurationByCategory = () => {
  const result = {};
  const categories = [...new Set(initialOBGYN.map((e) => e.category))];
  categories.forEach((cat) => {
    const exams = initialOBGYN.filter((e) => e.category === cat);
    const total = exams.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
    result[cat] = Math.round(total / exams.length);
  });
  return result;
};

export const searchExams = (query) => {
  if (!query) return initialOBGYN;
  const q = query.toLowerCase();
  return initialOBGYN.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
  );
};

export default {
  initialOBGYN,
  getExamsByCategory,
  getActiveExams,
  getInactiveExams,
  getBillableExams,
  getExamById,
  getExamByCode,
  getCategoryCounts,
  getAverageDurationByCategory,
  searchExams,
};