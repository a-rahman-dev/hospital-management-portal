/* ============================================================
   🏥 PRACTICE SETTING DATA — Institutional Configuration
   ─────────────────────────────────────────────
   Rule 3: Real-looking medical institution data
   Rule 5: Grouped by domain (Legal, Contact, Billing, Provider, Locale)
   ============================================================ */

export const practiceSettingData = {
  /* ============================================================
     🏛️ SECTION 1: LEGAL IDENTITY
     ============================================================ */
  legal: {
    clinicName: "AY INT. Hospital & Medical Center",
    legalName: "AY International Health Services LLC",
    clinicType: "Multi-Specialty Hospital",
    establishedYear: "2015",
    bedCapacity: "250",
    emergencyServices: "24/7",
    accreditation: "JCI Accredited",
    npi: "1234567890",
    npiType: "Type 2 - Organization",
    groupNPI: "1122334455",
    billingNPI: "5566778899",
    taxId: "12-3456789",
    taxType: "S-Corporation",
    taxFilingStatus: "Quarterly",
    dea: "AB1234563",
    deaExpiry: "2027-08-15",
    license: "MD-2026-45821",
    licenseState: "Massachusetts",
    licenseExpiry: "2027-12-31",
    taxonomyCode: "282N00000X",
    taxonomyDescription: "General Acute Care Hospital",
  },

  /* ============================================================
     📍 SECTION 2: CONTACT & ADDRESS
     ============================================================ */
  contact: {
    phone: "+1 (555) 100-2000",
    secondaryPhone: "+1 (555) 100-2005",
    emergencyPhone: "+1 (555) 911-0000",
    fax: "+1 (555) 100-2001",
    email: "contact@ayint-hospital.com",
    billingEmail: "billing@ayint-hospital.com",
    hipaaOfficerEmail: "compliance@ayint-hospital.com",
    website: "https://ayint-hospital.com",
    whatsapp: "+1 (555) 100-2010",
    address: "450 Medical Center Drive, Suite 500",
    addressLine2: "Building A - Executive Wing",
    city: "Boston",
    state: "Massachusetts",
    stateCode: "MA",
    zipCode: "02115",
    country: "United States",
    operatingHours: "Mon-Sat: 8:00 AM - 9:00 PM",
  },

  /* ============================================================
     👨‍⚕️ SECTION 3: PROVIDER DETAILS
     ============================================================ */
  provider: {
    primaryProvider: "Dr. A. Rahman",
    providerTitle: "MD, FACP",
    specialty: "Internal Medicine",
    secondarySpecialty: "Cardiology",
    providerNPI: "9876543210",
    providerDEA: "FR9876543",
    providerDEAExpiry: "2027-08-15",
    providerLicense: "MA-MD-45821",
    providerLicenseExpiry: "2027-12-31",
    boardCertification: "American Board of Internal Medicine",
    yearsOfExperience: "18",
    medicalSchool: "Harvard Medical School",
    languagesSpoken: "English, Urdu, Hindi",
    acceptingNewPatients: "Yes",
    telehealthAvailable: "Yes",
  },

  /* ============================================================
     💳 SECTION 4: BILLING & TAX
     ============================================================ */
  billing: {
    billingAddress: "450 Medical Center Drive, Suite 501",
    billingCity: "Boston",
    billingState: "Massachusetts",
    billingStateCode: "MA",
    billingZip: "02115",
    paymentTerms: "Net 30",
    acceptedInsurances: "Blue Cross, Aetna, Medicare, Cigna, United",
    clearinghouse: "Availity",
    ediPayerId: "AYINT001",
    clearinghouseEdiId: "CLG-88902",
  },

  /* ============================================================
     🌍 SECTION 5: TIMEZONE & LOCALE
     ============================================================ */
  locale: {
    timezone: "America/New_York",
    timezoneDisplay: "Eastern Time (US & Canada) [UTC-05:00]",
    currency: "USD",
    language: "English (US)",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
    defaultSlotDuration: "30",
  },

  /* ============================================================
     🔒 SECTION 6: OPERATIONAL POLICIES (Toggles)
     ============================================================ */
  policies: {
    autoAppointmentReminders: true,
    telehealthIntegration: true,
    twoFactorEnforcement: true,
    hipaaAuditLogging: true,
  },
};

/* ============================================================
   🎯 HELPERS — Easy access for components
   ============================================================ */

export const getLegalSection = () => practiceSettingData.legal;
export const getContactSection = () => practiceSettingData.contact;
export const getProviderSection = () => practiceSettingData.provider;
export const getBillingSection = () => practiceSettingData.billing;
export const getLocaleSection = () => practiceSettingData.locale;
export const getPoliciesSection = () => practiceSettingData.policies;

/**
 * Flatten config for simple form consumption
 * Returns flat object with all fields merged
 */
export const getFlattenedConfig = () => ({
  ...practiceSettingData.legal,
  ...practiceSettingData.contact,
  ...practiceSettingData.provider,
  ...practiceSettingData.billing,
  ...practiceSettingData.locale,
  ...practiceSettingData.policies,
});

/**
 * Get institution summary for display headers
 */
export const getInstitutionSummary = () => ({
  name: practiceSettingData.legal.clinicName,
  type: practiceSettingData.legal.clinicType,
  location: `${practiceSettingData.contact.city}, ${practiceSettingData.contact.stateCode}`,
  accreditation: practiceSettingData.legal.accreditation,
  provider: practiceSettingData.provider.primaryProvider,
  specialty: practiceSettingData.provider.specialty,
});

export default practiceSettingData;